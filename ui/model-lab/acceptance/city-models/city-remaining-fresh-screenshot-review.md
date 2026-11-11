# Independent remaining and fresh screenshot review

Reviewed 2026-11-10. Read docs/DESIGN.md and the prior settled screenshot report. Inspected all 24 actual PNG files with view_image. No repository files changed. No browser interactions, keyboard/focus checks, assistive-technology checks, numerical/scientific validation, or substantial design approval are claimed.

## Screenshot inventory

First review for city-housing, city-mobility, city-economy and city-air-noise: `/tmp/<slug>-<desktop|narrow>-<light|dark>-settled.png` (16 files).

Fresh dark recheck for city-services, city-stormwater, city-land-use and city-heat: `/tmp/<slug>-<desktop|narrow>-dark-fresh.png` (8 files).

## Findings

1. **P1 — Mobility route diagram is unreadable in all four captures.** `models/city-mobility/ui.ts:23` passes small domain coordinates directly as initial network positions. The actual screenshots show one overlapping blue dot, no distinguishable stops, no labels and no visible route edges. Presentation positions need enough spacing for the existing pixel-based network renderer, without changing domain geometry. Evidence: `/tmp/city-mobility-desktop-light-settled.png`, `/tmp/city-mobility-narrow-dark-settled.png` (same all four).
2. **P1 — Housing and air/noise dark canvas evidence is incomplete.** Housing desktop-dark has an entirely blank spatial canvas; narrow-dark shows only home-1 and its marker. Air/noise desktop-dark also has an entirely blank spatial canvas; narrow-dark contains only the 200 m label. Light captures are populated and readable. These match the earlier canvas transition/capture symptoms; they do not establish that dark rendering works or that source is broken. Capture fresh dark navigation as done for the four models below, then independently recheck. Evidence: `/tmp/city-housing-desktop-dark-settled.png`, `/tmp/city-housing-narrow-dark-settled.png`, `/tmp/city-air-noise-desktop-dark-settled.png`, `/tmp/city-air-noise-narrow-dark-settled.png`.
3. **P2 — Employment graph hides most identities by default.** In desktop both themes, only two household labels and both firms remain labeled. In narrow both themes, only Household 5 remains labeled; even the two firm identities disappear. The graph is populated and the chooser offers an inspection path, but the default view does not identify the employer hubs. `models/city-economy/ui.ts:43-45` uses long labels without a stable spacious preset. Short identifiers and explicit positions, keeping full state in the inspector, would avoid the same collision suppression previously fixed for energy/materials. Evidence: `/tmp/city-economy-narrow-light-settled.png`, `/tmp/city-economy-desktop-dark-settled.png`.
4. **P2 — Air/noise exposure table spends width on unrounded numerical precision.** `models/city-air-noise/ui.ts:25-30` displays 15–18 digit floating-point values. At desktop only the first portion of Sound is visible; narrow shows only Distance/Air and part of Air exposure before internal horizontal scrolling. This is contained table scrolling, not page overflow. Format presentation values to scientifically useful precision and consider shorter column labels/metric rows so sound exposure is easier to find. Evidence: `/tmp/city-air-noise-desktop-light-settled.png`, `/tmp/city-air-noise-narrow-light-settled.png`.

## Fresh dark recheck results

- **city-services: screenshot pass for both fresh dark captures.** All H1–H4 and West/East labels are visible, separated and inside canvas. Symbols, served paths, monitors, charts and facility table are populated. Earlier blank-canvas evidence is superseded for these fresh captures.
- **city-stormwater: screenshot pass for both fresh dark captures.** Both sealed labels, basin, Outlet and Overflow are populated/readable. Overflow fits the narrow canvas; no overlapping basin text. Dark discharged line is visible after darker palette selection.
- **city-land-use: screenshot pass for both fresh dark captures.** All twelve parcel labels and both protection P markers are visible. Desktop has one live control per target and no duplicate setup demand controls.
- **city-heat: screenshot pass for both fresh dark captures.** All three block names/temperatures are visible and fit narrow. Temperature chart labels and three lines are readable.

The fresh rechecks cover dark only; light acceptance for these models belongs to the other final screenshot review. A populated fresh capture does not test switching themes during a running session.

## Per-model screenshot status

| Model | Status for reviewed set |
| --- | --- |
| city-housing | Open: light readable, dark evidence incomplete |
| city-mobility | Open: route graph unreadable in all captures |
| city-economy | Open: default graph identities suppressed, particularly narrow |
| city-air-noise | Open: dark evidence incomplete, table precision/readability issue |
| city-services | Fresh dark captures pass |
| city-stormwater | Fresh dark captures pass |
| city-land-use | Fresh dark captures pass |
| city-heat | Fresh dark captures pass |

These are independent screenshot findings and bounded screenshot approvals only. They do not constitute full UI interaction, accessibility, scientific or substantial design acceptance.
