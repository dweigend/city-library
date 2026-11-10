# Layers and API

Status: brainstorming. This page holds proposals, not delivered APIs. All names are placeholders until example scripts freeze them.

## Layers

```text
Models and games     models/<slug>/model.ts + ui.ts, your application
        ↓ use
Systems              city, economy, … (domain vocabulary, simplified rules)
        ↓ use
Core                 neutral building blocks: agents, world, random, grid, graph,
                     geometry, agenda, stats, measurements, storage, studies
```

- Dependencies point downward only. The core knows no systems; systems know no models or UI.
- Every system has its own entry point. Candidates: `city-library/city` and `city-library/economy`. PLAN requires an explicit contract for every new package subpath.
- A developer can use any layer directly, so a model may combine a city system with plain core calls.

## Script style

Standard TypeScript, plain functions and options objects with defaults. A model stays the usual `model.ts`:

```ts
import { Random } from "city-library";                       // core, neutral
import { createTileMap, createRoads } from "city-library/city";
import { createBudget } from "city-library/economy";

export const model = {
  title: "Little Town",
  inputs: { seed: 7, taxRate: 0.09 },
  create(input) {
    const random = Random.create({ seed: input.seed });
    const map    = createTileMap({ size: 32 });
    const roads  = createRoads({ map });                       // defaults
    const budget = createBudget({ money: 20_000, taxRate: input.taxRate });

    return {
      buildRoad: (from, to) => roads.build(from, to),          // action
      advance(stepCount = 1) {
        for (let i = 0; i < stepCount; i++) {
          roads.update();
          budget.collect({ residents: map.count("residential") });
        }
      },
      read: () => ({ money: budget.money, roads: roads.count }),
    };
  },
};
```

`ui.ts` stays as it is today: `defineUI(model, …)` with controls, monitors and views.

### Progressive disclosure

- Handles are the real objects, not wrappers. For example, a road network exposes its core `Graph` directly.
- To change one part, a developer replaces that call. They can pass an own function as an option, or write that part with core calls; the rest of the model stays unchanged.

### Commands

Player input should become plain, serializable objects, so that replays and saved games are possible. A suggested pattern is typed methods on handles that create such objects internally. For example, `roads.build(from, to)` records `{ type: "road.build", from, to }`. The details remain open.

## Cohort agents

Agent-based modeling stays the conceptual basis, without the cost of one object per person. A **cohort agent** carries a weight: how many people, trips or households it represents. There is one rule and one code path; only the resolution changes.

```ts
const traffic = createTraffic({ roads, scale: 100 });
// scale 1   → each person is one agent (true ABM, small maps)
// scale 100 → one agent stands for 100 commuters (large city, fast)
```

| System | Cohort agent |
| --- | --- |
| Traffic | Travels its route and adds its weight to each road's load. With a large weight this equals an aggregate flow model. |
| Economy | A household cohort books income, rent and taxes as flows. |
| Growth | Buildings are individual objects anyway. |

Limits that keep it simple:

1. `scale` is fixed at setup. Splitting and merging cohorts at runtime, for example when zooming in, is deferred until a game needs it.
2. A different `scale` gives a different run and hash. Replays require the same `scale`, so it belongs in the saved state.
3. Weights are integers. Remainders are distributed with the system's own `Random` stream.
4. Pure fields such as heat, pollution or land value stay `Grid` fields. Not everything has to be an agent.

**Test idea:** the same scenario with `scale: 1` and `scale: 50` must agree in trend. This makes "derived from ABM" checkable.

**Display:** a few visible cars or residents can be taken directly from real cohort agents instead of being invented cosmetically.

The weight is an ordinary property inside a system. The core needs no cohort concept.

## Engine contracts for games

Ranked by necessity for a first game slice. All names are neutral and none are delivered.

1. **Commands.** Player changes are plain serializable objects that a model action validates. A rejected command returns a reason and changes nothing.
2. **Determinism.** One named `Random` stream per system, a fixed call order, integer money, and a state hash for tests.
3. **Change feed.** Renderers ask what changed since a revision, instead of copying the whole state with every `read()`.
4. **Save and load.** A versioned snapshot holding system state and `Random` state, with derived data recomputed on load. `Random` already supports a full state and continuation, which is a starting point.
5. **Replay.** A snapshot plus the command log. It comes almost free once 1, 2 and 4 exist.

## Gaps in the core today

- No route search (A*) on `Graph`. Distances use exact `bigint` costs, which suit analysis but are too slow to call every tick.
- Agents and grid cells are separate objects, so large maps need numeric layers backed by typed arrays.
- No snapshots, no change tracking and no state hash.
- No shared tick ordering; each model's `advance()` defines it, which fits the principles.

## Deliberately not planned

- An ECS framework, a plugin registry or a generic event bus
- One agent per citizen as the default
- Vehicle or lane physics, real units, GIS or OSM import
- Multiplayer, networking, worker threads
- Rendering, cameras or editors in the library
- A scripting DSL
