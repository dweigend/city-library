# Universal UI: contract analysis

Keep `defineUI` and its existing views as the ordinary authoring language. The useful extension is a small, pure projection for repeated collection diagrams, supported by nonselectable decoration and inspectable large collections. Scientific scales and category mappings need explicit contracts, but do not yet justify a universal encoding configuration layer.

This is an independent proposal, not an accepted API, implementation review or scientific approval. Baseline: `a78bd2359e7a12ac537be131ca8d3023c4b718eb`, branch `feat/salabim-concepts`. Only this report was written. No runtime, model, example or accepted contract was changed. No other expert's draft was read.

## Evidence and whole-catalog scope

I read the [context dossier](universal-ui-context.md), its direct supplier message and the complete machine-readable [146-pair inventory](universal-ui-inventory.json), then checked representative implementation boundaries and callers independently. The inventory has 146 distinct slugs, matching model files, and no recorded model-to-UI import. Entry counts are line 102, spatial 99, inspector 61, bar 32, table 32, grid 24, network 11 and scatter 5. These overlap. The dossier's 113 candidate entries are triage, not 113 required migrations.

Preparation includes AGENTS, README, PLAN's example-first and acceptance gates, ARCHITECTURE's ownership/public-boundary rules, DESIGN, full CODING_STANDARDS, UI reference and terminology. The original model-script and library refactor skills, their shared workflow and both decision references were read under `/home/david/Projekte/city-library/.agents/skills/`. Their minimum-sufficient-architecture rule is especially relevant: another accessor wrapper is not automatically an improvement over a readable `.map`.

This is a catalog-wide contract audit informed by the supplier's all-pair source inventory, with direct semantic inspection of representative scripts. It is not a claim to have independently executed or deeply reviewed every scientific mechanism.

## Findings and objections

1. **The flat authoring language already exists.** `ui/authoring.ts` owns setup omission, keyed live getters, decoding and monitor correlation. Reimplementing those defaults in another universal entry would create competing semantics. Keep existing `defineUI` overloads, including `NoInfer` protection against a callback widening the model parameter type.
2. **The missing diagram abstraction is presentation, not a new model.** Office, goods and bike scenes repeat wrapping, spacing, extents and labels. Those operations can be shared without importing Resource, Store, World or Agenda. A function should return existing `SpatialData`; it should not mount a renderer, register a widget or start a session.
3. **Count, quantity, capacity and identity are different channels.** Twelve allocation units are not twelve known households. Four occupied capacity units need not identify four people: a Resource claim may request multiple units. An array's length is not universally `used`. A capacity display cannot assign a person to a numbered desk merely because both arrays have the same index.
4. **Sequence must come from its owner.** Office exposes a Resource waiting count and admission ledger, not canonical ordered waiting owners. EV exposes `waitingVehicles` from the actual Resource queue. Goods exposes Store items and waiting puts. A generic projection preserves supplied order; it never establishes queue priority by filtering or sorting the ledger. Office can show an unordered waiting set now; an ordered queue needs an additive detached model observation first.
5. **Scope must not erase identity.** Current selection is one `string | null` per mounted experiment, shared across views. Do not replace it with an implicit category key or view-local index. Reuse `resident:7` across its diagram/table/inspector; do not turn it into `waiting:7` when state changes. The semantic key must survive movement between groups.
6. **Defaults can conceal scientific changes.** Replacing Heat Diffusion's fixed observed limits with current-frame extrema changes what a color means. Replacing the directed network's square-root diameter formula with a linear diameter changes relative area. Both may look plausible and still be wrong.
7. **Large tables are currently incomplete displays.** Both `ui/compose.ts` and `ui/svelte/views/View.svelte` slice to 200 rows. The data is intact, but users cannot inspect later rows there. Do not describe this as complete large-collection inspection or use it to justify silently clipping a new diagram.
8. **Atomicity is bounded.** Canvas validation preserves its last valid projection. Session actions and arbitrary callbacks are not transactions. A failed action may already have changed the model; creating a candidate successfully does not promise rollback if later view mounting fails. New projection purity cannot imply whole-session rollback.

