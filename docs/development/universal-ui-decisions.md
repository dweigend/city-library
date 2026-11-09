# Universal UI authoring decisions

Status: accepted implementation direction for the user-authorized task, not runtime acceptance. Baseline `a78bd2359e7a12ac537be131ca8d3023c4b718eb`. The independent Opus proposal and Astra analysis both incorporated the same source dossier and all-146 inventory; neither read the other's draft. Existing APIs and frozen examples remain binding.

## Synthesis

Keep `defineUI`, both hosts, ordinary observation maps and all existing renderers. The measured repeated single-field live forwards justify one explicit spec-level write default. Repeated abstract DES collection placement justifies one pure adapter returning existing `SpatialData`. Astra's distinction between identity, anonymous count and capacity is stronger than overlaying people onto numbered slots; use separate discriminated rows. Complete existing table inspection through shared paging. These are complementary additions, not a new authoring language.

### Phase A: explicit live write default and chart stability

Add `change(instance, changes)` to the existing spec. `LiveChanges<P>` is `Partial<P>`. A keyed field may omit `set` only when the spec supplies `change`; without it the existing required-set typing remains. Each edit is descriptor-decoded first and invokes exactly one own-key change. A local `set` wins. Reading still defaults to compatible `state.parameters[field]`. Pre-Setup edits change drafts without invoking actions. Legacy arrays retain required setters and cannot use `change`. No reflection, batching, guessed method, direct mutation or rollback promise.

Migrate only files with at least three uniform forwards to the same public method and a demonstrable readability benefit; preserve labels, groups, enabled predicates, getters, overrides and all scientific projections. One/two explicit setters and named domain actions normally remain clearer. All 146 pairs receive final source-backed retain/change decisions.

Correct chart default colors to remain keyed by a unique series label during a mounted view's lifetime. Explicit colors always win; fixed lists retain their first-frame colors. Duplicate labels preserve positional fallback. Reset on disposal/Setup. This is stable presentation state, never a scientific category registry. Public scripts must freeze filtering/reordering and explicit-color behavior before runtime.

### Phase B: pure collection diagrams and complete inspection

Export `collectionDiagram(rows)` and its `CollectionRow`/`CollectionItem` types from both existing UI entries. Rows are flat and discriminated:

- `{id,label,kind:'items',items,order?:'unordered'|'supplied',color?}`: identified items `{id,label?,color?,shape?}`; order defaults unordered and preserves input placement without claiming queue rank. Supplied order means exactly the model-owned order. No sorting or state inference.
- `{id,label,kind:'count',count,color?}`: nonnegative safe integer, exact visible count, no fabricated selectable individuals.
- `{id,label,kind:'capacity',used,capacity,unit,color?}`: finite nonnegative quantities in the same required nonempty unit. Exact used/capacity and retained excess stay visible; no relation to an item row's length is inferred. No person-to-slot assignment. Small integer capacities may use anonymous unit outlines; other capacities use a symbolic frame with exact values. No hidden truncation of data.

Rows retain declaration order. Omitted colors use the existing scientific neutral; item overrides row color. Item shapes use the existing vocabulary, default rectangle. Existing CSS size and rectangle-only extent contracts remain unchanged. Spacing, wrapping, symbol sizes and annotation placement have one owner in the projection, with useful defaults and no per-model layout options. Empty rows remain named and zero is visible; empty input returns a valid empty scene with description `No collections`. Identified items all remain present and inspectable. Long labels wrap using shared defaults. All coordinates are abstract diagram units.

Validate types/discriminants/unknown enums and combinations before output. Invalid types throw TypeError; invalid ranges, duplicate row/item IDs or overflow throw RangeError. Output is detached and pure. Reject decoration-ID collisions rather than assuming an impossible prefix. Add `SpatialAgent.selectable?: boolean`, default true; false excludes pointer, nearest, keyboard and chooser selection. Count/capacity decorations are nonselectable. Existing pure circle/triangle nearest behavior and mixed painted-bounds picking remain compatible.

Replace only office/EV/goods abstract scene helpers initially. Office adds a detached `waitingResidents` snapshot directly from Resource.waiting; old observation fields remain identical. EV uses its actual ordered waitingVehicles; goods uses Store snapshots. Elevator, routes, grids and physical/topological projections retain their semantically necessary geometry. New descriptions explain separate identity/capacity rows and retained occupancy.

Both existing table hosts expose every row through 200-row pages, with accessible previous/next controls and visible range/total. Preserve first-record column order and blank missing values. Setup resets the page; shrinking data clamps it. Empty state is explicit. Paging is host-owned and never mutates model data. No selectable-table row identity is invented.

## Rejected or deferred

Do not widen extent to other shapes: existing frozen invalid-input examples intentionally reject that combination. Do not introduce a view kind, scene DSL, coordinate framework, widget per domain, category/legend registry, generic scale layer, string field paths, history wrapper, default Tick monitor or automatic inspector. The existing short maps and domain lookups are readable. Preserve source scientific palettes, NetLogo conversion and explicit normalization; no blanket replacement of 448 color literals. Keep conditional scientific formulas and unit meanings exact.

The old table cap is an inspection gap, not justification for clipping a new collection. Any pre-existing domain-measurement logic found in UI needs an explicit bounded ownership fix or documented deferral, never silent formula changes during setter migration.

## Sequence and evidence

Freeze five complete asserted public authoring scripts for Phase A and five for Phase B before their respective runtime. Initially missing features remain honestly red. Separate scoped owners implement core typing/normalization, projection/picking/table/chart and script migrations. Independent tests/refactors/rechecks preserve original syntax and assertions. Two all-146 baseline captures at steps 0/1/3 are byte-identical, including 98 exposed RNG states; compare after migrations and ignore only explicitly approved added observation fields.

Run all changed entries through real catalog Setup/step/live actions, all-146 catalog smoke for shared runtime, both-host public fixtures, all eleven DES flows, numeric/empty/missing/signed/category/selection/resize/disposal tests, and affected desktop/narrow light/dark images with independent actual inspection. New Gemini substantial source/design approval is separate from expert proposals and browser/image evidence. Finish with relevant typechecks, public scripts, build/consumer and one stable full check, focused remediation checks, final manifest and clean local commits. No push, PR or main merge.
