# Dependency audit — 16 October 2026

**Open release assessment; no clean-security claim.** After compatible Expo patches, `npm audit` still reports **30 advisories: 19 high, 11 moderate** (includes inherited/transitive dependency chains). `npm audit fix --ignore-scripts` was attempted without force; it did not reduce that total. Package ranges retain Expo SDK 57 and React Native 0.86.3. No advisory was suppressed, ignored by a check, or hidden with an audit threshold.

The audit's forced fixes include downgrading Expo to 44.0.6 or React Native to 0.72.17, and upgrading Router to 58.0.21 independently of SDK 57. Those are not compatibility fixes for this project and were not applied.

## Direct advisory roots and local evidence

| Root | Installed | Advisory / exposure evidence | Follow-up |
| --- | --- | --- | --- |
| braces | 3.0.3 | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): recursive pattern exhaustion. Used through micromatch/Metro tooling. The advisory lists no patched version at review time. | Keep bundler private; upstream fix or carefully reviewed compatible tooling migration. Do not claim the audit is clear. |
| node-forge | 1.4.0 | [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv): RSA signature parsing. Local dependency path includes Expo CLI/code-signing certificates; the source imports forge for certificate operations. | Upstream patched dependency/CLI assessment. Not a basis for treating native RevenueCat verification as compromised or verified safe. |
| decode-uri-component | 0.2.2 | [GHSA-vcc3-ghjq-m6fr](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr): malformed percent-encoded input decoding cost. `query-string/index.js` calls it as a CommonJS function; Router depends on query-string. This may affect runtime URL parsing, so it is not dismissed as tooling-only. | Package 0.5.0 exists, but registry metadata declares ESM/default export while this parent requires a callable CommonJS export. Do not blindly override it. Investigate a compatible Router/query-string fix or migration and verify deep links on the signed build. |
| uuid | 7.0.3 | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq): buffer bounds in v3/v5/v6. The inspected xcode/lib/pbxProject.js call is `uuid.v4()`, outside those affected functions. | This inspected call narrows exposure, but does not certify every transitive use. Update upstream xcode/Expo tooling when compatible. |

Advisory/package metadata and the installed source were inspected. No exploit was run against a public service. Runtime reachability and native binary behavior have not been comprehensively audited. This remains a release gate to resolve or explicitly assess with evidence before submission, separate from passing gameplay tests and Expo dependency alignment.