## Reuse map and limits

| Capability | Existing owner | Proposed use / limit |
| --- | --- | --- |
| Public records and inference | `ui/definition.ts`, both public indexes | Add only the proposed projection types and optional picking flag; retain all existing forms |
| Authoring defaults | `ui/authoring.ts` | No parallel normalization, inferred actions or reflective model setters |
| Host lifecycle | both `compose.ts` files, `ui/svelte/session.ts` | Existing create/read/action/disposal paths; no second clock or scheduler |
| Playback/repetition | `ui/playback.ts`, `ui/actions/repeat.ts` | Unchanged; model steps remain explicit |
| Shared spatial pipeline | `ui/views/canvas.ts`, `spatial-data.ts`, `spatial-geometry.ts`, `spatial-symbols.ts` | Project to existing rectangles, circles, labels, segments, extent and description; reuse validation and picking geometry |
| Graph placement | `ui/views/network.ts` | Existing Cytoscape preset/fit/COSE behavior; do not build a competing graph layout engine |
| Grid/topology | public Grid and `topology`, `src/grid/topology/layout.ts` | Reuse actual supplied grid positions/topology; do not instantiate a live Grid merely to arrange a queue |
| Charts | `ui/views/chart.ts` | Existing preparation, categorical bars, axes, geometry, legend and accessible values; no new chart renderer |
| Colors | `scientificPalette`, `netLogoColor` | Reuse semantic statuses and exact compatibility conversion; these are not interchangeable palettes |
| Styles | appearance/theme modules and component tokens | Shared diagram spacing and glyph defaults live here or in its cohesive projection module, never as per-model magic numbers |

The inspected public core has topology layouts with finite cell-count limits; it is not a general unbounded packing service. The existing network renderer owns graph layout. Reusing either by name alone would be a semantic mismatch for large ordered collections. A small deterministic row-wrapping calculation inside the projection is justified; a new general layout framework is not.

## Proposed minimal additive contract

The proposed names below are recommendations only. Freeze them with the coordinator's examples before implementing them. The function is an ordinary data adapter within the existing UI API, not an alternative declaration syntax.

```ts
type DiagramItem = Pick<NetworkNode, "id" | "label" | "color">;

type CollectionContent =
  | { readonly kind: "count"; readonly count: number;
      readonly items?: never; readonly used?: never; readonly capacity?: never }
  | { readonly kind: "items"; readonly items: readonly DiagramItem[];
      readonly order?: "unordered" | "supplied";
      readonly count?: never; readonly used?: never; readonly capacity?: never }
  | { readonly kind: "capacity"; readonly used: number; readonly capacity: number;
      readonly unit: string; readonly items?: never; readonly count?: never };

type CollectionRow = CollectionContent & {
  readonly id: string;
  readonly label: string;
  readonly color?: string;
};

function collectionDiagram(rows: readonly CollectionRow[]): SpatialData;

// Add to SpatialAgent, not to the domain Agent:
// readonly selectable?: boolean; // omitted = true, retaining compatibility
```

Use a separate item row next to a capacity row when both identities and occupied units matter. This deliberate small duplication prevents a false invariant `used === items.length`. It also avoids needing generic Resource ticket adapters in the UI. A concrete later need for fractional stock is already served by capacity's finite numeric quantities; it must not use the integer-only count variant.

Defaults and exact semantics:

- Rows retain declaration order. No nested rows, edges, containers, scene tree or style configuration. Empty input returns a positive finite empty scene with description `No collections` and no invented entities.
- Row IDs and labels are required nonempty strings. Labels are display text, not identity. Row IDs must be unique. Item IDs must be nonempty and unique across item rows in this projection; duplicate IDs reject rather than letting one entity occupy two states silently. The same semantic item may reuse its ID in another view.
- Item `label` defaults to its ID; item color overrides row color, which defaults to `scientificPalette.neutral`. Omission does not assign a status or infer a category. Colors already supplied by scientific projections remain exact.
- `count` is a nonnegative safe integer. It renders an exact number and label, not that many selectable fake entities. Zero is visible. Reject negative, fractional, nonfinite and unsafe counts.
- Capacity `used` and `capacity` are finite nonnegative quantities in the same required, nonempty unit. Zero capacity is valid. The display states the exact raw pair and `max(0, used - capacity)` excess; it does not clamp the reported value, release claims or hide retained overcapacity. Reject arithmetic overflow when calculating derived values. The visual frame is symbolic, not a seat map or a physical volume. No division is needed to render the default pair.
- Items render every supplied identity; no default slicing. `order` defaults to `unordered`: placement preserves the array but makes no queue/rank assertion. `supplied` means ordinal order from the observation; it does not assert FIFO. Accessible text includes that order. The helper never sorts, admits, groups or derives status.
- Layout wraps using shared fixed presentation tokens, computes finite bounds, and uses existing camera fit/zoom. Empty item rows remain named, with zero count. Large scenes remain complete, and exact inspection is available through the existing inspector plus the paginated table requirement below. If representability/allocation fails, reject explicitly; never silently omit items.
- All resulting coordinates and extents are abstract diagram units. They do not become World/Grid coordinates. No arbitrary spacing or font options are added to author scripts. Use the existing low-level spatial view for a genuinely different geometric task.
- Count/capacity frames and decoration have `selectable: false`. Labels/segments already cannot be selected. Generated decoration IDs use deterministic length-prefixed internal keys, are checked against item IDs, and cannot enter selection. Do not promise that an internal prefix can never collide with arbitrary user strings.
- Omitted `selectable` retains old behavior. Explicit false excludes a symbol from pointer and keyboard selection and any chooser; an all-decoration scene selects nothing. Legacy pure-circle nearest-picking remains the default for old declarations, but cannot pick excluded decoration. Do not change ordinary old picking to topmost geometry accidentally.
- The helper reads plain detached data, returns detached arrays and keeps no model references, timers, RNG or module-level mutable cache. Mutating its output cannot mutate its input. It validates the complete input before returning anything. Invalid shape/type yields `TypeError`; invalid numeric range, duplicates or overflow yields `RangeError`. Callback purity is not enforceable by TypeScript, so the helper accepts data rather than user callbacks.

### Concrete author tasks

Goods currently has separate loops and hard-coded slot coordinates. Its UI can retain its existing declaration and replace only its scene projection:

```ts
function bufferScene(state: Observation<typeof model>): SpatialData {
  return collectionDiagram([
    { id: "blocked", label: "Blocked puts", kind: "items", order: "supplied",
      color: scientificPalette.waiting,
      items: state.blockedCrates.map(crate => ({ id: `crate:${crate.crate}` })) },
    { id: "stock", label: "Stored crates", kind: "items", order: "supplied",
      color: scientificPalette.active,
      items: state.crates.map(crate => ({ id: `crate:${crate.crate}` })) },
    { id: "capacity", label: "Store capacity", kind: "capacity",
      used: state.stored, capacity: state.parameters.capacity, unit: "crates" },
    { id: "collected", label: "Collected", kind: "items",
      color: scientificPalette.completed,
      items: state.deliveries.map(crate => ({ id: `crate:${crate.crate}` })) },
  ]);
}
```

The model stays unchanged: actual Store ownership is already exposed. The new portrayal is intentionally a collection diagram, not an assertion that crates own particular numbered storage slots. Migration must record that presentation change.

For Office, use count rows for waiting/completed and a capacity row for `busy/clerk` quantities until an ordered observation is added. An unordered resident item row is valid if its label says waiting residents; calling it an actual queue is not. For EV, map `waitingVehicles` in its supplied order and resolve each vehicle against the detached ledger. For non-DES experiments, use collection diagrams only where the user task is to inspect categories or counts. Segregation's spatial neighborhood must remain a grid: replacing it with categorical rows loses adjacency, which is the model's point.

