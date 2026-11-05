# A5a acceptance evidence

Verified on 5 November 2026. The delivered slice is the detached non-spatial Graph kernel and a headless illustrative network-diffusion composition, with an external HTML/Cytoscape observer. Remaining A2b/A3/A4 and broader A5 contracts are unchanged. See [assignment](a5a.md), [public usage](a5a-usage.md), [frozen examples](a5a-examples.md) and [operation coverage](coverage.md).

## Example-first and shell checks

Five A5a public scripts were written and SHA-256 fingerprinted before new runtime implementation. All five initially failed at the absent public Graph export. They now typecheck and execute unchanged, alongside the ten earlier public scripts. The examples prove canonical identities/representation/lifecycle, one-hop synchronous propagation and causal bridge/hub effects.

The model agent wrote eight focused behavioral tests before implementation, initially failing at the missing model module. A ninth test subsequently verifies exact aggregate-exposure draw schedules. The UI adds projection/playback checks; a coordinator regression test verifies separated display targets at population 200 after a browser finding.

The final coordinating `bun run check` passed:

- Strict library, development and UI TypeScript checks.
- 83 tests across ten files, including seven Graph boundary tests, nine diffusion model tests and the UI projection/playback/layout checks.
- All 15 public scripts, with the five A5a fingerprints unchanged.
- Browser-targeted headless ESM bundle and declarations.
- Packed consumer verification through Bun, Node ESM and ambient-free TypeScript, now also exercising public Graph membership, neighbors, framework-state copying and Agent-deletion edge cleanup.

Core source imports neither DOM nor Cytoscape. No external engine dependency was added for Graph. Graph/Edge use the existing identity and supported-state-copy protocol. Lifecycle deletion validates all graph guards before any World detachment or graph cleanup. Earlier frozen examples remain intact. `git diff --check` passed.

## Model behavior

Default setup: 60 nodes, seed 1, transmission 0.35, active duration 6. Communities contain deterministic cyclic contacts, with two explicitly switchable bridges. Counts and history are headless model observations, not renderer calculations.

Observed both headlessly and in the browser:

| Setup | Natural completion | Final unaware / active / settled | Contacts |
| --- | --- | --- | --- |
| Bridges enabled | Tick 23 | 0 / 0 / 60 | 122 |
| Bridges disabled before a fresh run | Tick 14 | 40 / 0 / 20 | 120 |

These are exact fixtures for this seed/rule, not a guarantee that every probabilistic connected cascade reaches everyone. With 12 nodes, transmission 1 and active duration 1, one browser step gives ring counts 9/2/1 and hub counts 0/11/1. This isolates topology rather than a visual animation.

## Real-browser acceptance

The coordinator used the shared real browser on `http://100.75.96.127:3100/`, inspecting 1280×800 desktop and 390×844 mobile screenshots in light/dark themes. The existing tailnet service was restarted to serve the final bundle; its DNS URL remains `http://davidserver.tail3ec2fe.ts.net:3100/`.

- Default Network diffusion shows all persistent contacts and three separate groups; actual active/settled states agree with HTML counts and the model-history trend. Natural completion returns Run to its disabled stopped state and displays completion feedback.
- Live bridge removal changes contacts 122→120 and removes the two dashed graph edges immediately without changing tick or existing adoption. A fresh no-bridge run produces the separate-group fixture above. Re-enabling bridges does not reset existing node state.
- Run advanced to tick 2; Pause held tick 3 unchanged through a subsequent 400 ms observation. Single/multiple step actions stop playback before acting. Reset/scenario replacement clears previous model identities/edges and history.
- Canvas selection of an unaware node in group 2 enabled Activate selected. Activation changed only model state/counts at tick 3, preserving tick. Native list Tab/Enter selected Agent 23 with retained solid focus and matching inspector/one canvas selection, preserving tick 5.
- Desktop/mobile resize retained all 60 node centers inside the fitted view; page scrollWidth equaled 390. The population-200 mobile view retained all 200 node centers, with 402 contacts and no horizontal page overflow after the layout correction. This is a supported UI-size check, not a benchmark or a claim that all overview labels remain readable without zoom/list inspection.
- Exchange still shows its actual last sampled pair: 200-agent test, tick 1, total energy 2000 and exactly one transient edge. Diffusion-only actions are hidden. Lifecycle still gives energy 5/tick 5 after five steps; copying creates a detached second node while World count stays one. Attach, failing step and delete preserve energy 4/tick 5, mark the copy deleted and disable its step controls. Lifecycle has no invented edges.
- Snapshots after the final bundle load reported no console errors or failed asset requests. HTML/CSS/JS were served locally. Frontend-design and web-design-guidelines were applied with current upstream criteria fetched.

Coordinator fixes discovered during browser acceptance:

1. Community rings used a fixed radius at large populations and nodes overlapped. Radius/separation now scale with group size; the minimum measured neighbor separation at population 200 is about 50 display units against a 25-unit node diameter. A regression test checks all pair separations and unchanged model readback.
2. The previous minimum zoom prevented the enlarged 200-node graph fitting on mobile. Lowering the display-only minimum zoom allows all 200 centers inside the fitted viewport.
3. Duplicate `active` class tokens could make Cytoscape retain an old `inspected` class when switching selection. Each state class is now supplied once; repeated native selection was rechecked to give exactly one inspected node matching the selected canonical ID.
4. New models now reset list scroll position as well as graph layout. Completion text offers activation only when unaware nodes remain; otherwise it offers a new model.

These checks do not establish exhaustive accessibility or cross-browser certification. Domain behavior is independently exercised headlessly; browser acceptance covers presentation and explicit action integration.

## Independent review and response

Antigravity `gemini-4-argon` independently audited Graph/state/lifecycle, headless model, UI layer boundaries and frozen fingerprints. It ran the full check command (82 tests at that point, fifteen scripts, build and packed consumer) and additional adversarial probes for null-prototype state, collection guards, loops and small topologies. It reported zero blockers. It did not perform browser/visual acceptance.

Optional notes requested final documentation synchronization and confirmed that the hidden legacy trend does not need clearing. Documentation now describes the delivered subset and default scenario. The coordinator's subsequent UI/layout corrections and regression test were verified by the final 83-test check and browser acceptance above; they are not a second independent approval.

Review: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/thread:delegated-task:command%3Amcp%3A7a8a1156-8ac2-4e0b-accd-cc90d623712d%3Adelegate-task%3A779cdbee-76c5-4f21-b1fd-238bd26284b8>.
