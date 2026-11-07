# Syntax-refactor evidence

Read the [delivery report](../syntax-refactor-report.md) for decisions and code samples. The evidence files separate checks that run in different environments:

- `checks.json`: executed shell commands, totals, source checkpoints and remote-CI limits.
- `display-equivalence.json` and `projection-equivalence.json`: old/current declaration callbacks evaluated on identical real-model observations. The audit runners are retained alongside them; run with Bun from the repository root. Their deliberately erased capture types are audit instrumentation, not public library contracts.
- `catalog-browser-smoke.json`: actual Svelte setup/one-step outcomes for all 125 present entries.
- `production-browser-flows.json`: actual Wealth and Taxi monitor states, live edit, playback and restart.
- `browser-matrix/`: forty fixture flows, twelve actual PNGs and independent visual review.
- `image-inventory.json`: saved dimensions of all sixteen retained PNGs.
- `contract-review.md` and `source-review.md`: independent findings, responses and approval limits.

The `wealth-before-desktop.png` checkpoint predates this runtime/type extension. The other three top-level PNGs show production states after refactoring. They are not pixel-diff pairs: viewport, seed or simulation step can differ. The explicit same-observation projection comparison supplies the semantic equivalence evidence.
