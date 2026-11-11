# Roadmap

Status: the phase sequence was set by the owner; the work items and their order are proposals, not approved. Every library expansion follows the example-first gate: freeze 4–5 asserted public scripts before any runtime work.

## Sequence set by the owner (2026-11-10)

| Phase | Focus | Result |
| --- | --- | --- |
| 1. Library logic and experiments | Headless logic comes first. The test UI (Agent Lab) is used to build further experiments. | Each experiment is a `model.ts` + `ui.ts` pair, like today's models, and covers **one small test case** of a library capability. |
| 2. Build the city library step by step | Improve, sharpen and, where needed, extend the core. Add city and economy systems one capability at a time. | A basic set of tested logic: core plus first systems, each proven by small experiments. |
| 3. First game prototypes | Only after phase 2 has a basic set: first game prototypes and first 3D graphics. | Games consume the library through public APIs; rendering stays outside the library. |
| Separate track: generative 3D design | Generative architecture and design logic, such as buildings, clusters, quarters and envelopes, is developed **separately**, so that everything stays clearly separated. | Its own development line. It may use the neutral core, but it is not part of the simulation logic. |

## Phase 1–2 work items

Order 1 and 2 are independent of the rest and can run in parallel.

| Order | Work item | Content | Experiments (ideas, one small test case each) |
| --- | --- | --- | --- |
| 0 | Decide the direction | Accept the [principles](principles.md); update ARCHITECTURE and PLAN to the layer model and the phase sequence | — |
| 1 | Clean up history | Archive the NetLogo material (option A); amend the source-record rule; fix the stale targets and CI trigger; settle licensing | — |
| 2 | Neutral core | Rename Parcel → polygon; decide the package entries for systems | Existing assertions keep passing under the new names |
| 3 | Sharpen the core | Route search on `Graph`, numeric layers over grids, neutral flood fill and reachability, selection weights that consume no randomness, as concrete needs appear | A route avoids a blocked edge; a flood fill finds an enclosed area; weights stay stable for the same inputs |
| 4 | First city capabilities | Roads as a graph, zones, growth with visible blocking reasons, capacity allocation with a visible remainder, supply per connected component | Growth is blocked without road access and explains why; two supply networks share no capacity; unassigned households are reported |
| 5 | First economy capabilities | Budget with integer money, atomic transfers, simple resource flows; later an order matcher | A failed transfer leaves all balances unchanged; bankruptcy after three negative months |
| 6 | Cohort agents | Commuting cohorts over the road graph, load and congestion, `scale` | The same trend at `scale: 1` and `scale: 50` |
| 7 | Game contracts | Commands as data, save/load with a state inventory, change feed, state hash, replay | Save, load, then the same hash; a rejected command changes nothing |

Commands may need to move earlier: if player input is not modeled as data from the first city capability on, it is expensive to retrofit.

The original city models are test beds for the new systems:

- `household-budget` for the economy system;
- `neighborhood-heat` for fields;
- `zoning-scenario-comparison` for zones.

## Rule for growth

A new capability starts inside one system. It moves into the core only when a second system needs it, and only under a neutral name.

## Open questions

1. Which archive option: A, B or C, or a combination? (A + C proposed.)
2. How to handle licensing, and whether to add a root license.
3. Package entries: subpaths such as `city-library/city`, or separate packages?
4. Does the economy system work without the city system, using any agents?
5. Command pattern: typed handle methods that record plain command objects? How do commands map onto `model.ts` actions?
6. Tick semantics for city systems: is one tick one game day by default?
7. How much of Agent Lab and `defineUI` must change when city experiments need map views, such as tile layers or road overlays?
8. Which parts of the existing process stay mandatory for city systems?
9. **Generation inside the library:** PLAN currently holds a Generation area (house, quarter, corridor/subtraction/subdivision; rows 5 and 8). Does planar parcel and quarter generation stay in the library, or does it move to the separate generative-design track? Which neutral geometry stays in the core?
10. Where does the generative-design track live: its own repository, its own package, or `city_game`?
