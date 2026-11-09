# Public API coverage

The headless library exposes reusable modeling tools through [the package entrypoint](../../index.ts). The [Agent Loom specification](../agent-loom/README.md) defines the broader target. A target signature is not a promise that the operation is available today.

## Available capabilities

This inventory is based on the public exports and their implementation modules. Use the linked examples and exact API contracts for supported inputs and failure behavior; a row does not establish complete compatibility with every target operation.

| Area | Available public surface | Start here |
| --- | --- | --- |
| Agents and worlds | `Agent`, `World`, `run`, `Tick`; ownership, lifecycle, synchronous execution and spatial actions | [Agent/world examples](../../examples/a1/), [spatial examples](../../examples/spatial/) |
| Random streams | `Random`, `RandomState`; standard Mulberry streams, sampling, normal/exponential/Poisson/Bernoulli/triangular/gamma draws, copy and continuation | [Random examples](../../examples/a2a/), [distribution contracts](normal-distribution-contract.md) |
| Grids and fields | `Grid`, `Field`; lookup, neighborhoods, canonical occupancy and diffusion | [Grid examples](../../examples/grid/), [occupancy contract](indexed-occupancy-contract.md) |
| Graphs | `Graph`, `Edge`, `GeneratorOptions`; collections, copies, connectivity, distances, analysis and generation | [Graph contract](graph-copy-contract.md), [connectivity](graph-connectivity-contract.md), [distances](graph-distances-contract.md), [analysis](network-analysis-contract.md), [generators](graph-generators-contract.md) |
| Geometry | `geometry.direction`, `normalize`, `distance`, `map`, `contains`, `bounds`; spatial and Planar types | [Spatial probes](spatial-probe-contract.md), [affine mapping](affine-map-contract.md), [planar queries](planar-geometry-contract.md) |
| Statistics | `stats.histogram`, `gini`, `describe`, and readonly `Histogram`/`Summary` types | [Statistics examples](../../examples/stats/README.md), [summary contract](statistical-summary-contract.md) |

The [Mesa/DES expansion](../mesa-expansion/STATUS.md) also exposes `measurements`, bounded `storage.history`, serial `experiments.design/replicate/run/summarize`, `world.activate/report/select`, `twoPhase`, `continuous`, `Agenda`, `ServiceQueue`, `Resource`, `Store`, `Signal`, `EventTrace` and `TimeWeighted`. The [measurement scripts](../../examples/mesa-measurements/), [dynamics scripts](../../examples/mesa-dynamics/), [attachment scripts](../../examples/mesa-attachment/) and [DES scripts](../../examples/des/) exercise these public contracts. Fixed, shuffled and stable priority activation preserve lifecycle and explicit clocks; full NetLogo compatibility remains open.

These capabilities can be composed independently. Model-specific procedures and observations live in each experiment; UI exports are separate from the headless package.

## Required target

The specification covers 309 operation/type entries across 16 reference areas. Every target entry needs a public export, explicit behavior contract, executable public example and relevant verification before it can be called complete. Existing capability-level coverage does not establish full Agent Loom parity.

Broader requirements include complete compatibility profiles, paths and routing variants, generic Input, advanced study binding/transport/continuation, codecs and supported complete-state continuation. Bounded History and serial studies do not imply those broader capabilities. Check the public exports and operation reference when defining the next capability; do not infer missing operations from directory scaffolding or mark an entire reference area complete from one implementation.

## Next work

Maintain an operation-level inventory against [the canonical API table](../agent-loom/api-table.md), linking each entry to its public implementation, asserted example and current limitations. Resolve ambiguous contracts before adding runtime code. New capabilities follow [the example-first gate](../../PLAN.md#example-first-delivery-gate) and preserve existing examples.

Run `bun run check` to verify configured types, tests, public examples, build and packed consumers. UI changes also require their own real-browser and visual acceptance; library checks do not establish scientific validity for an adapted model.
