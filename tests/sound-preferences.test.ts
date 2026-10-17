import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { createPreferencesQueue, decodePreferences, DEFAULT_PREFERENCES, effectsVolume, musicVolume, PREFERENCES_KEY } from '../src/sound/preferences';
import { SAVE_KEY } from '../src/game/storage';

test('preferences use their own key, never a case save key', () => {
  assert.equal(PREFERENCES_KEY, 'two-sides/preferences/v1');
  assert.notEqual(PREFERENCES_KEY, SAVE_KEY);
  assert.ok(!PREFERENCES_KEY.startsWith('two-sides/the-'));
});

test('defaults are on and quiet', () => {
  const empty = decodePreferences(null);
  assert.equal(empty.kind, 'empty');
  assert.deepEqual(empty.kind === 'empty' && empty.preferences, DEFAULT_PREFERENCES);
  assert.ok(DEFAULT_PREFERENCES.music && DEFAULT_PREFERENCES.effects && DEFAULT_PREFERENCES.haptics);
  assert.ok(musicVolume(DEFAULT_PREFERENCES) > 0 && musicVolume(DEFAULT_PREFERENCES) <= 0.3);
});

test('switches silence their channel regardless of level', () => {
  assert.equal(musicVolume({ ...DEFAULT_PREFERENCES, music: false, musicLevel: 5 }), 0);
  assert.equal(effectsVolume({ ...DEFAULT_PREFERENCES, effects: false, effectsLevel: 5 }), 0);
  assert.equal(effectsVolume({ ...DEFAULT_PREFERENCES, effectsLevel: 5 }), 1);
});

test('damaged or unknown preferences are rejected, extra fields are dropped', () => {
  for (const raw of ['{', '[]', 'null', '{"music":true}', JSON.stringify({ ...DEFAULT_PREFERENCES, musicLevel: 6 }),
    JSON.stringify({ ...DEFAULT_PREFERENCES, effectsLevel: 1.5 }), JSON.stringify({ ...DEFAULT_PREFERENCES, haptics: 'yes' })]) {
    assert.equal(decodePreferences(raw).kind, 'invalid', raw);
  }
  const loaded = decodePreferences(JSON.stringify({ ...DEFAULT_PREFERENCES, music: false, extra: 1 }));
  assert.deepEqual(loaded.kind === 'loaded' && loaded.preferences, { ...DEFAULT_PREFERENCES, music: false });
});

test('writes are serialized and invalid preferences are never written', async () => {
  const writes: string[] = [];
  let release: () => void = () => {};
  const slow = new Promise<void>(r => { release = r; });
  let first = true;
  const store = {
    getItem: async () => null,
    setItem: async (key: string, value: string) => {
      assert.equal(key, PREFERENCES_KEY);
      if (first) { first = false; await slow; }
      writes.push(value);
    },
  };
  const write = createPreferencesQueue(store);
  const a = write({ ...DEFAULT_PREFERENCES, musicLevel: 1 });
  const b = write({ ...DEFAULT_PREFERENCES, musicLevel: 4 });
  await assert.rejects(write({ ...DEFAULT_PREFERENCES, musicLevel: 9 }));
  release();
  await Promise.all([a, b]);
  assert.deepEqual(writes.map(w => JSON.parse(w).musicLevel), [1, 4]);
});

test('every bundled sound is a small mono 16-bit WAV, and the soundtrack loops for a minute', () => {
  const names = ['bellweather-nocturne', 'tap', 'select', 'page', 'handoff', 'confirm', 'wrong', 'hint', 'solved'];
  for (const name of names) {
    const bytes = readFileSync(join(__dirname, '..', 'assets', 'audio', `${name}.wav`));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.readUInt16LE(22), 1, `${name} channels`);
    assert.equal(bytes.readUInt32LE(24), 22050, `${name} rate`);
    assert.equal(bytes.readUInt16LE(34), 16, `${name} bits`);
    const seconds = bytes.readUInt32LE(40) / 2 / 22050;
    if (name === 'bellweather-nocturne') assert.equal(seconds, 60);
    else assert.ok(seconds < 4, `${name} is short`);
  }
});
