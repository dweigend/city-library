# Refactoring

Status: mixed. The [inventory](#inventory-where-the-history-lives) (2026-11-10) and [work at risk](#work-at-risk) (2026-11-11) are **input**: recorded findings, not decisions. All other sections are **proposals**. Terms follow the [status legend](README.md#status-legend).

This page owns history cleanup, neutral core naming, the lighter process and migration risks. Open questions are collected in the [roadmap](roadmap.md#open-questions) (questions 1, 2, 8 and 15).

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

**Proposal: A + C.** The [structure's migration order](structure.md#migration-order) asks for this decision before any folder move, so that frozen evidence is not churned twice.

## Neutral core naming

Under the principle that the core says nothing about applications:

- **Parcel → polygon.** Decided 2026-11-11: `ParcelShape` becomes `PlanarPolygonShape` and the internal parcel-input naming becomes polygon naming, as recorded in the [naming migration contracts](../../PLAN.md#naming-migration-contracts).
- **Package name.** `city-library` names the whole library. The core entry should stay application-neutral, as the [naming conventions](../NAMING_CONVENTIONS.md#language-and-vocabulary) now require: the core is called "core". (Historical note: the specification first used the working title "Agent Loom" for it; that name survives only in the folder `docs/agent-loom/`, historical records and frozen evidence.) Candidate split: the root entry is the core, and systems get subpaths. The specification currently applies "no entries; systems import the root"; see [open question 3](roadmap.md#open-questions).
- **Source-flavored names** such as `activate`/`select` and the Salabim-style classes are neutral enough to keep; `report` was folded into `activate` on 2026-11-11. Other names should be reviewed only in the context of a concrete system.

## Lighter process

The current per-slice process produces a lot of evidence: ledgers, receipts, reviews and browser records. Proposals:

- **Keep:**
  - the example-first gate, with 4–5 asserted public scripts per expansion;
  - behavior tests and `bun run typecheck`;
  - independent reviews for substantial design.
- **Drop for city systems:** source audits, scientific baseline comparison, provenance receipts and the original 309-entry core inventory as binding scope. That inventory is now part of the whole-system [API specification](../agent-loom/README.md) with 450 entries, each marked delivered, target or planned.
- **Simplify** `docs/development/` and `docs/execution-studies/` to current guides once the history is archived.

## Migration boundaries

Every refactoring step keeps what is already accepted. These rules come from binding documents and are listed here only as a checklist:

- Preserve behavior, executable assertions, identity, ordering and random sequences; migrate names and consumers together ([PLAN naming migration contracts](../../PLAN.md#naming-migration-contracts)).
- Fix implementations, never weaken examples ([example-first gate](../../PLAN.md#example-first-delivery-gate)).
- Follow the accepted [migration order](structure.md#migration-order).
- When old documents or branches are merged, adapt "Agent Loom" wording to "core" without implying any new acceptance.

## Work at risk

Input: read-only worktree survey of 2026-11-11 against the local `origin/main` (42a28978), without fetching.

| Rank | Work | Where | Risk |
| --- | --- | --- | --- |
| 1 | 15 city teaching models, their tests, UI evidence and research documents: **764 uncommitted files** | Worktree branch `t3/city-simulation-models` | Highest: nothing is committed or merged |
| 2 | 2 uncommitted UI files (automatic session initialization, removed manual step buttons) | Worktree branch `t3/tailscale-remote-server` | Uncommitted |
| 3 | Unpushed documentation commits, including these evolution pages | This branch, `t3/explore-city-library` | Unpushed |
| 4 | Unpublished commits on `docs/example-first-contracts`, `docs/model-research-integration` and `t3/repair-browser-evidence-doc` | Branches without a worktree, 219–518 commits behind | Unpublished, stale base |

Other worktrees listed in the survey are integrated into `main`. The local main checkout was 17 commits behind `origin/main`.

**Conflict risks:**

- The city-models worktree and this branch both touch PLAN.md and `docs/ui/api-reference.md`.
- The old example-first branches change PLAN.md from a base about 219 commits old.

**What must travel with the city models:**

- They are synthetic teaching models; inputs are not calibrated.
- Access to their sources was limited; the research document records what was actually read.
- Each model needs a visible intervention and observation.
- The model mechanism is separate from scientific calibration.
- 15 separate models are not a coupled city.
- Evidence from their revision 2 travels together with its limits. Revision 1 recorded no pre-implementation hashes for air and noise.

Securing this work is [open question 15](roadmap.md#open-questions). [docs/development/integration-status.md](../development/integration-status.md) gives earlier criteria for open evidence and API coverage; it is a historical snapshot.
