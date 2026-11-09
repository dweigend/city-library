# Universal UI authoring proposal (author-facing API and reuse)

Baseline `a78bd2359e7a12ac537be131ca8d3023c4b718eb`, branch `feat/salabim-concepts`. Role: independent design expert for author-facing API, reuse and migration ergonomics. This is a **proposal**, not an accepted API, implementation, review approval or browser acceptance. No runtime, model, UI or example file was changed. The root coordinator synthesizes independently.

Inputs read: AGENTS, README, PLAN, ARCHITECTURE (binding rules), DESIGN, CODING_STANDARDS, `docs/ui/{README,api-table,api-reference}.md`, terminology, the original `refactor-model-scripts` and `refactor-library` skills, the shared refactoring workflow and both decision references under `/home/david/Projekte/city-library/.agents/skills/`, all of `ui/definition.ts`, `ui/index.ts`, `ui/authoring.ts`, `ui/views/{appearance,spatial-data,spatial-geometry,spatial-symbols}.ts`, relevant parts of `canvas.ts`, `chart.ts`, `network.ts`, `ui/palette/scientific.ts`, core `topology`, `geometry.map`, `storage.history`, the UI example harnesses, and the [context dossier](universal-ui-context.md) plus [146-pair inventory](universal-ui-inventory.json). Dossier facts are incorporated below; counts marked *measured* come from my own scans of all 146 `ui.ts` files.

## 1. Summary

The current authoring language is already flat, typed and mostly readable. Three evidenced problems justify additions; everything else should stay as ordinary TypeScript.

| ID | Addition | Evidence | Kind |
| --- | --- | --- | --- |
| A | Spec-level `change(instance, changes)` default for keyed live fields that omit `set` | 511 of 538 live setters in 125 files are `instance.<one method>({ field: value })` with the key equal to the field; every file uses one method only (*measured*) | Additive control default |
| B1 | Allow `extent` (diagram units) on every spatial shape, not only rectangles | Existing `symbolDimensions`/`symbolPath`/`hitSceneSymbol` already take width/height for every shape; only validation restricts it | Constraint relaxation of an existing field |
| B2 | Public pure projection `arrangeCompartments(compartments, options?) → SpatialData` | Six DES scenes repeat "pack items in columns, draw capacity slots, place overflow, add headings, write counts"; 110+ unexplained layout literals in `scene.ts` files (*measured*) | Additive projection helper returning existing `SpatialData` |
| R | Chart default series colors keyed by series label per mounted view, not by per-frame index | `chart.ts` uses `palette[index % palette.length]`; a filtered or conditional series shifts later colors | Renderer correction, no new API |

Explicitly **not** proposed: a scene DSL, new view type, encoding/scale layer, generic legend, history accessor, auto-inspector, default Tick monitor, group/legend/encoding configuration, aliases or a configuration layer. Section 6 explains each rejection.

## 2. Audit findings across all 146 pairs

Facts (*measured* unless stated as dossier facts):

