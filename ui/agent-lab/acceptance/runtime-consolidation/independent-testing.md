# Independent UI consolidation testing

Date: 2026-11-09. Tester: independent Codex subagent; no implementation edits.

## Browser verification

Started the root command `bun run dev` without a runtime environment variable. Vite served the Svelte Lab on port 3101. Used the shared T3 Chromium preview browser through its automation tools.

- Initial Anisogamy entry was uninitialized; Setup produced tick 0 and rendered model/chart views.
- Run advanced tick to 20; Pause changed the transport back to Run and tick remained 20 across subsequent tool calls. One step advanced exactly to 21.
- Search for Wolf and selection through the experiment dropdown loaded Wolf Sheep Predation, updated the URL and returned to an uninitialized workbench.
- Setup created 100 sheep. Editing Initial Sheep to 120 displayed Restart with changes without changing the current 100 sheep. Restart created tick 0 with 120 sheep.
- Initial Sheep 999 failed native max-250 validation; the 120-sheep model remained intact.
- At CSS viewport 390×844, Parameters expanded and collapsed; inputs remained usable and document scrollWidth equalled viewport width (390).
- A temporary browser-only fixture mounted through public `defineUI` deliberately threw `Independent step failure` during playback. The rendered alert appeared and playback stopped. Setup cleared the error, reset tick to zero and disposed the old model exactly once.
- Disposing that running fixture twice removed its DOM and disposed its model only once. Advance count remained unchanged on a later call, verifying timer cleanup. This fixture did not modify repository source or catalog entries.
- Closed the test tab and stopped the development server after verification.

## Screenshots

Actual screenshots are in `screenshots/desktop-light.png`, `desktop-dark.png`, `mobile-light.png`, and `mobile-dark.png`. Desktop CSS viewport was 1366×768; T3's screenshot output scales it to 1280×720. Mobile CSS viewport was 390×844, captured at DPR 2 as 780×1688. The screenshots show Wolf Sheep Predation after Setup (desktop captures show the restarted 120-sheep state). Theme and resize were allowed to settle before final captures; transient initial captures were replaced.

The independent tester opened and visually inspected all four actual PNG images using `view_image`, independently of implementation and of the separate Gemini review. Desktop light and dark retain a clear chooser/transport row, aligned parameter column and unobstructed model canvas. Mobile light and dark stack the chooser, wrap the transport, expose Parameters and keep monitors and canvas within the viewport. Text and enabled controls are readable in both palettes; the disabled Grass Regrowth field is visibly muted. No overlapping elements, unintended clipping or blocking visual findings were observed in these captured states. The chart continues below the viewport as ordinary vertical page content. This inspection covers the pictured states rather than claiming a complete accessibility audit.
