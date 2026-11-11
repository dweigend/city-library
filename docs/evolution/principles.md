# Principles

Status: mixed. [The principles](#the-principles) and their [consequences](#consequences) were **set by the owner** on 2026-11-10 and 2026-11-11. All other sections are **proposals** or, where marked, **input**. Terms follow the [status legend](README.md#status-legend).

This page owns the design principles and the rules derived from them. Other evolution pages link here instead of restating them.

## The principles

Set by owner, 2026-11-10 and 2026-11-11.

1. **UI and model are clearly separated.** The pairing `model.ts` + `ui.ts` was chosen on purpose and stays.
2. **The core library says nothing about applications.** A variable or function called `traffic`, `street`, `economy`, `water` or `city` is not part of the core.
3. **City, economy and other systems build on the library.** They are separate layers that use only the public core.
4. **Everything is standard TypeScript.** There is no DSL, no magic registry and no special runtime. Developers compose plain functions and objects.
5. **No completeness for every edge case.** Functions provide sensible defaults and can be configured in more detail when needed.
6. **Games, not realism.** Simulations are always strongly simplified. Playability and explainability matter more than accuracy.
7. **Strong encapsulation.** Every module works on its own and can be tested and replaced on its own.
8. **A construction kit that keeps growing.** A few high-level calls are enough for a small simulation or a whole game. Developers can drop to lower layers for single parts without rewriting everything.
9. **Logic first, games later.** The library and its logic come first. Experiments in the test UI (Agent Lab) each cover one small test case, like today's models. Game prototypes and 3D graphics follow only once a basic set of logic exists. See the [roadmap](roadmap.md#phase-sequence).
10. **Generative design is a separate track.** Generative 3D design logic, such as architecture, building families and quarters, is developed separately from the simulation library.
11. **city-library is the base.** The `city_game` repository serves only for cherry-picking single ideas; see [cherry-picks](cherry-picks.md).

The accepted [structure](structure.md#principles-behind-the-structure) turns principles 2, 3, 7 and 10 into folder and import rules.

## Consequences

Set by owner together with the principles.

- **Dependencies are function arguments.** A system receives what it needs, for example `Roads.create({ map })`. This is type-safe, needs no registry and makes isolated tests trivial: pass something else.
- **The system order is visible.** It is the order of calls in a model's `advance()`, not a hidden scheduler.
- **One option pattern everywhere:**
  - `Name.create(options?)` for objects that own state, plain functions for pure calculations; every option optional with a playable default;
  - nested options for finer control;
  - a function as the escape hatch, for example `cost: (edge) => …`.
- **The core gets only neutral building blocks** that several systems need, such as route search on `Graph`, numeric layers over a grid, and later snapshots and change tracking. Names stay neutral.
- **Domain concepts live in systems.** Weights for cohort agents, roads, zones, budgets and households are ordinary properties and functions inside the city or economy system.
- **Systems should not depend on each other where avoidable.** An economy system should work with any agents, not only inside a city.

The API specification applies the option pattern to new API only; delivered positional or required arguments stay frozen. See the "Option convention" row in its [open decisions](../agent-loom/api-table.md#open-decisions).

## Simplification rules

Proposal. These rules keep systems game-like (principle 6).

1. State grows with the map and the number of cohorts, not with the number of simulated people.
2. Capacity counters with saturating responses instead of physics, for example `load / capacity → congestion 0..1`.
3. Coarse ticks; one tick is one game day by default. Expensive work may run every *n* ticks.
4. All constants live in one typed, documented `tuning` options object with defaults. There are no hidden magic numbers and no real-world unit claims.
5. Visible effects are explainable: a system can say why a value is what it is, for example "congestion because capacity 10, load 14".
6. Acceptance uses playable scenarios and behavior tests, not scientific comparison with external sources.

## Rule for growth

Proposal. A new capability starts inside one system. It moves into the core only when a second system needs it, and only under a neutral name.

## Model pattern

Proposal, derived from **input**: the 15 city teaching models built in the uncommitted worktree branch `t3/city-simulation-models` (2026-11-10/11). Its records are `docs/development/city-simulation-models.md` and `docs/development/city-model-research.md` in that worktree.

Every model follows one pattern:

| Step | Content | Example (energy model) |
| --- | --- | --- |
| 1. Question | One city question | More solar, more storage or shifted demand? |
| 2. Visible mechanism | One small, visible causal mechanism | Solar day, evening peak, battery limits, import limit |
| 3. Targeted intervention | One or two interventions the user can apply | Shift 50% of the evening demand |
| 4. Headless comparison | An asserted experiment that compares scenarios without the UI | Unmet demand falls from 11 kWh to 0; more generation alone does not close a gap at the wrong time of day |

Further examples from the same models:

- Finance: with the same budget, preventive repairs keep mean condition at 0.66, worst-first repairs at 0.06. The effect comes mainly from an explicit rule: below condition 0.4 a repair costs double.
- Services: central and distributed facilities with the same capacity serve 24 and 36 requests.
- Air and noise: half the traffic halves the air load but lowers noise by only about 3 dB.

Rules that go with the pattern:

1. **Insight, not realism.** This applies principle 6 to models.
2. **Papers give ideas only.** The rules and parameters are our own simplified teaching rules, and the model documentation says so. No paper's method is claimed as implemented; for example, no Braess, SWMM, OSPM or CNOSSOS implementation.
3. **Inputs are synthetic.** The mechanism is separate from scientific calibration.

### Rules learned in review

Proposal. Independent review of the 15 models found these defects; each fix became a rule.

| Rule | Reason |
| --- | --- |
| Cohort rounding needs a deliberate remainder rule. | Rounding per cohort distorted an aggregate badly: about 3 deaths instead of about 90. The population model now carries remainders and allocates integer totals by largest remainder. The general rule is open; see [cohort agents](layers-and-api.md#cohort-agents). |
| Live actions treat an explicit `undefined` uniformly. | Models differed: some reset to the default, some kept the value, some threw. The 15 models now share one rule: omitted keys keep their values, an explicit `undefined` throws `TypeError`, and the whole candidate is validated before any assignment. |
| A live input field does not trigger setup on Enter. | A shared host fix, not a model rule. |
| A selection outline does not hide state colours. | A shared renderer fix. |
| Screenshots that compare scenarios are taken at the same model time. | Otherwise the comparison shows time, not the intervention. |

How these models split work between `model.ts`, `ui.ts` and shared drawing is described under [model and UI split](layers-and-api.md#model-and-ui-split).

## Non-goals

Proposal. These are deliberately not planned, because they conflict with principles 4 and 6:

- an ECS framework, a plugin registry or a generic event bus;
- one agent per citizen as the default;
- vehicle or lane physics, real units, GIS or OSM import;
- multiplayer, networking, worker threads;
- rendering, cameras or editors in the library;
- a scripting DSL.

## What the principles override

Record. Parts of the earlier architecture proposals (2026-11-10) are dropped:

| Earlier proposal | Replaced by |
| --- | --- |
| `createCity().use(kit)` as the central composition, with capability tokens, `defineKit` and a registry per instance | Plain function arguments; composition happens in `model.ts` |
| `defineUIMod` for UI extensions | `ui.ts` with `defineUI`, as today |
| Replacing models with kit compositions | Models stay `model.ts` + `ui.ts`; they compose systems |
| Separate aggregate and agent variants per system | Cohort agents with a weight; see [layers and API](layers-and-api.md#cohort-agents) |
| `createRoads` / `createBudget` factory functions in early sketches | `Name.create(options)`, as in the option pattern above |
