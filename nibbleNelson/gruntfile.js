module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: "./public",
            src: ["**"],
            dest: "./dist/public"
          }
        ]
      }
    },
    ts: {
      app: {
        files: [{
          src: ["src/\*\*/\*.ts"],
          dest: "./dist"
        }],
        options: {
          module: "commonjs",
          target: "es6",
          sourceMap: true,
          rootDir: "src"
        }
      }
    },
    clean: ['*.tmp.txt'],
    watch: {
      ts: {
        files: ["src/**/*.ts"],
        tasks: ["ts", "clean"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask("default", [
    "copy",
    "ts",
    "clean",
    "watch"
  ]);
};