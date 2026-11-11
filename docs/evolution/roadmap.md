# Roadmap

Status: mixed. The [phase sequence](#phase-sequence) was **set by the owner** on 2026-11-10. The [work items](#phase-12-work-items) and their order are **proposals**. [Existing experiments](#existing-experiments) and the [guiding questions](#guiding-questions-from-old-branches-input) are **input**. Terms follow the [status legend](README.md#status-legend).

This page owns the sequence, the work items and the **one list of open questions** for the evolution pages. Every library expansion follows PLAN's [example-first gate](../../PLAN.md#example-first-delivery-gate): freeze 4–5 asserted public scripts before any runtime work.

## Phase sequence

Set by owner, 2026-11-10. PLAN records it under "Accepted direction and target structure".

| Phase | Focus | Result |
| --- | --- | --- |
| 1. Library logic and experiments | Headless logic comes first. The test UI (Agent Lab) is used to build further experiments. | Each experiment is a `model.ts` + `ui.ts` pair, like today's models, and covers **one small test case** of a library capability. |
| 2. Build the city library step by step | Improve, sharpen and, where needed, extend the core. Add city and economy systems one capability at a time. | A basic set of tested logic: core plus first systems, each proven by small experiments. |
| 3. First game prototypes | Only after phase 2 has a basic set: first game prototypes and first 3D graphics. | Games consume the library through public APIs; rendering stays outside the library. |
| Separate track: generative 3D design | Generative architecture and design logic, such as buildings, clusters, quarters and envelopes, is developed **separately**, so that everything stays clearly separated. | Its own development line. It may use the neutral core, but it is not part of the simulation logic. The accepted [structure](structure.md#target-tree) places it in `library-generative-design/` in this repository. |

## Phase 1–2 work items

Proposal. Order 1 and 2 are independent of the rest and can run in parallel. The API specification already lists planned entries for several items; the last column links them.

| Order | Work item | Content | Experiments (one small test case each) | State |
| --- | --- | --- | --- | --- |
| 0 | Decide the direction | Accept the [principles](principles.md); update ARCHITECTURE and PLAN to the layer model and the phase sequence | — | Partly done: principles set; PLAN records the sequence; ARCHITECTURE, PLAN and [concepts](../concepts.md) record the structure and layers |
| 1 | Clean up history | Archive the NetLogo material ([option A](refactoring.md#options-for-the-historical-material)); amend the source-record rule; fix the stale targets and CI trigger; settle licensing | — | Open; see [refactoring](refactoring.md) |
| 2 | Neutral core | Rename Parcel → polygon; decide the package entries for systems | Existing assertions keep passing under the new names | Open; both are specification [open decisions](../agent-loom/api-table.md#open-decisions) |
| 3 | Sharpen the core | Route search on `Graph`, numeric layers over grids, neutral flood fill and reachability, selection weights that consume no randomness, as concrete needs appear | A route avoids a blocked edge; a flood fill finds an enclosed area; weights stay stable for the same inputs | Specified as target/planned entries; selection weights currently need no new API |
| 4 | First city capabilities | Roads as a graph, zones, growth with visible blocking reasons, capacity allocation with a visible remainder, supply per connected component | Growth is blocked without road access and explains why; two supply networks share no capacity; unassigned households are reported | Supply planned as `EnergySupply`; roads, zones and growth have no subsystem folder yet |
| 5 | First economy capabilities | Budget with integer money, atomic transfers, simple resource flows; later an order matcher | A failed transfer leaves all balances unchanged; bankruptcy after three negative months | Budget planned as `Budget` |
| 6 | Cohort agents | Commuting cohorts over the road graph, load and congestion, `scale` | The same trend at `scale: 1` and `scale: 50` | Planned as `PublicTransport`; remainder rule open |
| 7 | Game contracts | Commands as data, save/load with a state inventory, change feed, state hash, replay | Save, load, then the same hash; a rejected command changes nothing | `CommandResult` and `storage.hash` planned; command data and change feed open |

Commands may need to move earlier: if player input is not modeled as data from the first city capability on, it is expensive to retrofit.

The growth of each capability follows the [rule for growth](principles.md#rule-for-growth).

## Existing experiments

Input. These models can serve as test beds for the new systems:

- **Original city models in this repository:**
  - `household-budget` for the economy system;
  - `neighborhood-heat` for fields;
  - `zoning-scenario-comparison` for zones.
- **15 city teaching models** in the worktree branch `t3/city-simulation-models`, built 2026-11-10/11. They cover population, housing, land use, daily activities, mobility, employment, services, energy, water, stormwater, heat, air and noise, biodiversity, material cycles and municipal finance. Each has a headless model, an Agent Lab UI and four frozen public contract scripts. They follow the [model pattern](principles.md#model-pattern).
  - They are **uncommitted**; see [work at risk](refactoring.md#work-at-risk).
  - They are **not coupled**: 15 separate models are not one city simulation, and they share no city state.
  - There is no accessibility audit yet. Minor display limits remain, such as overlapping zero series and decimal separators.

## Open questions

The single list for the evolution pages. Q1–Q10 keep their original numbers because other documents cite them; numbers are identifiers, not priorities. API-level choices are not repeated here: the specification lists 18 [open decisions](../agent-loom/api-table.md#open-decisions) with the default it applies and the alternative.

### Direction and history

- **Q1.** Which archive option for the historical material: A, B or C, or a combination? A + C is proposed; see [refactoring](refactoring.md#options-for-the-historical-material).
- **Q2.** How to handle licensing, and whether to add a root license.
- **Q8.** Which parts of the existing process stay mandatory for city systems? See [lighter process](refactoring.md#lighter-process).
- **Q15.** When is the uncommitted city-models work secured, and how is it merged with this branch? See [work at risk](refactoring.md#work-at-risk).

### Package and API

- **Q3.** Package entries: subpaths such as `city-library/city`, or separate packages? The specification applies "no entries; systems import the root" ("Package entries for systems").
- **Q5.** Command pattern: typed handle methods that record plain command objects? How do commands map onto `model.ts` actions? The specification plans only `CommandResult` ("Command data").
- **Q16.** Which remainder rule do cohort agents use? Three variants are listed under [cohort agents](layers-and-api.md#cohort-agents); the specification applies "last cohort carries the remainder" ("Cohort remainders").

### City and economy systems

- **Q4.** Does the economy system work without the city system, using any agents? The specification's planned `Budget` assumes yes: it "works with any agents, not only inside a city".
- **Q6.** Tick semantics for city systems: is one tick one game day by default? [Simplification rule 3](principles.md#simplification-rules) proposes yes.
- **Q11.** Are clusters only design groups of buildings, or do they also carry shared services and game rules? (from [cherry-picks](cherry-picks.md))
- **Q12.** Should replacing an occupied object be rejected by default at first, or does the first game already need explicit relocation? (from cherry-picks)
- **Q13.** Do the order matcher and transfers belong in the first economy capability, or are a budget and simple resource flows enough? (from cherry-picks)
- **Q17.** How do the 15 city teaching models relate to the phases: are they phase-1 experiments, phase-2 test beds for city systems, or both? Which of their mechanisms, if any, become system capabilities?
- **Q18.** When and how are separate models coupled into one city simulation with shared city state?

### Models and UI

- **Q7.** How much of Agent Lab and `defineUI` must change when city experiments need map views, such as tile layers or road overlays?
- **Q19.** Should Agent Lab be renamed to a descriptive name such as "Model Lab"? The [naming conventions](../NAMING_CONVENTIONS.md#language-and-vocabulary) keep "Agent Lab" until a replacement is decided together with its UI and code.
- **Q20.** Should the live-action rule of the 15 models (explicit `undefined` throws) become the rule for all models? See [rules learned in review](principles.md#rules-learned-in-review).

### Generative design

- **Q9.** **Generation inside the library:** PLAN currently holds a Generation area (house, quarter, corridor/subtraction/subdivision; rows 5 and 8). Does planar parcel and quarter generation stay in the library, or does it move to the separate generative-design track? Which neutral geometry stays in the core?
- **Q10.** ~~Where does the generative-design track live: its own repository, its own package, or `city_game`?~~ **Resolved** by the accepted [structure](structure.md) (2026-11-11): `library-generative-design/` in this repository, importing only `"city-library"`. PLAN records the same.
- **Q14.** Which generator results need persistent identity, and which stay descriptions that can be recomputed at any time? (from cherry-picks)

## Guiding questions from old branches (input)

Two unmerged branches hold guiding material: `docs/model-research-integration` adds `docs/development/example-first/RESEARCH-INTEGRATION.md`, and `docs/example-first-contracts` adds the example scripts `examples/city-simulation/04-scarce-resource.ts` (last resource unit, explicit priority) and `05-shared-machine.ts` (reservation versus consumption, repair order). The document asks seven semantic questions for each new model brief. It calls them "a reasoning checklist, not a required read/decide/resolve/apply framework". They are inputs for future example-first contracts, not decided APIs:

| Topic | Question (summarized from the source) |
| --- | --- |
| Authority and boundary | Who owns each fact, in which units and system boundary? Derive availability from stock and reservations instead of competing writable copies. |
| Identity and meaning | Does an operation change a quantity, ownership, temporary access, an assignment or a condition? |
| Read state and order | Do decisions see the current or a chosen old state? Is activation fixed, shuffled, staged or synchronous? Which `Random` stream is used? |
| Joint feasibility | Can all accepted requests be fulfilled together? Name the conflict rule, for example an explicit priority for the last resource unit. |
| Transition and time | When does a promise become a reservation, consumption, arrival or completion? Define same-time ordering, for example of repair completion and a new request. |
| Rejection, cancellation and failure | An expected rejection leaves state unchanged. Cancellation after consumption needs explicit consequences. |
| Observation and comparison | When are measurements taken? Observation never consumes randomness or changes state. |

The worktree survey of 2026-11-11 also lists stale selection, that is, acting on a choice whose target has changed, as a question raised there. Both branches are about 219 commits behind `origin/main` and change PLAN.md; see [work at risk](refactoring.md#work-at-risk).
