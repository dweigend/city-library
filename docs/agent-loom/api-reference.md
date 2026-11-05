# Agent Loom API reference

&gt; **Specification only.** City Library has no implemented public APIs yet. The signatures and examples below define the phase-one target; they cannot currently be run against this repository.

[Overview](README.md) · [API inventory](api-table.md)

The `agent-loom` import paths are specification names. Their mapping to City Library package entries is unresolved; no package installation is available.

## Contents

[Vocabulary](#vocabulary) · [Exports and shared types](#exports) · [World](#world-api) · [Agent](#agent-api) · [Grid](#grid-api) · [Field](#field-api) · [Graph](#graph-api) · [Node](#node-api) · [Edge](#edge-api) · [Random](#random-api) · [Input](#input-api) · [stats](#stats-api) · [geometry](#geometry-api) · [Agenda](#agenda-api) · [experiments](#experiments-api) · [storage](#storage-api) · [limits](#limits-api)

<a id="main"></a>

<a id="vocabulary"></a>

## Vocabulary

These meanings apply throughout the public API. Ordinary model properties remain directly readable and writable.

| Word | Meaning | API use |
| --- | --- | --- |
| `value` | Read one current principal value, where a dedicated result or state object needs it. | `world.tick.value`; `graph.flow(options).value`. Model properties such as energy stay direct. `random.number()` generates a new number. |
| `advance` | Move a temporal process forward. Its receiver defines the effects. | `world.tick.advance(amount)` changes only the counter. `agenda.advance({until,maxEvents})` processes events up to a target and returns them. |
| `reset` | Restore the receiver's specified initial state. | `world.tick.reset()` restores its value to 0. |
| `add` | Create an object or add an element to its receiver. | `Agent.add()`, `world.add(component)`. |
| `delete` | Remove the specified element. On a container, omitting the element removes all contents and keeps the container. On an individual object, delete that object. | `edge.delete()` removes one edge; `history.delete()` and `graph.delete()` empty their containers. `agent.delete()` and `edge.delete()` delete those objects. `world.delete(component)` removes membership, preserving the component; its component argument remains required. |
| `set` | Assign a specified value through a managed operation. | `input.set(object,property,value)`. Ordinary model data uses direct assignment. |
| `copy` | Create a new object with the receiver's documented copying semantics. | `agent.copy()`, `graph.copy()`, `random.copy()`. A Graph copy has independent edges and retains its original node identities. |
| `save` | Keep a supported state as saved data. | `storage.save(value)` returns a Snapshot without changing the live model. |
| `load` | Create usable objects from saved data. | `storage.load(snapshot)` returns fresh supported objects and extra state as `{value,state}`. |

Domain-specific operations retain their own meaning: `random.reseed(seed)` selects a seed and replaces the stream continuation. Each operation below defines its validation, effects and return type.

<a id="exports"></a>

## Exports and shared types

<a id="public-imports"></a>

### Public imports

```ts
import {
  Agent, Grid, Graph, Input, Random, World, run, Agenda,
  stats, geometry, experiments, limits
} from "agent-loom";
```

| Type | Meaning |
| --- | --- |
| `Position` | An object with finite x/y coordinates and optional z. `Agent` and `Field` satisfy this structure directly; dimensions must match the operation’s spatial context. |
| `Vector` | Signed x/y/z displacements; omitted supported components mean 0. |
| `Space` | Positive finite full extents x/y, with optional z, centered at the origin. x/y selects 2D; adding z selects 3D. Input may omit dimensions and boundary: dimensions derives from the axes and boundary defaults to "hard". A supplied dimensions value must match the axes. The returned `world.space` and `grid.space` are immutable snapshots with dimensions and boundary always present. Reusing a Space preserves its extents and boundary; a constructor boundary option overrides the inherited boundary for the new object only. Explicit operation spaces use the same defaults and validation before comparison with an active World space. Compare normalized per-axis values, not object identity. |
| `boundary` | A scalar "hard" or "wrap" applies to all active axes. A per-axis object selects x, y and, in 3D, z; omitted axis rules default to "hard". Unsupported axes and rule values are rejected. Context equality and attachment compare effective rules per axis, so equivalent scalar and object forms are interchangeable. A named constructor boundary option replaces the complete inherited boundary selection; it does not merge individual axis entries. Stored boundary data is read-only and copied with its context. |

**Behavior and errors**

These are target runtime exports. Optional `storage` is loaded separately; its module specifier is agent-loom/storage. `Position`, `Vector`, `Component`, `Space`, `Tick`, `Agent<S>`, `Field<F>`, `Graph<N,E>`, `Edge<N,E>` and `Route<N,E>` are also usable as public TypeScript types. `Agent`/field/edge custom properties remain directly typed; collections and explicit query sources preserve those types.

<a id="space-type"></a>

### Space

```ts
type Vector = { readonly x?: number; readonly y?: number; readonly z?: number };
type Component = Agent | Grid | Graph | Input | Agenda;
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

**Returned space types**

```ts
world.space: (Space & Required<Pick<Space, "dimensions" | "boundary">>) | undefined
grid.space: Space & Required<Pick<Space, "dimensions" | "boundary">>
```

Only x and y are required input. Include z for 3D. Dimensions is derived; boundary defaults to "hard". If dimensions is supplied when reusing a Space, it must agree with the axes. Constructors and spatial operations validate and complete the same Space data without changing the caller's object. Returned component spaces always include both derived dimensions and effective boundary rules; the Required/Pick notation expresses that guarantee using standard TypeScript, not another public type. A World without spatial input has no Space.

<a id="model-properties"></a>

### Model properties

Agent, Field and Edge expose the supplied state as ordinary typed properties. Choose names, scalar values and nested data for the model; only the documented library members are reserved. There is no required properties, metadata or UI wrapper. Declare properties in the initial state or its ordinary TypeScript type; later assignments follow that type.

The library supplies logic, identity, spatial state and data access. It supplies no built-in appearance properties, drawing commands or presentation defaults. Names such as color, size, shape, label, hidden and selected are available as custom model data with no special library meaning. A custom radius or size affects a physical calculation only when the model explicitly uses it. External applications decide how to display any property and may use Input for constrained edits.

```ts
import { Agent } from "agent-loom";

const person = Agent.add({
  name: "Anna",
  role: "worker",
  energy: 80,
  attributes: { occupation: "carpenter", experience: 12 },
});

person.energy -= 10;
console.log(person.role, person.energy); // worker, 70
```

The same supported-value and reserved-name rules apply to field and edge state. Construction and copy create independent supported data graphs; later direct assignment uses ordinary TypeScript reference semantics. Storage preserves declared custom data without a separate presentation schema. Readonly membership/query arrays retain the original objects, so consumers can read their current typed properties. Model-wide records and indexes use ordinary objects, arrays, Map or Set and can be included explicitly in storage.

<a id="complete-values"></a>

### Direct state and identity

**Behavior and errors**

Agent state, field state and edge state are own string-keyed data properties of a plain record. A supplied direct record is copied once per new individual/field/edge. The copy traverses plain records, arrays, Map, Set, Date, RegExp, ArrayBuffer and standard non-shared TypedArray/DataView views. It preserves cycles and repeated references within one clone, including shared backing buffers across views, and creates fresh containers between independent copies. RegExp requires lastIndex to be a nonnegative safe integer and preserves source, flags and lastIndex; ArrayBuffer/views preserve bytes, offsets and shared backing identity.

SharedArrayBuffer, detached buffers and active resources reject. Ordinary numbers must be finite: NaN and positive/negative Infinity reject, while negative zero is preserved. Typed-array bytes may contain any IEEE pattern as opaque byte data; numeric operations still validate finite scalar values they consume. Undefined, null, boolean, string and bigint are allowed. Sparse array holes are preserved; extra named array properties reject. Dates must have finite valid times. Symbol keys, accessors, functions, weak collections, DOM objects, Error objects and custom prototypes reject.

Proxies and objects with observable access behavior are unsupported caller inputs; JavaScript provides no universal Proxy detector, and access failures propagate before publishing a component. Framework component references preserve identity rather than being recursively copied; a deleted component reference rejects. These references never attach components implicitly. The same supported-value rules apply to Agenda event data, extra state supplied to storage.save and ordinary fixed-step experiment payloads. History and statistics impose their documented finite numeric schemas.

The following reserved-name lists are complete for target major version 1; reject these keys on the corresponding root state record. Agent reserves id, alive, world, x, y, z, heading, pitch, roll, copy, delete, move, rotate, distanceTo, directionTo, neighbors, canMove and gradient. Field reserves id, grid, x, y and z. Edge reserves id, graph, alive, from, to, directed, key, path, delete, tie and tieMode. Adding a reservation for an otherwise valid model key requires a new target major version. These lists concern root model state, not nested records or closed API options.

Object.prototype spellings such as constructor and `__proto__` remain valid data when not listed, using safe own-data property creation rather than prototype assignment. The library reserves no additional spelling merely because it appears in examples. Construction snapshots the initial data; later direct assignments follow ordinary TypeScript reference semantics. Two agents can deliberately share an object by assigning it after creation. Neither direct state assignment nor native array mutation performs library membership bookkeeping.

A snapshot follows the actual reference graph when saved and rejects unsupported values introduced since construction.

`agent.copy()` requires a living source and creates a detached living identity with copied custom state, position and orientation using the rules above. It consumes no draw and does not copy graph membership, World membership, path progress or Input bindings. New Agent/Field/Edge and component identity IDs are unique among all issued such identities within the process; local EventHandle IDs and Graph edge keys have their separately documented owner scopes. IDs are fresh opaque strings, including on load; they expose neither model randomness nor creation order.

Allocation never reuses a previously issued process-local string, and needs no serialized model counter. IDs from separate processes have no cross-process uniqueness promise. Persist meaningful numeric/domain IDs as ordinary model data; opaque framework IDs are not stable persistence keys. Copy has no options; modify the returned individual's direct state explicitly. A deleted agent retains readable final state and identity; all library mutators and spatial queries on it reject, except repeated `agent.delete()`, which is a no-op. Living detached agents remain usable.

Deletion removes incident edges and node membership in every graph retaining that agent, removes World membership and Input bindings, discards path progress, and never removes references from caller-owned arrays.

**Pure domain operations**

These synchronous value functions validate all inputs and return detached data. They never attach components, mutate caller data, advance clocks or use hidden randomness. Shape failures throw TypeError; out-of-domain quantities and nonfinite intermediate results throw RangeError. No option is implicit except the defaults explicitly stated below. Monetary and capacity arithmetic uses safe integers; spatial and time units are selected consistently by the model.

<a id="world-api"></a>

## World

<a id="reference-world"></a>

<a id="composition"></a>

<a id="world-add"></a>

### World creation

```ts
World.add(options?: { random?: Random }): World
World.add(space: Space, options?: { boundary?: Space["boundary"]; random?: Random }): World
```

`World` supplies step time, shared randomness and component membership. Its `space` is optional. Use `World.add()` or `World.add(worldOptions)` for a world without a spatial context; these options may supply a random generator. Use `World.add(space, worldOptions)` for a bounded space. Components also work independently when their required data is available.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `space` | Omitted: no spatial context | Input is a `Space`; {x,y,z?} is sufficient, or reuse an existing component space. All extents must be positive and finite, with a centered origin. Supplied boundary rules are retained; otherwise they default to "hard". The returned `world.space` adds read-only `dimensions` and `boundary`. x/y derive 2 dimensions; including z derives 3. Do not configure dimensions separately. A network-only model needs neither space nor a grid. |
| `boundary` | Inherited context boundary; otherwise "hard" | Construction option for an explicit space: "hard" or "wrap", with per-axis overrides. A named boundary option overrides the input context’s boundary for the new World only. It is read back as `world.space.boundary`, not a separate World property. Supplying boundary without space is an error; wrap requires finite extents. |
| `random` | Independent seed-1 `Random` | Explicit `Random` instance is retained by identity. No global generator. |

**Result and effects:** New `World`; no construction-time random draws. Read-only `world.space`, `world.random` and `world.tick`. Its read-only `value` starts at 0. When present, `world.space` is a normalized `Space` containing read-only x/y, optional z, `dimensions` (2 or 3) and `boundary`. Dimensions derive from the input axes; all values and the presence or absence of space are fixed for the World’s lifetime. Without spatial input, space is absent, so `world.space?.dimensions` reads the optional value using ordinary TypeScript. No dimensions, extents or boundary are invented.

The normalized context snapshots the input values; later edits to the caller’s extent object do not resize it. A context input is validated before reuse: dimensions must agree with the axes, and boundary rules must be valid for those axes. The new World snapshots extents and the selected boundary rather than retaining the input context by identity.

**Argument validation:** With one object argument, any x/y/z axis key selects the spatial form and requires valid x and y extents; with no axis keys, the object is options-only and may contain random. Spatial input may additionally contain dimensions and boundary; missing dimensions derives from the axes and missing boundary defaults to "hard". Reject mixed spatial input and World options, such as {x,y,random}, incomplete axes and unknown keys rather than ignoring them. A boundary-only first argument is an error; include x/y extents with boundary, place boundary in named options accompanying a Space, or reuse an existing Space. No undefined placeholder is needed.

<a id="world-tick"></a>

### Tick

```ts
world.tick: Tick // readonly; owned by this World

interface Tick {
  readonly value: number;
  advance(amount?: number): void;
  reset(): void;
}
```

| Member | Default | Behavior |
| --- | --- | --- |
| `world.tick.value` | 0 | Read the current tick value. Finite and nonnegative; fractions are allowed. One tick has no fixed duration in seconds. |
| `world.tick.advance(amount)` | amount = 1 | Increase the value by a finite nonnegative amount. Zero leaves it unchanged. Returns void. |
| `world.tick.reset()` | No arguments | Set the value to 0. Returns void. |

`run(world, step, steps)` increases `world.tick.value` by 1 after each successful step. A failed step does not increase it. Model step rules do not advance the same clock themselves.

**Behavior and errors**

The World creates and retains one Tick. Its reference and value are read-only; there is no separate Tick constructor. Advance and reset change only this clock. They do not execute rules, change agents or fields, dispatch Agenda events, record History samples or consume random values. Reset does not restart the model.

Advance rejects a nonnumeric amount with TypeError and a negative or nonfinite amount, or a nonfinite resulting value, with RangeError before changing the value. Fractional amounts use ordinary JavaScript number arithmetic. Both methods reject while their owning World is running, including calls from nested callbacks. Other Worlds remain independent.

History sample fields and model measurement keys use the numeric name tick; supply `world.tick.value` as that value. Snapshot WorldRecord.tick likewise stores this number; load creates the World-owned Tick with the saved value. Reset leaves History and Agenda untouched. Call `history.delete()` or replace the History before recording a lower tick value.

<a id="attach"></a>

### Attach and detach

```ts
world.add<T extends Component>(component: T): T
world.add<T extends Component>(components: Iterable<T>): readonly T[]
world.delete(component: Component | Iterable<Component>): void
```

Accept an `Agent`, `Grid`, `Graph`, `Input` or `Agenda`. Passing an array, set or other iterable performs batch attachment/detachment of its current members, not a subscription. Duplicate references in the batch are handled once; editing the local collection later does not update attachment.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `component` | Required existing object(s) | Attach the same identities. Repeated attachment to the same `World` is a no-op. A component may be attached to at most one `World`. |

**Result and effects:** Attachment does not initialize, relocate, reseed or activate objects. Validate the complete batch before changes; a foreign `World` or incompatible spatial object is an error. Future population additions require another explicit `world.add` call. Deleting missing local `World` membership is a no-op. Deleting `World` membership preserves component state, graph memberships and caller-owned collections. `Agent` deletion is a separate operation.

When `world.space` exists, spatial `Agent`/`Grid` components must match `world.space.dimensions` and fit its extents when attached. Grid compatibility is checked per axis: when both boundaries are hard, the Grid extent may be smaller but must fit inside the World extent. If either boundary wraps an axis, both must wrap that axis and have equal extents there. Reject a hard/wrap mismatch or a differing wrapped extent before attachment. All Grid dimensions must match `world.space.dimensions`.

A World without space imposes neither a shared dimension nor spatial boundaries: grids retain their own spatial contexts, and XY and XYZ agents can be registered together. Attaching a Grid never creates or changes World space, and a World never resizes a Grid. Attaching a Graph does not attach its agent nodes to the World, convert ordinary nodes into agents or infer space from node coordinates. Attach any agent nodes separately when World membership is needed. Graph connectivity, pure analysis and Input binding do not require spatial context. Detachment removes the default World context without making the component unusable.

<a id="execution"></a>

<a id="world-run"></a>

### Run model steps

```ts
run<R>(world: World, step: (() => R) &
  ([Extract<R, PromiseLike<unknown>>] extends [never] ? unknown : never), steps?: number): void
```

Import `run` from agent-loom. It invokes the supplied synchronous step function, then advances the supplied `World`’s time. It is the single public entry for advancing model steps; no parallel world.run or script alias is proposed. It does not activate agents automatically.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `steps` | 1 | Nonnegative integer count; 0 runs no rules. |
| `world` | Required `World` | Explicit context whose tick value advances; no global current `World`. |
| `step` | Required synchronous function | The model chooses which collections/actions run and in what order. Named functions are the documentation style; inline callbacks are also valid TypeScript. |

**Result and effects:** Validate `World`, callable step and a finite nonnegative integer steps before execution. Each successful step increases `world.tick.value` by 1. Then consumers may observe. If a step throws, propagate and stop: prior mutations remain, a failed step leaves `world.tick.value` unchanged, no rollback. Individual actions do not advance time. Async callbacks are unsupported: run does not await them. A Promise/thenable result is rejected before advancing the tick value; already-started asynchronous work cannot be cancelled or rolled back by this check.

The [execution contract](#complete-membership) specifies inferred return-type rejection and the runtime boundary; a void annotation alone cannot exclude async functions. Use normal async/await to prepare data before synchronous model execution. `world.tick.value` is finite nonnegative model time, with no built-in seconds conversion; `world.tick.advance` and `world.tick.reset` are explicit clock-only operations outside run.

<a id="complete-membership"></a>

### World membership and execution

```ts
world.agents: readonly Agent[]
world.grids: readonly Grid[]
world.graphs: readonly Graph[]
world.inputs: readonly Input[]
world.agendas: readonly Agenda[]
world.add<T extends Component>(component: T): T
world.add<T extends Component>(components: Iterable<T>): readonly T[]
world.delete(component: Component | Iterable<Component>): void
run<R>(world: World, step: (() => R) &
  ([Extract<R, PromiseLike<unknown>>] extends [never] ? unknown : never), steps?: number): void
```

**Behavior and errors**

Component means Agent, Grid, Graph, Input or Agenda. Readonly collections are insertion-order snapshots of original references, not writable membership views. Batch attachment first consumes the finite iterable into a duplicate-free snapshot, validates all objects and dependencies, then attaches all or none. Iteration errors occur before changes. A single add returns that component; a batch returns the normalized snapshot. A component has at most one World owner. Reattachment to the same World is a no-op and does not reorder it. Graph nodes do not become World agents by graph attachment.

World deletion only detaches; it does not delete the component. Batch detachment has the same validation rule. A missing unowned component or component already absent from this World is a no-op; a component belonging to another World rejects. Input bindings are explicit dependencies: an attached Input cannot point to a framework component owned by a different World. Detaching one side is allowed because absence of ownership is compatible; moving that side into another World rejects until the dependency is removed.

Ordinary graph nodes may be shared by identity; framework component nodes attached elsewhere reject when graph or node ownership is changed. Validate these constraints across the resulting complete batch, allowing related components to transfer together only after explicit detach. No graph operation silently transfers ownership.

`run` defaults to one step and accepts finite safe-integer steps ≥ 0. Before the first callback validate the World, callback, finite world.tick.value + steps and representable +1 progress for every planned clock increment. Formally preflight the same IEEE-754 recurrence t0 = world.tick.value; t(i+1) = t(i) + 1, requiring every planned result finite and strictly greater than its predecessor. Zero steps requires no increment. This is a numeric-progress condition, not a safe-integer restriction on tick.

Declared async functions reject before invocation; callable callbacks returning a Promise/thenable reject after invocation and before tick advancement. Type checking excludes a statically known Promise return; untyped host input still requires the runtime checks. Nonthenable return values are ignored. Each successful callback increases world.tick.value by 1, counting one completed model update in the default clock convention. Explicit fractional clock advances outside run do not represent additional completed callbacks. Exceptions stop immediately, retain earlier model effects and successful ticks, and do not increment the failed step.

Reentrant run on the same World rejects; separate Worlds can run synchronously. No implicit event dispatch, activation, measuring, saving, rendering or wall-clock waiting occurs. Async work already started by a misdeclared callback cannot be cancelled or rolled back.

<a id="identity-observation-contracts"></a>

### Identity and protected bookkeeping

**Behavior and errors**

World options are observable as immutable world.space and world.random plus explicit model state. world.agents, attached grid.fields and graph.nodes/edges expose original identities through readonly views/snapshots. Resolve IDs using native find over those views, returning undefined for absent/deleted identities; array position is never an ID. Immutable IDs and saved continuation metadata replace writable registry/counter access. World membership changes use add/delete, lifecycle mutations use delete and the clock uses world.tick.advance/reset.

Loading issues fresh opaque framework IDs and preserves explicitly captured model-owned numeric IDs/counters. Process-local IDs are never reused; public IDs do not expose a model counter. Persistent indexes must use captured component references or model-owned keys, and an index keyed by opaque IDs must be rebuilt after load. Activation contexts expose scoped self/caller/lifetime; observations expose public identities. Native Map indexes may cache public IDs if the model updates its cache at lifecycle boundaries.

<a id="activation-api"></a>

<a id="activation-contracts"></a>

### Activation order and compatibility

```ts
type WorldMember = Agent | Field | Edge;
type ActivationSource<T extends WorldMember> = T | readonly T[]
  | { readonly kind: "agents" | "fields" | "edges"; readonly breed?: string };
interface ActivationContext<T extends WorldMember> {
  readonly world: World; readonly self: T;
  readonly caller: WorldMember | undefined;
  die(): never;
}
world.activate<T extends WorldMember>(source: ActivationSource<T>, action: (context: ActivationContext<T>) => unknown,
  options?: { order?: "shuffle" | "netlogo-7.0.0"; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; breeds?: ReadonlyMap<WorldMember,string>; breedOrder?: readonly string[] }): void
world.report<T extends WorldMember,R>(source: T, report: (context: ActivationContext<T>) => R,
  options?: { order?: "shuffle" | "netlogo-7.0.0"; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; breeds?: ReadonlyMap<WorldMember,string>; breedOrder?: readonly string[] }): R | undefined
world.report<T extends WorldMember,R>(source: readonly T[] | { kind: "agents" | "fields" | "edges"; breed?: string }, report: (context: ActivationContext<T>) => R,
  options?: { order?: "shuffle" | "netlogo-7.0.0"; caller?: ActivationContext<WorldMember>; ids?: ReadonlyMap<WorldMember,number>; breeds?: ReadonlyMap<WorldMember,string>; breedOrder?: readonly string[] }): readonly (R | undefined)[]
world.select<T extends WorldMember>(source: ActivationSource<T>, predicate: (context: ActivationContext<T>) => boolean,
  options?: { caller?: ActivationContext<WorldMember>; breeds?: ReadonlyMap<WorldMember,string> }): readonly T[]
```

**Behavior and errors**

Default scripts use ordinary arrays, loops, filtering, Set and Map. Array iteration consumes no RNG and does not acquire NetLogo ask semantics. Explicit World activation supplies the optional synchronous scheduling/context capability; it does not change the model language or replace independently created components. The compatibility profile targets NetLogo 7.0.0; it does not promise bit-for-bit compatibility with later releases.

Sources are ordinary data and original object references. An array captures unique membership in first-occurrence order; global-kind selectors resolve current live World membership at invocation. A graph attachment does not attach its nodes; only registered World agents qualify as agents, while fields and edges must belong to attached owned components. Live-selector creation itself performs no traversal or random draw; reuse the same plain selector to see later births/deaths. Filtering with native TS captures an ordinary array; no library Population wrapper exists.

order defaults shuffle: capture and identity-deduplicate at entry, run a complete descending Fisher–Yates copy through world.random before any callback, and skip members dead before their visit. Living ownership is validated at visit after shuffling, preserving partial failure: earlier callbacks and draws remain when a later foreign member fails. A one-element array still has no shuffle draw, whereas a native single source has no traversal at all.

Births during callbacks never join an invocation. select never shuffles: visit entry membership in deterministic source order, evaluate Boolean predicates on still-live members, retain original references still alive after true. Nonboolean (including death-unwound undefined) rejects without undoing earlier effects. A predicate may deliberately mutate/draw, so select with a callback is not automatically a pure query.

order netlogo-7.0.0 requires the MT compatibility RNG, explicit XY members, and compatible contexts. Global agents are sorted by ascending numeric compatibility IDs, fields by descending Y then ascending X, and edges by canonical numeric endpoint IDs then breed declaration order; captured arrays retain captured order. Implement forward lazy selection: at position i draw Java nextInt(n-i) when at least two remain, swap the chosen remaining item into i, then prefetch the following item before invoking the current callback.

Captured/field sources filter dead values while prefetching; tree-like global-agent/edge/breed sources defer that dead check until traversal. This prefetch timing is observable when callbacks draw or kill later members. A singleton direct member draws no traversal RNG. Only observer calls may activate the special global agents/fields selectors; report permits those selectors from nested contexts. NetLogo-compatible breed selectors retain declaration provenance, never silently becoming a captured array.

Core IDs are opaque strings and cannot supply native numeric ordering: for global agents/edges supply ids as a same-World identity-to-unique-nonnegative-safe-integer Map; breed selectors use breeds and breedOrder (distinct declared names) to recover model-owned role membership/order. Global field ordering needs coordinates only. Validate the complete mappings and ownership before drawing; absent required numeric IDs, unknown breed names, duplicate IDs or a foreign map key reject. Captured arrays already retain their own order and may omit those maps.

Imported legacy conversion metadata can provide these maps explicitly; no random or ID-allocation inference occurs.

Each callback receives original self/world, caller as the immediate explicitly supplied outer context's self (absent for observer calls), and scoped die. Nested JavaScript alone does not imply caller: pass the active context explicitly. Expired/foreign contexts reject before traversal. Reading caller preserves the immediate identity even during death unwinding; model-held references to deleted identities retain ordinary object semantics. die deletes self and immediately throws a private frame signal; fields cannot die, inactive frames reject. JavaScript catch/finally remains observable.

Ordinary agent.delete() deletes but does not return from user code. No operation adds ticks. Frames expire in finally after return, death or error. Async/generator callbacks reject before traversal; returned thenables reject after invocation without rollback. Callback errors propagate after frame cleanup; only the frame's own private death signal is consumed.

<a id="agent-api"></a>

## Agent

<a id="reference-agent"></a>

<a id="agents"></a>

<a id="agent-add"></a>

### Create an agent

```ts
Agent.add(): Agent<{}>
Agent.add<S extends object>(state: S, options?: { position?: Position; orientation?: Partial<Orientation> }): Agent<S>
```

An `Agent` holds its own coordinates, orientation and typed custom state. Omitting state produces the empty state type; a custom state type requires matching initial data. Initial state must be a property data object; functions are not evaluated as initializers. Built-in operation/property names are reserved and conflicting state keys are rejected.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `state` | Empty state | Named initial properties, for example agentState = { energy: 10 }. Pass a data object, never a state factory. Scalar values initialize each new agent independently. Nested values follow the [direct state copying contract](#complete-values). |
| `position` | {x:0,y:0} | XY or XYZ coordinates determine dimension. An agent with z is explicitly 3D; attachment does not silently convert dimensions. |
| `orientation` | heading 0; pitch 0; roll 0 | Degrees; heading 0 points +Y, heading +90 points +X. Pitch/roll only in 3D. Read heading/pitch/roll; change via rotate. |

**Result and effects:** New independent identity. Model properties are read/write directly (person.energy). Position/orientation are read-only properties changed by the owning operations. Creating an agent consumes no randomness. For construction options without custom properties, define an empty agentState object and pass it with the named options; no undefined placeholder is needed. Omitted option properties use the defaults above.

<a id="agent-identity"></a>

### Identity and copying

```ts
agent.alive: boolean // readonly
agent.id: string // readonly
agent.world: World | undefined // readonly
agent.copy(): Agent<S>
```

Read immutable identity, lifecycle and ownership. Copy creates a detached living agent; custom data and spatial state follow the [shared copying contract](#complete-values).

<a id="space"></a>

<a id="move"></a>

### Move or place an agent

```ts
agent.move(distance?: number, options?: { space?: Space }): void
agent.move(options: { by: Vector; space?: Space }): void
agent.move(options: { to: Position; space?: Space }): void
agent.move(options: { path: readonly Position[]; distance?: number; space?: Space }): boolean
```

These mutually exclusive modes perform the same responsibility: update position while maintaining the active spatial rules. No parallel forward, move.x, placeAt, placeOnField or follow commands.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `distance` | 1 unit | Numeric form follows current orientation. Path form spends this nonnegative distance budget per call. Numeric distance may be signed. |
| `by` | Required vector in this mode | Coordinate-axis displacement; omitted vector components mean 0; unsupported/nonfinite components are errors. Preserve orientation. |
| `to` | Required target in this mode | Absolute placement at an `Agent`, `Field` or point’s coordinates. Preserve orientation; no path journey is implied. |
| `path` | Required nonempty path | First use begins at the agent’s current position. Direction follows each traveled segment. An unchanged path object can be shared; progress is stored per agent. |
| `space` | World space, then explicit context, then unbounded local coordinates | An attached `world.space` is authoritative when present. An explicit context is allowed alongside it only when its axes, extents and normalized per-axis boundary values are identical; object identity is irrelevant, and a conflicting context is rejected. Without World space, use an explicit `Space` when supplied; otherwise use the agent’s unbounded local coordinates. Context dimensions must match the agent. Pass `Space` data directly or reuse `world.space` or `grid.space`; do not pass the World or Grid wrapper. |

**Result and effects:** Direct forms return void. Path form returns true at arrival, including later endpoint calls. Hard-boundary displacement stops at the first boundary; out-of-bounds absolute placement throws. Wrapped contexts normalize positions. Direct movement cancels prior path progress; switching path objects starts at current position. Mutating an active path is an error. No tick/RNG effect; speed and collision rules remain model-defined.

<a id="rotate"></a>

### Rotate or face a target

```ts
agent.rotate(angle?: number, options?: { axis?: "x" | "y" | "z" }): void
agent.rotate(options: { towards: Position; space?: Space }): void
```

One orientation operation covers relative turns and facing a target.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `axis` | "z" | Local axis; X/Y are invalid for XY agents. Angles are finite degrees; written call order matters. |
| `towards` | Required target in target mode | Face compatible coordinates without moving. Coincident target preserves orientation. |

**Result and effects:** Preserve position and stored model values. Default XY basis is right +X, forward +Y; +Z rotation is a right turn. XYZ pitch raises forward toward +Z; roll rotates the transverse basis. Heading wraps to [0,360); the [orientation contract](#complete-spatial) defines canonical XYZ readback and precision.

<a id="perception"></a>

### Distance and perception

```ts
agent.distanceTo(target: Position, options?: { space?: Space }): number
agent.neighbors<T extends Agent>(options: { source: Iterable<T>; radius?: number; angle?: number; space?: Space }): readonly T[]
agent.neighbors(options?: { radius?: number; angle?: number; space?: Space }): readonly Agent[]
```

A shared spatial query supports radius and view-cone perception. Targets may be points, fields or agents.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `radius` | 1 unit | Finite nonnegative radius; inclusive cutoff. |
| `angle` | 360 degrees | Full aperture, 0–360. Less than 360 tests angle to the forward vector (cone in XYZ); coincident points are included. |
| `source` | Attached `World`’s registered agents | A detached agent must supply an iterable population; there is no hidden global agent registry. |
| `space` | World space, then explicit context, then unbounded local coordinates | Use the same context precedence as movement: an active `world.space` is authoritative; an explicitly supplied context must have identical axes, extents and normalized per-axis boundary values or the query rejects it. Without World space, an explicit `Space` may supply the geometry; without either, use unbounded local coordinates. Use shortest wrapped separation when the selected context wraps. Every source/target must match the agent’s dimension; incompatible dimensions are an error. |

**Result and effects:** Read-only distance or readonly array snapshot of original agents excluding self. Explicitly supplied sources retain their complete agent/model-state type in the result. The omitted heterogeneous World `source` returns base `Agent` values; narrow it or supply a typed population before reading custom properties. World membership supplies the default population even when the World has no space. A mixed-dimensional population must be reduced to a compatible source before a spatial query; network connectivity has no such geometric requirement. Stable source order, no RNG/tick effects. Supplying `source` controls population, not permission to ignore active World space.

<a id="agent-delete"></a>

### Delete an agent

```ts
agent.delete(): void
```

Delete this individual, not merely a population membership.

**Result and effects:** Idempotently invalidate the agent; remove its `World` registration and incident graph memberships/edges. Reads of its final scalar model values remain possible; later library mutations throw. Deletion does not return from the surrounding TypeScript function and cannot remove references from caller-owned arrays, sets, maps or earlier query snapshots. The model must maintain those collections when deleting members; new library queries exclude deleted agents.

Create two cars, select nearby vehicles and measure a distance. These queries read positions without moving the car:

<a id="complete-spatial"></a>

### Spatial endpoints, orientation and paths

```ts
agent.directionTo(target: Position, options?: { space?: Space }):
  { readonly heading: number; readonly pitch?: number } | undefined
```

```ts
agent.rotate(options: { towards: Position; space?: Space }): void
agent.move(options: { path: readonly Position[]; distance?: number; space?: Space }): boolean
```

**Behavior and errors**

Full extent L is centered on zero. Hard movement accepts coordinates in the closed interval [−L/2,L/2]; wrapped coordinates normalize to [−L/2,L/2). A hard relative displacement follows the straight displacement vector until the first boundary intersection, rather than clipping each coordinate independently. Absolute placement outside any hard axis rejects atomically. The active World context is authoritative; an explicit context must be value-equivalent or rejects. Without World space, explicit context applies; otherwise coordinates are unbounded.

Dimension mismatches reject before mutation, including a z component of zero supplied to an XY operation. Pure distance uses Euclidean length of shortest per-axis displacement. At an exact wrapped half-extent tie, choose the negative displacement; this fixed tie rule applies to perception, facing and wrapped path travel.

`directionTo` validates a living source, finite compatible target and the distance operation's context precedence/equality rules. It returns undefined for coincident positions. Otherwise heading is atan2(dx,dy) in degrees normalized to [0,360); XYZ pitch is atan2(dz,hypot(dx,dy)) in [−90,90]. Use shortest wrapped displacements and the negative half-extent tie rule. For vertical XYZ displacement, heading is the source's current canonical heading and pitch is ±90. XY result omits pitch. Return frozen detached direction data without changing orientation, state, time or RNG. This bearing reporter does not report roll or perform movement; rotate({towards}) owns facing.

The default 3D basis is right +X, forward +Y, up +Z. Orientation is stored as an orthonormal right-handed basis (or equivalent unit quaternion); coordinates alone never encode roll. The public heading/pitch/roll values describe composition H·P·R: H is a clockwise world-Z rotation, P is a positive local-right rotation raising forward toward +Z, and R is a positive local-forward rotation taking right toward −up. Relative `rotate(angle,{axis})` uses the current local axis: x applies P, y applies R, z turns forward toward right. In XY only z is valid. Default angle zero preserves all basis values; finite angles are reduced modulo 360 before composition.

For extraction let f be forward and r be right. Pitch = asin(clamp(f.z,−1,1)) in degrees, in [−90,90]; outside a pole heading = atan2(f.x,f.y), normalized to [0,360). Let r0=(cos H,−sin H,0) and u0=r0×f. Roll = atan2(−r·u0,r·r0), normalized to [−180,180). At |cos pitch| ≤ 1e−12 use heading = atan2(−r.y,r.x), roll = 0, preserving the represented basis when reconstructing. Public readback is a canonical representation; the underlying basis is not reconstructed after each read. Every composition renormalizes the basis; no native NetLogo transcendental bit equality is promised.

Facing a target sets shortest-displacement forward and roll zero; coincident targets preserve orientation. For a vertical target preserve prior heading and use pitch ±90. Facing uses the same optional `space` context option as distance and move.

Path distance defaults to one spatial unit, must be finite and nonnegative, and is unrelated to an edge's economic/time cost. A path is a nonempty readonly coordinate sequence. On first use its first point is the first waypoint; it need not equal the current position. Validate and snapshot every waypoint before moving; remember both path-object identity and its coordinate fingerprint. Later reuse rejects changed coordinates, changed length or changed active context. Direct movement cancels progress. Switching path identity starts from the current position toward the new first waypoint.

Consume distance over successive shortest wrapped segments, skipping zero-length segments without spending budget. Update forward along the last nonzero traveled segment, retaining roll zero. Reaching the final point returns true; later calls with that unchanged path return true without movement. A zero budget returns whether already at the final point after zero-length waypoint processing. All hard waypoints must validate in bounds before movement; straight segments between them therefore remain in bounds. No route segment is silently clipped into a different route. Movement never chooses a route, computes acceleration or advances a clock.

Snapshot continuation includes waypoint snapshot, cursor, context and path association within a captured root graph; callers reusing a restored path must use that restored path identity.

<a id="agent-field-gradient"></a>

### Movement feasibility and field gradients

```ts
agent.canMove(distance?: number, options?: { space?: Space }): boolean
type NumericFields<S> = Pick<S, {
  [K in keyof S]-?: S[K] extends number ? K : never
}[keyof S]>
agent.gradient<S extends object>(options: {
  grid: Grid<S>; property: keyof NumericFields<S>;
  direction?: "up" | "down"; neighborhood?: "faces" | "moore";
  random?: Random
}): Field<S> | undefined
```

**Behavior and errors**

canMove defaults distance 1, accepts signed finite distance in world units along the current heading/orientation, and applies the same World/explicit/local context precedence as move. It returns false if the complete unclipped root step or any tied descendant propagation would violate hard bounds, and true for a legal complete step; it does not mutate position/orientation or consume RNG. A deleted agent, invalid context or nonfinite input throws. It tests topology, not collision/traffic physics or occupancy.

gradient captures the containing cell and its unique neighbors (faces default, moore optional), reads the selected finite numeric property everywhere before selection, and chooses a strictly higher maximum or lower minimum than the current value; direction defaults up. Return undefined if the agent lies outside the grid or no improving cell exists. Without random, ties select field insertion order; with random, sample tied best cells once uniformly, consuming no draw for zero or one candidate. Grid/agent/context dimensions must match; malformed property values or an unknown property throw. The result is a cell only: the model explicitly calls move to place its agent or rotate({ towards: field }) to orient it.

<a id="grid-api"></a>

## Grid

<a id="reference-grid"></a>

<a id="grid"></a>

<a id="grid-add"></a>

### Create a grid

```ts
Grid.add<F extends object>(space: Space, options: { state: F; cellSize?: number; boundary?: Space["boundary"] }): Grid<F>
Grid.add(space?: Space, options?: { cellSize?: number; boundary?: Space["boundary"] }): Grid<{}>
```

The `Grid` owns its extents and cells before any `World` attachment. One regular square/cubic grid family serves XY and XYZ. The basic call is `Grid.add(space)`. For custom field values, pass `Grid.add(space, { state: fieldState })`. The same options object can contain cellSize or boundary. A normalized context, such as an existing `world.space` after checking that it is present, can replace the plain extents: the new Grid inherits its extents and boundary rules. Dimensions are always derived from the axes and validated against any input context metadata. A named boundary option overrides the inherited boundary for this Grid only.

Omit unneeded properties to use their defaults; there is no middle state argument to skip. Omitting state produces the empty field-state type; a custom field-state type requires matching data in the options. When supplying options, pass space explicitly rather than skipping its argument.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `space` | 40 × 40 XY | A `Space` with positive finite centered full extents; {x,y,z?} is sufficient. Supplied boundary rules are retained; otherwise they default to "hard". x/y derive `grid.space.dimensions` = 2; adding z derives 3 and selects cubic XYZ cells. Do not configure dimensions separately. |
| `cellSize` | 1 unit | Positive finite spacing; each extent must be an exact integer multiple. No partial cells in this revision. |
| `boundary` | Inherited context boundary; otherwise "hard" | Construction option defining the grid’s own hard/wrap topology. An explicit named option overrides the context’s boundary only for the new Grid; read it back through `grid.space.boundary`. Cell centers are half a cell inside each extent; lookup intervals are half-open internally, with the final hard-boundary cell including the outer maximum. Wrapped maximum maps to minimum. |
| `state` | Empty state | Named initial field properties, for example fieldState = { heat: 0 }. Pass a data object, never a state factory. Scalar values initialize each field independently; nested values follow the [direct state copying contract](#complete-values). Position/identity fixed; reserved property names are rejected. |

**Result and effects:** Grid fields are created without random draws. Read-only `grid.space` is always present and snapshots the initial extents, derived dimensions and boundary as a normalized `Space`; context identity is not shared and source contexts remain unchanged. Read `grid.space.dimensions` and `grid.space.boundary`; neither needs a duplicate Grid property. `grid.cellSize` remains a separate grid setting. `grid.fields` is a readonly array snapshot containing the same fields; edit each field’s custom state directly. Outside a hard Grid, `fieldAt` returns undefined; wrapped lookup normalizes. Attaching this Grid to a World without space preserves its own context and does not impose it on agent movement or create World boundaries.

<a id="grid-query"></a>

### Lookup, neighborhood and occupancy

```ts
grid.fieldAt(position: Position): Field<F> | undefined
grid.neighbors(field: Field<F>, options?: { neighborhood?: "moore" | "faces" }): readonly Field<F>[]
grid.agentsAt<T extends Agent>(field: Field<F>, options: { source: Iterable<T> }): readonly T[]
grid.agentsAt(field: Field<F>): readonly Agent[]
```

The same fields participate in lookup, adjacency and agent occupancy.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `field / position` | Required | Existing member field or compatible coordinate. `Agent` position works as lookup input. |
| `neighborhood` | "moore" | 8 neighbors in XY / 26 in XYZ. faces selects 4 / 6. Deduplicate wrapped neighbors; exclude self. |
| `source` | Attached `World`’s registered agents | Detached `Grid` requires explicit iterable. Occupancy means its containing cell, not exact center equality. |

**Result and effects:** Readonly array snapshots of selected original objects, or expected lookup absence. Explicit occupancy sources preserve their complete custom-state type; omitted `World` source returns base `Agent` values. Unknown fields and incompatible dimensions are errors. Occupancy is derived from positions, not separately writable state.

<a id="diffusion"></a>

### Diffuse a numeric field

```ts
grid.diffuse(property: Extract<keyof NumericFields<F>, string>, options?: { rate?: number; neighborhood?: "moore" | "faces" }): void
```

Spread a numeric model quantity using neighboring fields. All new values are computed from the same captured old field values.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `property` | Required numeric field key | Every participating value must be finite. |
| `rate` | 0.25 | Fraction in [0,1] distributed over configured neighbor slots; unused hard-boundary shares remain at the source. |
| `neighborhood` | "faces" | 4 neighbors in XY / 6 in XYZ; moore uses 8 / 26. Degenerate wrapped duplicate/self slots keep their weights. |

**Result and effects:** Commit the completed update together. Preserve the total within floating-point tolerance; no hidden evaporation or tick/RNG change. `grid.space.boundary` and the selected neighborhood, rather than iteration order, determine the result.

<a id="complete-grid-contract"></a>

### Grid fields, neighborhoods and simultaneous updates

**Behavior and errors**

Grid defaults remain 40 × 40 XY, cellSize 1, hard boundaries and empty direct field state. Each positive finite extent divided by cellSize must be an exact positive safe integer in JavaScript arithmetic; do not round to create a partial cell. The product of axis counts must be a safe integer and no more than 1,000,000 fields; reject before allocation. Field order is x fastest, then y, then z, starting at minimum-axis centers. A field's coordinates, identity and owning Grid are immutable; custom state uses the independent clone rule above. No operation deletes individual fields or resizes a live Grid.

`grid.fieldAt` validates the full dimensional position, returns undefined outside hard bounds, and normalizes wrapped axes. Interior cells use half-open intervals; the maximum hard endpoint belongs to the last cell. `grid.neighbors` requires a member field, defaults to moore, orders integer offsets lexicographically by z/y/x with x fastest, excludes self and deduplicates wrapped identities at first occurrence. Faces means Manhattan offset length one. Occupancy requires a member field and a finite snapshot of source agents; remove duplicate references, omit deleted agents and retain first-source order.

The omitted source uses this Grid's attached World agents and rejects for a detached Grid. A mixed-dimensional source rejects rather than silently dropping its incompatible members.

`grid.diffuse` accepts an own numeric custom-state key, rate 0.25 by default and faces by default. Validate every old field value and every computed output before committing any. For each source distribute rate × old value equally over the fixed directional slot count (4/8 in XY, 6/26 in XYZ); keep (1−rate) at source. A hard missing slot sends its share back to source; wrapped duplicate or self slots each retain their share. Sum incoming shares into the next array and commit all fields together. Negative finite fields are allowed; the operation is linear rather than a hidden nonnegative concentration rule. Rate must be finite in [0,1].

Rate zero validates but changes nothing. Overflow rejects with no field changes. No evaporation, tick or random draw occurs.

<a id="field-api"></a>

## Field

A Field is one cell owned by a Grid. [Grid.add](#grid-add) creates all fields; [Grid queries](#grid-query) return their existing identities.

<a id="field-identity"></a>

### Field identity

```ts
field.id: string // readonly
field.grid: Grid<F> // readonly
```

Read immutable field identity and owning Grid. Field coordinates and membership derive from Grid construction.

<a id="field-position"></a>

### Position

```ts
field.x: number // readonly
field.y: number // readonly
field.z: number | undefined // readonly
```

Read cell-center coordinates in world units. The Grid determines position from cell index and spacing; z is present only in XYZ grids. Coordinates remain fixed for the lifetime of the Grid.

<a id="field-state"></a>

### Model properties

Read and assign the custom properties supplied through Grid.add. Each field starts with an independent copy under the [shared supported-data contract](#complete-values). Root names id, grid, x, y and z are reserved. Field identity and Grid membership remain fixed; individual fields cannot be deleted and a live Grid cannot be resized.

<a id="graph-api"></a>

## Graph

<a id="graph-representations"></a>

### Simple, directed, mixed and parallel connections

```ts
Graph.add<N extends object = object>(options?: {
  parallel?: boolean; selfLoops?: boolean
}): Graph<N, {}>
Graph.add<N extends object = object, E extends object = {}>(options: {
  edgeState: E; parallel?: boolean; selfLoops?: boolean
}): Graph<N, E>
```

**Behavior and errors**

A custom E requires edgeState data. The immutable parallel and selfLoops options both default to false. With selfLoops true, endpoints may be identical. With parallel false, key is rejected and the pair/direction identity rules apply. With parallel true, key is optional; omission allocates the next unused decimal integer string in this graph (starting at "0"), so each omitted-key call creates a new edge. An explicit nonempty key identifies an edge globally within this graph: a repeated key with identical ordered directed endpoints or identical unordered undirected endpoints returns that edge without replacing its state/path; any other reuse throws. The returned key is immutable; simple edges have no key. Deletion does not rewind allocation.

Direction remains per edge, default false. Mixed directed/undirected edges for one pair are permitted only in an explicitly parallel graph. Supplied endpoints must already be members; all options, state and geometry are validated before creation. The operation creates no nodes implicitly. Edge state follows the shared direct-data copying contract. Read-only graph.parallel and graph.selfLoops expose the two creation policies. A loop's path, when present, must begin and end at its node position.

The opt-in representation covers the usual directed/undirected and multigraph shapes without four constructors. Representation does not imply universal algorithm support: every restricted analysis below validates its domain first.

<a id="reference-graph"></a>

<a id="graph"></a>

<a id="routing"></a>

### Routing with selectable cost

One routing surface returns a route or reachable costs. Default costs count edges; signed costs require explicit Bellman–Ford. Routing never moves agents. See the [complete callable contract](#graph-weighted-routing).

<a id="network-analysis"></a>

### Measure the network

Degree, path centrality, spectral ranking and PageRank use explicit per-measure option domains. See the [complete callable contract](#graph-centrality-extended).

<a id="graph-collections"></a>

### Membership and inspection

```ts
graph.delete(options?: { edgesOnly?: boolean }): void
```

**Behavior and errors**

Collection iteration reports current membership in stable insertion order; a newly added item is visible on a new iteration. Mutation during one collection iteration throws Error rather than creating an accidental scheduling policy. Array.from captures a local snapshot; collection size is a nonnegative integer. edges.has uses identity and returns false for absent/foreign/deleted edges; graph.hasNode supplies node membership without an alias. Existing graph.hasNode and graph.hasEdge remain valid; hasEdge is true when between with direction out finds any edge. These read operations accept nonmembers and return false or an empty array.

between returns a frozen array snapshot in edge insertion order. direction defaults to out, in reverses directed traversal, all accepts either endpoint order; undirected edges work both ways and each loop/edge occurs once. delete defaults edgesOnly false, removing all graph memberships and edges; true removes only edges. Removed edges become deleted, node objects survive, no World agents are detached. Deleting all contents of an empty graph is a no-op. Built-in nodes/edges collections are never replaceable.

<a id="graph-views"></a>

### Read views and independent structure

```ts
graph.view(options?: {
  nodes?: (node: N) => boolean;
  edges?: (edge: Edge<N, E>) => boolean;
  direction?: "original" | "reverse" | "undirected"
}): ReadonlyGraph<N, E>
graph.copy(options?: {
  nodes?: readonly N[]; edges?: readonly Edge<N, E>[];
  direction?: "original" | "reverse" | "undirected"
}): Graph<N, E>
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

**Behavior and errors**

view creates a structurally read-only live query receiver with query/analysis operations and iterable collections, but no owning collection add/delete or generate operation. Node and edge objects retain their original identity and mutable model state, matching readonly query-array semantics. A view is not a deep-freeze or a security boundary; editing a returned original object acts on its source, subject to normal lifecycle validation. Predicates default to true and are evaluated once per candidate at each query start, in current insertion order, producing that query’s fixed membership snapshot.

An edge is visible only when its predicate and both endpoint predicates accept it. Predicates must be synchronous and pure. direction defaults to original; reverse swaps directed traversal and path orientation, undirected permits traversal both ways. Collection edges and route edges are the original Edge identities: their stored from/to/directed values do not change. The view direction affects traversal, connectivity, algorithm-domain checks and route geometry orientation, not those readable source fields. An undirected view treats all visible edges as undirected for analysis; a reverse view swaps only directed traversal.

Cost/weight predicates receive the original edge. There is no transformed Edge wrapper or source property. Query results preserve original identities. Structurally mutating the source Graph during a view query throws; ordinary model values remain shared and callbacks must obey their stated purity precondition. A view consumes no randomness, is not a World component, and cannot be captured as an owning storage root; save its source or an explicit copy.

copy defaults to all current nodes and all induced edges. Explicit nodes/edges are identity-deduplicated entry snapshots and must belong to the source; an edge whose endpoint was not selected throws. The new graph shares original node objects, creates new independent edge identities with cloned model state/path, and preserves insertion order and representation options. reverse swaps directed endpoints/path; undirected marks every copied edge undirected, enabling parallel mode if distinct source edges collapse to the same simple pair. This conversion never silently discards parallel edges, loops or state. A live Agent shared as a node is still the same Agent; copying does not clone it or attach it anywhere.

<a id="graph-traverse"></a>

### Traversal and reachability

```ts
graph.traverse(options: {
  from: N; order?: "breadth" | "depth";
  direction?: "out" | "in" | "all"; depth?: number
}): readonly { node: N; parent?: N; edge?: Edge<N, E>; depth: number }[]
graph.reachable(options: {
  from: N; direction?: "out" | "in" | "all"; depth?: number
}): readonly N[]
```

**Behavior and errors**

from is required and must be a current node. order defaults breadth, direction out, depth is an omitted unlimited limit or a nonnegative integer number of edges. traverse captures structure once and visits each reachable node exactly once, including the root at depth 0 without parent/edge. Neighbors and candidate parallel edges are considered in insertion order; depth-first pushes them in reverse so its first visit also respects that order. The parent edge is the first discovering edge. Loops never rediscover a node. The frozen result is deterministic and consumes no RNG.

reachable is the breadth-first node sequence without the starting node. direction in yields ancestors on a directed graph and out yields descendants; cycles are allowed. depth 0 returns an empty list. Neither operation requires geometry, changes the graph or moves Agents. Invalid depth/direction or a nonmember start throws before traversal.

<a id="graph-components"></a>

### Components and connectivity

```ts
graph.components(options?: {
  mode?: "weak" | "strong" | "biconnected"
}): readonly (readonly N[])[]
graph.connected(options?: { mode?: "weak" | "strong" }): boolean
graph.bridges(): readonly Edge<N, E>[]
graph.articulations(): readonly N[]
```

**Behavior and errors**

components defaults weak: treat all directions as undirected and return disjoint components, including isolated nodes. strong follows actual directions (an undirected edge supplies two arcs). Each component contains nodes in original insertion order, and components are ordered by their first inserted node. Empty graph yields an empty array. connected defaults weak and is true for zero or one node; otherwise it tests whether components contains one part. This empty-graph convention is explicit and need not match every external library.

biconnected, bridges and articulations require every edge undirected; directed/mixed input throws. Parallel edges and loops are accepted. Biconnected parts are maximal vertex sets without an articulation splitting the part; an isolated vertex is returned as a singleton and a single bridge edge as a two-node part. Parts may overlap at articulations. bridges returns edges whose deletion increases weak component count; parallel alternatives prevent a bridge and loops are never bridges. articulations returns nodes whose deletion increases weak component count. Results preserve original insertion order (parts use the same first-node ordering). These are pure snapshots, not deletions.

<a id="route-data-contract"></a>

### Route result data

```ts
type Route<N extends object,E extends object> = {
  readonly nodes: readonly N[];
  readonly edges: readonly Edge<N,E>[];
  readonly cost: number;
  readonly path?: readonly Position[];
};
```

**Behavior and errors**

A route is a frozen result structure, not a constructor or movement controller. The node sequence has exactly one more entry than the edge sequence, beginning and ending with the requested endpoints; each edge is an original graph identity traversed between the corresponding nodes. Model state on referenced nodes/edges remains ordinary mutable state. Cost is the finite sum of the captured edge costs. Optional path is detached immutable joined geometry in traversal order, present only when every traversed edge supplies continuous dimension-compatible geometry.

A zero-edge route has nodes [from], edges [], cost 0 and no path; it does not invent coordinates for a network-only node. Edge paths retain their creation-time geometry snapshots; moving a node later does not rewrite them. Queries test path-to-path continuity, not implicit tracking of mutable node coordinates.

<a id="graph-weighted-routing"></a>

### Weighted and signed routing

```ts
graph.findRoute(options: {
  from: N; to: N; cost?: (edge: Edge<N, E>) => number;
  algorithm?: "auto" | "breadth" | "dijkstra" | "bellman-ford"
}): Route<N, E> | undefined
graph.distances(options: {
  from: N; cost?: (edge: Edge<N, E>) => number;
  algorithm?: "auto" | "breadth" | "dijkstra" | "bellman-ford"
}): ReadonlyMap<N, number>
graph.allDistances(options?: {
  cost?: (edge: Edge<N, E>) => number;
  algorithm?: "auto" | "breadth" | "dijkstra" | "bellman-ford"
}): ReadonlyMap<N, ReadonlyMap<N, number>>
```

**Behavior and errors**

from/to must be graph members; cost defaults one per edge. algorithm defaults auto: breadth without an explicit cost, otherwise dijkstra. Signed finite costs require explicit bellman-ford; auto/dijkstra reject any negative cost. breadth rejects an explicit cost callback so weights cannot be silently ignored. Costs are evaluated once per current edge in insertion order for each top-level query, validated finite, and retained for the whole query. No missing-weight fallback is invented for user callbacks. Callback exceptions propagate.

Purity is a caller obligation: detected structural graph mutation and returned thenables reject; arbitrary direct model-state writes cannot be automatically audited or rolled back. Such side effects violate the pure-callback precondition and remain caller-owned. A reachable negative cycle throws RangeError; an undirected negative edge necessarily creates such a cycle. allDistances detects negative cycles reachable from any source. Unreachable negative cycles do not invalidate an unrelated single-source result, although all supplied costs still require valid numbers.

Routes use actual traversal direction, preserving the chosen parallel edge; equal costs choose the lexicographically earliest sequence of edge insertion indices among minimum-cost simple routes. A same-node query returns zero edges and zero cost unless its reachable negative cycle makes the problem unbounded. findRoute returns undefined when unreachable; distances omits unreachable nodes and includes its source at zero; allDistances includes every node as a source in node insertion order, even isolated nodes.

A route path exists only when every traversed edge has compatible, continuous geometry; undirected/reversed segments are reversed and common endpoint positions are included once. The query does not cache mutable model weights across calls. See the official weighted-path distinctions.

<a id="graph-path-enumeration"></a>

### Alternative routes and distance summaries

```ts
graph.routes(options: {
  from: N; to: N; limit: number; maxEdges?: number;
  cost?: (edge: Edge<N, E>) => number
}): readonly Route<N, E>[]
graph.distanceSummary(options?: {
  cost?: (edge: Edge<N, E>) => number;
  disconnected?: "reachable" | "reject"
}): { mean?: number; diameter?: number; radius?: number;
       eccentricity: ReadonlyMap<N, number>; reachablePairs: number }
```

**Behavior and errors**

routes requires member endpoints and a positive integer limit, at most 100000. maxEdges defaults max(0,node count−1) and is an integer in [0,node count−1]. Enumerate vertex-simple routes, preserving distinct parallel-edge alternatives, sorted by total cost then lexicographic edge insertion indices. Cost defaults 1 and must be finite nonnegative. Same-node returns only the empty route if within the limit; loops cannot appear in a vertex-simple route. Return at most limit frozen routes; fewer means enumeration exhausted. No mutation or randomness occurs. Invalid inputs throw before enumeration.

distanceSummary uses nonnegative costs and ordered distinct reachable pairs. disconnected defaults reachable: missing pairs are excluded from mean; each node eccentricity is its largest finite outgoing distance (0 for no reachable peer), diameter is the maximum eccentricity, and radius the minimum. reachablePairs counts ordered pairs, so undirected pairs count twice. On an empty graph all scalar summaries are absent and the map empty; a singleton has mean absent, diameter/radius 0. reject throws when any distinct pair is unreachable. Incoming summaries use a reverse view.

<a id="graph-centrality-extended"></a>

### Centrality and ranking

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

**Behavior and errors**

This replaces the bounded analysis candidate with exact target behavior. All results are pure insertion-ordered maps containing every node. degree accepts parallel edges and loops; direction defaults out, undirected edges contribute one at each endpoint for all three directions and an undirected loop contributes two; directed loops count once in each in/out and twice in all. Unnormalized degree is incidence count, or incidence-weight sum when weight is supplied; finite nonnegative weights are evaluated once per edge. normalized defaults false and divides by max(1,n−1), intentionally allowing multigraph/loop scores above one. It rejects cost, disconnected, damping, tolerance and maxIterations.

closeness permits direction out (default) or in, never all. It uses actual directed paths and optionally strictly positive cost; weight and iteration options reject. For r reachable other nodes and finite distance sum s, reachable returns r/s or 0 when r=0; discount multiplies by r/max(1,n−1). disconnected defaults reachable. normalized is rejected because the formula already normalizes by reachable count. Loops do not shorten a positive path; the cheapest parallel edge determines distance.

betweenness sums the fraction of shortest vertex-simple paths through each non-endpoint node over ordered source/target pairs, halving for wholly undirected graphs. An explicit cost must be strictly positive, ensuring finitely countable shortest paths; parallel-edge paths count separately. Mixed directions are accepted as arcs. normalized defaults false; true divides by (n−1)(n−2) for directed/mixed and half that for wholly undirected, or returns zeros for n&lt;3. Direction/disconnected/weight/iteration settings reject.

eigenvector uses incoming weighted adjacency (undirected edges supply both arcs), allows parallel sums, and defaults weight 1, tolerance 1e−9, maxIterations 1000. Weights must be finite nonnegative. Start at equal positive unit-L2 values; iterate (A+I), L2-normalizing each step, stopping when L1 change ≤ n×tolerance. Return zeros for an edgeless nonempty graph; otherwise failure to converge throws Error, never an apparently valid partial vector. direction, normalized, disconnected, cost and damping reject.

pageRank uses outgoing transition weights; defaults damping 0.85 in (0,1), tolerance 1e−9 and maxIterations 1000. Sum parallel weights, ignore zero transition weights, distribute dangling mass uniformly, and teleport uniformly across all nodes. Start uniformly; stop when L1 difference ≤ n×tolerance. Return scores summing to 1 (empty map for zero nodes); nonconvergence throws. direction, normalized, disconnected and cost reject. tolerance must be finite positive and maxIterations a positive integer. No ranking consumes random draws. The selected spectral/ranking models correspond to common centrality families; this is not a promise of every centrality variant.

<a id="graph-clustering"></a>

### Triangles and clustering

```ts
graph.triangles(): readonly (readonly [N, N, N])[]
graph.clustering(options?: {
  weight?: (edge: Edge<N, E>) => number
}): { local: ReadonlyMap<N, number>; mean: number; transitivity: number }
```

**Behavior and errors**

Require a simple undirected graph without loops (explicit representation options may be enabled, but actual contents must satisfy the domain). triangles returns each unordered triangle once, with vertices and triangles lexicographically ordered by node insertion indices. clustering defaults unweighted: local score is 2t/[d(d−1)] for degree ≥2 and 0 otherwise; mean averages all nodes, including zeros; transitivity is 3×triangle count divided by connected unordered triples, or 0 if none. Empty graph gives an empty map and both scalars 0.

Optional weight is a synchronous pure callback evaluated once per edge and must be finite nonnegative. Divide by the maximum edge weight, and replace each triangle contribution by the cube root of its three normalized weight products in the local formula. All-zero weights yield all-zero local/mean; transitivity remains the explicitly unweighted structural ratio. Unsupported topology or callback input throws without mutation. See clustering definitions and variants.

<a id="graph-communities"></a>

### Community partitions and modularity

```ts
graph.communities(options?: {
  method?: "greedy" | "louvain" | "labelPropagation";
  weight?: (edge: Edge<N, E>) => number;
  resolution?: number; random?: Random;
  maxIterations?: number; tolerance?: number
}): readonly (readonly N[])[]
graph.modularity(partition: readonly (readonly N[])[], options?: {
  weight?: (edge: Edge<N, E>) => number; resolution?: number
}): number
```

**Behavior and errors**

These methods require undirected edges; parallel weights are summed and loops contribute twice to degree. weight defaults 1 and must be finite nonnegative; resolution defaults 1 and must be finite positive. A partition must contain each member exactly once and no foreign nodes or empty groups; missing/duplicate membership throws. modularity returns Σc[lc/m−resolution×(kc/2m)²], where lc is internal edge weight counting a loop once, kc the weighted degree sum and m total edge weight. For m=0 return 0.

communities defaults greedy. Start singleton communities; repeatedly merge the pair with largest strictly positive modularity gain until none exists; ties choose earliest original node indices. tolerance defaults 1e−9 and compares gains against that threshold. louvain starts singleton groups at each coarsened level, repeatedly moves one node to a neighbor community with greatest positive gain, then coarsens after a converged pass.

An explicit random is required for louvain and labelPropagation; each pass shuffles current nodes once using that generator. louvain retains the best partition, stops when full-level gain ≤tolerance, and expands coarsened nodes back to original identities. labelPropagation initializes each node with its insertion index label and, in shuffled passes, adopts the most incident-weight-supported neighbor label; tied maxima are sampled once uniformly using random. Isolated nodes retain their label; zero-weight edges provide no support.

maxIterations defaults 1000 and bounds total passes (greedy counts merges). If not converged within the bound, throw Error; do not return a silently incomplete partition. Greedy rejects random; labelPropagation rejects resolution and tolerance because it has no modularity objective. Every successful result is ordered by first original member and contains node insertion order within each group; no graph mutation occurs. These are heuristic partitions, not guaranteed global optima. The interface selects a few practical models from community algorithms, including the NW Louvain use case.

<a id="graph-cliques"></a>

### Cliques and bipartite structure

```ts
graph.cliques(options: { limit: number; minSize?: number }): readonly (readonly N[])[]
graph.bipartition(): { left: readonly N[]; right: readonly N[] } | undefined
graph.matching(options?: {
  left?: readonly N[]
}): readonly Edge<N, E>[]
```

**Behavior and errors**

cliques requires a simple undirected loop-free graph; minSize defaults 1, limit is required, both positive integers, limit ≤100000. Return maximal cliques of at least minSize nodes, each node list in insertion order and clique lists lexicographically ordered by those indices. If more than limit qualifying cliques exist, throw RangeError rather than returning a deceptively complete subset. Empty graph returns no cliques. The biggest maximal cliques are selected from a successful complete result with an ordinary maximum-length filter.

bipartition treats directions as undirected and ignores parallel multiplicity; a loop or odd cycle yields undefined. For each component, color its first inserted node left, then alternate breadth-first; isolated nodes are left. Return a full frozen partition, including two empty arrays for an empty graph. matching requires undirected input and a bipartite graph, otherwise throws; left may explicitly select one side, must contain every node on that side across each nontrivial component, have no internal edge and no duplicate/foreign node. Omitted left uses bipartition.left. Return a maximum-cardinality matching via insertion-ordered augmenting paths. Parallel alternatives choose the earliest edge; no cost optimization is implied.

<a id="graph-cycles-dag"></a>

### Cycles and directed acyclic structure

```ts
graph.findCycle(options?: {
  direction?: "original" | "undirected"
}): readonly Edge<N, E>[] | undefined
graph.topological(): readonly N[]
graph.transitive(options: {
  operation: "closure" | "reduction"
}): Graph<N, E>
```

**Behavior and errors**

findCycle defaults original; directed edges follow their direction and undirected edges can be traversed both ways without treating one undirected edge alone as a cycle. A loop is a cycle of length 1; two distinct parallel undirected edges form a length-2 cycle. Undirected direction ignores directedness. Return the first depth-first cycle found in node/edge insertion order, in contiguous traversal order; undefined means acyclic. No RNG or mutation occurs.

topological requires all edges directed and no cycle, otherwise throws. Return stable Kahn order, resolving zero-indegree candidates by node insertion index. Parallel arcs each count toward indegree; deleting their contribution during the query does not mutate the graph. Empty graph returns an empty array. This result orders ordinary model callbacks; it is not a second scheduler.

transitive requires an actually simple directed loop-free DAG and uses topological validation. closure returns an independent graph with the same node identities and one directed edge for every distinct reachable pair; existing edge state/path is copied, newly implied edges receive graph edgeState defaults and no path. reduction returns the unique reachability-preserving edge-minimal DAG by dropping each edge whose endpoints remain connected by another path. The source is unchanged; no extra model state is inferred. See DAG operations.

<a id="graph-trees"></a>

### Trees, forests and spanning connections

```ts
graph.isTree(options?: { forest?: boolean }): boolean
graph.spanningTree(options?: {
  cost?: (edge: Edge<N, E>) => number;
  disconnected?: "forest" | "reject"
}): readonly Edge<N, E>[]
```

**Behavior and errors**

isTree requires undirected input (directed or mixed throws). forest defaults false: a tree has at least one node, no cycles and one component; forest true accepts disconnected acyclic input including empty. Loops and parallel edges count as cycles. spanningTree requires undirected input, defaults cost 1 and disconnected forest. Costs may be any finite signed numbers; each is evaluated once per edge. Stable Kruskal ordering is cost then edge insertion index; loops are excluded and parallel alternatives compete normally.

Return selected original edge identities in selection order, with one minimum spanning tree per component. reject throws for a disconnected nonempty graph; empty returns an empty array. Neither query removes edges or registers components. See tree recognition and spanning algorithms.

<a id="graph-flow"></a>

### Capacity flow and cuts

```ts
graph.flow(options: {
  from: N; to: N; capacity: (edge: Edge<N, E>) => number;
  tolerance?: number; maxAugmentations?: number
}): { value: number; flowByEdge: ReadonlyMap<Edge<N, E>, number>;
       sourceSide: readonly N[]; sinkSide: readonly N[] }
```

**Behavior and errors**

Require distinct member endpoints and exclusively directed edges. Parallel arcs are supported; loops carry zero flow. capacity is required, pure, evaluated once per edge, finite and nonnegative in caller-defined units. tolerance defaults 1e−12 absolute capacity units and must be finite positive; maxAugmentations defaults 1000000 and must be a positive integer. Return a numerically bounded flow and corresponding cut: sourceSide is residual-reachable from from, sinkSide the remaining members.

Every edge appears in the map; reported values are clamped to [0,capacity], and nonterminal conservation error is at most tolerance times incident edge count. Residual arcs at or below tolerance are treated as saturated, and source/sink reachability uses this same threshold. The cut-capacity minus flow-value gap is at most tolerance times edge count plus accumulated IEEE-754 rounding error; no exact real-arithmetic optimality is claimed. Resolve augmenting paths breadth-first in edge insertion order; antiparallel edges keep separate residual identities.

Stop when no above-tolerance augmenting path remains; exceeding maxAugmentations or overflowing any finite residual/total throws RangeError without a partial result. Unreachable destination returns value 0. The operation returns measurements only, never changes edge properties or models queues/congestion. Undefined/infinite capacities are rejected.

<a id="graph-generate"></a>

### Common network generation

```ts
graph.generate(options: GeneratorOptions<N>): readonly Edge<N, E>[]
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

**Behavior and errors**

All generation uses the existing node objects and adds only connections among them. nodes is required, unique by identity, in explicit order; every supplied node must already belong to the graph. The induced subgraph on nodes must be edgeless before generation; other graph regions are unaffected. All argument/domain validation and random/state preflight happen before committing the batch; callback failure adds no edges but does not roll back external callback side effects or already consumed random draws. Return a frozen array of created edge identities. Generated edges receive cloned graph edgeState defaults and no geometry.

Generator-specific options outside the selected branch throw. At most 100000 nodes and 1000000 generated edges are allowed; exceeding a bound throws before graph mutation.

For path connect consecutive nodes; cycle adds last-to-first (0/1 nodes produce no edges, 2 nodes produce one undirected edge or both directed arcs); star uses the first node as center; wheel joins a cycle on nodes after the center plus spokes (requires 4+ nodes); complete joins every unordered pair, or all distinct ordered pairs when directed. directed defaults false. A directed path/cycle follows listed order; star/wheel spokes point from center and wheel rim follows listed order. Empty paths/stars/complete graphs are valid; loops are never generated.

tree uses node 0 as root and joins each later node i to parent floor((i−1)/branching); branching defaults 2 and must be a positive integer. directed defaults false; true points parent to child. Empty input is a valid empty forest. lattice requires a nonempty shape of 1, 2 or 3 positive integer axis lengths whose product equals nodes.length; flatten with x fastest, then y, then z. Connect face-adjacent axis cells, wrap defaults false, duplicate/loop neighbor pairs collapsed. directed defaults false; true directs positive-axis steps including wrap seams. Existing Graph representation must permit any antiparallel directed pairs. This is topology, not a Grid or World-space constructor.

random tests every unordered pair (or distinct ordered pair when directed) in lexicographic node index order, consuming one uniform number per candidate, and adds it when draw &lt; probability. probability is finite in [0,1]; even endpoints 0/1 consume the scheduled draws. smallWorld is undirected Watts–Strogatz: require n≥3, even integer neighbors in [2,n−1] and probability in [0,1]. Start an n-node ring connected neighbors/2 forward and backward; examine each original clockwise edge in source/offset order, draw once to decide rewiring, then uniformly sample an eligible nonself/nonneighbor endpoint if one exists.

Keep the original edge if none is eligible. A successful rewire preserves source and edge count. The supplied Random is the only stream used.

preferential requires integer links in [1,n−1]; begin a complete undirected graph on the first links+1 nodes, then visit remaining nodes in order. For each new node choose links distinct previous nodes by degree-proportional sampling without replacement, updating the temporary degree after the batch selection; candidate degree zero has zero mass. Consume one uniform draw per choice with a stable cumulative-degree scan. geometric is undirected, evaluates position once per node in order, requires finite homogeneous XY or XYZ positions, radius finite nonnegative, and optional normalized dimension-compatible space.

Join each unordered pair with topology-aware distance ≤radius. With no space use ordinary Euclidean coordinates; no World-space inference occurs. These construction rules select common graph generator families rather than all named graph catalogs.

<a id="graph-convert"></a>

### Portable graph data and matrices

```ts
graph.toData(options?: { nodeId?: (node: N) => string }): GraphData<N, E>
Graph.fromData(data: unknown): Graph<Record<string, unknown>, Record<string, unknown>>
Graph.fromData<N extends object, E extends object>(data: unknown, options: {
  node: (state: unknown, id: string) => N;
  edgeState: (state: unknown) => E
}): Graph<N, E>
type GraphData<NodeState, EdgeState> = {
  schema: "agent-loom.graph"; version: 1;
  parallel: boolean; selfLoops: boolean; edgeDefaults: EdgeState;
  nodes: readonly { id: string; state: NodeState }[];
  edges: readonly { from: string; to: string; directed: boolean;
    key?: string; state: EdgeState; path?: readonly Position[] }[];
}
graph.matrix(options?: {
  weight?: (edge: Edge<N, E>) => number
}): { nodes: readonly N[]; values: readonly (readonly number[])[] }
Graph.fromMatrix<N extends object>(data: {
  nodes: readonly N[]; values: readonly (readonly number[])[]
}, options?: { directed?: boolean }): Graph<N, { weight: number }>
```

**Behavior and errors**

GraphData is detached plain data with schema "agent-loom.graph", version 1, parallel/selfLoops flags, edgeDefaults containing the graph’s cloned direct edge-state template, nodes [{id,state}], and edges [{from,to,directed,key?,state,path?}]. Default node IDs are decimal insertion indices; an explicit nodeId must return unique nonempty strings. Data copies ordinary cloneable node/edge model state, excludes runtime methods/ownership, and rejects live external components unless they have been converted to plain model data first. This is graph interchange; storage snapshots retain the richer component identity contract. toData is pure and consumes no random draws.

fromData validates the framework/schema version, unique IDs/keys, endpoint references, flags, direction, finite geometry and cloneability before constructing anything. Without validators, require each node state, edge state and edgeDefaults to be a plain own-data record (not an array, Map, Set, Date, primitive or custom-prototype object), and return Graph&lt;Record&lt;string, unknown&gt;, Record&lt;string, unknown&gt;&gt;, with model fields unknown. Nested supported values remain unknown; the record check grants no field-value trust.

The validated overload requires both synchronous node/edgeState functions, which validate arbitrary payload and return direct state; their outputs are checked for reserved keys/duplicates, and callbacks may throw to reject. Evaluate node once per node in insertion order; evaluate edgeState first for edgeDefaults, then once per edge in insertion order, validating every result before publishing the new graph. Empty graphs therefore still reconstruct a valid E default template. Framework identities returned by node are retained rather than copied, subject to normal graph ownership validation.

No generic argument alone claims serialized state is trusted. Node IDs identify newly reconstructed plain objects, not World registration; a node callback may explicitly return existing unique identities, whose external ownership stays unchanged.

matrix captures node insertion order and returns a dense square numeric matrix; default weight 1, finite signed values permitted, each callback evaluated once per edge. Parallel arcs add, directed edges fill [from][to], undirected edges fill both cells (loops once). This aggregation is intentionally lossy: zero entries cannot distinguish no edge from zero total weight. fromMatrix requires unique object nodes, a finite square matrix of matching size, and directed false by default. Undirected input must be symmetric exactly.

Each nonzero entry creates a weight edge; directed mode uses each ordered entry, undirected upper triangle including diagonal once. It enables selfLoops only for a nonzero diagonal and creates no parallel edges. Invalid dimensions/values/asymmetry throw before construction.

<a id="graph-interchange"></a>

### Graph interchange formats

```ts
storage.encode(graph: Graph, options: {
  format: "graph-json" | "graphml" | "edge-list" | "adjacency-matrix";
  nodeId?: (node: object) => string
}): string
storage.decode(text: string, options: {
  format: "graph-json" | "graphml" | "edge-list" | "adjacency-matrix"
}): GraphData<unknown, unknown>
```

**Behavior and errors**

These synchronous codecs process strings only; filesystem/network access uses ordinary host APIs outside core. graph-json uses the exact GraphData version 1 envelope and supports cloneable JSON-safe plain state only (no Map/Set/Date/functions/nonfinite numbers). GraphML preserves string node IDs, direction, parallel keys, and boolean/string/finite-number attributes; nested attributes or unsupported XML constructs reject rather than disappear.

The parser forbids DTD/entities/external resources and duplicate IDs; encoding writes an explicit directed flag on every edge, which validly overrides the graph's default direction when decoding mixed graphs. Geometry is encoded only as a namespaced JSON string validated to the path schema. Unknown foreign GraphML keys are returned as model data with unknown values after scalar parsing.

Agent Loom writes a graph-level data key named agent-loom.metadata with a JSON string containing {schema:"agent-loom.graph-metadata",version:1,parallel,selfLoops,edgeDefaults}; default state is a scalar-attribute record under the same restrictions as edge state. Missing metadata on foreign GraphML derives parallel/selfLoops from actual edges and uses edgeDefaults {}. Unknown or malformed declared metadata rejects.

edge-list is the explicit Agent Loom UTF-8 TSV dialect: a header "# agent-loom-edge-list 1", a graph line "graph&lt;TAB&gt;parallel&lt;TAB&gt;selfLoops&lt;TAB&gt;JSON-edgeDefaults", node lines "node&lt;TAB&gt;JSON-string-id&lt;TAB&gt;JSON-state", and edge lines "edge&lt;TAB&gt;JSON-from&lt;TAB&gt;JSON-to&lt;TAB&gt;boolean-directed&lt;TAB&gt;JSON-key-or-null&lt;TAB&gt;JSON-state&lt;TAB&gt;JSON-path-or-null". JSON strings escape control characters; literal tabs/newlines inside fields are invalid. This preserves isolated nodes and edge identities, unlike an unlabeled two-column list. Decoding never guesses a delimiter or external dialect.

adjacency-matrix is JSON {schema:"agent-loom.matrix",version:1,nodes:[string IDs],directed:boolean,values:number[][]}. Encoding rejects mixed directions and parallel edges rather than silently losing them, and uses edge.weight when it is a finite nonzero number, otherwise rejects; absent edges are zero. Decoding validates square dimensions, unique IDs, finite values and symmetry when undirected, and creates plain nodes {id}, edge state {weight}, and edgeDefaults {weight:1}. Matrix encoding is intentionally a topology/weight interchange; other defaults are not preserved.

All codecs return detached GraphData with unknown model payload, suitable for Graph.fromData with real validators. Malformed/unsupported/version-mismatched input throws TypeError/RangeError, never loads plugins or runs source. See graph interchange families; additional external formats require explicit host conversion, not extension guessing.

<a id="graph-layout"></a>

### Explicit planar network positions

```ts
graph.layout(options: LayoutOptions<N>): ReadonlyMap<N, Position>
type LayoutOptions<N> =
  | { kind: "circle"; radius?: number; center?: Position }
  | { kind: "radial"; root: N; spacing?: number; center?: Position }
  | { kind: "spring"; initial: ReadonlyMap<N, Position>;
      iterations?: number; length?: number; step?: number }
  | { kind: "tutte"; boundary: readonly N[];
      positions: readonly Position[] }
```

**Behavior and errors**

Layouts accept and return finite XY Position values only: reject any supplied z property, including z: 0. Returned positions omit z. Layouts return detached positions for current node identities; they do not write node properties, move Agents, infer a World space or project XYZ data. The model explicitly applies resulting positions using its own ordinary state writes or Agent.move. Empty graph gives an empty map, except radial still requires a member root. All layouts consume no random draws.

For circle/radial/spring, directed input is treated as undirected adjacency, parallel edges collapse to one neighbor and loops are ignored, so the projection is explicit. Tutte instead validates its original input as a simple undirected loop-free graph; callers may supply an explicitly selected view or copy to change that domain.

circle defaults radius 10 world units and center {x:0,y:0}; radius is finite nonnegative, center finite. Place n nodes in insertion order at angle 2πi/n with first on +Y and clockwise increasing angles. radial requires root; center defaults {x:0,y:0} and must be finite, spacing defaults 1 finite positive. Place the primary root at center. Breadth-first undirected levels receive concentric radii depth×spacing; place each level independently in insertion order with the same angular rule. Disconnected components use their earliest inserted node as a local root and appear after the primary component at nonoverlapping +X offsets equal to twice the preceding and following component maximal radii plus spacing.

spring requires one finite initial XY point per current node, no extra/omitted identities. iterations defaults 100 nonnegative integer, length defaults 1 positive finite, step defaults 0.01 positive finite. Each iteration simultaneously evaluates Hooke attraction (distance−length) on each unique adjacency and inverse-square repulsion length²/max(distance²,1e−12) on every unordered node pair; unit vectors use current displacement, with coincident pairs separated along +X for the earlier insertion index and −X for the later one. Sum forces then apply step×force to every point together. Every intermediate must remain finite or RangeError is thrown; no partial result is returned. No convergence or physical equilibrium guarantee is implied.

tutte requires distinct boundary members and an equally long position array with at least 3 finite points forming a strictly convex polygon in supplied order; the graph must be simple undirected and each unpinned component must connect to a boundary node. Solve each unpinned vertex as the arithmetic mean of its neighbors with boundary positions fixed. A singular system or nonfinite solution throws. This is a barycentric placement contract, not a claim that arbitrary nonplanar input becomes a planar embedding. It preserves the ordinary model use of NetLogo layout operations while rendering remains an independent consumer.

<a id="node-api"></a>

## Node

A node is an existing object registered in a Graph. Its identity and model properties belong to that object; an Agent or another compatible object may serve as a node. Graph membership does not create another object or attach an Agent to a World.

<a id="graph-add"></a>

### Add and delete membership

`graph.nodes.add(node: N): N` and `graph.nodes.delete(node: N): void` change membership. Create an empty graph with ordinary object nodes; add existing identities through graph.nodes.add and remove membership through graph.nodes.delete. Removing a node deletes its incident edges in this graph only. Missing membership deletion is a no-op. See the [complete callable contract](#graph-representations).

<a id="node-collection"></a>

### Read node membership

```ts
graph.nodes.size: number
graph.nodes[Symbol.iterator](): Iterator<N>
```

Read the current node count or iterate original identities in insertion order. Mutation during an active collection iteration throws; capture a native array first when the model needs a fixed local population.

<a id="graph-query"></a>

### Membership and neighbors

```ts
graph.hasNode(node: N): boolean
graph.neighbors(node: N, options?: { direction?: "out" | "in" | "all" }): readonly N[]
```

Direct connections are different from a route through several connections.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `node / endpoints` | Required objects | Membership/edge checks return false for absence; traversal requires a member. |
| `direction` | "out" | Undirected edges work both ways. Incoming/all queries honor directed edges. |

**Result and effects:** Pure checks or captured stable unique neighbors. To inspect incident edges, convert `graph.edges` with Array.from and filter the resulting array with an ordinary predicate; no separate alias family is required.

<a id="node-state"></a>

### Model properties

Read or assign the existing object's model properties directly. Adding or deleting graph membership does not copy or delete that object. The same node may belong to multiple graphs; framework ownership constraints still apply.

<a id="edge-api"></a>

## Edge

<a id="edge-add"></a>

### Create and delete a connection

```ts
graph.edges.add(options: { from: N; to: N; directed?: boolean; key?: string; state?: E; path?: readonly Position[] }): Edge<N, E>
edge.delete(): void
```

Required endpoints are separate from optional edge settings.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `from / to` | Required admitted nodes | Read-only endpoint references. Self-edges require the explicit selfLoops creation option. |
| `directed` | false | Read-only after creation. true allows travel from first to second only. |
| `state` | `Graph`’s `edgeState` data | A direct data object containing the complete edge state. If supplied, it replaces the graph defaults rather than merging with them; it must match the graph’s edge-state type. Custom properties are directly read/write on the edge. Built-in names are reserved and conflicting keys are rejected. Scalar values initialize independently; nested values follow the [direct state copying contract](#complete-values). |
| `path` | No path | Optional dimension-compatible immutable positions for spatial travel; no geometry required for connectivity. |

**Result and effects:** By default, create one simple connection. Repeating same pair/direction returns the existing edge without overwriting state/`path`. Opposite directed edges may coexist. Undirected/directed overlap for the same pair is rejected in a simple graph; explicit parallel mode uses the [keyed edge contract](#graph-representations). `delete` is idempotent and preserves nodes. Edge id and graph are immutable identity/ownership reads; alive starts true and becomes false when the edge is deleted directly or through graph/node deletion. A deleted edge retains readable final custom state, endpoints, identity and graph reference.

Its library mutators reject, except repeated delete, which remains a no-op. Read `edge.directed`/`path`; mutate living model cost properties directly.

<a id="edge-identity"></a>

### Edge identity

```ts
edge.id: string // readonly
edge.graph: Graph<N, E> // readonly
edge.alive: boolean // readonly
```

Read immutable identity, owning Graph and lifecycle. Deletion preserves readable final identity and model data; library mutators reject except repeated deletion.

<a id="edge-properties"></a>

### Endpoints and geometry

```ts
edge.from: N
edge.to: N
edge.directed: boolean
edge.key: string | undefined
edge.path: readonly Position[] | undefined
```

Read the stored endpoints, direction, graph-scoped optional key and path geometry. These creation properties are fixed; directly writable custom model properties use the shared supported-data contract.

<a id="edge-queries"></a>

### Read edge membership and connections

```ts
graph.edges.size: number
graph.edges.has(edge: Edge<N, E>): boolean
graph.edges.between(from: N, to: N, options?: {
  direction?: "out" | "in" | "all"
}): readonly Edge<N, E>[]
graph.hasEdge(from: N, to: N): boolean
graph.edges[Symbol.iterator](): Iterator<Edge<N, E>>
```

Membership tests use original identities. Connection queries default to direction out; undirected edges work both ways. Results retain insertion order and each edge occurs once. Nonmember endpoints produce false or an empty list. Collection iteration follows the [shared graph collection rules](#graph-collections).

**Direction belongs to the edge.** `Graph` has no `directed` setting. Use `{ directed: true }` when creating a directional edge. `edge.from` and `edge.to` only read its stored endpoints. An edge needs both endpoints; there is no meaningful empty edge with invented nodes.

<a id="edge-ties"></a>

### Coupled agent movement

```ts
edge.tie(mode?: "none" | "free" | "fixed"): void
edge.tieMode: "none" | "free" | "fixed"
```

**Behavior and errors**

This optional motion relation uses an existing edge whose endpoints are live Agents. New edges have tieMode "none"; tie() defaults to "fixed", "none" removes the relation, and repeating the current mode is a no-op. The stored from endpoint is the parent and to is the child, including when the connection is undirected for graph traversal. This explicit parent relation is independent of routing direction. No new component or authoring language is introduced. Plain data/field nodes, loops and deleted endpoints cannot be tied.

The active parent relation over all graphs containing those Agents must be a forest: each child has at most one active parent and no cycle is allowed, including parallel constraints or a cycle spanning multiple graphs. Activating a relation validates the entire resulting component before mutation. All members must have the same XY or XYZ dimension and either belong to the same World or all be detached. Their selected spatial contexts must be value-equivalent. A standalone explicit movement context applies to the whole detached component for that call. Invalid relations throw without changing the previous mode or any Agent. Switching fixed/free preserves current positions and orientations and establishes no hidden rest-length value.

Every successful move or rotate on a parent propagates one transform down its currently tied descendants, in parent-first edge insertion order. For each parent, capture its position and orthonormal right/forward/up basis before and after the operation. Let D be the rigid rotation mapping the old basis to the new one. The child's new position is newParentPosition + D × (oldChildPosition − oldParentPosition). A fixed relation also applies D to the child's orientation basis; a free relation keeps the child's orientation unchanged while its position follows the parent's rotation and translation.

Then compute that child's own before/after transform and recurse: descendants of a free child inherit its translation but no parent-induced orientation change. In XY, D is the ordinary clockwise heading rotation; in XYZ use the full orthonormal basis, including pitch and roll. This defines translation, orbital motion and orientation independently of Euler representation.

Movement on a child never propagates upward or to siblings; it changes that child's current relative placement, which subsequent parent transforms use. Both relation modes propagate parent translation. Absolute placement, displacement, scalar movement, path movement and explicit orientation changes all use the same propagation. A successful propagated position change clears that descendant’s own path association/cursor, so a later call with its old path restarts from the new position. A propagated orientation-only change retains its path cursor.

Publish these cursor changes atomically with all positions and orientations; failed propagation preserves them all. A path call propagates its completed position/orientation transform once; it does not simulate vehicle joints, collisions, suspension or turn radii. Routing/graph algorithms ignore tieMode unless the model explicitly reads it.

Use minimum-image child displacement on wrapped axes before the rigid transform; an exactly half-extent separation chooses the negative displacement. Normalize each resulting wrapped coordinate afterward. Hard-axis constraints are validated for the root's normal movement result and every descendant before any changes commit. If any descendant would leave a hard context, throw RangeError and preserve all positions, orientations and route cursors. The root's ordinary displacement clipping still applies when every resulting descendant position is legal. Absolute placement of the root translates the whole affected subtree immediately, without traversing a path.

World attachment/detachment of an active tied component must move its complete tied tree together in the same explicit batch, or reject atomically; independent graph attachment still never attaches its nodes. Deleting an edge/node membership or Agent automatically removes its affected tie relation, preserving surviving Agents and their other ties. Graph.delete removes ties with its edges. Graph.copy creates untied edges even when its source edges are tied, so shared Agent identities do not acquire duplicate parents.

Capturing/restoring continuation preserves tieMode only when all involved component roots are explicitly included; decode validates forest, identity, dimensions and ownership before load. No tie operation draws randomness or advances time.

These target rules preserve coupled-model motion in ordinary TypeScript. They do not claim identical NetLogo root-selection behavior for every undirected tie graph. The relation constrains model motion through graph edges.

<a id="random-api"></a>

## Random

<a id="reference-random"></a>

<a id="random"></a>

<a id="random-add"></a>

### Create a generator

```ts
Random.add(options?: { seed?: number | "random"; algorithm?: "mulberry32" | "netlogo-7.0.0" }): Random
```

`Random` is independently usable and may be explicitly passed to a `World`.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `seed` | 1 | Mulberry signed/unsigned 32-bit integer normalized modulo 2³²; NetLogo profile signed 32-bit integer; or "random" for a fresh run seed. Read actual selected seed. |
| `algorithm` | "mulberry32" | The netlogo-7.0.0 profile preserves pinned legacy stream/distribution semantics; it does not change native TypeScript iteration. |

**Result and effects:** Construction does not draw from an existing generator. Same algorithm revision, numeric seed and operation order reproduce the same sequence. Advanced in-place continuation is exposed through random.state and captured through supported storage codecs.

A `World` supplies its own default generator. To choose a repeatable seed explicitly, create a generator with a chosen seed and define the options to pass during the model’s initial `World` creation:

Use `World.add(worldOptions)` without a spatial context, or `World.add(space, worldOptions)` when the model has a bounded space. Its `world.random` property then exposes that same generator. A fixed seed repeats the sequence only when the order of random operations is also the same.

<a id="random-number"></a>

### One number-draw operation

```ts
random.number(): number
```

Uniform, integer and distribution draws are variants of one idea.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `distribution` | "uniform" | "uniform", "normal", "exponential", "poisson" or "gamma"; distribution-specific settings only. |
| `min / max / integer` | 0 / 1 / false | Uniform [min,max), or integer values min ≤ n &lt; max. Integer bounds must be safe integers; max &gt; min. Other distributions reject these settings. |
| `mean / deviation` | 0 / 1 for normal | Finite normal mean and nonnegative deviation. Exponential/Poisson mean defaults to 1 and must be nonnegative. Gamma uses required positive finite shape/rate (not mean/deviation); its mean is shape/rate. |

**Result and effects:** Draw explicitly. For the standard Mulberry profile, degenerate normal deviation 0 and exponential/Poisson mean 0 return the constant without a draw. The explicit NetLogo profile preserves its different pinned zero-case draw schedule. The [distribution contracts](#complete-distributions) pin schedules and cache behavior by profile; no current-version native NetLogo bit parity is implied.

<a id="random-sample"></a>

### One population-selection operation

```ts
random.sample<T>(source: Iterable<T>, options?: { count?: number; replace?: boolean; weight?: (value: T) => number }): T[]
```

Select members, choose by weights or generate a random order using the same operation.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `count` | 1 | Nonnegative integer; without replacement return at most the available positive-weight members. Full population size gives a random permutation. |
| `replace` | false | With replacement, an eligible member may occur more than once. |
| `weight` | Equal weight 1 | Pure callback yielding finite nonnegative weights. Zero-weight members are ineligible; recompute probabilities over remaining members when not replacing. |

**Result and effects:** Return original references in draw order; never mutate source. Empty/all-zero sources or count 0 return [] without a draw; singleton positive selection consumes a draw. A seeded draw is an explicit action, unlike sorting/filtering. Exact old full-shuffle draw counts are not retained by implication.

<a id="random-continuation"></a>

### In-place continuation

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
random.state: RandomState // read/write validated continuation
```

**Behavior and errors**

Reading returns a detached deeply frozen continuation, including seed metadata and Gaussian cache, without a draw. Assigning validates the complete closed state schema and a matching immutable algorithm profile before atomically replacing continuation on this same Random object; every World or model reference retaining it therefore sees the restored stream. Mulberry word is uint32. MT requires exactly 624 uint32 words, not all zero, index in [0,624] and a finite cached Gaussian or null; outer/inner algorithm tags and seed domain must agree. Unknown revisions or malformed state reject without changing any field.

No draw, World time or model effect occurs. This is continuation restoration, distinct from reseed, which deliberately resets the cache. Within random.local, reads/writes address the temporary stream and finally restores the prior complete state; no state assignment replaces the outermost main checkpoint. Snapshot RandomRecord embeds this same state shape. Public algorithm metadata stays fixed; seed metadata is restored together with continuation.

<a id="complete-distributions"></a>

### Number distributions

```ts
random.number(): number
random.number(options: { distribution?: "uniform", min?: number, max?: number, integer?: boolean }): number
random.number(options: { distribution: "normal", mean?: number, deviation?: number }): number
random.number(options: { distribution: "exponential" | "poisson", mean?: number }): number
random.number(options: { distribution: "gamma", shape: number, rate: number }): number
random.number(options: { distribution?: "uniform", bound: number, integer?: boolean }): number
```

**Behavior and errors**

Normal defaults mean 0, deviation 1; exponential and Poisson default mean 1. Uniform defaults [0,1), integer false; finite bounds require max &gt; min. Integer bounds and range must be safe integers, result is min ≤ n &lt; max. Uniform uses one selected-stream double and floor for integer mode; no claim of unbiased arbitrary 53-bit integer sampling. Standard normal uses a cached polar Gaussian; deviation zero returns mean without drawing. Standard exponential requires mean ≥ 0 and uses −mean × log(1−U); zero returns zero without drawing.

Standard Poisson requires mean in [0,100000], uses a product loop below 30 and transformed rejection at or above 30; mean zero returns zero without drawing. Standard gamma requires finite shape/rate &gt; 0, uses Marsaglia–Tsang rejection with shape boosting below 1, and returns output units where rate has inverse-output units. All standard algorithms have revision "agent-loom-random/1"; changes to schedule/cache require a new recorded revision, not silent continuation compatibility.

The MT profile automatically keeps the old operation-specific semantics. Uniform accepts finite signed bound (default 1) and integer false by default; min/max form also remains available, applying the same double to its affine range, but cannot be combined with bound. Float returns bound × U and always consumes one MT double, including bound zero. Integer bound magnitude must be ≤ Number.MAX_SAFE_INTEGER; zero returns positive zero without draws; otherwise draw bounded-long with ceil(abs(bound)), applying the sign of bound to nonzero output.

Normal requires finite mean and deviation ≥ 0 and requests a cached polar Gaussian even when deviation is zero. Exponential accepts any finite signed mean, always draws one double and returns −mean × log(U); endpoint/nonfinite arithmetic rejects after consumption. MT Poisson accepts finite mean ≤ 100000, including zero/negative values, and uses the pinned waiting-time loop with at least one double. MT gamma requires positive shape/rate and preserves the pinned CERN branch/rejection schedule. Shape is dimensionless; gamma mean is shape/rate. Every sampled output must be finite; overflow throws after draws without rollback.

For the Mulberry profile, bound is unsupported. For the MT profile, default uniform is bound 1; integer=true with bound uses bounded-long and integer=true with min/max uses min plus bounded-long(max−min), rather than floor(double × range). Supplying distribution-specific keys for a different distribution rejects before drawing. Invalid parameter combinations reject before drawing. No distribution changes tick.

<a id="complete-sampling"></a>

### Selection and shuffle schedules

```ts
random.sample<T>(source: Iterable<T>, options?: {
  count?: number; replace?: boolean; weight?: (value: T) => number;
  order?: "draw" | "source"; compatibility?: "legacy-shuffle";
}): T[]
```

**Behavior and errors**

Consume source into a finite ordered array without deduplicating entries; repeated references are distinct positions. Defaults count 1, replace false, equal weight 1, order draw. Evaluate weight exactly once per entry before sampling; require a finite nonnegative value, finite total and a pure synchronous callback. Invalid count/weight or thrown evaluation leaves the stream unchanged. Count is a nonnegative safe integer. Without replacement stop at min(count,positive-weight entry count); with replacement take count draws if any eligible entry exists. Count zero/empty/all-zero returns [] without drawing.

Each actual selection consumes one double, including a singleton, chooses by cumulative weight and removes the selected position for no replacement. Use the final positive position for a rounding remainder. Return original values, never mutate source. Order source sorts selected positions back into original order after drawing, retaining draw order among repeated selections of one position. It is not NetLogo ask.

For the old full Fisher–Yates schedule explicitly choose compatibility "legacy-shuffle", count equal to source length, replace false and omit weight/order. Descending i=n−1..1 draws an index in [0,i] using the selected stream's existing bounded integer primitive and swaps a copied array. Empty/singleton shuffles consume no draw. Other option combinations reject. Native-compatible agentset lazy shuffling remains a separate explicit compatibility execution contract; neither full sample nor ordinary for-of promises that source-dependent ask draw trace.

<a id="complete-random-general"></a>

### Random streams and compatibility

```ts
random.reseed(seed: number): void
random.copy(): Random
random.local<R>(action: () => R): R
random.raw(options: { kind: "int32" }): number
random.raw(options: { kind: "int31", bound: number }): number
random.raw(options: { kind: "int64", bound?: bigint }): bigint
random.raw(options: { kind: "double" | "gaussian" }): number
```

**Behavior and errors**

`Random.add` defaults to algorithm "mulberry32" and seed 1. Its algorithms are versioned stream contracts: "mulberry32" is the Mulberry32 stream; "netlogo-7.0.0" pins the MT19937 adaptation and draw semantics of NetLogo 7.0.0. Selecting the latter selects its pinned distribution/draw semantics below, while ordinary iteration and agent activation remain ordinary TypeScript. Numeric Mulberry seeds must be integers in [−2³¹,2³²−1] and normalize modulo 2³²; MT seeds must be signed 32-bit integers.

Seed "random" obtains one unsigned 32-bit value from the host entropy source, interpreting it as signed for MT; record the actual numeric `random.seed` value. It draws from no model stream. The read-only `random.algorithm` exposes the selected identifier.

`reseed` validates before replacing continuation and discarding any Gaussian cache; no draw occurs. For the MT profile, reseed accepts a finite number truncated toward zero into signed 32 bits, matching the old language-style seed operation; initial construction remains strict integer-only. `copy` returns a fully independent continuation including cached Gaussian; no draw. `local` accepts a synchronous nonthenable callback. Save the continuation and restore it in finally even if the callback throws.

Nested local scopes start from the outermost main-stream checkpoint, not from the outer temporary continuation; each restores its immediate predecessor. Only randomness rolls back; model mutations remain. Capturing a stream during a local scope rejects because it is a temporary continuation. Runtime async rejection follows run's rules; the generic local signature relies on that runtime check.

`raw` is an advanced compatibility operation requiring MT, except kind double which is also the selected Mulberry [0,1) draw. int32 consumes one MT word and returns signed 32 bits. int31 requires a positive integer bound ≤ 2³¹−1, uses the pinned Java bounded-int rejection schedule, and returns [0,bound). int64 without bound returns signed 64-bit bigint from two raw words; bounded int64 requires bigint in [1,2⁶³−1], uses the pinned bounded-long rejection schedule, and returns [0,bound). MT double combines the high 26 and 27 bits of two words into [0,1). Gaussian uses the cached polar companion and variable rejection schedule.

Invalid parameters never consume draws. Every rejection loop has a 1,000,000-attempt cap; exhausting it throws after consumed draws, without rewinding. The pinned algorithm defines exact integer/word continuation; JavaScript Math transcendental results have floating tolerance rather than native StrictMath bit equality.

<a id="input-api"></a>

## Input

<a id="reference-input"></a>

<a id="input"></a>

<a id="input-add"></a>

### Expose existing properties

```ts
Input.add(): Input
input.add(object: object, property: string, constraints?: { min?: number; max?: number; step?: number }): void
input.set(object: object, property: string, value: number | string | boolean): void
input.delete(object: object, property: string): void
```

Independent `Input` starts with no bindings and binds existing number/string/boolean properties. `World` membership and a UI are optional.

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `object / property` | Required existing own scalar property | Keep its current value. Repeated identical binding is a no-op; conflicting binding is an error. |
| `min / max` | No bound | Inclusive numeric bounds. No inferred default value. |
| `step` | No step constraint | Positive numeric increment from min if present, otherwise 0. Use a documented floating tolerance of 1e-9 × max(1,abs(step quotient)). |

**Result and effects:** `add`/`delete` change exposure, not model value. `set` validates registered type/range/step before assignment and preserves old value on failure. Direct model assignment remains ordinary TypeScript. Read `input.bindings` as descriptors for exposed properties, containing the same object/property references. Deleted-agent bindings are removed; future external writes fail.

<a id="complete-input"></a>

### Binding existing scalar state

**Behavior and errors**

`Input.add()` returns an empty independent Input. input.add requires an existing writable own data property of type finite number, string or boolean, and snapshots its scalar type and constraints without changing the property. Numeric min/max are finite inclusive bounds with min ≤ max. Step is positive finite, anchored at min or zero, with tolerance 1e−9 × max(1,abs(quotient)). Omit min/max/step for no constraint. Numeric constraints on strings/booleans reject. Add validates the current value; a constraint violation rejects before registering.

Repeating the same object/property/type and normalized constraints is a no-op; different constraints reject until explicitly deleted. A property removed or changed to another type by direct model code causes subsequent input.set to reject, preserving the property value.

`input.set` requires a live binding and matching scalar type, rejects nonfinite numbers and validates constraints before one assignment; no coercion/clamping/rounding occurs. Deleted-agent bindings are removed. input.delete removes a binding, no-op if missing, and does not change model data. input.bindings returns a readonly insertion-order array of frozen descriptors {object,property,type,min?,max?,step?}; objects remain original references. External consumers read descriptors and call set; they never need a DOM-aware core. Arbitrary property setters/accessors are unsupported because atomic validation cannot guarantee their effects.

<a id="stats-api"></a>

## stats

<a id="describe"></a>

### Describe values

```ts
stats.describe(values: Iterable<number>, options?: { sample?: boolean }): Summary
```

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `values` | Required finite numbers | Use Array.from(group, member =&gt; member.value) to select values. |
| `sample` | false | Population variance divides by n; sample variance divides by n−1. |

**Behavior and errors**

Combine count, sum, extrema, mean, median and spread in one pure report.

**Result and effects:** Return `count`,`sum`,`min`,`max`,`mean`,`median`,`variance`,`standardDeviation`. Empty `count`/`sum` are 0, other results undefined; sample spread is undefined with fewer than 2 values. Input order/data are unchanged; reject nonfinite input or arithmetic overflow.

<a id="histogram"></a>

### Count frequencies

```ts
stats.histogram(values: Iterable<number>, options: { edges: readonly number[] }): Histogram
```

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `edges` | Required ≥2 strictly increasing finite boundaries | Bins are left-inclusive/right-exclusive except final upper edge, which is included. |

**Behavior and errors**

Measure a distribution using explicit bin boundaries.

**Result and effects:** Return bin counts plus underflow/overflow counts; no hidden bin selection. `stats.gini(nonnegativeValues)` and `stats.alignment(headings)` retain inequality and circular-agreement measurements as distinct pure quantities with stated units, not duplicate mean aliases.

<a id="special-stats"></a>

### Inequality and circular agreement

```ts
stats.gini(values: Iterable<number>): number
stats.alignment(headings: Iterable<number>): number
```

**Behavior and errors**

`gini` accepts finite nonnegative holdings, returns dimensionless population inequality, and is 0 for empty/all-zero/equal holdings; it is not sample-corrected. `alignment` accepts finite headings in [0,360) degrees and returns mean unit-vector agreement near [0,1], 0 when empty. Both are pure and preserve inputs; alignment clamps floating overshoot to [0,1] and accepts at most 10000 headings.

<a id="complete-statistics"></a>

### Pure measurements

```ts
type Summary = { readonly count:number; readonly sum:number;
  readonly min:number|undefined; readonly max:number|undefined;
  readonly mean:number|undefined; readonly median:number|undefined;
  readonly variance:number|undefined; readonly standardDeviation:number|undefined };
type Histogram = { readonly edges:readonly number[]; readonly counts:readonly number[];
  readonly underflow:number; readonly overflow:number };
```

**Behavior and errors**

`stats.describe` consumes a finite iterable once and requires finite numbers. It returns count, sum, min, max, mean, median, variance and standardDeviation. Median sorts a detached copy and averages the middle pair for even n. Population variance divides squared deviations by n; sample true uses n−1. Empty count/sum = 0, remaining fields undefined; sample spread is undefined at n &lt; 2. Reject overflow; never change input order. `stats.histogram` requires at least two strictly increasing finite edges and finite values; returns {edges,counts,underflow,overflow}, copying edges.

Bins include their lower bound, exclude upper except the final inclusive maximum. Empty values yields zero counts. `stats.gini` accepts finite nonnegative holdings, returns population sum-of-absolute-differences/(2n sum), zero for empty or all-zero. `stats.alignment` accepts at most 10000 finite headings from a finite iterable in [0,360), returns magnitude of mean heading unit vectors, zero for empty; clamp only floating overshoot to [0,1]. All reject nonfinite arithmetic and have no RNG, World, recorder or renderer effect.

<a id="contract-headingalignment"></a>

### stats.alignment

```ts
stats.alignment(headings: Iterable<number>): number
```

**Behavior and errors**

Accept at most 10,000 finite headings in [0,360), clockwise from north. Return the magnitude of their mean equal-speed heading vector, in [0,1], clamping floating overshoot only. Empty input returns 0. Summation uses caller order.

<a id="contract-ginicoefficient"></a>

### stats.gini

```ts
stats.gini(values: Iterable<number>): number
```

**Behavior and errors**

values are nonnegative finite holdings. Sort a detached copy and compute the finite-population Gini in [0,(n-1)/n]; empty and all-zero inputs return 0. The population correction n/(n-1) is not applied. Negative holdings reject; original order is untouched.

<a id="geometry-api"></a>

## geometry

<a id="pure-spatial-contracts"></a>

### Pure XY and XYZ geometry

```ts
type Position = { readonly x:number; readonly y:number; readonly z?:number };
type Orientation = { readonly heading:number; readonly pitch?:number; readonly roll?:number };
type Bounds = readonly [number,number,number,number]; // minX,maxX,minY,maxY
type PlanarXY = readonly [number,number];
type PlanarPolygon = {readonly type:"Polygon";readonly coordinates:readonly (readonly PlanarXY[])[]};
type PlanarGeometry =
 | {readonly type:"Point";readonly coordinates:PlanarXY}
 | {readonly type:"MultiPoint"|"LineString";readonly coordinates:readonly PlanarXY[]}
 | {readonly type:"MultiLineString";readonly coordinates:readonly (readonly PlanarXY[])[]}
 | PlanarPolygon
 | {readonly type:"MultiPolygon";readonly coordinates:readonly (readonly (readonly PlanarXY[])[])[]}
 | {readonly type:"GeometryCollection";readonly geometries:readonly PlanarGeometry[]};
type PlanarJson = null | boolean | number | string | readonly PlanarJson[] | {readonly [key:string]:PlanarJson};
interface PlanarFeature {readonly type:"Feature";readonly id?:string|number;
 readonly geometry:PlanarGeometry|null;readonly properties:Readonly<Record<string,PlanarJson>>|null}
interface PlanarDataset {readonly features:readonly PlanarFeature[];
 readonly coordinateSystem:{readonly crs:string;readonly units:string}}
geometry.contains(polygon:PlanarPolygon,point:{x:number;y:number},options?:{boundary?:"include"|"exclude"}):boolean
geometry.normalize(point:Position, options:{space:Space; endpoints?:"closed"|"half-open"}):Position | undefined
geometry.displacement(from:Position,to:Position,options:{space:Space;wrap?:boolean}):Position
geometry.distance(from:Position,to:Position,options:{space:Space;wrap?:boolean}):number
geometry.bearing(from:Position,to:Position,options:{space:Space;wrap?:boolean}):
  {readonly heading?:number;readonly pitch?:number} | undefined
geometry.neighbors(cell:Position,options:{space:Space;cellSize?:number;neighborhood?:"moore"|"faces"}):readonly Position[]
geometry.direction(orientation:Orientation):Position
geometry.rotate(orientation:Orientation,options:{angle:number;axis?:"x"|"y"|"z"}):Orientation
geometry.rotate(orientation:Orientation,options:{towards:Position;from:Position;space:Space;wrap?:boolean;roll?:"preserve"|"zero"}):Orientation
geometry.splitPath(from:{x:number;y:number},to:{x:number;y:number},options:{space:Space;mode?:"clip"|"reject"}):
  readonly {readonly from:{readonly x:number;readonly y:number};readonly to:{readonly x:number;readonly y:number}}[]
geometry.bounds(features:PlanarDataset | readonly PlanarFeature[]):Bounds | undefined
geometry.map(point:{x:number;y:number},options:{from:Bounds;to:Bounds;mode?:"uniform-centered"|"independent-axes"}):{readonly x:number;readonly y:number}
```

**Behavior and errors**

All functions validate finite inputs and a normalized immutable context, return detached data, allocate no Agent/World/Grid and perform no mutation, RNG draw, time increment or rendering. XY and XYZ must match the context; mismatches including explicit z:0 in XY throw TypeError. Wrong shapes/options throw TypeError; extents/size/arithmetic domain violations throw RangeError. Positions used for measurements may lie outside hard bounds; measurements do not silently move or clip them. wrap defaults true and applies configured per-axis wrap rules; false takes direct displacement on every axis.

Per-axis shortest wrap uses the base spatial half-extent tie rule. Signed displacement is to−from; distance is its finite Euclidean norm. Normalize wraps configured axes and returns undefined outside any hard axis; endpoints defaults closed, while half-open excludes each upper hard endpoint to preserve older cell-coordinate normalization. No boundary failure changes input.

bearing returns undefined for XYZ/XY coincidence. Otherwise XY heading is atan2(dx,dy) normalized to [0,360); when dx=dy=0 in XYZ the heading field is absent and pitch is ±90. XYZ pitch is atan2(dz,hypot(dx,dy)) in [−90,90], XY omits pitch. To reproduce older strict heading reporters, throw RangeError when heading is absent; to reproduce their nonnegative pitch convention use ((pitch%360)+360)%360 after rejecting coincidence. This is ordinary numeric normalization, not another reporter vocabulary.

The towards rotate overload retains supplied roll by default (roll preserve), permits explicit zero, preserves heading on vertical targets and all orientation on coincidence. It uses bearing/shortest displacement, returning normalized angles; Agent.rotate({towards}) deliberately resets roll as specified in its mutating contract.

direction converts finite heading and optional pitch (default 0) degrees to (sin(h)cos(p),cos(h)cos(p),sin(p)); when pitch is absent it returns XY and ignores no supplied roll. For XYZ provide pitch (even zero). Roll does not affect forward. rotate defaults axis z and uses the same complete local orthonormal-basis composition/extraction as Agent.rotate, with finite angle; x/y require XYZ orientation (pitch or roll supplied), default omitted XYZ values zero. Return canonical heading/pitch/roll; no native StrictMath bit-equality claim.

neighbors uses a positive finite cellSize default1; every extent/cellSize is an exact positive safe integer. The focal point must be an actual cell center under that spacing. neighborhood defaults moore (8 in XY,26 XYZ), faces means4/6 directional offsets. Enumerate x fastest then y then z, normalize wraps, omit hard escapes and deduplicate at first occurrence while excluding the focal identity; tiny wrapped spaces may have fewer unique neighbors. The immutable Grid's same field-center and neighborhood rules apply without requiring Grid allocation.

splitPath requires planar context and finite intended unwrapped endpoints, preserving full displacement instead of choosing a shortest wrapped endpoint. mode defaults clip: intersect the segment with hard-axis bounds, returning [] if empty/zero-length; reject instead throws if either original endpoint escapes a hard half-open interval. Normalize wrapped starts, split at every seam in travel order (including multiple crossings), and return only positive-length visible pieces; seam endpoints use equivalent paired bounds without a connecting cross-world line. Validate arithmetic and a conservative maximum10000 pieces before allocating.

Bounds/center-coordinate legacy inputs convert to full extents and offset explicitly. This is pure geometry and uses only the supplied spatial context.

bounds traverses all non-null planar feature coordinates, returning [minX,maxX,minY,maxY], or undefined with none; zero-width/height envelopes are valid results. map requires finite strictly positive source and target widths/heights. mode defaults uniform-centered: scale=min(targetWidth/sourceWidth,targetHeight/sourceHeight), center the scaled source in target, then transform the point. independent-axes uses separate x/y ratios. Points outside the source map outside without clipping; coordinate labels are retained by callers and no CRS projection or geodesy is inferred. Input/output distance units are the caller's explicit coordinate units.

Polygon coordinates contains the exterior ring first and then hole rings. Each ring has at least four finite XY pairs including exact repeated closure, at least three distinct noncollinear vertices, no zero-length interior edge and no self-intersection (adjacent shared endpoints are allowed). Holes lie strictly within the exterior, have no crossings/touches with exterior or other holes, and cannot overlap; winding direction is immaterial. Invalid polygons throw before bounds/contains/import publishes data.

Boundary include/exclude applies equally to exterior and hole boundaries; an included hole boundary is part of the polygon boundary, while hole interiors remain excluded. LineString has at least two positions; Multi geometries and GeometryCollection may be empty, and null feature geometry contributes no coordinates. Point bounds may have zero width; map still requires nonzero source and target envelopes. PlanarJson numbers are finite and plain property data follow GeoJSON size/depth/count limits; unknown foreign members are not silently interpreted as coordinates.

<a id="agenda-api"></a>

## Agenda

<a id="agenda"></a>

### An independent event agenda

```ts
Agenda.add<E = unknown>(): Agenda<E>
agenda.add(options: { at: number; data: E; priority?: number }): EventHandle<E>
agenda.delete(handle: EventHandle<E>): void
agenda.advance(options: { until: number; maxEvents?: number }): readonly Event<E>[]
type EventHandle<E> = { readonly id: string; readonly agenda: Agenda<E> };
type Event<E> = { readonly id: string; readonly at: number; readonly priority: number; readonly sequence: number; readonly data: E };
```

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `at / data` | Required model time and cloneable event data | `at` ≥ `agenda.time`; no callback serialization. |
| `priority` | 0 | Signed safe integer; lower number first at equal time; insertion order resolves remaining ties. |
| `until` | Required finite time ≥ current `agenda.time` | Model chooses how this time relates to `World` ticks. |
| `maxEvents` | 1000 | Positive integer budget. If due events remain, stop at last dispatched time; otherwise advance to `until`. |

**Behavior and errors**

Queue plain event data; process returned due events using ordinary TypeScript.

**Result and effects:** `Agenda` starts at `time` 0. `add` returns an opaque issued cancellation handle; forged handles or handles from another Agenda reject before mutation; deleting an absent event is a no-op. `advance` returns detached ordered due events and advances only `agenda.time`, never `world.tick.value`. `World` attachment supplies no implicit dispatch loop; model calls `advance` explicitly.

<a id="experiments-api"></a>

## experiments

<a id="study-design-contract"></a>

### Design and replication

```ts
experiments.design(input: { constants?: StudyParameters; axes: readonly StudyAxis[]; maxScenarios?: number }): readonly StudyScenario[]
experiments.design<Parameters extends StudyParameters>(input: { defaults: Parameters; axes: readonly StudyAxisFor<Parameters>[]; maxScenarios?: number }): readonly StudyScenario<StudyParameterValues<Parameters>>[]
experiments.replicate<Parameters>(scenarios: readonly StudyScenario<Parameters>[], seeds: readonly number[], options?: { maxRuns?: number }): readonly PlannedRun<Parameters>[]
experiments.summarize<Parameters,Measurements>(result: StudyResult<Parameters,Measurements>, select: (outcome: StudyOutcome<Parameters,Measurements>) => number | undefined): readonly ReplicationSummary[]
```

**Behavior and errors**

constants defaults empty and cannot overlap axes. defaults supplies complete flat finite scalar settings whose keys and kinds alone may vary; constants/defaults are exclusive. Axes retain caller order, duplicate values remain separate scenarios and last axis varies fastest. No axes yields one constants/defaults scenario; an empty axis yields none. Scenario IDs are scenario-index. Replicate validates unique scenario IDs, copies settings and requires distinct explicit safe integer seeds, then emits run-scenarioIndex-replicationIndex in scenario-then-seed order. Empty lists yield none. No planning operation runs a model or RNG.

Caller caps may lower but never enlarge hard limits; validate products before output allocation. Summarize selects once per completed/stopped run, preserves run/status/missing counts, never pools ticks, rejects nonfinite values, returns mean null with none and sample SD with n-1/null below two. Seed labels alone do not prove independence.

<a id="study-options-contract"></a>

### One model execution contract

```ts
interface ExperimentModel { readonly world: World; step(): void; dispose?(): void }
type ExperimentPlan<Parameters> =
  | { readonly parameters: readonly Parameters[]; readonly seeds: readonly number[]; readonly plan?: never }
  | { readonly plan: readonly PlannedRun<Parameters>[]; readonly parameters?: never; readonly seeds?: never };
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
experiments.run<Parameters,Model extends ExperimentModel,Measurements>(options: ExperimentOptions<Parameters,Model,Measurements> & {pause?:never}): StudyResult<Parameters,Measurements>
experiments.run<Parameters,Model extends ExperimentModel,Measurements>(options: ExperimentOptions<Parameters,Model,Measurements> & Required<Pick<ExperimentOptions<Parameters,Model,Measurements>,"pause">>): StudyResult<Parameters,Measurements> | StudyCheckpoint<Parameters,Measurements>
```

The overload without pause returns terminal study outcomes. The overload with an explicit pause policy returns terminal outcomes or a resumable checkpoint.

**Behavior and errors**

parameters and seeds form a Cartesian plan in parameter-then-seed order; plan instead accepts explicit ordered scenario/replication identities from design/replicate. Seeds are explicit distinct safe integers, with no generated draws. Parameter settings and measurements may be supported cloneable data, including ordinary lists, maps, sets and internal cycles; they need not be flat scalar StudyParameters. Clone all settings during preflight and again before each create. Step and measurement state is never shared implicitly across runs. Source functions, accessors and host resources are rejected at clone boundaries. Empty input plans return empty outcomes; duplicate identities and malformed settings reject.

steps is a required nonnegative integer &lt;= 1,000,000. every defaults 1, sampleInitial and sampleFinal true, onError stop. Preflight callbacks, identities and conservative total-step/sample budgets before first create. After creation, observe step zero if sampleInitial and sampleWhen allow, then evaluate stopWhen. Execute the model's normal step through the same synchronous World clock rule: one tick and completedStep after a successful interval, no tick/count on a thrown interval. Sample scheduled completed intervals before checking stopWhen.

The observer must not mutate or draw. sampleFinal forces an unsampled terminal completed count even when sampleWhen would filter it, with no duplicate sample at that count. Callbacks cannot return thenables or be declared async/generators; those declarations reject before execution, while thenables reject after their effects.

The optional host.advance is an execution seam for existing host consumers, never another model declaration: it replaces exactly one step invocation and must not also tick. It may call a previously supplied callback and return stopped after an aborted partial interval. In that case stop with adapter-stopped, add no tick/completed count and do not force a final observation of the aborted state. Normal authored models omit host and express ordinary termination with stopWhen. This preserves imported callback lifecycle semantics while keeping run(world, step, steps) and model.step void and synchronous.

dispose runs exactly once after a successfully returned create, including failures, never after failed creation. A disposal failure makes success/stopped failed; if there was a primary failure retain cleanupError separately. onError continue records failure and proceeds; stop records all remaining plan identities as skipped/fail-fast without creating them. Preflight throws TypeError/RangeError before running; lifecycle exceptions become named phase diagnostics. Earlier callback effects/RNG draws are never rolled back.

Return every planned identity once, in input order, with detached samples, actual completedSteps and explicit completed/horizon, stopped/stop-condition or adapter-stopped, failed/error, skipped/fail-fast unions. Runner observations are cloneable, not universally JSON-safe. Model procedures must not tick in addition to the runner.

<a id="study-worker-contract"></a>

### Whole-run worker transport

```ts
experiments.run<Parameters extends StudyParameters,Measurements>(options: {
  plan: readonly PlannedRun<Parameters>[];
  executor: { moduleUrl: string; exportName: string; sha256: string; config?: NodeStudyConfig };
  steps: number; every?: number; sampleInitial?: boolean; sampleFinal?: boolean;
  provenance?: Readonly<Record<string,string>>; maxTotalSteps?: number; maxTotalSamples?: number;
  timeoutMs: number; concurrency?: number; signal?: StudyCancellationSignal;
}): Promise<NodeStudyResult<Parameters,Measurements>>
type WorkerStudyProvider<Parameters,Model extends ExperimentModel,Measurements> = (config: NodeStudyConfig) =>
  Pick<ExperimentOptions<Parameters,Model,Measurements>,"create" | "measure" | "sampleWhen" | "stopWhen" | "host">;
```

**Behavior and errors**

This overload is exported as experiments from the explicit same-package host subpath agent-loom/experiments/node, which also exposes the serial operation contracts. The root experiments export is headless/serial and rejects executor options; it never eagerly loads Node modules. The host overload uses actual native Node workers; Bun/browser execution rejects explicitly. The trusted local compiled ESM .mjs/.js provider URL, named export and lowercase SHA-256 must match before executing provider bytes; .js requires type:module. Config defaults null and is bounded acyclic JSON-like data, never callbacks or live model state.

The provider constructs the same create/model/measure callbacks inside each worker. Its per-run source callbacks are never serialized. Worker parameter plans use bounded finite scalar StudyParameters. timeoutMs is integer [1,3600000] wall-clock milliseconds, distinct from model ticks; concurrency defaults 1 and is integer [1,16]. Each worker executes one whole run with onError continue. Cancellation prevents new starts, terminates active workers and removes host listeners.

Results remain in plan order: actual serial outcome, not-started/cancelled with completedSteps 0, or transport-error setup/timeout/cancelled/worker-error/protocol with completedSteps null. Parent validates messages before publication. Workers are trusted execution, not a sandbox. Invalid registrations/plans reject before execution; per-run transport errors remain explicit outcomes.

<a id="study-behaviorspace-contract"></a>

### BehaviorSpace data binding

```ts
storage.decode(text: string, options: { format: "behaviorspace" }): readonly BehaviorSpaceSpec[]
experiments.bind<Model extends ExperimentModel>(spec: BehaviorSpaceSpec, bindings: BehaviorSpaceBindings<Model>): BoundBehaviorSpace<Model>
experiments.run<Model extends ExperimentModel>(bound: BoundBehaviorSpace<Model>): StudyResult<StudyParameters,Readonly<Record<string,StudyScalar>>>
```

**Behavior and errors**

Parse the current NetLogo 7.0.4 finite-data XML dialect (version 2); explicit legacy version-1 imports retain the earlier NetLogo 7.0.0 finite-data dialect, retaining exact setup/go/reporter labels and original XML. Enumerated/finite stepped value sets, repetitions, timeLimit, exitCondition, runMetricsCondition and ordered metrics are supported.

Unsupported constructs reject; DTDs/external entities, code and literals are never executed. bind requires the exact setup/go labels paired with the same normal create/model.step contract; go is a source label only and always invokes the model.step returned by setup.create, never an independent callback. It requires finite scalar literal decoder, every metric reporter and each declared optional exit/sampling reporter. Missing, extra or mismatched labels reject; explicit distinct seed count equals repetitions. Decode settings, construct bounded plan and issue an immutable binding; forged/copied/JSON-reconstructed handles reject in run.

Execute the same ordinary model lifecycle and failure phases. Parsing/binding consume no time or randomness. TypeError denotes malformed labels/XML/unsupported constructs, RangeError numeric/budget violations.

<a id="study-calibration-contract"></a>

### Finite selection and held-out evaluation

```ts
experiments.evaluate<Parameters,Model extends ExperimentModel,Measurements>(input:
  Omit<ExperimentOptions<Parameters,Model,Measurements>,"parameters" | "plan" | "pause"> & {
    pause?: never; candidates: readonly StudyScenario<Parameters>[]; seeds: readonly number[]; objective: CandidateObjective<Parameters,Measurements>
  }): CandidateEvaluation<Parameters,Measurements>
experiments.select<Parameters,Measurements>(evaluation: CandidateEvaluation<Parameters,Measurements>, options: { maxMeanLossDelta: number }): CandidateSelection<Parameters,Measurements>
experiments.holdout<Parameters,Model extends ExperimentModel,Measurements>(selection: CandidateSelection<Parameters,Measurements>, input:
  Omit<ExperimentOptions<Parameters,Model,Measurements>,"parameters" | "plan" | "pause"> & { pause?: never; seeds: readonly number[]; objective: CandidateObjective<Parameters,Measurements> }
): CandidateHoldout<Parameters,Measurements>
```

**Behavior and errors**

Calibration evaluate/holdout reject pause at type and runtime boundaries; they return completed finite evaluations, not resumable calibration checkpoints. Evaluate only the supplied nonempty finite grid and explicit nonempty seeds; no implicit optimizer. Objective id/dataId and distinct nonempty observationIds are bounded provenance; loss returns one finite scalar per successful/stopped run (negative allowed, lower is better). Capture unavailable run/objective failures rather than imputing zero. Eligibility requires all requested losses and finite mean; partial means remain visible and ineligible.

Rank by mean, then original candidate order. select requires an issued training evaluation and finite nonnegative absolute maxMeanLossDelta; select means &lt;= best+delta with compensated comparison so threshold rounding does not change exact eligibility. Zero retains all exact best ties; no eligible candidate throws RangeError. Return an immutable issued selection. holdout requires that selection, same objective id, different dataId, disjoint observation IDs and seeds; evaluate fixed selected settings without reselection. Return selection plus original training/held-out results. SD uses n-1/null below two.

Issuance/type errors throw TypeError, budget/domain violations RangeError, run/objective failures remain explicit. Declared split IDs cannot prove empirical independence.

<a id="study-boundaries-contract"></a>

### Whole-study hooks, subexperiments and continuation

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
storage.encode(checkpoint: StudyCheckpoint<unknown,unknown>, options:{format:"study-json"}):string
storage.decode(text:string, options:{format:"study-json"}):StudyCheckpoint<unknown,unknown>
```

**Behavior and errors**

before executes once after plan/budget validation and before the first model allocation. after executes once on terminal completion (including failed runs) if before succeeded, with detached results; never on a pause. Both use the synchronous/thenable rules. A failed before starts no model and returns every run as skipped/before-error with a studyError phase before; a failed after retains all outcomes and adds studyError phase after. Neither error silently discards results. Whole-study hooks are distinct from per-run create/dispose; resume never repeats successful before or a completed after.

Separate BehaviorSpace subexperiments concatenate independently expanded Cartesian blocks, preserving block order and IDs; they are not globally cross-multiplied. Scenario indices and IDs remain unique across concatenated blocks. Conditional metrics use the same sampleWhen at initial/scheduled samples, with the documented explicit sampleFinal override. Pre/post labels bind to before/after callbacks rather than executed source. Replication statistics use experiments.summarize; list-valued observations remain detached lists with preserved order and missing values.

Pause checks occur only after initial sampling/stop and after successful-step sampling/stop, never inside a step or ahead of a terminal stop/horizon. save must declare all required World/component roots and custom model continuation through storage.save; functions are excluded. Its checkpoint must have rootKind world or bundle. A data-only Snapshot is rejected before issuing a study checkpoint: selected measurements alone cannot resume a model. The resume load callback continues to accept only WorldSnapshot or BundleSnapshot. Validate/encode the snapshot and checkpoint before issuing the checkpoint, then dispose the live instance once.

A save or disposal error produces a failed current run instead of a resumable checkpoint, preserving prior samples and policy. The checkpoint contains framework/version, exact plan and normalized policy, cursor/index, already terminal outcomes, active run's snapshot/step count/samples, consumed planning/sample counters, and before/after completion flags. No callback is serialized. Model/parameter/data identifiers and codec revisions are retained; arbitrary custom continuation remains unknown after decoding.

Resume validates the entire checkpoint's version, IDs, ordering, counters/budgets, terminal unions, snapshot framework/revisions and all references before creating anything. Rebind callbacks explicitly. For an active run call load with its unknown-typed snapshot; application validation must establish custom payload types before returning a complete ordinary model. Do not call create/setup again for that active run, remeasure its saved boundary, rerun before, reseed its captured stream or recount completed steps. Future runs use create normally.

The restored World clock/RNG/model continuation must match the saved boundary; unsupported payloads or missing roots reject rather than guessing. A load failure is a failed run with phase load and then follows onError. after runs only once at final completion. Checkpoints may be encoded with storage's snapshot graph plus the explicit study checkpoint codec; pause/resume is cooperative synchronous boundary capture, not suspension/serialization of JavaScript stacks or worker processes.

The checkpoint envelope validates framework-owned structure, not arbitrary parameter/measurement/snapshot model payloads; those remain unknown until real application validation. The optional worker executor supports cancellation as transport termination with explicit transport outcomes, not implicit resumable workers. The provided Node worker executor has no pause overload: its protocol returns only actual run or explicit transport/nonexecution outcomes. No worker state is claimed recoverable after timeout or forced termination.

<a id="study-contracts-general"></a>

### Finite studies and host execution

**Study, worker and calibration data schemas**

```ts
type WidenStudyScalar<Value extends StudyScalar> = Value extends number ? number : Value extends boolean ? boolean : string;
declare const selectionMeasurement: unique symbol;
export interface BehaviorSpaceAxis {
	readonly variable: string;
	readonly values: readonly string[];
}

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

export type BehaviorSpaceMeasurement = Readonly<Record<string, StudyScalar>>;

export interface CandidateObjective<Parameters, Measurements> {
	readonly id: string;
	readonly dataId: string;
	readonly observationIds: readonly string[];
	loss(outcome: StudyOutcome<Parameters, Measurements>): number;
}

export interface CalibrationManifest {
	readonly id: string;
	readonly dataId: string;
	readonly observationIds: readonly string[];
}

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

export interface CandidateSelection<Parameters, Measurements> {
	readonly [selectionMeasurement]?: (measurement: Measurements) => Measurements;
	readonly version: 1;
	readonly objectiveId: string;
	readonly trainingDataId: string;
	readonly rule: { readonly maxMeanLossDelta: number };
	readonly candidates: readonly StudyScenario<Parameters>[];
}

export interface CandidateHoldout<Parameters, Measurements> {
	readonly version: 1;
	readonly selection: CandidateSelection<Parameters, Measurements>;
	readonly training: CandidateEvaluation<Parameters, Measurements>;
	readonly holdout: CandidateEvaluation<Parameters, Measurements>;
}

export type NodeStudyConfig =
	| null
	| boolean
	| number
	| string
	| readonly NodeStudyConfig[]
	| { readonly [key: string]: NodeStudyConfig };

export interface NodeStudyRegistration {
	readonly moduleUrl: string;
	readonly exportName: string;
	readonly sha256: string;
	readonly config?: NodeStudyConfig;
}

export interface StudyCancellationSignal {
	readonly aborted: boolean;
	addEventListener(
		type: "abort",
		listener: () => void,
		options?: { readonly once?: boolean },
	): void;
	removeEventListener(type: "abort", listener: () => void): void;
}

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

export interface NodeStudyResult<Parameters, Measurements> {
	readonly version: 1;
	readonly provenance: Readonly<Record<string, string>>;
	readonly outcomes: readonly NodeStudyOutcome<Parameters, Measurements>[];
}

export type StudyScalar = number | boolean | string;

export type StudyParameters = Readonly<Record<string, StudyScalar>>;

export interface StudyAxis {
	readonly name: string;
	readonly values: readonly StudyScalar[];
}

export type StudyParameterValues<Parameters extends StudyParameters> = {
	readonly [Key in keyof Parameters]: WidenStudyScalar<Parameters[Key]>;
};

export type StudyAxisFor<Parameters extends StudyParameters> = {
	[Key in Extract<keyof Parameters, string>]: {
		readonly name: Key;
		readonly values: readonly StudyParameterValues<Parameters>[Key][];
	};
}[Extract<keyof Parameters, string>];

export interface StudyScenario<Parameters = StudyParameters> {
	readonly id: string;
	readonly index: number;
	readonly parameters: Parameters;
}

export interface PlannedRun<Parameters = StudyParameters> {
	readonly id: string;
	readonly scenarioId: string;
	readonly scenarioIndex: number;
	readonly replicationIndex: number;
	readonly seed: number;
	readonly parameters: Parameters;
}

export interface StudySample<Measurements> {
	readonly step: number;
	readonly measurement: Measurements;
}

export type StudyPhase =
	| "create"
	| "step"
	| "measure"
	| "sample"
	| "stop"
	| "dispose" | "pause" | "save" | "load";

export interface StudyError {
	readonly phase: StudyPhase;
	readonly name: string;
	readonly message: string;
}

export type StudyStatus = "completed" | "stopped" | "failed" | "skipped";

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

export type StudyOutcome<Parameters, Measurements> = StudyTerminal & {
	readonly run: PlannedRun<Parameters>;
	readonly completedSteps: number;
	readonly samples: readonly StudySample<Measurements>[];
};

export interface StudyResult<Parameters, Measurements> {
	readonly version: 1;
	readonly provenance: Readonly<Record<string, string>>;
	readonly outcomes: readonly StudyOutcome<Parameters, Measurements>[];
 readonly studyError?:{readonly phase:"before"|"after";readonly name:string;readonly message:string};
}

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
interface BoundBehaviorSpace<Model extends ExperimentModel> {
 readonly spec:BehaviorSpaceSpec;
 readonly plan:readonly PlannedRun<StudyParameters>[];
 readonly options:ExperimentOptions<StudyParameters,Model,Readonly<Record<string,StudyScalar>>>;
}
```

**Behavior and errors**

Every study runs ordinary independently constructed TypeScript models. The same model object contains a World, its normal synchronous step procedure, any model-chosen properties and optional cleanup. Study planning, measurement, source-label binding and worker transport consume that object. They do not create a second rule system. Direct model state remains data; create allocates a whole independent run, never an Agent state factory.

<a id="storage-api"></a>

## storage

Save the data you choose. File and database access stays with the caller.

<a id="storage-commands"></a>

| Command / property | Purpose | Result |
| --- | --- | --- |
| `storage.save(value, options?)` | Save the supplied World, component bundle or selected data in memory. Optional extra state and value codecs are described in the detailed contracts. | A Snapshot independent of later changes to the live source. |
| `storage.load(snapshot, options?)` | Load saved data into fresh objects. It does not modify an existing model or reload its functions. | `{value,state}`. |
| `storage.encode(value, options)` | Convert saved state or ordinary data to an explicit named format or own format. Does not write a file. | Text or bytes, as defined by the format. |
| `storage.decode(data, options)` | Read and validate the selected format. Does not create a live World. Application data may need its own validation. | A Snapshot or format-specific data. |
| `storage.history(options?)` | Create a bounded in-memory measurement history. Capacity defaults to 300; the oldest samples are evicted when full. | A History; recording is always explicit. |
| `storage.is(value, kind)` | Check a library object’s kind, such as "world" or "agent". This does not validate custom model properties. | A boolean and a TypeScript type guard. |
| `history.add(sample)` | Add `{tick,values}`. Ticks must increase within a series; the first sample establishes the metric keys. | No return value; stores detached finite numeric measurements. |
| `history.samples` | Read the retained samples in chronological order. | A detached, read-only list. |
| `history.delete()` | Empty the samples, key schema and last-tick marker; retain capacity. The next sample begins a new series. | No return value; does not change the World, Agenda or RNG. |

<a id="storage-example"></a>

### Examples

<a id="storage-example-world"></a>

#### Save and load a model

```ts
import { Agent, World, run } from "agent-loom";
import { storage } from "agent-loom/storage";

const person = Agent.add({ energy: 10 });
const world = World.add();
world.add(person);

function step() {
  person.energy -= 1;
}

run(world, step, 3);
const snapshot = storage.save(world);
run(world, step);

const { value: loadedWorld } = storage.load(snapshot);
console.log(world.tick.value, loadedWorld.tick.value); // 4, 3
```

<a id="storage-example-data"></a>

#### Save selected data

```ts
import { storage } from "agent-loom/storage";

const measurement = { tick: 3, energy: 7 };
const snapshot = storage.save(measurement);
measurement.energy = 0;

const { value: loadedMeasurement } = storage.load(snapshot);
console.log(loadedMeasurement.energy); // 7
```

<a id="storage-example-format"></a>

#### Encode and decode JSON

```ts
import { storage } from "agent-loom/storage";

const measurement = { tick: 3, energy: 7 };
const formatOptions = { format: "snapshot-json" } as const;
const snapshot = storage.save(measurement);
const text = storage.encode(snapshot, formatOptions);
const decodedSnapshot = storage.decode(text, formatOptions);
const { value: loadedMeasurement } = storage.load(decodedSnapshot);

console.log(loadedMeasurement); // { tick: 3, energy: 7 }
```

<a id="storage-example-history"></a>

#### Keep a short history

```ts
import { storage } from "agent-loom/storage";

const history = storage.history({ capacity: 100 });
history.add({ tick: 1, values: { energy: 9 } });

console.log(history.samples.length); // 1
history.delete();
console.log(history.samples.length); // 0
```

<a id="storage-details"></a>

**Types and detailed contracts**

<a id="codecs"></a>

### Save and load

`storage.save(value)` saves exactly the supplied supported value in memory as a Snapshot: a World, a named component bundle or ordinary selected data. `storage.load(snapshot)` creates fresh supported objects and returns `{value,state}`. Neither operation reads or writes files. `encode` and `decode` handle explicit data formats separately.

```ts
storage.save<V>(value: V): Snapshot<V, {}>
storage.save<V, S>(value: V, options: { state: S }): Snapshot<V, S>
storage.load<V, S>(snapshot: Snapshot<V, S>): { value: V, state: S }
storage.encode<V, S>(snapshot: Snapshot<V, S>, options: { format: "snapshot-json" }): string
storage.decode(data: string, options: { format: "snapshot-json" }):
  WorldSnapshot<unknown> | BundleSnapshot<unknown> | DataSnapshot<unknown>
```

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `state` | No extra model state | Caller-supplied supported extra state for a World, component bundle or data snapshot. Ordinary closures/functions are not saved. |
| `rootKind` | Read-only snapshot metadata: "world", "bundle" or "data" | A validated discriminator for the root shape, not an application model schema. Narrow decoded snapshots by this field before restoring a known World root. |
| `format` | Required explicit supported format | "snapshot-json" accepts a Snapshot; "geojson" and "behaviorspace" select bounded external codecs. GeoJSON decode requires `coordinateSystem:{crs,units}`; returned dataset retains these labels. GeoJSON encode emits geometry only, so caller retains its labels separately. Unknown formats/versions reject. |

##### Types before and after serialization

| Stage | Type and validation contract |
| --- | --- |
| Save in memory | `Snapshot<V, S>` is opaque library-produced snapshot data retaining the inferred root and extra-state types. Restoring it returns fresh supported components with those declared shapes. Omitting options produces the empty extra-state type. A custom extra-state type requires matching data in the options; it cannot be selected without supplying that data. |
| Decode snapshot text | Validate version, component records, references, value schemas and finite codec resource limits before restoration. Reject malformed, unsupported or oversized data. Text carries no trusted caller TypeScript type; no generic type argument can assert one. |
| World root | `WorldSnapshot<S>` has `rootKind` = "world" and is a `Snapshot<World, S>`. After decoding, S is unknown. The codec validates built-in World/component records, so restoring a narrowed World snapshot yields a known World without an instanceof assumption about factory exports. |
| Bundle root | `BundleSnapshot<S>` has `rootKind` = "bundle" and is a `Snapshot<Readonly<Record<string, unknown>>, S>`. After decoding, component properties and S remain unknown to the application. The codec validates framework records; it cannot infer arbitrary application property names or custom Agent-state types. |
| Data root | `DataSnapshot<S>` has `rootKind` = "data" and is a `Snapshot<unknown, S>`. After decoding, its value and extra state remain unknown until application validation. In-memory `storage.save(data)` retains the actual inferred data type. Loading data returns data; it does not construct a World or merge values into an existing model. |
| Application validation | Use normal TypeScript narrowing or a caller-owned runtime schema to check unknown model data. Plain-record checks must not assert that an arbitrary object is an Agent or another library component. A type assertion or unchecked generic parameter is not validation. |

**Behavior and errors**

Use a small persistence surface for supported Worlds, component bundles, histories, agendas and external formats. These are proposed contracts, not implemented codecs. The snapshot-json overloads preserve a strict distinction between typed in-memory save and runtime-validated serialized input; other format-specific overloads return their validated documented types (for example a labeled dataset for geojson), rather than a caller-selected generic type. Snapshot, WorldSnapshot, BundleSnapshot, DataSnapshot and Format are public types from the optional storage module.

**Result and effects:** Supported snapshot roots are ordinary supported data, a `World`, or an explicit record of `Agent`/`Grid`/`Graph`/`Input`/`Agenda`/`History`/`Random` references plus cloneable model data and arrays of declared component references. Native arrays replace population wrappers. A World root includes its registered components. A Graph component declared in a bundle or registered in the captured World includes its edges and ordinary cloneable node objects, preserving node identity and shared references within the supported object graph.

Agent or other live component nodes are external references unless also registered in the captured World or declared as component roots. They must be declared explicitly, otherwise save rejects; Graph membership alone never attaches them to a World. Caller closures and unrelated live objects are not traversed implicitly. `save` is observational. `load` returns `{value,state}`, creates fresh independent identities and preserves relationships inside a supported bundle, RNG algorithm/continuation and recorded clocks.

A supported World snapshot preserves the absence or presence of its spatial context, including derived dimensions and boundary rules; each captured Grid preserves its own spatial context. Restoring a network-only World must not invent a space. Exact continuation is promised only for supported captured state plus the same caller-supplied model procedures; unavailable codecs reject rather than silently lose data. The versioned codec contract defines legacy import and validation. File and database I/O remains caller-owned.

Decoding validates data without creating live model components. Restoration creates a fresh supported component graph; failure must not modify existing Worlds or publish a partially restored graph. No model functions, listeners, file handles or network connections are recreated. Applications rebind their own procedures and external integrations explicitly. Snapshot-json preserves supported model data and relationships; unsupported values and codec versions reject instead of silently disappearing.

<a id="storage-data"></a>

### Choose the data

```ts
storage.save<V>(value: V): Snapshot<V, {}>
storage.save<V, S>(value: V, options: { state: S }): Snapshot<V, S>
storage.load<V, S>(snapshot: Snapshot<V, S>): { value: V; state: S }
type DataSnapshot<S = unknown> = Snapshot<unknown, S> & { readonly rootKind: "data" };
```

| Supplied value | Saved content | On load |
| --- | --- | --- |
| World | Its registered components and required continuation state; rootKind "world". | A fresh World with the saved supported state. Rebind model procedures before continuing. |
| Named component bundle | Explicitly named components, arrays of component references and associated data; rootKind "bundle". | A fresh bundle preserving supported internal relationships. The caller supplies its model logic. |
| Ordinary data | The supplied scalar, record, array, Map, Set or other supported ordinary value; rootKind "data". | A detached copy of that data. Measurements do not become a resumable simulation. |

Select fields and sampling frequency with ordinary objects, arrays and functions before calling `save`. The library does not infer fields from their names, subscribe to a model or merge partial data back into live objects. Complete World saves, selected data and retained History use the same `storage` module.

**Classification, references and validation**

A direct World has rootKind world. A plain named record with one or more explicitly declared framework components, or arrays of them, has rootKind bundle. Framework references inside its supported component/data graph must resolve to those declared roots, preserving the existing dependency checks. An ordinary value without framework components has rootKind data, even when it is a record. Empty arrays do not declare component roots: a record containing only empty component arrays and ordinary data is a data root.

Studies save their World (optionally with extra state) or a named bundle containing that World and all required continuation components. A direct individual component, an unwrapped array of components, or a component hidden only inside nested data is rejected; place the selected components in a named bundle. No automatic World or missing dependency is created.

Data roots and their extra state follow the shared supported-value and cloning rules, including cycles and aliases between ordinary values. They contain no live framework references. Save validates and copies before publishing a Snapshot, without changing time or randomness. Loading a decoded data root yields unknown data until a real caller validator narrows it. A partial bundle can resume only if it actually contains every required component and model-owned continuation value; a data-only snapshot is never accepted as a study continuation.

<a id="storage-formats"></a>

### Own formats

```ts
interface Format<Value, Encoded extends string | Uint8Array> {
  readonly id: string;
  readonly version: number;
  encode(value: Value): Encoded;
  decode(data: Encoded): Value;
}
storage.encode<Value, Encoded extends string | Uint8Array>(value: Value, options: { format: Format<Value, Encoded> }): Encoded
storage.decode<Value, Encoded extends string | Uint8Array>(data: Encoded, options: {
  format: Format<Value, Encoded>; limits?: DecodeLimits
}): Value
```

The default Snapshot uses the versioned `snapshot-json` format. Keep existing named formats for their documented domains. An own format is an ordinary object passed explicitly to `encode` and `decode`; there is no format constructor, registration service or automatic detection. Content selection happens before encoding.

**Format contract**

id is a nonempty string of at most 128 UTF-16 units and version is a positive safe integer. They identify the selected adapter: library-generated format-validation errors include this id/version; callback exceptions are rethrown unchanged. Additional own properties on the format object may hold ordinary private configuration; the library neither interprets nor serializes those extra properties. Unknown properties on the encode/decode options object still reject. Encode and decode are synchronous nonthenable callbacks.

They must preserve the complete supplied data contract, validate their own supported types, fields and numerical domains, and either return the promised result or throw. The decoded value type is established by the supplied validating function, not by selecting an unchecked generic type. Same-shaped forged objects are never accepted as framework snapshots.

Custom formats accept and return ordinary supported data only. A live component or Snapshot input/result rejects with TypeError; custom formats never create framework instances from records. To transform a model snapshot, first encode it with the built-in snapshot-json format, pass that ordinary string to the custom format, and reverse those explicit calls before the standard snapshot decoder and load. This keeps framework schema checks outside the custom callback and avoids nested snapshot-codec dispatch. Each explicit decode receives its own caller-supplied limits; options never propagate into unrelated calls implicitly. Ordinary decoded data is checked against shared supported-value budgets before publication.

The descriptor's id/version do not automatically add a header to the encoded bytes. The format owns its version information and compatibility checks, either in its document or in an explicitly agreed external schema. Neither callback performs hidden model mutations, random draws or file/network operations. Callback errors propagate; the library cannot roll back arbitrary callback side effects.

Custom text defaults to the existing 32 MiB UTF-8 limit; binary input/output uses the same byte ceiling. Caller DecodeLimits may lower the existing byte/depth/record/reference/item limits. Check that input is string or Uint8Array and enforce encoded bytes before calling decode; the formatter validates its particular expected input type; validate output type, bytes and supported-value counts before returning. The formatter must enforce any tighter format-specific limits while parsing/encoding. A generic limit is not a sandbox for trusted caller code.

<a id="history"></a>

### Record observations

```ts
storage.history(options?: { capacity?: number }): History
history.add(sample: { tick: number; values: Readonly<Record<string, number>> }): void
history.samples: readonly Sample[]
history.delete(): void
```

| Input | Default / required value | Meaning |
| --- | --- | --- |
| `capacity` | 300 | Positive integer retained samples; evict oldest at capacity. |
| `tick / values` | Required increasing finite nonnegative tick and finite numeric metric record | One stable metric-key set per history, established on first sample; no automatic initial sample. |

**Behavior and errors**

Keep bounded observations independently of current model reads and pure statistics.

**Result and effects:** Explicit `add` records detached values. `samples` returns detached readonly observations. `history.delete()` empties `samples`, deletes the metric-key schema and last accepted tick, and retains capacity. The next sample starts a new series. It does not change `World`, settings or RNG. Histories belong to optional `storage` even when retained in memory.

<a id="complete-history"></a>

### Bounded recording

**Behavior and errors**

`storage.history({capacity})` defaults capacity 300, accepts a positive safe integer at most 1000000, and returns an empty History. history.add({tick,values}) requires finite nonnegative tick strictly greater than the last retained/accepted tick and an own record of finite numeric metrics. Empty records are valid. The first accepted sample establishes the exact key set, including insertion order; later records must have that same key set.

Validate and copy before insertion; overflow evicts the oldest sample. history.samples returns detached readonly samples in chronological insertion order. history.delete() empties samples, sets the key schema and lastTick marker to null, and retains the same History and capacity. It returns void; deleting all contents of an empty History is a no-op. The next accepted sample starts a new series and may use different metric keys and any finite nonnegative tick, including 0 or a value below the previous series.

Thereafter, each tick must again be strictly greater than the last accepted tick in that new series; eviction at capacity never resets this marker. Deleting a History’s contents neither resets world.tick nor changes an Agenda or RNG. History never subscribes to a World or draws randomness. Snapshotting a history includes capacity, schema, last accepted tick and retained samples. Observation and recording remain separate calls.

<a id="complete-snapshot-validation"></a>

### Save and load validation

```ts
storage.decode(text: string, options: { format: "snapshot-json"; limits?: DecodeLimits }):
  WorldSnapshot<unknown> | BundleSnapshot<unknown> | DataSnapshot<unknown>
type DecodeLimits = { bytes?: number; depth?: number; records?: number; references?: number; items?: number };
```

**Behavior and errors**

Save preserves generic root and extra-state types only for values actually supplied. Omitted extra state has the empty object type; no overload may fabricate a selected custom state without data. Save is observational, synchronous, and rejects while any included World is running or included Random has an active local scope. Supported roots are ordinary supported data, one World, or a plain named bundle of component references and cloneable model data. The [data-selection contract](#storage-data) defines automatic root classification; no mode or registration is required.

Captured World's registered components are roots; graph ordinary nodes are traversed as data; framework component graph nodes and Input targets outside those roots must be declared explicitly. A missing component root rejects with its reference path. Arbitrary live foreign resources reject. A managed component may belong to only one captured World. Cloneable data references to declared components preserve identity within the captured graph; their presence never creates ownership.

Load allocates a fresh isolated component graph only after validating the complete snapshot. Do not publish a partial graph on failure or modify existing Worlds. Load preserves absence/presence of World space, each Grid context, membership and insertion order, relationship links internal to the new graph, agent state/orientation, route progress, edge direction/key/state, RNG state/cache/algorithm revision, tick, Input constraints, Agenda queue/time/tie sequence, and History schema/samples/capacity. Existing instances remain independent.

Public opaque framework IDs are newly allocated on load; archived modelId values are provenance, not reused live identifiers. Relationship references are remapped consistently. Caller-owned numeric/domain IDs in custom state and compatibility identity maps retain their values. Indexes keyed by public opaque ID strings must be rebuilt after load; use component references or explicit model-owned keys for persistent relationships. Unknown custom payloads remain unknown after decoding. Restored Input references resolve to restored declared targets.

Callers explicitly rebind their step functions, event handlers, model validation and external consumers. Exact continuation means same subsequent operations with the same rebound procedures and supported captured values, not serialized executable code or a future engine-version guarantee.

The codec exposes a versioned tagged graph contract; its wire records are not model-authoring objects. Target snapshot-json uses framework "agent-loom", envelope version 1, independent codec revisions for components and RNG, and rootKind "world", "bundle" or "data". Encode emits an explicit tagged value graph for undefined, bigint, Map, Set, Date, shared/cyclic containers and framework references; JSON's lossy default conversion is never used as a substitute. Reject nonfinite numbers and unsupported values.

Record/reference IDs are unique nonempty strings, references resolve exactly once, and duplicate property keys, unknown tags, duplicate component IDs, prototype-pollution keys in envelope records, malformed UTF-8-derived text, impossible ownership and unsupported revisions reject. Arbitrary model property names are stored as ordered key/value pairs, so a model key named `__proto__` is data rather than a prototype assignment. Parsed ordinary objects never become framework instances by instanceof assumptions.

Default validation limits are 32 MiB UTF-8 text, nesting depth 128, 1000000 records, 4000000 references and 4000000 aggregate collection entries. Caller limits may lower these positive-safe-integer budgets, not raise them above defaults. Check UTF-8 byte length before JSON parsing, use depth/duplicate-key-aware tokenization before building a parsed object, then validate full structure, references, component schemas, dimensions and resource counts before any live framework allocation. Save/encode use the same graph limits.

Unknown framework/version/algorithm, dangling reference, excessive resources and malformed values reject; no partial fallback. Errors include a stable data path and reason, without claiming every model's scientific validity. A world discriminator validates built-in structure only: restored model state remains unknown until caller checks. Bundle names and extra state remain unknown. No unchecked generic decode overload restores trust erased by serialization.

Legacy world V1–V4 and RNG state V1/V2 are separate from the target envelope. Import model data explicitly through `storage.decode(text,{format:"legacy-world-json"})`, or `storage.decode(data,{format:"legacy-world-data"})` for in-memory V1 structured-cloneable payloads that are not universally JSON-safe. Both validate the supported model-only subset of the old schemas, preserve XYZ, declared variable/reference graphs and MT Gaussian continuation where present, and return a target WorldSnapshot&lt;unknown&gt;.

Nonempty legacy presentation sections and built-in appearance fields are unsupported and reject instead of being silently discarded; callers must explicitly remove those sections and fields before import. Application-defined properties named color, shape or similar remain ordinary supported model state and must not be stripped. V1 and V2 are physical XY envelopes, V3 retains the same model geometry, and V4 is explicitly dimension 3; none is a NetLogo export-world file. Reject unsupported version/dimension combinations. Nested MT RNG-state version 1 is accepted only with empty Gaussian cache; nested MT version 2 carries the cache.

These RNG revisions are distinct from world envelope V1/V2. Old 2D worlds become explicit unit-cell Grids and separately attached Agents/Graph; on each axis with old patch-center bounds min/max, set extent=max−min+1 and offset=(min+max)/2, then translate framework positions by subtracting offset. Store original bounds/offset, old globals, original numeric IDs and next-ID counters as validated conversion state. Translate known patch/agent positions only; arbitrary model coordinates in custom data are not guessed. Caller procedures can add the recorded offset when preserving an external coordinate convention.

V1 values outside the target supported data subset require an explicitly supplied application value codec; absent such a codec the import rejects with the unsupported value path rather than losing data. No arbitrary reinterpretation of old globals/functions occurs. The supported old model schemas are import contracts, not the new envelope version. Export back to an old world format is unsupported when information would be lost and rejects explicitly.

<a id="restored-kind-validation"></a>

### Validate restored framework identities

```ts
type StoredKinds = {
  world: World; agent: Agent<{}>; grid: Grid<{}>; graph: Graph<object,{}>;
  input: Input; agenda: Agenda<unknown>; history: History;
  random: Random; eventHandle: EventHandle<unknown>;
};
storage.is<K extends keyof StoredKinds>(value: unknown, kind: K): value is StoredKinds[K]
```

**Behavior and errors**

This pure guard checks the private library-issued kind/identity brand of a live or deleted component or issued handle; it never trusts a plain object’s fields, prototype or caller cast. Unknown kinds reject with TypeError. Unknown/nonframework values return false. A genuine deleted Agent still has kind agent; check alive before operations requiring life. The guard never validates custom state, revives an identity, draws RNG, advances time or changes membership. It narrows only the base framework type; model-owned properties still need ordinary real validation. This enables safe bundle-field and restored-handle checks without inventing constructor instanceof assumptions or a schema language.

<a id="complete-external-codecs"></a>

### Explicit data formats

```ts
storage.encode(value: PlanarGeometry | PlanarFeature | PlanarDataset | readonly PlanarFeature[], options: { format: "geojson" }): string
storage.decode(text: string, options: { format: "geojson"; coordinateSystem: { crs: string; units: string } }): PlanarDataset
storage.encode(value: readonly BehaviorSpaceSpec[], options: { format: "behaviorspace" }): string
storage.decode(text: string, options: { format: "behaviorspace" }): readonly BehaviorSpaceSpec[]
storage.decode(text: string, options: { format: "legacy-world-json" }): WorldSnapshot<unknown>
```

**Behavior and errors**

Every codec call requires an explicit built-in format name or a Format object and rejects unknown option keys. No auto-detection, implicit file access or command execution occurs. Decode returns a format-specific type, never a caller-selected generic model type. UTF-8 text defaults to the same 32 MiB limit unless a narrower codec cap is specified.

- `storage.decode(text,{format:"geojson",coordinateSystem:{crs,units}})` accepts standard Feature/FeatureCollection and Point/MultiPoint/LineString/MultiLineString/Polygon/MultiPolygon/GeometryCollection with finite planar XY coordinates. It returns {features,coordinateSystem}; explicit nonempty crs and units labels are mandatory and do not reproject coordinates. Reject XYZ coordinates rather than silently dropping altitude. Rings require ≥4 positions and closed first/last point; holes remain explicit. Null feature geometry is retained as null. Feature IDs/properties remain cloneable data, not Agents.

Encode accepts a PlanarGeometry, one PlanarFeature, a PlanarDataset or a feature array; geometry/feature values retain their standard GeoJSON root kind, while a dataset/array becomes a FeatureCollection. It omits coordinate-system labels from geometry; callers retain labels separately. Empty collections are valid; malformed rings/nonfinite/unsupported structures reject. GIS operations do not infer geodesy, raster sampling or CRS conversion.
- `storage.decode(text,{format:"behaviorspace"})` parses bounded declarative XML study metadata into labeled setup/go/stop/measure command strings, enumerated/stepped parameter values, repetitions, seeds, time limit and cadence. It never evaluates those strings. Explicit caller-owned bindings in experiments convert only recognized labels to TS procedures; unknown labels reject there. Reject external entities/DTDs, executable imports, malformed numeric ranges and range expansion beyond 1000000 values. Encode accepts that declarative plan and returns escaped XML without translating TypeScript back into NetLogo procedures.

<a id="snapshot-wire-schema"></a>

### Snapshot wire schema

```ts
type WireValue = null | boolean | string | number
  | { tag: "undefined" }
  | { tag: "bigint"; decimal: string }
  | { tag: "number"; value: "negative-zero" }
  | { tag: "ref"; id: string };
type Ref = { tag: "ref"; id: string };
type WireEnvelope = {
  framework: "agent-loom"; version: 1; rootKind: "world" | "bundle" | "data";
  root: WireValue; state: WireValue; records: readonly WireRecord[];
};
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
type GridRecord = {
  id: string; kind: "grid"; revision: 1; modelId: string;
  space: Space & Required<Pick<Space, "dimensions" | "boundary">>; cellSize: number; fields: readonly Ref[];
};
type FieldRecord = {
  id: string; kind: "field"; revision: 1; modelId: string;
  grid: Ref; index: number; state: Ref;
};
type GraphRecord = {
  id: string; kind: "graph"; revision: 1; modelId: string;
  parallel: boolean; selfLoops: boolean; nextKey: number;
  nodes: readonly Ref[]; edges: readonly Ref[]; edgeDefaults: Ref;
};
type EdgeRecord = {
  id: string; kind: "edge"; revision: 1; modelId: string;
  graph: Ref; from: Ref; to: Ref; directed: boolean; key: string | null;
  state: Ref; path: Ref | null; tieMode: "none" | "free" | "fixed";
};
type RandomRecord = RandomState & { id: string; kind: "random"; revision: 1 };
type InputRecord = {
  id: string; kind: "input"; revision: 1; modelId: string;
  bindings: readonly { target: Ref; property: string; type: "number" | "string" | "boolean";
    min?: number; max?: number; step?: number }[];
};
type AgendaRecord = {
  id: string; kind: "agenda"; revision: 1; modelId: string; time: number;
  nextSequence: number; events: readonly {
    eventId: string; at: number; priority: number; sequence: number; data: WireValue
  }[];
};
type HistoryRecord = {
  id: string; kind: "history"; revision: 1; capacity: number;
  keys: readonly string[] | null; lastTick: number | null;
  samples: readonly { tick: number; values: readonly number[] }[];
};
type HandleRecord = {
  id: string; kind: "handle"; revision: 1;
  owner: Ref; domain: "agenda-event"; localId: string;
};
type ExtensionRecord = {
  id: string; kind: "extension"; codec: string; version: number; payload: WireValue;
};
```

**Optional application values at the persistence boundary**

Format converts an entire ordinary data value to and from text or bytes. ValueCodec handles one otherwise unsupported application value inside the default snapshot format; it does not choose the whole document format. The ordinary data defaults need no registration. An application with a legacy in-memory value outside those defaults can supply an explicit value codec to save/load. This is an optional boundary adapter composed from ordinary TypeScript functions, not model-authoring syntax. Functions themselves, framework components, weak collections and active host resources cannot be overridden by a codec. Codecs never serialize executable code or turn arbitrary decoded data into a trusted model type.

```ts
type ValueCodec = {
  id: string; version: number;
  accepts(value: unknown): boolean;
  encode(value: unknown): unknown;
  decode(payload: unknown): unknown;
};
storage.save<V>(value: V, options: { valueCodecs: readonly ValueCodec[] }): Snapshot<V, {}>
storage.save<V,S>(value: V, options: { state: S; valueCodecs?: readonly ValueCodec[] }): Snapshot<V,S>
storage.decode(data: unknown, options: { format: "legacy-world-data"; valueCodecs?: readonly ValueCodec[] }): WorldSnapshot<unknown>
storage.load<V,S>(snapshot: Snapshot<V,S>, options?: {
  valueCodecs?: readonly ValueCodec[]
}): { value: V; state: S };
```

The legacy-world-data overload validates its old in-memory schema, then uses explicitly supplied codecs only for unsupported ordinary legacy payload values while constructing the target snapshot; it never executes a model callback. Codec IDs are unique nonempty strings ≤ 128 code units; versions are positive safe integers. accepts is evaluated once per unsupported object in codec list order and must return boolean synchronously; no match or more than one match rejects. encode returns only supported plain data, without further extension values, functions, host resources or reference to the encoded original.

Its detached payload may contain ordinary internal cycles but cannot reference another extension value. Encode the whole original object once, preserving repeated external aliases through one ExtensionRecord; codec-internal identity relationships are its responsibility. Decode receives an independently restored plain payload; a supplied codec with exact ID/version is mandatory before live allocation starts. Every encode/decode callback must be synchronous and nonthenable; callback failure aborts save/load without publishing a partial framework graph. Callers remain responsible for effects outside the returned values.

No codec implementation is stored in Snapshot; in-memory and decoded restoration both require supplying it when an ExtensionRecord is present. Decoded extension output remains unknown to application typing. Only in-memory save retains its inferred V/S, under the caller's obligation that decode(encode(value)) preserves that codec's declared value contract.

**Behavior and errors**

The following schema fixes the target snapshot-json envelope and each record's fields. It is a data interchange contract, never a second authoring language. All fields shown are required unless marked optional; unknown fields reject. Stored Space values always include dimensions and boundary, even though callers may omit them on input. JSON objects have unique field names. Encode uses UTF-8 JSON without executable expressions; key order is not semantically significant except in the explicit ordered pair arrays.

Reference IDs and archived model IDs are separate namespaces; archived core modelId values are save provenance and are remapped to fresh public identities on load. Every reference resolves to exactly one record; unreachable records reject. The root and extra state together define reachability.

All ordinary numeric WireValues are finite and preserve their IEEE-754 values under round-trip JSON, with −0 using its explicit tag. Bigint decimal is canonical base ten: zero "0", otherwise optional minus followed by a nonzero digit and digits, with no plus sign, leading zeros or negative zero. Object properties are unique ordered keys, including `__proto__` as data; load through safe own-property creation. Arrays store length as an integer in [0,2³²−1] and strictly increasing unique indices in [0,length), preserving holes. The logical length, including holes, counts against the aggregate collection-entry budget before reconstruction.

Extra named array properties reject because the model-state subset defines arrays as indexed sequences. Map keys/Set entries are validated for SameValueZero uniqueness after reference resolution, preserving insertion order; cyclic and aliased container records are allowed. Dates have finite epoch milliseconds in the valid JavaScript Date range. Buffer bytes are integer [0,255], at most 4194304 per buffer. SharedArrayBuffer and detached buffers reject. Views reference a buffer record and validate constructor alignment, byteOffset and length against its byte size; length is element count except DataView byte length.

Preserve shared backing-buffer identity across views. byteOrder is the encoding host endianness; restoring a typed view on a different-endian host rejects explicitly, rather than changing its numeric interpretation. DataView has no host-endian interpretation and preserves all bytes. Float view bytes may contain nonfinite IEEE patterns as opaque data; numeric model operations still require their documented finite scalars. Regexp source is bounded to 4096 code units, flags are canonical JavaScript d/g/i/m/s/u/v/y order with no duplicates and u/v mutually exclusive, lastIndex is a nonnegative safe integer.

Validate by constructing RegExp without executing it; no regex is run by decoding.

A world root must be a Ref to WorldRecord. A bundle root must be a Ref to an object record containing named declared component roots and ordinary supported values. A data root is any valid WireValue, including a primitive or a Ref to an ordinary data record. Its root and extra-state graphs may contain ordinary supported values and validated ExtensionRecords, but no World, Agent, Grid, Field, Graph, Edge, Random, Input, Agenda, History or framework-handle records. Validate the discriminator and the entire reachable graph before constructing a loaded value.

No World is manufactured for data roots. state is the caller extra state or an empty object record. Each modelId is a nonempty opaque string unique among the corresponding component/field/edge identities in the snapshot. World components may reference only Agent/Grid/Graph/Input/Agenda records, once per component; no component belongs to two Worlds. The numeric WorldRecord.tick stores world.tick.value as finite nonnegative model time, including fractional values from explicit world.tick.advance; do not round it or require a safe integer.

Snapshots taken after world.tick.reset() legitimately have tick zero while an independently retained Agenda or History has a later recorded time. World random must resolve to RandomRecord. Ownership is derived from components, never duplicated in a mutable owner field. Every managed relation is validated against the final graph before allocation. Grid fields references must be complete, unique, in x-fastest order and reciprocally match grid/index; coordinates derive from index rather than a second source of truth.

Field/Agent/Edge state must reference plain object records and validate only the documented reserved library names and supported-value rules. All application-defined properties, including nested data, belong to that same state record; no separate presentation or metadata record is interpreted by the library.

Agent position has exactly dimensions entries in x/y[/z] order, all finite and in its active context; XY basis must have right.z=forward.z=0 with canonical heading. The 3D right/forward vectors must be unit length and perpendicular within absolute tolerance 1e−10; up derives as right×forward. Validation normalizes only this tolerance-sized drift and rejects larger disagreement. Travel source is an array record whose coordinates equal the stored validated point snapshot; next is the next waypoint index in [0,points.length], with points nonempty.

Null context means unbounded movement; a nonnull context must match the active World space when present. Store partially traversed position in position; progress needs no second floating distance counter. The source path is retained even if reachable only through travel, enabling continued identity-based calls on restored model data.

Graph nodes reference object or framework records (including Field/Agent/Edge where the declared graph node type permits them), preserving the original node identities. Edge graph/from/to reciprocity, membership, direction, simple uniqueness, loop policy, key policy and geometry continuity all validate. nextKey is a nonnegative safe integer strictly beyond every automatically assigned decimal key; deleted keys are not reused. edgeDefaults supplies the direct-state template for future creation; it does not replace each edge's captured state.

A path must reference an array of supported same-dimensional positions. tieMode defaults are not guessed on decode: every edge record explicitly states none/free/fixed. Active ties derive parent from from and child from to, independent of edge traversal direction. Over all declared graphs validate a forest, at most one parent per child, no loop or cycle, living Agent endpoints of matching dimensions and value-equivalent selected contexts, and common World ownership or all-detached status. Include every tied Agent and owning graph root or reject save; no hidden external relation is traversed.

Restored ties become active only after complete graph allocation/validation. Graph.copy deliberately resets tieMode to none, while storage.load preserves it. In-memory assignment of new World membership must move a complete tied tree together as one validated batch. Captured Graph views are unsupported owning roots; save the source Graph or an explicit copy.

Mulberry word is a uint32; MT words has exactly 624 uint32 entries, not all zero, and index is an integer in [0,624]. Algorithm tags must agree. Gaussian is null when unavailable or a finite cached normal value; MT revision 2 is the target continuation schema and old revision 1 imports only an empty cache. Seed remains valid initial/reseed metadata for the selected profile. Input bindings are ordered and unique by target/property; targets must resolve to declared framework components or supported plain object records with a writable matching own scalar property.

Snapshot validation does not silently clamp a currently directly assigned model value; restoration preserves such a value, while future input.set still applies its recorded constraints. This preserves native direct assignment independently of external exposure.

Agenda events are ordered by at, priority and sequence; event IDs and sequences are unique nonnegative integer allocations, sequence &lt; nextSequence, with at ≥ time. event data uses the supported value graph. No callback is stored. History keys null implies an empty never-started/emptied history with lastTick null; otherwise keys are unique and lastTick is the last accepted finite nonnegative tick. Samples are increasing ticks, at most capacity, each values array matching keys exactly, and latest retained tick equals lastTick when nonempty.

A handle's localId may name an event deleted since the handle was issued; restoring it preserves the documented no-op deletion behavior, but it must be a prior allocated ID of the correct owner. An arbitrary forged ID is invalid.

The compatibility object contains validated legacy-import provenance, not a model declaration API. New models store their ordinary Map/record breed metadata in explicitly captured extra state. The compatibility object is null when no imported compatibility declarations exist; otherwise it is the exact inline schema above. Each membership triple contains Agent/Edge reference, declared breed name (empty string denotes the unbred base population) and nonnegative safe integer numeric compatibility ID.

IDs are unique within turtles or links, counters exceed every historical assigned ID, and membership endpoints resolve inside the captured World/registered graphs. Own-variable and breed names are unique nonempty strings under compatibility declaration rules. Variables themselves remain direct state; no dynamically scoped activation frame, myself reference, running callback or local-randomness scope can be captured. Save during those scopes rejects. Restoration preserves declarations, numeric ordering IDs and future allocation counters for explicitly rebound TS procedures, never NetLogo code.

<a id="limits-api"></a>

## limits

<a id="public-resource-limits"></a>

### Readable resource budgets

```ts
limits.netlogo = {
  declarations: 1000, creation: 1000000, valueDepth: 32, valueNodes: 100000,
  randomIterations: 1000000
};
limits.geojson = {
  textBytes: 8388608, features: 10000, positions: 100000, polygonPositions: 2048,
  coordinateMagnitude: 1000000000, propertyDepth: 32, propertyNodes: 100000
};
limits.compatibilityNetwork = { nodes: 1024, edges: 32768, idLength: 256 };
limits.behaviorspace = {
  textBytes: 1048576, depth: 8, elements: 20000, entityReferences: 100000,
  experiments: 100, metrics: 32, sourceLength: 65536
};
limits.study = {
  axes: 32, parameters: 128, name: 128, string: 65536, scenarios: 10000,
  runs: 10000, steps: 1000000, totalSteps: 10000000, totalSamples: 1000000
};
```

```ts
interface LegacyNetworkData { readonly directed:boolean; readonly nodes:readonly string[]; readonly edges:readonly {readonly from:string;readonly to:string}[] }
storage.decode(text:string, options:{format:"legacy-network-json"}):LegacyNetworkData
storage.decode(data:unknown, options:{format:"legacy-network-data"}):LegacyNetworkData
```

**Behavior and errors**

The root export limits is one deeply frozen data object; the assignment notation above describes its readable fields, not writable configuration. Reading budgets invokes no allocation, callbacks, model clock or RNG.

Counts are hard ceilings for their explicitly named bounded adapters, not targets to fill. netlogo applies to the pinned compatibility declaration/creation/value/distribution operations. geojson applies to planar dataset parsing/writing and containment. compatibilityNetwork retains the bounded simple-network import/validation profile: request it explicitly with storage.decode(text,{format:"legacy-network-json"}) or storage.decode(data,{format:"legacy-network-data"}); it does not impose a 1024-node cap on all live Graph models. behaviorspace applies to the finite-data XML parser including subexperiment records; study bounds materialized plans and completed-step/sample budgets.

Lower caller caps may be supplied only where an operation documents them; higher caps reject. No resource value silently changes algorithm semantics or validates model science.

The legacy-simple network profile accepts unique nonempty string node IDs of at most 256 UTF-16 units, simple homogeneous directed or undirected unweighted edges, no loops/parallel pairs, at most 1024 nodes and 32768 edges. Validate endpoints, direction and complete shape, then return a detached canonical copy sorted by code-unit node ID and endpoint order. Both prior typed validation and unknown-data canonicalization map to this single boundary; malformed types throw TypeError and domain/count violations RangeError. General graph-json follows the richer Graph interchange contract and is a separate format.
