const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: '@wordpress/jest-preset-default',
  transform: {
    ...tsJestTransformCfg,
  },
};