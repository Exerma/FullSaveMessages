/**
 *----------------------------------------------------------------------------
 * (c) Patrick Seuret, 2023
 * ----------------------------------------------------------------------------
 * webpack.config.js
 * ----------------------------------------------------------------------------
 * This is the declaration for webpack package builder
 * Source: https://webpack.js.org/
 * 
 * Information about debug mode:
 * https://stackoverflow.com/questions/37208950/what-are-the-differences-between-webpack-development-and-production-build-modes
 *
 * Versions:
 *   2023-09-04: First version
 *
 */

const defaultMode = "none";

const path = require("path");
const outputPath = path.resolve(__dirname, "./dist/release/");

const defaultRules = [
    {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
    }
];

const defaultExtensions = [".tsx", ".ts", ".js"];

var webpack = require('webpack');

var webpackConfig =
//module.exports = [
    {
        name: 'webextension',
        mode: defaultMode,
        entry: {
            welcome_archives: './src/pages/welcome_archives.ts',
            pdf_template: './src/pages/pdf_template.ts',
            background:   './src/background/background.ts',
            action_popup: './src/action/action_popup.ts',
        },
        module: {
            rules: defaultRules,
        },
        resolve: {
            extensions: defaultExtensions,
        },
        output: {
            path: outputPath,
        },
    }
//]


// -d shortcut analogue
if (process.env.NODE_ENV === 'development') {
  webpackConfig.debug = true;
  webpackConfig.devtool = 'sourcemap';
  webpackConfig.output.pathinfo = true;
}

// -p shortcut analogue
if (process.env.NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }));
}

module.exports = webpackConfig;
