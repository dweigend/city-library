# Universal UI authoring context dossier

Baseline: `a78bd2359e7a12ac537be131ca8d3023c4b718eb`, owned branch `feat/salabim-concepts`. This is source-backed context for two independent design experts, not an accepted API proposal, implementation approval or runtime verification. The coordinator chooses and implements a coherent additive slice after asserted public examples are frozen. No runtime, model, UI or example file was edited for this dossier.

## User objective and binding constraints

One consistent authoring language should reuse the developed UI modules, offer useful omission defaults for rapid prototypes and allow optional customization beside the affected binding. Both `model.ts` and `ui.ts` remain readable reference scripts. Audit all 146 pairs; retain good code instead of mass formatting or rewriting. Remove duplicated presentation arithmetic where a reusable default is actually warranted; do not merely rename a magic layout number in every experiment.

Read and apply [coding standards](../CODING_STANDARDS.md), [architecture](../ARCHITECTURE.md), [design](../DESIGN.md), [PLAN](../../PLAN.md), [terminology](../agent-loom/terminology.md) and the [UI API](../ui/api-reference.md). The exact original refactor-library and refactor-model-scripts skills, their shared refactoring-workflow reference and both refactoring-decisions references were read from `/home/david/Projekte/city-library/.agents/skills/`. They require concrete benefit, public contract preservation, source/RNG/order parity and independent browser checks; they do not require a speculative wrapper or mechanical file split.

The fixed Svelte/shadcn/Bits UI system owns components, style tokens, layout and lifecycle. No second framework, custom per-model canvas callback, scene DSL, competing domain owner, hidden clock or RNG draw is authorized. Existing public syntax remains compatible. Public example-first gates apply to API expansion. Domain rates, dimensions, scientific constants and source compatibility mappings stay explicit, with their original units and provenance.

## Actual source inventory

There are **146** `experiments/*/ui.ts` files, each with a matching `model.ts`. [The machine-readable inventory](universal-ui-inventory.json) records every pair, hashes, line counts, existing view kinds, source-specific risks and a preliminary keep/migration rationale. It is deliberately not a claim that all candidates need edits. Counts by entry containing each view: line 102; spatial 99; inspector 61; bar 32; table 32; grid 24; network 11; scatter 5. Entries can contain multiple kinds.

Initial structural triage: 10 already-short direct bindings are clear keep candidates; 113 contain repeated history projection, local scientific colors or DES layout primitives worth evaluating; 23 retain explicit spatial/source behavior unless a concrete extension improves it. These are candidate classifications, not final changed/kept decisions. The coordinator must resolve them against the chosen API and implementation evidence. Searching hexadecimal literals is not a license to replace their scientific meanings with ordinal colors.

Strong keep examples: `workplace-household-membership/ui.ts` is nine lines: one public reassignment action, three monitors, a direct graph and direct table. `zoning-scenario-comparison/ui.ts` has 13 lines: run/summary tables and a categorical bar with concise `Run n` labels. `residential-occupancy`, `stormwater-retention`, `solar-battery-microgrid`, `urban-tree-watering`, `pedestrian-crossing-phases`, `household-energy-demand` and `neighborhood-heat-intervention` already have short declarative bindings. Do not replace these with a more complex builder merely for uniformity.

## Existing modules to reuse

| Source owner | Existing responsibility and reuse seam |
| --- | --- |
| `ui/definition.ts` | Public model instance, inferred `Observation`, typed monitor, all existing view records, setup/live/actions/drawing/inspector contracts |
| `ui/index.ts`, `ui/svelte/index.ts` | Public adapters/types plus existing `netLogoColor` and `scientificPalette`; preserve both entry surfaces |
| `ui/authoring.ts` | Shared inert normalization, descriptor decoding, useful setup omission default, keyed live getter inference from `state.parameters`, monitor correlation, ordered flat live groups |
| `ui/compose.ts`, `ui/svelte/compose.ts`, `ui/svelte/session.ts` | Two hosts and shared session semantics; create/read candidate, public actions, errors, selection and disposal ownership |
| `ui/playback.ts`, `ui/actions/repeat.ts` | Existing host cadence and repeat actions; never scientific clocks |
| `ui/views/canvas.ts`, `spatial-data.ts`, `spatial-geometry.ts`, `spatial-symbols.ts` | One shared grid/spatial renderer, boundary validation, primitive paths and exact shared paint/pick geometry, frame/disposal guards |
| `ui/views/network.ts` | Existing Cytoscape layout/fit/selection/labels and directed edges; do not rebuild graph layout in model scripts |
| `ui/views/chart.ts` | Shared line/scatter/bar SVG renderer, categorical preparation, geometry, legend and accessible quantities |
| `ui/views/appearance.ts`, `ui/svelte/views/theme.ts` | Renderer presentation/theme contract and existing theme token projection |
| `ui/palette/scientific.ts`, `netlogo-color.ts`, `netlogo-colors.ts` | Five semantic DES statuses and exact NetLogo numeric color compatibility; not interchangeable meanings |
| `ui/svelte/views/View.svelte`, existing shadcn controls | Host dispatch to shared renderers, accessible controls, inspector/table display, keyboard network selection; extend rather than duplicate |
| `src` public Agent/World/Agenda/Random/Graph/Grid/stats | Headless domain owners. UI may project detached observations and call public actions, never own capacities, queues or physical time |

