# Write a model

Start with a small rule you can run and inspect. A model pairs a headless model with a UI declaration that reads observations and calls public actions. This guide follows a growing-network model, then shows how to add your own.

## Follow a growing network

[Preferential Attachment](../../models/preferential-attachment/model.ts) starts with two agents joined by an edge. Each step samples an existing edge, chooses one endpoint and attaches a new agent to it. This gives well-connected nodes more opportunities to receive another connection. The file retains the original model attribution and adaptation notes.

Run its public-API assertions from the repository root:

```sh
bun tests/public-contracts/lab/01-headless-network-entry.ts
```

The example runs without a browser. This excerpt uses paths relative to `tests/public-contracts/lab/`:

```ts
import assert from "node:assert/strict";
import { model } from "../../../models/preferential-attachment/model.ts";

const modelInstance = model.create({ seed: 7 });
assert.equal(modelInstance.read().nodeCount, 2);
modelInstance.advance(8);
const observation = modelInstance.read();
assert.equal(observation.tick, 8);
assert.equal(observation.nodeCount, 10);
assert.equal(observation.edgeCount, 9);
```

`create` validates options against the canonical `inputs` descriptors. It creates an independent `Random`, `World` and `Graph` through public `city-library` exports. `advance` validates the requested count and calls `run` with the model procedure. `read` returns detached observations and measurements; it does not advance time or draw randomness. The existing example also checks independent instances, reproducibility and rejected inputs.

## Bind the same model to a UI

[Its UI file](../../models/preferential-attachment/ui.ts) imports `defineUI` from `../../ui/index.ts` and its companion model from `./model.ts`. It declares monitors, a network view, two charts and an inspector. The UI projects observations; the host supplies controls, layout and playback. Network growth stays in the model.

Use the existing `defineUI(model, spec)` contract. Keep short property projections inline and place longer named projections below the declaration. Use `Observation<typeof model>` from the public UI entrypoint to type a named projection. Keep public actions explicit and typed. Keep numeric measurements in monitor getters and format only the display, for example `format: (value: number) => value.toFixed(3)`. Give unrelated projected entities different IDs; use kind prefixes when source IDs overlap. [The UI reference](../ui/api-reference.md) explains the public contracts and compatibility forms.

## Add a bounded model

1. State what setup creates, what one step does, how it advances tick and what can be changed while running. Record units, boundaries, random draws and failure behavior.
2. Write and freeze four or five asserted public examples for the capability before new runtime capabilities. Follow [the example-first gate](../../PLAN.md#example-first-delivery-gate); reuse existing public capabilities where they already express the model.
3. Put model state and scientific rules in `model.ts` or focused headless companion modules. Export a plain `model` definition with `title`, `inputs` and `create`. Preserve source provenance and existing accepted contracts.
4. Bind observations and explicit actions in `ui.ts`. Do not add host DOM access, framework lifecycle wiring or another state owner.
5. Run the relevant examples, behavior tests and typechecks. For changed browser flows, exercise the actual controls and inspect the required screenshots independently. Record results and remaining acceptance limits separately.

The [architecture](../ARCHITECTURE.md) defines domain ownership; [UI design](../DESIGN.md) defines authoring and presentation rules. For adapted reference models, use the [per-model acceptance contract](model-acceptance.md). Passing an example establishes its assertions, not scientific equivalence or complete library coverage.
