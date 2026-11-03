# Working instructions

## Read and preserve

Read [README.md](README.md), [PLAN.md](PLAN.md) and [docs/DESIGN.md](docs/DESIGN.md). Consult the design document’s source notes when evaluating old code or conflicting vocabulary. Check actual branch/status and preserve concurrent work. Discuss work in German; write code, documentation, filenames, comments and commits in English.

PLAN owns current progress and sequencing. DESIGN owns local design direction. Neither examples nor old source experiments prove implemented exports. Update actual status only with target evidence. Keep the README and approved diagram stable unless the task changes them.

## Build one useful capability

Start with the author task, minimal public script, invariants, inputs/results, units, ownership and failures. Compare exact local reuse, external candidates and focused new work. Retain source revisions, adaptations and notices. Do not transfer unrelated UI/tests or import the old checkout at runtime.

Use strict TypeScript and the existing Bun workflow. Prefer ordinary functions, direct typed properties, native collections and explicit composition. Keep dependencies acyclic and public exports deliberate. Add only files and abstractions needed by a real slice; no empty module stubs or all-purpose managers. The six areas are Simulation, Spatial Structures, Graphs, Generation, City Models, and Data & Experiments. They coordinate tasks, not mandatory packages or initialization layers. Agent Loom is design lineage within Simulation, not a second engine. Keep graph tools independently usable without spatial coordinates or World.

## Keep ownership and boundaries clear

The engine owns logic, domain geometry, state and execution. Presentation, DOM, rendering libraries, Drawing, cameras, widgets and appearance defaults stay outside it. User-defined properties such as name, color or symbol remain ordinary data with no automatic display behavior.

Space and grids are optional. Detached generators/calculations do not require World. Binding is explicit; each live value has one owner. Graphs and kits reuse canonical objects. Kits use public operations and caller-owned execution, with no hidden clocks or duplicate occupancy/balances.

Follow locally recorded authoring decisions; do not copy superseded vocabulary from historical references. State any unresolved operation contract instead of inventing an API to fill a gap.

## Verify and document

Run `bun run typecheck` when relevant, plus real behavior/build/public-consumer checks as introduced by the slice. Do not claim unavailable test/build commands passed. Use independently tasked agents for substantial design and transfer reviews when authorized; retain findings and distinguish author fixes from independent approval.

Every delivered capability needs its task, example, inputs/results, units/defaults, mutations/errors, lifecycle, dependencies and evidence. Mark design sketches and source-only results explicitly. Keep references/tutorials/decisions/provenance distinct and repository links portable. Never commit secrets or installed dependencies.

Browser-facing applications require real-browser checks and separate visual decisions; headless library checks establish neither appearance nor scientific validity. Technical setup changes and runtime implementation require their own task scope, not assumptions from a planning table.
