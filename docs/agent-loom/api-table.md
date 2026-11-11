# City Library API inventory

Availability: static factories use `Type.create`. Delivered streams support only `mulberry32`; `mt-word-stream/1` is an undelivered target whose seed, distribution and continuation contract still requires resolution, not an algorithm-equivalence claim. `unsupported-interleaved-activation` always throws. The snapshot, declaration-limit and finite-study XML formats below are undelivered targets; their naming changes do not migrate stored bytes or publish codecs. Original representation provenance belongs in dedicated source records.

Use this inventory to find an operation, read its signature and follow the link to its full contract.

> **Specification of the whole City Library.** These 450 operation/type entries in 25 areas define the public API: the original modeling core, further delivered core exports, planned core additions, city systems, UI authoring and the model contract. Implementation status is tracked in [PLAN](../../PLAN.md) and the [coverage inventory](../development/coverage.md). Only a `delivered` entry is available.

**Status.** Every entry states one status:

- `delivered`: exported today by `index.ts` (headless package) or `ui/index.ts` (UI authoring). This is not a parity or acceptance claim; where the source spelling differs from the signature here, [coverage](../development/coverage.md) tracks the comparison.
- `target`: a specified contract without a public export. Do not call it.
- `planned`: a proposed addition justified by [evolution](../evolution/README.md) or a clear system need. It is not an accepted contract and must pass the [example-first gate](../../PLAN.md#example-first-delivery-gate) before implementation.

**Target.** The line under each area heading names its folder in the accepted [target structure](../evolution/structure.md). No files have moved yet; public names stay unchanged when they do.

The first 16 areas hold the original 309 anchored entries and three additive headings, now anchored as `api-random-number-additive`, `api-agenda-size` and `api-agenda-next`. Entries added to cover the whole system are numbered `api-380` to `api-517` in document order; existing numbers and anchors are unchanged. [Open decisions](#open-decisions) lists unresolved choices and known inconsistencies.

[Overview](README.md) · [Detailed reference and examples](api-reference.md)

Each entry lists its exact signature, compact contract and detailed reference. Overloads appear separately. The `agent-loom` import paths are specification names; City Library package entries remain unresolved.

## Contents

[World](#area-world) · [Agent](#area-agent) · [Grid](#area-grid) · [Field](#area-field) · [Graph](#area-graph) · [Node](#area-node) · [Edge](#area-edge) · [Random](#area-random) · [Input](#area-input) · [stats](#area-stats) · [geometry](#area-geometry) · [Agenda](#area-agenda) · [studies](#area-studies) · [storage](#area-storage) · [limits](#area-limits) · [Exports and shared types](#area-exports-and-shared-types) · [topology](#area-topology) · [continuous](#area-continuous) · [twoPhase](#area-two-phase) · [measurements](#area-measurements) · [Budget](#area-budget) · [EnergySupply](#area-energy-supply) · [PublicTransport](#area-public-transport) · [UI authoring](#area-ui-authoring) · [Model contract](#area-model-contract) · [Open decisions](#open-decisions)

<a id="area-world"></a>

## World

Target: `library-core/world-composition`.

<a id="world-add"></a>
<a id="api-12"></a>

### World.create

Status: delivered

```ts
World.create(options?: { random?: Random }): World
```

Create an independent World without a spatial context; supply an optional shared Random. The World owns its Tick and an independent seed-1 Random by default.

[Details](api-reference.md#world-add)

<a id="world-add-2"></a>
<a id="api-13"></a>

### World.create

Status: delivered

```ts
World.create(space: Space, options?: { boundary?: Space["boundary"]; random?: Random }): World
```

Create an independent World with the supplied immutable spatial context, optional boundary override and shared Random. Dimensions derive from the axes.

[Details](api-reference.md#world-add)

<a id="world-space"></a>
<a id="api-11"></a>

### world.space

Status: delivered

```ts
world.space: (Space & Required<Pick<Space, "dimensions" | "boundary">>) | undefined
```

Read the immutable normalized spatial context, or undefined for a World without bounds.

[Details](api-reference.md#space-type)

<a id="world-random"></a>
<a id="api-29"></a>

### world.random

Status: delivered

```ts
world.random: Random
```

Read-only Random reference selected at World construction; the default is an independent seed-1 generator.

[Details](api-reference.md#world-add)

<a id="world-tick"></a>
<a id="api-16"></a>

### world.tick

Status: delivered

```ts
world.tick: Tick // readonly; owned by this World
```

Read the World-owned Tick. Its reference is fixed; value changes only through advance/reset or successful run updates.

[Details](api-reference.md#world-tick)

<a id="world-tick-value"></a>
<a id="api-30"></a>

### world.tick.value

Status: delivered

```ts
world.tick.value: number
```

Read the finite nonnegative clock value; default 0. Fractional values are allowed; there is no fixed wall-clock duration.

[Details](api-reference.md#world-tick)

<a id="world-tick-advance"></a>
<a id="api-31"></a>

### world.tick.advance

Status: delivered

```ts
world.tick.advance(amount?: number): void
```

Advance the clock by amount. Default: 1. Requires a finite nonnegative amount and an idle World.

[Details](api-reference.md#world-tick)

<a id="world-tick-reset"></a>
<a id="api-32"></a>

### world.tick.reset

Status: delivered

```ts
world.tick.reset(): void
```

Set only the clock value to 0. Requires an idle World; model state, Agenda, History and Random remain unchanged.

[Details](api-reference.md#world-tick)

<a id="world-agents"></a>
<a id="api-18"></a>

### world.agents

Status: delivered

```ts
world.agents: readonly Agent[]
```

Read an insertion-order snapshot of registered Agent identities.

[Details](api-reference.md#complete-membership)

<a id="world-grids"></a>
<a id="api-19"></a>

### world.grids

Status: delivered

```ts
world.grids: readonly Grid[]
```

Read an insertion-order snapshot of registered Grid identities.

[Details](api-reference.md#complete-membership)

<a id="world-graphs"></a>
<a id="api-20"></a>

### world.graphs

Status: delivered

```ts
world.graphs: readonly Graph[]
```

Read an insertion-order snapshot of registered Graph identities.

[Details](api-reference.md#complete-membership)

<a id="world-inputs"></a>
<a id="api-21"></a>

### world.inputs

Status: target

```ts
world.inputs: readonly Input[]
```

Read an insertion-order snapshot of registered Input identities.

[Details](api-reference.md#complete-membership)

<a id="world-agendas"></a>
<a id="api-22"></a>

### world.agendas

Status: delivered

```ts
world.agendas: readonly Agenda[]
```

Read an insertion-order snapshot of registered Agenda identities.

[Details](api-reference.md#complete-membership)

<a id="world-add-3"></a>
<a id="api-14"></a>

### world.add

Status: delivered

```ts
world.add<T extends Component>(component: T): T
```

Attach existing components; return the original component or a normalized batch snapshot. Validate the complete batch before changing ownership.

[Details](api-reference.md#attach)

<a id="world-add-4"></a>
<a id="api-15"></a>

### world.add

Status: delivered

```ts
world.add<T extends Component>(components: Iterable<T>): readonly T[]
```

Attach existing components; return the original component or a normalized batch snapshot. Validate the complete batch before changing ownership.

[Details](api-reference.md#attach)

<a id="world-delete"></a>
<a id="api-23"></a>

### world.delete

Status: delivered

```ts
world.delete(component: Component | Iterable<Component>): void
```

Detach registered components without deleting them. Missing unowned components are a no-op; foreign ownership rejects.

[Details](api-reference.md#complete-membership)

<a id="run"></a>
<a id="api-24"></a>

### run

Status: delivered

```ts
run<R>(world: World, step: (() => R) &
  ([Extract<R, PromiseLike<unknown>>] extends [never] ? unknown : never), stepCount?: number): void
```

Run synchronous model updates; stepCount defaults to 1. Each successful callback adds 1 to world.tick.value; failed callbacks retain prior effects and add no tick.

[Details](api-reference.md#complete-membership)

<a id="world-activate"></a>
<a id="api-25"></a>

### world.activate

Status: delivered

```ts
world.activate<T extends WorldMember>(source: ActivationSource<T>, action: (context: ActivationContext<T>) => unknown,
  options?: { order?: "fixed" | "shuffle" | "priority" | "unsupported-interleaved-activation"; priority?: (member: T) => number; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; groups?: ReadonlyMap<WorldMember,string>; groupOrder?: readonly string[] }): void
```

Invoke a synchronous action for selected World members under explicit scheduling and scoped self/caller contexts. Never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="world-report"></a>
<a id="api-26"></a>

### world.report

Status: delivered

```ts
world.report<T extends WorldMember,R>(source: T, report: (context: ActivationContext<T>) => R,
  options?: { order?: "fixed" | "shuffle" | "priority" | "unsupported-interleaved-activation"; priority?: (member: T) => number; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; groups?: ReadonlyMap<WorldMember,string>; groupOrder?: readonly string[] }): R | undefined
```

Evaluate a synchronous report for one or more World members under explicit scheduling and scoped contexts. Never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="world-report-2"></a>
<a id="api-27"></a>

### world.report

Status: delivered

```ts
world.report<T extends WorldMember,R>(source: readonly T[] | { kind: "agents" | "fields" | "edges"; group?: string }, report: (context: ActivationContext<T>) => R,
  options?: { order?: "fixed" | "shuffle" | "priority" | "unsupported-interleaved-activation"; priority?: (member: T) => number; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; groups?: ReadonlyMap<WorldMember,string>; groupOrder?: readonly string[] }): readonly (R | undefined)[]
```

Evaluate a synchronous report for one or more World members under explicit scheduling and scoped contexts. Never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="world-select"></a>
<a id="api-28"></a>

### world.select

Status: delivered

```ts
world.select<T extends WorldMember>(source: ActivationSource<T>, predicate: (context: ActivationContext<T>) => boolean,
  options?: { caller?: ActivationContext<WorldMember>; groups?: ReadonlyMap<WorldMember,string> }): readonly T[]
```

Evaluate the scoped predicate deterministically in captured source order and return matching member identities. Selection never shuffles and has no order option; it never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="type-tick"></a>
<a id="api-17"></a>

### Tick

Status: delivered

```ts
interface Tick {
  readonly value: number;
  advance(amount?: number): void;
  reset(): void;
}
```

World-owned model clock with a read-only numeric value and explicit advance/reset operations.

[Details](api-reference.md#world-tick)

<a id="type-world-member"></a>
<a id="api-318"></a>

### WorldMember

Status: delivered

```ts
type WorldMember = Agent | Field | Edge;
```

Agent, Field or Edge identity eligible for explicit World activation.

[Details](api-reference.md#activation-contracts)

<a id="type-activation-source"></a>
<a id="api-319"></a>

### ActivationSource

Status: delivered

```ts
type ActivationSource<T extends WorldMember> = T | readonly T[]
  | { readonly kind: "agents" | "fields" | "edges"; readonly group?: string };
```

One member, a captured member list or an explicit kind/group selector.

[Details](api-reference.md#activation-contracts)

<a id="type-activation-context"></a>
<a id="api-320"></a>

### ActivationContext

Status: delivered

```ts
interface ActivationContext<T extends WorldMember> {
  readonly world: World; readonly self: T;
  readonly caller: WorldMember | undefined;
  die(): never;
}
```

Scoped World/self/caller identities with die terminating the active frame after deletion.

[Details](api-reference.md#activation-contracts)

<a id="type-world"></a>
<a id="api-380"></a>

### World

Status: delivered

```ts
World
```

Owner of step time, shared randomness and component membership. Membership collections are frozen insertion-order snapshots of the original component references, not live views.

[Details](api-reference.md#complete-membership)

<a id="type-activation-options"></a>
<a id="api-381"></a>

### ActivationOptions

Status: delivered

```ts
interface ActivationOptions<T extends WorldMember = WorldMember> {
  order?: "fixed" | "shuffle" | "priority" | "unsupported-interleaved-activation";
  priority?: (member: T) => number;
  caller?: ActivationContext<WorldMember>;
  ids?: ReadonlyMap<WorldMember, number>;
  groups?: ReadonlyMap<WorldMember, string>;
  groupOrder?: readonly string[];
}
```

Named options record of world.activate, report and select. order defaults to "shuffle"; "unsupported-interleaved-activation" always throws.

[Details](api-reference.md#activation-contracts)

<a id="area-agent"></a>

## Agent

Target: `library-core/agent`; the public Agent is composed in `library-core/world-composition`.

<a id="agent-add"></a>
<a id="api-37"></a>

### Agent.create

Status: delivered

```ts
Agent.create(): Agent<{}>
```

Create a detached living XY agent at the origin, with heading 0 and empty custom state. Construction consumes no randomness.

[Details](api-reference.md#agent-add)

<a id="agent-add-2"></a>
<a id="api-38"></a>

### Agent.create

Status: delivered

```ts
Agent.create<S extends object>(state: S, options?: { position?: Position; orientation?: Partial<Orientation> }): Agent<S>
```

Create a living independent XY or XYZ agent with directly typed custom properties. Initial supported state is copied; position and orientation are changed through the spatial operations.

[Details](api-reference.md#agent-add)

<a id="agent-copy"></a>
<a id="api-33"></a>

### agent.copy

Status: delivered

```ts
agent.copy(): Agent<S>
```

Create a detached living agent with an independent copy of custom data, position and orientation. No graph/World membership, path progress or Input bindings are copied.

[Details](api-reference.md#complete-values)

<a id="agent-alive"></a>
<a id="api-34"></a>

### agent.alive

Status: delivered

```ts
agent.alive: boolean // readonly
```

Read whether this agent is living. Deletion is idempotent; a deleted agent retains readable final data.

[Details](api-reference.md#complete-values)

<a id="agent-id"></a>
<a id="api-35"></a>

### agent.id

Status: delivered

```ts
agent.id: string // readonly
```

Read the immutable opaque process-local identity; loading assigns a fresh identity. Persist model-owned keys when a stable external identifier is required.

[Details](api-reference.md#complete-values)

<a id="agent-world"></a>
<a id="api-36"></a>

### agent.world

Status: delivered

```ts
agent.world: World | undefined // readonly
```

Read the owning World, or undefined for a detached agent.

[Details](api-reference.md#complete-values)

<a id="agent-x"></a>
<a id="api-53"></a>

### agent.x

Status: delivered

```ts
agent.x: number
```

Read-only spatial coordinate in world units; changed through move.

[Details](api-reference.md#complete-spatial)

<a id="agent-y"></a>
<a id="api-54"></a>

### agent.y

Status: delivered

```ts
agent.y: number
```

Read-only spatial coordinate in world units; changed through move.

[Details](api-reference.md#complete-spatial)

<a id="agent-z"></a>
<a id="api-55"></a>

### agent.z

Status: delivered

```ts
agent.z: number | undefined
```

Read-only spatial coordinate present for XYZ agents; XY agents have no z coordinate. Changed through move.

[Details](api-reference.md#complete-spatial)

<a id="agent-heading"></a>
<a id="api-56"></a>

### agent.heading

Status: delivered

```ts
agent.heading: number
```

Read-only orientation in degrees; changed through rotate. Heading is clockwise from +Y and canonicalized to [0,360).

[Details](api-reference.md#complete-spatial)

<a id="agent-pitch"></a>
<a id="api-57"></a>

### agent.pitch

Status: delivered

```ts
agent.pitch: number
```

Read-only orientation in degrees; changed through rotate. Pitch and roll apply only to XYZ agents.

[Details](api-reference.md#complete-spatial)

<a id="agent-roll"></a>
<a id="api-58"></a>

### agent.roll

Status: delivered

```ts
agent.roll: number
```

Read-only orientation in degrees; changed through rotate. Pitch and roll apply only to XYZ agents.

[Details](api-reference.md#complete-spatial)

<a id="agent-move"></a>
<a id="api-40"></a>

### agent.move

Status: delivered

```ts
agent.move(distance?: number, options?: { space?: Space }): void
```

Move a signed distance along current orientation; distance defaults to 1. Apply active boundaries and cancel prior path progress.

[Details](api-reference.md#move)

<a id="agent-move-2"></a>
<a id="api-41"></a>

### agent.move

Status: delivered

```ts
agent.move(options: { by: Vector; space?: Space }): void
```

Displace the agent by the supplied coordinate-axis vector while preserving orientation and applying active boundaries.

[Details](api-reference.md#move)

<a id="agent-move-3"></a>
<a id="api-42"></a>

### agent.move

Status: delivered

```ts
agent.move(options: { to: Position; space?: Space }): void
```

Place the agent at compatible target coordinates while preserving orientation; reject out-of-bounds hard placement and cancel prior path progress.

[Details](api-reference.md#move)

<a id="agent-move-4"></a>
<a id="api-43"></a>

### agent.move

Status: target

```ts
agent.move(options: { path: readonly Position[]; distance?: number; space?: Space }): boolean
```

Advance along the supplied nonempty path with per-agent continuation; return true on arrival, including later endpoint calls.

[Details](api-reference.md#move)

<a id="agent-rotate"></a>
<a id="api-44"></a>

### agent.rotate

Status: delivered

```ts
agent.rotate(angle?: number, options?: { axis?: "x" | "y" | "z" }): void
```

Change local orientation by an angle or face compatible target coordinates while preserving position. XY permits only the z axis; XYZ retains full heading, pitch and roll.

[Details](api-reference.md#rotate)

<a id="agent-rotate-2"></a>
<a id="api-45"></a>

### agent.rotate

Status: delivered

```ts
agent.rotate(options: { towards: Position; space?: Space }): void
```

Change local orientation by an angle or face compatible target coordinates while preserving position. XY permits only the z axis; XYZ retains full heading, pitch and roll.

[Details](api-reference.md#rotate)

<a id="agent-distance-to"></a>
<a id="api-46"></a>

### agent.distanceTo

Status: delivered

```ts
agent.distanceTo(target: Position, options?: { space?: Space }): number
```

Measure distance to a compatible position using active space and wrapped shortest displacement; no movement or random draw.

[Details](api-reference.md#perception)

<a id="agent-neighbors"></a>
<a id="api-47"></a>

### agent.neighbors

Status: delivered

```ts
agent.neighbors<T extends Agent>(options: { source: Iterable<T>; radius?: number; angle?: number; space?: Space }): readonly T[]
```

Return original neighboring Agent identities from the supplied source, excluding self; radius defaults to 1 and angle to 360 degrees. Preserve source order; dimensions and active space must match.

[Details](api-reference.md#perception)

<a id="agent-neighbors-2"></a>
<a id="api-48"></a>

### agent.neighbors

Status: delivered

```ts
agent.neighbors(options?: { radius?: number; angle?: number; space?: Space }): readonly Agent[]
```

Return registered neighboring World agents, excluding self; radius defaults to 1 and angle to 360 degrees. A detached agent must supply an explicit source; queries consume no RNG or ticks.

[Details](api-reference.md#perception)

<a id="agent-direction-to"></a>
<a id="api-49"></a>

### agent.directionTo

Status: delivered

```ts
agent.directionTo(target: Position, options?: { space?: Space }):
  { readonly heading: number; readonly pitch?: number } | undefined
```

Return a detached bearing toward compatible target coordinates; coincident coordinates return undefined.

[Details](api-reference.md#complete-spatial)

<a id="agent-can-move"></a>
<a id="api-50"></a>

### agent.canMove

Status: target

```ts
agent.canMove(distance?: number, options?: { space?: Space }): boolean
```

Test legality of the entire proposed step, including tied descendants. Does not move, clip, advance time or consume randomness.

[Details](api-reference.md#agent-field-gradient)

<a id="agent-gradient"></a>
<a id="api-52"></a>

### agent.gradient

Status: target

```ts
agent.gradient<S extends object>(options: {
  grid: Grid<S>; property: keyof NumericFields<S>;
  direction?: "up" | "down"; neighborhood?: "faces" | "moore";
  random?: Random
}): Field<S> | undefined
```

Return a neighboring Field with a strictly better numeric value for property, without moving. Stable order resolves ties unless an explicit Random is supplied.

[Details](api-reference.md#agent-field-gradient)

<a id="agent-delete"></a>
<a id="api-39"></a>

### agent.delete

Status: delivered

```ts
agent.delete(): void
```

Idempotently delete the agent and remove World registration, incident graph memberships and Input bindings. Final model data remains readable; caller-owned references are not removed.

[Details](api-reference.md#agent-delete)

<a id="type-agent"></a>
<a id="api-3"></a>

### Agent

Status: delivered

```ts
Agent<S>
```

Agent identity with directly typed custom properties S and the documented spatial/lifecycle API. Supported custom data includes undefined, null, booleans, finite numbers, strings, bigint, plain records, arrays, Map, Set, valid Date, RegExp, non-shared ArrayBuffer and standard typed-array/DataView views. Construction/copy clone supported containers, preserving cycles and shared backing/reference relationships within each clone; framework references retain identity. Later assignments use ordinary TypeScript reference semantics. Functions, accessors, symbols, custom prototypes, weak collections and active host resources are unsupported. Reserved root names: id, alive, world, x, y, z, heading, pitch, roll, copy, delete, move, rotate, distanceTo, directionTo, neighbors, canMove, gradient. No built-in presentation properties.

[Details](api-reference.md#complete-values)

<a id="type-numeric-fields"></a>
<a id="api-51"></a>

### NumericFields

Status: target

```ts
type NumericFields<S> = Pick<S, {
  [K in keyof S]-?: S[K] extends number ? K : never
}[keyof S]>
```

Retain only the number-valued properties of S as a record type for gradient input; this is a property subset, not a union of keys.

[Details](api-reference.md#agent-field-gradient)

<a id="area-grid-and-field"></a>

<a id="area-grid"></a>

## Grid

Target: `library-core/grid`; grid occupancy moves to `library-core/world-composition`.

<a id="grid-add"></a>
<a id="api-62"></a>

### Grid.create

Status: delivered

```ts
Grid.create<F extends object>(space: Space, options: { state: F; cellSize?: number; boundary?: Space["boundary"] }): Grid<F>
```

Create an independent regular square or cubic Grid with immutable normalized space and independently copied custom field state. Cell dimensions are exact and allocation is bounded; construction uses no randomness.

[Details](api-reference.md#grid-add)

<a id="grid-add-2"></a>
<a id="api-63"></a>

### Grid.create

Status: delivered

```ts
Grid.create(space?: Space, options?: { cellSize?: number; boundary?: Space["boundary"] }): Grid<{}>
```

Create an independent Grid; omitted space defaults to 40×40 XY, cellSize to 1 and boundary to hard. Fields start with independent empty custom state.

[Details](api-reference.md#grid-add)

<a id="grid-space"></a>
<a id="api-59"></a>

### grid.space

Status: delivered

```ts
grid.space: Space & Required<Pick<Space, "dimensions" | "boundary">>
```

Read the immutable normalized grid extents, derived dimension and effective boundary rules.

[Details](api-reference.md#space-type)

<a id="grid-cell-size"></a>
<a id="api-72"></a>

### grid.cellSize

Status: delivered

```ts
grid.cellSize: number
```

Positive finite cell spacing supplied at construction; defaults to 1. Every extent must be an exact integer multiple.

[Details](api-reference.md#complete-grid-contract)

<a id="grid-fields"></a>
<a id="api-73"></a>

### grid.fields

Status: delivered

```ts
grid.fields: readonly Field<F>[]
```

Read-only array snapshot of the original fields in x-fastest order; custom field state remains directly editable.

[Details](api-reference.md#complete-grid-contract)

<a id="grid-field-at"></a>
<a id="api-64"></a>

### grid.fieldAt

Status: delivered

```ts
grid.fieldAt(position: Position): Field<F> | undefined
```

Return the field containing compatible coordinates, or undefined outside hard bounds.

[Details](api-reference.md#grid-query)

<a id="grid-neighbors"></a>
<a id="api-65"></a>

### grid.neighbors

Status: delivered

```ts
grid.neighbors(field: Field<F>, options?: { neighborhood?: "moore" | "faces" }): readonly Field<F>[]
```

Return neighboring fields in lexicographic offset order, then normalize wrapping and deduplicate at first occurrence. This is not the global grid.fields order.

[Details](api-reference.md#grid-query)

<a id="grid-agents-at"></a>
<a id="api-66"></a>

### grid.agentsAt

Status: delivered

```ts
grid.agentsAt<T extends Agent>(field: Field<F>, options: { source: Iterable<T> }): readonly T[]
```

Return original Agent identities currently occupying the field, from an explicit population or attached World membership.

[Details](api-reference.md#grid-query)

<a id="grid-agents-at-2"></a>
<a id="api-67"></a>

### grid.agentsAt

Status: delivered

```ts
grid.agentsAt(field: Field<F>): readonly Agent[]
```

Return original Agent identities currently occupying the field, from an explicit population or attached World membership.

[Details](api-reference.md#grid-query)

<a id="grid-diffuse"></a>
<a id="api-68"></a>

### grid.diffuse

Status: delivered

```ts
grid.diffuse(property: Extract<keyof NumericFields<F>, string>, options?: { rate?: number; neighborhood?: "moore" | "faces" }): void
```

Simultaneously diffuse a numeric field with rate default 0.25 and neighborhood default faces. Preserve total quantity within floating-point tolerance; no evaporation, tick or RNG effect.

[Details](api-reference.md#diffusion)

<a id="grid-add-layout"></a>
<a id="api-382"></a>

### Grid.create

Status: delivered

```ts
Grid.create<F extends object>(options: { layout: Layout; state: F }): LayoutGrid<F>
```

Create a detached LayoutGrid with one Field per layout cell, each starting with an independent copy of state. The square/cubic Grid contract does not apply.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="type-grid"></a>
<a id="api-383"></a>

### Grid

Status: delivered

```ts
Grid<F>
```

Regular centered XY or XYZ cells over a Space; Fields are canonical identities owned by this Grid.

[Details](api-reference.md#complete-grid-contract)

<a id="type-layout-grid"></a>
<a id="api-384"></a>

### LayoutGrid

Status: delivered

```ts
LayoutGrid<F>
```

Immutable layout topology with canonical mutable Fields; no regular diffusion contract.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="layout-grid-layout"></a>
<a id="api-385"></a>

### layoutGrid.layout

Status: delivered

```ts
layoutGrid.layout: Layout // readonly
```

The immutable Layout this grid was created from.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="layout-grid-fields"></a>
<a id="api-386"></a>

### layoutGrid.fields

Status: delivered

```ts
layoutGrid.fields: readonly LayoutField<F>[]
```

Detached array with one Field per layout cell, in cell order.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="layout-grid-field-at"></a>
<a id="api-387"></a>

### layoutGrid.fieldAt

Status: delivered

```ts
layoutGrid.fieldAt(position: Position): LayoutField<F> | undefined
```

Return the Field whose cell contains the XY position, or undefined outside the layout.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="layout-grid-neighbors"></a>
<a id="api-388"></a>

### layoutGrid.neighbors

Status: delivered

```ts
layoutGrid.neighbors(field: LayoutField<F>): readonly LayoutField<F>[]
```

Return the Fields of cells that share a boundary edge, in ascending cell order.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="layout-grid-agents-at"></a>
<a id="api-389"></a>

### layoutGrid.agentsAt

Status: delivered

```ts
layoutGrid.agentsAt<T extends Agent>(field: LayoutField<F>, options: { source: Iterable<T> }): readonly T[]
```

Return living Agents of an explicit source located in the Field, in first-seen order.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="layout-grid-agents-at-2"></a>
<a id="api-390"></a>

### layoutGrid.agentsAt

Status: delivered

```ts
layoutGrid.agentsAt(field: LayoutField<F>): readonly Agent[]
```

Return Agents of the attached World located in the Field, in admission order.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="type-layout-field"></a>
<a id="api-391"></a>

### LayoutField

Status: delivered

```ts
type LayoutField<F extends object = {}> = Field<F, LayoutGrid<F>>;
```

A Field owned by a LayoutGrid.

[Details](../grid-parcels/API.md#agent-loom-connection)

<a id="grid-layer"></a>
<a id="api-392"></a>

### grid.layer

Status: planned

```ts
grid.layer(options?: { initial?: number }): NumericLayer<F>
```

Create one number per field, stored in a typed array in grid.fields order; initial defaults to 0. A layer is separate from field state and consumes no randomness.

[Details](api-reference.md#grid-numeric-layers)

<a id="type-numeric-layer"></a>
<a id="api-393"></a>

### NumericLayer

Status: planned

```ts
interface NumericLayer<F extends object = {}> {
  readonly values: Float64Array; // grid.fields order
  get(field: Field<F>): number;
  set(field: Field<F>, value: number): void;
}
```

values is the live backing array for fast loops. get and set throw TypeError for a field of another grid and RangeError for a nonfinite value.

[Details](api-reference.md#grid-numeric-layers)

<a id="grid-reachable"></a>
<a id="api-394"></a>

### grid.reachable

Status: planned

```ts
grid.reachable(options: {
  from: Field<F>;
  canEnter?: (field: Field<F>) => boolean;
  neighborhood?: "faces" | "moore";
}): readonly Field<F>[]
```

Flood fill: return fields reachable from `from` through neighbors that canEnter accepts (default: all), excluding `from` as graph.reachable does. Breadth-first order, ties in field order; neighborhood defaults to "faces"; no randomness.

[Details](api-reference.md#grid-flood-fill)

<a id="area-field"></a>

## Field

Target: `library-core/grid`.

<a id="field-id"></a>
<a id="api-60"></a>

### field.id

Status: delivered

```ts
field.id: string // readonly
```

Read the immutable opaque identity of the field.

[Details](api-reference.md#field-identity)

<a id="field-grid"></a>
<a id="api-61"></a>

### field.grid

Status: delivered

```ts
field.grid: Grid<F> // readonly
```

Read the owning Grid; field membership is fixed by construction.

[Details](api-reference.md#field-identity)

<a id="field-x"></a>
<a id="api-69"></a>

### field.x

Status: delivered

```ts
field.x: number // readonly
```

Immutable cell-center coordinate derived from the owning Grid and field index.

[Details](api-reference.md#field-position)

<a id="field-y"></a>
<a id="api-70"></a>

### field.y

Status: delivered

```ts
field.y: number // readonly
```

Immutable cell-center coordinate derived from the owning Grid and field index.

[Details](api-reference.md#field-position)

<a id="field-z"></a>
<a id="api-71"></a>

### field.z

Status: delivered

```ts
field.z: number | undefined // readonly
```

Immutable cell-center z coordinate for XYZ grids; absent for XY grids.

[Details](api-reference.md#field-position)

<a id="type-field"></a>
<a id="api-4"></a>

### Field

Status: delivered

```ts
Field<F>
```

Grid-owned field identity with immutable cell coordinates and directly writable typed properties F. Uses the supported-data and copying rules of `Agent<S>`; each field starts with an independent data copy. Reserved root names: id, grid, x, y, z.

[Details](api-reference.md#field-state)~~

<a id="area-graph-and-edge"></a>

<a id="area-graph"></a>

## Graph

Target: `library-core/graph`.

<a id="graph-add"></a>
<a id="api-78"></a>

### Graph.create

Status: delivered

```ts
Graph.create<N extends object = object>(options?: {
  parallel?: boolean; selfLoops?: boolean
}): Graph<N, {}>
```

Create a graph with optional parallel edges, self-loops and independently copied edge defaults. Edge direction and geometry are explicit; creation never adds endpoint nodes implicitly.

[Details](api-reference.md#graph-representations)

<a id="graph-add-2"></a>
<a id="api-79"></a>

### Graph.create

Status: delivered

```ts
Graph.create<N extends object = object, E extends object = {}>(options: {
  edgeState: E; parallel?: boolean; selfLoops?: boolean
}): Graph<N, E>
```

Create a graph with optional parallel edges, self-loops and independently copied edge defaults. Edge direction and geometry are explicit; creation never adds endpoint nodes implicitly.

[Details](api-reference.md#graph-representations)

<a id="graph-generate"></a>
<a id="api-115"></a>

### graph.generate

Status: delivered

```ts
graph.generate(options: GeneratorOptions<N>): readonly Edge<N, E>[]
```

Add a selected standard network structure among existing unique member nodes and return the created edges. Random generators require an explicit Random; inputs and allocation bounds validate before graph mutation.

[Details](api-reference.md#graph-generate)

<a id="graph-parallel"></a>
<a id="api-131"></a>

### graph.parallel

Status: delivered

```ts
graph.parallel: boolean
```

Read-only creation policy; defaults to false. Enables separately keyed parallel edge identities.

[Details](api-reference.md#graph-representations)

<a id="graph-self-loops"></a>
<a id="api-132"></a>

### graph.selfLoops

Status: delivered

```ts
graph.selfLoops: boolean
```

Read-only creation policy; defaults to false. Allows edges whose endpoints are the same node.

[Details](api-reference.md#graph-representations)

<a id="graph-delete"></a>
<a id="api-85"></a>

### graph.delete

Status: delivered

```ts
graph.delete(options?: { edgesOnly?: boolean }): void
```

Delete graph contents while preserving the graph and node objects. edgesOnly retains node membership; World membership is unchanged.

[Details](api-reference.md#graph-collections)

<a id="graph-view"></a>
<a id="api-86"></a>

### graph.view

Status: target

```ts
graph.view(options?: {
  nodes?: (node: N) => boolean;
  edges?: (edge: Edge<N, E>) => boolean;
  direction?: "original" | "reverse" | "undirected"
}): ReadonlyGraph<N, E>
```

Return a live structurally read-only filtered or directional view sharing the source objects.

[Details](api-reference.md#graph-views)

<a id="graph-copy"></a>
<a id="api-87"></a>

### graph.copy

Status: delivered

```ts
graph.copy(options?: {
  nodes?: readonly N[]; edges?: readonly Edge<N, E>[];
  direction?: "original" | "reverse" | "undirected"
}): Graph<N, E>
```

Create independent graph structure and copied edge data while retaining original node identities; copied edges have no active ties.

[Details](api-reference.md#graph-views)

<a id="graph-traverse"></a>
<a id="api-89"></a>

### graph.traverse

Status: target

```ts
graph.traverse(options: {
  from: N; order?: "breadth" | "depth";
  direction?: "out" | "in" | "all"; depth?: number
}): readonly { node: N; parent?: N; edge?: Edge<N, E>; depth: number }[]
```

Traverse each reachable node once in deterministic breadth/depth order, including the starting node at depth 0. Return frozen discovery records with optional parent and edge; no RNG effect.

[Details](api-reference.md#graph-traverse)

<a id="graph-reachable"></a>
<a id="api-90"></a>

### graph.reachable

Status: target

```ts
graph.reachable(options: {
  from: N; direction?: "out" | "in" | "all"; depth?: number
}): readonly N[]
```

Return reachable node identities excluding the source, under explicit direction and optional depth bounds.

[Details](api-reference.md#graph-traverse)

<a id="graph-components"></a>
<a id="api-91"></a>

### graph.components

Status: delivered

```ts
graph.components(options?: {
  mode?: "weak" | "strong" | "biconnected"
}): readonly (readonly N[])[]
```

Return weak, strong or biconnected node components; biconnected analysis requires undirected edges.

[Details](api-reference.md#graph-components)

<a id="graph-connected"></a>
<a id="api-92"></a>

### graph.isConnected

Status: delivered

```ts
graph.isConnected(options?: { mode?: "weak" | "strong" }): boolean
```

Test connectivity in weak or strong mode without mutating the graph.

[Details](api-reference.md#graph-components)

<a id="graph-bridges"></a>
<a id="api-93"></a>

### graph.bridges

Status: target

```ts
graph.bridges(): readonly Edge<N, E>[]
```

Find bridge edges in an undirected graph.

[Details](api-reference.md#graph-components)

<a id="graph-articulations"></a>
<a id="api-94"></a>

### graph.articulations

Status: target

```ts
graph.articulations(): readonly N[]
```

Find articulation node identities in an undirected graph.

[Details](api-reference.md#graph-components)

<a id="graph-find-route"></a>
<a id="api-96"></a>

### graph.findRoute

Status: target

```ts
graph.findRoute(options: {
  from: N; to: N; cost?: (edge: Edge<N, E>) => number;
  algorithm?: "auto" | "breadth" | "dijkstra" | "bellman-ford"
}): Route<N, E> | undefined
```

Return a minimum-cost route, or undefined when the target is unreachable; relevant negative cycles reject.

[Details](api-reference.md#graph-weighted-routing)

<a id="graph-distances"></a>
<a id="api-97"></a>

### graph.distances

Status: delivered

```ts
graph.distances(options: {
  from: N; cost?: (edge: Edge<N, E>) => number;
  algorithm?: "auto" | "breadth" | "dijkstra" | "bellman-ford"
}): ReadonlyMap<N, number>
```

Return shortest costs from one source to reachable nodes; unreachable nodes are omitted and relevant negative cycles reject.

[Details](api-reference.md#graph-weighted-routing)

<a id="graph-all-distances"></a>
<a id="api-98"></a>

### graph.allDistances

Status: delivered

```ts
graph.allDistances(options?: {
  cost?: (edge: Edge<N, E>) => number;
  algorithm?: "auto" | "breadth" | "dijkstra" | "bellman-ford"
}): ReadonlyMap<N, ReadonlyMap<N, number>>
```

Return shortest-cost maps for all node sources; unreachable targets are omitted and relevant negative cycles reject.

[Details](api-reference.md#graph-weighted-routing)

<a id="graph-routes"></a>
<a id="api-99"></a>

### graph.routes

Status: target

```ts
graph.routes(options: {
  from: N; to: N; limit: number; maxEdgeCount?: number;
  cost?: (edge: Edge<N, E>) => number
}): readonly Route<N, E>[]
```

Enumerate a bounded number of vertex-simple routes between endpoints; parallel-edge alternatives remain distinct.

[Details](api-reference.md#graph-path-enumeration)

<a id="graph-distance-summary"></a>
<a id="api-100"></a>

### graph.distanceSummary

Status: delivered

```ts
graph.distanceSummary(options?: {
  cost?: (edge: Edge<N, E>) => number;
  disconnected?: "reachable" | "reject"
}): { mean?: number; diameter?: number; radius?: number;
       eccentricity: ReadonlyMap<N, number>; reachablePairCount: number }
```

Summarize nonnegative shortest-path distances as mean, diameter, radius, eccentricity and reachable-pair count under explicit disconnected handling.

[Details](api-reference.md#graph-path-enumeration)

<a id="graph-analyze"></a>
<a id="api-101"></a>

### graph.analyze

Status: delivered

```ts
graph.analyze(options: {
  measure: "degree" | "closeness" | "betweenness" | "eigenvector" | "page-rank";
  direction?: "out" | "in" | "all"; normalized?: boolean;
  disconnected?: "reachable" | "discount";
  cost?: (edge: Edge<N, E>) => number;
  weight?: (edge: Edge<N, E>) => number;
  damping?: number; tolerance?: number; maxIterationCount?: number
}): ReadonlyMap<N, number>
```

Compute the selected degree, closeness, betweenness, eigenvector or PageRank node scores. Costs, weights, direction, normalization and convergence limits follow the selected measure.

[Details](api-reference.md#graph-centrality-extended)

<a id="graph-triangles"></a>
<a id="api-102"></a>

### graph.triangles

Status: target

```ts
graph.triangles(): readonly (readonly [N, N, N])[]
```

Return each triangle once on a simple undirected loop-free graph.

[Details](api-reference.md#graph-clustering)

<a id="graph-clustering"></a>
<a id="api-103"></a>

### graph.clustering

Status: target

```ts
graph.clustering(options?: {
  weight?: (edge: Edge<N, E>) => number
}): { local: ReadonlyMap<N, number>; mean: number; transitivity: number }
```

Return local and mean clustering plus transitivity for a simple undirected loop-free graph; optional weights affect clustering contributions.

[Details](api-reference.md#graph-clustering)

<a id="graph-communities"></a>
<a id="api-104"></a>

### graph.communities

Status: target

```ts
graph.communities(options?: {
  method?: "greedy" | "louvain" | "label-propagation";
  weight?: (edge: Edge<N, E>) => number;
  resolution?: number; random?: Random;
  maxIterationCount?: number; tolerance?: number
}): readonly (readonly N[])[]
```

Return an undirected community partition; Louvain and label propagation require an explicit Random.

[Details](api-reference.md#graph-communities)

<a id="graph-modularity"></a>
<a id="api-105"></a>

### graph.modularity

Status: target

```ts
graph.modularity(partition: readonly (readonly N[])[], options?: {
  weight?: (edge: Edge<N, E>) => number; resolution?: number
}): number
```

Evaluate a complete node partition using explicit resolution and optional nonnegative weights.

[Details](api-reference.md#graph-communities)

<a id="graph-cliques"></a>
<a id="api-106"></a>

### graph.cliques

Status: target

```ts
graph.cliques(options: { limit: number; minSize?: number }): readonly (readonly N[])[]
```

Return maximal cliques within the result limit. Default minSize: 1. Requires simple undirected loop-free input; limit overflow rejects instead of truncating.

[Details](api-reference.md#graph-cliques)

<a id="graph-bipartition"></a>
<a id="api-107"></a>

### graph.bipartition

Status: target

```ts
graph.bipartition(): { left: readonly N[]; right: readonly N[] } | undefined
```

Return left/right node partitions, or undefined when the graph is not bipartite.

[Details](api-reference.md#graph-cliques)

<a id="graph-matching"></a>
<a id="api-108"></a>

### graph.matching

Status: target

```ts
graph.matching(options?: {
  left?: readonly N[]
}): readonly Edge<N, E>[]
```

Return maximum-cardinality bipartite matching edges; deterministic tie order follows the contract.

[Details](api-reference.md#graph-cliques)

<a id="graph-find-cycle"></a>
<a id="api-109"></a>

### graph.findCycle

Status: target

```ts
graph.findCycle(options?: {
  direction?: "original" | "undirected"
}): readonly Edge<N, E>[] | undefined
```

Return a deterministic cycle as original edge identities, or undefined when none exists; validate the selected direction/projection.

[Details](api-reference.md#graph-cycles-dag)

<a id="graph-topological"></a>
<a id="api-110"></a>

### graph.topological

Status: target

```ts
graph.topological(): readonly N[]
```

Return a stable topological node ordering; cyclic or unsupported input rejects.

[Details](api-reference.md#graph-cycles-dag)

<a id="graph-transitive"></a>
<a id="api-111"></a>

### graph.transitive

Status: target

```ts
graph.transitive(options: {
  operation: "closure" | "reduction"
}): Graph<N, E>
```

Create a transitive closure or reduction for a supported directed acyclic graph, preserving node identities.

[Details](api-reference.md#graph-cycles-dag)

<a id="graph-is-tree"></a>
<a id="api-112"></a>

### graph.isTree

Status: target

```ts
graph.isTree(options?: { forest?: boolean }): boolean
```

Test whether an undirected graph is a tree, or a forest when requested.

[Details](api-reference.md#graph-trees)

<a id="graph-spanning-tree"></a>
<a id="api-113"></a>

### graph.spanningTree

Status: target

```ts
graph.spanningTree(options?: {
  cost?: (edge: Edge<N, E>) => number;
  disconnected?: "forest" | "reject"
}): readonly Edge<N, E>[]
```

Return minimum spanning edges in stable Kruskal order; signed finite costs are allowed and disconnected handling is explicit.

[Details](api-reference.md#graph-trees)

<a id="graph-flow"></a>
<a id="api-114"></a>

### graph.flow

Status: target

```ts
graph.flow(options: {
  from: N; to: N; capacity: (edge: Edge<N, E>) => number;
  tolerance?: number; maxAugmentationCount?: number
}): { value: number; flowByEdge: ReadonlyMap<Edge<N, E>, number>;
       sourceSide: readonly N[]; sinkSide: readonly N[] }
```

Return total value, flowByEdge and the residual source/sink cut partitions without changing the graph. Requires distinct nodes and finite nonnegative capacities; tolerance and augmentation limits are explicit.

[Details](api-reference.md#graph-flow)

<a id="graph-to-data"></a>
<a id="api-117"></a>

### graph.toData

Status: target

```ts
graph.toData(options?: { nodeId?: (node: N) => string }): GraphData<N, E>
```

Return detached portable node/edge data, graph policies and edge defaults, using explicit or insertion-order IDs.

[Details](api-reference.md#graph-convert)

<a id="graph-from-data"></a>
<a id="api-118"></a>

### Graph.fromData

Status: target

```ts
Graph.fromData(data: unknown): Graph<Record<string, unknown>, Record<string, unknown>>
```

Validate detached graph data and create a graph with plain record state whose field values remain unknown.

[Details](api-reference.md#graph-convert)

<a id="graph-from-data-2"></a>
<a id="api-119"></a>

### Graph.fromData

Status: target

```ts
Graph.fromData<N extends object, E extends object>(data: unknown, options: {
  node: (state: unknown, id: string) => N;
  edgeState: (state: unknown) => E
}): Graph<N, E>
```

Validate detached graph data through the supplied node and edge-state callbacks before publishing a reconstructed graph.

[Details](api-reference.md#graph-convert)

<a id="graph-matrix"></a>
<a id="api-121"></a>

### graph.matrix

Status: target

```ts
graph.matrix(options?: {
  weight?: (edge: Edge<N, E>) => number
}): { nodes: readonly N[]; values: readonly (readonly number[])[] }
```

Return a dense weighted adjacency matrix and node ordering; parallel arc weights aggregate and zero entries cannot distinguish absent from zero-total edges.

[Details](api-reference.md#graph-convert)

<a id="graph-from-matrix"></a>
<a id="api-122"></a>

### Graph.fromMatrix

Status: target

```ts
Graph.fromMatrix<N extends object>(data: {
  nodes: readonly N[]; values: readonly (readonly number[])[]
}, options?: { directed?: boolean }): Graph<N, { weight: number }>
```

Validate a square matrix and create weighted edges for nonzero entries; undirected input must be exactly symmetric.

[Details](api-reference.md#graph-convert)

<a id="graph-layout"></a>
<a id="api-123"></a>

### graph.layout

Status: target

```ts
graph.layout(options: LayoutOptions<N>): ReadonlyMap<N, Position>
```

Compute detached planar positions using circle, radial, spring or Tutte placement. Reject any coordinate input with z, including z: 0; returned positions omit z. No model state, World space or RNG stream is changed.

[Details](api-reference.md#graph-layout)

<a id="type-readonly-graph"></a>
<a id="api-88"></a>

### ReadonlyGraph

Status: target

```ts
type ReadonlyGraph<N extends object, E extends object> = Pick<Graph<N, E>,
  "hasNode" | "hasEdge" | "neighbors" | "traverse" | "reachable" |
  "components" | "connected" | "bridges" | "articulations" |
  "findRoute" | "distances" | "allDistances" | "routes" | "distanceSummary" |
  "analyze" | "triangles" | "clustering" | "communities" | "modularity" |
  "cliques" | "bipartition" | "matching" | "findCycle" | "topological" |
  "transitive" | "isTree" | "spanningTree" | "flow" | "layout" |
  "matrix" | "toData" | "copy" | "view"> & {
  readonly parallel: boolean; readonly selfLoops: boolean;
  readonly nodes: Pick<Graph<N, E>["nodes"], "size" | typeof Symbol.iterator>;
  readonly edges: Pick<Graph<N, E>["edges"], "size" | "has" | "between" | typeof Symbol.iterator>;
}
```

Structurally read-only graph view exposing shared original identities and the listed query operations; membership mutators are absent.

[Details](api-reference.md#graph-views)

<a id="type-route"></a>
<a id="api-95"></a>

### Route

Status: target

```ts
type Route<N extends object,E extends object> = {
  readonly nodes: readonly N[];
  readonly edges: readonly Edge<N,E>[];
  readonly cost: number;
  readonly path?: readonly Position[];
};
```

Frozen route result with original node/edge identities, captured cost and optional detached path geometry.

[Details](api-reference.md#route-data-contract)

<a id="type-generator-options"></a>
<a id="api-116"></a>

### GeneratorOptions

Status: delivered

```ts
type GeneratorOptions<N> =
  | { kind: "path" | "cycle" | "star" | "wheel" | "complete";
      nodes: readonly N[]; directed?: boolean }
  | { kind: "tree"; nodes: readonly N[]; branching?: number; directed?: boolean }
  | { kind: "lattice"; nodes: readonly N[]; shape: readonly number[];
      wrap?: boolean; directed?: boolean }
  | { kind: "random"; nodes: readonly N[]; probability: number;
      directed?: boolean; random: Random }
  | { kind: "small-world"; nodes: readonly N[]; neighborCount: number;
      probability: number; random: Random }
  | { kind: "preferential"; nodes: readonly N[]; edgesPerNode: number;
      random: Random }
  | { kind: "geometric"; nodes: readonly N[];
      position: (node: N) => Position; radius: number; space?: Space }
```

Discriminated options for the supported deterministic and random network generators; every variant uses existing member nodes.

[Details](api-reference.md#graph-generate)

<a id="type-graph-data"></a>
<a id="api-120"></a>

### GraphData

Status: target

```ts
type GraphData<NodeState, EdgeState> = {
  schema: "agent-loom.graph"; version: 1;
  parallel: boolean; selfLoops: boolean; edgeDefaults: EdgeState;
  nodes: readonly { id: string; state: NodeState }[];
  edges: readonly { from: string; to: string; directed: boolean;
    key?: string; state: EdgeState; path?: readonly Position[] }[];
}
```

Versioned detached graph structure with node state, edge state, representation policies, default edge state and optional path geometry.

[Details](api-reference.md#graph-convert)

<a id="type-layout-options"></a>
<a id="api-124"></a>

### LayoutOptions

Status: target

```ts
type LayoutOptions<N> =
  | { kind: "circle"; radius?: number; center?: Position }
  | { kind: "radial"; root: N; spacing?: number; center?: Position }
  | { kind: "spring"; initial: ReadonlyMap<N, Position>;
      iterationCount?: number; length?: number; step?: number }
  | { kind: "tutte"; boundary: readonly N[];
      positions: readonly Position[] }
```

Discriminated options for pure circle, radial, spring or Tutte coordinate placement. Coordinate inputs are XY Position values without z; results omit z.

[Details](api-reference.md#graph-layout)

<a id="type-graph"></a>
<a id="api-395"></a>

### Graph

Status: delivered

```ts
Graph<N, E>
```

Topology and lifecycle owner for canonical object nodes and Edges. Collections iterate in insertion order; structural changes during an active iteration or query callback throw. Query results are detached.

[Details](api-reference.md#graph-representations)

<a id="graph-find-route-options"></a>
<a id="api-396"></a>

### graph.findRoute

Status: planned

```ts
graph.findRoute(options: {
  from: N; to: N;
  cost?: (edge: Edge<N, E>) => number;
  canUse?: (edge: Edge<N, E>) => boolean;
  heuristic?: (node: N) => number;
  algorithm?: "auto" | "breadth" | "dijkstra" | "bellman-ford"
}): Route<N, E> | undefined
```

Planned canUse and heuristic options for the target graph.findRoute (api-96), not a second route API. canUse skips edges (default: every edge is usable); an admissible heuristic gives goal-directed search with the Dijkstra result. Unreachable targets return undefined; no randomness.

[Details](api-reference.md#graph-route-search-options)

<a id="area-node"></a>

## Node

Target: `library-core/graph`.

<a id="graph-nodes-add"></a>
<a id="api-127"></a>

### graph.nodes.add

Status: delivered

```ts
graph.nodes.add(node: N): N
```

Add an existing node identity to this graph; graph attachment does not attach its Agent nodes to the World.

[Details](api-reference.md#graph-add)

<a id="graph-nodes-size"></a>
<a id="api-81"></a>

### graph.nodes.size

Status: delivered

```ts
graph.nodes.size: number
```

Read the current number of graph node identities.

[Details](api-reference.md#node-collection)

<a id="graph-nodes-symbol-iterator"></a>
<a id="api-129"></a>

### graph.nodes[Symbol.iterator]

Status: delivered

```ts
graph.nodes[Symbol.iterator](): Iterator<N>
```

Iterate current nodes in stable insertion order. Mutation during a collection iteration throws; a native array snapshot may be taken first.

[Details](api-reference.md#node-collection)

<a id="graph-has-node"></a>
<a id="api-75"></a>

### graph.hasNode

Status: delivered

```ts
graph.hasNode(node: N): boolean
```

Check whether the supplied object identity belongs to the graph.

[Details](api-reference.md#graph-query)

<a id="graph-neighbors"></a>
<a id="api-77"></a>

### graph.neighbors

Status: delivered

```ts
graph.neighbors(node: N, options?: { direction?: "out" | "in" | "all" }): readonly N[]
```

Return unique adjacent node identities in stable node order; direction defaults to out.

[Details](api-reference.md#graph-query)

<a id="graph-nodes-delete"></a>
<a id="api-128"></a>

### graph.nodes.delete

Status: delivered

```ts
graph.nodes.delete(node: N): void
```

Remove membership and incident edges in this graph only; absent membership deletion is a no-op.

[Details](api-reference.md#graph-add)

<a id="area-edge"></a>

## Edge

Target: `library-core/graph`; Agent ties need `library-core/world-composition`.

<a id="graph-edges-add"></a>
<a id="api-80"></a>

### graph.edges.add

Status: delivered

```ts
graph.edges.add(options: {
  from: N; to: N; directed?: boolean; key?: string; state?: E;
  path?: readonly Position[]
}): Edge<N, E>
```

Create or reuse an edge between existing graph nodes; directed defaults to false. A simple duplicate returns the existing edge without replacing its state or path.

[Details](api-reference.md#edge-add)

<a id="edge-id"></a>
<a id="api-edge-id"></a>

### edge.id

Status: delivered

```ts
edge.id: string // readonly
```

Read the immutable opaque process-local edge identity; loading assigns a fresh identity.

[Details](api-reference.md#edge-identity)

<a id="edge-graph"></a>
<a id="api-edge-graph"></a>

### edge.graph

Status: delivered

```ts
edge.graph: Graph<N, E> // readonly
```

Read the immutable owning Graph reference, including after edge deletion.

[Details](api-reference.md#edge-identity)

<a id="edge-alive"></a>
<a id="api-edge-alive"></a>

### edge.alive

Status: delivered

```ts
edge.alive: boolean // readonly
```

Read edge lifecycle state; starts true and becomes false on direct, graph or endpoint-membership deletion. Deleted edges retain readable final data; repeated delete is a no-op.

[Details](api-reference.md#edge-identity)

<a id="edge-from"></a>
<a id="api-133"></a>

### edge.from

Status: delivered

```ts
edge.from: N
```

Read the stored endpoint identity. For tied Agent edges, from is the parent and to is the child independently of traversal direction.

[Details](api-reference.md#edge-properties)

<a id="edge-to"></a>
<a id="api-134"></a>

### edge.to

Status: delivered

```ts
edge.to: N
```

Read the stored endpoint identity. For tied Agent edges, from is the parent and to is the child independently of traversal direction.

[Details](api-reference.md#edge-properties)

<a id="edge-directed"></a>
<a id="api-135"></a>

### edge.directed

Status: delivered

```ts
edge.directed: boolean
```

Read the stored per-edge traversal direction flag; defaults to false. Graph has no graph-wide directed setting.

[Details](api-reference.md#edge-properties)

<a id="edge-key"></a>
<a id="api-136"></a>

### edge.key

Status: delivered

```ts
edge.key: string | undefined
```

Immutable graph-scoped key for a parallel edge; simple edges have no key. Deletion does not rewind key allocation.

[Details](api-reference.md#edge-properties)

<a id="edge-path"></a>
<a id="api-137"></a>

### edge.path

Status: delivered

```ts
edge.path: readonly Position[] | undefined
```

Read the optional stored path geometry. Its coordinate dimension must match its positioned endpoints; model cost remains separate from spatial distance.

[Details](api-reference.md#edge-properties)

<a id="edge-tie-mode"></a>
<a id="api-126"></a>

### edge.tieMode

Status: target

```ts
edge.tieMode: "none" | "free" | "fixed"
```

Read the current motion-coupling mode; new edges default to none. Configure it with edge.tie, whose omitted mode defaults to fixed.

[Details](api-reference.md#edge-ties)

<a id="graph-edges-size"></a>
<a id="api-82"></a>

### graph.edges.size

Status: delivered

```ts
graph.edges.size: number
```

Read the current number of graph edge identities.

[Details](api-reference.md#edge-queries)

<a id="graph-edges-has"></a>
<a id="api-83"></a>

### graph.edges.has

Status: delivered

```ts
graph.edges.has(edge: Edge<N, E>): boolean
```

Check current membership of this exact edge identity.

[Details](api-reference.md#edge-queries)

<a id="graph-edges-between"></a>
<a id="api-84"></a>

### graph.edges.between

Status: delivered

```ts
graph.edges.between(from: N, to: N, options?: {
  direction?: "out" | "in" | "all"
}): readonly Edge<N, E>[]
```

Read matching edge identities between endpoints under the requested direction.

[Details](api-reference.md#edge-queries)

<a id="graph-has-edge"></a>
<a id="api-76"></a>

### graph.hasEdge

Status: delivered

```ts
graph.hasEdge(from: N, to: N): boolean
```

Check whether a connection exists under the graph’s endpoint/direction rules.

[Details](api-reference.md#edge-queries)

<a id="graph-edges-symbol-iterator"></a>
<a id="api-130"></a>

### graph.edges[Symbol.iterator]

Status: delivered

```ts
graph.edges[Symbol.iterator](): Iterator<Edge<N, E>>
```

Iterate current edges in stable insertion order. Mutation during a collection iteration throws; a new iteration observes new membership.

[Details](api-reference.md#edge-queries)

<a id="edge-tie"></a>
<a id="api-125"></a>

### edge.tie

Status: target

```ts
edge.tie(mode?: "none" | "free" | "fixed"): void
```

Configure parent-to-child Agent motion through this edge; tie() defaults to fixed, while newly created edges start at none. Active ties must form a compatible forest; movement propagates atomically.

[Details](api-reference.md#edge-ties)

<a id="edge-delete"></a>
<a id="api-74"></a>

### edge.delete

Status: delivered

```ts
edge.delete(): void
```

Idempotently delete this edge and its tie relation while preserving endpoint objects.

[Details](api-reference.md#edge-add)

<a id="type-edge"></a>
<a id="api-5"></a>

### Edge

Status: delivered

```ts
Edge<N, E>
```

Graph-owned connection between node identities N with directly writable typed properties E. Uses the supported-data and copying rules of `Agent<S>`; direction, key and optional geometry follow graph creation policy. Reserved root names: id, graph, alive, from, to, directed, key, path, delete, tie, tieMode.

[Details](api-reference.md#edge-add)~~

<a id="area-random"></a>

## Random

Target: `library-core/random`.

<a id="random-add"></a>
<a id="api-138"></a>

### Random.create

Status: delivered

```ts
Random.create(options?: { seed?: number | "random"; algorithm?: "mulberry32" | "mt-word-stream/1" }): Random
```

Create an independent Random; seed defaults to 1 and algorithm to mulberry32. Seed random obtains host entropy without drawing from a model stream; mt-word-stream/1 explicitly selects the pinned MT profile.

[Details](api-reference.md#random-add)

<a id="random-algorithm"></a>
<a id="api-155"></a>

### random.algorithm

Status: delivered

```ts
random.algorithm: "mulberry32" | "mt-word-stream/1"
```

Read-only selected stream profile. The target MT profile pins the documented compatibility algorithm and distribution semantics.

[Details](api-reference.md#complete-random-general)

<a id="random-seed"></a>
<a id="api-156"></a>

### random.seed

Status: delivered

```ts
random.seed: number
```

Read the actual numeric initial/reseed metadata, including the seed selected by the host entropy option. Restored Random state restores seed metadata.

[Details](api-reference.md#complete-random-general)

<a id="random-number"></a>
<a id="api-141"></a>

### random.number

Status: delivered

```ts
random.number(): number
```

Draw a uniform real value in [0,1) from the selected stream.

[Details](api-reference.md#complete-distributions)

<a id="random-number-2"></a>
<a id="api-142"></a>

### random.number

Status: delivered

```ts
random.number(options: { distribution?: "uniform", min?: number, max?: number, integer?: boolean }): number
```

Draw a uniform real or integer value; defaults are min 0, max 1 and integer false. Max is exclusive; validate finite bounds and the selected profile’s integer/domain rules.

[Details](api-reference.md#complete-distributions)

<a id="random-number-3"></a>
<a id="api-143"></a>

### random.number

Status: delivered

```ts
random.number(options: { distribution: "normal", mean?: number, deviation?: number }): number
```

Draw a normal value with mean default 0 and deviation default 1. Gaussian-cache and zero-deviation draw behavior depend on the selected stream profile.

[Details](api-reference.md#complete-distributions)

<a id="random-number-4"></a>
<a id="api-144"></a>

### random.number

Status: delivered

```ts
random.number(options: { distribution: "exponential" | "poisson", mean?: number }): number
```

Draw an exponential or Poisson value with mean default 1. Accepted signed means and zero-mean draw behavior depend on the selected stream profile.

[Details](api-reference.md#complete-distributions)

<a id="random-number-5"></a>
<a id="api-145"></a>

### random.number

Status: delivered

```ts
random.number(options: { distribution: "gamma", shape: number, rate: number }): number
```

Draw a gamma value using positive finite shape and rate; mean equals shape/rate.

[Details](api-reference.md#complete-distributions)

<a id="random-number-additive-distributions"></a>
<a id="api-random-number-additive"></a>

### Additive random.number variants

Status: delivered

```ts
random.number(options: { distribution: "bernoulli", probability: number }): number
random.number(options: { distribution: "triangular", min: number, mode: number, max: number }): number
```

Bernoulli returns numeric 0 or 1 for finite probability in [0,1]. Triangular requires finite min ≤ mode ≤ max and finite range width. Each nonconstant draw consumes one standard-stream uniform; Bernoulli probabilities 0/1 and constant triangular consume none. Invalid options reject before drawing. These delivered additions supplement the original numbered inventory and do not imply another stream-compatibility profile.

[Details](api-reference.md#complete-distributions)

<a id="random-number-6"></a>
<a id="api-146"></a>

### random.number

Status: target

```ts
random.number(options: { distribution?: "uniform", bound: number, integer?: boolean }): number
```

Pinned-MT uniform draw using a finite signed bound; unsupported by Mulberry. Float and integer modes retain their documented signed-bound and zero-bound schedules.

[Details](api-reference.md#complete-distributions)

<a id="random-sample"></a>
<a id="api-147"></a>

### random.sample

Status: delivered

```ts
random.sample<T>(source: Iterable<T>, options?: {
  sampleCount?: number; replace?: boolean; weight?: (value: T) => number;
  order?: "draw" | "source"; algorithm?: "fisher-yates-descending";
}): T[]
```

Perform weighted selection in draw/source order or an explicitly requested versioned full-shuffle schedule. Actual selections consume the configured stream and retain original source values.

[Details](api-reference.md#complete-sampling)

<a id="random-state"></a>
<a id="api-140"></a>

### random.state

Status: delivered

```ts
random.state: RandomState // read/write validated continuation
```

Read a detached deeply frozen continuation, or assign a validated matching continuation to the same Random object. No random draw occurs.

[Details](api-reference.md#random-continuation)

<a id="random-reseed"></a>
<a id="api-148"></a>

### random.reseed

Status: delivered

```ts
random.reseed(seed: number): void
```

Replace the stream continuation and discard its Gaussian cache using the supplied seed; this is distinct from copying/restoring continuation.

[Details](api-reference.md#complete-random-general)

<a id="random-copy"></a>
<a id="api-149"></a>

### random.copy

Status: delivered

```ts
random.copy(): Random
```

Create an independent exact continuation including any cached Gaussian; consumes no random draw.

[Details](api-reference.md#complete-random-general)

<a id="random-local"></a>
<a id="api-150"></a>

### random.local

Status: delivered

```ts
random.local<R>(action: () => R): R
```

Run synchronous work with temporary randomness and restore the prior stream in finally. Ordinary model mutations are retained.

[Details](api-reference.md#complete-random-general)

<a id="random-raw"></a>
<a id="api-151"></a>

### random.raw

Status: target

```ts
random.raw(options: { kind: "int32" }): number
```

Draw a signed 32-bit integer from one raw MT word. Requires the mt-word-stream/1 profile.

[Details](api-reference.md#complete-random-general)

<a id="random-raw-2"></a>
<a id="api-152"></a>

### random.raw

Status: target

```ts
random.raw(options: { kind: "int31", bound: number }): number
```

Draw an integer in [0,bound) using the pinned bounded-int rejection schedule; bound is a positive integer at most 2³¹−1. Requires the mt-word-stream/1 profile.

[Details](api-reference.md#complete-random-general)

<a id="random-raw-3"></a>
<a id="api-153"></a>

### random.raw

Status: target

```ts
random.raw(options: { kind: "int64", bound?: bigint }): bigint
```

Draw a signed 64-bit bigint from two MT words, or a bigint in [0,bound) when a bound in [1,2⁶³−1] is supplied. Requires the mt-word-stream/1 profile.

[Details](api-reference.md#complete-random-general)

<a id="random-raw-4"></a>
<a id="api-154"></a>

### random.raw

Status: delivered

```ts
random.raw(options: { kind: "double" | "gaussian" }): number
```

Draw a double in [0,1) from the selected profile, or a cached/polar Gaussian from the mt-word-stream/1 profile. These operations advance only the Random stream.

[Details](api-reference.md#complete-random-general)

<a id="type-random-state"></a>
<a id="api-139"></a>

### RandomState

Status: delivered

```ts
type RandomState = {
  readonly algorithm: "mulberry32" | "mt-word-stream/1";
  readonly seed: number;
  readonly continuation:
    | { readonly algorithm: "mulberry32"; readonly revision: "agent-loom-random/1";
        readonly word: number; readonly gaussian: number | null }
    | { readonly algorithm: "mt-word-stream/1"; readonly revision: 2;
        readonly words: readonly number[]; readonly index: number; readonly gaussian: number | null };
};
```

Versioned RNG continuation containing algorithm, seed, internal words and Gaussian cache; assignments validate the selected immutable profile.

[Details](api-reference.md#random-continuation)

<a id="type-random"></a>
<a id="api-397"></a>

### Random

Status: delivered

```ts
Random
```

A seeded stream; the same seed and operation order reproduce the same draws. Delivered streams use mulberry32.

[Details](api-reference.md#complete-random-general)

<a id="area-input"></a>

## Input

Target: open; the accepted tree has no Input module (see [open decisions](#open-decisions)).

<a id="input-add"></a>
<a id="api-157"></a>

### Input.add

Status: target

```ts
Input.create(): Input
```

Create an independent Input with no property bindings.

[Details](api-reference.md#input-add)

<a id="input-bindings"></a>
<a id="api-161"></a>

### input.bindings

Status: target

```ts
input.bindings: readonly { object: object; property: string; type: "number" | "string" | "boolean"; min?: number; max?: number; step?: number }[]
```

Read-only insertion-order array of frozen binding descriptors retaining original object/property references; external edits use input.set.

[Details](api-reference.md#complete-input)

<a id="input-add-2"></a>
<a id="api-158"></a>

### input.add

Status: target

```ts
input.add(object: object, property: string, constraints?: { min?: number; max?: number; step?: number }): void
```

Expose an existing finite number, string or boolean property with optional numeric constraints; preserve its current value.

[Details](api-reference.md#input-add)

<a id="input-set"></a>
<a id="api-159"></a>

### input.set

Status: target

```ts
input.set(object: object, property: string, value: number | string | boolean): void
```

Validate the bound type, range and step before assigning once. Invalid values preserve the old property value.

[Details](api-reference.md#input-add)

<a id="input-delete"></a>
<a id="api-160"></a>

### input.delete

Status: target

```ts
input.delete(object: object, property: string): void
```

Remove a property binding without changing its model value; absent bindings are a no-op.

[Details](api-reference.md#input-add)

<a id="area-stats"></a>

## stats

Target: `library-core/stats`.

<a id="stats-describe"></a>
<a id="api-162"></a>

### stats.describe

Status: delivered

```ts
stats.describe(values: Iterable<number>, options?: { sample?: boolean }): Summary
```

Return count, sum, extrema, mean, median, variance and standard deviation without changing input. Empty valueCount/sum are zero; unavailable statistics are undefined.

[Details](api-reference.md#describe)

<a id="stats-histogram"></a>
<a id="api-163"></a>

### stats.histogram

Status: delivered

```ts
stats.histogram(values: Iterable<number>, options: { edges: readonly number[] }): Histogram
```

Count finite values against explicit increasing bin edges and report underflow/overflow. Bin selection is never inferred and the source remains unchanged.

[Details](api-reference.md#histogram)

<a id="stats-gini"></a>
<a id="api-164"></a>

### stats.gini

Status: delivered

```ts
stats.gini(values: Iterable<number>): number
```

Return finite-population inequality for nonnegative holdings. Empty or all-zero input returns 0; caller data is unchanged.

[Details](api-reference.md#special-stats)

<a id="stats-alignment"></a>
<a id="api-165"></a>

### stats.alignment

Status: target

```ts
stats.alignment(headings: Iterable<number>): number
```

Return the magnitude of the mean heading unit vector in [0,1]. Empty input returns 0.

[Details](api-reference.md#special-stats)

<a id="type-summary"></a>
<a id="api-166"></a>

### Summary

Status: delivered

```ts
type Summary = { readonly valueCount:number; readonly sum:number;
  readonly min:number|undefined; readonly max:number|undefined;
  readonly mean:number|undefined; readonly median:number|undefined;
  readonly variance:number|undefined; readonly standardDeviation:number|undefined };
```

Detached numeric summary; empty input has valueCount/sum zero and unavailable extrema, averages and spread values undefined.

[Details](api-reference.md#complete-statistics)

<a id="type-histogram"></a>
<a id="api-167"></a>

### Histogram

Status: delivered

```ts
type Histogram = { readonly edges:readonly number[]; readonly counts:readonly number[];
  readonly underflowValueCount:number; readonly overflowValueCount:number };
```

Detached bin edges and counts with explicit underflow and overflow totals.

[Details](api-reference.md#complete-statistics)

<a id="time-weighted-add"></a>
<a id="api-398"></a>

### TimeWeighted.create

Status: delivered

```ts
TimeWeighted.create(options: { at?: number; value: number }): TimeWeighted
```

Start a time-weighted level at `at` (default 0) holding value. Times are finite and nonnegative.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="time-weighted-set"></a>
<a id="api-399"></a>

### timeWeighted.set

Status: delivered

```ts
timeWeighted.set(sample: { at: number; value: number }): void
```

Close the current interval at a nondecreasing `at` and hold value from then on.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="time-weighted-read"></a>
<a id="api-400"></a>

### timeWeighted.read

Status: delivered

```ts
timeWeighted.read(options: { until: number }): TimeWeightedSummary
```

Return duration, integral and mean from the start time until `until` without changing state; mean is undefined for zero duration.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="type-time-weighted"></a>
<a id="api-401"></a>

### TimeWeighted

Status: delivered

```ts
TimeWeighted
```

Integrates a right-continuous piecewise-constant value over nondecreasing explicit time.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="type-time-weighted-summary"></a>
<a id="api-402"></a>

### TimeWeightedSummary

Status: delivered

```ts
interface TimeWeightedSummary {
  readonly duration: number;
  readonly integral: number;
  readonly mean: number | undefined;
}
```

Duration, integral and mean of a TimeWeighted read; mean is undefined for zero duration.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="area-geometry"></a>

## geometry

Target: `library-core/geometry`; planar polygon operations and types move to `library-core/polygon-layout`.

<a id="geometry-contains"></a>
<a id="api-177"></a>

### geometry.contains

Status: delivered

```ts
geometry.contains(polygon:PlanarPolygon,point:{x:number;y:number},options?:{boundary?:"include"|"exclude"}):boolean
```

Test whether a planar polygon contains a point, honoring holes and the explicit include/exclude boundary rule.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-normalize"></a>
<a id="api-178"></a>

### geometry.normalize

Status: delivered

```ts
geometry.normalize(point:Position, options:{space:Space; endpoints?:"closed"|"half-open"}):Position | undefined
```

Return detached coordinates normalized to the supplied spatial boundaries, or undefined outside a hard boundary.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-displacement"></a>
<a id="api-179"></a>

### geometry.displacement

Status: target

```ts
geometry.displacement(from:Position,to:Position,options:{space:Space;wrap?:boolean}):Position
```

Return the coordinate displacement between compatible positions; wrapping uses the configured shortest per-axis displacement by default.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-distance"></a>
<a id="api-180"></a>

### geometry.distance

Status: delivered

```ts
geometry.distance(from:Position,to:Position,options:{space:Space;wrap?:boolean}):number
```

Return Euclidean distance using the selected spatial displacement and optional wrapping.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-bearing"></a>
<a id="api-181"></a>

### geometry.bearing

Status: target

```ts
geometry.bearing(from:Position,to:Position,options:{space:Space;wrap?:boolean}):
  {readonly heading?:number;readonly pitch?:number} | undefined
```

Return planar heading or XYZ heading/pitch toward a compatible position; coincident positions return undefined.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-neighbors"></a>
<a id="api-182"></a>

### geometry.neighbors

Status: target

```ts
geometry.neighbors(cell:Position,options:{space:Space;cellSize?:number;neighborhood?:"moore"|"faces"}):readonly Position[]
```

Return detached adjacent cell-center positions using Moore or face adjacency and explicit space/cell size.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-direction"></a>
<a id="api-183"></a>

### geometry.direction

Status: delivered

```ts
geometry.direction(orientation:Orientation):Position
```

Convert orientation angles to a detached unit forward vector without creating or moving an Agent.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-rotate"></a>
<a id="api-184"></a>

### geometry.rotate

Status: target

```ts
geometry.rotate(orientation:Orientation,options:{angle:number;axis?:"x"|"y"|"z"}):Orientation
```

Return a detached orientation after an explicit local-axis turn or facing a target; preserve caller data.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-rotate-2"></a>
<a id="api-185"></a>

### geometry.rotate

Status: target

```ts
geometry.rotate(orientation:Orientation,options:{towards:Position;from:Position;space:Space;wrap?:boolean;roll?:"preserve"|"zero"}):Orientation
```

Return a detached orientation after an explicit local-axis turn or facing a target; preserve caller data.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-split-path"></a>
<a id="api-186"></a>

### geometry.splitPath

Status: target

```ts
geometry.splitPath(from:{x:number;y:number},to:{x:number;y:number},options:{space:Space;mode?:"clip"|"reject"}):
  readonly {readonly from:{readonly x:number;readonly y:number};readonly to:{readonly x:number;readonly y:number}}[]
```

Return detached planar path pieces split at wrap seams or clipped/rejected at hard bounds, without changing model objects.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-bounds"></a>
<a id="api-187"></a>

### geometry.bounds

Status: delivered

```ts
geometry.bounds(features:PlanarDataset | readonly PlanarFeature[]):Bounds | undefined
```

Return planar feature bounds, or undefined when there are no non-null coordinates.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-map"></a>
<a id="api-188"></a>

### geometry.map

Status: delivered

```ts
geometry.map(point:{x:number;y:number},options:{from:Bounds;to:Bounds;mode?:"uniform-centered"|"independent-axes"}):{readonly x:number;readonly y:number}
```

Map planar coordinates between explicit bounds with uniform centered or independent-axis scaling; no implicit CRS conversion.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-orientation"></a>
<a id="api-169"></a>

### Orientation

Status: delivered

```ts
type Orientation = { readonly heading:number; readonly pitch?:number; readonly roll?:number };
```

Heading and optional pitch/roll in degrees, using the library’s documented local-axis convention.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-bounds"></a>
<a id="api-170"></a>

### Bounds

Status: delivered

```ts
type Bounds = readonly [number,number,number,number]; // minX,maxX,minY,maxY
```

Planar coordinate envelope ordered as minimum x, maximum x, minimum y, maximum y.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-xy"></a>
<a id="api-171"></a>

### PlanarXY

Status: delivered

```ts
type PlanarXY = readonly [number,number];
```

Finite planar coordinate pair ordered as x, y.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-polygon"></a>
<a id="api-172"></a>

### PlanarPolygon

Status: delivered

```ts
type PlanarPolygon = {readonly type:"Polygon";readonly coordinates:readonly (readonly PlanarXY[])[]};
```

Planar polygon rings: exterior first, followed by holes, with explicit repeated closure and validated nonintersecting geometry.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-geometry"></a>
<a id="api-173"></a>

### PlanarGeometry

Status: delivered

```ts
type PlanarGeometry =
 | {readonly type:"Point";readonly coordinates:PlanarXY}
 | {readonly type:"MultiPoint"|"LineString";readonly coordinates:readonly PlanarXY[]}
 | {readonly type:"MultiLineString";readonly coordinates:readonly (readonly PlanarXY[])[]}
 | PlanarPolygon
 | {readonly type:"MultiPolygon";readonly coordinates:readonly (readonly (readonly PlanarXY[])[])[]}
 | {readonly type:"GeometryCollection";readonly geometries:readonly PlanarGeometry[]};
```

Supported planar GeoJSON geometry variants, including nested geometry collections; XYZ coordinates are unsupported.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-json"></a>
<a id="api-174"></a>

### PlanarJson

Status: delivered

```ts
type PlanarJson = null | boolean | number | string | readonly PlanarJson[] | {readonly [key:string]:PlanarJson};
```

JSON-compatible feature property values; numeric values must be finite.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-feature"></a>
<a id="api-175"></a>

### PlanarFeature

Status: delivered

```ts
interface PlanarFeature {readonly type:"Feature";readonly id?:string|number;
 readonly geometry:PlanarGeometry|null;readonly properties:Readonly<Record<string,PlanarJson>>|null}
```

GeoJSON feature with optional ID, nullable planar geometry and nullable ordinary JSON properties.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-dataset"></a>
<a id="api-176"></a>

### PlanarDataset

Status: delivered

```ts
interface PlanarDataset {readonly features:readonly PlanarFeature[];
 readonly coordinateSystem:{readonly crs:string;readonly units:string}}
```

Detached planar features accompanied by explicit coordinate-reference-system and unit labels.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-area"></a>
<a id="api-403"></a>

### geometry.area

Status: delivered

```ts
geometry.area(options: { shape: ParcelShape }): number
```

Return the net planar area, independent of winding; holes subtract and components add.

[Details](../grid-parcels/API.md#geometry-measurements)

<a id="geometry-merge"></a>
<a id="api-404"></a>

### geometry.merge

Status: delivered

```ts
geometry.merge(options: { shapes: readonly PlanarPolygon[] } | { layout: Layout; cells: readonly number[] }): MergeResult
```

Merge explicit shapes or unique layout cells by full-edge cancellation into one conforming connected simple polygon; never a Boolean solver. Invalid input throws; unmergeable input returns "unsupported" or "failed" with the original shapes.

[Details](../grid-parcels/API.md#geometry-changes)

<a id="geometry-split"></a>
<a id="api-405"></a>

### geometry.split

Status: delivered

```ts
geometry.split(options: { shape: PlanarPolygon; point: Position; direction: Vector; minimumArea?: number }): SplitResult
```

Cut a convex hole-free polygon once along an infinite line. "ok" returns two parts, left of direction first; every other status returns the original shape with one diagnostic. minimumArea defaults to 0.

[Details](../grid-parcels/API.md#geometry-changes)

<a id="type-parcel-shape"></a>
<a id="api-406"></a>

### ParcelShape

Status: delivered

```ts
type ParcelShape = PlanarPolygon | Extract<PlanarGeometry, { type: "MultiPolygon" }>;
```

A polygon or multipolygon accepted by geometry.area. The delivered name is frozen; a neutral rename is an open decision.

[Details](../grid-parcels/API.md#geometry-measurements)

<a id="type-merge-result"></a>
<a id="api-407"></a>

### MergeResult

Status: delivered

```ts
type MergeResult =
  | { readonly status: "ok"; readonly shape: PlanarPolygon; readonly sourceCells: readonly number[] }
  | { readonly status: "unsupported" | "failed"; readonly remainingShapes: readonly PlanarPolygon[];
      readonly sourceCells: readonly number[]; readonly diagnostics: readonly string[] };
```

Result of geometry.merge: one merged polygon, or the remaining shapes with diagnostics.

[Details](../grid-parcels/API.md#geometry-changes)

<a id="type-split-result"></a>
<a id="api-408"></a>

### SplitResult

Status: delivered

```ts
interface SplitResult {
  readonly status: "ok" | "unchanged" | "unsupported" | "failed";
  readonly parts: readonly PlanarPolygon[];
  readonly diagnostics: readonly string[];
}
```

Result of geometry.split with status, parts and diagnostics.

[Details](../grid-parcels/API.md#geometry-changes)

<a id="area-agenda"></a>

## Agenda

Target: `library-core/agenda`.

<a id="agenda-add"></a>
<a id="api-189"></a>

### Agenda.create

Status: delivered

```ts
Agenda.create<E = unknown>(): Agenda<E>
```

Store timed event data and return due events in time, priority and insertion order. Advancing the Agenda changes its own time only; event handling remains explicit.

[Details](api-reference.md#agenda)

<a id="agenda-time"></a>
<a id="api-195"></a>

### agenda.time

Status: delivered

```ts
agenda.time: number
```

Read the current agenda time, starting at 0. advance changes only this time; it never advances world.tick.value.

[Details](api-reference.md#agenda)

<a id="agenda-size"></a>
<a id="api-agenda-size"></a>

### agenda.size

Status: delivered

```ts
agenda.size: number // readonly
```

Read the pending-event count without advancing any clock or dispatching work. This delivered addition supplements the original numbered inventory.

[Details](api-reference.md#agenda)

<a id="agenda-add-2"></a>
<a id="api-190"></a>

### agenda.add

Status: delivered

```ts
agenda.add(options: { at: number; data: E; priority?: number }): EventHandle<E>
```

Queue plain event data at at ≥ agenda.time; priority defaults to 0, with lower priorities first at equal time and insertion sequence resolving remaining ties. Return an issued cancellation handle.

[Details](api-reference.md#agenda)

<a id="agenda-delete"></a>
<a id="api-191"></a>

### agenda.delete

Status: delivered

```ts
agenda.delete(handle: EventHandle<E>): void
```

Cancel this Agenda’s issued event handle; deleting an already absent event is a no-op.

[Details](api-reference.md#agenda)

<a id="agenda-advance"></a>
<a id="api-192"></a>

### agenda.advance

Status: delivered

```ts
agenda.advance(options: { until: number; maxEventCount?: number }): readonly Event<E>[]
```

Return detached due events in time/priority/sequence order; maxEventCount defaults to 1000. If due events remain after the budget, stop agenda.time at the last dispatched time; otherwise advance it to until. Never advances World ticks.

[Details](api-reference.md#agenda)

<a id="agenda-next"></a>
<a id="api-agenda-next"></a>

### agenda.next

Status: delivered

```ts
agenda.next(options: { until: number }): Event<E> | undefined
```

Extract at most one due event. Success leaves Agenda time at event.at even for the last due event; absence advances it to until. The caller handles each result before extracting more events and supplies its own finite dispatch budget. No callbacks or World tick changes occur. The existing batch advance contract is unchanged. This delivered addition supplements the original numbered inventory.

[Details](api-reference.md#agenda) · [Causal composition](../development/des-contract.md#time-and-causality)

<a id="type-event-handle"></a>
<a id="api-193"></a>

### EventHandle

Status: delivered

```ts
type EventHandle<E> = { readonly id: string; readonly agenda: Agenda<E> };
```

Opaque issued cancellation identity tied to one Agenda; foreign or forged handles reject.

[Details](api-reference.md#agenda)

<a id="type-event"></a>
<a id="api-194"></a>

### Event

Status: delivered

```ts
type Event<E> = { readonly id: string; readonly at: number; readonly priority: number; readonly sequence: number; readonly data: E };
```

Detached scheduled event data with identity, time, priority and insertion sequence.

[Details](api-reference.md#agenda)

<a id="type-agenda"></a>
<a id="api-409"></a>

### Agenda

Status: delivered

```ts
Agenda<E>
```

Event queue with its own time cursor, independent of World tick. Events are ordered by at, then lower priority, then insertion order.

[Details](api-reference.md#agenda)

<a id="event-trace-add"></a>
<a id="api-410"></a>

### EventTrace.create

Status: delivered

```ts
EventTrace.create<T>(options: { capacity: number }): EventTrace<T>
```

Create a bounded trace; capacity must be a positive safe integer. Beyond capacity the oldest event is dropped.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="event-trace-record"></a>
<a id="api-411"></a>

### eventTrace.record

Status: delivered

```ts
eventTrace.record(event: { at: number; value: T }): void
```

Record a detached copy of value; `at` must be finite and nondecreasing from 0.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="event-trace-read"></a>
<a id="api-412"></a>

### eventTrace.read

Status: delivered

```ts
eventTrace.read(): readonly TraceEvent<T>[]
```

Return detached copies in recording order.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="type-event-trace"></a>
<a id="api-413"></a>

### EventTrace

Status: delivered

```ts
EventTrace<T>
```

Bounded event diagnostics, separate from History; recording is explicit.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="type-trace-event"></a>
<a id="api-414"></a>

### TraceEvent

Status: delivered

```ts
interface TraceEvent<T> { readonly at: number; readonly value: T }
```

One recorded trace entry.

[Details](../development/des-contract.md#observations-trace-data-and-random-draws)

<a id="service-queue-add-queue"></a>
<a id="api-415"></a>

### ServiceQueue.create

Status: delivered

```ts
ServiceQueue.create<T>(options?: { policy?: QueuePolicy }): ServiceQueue<T>
```

Create an empty waiting line; policy defaults to "fifo". "priority" serves lower priority values first and keeps ties stable.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="service-queue-add"></a>
<a id="api-416"></a>

### serviceQueue.add

Status: delivered

```ts
serviceQueue.add(value: T, options?: { priority?: number }): QueueHandle<T>
```

Enqueue value; priority defaults to 0.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="service-queue-take"></a>
<a id="api-417"></a>

### serviceQueue.take

Status: delivered

```ts
serviceQueue.take(): T | undefined
```

Remove and return the first value; undefined when empty.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="service-queue-delete"></a>
<a id="api-418"></a>

### serviceQueue.delete

Status: delivered

```ts
serviceQueue.delete(handle: QueueHandle<T>): void
```

Remove a queued value; an already removed value is a no-op.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="service-queue-entries"></a>
<a id="api-419"></a>

### serviceQueue.entries

Status: delivered

```ts
serviceQueue.entries: readonly T[] // readonly
```

Queued values in service order.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="type-service-queue"></a>
<a id="api-420"></a>

### ServiceQueue

Status: delivered

```ts
ServiceQueue<T>
```

Waiting line; the "priority" policy serves lower priority first, stable for ties.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="type-queue-handle"></a>
<a id="api-421"></a>

### QueueHandle

Status: delivered

```ts
interface QueueHandle<T> { readonly id: string; readonly value: T }
```

Handle for deleting a queued value.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="type-queue-policy"></a>
<a id="api-422"></a>

### QueuePolicy

Status: delivered

```ts
type QueuePolicy = "fifo" | "priority";
```

Service order of a ServiceQueue or Resource.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-add"></a>
<a id="api-423"></a>

### Resource.create

Status: delivered

```ts
Resource.create<T>(options: { capacity: number; policy?: QueuePolicy }): Resource<T>
```

Create a resource with a positive unit capacity; waiting requests use policy (default "fifo").

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-request"></a>
<a id="api-424"></a>

### resource.request

Status: delivered

```ts
resource.request(options: { owner: T; units?: number; priority?: number }): ResourceRequest<T>
```

Request units (default 1, at most current capacity); grant immediately when admissible, otherwise wait.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-release"></a>
<a id="api-425"></a>

### resource.release

Status: delivered

```ts
resource.release(ticket: ResourceRequest<T>): void
```

Return granted units; releasing again is a no-op.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-cancel"></a>
<a id="api-426"></a>

### resource.cancel

Status: delivered

```ts
resource.cancel(ticket: ResourceRequest<T>): void
```

Withdraw a waiting or granted request; finished requests are ignored.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-set-capacity"></a>
<a id="api-427"></a>

### resource.setCapacity

Status: delivered

```ts
resource.setCapacity(capacity: number, options?: { occupied?: "reject" | "retain" }): void
```

Change capacity. "reject" (default) refuses to shrink below used units; "retain" keeps current holders.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-capacity"></a>
<a id="api-428"></a>

### resource.capacity

Status: delivered

```ts
resource.capacity: number // readonly
```

Current unit capacity.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-used"></a>
<a id="api-429"></a>

### resource.used

Status: delivered

```ts
resource.used: number // readonly
```

Units currently granted.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-available"></a>
<a id="api-430"></a>

### resource.available

Status: delivered

```ts
resource.available: number // readonly
```

Capacity minus used units.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="resource-waiting"></a>
<a id="api-431"></a>

### resource.waiting

Status: delivered

```ts
resource.waiting: readonly ResourceRequest<T>[] // readonly
```

Waiting requests in service order.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="type-resource"></a>
<a id="api-432"></a>

### Resource

Status: delivered

```ts
Resource<T>
```

Counted capacity with a waiting line. Admission is head-of-line; the "priority" policy orders waiters by lower priority first, stable for ties, and never preempts holders.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="type-resource-request"></a>
<a id="api-433"></a>

### ResourceRequest

Status: delivered

```ts
interface ResourceRequest<T> {
  readonly id: string;
  readonly owner: T;
  readonly units: number;
  readonly status: ResourceStatus;
}
```

A resource request with its owner, units and status.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="type-resource-status"></a>
<a id="api-434"></a>

### ResourceStatus

Status: delivered

```ts
type ResourceStatus = "waiting" | "granted" | "released" | "cancelled";
```

Life cycle of a resource request.

[Details](../development/des-contract.md#service-queue-and-resources)

<a id="store-add"></a>
<a id="api-435"></a>

### Store.create

Status: delivered

```ts
Store.create<T>(options: { capacity: number }): Store<T>
```

Create a bounded first-in, first-out store; capacity is required.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-put"></a>
<a id="api-436"></a>

### store.put

Status: delivered

```ts
store.put(value: T): PutRequest<T>
```

Store value when capacity allows; otherwise the producer waits.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-get"></a>
<a id="api-437"></a>

### store.get

Status: delivered

```ts
store.get(): GetRequest<T>
```

Receive the oldest available value, or wait for one.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-take"></a>
<a id="api-438"></a>

### store.take

Status: delivered

```ts
store.take(): T | undefined
```

Receive a stored item immediately; undefined when none is stored.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-cancel-put"></a>
<a id="api-439"></a>

### store.cancelPut

Status: delivered

```ts
store.cancelPut(ticket: PutRequest<T>): void
```

Withdraw a waiting producer; finished requests are ignored.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-cancel-get"></a>
<a id="api-440"></a>

### store.cancelGet

Status: delivered

```ts
store.cancelGet(ticket: GetRequest<T>): void
```

Withdraw a waiting consumer; finished requests are ignored.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-items"></a>
<a id="api-441"></a>

### store.items

Status: delivered

```ts
store.items: readonly T[] // readonly
```

Stored values, oldest first.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-waiting-puts"></a>
<a id="api-442"></a>

### store.waitingPuts

Status: delivered

```ts
store.waitingPuts: readonly PutRequest<T>[] // readonly
```

Producers waiting for space.

[Details](../development/des-contract.md#bounded-stores)

<a id="store-waiting-gets"></a>
<a id="api-443"></a>

### store.waitingGets

Status: delivered

```ts
store.waitingGets: readonly GetRequest<T>[] // readonly
```

Consumers waiting for an item.

[Details](../development/des-contract.md#bounded-stores)

<a id="type-store"></a>
<a id="api-444"></a>

### Store

Status: delivered

```ts
Store<T>
```

Bounded FIFO store with waiting producers and consumers. Waiting consumers receive stored items first, then values of waiting producers.

[Details](../development/des-contract.md#bounded-stores)

<a id="type-put-request"></a>
<a id="api-445"></a>

### PutRequest

Status: delivered

```ts
interface PutRequest<T> { readonly id: string; readonly value: T; readonly status: PutStatus }
```

A producer's request and its status.

[Details](../development/des-contract.md#bounded-stores)

<a id="type-get-request"></a>
<a id="api-446"></a>

### GetRequest

Status: delivered

```ts
interface GetRequest<T> { readonly id: string; readonly value: T | undefined; readonly status: GetStatus }
```

A consumer's request; value is set once received.

[Details](../development/des-contract.md#bounded-stores)

<a id="type-put-status"></a>
<a id="api-447"></a>

### PutStatus

Status: delivered

```ts
type PutStatus = "waiting" | "stored" | "cancelled";
```

Life cycle of a put request.

[Details](../development/des-contract.md#bounded-stores)

<a id="type-get-status"></a>
<a id="api-448"></a>

### GetStatus

Status: delivered

```ts
type GetStatus = "waiting" | "received" | "cancelled";
```

Life cycle of a get request.

[Details](../development/des-contract.md#bounded-stores)

<a id="signal-add"></a>
<a id="api-449"></a>

### Signal.create

Status: delivered

```ts
Signal.create<T>(initial: T): Signal<T>
```

Create a signal holding initial.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="signal-value"></a>
<a id="api-450"></a>

### signal.value

Status: delivered

```ts
signal.value: T // readonly
```

Current value.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="signal-set"></a>
<a id="api-451"></a>

### signal.set

Status: delivered

```ts
signal.set(value: T): void
```

Evaluate every waiting predicate against value before committing. A throwing predicate leaves value and waits unchanged.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="signal-wait"></a>
<a id="api-452"></a>

### signal.wait

Status: delivered

```ts
signal.wait(predicate: (value: T) => boolean): WaitRequest
```

Return a satisfied request if predicate already holds; otherwise wait.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="signal-cancel"></a>
<a id="api-453"></a>

### signal.cancel

Status: delivered

```ts
signal.cancel(ticket: WaitRequest): void
```

Cancel a waiting request; finished requests are ignored.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="type-signal"></a>
<a id="api-454"></a>

### Signal

Status: delivered

```ts
Signal<T>
```

Observable value with predicate waits; predicates must not call set, wait or cancel.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="type-wait-request"></a>
<a id="api-455"></a>

### WaitRequest

Status: delivered

```ts
interface WaitRequest { readonly id: string; readonly status: WaitStatus }
```

A wait on a signal predicate and its status.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="type-wait-status"></a>
<a id="api-456"></a>

### WaitStatus

Status: delivered

```ts
type WaitStatus = "waiting" | "satisfied" | "cancelled";
```

Life cycle of a wait request.

[Details](../development/des-contract.md#state-conditions-process-interaction-and-timeouts)

<a id="area-studies"></a>

## studies

Target: `library-core/world-composition`.

<a id="studies-design"></a>
<a id="api-263"></a>

### studies.design

Status: delivered

```ts
studies.design(input: { constants?: StudyParameters; axes: readonly StudyAxis[]; maxScenarioCount?: number }): readonly StudyScenario[]
```

Expand a bounded Cartesian parameter design into ordered scenarios without running models or drawing randomness.

[Details](api-reference.md#study-design-contract)

<a id="studies-design-2"></a>
<a id="api-264"></a>

### studies.design

Status: delivered

```ts
studies.design<Parameters extends StudyParameters>(input: { defaults: Parameters; axes: readonly StudyAxisFor<Parameters>[]; maxScenarioCount?: number }): readonly StudyScenario<StudyParameterValues<Parameters>>[]
```

Expand a bounded Cartesian parameter design into ordered scenarios without running models or drawing randomness.

[Details](api-reference.md#study-design-contract)

<a id="studies-replicate"></a>
<a id="api-265"></a>

### studies.replicate

Status: delivered

```ts
studies.replicate<Parameters>(scenarios: readonly StudyScenario<Parameters>[], seeds: readonly number[], options?: { maxRunCount?: number }): readonly PlannedRun<Parameters>[]
```

Expand ordered scenarios over explicit seeds into a bounded whole-run plan without running models.

[Details](api-reference.md#study-design-contract)

<a id="studies-run"></a>
<a id="api-261"></a>

### studies.run

Status: delivered

```ts
studies.run<Parameters,Model extends StudyModel,Measurements>(options: StudyOptions<Parameters,Model,Measurements> & {pause?:never}): StudyResult<Parameters,Measurements>
```

Run the finite study and return its terminal outcomes. Pausing is not accepted by this overload.

[Details](api-reference.md#study-options-contract)

<a id="studies-run-2"></a>
<a id="api-262"></a>

### studies.run

Status: target

```ts
studies.run<Parameters,Model extends StudyModel,Measurements>(options: StudyOptions<Parameters,Model,Measurements> & Required<Pick<StudyOptions<Parameters,Model,Measurements>,"pause">>): StudyResult<Parameters,Measurements> | StudyCheckpoint<Parameters,Measurements>
```

Run the finite study with an explicit boundary-pause policy. Return terminal outcomes or a resumable checkpoint.

[Details](api-reference.md#study-options-contract)

<a id="studies-summarize"></a>
<a id="api-266"></a>

### studies.summarize

Status: delivered

```ts
studies.summarize<Parameters,Measurements>(result: StudyResult<Parameters,Measurements>, select: (outcome: StudyOutcome<Parameters,Measurements>) => number | undefined): readonly ReplicationSummary[]
```

Summarize an explicit numeric selection from per-run outcomes, keeping missing/failed runs distinct.

[Details](api-reference.md#study-design-contract)

<a id="studies-bind"></a>
<a id="api-269"></a>

### studies.bind

Status: target

```ts
studies.bind<Model extends StudyModel>(spec: StudySpec, bindings: StudyBindings<Model>): BoundStudy<Model>
```

Bind recognized Study source labels to explicit TypeScript callbacks and a finite run plan; never evaluate source strings.

[Details](api-reference.md#study-behaviorspace-contract)

<a id="studies-run-3"></a>
<a id="api-270"></a>

### studies.run

Status: target

```ts
studies.run<Model extends StudyModel>(bound: BoundStudy<Model>): StudyResult<StudyParameters,Readonly<Record<string,StudyScalar>>>
```

Execute the validated bound Study plan using its explicitly supplied model callbacks and ordinary study lifecycle. No source strings are evaluated.

[Details](api-reference.md#study-behaviorspace-contract)

<a id="studies-evaluate"></a>
<a id="api-271"></a>

### studies.evaluate

Status: target

```ts
studies.evaluate<Parameters,Model extends StudyModel,Measurements>(input:
  Omit<StudyOptions<Parameters,Model,Measurements>,"parameters" | "plan" | "pause"> & {
    pause?: never; candidates: readonly StudyScenario<Parameters>[]; seeds: readonly number[]; objective: CandidateObjective<Parameters,Measurements>
  }): CandidateEvaluation<Parameters,Measurements>
```

Evaluate a finite candidate grid against explicit observations, objective and seeds; no implicit optimizer or pausing.

[Details](api-reference.md#study-calibration-contract)

<a id="studies-select"></a>
<a id="api-272"></a>

### studies.select

Status: target

```ts
studies.select<Parameters,Measurements>(evaluation: CandidateEvaluation<Parameters,Measurements>, options: { maxMeanLossDelta: number }): CandidateSelection<Parameters,Measurements>
```

Select eligible candidates within the supplied mean-loss difference of the best eligible result.

[Details](api-reference.md#study-calibration-contract)

<a id="studies-holdout"></a>
<a id="api-273"></a>

### studies.holdout

Status: target

```ts
studies.holdout<Parameters,Model extends StudyModel,Measurements>(selection: CandidateSelection<Parameters,Measurements>, input:
  Omit<StudyOptions<Parameters,Model,Measurements>,"parameters" | "plan" | "pause"> & { pause?: never; seeds: readonly number[]; objective: CandidateObjective<Parameters,Measurements> }
): CandidateHoldout<Parameters,Measurements>
```

Evaluate a fixed candidate selection using disjoint held-out seeds and observation identities.

[Details](api-reference.md#study-calibration-contract)

<a id="studies-resume"></a>
<a id="api-274"></a>

### studies.resume

Status: target

```ts
studies.resume<Parameters,Model extends StudyModel,Measurements>(checkpoint: StudyCheckpoint<Parameters,Measurements>, callbacks: {
  create(parameters:Parameters,seed:number,run:PlannedRun<Parameters>):Model;
  load(snapshot: WorldSnapshot<unknown> | BundleSnapshot<unknown>, run:PlannedRun<Parameters>):Model;
  measure(model:Model):Measurements;
  sampleWhen?(model:Model,completedStepCount:number):boolean;
  stopWhen?(model:Model,completedStepCount:number):boolean;
  after?(result:StudyResult<Parameters,Measurements>):void;
  host?:{ advance(model:Model):void | "stopped" };
  pause?:{ when(model:Model,completedStepCount:number):boolean; save(model:Model):Snapshot<unknown,unknown> };
}): StudyResult<Parameters,Measurements> | StudyCheckpoint<Parameters,Measurements>
```

Continue a validated paused study after explicitly rebinding callbacks, preserving completed outcomes and remaining budgets.

[Details](api-reference.md#study-boundaries-contract)

<a id="studies-run-4"></a>
<a id="api-267"></a>

### studies.run

Status: target

```ts
studies.run<Parameters extends StudyParameters,Measurements>(options: {
  plan: readonly PlannedRun<Parameters>[];
  executor: { moduleUrl: string; exportName: string; sha256: string; config?: NodeStudyConfig };
  stepCount: number; sampleIntervalSteps?: number; sampleInitial?: boolean; sampleFinal?: boolean;
  provenance?: Readonly<Record<string,string>>; maxTotalStepCount?: number; maxTotalSampleCount?: number;
  timeoutMs: number; concurrency?: number; signal?: StudyCancellationSignal;
}): Promise<NodeStudyResult<Parameters,Measurements>>
```

Available from agent-loom/studies/node. Execute whole independent runs in native Node workers through the optional Node host subpath. Validate the trusted provider module and preserve plan-order outcomes, including transport failures.

[Details](api-reference.md#study-worker-contract)

<a id="type-study-model"></a>
<a id="api-258"></a>

### StudyModel

Status: delivered

```ts
interface StudyModel { readonly world: World; step(): void; dispose?(): void }
```

Ordinary model object with its World, synchronous step procedure and optional cleanup.

[Details](api-reference.md#study-options-contract)

<a id="type-study-plan"></a>
<a id="api-259"></a>

### StudyPlan

Status: delivered

```ts
type StudyPlan<Parameters> =
  | { readonly parameters: readonly Parameters[]; readonly seeds: readonly number[]; readonly plan?: never }
  | { readonly plan: readonly PlannedRun<Parameters>[]; readonly parameters?: never; readonly seeds?: never };
```

Either a parameter/seed Cartesian plan or an explicit ordered run plan; the two forms are mutually exclusive.

[Details](api-reference.md#study-options-contract)

<a id="type-study-options"></a>
<a id="api-260"></a>

### StudyOptions

Status: delivered

```ts
type StudyOptions<Parameters,Model extends StudyModel,Measurements> = StudyPlan<Parameters> & {
  create(parameters: Parameters, seed: number, run: PlannedRun<Parameters>): Model;
  readonly stepCount: number;
  measure(model: Model): Measurements;
  readonly sampleIntervalSteps?: number;
  readonly sampleInitial?: boolean;
  readonly sampleFinal?: boolean;
  sampleWhen?(model: Model, completedStepCount: number): boolean;
  stopWhen?(model: Model, completedStepCount: number): boolean;
  readonly onError?: "stop" | "continue";
  before?(plan: readonly PlannedRun<Parameters>[]):void;
  after?(result:StudyResult<Parameters,Measurements>):void;
  readonly pause?: { when(model:Model,completedStepCount:number):boolean; save(model:Model):Snapshot<unknown,unknown> };
  readonly provenance?: Readonly<Record<string,string>>;
  readonly maxTotalStepCount?: number;
  readonly maxTotalSampleCount?: number;
  readonly host?: { advance(model: Model): void | "stopped" };
};
```

Model factory, finite plan, horizon, measurement/sampling policies and optional stopping, hooks and pause callbacks.

[Details](api-reference.md#study-options-contract)

<a id="type-worker-study-provider"></a>
<a id="api-268"></a>

### WorkerStudyProvider

Status: target

```ts
type WorkerStudyProvider<Parameters,Model extends StudyModel,Measurements> = (config: NodeStudyConfig) =>
  Pick<StudyOptions<Parameters,Model,Measurements>,"create" | "measure" | "sampleWhen" | "stopWhen" | "host">;
```

Synchronous Node worker provider factory that turns validated transport configuration into create/measure and optional sampling, stopping and host callbacks. Exported through agent-loom/studies/node.

[Details](api-reference.md#study-worker-contract)

<a id="type-study-checkpoint"></a>
<a id="api-275"></a>

### StudyCheckpoint

Status: target

```ts
interface StudyCheckpoint<Parameters,Measurements> {
  readonly framework: "agent-loom-study"; readonly version: 1; readonly kind: "paused";
  readonly plan: readonly PlannedRun<Parameters>[];
  readonly policy: { readonly stepCount:number; readonly sampleIntervalSteps:number; readonly sampleInitial:boolean;
    readonly sampleFinal:boolean; readonly onError:"stop"|"continue";
    readonly maxTotalStepCount:number; readonly maxTotalSampleCount:number;
    readonly provenance:Readonly<Record<string,string>> };
  readonly cursor: number;
  readonly outcomes: readonly StudyOutcome<Parameters,Measurements>[];
  readonly active: { readonly run:PlannedRun<Parameters>; readonly snapshot:unknown;
    readonly completedStepCount:number; readonly samples:readonly StudySample<Measurements>[] };
  readonly consumedStepCount:number; readonly consumedSampleCount:number;
  readonly beforeCompleted:boolean; readonly afterCompleted:false;
}
```

Versioned paused-study data retaining plan, policies, outcomes, samples and saved model state for explicit continuation.

[Details](api-reference.md#study-boundaries-contract)

<a id="type-widen-study-scalar"></a>
<a id="api-276"></a>

### WidenStudyScalar

Status: target

```ts
type WidenStudyScalar<Value extends StudyScalar> = Value extends number ? number : Value extends boolean ? boolean : string;
```

Map a scalar literal type to its corresponding number, boolean or string value type.

[Details](api-reference.md#study-contracts-general)

<a id="type-behavior-space-axis"></a>
<a id="api-277"></a>

### StudyAxis

Status: target

```ts
export interface StudyAxis {
	readonly variable: string;
	readonly values: readonly string[];
}
```

Declared variable name with bounded source-literal values for explicit caller decoding.

[Details](api-reference.md#study-contracts-general)

<a id="type-behavior-space-spec"></a>
<a id="api-278"></a>

### StudySpec

Status: target

```ts
export interface StudySpec {
	readonly version: 1 | 2;
	readonly dialect: "finite-study-xml/2" | "finite-study-xml/1";
	readonly name: string;
	readonly repetitions: number;
	readonly runMetricsEveryStep: boolean;
	readonly timeLimit: number;
	readonly setup: string;
	readonly go: string;
	readonly exitCondition?: string;
	readonly runMetricsCondition?: string;
	readonly metrics: readonly string[];
	readonly axes: readonly StudyAxis[];
	readonly originalXml: string;
 readonly substudies?:readonly { readonly axes:readonly StudyAxis[] }[];
 readonly beforeStudy?:string; readonly afterStudy?:string;
}
```

Versioned finite Study plan retaining source labels, parameter axes, repetition and measurement policies.

[Details](api-reference.md#study-contracts-general)

<a id="type-behavior-space-measurement"></a>
<a id="api-279"></a>

### StudyMeasurement

Status: target

```ts
export type StudyMeasurement = Readonly<Record<string, StudyScalar>>;
```

Read-only named scalar measurements emitted by a bound Study study.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-objective"></a>
<a id="api-280"></a>

### CandidateObjective

Status: target

```ts
export interface CandidateObjective<Parameters, Measurements> {
	readonly id: string;
	readonly dataId: string;
	readonly observationIds: readonly string[];
	loss(outcome: StudyOutcome<Parameters, Measurements>): number;
}
```

Objective identity, training-data identity, observation identities and a synchronous per-outcome loss function.

[Details](api-reference.md#study-contracts-general)

<a id="type-calibration-manifest"></a>
<a id="api-281"></a>

### CalibrationManifest

Status: target

```ts
export interface CalibrationManifest {
	readonly id: string;
	readonly dataId: string;
	readonly observationIds: readonly string[];
}
```

Objective/data/observation identities retained as calibration provenance.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-loss"></a>
<a id="api-282"></a>

### CandidateLoss

Status: target

```ts
export type CandidateLoss = {
	readonly runId: string;
	readonly seed: number;
} & (
	| {
			readonly status: "valid";
			readonly loss: number;
			readonly error?: never;
	  }
	| {
			readonly status: "unavailable";
			readonly loss: null;
			readonly error:
				| StudyError
				| {
						readonly phase: "objective" | "run";
						readonly name: string;
						readonly message: string;
				  };
	  }
);
```

Per-run valid loss or explicit unavailable result with its failure information.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-score"></a>
<a id="api-283"></a>

### CandidateScore

Status: target

```ts
export type CandidateScore<Parameters> = {
	readonly candidate: StudyScenario<Parameters>;
	readonly requestedRunCount: number;
	readonly validRunCount: number;
	readonly failedRunCount: number;
	readonly sampleStandardDeviation: number | null;
	readonly losses: readonly CandidateLoss[];
} & (
	| {
			readonly eligible: true;
			readonly mean: number;
	  }
	| {
			readonly eligible: false;
			readonly mean: number | null;
	  }
);
```

Candidate counts and losses with an eligible numeric mean or an explicit ineligible state.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-evaluation"></a>
<a id="api-284"></a>

### CandidateEvaluation

Status: target

```ts
export interface CandidateEvaluation<Parameters, Measurements> {
	readonly version: 1;
	readonly kind: "training" | "holdout";
	readonly status: "ready" | "no-eligible-candidate";
	readonly objective: CalibrationManifest;
	readonly seeds: readonly number[];
	readonly candidates: readonly CandidateScore<Parameters>[];
	readonly ranking: readonly string[];
	readonly study: StudyResult<Parameters, Measurements>;
}
```

Versioned training/holdout evaluation with provenance, seeds, scores and eligibility status.

[Details](api-reference.md#study-contracts-general)

<a id="type-selection-measurement"></a>
<a id="api-selection-measurement"></a>

### selectionMeasurement

Status: target

```ts
declare const selectionMeasurement: unique symbol;
```

Type-level identity brand used by CandidateSelection to preserve its measurement type. This declaration does not expose a public runtime operation.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-selection"></a>
<a id="api-285"></a>

### CandidateSelection

Status: target

```ts
export interface CandidateSelection<Parameters, Measurements> {
	readonly [selectionMeasurement]?: (measurement: Measurements) => Measurements;
	readonly version: 1;
	readonly objectiveId: string;
	readonly trainingDataId: string;
	readonly rule: { readonly maxMeanLossDelta: number };
	readonly candidates: readonly StudyScenario<Parameters>[];
}
```

Fixed candidate set and loss-difference rule, retaining objective/training identities and the measurement type brand.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-holdout"></a>
<a id="api-286"></a>

### CandidateHoldout

Status: target

```ts
export interface CandidateHoldout<Parameters, Measurements> {
	readonly version: 1;
	readonly selection: CandidateSelection<Parameters, Measurements>;
	readonly training: CandidateEvaluation<Parameters, Measurements>;
	readonly holdout: CandidateEvaluation<Parameters, Measurements>;
}
```

Fixed selection together with its separate training and held-out evaluations.

[Details](api-reference.md#study-contracts-general)

<a id="type-node-study-config"></a>
<a id="api-287"></a>

### NodeStudyConfig

Status: target

```ts
export type NodeStudyConfig =
	| null
	| boolean
	| number
	| string
	| readonly NodeStudyConfig[]
	| { readonly [key: string]: NodeStudyConfig };
```

Finite JSON-like configuration transported to a trusted Node study provider; no executable values.

[Details](api-reference.md#study-contracts-general)

<a id="type-node-study-registration"></a>
<a id="api-288"></a>

### NodeStudyRegistration

Status: target

```ts
export interface NodeStudyRegistration {
	readonly moduleUrl: string;
	readonly exportName: string;
	readonly sha256: string;
	readonly config?: NodeStudyConfig;
}
```

Trusted provider module/export identity, SHA-256 digest and optional transport configuration.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-cancellation-signal"></a>
<a id="api-289"></a>

### StudyCancellationSignal

Status: target

```ts
export interface StudyCancellationSignal {
	readonly aborted: boolean;
	addEventListener(
		type: "abort",
		listener: () => void,
		options?: { readonly once?: boolean },
	): void;
	removeEventListener(type: "abort", listener: () => void): void;
}
```

Abort-compatible host signal used to cancel whole-run worker execution.

[Details](api-reference.md#study-contracts-general)

<a id="type-node-study-outcome"></a>
<a id="api-290"></a>

### NodeStudyOutcome

Status: target

```ts
export type NodeStudyOutcome<Parameters, Measurements> =
	| {
			readonly run: PlannedRun<Parameters>;
			readonly kind: "run";
			readonly outcome: StudyOutcome<Parameters, Measurements>;
	  }
	| {
			readonly run: PlannedRun<Parameters>;
			readonly kind: "not-started";
			readonly reason: "cancelled";
			readonly completedStepCount: 0;
	  }
	| {
			readonly run: PlannedRun<Parameters>;
			readonly kind: "transport-error";
			readonly reason:
				| "setup"
				| "timeout"
				| "cancelled"
				| "worker-error"
				| "protocol";
			readonly completedStepCount: null;
			readonly error: { readonly name: string; readonly message: string };
	  };
```

Completed worker outcome, cancelled-before-start record or explicit transport failure for a planned run.

[Details](api-reference.md#study-contracts-general)

<a id="type-node-study-result"></a>
<a id="api-291"></a>

### NodeStudyResult

Status: target

```ts
export interface NodeStudyResult<Parameters, Measurements> {
	readonly version: 1;
	readonly provenance: Readonly<Record<string, string>>;
	readonly outcomes: readonly NodeStudyOutcome<Parameters, Measurements>[];
}
```

Versioned plan-order worker outcomes and provenance.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-scalar"></a>
<a id="api-292"></a>

### StudyScalar

Status: delivered

```ts
export type StudyScalar = number | boolean | string;
```

Number, boolean or string parameter/measurement value, validated by its study contract.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-parameters"></a>
<a id="api-293"></a>

### StudyParameters

Status: delivered

```ts
export type StudyParameters = Readonly<Record<string, StudyScalar>>;
```

Read-only named scalar parameter settings for a study scenario.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-axis"></a>
<a id="api-294"></a>

### StudyAxis

Status: delivered

```ts
export interface StudyAxis {
	readonly name: string;
	readonly values: readonly StudyScalar[];
}
```

Named parameter axis with its explicitly ordered scalar values.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-parameter-values"></a>
<a id="api-295"></a>

### StudyParameterValues

Status: delivered

```ts
export type StudyParameterValues<Parameters extends StudyParameters> = {
	readonly [Key in keyof Parameters]: WidenStudyScalar<Parameters[Key]>;
};
```

Map each declared parameter to its widened scalar value type.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-axis-for"></a>
<a id="api-296"></a>

### StudyAxisFor

Status: delivered

```ts
export type StudyAxisFor<Parameters extends StudyParameters> = {
	[Key in Extract<keyof Parameters, string>]: {
		readonly name: Key;
		readonly values: readonly StudyParameterValues<Parameters>[Key][];
	};
}[Extract<keyof Parameters, string>];
```

Key-specific parameter axis whose values retain the selected parameter’s scalar type.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-scenario"></a>
<a id="api-297"></a>

### StudyScenario

Status: delivered

```ts
export interface StudyScenario<Parameters = StudyParameters> {
	readonly id: string;
	readonly index: number;
	readonly parameters: Parameters;
}
```

Scenario identity, index and model parameter settings before replication.

[Details](api-reference.md#study-contracts-general)

<a id="type-planned-run"></a>
<a id="api-298"></a>

### PlannedRun

Status: delivered

```ts
export interface PlannedRun<Parameters = StudyParameters> {
	readonly id: string;
	readonly scenarioId: string;
	readonly scenarioIndex: number;
	readonly replicationIndex: number;
	readonly seed: number;
	readonly parameters: Parameters;
}
```

Run/scenario identities, replication index, explicit seed and parameter settings.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-sample"></a>
<a id="api-299"></a>

### StudySample

Status: delivered

```ts
export interface StudySample<Measurements> {
	readonly step: number;
	readonly measurement: Measurements;
}
```

Measurement captured at an explicit completed-step index.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-phase"></a>
<a id="api-300"></a>

### StudyPhase

Status: delivered

```ts
export type StudyPhase =
	| "create"
	| "step"
	| "measure"
	| "sample"
	| "stop"
	| "dispose" | "pause" | "save" | "load";
```

Lifecycle phase used to locate a study failure or continuation operation.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-error"></a>
<a id="api-301"></a>

### StudyError

Status: delivered

```ts
export interface StudyError {
	readonly phase: StudyPhase;
	readonly name: string;
	readonly message: string;
}
```

Study failure phase with bounded error name and message data.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-status"></a>
<a id="api-302"></a>

### StudyStatus

Status: delivered

```ts
export type StudyStatus = "completed" | "stopped" | "failed" | "skipped";
```

Completed, stopped, failed or skipped terminal run status.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-terminal"></a>
<a id="api-303"></a>

### StudyTerminal

Status: delivered

```ts
export type StudyTerminal =
	| {
			readonly status: "completed";
			readonly reason: "horizon";
			readonly error?: never;
			readonly cleanupError?: never;
	  }
	| {
			readonly status: "stopped";
			readonly reason: "stop-condition" | "adapter-stopped";
			readonly error?: never;
			readonly cleanupError?: never;
	  }
	| {
			readonly status: "failed";
			readonly reason: "error";
			readonly error: StudyError;
			readonly cleanupError?: StudyError;
	  }
	| {
			readonly status: "skipped";
			readonly reason: "fail-fast" | "before-error";
			readonly error?: never;
			readonly cleanupError?: never;
	  };
```

Discriminated terminal status with its supported reason and error/cleanup fields.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-outcome"></a>
<a id="api-304"></a>

### StudyOutcome

Status: delivered

```ts
export type StudyOutcome<Parameters, Measurements> = StudyTerminal & {
	readonly run: PlannedRun<Parameters>;
	readonly completedStepCount: number;
	readonly samples: readonly StudySample<Measurements>[];
};
```

Terminal run status plus plan identity, completed-step count and retained samples.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-result"></a>
<a id="api-305"></a>

### StudyResult

Status: delivered

```ts
export interface StudyResult<Parameters, Measurements> {
	readonly version: 1;
	readonly provenance: Readonly<Record<string, string>>;
	readonly outcomes: readonly StudyOutcome<Parameters, Measurements>[];
 readonly studyError?:{readonly phase:"before"|"after";readonly name:string;readonly message:string};
}
```

Versioned ordered run outcomes, provenance and optional whole-study hook error.

[Details](api-reference.md#study-contracts-general)

<a id="type-replication-summary"></a>
<a id="api-306"></a>

### ReplicationSummary

Status: delivered

```ts
export interface ReplicationSummary {
	readonly scenarioId: string;
	readonly scenarioIndex: number;
	readonly requestedRunCount: number;
	readonly completedRunCount: number;
	readonly stoppedRunCount: number;
	readonly failedRunCount: number;
	readonly skippedRunCount: number;
	readonly validRunCount: number;
	readonly missingRunCount: number;
	readonly mean: number | null;
	readonly sampleStandardDeviation: number | null;
	readonly values: readonly {
		readonly runId: string;
		readonly seed: number;
		readonly status: StudyStatus;
		readonly value: number | null;
	}[];
}
```

Per-scenario outcome counts, valid numeric values, mean and sample standard deviation.

[Details](api-reference.md#study-contracts-general)

<a id="type-behavior-space-bindings"></a>
<a id="api-307"></a>

### StudyBindings

Status: target

```ts
interface StudyBindings<Model extends StudyModel> {
 readonly seeds: readonly number[];
 decodeLiteral(source:string, variable:string): StudyScalar;
 readonly setup: { readonly source:string; create(parameters:StudyParameters,seed:number,run:PlannedRun<StudyParameters>):Model };
 readonly go: { readonly source:string };
 readonly metrics: readonly { readonly source:string; report(model:Model):StudyScalar }[];
 readonly exitCondition?:{ readonly source:string; test(model:Model):boolean };
 readonly runMetricsCondition?:{ readonly source:string; test(model:Model):boolean };
 readonly beforeStudy?:{ readonly source:string; run(plan:readonly PlannedRun<StudyParameters>[]):void };
 readonly afterStudy?:{ readonly source:string; run(result:StudyResult<StudyParameters,Readonly<Record<string,StudyScalar>>>):void };
 readonly provenance?:Readonly<Record<string,string>>;
}
```

Explicit source-label bindings to model creation, measurement, stopping and study hooks; no source evaluation.

[Details](api-reference.md#study-contracts-general)

<a id="type-bound-behavior-space"></a>
<a id="api-308"></a>

### BoundStudy

Status: target

```ts
interface BoundStudy<Model extends StudyModel> {
 readonly spec:StudySpec;
 readonly plan:readonly PlannedRun<StudyParameters>[];
 readonly options:StudyOptions<StudyParameters,Model,Readonly<Record<string,StudyScalar>>>;
}
```

Validated Study specification, materialized run plan and ordinary experiment options.

[Details](api-reference.md#study-contracts-general)

<a id="area-storage"></a>

## storage

Target: `library-core/measurement-and-history`.

<a id="storage-save"></a>
<a id="api-326"></a>

### storage.save

Status: target

```ts
storage.save<V>(value: V): Snapshot<V, {}>
```

Save exactly the supplied supported value and optional extra state as an independent in-memory Snapshot; preserve aliases, cycles and declared component relationships.

[Details](api-reference.md#codecs)

<a id="storage-save-2"></a>
<a id="api-363"></a>

### storage.save

Status: target

```ts
storage.save<V>(value: V, options: { valueCodecs: readonly ValueCodec[] }): Snapshot<V, {}>
```

Save exactly the supplied supported value and optional extra state as an independent in-memory Snapshot; preserve aliases, cycles and declared component relationships.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-save-3"></a>
<a id="api-364"></a>

### storage.save

Status: target

```ts
storage.save<V,S>(value: V, options: { state: S; valueCodecs?: readonly ValueCodec[] }): Snapshot<V,S>
```

Save exactly the supplied supported value and optional extra state as an independent in-memory Snapshot; preserve aliases, cycles and declared component relationships.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-load"></a>
<a id="api-366"></a>

### storage.load

Status: target

```ts
storage.load<V,S>(snapshot: Snapshot<V,S>, options?: {
  valueCodecs?: readonly ValueCodec[]
}): { value: V; state: S };
```

Load the selected saved value and extra state into fresh supported objects. Never merge into an existing model or recreate executable model functions.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-encode"></a>
<a id="api-329"></a>

### storage.encode

Status: target

```ts
storage.encode<V, S>(snapshot: Snapshot<V, S>, options: { format: "snapshot-json" }): string
```

Convert the supplied value to the explicit named format or synchronous Format adapter. Returns text or bytes and performs no file access.

[Details](api-reference.md#codecs)

<a id="storage-decode"></a>
<a id="api-342"></a>

### storage.decode

Status: target

```ts
storage.decode(text: string, options: { format: "snapshot-json"; limits?: DecodeLimits }):
  WorldSnapshot<unknown> | BundleSnapshot<unknown> | DataSnapshot<unknown>
```

Validate and decode the explicit named format or synchronous Format adapter. Returns its documented data type; decoded custom model values remain untrusted until validated.

[Details](api-reference.md#complete-snapshot-validation)

<a id="storage-encode-2"></a>
<a id="api-335"></a>

### storage.encode

Status: target

```ts
storage.encode<Value, Encoded extends string | Uint8Array>(value: Value, options: { format: Format<Value, Encoded> }): Encoded
```

Convert the supplied value to the explicit named format or synchronous Format adapter. Returns text or bytes and performs no file access.

[Details](api-reference.md#storage-formats)

<a id="storage-decode-2"></a>
<a id="api-336"></a>

### storage.decode

Status: target

```ts
storage.decode<Value, Encoded extends string | Uint8Array>(data: Encoded, options: {
  format: Format<Value, Encoded>; limits?: DecodeLimits
}): Value
```

Validate and decode the explicit named format or synchronous Format adapter. Returns its documented data type; decoded custom model values remain untrusted until validated.

[Details](api-reference.md#storage-formats)

<a id="storage-history"></a>
<a id="api-338"></a>

### storage.history

Status: delivered

```ts
storage.history(options?: { capacity?: number }): History
```

Create an independent bounded numeric measurement history; capacity defaults to 300. Recording is explicit and evicts the oldest samples when full.

[Details](api-reference.md#history)

<a id="history-samples"></a>
<a id="api-340"></a>

### history.samples

Status: delivered

```ts
history.samples: readonly Sample[]
```

Read a detached chronological read-only snapshot of retained samples.

[Details](api-reference.md#history)

<a id="history-add"></a>
<a id="api-339"></a>

### history.add

Status: delivered

```ts
history.add(sample: { tick: number; values: Readonly<Record<string, number>> }): void
```

Record a detached finite numeric sample. Ticks strictly increase; the first sample establishes the metric keys.

[Details](api-reference.md#history)

<a id="history-delete"></a>
<a id="api-341"></a>

### history.delete

Status: delivered

```ts
history.delete(): void
```

Empty samples, metric keys and last-tick marker while retaining capacity. The next sample starts a new series.

[Details](api-reference.md#history)

<a id="storage-is"></a>
<a id="api-345"></a>

### storage.is

Status: target

```ts
storage.is<K extends keyof StoredKinds>(value: unknown, kind: K): value is StoredKinds[K]
```

Check the library-issued identity kind of a component or event handle and narrow its base framework type. This guard neither validates custom state nor revives deleted identities.

[Details](api-reference.md#restored-kind-validation)

<a id="storage-encode-3"></a>
<a id="api-321"></a>

### storage.encode

Status: target

```ts
storage.encode(graph: Graph, options: {
  format: "graph-json" | "graphml" | "edge-list" | "adjacency-matrix";
  nodeId?: (node: object) => string
}): string
```

Encode the explicitly selected graph text format. graph-json preserves JSON-safe GraphData; GraphML preserves supported scalar attributes and declared topology metadata. edge-list is the library's versioned UTF-8 TSV dialect with JSON-escaped fields, not a guessed two-column format. adjacency-matrix rejects mixed directions and parallel edges, requires finite nonzero edge.weight, and loses other node/edge state; zero denotes no edge. No file access.

[Details](api-reference.md#graph-interchange)

<a id="storage-decode-3"></a>
<a id="api-322"></a>

### storage.decode

Status: target

```ts
storage.decode(text: string, options: {
  format: "graph-json" | "graphml" | "edge-list" | "adjacency-matrix"
}): GraphData<unknown, unknown>
```

Decode the explicit graph format to validated detached GraphData with unknown model values. graph-json uses its versioned envelope; GraphML rejects DTDs/entities and unsupported nested attributes. edge-list requires the library's versioned TSV header and complete graph/node/edge records. adjacency-matrix validates square shape, IDs, finite entries and undirected symmetry, reconstructing nodes by ID and nonzero weight edges rather than arbitrary model state. No file access.

[Details](api-reference.md#graph-interchange)

<a id="storage-decode-4"></a>
<a id="api-323"></a>

### storage.decode

Status: target

```ts
storage.decode(text: string, options: { format: "finite-study-xml" }): readonly StudySpec[]
```

Validate and decode the explicit named format or synchronous Format adapter. Returns its documented data type; decoded custom model values remain untrusted until validated.

[Details](api-reference.md#study-behaviorspace-contract)

<a id="storage-encode-4"></a>
<a id="api-324"></a>

### storage.encode

Status: target

```ts
storage.encode(checkpoint: StudyCheckpoint<unknown,unknown>, options:{format:"study-json"}):string
```

Convert the supplied value to the explicit named format or synchronous Format adapter. Returns text or bytes and performs no file access.

[Details](api-reference.md#study-boundaries-contract)

<a id="storage-decode-5"></a>
<a id="api-325"></a>

### storage.decode

Status: target

```ts
storage.decode(text:string, options:{format:"study-json"}):StudyCheckpoint<unknown,unknown>
```

Validate and decode the explicit named format or synchronous Format adapter. Returns its documented data type; decoded custom model values remain untrusted until validated.

[Details](api-reference.md#study-boundaries-contract)

<a id="storage-decode-6"></a>
<a id="api-365"></a>

### storage.decode

Status: target

```ts
storage.decode(data: unknown, options: { format: "model-world-data"; valueCodecs?: readonly ValueCodec[] }): WorldSnapshot<unknown>
```

Validate the supported old in-memory model-state schema and convert it to a WorldSnapshot; optional value codecs adapt unsupported ordinary payload values. Nonempty presentation sections reject.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-decode-7"></a>
<a id="api-367"></a>

### storage.decode

Status: target

```ts
storage.decode(text:string, options:{format:"simple-network-json"}):SimpleNetworkData
```

Decode the explicitly selected versioned simple-network data or JSON format into validated detached canonical nodes and edges; no live Graph is created.

[Details](api-reference.md#public-resource-limits)

<a id="storage-decode-8"></a>
<a id="api-368"></a>

### storage.decode

Status: target

```ts
storage.decode(data:unknown, options:{format:"simple-network-data"}):SimpleNetworkData
```

Decode the explicitly selected versioned simple-network data or JSON format into validated detached canonical nodes and edges; no live Graph is created.

[Details](api-reference.md#public-resource-limits)

<a id="storage-decode-9"></a>
<a id="api-369"></a>

### storage.decode

Status: target

```ts
storage.decode(text: string, options: { format: "geojson"; coordinateSystem: { crs: string; units: string } }): PlanarDataset
```

Decode validated planar GeoJSON into detached features and mandatory explicit CRS/unit labels. No reprojection; XYZ coordinates reject.

[Details](api-reference.md#complete-external-codecs)

<a id="storage-encode-5"></a>
<a id="api-370"></a>

### storage.encode

Status: target

```ts
storage.encode(value: PlanarGeometry | PlanarFeature | PlanarDataset | readonly PlanarFeature[], options: { format: "geojson" }): string
```

Encode supported planar GeoJSON geometry/features. Coordinate-system labels are not written into geometry; callers retain them separately.

[Details](api-reference.md#complete-external-codecs)

<a id="storage-encode-6"></a>
<a id="api-371"></a>

### storage.encode

Status: target

```ts
storage.encode(value: readonly StudySpec[], options: { format: "finite-study-xml" }): string
```

Encode the declarative Study plan as escaped XML without translating TypeScript callbacks into source commands.

[Details](api-reference.md#complete-external-codecs)

<a id="storage-decode-10"></a>
<a id="api-372"></a>

### storage.decode

Status: target

```ts
storage.decode(text: string, options: { format: "model-world-json" }): WorldSnapshot<unknown>
```

Validate and convert the supported old model-only world JSON schema to a WorldSnapshot. Nonempty presentation sections reject; decoded custom state remains unknown.

[Details](api-reference.md#complete-snapshot-validation)

<a id="type-data-snapshot"></a>
<a id="api-333"></a>

### DataSnapshot

Status: target

```ts
type DataSnapshot<S = unknown> = Snapshot<unknown, S> & { readonly rootKind: "data" };
```

Opaque data-only Snapshot with rootKind data; loading creates supported data without manufacturing a World.

[Details](api-reference.md#storage-data)

<a id="type-format"></a>
<a id="api-334"></a>

### Format

Status: target

```ts
interface Format<Value, Encoded extends string | Uint8Array> {
  readonly id: string;
  readonly version: number;
  encode(value: Value): Encoded;
  decode(data: Encoded): Value;
}
```

Explicit synchronous ordinary-data encoder/decoder with an adapter identity and version; no implicit header or registry.

[Details](api-reference.md#storage-formats)

<a id="type-decode-limits"></a>
<a id="api-343"></a>

### DecodeLimits

Status: target

```ts
type DecodeLimits = { bytes?: number; depth?: number; records?: number; references?: number; items?: number };
```

Caller-selected caps for encoded bytes and decoded depth, records, references and items.

[Details](api-reference.md#complete-snapshot-validation)

<a id="type-stored-kinds"></a>
<a id="api-344"></a>

### StoredKinds

Status: target

```ts
type StoredKinds = {
  world: World; agent: Agent<{}>; grid: Grid<{}>; graph: Graph<object,{}>;
  input: Input; agenda: Agenda<unknown>; history: History;
  random: Random; eventHandle: EventHandle<unknown>;
};
```

Mapping from supported library identity-kind labels to their base framework types for storage.is.

[Details](api-reference.md#restored-kind-validation)

<a id="type-snapshot"></a>
<a id="api-373"></a>

### Snapshot

Status: target

```ts
Snapshot<V, S>
```

Opaque library-produced snapshot retaining inferred root V and extra-state S types in memory. Read-only rootKind is world, bundle or data; only library-created snapshots are accepted.

[Details](api-reference.md#codecs)

<a id="type-world-snapshot"></a>
<a id="api-374"></a>

### WorldSnapshot

Status: target

```ts
WorldSnapshot<S>
```

`Snapshot<World, S>` with read-only rootKind "world". After decoding, S is unknown; loading the narrowed snapshot yields a World.

[Details](api-reference.md#codecs)

<a id="type-bundle-snapshot"></a>
<a id="api-375"></a>

### BundleSnapshot

Status: target

```ts
BundleSnapshot<S>
```

`Snapshot<Readonly<Record<string, unknown>>, S>` with read-only rootKind "bundle". After decoding, bundle field values and extra state require caller validation.

[Details](api-reference.md#codecs)

<a id="type-sample"></a>
<a id="api-376"></a>

### Sample

Status: delivered

```ts
Sample
```

Detached observation containing a finite nonnegative numeric tick and a record of finite numeric metric values. History samples are returned read-only in chronological insertion order.

[Details](api-reference.md#history)

<a id="type-history"></a>
<a id="api-377"></a>

### History

Status: delivered

```ts
History
```

Bounded independent measurement container. Explicit add records observations; samples exposes retained observations; delete resets samples, metric keys and last-tick marker while retaining capacity.

[Details](api-reference.md#history)

<a id="type-simple-network-data"></a>
<a id="api-379"></a>

### SimpleNetworkData

Status: target

```ts
interface SimpleNetworkData { readonly directed:boolean; readonly nodes:readonly string[]; readonly edges:readonly {readonly from:string;readonly to:string}[] }
```

Detached canonical versioned simple-network data containing direction, node IDs and endpoint pairs.

[Details](api-reference.md#public-resource-limits)

<a id="type-wire-value"></a>
<a id="api-346"></a>

### WireValue

Status: target

```ts
type WireValue = null | boolean | string | number
  | { tag: "undefined" }
  | { tag: "bigint"; decimal: string }
  | { tag: "number"; value: "negative-zero" }
  | { tag: "ref"; id: string };
```

Snapshot scalar value or tagged undefined, bigint, negative-zero or record reference.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-ref"></a>
<a id="api-347"></a>

### Ref

Status: target

```ts
type Ref = { tag: "ref"; id: string };
```

Reference to another record identity inside one validated snapshot graph.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-wire-envelope"></a>
<a id="api-348"></a>

### WireEnvelope

Status: target

```ts
type WireEnvelope = {
  framework: "agent-loom"; version: 1; rootKind: "world" | "bundle" | "data";
  root: WireValue; state: WireValue; records: readonly WireRecord[];
};
```

Versioned snapshot root discriminator, root value, extra state and complete record graph.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-wire-record"></a>
<a id="api-349"></a>

### WireRecord

Status: target

```ts
type WireRecord =
  | { id: string; kind: "object"; properties: readonly (readonly [string, WireValue])[] }
  | { id: string; kind: "array"; length: number; entries: readonly (readonly [number, WireValue])[] }
  | { id: string; kind: "map"; entries: readonly (readonly [WireValue, WireValue])[] }
  | { id: string; kind: "set"; entries: readonly WireValue[] }
  | { id: string; kind: "date"; milliseconds: number }
  | { id: string; kind: "buffer"; bytes: readonly number[] }
  | { id: string; kind: "view"; buffer: Ref; constructor: "Int8Array" | "Uint8Array" | "Uint8ClampedArray" | "Int16Array" | "Uint16Array" | "Int32Array" | "Uint32Array" | "Float32Array" | "Float64Array" | "BigInt64Array" | "BigUint64Array" | "DataView"; byteOffset: number; length: number; byteOrder: "little" | "big" }
  | { id: string; kind: "regexp"; source: string; flags: string; lastIndex: number }
  | WorldRecord | AgentRecord | GridRecord | FieldRecord | GraphRecord | EdgeRecord
  | RandomRecord | InputRecord | AgendaRecord | HistoryRecord
  | HandleRecord | ExtensionRecord;
```

Closed union of supported ordinary-data, framework, handle and extension snapshot records.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-world-record"></a>
<a id="api-350"></a>

### WorldRecord

Status: target

```ts
type WorldRecord = {
  id: string; kind: "world"; revision: 1; modelId: string;
  tick: number; space: (Space & Required<Pick<Space, "dimensions" | "boundary">>) | null; random: Ref;
  components: readonly Ref[]; compatibility: null | {
    profile: "mt-word-stream/1"; agentOwn: readonly string[]; edgeOwn: readonly string[];
    agentGroups: readonly { name: string; own: readonly string[] }[];
    edgeGroups: readonly { name: string; direction: "directed" | "undirected"; own: readonly string[] }[];
    agentMembership: readonly (readonly [Ref,string,number])[];
    edgeMembership: readonly (readonly [Ref,string,number])[];
    nextAgentId: number; nextEdgeId: number;
  };
};
```

Stored clock, optional normalized space, RNG reference, component membership and explicit compatibility provenance.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-agent-record"></a>
<a id="api-351"></a>

### AgentRecord

Status: target

```ts
type AgentRecord = {
  id: string; kind: "agent"; revision: 1; modelId: string;
  dimensions: 2 | 3; position: readonly number[];
  right: readonly [number, number, number]; forward: readonly [number, number, number];
  state: Ref;
  travel: null | {
    source: Ref; points: readonly (readonly number[])[];
    next: number; context: (Space & Required<Pick<Space, "dimensions" | "boundary">>) | null;
  };
};
```

Stored identity, spatial basis, custom state and optional path continuation; contains no presentation state.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-grid-record"></a>
<a id="api-352"></a>

### GridRecord

Status: target

```ts
type GridRecord = {
  id: string; kind: "grid"; revision: 1; modelId: string;
  space: Space & Required<Pick<Space, "dimensions" | "boundary">>; cellSize: number; fields: readonly Ref[];
};
```

Stored normalized grid space, cell spacing and complete ordered field references.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-field-record"></a>
<a id="api-353"></a>

### FieldRecord

Status: target

```ts
type FieldRecord = {
  id: string; kind: "field"; revision: 1; modelId: string;
  grid: Ref; index: number; state: Ref;
};
```

Stored owning grid/index and custom state; coordinates derive from the grid.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-graph-record"></a>
<a id="api-354"></a>

### GraphRecord

Status: target

```ts
type GraphRecord = {
  id: string; kind: "graph"; revision: 1; modelId: string;
  parallel: boolean; selfLoops: boolean; nextKey: number;
  nodes: readonly Ref[]; edges: readonly Ref[]; edgeDefaults: Ref;
};
```

Stored graph policies, key counter, node/edge membership and default edge-state template.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-edge-record"></a>
<a id="api-355"></a>

### EdgeRecord

Status: target

```ts
type EdgeRecord = {
  id: string; kind: "edge"; revision: 1; modelId: string;
  graph: Ref; from: Ref; to: Ref; directed: boolean; key: string | null;
  state: Ref; path: Ref | null; tieMode: "none" | "free" | "fixed";
};
```

Stored owning graph, endpoints, direction, key, custom state, optional geometry and motion-coupling mode.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-random-record"></a>
<a id="api-356"></a>

### RandomRecord

Status: target

```ts
type RandomRecord = RandomState & { id: string; kind: "random"; revision: 1 };
```

Stored versioned RNG continuation with snapshot record identity.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-input-record"></a>
<a id="api-357"></a>

### InputRecord

Status: target

```ts
type InputRecord = {
  id: string; kind: "input"; revision: 1; modelId: string;
  bindings: readonly { target: Ref; property: string; type: "number" | "string" | "boolean";
    min?: number; max?: number; step?: number }[];
};
```

Stored property bindings with target references, scalar kinds and optional numeric constraints.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-agenda-record"></a>
<a id="api-358"></a>

### AgendaRecord

Status: target

```ts
type AgendaRecord = {
  id: string; kind: "agenda"; revision: 1; modelId: string; time: number;
  nextSequence: number; events: readonly {
    eventId: string; at: number; priority: number; sequence: number; data: WireValue
  }[];
};
```

Stored event time, insertion counter and ordered pending event data.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-history-record"></a>
<a id="api-359"></a>

### HistoryRecord

Status: target

```ts
type HistoryRecord = {
  id: string; kind: "history"; revision: 1; capacity: number;
  keys: readonly string[] | null; lastTick: number | null;
  samples: readonly { tick: number; values: readonly number[] }[];
};
```

Stored capacity, metric keys, last accepted tick and retained numeric samples.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-handle-record"></a>
<a id="api-360"></a>

### HandleRecord

Status: target

```ts
type HandleRecord = {
  id: string; kind: "handle"; revision: 1;
  owner: Ref; domain: "agenda-event"; localId: string;
};
```

Stored Agenda-event handle with owner reference and previously issued local event identity.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-extension-record"></a>
<a id="api-361"></a>

### ExtensionRecord

Status: target

```ts
type ExtensionRecord = {
  id: string; kind: "extension"; codec: string; version: number; payload: WireValue;
};
```

Stored application-value payload identified by codec name and version.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-value-codec"></a>
<a id="api-362"></a>

### ValueCodec

Status: target

```ts
type ValueCodec = {
  id: string; version: number;
  accepts(value: unknown): boolean;
  encode(value: unknown): unknown;
  decode(payload: unknown): unknown;
};
```

Optional adapter for otherwise unsupported application values inside snapshots; cannot override framework or active-resource handling.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-hash"></a>
<a id="api-457"></a>

### storage.hash

Status: planned

```ts
storage.hash(snapshot: Snapshot<unknown, unknown>): string
```

Return a canonical hash of a Snapshot: equal supported state gives an equal hash. Pure; consumes no randomness. Depends on the target storage.save.

[Details](api-reference.md#storage-state-hash)

<a id="area-limits"></a>

## limits

Target: open; limits split per owning module or stay together (see [open decisions](#open-decisions)).

<a id="limits-stream-profile"></a>
<a id="api-378"></a>

### limits.declarations

Status: target

```ts
limits.declarations = {
  declarations: 1000, creation: 1000000, valueDepth: 32, valueNodes: 100000,
  randomIterations: 1000000
};
```

Read deeply frozen compatibility limits for declarations, creation, value traversal and random rejection iterations.

[Details](api-reference.md#public-resource-limits)

<a id="limits-geojson"></a>
<a id="api-378-geojson"></a>

### limits.geojson

Status: target

```ts
limits.geojson = {
  textBytes: 8388608, features: 10000, positions: 100000, polygonPositions: 2048,
  coordinateMagnitude: 1000000000, propertyDepth: 32, propertyNodes: 100000
};
```

Read deeply frozen planar GeoJSON limits for text size, feature/coordinate counts, coordinate magnitude and property traversal.

[Details](api-reference.md#public-resource-limits)

<a id="limits-compatibility-network"></a>
<a id="api-378-simpleNetwork"></a>

### limits.simpleNetwork

Status: target

```ts
limits.simpleNetwork = { nodes: 1024, edges: 32768, idLength: 256 };
```

Read deeply frozen limits for the explicit versioned simple-network import profile; these do not cap general live Graph models.

[Details](api-reference.md#public-resource-limits)

<a id="limits-behaviorspace"></a>
<a id="api-378-behaviorspace"></a>

### limits.studyXml

Status: target

```ts
limits.studyXml = {
  textBytes: 1048576, depth: 8, elements: 20000, entityReferences: 100000,
  studies: 100, metrics: 32, sourceLength: 65536
};
```

Read deeply frozen bounds for declarative Study XML parsing, studies, metrics and source labels.

[Details](api-reference.md#public-resource-limits)

<a id="limits-study"></a>
<a id="api-378-study"></a>

### limits.study

Status: target

```ts
limits.study = {
  axisCount: 32, parameterCount: 128, nameLength: 128, stringLength: 65536, scenarioCount: 10000,
  runCount: 10000, stepCount: 1000000, totalStepCount: 10000000, totalSampleCount: 1000000
};
```

Read deeply frozen finite-study bounds for parameter axes, scenarios, runs, completed steps and recorded samples.

[Details](api-reference.md#public-resource-limits)

<a id="area-exports-and-shared-types"></a>

## Exports and shared types

Target: package root `index.ts`; shared coordinate types are declared structurally where needed.

<a id="exports-agent-loom"></a>
<a id="api-1"></a>

### agent-loom

Status: target

```ts
agent-loom
```

Exports Agent, Grid, Graph, Input, Random, World, run, Agenda, stats, geometry, studies and limits.

[Details](api-reference.md#public-imports)

<a id="exports-agent-loom-storage"></a>
<a id="api-8"></a>

### agent-loom/storage

Status: target

```ts
agent-loom/storage
```

Exports storage and the associated persistence types; file/database access remains caller-owned.

[Details](api-reference.md#public-imports)

<a id="exports-agent-loom-studies-node"></a>
<a id="api-9"></a>

### agent-loom/studies/node

Status: target

```ts
agent-loom/studies/node
```

Exports studies with the native Node worker overload and the serial study contracts. Node-only execution is explicit.

[Details](api-reference.md#study-worker-contract)

<a id="type-space"></a>
<a id="api-2"></a>

### Space

Status: delivered

```ts
interface Space {
  readonly x: number;
  readonly y: number;
  readonly z?: number;
  readonly dimensions?: 2 | 3;
  readonly boundary?: "hard" | "wrap" | {
    readonly x?: "hard" | "wrap";
    readonly y?: "hard" | "wrap";
    readonly z?: "hard" | "wrap";
  };
}
```

Centered finite XY or XYZ extents with optional dimension and boundary inputs; returned component spaces contain normalized immutable dimension and boundary values.

[Details](api-reference.md#space-type)

<a id="type-vector"></a>
<a id="api-6"></a>

### Vector

Status: delivered

```ts
type Vector = { readonly x?: number; readonly y?: number; readonly z?: number };
```

Structural x/y/z displacement data. Supported omitted components mean zero; supplied components must be finite and match the operation dimension.

[Details](api-reference.md#space-type)

<a id="type-component"></a>
<a id="api-7"></a>

### Component

Status: target

```ts
type Component = Agent | Grid | Graph | Input | Agenda;
```

World membership accepts Agent, Grid, Graph, Input or Agenda. Each component has at most one World owner.

[Details](api-reference.md#space-type)

<a id="type-position"></a>
<a id="api-168"></a>

### Position

Status: delivered

```ts
type Position = { readonly x:number; readonly y:number; readonly z?:number };
```

Finite x/y coordinates with optional z; the operation’s spatial context determines the required dimension.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-command-result"></a>
<a id="api-458"></a>

### CommandResult

Status: planned

```ts
type CommandResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: string }; // reason: stable kebab-case code
```

Return type of a rule-checked action. A rejection changes nothing, including Random state. Declared structurally, so a module does not need to import it.

[Details](api-reference.md#command-result)

## Additive ordinary tools

The root exports `measurements`, `twoPhase` and `continuous` add pure measurement projection, a synchronous compute/commit barrier and linear threshold calculations. World activation also accepts fixed and stable priority ordering. Their [reference contracts](api-reference.md#additive-measurement-and-update-tools) and [frozen examples](../execution-studies/STATUS.md) supplement the original operation inventory; they do not imply complete continuation or external engine compatibility.

<a id="area-topology"></a>

## topology

Target: `library-core/polygon-layout` (today `library/grid/topology/`).

Finite planar layouts: square, hexagonal, authored and quadrilateral cells with explicit neighbor and boundary queries. Layout-backed grids are listed under [Grid](#area-grid); planar measurements and edits under [geometry](#area-geometry).

<a id="topology-square"></a>
<a id="api-459"></a>

### topology.square

Status: delivered

```ts
topology.square(options: { columnCount: number; rowCount: number; cellSize?: number }): Layout
```

Create row-major square cells from the origin; cellSize defaults to 1.

[Details](../grid-parcels/API.md#topology-generation)

<a id="topology-hex"></a>
<a id="api-460"></a>

### topology.hex

Status: delivered

```ts
topology.hex(options: { columnCount: number; rowCount: number; cellRadius?: number; orientation?: "pointy" | "flat" }): Layout
```

Create row-major hexagonal cells; cellRadius defaults to 1 and orientation to "pointy".

[Details](../grid-parcels/API.md#topology-generation)

<a id="topology-from-polygons"></a>
<a id="api-461"></a>

### topology.fromPolygons

Status: delivered

```ts
topology.fromPolygons(options: { polygons: readonly PlanarPolygon[] }): Layout
```

Create a layout from authored conforming polygons; overlaps and nonconforming contacts reject.

[Details](../grid-parcels/API.md#topology-generation)

<a id="topology-quadrilaterals"></a>
<a id="api-462"></a>

### topology.quadrilaterals

Status: delivered

```ts
topology.quadrilaterals(options: { ringCount: number; edgeLength?: number; random: Random }): Layout
```

Pair triangles of a finite hexagonal patch, then refine every cell into three or four quads. ringCount is an integer in 1..7; edgeLength defaults to 1; the supplied Random drives pairing.

[Details](../grid-parcels/API.md#topology-generation)

<a id="topology-relax"></a>
<a id="api-463"></a>

### topology.relax

Status: delivered

```ts
topology.relax(options: { layout: Layout; method: "square-target"; iterationCount: number }): Layout
```

Apply synchronous square-target forces and return a fresh immutable layout; the input layout is unchanged.

[Details](../grid-parcels/API.md#topology-generation)

<a id="type-layout"></a>
<a id="api-464"></a>

### Layout

Status: delivered

```ts
Layout
```

Detached immutable finite XY topology. Cell keys have meaning only within their layout.

[Details](../grid-parcels/API.md#layout-queries)

<a id="layout-cells"></a>
<a id="api-465"></a>

### layout.cells

Status: delivered

```ts
layout.cells: readonly number[] // readonly
```

Cell keys 0..n-1 in polygon order.

[Details](../grid-parcels/API.md#layout-queries)

<a id="layout-polygon"></a>
<a id="api-466"></a>

### layout.polygon

Status: delivered

```ts
layout.polygon(options: { cell: number }): PlanarPolygon
```

Return the frozen hole-free polygon of one cell.

[Details](../grid-parcels/API.md#layout-queries)

<a id="layout-neighbors"></a>
<a id="api-467"></a>

### layout.neighbors

Status: delivered

```ts
layout.neighbors(options: { cell: number }): readonly number[]
```

Return cells sharing at least one complete boundary edge, ascending.

[Details](../grid-parcels/API.md#layout-queries)

<a id="layout-cell-at"></a>
<a id="api-468"></a>

### layout.cellAt

Status: delivered

```ts
layout.cellAt(options: { position: Position }): number | undefined
```

Return the first cell, in key order, whose closed polygon contains the position.

[Details](../grid-parcels/API.md#layout-queries)

<a id="layout-shared-boundary"></a>
<a id="api-469"></a>

### layout.sharedBoundary

Status: delivered

```ts
layout.sharedBoundary(options: { firstCell: number; secondCell: number }): readonly BoundarySegment[]
```

Return shared edges in the first cell's ring order; empty for non-neighbors.

[Details](../grid-parcels/API.md#layout-queries)

<a id="type-boundary-segment"></a>
<a id="api-470"></a>

### BoundarySegment

Status: delivered

```ts
type BoundarySegment = readonly [PlanarXY, PlanarXY];
```

One shared boundary edge between two layout cells.

[Details](../grid-parcels/API.md#layout-queries)

<a id="area-continuous"></a>

## continuous

Target: `library-core/continuous`.

Pure linear progression and threshold-crossing calculations between explicit events.

<a id="continuous-linear"></a>
<a id="api-471"></a>

### continuous.linear

Status: delivered

```ts
continuous.linear(input: { value: number; rate: number; duration: number }): number
```

Return value + rate * duration for finite inputs and a finite nonnegative duration; nonfinite results reject.

[Details](api-reference.md#additive-measurement-and-update-tools)

<a id="continuous-crossing"></a>
<a id="api-472"></a>

### continuous.crossing

Status: delivered

```ts
continuous.crossing(input: {
  from: number; to: number; threshold: number; duration: number;
  direction?: CrossingDirection | "either"
}): ThresholdCrossing | undefined
```

Return where a linear change from `from` to `to` over duration reaches threshold, or undefined for zero duration, no crossing or another direction (default "either"). The endpoint returns exactly duration.

[Details](api-reference.md#additive-measurement-and-update-tools)

<a id="type-crossing-direction"></a>
<a id="api-473"></a>

### CrossingDirection

Status: delivered

```ts
type CrossingDirection = "rising" | "falling";
```

Direction of a threshold crossing.

[Details](api-reference.md#additive-measurement-and-update-tools)

<a id="type-threshold-crossing"></a>
<a id="api-474"></a>

### ThresholdCrossing

Status: delivered

```ts
interface ThresholdCrossing {
  readonly elapsed: number;
  readonly value: number;
  readonly direction: CrossingDirection;
}
```

When, at which value and in which direction a linear change crosses a threshold.

[Details](api-reference.md#additive-measurement-and-update-tools)

<a id="area-two-phase"></a>

## twoPhase

Target: `library-core/execution`.

A synchronous compute-then-commit barrier for simultaneous updates.

<a id="two-phase"></a>
<a id="api-475"></a>

### twoPhase

Status: delivered

```ts
twoPhase<T, Proposal>(source: Iterable<T>, actions: {
  compute(member: T): Proposal;
  commit(member: T, proposal: Proposal): unknown;
}): void
```

Compute every proposal before committing any. Members are deduplicated by identity and visited in source order in both phases; no clock advances. A failure stops without rollback.

[Details](api-reference.md#additive-measurement-and-update-tools)

<a id="area-measurements"></a>

## measurements

Target: `library-core/measurement-and-history`.

Reusable pure projections of model state into finite numeric records. Bounded History is listed under [storage](#area-storage).

<a id="measurements-define"></a>
<a id="api-476"></a>

### measurements.define

Status: delivered

```ts
measurements.define<Model, Values extends Readonly<Record<string, number>>>(
  project: (model: Model) => Values,
): Measurement<Model, Values>
```

Wrap a synchronous projection; each read calls it once and returns a frozen copy of its finite numeric own data.

[Details](api-reference.md#additive-measurement-and-update-tools)

<a id="type-measurement"></a>
<a id="api-477"></a>

### Measurement

Status: delivered

```ts
interface Measurement<Model, Values extends Readonly<Record<string, number>>> {
  read(model: Model): Readonly<Values>;
}
```

A reusable projection created by measurements.define. It owns no model state or sampling schedule.

[Details](api-reference.md#additive-measurement-and-update-tools)

<a id="area-budget"></a>

## Budget

Target: `library-city/economy`.

Budgets with integer money and atomic transfers. A Budget works with any agents, not only inside a city.

<a id="budget-add"></a>
<a id="api-478"></a>

### Budget.create

Status: planned

```ts
Budget.create(options?: { money?: number }): Budget
```

Create a budget; money defaults to 0 and must be a safe integer (RangeError otherwise).

[Details](api-reference.md#budget)

<a id="budget-money"></a>
<a id="api-479"></a>

### budget.money

Status: planned

```ts
budget.money: number // readonly integer
```

Current balance; changes only through transfer.

[Details](api-reference.md#budget)

<a id="budget-transfer"></a>
<a id="api-480"></a>

### budget.transfer

Status: planned

```ts
budget.transfer(options: { to: Budget; amount: number }): CommandResult
```

Move a positive integer amount atomically. A shortfall returns `{ ok: false, reason: "insufficient-money" }` and changes neither balance; a non-integer or nonpositive amount throws RangeError.

[Details](api-reference.md#budget)

<a id="area-energy-supply"></a>

## EnergySupply

Target: `library-city/energy-supply`.

Supply per connected component of a network: connected consumers share limited production. Being connected and being supplied are different statements.

<a id="energy-supply-add"></a>
<a id="api-481"></a>

### EnergySupply.create

Status: planned

```ts
EnergySupply.create<N extends object>(options: {
  network: Graph<N>;
  production?: (node: N) => number; // default 0
  demand?: (node: N) => number;     // default 0
}): EnergySupply<N>
```

Bind the rule to an existing graph; nothing is computed until advance. Amounts are abstract units per tick and must be finite and nonnegative.

[Details](api-reference.md#energy-supply)

<a id="energy-supply-advance"></a>
<a id="api-482"></a>

### energySupply.advance

Status: planned

```ts
energySupply.advance(): void
```

Recompute production and demand per weakly connected component from the current graph. Deterministic; consumes no randomness.

[Details](api-reference.md#energy-supply)

<a id="energy-supply-is-supplied"></a>
<a id="api-483"></a>

### energySupply.isSupplied

Status: planned

```ts
energySupply.isSupplied(node: N): boolean
```

Return true when the node's component produced at least its demand in the last advance.

[Details](api-reference.md#energy-supply)

<a id="energy-supply-observe"></a>
<a id="api-484"></a>

### energySupply.observe

Status: planned

```ts
energySupply.observe(): {
  readonly components: readonly {
    readonly nodeCount: number;
    readonly production: number;
    readonly demand: number;
    readonly servedShare: number; // min(1, production / demand); 1 without demand
  }[];
}
```

Return a detached, JSON-serializable observation in component order; changes nothing.

[Details](api-reference.md#energy-supply)

<a id="area-public-transport"></a>

## PublicTransport

Target: `library-city/public-transport`.

Trip cohorts travel over a network with edge capacities; load and congestion are capacity counters. A cohort's weight is an ordinary property of this system, not a core concept.

<a id="public-transport-add"></a>
<a id="api-485"></a>

### PublicTransport.create

Status: planned

```ts
PublicTransport.create<N extends object, E extends object>(options: {
  network: Graph<N, E>;
  capacity?: (edge: Edge<N, E>) => number; // default 100 trips per tick
  scale?: number;                          // default 1; fixed at setup
}): PublicTransport<N, E>
```

Bind the system to a network. scale is the largest cohort weight: 1 moves every trip as its own cohort, 100 groups up to 100 trips. A non-integer or nonpositive scale throws RangeError.

[Details](api-reference.md#public-transport)

<a id="public-transport-advance"></a>
<a id="api-486"></a>

### publicTransport.advance

Status: planned

```ts
publicTransport.advance(options: {
  trips: readonly { from: N; to: N; count: number }[];
}): void
```

Split each trip group into integer-weight cohorts, route them with graph.findRoute and add each weight to the load of every edge on the route. Unreachable trips are counted, never dropped silently. Depends on the target graph.findRoute.

[Details](api-reference.md#public-transport)

<a id="public-transport-observe"></a>
<a id="api-487"></a>

### publicTransport.observe

Status: planned

```ts
publicTransport.observe(): {
  readonly edges: readonly {
    readonly edgeId: string;
    readonly load: number;
    readonly capacity: number;
    readonly congestion: number; // min(1, load / capacity)
  }[];
  readonly unroutedTripCount: number;
}
```

Return a detached, JSON-serializable observation in graph edge order; changes nothing.

[Details](api-reference.md#public-transport)

<a id="area-ui-authoring"></a>

## UI authoring

Target: `ui-web` (today `ui/`, entry `ui/index.ts`).

A separate presentation API, not part of the headless package. The [UI API inventory](../ui/api-table.md) and [UI API reference](../ui/api-reference.md) remain the detailed owners; each entry names its UI IDs instead of repeating the contract. The model owns state, validation and time; the UI reads observations and changes state only through model actions.

<a id="define-ui"></a>
<a id="api-488"></a>

### defineUI

Status: delivered

```ts
defineUI<P extends object, M extends ModelInstance>(definition: Definition<P, M>, spec: UISpec<P, M>): BoundEntry
```

Bind a model definition to one flat UI description without creating the model at import. The source declares four overloads for UISpec, ChangeUISpec and monitor-typed specs. See [UI-001](../ui/api-table.md), [UI-070](../ui/api-table.md).

[Details](../ui/api-reference.md#define-ui)

<a id="type-ui-spec"></a>
<a id="api-489"></a>

### UISpec

Status: delivered

```ts
UISpec<P, M>
```

The flat authoring description: setup, live, actions, monitors, completion, source, drawing and the required views. See [UI-002](../ui/api-table.md), [UI-010](../ui/api-table.md), [UI-013](../ui/api-table.md), [UI-016](../ui/api-table.md), [UI-019](../ui/api-table.md), [UI-020](../ui/api-table.md), [UI-021](../ui/api-table.md), [UI-030](../ui/api-table.md), [UI-060](../ui/api-table.md).

[Details](../ui/api-reference.md#principles)

<a id="type-change-ui-spec"></a>
<a id="api-490"></a>

### ChangeUISpec

Status: delivered

```ts
ChangeUISpec<P, M>
```

The same flat description with an explicit default write for keyed live fields. See [UI-081](../ui/api-table.md).

[Details](../ui/api-reference.md#live)

<a id="type-live-changes"></a>
<a id="api-491"></a>

### LiveChanges

Status: delivered

```ts
type LiveChanges<P extends object> = Partial<P>;
```

One decoded parameter change passed to a default live write. See [UI-081](../ui/api-table.md).

[Details](../ui/api-reference.md#live)

<a id="type-bound-entry"></a>
<a id="api-492"></a>

### BoundEntry

Status: delivered

```ts
BoundEntry
```

A model bound to its UI description: title, optional description and mount. See [UI-004](../ui/api-table.md).

[Details](../ui/api-reference.md#lifecycle)

<a id="type-observation"></a>
<a id="api-493"></a>

### Observation

Status: delivered

```ts
Observation<T>
```

The detached observation type inferred from a model definition or instance. See [UI-078](../ui/api-table.md).

[Details](../ui/api-reference.md#model)

<a id="type-monitor"></a>
<a id="api-494"></a>

### Monitor

Status: delivered

```ts
Monitor<S, V>
```

An extracted monitor with observation S and scalar V; a formatter accepts only the paired getter result. See [UI-019](../ui/api-table.md), [UI-077](../ui/api-table.md), [UI-079](../ui/api-table.md).

[Details](../ui/api-reference.md#monitors)

<a id="type-view"></a>
<a id="api-495"></a>

### View

Status: delivered

```ts
View<S>
```

The view union: network, grid, spatial, line, bar, scatter and table. See [UI-031](../ui/api-table.md), [UI-032](../ui/api-table.md), [UI-033](../ui/api-table.md), [UI-034](../ui/api-table.md), [UI-035](../ui/api-table.md).

[Details](../ui/api-reference.md#views)

<a id="type-inspector"></a>
<a id="api-496"></a>

### Inspector

Status: delivered

```ts
Inspector<S>
```

A view that shows one row for the current selection. See [UI-036](../ui/api-table.md), [UI-080](../ui/api-table.md).

[Details](../ui/api-reference.md#inspector)

<a id="type-graph-node-data"></a>
<a id="api-497"></a>

### GraphNodeData

Status: delivered

```ts
GraphNodeData
```

A detached node for network and spatial views. See [UI-040](../ui/api-table.md), [UI-041](../ui/api-table.md).

[Details](../ui/api-reference.md#network)

<a id="type-graph-edge-data"></a>
<a id="api-498"></a>

### GraphEdgeData

Status: delivered

```ts
GraphEdgeData
```

A detached edge for network views. See [UI-042](../ui/api-table.md), [UI-043](../ui/api-table.md).

[Details](../ui/api-reference.md#network)

<a id="type-cell"></a>
<a id="api-499"></a>

### Cell

Status: delivered

```ts
Cell
```

A rendered cell record; presentation data, not a domain Field. See [UI-044](../ui/api-table.md).

[Details](../ui/api-reference.md#grid)

<a id="type-grid-data"></a>
<a id="api-500"></a>

### GridData

Status: delivered

```ts
GridData
```

Rectangular rendered cells for the grid view. See [UI-045](../ui/api-table.md).

[Details](../ui/api-reference.md#grid)

<a id="type-spatial-agent"></a>
<a id="api-501"></a>

### SpatialAgent

Status: delivered

```ts
SpatialAgent
```

A positioned symbol in the spatial view. See [UI-046](../ui/api-table.md), [UI-052](../ui/api-table.md), [UI-083](../ui/api-table.md).

[Details](../ui/api-reference.md#spatial)

<a id="type-spatial-data"></a>
<a id="api-502"></a>

### SpatialData

Status: delivered

```ts
SpatialData
```

Agents, optional cell backdrop, segments and labels for the spatial view. See [UI-047](../ui/api-table.md), [UI-048](../ui/api-table.md), [UI-049](../ui/api-table.md), [UI-054](../ui/api-table.md).

[Details](../ui/api-reference.md#spatial)

<a id="type-spatial-segment"></a>
<a id="api-503"></a>

### SpatialSegment

Status: delivered

```ts
SpatialSegment
```

A stroke between two world positions. See [UI-050](../ui/api-table.md).

[Details](../ui/api-reference.md#spatial)

<a id="type-spatial-label"></a>
<a id="api-504"></a>

### SpatialLabel

Status: delivered

```ts
SpatialLabel
```

A nonselectable text annotation. See [UI-053](../ui/api-table.md).

[Details](../ui/api-reference.md#spatial)

<a id="type-series"></a>
<a id="api-505"></a>

### Series

Status: delivered

```ts
Series
```

A labeled series of numeric points for line and scatter charts. See [UI-051](../ui/api-table.md).

[Details](../ui/api-reference.md#charts)

<a id="type-bar-series"></a>
<a id="api-506"></a>

### BarSeries

Status: delivered

```ts
BarSeries
```

A labeled bar series with categorical or numeric x values. See [UI-075](../ui/api-table.md).

[Details](../ui/api-reference.md#charts)

<a id="type-axis-spec"></a>
<a id="api-507"></a>

### AxisSpec

Status: delivered

```ts
AxisSpec
```

Optional chart axis label and unit. See [UI-076](../ui/api-table.md).

[Details](../ui/api-reference.md#charts)

<a id="type-drawing-intent"></a>
<a id="api-508"></a>

### DrawingIntent

Status: target

```ts
DrawingIntent
```

Pointer intent passed to `UISpec.drawing.intent`. Supported by the host, but `ui/index.ts` does not export the named type. See [UI-061](../ui/api-table.md).

[Details](../ui/api-reference.md#drawing)

<a id="indexed-color"></a>
<a id="api-509"></a>

### indexedColor

Status: delivered

```ts
indexedColor(color: number): string
```

Convert a finite indexed numeric color to a presentation color. See [UI-062](../ui/api-table.md).

[Details](../ui/api-reference.md#palette)

<a id="scientific-palette"></a>
<a id="api-510"></a>

### scientificPalette

Status: delivered

```ts
scientificPalette: Readonly<{ neutral: string; waiting: string; active: string; completed: string; unavailable: string }>
```

Shared readonly presentation colors for scientific state categories. See [UI-063](../ui/api-table.md).

[Details](../ui/api-reference.md#palette)

<a id="collection-diagram"></a>
<a id="api-511"></a>

### collectionDiagram

Status: delivered

```ts
collectionDiagram(rows: readonly CollectionRow[]): SpatialData
```

Pure layout of detached collections into spatial view data; coordinates are diagram units. See [UI-082](../ui/api-table.md).

[Details](../ui/api-reference.md#collection-diagrams)

<a id="type-collection-row"></a>
<a id="api-512"></a>

### CollectionRow

Status: delivered

```ts
CollectionRow
```

One collection-diagram row: identified items, an anonymous count or used units of a capacity. See [UI-082](../ui/api-table.md).

[Details](../ui/api-reference.md#collection-diagrams)

<a id="type-collection-item"></a>
<a id="api-513"></a>

### CollectionItem

Status: delivered

```ts
CollectionItem
```

One identified item in a collection row. See [UI-082](../ui/api-table.md).

[Details](../ui/api-reference.md#collection-diagrams)

<a id="area-model-contract"></a>

## Model contract

Target: `models/<slug>/model.ts` + `ui.ts`.

Every model is a flat folder with two files. `model.ts` exports `model`, a headless `Definition<P, M>` with title, description, inputs and create; it imports only public APIs and contains no UI, DOM or framework code. `ui.ts` exports `ui`, a `BoundEntry` from `defineUI`: short, declarative bindings of inputs, actions, observations and views. `read()` stays the model observation method until a recorded naming migration; library objects use `observe()`. A step is one procedure invocation; tick is model time; a host frame is neither.

<a id="type-model-instance"></a>
<a id="api-514"></a>

### ModelInstance

Status: delivered

```ts
interface ModelInstance {
  read(): unknown;
  advance(stepCount?: number): void;
  dispose?(): void;
}
```

The minimum instance shape the UI host uses: read returns detached observation data, advance runs procedure steps, dispose is optional. Exported by `ui/index.ts`. See [UI-003](../ui/api-table.md).

[Details](../ui/api-reference.md#model)

<a id="type-definition"></a>
<a id="api-515"></a>

### Definition

Status: target

```ts
interface Definition<P extends object, M> {
  readonly title: string;
  readonly description?: string;
  readonly inputs: Inputs<P>;
  readonly create: (options?: Partial<P>) => M;
}
```

Headless model description with canonical input descriptors and create. Implemented in `models/definition.ts` and used by every model, but exported by no public entry. See [UI-005](../ui/api-table.md).

[Details](../ui/api-reference.md#model)

<a id="type-input-descriptor"></a>
<a id="api-516"></a>

### Input

Status: target

```ts
type Input<T> = [T] extends [number] ? {
  readonly kind: "number"; readonly default: T;
  readonly min?: number; readonly max?: number; readonly step?: number; readonly integer?: boolean;
} : [T] extends [boolean] ? {
  readonly kind: "boolean"; readonly default: T;
} : [T] extends [string] ? {
  readonly kind: "choice"; readonly default: T; readonly options: readonly T[];
} | {
  readonly kind: "text"; readonly default: T;
} : never;
```

Descriptor for one model input with a playable default. It describes a setup value; it is not the headless [Input](#area-input) binding object. Implemented in `models/definition.ts`, not exported. See [UI-006](../ui/api-table.md).

[Details](../ui/api-reference.md#model)

<a id="type-inputs"></a>
<a id="api-517"></a>

### Inputs

Status: target

```ts
type Inputs<P extends object> = {
  readonly [K in keyof P]-?: Input<Exclude<P[K], undefined>>;
};
```

One input descriptor per parameter key. Implemented in `models/definition.ts`, not exported. See [UI-006](../ui/api-table.md).

[Details](../ui/api-reference.md#model)

<a id="open-decisions"></a>

## Open decisions

These choices need an owner decision. Entries in this inventory apply the default; the alternative remains possible.

| Question | Default applied here | Alternative |
| --- | --- | --- |
| Observation method | Library objects use `observe()`; the model contract keeps `read()` until a recorded naming migration. | Migrate `ModelInstance.read` to `observe` now, together with every model and `defineUI`. |
| Factory style for systems | City systems use `Name.create(options)`, for example `Budget.create`. | Free factory functions such as `createRoads` / `createBudget`; the [principles](../evolution/principles.md) record this style as superseded. |
| Parcel vocabulary | `ParcelShape` stays as delivered. | A neutral rename such as `PolygonShape` (roadmap order 2), migrated with all consumers. |
| Home of Input and limits | Both areas keep `Target: open`. | Input bindings in `world-composition`; limits split per owning module. |
| Topology ownership | Square and cubic grids stay in `grid`; finite layouts and `topology` belong to `polygon-layout`. | Keep all topology in `grid` and accept the geometry ↔ grid link. |
| Layout-backed `Grid.create` | Listed under Grid; it consumes a `polygon-layout` Layout. | Move the layout overload to `world-composition` as an adapter, or declare Layout structurally in `grid`. The autonomy rule forbids a direct import either way. |
| Entry count | One entry per `###` heading; overloads count separately. | Count distinct names (overload families) instead. |
| Package home of `Definition`, `Input` and `Inputs` | `target`: they live in `models/definition.ts`, which no public entry exports. | Export them from `ui/index.ts` or the root, as UI-005 and UI-006 call them Supported. |
| Command data | Only `CommandResult` is planned; actions stay typed model methods. | Typed command objects `{ type, … }` plus a model `apply(command)` for replays. |
| Package entries for systems | None; systems import the root `"city-library"`. | Subpaths such as `city-library/economy`, or separate packages (roadmap open question 3). |
| Route search precision | `findRoute` gets `canUse` and `heuristic` with numeric costs. | Keep exact bigint costs as in the delivered distance algorithms, at a speed cost. |
| Selection weights | No new API: `random.sample(source, { weight })` already draws by weight; weight derivation stays a plain function in the system. | A planned pure `random.weights` that consumes no draws. |
| Snapshot and hash owner | `storage.hash` is planned next to the target `storage.save`. | `world-composition` owns snapshots and hashes, because complete state spans modules. |
| Cohort remainders | Deterministic: the last cohort of a trip group carries the remainder. | Distribute remainders with the system's own Random stream. |
| Roads, zones and growth | Not proposed: roadmap order 4 names them, but the target structure has no matching subsystem folder. | Add a subsystem such as `library-city/land-use` with the first working slice. |
| `grid.reachable` neighborhood | Defaults to `"faces"`, like `grid.diffuse`. | Default to `"moore"`, like `grid.neighbors`. |
| Option convention and frozen signatures | The "every option optional" convention applies to new API; delivered positional or required arguments (`Agent.create(state, options)`, `Store.create({ capacity })`) stay frozen. | Add option-only overloads in a naming migration. |
| Change feed | Not proposed yet (layers-and-api engine contract 3). | A revision counter on observations once a renderer needs it. |

Pedestrians, material cycles, politics and library-generative-design have no entries: the [target structure](../evolution/structure.md) names their folders, but no first capability is defined yet.

<a id="known-inconsistencies"></a>

### Known inconsistencies

These differences were found while checking the specification against `index.ts`, `ui/index.ts` and the [UI contract](../ui/api-table.md). None is resolved here.

- `Definition`, `Input` and `Inputs` (UI-005, UI-006) and `DrawingIntent` (UI-061) are marked Supported in the UI contract, but no public entry exports these named types.
- `StudyAxis` has two incompatible forms under one name: [api-277](#api-277) (`variable` with source-literal string values, for study data binding) and [api-294](#api-294) (`name` with scalar values, for study design). The delivered export is the api-294 form.
- `agent.pitch` and `agent.roll` ([api-57](#api-57), [api-58](#api-58)) are typed `number`; the source declares `number | undefined`, and they apply only to XYZ agents.
- The [api-157](#api-157) heading reads `Input.add`, while its signature is `Input.create`, as the static-factory rule requires.
- [api-1](#api-1) lists `Input` and `limits` as package exports; the delivered root `city-library` exports neither, and the `agent-loom` package paths remain unresolved.
- UI-001 shows one `defineUI` signature; the source declares four overloads.
- 57 delivered entries in the first 16 areas differ in spelling from their source declaration (parameter names, aliases, defaults or overload split); [coverage](../development/coverage.md) owns that comparison.
- The [Field](#api-4) entry's details link ends with a stray `~~`.
