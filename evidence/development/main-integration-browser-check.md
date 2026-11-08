# Main integration browser regression

Real browser checks on 8 November 2026 exercised the integrated runtime at `afdbda12bea9e9656da95dcfd7b9453836b7269c`. Later integration commits through `3896bb8` changed documentation and evidence paths, not this runtime. This is a representative integration check, not scientific parity or acceptance of all catalog models.

## Environment

Configured Playwright MCP Chromium failed before navigation because its SUID sandbox helper was incorrectly installed. The configured T3 Preview browser successfully exercised the application without system or sandbox changes. Dedicated Bun legacy and Vite Svelte servers used ports 3196 and 3197; the latter explicitly selected `CITY_LIBRARY_UI_RUNTIME=svelte`. Both servers and the browser tab were closed afterward.

## Executed checks

- Both hosts: Voting, Wealth Distribution, Wolf Sheep and Preferential Attachment loaded and completed Setup and bounded stepping. Legacy PA reached tick 1 with 3 nodes and 2 edges; Svelte PA reached tick 10 with 12 nodes and 11 edges.
- Catalog navigation succeeded on both hosts; Svelte PA was additionally opened by URL.
- Svelte Wolf Run advanced tick 1 to 3; Pause held tick 3 for another 500 ms. Legacy Wealth Run advanced tick 0 to 7; Pause held tick 7 for another 450 ms.
- Both Wealth hosts: editing the People draft to 100 retained the active population of 250; explicit Setup/Restart applied 100. Live Growth Amount 3 applied without advancing time.
- Both Wealth hosts: People -1 blocked Setup through browser validation while retaining active population and tick.
- Screenshots were visually inspected at 1280 × 800 and 390 × 844 CSS pixels in light and dark appearance. No horizontal overflow appeared in inspected mobile states. Controls had correct contrast after theme transitions settled; an immediate transient dark capture was retested after 400 ms.
- Successful flows produced no visible runtime errors and no browser console error entries; Vite connection/restart diagnostics were present.

The check did not repeat every model/control/theme combination, Wolf Sheep grass mode, callback-error fixtures, cross-browser accessibility or all 200 target models. Detailed screenshots remain local browser artifacts, not portable acceptance dependencies.
