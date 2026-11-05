# Agent Loom specification

Agent Loom defines City Library's general modeling core: agents, worlds, spatial operations, graphs, randomness, events, experiments and storage. It is part of City Library, not a separate engine.

**Status:** specification only. The repository has a Bun/TypeScript scaffold and prepared source directories, but no implemented public APIs or published package. All signatures and examples describe the phase-one target.

## Read the API

- [API inventory](api-table.md): all 309 operation/type entries in 16 areas, with exact signatures and compact contracts.
- [API reference](api-reference.md): detailed behavior, defaults, validation, errors and examples.
- [Architecture](../DESIGN.md): state ownership, dependencies, domain layout and extension rules.
- [Work plan](../../PLAN.md): delivery order and acceptance criteria.

## Scope

| Area | Purpose |
| --- | --- |
| World | Membership, tick and synchronous execution |
| Agent | Typed model data, lifecycle, movement and perception |
| Grid / Field | Square/cubic cells, field values, neighborhoods and diffusion |
| Graph / Node / Edge | Connections, traversal, routing, analysis and network generation |
| Random | Explicit streams, distributions, sampling and continuation |
| Input | Validated edits to existing scalar properties |
| stats / geometry | Pure measurements and spatial calculations |
| Agenda | Explicit event queues with their own time cursor |
| experiments | Independent runs, study design, evaluation and continuation |
| storage | Snapshots, formats, validation and bounded observation history |
| limits | Resource ceilings for named operations and adapters |
| Exports and shared types | Public entry contracts and structural TypeScript types |

These groups cover all 16 inventory areas; Field, Node and Edge have individual inventory sections. Advanced algorithms, compatibility profiles, codecs and continuation are included in phase one. Hexagonal grids are a future extension.

## Reading conventions

The inventory and reference jointly define the required signatures and behavior. Implementation proceeds in small working slices; an entry remains planned until its public API, example and behavior checks are delivered. Conflicting or unspecified contracts must be resolved explicitly before implementation.

Examples retain the specification's `agent-loom`, `agent-loom/storage` and `agent-loom/experiments/node` import paths. Their mapping to City Library package entries is unresolved. They are not installation instructions. Serialization identifiers and compatibility versions are also part of the specified contracts.

The specification originates from [city_game at revision 08b3efb](https://github.com/dweigend/city_game/tree/08b3efb66d0f93d023f0b1deb762578552f7b819/docs/agent-loom). It is maintained here as Markdown; the original HTML is available in Git history.
