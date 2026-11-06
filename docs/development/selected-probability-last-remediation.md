# B17 final-five canonical-state remediation

Date: 2026-11-06. This record supersedes the ownership and implementation descriptions in `selected-probability-last-contract.md` for the five models below. The original contract/evidence remains retained as historical evidence. Source XML, notices, exact selected identities, frozen examples, source phase rules and scientific dossiers are unchanged. No independent approval is claimed. Fresh browser evidence belongs to the coordinator.

## Canonical state and public composition

| Model | Canonical state | Public operations replacing local infrastructure |
| --- | --- | --- |
| Expected Value | Real eager wrapped15×15 `Grid`;225 canonical `Field` values/selections; one actual sampler `Agent` attached to the spatial `World`; sole `World.tick` | `Grid.fieldAt`, `Grid.neighbors(...,{neighborhood:"faces"})`, `Agent.move`, `Agent.rotate`, `World.tick.advance` |
| Central Limit Theorem | Real eager wrapped31×31 `Grid`;961 canonical patch-background Fields; actual Person Agents owned only by the spatial `World`; sole `World.tick` | `World.add`, `Agent.delete`, `Grid.fieldAt`, `Grid.agentsAt`, public Random sampling, `World.tick.reset/advance`; sample deviation delegates to root-owned `stats.describe(values,{sample:true}).standardDeviation` |
| Mandelbrot | Real eager hard301×301 `Grid` with all90601 canonical Fields initialized at Setup; actual moving Turtle Agents in the spatial `World`; sole `World.tick` | `Grid.fieldAt`, `Grid.agentsAt`, `Agent.move`, `Agent.rotate`, `Agent.distanceTo`, `World.tick.advance` |
| Partition Permutation Distribution | Nonspatial `World` with sole `World.tick`; numeric accepted-addend/trial histories remain ordinary model records | `World.tick.advance` between candidate update and `finishUp`, preserving source tick timing and preflight budget stops |
| Random Combinations and Permutations | Nonspatial `World` with sole `World.tick`; symbolic original/guess arrays and trial histories | Source search never advances `World.tick`; attempts remain a separate scientific trial counter |

All five instances expose readonly `world` getters; the three spatial instances also expose readonly `grid` getters for canonical ownership checks and ordinary public authoring. Their UI continues consuming detached `read()` DTOs and calling existing model actions. No adapter mutations, generic engine, private geometry module, private occupancy index, or replacement grid is introduced. A cached `grid.fields` list contains references to canonical Fields, never copies of their live state.

Expected Value retains its grouped initialization, neighbor-swap mixing, randomly chosen starting patch, local walk, repeated selections, initial zero total and setup-frozen sample size. The sampler's public movement handles wrapping; the former hand-written `at`, `wrap`, `neighbors4`, direction trigonometry and manual position are removed. Fields are traversed in the original print-out order for setup. Different public neighbor iteration/rotation numerics can change seeded trajectories; matched NetLogo seeds were never promised, and the coordinator must refresh target evidence.

CLT owns no `Person[]` population. The typed `people()` accessor reads canonical `World.agents`; new people are actual Agents, and Setup deletes those Agents, retaining the canonical Grid and resetting its clock. Column drawing checks actual `Grid.agentsAt` occupancy. Selected flags and positions live on Agents; patch backgrounds live on Fields. The local generic standard-deviation function is removed. Missing sample deviations from the public statistics contract map explicitly to the existing null/N/A observation, without a parallel calculation. Sampling still stops before a tick when population is insufficient, and successful samples tick before recording sums and means.

Mandelbrot owns no private Map grid or manual Turtle positions/headings. Setup eagerly initializes all Fields' complex constants and zero iteration state. A temporary Set deduplicates currently occupied canonical Field references for the source eligibility snapshot; actual occupants come from `Grid.agentsAt`. This is per-step query composition, not a persistent occupancy authority. Eligible turtles are snapshotted before any patch update, preserving multiple increments of a shared patch and possible overshoot of the nominal115 limit. Movement, wiggle, climb and final tick retain their source phase order. Every source `ask turtles` phase (eligible calculation, step, wiggle and climb) separately randomizes its full phase population through public Random sampling; a coordinator review finding about ordered step/climb loops was corrected before the final measurements below. The sparse `read().patches` display projection includes computed canonical Fields; it does not imply lazy model state. The full90601 Fields exist through the public Grid even with zero turtles or no computed pixels.

Partition's scalar clock is removed. Numeric histories represent addends/series rather than spatial agents, so they appropriately remain arrays. The signed-bound draw behavior fixed at468c902 remains unchanged, including rejected trials and source ticks after live target reductions.

