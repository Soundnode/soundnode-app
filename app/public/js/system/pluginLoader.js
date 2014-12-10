var fs = require('fs'),
    path = require('path'),
    pluginPath = path.join(process.cwd(), '/app/plugins');

fs.readdirSync(pluginPath).forEach(function(pluginFile) {
    if (~pluginFile.indexOf('.js')) {
        var plugin = require(pluginPath + '/' + pluginFile);
        if (typeof plugin === "function") {
        	/*Nasty hack to inject window into the plugin, otherwise we'd need to call window.console.log etc from the plugin file*/
            (function() {
                return window;
            }).call(plugin, {
                gui: appGUI,
                system: appSystem,
                events: appEvents
            });
        }
    }
});