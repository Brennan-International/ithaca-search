/**
 * External Dependencies
 */
const path = require('path');
const glob = require('glob');

/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
/**
 * Extend the default wordpress scripts webpack config and add ./src/frontend.js to be compiled using
 * all the frontend.js files located in each block folder.
 */

module.exports = {
    ...defaultConfig,
    entry: {
        ...defaultConfig.entry,
        blocks: path.resolve(process.cwd(), 'src', 'index.ts'),
        blocksFrontend: path.resolve(process.cwd(), 'src', 'frontend.ts')
    },
    plugins: [
        new DependencyExtractionWebpackPlugin({ injectPolyfill: true })
    ]
};