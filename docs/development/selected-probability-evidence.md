# B17 executed transfer evidence

Historical runtime evidence at ea2cdd6. Integration-coordinator architecture findings prevent integration/acceptance; see [active remediation](selected-probability-remediation.md). These images do not verify the subsequent corrected runtime.

Executed 5–6 November 2026. Issue [#9](https://github.com/dweigend/city-library/issues/9), under Epic #1. Scope is exactly the ten fixed B17 catalog paths. **10 implemented; 10 headless-verified; 10 target-browser-verified; 10 original-baseline comparisons; 0 independently reviewed; 10 technical reviews pending.** This is a scoped integration handoff, not final acceptance of the 200-model catalog.

## Source and execution basis

Each exact served XML matches inventory.json, the completed scientific dossier, and its local source.nlogox. [Ledger](selected-probability-ledger.json) records exact identity, upstream Galapagos revision 90be931773fcf499049247a8aaa1aecbe003654c, complete license notice, control inventory and evidence links. Full Procedures/Widgets/Info remain unchanged; full Info is also preserved in each NOTICE.md. No research or root progress files changed. Source model version is NetLogo 7.0.4. The launcher runtime is separately pinned by actual compiler/engine hashes in [loaded source hashes](selected-probability-evidence/loaded-source-hashes.json); an engine version number was not inferred from the model file. All ten compiled session source-string hashes were independently read in Chromium and match the archived bytes.

Both systems ran in the configured T3 server Chromium 156.0.0.0, Linux. Original and target desktop viewport 1280×800 CSS pixels. Target mobile viewport 390×844; these are viewport checks, not emulated touch-device certification. Target light/dark media settings were applied through preview tools. All ten targets were exercised through native controls: Setup, 1 step, Run, Pause, Setup again, plus the recorded special actions. Setup recreates the canonical model instance and resets its stream/time. Reference actions vary with their original Widgets and are listed per model.

Original RNG seed was not explicitly set. Target default is public Mulberry32 seed 1; an additional Birthdays seed 2 setup is recorded. Different algorithms, call schedules and activation orders prohibit cross-RNG trajectory identity claims. Comparisons here concern the stated mechanisms, deterministic setup quantities, invariants and meaningful control outcomes. No statistical distribution-equivalence study or scientific validation is claimed. Existing dossiers remain contextual research evidence.

The original and target screenshots are retained separately and as compact paired PNGs (original left, target right). Pairs are scaled for review; originals retain their captured viewport crop, which can exclude lower widgets in tall original layouts. Mobile PNGs were reduced to CSS-pixel dimensions without changing content. Domain views were scrolled into view on mobile; setup controls are retained in separate setup captures. [Image hashes](selected-probability-evidence/image-hashes.json) bind every retained PNG.

## Executed checks

- `bun install --frozen-lockfile`: installed the existing pinned development dependencies; no manifest/lock change.
- `bun run typecheck`: passed after all changes.
- `bun run test`:178 tests, 4370 assertions passed. Focused B17 tests: 20 tests, 423 assertions (9/324 first group, 11/99 last group).
- `bun run examples`: passed the existing configured 15 scripts. All five `examples/selected-probability/*.ts` were additionally executed directly and passed.
- `sha256sum -c examples/selected-probability/SHA256SUMS`: all five unchanged examples passed; original freeze commit 160db6d preceded delegated runtime.
- Explicit strict TypeScript check of all five B17 examples with local TypeScript 7.0.2 (`--ignoreConfig --noEmit --strict --target esnext --module esnext --moduleResolution bundler --allowImportingTsExtensions --types bun --skipLibCheck`): passed.
- `bun run build`: passed. `bun run consumer`: packed Bun, Node ESM and ambient-free TypeScript consumers passed. No build output or dependencies are committed.
- `git diff --check`: passed.

## Browser findings, corrections and limits

[Reference observations](selected-probability-evidence/reference-observations.json) and [target observations](selected-probability-evidence/target-observations.json) retain actual settings, observed ticks/reporters and actions. [Diagnostics](selected-probability-evidence/diagnostics.json) distinguishes tool introspection errors from model runtime errors. The final owned-tab console collections contained no entries, and the final source snapshot reported no failed network requests. No source or target procedure/runtime error was observed in the tested flows. Unavailable original reporters can display N/A (notably empty CLT and initial zero-denominator monitors); target nullable/safe display adaptations are explicit in the contracts.

The frontend-design and web-design-guidelines skills were applied. Current Vercel rules were fetched. All desktop/mobile/theme screenshots were visually inspected directly or in contact sheets. No horizontal overflow was measured at either viewport. Inspection found overlapping long mobile monitor values in combinations; the shared CSS now uses a two-column mobile definition list with wrapping. All ten affected responsive captures were repeated. Keyboard drawing/focus was exercised; canvas focus-visible produced a solid outline. Three Doors shading was corrected so higher switching tendencies remain darker. These are scoped author QA findings and fixes, not independent approval or a complete accessibility certification.

The executed Partition live-target check exposed a transfer error: an initial guard rejected negative remaining space, while NetLogo random accepts a negative bound. The guard was removed, original signed candidates/rejected-trial ticks were retained, a focused regression test was added, and the affected target flow repeated. [Original negative draw](selected-probability-evidence/partition-reference-live-negative.png) and [target signed draws](selected-probability-evidence/partition-target-live-negative.png) document the correction.

## Model comparisons

| Model | Actual original progression | Comparison and limits | Paired evidence |
| --- | --- | --- | --- |
| birthdays | Tick 1:23 people,0 successes. | Sorted 23-person rooms and duplicate flags; stochastic successes differ as expected. | [Setup](selected-probability-evidence/birthdays-paired-setup.png), [progress](selected-probability-evidence/birthdays-paired-progress.png) |
| galton-box | Tick 213:75 balls; all released. | Target terminal tick 205:75 balls; individual falls, counters and pile stop, with different random trajectories. | [Setup](selected-probability-evidence/galton-box-paired-setup.png), [progress](selected-probability-evidence/galton-box-paired-progress.png) |
| binomial-rabbits | Tick 20:2400 rabbits, unwrapped mean−0.023333. | Target reached tick 20; goOneHop then21 and live scale 2 then22. Exact equality stop retained. | [Setup](selected-probability-evidence/binomial-rabbits-paired-setup.png), [progress](selected-probability-evidence/binomial-rabbits-paired-progress.png) |
| three-doors | Tick 86:300 racers, done=true. | Target terminal tick 90; informed host, persistent switching hunch and completed-step global stop. | [Setup](selected-probability-evidence/three-doors-paired-setup.png), [progress](selected-probability-evidence/three-doors-paired-progress.png) |
| stochastic-patchwork | Tick 370:370 trial percentages, current green4/9. | Target live100% gave9/9, live0% gave0/9 while retaining earlier trials. No distribution-equivalence claim. | [Setup](selected-probability-evidence/stochastic-patchwork-paired-setup.png), [progress](selected-probability-evidence/stochastic-patchwork-paired-progress.png) |
| expected-value | Tick 1:expected total 30, sample total 30, runs 2, cumulative mean15. | Target setup expected30/runs 1/zero; tick 1 total 29/runs 2, later tick 5 total 26/runs 6. Correlated walk retained. | [Setup](selected-probability-evidence/expected-value-paired-setup.png), [progress](selected-probability-evidence/expected-value-paired-progress.png) |
| partition-permutation-distribution | Tick 1:addend48/current48. Live target2 then tick 2:addend−25, current48. | Target tick 1:addend46/current46. Live target2 and10 trials produced tick 11, current46, last addend−20; rejected signed trials retained. | [Setup](selected-probability-evidence/partition-permutation-distribution-paired-setup.png), [progress](selected-probability-evidence/partition-permutation-distribution-paired-progress.png) |
| central-limit-theorem | Setup empty. Preset 1:434 people. Tick 1:sample mean14.4/sum144, expected value15. | Target same434-person preset; five samples, sample-mean stddev3.273. Empty sampling does not tick; random population/drawing/sums exercised. | [Setup](selected-probability-evidence/central-limit-theorem-paired-setup.png), [progress](selected-probability-evidence/central-limit-theorem-paired-progress.png) |
| random-combinations-and-permutations | Color mode,3×1,two choices. Tick 0:203 attempts,23 ordered and23 multiset successes. | Target default dice edited through keyboard:5 attempts,1/1 successes. Additional matching color configuration:200 attempts,2 samples of100, means11.5/11.5. Tick remains0. | [Setup](selected-probability-evidence/random-combinations-and-permutations-paired-setup.png), [progress](selected-probability-evidence/random-combinations-and-permutations-paired-progress.png) |
| mandelbrot | Tick 249:1500 turtles, scale 100, throw 10. | Target tick 200:78044 computed patches/246167 iterations. Hiding turtles leaves tick unchanged; hidden turtles continue at throw 0 to tick 201. | [Setup](selected-probability-evidence/mandelbrot-paired-setup.png), [progress](selected-probability-evidence/mandelbrot-paired-progress.png) |

## birthdays

Identity: `Sample Models/Mathematics/Probability/Birthdays`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/Birthdays.nlogox); [headless model](../../experiments/birthdays/model.ts), [UI](../../experiments/birthdays/ui.ts), [full notices](../../experiments/birthdays/NOTICE.md). Source SHA-256: `f2e65811be0efbf4da935af5d9dae0f74ebf6b02cfa31a0db874e87fe8c66009`.

