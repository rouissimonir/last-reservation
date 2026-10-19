# App Store visual assets · 19 October 2026

## Implemented

Replaced the active launcher identity with a premium illustrated brass keyhole formed by two facing profiles: ivory and burgundy, divided by a warm seam, on navy. Created with built-in ImageGen; both source generations and exact prompts are preserved in `assets/brand/v2/`. The original v1 files and all supplied/case artwork remain untouched. No case, puzzle, save, purchase adapter, entitlement or game interface was changed.

`app.json` points to new v2 icon, splash, adaptive foreground, monochrome and favicon exports. The iOS icon is 1024×1024 RGB PNG without alpha or pre-rounded tile corners. Transparent supporting marks have genuine 0–255 alpha; adaptive foreground content stays inside a 510px central region. `scripts/export-brand-v2.py` reproduces technical exports using the existing Pillow workflow; no runtime dependency was added. Visually inspected the final icon at full size and the 64px favicon. A rebuilt native binary is required for the new launcher/splash.

Prepared five 1320×2868 opaque RGB PNG **layout drafts**, plus original JPEG screen captures, source/output SHA-256 manifest, rendering script and contact sheet in `store/ios/screenshots-drafts/`. Large readable headlines lead with two players/one phone, private clues, handoff, included hints and five free cases. The Last Reservation remains first. No unverified length comparison, invented UI, store price, purchased state, review or award. Screenshot 2 shows only opening Witness evidence; the corresponding Records evidence is not pictured. Screenshot 4 reveals only hint 1; no answer was selected or confirmed.

## Capture provenance and limits

These are real **production web** captures, not native iPhone screenshots. The separate loopback origin `http://127.0.0.1:8105/` served the existing production export from Apple identity checkpoint `1aebd9b`, whose gameplay is unchanged in this assets checkpoint. Browser capture at 440×956 CSS pixels used full-page mode to preserve the full fixed app viewport. Captured files are 440×956 JPEGs. They are framed/resized proportionally, without retouching UI pixels, cropping content or inventing a status bar. The test save progressed only to the first question/hint; cover/library correctly show 0 of 6 confirmed. Other origin saves were preserved. Private evidence was concealed after capture; the temporary viewport override was reset.

Every output has a visible draft footer; manifest `native_capture_verified` and `submission_ready` are false. **Do not upload this set as native screenshots.** This Windows host cannot run an iOS simulator; Goldie's native iOS capture workflow requires macOS. The native replacement checklist is in the screenshot README. No native launch, splash, masking, safe-area, accessibility or store-purchase validation is claimed. No cloud build/upload/submission was started.

References checked: [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/) and [Expo splash/icon guidance](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/). Apple lists 1320×2868 among accepted iPhone 6.9-inch portrait screenshot sizes; dimensions alone do not establish native accuracy or submission readiness.

## Actual checks

| Check | Result |
| --- | --- |
| Brand export/format validation | PASS: real PNGs; 1024px opaque RGB icon; correct transparent supporting marks; configured paths exist |
| Screenshot export/manifest validation | PASS: five decoded 1320×2868 RGB PNGs; raw source hashes match; native/submission flags false |
| Visual review | PASS: final icon + 64px favicon, full-height capture contact sheet and individual evidence layout inspected |
| `npm run check` | PASS: TypeScript, Expo lint, notice validation, 78 domain + 25 component/SDK-boundary tests (103); includes four pre-existing licensing tests |
| `npx expo install --check` | PASS: dependencies up to date |
| `npx expo-doctor` | FAIL: online app-config schema fetch (`fetch failed`), 20/21; no check disabled |
| Clean Expo web export | PASS: actual export with `--clear`, six static routes; Expo emits a 48px favicon from the configured 64px source |
| `npm run release:preflight` | FAIL: real support/privacy URL environment values are still missing; new icon passes its checks |
| `git diff --check` | PASS |

The initial attempt to forward `--clear --max-workers 2` through `npm run build:preview` was parsed by npm as a project path `2`, so Expo stopped before bundling. Reran the real exporter directly as `node node_modules/expo/bin/cli export --platform web --output-dir dist --clear --max-workers 2`; this is an argument-forwarding problem, not a product failure. No check was suppressed or weakened.

Unrelated pending license/notices/help/UI/package changes, `.claude/launch.json` and the small `IOS_STORE_COPY.md` whitespace edit remain excluded from the assets commit. No dependencies/lockfile changes, purchase configuration, outer-repository staging, push or submission.
