# Agent Lab

Run `bun run dev:ui` from the repository root and open http://localhost:3100. Set `CITY_LIBRARY_UI_PORT` and optionally `CITY_LIBRARY_UI_HOST` for another listener.

The Bun host discovers paired `experiments/<slug>/model.ts` and `ui.ts` entries, reads inert model metadata without creating simulations, and compiles literal lazy imports with their chunks. Asset-only folders are ignored. New source builds offer an explicit Reload updates action; they do not silently reset a running experiment.

Select an entry, choose setup values and press Setup. Run/Pause and step controls invoke the same public headless model. Live controls change the current model; setup fields are pending values for the next initialization. Model info contains source attribution. Labels, layout, camera and inspection are presentation only.

## Authoring an entry

`model.ts` exports a plain `model` object with `title`, canonical `inputs` and `create`, checked against the headless Definition type. It may also export its ordinary factory. Factory validation uses the same input descriptors. The model exposes explicit actions and detached read observations; neither it nor its imports depend on UI.

`ui.ts` imports its model and `defineUI` from the shared UI entry, then binds typed controls, monitors and neutral views. Concrete model types remain known until this binding produces the mounted catalog handle. Helpers may be private normal imports. No application-specific scenario switch is needed.

Views and controls are shared under `ui/`. This application owns only catalog, session and playback composition. The host is `scripts/agent-lab.ts`; the core package excludes UI, reference archives and adapted experiments.

Reference ports retain their original attribution/license notices. Sources, versions and known behavioral or display adaptations are in [reference provenance](../../docs/development/netlogo-reference-sources.md). Verification and remaining gaps are in [refactor evidence](../../docs/development/agent-lab-evidence.md).
