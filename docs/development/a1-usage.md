# Using the A1 headless agent slice

The [A2a follow-up](a2a-usage.md) now adds standard Random selection/continuation and the Exchange lab scenario. This page records the earlier A1 scope.

A1 implements a bounded subset of the [Agent Loom target](../agent-loom/README.md). Spatial construction/movement, other World component kinds, broad Random operations and later domains remain planned. See the [assignment](a1.md), [coverage inventory](coverage.md) and [acceptance evidence](a1-evidence.md) for exact scope and checks. The package stays private and unpublished.

## Run locally

Use Bun 1.4.2 and the committed lockfile. Development dependencies are pinned to TypeScript 7.0.2 and @types/bun 1.4.4.

```sh
bun install --frozen-lockfile
bun run check
bun run dev:ui
```

Open `http://127.0.0.1:3100/` for the HTML test host. It builds its browser bundle once on startup; restart the server after changes. `CITY_LIBRARY_UI_PORT` selects another port. Build the library before starting this host (`bun run build`, also part of check). UI code is outside the library and uses explicit application-model actions; no simulation clock runs in the background.

## Smallest public model

```ts
import { Agent, World, run } from "city-library";

const person = Agent.add({ energy: 10 });
const world = World.add();
world.add(person);

function step() {
  person.energy -= 1;
}

run(world, step, 5);
// person.energy === 5; world.tick.value === 5
```

Run all five [frozen public scripts](../../examples/a1/01-energy-model.ts) with `bun run examples`. They were written before runtime implementation. This root entry maps the specification's `agent-loom` name to City Library; no serialization identifier is renamed.

## Delivered public surface

| Operation | Inputs, defaults and result | Mutation, failure and lifecycle |
| --- | --- | --- |
| Agent.add(), Agent.add(state) | Plain typed custom-state record; omitted state is empty. New independent identity, default XY x/y/heading 0; z/pitch/roll absent-valued. | Copies supported initial data, retains living framework references, consumes no model randomness. Reserved root names and unsupported data reject before publication. Spatial creation options remain open. |
| agent.copy() | No options; returns a typed detached living Agent with copied model data and default spatial state. | Living source required. Independent supported containers, preserved aliases/cycles, retained framework identities. No draw or tick. |
| agent.delete() | No result. Final custom data and identity remain readable. | Idempotent; clears World membership and makes later library mutations/copy invalid. Caller-owned collections retain their references. Future Graph/Input cleanup stays open until those domains arrive. |
| World.add(), World.add({random}) | New non-spatial World; omitted random creates an independent Mulberry seed-1 stream. | Supplied Random retained by identity. No construction-time draws. Spatial overload and non-Agent components remain open. |
| world.add(agent or iterable) | Single input returns original Agent; iterable returns frozen deduplicated snapshot in first-occurrence order. | Preflight entire batch before mutation. At most one World owner; same-World add is a no-op. Invalid/dead/foreign entries and throwing iterators reject atomically. |
| world.delete(agent or iterable) | No result; absent unowned membership is a no-op. | Detaches without killing or changing model data; foreign ownership/invalid input rejects the complete batch. |
| world.agents | Frozen insertion-order snapshot of canonical Agent references. | Snapshot membership stays fixed; referenced living objects expose their current data. Editing a caller array does not change registration. |
| world.tick.advance(amount), reset() | Initial value 0; advance defaults 1, accepts finite nonnegative fractions. Reset sets clock to 0. | Clock only, no model/RNG action. Nonnumeric TypeError; negative/nonfinite/overflow RangeError. Both reject during the owning World's run. |
| run(world, step, steps) | Synchronous callback; steps defaults 1, must be nonnegative safe integer. Returns void; 0 invokes nothing. | Preflights representable tick progression. Success adds one tick; error propagates, retains effects and does not tick failed step. Same-World reentry and async/thenable callbacks reject. Independent Worlds may nest. |
| Random.add({seed?, algorithm?}), random.number() | Defaults seed 1 and mulberry32; numeric seed in signed/unsigned 32-bit domain, normalized uint32. Uniform no-argument draw in [0,1). | Explicit draw advances only that stream. Read-only seed/algorithm. Other profiles, entropy seeds, number options and continuation remain A2. |

World time has caller-defined units and no seconds conversion. Energy is ordinary model data, with no engine-defined units, floor or automatic behavior. No public domain import requires DOM, renderer or World construction.

## Model data

Creation/copy traverses finite scalar data, plain records, arrays (including holes), Map, Set, valid Date/RegExp, ArrayBuffer and standard non-shared typed views. Cycles, repeated references, view offsets and backing-buffer relationships survive within each copy. ArrayBuffer copies are fixed-length; resizable allocation policy and length-tracking view behavior are not continuation guarantees in A1. Supported framework references keep their original identity. Later direct property assignment uses ordinary TypeScript reference semantics.

Symbols, accessors, functions, custom prototypes/resources, nonfinite scalar numbers, invalid dates/RegExp state, SharedArrayBuffer and detached buffers reject at clone boundaries. Only the specification's exact root Agent names are reserved; constructor and __proto__ can be ordinary own model properties. Queries/rendering do not advance time or consume randomness.

## Distribution and environment evidence

`bun run build` creates browser-target ESM and declarations without Bun/DOM ambient types. The public package uses source for Bun and built JavaScript for other consumers, with generated declarations for types. `bun run consumer` packs into a temporary directory, installs the archive in an isolated consumer and checks Bun, the installed Node ESM runtime and ambient-free TypeScript. Local build output is ignored by Git; run build before using a fresh checkout as a built package. These checks establish the recorded environments, not every browser or Node release.
