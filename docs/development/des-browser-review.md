# DES browser verification

## Method and boundary

Verified all ten DES experiments in the running Svelte Agent Lab at `http://localhost:3211` on 2026-11-09, using a separate owned T3 preview Chrome tab. No other agent's browser tab or model session was touched. The implementation was based on the frozen examples and refactor `7773dd9`; the one UI correction below was reloaded and rechecked before capture.

The coordinator attempted the configured Playwright MCP headless Chromium first. It aborted with SIGABRT because `/usr/local/libexec/codex-playwright/chrome_sandbox` did not meet the required root ownership/mode 4755. No system security settings were changed. These results are **real Chrome browser checks through T3 preview**, not a claimed Playwright MCP pass or a source-only substitute. Shell builds, typechecks and independent code review remain separate evidence.

Read the repository DESIGN contract and the frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines skills. Retrieved current Vercel review rules from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`. The existing shared Svelte/shadcn host supplies controls, themes, responsiveness and rendering; no custom component or CSS was added.

## Executed flows

For **every** experiment: navigate to its catalog entry, click Setup, inspect initial monitors/ledgers, click 1 step, capture four views, click Run, observe time advance and Running state, click Pause and observe Paused state. The default initial and running/paused observations are retained in [the manifest](des-browser-evidence/manifest.json).

| Experiment | Additional actual browser interactions and observed result |
| --- | --- |
| Civic office | Setup with 2 residents; Add resident; change live clerks to 2 and blur. At time 0: 2 busy desks, 1 waiting. Ten steps complete all 3, with completion times 2, 2, 4. |
| EV charging | Add priority vehicle; cancel waiting vehicle; increase chargers to 3. Waiting falls to 0, charging rises to 3, abandoned remains 1. Ten steps complete 3 sessions without reviving the cancelled vehicle. |
| Goods buffer | Produce 3 crates immediately: stored 2, blocked 1. Collect once: stored remains 2, blocked becomes 0 and collected becomes 1. |
| Bus interchange | Dispatch an additional bus and increase live berths to 2. At minute 10 all 3 have departed; ledger departures 7, 7, 9 and route cost remains 5. |
| Parcel logistics | Add parcel: 3 ledger rows, 1 blocked sender. Ten steps show 2 delivered, blocked senders 0 and the van still occupied during its return leg. |
| Waste collection | Setup truck capacity 1; click 100 steps. Delivered 12, remaining 0 and on-truck 0. |
| Emergency dispatch | Increase live responders to 3. Busy teams 3, waiting 0; after ten steps completion times are 4, 8, 6 and all teams are released. |
| Bike redistribution | Setup truck capacity 1; ten steps deliver 4 relocated bikes in trips at 1, 3, 6, 10 while total bikes remains 6. |
| Water allocation | Step once, Add 3 supply units, step; delivered becomes 9 and unmet 3. Add again and step: supply/delivered 12, unmet 0. |
| Machine maintenance | Advance four minutes: operational 0, waiting repairs 2. Increase live repair teams to 3 and advance three minutes: operational 3, completed repairs 3. After the label correction, hard reload, setup, step, edit live teams and advance again; numeric spatial labels remain readable. |

Common host checks: filter the catalog, open/dismiss its dropdown with Escape and verify focus returns to the Experiment control with the visible 3px focus ring. Tab from Setup to Run; Enter toggles Run/Pause while retaining keyboard focus. Switch from a running civic model to EV through the actual catalog dropdown: the new entry shows Setup to begin, Run disabled, no old model monitor or continued playback. Narrow Parameters opens and closes; numeric controls remain legible. A negative civic resident setup value is natively invalid and does not replace the existing model: its time/occupancy remain at their prior values. A wide narrow-screen machine table scrolls horizontally within its container (`scrollLeft=129`) while document width remains 390 CSS pixels.

## Screenshots and findings

The [evidence directory](des-browser-evidence/) contains **40 primary PNGs**: every experiment at desktop **1366×768 CSS pixels** and narrow **390×844 CSS pixels**, in light and dark. The preview service resamples desktop PNGs to 1280×720; narrow PNGs are 780×1688 at device scale 2. The manifest records CSS viewport and physical PNG dimensions separately, computed theme/background, visible state, unique source artifact path and SHA-256. Target artifacts were checked byte-for-byte against their unique source files.

Primary screenshots show each default model after one step. Two supplemental PNGs show narrow Parameters open, and the final narrow machine labels/ledger after stepping. All primary captures reported zero document horizontal overflow and no console error entries. Large ledgers use their existing local horizontal scroll container; vertical page scrolling remains available. Models with empty initial ledgers display empty tables without invented measurements.

Findings and responses are distinct from independent approval:

1. **Capture timing:** independent inspection identified low-contrast text and apparently absent spatial markers in immediate theme-switch captures. Waited 500ms plus two animation frames after each theme change and recaptured all 40. Settled computed input/table/combobox text matches the intended theme. No persistent renderer defect was reproduced. Reopening an overwritten filename also exposed stale image-tool caching; independent reinspection uses the final unique `sourcePath` and file hashes. Initial captures are superseded and are not acceptance evidence.
2. **Narrow optional machine labels:** Labels-on combined machine number and status, causing overlap/clipping at 390 CSS pixels. Changed only its presentation label to `String(machine.number)`; the full status remains in the machine ledger. Hard-reloaded, repeated the affected flow and recaptured all four maintenance defaults plus the supplemental Labels-on view. Frozen model example 10 passed after this change. No scientific/model rule, public action or expected assertion changed.

An independent screenshot inspection is recorded separately by the coordinator's image-review agent. This report establishes the browser author's executed checks and remediation, not that agent's approval, complete accessibility certification, scientific calibration or Playwright MCP availability.
