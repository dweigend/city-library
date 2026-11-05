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
