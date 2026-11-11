# Principles

Status: brainstorming. The owner set these principles on 2026-11-10. They are candidates for a binding decision.

## The principles

1. **UI and model are clearly separated.** The pairing `model.ts` + `ui.ts` was chosen on purpose and stays.
2. **The core library says nothing about applications.** A variable or function called `traffic`, `street`, `economy`, `water` or `city` is not part of the core.
3. **City, economy and other systems build on the library.** They are separate layers that use only the public core.
4. **Everything is standard TypeScript.** There is no DSL, no magic registry and no special runtime. Developers compose plain functions and objects.
5. **No completeness for every edge case.** Functions provide sensible defaults and can be configured in more detail when needed.
6. **Games, not realism.** Simulations are always strongly simplified. Playability and explainability matter more than accuracy.
7. **Strong encapsulation.** Every module works on its own and can be tested and replaced on its own.
8. **A construction kit that keeps growing.** A few high-level calls are enough for a small simulation or a whole game. Developers can drop to lower layers for single parts without rewriting everything.
9. **Logic first, games later.** The library and its logic come first. Experiments in the test UI each cover one small test case, like today's models. Game prototypes and 3D graphics follow only once a basic set of logic exists. See the [roadmap](roadmap.md).
10. **Generative design is a separate track.** Generative 3D design logic, such as architecture, building families and quarters, is developed separately from the simulation library.
11. **city-library is the base.** The `city_game` repository serves only for cherry-picking single ideas; see [cherry-picks](cherry-picks.md).

## Consequences

- **Dependencies are function arguments.** A system receives what it needs, for example `createRoads({ map })`. This is type-safe, needs no registry and makes isolated tests trivial: pass something else.
- **The system order is visible.** It is the order of calls in a model's `advance()`, not a hidden scheduler.
- **One option pattern everywhere:**
  - `createX(options?)`, with every option optional and a playable default;
  - nested options for finer control;
  - a function as the escape hatch, for example `cost: (edge) => …`.
- **The core gets only neutral building blocks** that several systems need, such as route search on `Graph`, numeric layers over a grid, and later snapshots and change tracking. Names stay neutral.
- **Domain concepts live in systems.** Weights for cohort agents, roads, zones, budgets and households are ordinary properties and functions inside the city or economy system.
- **Systems should not depend on each other where avoidable.** An economy system should work with any agents, not only inside a city.

## Simplification rules (proposal)

Proposed rules that keep systems game-like:

1. State grows with the map and the number of cohorts, not with the number of simulated people.
2. Capacity counters with saturating responses instead of physics, for example `load / capacity → congestion 0..1`.
3. Coarse ticks; one tick is one game day by default. Expensive work may run every *n* ticks.
4. All constants live in one typed, documented `tuning` options object with defaults. There are no hidden magic numbers and no real-world unit claims.
5. Visible effects are explainable: a system can say why a value is what it is, for example "congestion because capacity 10, load 14".
6. Acceptance uses playable scenarios and behavior tests, not scientific comparison with external sources.

## What the principles override

Parts of the earlier architecture proposals are dropped:

| Earlier proposal | Replaced by |
| --- | --- |
| `createCity().use(kit)` as the central composition, with capability tokens, `defineKit` and a registry per instance | Plain function arguments; composition happens in `model.ts` |
| `defineUIMod` for UI extensions | `ui.ts` with `defineUI`, as today |
| Replacing models with kit compositions | Models stay `model.ts` + `ui.ts`; they compose systems |
| Separate aggregate and agent variants per system | Cohort agents with a weight; see [layers and API](layers-and-api.md#cohort-agents) |
