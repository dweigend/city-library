# Independent DES screenshot review

This reviewer did not implement the ten models or capture the screenshots. The review applies [DESIGN](../DESIGN.md), the global frontend-design and web-design-guidelines skills, and the [current Vercel review rules](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), fetched on 2026-11-09. It examines actual PNG images, not source code as a substitute for rendering.

## Evidence and scope

The [browser manifest](des-browser-evidence/manifest.json) identifies ten models with desktop and narrow screenshots in both light and dark themes. The declared CSS viewports are 1366×768 and 390×844. Preview saves desktop PNGs at 1280×720 and narrow PNGs at 780×1688; these physical image dimensions are distinct from the verified CSS viewport dimensions.

The browser verifier exercised the real T3 Chrome application. The configured Playwright MCP Chromium failed to launch because its SUID sandbox helper was misconfigured. This review does not convert that failure into a Playwright pass. Browser interaction, focus, keyboard behavior and numerical correctness have separate evidence; a still image cannot establish them.

## Finding and response

**High — first capture series contained unsettled theme colors.** The first civic, charging and other screenshots showed near-black input/selection/table values on black backgrounds in dark mode, and pale control/table text on light backgrounds. Some dark spatial panels appeared empty while the matching light image had visible markers. This series was not suitable for approval.

The issue was reported to the coordinator and browser verifier before acceptance. The verifier confirmed stable computed dark foreground `oklch(0.985 0 0)` after waiting 500 ms and two animation frames, and replaced all forty images after that settling interval. This was a capture defect; no application source change was needed.

All forty replacements were independently reopened through the manifest's unique original `sourcePath` artifacts. SHA-256 comparison confirmed that each repository-target PNG was byte-identical to that original artifact. An initial full-frame interpretation of dark spatial panels was misleading; opening unique originals and inspecting a six-panel crop at original resolution confirmed the markers. A further crop of the final maintenance narrow-dark image confirmed three white marker centers (`srgb(255,255,255)`). The suspected persistent renderer defect was withdrawn before any renderer source change.

**Response verified:** input values, the selected experiment name, buttons and table bodies are legible in the final light/dark images. The waste, bicycle and maintenance spatial panels show their expected occupied positions in both themes and viewport sizes. This finding is closed for the final series.

**Medium — maintenance labels overlapped and clipped when enabled at narrow width.** In the first supplementary minute-ten Labels-on image, full strings such as `2: operational` and `3: repairing` overlapped, with the final label clipped at the right canvas boundary. The machine ledger already supplied complete status values. The browser verifier applied the coordinator-approved compact numeric canvas labels in `experiments/des-machine-maintenance/ui.ts:14`, leaving full status in the ledger.

**Response verified:** the fresh unique Labels-on image shows separated, complete labels `1`, `2` and `3`, with no right-edge clipping. All four maintenance default screenshots were recaptured after the presentation change and independently re-opened. This finding is closed. No domain behavior, public action or frozen expected result changed.

## Inspected final images

Every row below includes all four PNGs using the stem shown plus `-desktop-light.png`, `-desktop-dark.png`, `-narrow-light.png` and `-narrow-dark.png`, under `des-browser-evidence/`. Exact original and repository paths are in the manifest.

| Image stem | Independent visual result |
| --- | --- |
| `des-civic-office` | Four images inspected. Readable service ledger, queue line, monitors and capacity/action controls. |
| `des-ev-charging` | Four images inspected. Session ledger and occupancy monitors are readable. The one-sample line chart has no segment yet; its numeric occupancy is visible in the monitor. |
| `des-goods-buffer` | Four images inspected. Stock chart and empty collection ledger are coherent at minute one; actions and labels remain readable. |
| `des-bus-interchange` | Four images inspected. Three route nodes and labels fit, controls remain visible, and the narrow layout stacks results. |
| `des-parcel-logistics` | Four images inspected. Delivery graph fits and its labels are legible; monitors wrap without collision. |
| `des-waste-collection` | Four images inspected. Six occupied collection positions are visible against the spatial canvas in light and dark modes. |
| `des-emergency-dispatch` | Four images inspected. Four named locations and graph connections remain distinguishable at both sizes. |
| `des-bike-redistribution` | Four images inspected. Three station positions and the inventory bars are visible; the truck can coincide with a station in this captured state. |
| `des-water-allocation` | Four images inspected. Grouped demand/supply bars, labels and ledger text are readable; the narrow ledger uses its horizontal content area. |
| `des-machine-maintenance` | Four images inspected. Three machine positions, availability monitor and machine ledger are visible; the narrow table retains its horizontal content area. |

No overlap, unintended document-width expansion, clipped playback action, unreadable final-theme control value or missing final spatial content was found in the final series. Vertical scrolling and table-local horizontal scrolling are intentional for larger result sets. Default narrow screenshots show the shared Parameters control collapsed; its open state was inspected separately.

## Supplementary states

- `maintenance-narrow-dark-parameters-open.png`: independently opened the unique original. Repair Minutes, Failure Minutes and Repair Teams labels/values are visible; controls fit and the results follow below the expanded form.
- `maintenance-narrow-dark-labels-ledger.png`: independently opened the corrected unique original. Numeric machine labels fit; the below-fold machine ledger and event trace remain readable. Wide machine-table columns continue in their local horizontal region. The verifier separately records successful local scrolling to `scrollLeft = 129`, with document width still 390; this reviewer did not rerun that interaction.

These two final images and their original source paths/hashes are recorded in the manifest. The earlier long-label image was not approved.

## Independent status

**Approved for the 42 final captured states:** forty default screenshots plus the two supplementary narrow states. Both recorded findings have verified responses and no visual finding remains open in this scope. The initial theme-transition series and the earlier long-label image are superseded and were not approved.

This scoped visual verdict does not establish keyboard behavior, complete accessibility compliance, numerical/scientific validity, a successful Playwright MCP run or final substantial code/design approval. Those remain separately documented gates. This reviewer made no model, UI or renderer edits.
