module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      examples: {
        src: ['examples/**/*', '!**/_*/**'],
        dest: '_includes/',
        filter: 'isFile'
      }
    },
    watch: {
      scripts: {
        files: ['js/*.js', 'images/*', '*.html'],
        tasks: ['concat', 'uglify', 'newer:imagemin', 'newer:svgmin'],
        options: { spawn: false }
      },
      examples: {
        files: ['examples/**/*'],
        tasks: ['copy:examples'],
        options: { spawn: false }
      }
    },
    typedoc: {
      build: {
        options: {
          module: 'commonjs',
          target: 'es5',
          out: 'docs/',
          name: 'SVGTypewriter.js'
        },
        src: 'src/**/*'
      }
    },
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['copy']);
  grunt.registerTask("docs", "typedoc:build");
}
