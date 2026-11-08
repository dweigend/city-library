# Generic Svelte runtime: author evidence

Status: implemented and author-checked; independent review and full migration acceptance remain open. This evidence does not establish Taxi Cabs migration or full-catalog browser verification.

## Implementation boundary

- New `ui/svelte/` runtime preserves the existing `defineUI(model, spec)` and mounted `pause`/`dispose` contract behind the Vite-only adapter. The legacy public entry and Bun server remain unchanged.
- One private session controller owns the model reference, execution, repeat cadence and detached observations. Components own presentation. Setup drafts are distinct from active values; an explicit restart applies pending changes.
- Shared controls use standard generated shadcn-svelte components. Explicit `data-[orientation=...]` / `data-[state=...]` selectors adapt registry shorthand to the installed Bits UI DOM attributes. The slider uses the shared background token. Transitions respect reduced motion.
- The Svelte shell imports the single global `ui/agent-lab/app.css`; shell/workbench styles are external component-owned files. No authored inline styles or style blocks were introduced in Svelte/HTML. Renderer ownership and scientific palette changes are documented separately by the renderer implementation owner.
- The temporary legacy exclusion list comes from the build catalog. Excluded entries mount unchanged inside a shadow root with their existing stylesheet. This preserves Taxi Cabs without claiming compliance or inventing the deferred grouping API.

## Executed shell checks

Before the last presentation/lifecycle fixes, `bun run typecheck` completed with Svelte checking at zero errors and zero warnings. The five frozen UI migration scripts and `bunx --no-install tsc -p examples/ui-migration/tsconfig.json` passed. `CITY_LIBRARY_UI_RUNTIME=svelte bun run build:ui:svelte` passed; Vite reported a chunk-size warning. The foundation owner reruns affected checks on the stable integrated source and records final hashes separately.

An attempted `bun run examples:ui-migration` failed because that script does not exist; the corrected check explicitly executed all five numbered files. No nonexistent script is reported as passing.

## Executed real-browser checks

`runtime-browser-capture.json` records nine screenshots, exact PNG/CSS dimensions, DPR 1, light/dark media and absence of horizontal document overflow. Actual trusted Chromium mouse/key events verified:

1. Virus setup and ten steps produce Tick 10.
2. A Nodes draft of 200 preserves the active 150-node model and exposes Restart with changes.
3. Run advances ticks; Pause prevents subsequent ticks.
4. Explicit restart applies 200 nodes.
5. Live spread chance 7 commits on keyboard blur.
6. Search plus the catalog control switches to Anisogamy and updates the URL.
7. Anisogamy setup/ten steps render on narrow and desktop sizes; parameters are reachable by the narrow Parameters control.

No runtime browser exceptions occurred in this run. The renderer owner separately checks drawing, repeating actions, renderer kinds and explicit scientific colors. This is representative coverage, not all 125 catalog entries.

Preview automation rendered the actual UI, but two saved PNGs were 1280×720 despite a verified 1366×768 CSS viewport. Configured Playwright MCP could not launch because its SUID sandbox helper was not correctly configured. Correct-size captures therefore used an isolated headless Chromium CDP session, with real interaction events and settled theme transitions. The reproducible capture script is `runtime-browser-check.mjs`; its debugger endpoint belongs to the temporary verification session and is not a production requirement.

## Independent acceptance

Author screenshot inspection found and corrected the missing slider track and transient theme-capture artifacts. Independent screenshot review and Antigravity `gemini-3.8-flash` implementation review are separate outstanding gates. The preserved legacy server on 3100 has not been replaced. Modern author verification uses port 3102 with `CITY_LIBRARY_UI_RUNTIME=svelte`.
