import assert from 'node:assert/strict';
import { test } from 'node:test';
import queryString from 'query-string';
import appConfig from '../app.json';
import { redirectSystemPath } from '../src/app/+native-intent';

const route = (path: string) => redirectSystemPath({ path, initial: true });

test('native intent preserves current public routes and the configured custom scheme', () => {
  assert.equal(appConfig.expo.scheme, 'lastreservation', 'changing the app scheme needs a matching native-link update');
  for (const [input, expected] of [
    ['/', '/'], ['/help', '/help'], ['help', '/help'], ['/help/', '/help'],
    ['lastreservation://help', '/help'], ['lastreservation:///help', '/help'],
    ['lastreservation://after-midnight?source=library', '/after-midnight?source=library'],
    ['lastreservation:///after-midnight?source=locked_case', '/after-midnight?source=locked_case'],
    ['exp://192.168.1.2:8081/--/help', '/help'], ['exps://example.invalid/--/after-midnight', '/after-midnight'],
  ]) assert.equal(route(input), expected, input);
});

test('native intent drops malformed, oversized and unrecognized paths without throwing', () => {
  for (const input of [
    '%', '/help?x=%FF', '/%FF', '/after-midnight?source=%C2', '%FF'.repeat(50_000),
    'javascript:alert(1)', 'https://other.invalid/help', '//other.invalid/help',
    'lastreservation://user:pass@help', 'lastreservation://help:123',
    'lastreservation://unknown/help', '/unknown', '/help\n', '/%2Fhelp', '/%2568elp',
  ]) assert.equal(route(input), '/', input.slice(0, 100));
});

test('native intent never forwards arbitrary queries, fragments, case ids or access flags', () => {
  assert.equal(route('/after-midnight?source=library&premium=1&case=the-last-call#secret'), '/after-midnight?source=library');
  assert.equal(route('/after-midnight?source=unknown'), '/after-midnight');
  assert.equal(route('/after-midnight?source=%256cibrary'), '/after-midnight');
  assert.equal(route('/help?source=library&ownership=true'), '/help');
  assert.equal(route('/?case=the-last-call&entitlement=after_midnight_collection'), '/');
});

test('the affected installed query parser receives only bounded canonical output from native intent', () => {
  const inputs = ['%FF'.repeat(50_000), ...Array.from({ length: 256 }, (_, i) => `/after-midnight?source=${'%25'.repeat(i)}%FF`)];
  for (const path of inputs) {
    for (const initial of [true, false]) {
      const clean = redirectSystemPath({ path, initial });
      assert.ok(['/', '/help', '/after-midnight', '/after-midnight?source=library', '/after-midnight?source=locked_case'].includes(clean));
      const parsed = queryString.parseUrl(clean);
      assert.ok(Object.keys(parsed.query).every(key => key === 'source'));
    }
  }
});
