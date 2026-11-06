# Write a model

An experiment has two parts: a headless model that runs in a script, and a UI declaration that observes it and calls its public actions. Start by understanding an existing small example before adding another abstraction.

## Follow a growing network

[Preferential Attachment](../../experiments/preferential-attachment/model.ts) starts with two agents joined by an edge. Each step samples an existing edge, chooses one endpoint and attaches a new agent to it. This gives well-connected nodes more opportunities to receive another connection. The file retains the original model attribution and adaptation notes.

Run this existing asserted example from the repository root:

```sh
bun examples/lab/01-headless-network-entry.ts
```

It uses the model directly, without a browser. The following excerpt uses the same real imports and operations; relative paths are written for a script under `examples/lab/`:

```ts
import assert from "node:assert/strict";
import { model } from "../../experiments/preferential-attachment/model.ts";

const simulation = model.create({ seed: 7 });
assert.equal(simulation.read().nodeCount, 2);
simulation.advance(8);
const observation = simulation.read();
assert.equal(observation.tick, 8);
assert.equal(observation.nodeCount, 10);
assert.equal(observation.edgeCount, 9);
```

`create` validates options against the canonical `inputs` descriptors. It creates an independent `Random`, `World` and `Graph` through public `city-library` exports. `advance` validates the requested count and calls `run` with the model procedure. `read` returns detached observations and measurements; it does not advance time or draw randomness. The existing example also checks independent instances, reproducibility and rejected inputs.

## Bind the same model to a UI

[Its UI file](../../experiments/preferential-attachment/ui.ts) imports `defineUI` from `../../ui/index.ts` and its companion model from `./model.ts`. It declares monitors, a network view, two charts and an inspector. The UI projects observations; the shared host supplies controls, layout and playback. No second network-growth rule is implemented in the UI.

Use the existing `defineUI(model, spec)` contract. Keep short property projections inline and place longer named projections below the declaration. Keep public actions explicit and typed. [The UI reference](../ui/api-reference.md) distinguishes implemented syntax from pending simplification candidates; those candidates are not instructions to invent a new API.

## Add a bounded experiment

1. State what setup creates, what one step does, how it advances tick and what can be changed while running. Record units, boundaries, random draws and failure behavior.
2. Write and freeze the phase's four or five asserted public examples before new runtime capabilities. Follow [the example-first gate](../../PLAN.md#example-first-delivery-gate); reuse existing public capabilities where they already express the model.
3. Put model state and scientific rules in `model.ts` or focused headless companion modules. Export a plain `model` definition with `title`, `inputs` and `create`. Preserve source provenance and existing accepted contracts.
4. Bind observations and explicit actions in `ui.ts`. Do not add host DOM access, framework lifecycle wiring or another state owner.
5. Run the relevant examples, behavior tests and typechecks. For changed browser flows, exercise the actual controls and inspect the required screenshots independently. Record results and remaining acceptance limits separately.

The [architecture](../ARCHITECTURE.md) defines domain ownership; [UI design](../DESIGN.md) defines authoring and presentation rules. For adapted reference models, use the [per-model acceptance contract](netlogo-model-acceptance.md). Passing an example establishes its assertions, not scientific equivalence or complete library coverage.
