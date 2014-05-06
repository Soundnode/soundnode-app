/**
 * Created by michaellancaster on 5/6/14.
 */
module.exports = function (grunt) {

    grunt.initConfig({

        nodewebkit: {
            options: {
                build_dir: './webkitbuilds', // Where the build version of my node-webkit app is saved
                mac: true, // We want to build it for mac
                win: true, // We want to build it for win
                linux32: false, // We don't need linux32
                linux64: false // We don't need linux64
            },
            src: ['./example/public/**/*'] // Your node-webkit app
        }

    });

    grunt.loadNpmTasks('grunt-node-webkit-builder');

    // Build desktop
    grunt.registerTask('build', ['nodewebkit']);
}