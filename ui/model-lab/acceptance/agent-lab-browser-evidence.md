# Agent Lab historical browser evidence

This portable summary preserves the browser report dated 5 November 2026. Commit `dfd0584` is a preserving checkpoint, not an identification of the exact bytes tested. This documentation repair performs no new browser run and grants no new acceptance or independent approval.

## Scope and observations

The original checks used real Chromium through the shared T3 browser against the Bun server on port 3101, at desktop 1280 × 800 and mobile 390 × 844 CSS pixels. Light and dark appearance were actually emulated. Coverage included light desktop and dark mobile for all four catalog models, plus selected mobile/light and desktop/dark Wolf Sheep and Wealth views; it did not cover every viewport/theme combination.

All four models loaded through the HTML catalog and lazy JavaScript chunks. Setup, bounded stepping and Run/Pause were exercised, including both Wolf Sheep modes. The target runs used seed 1. Recorded counts are observations, not universal predictions:

| Model | Setup (tick 0) | Progress |
| --- | --- | --- |
| Preferential Attachment | 2 nodes, 1 edge | Tick 25: 27 nodes, 26 edges |
| Voting | 151 × 151; blue 11,326, green 11,475 | Tick 20: blue 10,952, green 11,849; total 22,801 |
| Wolf Sheep, basic | 51 × 51; 100 sheep, 50 wolves | Tick 20: 161 sheep, 52 wolves |
| Wolf Sheep, grass | 51 × 51; 100 sheep, 50 wolves; grass/4 = 328 | Tick 20: 110 sheep, 48 wolves; grass/4 = 321 |
| Wealth Distribution | 51 × 51; 250 people; wealth 8,027; Gini 0.278 | Tick 20: 250 people; wealth 13,334; Gini 0.444 |

PA Layout, Fit and keyboard selection preserved tick/counts; editing its seed draft preserved the live state. Voting live rule edits did not advance time; invalid width 0 blocked Setup and retained observations. Wealth growth editing preserved the live tick, and shared field readers were corrected to reuse the edited value on Setup. Keyboard checks covered skip-link focus/navigation, native controls and canvas selection without stepping. Inspected mobile inputs/selects had labels. A 9 × 3 Voting world rendered at 358 × 119 CSS pixels with 27 cells.

## Historical fixes and limits

The report recorded fixes and retests for automatic development navigation (replaced by explicit Reload updates), stale lazy chunks and catalog switch recovery, empty inspectors, oversized agent sprites, inappropriate grid-only Labels, dark population-curve contrast and mobile inspector overflow. Cross-rebuild catalog switching passed after host restart; old diagnostic failures were distinguished from new requests. Selected-agent mobile light/dark retests retained tick 20 and document scrollWidth 390. All four models had no horizontal document overflow at 390 CSS pixels after correction. PA startup framing was also corrected.

Reference comparisons observed network growth/hubs, Voting region formation, Wolf Sheep populations with grass/4 scaling, and Wealth landscape/distribution/history/Lorenz/Gini views. Target renderers use neutral symbols; Wealth deliberately treats population as an initial condition. Cytoscape labels still used fixed #777 at 11px rather than the theme token, a minor source finding. The report found no remaining blocking issue in exercised flows, without claiming broad contrast or accessibility compliance.

## Reference provenance and comparison caveat

The existing [portable reference record](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/reference-sources/browser-evidence.json) records NetLogo Web captures. Reference model files identified NetLogo 7.0.4, while pinned repository sources identified 7.1.0-alpha1; the prior source audit reported matching procedure text and structurally matching widgets. Reference seeds were not fixed, so screenshots compare mechanisms and presentation, not identical stochastic trajectories.

The original progressed Wolf Sheep grass reference retained a tick-0 HUD despite progressed curves/populations: it is historical evidence, not tick-20 HUD proof. A later native-control capture showed tick 268, 217 sheep, 50 wolves and grass/4 = 197, with energy labels on, Go stopped and default rule/population parameters. That later reference superseded the misleading HUD capture as progressed-state evidence; tick 268 is not a same-horizon numeric comparison with the target tick 20. PA/Voting/Wealth reference HUDs showed ticks 25/20/20 respectively.

No screenreader, cross-browser, physical touch-device or prolonged performance certification was performed. Monitors and keyboard inspection do not make raster canvases fully screenreader equivalent. Historical observations do not validate later runtime changes; this summary adds neither a browser retest nor independent approval.
