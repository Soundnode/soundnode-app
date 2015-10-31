module.exports = {
    options: {
        sourceMap: true
    },
    production: {
        options: {
            outputStyle: 'compressed'
        },
        files: {
            '<%= settings.app %>/public/stylesheets/css/app.css': '<%= settings.app %>/public/stylesheets/sass/app.scss'
        }
    },
    dev: {
        options: {
            sourceComments: true,
            outputStyle: 'expanded'
        },
        files: {
            '<%= settings.app %>/public/stylesheets/css/app.css': '<%= settings.app %>/public/stylesheets/sass/app.scss'
        }
    }
};