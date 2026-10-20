# TWO SIDES · keyhole identity

Created with built-in ImageGen on 19 October 2026. The brass keyhole combines ivory and burgundy facing profiles, a warm central seam and an ink-navy background. No game clue, envelope, text, third-party mark or font is baked into the symbol.

`source/keyhole-master.png` is the preserved opaque 1254×1254 generation. `source/keyhole-cutout.png` is the separately generated transparent edit; its small material/detail differences are part of that image edit. Original tool outputs remain in the local `.codex/generated_images` directory as well. Exact prompts are in `PROMPTS.md`.

Run `python scripts/export-brand-v2.py` from the app root with Pillow to reproduce technical exports:

- `icon.png`: 1024×1024 RGB PNG, opaque, square, no pre-rounded tile corners. Used by Expo and for the iOS app icon. The build must be rebuilt to include the launcher/splash changes.
- `favicon.png`: 64×64 RGB PNG.
- `splash-mark.png`: 1024×1024 RGBA, isolated emblem fitted to 820px.
- `adaptive-foreground.png`: 1024×1024 RGBA, isolated emblem fitted to a 510px central safe region.
- `monochrome.png`: white silhouette with the adaptive foreground alpha, for themed Android icons.

Pillow performs size, canvas, color-mode and monochrome exports only. Creative artwork and background extraction were done by ImageGen. The operating system supplies launcher masking. Existing v1 brand files and all game artwork are preserved. iPhone launcher/splash appearance still requires a native build/device check.

Launch animation: `launch/left.png` and `launch/right.png` (600px RGBA) are a straight crop of `splash-mark.png` at its seam (x 518 of 1024), made by `python scripts/export-launch-halves.py`. Stacked, they reproduce the emblem exactly.
