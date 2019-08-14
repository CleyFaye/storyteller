const loadGruntTasks = require("load-grunt-tasks");
const {reactApp} = require("@cley_faye/boilerplate/grunt");
const {reactAppOptionsHelper} = require("@cley_faye/boilerplate/grunt");

module.exports = grunt => {
  loadGruntTasks(grunt);
  const gruntConfig = {
    clean: {
      dist: "dist",
    },
  };
  const buildTasks = reactApp(
    gruntConfig,
    "storyteller",
    reactAppOptionsHelper(
      {
        production: false,
      }
    )
  );
  console.log(JSON.stringify(gruntConfig, 2, " "));
  grunt.initConfig(gruntConfig);
  
  grunt.registerTask("build", "Build the project's webapp", buildTasks);
  grunt.registerTask("default", ["build"]);
};