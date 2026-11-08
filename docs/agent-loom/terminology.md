# Binding terminology

Use the same names in models, public APIs and the Lab so readers can follow an idea from script to screen. These terms describe different responsibilities; tick and step, for example, must stay distinct.

The [API inventory](api-table.md) and [API reference](api-reference.md) define the vocabulary. This glossary applies to library code, public model APIs, examples, tests, UI labels and current documentation. It does not rename upstream models, source URLs, quoted procedures, compatibility formats or scientific concepts.

| Meaning | Canonical language | Avoid as interchangeable aliases |
| --- | --- | --- |
| General modeling core | Agent Loom | Agent Logic, a second engine |
| Model individual | `Agent`, agent, agents | turtle, turtles |
| Membership and execution owner | `World`, world | environment or simulation as an alternative type name |
| Regular spatial topology | `Grid`, grid | patch grid as an alternative API |
| Grid-owned member and its properties | `Field`, field, fields | patch, patches, a parallel `Cell` type |
| Rendered grid element or geometric cell dimensions | cell, cells | Do not rename the public UI `cells` view property or `cellSize`: these describe presentation or geometry, not another domain owner. |
| Connection topology | `Graph`, graph | network as an alternative API type; network remains a valid scientific/model description |
| Existing object participating in a graph | node | mandatory `Node` superclass |
| Graph-owned connection | `Edge`, edge, edges | link as a parallel graph API; hyperlinks remain links |
| Explicit random stream | `Random`, random stream, seed | seed as a synonym for complete continuation |
| World-owned time value | tick; `world.tick.value` | step number as a parallel counter |
| One synchronous model procedure invocation | step; `step` | tick as a callback name |
| Execute model procedures | `run(world, step, steps)` | renaming the binding `steps` argument to ticks |
| Event queue and its time cursor | `Agenda`, agenda time | World tick, wall-clock time |
| Host scheduling callback | frame or callback | tick, which suggests advancement of model time |
| Initial model creation | setup / initialization | reset when no reset contract exists |
| Read detached model data | observation / `observe()` where defined | state ownership in the UI |

A successful `run` step increases the World tick by one; a failed step does not. Tick may also be advanced explicitly and may be fractional. Therefore **tick and step are not synonyms**. The UI's `1 step`, `10 steps` and `100 steps` actions describe procedure invocations; its Tick monitor describes model time. Input-control `step` describes numeric granularity, not simulation time. Host speed is not a model-time unit.

Domain names such as resident, rabbit, vehicle, bacterium and biological cell are more informative than generic agent and remain valid. `ModelAgent` and `ModelField` may name local specialized types when `Agent` and `Field` are already imported. Mutable partial input objects are `changes`, not spatial fields. Source comments explicitly discussing NetLogo may retain turtles, patches and links so comparisons remain traceable; current local diagnostics and controls use agents, fields and edges.

Naming examples: `numTurtles` → `numAgents`, `hideTurtles()` → `hideAgents()`, observation `turtles` → `agents`, `computedPatches` → `computedFields`, `clearPatches()` → `clearFields()`, `updatePatch(x, y)` → `updateFieldAt(x, y)`. Experimental consumers must migrate together; no second alias API is introduced. The accepted graph-generator option `links` (preferential attachment) and named compatibility profiles remain binding contracts; they are not silently renamed. Scientific titles, experiment slugs and upstream procedure quotations remain unchanged.