Combination values are static symbolic choices, not a moving spatial population. Board x/y records are derived display coordinates of these values; no World Agents or Grid are manufactured for static icons. Search progress remains `attempts`/sample counters, while the public World clock remains0 exactly as source. Other configuration, matching and history behavior remains unchanged.

## Identity and snapshot boundary

Canonical `Agent.id` and `Field.id` are library-issued, globally unique identities. Runtime membership, occupancy, patch lookup and movement always use canonical objects and public methods. Read DTO `id` strings retain their existing deterministic source/display label syntax: source person/turtle indices, tile print-out indices, patch coordinate labels and symbolic board labels. These DTO labels are not identity registries and are never used to resolve canonical membership. This preserves pure, deterministic observations across independently created seeded experiments despite different global library IDs.

## Mandelbrot hard-boundary composition

The delivered public `Agent.move` clips hard boundaries, whereas source `step` preflights movement and relocates a turtle if the unit step is impossible; source `jump` leaves the turtle unmoved if the whole jump is impossible. No delivered endpoint/preflight primitive exists. The coordinator explicitly chose composition through existing public methods rather than a geometry expansion or detached ghost Agents.

Within the named source procedures only, retain one temporary `{x,y}` starting point, call the canonical Agent's public `move`, measure the traveled length with public `distanceTo`, and restore using public absolute `move` when clipping prevented the requested distance. `step` then performs the source random relocation; `climb` leaves the restored position unchanged. The source positive-edge exclusion (`x/y >=150.5`) is checked after movement, so reaching the exact positive endpoint does not become a valid source step merely because the library hard Space admits that endpoint. The negative endpoint remains valid. Length comparison uses absolute tolerance1e−10 for the unit step and1e−10×max(1,throw) for jumps to distinguish clipping from floating-point rotation error. Differences smaller than that tolerance remain an explicit numerical limit.

Temporary attempt/restore has no asynchronous yield or snapshot callback. It creates no extra Agent or identity and leaves occupancy fully owned by the library. Canonical movement notifications may update the library's derived occupancy during the attempt; final queries see the restored or relocated Agent. Tests cover clipped jumps, clipped unit steps, exact positive-edge rejection, and final occupancy. No hand-written destination, trigonometric displacement, wrapping function, or local spatial index is used.

## Executed evidence

The worker ran these checks before root statistics integration:

- `bun run typecheck`: currently blocked only by missing root-owned `stats.describe` at the two CLT observation calls (TS2339). No private statistics fallback was introduced.
- Final non-CLT remediation subset:13 passed,0 failed,5 filtered,101 assertions (after source activation-order remediation).
- The included Mandelbrot preflight test verifies deterministic relocation at both clipped and exact-positive-edge endpoints through public Random continuation.

Full focused suite, frozen examples and final typecheck must run after the root statistics delivery. The coordinator owns broader checks and fresh browser evidence. The source-independent Argon review remains pending under the existing availability blocker.

## Actual eager-grid timing

Single Bun1.4.2 process measurements, seed17, on the configured workspace host. Mandelbrot values below are from the final randomized-step/climb activation schedule, remeasured after the coordinator finding; the earlier provisional timing was not reused. Values are observed timings, not a cross-host guarantee or a controlled benchmark. No fallback grid, reduced resolution or reduced default turtle count was used.

| Operation | Observed result |
| --- | --- |
| Mandelbrot Setup,301×301 Fields,1500 actual Agents |280.0ms |
| Mandelbrot first step, including initial canonical occupancy setup |92.6ms |
| Mandelbrot next9 steps |277.4ms total |
| Mandelbrot tick10 detached snapshot |33.9ms |
| Mandelbrot tick10 state |13403 computed Fields;14896 accumulated patch iterations |
| Mandelbrot process resident memory after snapshot |181305344bytes |
| Expected Value Setup,225 Fields and1 sampler |78.5ms |
| Expected Value100 sample steps |23.1ms |
| CLT empty Setup,961 Fields |7.3ms |
| CLT create random population, seed17 |10.2ms;360 actual Agents |
| CLT100 sample steps |37.7ms |

Mandelbrot timing was measured around direct `create({seed:17})`, `advance()`, `advance(9)`, and `read()` using `performance.now()` in one `bun -e` command. The other measurements used their direct public model factories/actions and checked actual `grid.fields.length`, `world.agents.length` and `world.tick.value`. Eager initialization has a real setup/memory cost, now measured rather than replaced by private sparse domain state.
