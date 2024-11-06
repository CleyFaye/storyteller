const {reactApp} = require("@cley_faye/boilerplate/grunt");
const {reactAppOptionsHelper} = require("@cley_faye/boilerplate/grunt");
const loadGruntTasks = require("load-grunt-tasks");

module.exports = (grunt) => {
  loadGruntTasks(grunt);
  const gruntConfig = {
    clean: {
      dist: "dist",
    },
    copy: {
      third: {
        files: [
          {
            cwd: "node_modules/typeface-roboto",
            dest: "dist/storyteller/third/roboto",
            expand: true,
            src: ["index.css", "files/**/*"],
          },
        ],
      },
    },
  };
  const buildTasks = reactApp(
    gruntConfig,
    "storyteller",
    reactAppOptionsHelper({
      production: false,
    }),
  );
  grunt.initConfig(gruntConfig);

  grunt.registerTask("build", "Build the project's webapp", ["copy:third", ...buildTasks]);
  grunt.registerTask("default", ["build"]);
};
