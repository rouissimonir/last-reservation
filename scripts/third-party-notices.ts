import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

type PackageRecord = { path: string; name: string; version: string; origins: string[] };
type Inventory = { packages: PackageRecord[] };
type Credit = { name: string; version: string };
type Notice = { id: string; text: string; credits: Credit[] };
type Provenance = { credit: Credit; files: { path: string; sha256: string }[] };
const inventoryFile = 'licenses/package-inventory.json';
const outputFile = 'src/legal/third-party-notices.json';
const provenanceFile = 'licenses/notice-provenance.json';
const hash = (text: string) => createHash('sha256').update(text).digest('hex');
const read = (root: string, file: string) => readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');

// Preserve nested package identity: Metro can bundle two versions of one package.
export function packageRootFromSource(source: string): string | null {
  const normalized = source.replace(/\\/g, '/').replace(/^\/+/, '');
  if (normalized.includes('..') || /^[A-Za-z]:/.test(normalized)) return null;
  const marker = normalized.lastIndexOf('node_modules/');
  if (marker < 0) return null;
  const tail = normalized.slice(marker + 'node_modules/'.length);
  const match = tail.match(/^(@[^/]+\/[^/]+|[^/]+)\//);
  return match ? normalized.slice(0, marker) + 'node_modules/' + match[1] : null;
}

function refreshInventory(root: string): Inventory {
  const origins = new Map<string, Set<string>>();
  const include = (pkgPath: string, origin: string) => {
    const set = origins.get(pkgPath) ?? new Set<string>();
    set.add(origin); origins.set(pkgPath, set);
  };
  for (const [platform, directory] of [
    ['ios', 'dist-native/_expo/static/js/ios'],
    ['android', 'dist-native/_expo/static/js/android'],
    ['web', 'dist-native/_expo/static/js/web'],
  ]) {
    const maps = readdirSync(path.join(root, directory)).filter(file => file.endsWith('.map'));
    if (!maps.length) throw new Error(`No ${platform} export source maps. See licenses/README.md.`);
    for (const file of maps) {
      const map = JSON.parse(read(root, `${directory}/${file}`)) as { sources: string[] };
      for (const source of map.sources) {
        const pkgPath = packageRootFromSource(source);
        if (pkgPath) include(pkgPath, platform);
      }
    }
  }
  const pkg = JSON.parse(read(root, 'package.json'));
  // Include installed direct native dependencies conservatively, even if their JS is tree-shaken.
  for (const name of Object.keys(pkg.dependencies)) include(`node_modules/${name}`, 'direct dependency');
  include('node_modules/@expo-google-fonts/material-symbols', 'bundled font');
  include('node_modules/@revenuecat/purchases-js', 'embedded in hybrid mappings');
  return { packages: [...origins].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([pkgPath, values]) => {
    const pkg = JSON.parse(read(root, `${pkgPath}/package.json`));
    return { path: pkgPath, name: pkg.name, version: pkg.version, origins: [...values].sort() };
  }) };
}

function noticeFiles(root: string, record: PackageRecord): string[] {
  const own = readdirSync(path.join(root, record.path))
    .filter(file => /^(license|licence|copying|notice|copyright)([._-]|$)/i.test(file))
    .filter(file => statSync(path.join(root, record.path, file)).isFile())
    .map(file => `${record.path}/${file}`).sort();
  if (own.length) return own;
  if (record.name.startsWith('@react-native/')) return ['node_modules/react-native/LICENSE'];
  const fallback: Record<string, string> = {
    '@expo/ui': 'expo', 'expo-router': 'expo', 'metro-runtime': 'metro',
    'standard-navigation': 'standard-navigation',
    '@revenuecat/purchases-typescript-internal': 'purchases-hybrid-common',
    '@revenuecat/purchases-js-hybrid-mappings': 'purchases-hybrid-common',
  };
  if (fallback[record.name]) return [`licenses/upstream/${fallback[record.name]}.txt`];
  throw new Error(`No retained license for ${record.name} ${record.version}; investigate its upstream source.`);
}

