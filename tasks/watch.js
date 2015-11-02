module.exports = {
    src: {
        files: [
            '<%= settings.app %>/public/stylesheets/sass/**/*.scss',
            '<%= settings.app %>/public/js/**/*.jsx'
        ],
        tasks: ['dev']
    }
};