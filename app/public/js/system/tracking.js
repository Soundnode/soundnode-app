var systemAnalytics = function() {
    var gui = require('nw.gui');
    var os = require('os');
    var ua = require('universal-analytics');
    var visitor = ua('UA-62392821-1');
    var getOperatingSystem, resolution;

    console.log('user analytics started.');

    getOperatingSystem = function() {
        var platform = os.platform();
        if (platform === "win32" || platform === "win64") {
            return "windows";
        }
        if (platform === "darwin") {
            return "mac";
        }
        if (platform === "linux") {
            return "linux";
        }
        return null;
    };

    visitor.event("Device Stats", "Version", gui.App.manifest.version).send();

    visitor.event("Device Stats", "Type", getOperatingSystem()).send();

    visitor.event("Device Stats", "Operating System", os.type() + " " + os.release()).send();

    visitor.event("Device Stats", "CPU", os.cpus()[0].model + " @ " + (os.cpus()[0].speed / 1000).toFixed(1) + "GHz" + " x " + os.cpus().length).send();

    visitor.event("Device Stats", "RAM", Math.round(os.totalmem() / 1024 / 1024 / 1024) + "GB").send();

    visitor.event("Device Stats", "Uptime", Math.round(os.uptime() / 60 / 60) + "hs").send();

    if (typeof screen.width === "number" && typeof screen.height === "number") {
        resolution = screen.width.toString() + "x" + (screen.height.toString());
        if (typeof screen.pixelDepth === "number") {
            resolution += "@" + screen.pixelDepth.toString();
        }
        if (typeof window.devicePixelRatio === "number") {
            resolution += "#" + window.devicePixelRatio.toString();
        }
        visitor.event("Device Stats", "Resolution", resolution).send();
    }

    visitor.event("Device Stats", "Language", navigator.language.toLowerCase()).send();

    visitor.pageview("/").send();

    setInterval((function() {
        return visitor.event("_KeepAlive", "Pulse").send();
    }), 600 * 1000);

};
