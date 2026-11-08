# UI API reference

## Status

This reference and the [API table](api-table.md) jointly define the binding UI authoring contract. **Readability is the highest priority; defaults come before customization.** Binding does not mean implemented: the design candidates below are not frozen contracts or availability claims.

Source baseline: `ui/index.ts`, `ui/definition.ts`, `ui/compose.ts`, `ui/controls/form.ts` and `ui/views/` in `main`; experimental additions are identified separately against the `experiment/netlogo-web-catalog` checkout. That checkout also contains an evolving Svelte host. Its components, renderer bridges and DOM structure are implementation details, not experiment authoring APIs. This document records source inspection, not new browser acceptance. Availability must be checked against the branch being consumed.

## Principles

The five [binding UI authoring rules](../DESIGN.md#binding-ui-authoring-rules) govern defaults, flat structure, one normal spelling, local customization and function placement.

1. Ordinary `ui.ts` files read as flat TypeScript data descriptions. Use one familiar spelling, short callbacks and named projections when a callback obscures the description.
2. The model owns scientific state, validation, defaults and actions. The UI reads observations and invokes public actions; it never duplicates scientific rules or mutates observations.
3. Model input descriptors supply defaults, numeric limits, granularity and choices. The shared host supplies typography, theme, spacing, layout, accessible controls and renderer styling.
4. Customization belongs next to the affected binding and is optional. Do not require renderer selection, DOM work, lifecycle plumbing or style configuration for a normal experiment.
5. Follow [Agent Loom terminology](../agent-loom/terminology.md). Domain `Field` and detached UI `Cell`/`cells` have different responsibilities. A step invokes a model procedure; tick is model time; host cadence is neither.

## Define UI

`defineUI<P, M>(definition, spec): BoundEntry` is exported by `ui/index.ts`. It binds a plain headless `Definition<P, M>` to a `UISpec<P, M>` while preserving the concrete instance and observation types inside callbacks. It returns title, optional description and a mounted-session contract. Creating the definition must not initialize a model, create timers, perform I/O or touch the DOM at module import.

Current syntax:

```ts
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: [{ field: "seed" }],
  monitors: [{ label: "Tick", value: state => state.tick }],
  views: [],
});
```

`views` is currently required, including when empty. Other top-level fields are optional. Labels on current actions, monitors and views are required. The model's title and description are reused rather than repeated in the UI.

## Model

`Definition<P, M>` supplies `title`, optional `description`, canonical `inputs` and `create(parameters)`. Inputs are descriptors for number, boolean, choice or text, each with `default`; numbers may specify `min`, `max`, `step`, `integer`, and choices specify `options`. This is the experiment definition contract, not the future live-property core `Input` API.

`M` implements `read(): unknown`, `advance(steps?: number): void` and optionally `dispose(): void`. Callback observations are inferred as `ReturnType<M["read"]>`. The factory and actions own runtime validation, including cross-field constraints. UI constraints complement that validation. Observers and rendering projections must be side-effect-free and must not advance model time or consume model randomness.

## Setup

Current `setup` is an ordered array of `{ field, label?, widget? }`. `field` is a string key of `P`. Omission currently displays every declared input in descriptor order, including inputs also bound live. `[]` hides ordinary setup fields. Hidden fields retain model descriptor defaults unless a live control supplies their setup value.

Labels default to a camel-case split with the initial letter capitalized. Descriptor kind chooses checkbox, select, number or text. `widget: "range"` selects a numeric range; the wider declared widget union does not promise arbitrary coercion between descriptor kinds. Numbers inherit `min`, `max` and `step`; absent step uses `1` for integer inputs and `any` otherwise. Choice values come from descriptor options. Setup reads numbers as numbers, booleans as booleans and other controls as strings.

Editing setup values does not change the running model. Submitting Setup stops playback, validates the form and calls the factory with current values. An unknown input key throws. The [design candidates](#target-syntax) propose changing the default overlap rule and introducing a readable string-list form; neither is frozen or delivered by the current baseline.

## Live

Current `live` is an ordered array of `{ field, label?, value, set, enabled? }`. `value(observation)` reads the displayed value; `set(instance, value)` invokes an explicit model action. Its current value type is `string | number | boolean`, so a consumer may need a narrow conversion. Do not claim current field-specific inference.

The host derives control kind, bounds and label from the same descriptor as setup. Before initialization, changing a live control contributes its value to the next setup. After initialization, a valid change stops playback and calls `set`; rendering rereads the canonical observation. `enabled` defaults to true after setup. A live reader takes precedence over a duplicate setup reader for that field in the current form.

Experimental addition: `widget: "color"` selects a native color input. The model uses a string color representation and validates it; this option does not convert NetLogo numeric colors automatically.

## Actions

Current action records contain `label`, `run(instance, selected)`, optional `enabled(observation, selected)` and optional `pressed(observation)`. `selected` is a string identifier or `null`. Before setup actions are disabled; afterward `enabled` defaults to true. `pressed` supplies the accessible pressed state and is not an implicit mutation. A normal action stops playback, invokes the model action and refreshes observations.

Experimental `repeat: { label, intervalMs }` adds a host-owned repetition toggle. Interval must be positive and finite. Repetition has its own cadence and does not imply a World tick. It checks instance identity and availability, stops when disabled or on failure, and rejects stale scheduled callbacks. The model action alone determines scientific effects.

## Monitors

`monitors` is an ordered array of `{ label, value(observation) }`. Values are strings or numbers, rendered as text after initialization and subsequent successful interactions. Format presentation here; compute scientific measurements in the model or its public functions. Omission means no monitors.

## Views

Each view has a discriminant `type`, a required `label` and one data projection. Views consume detached presentation data. IDs connect selection and inspection; they are not additional domain owners. Array order determines authoring order. Shared host layout may adapt to available space. Theme and camera state belong to presentation.

### Network

`{ type: "network", label, nodes, edges }` projects arrays of `NetworkNode` and `NetworkEdge`. Nodes require string `id`; optional `label`, `color`, `size` customize presentation. Size is symbol diameter in CSS pixels, not a physical collision radius. Edges require `id`, `from`, `to` referencing node IDs.

Experimental nodes add optional initial `position: { x, y }`; later dragging and layout remain presentation-owned. Experimental edges add `directed`, `color` and positive finite CSS-pixel `width`. Do not infer graph weights or mutate graph state from renderer positions.

### Grid

`{ type: "grid", label, data }` projects `GridData`: `width`, `height`, `cells`. Each UI cell contains `id`, `x`, `y`, `color`. A UI cell is a detached rendering record, not a domain `Field`. Dimensions and coordinates must describe the same grid.

### Spatial

`{ type: "spatial", label, data }` projects `SpatialData`: `width`, `height`, optional `cells` and required `agents`. Each spatial agent extends node presentation fields with `x`, `y`, optional `heading` in degrees and optional `shape: "circle" | "triangle"`. The baseline renderer defaults heading to zero and shape to circle. Coordinates are centered world coordinates; positive y points upward. Display size remains CSS pixels.

Experimental additions: `showLabels` controls label visibility when supplied; omission retains the host Labels control. `segments` contains ordered `{ from: {x,y}, to: {x,y}, color?, width? }` strokes above cells and below agents, selection and labels. Endpoints must be finite centered coordinates. Width defaults to 1 CSS pixel; zero omits a stroke; negative/nonfinite widths are invalid input. Omitted color uses the host foreground (legacy host white). Segments do not participate in picking or model collision logic.

### Charts

`{ type: "line" | "bar" | "scatter", label, series }` projects `Series[]`. Each series contains `label`, optional `color` and `points: readonly { x: number; y: number }[]`. Omitted colors use the shared renderer palette. Chart projections do not record history: the model or an explicit observation owner supplies the points. No generic axis-configuration or chart-library escape hatch is part of this contract.

### Table

`{ type: "table", label, rows }` projects records whose values are string, number or boolean. Current rendering derives columns from the first record's key order, displays at most 200 records, and leaves missing values blank. An empty array has no derived columns. This display bound is not a model-data truncation rule.

### Inspector

`{ type: "inspector", label, value(observation, selected) }` returns a scalar record or `undefined`. Undefined hides the inspector; returning a record displays its entries. Selection is presentation-owned and starts as `null`; setup clears it. Resolve IDs against the current observation and handle stale/missing IDs. Inspectors do not grant write access to the model.

## Drawing

Experimental `drawing` supplies required `enabled(observation)` and `intent(instance, intent)`, with optional `toggleLabel`. Intents are `{ phase: "begin" | "move", position: {x,y} }` or `{ phase: "end" }`. Positions use the spatial view's centered world coordinates. The model decides how an intent affects state through its public action.

When a toggle is supplied it begins off for each mounted instance; without a toggle drawing follows `enabled`. Drawing, selection and camera gestures are host responsibilities. Do not attach custom pointer listeners to the Lab DOM to bypass this boundary. This addition is experimental and does not establish arbitrary custom-element support.

## Palette

Experimental export `netLogoColor(color: number): string` converts finite numeric NetLogo colors using the observed official tenth-color bins. Values wrap modulo 140 and select the lower tenth bin. Nonnumeric values throw `TypeError`; nonfinite values throw `RangeError`. Use it for compatibility presentation, not as a second scientific state variable. This export is absent from the main baseline.

## Lifecycle

A `BoundEntry` exposes `title`, optional `description`, and `mount(container: HTMLElement)`, returning `{ dispose(), pause?() }`. The standard entry returns pause and an idempotent disposer. Mounting creates controls and views but does not automatically create or run the model. Importing an entry is inert.

Setup creates and reads a candidate before replacing the existing model. Creation/read failure disposes the candidate where available and reports the error. Successful replacement disposes previous views and the old instance, clears selection and renders the new observation. Failure during replacement/rendering may leave no active instance; there is no transactional rollback promise for arbitrary action effects.

Run/Pause uses host scheduling to invoke `advance(1)`. Step controls invoke bounded counts; `complete(observation)` defaults to false and disables further stepping when true. Speed changes scheduling, not scientific model time. Pause stops scheduling. Dispose stops scheduling, removes listeners/views and disposes the instance. The catalog owns mounting/unmounting; application discovery and hot reload are not `UISpec` configuration.

`source: { url, label }` adds source attribution alongside the model description. It does not fetch a source or grant model capabilities.

## Errors

The host reports caught model-action and rendering errors and stops playback; earlier model effects are not rolled back. Failed actions may still be followed by an observation refresh. Model factory/action validation remains authoritative even when browser controls validate inputs. Unknown setup/live fields are mount-time errors. Unsupported data is not made valid by TypeScript assertions. Callback exceptions, renderer availability and browser validation failures must be tested in the consuming host; this reference does not promise a generic error class or full runtime schema validator.

## Target syntax

<a id="target-syntax"></a>

**Design candidates: not frozen, not currently available.** Preserve `defineUI(model, spec)` and normal TypeScript. A proposed ordinary setup selection is `setup: ["seed", "population"]`; an explicit override record may be used only where label/widget customization is required. A proposed live form is a field-keyed object. Omitted setup lists declared inputs in model order except fields bound live; explicit setup determines selection/order. Descriptor defaults remain the sole source of default parameter values.

A live binding derives its current value from typed `observation.parameters[field]` when that field is available with a compatible type. Otherwise an explicit `value` projection is required. The proposed setter receives the declared field value type and remains mandatory: no guessed setter names and no automatic model-property assignments. Ordinary labels are derived; explicit labels supply units or better wording. Shared UI defaults supply design and renderer choices.

Illustrative candidate authoring, deliberately not executable evidence:

```ts
export const ui = defineUI(model, {
  setup: ["seed", "population"],
  live: {
    rate: { set: (instance, value) => instance.setRate(value) },
  },
  monitors: [{ label: "Tick", value: state => state.tick }],
  views: [{ type: "spatial", label: "World", data: spatial }],
});
```

Exact override syntax, migration compatibility and optional view-label derivation must be settled and frozen in asserted public examples before runtime delivery. This target does not authorize a second DSL, builder hierarchy or universal plugin framework. Any unresolved contract must be recorded rather than implemented by guessing.

## Author examples

If these candidates are accepted for implementation, first settle their open contracts and freeze five asserted public scripts covering:

1. Minimal defaults: omitted setup derives controls in model order, excludes live fields and passes canonical defaults to the factory without creating a model at import.
2. Explicit setup: string selection preserves order; a local label/widget override changes presentation while preserving descriptor values and validation.
3. Typed live action: a numeric field infers a numeric setter, reads `parameters[field]`, rejects a wrong value type and changes state only through the declared public action.
4. Alternate observation: explicit `value` supports a model without `parameters[field]`; missing implicit observation binding is a type error rather than an undefined display.
5. Lifecycle: setup, action, selection, pause, completion and disposal preserve one model owner and reject stale callbacks; a second mounted entry remains independent.

These are proposed author tasks, not frozen examples, executed scripts or approval evidence. Browser interaction/visual checks complement the scripts for runtime delivery.

## Extensions

Use short inline callbacks for obvious bindings; extract longer projections into named local functions below the description. Explain units, assumptions, unusual transforms and compatibility decisions in comments. Do not narrate obvious property access, repeat types or leave obsolete alternatives in comments. Keep scientific calculations in public headless model functions.

A custom UI element may eventually be local to `ui.ts` or promoted into a reusable UI library element when a concrete second consumer justifies it. **No custom-element authoring signature is currently frozen here.** Direct queries into host DOM, private Svelte components and monkey-patching renderer internals are not public extension contracts. A future extension must define typed observations/actions, ownership, accessibility, cleanup and defaults through its own example-first slice.
