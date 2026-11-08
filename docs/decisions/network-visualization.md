# Network visualization for Agent Lab

Status: Cytoscape.js selected by the user on 5 November 2026 for the Agent Lab visualization layer; implementation and acceptance are tracked in [the development assignment](../development/cytoscape.md). The comparison below records the preceding research against official documentation, source/release records and npm registry metadata. No renderer was benchmarked during research. The recommendation is an engineering assessment for this repository, not a measured performance ranking.

## Proposed decision

Use **Cytoscape.js as the first candidate for an Agent Lab network-view prototype**. Keep **Sigma.js as the challenger when large-graph rendering becomes the primary need**. Choose after a small browser comparison on the same fixtures. Do not add either to the City Library engine or change its graph ownership/API.

This preference assumes our first goal is an inspectable 2D modeling workbench: select nodes/edges, inspect attributes, highlight relationships and update observations while stepping a model. Expected real graph sizes and update rates are still unknown. The current Exchange scenario has agents and transient interactions, not an implemented persistent network. The full Graph target is planned A5; a renderer cannot make it implemented.

## Shortlist

| Candidate | Official capabilities | Project-specific judgment |
| --- | --- | --- |
| Cytoscape.js | Canvas network visualization, layouts, styling/selectors, gestures and compound nodes. Its own graph model also contains analysis functions. | Best first workbench candidate: broad inspection/styling support without assembling basic interactions ourselves. Treat its elements strictly as a disposable view projection; backend graph analysis stays in City Library. |
| Sigma.js | WebGL renderer using Graphology data, vanilla JS/TypeScript examples, graph interaction and separately supplied coordinates/layouts. | Strong large-network challenger. Adds Graphology as a view-side data structure; requires deliberate projection and layout handling. Prioritize it if overview/pan/zoom on large graphs outweighs richer workbench features. |
| vis-network | Canvas network view with DataSet updates, hierarchy options, clustering and configurable physics/layout. | Good quick prototype alternative. Default layout physics must be explicitly controlled and isolated from model execution. The supported build form affects peer dependencies. |
| D3 modules (especially d3-force) | Composable visualization tools; force layout mutates supplied nodes and starts its timer automatically unless stopped. Rendering can be assembled with SVG/Canvas separately. | Best when we need a highly custom visual grammar. Highest amount of our own rendering/interaction work here. Never pass live Agents to forceSimulation. |
| AntV G6 | Full graph visualization framework with layouts, interactions, plugins and configurable renderer; Canvas default with SVG/WebGL alternatives. | Viable for a richer future graph application. Its wider framework and dependency surface make it less compelling for our intentionally small current lab. |

