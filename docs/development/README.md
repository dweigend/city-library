# Checks and development records

This folder holds maintainer material: check commands, binding technical contracts, migration receipts and acceptance records. For learning and building, start at the [documentation overview](../README.md).

## Check the repository

Run these from the repository root:

| Command | What it checks |
| --- | --- |
| `bun run typecheck` | TypeScript and Svelte across supported source, models and tests (root `tsconfig.json`) |
| `bun run check` | Regular gate: types, tests, migration integrity, public contracts, library build and packed consumer |
| `bun run build` | Headless package and declarations |
| `bun run consumer` | Packed package with Bun, Node ESM and an ambient-free TypeScript consumer |
| `bun run build:ui` | Model Lab production build |
| `bun models/catalog/progress.ts verify` | Model catalog ledger |

Two frozen targets stay outside the green gate on purpose: the generative-quarter script needs corridor, subtraction and subdivision APIs, and Giant Component needs its model implementation. `bun run typecheck:city:targets` and `bun run typecheck:giant-component:targets` expose those missing contracts; `bun run typecheck:targets` requires both to pass. Keep their asserted scripts unchanged while implementing the missing capabilities.

[Models and public contract tests](examples-migration.md) explains where models, contract scripts and unmet targets live and how the contract commands select them.

## Keep records

Keep in Git: public usage, accepted contracts, executable-example manifests, delivery coverage, source/license provenance and short acceptance/review summaries. Retain open limitations and distinguish independent approval from author remediation.

Detailed agent handoffs, command transcripts, browser logs and screenshots are local working artifacts. Store new ones under `.local/development-archive/` (ignored by Git), outside this documentation tree. That archive is not available in a fresh clone and is not a backup. Portable historical summaries, source records and review evidence live with the [model catalog](../../models/catalog/README.md); its location map resolves relocated records and pins removed historical detail to Git revisions.

The pinned reference sources, notices and reference-comparison records under `models/catalog/reference-sources/` remain versioned provenance. Target UI screenshots are disposable verification artifacts.

Do not replace versioned contracts or provenance with links into a local archive. Record relevant checks, dates, scope, findings and unresolved limits in a short portable summary. New check results must come from executed checks; documentation cleanup does not revalidate historical runtime behavior.

## Historical paths

Frozen review records, receipts and pinned revision URLs keep the paths they recorded. Read them with this map; [document-path-migration.json](document-path-migration.json) is the machine-readable part used by the catalog ledger.

| Historical path | Current document |
| --- | --- |
| `docs/grid-parcels/TOWNSCAPER-CONTRACT.md` | [QUAD-LAYOUTS-CONTRACT.md](../grid-parcels/QUAD-LAYOUTS-CONTRACT.md) |
| `docs/grid-parcels/TOWNSCAPER-VERIFICATION.md` | [QUAD-LAYOUTS-VERIFICATION.md](../grid-parcels/QUAD-LAYOUTS-VERIFICATION.md) |
| `docs/development/netlogo-model-acceptance.md` | [model-acceptance.md](model-acceptance.md) |
| `docs/mesa-expansion/` | [docs/execution-studies/](../execution-studies/STATUS.md) |
| `src/grid/topology/` | [library/grid/topology/](../../library/grid/topology/index.ts) |
| `tests/townscaper-grid.test.ts`, `tests/townscaper-grid-types.ts` | [quad-layouts.test.ts](../../tests/quad-layouts.test.ts), [quad-layouts-types.ts](../../tests/quad-layouts-types.ts) |

The finished working pages `docs/development/continuation-plan.md`, `docs/development/integration-status.md` and `docs/evolution/consolidation-plan.md` were removed; their last text is in Git at revision `e60294d1`. Screenshot and `/tmp/` paths in the execution-study browser records name local capture files that were never tracked.