- View usage per entry (dossier): line 102, spatial 99, inspector 61, bar 32, table 32, grid 24, network 11, scatter 5.
- Keyed live is the only live form in use (126 files); no experiment uses the legacy live array.
- Live setters: 538 total; 511 uniform single-key forwards (`setParameters` 294, `setRules` 200, `setLive` 6, `setSwitches` 6, `setColors` 2, `setDisplay` 2, `setConfiguration` ≥1). Distribution of uniform setters per file: 0 → 35 files, 1–2 → 30, 3–5 → 52, ≥6 → 29. `taxi-cabs/ui.ts` (441 lines) spends ~200 lines on 36 identical `setParameters` forwards.
- Non-uniform setters are meaningful and must stay explicit: `virus.agentShape` transforms the value; small city/DES entries call named domain actions (`setClerks`, `setChargers`, `setRain`, `setSlots`, `setInfluence`, …).
- History projection `state.history.map(p => ({ x: p.tick, y: p.<metric> }))`: 240 occurrences in 91 files. Each is one readable line of ordinary TypeScript. Only three entries (`stormwater-retention`, `residential-occupancy`, `pedestrian-crossing-phases`) consume core `History` samples and need `values[key]!`.
- 448 hexadecimal color literals in 96 `ui.ts` files; `netLogoColor` in 28 files; `scientificPalette` only in DES scenes/elevator. Most literals are source-portrayal colors of NetLogo ports (dossier: heat-diffusion tenth mapping, wealth grain transform, fire ember formula). They are scientific/compatibility encodings, not interchangeable style tokens.
- Stable category colors already have a good local pattern: `wealth-distribution` keeps one `colors` record keyed by class and reuses it in spatial and line views. `segregation` repeats `#355fa5`/`#d97719` across grid and charts — a local-constant refactor, not an API gap.
- Layout literals: DES `scene.ts` files contain 13–19 decimal x/y/extent literals each (office 13, goods 16, EV 19, parcel 18, waste 15, bus 14, bike 12); `des-elevator/ui.ts` 15. Outside DES only `robby-the-robot` shows more than two. Non-DES spatial views use model coordinates directly.
- CSS-pixel symbol sizes (`size: 5`, `8`, `10`, `14`, …) appear in many NetLogo ports. They approximate source turtle sizes and need no change unless a script is otherwise being migrated.
- 63 inspectors resolve `find(item => item.id === selected)` against domain records. That lookup is required because the host only knows presentation records.
- 112 entries declare a Tick monitor, with diverging labels/units (`Tick`, `Time (min)`, `Day`, `Hour`, `Time (s)`), so a default monitor would guess model time semantics.

Dossier facts that constrain the design: office exposes no canonical ordered waiting owners; EV exposes ordered `waitingVehicles` from `Resource.waiting`; goods exposes `crates` (`Store.items`) and `blockedCrates` (`Store.waitingPuts`); elevator exposes ordered `floorQueues` and Resource-owned cabin occupancy and keeps its special elevation; water units are synthetic allocation units; directed-network size/width are explicitly relative normalizations; heat-diffusion uses fixed observed min/max plus 0.5 constant fallback and exact NetLogo tenth mapping; table display limit 200 is presentation, not truncation.

## 3. Design rules applied

1. **Reuse first.** Every addition is either a default resolved inside `ui/authoring.ts`, a relaxation inside `ui/views/spatial-data.ts`, a pure function producing existing `SpatialData`, or a fix inside `chart.ts`. No renderer, host, component, view discriminant or state owner is added.
2. **Omission gives a useful default; customization stays beside the binding.** A per-field `set` still overrides `change`; an author `description` overrides the generated one; compartment item `status` overrides the compartment status.
3. **The symmetry argument.** Keyed live fields already *read* by default from `state.parameters[field]`. Proposal A gives them a default *write* path through one explicit model action. Read default and write default become one logic.
4. **No invisible scientific reinterpretation.** Nothing normalizes, rescales, sorts, filters, rounds or recolors domain values. Compartments display the order and counts they receive.
5. **Physical coordinates stay distinct from diagram layout.** `arrangeCompartments` produces diagram units only and is never used for Grid, continuous space or topology views.

## 4. Proposal A — one explicit live write default

### Contract

```ts
/** One single-field change, exactly one own key per invocation. */
export type LiveChanges<P extends object> = Partial<P>;

interface UISpec<P, M> {
  // existing properties unchanged
  /** Default write for keyed live fields without their own `set`. Must invoke a public model action. */
  readonly change?: (model: M, changes: LiveChanges<P>) => void;
}
```

`KeyedField.set` becomes optional **only when** `change` is present. The public type is a union of two spec shapes (`{ change: …; live?: KeyedLive<P, M, "optional-set"> } | { change?: undefined; live?: KeyedLive<P, M, "required-set"> | LegacyLive }`), so a field without a setter in a spec without `change` remains a compile error. The exact formulation belongs to the type analysis; the observable rules are:

