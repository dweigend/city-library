# Design and source register

Updated: 3 November 2026. This register preserves context for the new repository without making a local checkout or private conversation a requirement for ordinary library consumers. Current decisions are written locally in [DESIGN.md](DESIGN.md); the [plan](../PLAN.md) owns priorities.

## Source families

The source project is [city_game](https://github.com/dweigend/city_game). Preparation was inspected locally at revision `59f05d1766e1775c6d5efaada96c605862cab3ec`; its source inventory pins algorithms to baseline `4290d1a26713070e65ffcf8904cdc611322bcca8`. The preparation revision was not available at a verified public commit URL, so it is recorded as an identifier rather than a broken hyperlink.

Optional author-checkout root: `/home/david/Projekte/city_game`. Paths below are relative to that root. These are evidence locators, not runtime imports, installation steps or copying approval.

| Area | Principal source families | What the evidence does not establish |
| --- | --- | --- |
| A01 Buildings | `prototype/docs/experiments/volume-houses/` volume/stack/hybrid plans; `town-painter/`; `infrastructure-atlas/` WFC/cohesion/townscape plans; matching experiment core/tests | One universal generator contract, inferred use/capacity, structural soundness or pure geometry matching every renderer |
| A02 Grids/fields | `prototype/docs/experiments/grid-lab/PLAN.md`; Volume Houses cell systems; `netlogo-ts` topology/diffusion; simulation handover | Detached field behavior merely because the old World has patches |
| A03 Agent execution | `netlogo-ts` core, quality/expansion/roadmap documentation; later Agent Loom design discussion | Current City Library exports or complete NetLogo language compatibility |
| A04 Landscape/parcels | Grid Lab streets/junctions/layout; Atlas terrain; spatial handover; TestFit design material | General terrain generation, robust polygon operations or regulatory compliance |
| A05 Routes/traffic | City Flow routing/movement; NetLogo transport/graph domains; Atlas mobility connections | All routes have geometry, all connections are accessible, or congestion and hop routing are equivalent |
| A06 Households/economy | City Flow urban agents/economy/resources; NetLogo society/urban domains and selected demo models | Calibrated behavior, interchangeable arbitrary economic systems or atomic settlement from matching alone |
| A07 Supply | Atlas services/system plans; City Flow urban utilities; utility handover dossier | Physical electrical, hydraulic or scientifically calibrated supply simulation |
| A08 Feasibility | `testfit-ts/PLAN.md`, `Architektur.md`, `docs/FEATURES.md`, research and logbook | A delivered feasibility solver; the package source is a scaffold |
| A09 Data/studies | NetLogo analytics/experiments/model authoring; consumer handover; later storage design | Arbitrary exact resume, published codec support or UI definitions in engine data |

`docs/library-handover/RECEIPT.md`, `RECONCILIATION.md`, `CATALOG.md`, `COVERAGE.csv` and `FUNCTIONS.csv` retain the detailed preparation. The frozen inventory accounts for 59 experiment directories. The 147 selected catalog entries are operation groups and gaps, not 147 delivered functions. Planned and implemented source families remain distinct. Reuse requires selecting and checking an exact source closure and its provenance/notices.

## Newer decisions and reconciliation

The later Agent Loom API discussion selected native collections, direct properties, optional Space/grid, explicit assembly and the world-owned tick object. It then removed built-in Drawing/appearance/UI contracts and selected one save/load area. These later choices supersede conflicting historical Group, time, Drawing, clear and capture/restore vocabulary in old preparation snapshots. They do not make the broad API specification an implementation.

Local research reference, when available: `/home/david/.t3/worktrees/city_game/t3-ea6a26d7/docs/agent-loom/api-reference.html`. It is a design document, not a supported runtime dependency. This repository's local decision summary is sufficient to understand the plan without accessing that path. A complete City Library API reference will be authored as operations are accepted and implemented.

The early RNG-first handover proposal was a smallest packaging exercise. The current product milestones emphasize standalone houses and a separate simple agent script, then real variants and a static neighborhood. Introduce RNG only when a selected capability needs it; no old transfer proposal overrides this plan.

## Current architecture research

Official documentation reviewed on 3 November 2026; these references motivate the organization, not adoption of their frameworks.

- [D3 overview](https://d3js.org/what-is-d3) and [module index](https://d3js.org/api) describe independently usable modules and composition. Inference: expose tools and larger combinations without forcing every user through a complete engine.
- [Houdini digital assets](https://www.sidefx.com/docs/houdini/assets/index.html) describes reusable tools built from existing networks. Inference: kits should compose the same operations available to authors, with explicit inputs and dependencies.
- [Microsoft domain analysis](https://learn.microsoft.com/en-us/azure/architecture/microservices/model/domain-analysis) explains boundaries around relevant domain models. Inference: use recognizable work areas and agreed handoffs, without importing microservice deployment architecture.
- [Mesa overview](https://mesa.readthedocs.io/stable/overview.html), [Bevy ECS](https://docs.rs/bevy_ecs/latest/bevy_ecs/) and [NetworkX introduction](https://networkx.org/documentation/stable/reference/introduction.html) illustrate separate model/runtime, spatial and graph responsibilities. Inference: runtime ownership, optional spatial structures and detached algorithms are separate concerns. ECS is not required by this project.

## Collaboration and limits

Three independent research agents examined domain boundaries, toolkit composition and runtime/data boundaries. A separate source-project coordinator assembled current plans into the nine concrete areas adopted here. Abstract technical roles remain secondary labels rather than the main navigation. This is a reviewed planning synthesis, not performance evidence or semantic acceptance of every source algorithm.

The README and its diagram remain unchanged by this planning revision. No engine functions, UI, dependency adoption, empty source-module stubs or technical setup commands are added. External library candidates, exact artifact compatibility and complete checkpoints remain explicit future decisions.

## Verification of this planning revision

A separate read-only agent reviewed the actual nine-area plan against the README, current scaffold and local decisions. No blocking contradiction or missing central domain was found. One P3 planning ambiguity was corrected: A08's scenario/constraint contract is accepted separately from later solver implementation. This correction is an author response, not a new independent approval.

Executed checks: `bun run typecheck`, Markdown local-file links, balanced code fences, diff whitespace and byte-level comparison of README, public entry and configuration against `1dfeaf2`. No engine implementation, dependency installation, build/test pipeline or browser change was performed. External-source accessibility was not rechecked by the final reviewer.