export function buildNotices(root: string, inventory: Inventory) {
  const grouped = new Map<string, Notice>();
  const provenance: Provenance[] = [];
  // Metro sees the hybrid mapping as one module. Verify its embedded source
  // against the exact installed SDK before attributing that additional package.
  const hybridMap = JSON.parse(read(root, 'node_modules/@revenuecat/purchases-js-hybrid-mappings/dist/index.js.map'));
  const embeddedIndex = hybridMap.sources.indexOf('../node_modules/@revenuecat/purchases-js/dist/Purchases.es.js');
  if (embeddedIndex < 0 || hybridMap.sourcesContent[embeddedIndex] !== read(root, 'node_modules/@revenuecat/purchases-js/dist/Purchases.es.js'))
    throw new Error('Embedded RevenueCat web SDK changed; inspect vendor attribution before release.');
  const include = (credit: Credit, files: string[]) => {
    const sources = files.map(file => ({ path: file, sha256: hash(read(root, file)) }));
    const text = files.map(file => read(root, file).trim()).join('\n\n');
    if (text.length < 100) throw new Error(`Incomplete notice for ${credit.name}`);
    const id = hash(text);
    const notice = grouped.get(id) ?? { id, text, credits: [] };
    if (!notice.credits.some(item => item.name === credit.name && item.version === credit.version)) notice.credits.push(credit);
    grouped.set(id, notice); provenance.push({ credit, files: sources });
  };
  for (const record of inventory.packages) {
    const current = JSON.parse(read(root, `${record.path}/package.json`));
    if (current.name !== record.name || current.version !== record.version)
      throw new Error(`Installed package changed at ${record.path}. Refresh export inventory before release.`);
    include({ name: record.name, version: record.version }, noticeFiles(root, record));
  }
  include({ name: 'React Navigation (vendored by Expo Router)', version: 'upstream notice' }, ['licenses/upstream/react-navigation.txt']);
  include({ name: 'react-helmet-async (vendored by Expo Router)', version: 'vendor notice' }, ['node_modules/expo-router/vendor/react-helmet-async/LICENSE']);
  include({ name: 'PurchasesHybridCommon', version: '19.12.0' }, ['licenses/upstream/purchases-hybrid-common.txt']);
  include({ name: 'RevenueCat for iOS', version: '5.95.0' }, ['licenses/upstream/purchases-ios.txt']);
  return { notices: [...grouped.values()], provenance };
}

export function checkDirectCoverage(root: string, inventory: Inventory) {
  const pkg = JSON.parse(read(root, 'package.json'));
  for (const name of Object.keys(pkg.dependencies)) {
    if (!inventory.packages.some(record => record.path === `node_modules/${name}`))
      throw new Error(`Direct dependency missing from notices inventory: ${name}`);
  }
}

function main() {
  const root = process.cwd();
  const refresh = process.argv.includes('--refresh-inventory');
  const check = process.argv.includes('--check');
  const verifyExports = process.argv.includes('--verify-exports');
  if (check && refresh) throw new Error('Choose check or refresh, not both.');
  const inventory: Inventory = refresh ? refreshInventory(root) : JSON.parse(read(root, inventoryFile));
  checkDirectCoverage(root, inventory);
  if (verifyExports) {
    const actual = refreshInventory(root);
    for (const record of actual.packages) if (!inventory.packages.some(item => item.path === record.path && item.version === record.version))
      throw new Error(`Exported package missing from notice inventory: ${record.path} ${record.version}`);
  }
  const upstream: { file: string; sha256: string }[] = JSON.parse(read(root, 'licenses/upstream/sources.json'));
  for (const source of upstream) if (hash(read(root, source.file)) !== source.sha256) throw new Error(`Upstream notice changed: ${source.file}`);
  const result = buildNotices(root, inventory);
  const output = JSON.stringify(result.notices, null, 2) + '\n';
  const provenance = JSON.stringify(result.provenance, null, 2) + '\n';
  if (check) {
    if (!existsSync(path.join(root, outputFile)) || read(root, outputFile) !== output || read(root, provenanceFile) !== provenance)
      throw new Error('Bundled notices are stale. Regenerate and review the diff.');
  } else {
    if (refresh) writeFileSync(path.join(root, inventoryFile), JSON.stringify(inventory, null, 2) + '\n');
    writeFileSync(path.join(root, outputFile), output);
    writeFileSync(path.join(root, provenanceFile), provenance);
  }
  console.log(`Third-party notices ${check ? 'verified' : 'generated'}: ${inventory.packages.length} installed package paths, ${result.notices.length} distinct texts. Native archive and embedded-vendor audit remains required.`);
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('/scripts/third-party-notices.ts')) main();