### Inference and public compatibility

No extra generic is needed for `collectionDiagram`. Its output uses current public records. Ordinary `.map` inside `defineUI` already infers each observation item exactly; extracted projections use `Observation<typeof model>`. This avoids heterogeneous-array inference that degenerates to `unknown`, intersection types or `any`.

Do not add a `T` shared by all views: agents, cells and chart samples are different types. Do not attempt to infer entity identity from a field named `id` and category identity from another string of the same type. Preserve the exact keyed-live mapped type and monitor getter/formatter correlation. Invalid count/capacity mixtures should fail typechecking, and boundary validation must also reject them in JavaScript. Optional `never` fields are not a substitute for runtime discriminant validation.

Both public UI indexes must export the same proposed projection/type surface. The package's headless core entry must not export UI or acquire UI dependencies. No alias for `defineUI`, no second scene entrypoint and no generic plugin registry are required.

## Scientific and categorical contracts

I recommend **no generic encoding layer in the first slice**. It has a larger semantic surface than the collection problem. First preserve explicit formulas, and use existing palettes. A shared readonly category-to-color map is already ordinary TypeScript and can be consumed by cells, nodes and chart series without a new renderer or state owner.

If evidence later justifies a public categorical helper, its minimal contract should be a function over an explicit complete category definition, not registration by encounter order:

```ts
type CategoryStyle = { readonly label: string; readonly color: string };
type Categories<K extends string> = Readonly<Record<K, CategoryStyle>>;
// A caller can already write:
// const styles = { low: ..., middle: ..., high: ... } satisfies Categories<Class>;
// color: styles[agent.class].color
```

Keep category keys stable independently of labels, filtering, series order, insertion order and time. Unknown categories reject at the projection boundary unless the author explicitly supplies an unknown category. Do not default unknown categories to the first color. Do not silently derive a color by hashing: a hash is stable but cannot preserve source meanings or guarantee distinct colors. Omission of a mapping means the existing neutral/default rendering, not guessed categories. Declaration order may order a legend, but cannot determine the category's color. A legend must consume the same explicit mapping, never reconstruct it from the first visible series. Existing chart legends already handle ordinary charts; do not add a second universal legend now.

Quantity proposals need an explicit channel and normalization policy. Color, CSS-pixel diameter, area, edge width and world-space extent are not interchangeable. A future descriptor would require `channel: "color" | "diameter" | "strokeWidth"`, a fixed domain or explicit per-projection auto domain, and a channel-specific output mapping. Do not implement that union merely because it can be typed. In particular, zero diameter conflicts with the current positive-size contract; skipping a point is a separate semantic decision, not an incidental divide-by-zero fix.

Freeze these semantics before accepting any quantity extension:

| Case | Required behavior |
| --- | --- |
| Domain omitted | No inferred quantitative encoding; retain current low-level binding |
| Fixed domain `[min,max]` | Finite limits, `min <= max`; normalization uses these limits even when filtered data changes |
| Explicit auto domain | Compute over this projection's declared finite values, before presentation clipping; mark the result as relative in accessible text |
| Constant domain | Explicit fraction 0.5 if matching Heat Diffusion; never overwrite another existing formula's zero-total behavior |
| Missing measurement | Explicit `null`/missing policy, never invented zero; preserve original unavailable text and categorical gaps |
| Nonfinite value | New strict helper rejects; old chart's nonfinite-omission semantics remain compatible |
| Negative value | Valid for signed measurements/charts; not a count/capacity. A scientific mapping decides what it means |
| Out of domain | Explicit clamp or rejection policy; preserve Heat Diffusion's clamp, do not assume clipping for all quantities |
| Unit | Required where the model gives one; display metadata only, never conversion or an invented physical unit |
| Empty auto domain | No scale or invented extent; explicit empty state |

