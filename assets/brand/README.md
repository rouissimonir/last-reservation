# TWO SIDES launcher identity

The active identity is the illustrated brass keyhole in `v2/`, generated with the built-in ImageGen tool on 19 October 2026. Two facing profiles represent two perspectives. See `v2/PROMPTS.md` for the exact creation/edit prompts and `v2/README.md` for exports. `app.json` uses v2. The v1 files below are preserved originals; the older generator does not reproduce v2.

Original geometric artwork drawn for this project: two separate evidence leaves, a dividing slash and an Art Deco brass escutcheon. No third-party logo, fonts or clue text. The launcher uses an opaque RGB 1024×1024 PNG; the splash and adaptive/monochrome marks retain transparency. The operating system supplies the launcher mask.

Reproduce with `python scripts/generate-brand-assets.py` using Pillow. These are local design assets, not phone screenshots. Existing supplied hotel/envelope/folder/paper artwork in `assets/art/` is preserved. The unused Expo template assets remain as inherited source files, but app.json no longer points to them.