`ui/urban-authoring.types.ts` is compile-only contract evidence, not a visual engine. Existing graph/core layout algorithms are reusable only when their semantics match diagram/topology needs; a physical field must not be relaid out as an arbitrary graph.

## Current public shape and defaults

The ordinary declaration already is flat:

```ts
export const ui = defineUI(model, {
  live: { influence: { set: (instance, value) => instance.setInfluence(value) } },
  monitors: [{ label: "Tick", value: state => state.tick }],
  views: [{ type: "network", label: "Peer network",
    nodes: state => state.nodes, edges: state => state.edges }],
});
```

Omitted setup includes descriptor fields; keyed live fields are excluded from setup by default. Keyed live values infer from a compatible `state.parameters[field]`; explicit getters override it. Existing legacy setup/live arrays remain compatibility syntax. Actions explicitly invoke public model functions; monitors format scientific values without rounding model state. There is no binding-driven reflection that invokes arbitrary model methods.

Current `View<S>` supports network `nodes/edges`, grid `data`, spatial `data`, line/scatter/bar `series`, table `rows`, plus separate inspector `value(state, selected)`. Views project detached data. Network IDs, cells and agents connect selection; unrelated entities must have distinct IDs. The host cannot infer a semantic identity from overlapping strings. Table rendering currently displays at most 200 rows, explicitly a presentation limit rather than a scientific truncation rule.

Spatial data already supports width/height; optional cells/segments; required agents; labels/description; circles/triangles/rectangles/diamonds; optional CSS size, or diagram-unit extent for rectangles; fill/outline. Coordinates are centered, positive y upward. CSS size is not collision radius. Labels/segments are nonselectable. Mixed scenes pick actual painted shapes in reverse painter order; pure old circle/triangle scenes preserve their nearest-selection behavior. Candidate buffers reject nonfinite arithmetic and unsigned-32-bit overflow before publication. Shared delayed ResizeObserver writes coalesce and cancel on disposal; preserve these guards.

Charts currently consume explicit `{label,color?,points:[{x,y}]}`. Bar categorical order is first-seen, missing categories leave gaps, duplicates within a series reject, mixed numeric/string x rejects, signed values use a zero baseline and nonfinite points are omitted. Current numeric chart extents include zero and at least one. New optional accessor/scale helpers must not silently reinterpret these old contracts. Axis `unit` is a label, not conversion. Chart legend already exists; any shared legend must reuse a single encoding owner instead of inferring category identity from per-frame ordinal position.

## Representative observations and scientific traps

The following facts come directly from the paired sources; type consumers can use `Observation<typeof model>` to preserve inference.

### Traffic 2 Lanes

`model.ts` snapshot exposes `{tick,width:41,height:17,parameters,selectedCarId,perspective,cells,cars,history}`. Cars include canonical id, x/y/heading, speed/topSpeed/targetLane/patience and source colors. `ui.ts` already has explicit public live setters, source attribution, drawing `intent` calling `selectCarAt`, watch/follow/reset actions and selected-car inspector. Follow projection wraps x around the 41-unit domain; do not replace that physical/camera rule with automatic layout. Three charts repeat history field mapping (speed, patience, lane counts), a good shared authoring opportunity. Selected/current/source category colors have established meanings and cannot become unstable frame-order colors.

### Heat Diffusion

Observation exposes width/height, parameters, `plateSize`, explicit `minTemp/maxTemp`, `heatDiffusivity`, cells `{id,x,y,temperature,oldTemperature,legendLevel,inPlate}`, history and `randomState`. UI uses the fixed observed min/max to normalize plate temperature or legend level, handles constant range at fraction 0.5, clamps to [0,1], then calls `netLogoColor(10 + min(9.9, fraction * 10))`. Background mask is gray. This compatibility mapping and the model's synthetic temperature semantics must remain explicit; generic frame min/max or a new palette changes portrayal. Existing live boundary temperature/material/diffusivity actions are model-owned.

### Diffusion on a Directed Network

Observation exposes nodes `{id,index,x,y,value}`, edges `{id,from,to,fromIndex,toIndex,active,currentFlow}`, counts, `totalValue/maxValue/maxFlow/meanFlow`, histogram `{edges,counts}`, history and `randomState`. UI filters actual active directed edges. Current node diameter is `4 + 50 * sqrt(node.value / totalValue)` (zero total handled); edge width is `1 + 4 * clamp(currentFlow / maxFlow)` with finite guards. Those are explicitly relative encodings, not absolute physical units. Initial node positions are topology coordinates scaled by 25 and inverted y; network owns subsequent layout. Any reusable encodings need to declare these normalization domains and keep the domain measures unchanged.

### Wealth Distribution

