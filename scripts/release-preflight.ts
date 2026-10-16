import { readFileSync } from 'node:fs';
import process from 'node:process';
import { load } from '@expo/env';
import { iosReleaseIssues } from './release-requirements';

process.env.NODE_ENV = 'production';
load(process.cwd(), { silent: true });
const { expo } = JSON.parse(readFileSync('app.json', 'utf8'));
const eas = JSON.parse(readFileSync('eas.json', 'utf8'));
const issues = iosReleaseIssues(expo, process.env, eas.build?.production);
const iconPath = expo.ios?.icon ?? expo.icon;
try {
  const bytes = readFileSync(iconPath);
  if (bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a' || bytes.readUInt32BE(16) !== 1024 || bytes.readUInt32BE(20) !== 1024 || bytes[25] !== 2)
    issues.push('The iOS icon must be a real 1024×1024 RGB PNG without alpha.');
  if (iconPath.includes('expo.icon') || iconPath === './assets/images/icon.png') issues.push('Replace the inherited Expo launcher icon.');
} catch { issues.push('The configured iOS PNG icon could not be read.'); }

if (issues.length) {
  console.error('iOS release configuration is incomplete:');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log('iOS local configuration preflight passed. Values were not printed.');
}
console.log('Still required: verify live URLs, native sandbox purchases/restores, device accessibility/privacy, paired playtests and App Store metadata. See docs/project/IOS_SUBMISSION.md.');
