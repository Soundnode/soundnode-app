"use strict";

import { ipcRenderer } from 'electron';
import fs from 'fs-extra';
import configuration from '../common/configLocation';

let guiConfig: any = {};

// close the App
guiConfig.close = function (): void {
  ipcRenderer.send('closeApp');
};

// quit hard
guiConfig.destroy = function (): void {
  ipcRenderer.send('destroyApp');
};

// minimize the App
guiConfig.minimize = function (): void {
  ipcRenderer.send('minimizeApp');
};

// maximize the App
guiConfig.maximize = function (): void {
  ipcRenderer.send('maximizeApp');
};

guiConfig.logOut = function (): void {
  fs.removeSync(configuration.getPath());
  guiConfig.destroy();
};

export default {
  guiConfig: guiConfig
};