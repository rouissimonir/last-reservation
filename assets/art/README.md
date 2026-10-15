# Bellweather artwork

Supplied PNG originals are preserved byte-for-byte. Runtime images live in `optimized/`; no remote images are used. The existing `visual/` sources remain available but are no longer imported by the app.

| Supplied source | Source size / mode | Bundled copy | Copy size / bytes |
| --- | --- | --- | --- |
| `bellweather-concierge-background.png` | 941×1672 RGB | `optimized/hotel-desk-background.jpg` | 941×1672 / 363,535 |
| `the-missing-envelope-cover.png` | 1448×1086 RGBA | `optimized/case-envelope.png` | 1000×750 / 1,073,726 |
| `private-handoff-evidence-folder.png` | 1254×1254 RGBA | `optimized/handoff-folder.png` | 630×630 / 639,268 |
| `evidence-paper-surface.png` | 1086×1448 RGB | `optimized/evidence-paper.jpg` | 600×800 / 53,179 |

Copies were created with Pillow: proportional Lanczos downsampling, optimized PNG for transparent foregrounds, optimized quality-88 JPEG for opaque scenery and texture. Total runtime artwork is 2,129,708 bytes versus 10,129,545 source bytes. Envelope/folder alpha spans 0–255, including transparent corners. Source images have no readable text, clue cards or interface controls. The envelope seal has a decorative diamond motif; it does not participate in the puzzle.

The background uses `cover` scaling with a centered crop and native contrast overlay. The envelope and identical neutral folder use `contain`. Paper uses `cover` at 0.32 opacity over ivory, clipped to a content-sized native surface. All headings, evidence and controls remain native components; decorative wrappers are hidden from accessibility and ignore pointer input.
