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

        compass: {
            dev: {
                options: {
                    sassDir: 'app/public/stylesheets/sass',
                    cssDir: 'app/public/stylesheets/css'
                }
            },
            production: {
                options: {
                    sassDir: 'app/public/stylesheets/sass',
                    cssDir: 'app/public/stylesheets/css',
                    environment: 'production',
                    outputStyle: 'compressed',
                    force: true
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
        }

    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-node-webkit-builder');

    // Build desktop
    grunt.registerTask('build', [
        'compass:production',
        'nodewebkit'
    ]);

    // Dev
    grunt.registerTask('dev', [
        'compass:dev'
    ]);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

};
