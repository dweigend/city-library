# B17 Mandelbrot public pure preflight

Executed 6 November 2026. Same bound branch/worktree and draft PR #11. This follow-up supersedes only Mandelbrot's temporary move/check/restore implementation described in the earlier architecture-remediation report. The other nine model implementations and their fresh target proofs remain unchanged. B17 is not marked integrated; required independent Argon review remains pending.

## Root provenance and integration

The accepted public examples preceded the library runtime: root af41b67 (five pure spatial probes) and a894caa (five canonical distance examples) were cherry-picked as b5d26b5 and 78fc115. Root 9771404 was cherry-picked as 1a7f635, providing the actual geometry.direction/normalize/distance implementations, root namespace export, tests and packed-consumer checks. Geometry source files are unchanged from the exact root commit; no model-private replacement was written.

Consumer/runner/config conflicts were resolved by adding the delivered geometry phases and preserving all existing B17/root phases. References and consumer checks for the absent normal phase were excluded. The existing 835e3fb TypeScript-to-JavaScript consumer fix remains: TypeScript type imports are transpiled before Node executes .mjs, and actual packed imports remain external. No normal implementation or local merge commit was introduced.

Mandelbrot runtime change: 7c474a8. Named source step/climb procedures now obtain public geometry.direction({heading:turtle.heading}), construct the ordinary intended point from direction×source distance, and call geometry.normalize(point,{space:world.space,endpoints:"half-open"}) before changing any Agent. A valid point is passed to public Agent.move({to:point}) exactly once. Invalid step destinations cause source random relocation; invalid climb jumps perform no movement. All prior probe moves, distance comparisons, rollback moves, hand-written endpoint checks and tolerance thresholds are removed. There is no private projection, trigonometry, wrapping or geometry API. The canonical 301×301 Grid, actual Agents, randomized source phase order and sole World.tick remain intact.

## Actual original endpoint policy

The pinned NetLogo 7.0.4 Mandelbrot original ran again in configured server Chromium 156.0.0.0. Its actual compiled session source SHA-256 was 0ea8fa62224aaa01c5462a7e7351ce0e7d28a8843d1a3b8004af36a20848bac5, matching the archived XML. Native Setup was followed by Command Center fixture commands creating one turtle and placing/orienting it explicitly. Original can-move?1 was read, then native `ask turtles [ jump 1 ]` was executed and its actual coordinates read. No original source was edited or replaced. [Exact observations](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/reference-endpoints.json) and [native command evidence](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/mandelbrot-reference-endpoint-fixtures.png) retain the commands/settings/results.

| Original fixture | can-move?1 | Actual jump1 outcome |
| --- | --- | --- |
| (149.5,0), heading90 |false|No move; x149.5|
| (−149.5,0), heading270 |true|x−150.5|
| (0,149.5), heading0 |false|No move; y149.5|
| (0,−149.5), heading180 |true|y−150.5|
| (−149.50000000005,0), heading270 |false|No move; x unchanged|

These executed source fixtures establish lower-inclusive/upper-exclusive hard endpoints on both axes, so the public half-open policy is appropriate. Impossible jump is a no-op, not a clipped move. The negative epsilon fixture also establishes a concrete limitation of the former distance-tolerance workaround: accepting its clipped negative endpoint was incorrect. A new model regression now requires relocation for this attempted step, with the exact original-style RNG draw policy. Exact negative endpoints remain accepted without relocation draws.

## Executed checks

- `bun run typecheck`: all four configured projects passed.
- `bun run test`:222 tests, 11242 assertions passed across 30 files.
- Focused Mandelbrot tests:7 passed,45 assertions; includes the existing canonical full-grid/shared-patch/upper-edge/blocked-jump checks and new negative-epsilon/accepted-negative-endpoint cases. Tests retain source preflight stops, RNG continuation and canonical Grid occupancy expectations.
- `bun test tests/spatial-probes.test.ts`:7 passed,284 assertions; validates pure operations, dimensional/options errors, canonical references, endpoint policy and no state/RNG/tick mutation.
- `bun run examples`: all configured phases passed, including the ten imported probes/distances examples. The five existing B17 scripts were additionally executed unchanged and passed. Their original SHA256SUMS and both imported five-example hash manifests passed.
- `bun run build` and `bun run consumer`: passed, including actual packed Bun, Node ESM and ambient-free TypeScript geometry checks; no TS-only type import was copied into raw .mjs.
- `git diff --check`: passed. No frozen script, original source, root ledger, research artifact or Epic status was edited.

The old and new target use different internal direction projections (public heading-derived vector versus the previously accumulated Agent orientation basis). Worker comparison of three sampled seed17/tick10 turtles reported differences up to approximately 2.84e−14 in y; this is not a full-trajectory identity study. The coordinator's [new eager-grid profile](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/eager-profile.json) observed 90601 Fields, 1500 Agents, tick10, 13403 computed patches and 14896 iterations at seed17, matching the previously recorded aggregate values. Observed setup 391.7ms, ten steps 416.6ms, read 73.3ms and process RSS 187756544 bytes are one host/process measurement, not a controlled speed claim. No sparse fallback or reduced model was used.

## Fresh target browser evidence

[New observations](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/target-observations.json) bind runtime 7c474a8 and root geometry 9771404/local1a7f635. The corrected Mandelbrot ran through native Setup,1 step, Run, Pause and Setup again in real Chromium. Default seed 1/1500 turtles/scale 100/throw 10 produced tick 1 with 1491 computed patches/1500 iterations, then paused at tick 5 with 7159/7495. Reset returned tick 0 and zero computed patches/iterations. Desktop 1280×800 and mobile 390×844 were separately exercised in light and dark mode; all measured overflow=false. These are CSS viewport checks, not touch-device certification.

- [Fresh setup](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/mandelbrot-target-setup.png)
- [Desktop light](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/mandelbrot-target-desktop-light.png), [desktop dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/mandelbrot-target-desktop-dark.png)
- [Mobile light](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/mandelbrot-target-mobile-light.png), [mobile dark](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/mandelbrot-target-mobile-dark.png)
- [Hidden computation with live throw0](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/mandelbrot-target-hidden-throw0.png)

After reset, 10 steps and Hide turtles produced tick 10/13466 computed patches/14933 iterations without adding a tick for hiding. Live throw 0 and another step reached tick 11/14601/16406 while hidden Agents continued computation. Final target diagnostics contained no console entries or failed network requests. Both separately owned original/target browser tabs were closed. Current web-design-guidelines were fetched; all four target viewport/theme screenshots and the original fixture screenshot were visually inspected. UI adapters and shared styles did not change in this follow-up.

All historical 96 PNGs and all 53 previous-remediation target PNGs were hash-checked unchanged. New images are appended under selected-probability-geometry-evidence, not substituted for earlier runs. [New image hashes](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/selected-probability-geometry-evidence/image-hashes.json) and runtime hashes retain their exact binding. Original-target stochastic trajectory equality, complete target trajectory identity and scientific distribution equivalence are not claimed.

## Integration handoff

Author-side status: all ten public compositions remain implemented; Mandelbrot now uses the actual root pure geometry closure and has fresh affected target evidence. Other nine runtime hashes are unchanged from the prior remediation. Root still owns global ledger/research/Epic reconciliation; B17 is not counted integrated here. Independent gemini-4-argon/high approval remains pending under the existing quota blocker, with no substitute or quota retry. No new batch, local merge, PR merge or publication was performed.
