module.exports = function (grunt) {

    grunt.initConfig({

        nodewebkit: {
            options: {
                build_dir: './dist', // Where the build version of my node-webkit app is saved
                mac: true, // We want to build it for mac
                win: true, // We want to build it for win
                linux32: false, // We don't need linux32
                linux64: false, // We don't need linux64
                download_url: 'http://www.soundnodeapp.com/build/',
                mac_icns: './app/soundnode.icns',
                version: '0.10.4'
            },
            src: [
                './app/**/*',
                '!./app/public/stylesheets/sass',
                '!./app/public/stylesheets/config.rb',
                '!./**/*.sass-cache',
                '!./app/public/assets'
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
                '!app/public/js/vendor/**/*.js',
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        }

    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Build desktop
    grunt.registerTask('build', [
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