| Case | Behavior |
| --- | --- |
| Field has `set` | `set(instance, value)` is called; `change` is ignored for that field (customize at the binding). |
| Field omits `set`, spec has `change` | `change(instance, { [field]: decodedValue })` with exactly one own enumerable key. |
| Field omits `set`, no `change` | Type error; mount-time `TypeError("Missing setter for <field>")` (existing message). |
| Legacy live array | Unchanged; `change` is not consulted (legacy records require `set`). |
| Timing, decoding, errors | Identical to today: descriptor decoding first, playback stops, the action runs, observations refresh; failures use the existing host error path. Before setup, edits feed setup drafts and do not call `change`. |
| Getter | Unchanged: explicit `value` wins, else `state.parameters[field]` under the existing type rule. |

`changes` follows the terminology rule "mutable partial input objects are `changes`". The model method remains the single validator (it already rejects unknown keys, e.g. wolf-sheep `setRules`). No reflection, guessed method or direct state write is introduced. `change` is not an alias of `set`: it is the single spec-level default write, analogous to the existing getter default.

### Before / after

`wolf-sheep-predation/ui.ts` (22 → 12 lines in `live`):

```ts
// before
live: {
  sheepGain: { label: "Sheep food gain", set: (instance, value) => instance.setRules({ sheepGain: value }) },
  wolfGain: { label: "Wolf food gain", set: (instance, value) => instance.setRules({ wolfGain: value }) },
  …
  grassRegrowth: {
    set: (instance, value) => instance.setRules({ grassRegrowth: value }),
    enabled: (state) => state.parameters.mode === "sheep-wolves-grass",
  },
},
// after
change: (instance, changes) => instance.setRules(changes),
live: {
  sheepGain: { label: "Sheep food gain" },
  wolfGain: { label: "Wolf food gain" },
  sheepReproduce: { label: "Sheep reproduction (%)" },
  wolfReproduce: { label: "Wolf reproduction (%)" },
  grassRegrowth: { enabled: (state) => state.parameters.mode === "sheep-wolves-grass" },
},
```

`taxi-cabs/ui.ts`: 36 forwards collapse to `change: (instance, changes) => instance.setParameters(changes)` plus one line per field (`"prob-cbd-cbd-AM": { label: "cbd · cbd · AM", group: "AM" }`, `waitTimeMean: {}`). Roughly 200 → 45 lines; groups and labels stay beside their fields.

`virus/ui.ts`: `change` for three fields, `agentShape` keeps its explicit transforming `set` beside the binding.

Unchanged by design: entries with zero, one or two setters (65 files) and every entry whose setters call named domain actions (`setClerks`, `setChargers`, `setRain`, …). One explicit `set` reads better than a spec-level default plus `{}`.

## 5. Proposal B — compartments without a scene DSL

### B1. `extent` for every shape

Today `extent` is rejected unless `shape === "rectangle"`. The geometry already handles every shape through width/height. Proposal: `extent` is allowed on `circle`, `triangle`, `rectangle` and `diamond`, still exclusive with `size`, still positive finite diagram units. A scene containing any `extent` symbol uses actual-bounds picking (as for rectangles/diamonds); pure CSS-size circle/triangle scenes keep nearest-agent picking. No existing script changes. This lets diagram symbols scale with the canvas instead of fixed CSS pixels, which `arrangeCompartments` needs.

### B2. `arrangeCompartments`

A pure, side-effect-free projection exported from both UI entrypoints. It returns ordinary `SpatialData`, so the existing canvas, validation, picking, selection, inspector, labels, description, resize and disposal guards are reused unchanged.

