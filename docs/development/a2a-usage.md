# A2a: reproducible population dynamics

This page describes the historical bounded A2a slice; current integration status and checks are tracked in [PLAN](../../PLAN.md) and the [consolidation report](consolidation-report.md). Later standard normal, exponential and Poisson distributions are recorded in [Copy/Random integration](copy-random-integration.md); the slice boundaries below are not a current full Random inventory.

A2a extends the existing A1 core with standard Mulberry uniform draws, sampling and explicit stream continuation. It is a bounded part of A2: other distributions, entropy seeds and the pinned MT/NetLogo profile remain A2b. [Assignment and five frozen examples](a2a.md), [source research](a2a-source-research.md), [acceptance evidence](a2a-evidence.md).

## Historical browser scenario and retained headless model

At the A2a checkpoint, the former lab defaulted to Exchange: 24 agents, 10 resource units each, seed 1. Press 100 steps to see the distribution change while Total energy remains 240. Choose the same setup and seed again to replay the same trajectory; choose another seed to compare a different trajectory. Select markers to inspect them without affecting random choices. Lifecycle remains available as the earlier single-agent test scenario.

That historical browser imported the exact same [headless composition](../../examples/models/exchange.ts) that the fifth public example executes. It has no independent exchange rule. Marker arrangement remains a non-spatial display layout: the Exchange composition does not use spatial movement. Later spatial delivery does not change that display contract. Every tick samples two distinct current World members; the donor transfers one unit when it has a positive balance. No transfer occurs from an empty donor. Fewer than two members is a successful no-op interval with no random draws. Model steps run only through explicit run calls; there is no animation clock.

The quantity called energy is an abstract nonnegative integer resource, not a calibrated physical energy model. Normal steps conserve it for unchanged World membership. Copy creates a detached object; explicitly attaching/detaching/deleting changes the measured population total deliberately. A failed interval retains earlier model and RNG effects but adds no tick. RNG checkpoints do not save or resume the model itself.

## Public operations

```ts
import { Random, World, type RandomState } from "city-library";

const random = Random.add({ seed: 1 });
const world = World.add({ random });
const checkpoint: RandomState = random.state;
const chosen = random.sample(["north", "south", "west"], { count: 2 });
const branch = random.copy();
random.state = checkpoint; // restores the same object retained by world.random
random.local(() => random.number({ min: 0, max: 10, integer: true }));
```

| Operation | Contract |
| --- | --- |
| Random.add({seed?, algorithm?}) | Numeric Mulberry seed defaults to 1, algorithm mulberry32; signed/unsigned 32-bit integer input normalizes to uint32 metadata. No construction draw. Other profiles and entropy seeds are rejected in this slice. |
| random.number(options?) | Uniform min 0/max 1/integer false. One draw, exclusive max. Finite ordered float bounds, including opposite extreme finite endpoints; integer bounds and span must be safe integers. Integer arithmetic floors the random offset before adding min. Unsupported/unknown settings reject before drawing. |
| random.sample(source, options?) | Finite iterable consumed once; no identity deduplication. Default count 1, replace false, weight 1, order draw. Pure synchronous weights evaluated once per source position before draws, even count 0. Finite nonnegative weights and finite total required. Original values returned; source unchanged. |
| source order / replacement | order source sorts selected positions after drawing, retaining repeated-position order. Without replacement stop at available positive positions; with replacement take count actual selections. Each selection uses one double, including singleton. Empty/all-zero/count-zero uses no draws. |
| legacy-shuffle | Explicit full count, replace false, no weight/order. Descending Fisher–Yates copy consumes n−1 draws; empty/singleton uses none. This is not NetLogo activation scheduling. |
| random.state | Detached deeply frozen algorithm/seed/continuation metadata. Setter validates the complete closed schema and matching version atomically; restores word and Gaussian cache on the same Random identity. Algorithm immutable; seed metadata reflects reseed/restoration. |
| random.reseed(seed) | Validate numeric seed, reset word and seed metadata, clear Gaussian cache without drawing. |
| random.copy() | Exact independent continuation, including Gaussian cache, no draw. A copy inside local reflects the current temporary continuation. |
| random.local(action) | Synchronous scoped randomness. Each nested scope starts at the outermost main checkpoint and finally restores its immediate predecessor. State writes/reseed affect temporary state only. Model effects remain. Declared async callbacks reject before invocation; returned thenables reject after effects, with stream restoration. |
| random.raw({kind: double}) | Exactly the selected Mulberry uniform draw. Other raw variants remain A2b. |

The Mulberry continuation revision remains agent-loom-random/1. At the A2a checkpoint, cache metadata was retained before Gaussian generation was delivered; later standard-distribution slices use that cache. State reads, copies and restoration do not change World time. Invalid shape/types use TypeError; out-of-domain numeric values use RangeError. Pure callback preconditions do not promise rollback of arbitrary caller side effects.

## Verification and local host

At the A2a checkpoint, `bun run check` covered ten A1/A2a scripts alongside typechecks, tests, build/declarations and the packed Bun/Node/ambient-free TypeScript consumer. These historical totals and browser observations are recorded in [A2a evidence](a2a-evidence.md), not current integration acceptance totals.

Run `bun run dev:ui` for the catalog host; see [Agent Lab](../../ui/agent-lab/README.md) for host details. Exchange and Lifecycle remain repository headless examples/test scenarios, not the current catalog defaults. The current integration verification scope is recorded in the [consolidation report](consolidation-report.md).
