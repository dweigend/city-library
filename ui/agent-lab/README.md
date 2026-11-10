# Agent Lab

Agent Lab runs City Library models in a browser. Choose a model, change its parameters and watch what happens. Models own state, validation and time; the host supplies controls, playback, selection and rendering.

## Start the Svelte runtime

From the repository root with Bun 1.4.2:

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3101. The Svelte host implements the shared authoring contract. All 125 catalog entries, including Taxi Cabs, use it without per-model fallbacks. Scientific acceptance and broader release work remain separate.

Set `CITY_LIBRARY_UI_PORT` and optionally `CITY_LIBRARY_UI_HOST` to change the listener. Vite requires the selected port to be free. Build the Svelte runtime with `bun run build:ui`; `bun run preview` serves the existing build.


## Run a model

Choose an entry, edit setup values and press Setup. Run/Pause and step controls invoke its public headless model. Live controls change the current model; setup fields prepare the next initialization. Model info contains source attribution. Labels, layout, camera and inspection remain presentation state.

The catalog discovers paired `models/<slug>/model.ts` and `ui.ts` files. Reading metadata does not create a simulation. Source updates offer an explicit Reload updates action rather than silently resetting an active experiment.

## Add an entry

Follow [model authoring](../../docs/development/model-authoring.md) for a real example. A headless `model.ts` exports metadata, canonical input descriptors and a factory. Its instance exposes explicit actions and detached observations. A separate `ui.ts` imports `defineUI` from the public repository UI entry and binds those operations to controls and views.

Use the [public UI contract](../../docs/ui/README.md). Setup-string and keyed-live forms are implemented and exercised through public examples in the Svelte UI. Shared infrastructure owns rendering and cleanup; experiment files do not access host DOM or private Svelte components. Taxi uses the same public control groups as other studies.

## Verification

Run `bun run check` and the relevant UI build from the root. UI changes also require actual browser interaction and independent screenshot review under the [UI design rules](../../docs/DESIGN.md). A source review does not establish visual acceptance.

The [work plan](../../PLAN.md) tracks open work, and [reference sources](../../docs/development/netlogo-reference-sources.md) describe model provenance. The core package excludes UI, reference archives and adapted studies.
