// test if OS is windows
var isWin = /^win/.test(process.platform);

var config = {
        options: {
            buildDir: '<%= settings.dist %>', // Where the build version of my node-webkit app is saved
            macIcns: '<%= settings.app %>/soundnode.icns',
            winIco: '<%= settings.app %>/soundnode.ico',
            platforms: [
                'linux32',
                'linux64',
                'osx64',
                'win32'
            ],
            version: '0.12.3',
            appVersion: null, // default to package.json version
            cacheDir: 'cache',
            zip: true
        },
        src: [
            '<%= settings.app %>/index.html',
            '<%= settings.app %>/package.json',
            '<%= settings.app %>/soundnode.icns',
            '<%= settings.app %>/soundnode.ico',
            '<%= settings.app %>/soundnode.png',
            '<%= settings.app %>/views/**/*',
            '<%= settings.app %>/public/js/**/*',
            '<%= settings.app %>/public/img/**/*',
            '<%= settings.app %>/public/stylesheets/css/**/*',
            '<%= settings.app %>/dist/**/*',
            './node_modules/universal-analytics/**/*',
            './node_modules/mpris-service/**/*'
        ]
};

module.exports = config;