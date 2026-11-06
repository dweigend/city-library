# UI authoring syntax slice

Status: proposed delivery contract and asserted author examples, before runtime. The coordinator must commit the frozen examples before implementation handoff. No runtime or browser acceptance is claimed here. Existing `defineUI(model, spec)` and all earlier frozen examples remain compatible.

## Bounded scope

Deliver two dependent closures in this phase: (A) readable typed controls and flat grouping, then (B) monitor formatting and categorical bar presentation. Both use the five public scripts frozen together. No layout tree, model wrapper, introspection API or renderer escape hatch is introduced. Existing host adapters normalize the same contract; neither renderer owns scientific state.

### Setup and live controls

- `setup` accepts an ordered readonly array of parameter-key strings and existing `{ field, label?, widget? }` override records. A string is the canonical ordinary form; use a record only for a concrete override. Explicit `[]` renders no setup controls. Invalid fields remain type errors and runtime mount errors.
- Canonical `live` is a partial field-keyed object. Each key is a parameter key, with required `set(model, value: P[K])`, optional `label`, `widget`, `enabled` and `group`. Keys render in ordinary object own-key enumeration order. Existing live arrays preserve their scalar-union setters and required `value` callbacks unchanged.
- For keyed live entries, `value(state)` is optional only when every observation has a required, compatible `parameters[K]` whose type is assignable to `P[K]`. Otherwise a field-typed `value` callback is required. Optional/missing/incompatible parameters cannot silently display undefined. An explicit value callback always takes precedence. Reading a live value never guesses a setter or writes the observation.
- With keyed live (including an empty object), omitted setup lists descriptor keys in declaration order excluding live keys. With legacy live arrays or omitted live, omitted setup retains the current all-input behavior, including the historical duplicate-control rule and live-reader precedence. Explicit setup always determines its own selection/order; overlapping explicit setup/live controls retain live-reader precedence. Descriptor defaults and validation remain authoritative.
- `group?: string` sits directly on a live entry (keyed or legacy). A nonempty group label renders an accessible fieldset/legend. Groups appear at their first occurrence and collect members in declaration order; ungrouped controls retain first-occurrence order relative to groups. Equal labels mean the same group within one mounted entry. No nesting, collapse configuration or host DOM query. Grouping has no scientific effects. Empty/whitespace-only labels reject at mount.
- Number, boolean and choice setters receive the declared field type without author coercions. Factories/actions still validate runtime values. Before setup, editing live controls contributes to setup only; after setup it calls only the explicit setter. Controls read canonical state after actions, and existing pause/completion/disposal behavior stays intact.

### Monitors and charts

- Monitor `value(state)` remains a required pure `string | number` callback. Optional `format(value: string | number): string` changes displayed text only; format errors follow the existing host error path. Default remains `String(value)`. Formatters narrow when needed; this slice does not infer a distinct formatter type from each array element's return type.
- Existing numeric `Series` remains unchanged. Export `BarSeries` with the same label/color shape and points `{ x: string | number; y: number }`; only bar views accept categorical x values. Line/scatter remain numeric. A bar view accepts homogeneous numeric or homogeneous string x values across its series; mixed modes reject at render. Categorical positions use first-seen category order across series, equal labels share a position, zero values remain visible in labels. No implicit aggregation or missing-category imputation.
- Chart views accept optional `xAxis?: { label?: string; unit?: string }` and `yAxis?: { label?: string; unit?: string }`. Omission preserves existing behavior. If label and unit exist, display `label (unit)`; if only unit exists, display the unit. Labels/units and category names are present in accessible chart text. Units are text, never conversion or scientific calculations. No arbitrary tick-format callback or chart-library options.

## Examples and acceptance

`examples/ui-authoring/01-defaults-and-inert-entry.ts` through `05-independent-actions-and-legacy.ts` use real Voting and Wealth Distribution factories. An alternate-observation adapter delegates to the real Voting factory and merely renames the observation's parameters property; it contains no simulation substitute. Bun executes real model actions, callbacks and assertions. Exported browser checks mount the same public entries into a caller-supplied real DOM container. Their execution is separate required browser evidence, not inferred from Bun checks.

Compile `examples/ui-authoring/tsconfig.json`, including negative compile-only cases. Execute all five scripts with assertions enabled and verify SHA256SUMS. Browser acceptance must additionally verify actual setup order/default exclusion and legacy overlap, keyed implicit/explicit getters, numeric/boolean input changes, accessible flat grouping, formatted monitors/category and axis text, independent mounted entries and stale/disposal behavior in both supported host adapters. Preserve supported light/dark and desktop/narrow screenshot gates. No mock DOM or public test-only introspection API is permitted.

Initial pre-runtime results and SHA hashes are recorded in the examples README. Passing headless callbacks does not establish control normalization or browser acceptance. Changes to these frozen expectations require an explicit recorded reason; implementation convenience is insufficient.