Feature sources: [Cytoscape.js documentation](https://js.cytoscape.org/), [Sigma overview](https://www.sigmajs.org/), [Sigma quickstart](https://www.sigmajs.org/get-started/quickstart/), [vis-network documentation](https://visjs.github.io/vis-network/docs/network/), [D3 force simulation contract](https://d3js.org/d3-force/simulation), [G6 introduction](https://g6.antv.antgroup.com/en/manual/introduction), [G6 renderers](https://g6.antv.antgroup.com/en/manual/further-reading/renderer). The judgment column is our inference from those capabilities and the local architecture.

## Version and dependency snapshot

These are latest stable npm dist-tags observed on the research date, not versions already accepted for City Library. Pin exact versions only when an implementation task begins.

| npm package | Version | Published (UTC date) | Declared license | Integration note |
| --- | --- | --- | --- | --- |
| sigma | 4.0.4 | 2026-10-27 | MIT | Graphology integration is explicit in the official quickstart; renderer dependency count alone does not include all application graph/layout packages. |
| cytoscape | 3.34.4 | 2026-10-15 | MIT | Bundled TypeScript declarations; registry lists no runtime dependencies. |
| vis-network | 10.1.4 | 2026-10-27 | Apache-2.0 OR MIT | Declares peer packages including vis-data, vis-util and gesture utilities; standalone builds bundle dependencies. Do not infer zero total cost from an empty dependencies field. |
| d3-force | 3.0.1 | 2026-11-03 | ISC | Layout module only; d3-timer/d3-dispatch/d3-quadtree dependencies. This is not the version or license of every D3 module. Package metadata has no bundled types field; verify the typing package if chosen. |
| @antv/g6 | 5.1.1 | 2026-05-08 | MIT | Bundled declarations; a broader runtime stack including AntV rendering/layout/graph packages. |

Primary package records: [sigma](https://registry.npmjs.org/sigma/4.0.4), [cytoscape](https://registry.npmjs.org/cytoscape/3.34.4), [vis-network](https://registry.npmjs.org/vis-network/10.1.4), [d3-force](https://registry.npmjs.org/d3-force/3.0.1), [G6](https://registry.npmjs.org/@antv%2fg6/5.1.1). Dates were read from each registry package time record. Actual chosen extensions/transitive packages need their own version/license checks.

Sigma v4 has a documented migration from v3, including a changed styles/primitives API. Use current v4 examples and pin tested extension versions rather than mixing old tutorials into the prototype. [Migration guide](https://www.sigmajs.org/how-to/technical/migration-v3-v4/).

Cytoscape defaults to Canvas, but it would be inaccurate to call the current package Canvas-only: the inspected v3.34.4 canvas renderer includes an optional WebGL2 path enabled through options.webgl. The official preview describes experimental support; that older announcement alone does not establish current full feature parity or a production performance guarantee. Compare the default first and evaluate the shipped WebGL option separately for needed styles/edges. [Versioned canvas/WebGL implementation](https://github.com/cytoscape/cytoscape.js/blob/v3.34.4/src/extensions/renderer/canvas/index.mjs), [official WebGL preview](https://blog.js.cytoscape.org/2025/01/13/webgl-preview/). Conversely, Sigma's WebGL focus is documented, but its FPS advantage on our fixtures has not been measured. Labels, edge styles, density and updates matter. [Sigma performance guide](https://www.sigmajs.org/how-to/technical/performance/).

## Mandatory architecture boundary for any candidate

City Library/model owns graph topology, Agent/Edge identity, quantities, domain coordinates, tick and model Random. The external lab owns drawing, viewport, selection styling and temporary layout coordinates. A view graph/cache is allowed; it has no authority to decide live membership, balances or routes.

1. The adapter receives public observations and produces detached renderer records keyed by canonical model identity. Ordinary graph nodes need no new Node base class or mandatory id property: use an explicit caller key or an adapter-local identity map. Renderer IDs are not persistence IDs. Never hand writable live domain objects to a library that positions/mutates nodes.
2. Distinguish semantic model positions from viewX/viewY. For non-spatial graphs, layouts may compute display positions in the UI. For spatial networks, project supplied positions and preserve meaningful lengths/paths; do not silently force-layout a road network.
3. Layout may have an independent bounded UI scheduler/RNG. Neither may call run, advance World tick or consume world.random. In D3, stop the automatic simulation or explicitly bound its UI-only work. In vis-network, start the model-coordinate mode with physics disabled. [D3 timer/mutation rules](https://d3js.org/d3-force/simulation), [vis physics defaults](https://visjs.github.io/vis-network/docs/network/physics.html).
4. Drag normally adjusts the display only. A genuine model edit requires an explicit application action, backend validation and a new observation. Renderer drag data must not become authoritative coordinates by accident.
5. Neighborhood, routes and network metrics shown as model results must come from accepted backend operations. Do not use renderer-side algorithms as a hidden substitute for missing A5 APIs.
6. Use one renderer in the first delivered view. Avoid introducing a universal renderer/plugin abstraction before a second actual implementation justifies it. An intentionally small application adapter is enough.
7. Retain accessible HTML inspection/keyboard alternatives alongside Canvas/WebGL. Pixel rendering and mouse picking do not establish accessibility by themselves.

Cytoscape can use preset positions; Sigma expects graph coordinates; vis can disable physics. Those allow read-only projection of externally supplied layout/model data. [Cytoscape preset layout](https://js.cytoscape.org/#layouts/preset), [Sigma data loading](https://www.sigmajs.org/how-to/technical/loading-data/), [vis physics](https://visjs.github.io/vis-network/docs/network/physics.html).

## What the first prototype should prove

Compare Cytoscape and Sigma using the same explicitly labeled fixtures. Before A5, fixtures are synthetic input data or explicit interaction observations, not a claim that a canonical Graph already exists. The Exchange last sampled pair is an interaction; it must not silently become a persistent relationship edge. If we want a cumulative interaction network, its accumulation rule belongs in the headless model first.

| Fixture | Purpose |
| --- | --- |
| 24 nodes / about 50 edges | Readability, stable identity mapping and relation inspection. |
| 1,000 nodes / about 3,000 edges | Regular workbench scale; selection, attribute updates and responsive interaction. |
| 10,000 nodes / about 30,000 edges | Deliberate stress case to challenge the large-graph choice. |
| Tiny directed/multiedge/self-loop graph | Verify arrows, parallel edges, loop handling and ID mapping before claiming support. |

These are proposed test sizes, not promised capacities. Use identical fixed coordinates to isolate rendering cost first, then compare layouts separately with isolated seeds. Measure on the actual desktop and remote/mobile devices: first meaningful frame, pan/zoom frame-time distribution, click-to-inspector delay, update latency, memory and cleanup after repeated model resets. Include a stated 10-Hz attribute-update workload and a batch of topology changes; 10 Hz is a test condition, not a promised model rate.

Pass conditions: drawing/pan/zoom/drag/layout does not change backend topology, coordinates, energy, clock or RNG continuation; selection resolves canonical identities; deleting/resetting a model removes stale edges/listeners and rejects outdated asynchronous layout results; fixed-coordinate mode preserves input geometry; keyboard inspection remains possible. Choose usability thresholds on the target hardware before judging the results. Do not claim a measured winner without this comparison.

## Decision options

- **Recommended: Cytoscape-first prototype, Sigma challenger.** Best fit for the next inspectable network workbench, while keeping a concrete scaling comparison open.
- **Sigma-first:** choose this if the primary requirement is already large graph overview and complex inspection/editing features are secondary.
- **D3-first:** choose only when a specific custom visualization requirement outweighs the benefit of built-in network interactions.

The subsequent user instruction selects Cytoscape.js and authorizes its installation for the external test host. The initial network meaning is the existing model's last sampled pair, explicitly transient. This does not authorize a Graph implementation or persistent edges. No runtime or UI changed during the research stage itself.

## Independent feedback and response

Antigravity `gemini-4-argon` returned independent feedback on 5 November 2026. It supports keeping renderer dependencies outside the core and highlights Graphology projection overhead, keyboard accessibility and the distinction between abstract networks and spatial city geometry. It recommends retaining the current simple view until a concrete network use case or A5 justifies a specialized inspector. This is feedback, not independent approval of every statement in this proposal.

Response: retain the existing view during ongoing A2 work. The Cytoscape-first recommendation applies to a separately approved network-view prototype, not an immediate replacement. Include supplied multi-vertex edge paths in any later spatial-network comparison; verify actual rendering support before selecting a library for roads. Neither the review's suggested node-count ranges nor its relative speed claims are measured target evidence, so they do not become acceptance limits or performance conclusions here. The shipped Cytoscape WebGL option remains explicitly acknowledged above.