Original world: x-4…4, y-11…11; wrapX=false, wrapY=true. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [first-group contract](selected-probability-first-contract.md).

Executed original actions: Setup, Go once.

Target setup monitors: `{"Tick": "0", "Successes": "0", "Success rate (%)": "0.00"}`. Target single-step monitors: `{"Tick": "1", "Successes": "1", "Success rate (%)": "100.00"}`. Paused progression: `{"Tick": "5", "Successes": "3", "Success rate (%)": "60.00"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Seed2 Setup and fresh sorted room: `{"Tick": "1", "Successes": "0", "Success rate (%)": "0.00"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/birthdays-target-desktop-light.png), [desktop dark](selected-probability-evidence/birthdays-target-desktop-dark.png), [mobile light](selected-probability-evidence/birthdays-target-mobile-light.png), [mobile dark](selected-probability-evidence/birthdays-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## galton-box

Identity: `Sample Models/Mathematics/Probability/Galton Box`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/Galton%20Box.nlogox); [headless model](../../experiments/galton-box/model.ts), [UI](../../experiments/galton-box/ui.ts), [full notices](../../experiments/galton-box/NOTICE.md). Source SHA-256: `39df3f1d9edd12a141f62c3cd36ae1ae5c62d5dab72750c55ad66e2374229fd4`.