```ts
export type ScientificStatus = keyof typeof scientificPalette; // neutral | waiting | active | completed | unavailable

export interface CompartmentItem {
  /** Projected semantic ID, unique in the scene; used for selection and inspection. */
  readonly id: string;
  readonly label?: string;
  /** Defaults to the compartment status. */
  readonly status?: ScientificStatus;
  /** Defaults to "rectangle". A distinct shape must carry a distinct documented meaning. */
  readonly shape?: "circle" | "triangle" | "rectangle" | "diamond";
}

interface CompartmentBase {
  /** Stable presentation ID; generated outline/slot IDs are namespaced beneath it. */
  readonly id: string;
  /** Required visible heading and accessible name. */
  readonly label: string;
  /** Default "neutral". Colors come only from scientificPalette. */
  readonly status?: ScientificStatus;
  /** Nonnegative safe integer: number of slot outlines. Omitted means unbounded (no outlines). */
  readonly slots?: number;
}
/** Identified, ordered occupants. Order is drawn exactly as supplied. */
export interface ItemCompartment extends CompartmentBase { readonly items: readonly CompartmentItem[]; readonly count?: never }
/** Anonymous units without identity, e.g. conserved bikes or synthetic allocation units. */
export interface CountCompartment extends CompartmentBase { readonly count: number; readonly items?: never }
/** Slots only, nothing occupied or occupancy not represented. */
export interface EmptyCompartment extends CompartmentBase { readonly items?: never; readonly count?: never }
export type Compartment = ItemCompartment | CountCompartment | EmptyCompartment;

export function arrangeCompartments(
  compartments: readonly Compartment[],
  options?: { readonly description?: string },
): SpatialData;
```

**Semantics.**

- **Layout owner.** Compartments are placed left to right in declared order, equal column width, top-aligned. Occupants fill row-major in supplied order. All spacing, symbol extents, column counts and heading offsets are named constants in one module (`ui/views/compartments.ts`), expressed in diagram units. Scene `width`/`height` are derived. Authors write no coordinates. Fixed tokens keep identical inputs on identical positions.
- **Count versus capacity versus identity.** `items` are identified, selectable occupants; `count` is anonymous units (not selectable, no invented IDs beyond namespaced presentation IDs); `slots` is a separate capacity number. The discriminated union prevents mixing items and count. Nothing infers capacity from items or identity from a count.
- **Slots and occupancy.** With `slots`, the first `min(n, slots)` occupants sit inside outlined slots (`filled: false`, `stroke: neutral`), remaining slots stay empty outlines. Occupants are not assigned to a named desk/charger: slot index is only visual position, and the generated description says "in N slots", never "at desk k".
- **Retained overcapacity is visible.** Occupants beyond `slots` are drawn in a separate overflow row below the slots, outlined with `scientificPalette.unavailable`. The heading shows `label · occupied/slots` and the description adds `k above slots`. Nothing is hidden or clamped.
- **Headings.** Without slots: `label · n`. With slots: `label · n/slots`. Zero is shown (`Waiting · 0`).
- **Description default.** Unless `options.description` is supplied: `"<label> <n>[ of <slots> slots][, <k> above slots]"`, joined with `"; "` in compartment order and ended with a period. Authors add domain caveats ("Team placement marks assignment, not travel") through `description`.
- **Large collections.** All occupants are drawn; nothing is truncated. The derived height grows with the longest column. An author who needs a compact view uses `count` for anonymous facts (e.g. completed totals) and keeps the full ledger in a `table` view. No hidden limit.
- **Errors (`TypeError`/`RangeError`, thrown before publication so the previous valid projection is retained by the existing host path):** empty/whitespace `id` or `label`; duplicate compartment ID; duplicate item ID across the scene; `slots`/`count` negative, non-integer, non-finite or above `Number.MAX_SAFE_INTEGER`; unknown `status` or `shape`; both `items` and `count` at runtime; zero compartments (an empty diagram must be deliberate: return `[]` → `RangeError("At least one compartment is required.")`).
- **Ownership.** The function reads only its argument. It owns no queue, capacity, clock, RNG or identity. Item order must come from a model-owned ordered snapshot; the function never sorts or filters.
- **Composition.** The result is plain data. An author may append independent annotations (`labels`), but must not place agents relative to compartment internals; coordinates of a compartment layout are not a public contract (assert counts, IDs, statuses and description — not positions).

### Before / after

`des-goods-buffer/scene.ts` (37 lines, 16 layout literals) becomes:

```ts
export function bufferScene(state: Observation<typeof model>): SpatialData {
  return arrangeCompartments([
    { id: "blocked", label: "Blocked puts", status: "waiting",
      items: state.blockedCrates.map(crate => ({ id: `crate:${crate.crate}` })) },
    { id: "buffer", label: "Buffer", status: "active", slots: state.parameters.capacity,
      items: state.crates.map(crate => ({ id: `crate:${crate.crate}` })) },
    { id: "collected", label: "Collected", status: "completed",
      items: state.deliveries.map(crate => ({ id: `crate:${crate.crate}` })) },
  ]);
}
```

