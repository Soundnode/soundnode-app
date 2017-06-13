const fs = require('fs-extra');
const userHome = require('user-home');

class Configuration {

    /**
     * Get the configuration path
     * 
     * @returns {string} The location of the config
     */
    static get path () {
        let userConfigPath = null;

        /** Linux platforms - XDG Standard */
        if (process.platform === 'win32') {
            userConfigPath = `${userHome}/.config/Soundnode/userConfig.json`;
        }


        /** Linux platforms - XDG Standard */
        if (process.platform === 'linux') {
            userConfigPath = `${userHome}/.config/Soundnode/userConfig.json`;
        }

        /** Mac os configuration location */
        if (process.platform === 'darwin') {
            userConfigPath = `${userHome}/Library/Preferences/Soundnode/userConfig.json`;
        }

        return userConfigPath;
    }

    /**
     * Get the config file
     * 
     * @returns {Object} Parsed version of the saved file
     */
    static get file () {
        return JSON.parse(fs.readFileSync(`${this.path}`, 'utf-8'));
    }

    /**
     * Ensure the config exists
     * 
     * @returns {Boolean} True if the file exists
     */
    static get configExists () {
        return fs.existsSync(this.path);
    }

}

module.exports = Configuration;