Original world: x-17…17, y-30…30; wrapX=false, wrapY=false. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [first-group contract](selected-probability-first-contract.md).

Executed original actions: Setup, Run, Pause.

Target setup monitors: `{"Tick": "0", "Balls": "0", "State": "Active"}`. Target single-step monitors: `{"Tick": "1", "Balls": "1", "State": "Active"}`. Paused progression: `{"Tick": "5", "Balls": "3", "State": "Active"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Live100% right with pile disabled; 100actual motion steps: `{"Tick": "100", "Balls": "50", "State": "Active"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/galton-box-target-desktop-light.png), [desktop dark](selected-probability-evidence/galton-box-target-desktop-dark.png), [mobile light](selected-probability-evidence/galton-box-target-mobile-light.png), [mobile dark](selected-probability-evidence/galton-box-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## binomial-rabbits

Identity: `Sample Models/Mathematics/Probability/Binomial Rabbits`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/Binomial%20Rabbits.nlogox); [headless model](../../experiments/binomial-rabbits/model.ts), [UI](../../experiments/binomial-rabbits/ui.ts), [full notices](../../experiments/binomial-rabbits/NOTICE.md). Source SHA-256: `e40418be852b206f11c8dec06eabd1923b384ef113f61e6612d813b27f480e17`.

