/**
 *----------------------------------------------------------------------------
 * (c) Patrick Seuret, 2023
 * ----------------------------------------------------------------------------
 * webpack.config.js
 * ----------------------------------------------------------------------------
 * This is the declaration for webpack package builder
 * Source: https://webpack.js.org/
 * 
 * 
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

module.exports = [
    {
        name: 'webextension',
        mode: defaultMode,
        entry: {
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
]

