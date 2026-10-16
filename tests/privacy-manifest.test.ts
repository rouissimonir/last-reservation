import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { mergePrivacyInfo } from '@expo/config-plugins/build/ios/PrivacyInfo';
import appConfig from '../app.json';

const manifest = appConfig.expo.ios.privacyManifests;
const vendorEvidence = [
  ['NSPrivacyAccessedAPICategoryFileTimestamp', 'C617.1', 'node_modules/@react-native-async-storage/async-storage/ios/PrivacyInfo.xcprivacy'],
  ['NSPrivacyAccessedAPICategoryUserDefaults', 'CA92.1', 'node_modules/expo-constants/ios/PrivacyInfo.xcprivacy'],
  ['NSPrivacyAccessedAPICategorySystemBootTime', '35F9.1', 'node_modules/react-native/ReactCommon/react/timing/PrivacyInfo.xcprivacy'],
];

test('app required-reason declarations have matching evidence in the installed native SDK manifests', () => {
  for (const [category, reason, path] of vendorEvidence) {
    const source = readFileSync(path, 'utf8');
    assert.ok(source.includes(`<string>${category}</string>`) && source.includes(`<string>${reason}</string>`), path);
    assert.ok(manifest.NSPrivacyAccessedAPITypes.some(item =>
      item.NSPrivacyAccessedAPIType === category && item.NSPrivacyAccessedAPITypeReasons.includes(reason)), category);
  }
});

test('Expo privacy merge retains SDK collection disclosures and combines reasons without duplicates', () => {
  const sdk = {
    NSPrivacyTracking: false,
    NSPrivacyCollectedDataTypes: [{
      NSPrivacyCollectedDataType: 'NSPrivacyCollectedDataTypePurchaseHistory',
      NSPrivacyCollectedDataTypeLinked: false, NSPrivacyCollectedDataTypeTracking: false,
      NSPrivacyCollectedDataTypePurposes: ['NSPrivacyCollectedDataTypePurposeAppFunctionality'],
    }],
    NSPrivacyAccessedAPITypes: [{ NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults', NSPrivacyAccessedAPITypeReasons: ['CA92.1'] }],
  };
  const before = structuredClone(sdk);
  const merged = mergePrivacyInfo(sdk, manifest);
  assert.deepEqual(sdk, before, 'the vendor declaration is not mutated');
  assert.deepEqual(merged.NSPrivacyCollectedDataTypes, sdk.NSPrivacyCollectedDataTypes, 'app config does not erase purchase disclosure');
  assert.equal(merged.NSPrivacyAccessedAPITypes.length, 3);
  assert.deepEqual(mergePrivacyInfo(merged, manifest), merged, 'repeated prebuild merge is idempotent');
});