Original world: x-22…22, y0…44; wrapX=true, wrapY=false. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [first-group contract](selected-probability-first-contract.md).

Executed original actions: Setup, Go one hop, Run to terminal.

Target setup monitors: `{"Tick": "0", "Mean": "0.000", "X scale": "44", "Y scale": "0.000"}`. Target single-step monitors: `{"Tick": "1", "Mean": "-0.025", "X scale": "44", "Y scale": "3416.667"}`. Paused progression: `{"Tick": "5", "Mean": "-0.003", "X scale": "44", "Y scale": "2122.222"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Go preflight stops at original hops20: `{"Tick": "20", "Mean": "0.092", "X scale": "44", "Y scale": "1205.556"}`.
- Go one hop bypasses equality stop and advances to21: `{"Tick": "21", "Mean": "0.077", "X scale": "44", "Y scale": "1105.556"}`.
- Live scaling2 gives xScale88 and Go resumes beyond equality: `{"Tick": "22", "Mean": "0.114", "X scale": "88", "Y scale": "1127.778"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/binomial-rabbits-target-desktop-light.png), [desktop dark](selected-probability-evidence/binomial-rabbits-target-desktop-dark.png), [mobile light](selected-probability-evidence/binomial-rabbits-target-mobile-light.png), [mobile dark](selected-probability-evidence/binomial-rabbits-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## three-doors

Identity: `Sample Models/Mathematics/Probability/Three Doors`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/Three%20Doors.nlogox); [headless model](../../experiments/three-doors/model.ts), [UI](../../experiments/three-doors/ui.ts), [full notices](../../experiments/three-doors/NOTICE.md). Source SHA-256: `8788aa01450222b6e33d5bf5e5b50c0ea494160946f3051332a1bb2514a47d14`.

Original world: x-35…35, y-35…35; wrapX=true, wrapY=false. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [first-group contract](selected-probability-first-contract.md).

Executed original actions: Setup, Run, Pause.

Target setup monitors: `{"Tick": "0", "State": "Racing"}`. Target single-step monitors: `{"Tick": "1", "State": "Racing"}`. Paused progression: `{"Tick": "5", "State": "Racing"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Race terminal source-style stop at tick 90: `{"Tick": "90", "State": "Race finished"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/three-doors-target-desktop-light.png), [desktop dark](selected-probability-evidence/three-doors-target-desktop-dark.png), [mobile light](selected-probability-evidence/three-doors-target-mobile-light.png), [mobile dark](selected-probability-evidence/three-doors-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## stochastic-patchwork

Identity: `Sample Models/Mathematics/Probability/ProbLab/Stochastic Patchwork`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Stochastic%20Patchwork.nlogox); [headless model](../../experiments/stochastic-patchwork/model.ts), [UI](../../experiments/stochastic-patchwork/ui.ts), [full notices](../../experiments/stochastic-patchwork/NOTICE.md). Source SHA-256: `17ed2522164bcf7e92ffb5665b3c9a427640fbf7908ef332e985f8b06db99b2f`.

Original world: x-10…10, y-10…10; wrapX=true, wrapY=true. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [first-group contract](selected-probability-first-contract.md).

Executed original actions: Setup, Run, Pause.

