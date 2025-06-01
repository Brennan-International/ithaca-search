// .storybook/main.js
const path = require('path');
const fs = require('fs');
const wpDefault = require('@wordpress/scripts/config/webpack.config');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

module.exports = {
  framework: { name: '@storybook/react-webpack5', options: {} },
  stories: ['../src/blocks/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    // …any other Storybook addons
  ],

  webpackFinal: async (config) => {
    //
    // ─── 1) Re‐use Gutenberg’s Babel Preset for JSX/ESNext ─────────────
    //
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [require.resolve('@wordpress/babel-preset-default')],
        },
      },
    });

    //
    // ─── 2) Alias every `@wordpress/<pkg>` → `node_modules/@wordpress/<pkg>` ───
    //
    // This makes sure `import { registerStore } from '@wordpress/data'` actually
    // resolves to your local copy, rather than searching for a global `wp.data`.
    //
    const wpRoot = path.resolve(__dirname, '../node_modules/@wordpress');
    if (fs.existsSync(wpRoot)) {
      fs.readdirSync(wpRoot).forEach((pkgName) => {
        const fullPath = path.join(wpRoot, pkgName);
        if (fs.lstatSync(fullPath).isDirectory()) {
          config.resolve.alias[`@wordpress/${pkgName}`] = fullPath;
        }
      });
    }

    //
    // Also merge in any aliases that `@wordpress/scripts`’ default Webpack config provides:
    //
    config.resolve.alias = {
      ...config.resolve.alias,
      ...wpDefault.resolve?.alias,
    };

    //
    // ─── 3) Tell Webpack “Don’t bundle `@wordpress/*` imports—treat them as externals” ───
    //
    // The DependencyExtractionWebpackPlugin will automatically inject
    // `<script src="wp-blocks.js"></script>`, `<script src="wp-element.js"></script>`, etc.
    // using WordPress’s official CDN rules (or whatever your plugin/theme enqueues in PHP),
    // so Storybook/Webpack must not try to bundle them itself.
    //
    const externals = config.externals || [];
    // If externals is an array, just append; if it’s a function or object, wrap it in an array.
    config.externals = Array.isArray(externals) ? externals : [externals];

    // Now explicitly mark every “@wordpress/<pkg>” as external. That makes Webpack say:
    // `require('@wordpress/data') → window.wp.data`.
    // (Internally, DependencyExtractionWebpackPlugin will write a small <script> tag to pull in "wp-data" from WordPress.)
    //
    config.externals.push(
      (ctx, request, callback) => {
        if (request.startsWith('@wordpress/')) {
          // Give back something like `window.wp.data` for `@wordpress/data`
          const pkgName = request.replace('@wordpress/', '');
          return callback(null, `wp['${pkgName}']`);
        }
        callback();
      }
    );

    //
    // ─── 4) SCSS Loader (if you need Gutenberg CSS) ─────────────────────
    //
    config.module.rules.push({
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sassOptions: {
              includePaths: ['node_modules'], // so “@import '@wordpress/components/build-style/style.css'” works
            },
          },
        },
      ],
    });

    //
    // ─── 5) Install DependencyExtractionWebpackPlugin under config.plugins ───
    //
    // Note: It must go into `config.plugins`, not `config.module.plugins`,
    // because `config.module.plugins` is never defined by Storybook by default.
    //
    config.plugins = [
      ...(config.plugins || []),
      new DependencyExtractionWebpackPlugin({
        injectPolyfill: true,
      }),
    ];

    return config;
  },
};
