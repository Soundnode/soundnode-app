module.exports = {
    options: {
        stdout: true
    },
    target: {
        command: function() {
            return 'webpack -p';
        }
    }
};
