# UI API reference

Use `defineUI` to describe what a model shows and which model actions its controls call. The model remains responsible for state, validation and time. This reference covers each part of that declaration.

## Status

This reference and the [API table](api-table.md) define the repository UI contract supported by the Svelte adapter. Array control declarations remain supported syntax. [PLAN](../../PLAN.md) identifies remaining acceptance work. The package has not been published.

## Principles

The five [binding UI authoring rules](../DESIGN.md#binding-ui-authoring-rules) govern defaults, flat structure, one normal spelling, local customization and function placement.

1. Ordinary `ui.ts` files read as flat TypeScript data descriptions. Use one familiar spelling, short callbacks and named projections when a callback obscures the description.
2. The model owns scientific state, validation, defaults and actions. The UI reads observations and invokes public actions; it never duplicates scientific rules or mutates observations.
3. Model input descriptors supply defaults, numeric limits, granularity and choices. The shared host supplies typography, theme, spacing, layout, accessible controls and renderer styling.
4. Customization belongs next to the affected binding and is optional. Do not require renderer selection, DOM work, lifecycle plumbing or style configuration for a normal model.
5. Follow [Agent Loom terminology](../agent-loom/terminology.md). Domain `Field` and detached UI `Cell`/`cells` have different responsibilities. A step invokes a model procedure; tick is model time; host cadence is neither.

## Define UI

`defineUI<P, M>(definition, spec): BoundEntry` is exported by `ui/index.ts`. It binds a plain headless `Definition<P, M>` to a `UISpec<P, M>` or `ChangeUISpec<P, M>` while preserving the concrete instance and observation types inside callbacks. It returns title, optional description and a mounted-session contract. Creating the definition must not initialize a model, create timers, perform I/O or touch the DOM at module import.

Readable authoring form:

```ts
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["seed"],
  monitors: [{ label: "Tick", value: state => state.tick }],
  views: [],
});
```

`views` is currently required, including when empty. Other top-level fields are optional. Labels on current actions, monitors and views are required. The model's title and description are reused rather than repeated in the UI.

## Model

`Definition<P, M>` supplies `title`, optional `description`, canonical `inputs` and `create(parameters)`. Inputs are descriptors for number, boolean, choice or text, each with `default`; numbers may specify `min`, `max`, `step`, `integer`, and choices specify `options`. This is the model definition contract, not the future live-property core `Input` API.

`M` implements `read(): unknown`, `advance(steps?: number): void` and optionally `dispose(): void`. Callback observations are inferred from `read()`. Import the public type `Observation<typeof model>` for a named projection, or `Observation<Instance>` when an instance type is already available. The public UI entry and its secondary import export the same alias; it creates no wrapper or new state. The factory and actions own runtime validation, including cross-field constraints. UI constraints complement that validation. Observers and rendering projections must be side-effect-free and must not advance model time or consume model randomness.

## Setup

`setup` is an ordered readonly array of parameter-key strings or `{ field, label?, widget? }` overrides. Use strings for ordinary fields and an override only where needed. Explicit `[]` hides setup controls. With keyed live bindings, omission lists descriptor fields in declaration order except live fields; with legacy arrays or no live declaration, omission lists all descriptor inputs. Hidden values retain descriptor defaults unless a live control supplies them.

The descriptor chooses checkbox, select, number or text and supplies bounds and choices. A range override changes numeric presentation, not the field's meaning. Numeric step defaults to 1 for integers and `any` otherwise. Labels split camel case and capitalize the initial letter.

Setup edits remain pending until Setup/Restart. Where a field explicitly appears in setup and live, each control has its own presentation draft. A setup edit changes neither the live display nor the active model. The live draft wins when the next model is created, regardless of edit order. No second scientific state owner is introduced.

## Live

The normal form is a field-keyed object:

```ts
live: {
  growthAmount: {
    set: (instance, value) => instance.setRules({ growthAmount: value }),
  },
}
```

Each key names a declared model input. A local setter receives that field's TypeScript value type and explicitly invokes a model action. For several fields forwarded to one action, declare a common write default:

```ts
change: (instance, changes) => instance.setRules(changes),
live: {
  growthAmount: {},
  reproduction: { label: "Reproduction (%)" },
}
```

`UISpec<P,M>` remains the existing extendable interface with explicit local setters. For an extracted, explicitly annotated shared-write declaration, use `ChangeUISpec<P,M>`; inline declarations infer this variant. Both use the same `defineUI` call.

`change` receives `LiveChanges<P>` (`Partial<P>`), containing exactly one own key per host edit after descriptor decoding. A field's explicit `set` overrides it. Without `change`, each keyed field still requires `set`. Legacy live arrays keep their explicit setters and cannot combine with `change`. No method is guessed and no model property is assigned directly. Optional `value`, `label`, `enabled`, `widget: "color"` and `group` customize the binding. An explicit getter takes precedence. Without one, every possible observation must have a required compatible `parameters[field]`; otherwise the type contract requires a getter. There is no guessed setter or direct assignment to model state.

At the DOM boundary, the host checks descriptor primitive types, finite numeric values and known choice options. Descriptors cannot prove arbitrary branded, literal-number or refined-text TypeScript types; model factories/actions still validate those semantics and cross-field constraints.

Before initialization, live edits supply values for setup. After initialization, a valid edit stops playback and invokes its local setter or explicit common change action; the host then reads canonical observations. Optional enabled predicates control availability. Legacy arrays retain required scalar-union `value`/`set` callbacks and existing reader precedence.

A nonempty `group` label creates a flat accessible fieldset/legend. A group appears at its first occurrence and collects its fields in declaration order. Equal labels share the group; whitespace-only labels fail at mount. This is a shared control feature, not permission for author scripts to inspect DOM or construct layouts.

## Actions

Current action records contain `label`, `run(instance, selected)`, optional `enabled(observation, selected)` and optional `pressed(observation)`. `selected` is a string identifier or `null`. Before setup actions are disabled; afterward `enabled` defaults to true. `pressed` supplies the accessible pressed state and is not an implicit mutation. A normal action stops playback, invokes the model action and refreshes observations.

Experimental `repeat: { label, intervalMs }` adds a host-owned repetition toggle. Interval must be positive and finite. Repetition has its own cadence and does not imply a World tick. It checks instance identity and availability, stops when disabled or on failure, and rejects stale scheduled callbacks. The model action alone determines scientific effects.

## Monitors

`monitors` contains `{ label, value, format? }` records. `value(observation)` returns a string or number. A formatter changes display text only; default rendering is `String(value)`. Keep measurements in the model. Format errors use the same host error path as other presentation callbacks.

For a numeric getter, annotate the formatter argument rather than adding a runtime type guard:

```ts
{ label: "Gini", value: state => state.gini,
  format: (value: number) => value.toFixed(3) }
```

A text getter supports `(value: string) => ...`. `defineUI` rejects incompatible getter/formatter pairs, including a numeric-only formatter for a genuinely number-or-text getter. Such a union still needs narrowing. The annotation is explicit: this API does not promise automatic scalar inference across heterogeneous callback arrays. Existing unannotated formatters retain their `string | number` context.

The public `Monitor<S, V>` type describes an extracted record with observation `S` and scalar `V`. For example, use `satisfies Monitor<Observation<typeof model>, number>` on a standalone numeric monitor. Existing `UISpec<P, M>` retains its broad compatibility formatter context; an extracted scalar-specific spec can keep its own annotations and be passed directly to `defineUI` without that broad annotation.

Changing display precision belongs in `format`; it must not round or overwrite scientific values. Preserve existing units, unavailable-value text and trailing-zero behavior when migrating a model.

## Views

Each view has a discriminant `type`, a required `label` and one data projection. Views consume detached presentation data. IDs connect selection and inspection; they are not additional domain owners. Array order determines authoring order. Shared host layout may adapt to available space. Theme and camera state belong to presentation.

### Network

`{ type: "network", label, nodes, edges }` projects arrays of `GraphNodeData` and `GraphEdgeData`. Nodes require string `id`; optional `label`, `color`, `size` customize presentation. Size is symbol diameter in CSS pixels, not a physical collision radius. Edges require `id`, `from`, `to` referencing node IDs.

Experimental nodes add optional initial `position: { x, y }`; later dragging and layout remain presentation-owned. Experimental edges add `directed`, `color` and positive finite CSS-pixel `width`. Do not infer graph weights or mutate graph state from renderer positions.

Node labels keep a constant screen size. Where a label would overlap another label or node, the host hides it, keeping the selected node and then larger nodes labelled. Zooming in reveals more labels; a selected node always shows its own label, and the node chooser lists every label. Graphs with more than 80 nodes show no labels.

### Grid

`{ type: "grid", label, data }` projects `GridData`: `width`, `height`, `cells`. Each UI cell contains `id`, `x`, `y`, `color`. A UI cell is a detached rendering record, not a domain `Field`. Dimensions and coordinates must describe the same grid.

### Spatial

`{ type: "spatial", label, data }` projects `SpatialData`: `width`, `height`, optional `cells` and required `agents`. Each spatial agent extends node presentation fields with `x`, `y`, optional `heading` in degrees and optional `shape: "circle" | "triangle" | "rectangle" | "diamond"`. The baseline renderer defaults heading to zero and shape to circle. Coordinates are centered world coordinates; positive y points upward. Display size remains CSS pixels.

Experimental additions: `showLabels` controls label visibility when supplied; omission retains the host Labels control. `segments` contains ordered `{ from: {x,y}, to: {x,y}, color?, width? }` strokes above cells and below agents, selection and labels. Endpoints must be finite centered coordinates. Width defaults to 1 CSS pixel; zero omits a stroke; negative/nonfinite widths are invalid input. Omitted color uses the host foreground. Segments do not participate in picking or model collision logic.

`SpatialAgent.selectable` defaults to true. Explicit false excludes a symbol from pointer/nearest and keyboard selection; annotations remain nonselectable. It does not create domain identity or change drawing actions on Grid cells.

Rectangles may supply positive finite `extent: { width, height }` in diagram units instead of CSS-pixel `size`; other shapes cannot use extent. `filled` defaults to true. Optional `stroke` and nonnegative finite `strokeWidth` add an outline; `filled: false` supports empty resource slots. Coordinates and headings must be finite, and derived geometry must remain finite before a new projection is published. Canvas buffer dimensions must fit positive unsigned 32-bit integers, preventing DOM conversion from wrapping an extreme aspect ratio to zero. This representability check is not a guarantee of browser-specific maximum allocation capacity. Invalid updates preserve the previous valid projection.

Optional `labels: readonly { x, y, text }[]` supplies nonselectable diagram annotations in the shared font and foreground. Optional nonempty `description` supplies the canvas accessible name and fallback text; authors should summarize the actual counts and states. Omission retains the legacy count description. Labels, segments and layout coordinates do not create domain entities.

Mixed diagrams containing rectangles or diamonds pick the topmost painted symbol within its actual bounds, including outlined slots. Pure circle/triangle diagrams retain their previous nearest-agent compatibility behavior. Tiny symbols have a shared two-buffer-pixel minimum for painting and picking. Rotation and device-pixel scaling use the same geometry in the shared Svelte renderer.

### Collection diagrams

`collectionDiagram(rows): SpatialData` is a pure, detached projection exported by the public UI entry and its secondary import. Use it inside the existing spatial view for abstract collections; it creates no view kind, renderer, model or clock. Shared defaults own spacing, wrapping, glyph sizes and annotations. Authors supply no layout numbers.

Each row has a unique nonempty `id`, visible `label` and optional `color`, defaulting to `scientificPalette.neutral`. Its discriminant defines one fact:

- `kind: "items"`, `items: readonly CollectionItem[]`, optional `order: "unordered" | "supplied"`. Items have globally unique `id`, optional `label`, `color` and existing `shape`. Placement preserves input order; omission makes no queue-order claim. Use a model-owned ordered snapshot for supplied order.
- `kind: "count"`, `itemCount`: a nonnegative safe integer, shown exactly without inventing selectable people.
- `kind: "capacity"`, finite nonnegative `used` and `capacity`, and required nonempty `unit`: exact quantities and retained excess remain visible. Anonymous unit outlines or a symbolic frame never assign identified items to seats.

Item colors override row colors. Empty rows stay named; `[]` returns a valid empty scene described as `No collections`. Every supplied identity is retained, including collections above 200. Count/capacity decorations have `selectable: false`; generated decoration IDs are checked for collisions with supplied IDs. Unknown fields, incompatible variants, accessors and unsupported enums throw `TypeError`; invalid ranges, duplicate IDs and derived overflow throw `RangeError`. Output changes cannot mutate input. Abstract diagram coordinates do not replace physical topology, Grid fields or elevator floors.

### Charts

Line and scatter views project numeric `Series[]`: each series has `label`, optional `color` and numeric `{ x, y }` points. Bar views project `BarSeries[]`, whose x values may instead be categories. A bar view uses one x mode across all series; mixed string/number modes fail. Scientific history remains model-owned. Explicit series colors are preserved. Omitted colors stay associated with unique series labels during the mounted view lifetime, including filtering and reordering; duplicate labels retain positional fallback. Setup/disposal resets this presentation lifetime. This is not a scientific category registry.

Categorical bars use first-seen category order and place series side by side. A repeated category within one series fails; missing categories leave empty slots rather than invented zero measurements. Signed finite values use a zero baseline, zero values remain in accessible text, and empty data invents no categories. Existing numeric bar positions retain their compatibility semantics.

Optional `xAxis` and `yAxis` contain `label?` and `unit?`. Together they display as `label (unit)`; a unit alone displays as the unit. Names, units and categories are included in accessible chart text. Units are labels, not numerical conversions. Omitted colors use the shared eight-color palette; more than eight series repeat colors, so fold the rest into one explicitly colored series. Bar axes include zero; line and scatter axes follow the data. Axes show rounded ticks with gridlines, and count data never shows fractional ticks. Numeric bars are centered on their x values with a width set by the closest x spacing; bars of several series at one x sit side by side. Long category labels wrap onto two lines when that makes all of them fit, otherwise only every n-th label is shown.

### Table

`{ type: "table", label, rows }` projects records whose values are string, number or boolean. Rendering derives columns from the first record's key order and leaves missing values blank. Tables scroll within a bounded height with a fixed header and expose all rows through 200-row pages when needed, with Previous rows/Next rows controls and an exact visible range/total. Shrinking data clamps the page; Setup resets it. Empty data reports No rows and has no derived columns. Paging never mutates or truncates model data and introduces no row-selection IDs.

### Inspector

`{ type: "inspector", label, value(observation, selected) }` returns a scalar record or `undefined`. Undefined hides the inspector; returning a record displays its entries. Selection is presentation-owned and starts as `null`; setup clears it. Resolve IDs against the current observation and handle stale/missing IDs. Inspectors do not grant write access to the model.

Within a mounted model, a projected ID must identify one semantic entity consistently across views. Two views of the same entity reuse its ID; unrelated entities must use different IDs. If source kinds overlap, project namespaced IDs such as `agent:${id}` and `cell:${id}`, then resolve those IDs against the current observation in the inspector and selection-dependent action. Do not change domain IDs or introduce a second allocator. This is an authoring contract: the host cannot infer whether two arbitrary projections represent the same entity. Selection remains `string | null`, and a missing target must not trigger a model action. The [namespaced example](../../tests/ui/ui-composition/03-namespaced-selection.ts) covers collisions, shared selection, disappearance and restart.

## Drawing

Experimental `drawing` supplies required `enabled(observation)` and `intent(instance, intent)`, with optional `toggleLabel`. Intents are `{ phase: "begin" | "move", position: {x,y} }` or `{ phase: "end" }`. Positions use the spatial view's centered world coordinates. The model decides how an intent affects state through its public action.

When a toggle is supplied it begins off for each mounted instance; without a toggle drawing follows `enabled`. Drawing, selection and camera gestures are host responsibilities. Do not attach custom pointer listeners to the Lab DOM to bypass this boundary. This addition is experimental and does not establish arbitrary custom-element support.

## Palette

The public UI entry and its secondary import export `scientificPalette`: `neutral`, `waiting`, `active`, `completed` and `unavailable`. Use these shared semantic colors together with shape, position or labels; color alone must not carry the state distinction. They are presentation constants, not model state.


Experimental export `indexedColor(color: number): string` converts finite numeric indexed palette colors using the observed official tenth-color bins. Values wrap modulo 140 and select the lower tenth bin. Nonnumeric values throw `TypeError`; nonfinite values throw `RangeError`. Use it for compatibility presentation, not as a second scientific state variable. This export is absent from the main baseline.

## Lifecycle

A `BoundEntry` exposes `title`, optional `description`, and `mount(container: HTMLElement)`, returning `{ dispose(), pause?() }`. The standard entry returns pause and an idempotent disposer. Mounting creates controls and views but does not automatically create or run the model. Importing an entry is inert.

Setup creates and reads a candidate before replacing the existing model. Creation/read failure disposes the candidate where available and reports the error. Successful replacement disposes previous views and the old instance, clears selection and renders the new observation. Failure during replacement/rendering may leave no active instance; there is no transactional rollback promise for arbitrary action effects.

Run/Pause uses host scheduling to invoke `advance(1)`. Step controls invoke bounded counts; `complete(observation)` defaults to false and disables further stepping when true. Speed changes scheduling, not scientific model time. Pause stops scheduling. Dispose stops scheduling, removes listeners/views and disposes the instance. The catalog owns mounting/unmounting; application discovery and hot reload are not `UISpec` configuration.

`source: { url, label }` adds source attribution alongside the model description. It does not fetch a source or grant model capabilities.

## Errors

The host reports caught model-action and rendering errors and stops playback; earlier model effects are not rolled back. Failed actions may still be followed by an observation refresh. Model factory/action validation remains authoritative even when browser controls validate inputs. Unknown setup/live fields are mount-time errors. Unsupported data is not made valid by TypeScript assertions. Callback exceptions, renderer availability and browser validation failures must be tested in the consuming host; this reference does not promise a generic error class or full runtime schema validator.

## Target syntax

<a id="target-syntax"></a>

Setup-string and keyed-live forms are supported, with legacy arrays preserved for compatibility. The [authoring contract](../development/ui-authoring-contract.md) defines exact ordering, decoding, grouping and chart edge cases. This does not authorize builder chains, custom mount hooks or arbitrary layout configuration.

## Author examples

The [five public author examples](../../tests/ui/ui-authoring/README.md) cover defaults and inert declaration, ordered overrides and numeric bindings, alternate observations and getter precedence, grouping/format/categories, and independent actions/legacy/disposal. Compile-only cases cover incorrect field types and incomplete observation shapes. Headless assertions and real-browser checks are separate gates; the browser harness exercises the Svelte adapter and waits for settled rendering.

## Extensions

Use short inline callbacks for obvious bindings; extract longer projections into named local functions below the description. Explain units, assumptions, unusual transforms and compatibility decisions in comments. Do not narrate obvious property access, repeat types or leave obsolete alternatives in comments. Keep scientific calculations in public headless model functions.

A custom UI element may eventually be local to `ui.ts` or promoted into a reusable UI library element when a concrete second consumer justifies it. Flat live-control groups are supported; no custom-element authoring signature is defined. Direct queries into host DOM, private Svelte components and monkey-patching renderer internals are not public extension contracts. A future extension must define typed observations/actions, ownership, accessibility, cleanup and defaults through its own example-first slice.
