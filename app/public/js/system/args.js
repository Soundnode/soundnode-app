"use strict";

var gui = require('nw.gui');

var args = {};

args.parse = function() {
    var self = this;
    var argv = gui.App.argv;
    
    argv.forEach(function(arg, i) {
        var value = argv[i+1]; // Used for arguments that require a value
        
        switch(arg) {
            case '-p':
            case '--proxy':
                if (self.isValid(value)) gui.App.setProxyConfig(value);
        }
    });
};

// If the argument requires a value
// 1. Check it exists
// 2. Assert it is not another flag
args.isValid = function(val) {
    return !(val === undefined || /-.*/.test(val));
};
