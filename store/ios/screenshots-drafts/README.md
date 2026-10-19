# iPhone App Store screenshot layout drafts

19 October follow-up: new iPhone-framed variants are in `../screenshots-iphone-drafts/`. A device frame is allowed in principle; the outstanding issue is checking that these web captures accurately match the eventual submitted iOS build. Compare the native layout and replace differing captures before finalization. This is not a claim that Apple bans web-sourced images or requires every marketing layout to omit device frames. The original files below remain preserved.

**NOT submission-ready.** These are five polished layout drafts containing real production Expo **web** captures. No iOS simulator/device was available on this Windows host. Do not upload the drafts as native iPhone screenshots. Each export includes an explicit draft footer; the manifest marks native verification and submission readiness false.

## Deliverables

- `en-US/01-cover-DRAFT.png` — Two players. One shared phone.
- `en-US/02-evidence-DRAFT.png` — Your clues are half the story.
- `en-US/03-handoff-DRAFT.png` — Pass the phone. Solve it together.
- `en-US/04-hint-DRAFT.png` — A nudge. When you need it.
- `en-US/05-library-DRAFT.png` — Five mysteries. Free to play together.
- `contact-sheet.jpg` — quick visual review.
- `raw/*.jpg` — untouched browser captures. These are JPEGs, regardless of other tools' naming defaults.
- `manifest.json` — ordered output/source paths, SHA-256 hashes, dimensions and truthful source provenance.

1320×2868 portrait opaque RGB PNG canvases target the iPhone 6.9-inch screenshot slot. Apple currently accepts that size: https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/ (checked 19 October 2026). Correct pixel dimensions alone do not establish native accuracy or App Review compliance.

## Design and factual constraints

Navy, brass, ivory and burgundy echo the game's own hotel artwork and new keyhole identity. Real text remains readable inside a simple generic frame. No fabricated Apple status bar, interface, review, award, purchase price, timer or ownership state. No ending or solution is shown. Only the opening Witness sheet is pictured; the corresponding Records sheet is excluded. The hint panel stops at hint 1. The Last Reservation is first; all five free cases and three paid cases remain unchanged.

The browser UI reported a 440×956 CSS viewport; full-page capture preserves that entire fixed app viewport (440×956 pixels), including its lower action area. Framing resizes it proportionally without cropping or retouching. The production export ran on a separate loopback origin/port 8105; existing user saves on other origins were not reset or changed. Capture walkthrough reached the first question and hint only; no answer was confirmed. The cover/library correctly show the test save in progress at 0 of 6 deductions.

Reproduce layouts: `python scripts/render-store-drafts.py` from the app root, with Pillow and the Windows system Georgia/Segoe UI fonts. Logo generation prompts are in `assets/brand/v2/PROMPTS.md`. No AI-generated gameplay or composited clue content is used.

## Native replacement handoff

1. Build the same version as a native iOS app on macOS or through the configured authorized build process. Install in an iPhone simulator/device. Verify launcher/splash, startup and safe areas first. This checkpoint did not start a cloud build or upload.
2. Use a clean test installation/save, never erase a user's progress. Capture the five states above at a supported native iPhone resolution. Goldie's iOS capture workflow needs macOS; Windows cannot run that simulator workflow.
3. Keep the complete, genuine native capture pixels and rerender layouts from them. Check text, scroll position, safe areas and screenshot claims against the exact submitted build. Do not simply remove the draft stamp from these web captures.
4. Record native build/device/OS and capture source hashes in a new verified set, inspect every output, remove draft labeling only for that verified set, and upload through App Store Connect only when authorized.

The icon is a separate real 1024×1024 RGB export at `assets/brand/v2/icon.png` and is already configured in `app.json`; a rebuilt native binary is required to deliver it to the store/device. Existing v1 assets are preserved.
