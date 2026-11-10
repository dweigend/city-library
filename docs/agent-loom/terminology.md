# Domain and time semantics

The system-wide [naming conventions](../NAMING_CONVENTIONS.md) own canonical vocabulary and spelling across library code, model APIs, examples, tests, UI and current documentation. The [API inventory](api-table.md) and [API reference](api-reference.md) define exact delivered and target contracts. This page explains distinctions that names must preserve.

## Time and execution

A step is one synchronous model procedure invocation. A successful `run(world, step, stepCount)` step increases the World tick by one; a failed step does not. Tick may also be advanced explicitly and may be fractional. Therefore tick and step are different concepts. The `stepCount` argument counts procedure invocations.

The UI's “1 step”, “10 steps” and “100 steps” actions describe procedure invocations; its Tick monitor describes model time. Input-control `step` describes numeric granularity. A host frame or callback schedules execution and does not itself establish a model-time unit.

Agenda owns a separate event-time cursor. Advancing or resetting World tick does not implicitly advance or rewind Agenda. A composition must define any mapping between these times.

## Domain and presentation

World owns membership and execution. Grid owns Fields, while a rendered cell or geometric cell dimension is a presentation or geometry concept. The public UI `cells` view property and `cellSize` therefore do not introduce a second domain owner.

Graph owns Edges. An existing object may participate as a node without acquiring a mandatory Node superclass. Network remains valid scientific language; Graph names the API structure.

A seed initializes a random stream. It does not describe its complete continuation state. An observation reads detached model data; it does not transfer state ownership to the UI. Setup creates initial model state; reset promises only its explicitly documented restoration contract.

## Contract migration

The naming migration must update public contracts and all consumers together. Existing generator options, execution profiles and serialized representations still have their defined behavior until explicitly migrated. Naming changes do not permit weaker assertions, altered random consumption or fabricated source evidence. Consult the naming conventions for migration and source-record requirements.