`des-ev-charging/scene.ts` (55 lines, 19 literals):

```ts
export function chargingScene(state: Observation<typeof model>): SpatialData {
  const vehicle = (number: number) => {
    const record = state.vehicles[number - 1]!;
    return { id: `vehicle:${number}`, shape: record.priority < 0 ? "diamond" as const : "rectangle" as const };
  };
  const numbers = (status: string) => state.vehicles.filter(item => item.status === status).map(item => item.number);
  return arrangeCompartments([
    { id: "queue", label: "Queue", status: "waiting", items: state.waitingVehicles.map(vehicle) },
    { id: "chargers", label: "Chargers", status: "active", slots: state.parameters.chargers, items: numbers("granted").map(vehicle) },
    { id: "completed", label: "Completed", status: "completed", items: numbers("released").map(vehicle) },
    { id: "cancelled", label: "Cancelled", status: "unavailable", items: numbers("cancelled").map(vehicle) },
  ], { description: `Queue in resource priority order; diamonds are priority vehicles. ${state.completed} completed, ${state.abandoned} cancelled.` });
}
```

The queue uses the model-owned `waitingVehicles` (Resource priority order), never admission order. The holder order inside "Chargers" is presentation only; there is no charger identity.

`des-civic-office` requires an **additive model observation** before migration: `waitingResidents: desks.waiting.map(request => request.owner)` (same pattern as EV). Filtering `residents` by status is admission order and is not acceptable as queue order. With it:

```ts
arrangeCompartments([
  { id: "waiting", label: "Waiting", status: "waiting", items: state.waitingResidents.map(number => ({ id: `resident:${number}` })) },
  { id: "clerks", label: "Clerks", status: "active", slots: state.parameters.clerks, items: served(state, "granted") },
  { id: "completed", label: "Completed", status: "completed", items: served(state, "released") },
])
```

Reducing `clerks` below current holders now shows the retained holders in the overflow row and `1 above slots` in description — the existing "Retained service" semantics without hand-placed coordinates.

### Scenes that keep low-level `SpatialData`

| Scene | Reason |
| --- | --- |
| `des-elevator` | Floor/shaft elevation is real semantic structure; ordered `floorQueues` and Resource-owned cabins are placed per floor. Stays in the same spatial pipeline; may adopt B1 `extent` for scaling and named constants for its tokens. |
| `des-bus-interchange`, `des-parcel-logistics` | Vehicle progress along declared route minutes is a diagram of route topology; compartments would lose it. |
| `des-water-allocation`, `des-waste-collection` | Districts/collection fields are Grid fields with positions; units are synthetic allocation/load units (not m³). A compartment row would drop the grid arrangement. |
| `des-emergency-dispatch` | Calls are anchored to access-path nodes. |
| `des-bike-redistribution`, `des-machine-maintenance` | Optional later candidates: stations/machines are ordinal, but the truck's last stop and per-machine identity are better kept as is unless browser review prefers a compartment view. Not part of the required migration. |

These scripts should only receive coding-standard cleanups (named layout constants with a comment that they are diagram units), never a compartment rewrite. Anchored compartments (`at`) are **not** proposed until a second concrete consumer exists.

## 6. Rejected abstractions and the reuse-first alternative

