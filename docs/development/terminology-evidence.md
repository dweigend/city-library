# Terminology migration evidence

6 November 2026. Active application checkout: `experiment/netlogo-web-catalog`. The binding source is [Agent Loom terminology](../agent-loom/terminology.md), derived from the API inventory/reference. This is a naming migration, not a new runtime capability.

The audit covered active library/model/UI TypeScript, public examples, tests and current documentation. Experimental model APIs and consumers now use agents, fields and edges instead of interchangeable NetLogo turtles, patches and links. Partial parameter updates use `changes`. Agent Lab spelling is consistent. Host callbacks use `frame`; World tick and model step remain distinct by contract. `defineUI`, `advance(steps)` and `run(world, step, steps)` retain their accepted syntax. Preferential graph generation retains its binding `links` option; source URLs, titles, upstream JSON fixture keys, native procedure quotations and historical evidence remain attributable.

Executed checks:

- `bun run typecheck`: passed, including Svelte checks with zero errors/warnings.
- `bun run test`: 565 passed, zero failed; 150683 assertions.
- `bun run examples`: passed.
- `bun run build` and `bun run consumer`: passed; packed Bun/Node ESM/ambient-free TypeScript consumers verified.
- Targeted materials and urban feedback tests after final diagnostic wording: 24 passed, zero failed.
- `git diff --check`: passed.
- Main checkout `bun run typecheck`: passed after its shared glossary/playback update.

Real browser: own Vite host on port 5181. Mandelbrot Setup, 1 step and Hide agents verified the migrated public bindings: tick 0→1, 1491 computed fields, 1500 iterations; Hide agents removed rendered agents without advancing time. Directed Network Setup and 10 steps rendered transferred values through the migrated edge inputs/observations.

Screenshots visually inspected by the implementing agent:

- Desktop 1366×768: `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw535mjl-374e2ee3.png`.
- Narrow 390×844: `/home/david/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mw535ujr-a6af6582.png`.

Migrated labels fit the inspected layouts. Dark-mode rendering and independent screenshot approval are not established by this terminology pass. The concurrent Svelte migration owns its broader visual acceptance. No independent design approval is claimed.
