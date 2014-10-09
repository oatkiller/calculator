module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
		jshint: {
			src: [ "lib/calculator.js", "lib/controller.js", "lib/main.js", "lib/view.js" ]
		},
		concat: {
			dist: {
				src: [
					"externals/big.js",
					"externals/jquery-2.1.1.js",
					"lib/calculator.js",
					"lib/controller.js",
					"lib/view.js"
				],
				dest: "dist/calculator.js",
			}
		}
  });

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");

  grunt.registerTask("default", ["concat"]);

};