Target setup monitors: `{"Tick": "0", "Target color": "0"}`. Target single-step monitors: `{"Tick": "1", "Target color": "8"}`. Paused progression: `{"Tick": "5", "Target color": "5"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Live probability100 yields all9 target patches: `{"Tick": "1", "Target color": "9"}`.
- Live probability0 yields0 target patches while retaining history: `{"Tick": "2", "Target color": "0"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/stochastic-patchwork-target-desktop-light.png), [desktop dark](selected-probability-evidence/stochastic-patchwork-target-desktop-dark.png), [mobile light](selected-probability-evidence/stochastic-patchwork-target-mobile-light.png), [mobile dark](selected-probability-evidence/stochastic-patchwork-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## expected-value

Identity: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Expected Value`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Expected%20Value.nlogox); [headless model](../../experiments/expected-value/model.ts), [UI](../../experiments/expected-value/ui.ts), [full notices](../../experiments/expected-value/NOTICE.md). Source SHA-256: `84883dc6b6538fd5d9e04e61cc68a01cec5c11a528aaab5a84250908425b98eb`.

Original world: x-7…7, y-7…7; wrapX=true, wrapY=true. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [last-group contract](selected-probability-last-contract.md).

Executed original actions: Setup with apart animation, Go Once.

Target setup monitors: `{"Tick": "0", "Expected value": "30.000", "Runs": "1", "This sample total": "0", "Mean of samples": "0.000", "Calculation": "10 × (0 × 0/16 + 1 × 1/16 + 2 × 6/16 + 3 × 5/16 + 4 × 0/16 + 5 × 4/16 + 6 × 0/16)"}`. Target single-step monitors: `{"Tick": "1", "Expected value": "30.000", "Runs": "2", "This sample total": "29", "Mean of samples": "14.500", "Calculation": "10 × (0 × 0/16 + 1 × 1/16 + 2 × 6/16 + 3 × 5/16 + 4 × 0/16 + 5 × 4/16 + 6 × 0/16)"}`. Paused progression: `{"Tick": "5", "Expected value": "30.000", "Runs": "6", "This sample total": "26", "Mean of samples": "25.000", "Calculation": "10 × (0 × 0/16 + 1 × 1/16 + 2 × 6/16 + 3 × 5/16 + 4 × 0/16 + 5 × 4/16 + 6 × 0/16)"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Black-out plus sample then Clear selection preserves tick 1 and totals: `{"Tick": "1", "Expected value": "30.000", "Runs": "2", "This sample total": "29", "Mean of samples": "14.500", "Calculation": "10 × (0 × 0/16 + 1 × 1/16 + 2 × 6/16 + 3 × 5/16 + 4 × 0/16 + 5 × 4/16 + 6 × 0/16)"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/expected-value-target-desktop-light.png), [desktop dark](selected-probability-evidence/expected-value-target-desktop-dark.png), [mobile light](selected-probability-evidence/expected-value-target-mobile-light.png), [mobile dark](selected-probability-evidence/expected-value-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## partition-permutation-distribution

Identity: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Partition Permutation Distribution`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Partition%20Permutation%20Distribution.nlogox); [headless model](../../experiments/partition-permutation-distribution/model.ts), [UI](../../experiments/partition-permutation-distribution/ui.ts), [full notices](../../experiments/partition-permutation-distribution/NOTICE.md). Source SHA-256: `d19201a4109c7314ad2dd2bf26c00ea4631a6ee5a3ce4d096a4d7a4680815aa3`.

Original world: x-50…50, y-1…1; wrapX=true, wrapY=true. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [last-group contract](selected-probability-last-contract.md).

Executed original actions: Setup, Add Once.

Target setup monitors: `{"Tick": "0", "Successes": "0", "Running total": "0", "Previous addends": "", "Addend": "0"}`. Target single-step monitors: `{"Tick": "1", "Successes": "0", "Running total": "46", "Previous addends": "", "Addend": "46"}`. Paused progression: `{"Tick": "5", "Successes": "1", "Running total": "57", "Previous addends": "46 + 14 + 12", "Addend": "12"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Live target2 below current46 retains rejected signed draws and advances to tick 11: `{"Tick": "11", "Successes": "0", "Running total": "46", "Previous addends": "", "Addend": "-20"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/partition-permutation-distribution-target-desktop-light.png), [desktop dark](selected-probability-evidence/partition-permutation-distribution-target-desktop-dark.png), [mobile light](selected-probability-evidence/partition-permutation-distribution-target-mobile-light.png), [mobile dark](selected-probability-evidence/partition-permutation-distribution-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## central-limit-theorem

Identity: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Central Limit Theorem`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Central%20Limit%20Theorem.nlogox); [headless model](../../experiments/central-limit-theorem/model.ts), [UI](../../experiments/central-limit-theorem/ui.ts), [full notices](../../experiments/central-limit-theorem/NOTICE.md). Source SHA-256: `0b28357e33b60122cadc80abdc4826cd000f8fbcdf18a67eed9c75053cced92c`.

Original world: x-15…15, y-15…15; wrapX=true, wrapY=true. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [last-group contract](selected-probability-last-contract.md).

Executed original actions: Setup, Preset 1, Go Once.

Target setup monitors: `{"Tick": "0", "Population": "0", "Samples": "0", "Expected value": "N/A", "Std dev means": "N/A", "Std dev sums": "N/A", "State": "Ready"}`. Target single-step monitors: `{"Tick": "1", "Population": "434", "Samples": "1", "Expected value": "15.000", "Std dev means": "N/A", "Std dev sums": "N/A", "State": "Ready"}`. Paused progression: `{"Tick": "5", "Population": "434", "Samples": "5", "Expected value": "15.000", "Std dev means": "3.273", "Std dev sums": "N/A", "State": "Ready"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Empty Setup cannot sample; no tick, explicit insufficient-population message: `{"Tick": "0", "Population": "0", "Samples": "0", "Expected value": "N/A", "Std dev means": "N/A", "Std dev sums": "N/A", "State": "There are not enough people to take a sample of this size."}`.
- Keyboard drawing adds one person without advancing tick: `{"Tick": "0", "Population": "1", "Samples": "0", "Expected value": "15.000", "Std dev means": "N/A", "Std dev sums": "N/A", "State": "There are not enough people to take a sample of this size."}`.
- Random population action resets samples and populates columns: `{"Tick": "0", "Population": "407", "Samples": "0", "Expected value": "14.192", "Std dev means": "N/A", "Std dev sums": "N/A", "State": "Ready"}`.
- Also sums enables sum standard deviation after10 samples: `{"Tick": "10", "Population": "407", "Samples": "10", "Expected value": "14.192", "Std dev means": "3.367", "Std dev sums": "33.667", "State": "Ready"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/central-limit-theorem-target-desktop-light.png), [desktop dark](selected-probability-evidence/central-limit-theorem-target-desktop-dark.png), [mobile light](selected-probability-evidence/central-limit-theorem-target-mobile-light.png), [mobile dark](selected-probability-evidence/central-limit-theorem-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## random-combinations-and-permutations

Identity: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Random Combinations and Permutations`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Random%20Combinations%20and%20Permutations.nlogox); [headless model](../../experiments/random-combinations-and-permutations/model.ts), [UI](../../experiments/random-combinations-and-permutations/ui.ts), [full notices](../../experiments/random-combinations-and-permutations/NOTICE.md). Source SHA-256: `a5c22544e455bb150941529bab9e2c3798fe73adf1fdeae92dc868c9e3ecef38`.

Original world: x-2…2, y-2…2; wrapX=true, wrapY=true. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [last-group contract](selected-probability-last-contract.md).

Executed original actions: Set dice off, Setup, Create Combi start/stop, Search start/pause.

Target setup monitors: `{"Search attempts": "0", "Steps in sample": "0", "Samples": "0", "Combination successes": "0", "Permutation successes": "0", "Mean combination": "N/A", "Mean permutations": "N/A", "Ratio": "N/A", "Instructions": "OK, you have created a 3-by-1 block. Now press Create Combi."}`. Target single-step monitors: `{"Search attempts": "1", "Steps in sample": "1", "Samples": "0", "Combination successes": "0", "Permutation successes": "0", "Mean combination": "N/A", "Mean permutations": "N/A", "Ratio": "N/A", "Instructions": "The program guesses combinations randomly and tracks matches."}`. Paused progression: `{"Search attempts": "5", "Steps in sample": "5", "Samples": "0", "Combination successes": "1", "Permutation successes": "1", "Mean combination": "N/A", "Mean permutations": "N/A", "Ratio": "N/A", "Instructions": "The program guesses combinations randomly and tracks matches."}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- Color mode with sample100 produces two samples after200 attempts; Hide/Reveal and bar/line controls preserve counts: `{"Search attempts": "200", "Steps in sample": "0", "Samples": "2", "Combination successes": "0", "Permutation successes": "0", "Mean combination": "11.500", "Mean permutations": "11.500", "Ratio": "1.00", "Instructions": "The program guesses combinations randomly and tracks matches."}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/random-combinations-and-permutations-target-desktop-light.png), [desktop dark](selected-probability-evidence/random-combinations-and-permutations-target-desktop-dark.png), [mobile light](selected-probability-evidence/random-combinations-and-permutations-target-mobile-light.png), [mobile dark](selected-probability-evidence/random-combinations-and-permutations-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## mandelbrot

Identity: `Sample Models/Mathematics/Fractals/Mandelbrot`. [Original launcher](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Fractals/Mandelbrot.nlogox); [headless model](../../experiments/mandelbrot/model.ts), [UI](../../experiments/mandelbrot/ui.ts), [full notices](../../experiments/mandelbrot/NOTICE.md). Source SHA-256: `0ea8fa62224aaa01c5462a7e7351ce0e7d28a8843d1a3b8004af36a20848bac5`.

Original world: x-150…150, y-150…150; wrapX=false, wrapY=false. Source setup parameters are the original defaults shown in the observation JSON, except combinations uses dice=false for the reference run. Target uses canonical descriptors and seed 1 unless an extra action explicitly changes them. Setup-only/live boundaries, equations/order, stop/tick semantics, reporter meanings and deviations are in the [last-group contract](selected-probability-last-contract.md).

Executed original actions: Setup, Run, Pause.

Target setup monitors: `{"Tick": "0", "Computed patches": "0", "Total iterations": "0"}`. Target single-step monitors: `{"Tick": "1", "Computed patches": "1491", "Total iterations": "1500"}`. Paused progression: `{"Tick": "5", "Computed patches": "7131", "Total iterations": "7493"}`. Run/Pause succeeded; subsequent Setup returned the initial reporters.

- 200steps; Hide turtles preserves computation and tick: `{"Tick": "200", "Computed patches": "78044", "Total iterations": "246167"}`.
- Hidden turtles continue computing at live throw 0, tick 201: `{"Tick": "201", "Computed patches": "78115", "Total iterations": "247279"}`.

Responsive/theme evidence: [desktop light](selected-probability-evidence/mandelbrot-target-desktop-light.png), [desktop dark](selected-probability-evidence/mandelbrot-target-desktop-dark.png), [mobile light](selected-probability-evidence/mandelbrot-target-mobile-light.png), [mobile dark](selected-probability-evidence/mandelbrot-target-mobile-dark.png). All measured overflow=false. Independent review: pending.

## Independent review and handoff

Required Antigravity gemini-4-argon/high review remains pending for all ten transfers and the monitor CSS adjustment under [the documented quota blocker](connectivity-transfer-review-blocker.md). There are no independent findings or approvals for this B17 scope. Coordinator fixes, passing checks, scientific dossiers and paired browser runs do not substitute for that gate. No provider/model substitution or quota retry was attempted. Root integration owns subsequent review, progress/research/Epic updates and cherry-pick decisions; no root merge, merge to main or publication is performed here.
