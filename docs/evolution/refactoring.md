# Refactoring

Status: brainstorming. This page records the inventory of 2026-11-10 and proposals that have not been decided.

## Goal

Remove the historical references to NetLogo, Mesa, Salabim and other source projects, and build the repository around the city. Agent-based modeling remains the conceptual basis of the core.

## Inventory: where the history lives

The library code itself is clean:

- `library/` and `index.ts` contain no references to NetLogo, Mesa, Salabim, `turtle`, `ask` or `sourceMarker`.
- Some API names echo their source projects:
  - `World.activate`, `report` and `select` (Mesa);
  - `Agenda`, `ServiceQueue`, `Resource`, `Store`, `Signal` and `TimeWeighted` (Salabim).
- `ui/palette/indexed-palette.ts` names the NetLogo Web engine as the origin of its colors.

Most of the repository is parity and evidence material, roughly 60 of 85 MB:

| Area | Size |
| --- | --- |
| `models/catalog/`: ledger, research dossiers, acceptance records, reference sources | ~1,000 files, 30 MB |
| Per-model `evidence/`, `*.nlogox`, `NOTICE.md`, `research.json`, source markers | ~23 MB |
| `docs/execution-studies/` and `docs/development/`: receipts, contracts, browser evidence | ~21 MB |

**Models:**
- 125 are adapted from NetLogo. 21 of them are city-relevant: the Urban Suite (11), traffic and transport (8), and `fire` and `percolation`.
- 26 are original:
  - 15 city models, such as `household-budget`, `neighborhood-heat`, `zoning-scenario-comparison`, `stormwater-retention` and `solar-battery-microgrid`;
  - 11 discrete-event city models, such as `des-emergency-dispatch`, `des-waste-collection` and `des-bus-interchange`.

**Dependencies that block removal today:**
- `bun run check` runs tests over the catalog ledger, `inventory.json`, `.nlogox` sources and the migration receipts (`check:migration`).
- `docs/NAMING_CONVENTIONS.md` forbids changing source records and frozen bytes. That rule must be amended first.
- `PLAN.md`, `docs/development/model-acceptance.md` ("NetLogo is the functional baseline"), `README.md`, `docs/ARCHITECTURE.md`, `docs/README.md` and `CROSS-TRACK-CONTRACTS.md` carry source-tied acceptance rules.

**Stale items:**
- `tests/targets/giant-component/` imports `models/giant-component/model.ts`, which does not exist.
- The giant-component `SHA256SUMS` lists retired paths.
- `.github/workflows/check.yml` still triggers on the branch `experiment/netlogo-web-catalog`.

**Licensing.** Some NetLogo sources are CC BY-NC-SA, which forbids commercial use, and the repository has no root license file. Adapted non-commercial models in the same package are a risk for a library that may end up in commercial games. This needs its own decision.

## Options for the historical material

| Option | Description |
| --- | --- |
| A. Archive | Move the adapted NetLogo models and the catalog to a separate archive repository or a tag such as `netlogo-archive`. The main repository keeps the core, the 26 original models and new city systems. This is the cleanest cut, including for licensing. |
| B. Separate in place | Move them to `lab/netlogo/`, outside `check` and the package, with no acceptance duty. |
| C. Rebuild selectively | Rebuild the ideas of the 21 city-relevant models as original, simplified city models of our own design, not copies. |

**Proposal: A + C.**

## Neutral core naming

Under the principle that the core says nothing about applications:

- **Parcel → polygon.** `ParcelShape` is exported from `index.ts`, with internals in `library/geometry/planar/parcel-input.ts`, `merge.ts`, `split.ts`, `area.ts` and `validation.ts`. A neutral candidate is `PolygonShape`. This is a public rename and needs a naming-migration decision.
- **Package name.** `city-library` names the whole construction kit. The core entry should stay application-neutral; the specification's earlier name for the core, "Agent Loom", was neutral. Candidate split: the root entry is the core, and systems get subpaths.
- **Source-flavored names** such as `activate`/`report`/`select` and the Salabim-style classes are neutral enough to keep. They should be reviewed only in the context of a concrete system.

## Lighter process

The current per-slice process produces a lot of evidence: ledgers, receipts, reviews and browser records. Proposals:

- **Keep:**
  - the example-first gate, with 4–5 asserted public scripts per expansion;
  - behavior tests and `bun run typecheck`;
  - independent reviews for substantial design.
- **Drop for city systems:** source audits, scientific baseline comparison, provenance receipts and the 309-entry Agent Loom inventory as binding scope.
- **Simplify** `docs/development/` and `docs/execution-studies/` to current guides once the history is archived.
