# Cherry-picks from city_game

Status: **input**. Terms follow the [status legend](README.md#status-legend). On 2026-11-10 a research thread (GPT 6.1 Sol with subagents) read the local `city_game` repository without changing it. Prototypes were read, not re-run. Maturity describes the source state; it does not approve anything for adoption.

city-library is the base. `city_game` mostly holds experiments in generative architecture and serves only as a quarry for single ideas. Every pick must be adapted to the [principles](principles.md); no prototype is ported as a template.

Path abbreviations within `city_game`:
- `E/` = `prototype/src/lib/experiments/`
- `H/` = `docs/library-handover/`
- `N/` = `netlogo-ts/src/lib/`

## For phases 1–2: city and economy logic

| Pick | Path | Idea | Maturity | Target layer | Value |
| --- | --- | --- | --- | --- | --- |
| Admission and departure with memory | `E/city-flow/core/urban/agents.ts` | Households need suitable homes and jobs and leave only after lasting dissatisfaction | implemented | city system | high |
| Explainable attractiveness | same | Jobs, supply, green space and services contribute positively; production and commutes negatively; the reasons are returned | implemented | model first, then city system | high |
| Allocation with a visible remainder | `N/domains/urban/allocation.ts` | A deterministic greedy step returns unassigned requests and remaining capacity | implemented | city system | high |
| Supply per connected component | `E/city-flow/core/urban/graph.ts`, `utilities.ts` | Connected consumers share limited capacity; being connected and being supplied are different statements | implemented | city system | high |
| Reachable opportunities | `N/domains/urban/accessibility.ts` | Counts opportunities within a cost threshold and lists them | implemented | city system | high |
| Atomic transfer sequence | `N/domains/society/transfers.ts` | Ordered transfers are checked on detached balances; a failure changes nothing | implemented | economy system (integer money) | high |
| Deterministic order matcher | `N/domains/society/market.ts` | Buy and sell orders matched by price, sequence and id; partial quantities are kept; no booking of money or goods | implemented | economy system | high |
| Selection weights without randomness | `N/domains/urban/choice.ts` | Utilities become stable softmax weights; the random draw happens separately | implemented | core, if missing (neutral name) | medium |
| Planned projects apart from finished capacity, visible blocking reasons | `E/city-flow/core/urban/planning.ts`, `growth.ts`, `rules.ts` | Access, supply and affordable materials decide progress, and the reason for a block is visible | implemented | city system | high |
| Versioned saves with validation | `E/town-painter/core/save.ts` | An invalid save never replaces the current state | implemented (editor only) | save/load pattern | medium |

**Negative finding:** there is no mature logic for land value, disasters or supply chains.

## Already anticipated in city-library

These handover drafts restate rules that city-library already records. They are useful as wording and test cases, not as new direction.

| Draft | Rule | Existing city-library location |
| --- | --- | --- |
| `H/CATALOG.md` X03 | Replacing occupied objects must not silently drop residents or access | PLAN row 8, "Live connection" |
| X04 | An observation snapshot is not resumable state | PLAN row 7; ARCHITECTURE "One storage area, separate guarantees" |
| X02 | Isolated randomness per generation stage | Concepts "Explicit randomness" |
| X01 | Point contact is no street frontage; frontage is no access | PLAN "Spatial Structures" |

## Parked for the separate generative-design track

These picks belong to generative 3D design, not to the simulation library. Neutral helpers they need, such as flood fill or box subtraction, may enter the core only when a library experiment needs them.

| Pick | Path | Idea | Maturity |
| --- | --- | --- | --- |
| Quarters composed from roles | `art/city-composition-v01.md` | Open spaces, quiet groups and focal points first, then buildings | draft |
| Compatible building families | `art/grid-system-v01.md`, `docs/ideas/style-compatibility-v01.md` | Shared reference levels and connections, free silhouettes; envelope, occupancy and clearance kept apart | concept |
| Neighborhood shapes the whole form | `E/infrastructure-atlas/core/architecture/neighborhood.ts`, `envelope.ts` | Occupied neighbors and free roof areas form continuous silhouettes | implemented |
| Reserve paths first | `E/grid-lab/core/urban-layout.ts`, `urban-geometry.ts` | Street and junction areas are reserved before free parcels receive building groups | implemented |
| Growth at a connected front | `E/infrastructure-atlas/core/city.ts`, `architecture/city-layout.ts` | New groups extend a connected front; existing parts stay | implemented |
| Local WFC plus a global check | `E/infrastructure-atlas/core/wfc/solver.ts`, `architecture/connectivity.ts` | Local compatibility is not enough; global reachability is checked as well, with an explicit search budget | implemented |
| Courtyard detection | `docs/town-system-concept/recipes.md` | Free areas without a connection to the outside are courtyard candidates; uses a neutral flood fill | draft |
| Progressive typologies, recursive programme partition, support and infill | `testfit-ts/docs/research/PROGRESSIVE-TYPOLOGIES.md`, `E/recursive-program-partition/`, `E/support-and-infill/` | Building families and bounded subdivision strategies | concept |
| Box subtraction, stable height field | `E/cube-house/core/cube-house.ts`, `E/infrastructure-atlas/core/city.ts` | Bounded volume subtraction; deterministic terrain height | implemented |

The 27 planned experiments and 4 drafts in the `city_game` catalog have descriptions but no executable algorithms. The 31 studies add references and variants, not finished procedures.

## Open questions from the research

The four questions this research raised are now part of the single list in the [roadmap](roadmap.md#open-questions), as questions 11 to 14: clusters and their rules, replacing occupied objects, the scope of the first economy capability, and persistent identity of generator results.

## Related decisions in the API specification

Some picks touch choices the [API specification](../agent-loom/api-table.md#open-decisions) has already defaulted:

| Pick | Specification default |
| --- | --- |
| Selection weights without randomness | No new API: `random.sample(source, { weight })` draws by weight; weight derivation stays a plain function in the system ("Selection weights"). |
| Supply per connected component | Planned as the `EnergySupply` city system. |
| Atomic transfer sequence | Planned `Budget` with integer money. |
| Planned projects, visible blocking reasons | Roads, zones and growth are not proposed yet; no subsystem folder exists ("Roads, zones and growth"). |
