'use strict';

const fs = require('fs-extra');
const userHome = require('user-home');
const mkdirp = require('mkdirp');

const configuration = {

  createUserConfig(userConfigPath) {
    mkdirp(userConfigPath, err => {
      if (err) {
        console.error(err);
      }
    });
  },

  /**
   * Get the configuration folder location
   *
   * @returns {string} The folder location of the config
   */
  getUserConfig() {
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

    // create user config in path
    // if there is no userConfig path
    fs.ensureDir(userConfigPath, err => {
      // console.log(err) // => null
      // dir has now been created, including the directory it is to be placed in
    })

    return userConfigPath;
  },

  /**
   * Get the configuration path
   *
   * @returns {string} The file location of the config
   */
  getPath() {
    return `${this.getUserConfig()}/userConfig.json`
  },

  /**
   * Get the config file
   *
   * @returns {Object} Parsed version of the saved file
   */
  getConfigfile() {
    return JSON.parse(fs.readFileSync(`${this.getPath()}`, 'utf-8'));
  },

  /**
   * Ensure the config exists
   *
   * @returns {Boolean} True if the file exists
   */
  containsConfig() {
    return fs.existsSync(`${this.getPath()}`);
  }

}

module.exports = configuration;
