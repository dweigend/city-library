# City Library development plan

## Current status

This is an independent TypeScript city-engine project, currently at scaffold and documentation stage. No procedural generation, simulation, analysis, or storage API has been transferred into this repository. `index.ts` exports no capabilities. The README's API examples are design illustrations, not executable package examples.

The public repository is https://github.com/dweigend/city-library. Bun is the current development environment. The target is a web-oriented headless engine with optional grids, explicit module boundaries, and no built-in presentation behavior.

## Design authority

[README.md](README.md) describes the project goals and public authoring direction. [AGENTS.md](AGENTS.md) defines contributor and coding-agent responsibilities. Adopted operation-level contracts must be recorded beside their future implementation and examples; the overview does not freeze every proposed signature.

The latest Agent Loom design discussion refines the earlier preparation material: native arrays and ordinary properties; optional space and grids; explicit composition; `run(world, step, steps)`; a world-owned `tick` object; and no Drawing or appearance APIs. Its storage direction uses one save/load area for supported model state and selected data. These remain design inputs rather than delivered City Library exports.

## Preparation evidence

The source project is [city_game](https://github.com/dweigend/city_game). Its handover preparation at source revision `59f05d1766e1775c6d5efaada96c605862cab3ec` records baseline inventory, consolidation proposals, external-library research, parameter contracts, function candidates, gaps, and independent reviews. Those preparation documents currently live in the local source checkout; that revision is not available at a verified public GitHub URL. They are historical evidence, not authority over newer approved design decisions.

Local source preparation, when available: `/home/david/Projekte/city_game/docs/library-handover/PLAN.md`. The library must not depend on that checkout at runtime or require it for ordinary consumer setup.

## Implementation sequence

1. Select a bounded first capability and freeze its public use case, provenance, units, failures, and acceptance criteria.
2. Introduce only the geometry/random or other foundations that capability actually requires.
3. Deliver one standalone building-generation example, then a second variant to challenge the shared contract.
4. Compose a static neighborhood from explicit site, layout, and building inputs.
5. Develop simulation lifecycle, identity, graphs, and time through small independent headless models.
6. Connect generated descriptions to canonical live objects and test commuting, capacity, deletion, and regeneration.
7. Add interchangeable domain policies and kits through the same public operations.

Each slice needs scoped tests, strict type checking, deliberate exports, and a downstream consumer check appropriate to its packaging. New external dependencies require exact artifact, license, compatibility, and adaptation decisions. Rendering applications require their own browser and visual evidence.

## Documentation work

The English README is the public project introduction. Keep its work-in-progress notice, implementation status, examples, diagram, and local commands aligned with the actual repository. Keep API references, tutorials, design decisions, and provenance records distinct as they are added. Do not present target documentation as runtime verification.

## Stop boundary

The current documentation task does not implement, transfer, or publish a runtime package. No dependency, benchmark, browser compatibility, scientific validity, or complete model-resume guarantee is accepted by writing these documents.
