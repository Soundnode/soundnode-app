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

  createIfNotExist(path) {
    try {
      const pathInfo = fs.statSync(path);
      if (!pathInfo.isDirectory()) {
        this.createUserConfig(path);
      }
    }
    catch(error) {
      this.createUserConfig(path);
    }
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

    /** Unsupported platform */
    if (userConfigPath === null) {
      throw `could not set config path for this OS ${process.platform}`
    }

    this.createIfNotExist(userConfigPath)

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