Heat Diffusion must retain `minTemp/maxTemp`, midpoint 0.5, clamping, `netLogoColor(10 + min(9.9, fraction * 10))`, and its background mask. The directed network must retain `4 + 50 * sqrt(value / totalValue)` and `1 + 4 * clamp(currentFlow / maxFlow)`, including their zero/nonfinite guards. Wealth retains class thresholds in the model, the source grain transform and Lorenz percentages/equality line. DES water uses synthetic allocation units, while stormwater retention really reports m³. A universal unit called “water” cannot represent both.

## Large collections and lifecycle

Add shared table paging to the existing table implementation, with a visible `shown / total` range and controls to reach every row. Preserve first-record column ordering and blank missing values. Keep the existing first page of 200 as a compatibility-friendly default; expose subsequent pages rather than introducing arbitrary per-model page sizes. Empty rows yield a deliberate empty state. Page state is host-owned and clamps when the collection shrinks; Setup resets it. Paging never mutates or truncates model data.

This is an existing-view behavior correction, not a new view kind. Both hosts need equivalent behavior. A later selectable table needs its own row-ID contract; do not silently use row index as an entity ID. Until then existing inspectors handle selected diagram items, and tables provide complete scalar inspection without selection-driven actions.

Validate a new collection projection before updating the canvas. A failure leaves that view's last valid scene, reports an error and stops playback through existing host handling. Do not claim other monitors/views from the same refresh rolled back. Selection-dependent actions must resolve the selected ID against the current observation; disappearance or filtering does not authorize acting on a different item at the same array index. Setup clears selection. Dispose must cancel pending resize/render work, remove controls/listeners and prevent stale callbacks from changing a replacement instance.

## Example-first phases

The coordinator should freeze **five complete public scripts for one expansion phase**, covering the chosen collection helper, picking addition and complete table inspection together. Do not create a separate four-example phase for every tiny internal change. The following are exact author tasks and assertion requirements, not delivered scripts or passing tests. Each target script must contain actual public imports, a complete model/UI declaration, executable assertions and browser-host cases before runtime work starts; helper mocks or hand-built expected output substituted for the new API do not count.

| Proposed script | Complete author task and frozen assertions |
| --- | --- |
| `01-counts-and-empty.ts` | A small headless public model exposes counts including 0. Bind count rows with omitted colors, no layout numbers. Assert exact counts in description, no selectable fabricated people, valid empty diagram, no model initialization at declaration, negative/fractional/nonfinite count rejection and detached output |
| `02-store-items.ts` | Bind the real goods model's Store item/blocked/delivered snapshots. Advance through producer blocking and collection. Assert every actual crate ID appears once, blocked order equals Store observation, all crates remain reachable above 200, labels/color defaults and overrides, no fabricated slot allocation, public action effects and unchanged model observation |
| `03-resource-capacity.ts` | Office capacity reduction retains holders; EV priority/cancellation supplies actual order. Assert `used > capacity` remains visible, no occupant-to-desk identity, zero-capacity fixture remains valid, EV order follows `waitingVehicles`, Office does not claim ordered waiting without an additive owner snapshot, stale selection never targets a replacement item |
| `04-nondes-scientific-compatibility.ts` | Keep real Heat Diffusion and directed-network projections. Assert exact colors at minimum/midpoint/maximum/constant range and exact size/width outputs for known observations; no inferred rescaling after filtering. Assert Wealth category identity/color agreement across spatial/bar/history. Use complete existing models through public observations; preserve RNG continuation |
| `05-host-lifecycle-and-inspection.ts` | Mount the same complete declaration through both hosts. Assert unchanged legacy circle picking, decoration exclusion, actual identified-item selection, table rows 201 and last row reachable, short lists/empty state, invalid projection retains previous canvas, pending callback cannot act after disposal, Setup resets selection/page, no state/RNG change from repaint |

The first four scripts need headless assertions wherever possible; the fifth runs in the existing browser harness. A script may export a browser exercise in addition to headless checks. Do not claim a DOM mount test runs headlessly. Add compile-only cases for wrong discriminants, `items` combined with `count`, incorrect action/setter values, observation inference from named projections and both adapter exports. Keep earlier authoring/spatial/elevator examples unchanged as regressions.

