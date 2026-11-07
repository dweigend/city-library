# Mammoths theme and viewport canvas diagnosis

Diagnostic evidence only, 2026-11-06. This does not accept B08, establish scientific parity, or replace the pending independent Argon review. No runtime, renderer, model, configuration, ledger, or Git changes were made. The child server on port 3148 remains running; the diagnostic's own Chromium tab was closed.

## Finding

The reported disappearance was **not reproduced** in actual Chromium. The retained child climate-100 light and dark screenshots both contain mammoths and humans. Their decoded habitat-interior RGB bytes have the same SHA-256, `725f319822e1cb48f906146086576faa77947eaf43b8078bf9355effb41cd862`, despite different surrounding theme pixels. Each interior contains 2,121 pixels exactly matching mammoth brown and 92 matching human yellow. These are pixel counts, not population counts.

Fresh ordinary screenshots, saved before any `getImageData`, also contain agents in desktop light/dark and mobile dark/light. Within each viewport the habitat-interior RGB hashes match across themes. Later mobile screenshots are byte-identical to their respective pre-readback screenshots. Consequently, this run provides no evidence that a readback repairs anything, nor evidence of a renderer/compositor blank. It also cannot retrospectively identify why an earlier image viewer appeared empty. The previous Materials diagnosis documents an image-display inconsistency; that historical observation is not proof of this case's cause.

No shared renderer patch is proposed. A future failure should retain its ordinary PNG bytes and viewport/scroll metadata before any further action, then compare those bytes with a live canvas readback.

## Reproduction and identity

The workflow began with preview status, then a fresh owned tab (`reuseExistingTab: false`), without touching child tabs. Target: `http://localhost:3148/?experiment=mammoths`, child worktree `/home/david/.t3/worktrees/city-library/experiment-selected-evolution-b08`. Chromium reports Chrome 156 on Linux, DPR 2. The theme method was the actual preview `prefers-color-scheme` override, not injected CSS.

Native inputs were set to seed 1, 900 mammoths, 50 humans, mammoth/human birth rates 0, mammoth speed 0.2, human speed 0.3, odds of killing 12, and climate-change decay chance 100. Native Setup produced month 0 and 950 agents. Native **10 steps** produced month 10, 485 mammoths and 41 humans (526 total), hunting deaths 13, climate deaths 330. Run was never started. Those monitor values and the canvas agent-count accessibility label stayed unchanged through the subsequent theme, resize, readback and scroll actions.

Sequence: desktop 1440×1050 light Setup screenshot; ten steps and ordinary light screenshot; dark override and immediate ordinary screenshot; resize to 390×844, native scroll down 400 CSS pixels, ordinary dark screenshot; light override and immediate ordinary screenshot. Only then was the first canvas readback performed. Follow-up captures/readbacks covered mobile dark, desktop dark and desktop light after resize. A final native scroll restored the full desktop habitat.

[Loaded modules and input values](evolution-canvas-diagnosis-evidence/current-loaded-modules.json) record build endpoint value `1793970441683`, current fetched bootstrap SHA `5cea43b967f4bdf49c8ab959cc5d779c94e4056ba5348d215c7dbfa703e48dca`, shared app chunk `app-shg8ggtp.js` SHA `51c2db44ec3165d6bcfc98de2e15a7a08a1ea9d0fe6b75479934fbc2748d4589`, and Mammoths UI chunk `ui-n4s9dnev.js` SHA `8491af70867df94d05289e9154cc5cfe44a16f6c426799843f6ba36f28da32f8`. The latter two match the child's retained module record; the bootstrap hash differs, so it is recorded as a fresh fetch rather than relabeling the old evidence. The loaded UI chunk contains `B08-mammoths-native-mask-composition-v1`.

[Current source hashes](evolution-canvas-diagnosis-evidence/current-source-files.json): model `7407a963392fb6f5d3e7c72a96ce97765b448991adc43b24b4e55255d1dfb675`; model UI `7ee6280993302b1a6f20cf7d5e722431b84214a9cca8c0a94a72de332abbc3bf`; shared canvas `68793f7b6296177526148a060c1165ccd022109b09c0dc3de9e8a9c38bf56a3e`; compose `90dae7fb39ae679d7a7822f71013090ad2495dbe90853b8dd89b2ba530ec368b`.

## Pixel and layout evidence

| Evidence | Exact brown / yellow pixels in habitat interior | Interior RGB SHA-256 |
| --- | --- | --- |
| Retained child light and dark | 2,121 / 92 each | `725f319822e1cb48f906146086576faa77947eaf43b8078bf9355effb41cd862` |
| Fresh ordinary desktop light and dark | 2,126 / 91 each | `3f0daf3f786fe2cb2ffcb63ec2bc585e52e7e06444da2903cdc43800b69f50d1` |
| Fresh ordinary mobile dark and light | 24,941 / 1,283 each | `257c969a3d920bebfddb8060523f77517633bcabf5c2470b84f950f0ac43a727` |

