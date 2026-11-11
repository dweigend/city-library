# Independent settled screenshot review

Reviewed 2026-11-10. All 44 actual PNGs were independently inspected with `view_image`: eleven models, desktop/narrow, light/dark. The screenshot set is `/tmp/<slug>-<desktop|narrow>-<light|dark>-settled.png`. Slugs: city-land-use, city-daily-activities, city-energy, city-water, city-stormwater, city-biodiversity, city-materials, city-population, city-services, city-heat, city-finance.

Read docs/DESIGN.md, prior screenshot review and web-design-guidelines skill. Current Vercel rules were fetched successfully to /tmp/city-settled-vercel-guidelines.md and read. This review covers screenshots only. Coordinator reports Setup + 1 + 10 steps, fonts/frames/Fit readiness and no document overflow for all 44; those interactions and DOM measurements were not independently repeated. No keyboard/focus/assistive-technology/invalid-input/physics review or Antigravity substantial-design approval is claimed. No repository files were edited.

## Resolved earlier evidence issues

Selected model text is readable in all reviewed dark shots. All network views are populated. Full-page narrow images are 390 px wide with no extra blank right area. Earlier blank-network, transient theme and oversized-image findings are resolved by these captures. Stormwater basin text no longer overlaps its water rectangle; desktop output labels fit.

## Remaining findings

1. **P1 — city-services spatial labels overlap and clip.** `models/city-services/ui.ts:55-59`: all desktop and narrow shots merge adjacent household labels into one unreadable string. Narrow shots also clip East services at right. Shorten labels (H1 3/3 etc.), move detail to existing inspector and reserve margin for hub labels. Evidence: `/tmp/city-services-desktop-light-settled.png`, `/tmp/city-services-narrow-dark-settled.png` (same both themes).
2. **P1 — city-stormwater narrow Overflow still clips.** `models/city-stormwater/ui.ts:50`: the shortened Overflow label extends beyond the right canvas boundary at 390 px in both themes. Move the output node/label inward or use a shorter unambiguous marker plus existing monitor. Evidence: `/tmp/city-stormwater-narrow-light-settled.png`, `/tmp/city-stormwater-narrow-dark-settled.png`.
3. **P2 — city-water narrow default process diagram loses most labels.** `models/city-water/ui.ts:34-41`: both narrow themes show only Spill and Untreated labels; most nodes become small unlabeled dots in a large region. This is the shared renderer's intentional overlap suppression, not failed text color or a load failure. The desktop arrangement is readable. Choose a more compact/tall preset with shorter labels, or supply an immediately readable compact flow table and keep selection for details. Evidence: `/tmp/city-water-narrow-light-settled.png`, `/tmp/city-water-narrow-dark-settled.png`.
4. **P2 — city-land-use duplicates setup/live controls.** `models/city-land-use/ui.ts:11-14`: desktop shows Residential Demand and Residential target, Commercial Demand and Commercial target at identical values, with no visible timing distinction. Explicitly violates the no-duplicated-controls contract; keep conversionLimit as setup and one live binding per demand. Evidence: `/tmp/city-land-use-desktop-light-settled.png`, `/tmp/city-land-use-desktop-dark-settled.png`.
5. **P2 — energy table exposes technical keys and requires excessive horizontal scrolling.** `models/city-energy/ui.ts:48`: row spreads flow object into camelCase headers such as electricityDemandKwh, with most metrics outside view at both widths. Horizontal scrolling is correctly contained, so this is not page overflow. Prefer two columns with readable metric labels and values. Evidence: `/tmp/city-energy-desktop-light-settled.png`, `/tmp/city-energy-narrow-dark-settled.png`.
6. **P2 — categorical bar labels are skipped.** `models/city-daily-activities/ui.ts:41-47`: narrow cumulative-time bars omit Work/Services labels. `models/city-finance/ui.ts:31-37`: Latest annual flows labels only Tax revenue and Maintenance at desktop and narrow, leaving Service costs/Wear unlabeled. Shared chart tick-density suppression is suitable for numeric axes but leaves categorical bars ambiguous. Preserve category labels using compact readable names or offer an explicit category/value table. Evidence: `/tmp/city-daily-activities-narrow-light-settled.png`, `/tmp/city-finance-desktop-dark-settled.png`, `/tmp/city-finance-narrow-dark-settled.png`.
7. **P2 — intentional network-label suppression obscures energy/material endpoints.** `models/city-energy/ui.ts:18-24`, `models/city-materials/ui.ts:57-62`: Electricity demand/Heat demand and Reused/Disposed remain unlabeled at both widths/themes. Shared renderer deliberately hides colliding labels (ui/views/network.ts arrangeLabels), and the Inspect node chooser remains present. This is not a missing-label-data bug. However, the default schematic leaves terminal node meaning unclear. Prefer stable spacious positions or shorter labels so these six-node diagrams identify all endpoints without selection; alternatively verify and capture chooser/inspector identification. Evidence: `/tmp/city-energy-desktop-light-settled.png`, `/tmp/city-materials-narrow-dark-settled.png`.
8. **P2 — yellow scientific series are faint on light.** Battery inventory (energy), generated (materials), discharged (stormwater), mixed temperature (heat) use very bright yellow against white. Select a darker central indexed-palette entry for these series, preserving scientific distinctions. Evidence: `/tmp/city-energy-narrow-light-settled.png`, `/tmp/city-materials-desktop-light-settled.png`, `/tmp/city-stormwater-desktop-light-settled.png`, `/tmp/city-heat-narrow-light-settled.png`. This is palette selection in model views, not permission for local theme colors.

## Per-model result

- city-land-use: readable map/markers/charts; duplicate desktop controls remain.
- city-daily-activities: populated readable graph; narrow categorical chart labels remain incomplete.
- city-energy: readable monitors/charts; default network endpoints, technical wide table and yellow light series remain.
- city-water: clear desktop; narrow diagram lacks most labels.
- city-stormwater: basin overlap resolved; narrow Overflow clipping and faint yellow series remain.
- city-biodiversity: no visible screenshot blocker across all four captures.
- city-materials: populated graph; endpoint identities and faint yellow generated line remain.
- city-population: no visible screenshot blocker across all four captures. Numeric histogram axes skip intermediate values understandably; not the categorical-label issue.
- city-services: overlapping/clipped spatial labels block visual acceptance.
- city-heat: block labels and temperatures fit at narrow; faint yellow Mixed line on light remains. Same-color blocks at this state are consistent with declared >40°C threshold, not a defect.
- city-finance: charts/monitors readable; annual-flow bars require full category identification.

Overall screenshot acceptance remains open until confirmed issues are corrected and affected screenshots independently reviewed again. Passing screenshots alone would not establish browser interaction acceptance or scientific validity.

## Coordinator response after captures

Coordinator reports subsequent source fixes: removed duplicated land-use setup demand controls, converted energy table to Flow/kWh rows, moved stormwater endpoints inward from x=4 to x=2. These changes postdate the reviewed images. Findings 2/4/5 describe the prior captures; no independent reapproval is given without fresh screenshots.
