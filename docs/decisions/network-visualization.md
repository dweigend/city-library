# Network visualization

Model Lab uses Cytoscape.js for its network view. It is a presentation dependency: City Library owns topology, identity, measurements and model time. The view projects detached observations, supports inspection and keeps layout separate from scientific coordinates.

## Current choice

Use the pinned dependency in `package.json` and the shared network adapter. Cytoscape elements are disposable view records, never canonical model state. Model-specific adapters supply meaningful node/edge projections through the public UI API.

## Mandatory architecture boundary for any candidate

City Library/model owns graph topology, Agent/Edge identity, quantities, domain coordinates, tick and model Random. The external lab owns drawing, viewport, selection styling and temporary layout coordinates. A view graph/cache is allowed; it has no authority to decide live membership, balances or routes.

1. The adapter receives public observations and produces detached renderer records keyed by canonical model identity. Ordinary graph nodes need no new Node base class or mandatory id property: use an explicit caller key or an adapter-local identity map. Renderer IDs are not persistence IDs. Never hand writable live domain objects to a library that positions/mutates nodes.
2. Distinguish semantic model positions from viewX/viewY. For non-spatial graphs, layouts may compute display positions in the UI. For spatial networks, project supplied positions and preserve meaningful lengths/paths; do not silently force-layout a road network.
3. Layout may have an independent bounded UI scheduler/RNG. Neither may call run, advance World tick or consume world.random. In D3, stop the automatic simulation or explicitly bound its UI-only work. In vis-network, start the model-coordinate mode with physics disabled. [D3 timer/mutation rules](https://d3js.org/d3-force/simulation), [vis physics defaults](https://visjs.github.io/vis-network/docs/network/physics.html).
4. Drag normally adjusts the display only. A genuine model edit requires an explicit application action, backend validation and a new observation. Renderer drag data must not become authoritative coordinates by accident.
5. Neighborhood, routes and network metrics shown as model results must come from accepted backend operations. Do not use renderer-side algorithms as a hidden substitute for missing public graph APIs.
6. Use one renderer in the first delivered view. Avoid introducing a universal renderer/plugin abstraction before a second actual implementation justifies it. An intentionally small application adapter is enough.
7. Retain accessible HTML inspection/keyboard alternatives alongside Canvas/WebGL. Pixel rendering and mouse picking do not establish accessibility by themselves.

Cytoscape can use preset positions; Sigma expects graph coordinates; vis can disable physics. Those allow read-only projection of externally supplied layout/model data. [Cytoscape preset layout](https://js.cytoscape.org/#layouts/preset), [Sigma data loading](https://www.sigmajs.org/how-to/technical/loading-data/), [vis physics](https://visjs.github.io/vis-network/docs/network/physics.html).

## Future renderer decisions

A second renderer needs a concrete requirement and a measured comparison. Sigma.js is a possible candidate when large-graph overview becomes the dominant use case; a custom D3 view needs a visual grammar the existing adapter cannot express. Neither warrants a general renderer abstraction in advance.

Compare candidates on identical fixed-coordinate fixtures before comparing layouts. Include small directed/parallel/self-loop cases, representative catalog graphs, and a declared stress workload. Measure initial rendering, interaction delay, updates, memory and cleanup on the actual target devices. Declare thresholds before judging results. No unmeasured speed claim or fixture size becomes a supported capacity.

A replacement must preserve model state and RNG while panning, zooming, dragging and laying out the view. Check canonical selection, stale async work after reset, listener/resource cleanup, meaningful spatial geometry and keyboard inspection in real Chromium. Review desktop/narrow and supported light/dark states independently before acceptance.
