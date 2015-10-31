"use strict";

var path = require('path');

module.exports = function (grunt) {

    require('load-grunt-config')(grunt, {
        // path to task.js files, defaults to grunt dir
        configPath: path.join(process.cwd(), 'tasks'),

        // auto grunt.initConfig
        init: true,

        // data passed into config.  Can use with <%= test %>
        data: {
            settings: {
                app: './app',
                dist: './dist'
            }
        }
    });

    require('time-grunt')(grunt);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    // Go to 'tasks/aliases.yaml' to register tasks

};
