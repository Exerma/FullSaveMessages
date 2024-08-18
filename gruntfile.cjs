/**
 *----------------------------------------------------------------------------
 * (c) Patrick Seuret, 2023-2024
 * ----------------------------------------------------------------------------
 * gruntfile.js
 * ----------------------------------------------------------------------------
 * This is the declaration for grunt automation used for package building
 * with webpack.
 * Source: https://gruntjs.com/
 * 
 *
 * Versions:
 *   2023-09-04: First version
 *
 */

 //this is no typescript file!
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpackConfig = require("./webpack.config.cjs");

module.exports = (grunt) => {

	const srcDir = "src/";
	const outDir = "dist/";
	const outDirExtracted = outDir + "/release/";
	const outXpi = outDir + "/FullSaveMessages.xpi";

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		
        clean: [outDir],
		
        copy: {
			main: {
				files: [
					{ expand: true, cwd:          "./resources/",          src: ["**"],              dest: outDirExtracted },
					{ expand: true, cwd:          "./src/exerma_base/css", src: ["**/*.css"],        dest: outDirExtracted + "/css/"},
					{ expand: true, cwd:          "./api/",                src: ["**/*.j*"],         dest: outDirExtracted + "/api/" },
					{ expand: true, cwd: srcDir + "/pages/",               src: ["**", "!**/*.ts"],  dest: outDirExtracted },
					{ expand: true, cwd: srcDir + "/background/",          src: ["**", "!**/*.ts", "!**/tsconfig*.json"], dest: outDirExtracted },
					{ expand: true, cwd: srcDir + "/action/",              src: ["**", "!**/*.ts", "!**/tsconfig*.json"], dest: outDirExtracted },
					{ expand: true,                                        src: ["./README.md"],     dest: outDirExtracted },
				],
			},
		},
		
        webpack: {
			myConfig: webpackConfig,
		},

		// make a zipfile
		compress: {
			main: {
				options: {
					archive: outXpi,
					mode: "zip",
				},
				files: [
					{ expand: true, cwd: outDirExtracted, src: ["**"], dest: "/" }, // makes all src relative to cwd
				],
			},
		},

		eslint: {
			target: [srcDir + "/**/*.ts", srcDir + "/**/*.js"],
		},

	});

    grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-compress");
	grunt.loadNpmTasks("grunt-webpack");
	grunt.loadNpmTasks("grunt-eslint");

	//tasks
	grunt.registerTask("debug",   ["clean", "copy", "webpack", "eslint"]);
	grunt.registerTask("release", ["clean", "copy", "webpack", "compress", "eslint"]);
    grunt.registerTask("default", ["clean", "copy", "webpack", "compress", "eslint"]);
    
};