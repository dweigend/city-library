# Current design decisions

Status: target direction, not implemented API. Updated: 3 November 2026. The [work plan](../PLAN.md) owns sequencing and area IDs; [sources](PROVENANCE.md) records where these decisions came from. The README remains the public introduction.

## Organize around author tasks

Use nine recognizable work areas rather than a generic foundation/runtime/consumer hierarchy. Areas coordinate development; they do not prescribe npm packages, folder stubs or mandatory dependencies. Small tools, alternatives and kits are composition sizes within or across those areas.

Start with one useful script and identify its invariants before selecting code. A second real variant tests whether the contract is general enough. Avoid universal building, port, solver or system types that hide different semantics. Similar source names and TypeScript shapes do not prove compatibility.

## Authoring conventions

The Agent Loom design direction supplies ordinary TypeScript, direct typed properties, native arrays/sets/maps, optional space/grids, explicit object composition and simple scripts. Its selected example vocabulary includes `Agent.add(...)`, `World.add(...)`, `world.add(...)` and `run(world, step, steps)`.

The world-owned clock direction is `world.tick.value`, `world.tick.advance(amount?)` and `world.tick.reset()`. Running model steps and changing only the counter are distinct operations. A successful run step increments the counter; a failed step does not imply rollback of earlier mutations. Domain duration and execution speed are separate quantities.

The selected vocabulary uses `Position` and `Space` rather than public `Like`/`Context` aliases for the same concept. Model values stay direct: an energy value is `agent.energy`, not a wrapper with `.value`. The reference direction uses `delete(item)` for targeted removal and `delete()` for removing all contained items where the operation is defined; exact receiver behavior needs its own delivered contract. Do not invent a second lifecycle vocabulary from historical examples.

These names record selected design direction. They are not imports currently exported by City Library, and this page is not a complete signature reference. Operation-level types, errors and examples must be frozen and checked with their implementation. A reference implementation and a broad API design are different evidence.

## Logic only

Keep model state, domain geometry, relationships, physical quantities and execution in the engine. Built-in appearance fields, Drawing/Pen/stamps, styles, cameras, widgets and plot specifications are excluded. Position and orientation remain spatial logic.

Model authors can define a property named `name`, `selected`, `color` or `symbol`; the engine assigns it no display effect or special default. No obligatory `appearance`, `ui`, `metadata` or generic property wrapper is introduced. Applications decide how to display and edit explicitly exposed values.

## Independent capabilities and canonical state

A generator returns a reusable description without requiring World. A geometric grid does not imply a live field system; graph connectivity does not imply a spatial route. Detached algorithms accept the data they need. Runtime registration coordinates identity and lifecycle without becoming a second implementation of those tools.

Binding a description into a live model is explicit. Geometry-only buildings are valid; capacities, occupancy, rents and demand are model policies, not inferred facts. Each live value has one owner. Graphs, households and kits retain canonical references rather than shadow copies.

Composition coordinates a change, runtime manages membership, and the affected domain owns its consequences. Occupied demolition, capacity shrink and removed entrances need explicit decisions. Default behavior must not silently discard residents or reuse stale routes. Freeze a bounded case before designing a universal regeneration framework.

## Time, randomness and observation

The caller-owned model defines execution order. Kits start no hidden clocks or timers. Agenda's event cursor and World tick require explicit unit/cadence rules when combined; do not assume identical meaning.

Random generators are explicit and independently owned. Separate generation and simulation streams. Reproduction includes algorithm/version, inputs, initial state and call order, not seed alone. Querying metrics or rendering does not consume model randomness or advance model time. A recording buffer owns its samples, not simulation state.

## One storage area

Keep one save/load area for the supported data passed to it: selected measurements or declared model state. The intended public names are `storage.save(...)` and `storage.load(...)`. Model state uses a versioned validated default; ordinary selected data may use explicitly supplied encode/decode formats and optional targets.

Loading measurements returns data, not a runnable World. Exact continuation needs a complete declared state inventory, references, RNG state and matching behavior. Custom formats do not bypass validation or magically serialize closures. Large histories require bounded buffering and defined write behavior. Precise signatures and implemented formats remain future contracts.

## Documentation as an engineering interface

Each delivered capability needs a task, complete example, inputs/outputs, units/defaults, state owner, errors, dependency boundaries and tests. Keep API reference, tutorials, current decisions and historical provenance separate. Both developers and LLMs must be able to determine implementation status without guessing from examples.

Independent reviews challenge author assumptions; they do not replace execution or scientific validation. Mark unimplemented gaps and uncertain dependencies explicitly. Build public capabilities only when a real example establishes their need.
