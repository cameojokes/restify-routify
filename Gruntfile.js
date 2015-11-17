module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        jsdoc : {
            dist : {
                src: ['lib/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        clean: ["doc"],
        'gh-pages': {
            options: {
                base: 'doc'
            },
            src: ['**']
        },
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: ['lib/router.js']
        }
    });

    //testing tasks
    grunt.registerTask('docs', 'Default task will create API documentation and test', ['jsdoc', 'gh-pages', 'clean']);
    grunt.registerTask('test', 'Default task will create API documentation and test', ['eslint']);
    grunt.registerTask('default', 'Default task will create API documentation and test', ['docs', 'test']);

};
