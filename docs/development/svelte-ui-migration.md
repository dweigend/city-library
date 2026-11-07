# Svelte UI migration assignment

Status: preparation only, 6 November 2026. Runtime migration is not implemented or accepted. Follow [UI design](../DESIGN.md), [system architecture](../ARCHITECTURE.md) and [PLAN's example-first gate](../../PLAN.md#example-first-delivery-gate). The existing running catalog remains available during preparation.

## Accepted boundary and examples

Preserve `defineUI(model, spec)` from `ui/index.ts`, existing `UISpec` fields and `BoundEntry.mount(container)` returning `dispose()` and optional `pause()`. Do not expose Svelte components, stores or lifecycle to `experiments/*/ui.ts`. Existing headless factories stay unchanged. The UI API is the public local UI entry, not a newly promised package export.

Five asserted scripts in `examples/ui-migration/` freeze existing syntax before implementation. They use the real Virus on a Network model and the public UI entry; no DOM emulation, mocked models or private UI imports. The UI spec in each script is deliberately small. Assertions exercise model/action/projection contracts; they do not prove that rendered controls dispatch them correctly.

| Script | Inputs and expected result | Mutation/failure contract |
| --- | --- | --- |
| `01-inert-entry.ts` | Bind Nodes and Tick; entry title and mount exist; zero model creations | Declaration is inert, including outside the browser |
| `02-setup-draft.ts` | Create 10 nodes, edit draft to 20, explicitly create 20 | Draft changes preserve active 10-node instance |
| `03-actions-and-live-rules.ts` | Step once; Tick=1; set spread chance to 7 | Public action changes model; live edit does not advance Tick |
| `04-observation-views.ts` | Project 10 nodes, nonempty edges and initial 30% infected history | Projection leaves full observation, time and RNG unchanged |
| `05-invalid-rule-and-instance-isolation.ts` | Spread 11 throws RangeError; valid 7 affects one instance | Invalid update is atomic; second instance retains default |

No new core operation IDs are introduced. These are UI compatibility examples, not evidence of new scientific capabilities. `SHA256SUMS` freezes their exact bytes. Any substantive expectation change requires the existing recorded-decision/user-agreement gate. Run `bunx --no-install tsc -p examples/ui-migration/tsconfig.json` and each numbered script with Bun. Integration must register the set in the normal examples/typecheck workflow without weakening these scripts.

## Implementation sequence and ownership

1. **Build and component foundation:** introduce Svelte/Vite/Tailwind and shadcn-svelte with Bun, pin dependency versions, configure aliases/components.json and Svelte checking. Use a plain client application; no routing/SSR/backend expansion. Keep the library build/headless exports unchanged. Preserve lazy catalog discovery and the existing URL experiment parameter. Retain `CITY_LIBRARY_UI_HOST`/`CITY_LIBRARY_UI_PORT` behavior and LAN/Tailscale reachability. Preserve the running server on 3100 until a verified replacement is ready; verify migration on a separate port first. The Vite integration must reuse catalog discovery/generated imports rather than hand-maintaining a second catalog.
2. **UI runtime:** replace imperative composition with internal Svelte components mounted behind the existing public `defineUI` boundary. Own model initialization, pending setup/live values, public action dispatch, completion and errors in one session controller. Keep playback/repeated-action cadence independent of scientific time. Stage candidate setup/create/read before replacing a usable old instance. Stop playback/repeats/drawing on pause, switch, completion, errors and disposal as applicable. Dispose renderer/listener resources exactly once; no competing Svelte/model state owners.
3. **Shared components and renderer bridges:** compose only needed standard shadcn components for fields, actions, selection and collapsing parameters; Bits UI only for a demonstrated missing primitive. Preserve all currently used setup widgets, live controls (including color), action enabled/pressed/repeat behavior, drawing intents, monitors, source links and network/grid/spatial/chart/table/inspector views. Existing render adapters may remain behind lifecycle-safe components, with independent renderer ownership. Remove decorative wrappers and redundant copy. Use one fixed UI token system, shared scientific default colors and Lucide icons. Preserve explicitly supplied scientific data colors and the existing netLogoColor mapping exactly; do not quantize or remap them to the UI theme. Keep CSS outside HTML/Svelte files; shared component classes/variants own layout and appearance. `app.css` is at most 100 physical lines with no alternate global override file.
4. **Integration and evidence:** run the frozen examples and all existing relevant regression checks, browser interactions and independent reviews. Document actual outcomes separately from planned outcomes. Update PLAN and usage instructions only when supported by evidence.

Give foundation/package/config files to one implementation owner. Give session/components/render bridges to a second owner only after imports, aliases and lifecycle contracts are agreed. Avoid concurrent edits to shared package/build/public-entry files. A third independent agent reviews actual screenshots; Antigravity `gemini-3.8-flash`, explicitly selected by the user, reviews substantial design/transfer work. The orchestrator owns sequencing, integration and findings disposition; no reviewer approval is implied by author checks.

## Current sequencing and independent review status

The earlier independent Antigravity `gemini-4-argon` review was attempted and failed because provider quota was exhausted. That attempt produced no independent findings or approval. The user subsequently explicitly selected Antigravity `gemini-3.8-flash` for independent reviews; availability has been confirmed. The subsequent independent `gemini-3.8-flash` design review completed with conditional approval for the generic runtime only; findings and conditions are recorded below. Do not silently substitute another provider/model or treat author checks as independent approval. Required independent review and full migration acceptance remain open.

Separate the technical foundation (dependency/build/configuration work behind a separate development entry, preserving the existing runtime and server) from runtime migration and final acceptance. Foundation work must not introduce the deferred grouping API or replace the running UI. Generic runtime implementation may proceed only after blocking finding F01 is fixed and verified. Taxi Cabs migration remains open under the user-deferred contract. Full acceptance still requires real-browser evidence and independent screenshot review. Foundation implementation and its checks must be recorded as their own bounded result.

### Completed independent design review and responses

Antigravity `gemini-3.8-flash` issued **conditional approval for the generic runtime only**. This is an independent design review, not approval of an implemented runtime, rendered UI or screenshots.

| Finding | Independent finding | Implementation response / remaining condition |
| --- | --- | --- |
| F01 · Medium, blocking runtime | The Svelte checking script has a TypeScript 7 compatibility problem. | Foundation owner is fixing the script/toolchain integration. Resolution is not yet evidenced here; verify the corrected Svelte check before runtime implementation. |
| F02 · Low | `app.css` is not yet imported. | Intentional while the foundation retains the legacy runtime bridge. The migrated runtime must import the shared stylesheet; this is an outstanding runtime requirement, not a final-compliance exception. |

The conditions are mandatory: resolve and verify F01 before generic runtime work; leave Taxi Cabs and its deferred grouping contract unchanged; obtain real-browser interaction evidence and independent review of actual screenshots at desktop 1366×768 and narrow 390×844 in light/dark themes before final acceptance. No screenshot approval exists yet. Author remediation and any later independent approval must be recorded separately; the historic Argon quota failure supplies neither findings nor approval.

## Compatibility decisions requiring explicit resolution

- **User-deferred grouping contract:** `experiments/taxi-cabs/ui.ts` currently wraps mount and queries `.live-controls` to group demand controls. The user deferred a public grouping contract. Do not add a grouping API or change the accepted authoring syntax. Preserve existing Taxi Cabs grouping and its running UI; Taxi Cabs migration remains open because its current private DOM coupling conflicts with the new declarative rule. Do not claim that preserving the old runtime establishes migrated compliance.
- Existing scientific projections contain explicit source colors and per-view presentation hints. Preserve supplied scientific color values and netLogoColor mapping exactly. Shared scientific palette defaults apply only where no color is supplied; they do not override or remap existing data. The fixed theme governs UI chrome, not the meaning of scientific data. Do not add model-specific UI themes or silently alter accepted scientific display contracts.
- The five shell examples intentionally do not assert browser mount/pause/dispose, event dispatch or visual behavior. Those need real-browser evidence below; adding a headless public runtime solely to test them would violate KISS/YAGNI.

## Browser and acceptance gate

At minimum exercise one spatial model (Anisogamy) and one network model (Virus on a Network); additionally check Taxi Cabs grouping and drawing, an action with repeat cadence and every affected renderer kind. Inspect existing catalog declarations before choosing the smallest representative coverage set. Do not claim the entire catalog verified from two models.

For desktop 1366×768 and narrow 390×844, capture and inspect light/dark screenshots for initial empty state, initialized/running/paused state and pending setup changes. Check keyboard selection, focus, overlays, scrolling/overflow, exact numeric input, invalid values, Run/Pause, one/ten steps, live changes, model switch and cleanup. Ensure pending Nodes=200 is distinct from active Nodes=150 until explicit restart; controls remain reachable. Repeat affected checks after fixes.

An independent subagent must open and inspect the actual screenshots, with paths and viewport/state recorded. Record its findings and implementation responses separately from its approval. Retain the required independent Antigravity `gemini-3.8-flash` review; confirm provider/model availability instead of silently substituting. Browser/reviewer blockers leave acceptance open. Run `bun run typecheck`, the Svelte-aware check, relevant behavior checks, library build/public-consumer checks when packaging changes, and the migrated UI build. Source-only checks never replace browser verification.

## Executed preparation evidence

Before runtime changes, all five numbered scripts ran successfully with Bun 1.4.2. `bunx --no-install tsc -p examples/ui-migration/tsconfig.json` passed and the existing `bun run typecheck` passed. The explicit example config is necessary because the existing root UI-example config includes only ui-color/ui-segments. No migrated browser screen exists; no browser or screenshot review was performed for this preparation. Existing rendering is not claimed compliant with the new UI rules.