| Candidate | Why rejected | What authors do instead |
| --- | --- | --- |
| New view type (`"flow"`, `"queue"`, `"capacity"`) | Duplicates canvas, picking, selection and description; a widget per domain | `arrangeCompartments` returns existing `SpatialData` |
| Declarative `compartments` field rendered by the host | Layout becomes untestable headlessly and mixes with author coordinates of unknown scale | Pure function; assert IDs/counts/description headlessly |
| Series accessors (`rows`, `x: "tick"`, `y: "sheep"`) or a `historySeries` helper | A one-line `.map` is ordinary TypeScript; key strings are weakly typed and create a second points form; serves 3 History consumers | Keep `.map`; History consumers may name a local function |
| Generic encoding/scale/normalization layer | Heat-diffusion, directed-network, wealth grain and fire formulas are source-specific; a generic scale would reinterpret them (frame min/max, clamping) | Keep explicit formulas; name constants with provenance (`minimumNodeDiameter = 4`, `flowWidthRange = 4`) |
| Shared legend or category registry | Chart already owns its legend; spatial/grid meaning is carried by labels/description; a registry would be a second encoding owner | Local typed record `const classColors = {…} as const satisfies Record<WealthClass, string>` reused across views (wealth pattern) |
| Replacing hex literals with `scientificPalette` or ordinal palettes | Changes source portrayal; DES statuses and NetLogo colors have different meanings | Keep literals or `netLogoColor`; deduplicate only identical meanings within one script |
| Default inspector from the selected presentation record | Exposes presentation fields (color, x/y) instead of domain records | Keep explicit `find` against the observation |
| Default Tick monitor | Time label/unit differs (tick, minutes, day, hour, seconds; Agenda time vs World tick in elevator) | Keep explicit monitor |
| String-array `live` like `setup` | Third live form beside keyed and legacy arrays | Proposal A keeps the keyed object |
| Grid/Graph layouts (`topology.square`, Cytoscape) for DES slots | `topology.square` returns detached polygons for a spatial topology; reusing it for slot packing would conflate physical layout with diagram layout | Compartment tokens; `geometry.map` stays available for genuine physical→diagram mapping |
| Aliases, configuration layer, global defaults object | Forbidden by task and DESIGN (KISS/YAGNI) | — |

## 7. Proposal R — stable default series colors

`chart.ts` assigns `palette[index % length]` per frame. For series that appear conditionally or are filtered (wolf-sheep `Grass / 4`, key-mapped series), later series change color between frames. Correction: each mounted chart view keeps a label → palette index map, assigned in first-seen order and kept until the view is disposed (setup recreates views and resets it). For a fixed series list the colors are identical to today, so accepted screenshots of static charts do not change. Explicit `color` always wins. Duplicate labels within one frame keep their current index fallback. This is a default-rendering change and needs a recorded design decision plus focused tests; it introduces no API.

## 8. Reuse map

| Need | Existing owner reused | Change |
| --- | --- | --- |
| Live default write | `normalizeAuthoring` in `ui/authoring.ts` (already resolves getter default, decoding, setters) | Resolve missing `set` to `change` with one-key changes |
| Live typing | `KeyedField`/`UISpec` in `ui/definition.ts` | Optional `set` under `change` |
| Diagram symbol scaling | `symbolDimensions`, `symbolPath`, `hitSceneSymbol` | Remove rectangle-only validation in `spatial-data.ts` |
| Compartment rendering, picking, labels, description, resize | `canvas.ts`, `spatial-geometry.ts`, `spatial-symbols.ts`, Svelte `View.svelte` | None |
| Status colors | `scientificPalette` | Export `ScientificStatus` type |
| Queue order, capacity, holders | Model observations from `Resource`, `Store`, `ServiceQueue` | Office adds `waitingResidents` |
| Chart colors | `chart.ts` palette loop | Sticky label map |

## 9. Scripts that stay unchanged

- **Already short and direct:** `workplace-household-membership` (9 lines), `zoning-scenario-comparison` (13), `residential-occupancy`, `stormwater-retention`, `urban-tree-watering`, `solar-battery-microgrid`, `pedestrian-crossing-phases`, `household-energy-demand`, `neighborhood-heat-intervention`, `household-recycling-behavior`: each binds named domain actions and direct views. Proposals A/B give no gain.
- **Zero to two uniform setters (65 entries):** e.g. `life`, `fire`, `segregation`, `voting`, `percolation`, `diffusion-on-a-directed-network`. One explicit `set` is clearer than `change` plus `{}`.
- **Source-semantic portrayals:** `heat-diffusion`, `diffusion-on-a-directed-network`, `wealth-distribution`, `fire`, all `netLogoColor` users. Their formulas stay; only optional named constants per coding standards.
- **Physical/topological spatial views:** all NetLogo ports with model coordinates, `traffic-2-lanes` follow-wrap camera rule, network views with initial topology positions.
- **Low-level DES scenes** listed in section 5.

