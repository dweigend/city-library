# Universal UI historical acceptance

This is a portable summary of acceptance recorded before the `models/` and Svelte-only integration. It is not evidence that those checks ran on the current merged source. The full original record is pinned at [feature revision `754e4cc`](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/docs/development/universal-ui-evidence.md). Its `studies/` paths, two-host descriptions and command names describe that revision. Current checks belong in [the main integration record](pr-main-integration.md).

## Recorded scope

The earlier source pass audited 146 model/UI pairs: 82 common live-write migrations consolidated 483 exact forwarding setters, three collection scene projections changed, and 61 pairs were retained. The office added only its detached Resource-owned `waitingResidents` observation. Source-specific formulas, units and color mappings remained unchanged.

| Recorded evidence | Exact bounded result |
| --- | --- |
| Headless comparison | All 146 previous observations equal after excluding only the approved office field; 294 exposed RNG snapshots from 98 models equal |
| Full check before later precise corrections | 757 tests, 0 failures, 707,752 assertions; registered examples, library build and packed Bun/Node/TypeScript consumers passed |
| Later corrections | Table feedback, inherited array hooks, interface-extension compatibility and heading alignment independently checked; final typecheck and UI build passed |
| Browser scope | 146 catalog Setup/step cases, 82 actual live edits, 30 public checks across the then-existing adapters, and eleven deep DES flows passed |
| Visual scope | 92 final images independently inspected; headings and singular copy corrected; an invalid Taxi QA draft was replaced without a product change |
| Independent source review | Native and Gemini high-reasoning design/source approval; Gemini inspected `c125e39`, with later singular-copy-only correction checked separately |

The original [inventory](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/docs/development/universal-ui-inventory.json), [independent source review](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/docs/development/universal-ui-code-review.md), [Gemini review](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/docs/development/universal-ui-gemini-review.md), [browser report](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/docs/development/universal-ui-browser-review.md) and [image review](https://github.com/dweigend/city-library/blob/754e4cc0bb1afb5b417aeda1d918d3b654c8c85f/docs/development/universal-ui-image-review.md) retain their original revision scopes and limitations. They remain available through Git history; local screenshots and detailed handoffs are disposable working artifacts under the [documentation policy](README.md).

Configured Playwright MCP could not launch its SUID sandbox helper in that environment; actual browser checks used T3 Chrome. Renderer-ratio probes were not physical-device DPR coverage, and some unchanged Traffic captures preceded unrelated wording/type corrections. No full accessibility certification, empirical calibration, unexposed RNG proof or general continuation guarantee was claimed.
