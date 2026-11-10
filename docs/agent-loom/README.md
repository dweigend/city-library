# Agent Loom specification

Agent Loom defines City Library's modeling core: agents, worlds, spatial operations, graphs, randomness, events, studies and storage.

Describe individuals, their space and their interactions without choosing a renderer. Use the parts separately: a graph does not need a World, and an agent model does not need a grid.

The specification defines the required core API. Implemented subsets cover agents, randomness, spatial operations, grids, graphs, geometry and statistics. Use the [work plan](../../PLAN.md), public exports and runnable examples to check availability. The package is not published.

## Read the API

- [API inventory](api-table.md): all 309 operation/type entries in 16 areas, with exact signatures and compact contracts.
- [API reference](api-reference.md): detailed behavior, defaults, validation, errors and examples.
- [Architecture](../ARCHITECTURE.md): state ownership, dependencies, domain layout and extension rules.
- [Work plan](../../PLAN.md): next goals and acceptance criteria.
- [Binding terminology](terminology.md): shared names and semantic distinctions across the system.

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
| studies | Independent runs, study design, evaluation and continuation |
| storage | Snapshots, formats, validation and bounded observation history |
| limits | Resource ceilings for named operations and adapters |
| Exports and shared types | Public entry contracts and structural TypeScript types |

These groups cover all 16 inventory areas; Field, Node and Edge have individual inventory sections. Advanced algorithms, compatibility profiles, codecs and continuation are included in the required core scope. Hexagonal grids are a future extension.

## Reading conventions

The inventory and reference define the required signatures and behavior. An entry remains planned until its public API, example and behavior checks are delivered. Conflicting or unspecified contracts must be resolved explicitly before implementation.

Examples retain the specification's `agent-loom`, `agent-loom/storage` and `agent-loom/studies/node` import paths. The current root package is `city-library`; storage and Node experiment subpath mappings remain unresolved. The delivered bounded History subset is currently available as root `city-library` export `storage`; this does not add a storage subpath or full snapshot implementation. They are not installation instructions. Serialization identifiers and compatibility versions are also part of the specified contracts.

The specification originates from [city_game at revision 08b3efb](https://github.com/dweigend/city_game/tree/08b3efb66d0f93d023f0b1deb762578552f7b819/docs/agent-loom). This Markdown specification is the maintained source.
