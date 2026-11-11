# City Library API specification

This specification covers the whole City Library API. Agent Loom is its headless modeling core: agents, worlds, spatial operations, graphs, randomness, events, studies and storage. Further areas cover the remaining core exports, city systems, UI authoring and the model contract.

Describe individuals, their space and their interactions without choosing a renderer. Use the parts separately: a graph does not need a World, and an agent model does not need a grid.

This specification is the target: it defines the required API, including much that is not built yet. Every inventory entry states its status:

| Status | Meaning |
| --- | --- |
| delivered | Exported today by `index.ts` or `ui/index.ts`. Not a parity or acceptance claim. |
| target | Specified contract without a public export. |
| planned | Proposed addition, not yet accepted; it must pass the [example-first gate](../../PLAN.md#example-first-delivery-gate). |

[What works today](../development/coverage.md) tracks verification; public exports and runnable examples decide availability. The package is not published.

## Read the API

- [API inventory](api-table.md): all 450 operation/type entries in 25 areas (293 delivered, 141 target, 16 planned), with exact signatures, compact contracts, a status per entry, a target folder per area and the [open decisions](api-table.md#open-decisions). The original 309 Agent Loom entries keep their numbers; the three formerly unanchored headings are now anchored, and new entries are `api-380` to `api-517`.
- [API reference](api-reference.md): detailed behavior, defaults, validation, errors and examples.
- [UI API](../ui/README.md): the detailed owner of the UI authoring contract; the inventory links its UI IDs.
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
| topology / continuous / twoPhase / measurements | Delivered core exports outside the original inventory: finite layouts, linear progression, compute/commit updates and measurement projections |
| Budget / EnergySupply / PublicTransport | Planned `library-city` systems: integer budgets, supply per network component and trip cohorts with congestion |
| UI authoring | `defineUI` and the view data types of `ui/index.ts`; details in [docs/ui](../ui/README.md) |
| Model contract | `model.ts` + `ui.ts`, `ModelInstance` and the model input descriptors |

These groups cover all 25 inventory areas; Field, Node and Edge have individual inventory sections. Pedestrians, material cycles, politics and library-generative-design have no entries yet: their folders exist only in the [target structure](../evolution/structure.md). Advanced algorithms, compatibility profiles, codecs and continuation are included in the required core scope. The regular Grid contract stays square/cubic. Finite hexagonal and authored planar layouts are available separately through the additive [layout API](../grid-parcels/STATUS.md); wrapping, volume and irregular-diffusion layouts remain future extensions.

## Reading conventions

The inventory and reference define the required signatures and behavior. A target or planned entry is not available until its public API, example and behavior checks are delivered. Conflicting or unspecified contracts must be resolved explicitly before implementation.

Examples retain the specification's `agent-loom`, `agent-loom/storage` and `agent-loom/studies/node` import paths. The current root package is `city-library`; storage and Node experiment subpath mappings remain unresolved. The delivered bounded History subset is currently available as root `city-library` export `storage`; this does not add a storage subpath or full snapshot implementation. They are not installation instructions. Serialization identifiers and compatibility versions are also part of the specified contracts.

The specification originates from [city_game at revision 08b3efb](https://github.com/dweigend/city_game/tree/08b3efb66d0f93d023f0b1deb762578552f7b819/docs/agent-loom). This Markdown specification is the maintained source.

The folder name `docs/agent-loom` is historical: it now holds the specification of the whole City Library, not only the Agent Loom core. It is kept so that existing links stay valid.
