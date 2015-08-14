module.exports = function (grunt) {

    grunt.initConfig({

        nodewebkit: {
            options: {
                buildDir: './dist', // Where the build version of my node-webkit app is saved
                macIcns: './app/soundnode.icns',
                downloadUrl: 'http://www.soundnodeapp.com/build/',
                platforms: ['linux64', 'osx64', 'win32'],
                version: '0.12.3'
            },
            src: [
                './app/index.html',
                './app/package.json',
                './app/soundnode.icns',
                './app/soundnode.png',
                './app/views/**/*',
                './app/public/js/**/*',
                './app/public/img/**/*',
                './app/public/stylesheets/css/**/*'
            ]
        },

        sass: {
            options: {
                sourceMap: false
            },
            production: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'app/public/stylesheets/css/app.css': 'app/public/stylesheets/sass/app.scss'
                }
            },
            dev: {
                files: {
                    'app/public/stylesheets/css/app.css': 'app/public/stylesheets/sass/app.scss'
                }
            }
        },

        watch: {
            src: {
                files: [
                    'app/public/stylesheets/sass/**/*.scss'
                ],
                tasks: ['dev']
            }
        },

        jshint: {
            all: [
                'app/public/js/**/*.js',
                '!app/public/js/vendor/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        clean: {
            force: true,
            build: ['dist']
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Build desktop
    grunt.registerTask('build', [
        'clean:build',
        'sass:production',
        'nodewebkit'
    ]);

    // Dev
    grunt.registerTask('dev', [
        'sass:dev'
    ]);

    // Dev
    grunt.registerTask('test', [
        'jshint'
    ]);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
