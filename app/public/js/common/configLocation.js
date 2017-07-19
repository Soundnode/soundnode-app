const fs = require('fs-extra');
const userHome = require('user-home');
const mkdirp = require('mkdirp');

class Configuration {

    /**
     * Get the configuration folder location
     * 
     * @returns {string} The folder location of the config
     */
    static get location () {
        let userConfigPath = null;

        /** Windows platform */
        if (process.platform === 'win32') {
            userConfigPath = `${userHome}/.config/Soundnode`;
        }


        /** Linux platforms - XDG Standard */
        if (process.platform === 'linux') {
            userConfigPath = `${userHome}/.config/Soundnode`;
        }

        /** Mac os configuration location */
        if (process.platform === 'darwin') {
            userConfigPath = `${userHome}/Library/Preferences/Soundnode`;
        }

        if (!fs.statSync(userConfigPath).isDirectory()) {
            mkdirp(userConfigPath, err => {
                if (err) {
                    console.error(err);
                }
            });
        }

        return userConfigPath;
    }

    /**
     * Get the configuration path
     * 
     * @returns {string} The file location of the config
     */
    static get path () {
        return `${this.location}/userConfig.json`
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
        return fs.existsSync(`${this.path}`);
    }

}

module.exports = Configuration;
