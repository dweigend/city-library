# Live-field Enter regression

Coordinator check after revision 2, 2026-11-10. This is author evidence for a small shared-host correction, not independent approval.

## Trigger and correction

In Urban Employment, Setup followed by 10 steps produced month 10. Typing outside orders 30 into its live field and pressing Enter submitted the surrounding setup form and reset the model to month 0. The bug was reproduced with real keyboard actions in the T3 server preview browser.

`ui/svelte/Workbench.svelte` now places live control groups beside the setup form. The form contains setup controls only. No key handler, model rule, host state owner, component style or input implementation was changed. Native input change on Enter remains intact; setup fields and the explicit Setup button retain their restart behavior.

## Executed browser checks

- Urban Employment: 1366×768 and 390×844, light and dark. Setup, 10 steps, outside orders 30, Enter: month stays 10. One further step produces month 11, nine employed and 90 orders/month. The live field's form is null and document width fits the viewport. Real action results are retained in `revision-2-host-enter-results.json`.
- Native change instrumentation in the desktop preview recorded a trusted change event on Enter while input focus remained on the live field; no synthetic keyboard event was used.
- Invalid live value −1 followed by Enter leaves month 11 unchanged and the native input invalid. It does not restart the model.
- Correcting the live value and entering setup household count 31 followed by Enter intentionally restarts to month 0.
- Existing Household Energy Demand: Setup, 10 steps, shifted share 1, Enter keeps hour 10. Explicit Setup restarts at hour 0 with cumulative energy 0.
- Screenshots `host-live-enter-{desktop,narrow}-{light,dark}.png` are retained under `../screenshots/city-models/`. Coordinator inspected all four. Narrow screenshots show the expanded parameter controls; the scene continues below the visible viewport.

## Verification boundary

The preexisting revision-2 model screenshots remain useful for their scenes, because neither model views nor their data changed in this correction. The four new captures cover the affected host layout. After the correction, the coordinator reran `bun run check`: 0 TypeScript/Svelte errors or warnings, 848 tests with 797384 expectations, migration checks, 352 public scripts, library build and packed Bun/Node/TypeScript consumers passed (exit 0). `bun run build:ui` also passed (exit 0), with the existing large-chunk warning. Independent review remains pending. Current status belongs in the central city-model status record.
