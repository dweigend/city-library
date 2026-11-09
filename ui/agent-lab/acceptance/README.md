# Shared Svelte UI acceptance

Checked on 9 November 2026 after integrating the Mesa/DES expansion. The browser catalog exposed 145 entries without discovery errors: 125 selected-model implementations plus twenty illustrative city models. This does not establish scientific equivalence or all-model acceptance.

## Current integration checks

- DES Civic Office: Setup, Add resident, one step and Run/Pause worked. Four residents completed service at minutes 2, 4, 6 and 8; Pause held model time.
- Search and model chooser switched to Neighborhood Heat Intervention, replaced the old state and required Setup. Setup produced tick 0 and mean heat index 30; ten steps advanced the model.
- Desktop 1366×768 and narrow 390×844 CSS viewports were checked in both preferred color schemes. The page stayed within its viewport. A browser window-error listener reported no errors during the checked flows and resizes.
- Checks used a fresh temporary dev process. The pre-integration dev process had cached the earlier root exports; refreshing its browser alone did not reload those server-side metadata imports. Starting a fresh process loaded the integrated exports without a source workaround.

## Rendered evidence

The single retained screenshot set shows Neighborhood Heat Intervention after Setup: [desktop light](screenshots/desktop-light.png), [desktop dark](screenshots/desktop-dark.png), [narrow light](screenshots/narrow-light.png) and [narrow dark](screenshots/narrow-dark.png). CSS viewports are listed above; bitmap dimensions can differ with screenshot scaling/DPR.

Author inspection found readable controls and complete shade hatching in all four final images. Immediate captures after theme/size changes were transiently incomplete; replacements waited for repaint and settling. No source styling correction was made. Independent inspection of these replacement images remains required before final approval.

## Scope and retained facts

Earlier independent Svelte checks also exercised Anisogamy playback, Life switching, Wolf Sheep Predation setup drafts/native validation, and a browser-only public `defineUI` fixture for visible execution errors, Setup recovery and idempotent disposal/timer cleanup. Those results describe their recorded 125-entry snapshot, not fresh acceptance of every integrated model.

This concise record and fresh screenshot set replace the duplicate runtime-consolidation/model-layout reports and images. The former `independent-testing.md` was shortened when shell logs were removed, so its pre-relocation hash no longer described its bytes; that edited report and stale hash mapping are now removed rather than presented as immutable evidence. No frozen executable assertion or catalog acceptance stage changed. Detailed keyboard/focus, screen-reader, all-model browser and scientific gates remain open.
