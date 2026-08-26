'use strict';

const assert = require('assert');
const bridge = require('../integrations/soundcloudopenBridge');

function testMissionArgs() {
  const args = bridge.buildMissionArgs({
    prompt: 'dark melodic trap',
    genre: 'trap',
    mood: 'cold',
    bpm: 90,
    count: 4,
    useCase: 'album',
    format: 'wav',
    soundcloudUrl: 'https://soundcloud.com/example/owned-track'
  });

  assert.strictEqual(args[0], 'dark melodic trap');
  assert.ok(args.includes('--genre'));
  assert.ok(args.includes('trap'));
  assert.ok(args.includes('--mood'));
  assert.ok(args.includes('cold'));
  assert.ok(args.includes('--bpm'));
  assert.ok(args.includes('90'));
  assert.ok(args.includes('--count'));
  assert.ok(args.includes('4'));
  assert.ok(args.includes('--use-case'));
  assert.ok(args.includes('album'));
  assert.ok(args.includes('--format'));
  assert.ok(args.includes('wav'));
  assert.ok(args.includes('--soundcloud'));
}

function testPromptOnly() {
  const args = bridge.buildMissionArgs({ prompt: 'warm soul', promptOnly: true });
  assert.ok(args.includes('--prompt-only'));
}

function testDownloadArgs() {
  const args = bridge.buildDownloadArgs({
    url: 'https://soundcloud.com/example/sets/owned-playlist',
    format: 'flac',
    browser: 'none',
    output: '/tmp/xunia',
    saveJson: true
  });

  assert.strictEqual(args[0], 'https://soundcloud.com/example/sets/owned-playlist');
  assert.deepStrictEqual(args.slice(1, 5), ['--format', 'flac', '--browser', 'none']);
  assert.ok(args.includes('--output'));
  assert.ok(args.includes('/tmp/xunia'));
  assert.ok(args.includes('--save-json'));
}

function testValidation() {
  assert.throws(() => bridge.buildMissionArgs({ prompt: '' }), /Describe the sound/);
  assert.throws(() => bridge.buildMissionArgs({ prompt: 'x', bpm: 0 }), /BPM/);
  assert.throws(() => bridge.buildMissionArgs({ prompt: 'x', count: 11 }), /Candidate count/);
  assert.throws(() => bridge.buildDownloadArgs({ url: 'https://example.com/file.mp3' }), /soundcloud.com/);
  assert.throws(() => bridge.buildDownloadArgs({ url: 'https://soundcloud.com/example/x', format: 'exe' }), /Unsupported audio format/);
}

testMissionArgs();
testPromptOnly();
testDownloadArgs();
testValidation();
console.log('XUNIA SoundCloudOpen bridge tests: PASS');