## 10. Example-first phases

Each phase freezes five public scripts under `examples/` before runtime work, with `SHA256SUMS`, a `tsconfig.json` for compile-only negatives and exported `browserChecks(container, bind)` for both host adapters, following `examples/ui-authoring`. Assertions use real models and existing helpers (`assert`, `equal`, `button`, `control`, `changeNumber`, `settle`, `monitor`). They initially fail because `change`/`arrangeCompartments` do not exist; that is recorded, not mocked.

### Phase A — `examples/ui-live-changes/`

1. `01-shared-change.ts` — Wolf-sheep with `change: (i, c) => i.setRules(c)` and five live fields without `set`.
   Headless: `spec.change(actual, { sheepGain: 7 })` → `actual.read().parameters.sheepGain === 7`; tick unchanged; RNG state of a parallel instance unchanged.
   Browser: after Setup, `changeNumber(container, "Sheep food gain", 7)` refreshes the control to `7`; the setter receives exactly `{ sheepGain: 7 }` (spy wrapping the real action).
2. `02-binding-override.ts` — Virus: `change` plus `agentShape` with its own transforming `set`. Asserts the override is used for `agentShape` and `change` is never called for it; other fields go through `change`.
3. `03-groups-labels-enabled.ts` — Taxi-cabs AM/MD/PM/EVE groups with labels only. Asserts group order/legends, `enabled` predicate disabling a field, implicit getter from `parameters`.
4. `04-pre-setup-and-errors.ts` — Live edit before Setup feeds setup without calling `change`; a `change` that throws (model rejects value) reports through the host error path, stops playback and leaves the previous observation; mount without `set`/`change` throws `Missing setter for <field>`.
5. `05-compatibility.ts` — Existing keyed `set` specs, legacy arrays and a spec mixing `change` with legacy arrays (compile error) behave as before. Compile-only negatives: field without `set` and no `change`; `change` with a wrong value type (`{ sheepGain: "x" }`); unknown field key.

### Phase B — `examples/ui-compartments/`

1. `01-bounded-store.ts` — Goods buffer: produce ×3 with capacity 2. Asserts `arrangeCompartments` result has 2 slot outlines, crate IDs `crate:1`, `crate:2` inside buffer, `crate:3` in Blocked puts, headings `Buffer · 2/2`, `Blocked puts · 1`, generated description `"Blocked puts 1; Buffer 2 of 2 slots; Collected 0."`; observation unchanged (`structuredClone` deep equality).
2. `02-priority-queue-order.ts` — EV charging with a priority vehicle added: queue item order equals `state.waitingVehicles`, not admission order; priority item has `shape: "diamond"`; cancelled vehicle appears only in Cancelled.
3. `03-retained-overcapacity.ts` — Office with additive `waitingResidents`: two holders, then `setClerks(1)` → one overflow item outlined `unavailable`, heading `Clerks · 2/1`, description contains `1 above slots`; no item claims a numbered desk.
4. `04-count-without-identity.ts` — A count compartment (bike stock or water allocation units) with `slots`: anonymous units are not selectable, no item IDs are invented, empty slots remain outlines; description says units, not m³ or people. Also asserts `extent` on circle/triangle/diamond is accepted and `size` + `extent` is rejected.
5. `05-errors-and-compatibility.ts` — Duplicate item ID, negative/fractional/nonfinite `slots`/`count`, `items` + `count`, empty list → typed errors; existing elevator and DES 2D scene projections validate unchanged; browser: selecting an item opens the inspector, invalid update retains the previous scene, dispose cleans up. Compile-only negatives: `items` with `count`, unknown status string, arbitrary `color` on an item.

Phase R (renderer correction) needs focused `chart.ts` tests: fixed list identical colors, a series disappearing keeps others' colors, setup resets the map.

## 11. Migration manifest and verification scope

