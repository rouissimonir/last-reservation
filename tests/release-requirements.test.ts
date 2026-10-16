import assert from 'node:assert/strict';
import { test } from 'node:test';
import { iosReleaseIssues, isPublicHttps } from '../scripts/release-requirements';
import appConfig from '../app.json';

const config = { ...appConfig.expo, ios: { ...appConfig.expo.ios, bundleIdentifier: 'com.bellweathertest.twosides' } };
const env = { EXPO_PUBLIC_REVENUECAT_IOS_API_KEY: 'appl_public_fixture_only', EXPO_PUBLIC_SUPPORT_URL: 'https://bellweathertest.com/support', EXPO_PUBLIC_PRIVACY_URL: 'https://bellweathertest.com/privacy' };
const profile = { distribution: 'store', environment: 'production', autoIncrement: true, env: { EXPO_PUBLIC_DEV_PREVIEW_PREMIUM: '0' } };

test('iOS preflight rejects missing identity, public purchase key and live-page configuration', () => {
  const issues = iosReleaseIssues({}, {}, profile);
  assert.equal(issues.length, 7);
  assert.ok(issues.some(i => i.includes('bundleIdentifier')));
  assert.ok(issues.some(i => i.includes('PRIVACY_URL')));
  assert.ok(iosReleaseIssues({ ...config, ios: { ...config.ios, bundleIdentifier: 'com.example.twosides' } }, env, profile).length);
});

test('iOS preflight fails if a required-reason declaration is missing or replaced with an unrelated reason', () => {
  const apis = config.ios.privacyManifests.NSPrivacyAccessedAPITypes;
  for (const omitted of apis) {
    const missing = { ...config, ios: { ...config.ios, privacyManifests: { NSPrivacyAccessedAPITypes: apis.filter(a => a !== omitted) } } };
    assert.ok(iosReleaseIssues(missing, env, profile).some(i => i.includes('required-reason')), omitted.NSPrivacyAccessedAPIType);
  }
  const wrong = { ...config, ios: { ...config.ios, privacyManifests: { NSPrivacyAccessedAPITypes: apis.map(a => ({ ...a, NSPrivacyAccessedAPITypeReasons: ['unrelated-fixture'] })) } } };
  assert.ok(iosReleaseIssues(wrong, env, profile).some(i => i.includes('required-reason')));
});

test('iOS preflight accepts complete syntax without certifying the store or device', () => {
  assert.deepEqual(iosReleaseIssues(config, env, profile), []);
  for (const bad of ['test_secret_fixture', 'sk_secret_fixture', 'goog_android_fixture'])
    assert.ok(iosReleaseIssues(config, { ...env, EXPO_PUBLIC_REVENUECAT_IOS_API_KEY: bad }, profile).some(i => i.includes('IOS_API_KEY')));
});

test('iOS preflight rejects development distribution and an active preview flag', () => {
  assert.ok(iosReleaseIssues(config, env, { ...profile, developmentClient: true }).length);
  assert.ok(iosReleaseIssues(config, env, { ...profile, distribution: 'internal' }).length);
  assert.ok(iosReleaseIssues(config, { ...env, EXPO_PUBLIC_DEV_PREVIEW_PREMIUM: '1' }, profile).length);
});

test('release public links reject credentials, placeholders, local addresses and non-HTTPS schemes', () => {
  for (const value of [undefined, '', 'https://example.com/privacy', 'https://privacy.example', 'https://localhost/p', 'https://192.168.1.3/p', 'https://127.0.0.1/p', 'https://10.2.3.4/p', 'https://172.16.2.1/p', 'https://host.local/p', 'http://bellweathertest.com/p', 'javascript:alert(1)', 'https://user:pass@bellweathertest.com/p'])
    assert.equal(isPublicHttps(value), false, String(value));
  assert.equal(isPublicHttps(env.EXPO_PUBLIC_PRIVACY_URL), true);
});
