# iPhone-framed App Store layout drafts

Five 1320×2868 RGB PNGs in `en-US/` now place the existing real gameplay captures inside a generated black titanium iPhone-style frame. `contact-sheet.jpg` previews the set; `manifest.json` records source/output hashes and exact capture placement. Original captures and generic-frame layouts remain preserved in `../screenshots-drafts/`.

Run `python scripts/render-store-drafts.py --iphone-frame` from the app root with Pillow and the existing Windows system fonts. The isolated hardware asset and exact ImageGen prompt are in `../device-frames/`. AI generated only the empty frame. The renderer inserts the complete real screenshot, scaled proportionally, without repainting clue text, inventing interface elements or covering content with the camera island. It asserts full interior clearance and exact preservation of resized capture pixels.

**These remain web-based layout drafts.** The publisher confirmed these represent the current code and has not yet built the native iOS version. That does not verify native fonts, safe areas, status bars, scrolling or layout. Compare all five states against the resulting iOS build; replace captures when needed, record native evidence and remove draft markings only after that comparison. No App Review approval or native accuracy is claimed. Each current image retains its visible draft footer and false native/submission-readiness flags.

Frames and overlays are permitted in principle under Apple's accurate-metadata guidance; the depicted experience still must accurately match the submitted app: https://developer.apple.com/app-store/review/guidelines/#accurate-metadata . The illustrated device is not an official Apple template or endorsement.
