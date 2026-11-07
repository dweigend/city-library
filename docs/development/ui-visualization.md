# HTML agent visualization test host

Status: implemented by a scoped subagent; author shell/browser verification passed; independently reviewed by Antigravity gemini-4-argon with no blockers. This user-requested follow-up changes the HTML test application only, not the A1 library scope or frozen example contracts.

## Ownership boundary

- Library operations Agent.add/copy/delete, World.add/delete and run/Tick remain authoritative for identity, life, membership and execution.
- The existing headless test model owns the caller-written energy rule and explicit model actions. Its inspection list retains original Agent references; it does not own another writable membership list or balances.
- Readbacks contain detached frozen observations. Selection chooses an existing canonical reference through an explicit application-model action. Old observations never become writable live model state.
- DOM code invokes model actions and renders observations. The agent view owns marker elements, layout, focus and selection styling only. It never advances time, draws randomness or assigns Agent state.
- A1 remains non-spatial: x/y/heading read their actual backend defaults. Marker placement is a presentation layout, explicitly labeled non-spatial; no Grid, collision, path or movement behavior is simulated.
- No automatic run timer is introduced. Step controls execute only the selected agent's existing model rule via public run.

The feature is implemented by a scoped subagent in Agend_Lab. Library code, public exports and all five frozen A1 scripts must remain byte-identical during this follow-up.

## Acceptance procedure

Verify selection, stepping, copying, attachment, detachment and deletion in a real browser. Markers and inspector must agree, including a selected detached/deleted object. Reselect the original after copying and confirm that only its energy changes. A deliberately failing step retains its energy effect without adding a tick. Repeated rendering/selection must not advance time or change energy. Keyboard selection retains focus. New model discards old presentation markers and starts the new canonical model.

Inspect desktop/mobile screenshots in light/dark themes, error text and long identity/energy values; check horizontal overflow and focus visibility. Run headless model tests, strict typechecks and the five frozen scripts. Restart the user test-host service after changes so the tailnet URL serves the new bundle.

## Evidence

On 5 November 2026, the coordinating agent ran `bun run check`: 33 tests passed (including six headless HTML-model tests), all five frozen A1 example processes passed, library/dev/UI typechecks passed, browser ESM/declarations built and the packed Bun/Node/ambient-free TypeScript consumer passed. The three new application-model tests were written first and initially failed before their implementation. `git diff --check` passed.

SHA-256 comparison confirmed byte-identical `src/**/*.ts`, root index.ts and all five examples/a1 scripts before and after this feature. Only the external HTML host and its documentation changed. The test-host service was restarted; the tailnet endpoint serves the new bundle.

Real shared-browser verification on the Tailscale URL:

- Desktop 1280×800 and mobile 390×844 screenshots inspected in both light and dark modes; controls, inspector, markers and state labels remain legible. Mobile scrollWidth equals 390 at viewport width 390, including energy 1,000,000.
- Five steps: original energy 10→5, tick 0→5. Copy shows original energy 5 plus a selected detached copy energy 5 while World membership stays 1.
- Reselect original, one step: original energy 4, copy energy 5, tick 6. Select the copy, attach, invoke failed step and delete: the copy retains final energy 4, World membership returns to 1, tick stays 6 and its marker remains inspectable as deleted with mutation controls disabled.
- Native marker Space/Enter and Shift+Tab selection retain focus through keyed DOM updates; visible solid focus outline verified. Selection alone leaves tick unchanged.
- New model removes previous markers and resets to one living attached agent, energy 10 and tick 0. Large allowed initial energy and detached-copy labels fit without horizontal page overflow.
- A 13-marker mobile test exposed inaccessible first rows from unsafe centered flex overflow. The coordinator changed align-content to safe center, restarted the service and repeated the scenario. The first marker begins 17 CSS pixels inside the scroll container at scrollTop 0; first/last marker clicks and keyboard selection now succeed. Tick remains 0 after these inspection-only actions.
- Snapshots reported no console errors or failed asset requests. This is browser acceptance for the test host, not a cross-browser certification or new spatial capability.

The frontend-design and web-design-guidelines skills were applied; current upstream Vercel guidelines were fetched for review. Independent read-only review by Antigravity `gemini-4-argon` completed with zero blockers. The reviewer independently ran `bun run check` (33 tests, five examples, typechecks, build and packed consumer) and audited public imports, canonical ownership, frozen observations, selected-only execution, absent timers/RNG, keyed focus-preserving DOM reuse and non-spatial honesty. Its screenshot decoder was unavailable, so visual acceptance above remains the coordinating agent's real-browser evidence rather than an independent visual approval. Optional note: view.ts is already typechecked transitively through app.ts; an explicit tsconfig include is unnecessary for coverage.

Review: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/thread:delegated-task:command%3Amcp%3Aba259da0-5b36-455f-959c-15f48bcd7d9a%3Adelegate-task%3A1eadce0d-2593-4093-adef-0be643c2e952>.
