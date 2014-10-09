module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
		concat: {
			dist: {
				src: [
					"externals/big.js",
					"externals/jquery-2.1.1.js",
					"lib/intro.js",
					"lib/calculator.js",
					"lib/controller.js",
					"lib/view.js",
					"lib/plugin.js",
					"lib/outro.js"
				],
				dest: "dist/calculator.js"
			}
		}
  });

	grunt.loadNpmTasks("grunt-contrib-concat");

  grunt.registerTask("default", ["concat"]);

};
