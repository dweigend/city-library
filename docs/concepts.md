# Concepts

A City Library model is plain TypeScript that runs without a browser. The UI is a separate, thin description on top. This page explains the handful of ideas behind that split. [Architecture](ARCHITECTURE.md) holds the binding rules and [terminology](agent-loom/terminology.md) the exact distinctions; this page adds no rules of its own.

## A model and its UI

Each model folder has two entry files. `model.ts` exports `model` with a `title`, its `inputs` and a `create` function. The instance that `create` returns owns all model state and exposes the model's actions, including `advance(stepCount?)` and `read()`. `ui.ts` exports `ui = defineUI(model, ...)`, which declares controls, monitors and views for Agent Lab.

The same `model.ts` runs in a script, a test or the browser. If you delete `ui.ts`, the model still works. [Household Budget](../models/household-budget/model.ts) shows the whole pattern in about thirty lines.

## One owner for every state

Every live value has exactly one owner. The model owns its balances, positions and rules. World owns membership and the tick, Grid owns its Fields, Graph owns its Edges. The UI owns only presentation: layout, colors, the camera, which panel is open.

Two consequences follow:

- The UI changes the model only through public actions, never by assigning to model objects.
- `read()` returns detached observations. Reading does not hand state to the UI, and changing an observation does not change the model.

## Steps and ticks

A step is one call of the model procedure. A tick is model time, owned by World. `run(world, step, stepCount)` calls the procedure up to `stepCount` times and adds one tick for each successful call. A failing call stops the run, adds no tick and does not roll back earlier changes. Ticks can also be advanced explicitly, by fractional amounts. So "10 steps" in Agent Lab means ten procedure calls, while the Tick monitor shows model time.

Event-driven models use an Agenda, which keeps its own event time. Advancing or resetting the World tick does not move the Agenda; a model that uses both defines how they map.

## Explicit randomness

Randomness comes from a `Random` stream that you create and pass in. Separate streams for generation, simulation and replications keep them from disturbing each other. A seed starts a stream but does not describe its full continuation state. Observing, saving and drawing must not consume model randomness.

## Independent parts

The library is a set of parts you combine, not a framework you initialize. A graph needs no coordinates, a field calculation needs no agents, and an agent model needs no grid. Use only what the question needs.

## Layers

The library grows in layers. The core holds neutral building blocks such as agents, grids, graphs and randomness, and names no application. City systems, such as economy or energy supply, build only on the public core with simplified, game-like rules. Models and games compose both in their own `model.ts`. Dependencies point downward only. No city system is delivered yet; the [target structure](evolution/structure.md) shows where they will live.

## Available and planned

The [API specification](agent-loom/README.md) describes the full target API, including much that is not built yet. A library operation is available when the root package exports it and an asserted public example exercises it; UI features come from the separate `ui/index.ts` entry. Even then, its contract defines which options are supported. [Coverage](development/coverage.md) lists what works today and what is still open.
