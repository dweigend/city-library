# Working instructions

## Start here

Read [README.md](README.md) and [PLAN.md](PLAN.md) before making changes. Verify the actual checkout, branch, Git status, and task scope. Preserve concurrent work and stage only owned files. Discuss work in German; write repository documentation, code, filenames, comments, and commits in English.

This repository is currently a scaffold. Proposed APIs are not available exports. Read the applicable accepted contract before implementing a capability; do not infer implementation from a README example or an older source experiment.

## Design from the author task

Begin with the smallest useful public script. Identify required inputs, invariants, outputs, state ownership, and failure behavior before choosing code. Evaluate local reuse, external dependencies, and focused new implementation. Adopt existing algorithms only when they satisfy the intended contract; retain provenance and meaningful behavioral differences.

Use strict TypeScript and the existing Bun workflow. Prefer ordinary functions, typed properties, arrays, and explicit composition. Add abstractions only for a demonstrated modeling need. Keep module imports acyclic and expose intentional public interfaces. Kits use those same public interfaces and caller-owned execution state.

## Keep logic independent

The engine owns model logic, domain geometry, identity, relationships, and execution. It must not import DOM, rendering libraries, application code, or the source checkout. No built-in colors, symbols, drawing commands, labels, cameras, widgets, or appearance defaults. Custom model properties remain ordinary data without implicit presentation effects.

Grids and spatial context are optional. Static generators and detached calculations must not require a simulation World unless their responsibility genuinely requires live state. Binding generated descriptions creates canonical live objects; consumers must not maintain duplicate mutable state. The model owns execution order; kits must not start hidden clocks.

Use the latest approved authoring vocabulary consistently. Agent Loom references guide API design but do not establish delivered City Library exports. Older preparation records may contain superseded Group, Drawing, appearance, or clock syntax. Identify conflicts explicitly rather than copying them.

## Verify and document

Run `bun run typecheck` for relevant changes. As implementation arrives, add focused behavioral tests, public-import checks, builds, and downstream consumer checks appropriate to the slice. Never report a proposed example as executed or an existing source test as a target result. Document units, defaults, mutations, errors, determinism boundaries, and lifecycle semantics.

Use independent reviews for substantial design and migration work when authorized. Record findings and distinguish author corrections from independent approval. Browser-facing applications need real-browser behavior checks and separate visual decisions; headless tests do not establish visual quality.

Keep all documentation in English with relative repository links where practical. Separate overview, API reference, tutorials, decisions, and provenance. Prefer complete, checked examples for delivered APIs and clearly label design sketches. Do not add secrets, generated dependencies, or machine-specific credentials to Git.
