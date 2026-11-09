# Independent heat visualization refactor

This pass reviewed the first visual correction in `neighborhood-heat-intervention` against the existing Fire Grid projection, Traffic 2 Lanes spatial projection and Preferential Attachment network/inspector pattern. It read both local refactoring skills, their shared workflow and decision references, coding standards and the frontend design contract. Other concurrently edited models were left untouched.

## Finding and correction

The first heat projection mapped index values directly across NetLogo palette numbers 105 through 15. The actual screenshot `browser-screenshot-localhost-mw92tmyx-c52a624b.png` was opened with `view_image`. At tick 10, cooler shaded fields appeared nearly white or orange while the legend promised a blue-to-red scale. NetLogo palette numbers combine hue families and brightness bands, so traversing those numbers is not a continuous two-anchor heat scale.

The UI now uses one short `heatColor` projection. It mixes the public palette's blue anchor `netLogoColor(105)` and red anchor `netLogoColor(15)` in sRGB with a clamped heat-index fraction on the fixed 0–30 scale. Index 0 is 100% blue, 15 is a 50/50 mixture and 30 is 100% red. Intermediate values change mixing weights continuously instead of crossing unrelated brightness bands. This does not claim perceptual uniformity or scientific calibration. The parent verified that the configured browser Canvas parser accepts the `color-mix` syntax before this pass.

The existing green diagonal hatching still denotes actual shaded Fields. Its pattern, not only its color, differentiates shade. The inspected initial image showed clearly separated diagonal marks; the updated blue/red image still requires the parent's actual browser and independent image gate before final acceptance.

## Preserved contracts

No model rules, state, RNG draws, World time, history sampling, geometry, IDs, actions, shared components, CSS or APIs were changed by this refactor. The preceding observation extension exposes actual detached Grid coordinates and extents. The flat UI uses the existing public spatial cells/segments contract and field inspector rather than creating fake model agents. The mean chart remains secondary.

## Executed checks

- `bun test tests/mesa-heat-visual.test.ts tests/mesa-models.test.ts`: 20 tests passed, 133 assertions. Geometry/detachment and live shade-cooling checks retain the original rule values.
- `bun run typecheck`: passed; Svelte diagnostics reported 0 errors and 0 warnings.

This is an independent source/meaning review plus inspection of the initial screenshot. It does not grant updated screenshot, complete accessibility or scientific approval. The parent owns real-browser verification of the corrected projection at desktop/narrow sizes and light/dark themes.
