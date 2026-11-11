# Independent corrected-model screenshot review

Reviewed 2026-11-10. Read `docs/DESIGN.md` and `/tmp/city-remaining-fresh-screenshot-review.md`. Inspected all sixteen actual PNGs with `view_image`: `/tmp/<slug>-<desktop|narrow>-<light|dark>-fresh.png` for `city-housing`, `city-air-noise`, `city-mobility` and `city-economy`. No repository edits, browser interaction checks, numerical/scientific checks or substantial design approval are claimed.

## Findings

1. **P1 — Housing dark canvas evidence remains incomplete.** `/tmp/city-housing-desktop-dark-fresh.png` shows an entirely empty spatial canvas. `/tmp/city-housing-narrow-dark-fresh.png` shows only home-1 and its green marker; remaining homes and unmet-demand rows are absent. Both light images show all six rows and occupied/unhoused markers. These actual fresh files therefore do not resolve the previous dark-rendering/evidence blocker. Determine why dark capture loses later draw operations; repeat actual screenshots and independent review after the fix. This report does not infer source defect versus capture defect from screenshots alone.
2. **P1 — Air/noise dark canvas evidence remains incomplete.** `/tmp/city-air-noise-desktop-dark-fresh.png` has an entirely empty spatial canvas; `/tmp/city-air-noise-narrow-dark-fresh.png` shows only the 200 m label, without receptors, sources, corridor or concentration annotations. Both light images show the complete schematic. Fresh navigation/five-frame readiness did not resolve the evidence blocker in these files.
3. **Air/noise precision correction verified.** All table values now use compact precision. The five-column exposure table still scrolls internally: sound columns lie beyond the initial narrow view and the final column is partly beyond the desktop half-width view. This is normal contained table scrolling, not document overflow or a new blocking regression. No table scrolling interaction was performed by this reviewer.

## Per-model independent screenshot approval

| Model | Screenshot result |
| --- | --- |
| city-housing | Open: light images readable; dark canvas incomplete |
| city-air-noise | Open: light schematic and rounded table readable; dark canvas incomplete |
| city-mobility | Pass for all four fresh images: three separate labeled stops, visible directed routes, readable monitors and charts |
| city-economy | Pass for all four fresh images: both firm labels and all eight household labels remain visible without overlap; populated employment edges, charts and monitors |

Mobility coordinate projection and economy tall layout corrections resolve their earlier screenshot findings. These bounded screenshot approvals do not establish complete accessibility, browser interaction acceptance, scientific validation or the required substantial design review.
