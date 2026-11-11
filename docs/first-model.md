# Your first model

In this tutorial you build a small model from scratch, run it in the terminal and then open it in Model Lab. It takes three short files and no browser code.

The model is a rain barrel behind a house:

- Every day the same amount of rain flows into the barrel.
- Every day the household takes the same amount out, as long as there is water.
- The barrel has a fixed capacity; anything above it overflows.

Nothing in it is random, so you can check every number by hand.

## Before you start

You need a checkout of this repository and Bun 1.4.2. Run every command from the repository root:

```sh
bun install --frozen-lockfile
```

## 1. Write the model

Create the folder `models/rain-barrel/` and put this file in it as `models/rain-barrel/model.ts`:

```ts
import { Agent, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface RainBarrelParameters {
  capacityLiters: number;
  rainLitersPerDay: number;
  useLitersPerDay: number;
}

export const inputs: Inputs<RainBarrelParameters> = {
  capacityLiters: { kind: "number", default: 200, min: 50, max: 500, integer: true },
  rainLitersPerDay: { kind: "number", default: 30, min: 0, max: 100, integer: true },
  useLitersPerDay: { kind: "number", default: 20, min: 0, max: 100, integer: true },
};

/** One rain barrel: daily rain fills it, daily use drains it, extra water overflows. */
export function create(options: Partial<RainBarrelParameters> = {}) {
  const settings = parseParameters(inputs, options);
  const barrel = Agent.create({ storedLiters: 0, overflowLiters: 0 });
  const world = World.create();
  world.add(barrel);
  const history = [{ x: 0, y: 0 }];

  function passDay() {
    const available = barrel.storedLiters + settings.rainLitersPerDay;
    const afterUse = available - Math.min(settings.useLitersPerDay, available);
    barrel.overflowLiters += Math.max(0, afterUse - settings.capacityLiters);
    barrel.storedLiters = Math.min(settings.capacityLiters, afterUse);
  }

  return {
    advance(days = 1) {
      validateStepCount(days);
      for (let day = 0; day < days; day += 1) {
        run(world, passDay);
        history.push({ x: world.tick.value, y: barrel.storedLiters });
      }
    },
    waterGarden() {
      barrel.storedLiters = Math.max(0, barrel.storedLiters - 50);
    },
    read() {
      return {
        day: world.tick.value,
        storedLiters: barrel.storedLiters,
        overflowLiters: barrel.overflowLiters,
        capacityLiters: settings.capacityLiters,
        history: history.map(point => ({ ...point })),
      };
    },
  };
}

export const model = {
  title: "Rain Barrel",
  description: "Daily rain fills one barrel, daily use drains it and the rest overflows.",
  inputs,
  create,
} satisfies Definition<RainBarrelParameters, ReturnType<typeof create>>;
```

What the parts do:

- `inputs` describes the three numbers you can choose before a run: their defaults and allowed ranges. Model Lab turns them into setup fields.
- `create` builds one independent model instance. `parseParameters` checks your options against `inputs` and rejects anything outside the ranges.
- The barrel is an `Agent` that lives in a `World`. `run(world, passDay)` performs one step and advances `world.tick` by one when the step succeeds. One tick is one day here.
- `advance` and `waterGarden` are the model's public actions; they are the only way to change it.
- `read` returns a fresh copy of what you want to observe. Reading never changes the model.
- `model` bundles title, description, inputs and factory. `../definition.ts` and `../parameters.ts` are the shared helpers every model in this repository uses.

## 2. Run it in the terminal

Create `models/rain-barrel/try.ts`:

```ts
import { model } from "./model.ts";

const barrel = model.create();

barrel.advance(10);
const { day, storedLiters, overflowLiters } = barrel.read();
console.log({ day, storedLiters, overflowLiters });
```

Run it:

```sh
bun models/rain-barrel/try.ts
```

You see:

```text
{
  day: 10,
  storedLiters: 100,
  overflowLiters: 0,
}
```

Thirty liters of rain minus twenty liters of use leaves ten liters per day, so after ten days the barrel holds 100 liters.

Now change `barrel.advance(10)` to `barrel.advance(30)` and run the script again. The barrel is full after twenty days; for the remaining ten days the extra ten liters overflow:

```text
{
  day: 30,
  storedLiters: 200,
  overflowLiters: 100,
}
```

Try other values the same way, for example `model.create({ rainLitersPerDay: 10 })`. With less rain than use, the barrel stays empty. A value outside the allowed range, such as `model.create({ capacityLiters: 20 })`, throws a `RangeError` before anything runs.

## 3. Describe the user interface

Create `models/rain-barrel/ui.ts`:

```ts
import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  actions: [
    { label: "Water the garden", run: barrel => barrel.waterGarden() },
  ],
  monitors: [
    { label: "Day", value: state => state.day },
    { label: "Stored (L)", value: state => state.storedLiters },
    { label: "Overflow (L)", value: state => state.overflowLiters },
  ],
  views: [
    {
      type: "line",
      label: "Water in the barrel",
      xAxis: { label: "Day" },
      yAxis: { label: "Stored", unit: "L" },
      series: state => [{ label: "Stored", points: state.history }],
    },
  ],
});
```

This file only declares what Model Lab should show: a button that calls `waterGarden`, three monitors and a line chart of the stored water. The setup fields come from `inputs` automatically. Model Lab supplies Setup, stepping and Run/Pause; the model keeps all state and rules.

Check the types of the whole project, including your new files:

```sh
bun run typecheck
```

The last line contains `0 ERRORS`.

## 4. Open it in Model Lab

Model Lab finds every folder directly under `models/` that contains both `model.ts` and `ui.ts`; you do not register the model anywhere. The folder name becomes the address, so it must be a lowercase slug such as `rain-barrel`.

With all three files in place, start the Lab:

```sh
bun run dev
```

Open <http://localhost:3101/?model=rain-barrel>, or choose **Rain Barrel** from the model list. Then:

1. The model initializes when it opens. The monitors show Day 0, Stored (L) 0 and Overflow (L) 0.
2. Press **Run**. The chart rises; at Day 10, Stored (L) reads 100. Wait until the day counter passes 20, then press **Pause**. From day 20 on the line stays flat at 200 and Overflow grows instead.
3. Press **Water the garden**. Stored drops by 50 liters.
4. Set **Rain Liters Per Day** to 10. The **Reload** button now reads **Reload with changes**. Press it, then **Run**: the barrel stays empty.

On a narrow screen, the setup fields and **Water the garden** sit under **Parameters**. If the Lab was already running when you created the files, stop it and start it again.

## What you built

A headless model owns its state and rules and can run without a browser. A separate UI declaration reads its observations and calls its public actions. That split is the same in every model in this repository, from this barrel to the [Preferential Attachment](../models/preferential-attachment/model.ts) network.

The barrel is a teaching example with invented numbers, not a water-supply calculation. To keep your experiment out of the repository, delete the folder again:

```sh
rm -r models/rain-barrel
```

## Next steps

- [Concepts](concepts.md) explains state ownership, steps and ticks, and explicit randomness in a few paragraphs.
- [Write a model](development/model-authoring.md) walks through a larger model and lists what a model added to this repository needs.
- [Model Lab](../ui/model-lab/README.md) explains the controls and server options.
- [The UI contract](ui/README.md) and its [reference](ui/api-reference.md) list every view type, monitor and control you can declare.
- [Architecture](ARCHITECTURE.md) explains why models and UI stay separate.