| Group | Entries | Edit | Required checks |
| --- | --- | --- | --- |
| A, ≥6 uniform setters | 29: baldwin-effect, wealth-distribution, bacterial-infection, language-change, heatbugs, hex-cell-aggregation, ethnocentrism, epidem-travel-and-control, urban-suite-economic-disparity, repressilator-1d, heat-diffusion, taxi-cabs, interstitial-diffusion, invasive-plants, particle-swarm-optimization, anisogamy, traffic-intersection, daisyworld, fruit-wars, smoothlife, mammoths, genevo-1-genetic-switch, artificial-neural-net-multilayer, piaget-vygotsky-game, urban-suite-tijuana-bordertowns, vision-evolution, sunflower-emergent, ca-stochastic, artificial-neural-net-perceptron (+ turing-machine-2d, 13 `setConfiguration` forwards my regex undercounted) | `live` section only | typecheck; mount + Setup + one live edit per entry in both hosts |
| A, 3–5 uniform setters | 52: membrane-formation, simple-genetic-algorithm, robby-the-robot, sex-ratio-equilibrium, urban-suite-recycling, disease-solo, virus, simulated-annealing, crystallization-basic, chloroplasts-and-food, traffic-grid, prisoners-dilemma-basic, crispr-bacterium, wolf-sheep-predation, simple-birth-rates, rabbits-grass-weeds, sandpile, flocking, virus-on-a-network, ca-1d-elementary, epidem-basic, urban-suite-pollution, fireflies, muscle-development, prisoners-dilemma-two-person-iterated, hiv, dining-philosophers, paths, pagerank, ca-continuous, consumer-choice, robotic-factory, urban-suite-sprawl-effect, traffic-grid-goal, urban-suite-cells, dla, sand, mimicry, braess-paradox, peppered-moths, blood-sugar-regulation, central-limit-theorem, dna-protein-synthesis, galton-box, rebellion, autumn, urban-suite-path-dependence, crispr-ecosystem, random-combinations-and-permutations, partition-permutation-distribution, traffic-2-lanes, slime | Migrate only where every setter is uniform and the result is shorter **and** clearer; virus keeps one explicit `set` | Same |
| A, ≤2 setters | 65 | None | None |
| B | des-goods-buffer, des-ev-charging, des-civic-office (+ model observation) | Replace `scene.ts` body | Headless parity for office model: fixed seeds, identical observations at selected ticks except the added field, identical RNG continuation; asserted scene counts; desktop/narrow light/dark screenshots with independent inspection |
| B1 only (optional) | des-elevator and other low-level DES scenes | Named constants / `extent` where it removes CSS-pixel guesses | Browser + screenshots |
| R | All charts | Renderer only | Focused tests; spot screenshots of charts with conditional series (wolf-sheep, traffic-2-lanes) |

Rules: one commit per group; no formatting churn; no change to model files except the office additive observation; `bun run typecheck`, the five-script phases, existing `examples/ui-*` and `ui-des-scenes` regressions and `bun run check` before acceptance. A changed `ui.ts` never touches RNG, so headless parity is only required where `model.ts` changes; browser checks are required for every changed entry. Independent screenshot review and the AGENTS-required Gemini design review stay separate gates.

## 12. Risks and open questions

- **Type complexity of A.** The conditional optional `set` must keep error messages readable; if TypeScript diagnostics become obscure, prefer the runtime mount error plus a simpler type over clever typing.
- **`change` with heterogeneous models.** If a model needs two write methods (none today), authors keep per-field `set`; `change` must not grow a dispatch table.
- **Compartment visual density.** Fixed diagram tokens on 390 px screens with long queues need browser evidence; the fix is a token value, not per-model numbers.
- **Office observation.** `waitingResidents` is a model API addition and needs its own assertion that order equals `Resource.waiting` order.
- **Visual change of migrated DES scenes.** Connectors between columns disappear; left-to-right order plus headings carries the sequence. The previous 2D-scene approval does not cover the new rendering.
- **Chart color decision.** Sticky colors change rendering only for conditional series; record the decision before implementation.

Findings and proposals above are not acceptance. No checks were executed beyond static source scans; no browser, typecheck or example runs were performed for this report.
