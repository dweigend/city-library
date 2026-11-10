# Roadmap

Status: brainstorming. None of these slices is approved. Each one would follow the example-first gate: freeze 4–5 asserted public scripts before any runtime work.

## Proposed sequence

| Order | Slice | Content | Example scripts (ideas) |
| --- | --- | --- | --- |
| 0 | Decide the direction | Accept the [principles](principles.md); update ARCHITECTURE and PLAN to the layer model | — |
| 1 | Clean up history | Archive the NetLogo material (option A); amend the source-record rule; fix the stale targets and CI trigger; settle licensing | — |
| 2 | Neutral core | Rename Parcel → polygon; decide package entries for systems | Existing assertions keep passing under the new names |
| 3 | First city slice | Tile map, roads with route search, zones, growth, budget | Build and zone, including rejected commands; growth from demand; budget and bankruptcy; one system tested in isolation; a seeded run reproduced exactly |
| 4 | Traffic with cohort agents | Commuting over the road graph, load and congestion, `scale` | Same trend at `scale: 1` and `scale: 50`; congestion lowers desirability; visible cars taken from cohorts |
| 5 | Coverage and explanation | Power and service coverage, residential/commercial/industrial demand, explaining a tile's values | A tile explains why it does not grow |
| 6 | Game contracts | Commands as data, save/load, change feed, state hash, replay | Save at tick 60, load, same hash; replay of the command log; change feed reports only changed tiles |

Order 1 and 2 are independent of 3 and can run in parallel. The original city models can serve as test beds for the new systems:

- `household-budget` for the economy system;
- `neighborhood-heat` for fields;
- `zoning-scenario-comparison` for zones.

## Rule for growth

A new capability starts inside one system. It moves into the core only when a second system needs it, and only under a neutral name.

## Open questions

1. Which archive option? A, B or C, or a combination (A + C proposed).
2. How to handle licensing, and whether to add a root license.
3. Package entries: subpaths such as `city-library/city`, or separate packages?
4. Does the economy system work without the city system, using any agents?
5. Command pattern: typed handle methods that record plain command objects? How do commands map onto `model.ts` actions?
6. Tick semantics for city systems: one tick is one game day by default?
7. How much of the Agent Lab and `defineUI` changes when city systems need map views, such as tile layers or road overlays?
8. Which parts of the existing process stay mandatory for city systems?