The desktop PNGs are 1280×933 although the CSS viewport is 1440×1050; mobile PNGs are 780×1688 for CSS 390×844. The ROI script derives target screenshot coordinates from each capture's recorded canvas rectangle and actual PNG width, clipping to the screenshot bounds and excluding a one-pixel border. Retained child/source ROIs are explicitly bounded manually. Full-image color counts include plot strokes and must not be treated as agent-only measurements. [Decoded PNG statistics, bounds and file hashes](evolution-canvas-diagnosis-evidence/canvas-roi-png-stats.json) and [reproduction script](evolution-canvas-diagnosis-evidence/measure_png_rois.py) preserve the distinction.

The ordinary desktop pair has scrollY 9 and canvas CSS rect `(328,106,672,672)`, backing 1344×1344. The mobile pair has scrollY 409 and rect `(16,264.578125,358,358)`, backing 716×716. In both cases the entire habitat is within the viewport. After resizing back to desktop, preserved scrollY 349 places its top at y=-234. These explicitly named `after-resize` screenshots therefore clip its northern portion, including all visible yellow human pixels; the full canvas readback still contains humans. Native scroll to 0 restores the full habitat at `(328,115,672,672)`. This is a demonstrated viewport crop, not a disappearing-agent event.

The [first mobile light RGBA readback](evolution-canvas-diagnosis-evidence/mobile-light-first-readback.json) has SHA `9e0eff0440011ebbce7e23e2afaf00fae07cfa9746a3c4115f8db02893a55dee`, 24,941 exact brown pixels, 1,283 yellow pixels and zero transparent pixels. The [mobile dark readback](evolution-canvas-diagnosis-evidence/mobile-dark-readback.json) is identical. The full desktop RGBA SHA is `6effb8cb4911135d7736d14794a8c1ea34e1933b52b8979ca2a8dc8b9213e047` in [dark](evolution-canvas-diagnosis-evidence/desktop-dark-readback.json) and [light](evolution-canvas-diagnosis-evidence/desktop-light-readback.json), with 27,807 exact brown and 1,448 yellow pixels. Different viewport buffers have different rasterization; their counts/hashes are not compared for equality.

All inspected canvas/ancestor layers report visible display, opacity 1 and no transform. Canvas background remains RGB(21,21,21). Body/text colors change with theme, while the field and agent colors stay fixed. Each layer's computed colors, rectangle and overflow are retained in the readback JSONs. No additional canvas layer hides the agents.

Mobile whole-file hashes are unchanged before/after readback: light `9465b6e164c673588478f3ee9601774c95a218595f63e318051ae24e58ae6853`; dark `90552fe5aa3081098f7a47a17d0e9184aed5ea619da819a3d2f7ec66413f6042`. The readback effect observed here is a Chromium performance warning, not pixel recovery.

## Bounded source inspection and limitations

The Mammoths UI emits fixed brown `#8c541f` circles (size 5), yellow `#ffdf00` circles (size 4), and fixed terrain colors. The shared renderer draws cells before agents; each agent uses save/restore and an explicit fill color. Its ResizeObserver adjusts the backing buffer and redraws the retained observation. These inspected paths contain no theme branch or random draws. This supports the measured stable palette; it is source inspection, not a new runtime contract.

The live model instance and its RNG state are closure-owned by compose. No public browser inspection hook exposes that instance. The model's public read observation includes `randomState`, but it was not reachable through the target UI in this diagnostic. Therefore **live RNG equality was not measured**. No hidden model mutation, duplicate shadow model or private debug API was introduced. Stable monitors, accessibility count and pixel hashes are the actual browser observations.

The child's existing source progress PNG was inspected individually and copied unchanged as [retained source progress](evolution-canvas-diagnosis-evidence/retained-source-progress.png). Its habitat ROI contains 11,775 pixels in an explicitly defined broad brown range; target exact brown is not its native palette. This is a visibility check only. That source screenshot belongs to the child's original tick-20, 813-mammoth/54-human fixture with climate 0.003 and nonzero birth rates, not this target climate-100 fixture. No source mobile run, same-seed trajectory equality or renewed source baseline is claimed.

[Final browser diagnostics](evolution-canvas-diagnosis-evidence/final-browser-diagnostics.json) contain no console error, one expected `willReadFrequently` performance warning after repeated readbacks, and the recorded recent network/action entries. Older network entries were omitted by the preview tool; this is not a complete network archive. No compilation/typecheck/test pass is claimed: this was a read-only browser and source diagnosis with Python PNG decoding/JSON validation. Native model functional coverage, source transfer decisions and pending independent Argon review remain separately owned by the B08 work.

Individual ordinary images: [desktop light](evolution-canvas-diagnosis-evidence/climate100-desktop-light-normal.png), [desktop dark](evolution-canvas-diagnosis-evidence/climate100-desktop-dark-immediate.png), [mobile dark](evolution-canvas-diagnosis-evidence/climate100-mobile-dark-normal.png), [mobile light](evolution-canvas-diagnosis-evidence/climate100-mobile-light-immediate.png). These were retained before readback. Exact file hashes for every artifact are in [the manifest](evolution-canvas-diagnosis-evidence/manifest.json).
