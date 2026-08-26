'use strict';

const { spawn } = require('child_process');

const AUDIO_FORMATS = ['mp3', 'm4a', 'opus', 'flac', 'wav', 'aac'];
const BROWSERS = ['auto', 'chrome', 'chromium', 'edge', 'firefox', 'brave', 'opera', 'safari', 'none'];

function clean(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text || null;
}

function validateSoundCloudUrl(value) {
  const url = clean(value);
  if (!url) throw new Error('A SoundCloud URL is required.');
  let parsed;
  try {
    parsed = new URL(url);
  } catch (_error) {
    throw new Error('Enter a valid SoundCloud URL.');
  }
  const host = parsed.hostname.toLowerCase();
  if (host !== 'soundcloud.com' && !host.endsWith('.soundcloud.com')) {
    throw new Error('Only soundcloud.com URLs are accepted.');
  }
  return parsed.toString();
}

function normalizeFormat(value) {
  const format = clean(value) || 'mp3';
  if (!AUDIO_FORMATS.includes(format)) {
    throw new Error(`Unsupported audio format: ${format}`);
  }
  return format;
}

function normalizeBrowser(value) {
  const browser = clean(value) || 'auto';
  if (!BROWSERS.includes(browser)) {
    throw new Error(`Unsupported browser option: ${browser}`);
  }
  return browser;
}

function buildMissionArgs(input) {
  const options = input || {};
  const prompt = clean(options.prompt);
  if (!prompt) throw new Error('Describe the sound you want.');

  const args = [prompt];
  const soundcloudUrl = clean(options.soundcloudUrl);
  if (soundcloudUrl) args.push('--soundcloud', validateSoundCloudUrl(soundcloudUrl));

  const format = normalizeFormat(options.format);
  if (format !== 'mp3') args.push('--format', format);

  if (options.bpm !== undefined && options.bpm !== null && String(options.bpm).trim() !== '') {
    const bpm = Number(options.bpm);
    if (!Number.isInteger(bpm) || bpm < 1 || bpm > 400) {
      throw new Error('BPM must be a whole number between 1 and 400.');
    }
    args.push('--bpm', String(bpm));
  }

  const genre = clean(options.genre);
  const mood = clean(options.mood);
  const useCase = clean(options.useCase);
  if (genre) args.push('--genre', genre);
  if (mood) args.push('--mood', mood);
  if (useCase) args.push('--use-case', useCase);

  if (options.count !== undefined && options.count !== null && String(options.count).trim() !== '') {
    const count = Number(options.count);
    if (!Number.isInteger(count) || count < 1 || count > 10) {
      throw new Error('Candidate count must be a whole number between 1 and 10.');
    }
    args.push('--count', String(count));
  }

  if (options.promptOnly) args.push('--prompt-only');
  return args;
}

function buildDownloadArgs(input) {
  const options = input || {};
  const url = validateSoundCloudUrl(options.url);
  const args = [url, '--format', normalizeFormat(options.format), '--browser', normalizeBrowser(options.browser)];

  const output = clean(options.output);
  if (output) args.push('--output', output);
  if (options.saveJson) args.push('--save-json');
  if (options.listOnly) args.push('--list');
  if (options.printCommand) args.push('--print-command');
  return args;
}

function runProcess(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options && options.cwd ? options.cwd : process.cwd(),
      env: Object.assign({}, process.env, options && options.env ? options.env : {}),
      shell: false,
      windowsHide: true
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', code => {
      resolve({ code, stdout: stdout.trim(), stderr: stderr.trim(), command, args: args.slice() });
    });
  });
}

function xuniaCandidates() {
  return [
    { command: 'xunia-sounds', prefix: [] },
    { command: 'xuniasounds', prefix: [] },
    { command: 'python3', prefix: ['-m', 'soundcloudopen.xunia_sounds'] },
    { command: 'python', prefix: ['-m', 'soundcloudopen.xunia_sounds'] }
  ];
}

function soundCloudOpenCandidates() {
  return [
    { command: 'soundcloudopen', prefix: [] },
    { command: 'sco', prefix: [] },
    { command: 'python3', prefix: ['-m', 'soundcloudopen.cli'] },
    { command: 'python', prefix: ['-m', 'soundcloudopen.cli'] }
  ];
}

async function runCandidates(candidates, args) {
  const failures = [];
  for (const candidate of candidates) {
    try {
      const result = await runProcess(candidate.command, candidate.prefix.concat(args));
      if (result.code === 0) return result;
      failures.push(`${candidate.command}: ${result.stderr || `exit ${result.code}`}`);
    } catch (error) {
      failures.push(`${candidate.command}: ${error.message}`);
    }
  }
  const error = new Error('SoundCloudOpen is not ready on this computer. Install SoundCloudOpen 1.2+ and try again.');
  error.details = failures;
  throw error;
}

async function checkAvailability() {
  const [xunia, downloader] = await Promise.all([
    runCandidates(xuniaCandidates(), ['--version']).catch(error => ({ error })),
    runCandidates(soundCloudOpenCandidates(), ['--version']).catch(error => ({ error }))
  ]);

  return {
    ready: !xunia.error && !downloader.error,
    xunia: xunia.error ? { ready: false, error: xunia.error.message } : { ready: true, version: xunia.stdout, command: xunia.command },
    downloader: downloader.error ? { ready: false, error: downloader.error.message } : { ready: true, version: downloader.stdout, command: downloader.command }
  };
}

async function buildMission(input) {
  const result = await runCandidates(xuniaCandidates(), buildMissionArgs(input));
  if (input && input.promptOnly) return { type: 'prompt', text: result.stdout, command: result.command };

  let mission;
  try {
    mission = JSON.parse(result.stdout);
  } catch (_error) {
    throw new Error(`XUNIA SOUNDS returned non-JSON output: ${result.stdout || result.stderr}`);
  }
  return { type: 'mission', mission, command: result.command };
}

async function saveAuthorizedMedia(input) {
  const result = await runCandidates(soundCloudOpenCandidates(), buildDownloadArgs(input));
  return {
    ok: result.code === 0,
    stdout: result.stdout,
    stderr: result.stderr,
    command: result.command
  };
}

module.exports = {
  AUDIO_FORMATS,
  BROWSERS,
  validateSoundCloudUrl,
  buildMissionArgs,
  buildDownloadArgs,
  checkAvailability,
  buildMission,
  saveAuthorizedMedia
};
