module.exports = function (grunt) {

    grunt.initConfig({

        nodewebkit: {
            options: {
                build_dir: './dist', // Where the build version of my node-webkit app is saved
                mac: true, // We want to build it for mac
                win: true, // We want to build it for win
                linux32: false, // We don't need linux32
                linux64: false // We don't need linux64
            },
            src: [
                './app/**/*',
                '!./app/public/stylesheets/sass',
                '!./app/public/stylesheets/config.rb',
                '!./app/**/*.sass-cache',
                '!./app/public/assets'
            ]
        },

        compass: {
            dev: {
                options: {
                    sassDir: 'public/stylesheets/sass',
                    cssDir: 'public/stylesheets/css'
                }
            },
            production: {
                options: {
                    sassDir: 'public/stylesheets/sass',
                    cssDir: 'public/stylesheets/css',
                    environment: 'production',
                    outputStyle: 'compressed',
                    force: true
                }
            }
        },

        watch: {
            src: {
                files: [
                    'public/stylesheets/sass/**/*.scss'
                ],
                tasks: ['dev']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    // Build desktop
    grunt.registerTask('build', [
        'nodewebkit'
//        'compass'
    ]);

    // Dev
    grunt.registerTask('dev', [
        'compass:dev'
    ]);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};