# Layers and API

Status: **proposal**. This page holds proposals, not delivered APIs. Names in sketches are placeholders until example scripts freeze them. The binding inventory with statuses delivered, target and planned is the [API specification](../agent-loom/api-table.md); where a sketch here and the specification differ, the specification's current default applies and the difference is one of its [open decisions](../agent-loom/api-table.md#open-decisions).

This page owns the layer model, the script style and the engine contracts. The design principles behind them are in [principles](principles.md); folders and import rules are in the accepted [structure](structure.md).

## Layers

```text
Models and games     models/<slug>/model.ts + ui.ts, your application
        ↓ use
City systems         economy, energy supply, … (domain vocabulary, simplified rules)
        ↓ use
Core                 neutral building blocks: agents, world, random, grid, graph,
                     geometry, agenda, stats, measurements, storage, studies
```

| Layer | Target folder ([structure](structure.md#target-tree)) | Imports ([rules](structure.md#import-rules)) |
| --- | --- | --- |
| Core | `library-core/<module>/`, aggregated by `world-composition/` | Only its own files |
| City systems | `library-city/<subsystem>/` | Only `"city-library"`, never another subsystem |
| Models and games | `models/<slug>/`, later game code | Everything public |
| Presentation | `ui-web/`, later `ui-3d/` | Only public APIs |

- A developer can use any layer directly, so a model may combine a city system with plain core calls.
- **Package entries are open.** An early proposal gave every system its own subpath, such as `city-library/economy`. The API specification currently applies "no entries; systems import the root". PLAN requires an explicit contract for every new package subpath. See [open question 3](roadmap.md#open-questions).

## Script style

Standard TypeScript, plain functions and options objects with defaults. A model stays the usual `model.ts`. The sketch below is illustrative: its import paths and the `TileMap` and `Roads` systems are not specified anywhere yet.

```ts
import { Random } from "city-library";                       // core, neutral
import { TileMap, Roads } from "city-library/city";          // entry open
import { Budget } from "city-library/economy";               // entry open

export const model = {
  title: "Little Town",
  inputs: { seed: 7, taxRate: 0.09 },
  create(input) {
    const random = Random.create({ seed: input.seed });
    const map    = TileMap.create({ size: 32 });
    const roads  = Roads.create({ map });                      // defaults
    const budget = Budget.create({ money: 20_000, taxRate: input.taxRate });

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

- City system factories use `Name.create(options)`, as in the specification's planned `Budget.create`.
- The model contract keeps `read()`. Library objects expose `observe()` for detached observations. Migrating `read` to `observe` is an [open decision](../agent-loom/api-table.md#open-decisions).
- `ui.ts` stays as it is today: `defineUI(model, …)` with controls, monitors and views.

### Progressive disclosure

- Handles are the real objects, not wrappers. For example, a road network exposes its core `Graph` directly.
- To change one part, a developer replaces that call. They can pass an own function as an option, or write that part with core calls; the rest of the model stays unchanged.

### Commands

Player input should become plain, serializable objects, so that replays and saved games are possible. A suggested pattern is typed methods on handles that create such objects internally. For example, `roads.build(from, to)` records `{ type: "road.build", from, to }`. The specification currently plans only `CommandResult` and keeps actions as typed model methods; see the "Command data" row of its [open decisions](../agent-loom/api-table.md#open-decisions) and [open question 5](roadmap.md#open-questions).

## Model and UI split

Input: how the 15 city teaching models (see [model pattern](principles.md#model-pattern)) divide the work. It applies principle 1.

| Part | Lives in | Per model or shared |
| --- | --- | --- |
| Rules and state | `model.ts` | Per model |
| Choice of views and controls | `ui.ts`, declared through `defineUI` | Per model |
| Scene layout, for example `flowScene()` or `networkScene()` | Functions inside `ui.ts` | Per model |
| Drawing: canvas, charts, tables, inspectors | `ui/views/` and `ui/svelte/views/` | Shared |

- There are no per-model renderers and no per-model Svelte components.
- The shared UI is not part of the exported headless package.
- The 15 models needed no new library API, view type or dependency.

## Cohort agents

Agent-based modeling stays the conceptual basis, without the cost of one object per person. A **cohort agent** carries a weight: how many people, trips or households it represents. There is one rule and one code path; only the resolution changes.

```ts
const traffic = Traffic.create({ roads, scale: 100 });
// scale 1   → each person is one agent (true ABM, small maps)
// scale 100 → one agent stands for 100 commuters (large city, fast)
```

| System | Cohort agent |
| --- | --- |
| Traffic | Travels its route and adds its weight to each road's load. With a large weight this equals an aggregate flow model. The specification plans this as `PublicTransport` trip cohorts. |
| Economy | A household cohort books income, rent and taxes as flows. |
| Growth | Buildings are individual objects anyway. |

Limits that keep it simple:

1. `scale` is fixed at setup. Splitting and merging cohorts at runtime, for example when zooming in, is deferred until a game needs it.
2. A different `scale` gives a different run and hash. Replays require the same `scale`, so it belongs in the saved state.
3. Weights are integers. **The remainder rule is open.** Three variants exist:
   - this page's original proposal: distribute remainders with the system's own `Random` stream;
   - the specification's current default: deterministic, the last cohort of a trip group carries the remainder ("Cohort remainders" in its [open decisions](../agent-loom/api-table.md#open-decisions));
   - the population model of the 15 city models: carry remainders between steps and allocate integer totals by largest remainder.

   Review of that model showed that rounding without a deliberate rule distorts aggregates badly ([rules learned in review](principles.md#rules-learned-in-review)).
4. Pure fields such as heat, pollution or land value stay `Grid` fields. Not everything has to be an agent.

**Test idea:** the same scenario with `scale: 1` and `scale: 50` must agree in trend. This makes "derived from ABM" checkable.

**Display:** a few visible cars or residents can be taken directly from real cohort agents instead of being invented cosmetically.

The weight is an ordinary property inside a system. The core needs no cohort concept.

## Engine contracts for games

Ranked by necessity for a first game slice. All names are neutral and none are delivered.

1. **Commands.** Player changes are plain serializable objects that a model action validates. A rejected command returns a reason and changes nothing. The specification plans this result as `CommandResult`.
2. **Determinism.** One named `Random` stream per system, a fixed call order, integer money, and a state hash for tests.
3. **Change feed.** Renderers ask what changed since a revision, instead of copying the whole state with every observation.
4. **Save and load.** A versioned snapshot holding system state and `Random` state, with derived data recomputed on load. `Random` already supports a full state and continuation, which is a starting point.
5. **Replay.** A snapshot plus the command log. It comes almost free once 1, 2 and 4 exist.

The owners of snapshots, hashes and the change feed are [open decisions](../agent-loom/api-table.md#open-decisions) in the specification.

## Gaps in the delivered core

Recorded 2026-11-10. The specification now lists target or planned entries for some of these gaps; none is delivered.

- No route search (A*) on `Graph`. Distances use exact `bigint` costs, which suit analysis but are too slow to call every tick.
- Agents and grid cells are separate objects, so large maps need numeric layers backed by typed arrays.
- No snapshots, no change tracking and no state hash.
- No shared tick ordering; each model's `advance()` defines it, which fits the principles.
