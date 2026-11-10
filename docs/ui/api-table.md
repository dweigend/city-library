# UI API inventory

This inventory and the [UI API reference](api-reference.md) form the binding UI contract. **Readability comes first; useful defaults come before customization.** This is a separate presentation API, not part of the headless `city-library` package. Follow the [binding domain terminology](../agent-loom/terminology.md).

## Status and notation

`Supported` means a repository contract available in the Svelte host. `Required` means a binding design rule; `Planned` means a candidate that needs a defined contract before use. [PLAN](../../PLAN.md) tracks remaining acceptance work. Source presence alone does not establish scientific or independent acceptance.

`P` is the model parameter object; `K = Extract<keyof P, string>`; `M` is its concrete instance; `S = ReturnType<M["read"]>`; `Scalar = string \| number \| boolean`; `Row = Readonly<Record<string, Scalar>>`. `?` marks optional properties. All declaration arrays and observation data are readonly. IDs below remain stable when availability changes. Each row links to its detailed contract.

## Entry and model contracts

| ID | Entry / signature | Requirement and default | Scope | Reference |
| --- | --- | --- | --- | --- |
| UI-001 | `defineUI<P extends object, M extends ModelInstance>(definition: Definition<P,M>, spec: UISpec<P,M>): BoundEntry` | Public runtime entry from `ui/index.ts`; infer concrete model types. Does not create the model at import. | Supported | [Entry](api-reference.md#define-ui) |
| UI-002 | `UISpec<P,M>` | Ordinary object; only `views` is required. No renderer configuration or layout tree required. | Supported | [Principles](api-reference.md#principles) |
| UI-003 | `ModelInstance` | `read(): unknown`, `advance(steps?: number): void`, `dispose?(): void`; concrete `read` return type supplies `S`. | Supported | [Model](api-reference.md#model) |
| UI-004 | `BoundEntry` | `title: string`, `description?: string`, `mount(container: HTMLElement): { dispose(): void; pause?(): void }`. Mounted handle belongs to host integration. | Supported | [Lifecycle](api-reference.md#lifecycle) |
| UI-005 | `Definition<P,M>` | Headless companion from `models/definition.ts`: `title`, `description?`, `inputs: Inputs<P>`, `create(options?: Partial<P>): M`. Not re-exported by `ui/index.ts`. | Supported | [Model](api-reference.md#model) |
| UI-006 | `Input<T>`, `Inputs<P>` | Number: `kind`, `default`, optional `min/max/step/integer`; boolean: `kind/default`; choice: `kind/default/options`; text: `kind/default`. Canonical defaults and validation belong to model. | Supported | [Model](api-reference.md#model) |

## Controls and observations

| ID | Property / signature | Requirement and omission behavior | Scope | Reference |
| --- | --- | --- | --- | --- |
| UI-010 | `setup?: readonly SetupField[]` | String keys or local override records. Keyed-live omission excludes live fields; legacy omission keeps all inputs. Explicit `[]` renders none; descriptors supply defaults. | Supported | [Setup](api-reference.md#setup) |
| UI-011 | Setup field `{ field: K; label?: string; widget?: "number" \| "range" \| "select" \| "checkbox" \| "text" }` | `field` required. Humanize field name when label omitted. Descriptor chooses control; current renderer recognizes `range` override, not arbitrary conversions between descriptor kinds. | Supported | [Setup](api-reference.md#setup) |
| UI-012 | Numeric control constraints | Descriptor `min/max` copied when supplied; `step` defaults to `1` for integer, otherwise `"any"`. Default value comes from descriptor. UI validity complements factory validation. | Supported | [Setup](api-reference.md#setup) |
| UI-013 | `live?: field-keyed object or legacy array` | Normal form is a field-keyed object; legacy arrays remain compatible. Omission gives no live controls. | Supported | [Live](api-reference.md#live) |
| UI-014 | Legacy live-array field `{ field: K; label?: string; value: (state: S) => Scalar; set: (model: M, value: Scalar) => void; enabled?: (state: S) => boolean }` | `field/value/set` required; enabled defaults true after setup. `set` explicitly calls model actions. Current setter receives a scalar union, not a field-correlated type. | Supported | [Live](api-reference.md#live) |
| UI-015 | Live field `widget?: "color"` | Optional text-input presentation override; no implicit model mutation. | Supported | [Live](api-reference.md#live) |
| UI-016 | `actions?: readonly Action[]` | Omission gives no model-specific action buttons. Host setup/playback controls are separate. | Supported | [Actions](api-reference.md#actions) |
| UI-017 | Action `{ label: string; run: (model: M, selected: string \| null) => void; enabled?: (state: S, selected: string \| null) => boolean; pressed?: (state: S) => boolean }` | `label/run` required; enabled defaults true after setup. Omitted `pressed` means ordinary action, not a toggle binding. Selection is presentation-owned. | Supported | [Actions](api-reference.md#actions) |
| UI-018 | Action `repeat?: { label: string; intervalMs: number }` | Both nested properties required when present. Omission gives no repeat control. Independent host cadence, never model time. | Supported | [Actions](api-reference.md#actions) |
| UI-019 | `monitors?: readonly { label: string; value: (state: S) => string \| number }[]` | Omission gives no monitors; callbacks observe, do not advance model/time/RNG. | Supported | [Monitors](api-reference.md#monitors) |
| UI-020 | `complete?: (state: S) => boolean` | Omission means false; completion is explicit model observation, not guessed from data. | Supported | [Lifecycle](api-reference.md#lifecycle) |
| UI-021 | `source?: { url: string; label: string }` | Both properties required when supplied; omission gives no source link. | Supported | [Entry](api-reference.md#define-ui) |

## Views

Every view requires `type` and `label`; labels are currently explicit. All callbacks consume the same typed model observation. `View<S>` is publicly re-exported. Inspector is accepted in `UISpec.views` and its named type is re-exported by both UI entrypoints.

| ID | Discriminant and required data callback | Data contract | Scope | Reference |
| --- | --- | --- | --- | --- |
| UI-030 | `views: readonly (View<S> \| Inspector<S>)[]` | Required; `[]` is valid. Order is authored order. | Supported | [Views](api-reference.md#views) |
| UI-031 | `type: "network"`; `nodes(state): readonly GraphNodeData[]`; `edges(state): readonly GraphEdgeData[]` | Detached graph presentation; no World or renderer objects required. | Supported | [Network](api-reference.md#network) |
| UI-032 | `type: "grid"`; `data(state): GridData` | Rectangular rendered cells. | Supported | [Grid](api-reference.md#grid) |
| UI-033 | `type: "spatial"`; `data(state): SpatialData` | Spatial agent presentation, optional cell backdrop. | Supported | [Spatial](api-reference.md#spatial) |
| UI-034 | `type: "line" \| "bar" \| "scatter"`; `series(state): readonly Series[]` | Line/scatter use numeric Series; bar supports numeric/categorical BarSeries in the public contract. | Supported | [Charts](api-reference.md#charts) |
| UI-035 | `type: "table"`; `rows(state): readonly Row[]` | Column keys from first row; empty rows give no columns; absent later-row values display empty. | Supported | [Table](api-reference.md#table) |
| UI-036 | `type: "inspector"`; `value(state, selected: string \| null): Row \| undefined` | `undefined` means nothing to inspect. No direct domain-object mutation. | Supported | [Inspector](api-reference.md#inspector) |

## View data

| ID | Type / properties | Defaults and constraints | Scope | Reference |
| --- | --- | --- | --- | --- |
| UI-040 | `GraphNodeData`: `id: string`, `label?: string`, `color?: string`, `size?: number` | Stable ID; optional label; host color; symbol diameter in CSS pixels, default 16 for network and 8 for spatial rendering. Size is not collision radius. | Supported | [Network](api-reference.md#network) |
| UI-041 | `GraphNodeData.position?: { x: number; y: number }` | Initial view coordinates; later layout/dragging remains presentation-owned. Omission uses host placement. | Supported | [Network](api-reference.md#network) |
| UI-042 | `GraphEdgeData`: `id: string`, `from: string`, `to: string` | Stable edge ID and node IDs. | Supported | [Network](api-reference.md#network) |
| UI-043 | Edge `directed?: boolean`, `color?: string`, `width?: number` | Undirected when omitted; host color; positive finite CSS-pixel width, default 1. | Supported | [Network](api-reference.md#network) |
| UI-044 | `Cell`: `id: string`, `x: number`, `y: number`, `color: string` | Rendered cell record, not domain `Field`. Named type is exported by the UI entry in the public contract. | Supported | [Grid](api-reference.md#grid) |
| UI-045 | `GridData`: `width: number`, `height: number`, `cells: readonly Cell[]` | All required; dimensions and coordinates describe presentation extent. | Supported | [Grid](api-reference.md#grid) |
| UI-046 | `SpatialAgent extends GraphNodeData`: `x: number`, `y: number`, `heading?: number`, `shape?: "circle" \| "triangle"` | Required position; heading defaults 0 degrees; shape defaults circle. Named type is exported by the UI entry in the public contract. | Supported | [Spatial](api-reference.md#spatial) |
| UI-047 | `SpatialData`: `width: number`, `height: number`, `agents: readonly SpatialAgent[]`, `cells?: readonly Cell[]` | Required extent/agents; omission gives no cell backdrop. | Supported | [Spatial](api-reference.md#spatial) |
| UI-048 | `SpatialData.showLabels?: boolean` | Controlled label visibility when supplied; omission retains host Labels control. | Supported | [Spatial](api-reference.md#spatial) |
| UI-049 | `SpatialData.segments?: readonly SpatialSegment[]` | Ordered strokes above cells and below agents/selection/labels; omitted means no strokes. | Supported | [Spatial](api-reference.md#spatial) |
| UI-050 | `SpatialSegment`: `from/to: { x: number; y: number }`, `color?: string`, `width?: number` | Detached finite centered world endpoints; nonnegative finite CSS-pixel width defaults 1, zero omits stroke. Color defaults to host foreground. | Supported | [Spatial](api-reference.md#spatial) |
| UI-051 | `Series`: `label: string`, `color?: string`, `points: readonly { x: number; y: number }[]` | Label/points required; host palette when color omitted. No model history is inferred or recorded by the view. | Supported | [Charts](api-reference.md#charts) |

## Drawing and palette

| ID | API / signature | Defaults and ownership | Scope | Reference |
| --- | --- | --- | --- | --- |
| UI-060 | `drawing?: { toggleLabel?: string; enabled: (state: S) => boolean; intent: (model: M, intent: DrawingIntent) => void }` | Omitted means no drawing binding; explicit enable predicate and model action required. Optional toggle starts off per mounted instance. Without toggle label, predicate alone gates drawing. | Supported | [Drawing](api-reference.md#drawing) |
| UI-061 | `DrawingIntent` | `{ phase: "begin" \| "move"; position: { x: number; y: number } }` or `{ phase: "end"; position?: never }`; named type not re-exported by UI entry. | Supported | [Drawing](api-reference.md#drawing) |
| UI-062 | `indexedColor(color: number): string` | Public experimental helper; finite numeric colors wrap modulo 140 and select observed tenth-color bins. Non-number throws TypeError; nonfinite number throws RangeError. | Supported | [Palette](api-reference.md#palette) |

## Design rules and planned extensions

| ID | Target | Current distinction | Scope | Reference |
| --- | --- | --- | --- | --- |
| UI-070 | One flat, readable `defineUI(model, spec)` description | One normal spelling, no DSL, builder chains, styling boilerplate or duplicated scientific rules. Customize at the relevant binding only when required. Keep short projections inline; name longer functions for readability. | Required | [Principles](api-reference.md#principles) |
| UI-071 | Concise setup and live-aware defaults | String fields, local overrides and keyed-live exclusion are supported; legacy defaults remain compatible. | Supported | [Target syntax](api-reference.md#target-syntax) |
| UI-072 | Field-correlated keyed live bindings | Keyed setters receive P[K]; required compatible observation.parameters enables implicit getters, otherwise explicit getters are required. Legacy scalar arrays remain. | Supported | [Target syntax](api-reference.md#target-syntax) |
| UI-073 | Shared design defaults; extension only for concrete need | Flat group labels are supported. Arbitrary layout and custom mount hooks remain outside the authoring contract. | Required | [Extensions](api-reference.md#extensions) |

Do not treat internal renderer mounts, Svelte components, theme bridges, catalog discovery, playback helpers or private `Snapshot`/`EntryDefinition` aliases as additional authoring exports. An API addition must update this inventory and the reference together, distinguish required behavior from implemented behavior, and satisfy the project's example-first gate before runtime expansion.

## Authoring controls and formatting

| ID | Contract | Scope | Reference |
| --- | --- | --- | --- |
| UI-074 | Live `group?: string`: flat accessible fieldset; empty labels fail at mount. | Supported | [Live](api-reference.md#live) |
| UI-075 | `BarSeries`: categorical or numeric x, grouped categorical series, signed values and explicit invalid-mode handling. | Supported | [Charts](api-reference.md#charts) |
| UI-076 | Chart `xAxis?` / `yAxis?`: optional label/unit, no numeric conversion. | Supported | [Charts](api-reference.md#charts) |
| UI-077 | Monitor `format`: display only; scalar-specific annotations must match the paired getter, while unannotated callbacks retain the scalar-union context. Errors follow host failure handling. | Supported | [Monitors](api-reference.md#monitors) |

## Readable observation and formatter extension

| ID | Contract | Availability | Reference |
| --- | --- | --- | --- |
| UI-078 | `Observation<T>` infers the detached observation from a definition or model instance; exported by both UI entrypoints. | Public type | [Model](api-reference.md#model) |
| UI-079 | `Monitor<S, V>` types an extracted monitor with observation `S` and scalar `V`; scalar formatter arguments must accept the paired getter result. | Public type | [Monitors](api-reference.md#monitors) |
| UI-080 | Selection retains string/null and one semantic presentation ID per entity across views; authors namespace overlapping source IDs. | Authoring contract | [Inspector](api-reference.md#inspector) |
