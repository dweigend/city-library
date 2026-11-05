# NetLogo Web catalog experiment evidence

## Checkout and baseline — 2026-11-05

Dedicated bound worktree and branch confirmed at dfd0584; six commits ahead of origin/main are present. Plan committed as baa9c27; Segregation source and five frozen asserted public model scripts committed as 2682bfa. The initial first script failed with missing model.ts, as expected before runtime handoff. Example hashes are retained in examples/segregation/SHA256SUMS.

`bun run check` initially failed TS2688 because this new worktree lacked installed Bun type definitions. `bun install --frozen-lockfile` installed the existing pinned eight packages without changing dependency declarations. Repeated baseline `bun run check` passed: all type configurations, 103 tests, 35 existing scripts, browser-target build/declarations and packed Bun/Node/ambient-free TypeScript consumer. This was before adding Segregation to the normal example runner and before its runtime; it establishes existing compatibility only.

GitHub: [Epic #1](https://github.com/dweigend/city-library/issues/1), [catalog capture #2](https://github.com/dweigend/city-library/issues/2), [Segregation #3](https://github.com/dweigend/city-library/issues/3), [draft PR #4](https://github.com/dweigend/city-library/pull/4). The draft includes six unpublished basis commits; no root checkout changes or merge.

## Segregation reference browser

Official launcher opened in the configured server Chromium through T3 preview automation, 1280×800. URL: https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Segregation.nlogox . The source bytes identify NetLogo 7.0.4; default density 95%, wanted similarity 30%, square-x visualization. No seed was set. Source SHA-256: b8d983db7d7aa68e4a1ac847ef69620e7e2bc017ccaaff472a9c1f881e89eb8a.

- Native setup button click: tick 0, 2467 residents, 427 unhappy, displayed similarity 50.3%, unhappy 17.3%. [Setup screenshot](netlogo-catalog-evidence/segregation-reference-setup.png).
- Ten native go-once clicks: tick 10, same 2467 residents, 5 unhappy, displayed similarity 75.5%, unhappy 0.2%. [Progress screenshot](netlogo-catalog-evidence/segregation-reference-tick10.png), opened and visually inspected.
- Browser DOM reports 551 select options: one placeholder and 550 model entries, with disabled entries included. This supports the served-list inventory; it does not establish individual model execution.

Screenshots show changing neighborhood clusters and the two different plots (percent similar, count unhappy). Target RNG differs, so these stochastic counts are observations, not target expected values. Reference tab closed after capture. No target browser acceptance or independent review is claimed by this section.

## Acceptance states

Per-row catalog statuses will distinguish inventory extraction, audited rules, implemented port, headless checks, browser checks and independent approval. Pending runtime/review work must remain pending. Existing four ports retain historical source and browser evidence; baseline tests above do not re-establish full scientific parity against a newly captured catalog revision.

## Segregation target browser and design QA

Verified in real server Chromium through the configured T3 browser automation, consuming this worktree's Bun server on port 3110. Port 3100 was already occupied (`EADDRINUSE`); that process was preserved. No browser fallback or source-only substitute was used.

At 1280×800, native Setup with defaults produced tick 0, 2483 residents, 424 unhappy, 49.5% similar. Native 10 steps produced tick 10, 2483 residents, 15 unhappy, 73.4% similar. [Setup](netlogo-catalog-evidence/segregation-target-setup.png) and [tick 10](netlogo-catalog-evidence/segregation-target-tick10.png) were captured again after indexed occupancy integration and opened for visual inspection. These are deterministic Mulberry seed-1 outcomes; the unseeded NetLogo reference above has different trajectories. Both show rising local similarity and falling unhappy counts; numerical equality is not claimed.

Native Run, wait for an actual changed tick, then Pause stopped at tick 11 (2483 residents, 17 unhappy, 73.5% similar). At 390×844, selected a resident on the canvas and used ArrowRight; the inspector exposed canonical group, happiness and neighbor counts, with canvas focus retained. Changing similarity to 0 then Tab gave All happy, 0 unhappy and disabled Run without changing tick 10; restoring 30 re-enabled execution. Immediate Run/Pause was also verified independently of the later waited tick-11 run. Invalid setup density 100 triggered native validation (`Value must be less than or equal to 99.`) and preserved the existing tick-11 model; density was restored to 95.

Mobile dark/light screenshots were captured after the indexed runtime and visually inspected: [dark](netlogo-catalog-evidence/segregation-mobile-dark-final.png), [light](netlogo-catalog-evidence/segregation-mobile-light-final.png). [Keyboard inspector](netlogo-catalog-evidence/segregation-mobile-dark-inspection.png) was captured before the equivalent index integration. No horizontal document overflow at either tested width. Runtime snapshots reported no console entries or failed network requests. All owned tabs were closed. No complete accessibility certification, other-browser testing or distribution-level scientific equivalence study is claimed.

Applied frontend-design and web-design-guidelines to experiments/segregation/ui.ts and its affected shared flow. Latest Vercel rules fetched successfully from the official raw source before review. Labels, native form validation, live status, keyboard selection, focus, source link/notice, responsive layout and both themes were inspected. No unresolved finding in this bounded new adapter. Shared chart axis text is small on mobile and exact source square/X glyphs and shape chooser remain explicit presentation differences; numerical happiness is available in the inspector and monitors.

## Indexed occupancy performance follow-up

Five public examples were committed as f5fd2f0 before runtime 7653491. No public syntax changed. Agent coordinates and World membership remain canonical; Grid's private derived cell buckets observe successful movement and membership changes, release their listener on detach, preserve World insertion order, and retain the explicit-source fallback/validation. No model-owned occupancy index or uniform-cell relocation was added.

Measured by the implementation agent: default setup 109.1 ms and first completed Segregation step 153.9 ms, compared with 3.66 seconds after scalar optimization and 14.35 seconds before it. Complete detached observations for ticks 0–3, removing only process-local resident IDs, matched the pre-index baseline exactly, including RNG continuation and history. Baseline JSON SHA-256: `7b332527a8441b38ac3c5de06e88ac9dec539a0d21b07401127b4dfdf04f4097`. The original pre-index comparison bytes are now permanently versioned in [the regression fixture](../../tests/fixtures/segregation-index-baseline.json), exercised by tests/segregation-continuation.test.ts; they are not a runtime dependency. Independent review of this new index is pending and is separate from d24d2f2 approval.

Coordinator executed final `bun run check` after the implementation agent's cleanup: all type configurations, **119 tests / 1124 assertions**, **45 public scripts**, browser-target build/declarations and packed Bun/Node/ambient-free TypeScript consumer passed. Earlier 112-test/40-script and 103-test/35-script counts above remain historical checkpoints.

## Scope update

The user narrowed active delivery to exactly 200 selected models on 2026-11-05. The full inventory remains 550; selection supplied by the root chat is pending import. Five implemented mandatory entries exist (the four baseline references and Segregation); 195 selected implementations remain once that required subset is validated. Full completion is not claimed. The 350 other rows will be explicitly outside current scope. Fire/Life/Percolation contracts and five asserted model scripts are prepared at 242cc12, with no runtime yet and no assumption that their selection is already approved.
