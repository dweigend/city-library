# Agent Loom API inventory

Use this inventory to find an operation, read its signature and follow the link to its full contract.

> **Target specification.** These 309 operation/type entries define the required core API across 16 areas. Implementation status is tracked in [PLAN](../../PLAN.md) and the [coverage inventory](../development/coverage.md). An entry here does not mean the operation is available.

[Overview](README.md) · [Detailed reference and examples](api-reference.md)

Each entry lists its exact signature, compact contract and detailed reference. Overloads appear separately. The `agent-loom` import paths are specification names; City Library package entries remain unresolved.

## Contents

[World](#area-world) · [Agent](#area-agent) · [Grid](#area-grid) · [Field](#area-field) · [Graph](#area-graph) · [Node](#area-node) · [Edge](#area-edge) · [Random](#area-random) · [Input](#area-input) · [stats](#area-stats) · [geometry](#area-geometry) · [Agenda](#area-agenda) · [experiments](#area-experiments) · [storage](#area-storage) · [limits](#area-limits) · [Exports and shared types](#area-exports-and-shared-types)

<a id="area-world"></a>

## World

<a id="world-add"></a>
<a id="api-12"></a>

### World.add

```ts
World.add(options?: { random?: Random }): World
```

Create an independent World without a spatial context; supply an optional shared Random. The World owns its Tick and an independent seed-1 Random by default.

[Details](api-reference.md#world-add)

<a id="world-add-2"></a>
<a id="api-13"></a>

### World.add

```ts
World.add(space: Space, options?: { boundary?: Space["boundary"]; random?: Random }): World
```

Create an independent World with the supplied immutable spatial context, optional boundary override and shared Random. Dimensions derive from the axes.

[Details](api-reference.md#world-add)

<a id="world-space"></a>
<a id="api-11"></a>

### world.space

```ts
world.space: (Space & Required<Pick<Space, "dimensions" | "boundary">>) | undefined
```

Read the immutable normalized spatial context, or undefined for a World without bounds.

[Details](api-reference.md#space-type)

<a id="world-random"></a>
<a id="api-29"></a>

### world.random

```ts
world.random: Random
```

Read-only Random reference selected at World construction; the default is an independent seed-1 generator.

[Details](api-reference.md#world-add)

<a id="world-tick"></a>
<a id="api-16"></a>

### world.tick

```ts
world.tick: Tick // readonly; owned by this World
```

Read the World-owned Tick. Its reference is fixed; value changes only through advance/reset or successful run updates.

[Details](api-reference.md#world-tick)

<a id="world-tick-value"></a>
<a id="api-30"></a>

### world.tick.value

```ts
world.tick.value: number
```

Read the finite nonnegative clock value; default 0. Fractional values are allowed; there is no fixed wall-clock duration.

[Details](api-reference.md#world-tick)

<a id="world-tick-advance"></a>
<a id="api-31"></a>

### world.tick.advance

```ts
world.tick.advance(amount?: number): void
```

Advance the clock by amount. Default: 1. Requires a finite nonnegative amount and an idle World.

[Details](api-reference.md#world-tick)

<a id="world-tick-reset"></a>
<a id="api-32"></a>

### world.tick.reset

```ts
world.tick.reset(): void
```

Set only the clock value to 0. Requires an idle World; model state, Agenda, History and Random remain unchanged.

[Details](api-reference.md#world-tick)

<a id="world-agents"></a>
<a id="api-18"></a>

### world.agents

```ts
world.agents: readonly Agent[]
```

Read an insertion-order snapshot of registered Agent identities.

[Details](api-reference.md#complete-membership)

<a id="world-grids"></a>
<a id="api-19"></a>

### world.grids

```ts
world.grids: readonly Grid[]
```

Read an insertion-order snapshot of registered Grid identities.

[Details](api-reference.md#complete-membership)

<a id="world-graphs"></a>
<a id="api-20"></a>

### world.graphs

```ts
world.graphs: readonly Graph[]
```

Read an insertion-order snapshot of registered Graph identities.

[Details](api-reference.md#complete-membership)

<a id="world-inputs"></a>
<a id="api-21"></a>

### world.inputs

```ts
world.inputs: readonly Input[]
```

Read an insertion-order snapshot of registered Input identities.

[Details](api-reference.md#complete-membership)

<a id="world-agendas"></a>
<a id="api-22"></a>

### world.agendas

```ts
world.agendas: readonly Agenda[]
```

Read an insertion-order snapshot of registered Agenda identities.

[Details](api-reference.md#complete-membership)

<a id="world-add-3"></a>
<a id="api-14"></a>

### world.add

```ts
world.add<T extends Component>(component: T): T
```

Attach existing components; return the original component or a normalized batch snapshot. Validate the complete batch before changing ownership.

[Details](api-reference.md#attach)

<a id="world-add-4"></a>
<a id="api-15"></a>

### world.add

```ts
world.add<T extends Component>(components: Iterable<T>): readonly T[]
```

Attach existing components; return the original component or a normalized batch snapshot. Validate the complete batch before changing ownership.

[Details](api-reference.md#attach)

<a id="world-delete"></a>
<a id="api-23"></a>

### world.delete

```ts
world.delete(component: Component | Iterable<Component>): void
```

Detach registered components without deleting them. Missing unowned components are a no-op; foreign ownership rejects.

[Details](api-reference.md#complete-membership)

<a id="run"></a>
<a id="api-24"></a>

### run

```ts
run<R>(world: World, step: (() => R) &
  ([Extract<R, PromiseLike<unknown>>] extends [never] ? unknown : never), steps?: number): void
```

Run synchronous model updates; steps defaults to 1. Each successful callback adds 1 to world.tick.value; failed callbacks retain prior effects and add no tick.

[Details](api-reference.md#complete-membership)

<a id="world-activate"></a>
<a id="api-25"></a>

### world.activate

```ts
world.activate<T extends WorldMember>(source: ActivationSource<T>, action: (context: ActivationContext<T>) => unknown,
  options?: { order?: "fixed" | "shuffle" | "priority" | "netlogo-7.0.0"; priority?: (member: T) => number; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; breeds?: ReadonlyMap<WorldMember,string>; breedOrder?: readonly string[] }): void
```

Invoke a synchronous action for selected World members under explicit scheduling and scoped self/caller contexts. Never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="world-report"></a>
<a id="api-26"></a>

### world.report

```ts
world.report<T extends WorldMember,R>(source: T, report: (context: ActivationContext<T>) => R,
  options?: { order?: "fixed" | "shuffle" | "priority" | "netlogo-7.0.0"; priority?: (member: T) => number; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; breeds?: ReadonlyMap<WorldMember,string>; breedOrder?: readonly string[] }): R | undefined
```

Evaluate a synchronous report for one or more World members under explicit scheduling and scoped contexts. Never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="world-report-2"></a>
<a id="api-27"></a>

### world.report

```ts
world.report<T extends WorldMember,R>(source: readonly T[] | { kind: "agents" | "fields" | "edges"; breed?: string }, report: (context: ActivationContext<T>) => R,
  options?: { order?: "fixed" | "shuffle" | "priority" | "netlogo-7.0.0"; priority?: (member: T) => number; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; breeds?: ReadonlyMap<WorldMember,string>; breedOrder?: readonly string[] }): readonly (R | undefined)[]
```

Evaluate a synchronous report for one or more World members under explicit scheduling and scoped contexts. Never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="world-select"></a>
<a id="api-28"></a>

### world.select

```ts
world.select<T extends WorldMember>(source: ActivationSource<T>, predicate: (context: ActivationContext<T>) => boolean,
  options?: { caller?: ActivationContext<WorldMember>; breeds?: ReadonlyMap<WorldMember,string> }): readonly T[]
```

Evaluate the scoped predicate deterministically in captured source order and return matching member identities. Selection never shuffles and has no order option; it never adds ticks.

[Details](api-reference.md#activation-contracts)

<a id="type-tick"></a>
<a id="api-17"></a>

### Tick

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

```ts
type WorldMember = Agent | Field | Edge;
```

Agent, Field or Edge identity eligible for explicit World activation.

[Details](api-reference.md#activation-contracts)

<a id="type-activation-source"></a>
<a id="api-319"></a>

### ActivationSource

```ts
type ActivationSource<T extends WorldMember> = T | readonly T[]
  | { readonly kind: "agents" | "fields" | "edges"; readonly breed?: string };
```

One member, a captured member list or an explicit kind/breed selector.

[Details](api-reference.md#activation-contracts)

<a id="type-activation-context"></a>
<a id="api-320"></a>

### ActivationContext

```ts
interface ActivationContext<T extends WorldMember> {
  readonly world: World; readonly self: T;
  readonly caller: WorldMember | undefined;
  die(): never;
}
```

Scoped World/self/caller identities with die terminating the active frame after deletion.

[Details](api-reference.md#activation-contracts)

<a id="area-agent"></a>

## Agent

<a id="agent-add"></a>
<a id="api-37"></a>

### Agent.add

```ts
Agent.add(): Agent<{}>
```

Create a detached living XY agent at the origin, with heading 0 and empty custom state. Construction consumes no randomness.

[Details](api-reference.md#agent-add)

<a id="agent-add-2"></a>
<a id="api-38"></a>

### Agent.add

```ts
Agent.add<S extends object>(state: S, options?: { position?: Position; orientation?: Partial<Orientation> }): Agent<S>
```

Create a living independent XY or XYZ agent with directly typed custom properties. Initial supported state is copied; position and orientation are changed through the spatial operations.

[Details](api-reference.md#agent-add)

<a id="agent-copy"></a>
<a id="api-33"></a>

### agent.copy

```ts
agent.copy(): Agent<S>
```

Create a detached living agent with an independent copy of custom data, position and orientation. No graph/World membership, path progress or Input bindings are copied.

[Details](api-reference.md#complete-values)

<a id="agent-alive"></a>
<a id="api-34"></a>

### agent.alive

```ts
agent.alive: boolean // readonly
```

Read whether this agent is living. Deletion is idempotent; a deleted agent retains readable final data.

[Details](api-reference.md#complete-values)

<a id="agent-id"></a>
<a id="api-35"></a>

### agent.id

```ts
agent.id: string // readonly
```

Read the immutable opaque process-local identity; loading assigns a fresh identity. Persist model-owned keys when a stable external identifier is required.

[Details](api-reference.md#complete-values)

<a id="agent-world"></a>
<a id="api-36"></a>

### agent.world

```ts
agent.world: World | undefined // readonly
```

Read the owning World, or undefined for a detached agent.

[Details](api-reference.md#complete-values)

<a id="agent-x"></a>
<a id="api-53"></a>

### agent.x

```ts
agent.x: number
```

Read-only spatial coordinate in world units; changed through move.

[Details](api-reference.md#complete-spatial)

<a id="agent-y"></a>
<a id="api-54"></a>

### agent.y

```ts
agent.y: number
```

Read-only spatial coordinate in world units; changed through move.

[Details](api-reference.md#complete-spatial)

<a id="agent-z"></a>
<a id="api-55"></a>

### agent.z

```ts
agent.z: number | undefined
```

Read-only spatial coordinate present for XYZ agents; XY agents have no z coordinate. Changed through move.

[Details](api-reference.md#complete-spatial)

<a id="agent-heading"></a>
<a id="api-56"></a>

### agent.heading

```ts
agent.heading: number
```

Read-only orientation in degrees; changed through rotate. Heading is clockwise from +Y and canonicalized to [0,360).

[Details](api-reference.md#complete-spatial)

<a id="agent-pitch"></a>
<a id="api-57"></a>

### agent.pitch

```ts
agent.pitch: number
```

Read-only orientation in degrees; changed through rotate. Pitch and roll apply only to XYZ agents.

[Details](api-reference.md#complete-spatial)

<a id="agent-roll"></a>
<a id="api-58"></a>

### agent.roll

```ts
agent.roll: number
```

Read-only orientation in degrees; changed through rotate. Pitch and roll apply only to XYZ agents.

[Details](api-reference.md#complete-spatial)

<a id="agent-move"></a>
<a id="api-40"></a>

### agent.move

```ts
agent.move(distance?: number, options?: { space?: Space }): void
```

Move a signed distance along current orientation; distance defaults to 1. Apply active boundaries and cancel prior path progress.

[Details](api-reference.md#move)

<a id="agent-move-2"></a>
<a id="api-41"></a>

### agent.move

```ts
agent.move(options: { by: Vector; space?: Space }): void
```

Displace the agent by the supplied coordinate-axis vector while preserving orientation and applying active boundaries.

[Details](api-reference.md#move)

<a id="agent-move-3"></a>
<a id="api-42"></a>

### agent.move

```ts
agent.move(options: { to: Position; space?: Space }): void
```

Place the agent at compatible target coordinates while preserving orientation; reject out-of-bounds hard placement and cancel prior path progress.

[Details](api-reference.md#move)

<a id="agent-move-4"></a>
<a id="api-43"></a>

### agent.move

```ts
agent.move(options: { path: readonly Position[]; distance?: number; space?: Space }): boolean
```

Advance along the supplied nonempty path with per-agent continuation; return true on arrival, including later endpoint calls.

[Details](api-reference.md#move)

<a id="agent-rotate"></a>
<a id="api-44"></a>

### agent.rotate

```ts
agent.rotate(angle?: number, options?: { axis?: "x" | "y" | "z" }): void
```

Change local orientation by an angle or face compatible target coordinates while preserving position. XY permits only the z axis; XYZ retains full heading, pitch and roll.

[Details](api-reference.md#rotate)

<a id="agent-rotate-2"></a>
<a id="api-45"></a>

### agent.rotate

```ts
agent.rotate(options: { towards: Position; space?: Space }): void
```

Change local orientation by an angle or face compatible target coordinates while preserving position. XY permits only the z axis; XYZ retains full heading, pitch and roll.

[Details](api-reference.md#rotate)

<a id="agent-distance-to"></a>
<a id="api-46"></a>

### agent.distanceTo

```ts
agent.distanceTo(target: Position, options?: { space?: Space }): number
```

Measure distance to a compatible position using active space and wrapped shortest displacement; no movement or random draw.

[Details](api-reference.md#perception)

<a id="agent-neighbors"></a>
<a id="api-47"></a>

### agent.neighbors

```ts
agent.neighbors<T extends Agent>(options: { source: Iterable<T>; radius?: number; angle?: number; space?: Space }): readonly T[]
```

Return original neighboring Agent identities from the supplied source, excluding self; radius defaults to 1 and angle to 360 degrees. Preserve source order; dimensions and active space must match.

[Details](api-reference.md#perception)

<a id="agent-neighbors-2"></a>
<a id="api-48"></a>

### agent.neighbors

```ts
agent.neighbors(options?: { radius?: number; angle?: number; space?: Space }): readonly Agent[]
```

Return registered neighboring World agents, excluding self; radius defaults to 1 and angle to 360 degrees. A detached agent must supply an explicit source; queries consume no RNG or ticks.

[Details](api-reference.md#perception)

<a id="agent-direction-to"></a>
<a id="api-49"></a>

### agent.directionTo

```ts
agent.directionTo(target: Position, options?: { space?: Space }):
  { readonly heading: number; readonly pitch?: number } | undefined
```

Return a detached bearing toward compatible target coordinates; coincident coordinates return undefined.

[Details](api-reference.md#complete-spatial)

<a id="agent-can-move"></a>
<a id="api-50"></a>

### agent.canMove

```ts
agent.canMove(distance?: number, options?: { space?: Space }): boolean
```

Test legality of the entire proposed step, including tied descendants. Does not move, clip, advance time or consume randomness.

[Details](api-reference.md#agent-field-gradient)

<a id="agent-gradient"></a>
<a id="api-52"></a>

### agent.gradient

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

```ts
agent.delete(): void
```

Idempotently delete the agent and remove World registration, incident graph memberships and Input bindings. Final model data remains readable; caller-owned references are not removed.

[Details](api-reference.md#agent-delete)

<a id="type-agent"></a>
<a id="api-3"></a>

### Agent

```ts
Agent<S>
```

Agent identity with directly typed custom properties S and the documented spatial/lifecycle API. Supported custom data includes undefined, null, booleans, finite numbers, strings, bigint, plain records, arrays, Map, Set, valid Date, RegExp, non-shared ArrayBuffer and standard typed-array/DataView views. Construction/copy clone supported containers, preserving cycles and shared backing/reference relationships within each clone; framework references retain identity. Later assignments use ordinary TypeScript reference semantics. Functions, accessors, symbols, custom prototypes, weak collections and active host resources are unsupported. Reserved root names: id, alive, world, x, y, z, heading, pitch, roll, copy, delete, move, rotate, distanceTo, directionTo, neighbors, canMove, gradient. No built-in presentation properties.

[Details](api-reference.md#complete-values)

<a id="type-numeric-fields"></a>
<a id="api-51"></a>

### NumericFields

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

<a id="grid-add"></a>
<a id="api-62"></a>

### Grid.add

```ts
Grid.add<F extends object>(space: Space, options: { state: F; cellSize?: number; boundary?: Space["boundary"] }): Grid<F>
```

Create an independent regular square or cubic Grid with immutable normalized space and independently copied custom field state. Cell dimensions are exact and allocation is bounded; construction uses no randomness.

[Details](api-reference.md#grid-add)

<a id="grid-add-2"></a>
<a id="api-63"></a>

### Grid.add

```ts
Grid.add(space?: Space, options?: { cellSize?: number; boundary?: Space["boundary"] }): Grid<{}>
```

Create an independent Grid; omitted space defaults to 40×40 XY, cellSize to 1 and boundary to hard. Fields start with independent empty custom state.

[Details](api-reference.md#grid-add)

<a id="grid-space"></a>
<a id="api-59"></a>

### grid.space

```ts
grid.space: Space & Required<Pick<Space, "dimensions" | "boundary">>
```

Read the immutable normalized grid extents, derived dimension and effective boundary rules.

[Details](api-reference.md#space-type)

<a id="grid-cell-size"></a>
<a id="api-72"></a>

### grid.cellSize

```ts
grid.cellSize: number
```

Positive finite cell spacing supplied at construction; defaults to 1. Every extent must be an exact integer multiple.

[Details](api-reference.md#complete-grid-contract)

<a id="grid-fields"></a>
<a id="api-73"></a>

### grid.fields

```ts
grid.fields: readonly Field<F>[]
```

Read-only array snapshot of the original fields in x-fastest order; custom field state remains directly editable.

[Details](api-reference.md#complete-grid-contract)

<a id="grid-field-at"></a>
<a id="api-64"></a>

### grid.fieldAt

```ts
grid.fieldAt(position: Position): Field<F> | undefined
```

Return the field containing compatible coordinates, or undefined outside hard bounds.

[Details](api-reference.md#grid-query)

<a id="grid-neighbors"></a>
<a id="api-65"></a>

### grid.neighbors

```ts
grid.neighbors(field: Field<F>, options?: { neighborhood?: "moore" | "faces" }): readonly Field<F>[]
```

Return neighboring fields in lexicographic offset order, then normalize wrapping and deduplicate at first occurrence. This is not the global grid.fields order.

[Details](api-reference.md#grid-query)

<a id="grid-agents-at"></a>
<a id="api-66"></a>

### grid.agentsAt

```ts
grid.agentsAt<T extends Agent>(field: Field<F>, options: { source: Iterable<T> }): readonly T[]
```

Return original Agent identities currently occupying the field, from an explicit population or attached World membership.

[Details](api-reference.md#grid-query)

<a id="grid-agents-at-2"></a>
<a id="api-67"></a>

### grid.agentsAt

```ts
grid.agentsAt(field: Field<F>): readonly Agent[]
```

Return original Agent identities currently occupying the field, from an explicit population or attached World membership.

[Details](api-reference.md#grid-query)

<a id="grid-diffuse"></a>
<a id="api-68"></a>

### grid.diffuse

```ts
grid.diffuse(property: Extract<keyof NumericFields<F>, string>, options?: { rate?: number; neighborhood?: "moore" | "faces" }): void
```

Simultaneously diffuse a numeric field with rate default 0.25 and neighborhood default faces. Preserve total quantity within floating-point tolerance; no evaporation, tick or RNG effect.

[Details](api-reference.md#diffusion)

<a id="area-field"></a>

## Field

<a id="field-id"></a>
<a id="api-60"></a>

### field.id

```ts
field.id: string // readonly
```

Read the immutable opaque identity of the field.

[Details](api-reference.md#field-identity)

<a id="field-grid"></a>
<a id="api-61"></a>

### field.grid

```ts
field.grid: Grid<F> // readonly
```

Read the owning Grid; field membership is fixed by construction.

[Details](api-reference.md#field-identity)

<a id="field-x"></a>
<a id="api-69"></a>

### field.x

```ts
field.x: number // readonly
```

Immutable cell-center coordinate derived from the owning Grid and field index.

[Details](api-reference.md#field-position)

<a id="field-y"></a>
<a id="api-70"></a>

### field.y

```ts
field.y: number // readonly
```

Immutable cell-center coordinate derived from the owning Grid and field index.

[Details](api-reference.md#field-position)

<a id="field-z"></a>
<a id="api-71"></a>

### field.z

```ts
field.z: number | undefined // readonly
```

Immutable cell-center z coordinate for XYZ grids; absent for XY grids.

[Details](api-reference.md#field-position)

<a id="type-field"></a>
<a id="api-4"></a>

### Field

```ts
Field<F>
```

Grid-owned field identity with immutable cell coordinates and directly writable typed properties F. Uses the supported-data and copying rules of `Agent<S>`; each field starts with an independent data copy. Reserved root names: id, grid, x, y, z.

[Details](api-reference.md#field-state)~~

<a id="area-graph-and-edge"></a>

<a id="area-graph"></a>

## Graph

<a id="graph-add"></a>
<a id="api-78"></a>

### Graph.add

```ts
Graph.add<N extends object = object>(options?: {
  parallel?: boolean; selfLoops?: boolean
}): Graph<N, {}>
```

Create a graph with optional parallel edges, self-loops and independently copied edge defaults. Edge direction and geometry are explicit; creation never adds endpoint nodes implicitly.

[Details](api-reference.md#graph-representations)

<a id="graph-add-2"></a>
<a id="api-79"></a>

### Graph.add

```ts
Graph.add<N extends object = object, E extends object = {}>(options: {
  edgeState: E; parallel?: boolean; selfLoops?: boolean
}): Graph<N, E>
```

Create a graph with optional parallel edges, self-loops and independently copied edge defaults. Edge direction and geometry are explicit; creation never adds endpoint nodes implicitly.

[Details](api-reference.md#graph-representations)

<a id="graph-generate"></a>
<a id="api-115"></a>

### graph.generate

```ts
graph.generate(options: GeneratorOptions<N>): readonly Edge<N, E>[]
```

Add a selected standard network structure among existing unique member nodes and return the created edges. Random generators require an explicit Random; inputs and allocation bounds validate before graph mutation.

[Details](api-reference.md#graph-generate)

<a id="graph-parallel"></a>
<a id="api-131"></a>

### graph.parallel

```ts
graph.parallel: boolean
```

Read-only creation policy; defaults to false. Enables separately keyed parallel edge identities.

[Details](api-reference.md#graph-representations)

<a id="graph-self-loops"></a>
<a id="api-132"></a>

### graph.selfLoops

```ts
graph.selfLoops: boolean
```

Read-only creation policy; defaults to false. Allows edges whose endpoints are the same node.

[Details](api-reference.md#graph-representations)

<a id="graph-delete"></a>
<a id="api-85"></a>

### graph.delete

```ts
graph.delete(options?: { edgesOnly?: boolean }): void
```

Delete graph contents while preserving the graph and node objects. edgesOnly retains node membership; World membership is unchanged.

[Details](api-reference.md#graph-collections)

<a id="graph-view"></a>
<a id="api-86"></a>

### graph.view

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

```ts
graph.components(options?: {
  mode?: "weak" | "strong" | "biconnected"
}): readonly (readonly N[])[]
```

Return weak, strong or biconnected node components; biconnected analysis requires undirected edges.

[Details](api-reference.md#graph-components)

<a id="graph-connected"></a>
<a id="api-92"></a>

### graph.connected

```ts
graph.connected(options?: { mode?: "weak" | "strong" }): boolean
```

Test connectivity in weak or strong mode without mutating the graph.

[Details](api-reference.md#graph-components)

<a id="graph-bridges"></a>
<a id="api-93"></a>

### graph.bridges

```ts
graph.bridges(): readonly Edge<N, E>[]
```

Find bridge edges in an undirected graph.

[Details](api-reference.md#graph-components)

<a id="graph-articulations"></a>
<a id="api-94"></a>

### graph.articulations

```ts
graph.articulations(): readonly N[]
```

Find articulation node identities in an undirected graph.

[Details](api-reference.md#graph-components)

<a id="graph-find-route"></a>
<a id="api-96"></a>

### graph.findRoute

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

```ts
graph.routes(options: {
  from: N; to: N; limit: number; maxEdges?: number;
  cost?: (edge: Edge<N, E>) => number
}): readonly Route<N, E>[]
```

Enumerate a bounded number of vertex-simple routes between endpoints; parallel-edge alternatives remain distinct.

[Details](api-reference.md#graph-path-enumeration)

<a id="graph-distance-summary"></a>
<a id="api-100"></a>

### graph.distanceSummary

```ts
graph.distanceSummary(options?: {
  cost?: (edge: Edge<N, E>) => number;
  disconnected?: "reachable" | "reject"
}): { mean?: number; diameter?: number; radius?: number;
       eccentricity: ReadonlyMap<N, number>; reachablePairs: number }
```

Summarize nonnegative shortest-path distances as mean, diameter, radius, eccentricity and reachable-pair count under explicit disconnected handling.

[Details](api-reference.md#graph-path-enumeration)

<a id="graph-analyze"></a>
<a id="api-101"></a>

### graph.analyze

```ts
graph.analyze(options: {
  measure: "degree" | "closeness" | "betweenness" | "eigenvector" | "pageRank";
  direction?: "out" | "in" | "all"; normalized?: boolean;
  disconnected?: "reachable" | "discount";
  cost?: (edge: Edge<N, E>) => number;
  weight?: (edge: Edge<N, E>) => number;
  damping?: number; tolerance?: number; maxIterations?: number
}): ReadonlyMap<N, number>
```

Compute the selected degree, closeness, betweenness, eigenvector or PageRank node scores. Costs, weights, direction, normalization and convergence limits follow the selected measure.

[Details](api-reference.md#graph-centrality-extended)

<a id="graph-triangles"></a>
<a id="api-102"></a>

### graph.triangles

```ts
graph.triangles(): readonly (readonly [N, N, N])[]
```

Return each triangle once on a simple undirected loop-free graph.

[Details](api-reference.md#graph-clustering)

<a id="graph-clustering"></a>
<a id="api-103"></a>

### graph.clustering

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

```ts
graph.communities(options?: {
  method?: "greedy" | "louvain" | "labelPropagation";
  weight?: (edge: Edge<N, E>) => number;
  resolution?: number; random?: Random;
  maxIterations?: number; tolerance?: number
}): readonly (readonly N[])[]
```

Return an undirected community partition; Louvain and label propagation require an explicit Random.

[Details](api-reference.md#graph-communities)

<a id="graph-modularity"></a>
<a id="api-105"></a>

### graph.modularity

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

```ts
graph.cliques(options: { limit: number; minSize?: number }): readonly (readonly N[])[]
```

Return maximal cliques within the result limit. Default minSize: 1. Requires simple undirected loop-free input; limit overflow rejects instead of truncating.

[Details](api-reference.md#graph-cliques)

<a id="graph-bipartition"></a>
<a id="api-107"></a>

### graph.bipartition

```ts
graph.bipartition(): { left: readonly N[]; right: readonly N[] } | undefined
```

Return left/right node partitions, or undefined when the graph is not bipartite.

[Details](api-reference.md#graph-cliques)

<a id="graph-matching"></a>
<a id="api-108"></a>

### graph.matching

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

```ts
graph.topological(): readonly N[]
```

Return a stable topological node ordering; cyclic or unsupported input rejects.

[Details](api-reference.md#graph-cycles-dag)

<a id="graph-transitive"></a>
<a id="api-111"></a>

### graph.transitive

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

```ts
graph.isTree(options?: { forest?: boolean }): boolean
```

Test whether an undirected graph is a tree, or a forest when requested.

[Details](api-reference.md#graph-trees)

<a id="graph-spanning-tree"></a>
<a id="api-113"></a>

### graph.spanningTree

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

```ts
graph.flow(options: {
  from: N; to: N; capacity: (edge: Edge<N, E>) => number;
  tolerance?: number; maxAugmentations?: number
}): { value: number; flowByEdge: ReadonlyMap<Edge<N, E>, number>;
       sourceSide: readonly N[]; sinkSide: readonly N[] }
```

Return total value, flowByEdge and the residual source/sink cut partitions without changing the graph. Requires distinct nodes and finite nonnegative capacities; tolerance and augmentation limits are explicit.

[Details](api-reference.md#graph-flow)

<a id="graph-to-data"></a>
<a id="api-117"></a>

### graph.toData

```ts
graph.toData(options?: { nodeId?: (node: N) => string }): GraphData<N, E>
```

Return detached portable node/edge data, graph policies and edge defaults, using explicit or insertion-order IDs.

[Details](api-reference.md#graph-convert)

<a id="graph-from-data"></a>
<a id="api-118"></a>

### Graph.fromData

```ts
Graph.fromData(data: unknown): Graph<Record<string, unknown>, Record<string, unknown>>
```

Validate detached graph data and create a graph with plain record state whose field values remain unknown.

[Details](api-reference.md#graph-convert)

<a id="graph-from-data-2"></a>
<a id="api-119"></a>

### Graph.fromData

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

```ts
graph.layout(options: LayoutOptions<N>): ReadonlyMap<N, Position>
```

Compute detached planar positions using circle, radial, spring or Tutte placement. Reject any coordinate input with z, including z: 0; returned positions omit z. No model state, World space or RNG stream is changed.

[Details](api-reference.md#graph-layout)

<a id="type-readonly-graph"></a>
<a id="api-88"></a>

### ReadonlyGraph

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

```ts
type GeneratorOptions<N> =
  | { kind: "path" | "cycle" | "star" | "wheel" | "complete";
      nodes: readonly N[]; directed?: boolean }
  | { kind: "tree"; nodes: readonly N[]; branching?: number; directed?: boolean }
  | { kind: "lattice"; nodes: readonly N[]; shape: readonly number[];
      wrap?: boolean; directed?: boolean }
  | { kind: "random"; nodes: readonly N[]; probability: number;
      directed?: boolean; random: Random }
  | { kind: "smallWorld"; nodes: readonly N[]; neighbors: number;
      probability: number; random: Random }
  | { kind: "preferential"; nodes: readonly N[]; links: number;
      random: Random }
  | { kind: "geometric"; nodes: readonly N[];
      position: (node: N) => Position; radius: number; space?: Space }
```

Discriminated options for the supported deterministic and random network generators; every variant uses existing member nodes.

[Details](api-reference.md#graph-generate)

<a id="type-graph-data"></a>
<a id="api-120"></a>

### GraphData

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

```ts
type LayoutOptions<N> =
  | { kind: "circle"; radius?: number; center?: Position }
  | { kind: "radial"; root: N; spacing?: number; center?: Position }
  | { kind: "spring"; initial: ReadonlyMap<N, Position>;
      iterations?: number; length?: number; step?: number }
  | { kind: "tutte"; boundary: readonly N[];
      positions: readonly Position[] }
```

Discriminated options for pure circle, radial, spring or Tutte coordinate placement. Coordinate inputs are XY Position values without z; results omit z.

[Details](api-reference.md#graph-layout)

<a id="area-node"></a>

## Node

<a id="graph-nodes-add"></a>
<a id="api-127"></a>

### graph.nodes.add

```ts
graph.nodes.add(node: N): N
```

Add an existing node identity to this graph; graph attachment does not attach its Agent nodes to the World.

[Details](api-reference.md#graph-add)

<a id="graph-nodes-size"></a>
<a id="api-81"></a>

### graph.nodes.size

```ts
graph.nodes.size: number
```

Read the current number of graph node identities.

[Details](api-reference.md#node-collection)

<a id="graph-nodes-symbol-iterator"></a>
<a id="api-129"></a>

### graph.nodes[Symbol.iterator]

```ts
graph.nodes[Symbol.iterator](): Iterator<N>
```

Iterate current nodes in stable insertion order. Mutation during a collection iteration throws; a native array snapshot may be taken first.

[Details](api-reference.md#node-collection)

<a id="graph-has-node"></a>
<a id="api-75"></a>

### graph.hasNode

```ts
graph.hasNode(node: N): boolean
```

Check whether the supplied object identity belongs to the graph.

[Details](api-reference.md#graph-query)

<a id="graph-neighbors"></a>
<a id="api-77"></a>

### graph.neighbors

```ts
graph.neighbors(node: N, options?: { direction?: "out" | "in" | "all" }): readonly N[]
```

Return unique adjacent node identities in stable node order; direction defaults to out.

[Details](api-reference.md#graph-query)

<a id="graph-nodes-delete"></a>
<a id="api-128"></a>

### graph.nodes.delete

```ts
graph.nodes.delete(node: N): void
```

Remove membership and incident edges in this graph only; absent membership deletion is a no-op.

[Details](api-reference.md#graph-add)

<a id="area-edge"></a>

## Edge

<a id="graph-edges-add"></a>
<a id="api-80"></a>

### graph.edges.add

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

```ts
edge.id: string // readonly
```

Read the immutable opaque process-local edge identity; loading assigns a fresh identity.

[Details](api-reference.md#edge-identity)

<a id="edge-graph"></a>
<a id="api-edge-graph"></a>

### edge.graph

```ts
edge.graph: Graph<N, E> // readonly
```

Read the immutable owning Graph reference, including after edge deletion.

[Details](api-reference.md#edge-identity)

<a id="edge-alive"></a>
<a id="api-edge-alive"></a>

### edge.alive

```ts
edge.alive: boolean // readonly
```

Read edge lifecycle state; starts true and becomes false on direct, graph or endpoint-membership deletion. Deleted edges retain readable final data; repeated delete is a no-op.

[Details](api-reference.md#edge-identity)

<a id="edge-from"></a>
<a id="api-133"></a>

### edge.from

```ts
edge.from: N
```

Read the stored endpoint identity. For tied Agent edges, from is the parent and to is the child independently of traversal direction.

[Details](api-reference.md#edge-properties)

<a id="edge-to"></a>
<a id="api-134"></a>

### edge.to

```ts
edge.to: N
```

Read the stored endpoint identity. For tied Agent edges, from is the parent and to is the child independently of traversal direction.

[Details](api-reference.md#edge-properties)

<a id="edge-directed"></a>
<a id="api-135"></a>

### edge.directed

```ts
edge.directed: boolean
```

Read the stored per-edge traversal direction flag; defaults to false. Graph has no graph-wide directed setting.

[Details](api-reference.md#edge-properties)

<a id="edge-key"></a>
<a id="api-136"></a>

### edge.key

```ts
edge.key: string | undefined
```

Immutable graph-scoped key for a parallel edge; simple edges have no key. Deletion does not rewind key allocation.

[Details](api-reference.md#edge-properties)

<a id="edge-path"></a>
<a id="api-137"></a>

### edge.path

```ts
edge.path: readonly Position[] | undefined
```

Read the optional stored path geometry. Its coordinate dimension must match its positioned endpoints; model cost remains separate from spatial distance.

[Details](api-reference.md#edge-properties)

<a id="edge-tie-mode"></a>
<a id="api-126"></a>

### edge.tieMode

```ts
edge.tieMode: "none" | "free" | "fixed"
```

Read the current motion-coupling mode; new edges default to none. Configure it with edge.tie, whose omitted mode defaults to fixed.

[Details](api-reference.md#edge-ties)

<a id="graph-edges-size"></a>
<a id="api-82"></a>

### graph.edges.size

```ts
graph.edges.size: number
```

Read the current number of graph edge identities.

[Details](api-reference.md#edge-queries)

<a id="graph-edges-has"></a>
<a id="api-83"></a>

### graph.edges.has

```ts
graph.edges.has(edge: Edge<N, E>): boolean
```

Check current membership of this exact edge identity.

[Details](api-reference.md#edge-queries)

<a id="graph-edges-between"></a>
<a id="api-84"></a>

### graph.edges.between

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

```ts
graph.hasEdge(from: N, to: N): boolean
```

Check whether a connection exists under the graph’s endpoint/direction rules.

[Details](api-reference.md#edge-queries)

<a id="graph-edges-symbol-iterator"></a>
<a id="api-130"></a>

### graph.edges[Symbol.iterator]

```ts
graph.edges[Symbol.iterator](): Iterator<Edge<N, E>>
```

Iterate current edges in stable insertion order. Mutation during a collection iteration throws; a new iteration observes new membership.

[Details](api-reference.md#edge-queries)

<a id="edge-tie"></a>
<a id="api-125"></a>

### edge.tie

```ts
edge.tie(mode?: "none" | "free" | "fixed"): void
```

Configure parent-to-child Agent motion through this edge; tie() defaults to fixed, while newly created edges start at none. Active ties must form a compatible forest; movement propagates atomically.

[Details](api-reference.md#edge-ties)

<a id="edge-delete"></a>
<a id="api-74"></a>

### edge.delete

```ts
edge.delete(): void
```

Idempotently delete this edge and its tie relation while preserving endpoint objects.

[Details](api-reference.md#edge-add)

<a id="type-edge"></a>
<a id="api-5"></a>

### Edge

```ts
Edge<N, E>
```

Graph-owned connection between node identities N with directly writable typed properties E. Uses the supported-data and copying rules of `Agent<S>`; direction, key and optional geometry follow graph creation policy. Reserved root names: id, graph, alive, from, to, directed, key, path, delete, tie, tieMode.

[Details](api-reference.md#edge-add)~~

<a id="area-random"></a>

## Random

<a id="random-add"></a>
<a id="api-138"></a>

### Random.add

```ts
Random.add(options?: { seed?: number | "random"; algorithm?: "mulberry32" | "netlogo-7.0.0" }): Random
```

Create an independent Random; seed defaults to 1 and algorithm to mulberry32. Seed random obtains host entropy without drawing from a model stream; netlogo-7.0.0 explicitly selects the pinned MT profile.

[Details](api-reference.md#random-add)

<a id="random-algorithm"></a>
<a id="api-155"></a>

### random.algorithm

```ts
random.algorithm: "mulberry32" | "netlogo-7.0.0"
```

Read-only selected stream profile. The NetLogo profile pins the documented compatibility algorithm and distribution semantics.

[Details](api-reference.md#complete-random-general)

<a id="random-seed"></a>
<a id="api-156"></a>

### random.seed

```ts
random.seed: number
```

Read the actual numeric initial/reseed metadata, including the seed selected by the host entropy option. Restored Random state restores seed metadata.

[Details](api-reference.md#complete-random-general)

<a id="random-number"></a>
<a id="api-141"></a>

### random.number

```ts
random.number(): number
```

Draw a uniform real value in [0,1) from the selected stream.

[Details](api-reference.md#complete-distributions)

<a id="random-number-2"></a>
<a id="api-142"></a>

### random.number

```ts
random.number(options: { distribution?: "uniform", min?: number, max?: number, integer?: boolean }): number
```

Draw a uniform real or integer value; defaults are min 0, max 1 and integer false. Max is exclusive; validate finite bounds and the selected profile’s integer/domain rules.

[Details](api-reference.md#complete-distributions)

<a id="random-number-3"></a>
<a id="api-143"></a>

### random.number

```ts
random.number(options: { distribution: "normal", mean?: number, deviation?: number }): number
```

Draw a normal value with mean default 0 and deviation default 1. Gaussian-cache and zero-deviation draw behavior depend on the selected stream profile.

[Details](api-reference.md#complete-distributions)

<a id="random-number-4"></a>
<a id="api-144"></a>

### random.number

```ts
random.number(options: { distribution: "exponential" | "poisson", mean?: number }): number
```

Draw an exponential or Poisson value with mean default 1. Accepted signed means and zero-mean draw behavior depend on the selected stream profile.

[Details](api-reference.md#complete-distributions)

<a id="random-number-5"></a>
<a id="api-145"></a>

### random.number

```ts
random.number(options: { distribution: "gamma", shape: number, rate: number }): number
```

Draw a gamma value using positive finite shape and rate; mean equals shape/rate.

[Details](api-reference.md#complete-distributions)

<a id="random-number-6"></a>
<a id="api-146"></a>

### random.number

```ts
random.number(options: { distribution?: "uniform", bound: number, integer?: boolean }): number
```

Pinned-MT uniform draw using a finite signed bound; unsupported by Mulberry. Float and integer modes retain their documented signed-bound and zero-bound schedules.

[Details](api-reference.md#complete-distributions)

<a id="random-sample"></a>
<a id="api-147"></a>

### random.sample

```ts
random.sample<T>(source: Iterable<T>, options?: {
  count?: number; replace?: boolean; weight?: (value: T) => number;
  order?: "draw" | "source"; compatibility?: "legacy-shuffle";
}): T[]
```

Perform weighted selection in draw/source order or an explicitly requested legacy full-shuffle schedule. Actual selections consume the configured stream and retain original source values.

[Details](api-reference.md#complete-sampling)

<a id="random-state"></a>
<a id="api-140"></a>

### random.state

```ts
random.state: RandomState // read/write validated continuation
```

Read a detached deeply frozen continuation, or assign a validated matching continuation to the same Random object. No random draw occurs.

[Details](api-reference.md#random-continuation)

<a id="random-reseed"></a>
<a id="api-148"></a>

### random.reseed

```ts
random.reseed(seed: number): void
```

Replace the stream continuation and discard its Gaussian cache using the supplied seed; this is distinct from copying/restoring continuation.

[Details](api-reference.md#complete-random-general)

<a id="random-copy"></a>
<a id="api-149"></a>

### random.copy

```ts
random.copy(): Random
```

Create an independent exact continuation including any cached Gaussian; consumes no random draw.

[Details](api-reference.md#complete-random-general)

<a id="random-local"></a>
<a id="api-150"></a>

### random.local

```ts
random.local<R>(action: () => R): R
```

Run synchronous work with temporary randomness and restore the prior stream in finally. Ordinary model mutations are retained.

[Details](api-reference.md#complete-random-general)

<a id="random-raw"></a>
<a id="api-151"></a>

### random.raw

```ts
random.raw(options: { kind: "int32" }): number
```

Draw a signed 32-bit integer from one raw MT word. Requires the netlogo-7.0.0 profile.

[Details](api-reference.md#complete-random-general)

<a id="random-raw-2"></a>
<a id="api-152"></a>

### random.raw

```ts
random.raw(options: { kind: "int31", bound: number }): number
```

Draw an integer in [0,bound) using the pinned bounded-int rejection schedule; bound is a positive integer at most 2³¹−1. Requires the netlogo-7.0.0 profile.

[Details](api-reference.md#complete-random-general)

<a id="random-raw-3"></a>
<a id="api-153"></a>

### random.raw

```ts
random.raw(options: { kind: "int64", bound?: bigint }): bigint
```

Draw a signed 64-bit bigint from two MT words, or a bigint in [0,bound) when a bound in [1,2⁶³−1] is supplied. Requires the netlogo-7.0.0 profile.

[Details](api-reference.md#complete-random-general)

<a id="random-raw-4"></a>
<a id="api-154"></a>

### random.raw

```ts
random.raw(options: { kind: "double" | "gaussian" }): number
```

Draw a double in [0,1) from the selected profile, or a cached/polar Gaussian from the netlogo-7.0.0 profile. These operations advance only the Random stream.

[Details](api-reference.md#complete-random-general)

<a id="type-random-state"></a>
<a id="api-139"></a>

### RandomState

```ts
type RandomState = {
  readonly algorithm: "mulberry32" | "netlogo-7.0.0";
  readonly seed: number;
  readonly continuation:
    | { readonly algorithm: "mulberry32"; readonly revision: "agent-loom-random/1";
        readonly word: number; readonly gaussian: number | null }
    | { readonly algorithm: "netlogo-7.0.0"; readonly revision: 2;
        readonly words: readonly number[]; readonly index: number; readonly gaussian: number | null };
};
```

Versioned RNG continuation containing algorithm, seed, internal words and Gaussian cache; assignments validate the selected immutable profile.

[Details](api-reference.md#random-continuation)

<a id="area-input"></a>

## Input

<a id="input-add"></a>
<a id="api-157"></a>

### Input.add

```ts
Input.add(): Input
```

Create an independent Input with no property bindings.

[Details](api-reference.md#input-add)

<a id="input-bindings"></a>
<a id="api-161"></a>

### input.bindings

```ts
input.bindings: readonly { object: object; property: string; type: "number" | "string" | "boolean"; min?: number; max?: number; step?: number }[]
```

Read-only insertion-order array of frozen binding descriptors retaining original object/property references; external edits use input.set.

[Details](api-reference.md#complete-input)

<a id="input-add-2"></a>
<a id="api-158"></a>

### input.add

```ts
input.add(object: object, property: string, constraints?: { min?: number; max?: number; step?: number }): void
```

Expose an existing finite number, string or boolean property with optional numeric constraints; preserve its current value.

[Details](api-reference.md#input-add)

<a id="input-set"></a>
<a id="api-159"></a>

### input.set

```ts
input.set(object: object, property: string, value: number | string | boolean): void
```

Validate the bound type, range and step before assigning once. Invalid values preserve the old property value.

[Details](api-reference.md#input-add)

<a id="input-delete"></a>
<a id="api-160"></a>

### input.delete

```ts
input.delete(object: object, property: string): void
```

Remove a property binding without changing its model value; absent bindings are a no-op.

[Details](api-reference.md#input-add)

<a id="area-stats"></a>

## stats

<a id="stats-describe"></a>
<a id="api-162"></a>

### stats.describe

```ts
stats.describe(values: Iterable<number>, options?: { sample?: boolean }): Summary
```

Return count, sum, extrema, mean, median, variance and standard deviation without changing input. Empty count/sum are zero; unavailable statistics are undefined.

[Details](api-reference.md#describe)

<a id="stats-histogram"></a>
<a id="api-163"></a>

### stats.histogram

```ts
stats.histogram(values: Iterable<number>, options: { edges: readonly number[] }): Histogram
```

Count finite values against explicit increasing bin edges and report underflow/overflow. Bin selection is never inferred and the source remains unchanged.

[Details](api-reference.md#histogram)

<a id="stats-gini"></a>
<a id="api-164"></a>

### stats.gini

```ts
stats.gini(values: Iterable<number>): number
```

Return finite-population inequality for nonnegative holdings. Empty or all-zero input returns 0; caller data is unchanged.

[Details](api-reference.md#special-stats)

<a id="stats-alignment"></a>
<a id="api-165"></a>

### stats.alignment

```ts
stats.alignment(headings: Iterable<number>): number
```

Return the magnitude of the mean heading unit vector in [0,1]. Empty input returns 0.

[Details](api-reference.md#special-stats)

<a id="type-summary"></a>
<a id="api-166"></a>

### Summary

```ts
type Summary = { readonly count:number; readonly sum:number;
  readonly min:number|undefined; readonly max:number|undefined;
  readonly mean:number|undefined; readonly median:number|undefined;
  readonly variance:number|undefined; readonly standardDeviation:number|undefined };
```

Detached numeric summary; empty input has count/sum zero and unavailable extrema, averages and spread values undefined.

[Details](api-reference.md#complete-statistics)

<a id="type-histogram"></a>
<a id="api-167"></a>

### Histogram

```ts
type Histogram = { readonly edges:readonly number[]; readonly counts:readonly number[];
  readonly underflow:number; readonly overflow:number };
```

Detached bin edges and counts with explicit underflow and overflow totals.

[Details](api-reference.md#complete-statistics)

<a id="area-geometry"></a>

## geometry

<a id="geometry-contains"></a>
<a id="api-177"></a>

### geometry.contains

```ts
geometry.contains(polygon:PlanarPolygon,point:{x:number;y:number},options?:{boundary?:"include"|"exclude"}):boolean
```

Test whether a planar polygon contains a point, honoring holes and the explicit include/exclude boundary rule.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-normalize"></a>
<a id="api-178"></a>

### geometry.normalize

```ts
geometry.normalize(point:Position, options:{space:Space; endpoints?:"closed"|"half-open"}):Position | undefined
```

Return detached coordinates normalized to the supplied spatial boundaries, or undefined outside a hard boundary.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-displacement"></a>
<a id="api-179"></a>

### geometry.displacement

```ts
geometry.displacement(from:Position,to:Position,options:{space:Space;wrap?:boolean}):Position
```

Return the coordinate displacement between compatible positions; wrapping uses the configured shortest per-axis displacement by default.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-distance"></a>
<a id="api-180"></a>

### geometry.distance

```ts
geometry.distance(from:Position,to:Position,options:{space:Space;wrap?:boolean}):number
```

Return Euclidean distance using the selected spatial displacement and optional wrapping.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-bearing"></a>
<a id="api-181"></a>

### geometry.bearing

```ts
geometry.bearing(from:Position,to:Position,options:{space:Space;wrap?:boolean}):
  {readonly heading?:number;readonly pitch?:number} | undefined
```

Return planar heading or XYZ heading/pitch toward a compatible position; coincident positions return undefined.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-neighbors"></a>
<a id="api-182"></a>

### geometry.neighbors

```ts
geometry.neighbors(cell:Position,options:{space:Space;cellSize?:number;neighborhood?:"moore"|"faces"}):readonly Position[]
```

Return detached adjacent cell-center positions using Moore or face adjacency and explicit space/cell size.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-direction"></a>
<a id="api-183"></a>

### geometry.direction

```ts
geometry.direction(orientation:Orientation):Position
```

Convert orientation angles to a detached unit forward vector without creating or moving an Agent.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-rotate"></a>
<a id="api-184"></a>

### geometry.rotate

```ts
geometry.rotate(orientation:Orientation,options:{angle:number;axis?:"x"|"y"|"z"}):Orientation
```

Return a detached orientation after an explicit local-axis turn or facing a target; preserve caller data.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-rotate-2"></a>
<a id="api-185"></a>

### geometry.rotate

```ts
geometry.rotate(orientation:Orientation,options:{towards:Position;from:Position;space:Space;wrap?:boolean;roll?:"preserve"|"zero"}):Orientation
```

Return a detached orientation after an explicit local-axis turn or facing a target; preserve caller data.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-split-path"></a>
<a id="api-186"></a>

### geometry.splitPath

```ts
geometry.splitPath(from:{x:number;y:number},to:{x:number;y:number},options:{space:Space;mode?:"clip"|"reject"}):
  readonly {readonly from:{readonly x:number;readonly y:number};readonly to:{readonly x:number;readonly y:number}}[]
```

Return detached planar path pieces split at wrap seams or clipped/rejected at hard bounds, without changing model objects.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-bounds"></a>
<a id="api-187"></a>

### geometry.bounds

```ts
geometry.bounds(features:PlanarDataset | readonly PlanarFeature[]):Bounds | undefined
```

Return planar feature bounds, or undefined when there are no non-null coordinates.

[Details](api-reference.md#pure-spatial-contracts)

<a id="geometry-map"></a>
<a id="api-188"></a>

### geometry.map

```ts
geometry.map(point:{x:number;y:number},options:{from:Bounds;to:Bounds;mode?:"uniform-centered"|"independent-axes"}):{readonly x:number;readonly y:number}
```

Map planar coordinates between explicit bounds with uniform centered or independent-axis scaling; no implicit CRS conversion.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-orientation"></a>
<a id="api-169"></a>

### Orientation

```ts
type Orientation = { readonly heading:number; readonly pitch?:number; readonly roll?:number };
```

Heading and optional pitch/roll in degrees, using the library’s documented local-axis convention.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-bounds"></a>
<a id="api-170"></a>

### Bounds

```ts
type Bounds = readonly [number,number,number,number]; // minX,maxX,minY,maxY
```

Planar coordinate envelope ordered as minimum x, maximum x, minimum y, maximum y.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-xy"></a>
<a id="api-171"></a>

### PlanarXY

```ts
type PlanarXY = readonly [number,number];
```

Finite planar coordinate pair ordered as x, y.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-polygon"></a>
<a id="api-172"></a>

### PlanarPolygon

```ts
type PlanarPolygon = {readonly type:"Polygon";readonly coordinates:readonly (readonly PlanarXY[])[]};
```

Planar polygon rings: exterior first, followed by holes, with explicit repeated closure and validated nonintersecting geometry.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-geometry"></a>
<a id="api-173"></a>

### PlanarGeometry

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

```ts
type PlanarJson = null | boolean | number | string | readonly PlanarJson[] | {readonly [key:string]:PlanarJson};
```

JSON-compatible feature property values; numeric values must be finite.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-feature"></a>
<a id="api-175"></a>

### PlanarFeature

```ts
interface PlanarFeature {readonly type:"Feature";readonly id?:string|number;
 readonly geometry:PlanarGeometry|null;readonly properties:Readonly<Record<string,PlanarJson>>|null}
```

GeoJSON feature with optional ID, nullable planar geometry and nullable ordinary JSON properties.

[Details](api-reference.md#pure-spatial-contracts)

<a id="type-planar-dataset"></a>
<a id="api-176"></a>

### PlanarDataset

```ts
interface PlanarDataset {readonly features:readonly PlanarFeature[];
 readonly coordinateSystem:{readonly crs:string;readonly units:string}}
```

Detached planar features accompanied by explicit coordinate-reference-system and unit labels.

[Details](api-reference.md#pure-spatial-contracts)

<a id="area-agenda"></a>

## Agenda

<a id="agenda-add"></a>
<a id="api-189"></a>

### Agenda.add

```ts
Agenda.add<E = unknown>(): Agenda<E>
```

Store timed event data and return due events in time, priority and insertion order. Advancing the Agenda changes its own time only; event handling remains explicit.

[Details](api-reference.md#agenda)

<a id="agenda-time"></a>
<a id="api-195"></a>

### agenda.time

```ts
agenda.time: number
```

Read the current agenda time, starting at 0. advance changes only this time; it never advances world.tick.value.

[Details](api-reference.md#agenda)

<a id="agenda-add-2"></a>
<a id="api-190"></a>

### agenda.add

```ts
agenda.add(options: { at: number; data: E; priority?: number }): EventHandle<E>
```

Queue plain event data at at ≥ agenda.time; priority defaults to 0, with lower priorities first at equal time and insertion sequence resolving remaining ties. Return an issued cancellation handle.

[Details](api-reference.md#agenda)

<a id="agenda-delete"></a>
<a id="api-191"></a>

### agenda.delete

```ts
agenda.delete(handle: EventHandle<E>): void
```

Cancel this Agenda’s issued event handle; deleting an already absent event is a no-op.

[Details](api-reference.md#agenda)

<a id="agenda-advance"></a>
<a id="api-192"></a>

### agenda.advance

```ts
agenda.advance(options: { until: number; maxEvents?: number }): readonly Event<E>[]
```

Return detached due events in time/priority/sequence order; maxEvents defaults to 1000. If due events remain after the budget, stop agenda.time at the last dispatched time; otherwise advance it to until. Never advances World ticks.

[Details](api-reference.md#agenda)

<a id="type-event-handle"></a>
<a id="api-193"></a>

### EventHandle

```ts
type EventHandle<E> = { readonly id: string; readonly agenda: Agenda<E> };
```

Opaque issued cancellation identity tied to one Agenda; foreign or forged handles reject.

[Details](api-reference.md#agenda)

<a id="type-event"></a>
<a id="api-194"></a>

### Event

```ts
type Event<E> = { readonly id: string; readonly at: number; readonly priority: number; readonly sequence: number; readonly data: E };
```

Detached scheduled event data with identity, time, priority and insertion sequence.

[Details](api-reference.md#agenda)

<a id="area-experiments"></a>

## experiments

<a id="experiments-design"></a>
<a id="api-263"></a>

### experiments.design

```ts
experiments.design(input: { constants?: StudyParameters; axes: readonly StudyAxis[]; maxScenarios?: number }): readonly StudyScenario[]
```

Expand a bounded Cartesian parameter design into ordered scenarios without running models or drawing randomness.

[Details](api-reference.md#study-design-contract)

<a id="experiments-design-2"></a>
<a id="api-264"></a>

### experiments.design

```ts
experiments.design<Parameters extends StudyParameters>(input: { defaults: Parameters; axes: readonly StudyAxisFor<Parameters>[]; maxScenarios?: number }): readonly StudyScenario<StudyParameterValues<Parameters>>[]
```

Expand a bounded Cartesian parameter design into ordered scenarios without running models or drawing randomness.

[Details](api-reference.md#study-design-contract)

<a id="experiments-replicate"></a>
<a id="api-265"></a>

### experiments.replicate

```ts
experiments.replicate<Parameters>(scenarios: readonly StudyScenario<Parameters>[], seeds: readonly number[], options?: { maxRuns?: number }): readonly PlannedRun<Parameters>[]
```

Expand ordered scenarios over explicit seeds into a bounded whole-run plan without running models.

[Details](api-reference.md#study-design-contract)

<a id="experiments-run"></a>
<a id="api-261"></a>

### experiments.run

```ts
experiments.run<Parameters,Model extends ExperimentModel,Measurements>(options: ExperimentOptions<Parameters,Model,Measurements> & {pause?:never}): StudyResult<Parameters,Measurements>
```

Run the finite study and return its terminal outcomes. Pausing is not accepted by this overload.

[Details](api-reference.md#study-options-contract)

<a id="experiments-run-2"></a>
<a id="api-262"></a>

### experiments.run

```ts
experiments.run<Parameters,Model extends ExperimentModel,Measurements>(options: ExperimentOptions<Parameters,Model,Measurements> & Required<Pick<ExperimentOptions<Parameters,Model,Measurements>,"pause">>): StudyResult<Parameters,Measurements> | StudyCheckpoint<Parameters,Measurements>
```

Run the finite study with an explicit boundary-pause policy. Return terminal outcomes or a resumable checkpoint.

[Details](api-reference.md#study-options-contract)

<a id="experiments-summarize"></a>
<a id="api-266"></a>

### experiments.summarize

```ts
experiments.summarize<Parameters,Measurements>(result: StudyResult<Parameters,Measurements>, select: (outcome: StudyOutcome<Parameters,Measurements>) => number | undefined): readonly ReplicationSummary[]
```

Summarize an explicit numeric selection from per-run outcomes, keeping missing/failed runs distinct.

[Details](api-reference.md#study-design-contract)

<a id="experiments-bind"></a>
<a id="api-269"></a>

### experiments.bind

```ts
experiments.bind<Model extends ExperimentModel>(spec: BehaviorSpaceSpec, bindings: BehaviorSpaceBindings<Model>): BoundBehaviorSpace<Model>
```

Bind recognized BehaviorSpace source labels to explicit TypeScript callbacks and a finite run plan; never evaluate source strings.

[Details](api-reference.md#study-behaviorspace-contract)

<a id="experiments-run-3"></a>
<a id="api-270"></a>

### experiments.run

```ts
experiments.run<Model extends ExperimentModel>(bound: BoundBehaviorSpace<Model>): StudyResult<StudyParameters,Readonly<Record<string,StudyScalar>>>
```

Execute the validated bound BehaviorSpace plan using its explicitly supplied model callbacks and ordinary study lifecycle. No source strings are evaluated.

[Details](api-reference.md#study-behaviorspace-contract)

<a id="experiments-evaluate"></a>
<a id="api-271"></a>

### experiments.evaluate

```ts
experiments.evaluate<Parameters,Model extends ExperimentModel,Measurements>(input:
  Omit<ExperimentOptions<Parameters,Model,Measurements>,"parameters" | "plan" | "pause"> & {
    pause?: never; candidates: readonly StudyScenario<Parameters>[]; seeds: readonly number[]; objective: CandidateObjective<Parameters,Measurements>
  }): CandidateEvaluation<Parameters,Measurements>
```

Evaluate a finite candidate grid against explicit observations, objective and seeds; no implicit optimizer or pausing.

[Details](api-reference.md#study-calibration-contract)

<a id="experiments-select"></a>
<a id="api-272"></a>

### experiments.select

```ts
experiments.select<Parameters,Measurements>(evaluation: CandidateEvaluation<Parameters,Measurements>, options: { maxMeanLossDelta: number }): CandidateSelection<Parameters,Measurements>
```

Select eligible candidates within the supplied mean-loss difference of the best eligible result.

[Details](api-reference.md#study-calibration-contract)

<a id="experiments-holdout"></a>
<a id="api-273"></a>

### experiments.holdout

```ts
experiments.holdout<Parameters,Model extends ExperimentModel,Measurements>(selection: CandidateSelection<Parameters,Measurements>, input:
  Omit<ExperimentOptions<Parameters,Model,Measurements>,"parameters" | "plan" | "pause"> & { pause?: never; seeds: readonly number[]; objective: CandidateObjective<Parameters,Measurements> }
): CandidateHoldout<Parameters,Measurements>
```

Evaluate a fixed candidate selection using disjoint held-out seeds and observation identities.

[Details](api-reference.md#study-calibration-contract)

<a id="experiments-resume"></a>
<a id="api-274"></a>

### experiments.resume

```ts
experiments.resume<Parameters,Model extends ExperimentModel,Measurements>(checkpoint: StudyCheckpoint<Parameters,Measurements>, callbacks: {
  create(parameters:Parameters,seed:number,run:PlannedRun<Parameters>):Model;
  load(snapshot: WorldSnapshot<unknown> | BundleSnapshot<unknown>, run:PlannedRun<Parameters>):Model;
  measure(model:Model):Measurements;
  sampleWhen?(model:Model,completedSteps:number):boolean;
  stopWhen?(model:Model,completedSteps:number):boolean;
  after?(result:StudyResult<Parameters,Measurements>):void;
  host?:{ advance(model:Model):void | "stopped" };
  pause?:{ when(model:Model,completedSteps:number):boolean; save(model:Model):Snapshot<unknown,unknown> };
}): StudyResult<Parameters,Measurements> | StudyCheckpoint<Parameters,Measurements>
```

Continue a validated paused study after explicitly rebinding callbacks, preserving completed outcomes and remaining budgets.

[Details](api-reference.md#study-boundaries-contract)

<a id="experiments-run-4"></a>
<a id="api-267"></a>

### experiments.run

```ts
experiments.run<Parameters extends StudyParameters,Measurements>(options: {
  plan: readonly PlannedRun<Parameters>[];
  executor: { moduleUrl: string; exportName: string; sha256: string; config?: NodeStudyConfig };
  steps: number; every?: number; sampleInitial?: boolean; sampleFinal?: boolean;
  provenance?: Readonly<Record<string,string>>; maxTotalSteps?: number; maxTotalSamples?: number;
  timeoutMs: number; concurrency?: number; signal?: StudyCancellationSignal;
}): Promise<NodeStudyResult<Parameters,Measurements>>
```

Available from agent-loom/experiments/node. Execute whole independent runs in native Node workers through the optional Node host subpath. Validate the trusted provider module and preserve plan-order outcomes, including transport failures.

[Details](api-reference.md#study-worker-contract)

<a id="type-experiment-model"></a>
<a id="api-258"></a>

### ExperimentModel

```ts
interface ExperimentModel { readonly world: World; step(): void; dispose?(): void }
```

Ordinary model object with its World, synchronous step procedure and optional cleanup.

[Details](api-reference.md#study-options-contract)

<a id="type-experiment-plan"></a>
<a id="api-259"></a>

### ExperimentPlan

```ts
type ExperimentPlan<Parameters> =
  | { readonly parameters: readonly Parameters[]; readonly seeds: readonly number[]; readonly plan?: never }
  | { readonly plan: readonly PlannedRun<Parameters>[]; readonly parameters?: never; readonly seeds?: never };
```

Either a parameter/seed Cartesian plan or an explicit ordered run plan; the two forms are mutually exclusive.

[Details](api-reference.md#study-options-contract)

<a id="type-experiment-options"></a>
<a id="api-260"></a>

### ExperimentOptions

```ts
type ExperimentOptions<Parameters,Model extends ExperimentModel,Measurements> = ExperimentPlan<Parameters> & {
  create(parameters: Parameters, seed: number, run: PlannedRun<Parameters>): Model;
  readonly steps: number;
  measure(model: Model): Measurements;
  readonly every?: number;
  readonly sampleInitial?: boolean;
  readonly sampleFinal?: boolean;
  sampleWhen?(model: Model, completedSteps: number): boolean;
  stopWhen?(model: Model, completedSteps: number): boolean;
  readonly onError?: "stop" | "continue";
  before?(plan: readonly PlannedRun<Parameters>[]):void;
  after?(result:StudyResult<Parameters,Measurements>):void;
  readonly pause?: { when(model:Model,completedSteps:number):boolean; save(model:Model):Snapshot<unknown,unknown> };
  readonly provenance?: Readonly<Record<string,string>>;
  readonly maxTotalSteps?: number;
  readonly maxTotalSamples?: number;
  readonly host?: { advance(model: Model): void | "stopped" };
};
```

Model factory, finite plan, horizon, measurement/sampling policies and optional stopping, hooks and pause callbacks.

[Details](api-reference.md#study-options-contract)

<a id="type-worker-study-provider"></a>
<a id="api-268"></a>

### WorkerStudyProvider

```ts
type WorkerStudyProvider<Parameters,Model extends ExperimentModel,Measurements> = (config: NodeStudyConfig) =>
  Pick<ExperimentOptions<Parameters,Model,Measurements>,"create" | "measure" | "sampleWhen" | "stopWhen" | "host">;
```

Synchronous Node worker provider factory that turns validated transport configuration into create/measure and optional sampling, stopping and host callbacks. Exported through agent-loom/experiments/node.

[Details](api-reference.md#study-worker-contract)

<a id="type-study-checkpoint"></a>
<a id="api-275"></a>

### StudyCheckpoint

```ts
interface StudyCheckpoint<Parameters,Measurements> {
  readonly framework: "agent-loom-study"; readonly version: 1; readonly kind: "paused";
  readonly plan: readonly PlannedRun<Parameters>[];
  readonly policy: { readonly steps:number; readonly every:number; readonly sampleInitial:boolean;
    readonly sampleFinal:boolean; readonly onError:"stop"|"continue";
    readonly maxTotalSteps:number; readonly maxTotalSamples:number;
    readonly provenance:Readonly<Record<string,string>> };
  readonly cursor: number;
  readonly outcomes: readonly StudyOutcome<Parameters,Measurements>[];
  readonly active: { readonly run:PlannedRun<Parameters>; readonly snapshot:unknown;
    readonly completedSteps:number; readonly samples:readonly StudySample<Measurements>[] };
  readonly consumedSteps:number; readonly consumedSamples:number;
  readonly beforeCompleted:boolean; readonly afterCompleted:false;
}
```

Versioned paused-study data retaining plan, policies, outcomes, samples and saved model state for explicit continuation.

[Details](api-reference.md#study-boundaries-contract)

<a id="type-widen-study-scalar"></a>
<a id="api-276"></a>

### WidenStudyScalar

```ts
type WidenStudyScalar<Value extends StudyScalar> = Value extends number ? number : Value extends boolean ? boolean : string;
```

Map a scalar literal type to its corresponding number, boolean or string value type.

[Details](api-reference.md#study-contracts-general)

<a id="type-behavior-space-axis"></a>
<a id="api-277"></a>

### BehaviorSpaceAxis

```ts
export interface BehaviorSpaceAxis {
	readonly variable: string;
	readonly values: readonly string[];
}
```

Declared variable name with bounded source-literal values for explicit caller decoding.

[Details](api-reference.md#study-contracts-general)

<a id="type-behavior-space-spec"></a>
<a id="api-278"></a>

### BehaviorSpaceSpec

```ts
export interface BehaviorSpaceSpec {
	readonly version: 1 | 2;
	readonly dialect: "netlogo-7.0.4-finite-v2" | "netlogo-7.0.0-finite-v1";
	readonly name: string;
	readonly repetitions: number;
	readonly runMetricsEveryStep: boolean;
	readonly timeLimit: number;
	readonly setup: string;
	readonly go: string;
	readonly exitCondition?: string;
	readonly runMetricsCondition?: string;
	readonly metrics: readonly string[];
	readonly axes: readonly BehaviorSpaceAxis[];
	readonly originalXml: string;
 readonly subexperiments?:readonly { readonly axes:readonly BehaviorSpaceAxis[] }[];
 readonly preExperiment?:string; readonly postExperiment?:string;
}
```

Versioned finite BehaviorSpace plan retaining source labels, parameter axes, repetition and measurement policies.

[Details](api-reference.md#study-contracts-general)

<a id="type-behavior-space-measurement"></a>
<a id="api-279"></a>

### BehaviorSpaceMeasurement

```ts
export type BehaviorSpaceMeasurement = Readonly<Record<string, StudyScalar>>;
```

Read-only named scalar measurements emitted by a bound BehaviorSpace study.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-objective"></a>
<a id="api-280"></a>

### CandidateObjective

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

```ts
export type CandidateScore<Parameters> = {
	readonly candidate: StudyScenario<Parameters>;
	readonly requested: number;
	readonly valid: number;
	readonly failed: number;
	readonly sampleSd: number | null;
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

```ts
declare const selectionMeasurement: unique symbol;
```

Type-level identity brand used by CandidateSelection to preserve its measurement type. This declaration does not expose a public runtime operation.

[Details](api-reference.md#study-contracts-general)

<a id="type-candidate-selection"></a>
<a id="api-285"></a>

### CandidateSelection

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
			readonly completedSteps: 0;
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
			readonly completedSteps: null;
			readonly error: { readonly name: string; readonly message: string };
	  };
```

Completed worker outcome, cancelled-before-start record or explicit transport failure for a planned run.

[Details](api-reference.md#study-contracts-general)

<a id="type-node-study-result"></a>
<a id="api-291"></a>

### NodeStudyResult

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

```ts
export type StudyScalar = number | boolean | string;
```

Number, boolean or string parameter/measurement value, validated by its study contract.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-parameters"></a>
<a id="api-293"></a>

### StudyParameters

```ts
export type StudyParameters = Readonly<Record<string, StudyScalar>>;
```

Read-only named scalar parameter settings for a study scenario.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-axis"></a>
<a id="api-294"></a>

### StudyAxis

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

```ts
export type StudyStatus = "completed" | "stopped" | "failed" | "skipped";
```

Completed, stopped, failed or skipped terminal run status.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-terminal"></a>
<a id="api-303"></a>

### StudyTerminal

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

```ts
export type StudyOutcome<Parameters, Measurements> = StudyTerminal & {
	readonly run: PlannedRun<Parameters>;
	readonly completedSteps: number;
	readonly samples: readonly StudySample<Measurements>[];
};
```

Terminal run status plus plan identity, completed-step count and retained samples.

[Details](api-reference.md#study-contracts-general)

<a id="type-study-result"></a>
<a id="api-305"></a>

### StudyResult

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

```ts
export interface ReplicationSummary {
	readonly scenarioId: string;
	readonly scenarioIndex: number;
	readonly requested: number;
	readonly completed: number;
	readonly stopped: number;
	readonly failed: number;
	readonly skipped: number;
	readonly valid: number;
	readonly missing: number;
	readonly mean: number | null;
	readonly sampleSd: number | null;
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

### BehaviorSpaceBindings

```ts
interface BehaviorSpaceBindings<Model extends ExperimentModel> {
 readonly seeds: readonly number[];
 decodeLiteral(source:string, variable:string): StudyScalar;
 readonly setup: { readonly source:string; create(parameters:StudyParameters,seed:number,run:PlannedRun<StudyParameters>):Model };
 readonly go: { readonly source:string };
 readonly metrics: readonly { readonly source:string; report(model:Model):StudyScalar }[];
 readonly exitCondition?:{ readonly source:string; test(model:Model):boolean };
 readonly runMetricsCondition?:{ readonly source:string; test(model:Model):boolean };
 readonly preExperiment?:{ readonly source:string; run(plan:readonly PlannedRun<StudyParameters>[]):void };
 readonly postExperiment?:{ readonly source:string; run(result:StudyResult<StudyParameters,Readonly<Record<string,StudyScalar>>>):void };
 readonly provenance?:Readonly<Record<string,string>>;
}
```

Explicit source-label bindings to model creation, measurement, stopping and study hooks; no source evaluation.

[Details](api-reference.md#study-contracts-general)

<a id="type-bound-behavior-space"></a>
<a id="api-308"></a>

### BoundBehaviorSpace

```ts
interface BoundBehaviorSpace<Model extends ExperimentModel> {
 readonly spec:BehaviorSpaceSpec;
 readonly plan:readonly PlannedRun<StudyParameters>[];
 readonly options:ExperimentOptions<StudyParameters,Model,Readonly<Record<string,StudyScalar>>>;
}
```

Validated BehaviorSpace specification, materialized run plan and ordinary experiment options.

[Details](api-reference.md#study-contracts-general)

<a id="area-storage"></a>

## storage

<a id="storage-save"></a>
<a id="api-326"></a>

### storage.save

```ts
storage.save<V>(value: V): Snapshot<V, {}>
```

Save exactly the supplied supported value and optional extra state as an independent in-memory Snapshot; preserve aliases, cycles and declared component relationships.

[Details](api-reference.md#codecs)

<a id="storage-save-2"></a>
<a id="api-363"></a>

### storage.save

```ts
storage.save<V>(value: V, options: { valueCodecs: readonly ValueCodec[] }): Snapshot<V, {}>
```

Save exactly the supplied supported value and optional extra state as an independent in-memory Snapshot; preserve aliases, cycles and declared component relationships.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-save-3"></a>
<a id="api-364"></a>

### storage.save

```ts
storage.save<V,S>(value: V, options: { state: S; valueCodecs?: readonly ValueCodec[] }): Snapshot<V,S>
```

Save exactly the supplied supported value and optional extra state as an independent in-memory Snapshot; preserve aliases, cycles and declared component relationships.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-load"></a>
<a id="api-366"></a>

### storage.load

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

```ts
storage.encode<V, S>(snapshot: Snapshot<V, S>, options: { format: "snapshot-json" }): string
```

Convert the supplied value to the explicit named format or synchronous Format adapter. Returns text or bytes and performs no file access.

[Details](api-reference.md#codecs)

<a id="storage-decode"></a>
<a id="api-342"></a>

### storage.decode

```ts
storage.decode(text: string, options: { format: "snapshot-json"; limits?: DecodeLimits }):
  WorldSnapshot<unknown> | BundleSnapshot<unknown> | DataSnapshot<unknown>
```

Validate and decode the explicit named format or synchronous Format adapter. Returns its documented data type; decoded custom model values remain untrusted until validated.

[Details](api-reference.md#complete-snapshot-validation)

<a id="storage-encode-2"></a>
<a id="api-335"></a>

### storage.encode

```ts
storage.encode<Value, Encoded extends string | Uint8Array>(value: Value, options: { format: Format<Value, Encoded> }): Encoded
```

Convert the supplied value to the explicit named format or synchronous Format adapter. Returns text or bytes and performs no file access.

[Details](api-reference.md#storage-formats)

<a id="storage-decode-2"></a>
<a id="api-336"></a>

### storage.decode

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

```ts
storage.history(options?: { capacity?: number }): History
```

Create an independent bounded numeric measurement history; capacity defaults to 300. Recording is explicit and evicts the oldest samples when full.

[Details](api-reference.md#history)

<a id="history-samples"></a>
<a id="api-340"></a>

### history.samples

```ts
history.samples: readonly Sample[]
```

Read a detached chronological read-only snapshot of retained samples.

[Details](api-reference.md#history)

<a id="history-add"></a>
<a id="api-339"></a>

### history.add

```ts
history.add(sample: { tick: number; values: Readonly<Record<string, number>> }): void
```

Record a detached finite numeric sample. Ticks strictly increase; the first sample establishes the metric keys.

[Details](api-reference.md#history)

<a id="history-delete"></a>
<a id="api-341"></a>

### history.delete

```ts
history.delete(): void
```

Empty samples, metric keys and last-tick marker while retaining capacity. The next sample starts a new series.

[Details](api-reference.md#history)

<a id="storage-is"></a>
<a id="api-345"></a>

### storage.is

```ts
storage.is<K extends keyof StoredKinds>(value: unknown, kind: K): value is StoredKinds[K]
```

Check the library-issued identity kind of a component or event handle and narrow its base framework type. This guard neither validates custom state nor revives deleted identities.

[Details](api-reference.md#restored-kind-validation)

<a id="storage-encode-3"></a>
<a id="api-321"></a>

### storage.encode

```ts
storage.encode(graph: Graph, options: {
  format: "graph-json" | "graphml" | "edge-list" | "adjacency-matrix";
  nodeId?: (node: object) => string
}): string
```

Encode the explicitly selected graph text format. graph-json preserves JSON-safe GraphData; GraphML preserves supported scalar attributes and declared topology metadata. edge-list is the versioned Agent Loom UTF-8 TSV dialect with JSON-escaped fields, not a guessed two-column format. adjacency-matrix rejects mixed directions and parallel edges, requires finite nonzero edge.weight, and loses other node/edge state; zero denotes no edge. No file access.

[Details](api-reference.md#graph-interchange)

<a id="storage-decode-3"></a>
<a id="api-322"></a>

### storage.decode

```ts
storage.decode(text: string, options: {
  format: "graph-json" | "graphml" | "edge-list" | "adjacency-matrix"
}): GraphData<unknown, unknown>
```

Decode the explicit graph format to validated detached GraphData with unknown model values. graph-json uses its versioned envelope; GraphML rejects DTDs/entities and unsupported nested attributes. edge-list requires the versioned Agent Loom TSV header and complete graph/node/edge records. adjacency-matrix validates square shape, IDs, finite entries and undirected symmetry, reconstructing nodes by ID and nonzero weight edges rather than arbitrary model state. No file access.

[Details](api-reference.md#graph-interchange)

<a id="storage-decode-4"></a>
<a id="api-323"></a>

### storage.decode

```ts
storage.decode(text: string, options: { format: "behaviorspace" }): readonly BehaviorSpaceSpec[]
```

Validate and decode the explicit named format or synchronous Format adapter. Returns its documented data type; decoded custom model values remain untrusted until validated.

[Details](api-reference.md#study-behaviorspace-contract)

<a id="storage-encode-4"></a>
<a id="api-324"></a>

### storage.encode

```ts
storage.encode(checkpoint: StudyCheckpoint<unknown,unknown>, options:{format:"study-json"}):string
```

Convert the supplied value to the explicit named format or synchronous Format adapter. Returns text or bytes and performs no file access.

[Details](api-reference.md#study-boundaries-contract)

<a id="storage-decode-5"></a>
<a id="api-325"></a>

### storage.decode

```ts
storage.decode(text:string, options:{format:"study-json"}):StudyCheckpoint<unknown,unknown>
```

Validate and decode the explicit named format or synchronous Format adapter. Returns its documented data type; decoded custom model values remain untrusted until validated.

[Details](api-reference.md#study-boundaries-contract)

<a id="storage-decode-6"></a>
<a id="api-365"></a>

### storage.decode

```ts
storage.decode(data: unknown, options: { format: "legacy-world-data"; valueCodecs?: readonly ValueCodec[] }): WorldSnapshot<unknown>
```

Validate the supported old in-memory model-state schema and convert it to a WorldSnapshot; optional value codecs adapt unsupported ordinary payload values. Nonempty presentation sections reject.

[Details](api-reference.md#snapshot-wire-schema)

<a id="storage-decode-7"></a>
<a id="api-367"></a>

### storage.decode

```ts
storage.decode(text:string, options:{format:"legacy-network-json"}):LegacyNetworkData
```

Decode the explicitly selected legacy simple-network data or JSON format into validated detached canonical nodes and edges; no live Graph is created.

[Details](api-reference.md#public-resource-limits)

<a id="storage-decode-8"></a>
<a id="api-368"></a>

### storage.decode

```ts
storage.decode(data:unknown, options:{format:"legacy-network-data"}):LegacyNetworkData
```

Decode the explicitly selected legacy simple-network data or JSON format into validated detached canonical nodes and edges; no live Graph is created.

[Details](api-reference.md#public-resource-limits)

<a id="storage-decode-9"></a>
<a id="api-369"></a>

### storage.decode

```ts
storage.decode(text: string, options: { format: "geojson"; coordinateSystem: { crs: string; units: string } }): PlanarDataset
```

Decode validated planar GeoJSON into detached features and mandatory explicit CRS/unit labels. No reprojection; XYZ coordinates reject.

[Details](api-reference.md#complete-external-codecs)

<a id="storage-encode-5"></a>
<a id="api-370"></a>

### storage.encode

```ts
storage.encode(value: PlanarGeometry | PlanarFeature | PlanarDataset | readonly PlanarFeature[], options: { format: "geojson" }): string
```

Encode supported planar GeoJSON geometry/features. Coordinate-system labels are not written into geometry; callers retain them separately.

[Details](api-reference.md#complete-external-codecs)

<a id="storage-encode-6"></a>
<a id="api-371"></a>

### storage.encode

```ts
storage.encode(value: readonly BehaviorSpaceSpec[], options: { format: "behaviorspace" }): string
```

Encode the declarative BehaviorSpace plan as escaped XML without translating TypeScript callbacks into source commands.

[Details](api-reference.md#complete-external-codecs)

<a id="storage-decode-10"></a>
<a id="api-372"></a>

### storage.decode

```ts
storage.decode(text: string, options: { format: "legacy-world-json" }): WorldSnapshot<unknown>
```

Validate and convert the supported old model-only world JSON schema to a WorldSnapshot. Nonempty presentation sections reject; decoded custom state remains unknown.

[Details](api-reference.md#complete-snapshot-validation)

<a id="type-data-snapshot"></a>
<a id="api-333"></a>

### DataSnapshot

```ts
type DataSnapshot<S = unknown> = Snapshot<unknown, S> & { readonly rootKind: "data" };
```

Opaque data-only Snapshot with rootKind data; loading creates supported data without manufacturing a World.

[Details](api-reference.md#storage-data)

<a id="type-format"></a>
<a id="api-334"></a>

### Format

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

```ts
type DecodeLimits = { bytes?: number; depth?: number; records?: number; references?: number; items?: number };
```

Caller-selected caps for encoded bytes and decoded depth, records, references and items.

[Details](api-reference.md#complete-snapshot-validation)

<a id="type-stored-kinds"></a>
<a id="api-344"></a>

### StoredKinds

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

```ts
Snapshot<V, S>
```

Opaque library-produced snapshot retaining inferred root V and extra-state S types in memory. Read-only rootKind is world, bundle or data; only library-created snapshots are accepted.

[Details](api-reference.md#codecs)

<a id="type-world-snapshot"></a>
<a id="api-374"></a>

### WorldSnapshot

```ts
WorldSnapshot<S>
```

`Snapshot<World, S>` with read-only rootKind "world". After decoding, S is unknown; loading the narrowed snapshot yields a World.

[Details](api-reference.md#codecs)

<a id="type-bundle-snapshot"></a>
<a id="api-375"></a>

### BundleSnapshot

```ts
BundleSnapshot<S>
```

`Snapshot<Readonly<Record<string, unknown>>, S>` with read-only rootKind "bundle". After decoding, bundle field values and extra state require caller validation.

[Details](api-reference.md#codecs)

<a id="type-sample"></a>
<a id="api-376"></a>

### Sample

```ts
Sample
```

Detached observation containing a finite nonnegative numeric tick and a record of finite numeric metric values. History samples are returned read-only in chronological insertion order.

[Details](api-reference.md#history)

<a id="type-history"></a>
<a id="api-377"></a>

### History

```ts
History
```

Bounded independent measurement container. Explicit add records observations; samples exposes retained observations; delete resets samples, metric keys and last-tick marker while retaining capacity.

[Details](api-reference.md#history)

<a id="type-legacy-network-data"></a>
<a id="api-379"></a>

### LegacyNetworkData

```ts
interface LegacyNetworkData { readonly directed:boolean; readonly nodes:readonly string[]; readonly edges:readonly {readonly from:string;readonly to:string}[] }
```

Detached canonical legacy simple-network data containing direction, node IDs and endpoint pairs.

[Details](api-reference.md#public-resource-limits)

<a id="type-wire-value"></a>
<a id="api-346"></a>

### WireValue

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

```ts
type Ref = { tag: "ref"; id: string };
```

Reference to another record identity inside one validated snapshot graph.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-wire-envelope"></a>
<a id="api-348"></a>

### WireEnvelope

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

```ts
type WorldRecord = {
  id: string; kind: "world"; revision: 1; modelId: string;
  tick: number; space: (Space & Required<Pick<Space, "dimensions" | "boundary">>) | null; random: Ref;
  components: readonly Ref[]; compatibility: null | {
    profile: "netlogo-7.0.0"; turtleOwn: readonly string[]; linkOwn: readonly string[];
    turtleBreeds: readonly { name: string; own: readonly string[] }[];
    linkBreeds: readonly { name: string; direction: "directed" | "undirected"; own: readonly string[] }[];
    turtleMembership: readonly (readonly [Ref,string,number])[];
    linkMembership: readonly (readonly [Ref,string,number])[];
    nextTurtleId: number; nextLinkId: number;
  };
};
```

Stored clock, optional normalized space, RNG reference, component membership and explicit compatibility provenance.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-agent-record"></a>
<a id="api-351"></a>

### AgentRecord

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

```ts
type RandomRecord = RandomState & { id: string; kind: "random"; revision: 1 };
```

Stored versioned RNG continuation with snapshot record identity.

[Details](api-reference.md#snapshot-wire-schema)

<a id="type-input-record"></a>
<a id="api-357"></a>

### InputRecord

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

<a id="area-limits"></a>

## limits

<a id="limits-netlogo"></a>
<a id="api-378"></a>

### limits.netlogo

```ts
limits.netlogo = {
  declarations: 1000, creation: 1000000, valueDepth: 32, valueNodes: 100000,
  randomIterations: 1000000
};
```

Read deeply frozen compatibility limits for declarations, creation, value traversal and random rejection iterations.

[Details](api-reference.md#public-resource-limits)

<a id="limits-geojson"></a>
<a id="api-378-geojson"></a>

### limits.geojson

```ts
limits.geojson = {
  textBytes: 8388608, features: 10000, positions: 100000, polygonPositions: 2048,
  coordinateMagnitude: 1000000000, propertyDepth: 32, propertyNodes: 100000
};
```

Read deeply frozen planar GeoJSON limits for text size, feature/coordinate counts, coordinate magnitude and property traversal.

[Details](api-reference.md#public-resource-limits)

<a id="limits-compatibility-network"></a>
<a id="api-378-compatibilityNetwork"></a>

### limits.compatibilityNetwork

```ts
limits.compatibilityNetwork = { nodes: 1024, edges: 32768, idLength: 256 };
```

Read deeply frozen limits for the explicit legacy simple-network import profile; these do not cap general live Graph models.

[Details](api-reference.md#public-resource-limits)

<a id="limits-behaviorspace"></a>
<a id="api-378-behaviorspace"></a>

### limits.behaviorspace

```ts
limits.behaviorspace = {
  textBytes: 1048576, depth: 8, elements: 20000, entityReferences: 100000,
  experiments: 100, metrics: 32, sourceLength: 65536
};
```

Read deeply frozen bounds for declarative BehaviorSpace XML parsing, experiments, metrics and source labels.

[Details](api-reference.md#public-resource-limits)

<a id="limits-study"></a>
<a id="api-378-study"></a>

### limits.study

```ts
limits.study = {
  axes: 32, parameters: 128, name: 128, string: 65536, scenarios: 10000,
  runs: 10000, steps: 1000000, totalSteps: 10000000, totalSamples: 1000000
};
```

Read deeply frozen finite-study bounds for parameter axes, scenarios, runs, completed steps and recorded samples.

[Details](api-reference.md#public-resource-limits)

<a id="area-exports-and-shared-types"></a>

## Exports and shared types

<a id="exports-agent-loom"></a>
<a id="api-1"></a>

### agent-loom

```ts
agent-loom
```

Exports Agent, Grid, Graph, Input, Random, World, run, Agenda, stats, geometry, experiments and limits.

[Details](api-reference.md#public-imports)

<a id="exports-agent-loom-storage"></a>
<a id="api-8"></a>

### agent-loom/storage

```ts
agent-loom/storage
```

Exports storage and the associated persistence types; file/database access remains caller-owned.

[Details](api-reference.md#public-imports)

<a id="exports-agent-loom-experiments-node"></a>
<a id="api-9"></a>

### agent-loom/experiments/node

```ts
agent-loom/experiments/node
```

Exports experiments with the native Node worker overload and the serial study contracts. Node-only execution is explicit.

[Details](api-reference.md#study-worker-contract)

<a id="type-space"></a>
<a id="api-2"></a>

### Space

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

```ts
type Vector = { readonly x?: number; readonly y?: number; readonly z?: number };
```

Structural x/y/z displacement data. Supported omitted components mean zero; supplied components must be finite and match the operation dimension.

[Details](api-reference.md#space-type)

<a id="type-component"></a>
<a id="api-7"></a>

### Component

```ts
type Component = Agent | Grid | Graph | Input | Agenda;
```

World membership accepts Agent, Grid, Graph, Input or Agenda. Each component has at most one World owner.

[Details](api-reference.md#space-type)

<a id="type-position"></a>
<a id="api-168"></a>

### Position

```ts
type Position = { readonly x:number; readonly y:number; readonly z?:number };
```

Finite x/y coordinates with optional z; the operation’s spatial context determines the required dimension.

[Details](api-reference.md#pure-spatial-contracts)

## Additive ordinary tools

The root exports `measurements`, `twoPhase` and `continuous` add pure measurement projection, a synchronous compute/commit barrier and linear threshold calculations. World activation also accepts fixed and stable priority ordering. Their [reference contracts](api-reference.md#additive-measurement-and-update-tools) and [frozen examples](../mesa-expansion/STATUS.md) supplement the original operation inventory; they do not imply complete continuation or NetLogo compatibility.
