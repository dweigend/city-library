# Finance condition label: browser evidence

Browser evidence for commit `3146da7f` (`models/city-finance/ui.ts`, condition label moved below the tile). At 390 px, the neutral selection frame previously crossed the top of the selected asset's condition label. Coordinator evidence with a separate independent image inspection. No model rule, action, measurement or history changed.

## Checked flow

The coordinator ran `bun run dev` and opened `?model=city-finance` in its own T3 preview tab at CSS 390×844, light. It made real clicks on Run, waited, then clicked Pause at year 104. At that point all 12 assets were below 0.4, and asset-6 had been repaired for 500 CU this year. The coordinator focused the asset inventory with a real click and selected asset-6 with keyboard arrows. The final real ArrowLeft and ArrowRight presses left asset-6 selected. The inspector showed asset-6 with condition 0.250, repaired 500 CU and a late repair. The same state was captured in dark at 390×844 and in light at 1366×768. Two animation frames were allowed to settle before each capture.

Measured document overflow was 0 at both sizes, and no "Update Lab" notice was visible. The PNGs are unedited viewport captures at DPR 2. The tab was closed afterwards and the dev server was stopped. An earlier capture taken before the run was discarded, because copying files into `ui/` while the server was running had triggered the Update Lab notice.

## Images

All images are in [`../screenshots/city-models/revision-2-finance-label/`](../screenshots/city-models/revision-2-finance-label/).

| File | View | SHA-256 |
| --- | --- | --- |
| [finance-selected-narrow-light.png](../screenshots/city-models/revision-2-finance-label/finance-selected-narrow-light.png) | 390×844, light | `152edeb01fd4b6b90860eeb17fbd7e293bd8b4245216561d1cdec3f4025d761d` |
| [finance-selected-narrow-dark.png](../screenshots/city-models/revision-2-finance-label/finance-selected-narrow-dark.png) | 390×844, dark | `4978c0c2a9d4fe86fb8c7cb666fe857c0de8d7c8d7ddee8194216e367d2d1ffd` |
| [finance-selected-desktop-light.png](../screenshots/city-models/revision-2-finance-label/finance-selected-desktop-light.png) | 1366×768, light | `cf094b810206fd2737c99aa9a5b8a1b5f789e248e580dac373d3ece366e18d12` |

## Independent inspection

A fresh Claude Opus 5.5 subagent with read-only scope inspected the three images.

Verdicts:

| Image | Verdict |
| --- | --- |
| Narrow light | APPROVED WITH NOTES |
| Narrow dark | APPROVED WITH NOTES |
| Desktop light | APPROVED |
| **Overall** | **APPROVED WITH NOTES** |

Findings:

- **Label clear of the frame:** in all three views, the selected label "0.250" is fully readable, and the selection frame neither crosses nor touches it.
  - At 390 px the gap is about 3 CSS px, which is tight but clear.
  - At 1366 px the gap is about 30 CSS px.
- **No regressions:**
  - First-row labels stay about 35 CSS px above the second-row tiles.
  - Nothing is clipped at the canvas edges, and the frame stays inside the canvas.
  - Dark page chrome is themed correctly.
  - Charts, KPIs and captions are readable.
- **Open low-severity note (cosmetic, not addressed in this change):** at 390 px the amber repair bar covers the top dashed edge of the selection frame. The corners and sides still mark the frame, and the bar and the "+500" label stay legible. At 1366 px they touch by at most about 1 px. The reviewer suggested a few CSS px more spacing as optional polish.