Observation exposes a 51×51 world, `peopleCount/totalWealth/classes/gini/lorenz`, agents `{id,x,y,heading,wealth,age,life,metabolism,vision,class}`, fields with grain quantities, history and RNG continuation. Spatial classes, bar and history need a stable common low/middle/high mapping. Grain color is an explicit synthetic quantity-to-yellow-channel transform; do not turn it into a different source-calibrated quantity. Lorenz curve uses percentages and an explicit equality diagonal; those are not arbitrary diagram numbers. Model computes class thresholds and Gini; UI formats and projects them.

### Household Recycling Behavior

Model uses explicit World activation, two-phase compute/commit, seeded Random and bounded History. Read returns frozen `{tick,parameters,adopters,share,nodes:[{id,label,recycling}],edges,history,done:false}`. The concise UI maps node labels to H1..Hn to avoid long-label crowding, retains actual household/recycling inspector and charts `history.map(sample => ({x: sample.tick,y: sample.values.share!}))`. A chart accessor can remove repeated mapping; no new History or UI-owned adoption measure is needed. Keep graph identities and seeded update order intact.

### Workplace/household membership and zoning study

Membership read returns canonical-id graph nodes/edges, people/group records and measurements; its short network/table UI should stay. Zoning read returns serial study outcomes and replication summaries; mean/sampleSd may be numeric or unavailable text. Preserve missingness, scenario/replication ordering, dwelling-slot units and two-decimal presentation only. A categorical bar accessor must not invent zero for missing results or relabel synthetic slots as area/volume.

### DES office, EV, buffer and elevator

Office read exposes actual Resource `waiting` count and `busy=used`, residents `{number,arrived,started,completed,status}`, history and clerks parameter. It does **not** currently expose a canonical ordered waiting-owner snapshot. A generic waiting-items binding needs an additive model-owned snapshot if actual order matters; filtering resident admission order is not a future-proof queue API. Completed residents are ledger facts, not assigned seats. Reducing capacity with retained holders can make occupancy exceed nominal capacity; show retained claims rather than hiding them or inventing person-to-desk assignments.

EV read has `active=used`, actual Resource waiting count and **ordered** `waitingVehicles` from `chargers.waiting.map(request => request.owner)`, plus vehicle number/duration/start/finish/status/priority. Preserve priority order, not array admission order. UI's add-priority action uses actual priority −1 and explicit waiting cancellation.

Goods read provides Store-owned `crates`, `blockedCrates` directly from waiting puts, `deliveries`, and produced/stored/blocked/collected counts. Empty bounded slots and blocked puts outside are different states. Do not duplicate store occupancy in a generic view.

Elevator read provides separate Agenda `time` and World `tick`, cars `{id,number,floor,direction,status,used,capacity,passengers}`, passengers `{id,number,from,to,requested,boarded,arrived,car,status}`, and **actual ordered** `floorQueues`. Cabin Resource alone owns occupancy, floor ServiceQueue alone waiting. Diagram floor/shaft geometry has real semantic structure, so a generic group layout should not replace its special elevation. Defaults are six floors/two cars/four slots, seconds; discrete floor moves, alighting before boarding, original-age directional calls and bounded event dispatch are accepted. Post-dispose reads are historical snapshots, not active Resource claims. No physical lift certification is claimed.

Water allocation units are synthetic allocation units; introducing m³, hydraulic pressure or invented households would change the scientific claim. Bike stock is conserved among actual stations and transit; capacity slots are not arbitrary anonymous people. Graph layouts must retain actual links and physical/grid topologies.

## Decision questions for both experts

1. Which additions eliminate repeated author work while reusing current view records and renderers? Can defaults handle ordinary tasks without mandatory style/layout arithmetic?
2. How do category identities stay stable across filters, views and time without per-frame ordinal palettes? Where is the one owner of a shared encoding/legend? How are unknown categories and missing values explicit?
3. How is a quantitative domain declared, including constant/empty/negative/nonfinite cases, units, clamping and explicit relative-per-frame normalization? Do old low-level projections remain exact compatibility paths?
4. Can unordered counts, ordered items and occupied capacity be distinct small typed contracts without becoming another generic scene DSL? How do overflow, retained claims, identity and accessible summaries work?
5. Which scripts stay unchanged? Which fields need additive detached observations because current model authority cannot be inferred correctly in UI? Does an abstraction improve both writing and reading rather than only reducing line count?
6. What four or five complete diverse public scripts freeze each expansion phase, including useful omission defaults and compile-time rejection of incompatible accessor types? How will they execute headlessly and through both hosts?

Prior coordinate-helper/groups/legend/encoding proposals are exploratory, not accepted names or contracts. The root coordinator will synthesize independently after both reports. Experts must incorporate this common source context before final conclusions and keep their proposals independent of one another.

## Evidence limits

This dossier is a static source inventory and representative semantic audit. It executes no model changes, browser flows, scientific counterchecks or new API tests. Prior 2D/elevator approval belongs to its previous task; it does not approve a future universal API. Final all-146 changed/kept rationale, baseline/new selected observations and RNG continuation, smoke manifests, independent refactors/code review, current browser and actual-image gates belong to implementation acceptance.
