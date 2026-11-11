# Repository structure

Status: **accepted by the owner on 2026-11-11** as the target structure. No files have moved yet; the [migration order](#migration-order) applies. The final section, [analyses compared](#analyses-compared), is the record of how the decision was reached. Terms follow the [status legend](README.md#status-legend).

This page owns folders, import rules and the migration order. Independent analyses by Opus 5.5 and GPT-6 Astra informed it, and both reached the same core result. The conceptual layers that these folders hold are described in [layers and API](layers-and-api.md#layers); the design principles are in [principles](principles.md).

## Principles behind the structure

- **The core is autonomous.** No core module imports another core module, not even for types. Each module provides basic functions on its own.
- **One aggregating folder.** Shared semantics that cannot be duplicated without breaking invariants live in exactly one place, `world-composition/`. Examples are canonical identity, deletion propagation, World membership and the tick. Further aggregating code is avoided.
- **Autonomy over sharing.** Prefer a little more readable code to links between modules, because links make maintenance hard. Only small, stable helpers may be duplicated.
- **Systems build on the core.** City subsystems and generative design import only the public core entry, never each other.
- **No folders in advance.** A folder is created with its first working slice. There are no tiers, no mirrored test or docs trees and no empty placeholders.

## Target tree

```text
index.ts  package.json                   public names stay unchanged

library-core/                            autonomous: NO module imports another
├── agent/
├── agenda/
├── continuous/
├── execution/
├── geometry/                            spatial types, distance, direction, bounds
├── polygon-layout/                      planar polygons and layout topology
│                                        (today geometry/planar + grid/topology;
│                                        removes the geometry ↔ grid cycle)
├── graph/
├── grid/
├── random/
├── stats/
├── measurement-and-history/             today measurement/ + storage/
├── world-composition/                   the ONLY aggregating folder:
│                                        identity and lifecycle, supported state copying,
│                                        World, activation, run/tick,
│                                        grid occupancy, studies
└── development/                         build tools, not runtime code

library-city/                            created with the first subsystem
├── economy/                             each subsystem imports only "city-library",
├── energy-supply/                       never another subsystem
├── public-transport/
├── pedestrians/
├── material-cycles/
└── politics/

library-generative-design/               later; headless; imports only "city-library"
ui-web/                                  today's ui/: components, views, Agent Lab, later game UI
ui-3d/                                   later; Three.js presentation
models/<slug>/model.ts + ui.ts           flat; each model covers one small test case
tests/                                   flat + public-contracts/ ui/ targets/
                                         import-boundaries.test.ts
                                         duplicated-helpers.test.ts
docs/
```

**Folder names in the core** match their public export: `agent`, `grid`, `graph`, `agenda` and so on. Only new folders without an API name of their own get longer, descriptive names: `polygon-layout`, `measurement-and-history` and `world-composition`.

The city subsystem names are examples of expected subsystems. Each one appears only with its first working slice.

## Import rules

| Folder | May import |
|---|---|
| `library-core/<module>/` | Only its own files. No other core module, including types. |
| `library-core/world-composition/` | Core modules and its own files. |
| `index.ts` | Core modules and `world-composition`. |
| `library-city/<subsystem>/`, `library-generative-design/` | Only `"city-library"`. |
| `ui-web/` | Only public APIs. |
| `ui-3d/` | Only public APIs, generative-design description types and `three`. |
| `models/` | Everything public. |
| `tests/`, `library-core/development/` | What they check or build. Runtime code never imports them. |

`tests/import-boundaries.test.ts` enforces this table by parsing import paths.

## Duplication rule

- **Only small, stable helpers may be copied.** Examples are option validation and finite-number checks.
- **Coordinate types need no copies.** They are declared structurally where needed.
- **Complex semantics are never duplicated.** Supported state copying, identity and geometric predicates stay single-owned.
- **Each copy carries an identifier.** `tests/duplicated-helpers.test.ts` runs every copy against shared conformance cases: error messages, boundary values and check order. CI rejects unregistered copies.

## Consequences

- **Public classes are composed.** `Agent`, `Grid` and `Graph` from `index.ts` are the versions composed in `world-composition`. Their kernels receive narrow capabilities, such as identity or deletion participation, and no universal services object. Users see no change; internally this is the largest rebuild.
- **The lifecycle invariants stay single-owned.** These include:
  - one ID authority;
  - canonical recognition across domains;
  - validated deletion before commit;
  - batch-validated World admission;
  - World-owned tick and reentry protection.
- **Randomness keeps its exact draw order and continuation.**

## Migration order

1. Freeze every root export, signature and executable assertion.
2. Add `import-boundaries.test.ts` and `duplicated-helpers.test.ts` against today's layout.
3. Remove incidental coupling first, mainly the option validation in `agent/state.ts`.
4. Move lifecycle and state copying intact to `world-composition`. Introduce narrow capabilities one domain at a time.
5. Split out `polygon-layout`, and move the cross-domain adapters (grid occupancy, layout merge, studies).
6. Rename and move folders last: `library/` → `library-core/`, `ui/` → `ui-web/`. Update consumers and path records together.

The NetLogo archive decision ([refactoring](refactoring.md#options-for-the-historical-material), [open question 1](roadmap.md#open-questions)) should come before folder moves, so that frozen evidence is not churned twice.

## Analyses compared

Record of the analyses behind the accepted decision.

| Question | Opus 5.5 | GPT-6 Astra | Decision |
|---|---|---|---|
| Tiers in the core | drop | drop | dropped |
| Lifecycle sharing | byte-identical copies in each module, with a global symbol registry | one composition folder, capabilities passed in | composition folder: no hidden globals |
| Aggregating folder | `world/`, including studies | `library/composition/`, including World, occupancy and studies | `world-composition/` |
| City location | `city/` at top level | `library/city/` | `library-city/`, the owner's preference |
| Models | flat `models/` | flat `models/` | flat |
| Measurement and storage | merge | keep separate | merge |