If the coordinator later accepts category/quantity or chart-accessor additions, require a separate four/five-script phase before that runtime: stable cross-view categories, exact fixed scientific scale, explicit relative network scale, signed/missing categorical chart, and old-contract compatibility. Do not bundle speculative new declarations into the first phase merely to reach more experiments.

## Migration decisions across all 146 pairs

Every inventory row requires an explicit final decision; “113 candidates” is not a migration plan. Default to **retain**, and change only when an accepted capability removes real duplication or repairs an identified contract gap. All 146 still participate in shared-runtime regression scope.

Retain the short workplace-household-membership, zoning-scenario-comparison, residential-occupancy, stormwater-retention, solar-battery-microgrid, urban-tree-watering, pedestrian-crossing-phases, household-energy-demand and neighborhood-heat-intervention declarations. They already expose explicit actions, direct views and sensible units. Their short history maps do not need a wrapper merely for fewer characters. Birthdays' table/history projection is also readable. Retain Honeycomb's small explicit hidden-agent projection and source metadata.

Prioritize selected DES scene helpers for collection migration where geometry conveys no physical fact. Keep existing 15–24-line DES `ui.ts` declarations largely intact. Keep elevator's elevation/shaft projection within `SpatialData`; its longer length has semantic purpose. Keep traffic follow/wrap geometry, grid adjacency, graph connectivity, source palette formulas and taxicab procedural interactions unless a separately justified task addresses them. Do not mass-format long scripts or change model update order while adopting presentation defaults.

For each of the 146 inventory rows, the implementation manifest should add:

```ts
type MigrationDecision = {
  slug: string;
  baselineModelHash: string;
  baselineUIHash: string;
  decision: "retain" | "projection-only" | "add-observation" | "defer";
  reason: string;
  capability: string | null;
  changedFiles: readonly string[];
  preservedUnits: readonly string[];
  identityAndOrderContract: string;
  normalizationAndPaletteContract: string;
  intentionalPresentationChanges: readonly string[];
  headlessCases: readonly string[];
  browserCases: readonly string[];
  evidence: readonly string[];
  remainingFindings: readonly string[];
};
```

An additive observation must expose already-owned facts, not create another queue or occupancy cache. Its parity comparison ignores only the deliberately added snapshot fields; it must still compare all previous observations and RNG continuation. Expected-value changes need separate scientific justification and cannot be hidden as a UI migration.

## Verification and acceptance boundaries

Before implementation, save baseline headless observations and continuation for each changed model/projection at Setup, selected steps/times, live changes and edge states. For UI-only changes, the existing model hashes should remain identical. Test no RNG consumption or time advancement under repeated projection, selection, resize, theme change, filtering and paging. Seed equality alone is insufficient; compare next draws or exact exposed random state and selected trajectories. Preserve Agenda time separately from World tick and action invocation counts.

Run strict TypeScript, public examples, relevant behavior tests and the shared build/consumer checks. The collection helper must be callable without DOM; importing it must not initialize a model or create a timer. Exercise rejected data without changing input arrays, canonical model objects or the previously valid canvas. Include two independent instances to catch global palette/selection/cache leakage.

Because shared renderer/selection/table code affects retained scripts too, run an all-146 catalog smoke manifest through Setup and bounded stepping, with expected static/complete cases documented. Both hosts need representative contract replay; all affected flows need current browser evidence. Use desktop 1366×768 and narrow 390×844, light/dark, for changed scenes and the affected table/selection states. Inspect screenshots for clipped capacity excess, invisible empty rows, overlapping labels, complete IDs, meaningful non-color cues and narrow-table navigation. Obtain the required independent actual-image review and substantial design/transfer review; keep findings and responses separate from approval.

Executed for this report: read-only branch/status/revision inspection, source/reference reads, inventory count/uniqueness/pair checks, representative source comparison. No runtime tests, typecheck, build, browser flow or screenshot review was run because only this report was authorized. This report supplies objections and implementation proposals; it does not close any of those acceptance gates.
