'use strict';

const { ipcRenderer } = require('electron');

function byId(id) {
  return document.getElementById(id);
}

function value(id) {
  return byId(id).value.trim();
}

function missionPayload(promptOnly) {
  return {
    prompt: value('prompt'),
    genre: value('genre'),
    mood: value('mood'),
    bpm: value('bpm'),
    count: value('count'),
    useCase: value('useCase'),
    format: value('format'),
    soundcloudUrl: value('soundcloudUrl'),
    promptOnly: !!promptOnly
  };
}

function downloadPayload() {
  return {
    url: value('soundcloudUrl'),
    format: value('format'),
    browser: value('browser'),
    output: value('output')
  };
}

function showOutput(payload) {
  const node = byId('outputView');
  node.textContent = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
}

function setStatus(message, good) {
  const status = byId('status');
  status.textContent = message;
  status.className = `status ${good === true ? 'good' : good === false ? 'bad' : ''}`;
}

async function check() {
  setStatus('Checking SoundCloudOpen…');
  try {
    const result = await ipcRenderer.invoke('xunia:check');
    if (result.ready) {
      setStatus(`READY — ${result.xunia.version} / ${result.downloader.version}`, true);
    } else {
      setStatus('NOT READY — install SoundCloudOpen 1.2+ on this computer.', false);
    }
    showOutput(result);
  } catch (error) {
    setStatus(error.message, false);
    showOutput({ error: error.message });
  }
}

async function buildMission(promptOnly) {
  showOutput(promptOnly ? 'Building Claude discovery prompt…' : 'Building XUNIA mission…');
  try {
    const result = await ipcRenderer.invoke('xunia:mission', missionPayload(promptOnly));
    showOutput(result);
  } catch (error) {
    showOutput({ error: error.message });
  }
}

async function saveAuthorizedMedia() {
  const url = value('soundcloudUrl');
  if (!url) {
    showOutput({ error: 'Add an authorized SoundCloud track or playlist URL first.' });
    return;
  }

  const confirmed = window.confirm('Save this SoundCloud media only if you own it, SoundCloud permits the download, or you otherwise have permission. Continue?');
  if (!confirmed) return;

  showOutput('Starting SoundCloudOpen…');
  try {
    const result = await ipcRenderer.invoke('xunia:download', downloadPayload());
    showOutput(result);
  } catch (error) {
    showOutput({ error: error.message });
  }
}

byId('check').addEventListener('click', check);
byId('mission').addEventListener('click', () => buildMission(false));
byId('promptOnly').addEventListener('click', () => buildMission(true));
byId('save').addEventListener('click', saveAuthorizedMedia);

check();
