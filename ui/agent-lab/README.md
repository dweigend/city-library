# Agent Lab

Agent Lab runs headless experiments through shared controls and views. Models own state, validation and time; the host owns playback, selection and rendering.

## Start the Svelte runtime

From the repository root with Bun 1.4.2:

```sh
bun install --frozen-lockfile
CITY_LIBRARY_UI_RUNTIME=svelte bun run dev:ui:svelte
```

Open http://localhost:3101. The Svelte host supports the same authoring contract as the legacy adapter. All 125 catalog entries, including Taxi Cabs, use it without per-model fallbacks. Scientific acceptance and broader release work remain separate. The Vite command without `CITY_LIBRARY_UI_RUNTIME=svelte` selects the legacy runtime.

Set `CITY_LIBRARY_UI_PORT` and optionally `CITY_LIBRARY_UI_HOST` to change the listener. Vite requires the selected port to be free. Build the Svelte runtime with `CITY_LIBRARY_UI_RUNTIME=svelte bun run build:ui:svelte`; `bun run preview:ui:svelte` serves the existing build.

For the older Bun host, use `bun run dev:ui` and http://localhost:3100. It supports the same port/host variables. Keep this route available while migration acceptance remains open.

## Run an experiment

Choose an entry, edit setup values and press Setup. Run/Pause and step controls invoke its public headless model. Live controls change the current model; setup fields prepare the next initialization. Model info contains source attribution. Labels, layout, camera and inspection remain presentation state.

The catalog discovers paired `experiments/<slug>/model.ts` and `ui.ts` files. Reading metadata does not create a simulation. Source updates offer an explicit Reload updates action rather than silently resetting an active experiment.

## Add an entry

Follow [model authoring](../../docs/development/model-authoring.md) for a real example. A headless `model.ts` exports metadata, canonical input descriptors and a factory. Its instance exposes explicit actions and detached observations. A separate `ui.ts` imports `defineUI` from the public repository UI entry and binds those operations to controls and views.

Preserve accepted author syntax and use the [UI contract](../../docs/ui/README.md); the readable setup-string and keyed-live forms are implemented and exercised through public examples in both hosts. Shared infrastructure owns rendering and cleanup. Experiment files do not reach into host DOM or private Svelte components; Taxi grouping uses ordinary public control groups, with no private host patch.

## Verification and context

Run `bun run check` and the relevant UI build from the root. UI changes also require actual browser interaction and independent screenshot review under the [UI design rules](../../docs/DESIGN.md). A source review does not establish visual acceptance.

The [current plan](../../PLAN.md) tracks open work. [Consolidation evidence](../../docs/development/consolidation-report.md) records integrated checks and limitations. [Original refactor evidence](../../docs/development/agent-lab-evidence.md) and [reference provenance](../../docs/development/netlogo-reference-sources.md) retain historical checks and source notices. The core package excludes UI, reference archives and adapted experiments.
