module.exports = {
    options: {
        buildDir: '<%= settings.dist %>', // Where the build version of my node-webkit app is saved
        macIcns: '<%= settings.app %>/soundnode.icns',
        downloadUrl: 'http://www.soundnodeapp.com/build/',
        platforms: ['linux32', 'linux64', 'osx64', 'win32'],
        version: '0.12.3'
    },
    src: [
        '<%= settings.app %>/index.html',
        '<%= settings.app %>/package.json',
        '<%= settings.app %>/soundnode.icns',
        '<%= settings.app %>/soundnode.png',
        '<%= settings.app %>/views/**/*',
        '<%= settings.app %>/public/js/**/*',
        '<%= settings.app %>/public/img/**/*',
        '<%= settings.app %>/public/stylesheets/css/**/*',
        '<%= settings.app %>/dist/**/*',
        './node_modules/universal-analytics/**/*'
    ]
};