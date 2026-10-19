import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { buildNotices, checkDirectCoverage, packageRootFromSource } from '../scripts/third-party-notices';

test('export inventory preserves nested package versions and rejects virtual/outside paths', () => {
  assert.equal(packageRootFromSource('/node_modules/expo-router/node_modules/@radix-ui/react-tabs/dist/index.js'), 'node_modules/expo-router/node_modules/@radix-ui/react-tabs');
  assert.equal(packageRootFromSource('/node_modules/react/index.js'), 'node_modules/react');
  assert.equal(packageRootFromSource('/src/app/help.tsx'), null);
  assert.equal(packageRootFromSource('\0polyfill:external-require'), null);
  assert.equal(packageRootFromSource('/../node_modules/react/index.js'), null);
});

test('bundled notices preserve full installed font terms and every inventoried direct dependency', () => {
  const inventory = JSON.parse(readFileSync('licenses/package-inventory.json', 'utf8'));
  checkDirectCoverage(process.cwd(), inventory);
  const { notices } = buildNotices(process.cwd(), inventory);
  assert.deepEqual(notices, JSON.parse(readFileSync('src/legal/third-party-notices.json', 'utf8')));
  const font = notices.find(notice => notice.credits.some(credit => credit.name === '@expo-google-fonts/material-symbols'));
  assert.ok(font);
  assert.ok(font.text.includes(readFileSync('node_modules/@expo-google-fonts/material-symbols/LICENSE_FONT', 'utf8').replace(/\r\n/g, '\n').trim()));
});

test('notice verification fails on dependency additions and stale installed versions', () => {
  assert.throws(() => checkDirectCoverage(process.cwd(), { packages: [] }), /missing from notices inventory/);
  assert.throws(() => buildNotices(process.cwd(), { packages: [{ path: 'node_modules/react', name: 'react', version: '0.0.0-stale', origins: ['ios'] }] }), /Installed package changed/);
});
