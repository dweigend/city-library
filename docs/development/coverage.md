# Agent Loom delivery coverage

**Status:** A1, bounded A2a and A5a non-spatial Graph kernel verified. A5a adds canonical persistent graph contacts and a headless network-diffusion composition; remaining profile/distribution and broader graph contracts stay open. All 309 reference entries are retained. Partial rows record the implemented A1 closure and remain open for later contracts; this inventory does not replace the binding specification.

[Work plan](../../PLAN.md) · [Binding API inventory](../agent-loom/api-table.md) · [Detailed contracts](../agent-loom/api-reference.md)

## Tracking rules

- Each row preserves one source entry ID and links its original semantic anchor. Overloads remain separate rows even when their display names match.
- A1–A8 are delivery phases from PLAN. Multiple phases mean the entry has a staged contract: passing its A1 subset cannot mark the complete entry delivered.
- In particular, Agent creation and copying retain their full future spatial commitments; non-spatial A1 does not silently remove options. World component membership initially handles Agent and later adds the other specified component kinds and cross-domain constraints.
- World requires a real independent default Random, so its minimum Mulberry32 dependency can arrive in A1. The complete Random API, distributions, continuation and compatibility profile remain A2. The A1 development brief fixes the exact accepted closure.
- Shared types, resource limits, loading semantics and package entries are tracked explicitly. A type declaration alone does not prove runtime behavior, and a reference entry that groups many signatures needs evidence for every included branch.
- Replace Planned with Partial only when named tests/examples establish the delivered subset. Mark Delivered only after the complete reference contract, public entry, example and checks are linked. Keep author checks distinct from independent review findings.
- Every expansion phase first writes four or five asserted public scripts under the example-first gate. Focused tests cover individual operations and boundaries beyond those author tasks.

## Inventory counts

| Reference area | Entries |
| --- | ---: |
| World | 25 |
| Agent | 27 |
| Grid | 10 |
| Field | 6 |
| Graph | 44 |
| Node | 6 |
| Edge | 18 |
| Random | 19 |
| Input | 5 |
| stats | 6 |
| geometry | 20 |
| Agenda | 7 |
| experiments | 52 |
| storage | 52 |
| limits | 5 |
| Exports and shared types | 7 |
| **Total** | **309** |

Counts were verified by matching all paired semantic/API anchors and `###` operation headings in the binding inventory: 309 entries, 309 unique source entry IDs and 16 areas. Source ordering is retained below.

## World

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-12](../agent-loom/api-table.md#world-add) | `World.add` | A1 | Partial | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-13](../agent-loom/api-table.md#world-add-2) | `World.add` | A3 | Planned | Spatial World overload; not part of non-spatial A1. |
| [api-11](../agent-loom/api-table.md#world-space) | `world.space` | A1 / A3 | Partial | A1: absent context; A3: normalized immutable spatial context. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-29](../agent-loom/api-table.md#world-random) | `world.random` | A1 / A2 | Partial | A1: independent default stream or explicit retained identity; A2: complete Random contract. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-16](../agent-loom/api-table.md#world-tick) | `world.tick` | A1 | Delivered | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-30](../agent-loom/api-table.md#world-tick-value) | `world.tick.value` | A1 | Delivered | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-31](../agent-loom/api-table.md#world-tick-advance) | `world.tick.advance` | A1 | Delivered | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-32](../agent-loom/api-table.md#world-tick-reset) | `world.tick.reset` | A1 | Delivered | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-18](../agent-loom/api-table.md#world-agents) | `world.agents` | A1 | Delivered | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-19](../agent-loom/api-table.md#world-grids) | `world.grids` | A4 | Planned | Grid identities and World attachment. |
| [api-20](../agent-loom/api-table.md#world-graphs) | `world.graphs` | A5 | Planned | Graph identities and cross-domain ownership. |
| [api-21](../agent-loom/api-table.md#world-inputs) | `world.inputs` | A7 | Planned | Input identities and binding dependencies. |
| [api-22](../agent-loom/api-table.md#world-agendas) | `world.agendas` | A6 | Planned | Agenda identities and World attachment. |
| [api-14](../agent-loom/api-table.md#world-add-3) | `world.add` | A1–A7 | Partial | A1: Agent ownership and atomic batches; A3: spatial validation; A4/A5/A6/A7: Grid/Graph/Agenda/Input dependencies. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-15](../agent-loom/api-table.md#world-add-4) | `world.add` | A1–A7 | Partial | A1: Agent ownership and atomic batches; A3: spatial validation; A4/A5/A6/A7: Grid/Graph/Agenda/Input dependencies. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-23](../agent-loom/api-table.md#world-delete) | `world.delete` | A1–A7 | Partial | A1: Agent ownership and atomic batches; A3: spatial validation; A4/A5/A6/A7: Grid/Graph/Agenda/Input dependencies. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-24](../agent-loom/api-table.md#run) | `run` | A1 | Delivered | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-25](../agent-loom/api-table.md#world-activate) | `world.activate` | A6 | Planned | Activation and scoped execution; pinned compatibility requires A2. |
| [api-26](../agent-loom/api-table.md#world-report) | `world.report` | A6 | Planned | Activation and scoped execution; pinned compatibility requires A2. |
| [api-27](../agent-loom/api-table.md#world-report-2) | `world.report` | A6 | Planned | Activation and scoped execution; pinned compatibility requires A2. |
| [api-28](../agent-loom/api-table.md#world-select) | `world.select` | A6 | Planned | Activation and scoped execution; pinned compatibility requires A2. |
| [api-17](../agent-loom/api-table.md#type-tick) | `Tick` | A1 | Delivered | Tick, synchronous execution or non-spatial Agent membership. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-318](../agent-loom/api-table.md#type-world-member) | `WorldMember` | A6 | Planned | Activation and scoped execution; pinned compatibility requires A2. |
| [api-319](../agent-loom/api-table.md#type-activation-source) | `ActivationSource` | A6 | Planned | Activation and scoped execution; pinned compatibility requires A2. |
| [api-320](../agent-loom/api-table.md#type-activation-context) | `ActivationContext` | A6 | Planned | Activation and scoped execution; pinned compatibility requires A2. |

## Agent

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-37](../agent-loom/api-table.md#agent-add) | `Agent.add` | A1 | Partial | Default detached Agent construction. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-38](../agent-loom/api-table.md#agent-add-2) | `Agent.add` | A1 / A3 | Partial | A1: direct state and default XY construction; A3: complete position/orientation options. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-33](../agent-loom/api-table.md#agent-copy) | `agent.copy` | A1 / A3 | Partial | A1: detached identity and supported custom state; A3: complete spatial-state copying. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-34](../agent-loom/api-table.md#agent-alive) | `agent.alive` | A1 | Delivered | Core identity, lifecycle and ownership; snapshot reconstruction is checked in A8. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-35](../agent-loom/api-table.md#agent-id) | `agent.id` | A1 | Delivered | Core identity, lifecycle and ownership; snapshot reconstruction is checked in A8. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-36](../agent-loom/api-table.md#agent-world) | `agent.world` | A1 | Delivered | Core identity, lifecycle and ownership; snapshot reconstruction is checked in A8. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-53](../agent-loom/api-table.md#agent-x) | `agent.x` | A1 / A3 | Partial | A1: immutable default readback; A3: explicit spatial initialization and updates. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-54](../agent-loom/api-table.md#agent-y) | `agent.y` | A1 / A3 | Partial | A1: immutable default readback; A3: explicit spatial initialization and updates. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-55](../agent-loom/api-table.md#agent-z) | `agent.z` | A1 / A3 | Partial | A1: immutable default readback; A3: explicit spatial initialization and updates. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-56](../agent-loom/api-table.md#agent-heading) | `agent.heading` | A1 / A3 | Partial | A1: immutable default readback; A3: explicit spatial initialization and updates. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-57](../agent-loom/api-table.md#agent-pitch) | `agent.pitch` | A1 / A3 | Partial | A1: immutable default readback; A3: explicit spatial initialization and updates. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-58](../agent-loom/api-table.md#agent-roll) | `agent.roll` | A1 / A3 | Partial | A1: immutable default readback; A3: explicit spatial initialization and updates. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-40](../agent-loom/api-table.md#agent-move) | `agent.move` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-41](../agent-loom/api-table.md#agent-move-2) | `agent.move` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-42](../agent-loom/api-table.md#agent-move-3) | `agent.move` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-43](../agent-loom/api-table.md#agent-move-4) | `agent.move` | A3 | Planned | Spatial operations, perception and path continuation in bounded slices. |
| [api-44](../agent-loom/api-table.md#agent-rotate) | `agent.rotate` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-45](../agent-loom/api-table.md#agent-rotate-2) | `agent.rotate` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-46](../agent-loom/api-table.md#agent-distance-to) | `agent.distanceTo` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-47](../agent-loom/api-table.md#agent-neighbors) | `agent.neighbors` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-48](../agent-loom/api-table.md#agent-neighbors-2) | `agent.neighbors` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-49](../agent-loom/api-table.md#agent-direction-to) | `agent.directionTo` | A3 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-50](../agent-loom/api-table.md#agent-can-move) | `agent.canMove` | A3 | Planned | Spatial operations, perception and path continuation in bounded slices. |
| [api-52](../agent-loom/api-table.md#agent-gradient) | `agent.gradient` | A4 | Planned | Requires Grid/Field and numeric neighborhood rules. |
| [api-39](../agent-loom/api-table.md#agent-delete) | `agent.delete` | A1 / A5 | Partial | A1: living state and World removal; A5: incident graph/tie cleanup. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-3](../agent-loom/api-table.md#type-agent) | `Agent` | A1–A5 | Partial | Public type grows with delivered lifecycle, movement, perception and gradient contracts. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-51](../agent-loom/api-table.md#type-numeric-fields) | `NumericFields` | A4 | Planned | Requires Grid/Field and numeric neighborhood rules. |

## Grid

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-62](../agent-loom/api-table.md#grid-add) | `Grid.add` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-63](../agent-loom/api-table.md#grid-add-2) | `Grid.add` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-59](../agent-loom/api-table.md#grid-space) | `grid.space` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-72](../agent-loom/api-table.md#grid-cell-size) | `grid.cellSize` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-73](../agent-loom/api-table.md#grid-fields) | `grid.fields` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-64](../agent-loom/api-table.md#grid-field-at) | `grid.fieldAt` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-65](../agent-loom/api-table.md#grid-neighbors) | `grid.neighbors` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-66](../agent-loom/api-table.md#grid-agents-at) | `grid.agentsAt` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-67](../agent-loom/api-table.md#grid-agents-at-2) | `grid.agentsAt` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-68](../agent-loom/api-table.md#grid-diffuse) | `grid.diffuse` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |

## Field

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-60](../agent-loom/api-table.md#field-id) | `field.id` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-61](../agent-loom/api-table.md#field-grid) | `field.grid` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-69](../agent-loom/api-table.md#field-x) | `field.x` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-70](../agent-loom/api-table.md#field-y) | `field.y` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-71](../agent-loom/api-table.md#field-z) | `field.z` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-4](../agent-loom/api-table.md#type-field) | `Field` | A4 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |

## Graph

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-78](../agent-loom/api-table.md#graph-add) | `Graph.add` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-79](../agent-loom/api-table.md#graph-add-2) | `Graph.add` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-115](../agent-loom/api-table.md#graph-generate) | `graph.generate` | A5 | Delivered | All eleven existing-binding kinds; five-script freezec872f65 before runtime0a66507. Atomic owner batches, explicit RNG/order and caps; complete468-test/170-script integrated check and packed consumer pass. Independent approval pending; native NW variants remain separate. |
| [api-131](../agent-loom/api-table.md#graph-parallel) | `graph.parallel` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-132](../agent-loom/api-table.md#graph-self-loops) | `graph.selfLoops` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-85](../agent-loom/api-table.md#graph-delete) | `graph.delete` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-86](../agent-loom/api-table.md#graph-view) | `graph.view` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-87](../agent-loom/api-table.md#graph-copy) | `graph.copy` | A5 | Partial | Current nonspatial Graph copy delivered after five-script freeze2488cf5: canonical nodes, independent cloned edge owners, lossless direction conversion, guarded preflight and lifecycle tests. All current paths are undefined; future spatial path coverage remains open. [Evidence](graph-copy-runtime.md). |
| [api-89](../agent-loom/api-table.md#graph-traverse) | `graph.traverse` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-90](../agent-loom/api-table.md#graph-reachable) | `graph.reachable` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-91](../agent-loom/api-table.md#graph-components) | `graph.components` | A5 | Delivered | Weak/strong/biconnected pure canonical snapshots, including isolates/parallel edges/loops and directed-mode validation. [Frozen public contract](graph-connectivity-contract.md), examples/connectivity and tests/graph-connectivity.test.ts; packed consumer passed. Independent review pending. |
| [api-92](../agent-loom/api-table.md#graph-connected) | `graph.connected` | A5 | Delivered | Weak/strong connectivity with explicit empty/singleton convention. [Frozen public contract](graph-connectivity-contract.md), examples/connectivity and tests/graph-connectivity.test.ts; packed consumer passed. Independent review pending. |
| [api-93](../agent-loom/api-table.md#graph-bridges) | `graph.bridges` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-94](../agent-loom/api-table.md#graph-articulations) | `graph.articulations` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-96](../agent-loom/api-table.md#graph-find-route) | `graph.findRoute` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-97](../agent-loom/api-table.md#graph-distances) | `graph.distances` | A5 | Delivered | Exact dyadic weighted Heap-Dijkstra/Bellman–Ford and unit BFS; guarded once-per-query costs, finite rounding/negative cycles. [Contract](graph-distances-contract.md), [precision](graph-distance-precision-contract.md), ten frozen scripts and independent oracles; packed consumer passed. Independent approval pending. |
| [api-98](../agent-loom/api-table.md#graph-all-distances) | `graph.allDistances` | A5 | Delivered | Canonical every-source distance maps, single top-level edge-cost capture and exact weighted routing; [contract](graph-distances-contract.md), [precision](graph-distance-precision-contract.md), tests/graph-distances.test.ts and packed consumer. Independent approval pending. |
| [api-99](../agent-loom/api-table.md#graph-routes) | `graph.routes` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-100](../agent-loom/api-table.md#graph-distance-summary) | `graph.distanceSummary` | A5 | Delivered | Ordered reachable-pair summaries, explicit disconnected/empty domains and exact aggregation of published distances. [Contract](graph-distances-contract.md), [precision](graph-distance-precision-contract.md), frozen scripts/tests/packed consumer. Independent approval pending. |
| [api-101](../agent-loom/api-table.md#graph-analyze) | `graph.analyze` | A5 | Delivered | All five binding measures: degree, closeness, exact rational betweenness, shifted-L2 eigenvector and PageRank. [Accepted contract](network-analysis-contract.md), five frozen public scripts, independent rational/spectral oracles and [complete check](network-analysis-evidence/checks.json). Independent approval pending. |
| [api-102](../agent-loom/api-table.md#graph-triangles) | `graph.triangles` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-103](../agent-loom/api-table.md#graph-clustering) | `graph.clustering` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-104](../agent-loom/api-table.md#graph-communities) | `graph.communities` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-105](../agent-loom/api-table.md#graph-modularity) | `graph.modularity` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-106](../agent-loom/api-table.md#graph-cliques) | `graph.cliques` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-107](../agent-loom/api-table.md#graph-bipartition) | `graph.bipartition` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-108](../agent-loom/api-table.md#graph-matching) | `graph.matching` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-109](../agent-loom/api-table.md#graph-find-cycle) | `graph.findCycle` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-110](../agent-loom/api-table.md#graph-topological) | `graph.topological` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-111](../agent-loom/api-table.md#graph-transitive) | `graph.transitive` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-112](../agent-loom/api-table.md#graph-is-tree) | `graph.isTree` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-113](../agent-loom/api-table.md#graph-spanning-tree) | `graph.spanningTree` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-114](../agent-loom/api-table.md#graph-flow) | `graph.flow` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-117](../agent-loom/api-table.md#graph-to-data) | `graph.toData` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-118](../agent-loom/api-table.md#graph-from-data) | `Graph.fromData` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-119](../agent-loom/api-table.md#graph-from-data-2) | `Graph.fromData` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-121](../agent-loom/api-table.md#graph-matrix) | `graph.matrix` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-122](../agent-loom/api-table.md#graph-from-matrix) | `Graph.fromMatrix` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-123](../agent-loom/api-table.md#graph-layout) | `graph.layout` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-88](../agent-loom/api-table.md#type-readonly-graph) | `ReadonlyGraph` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-95](../agent-loom/api-table.md#type-route) | `Route` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-116](../agent-loom/api-table.md#type-generator-options) | `GeneratorOptions` | A5 | Delivered | All eleven existing-binding kinds; five-script freezec872f65 before runtime0a66507. Atomic owner batches, explicit RNG/order and caps; complete468-test/170-script integrated check and packed consumer pass. Independent approval pending; native NW variants remain separate. |
| [api-120](../agent-loom/api-table.md#type-graph-data) | `GraphData` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-124](../agent-loom/api-table.md#type-layout-options) | `LayoutOptions` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |

## Node

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-127](../agent-loom/api-table.md#graph-nodes-add) | `graph.nodes.add` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-81](../agent-loom/api-table.md#graph-nodes-size) | `graph.nodes.size` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-129](../agent-loom/api-table.md#graph-nodes-symbol-iterator) | `graph.nodes[Symbol.iterator]` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-75](../agent-loom/api-table.md#graph-has-node) | `graph.hasNode` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-77](../agent-loom/api-table.md#graph-neighbors) | `graph.neighbors` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-128](../agent-loom/api-table.md#graph-nodes-delete) | `graph.nodes.delete` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |

## Edge

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-80](../agent-loom/api-table.md#graph-edges-add) | `graph.edges.add` | A5a | Partial | Non-spatial creation/read delivered; spatial path validation and geometry remain open. See [A5a scope/evidence](a5a-evidence.md). |
| [api-edge-id](../agent-loom/api-table.md#edge-id) | `edge.id` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-edge-graph](../agent-loom/api-table.md#edge-graph) | `edge.graph` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-edge-alive](../agent-loom/api-table.md#edge-alive) | `edge.alive` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-133](../agent-loom/api-table.md#edge-from) | `edge.from` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-134](../agent-loom/api-table.md#edge-to) | `edge.to` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-135](../agent-loom/api-table.md#edge-directed) | `edge.directed` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-136](../agent-loom/api-table.md#edge-key) | `edge.key` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-137](../agent-loom/api-table.md#edge-path) | `edge.path` | A5a | Partial | Non-spatial creation/read delivered; spatial path validation and geometry remain open. See [A5a scope/evidence](a5a-evidence.md). |
| [api-126](../agent-loom/api-table.md#edge-tie-mode) | `edge.tieMode` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-82](../agent-loom/api-table.md#graph-edges-size) | `graph.edges.size` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-83](../agent-loom/api-table.md#graph-edges-has) | `graph.edges.has` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-84](../agent-loom/api-table.md#graph-edges-between) | `graph.edges.between` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-76](../agent-loom/api-table.md#graph-has-edge) | `graph.hasEdge` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-130](../agent-loom/api-table.md#graph-edges-symbol-iterator) | `graph.edges[Symbol.iterator]` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-125](../agent-loom/api-table.md#edge-tie) | `edge.tie` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |
| [api-74](../agent-loom/api-table.md#edge-delete) | `edge.delete` | A5a | Delivered | Non-spatial kernel: [five public examples](a5a-examples.md), boundary/type tests and [acceptance evidence](a5a-evidence.md). |
| [api-5](../agent-loom/api-table.md#type-edge) | `Edge` | A5 | Planned | Split membership, topology, algorithm, generation, layout and interchange families into bounded slices. |

## Random

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-138](../agent-loom/api-table.md#random-add) | `Random.add` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-155](../agent-loom/api-table.md#random-algorithm) | `random.algorithm` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-156](../agent-loom/api-table.md#random-seed) | `random.seed` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-141](../agent-loom/api-table.md#random-number) | `random.number` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-142](../agent-loom/api-table.md#random-number-2) | `random.number` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-143](../agent-loom/api-table.md#random-number-3) | `random.number` | A2b | Partial | Standard Mulberry normal/cache branch delivered with five frozen normal scripts and tested continuation. MT profile remains pending. |
| [api-144](../agent-loom/api-table.md#random-number-4) | `random.number` | A2b | Partial | Standard Mulberry exponential/Poisson delivered after five-script freezebf186c6; source-backed algorithm/endpoints/cache closure, analytical and continuation tests pass. MT signed-mean schedules remain pending. [Evidence](random-exponential-poisson-runtime.md). |
| [api-145](../agent-loom/api-table.md#random-number-5) | `random.number` | A2b | Planned | Full sampling, distributions, raw draws and validated continuation. |
| [api-146](../agent-loom/api-table.md#random-number-6) | `random.number` | A2b | Planned | Full sampling, distributions, raw draws and validated continuation. |
| [api-147](../agent-loom/api-table.md#random-sample) | `random.sample` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-140](../agent-loom/api-table.md#random-state) | `random.state` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-148](../agent-loom/api-table.md#random-reseed) | `random.reseed` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-149](../agent-loom/api-table.md#random-copy) | `random.copy` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-150](../agent-loom/api-table.md#random-local) | `random.local` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-151](../agent-loom/api-table.md#random-raw) | `random.raw` | A2b | Planned | Full sampling, distributions, raw draws and validated continuation. |
| [api-152](../agent-loom/api-table.md#random-raw-2) | `random.raw` | A2b | Planned | Full sampling, distributions, raw draws and validated continuation. |
| [api-153](../agent-loom/api-table.md#random-raw-3) | `random.raw` | A2b | Planned | Full sampling, distributions, raw draws and validated continuation. |
| [api-154](../agent-loom/api-table.md#random-raw-4) | `random.raw` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |
| [api-139](../agent-loom/api-table.md#type-random-state) | `RandomState` | A2a / A2b | Partial | Standard Mulberry branch verified by [five frozen scripts](a2a.md), [runtime/type tests and package checks](a2a-evidence.md). MT/profile-specific branches remain A2b; raw exposes double only. |

## Input

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-157](../agent-loom/api-table.md#input-add) | `Input.add` | A7 | Planned | Validated inputs or pure observation contracts. |
| [api-161](../agent-loom/api-table.md#input-bindings) | `input.bindings` | A7 | Planned | Validated inputs or pure observation contracts. |
| [api-158](../agent-loom/api-table.md#input-add-2) | `input.add` | A7 | Planned | Validated inputs or pure observation contracts. |
| [api-159](../agent-loom/api-table.md#input-set) | `input.set` | A7 | Planned | Validated inputs or pure observation contracts. |
| [api-160](../agent-loom/api-table.md#input-delete) | `input.delete` | A7 | Planned | Validated inputs or pure observation contracts. |

## stats

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-162](../agent-loom/api-table.md#stats-describe) | `stats.describe` | A7 | Planned | Validated inputs or pure observation contracts. |
| [api-163](../agent-loom/api-table.md#stats-histogram) | `stats.histogram` | A7 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-164](../agent-loom/api-table.md#stats-gini) | `stats.gini` | A7 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |
| [api-165](../agent-loom/api-table.md#stats-alignment) | `stats.alignment` | A7 | Planned | Validated inputs or pure observation contracts. |
| [api-166](../agent-loom/api-table.md#type-summary) | `Summary` | A7 | Planned | Validated inputs or pure observation contracts. |
| [api-167](../agent-loom/api-table.md#type-histogram) | `Histogram` | A7 | Partial | Bounded reference-model slice verified by frozen spatial/Grid/stats examples and targeted regressions; complete target contracts remain tracked separately. See [refactor evidence](agent-lab-evidence.md). |

## geometry

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-177](../agent-loom/api-table.md#geometry-contains) | `geometry.contains` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-178](../agent-loom/api-table.md#geometry-normalize) | `geometry.normalize` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-179](../agent-loom/api-table.md#geometry-displacement) | `geometry.displacement` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-180](../agent-loom/api-table.md#geometry-distance) | `geometry.distance` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-181](../agent-loom/api-table.md#geometry-bearing) | `geometry.bearing` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-182](../agent-loom/api-table.md#geometry-neighbors) | `geometry.neighbors` | A3 / A4 | Planned | A3: pure spatial semantics; A4: agreement with Grid cell centers and neighborhoods. |
| [api-183](../agent-loom/api-table.md#geometry-direction) | `geometry.direction` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-184](../agent-loom/api-table.md#geometry-rotate) | `geometry.rotate` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-185](../agent-loom/api-table.md#geometry-rotate-2) | `geometry.rotate` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-186](../agent-loom/api-table.md#geometry-split-path) | `geometry.splitPath` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-187](../agent-loom/api-table.md#geometry-bounds) | `geometry.bounds` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-188](../agent-loom/api-table.md#geometry-map) | `geometry.map` | A3 | Delivered | Both finite affine modes, unclipped output, exact readonly Bounds and canonical positions. [Contract/evidence](affine-map-contract.md), five frozen scripts, boundary tests and packed consumer; no CRS/Planar parser claim. Independent approval pending. |
| [api-169](../agent-loom/api-table.md#type-orientation) | `Orientation` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-170](../agent-loom/api-table.md#type-bounds) | `Bounds` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-171](../agent-loom/api-table.md#type-planar-xy) | `PlanarXY` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-172](../agent-loom/api-table.md#type-planar-polygon) | `PlanarPolygon` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-173](../agent-loom/api-table.md#type-planar-geometry) | `PlanarGeometry` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-174](../agent-loom/api-table.md#type-planar-json) | `PlanarJson` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-175](../agent-loom/api-table.md#type-planar-feature) | `PlanarFeature` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |
| [api-176](../agent-loom/api-table.md#type-planar-dataset) | `PlanarDataset` | A3 | Planned | Pure geometry; stage polygon/planar-data operations separately within A3. |

## Agenda

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-189](../agent-loom/api-table.md#agenda-add) | `Agenda.add` | A6 | Planned | Independent event cursor, ordering, budgets and caller dispatch. |
| [api-195](../agent-loom/api-table.md#agenda-time) | `agenda.time` | A6 | Planned | Independent event cursor, ordering, budgets and caller dispatch. |
| [api-190](../agent-loom/api-table.md#agenda-add-2) | `agenda.add` | A6 | Planned | Independent event cursor, ordering, budgets and caller dispatch. |
| [api-191](../agent-loom/api-table.md#agenda-delete) | `agenda.delete` | A6 | Planned | Independent event cursor, ordering, budgets and caller dispatch. |
| [api-192](../agent-loom/api-table.md#agenda-advance) | `agenda.advance` | A6 | Planned | Independent event cursor, ordering, budgets and caller dispatch. |
| [api-193](../agent-loom/api-table.md#type-event-handle) | `EventHandle` | A6 | Planned | Independent event cursor, ordering, budgets and caller dispatch. |
| [api-194](../agent-loom/api-table.md#type-event) | `Event` | A6 | Planned | Independent event cursor, ordering, budgets and caller dispatch. |

## experiments

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-263](../agent-loom/api-table.md#experiments-design) | `experiments.design` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-264](../agent-loom/api-table.md#experiments-design-2) | `experiments.design` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-265](../agent-loom/api-table.md#experiments-replicate) | `experiments.replicate` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-261](../agent-loom/api-table.md#experiments-run) | `experiments.run` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-262](../agent-loom/api-table.md#experiments-run-2) | `experiments.run` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-266](../agent-loom/api-table.md#experiments-summarize) | `experiments.summarize` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-269](../agent-loom/api-table.md#experiments-bind) | `experiments.bind` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-270](../agent-loom/api-table.md#experiments-run-3) | `experiments.run` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-271](../agent-loom/api-table.md#experiments-evaluate) | `experiments.evaluate` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-272](../agent-loom/api-table.md#experiments-select) | `experiments.select` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-273](../agent-loom/api-table.md#experiments-holdout) | `experiments.holdout` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-274](../agent-loom/api-table.md#experiments-resume) | `experiments.resume` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-267](../agent-loom/api-table.md#experiments-run-4) | `experiments.run` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-258](../agent-loom/api-table.md#type-experiment-model) | `ExperimentModel` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-259](../agent-loom/api-table.md#type-experiment-plan) | `ExperimentPlan` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-260](../agent-loom/api-table.md#type-experiment-options) | `ExperimentOptions` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-268](../agent-loom/api-table.md#type-worker-study-provider) | `WorkerStudyProvider` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-275](../agent-loom/api-table.md#type-study-checkpoint) | `StudyCheckpoint` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-276](../agent-loom/api-table.md#type-widen-study-scalar) | `WidenStudyScalar` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-277](../agent-loom/api-table.md#type-behavior-space-axis) | `BehaviorSpaceAxis` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-278](../agent-loom/api-table.md#type-behavior-space-spec) | `BehaviorSpaceSpec` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-279](../agent-loom/api-table.md#type-behavior-space-measurement) | `BehaviorSpaceMeasurement` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-280](../agent-loom/api-table.md#type-candidate-objective) | `CandidateObjective` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-281](../agent-loom/api-table.md#type-calibration-manifest) | `CalibrationManifest` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-282](../agent-loom/api-table.md#type-candidate-loss) | `CandidateLoss` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-283](../agent-loom/api-table.md#type-candidate-score) | `CandidateScore` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-284](../agent-loom/api-table.md#type-candidate-evaluation) | `CandidateEvaluation` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-selection-measurement](../agent-loom/api-table.md#type-selection-measurement) | `selectionMeasurement` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-285](../agent-loom/api-table.md#type-candidate-selection) | `CandidateSelection` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-286](../agent-loom/api-table.md#type-candidate-holdout) | `CandidateHoldout` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-287](../agent-loom/api-table.md#type-node-study-config) | `NodeStudyConfig` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-288](../agent-loom/api-table.md#type-node-study-registration) | `NodeStudyRegistration` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-289](../agent-loom/api-table.md#type-study-cancellation-signal) | `StudyCancellationSignal` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-290](../agent-loom/api-table.md#type-node-study-outcome) | `NodeStudyOutcome` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-291](../agent-loom/api-table.md#type-node-study-result) | `NodeStudyResult` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-292](../agent-loom/api-table.md#type-study-scalar) | `StudyScalar` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-293](../agent-loom/api-table.md#type-study-parameters) | `StudyParameters` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-294](../agent-loom/api-table.md#type-study-axis) | `StudyAxis` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-295](../agent-loom/api-table.md#type-study-parameter-values) | `StudyParameterValues` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-296](../agent-loom/api-table.md#type-study-axis-for) | `StudyAxisFor` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-297](../agent-loom/api-table.md#type-study-scenario) | `StudyScenario` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-298](../agent-loom/api-table.md#type-planned-run) | `PlannedRun` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-299](../agent-loom/api-table.md#type-study-sample) | `StudySample` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-300](../agent-loom/api-table.md#type-study-phase) | `StudyPhase` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-301](../agent-loom/api-table.md#type-study-error) | `StudyError` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-302](../agent-loom/api-table.md#type-study-status) | `StudyStatus` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-303](../agent-loom/api-table.md#type-study-terminal) | `StudyTerminal` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-304](../agent-loom/api-table.md#type-study-outcome) | `StudyOutcome` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-305](../agent-loom/api-table.md#type-study-result) | `StudyResult` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-306](../agent-loom/api-table.md#type-replication-summary) | `ReplicationSummary` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-307](../agent-loom/api-table.md#type-behavior-space-bindings) | `BehaviorSpaceBindings` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |
| [api-308](../agent-loom/api-table.md#type-bound-behavior-space) | `BoundBehaviorSpace` | A8 | Planned | Subdivide run/design, worker hosting, calibration and study continuation; no single all-at-once implementation. |

## storage

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-326](../agent-loom/api-table.md#storage-save) | `storage.save` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-363](../agent-loom/api-table.md#storage-save-2) | `storage.save` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-364](../agent-loom/api-table.md#storage-save-3) | `storage.save` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-366](../agent-loom/api-table.md#storage-load) | `storage.load` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-329](../agent-loom/api-table.md#storage-encode) | `storage.encode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-342](../agent-loom/api-table.md#storage-decode) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-335](../agent-loom/api-table.md#storage-encode-2) | `storage.encode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-336](../agent-loom/api-table.md#storage-decode-2) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-338](../agent-loom/api-table.md#storage-history) | `storage.history` | A7 / A8 | Planned | A7: bounded detached observations; A8: supported snapshot and codec roundtrips. |
| [api-340](../agent-loom/api-table.md#history-samples) | `history.samples` | A7 / A8 | Planned | A7: bounded detached observations; A8: supported snapshot and codec roundtrips. |
| [api-339](../agent-loom/api-table.md#history-add) | `history.add` | A7 / A8 | Planned | A7: bounded detached observations; A8: supported snapshot and codec roundtrips. |
| [api-341](../agent-loom/api-table.md#history-delete) | `history.delete` | A7 / A8 | Planned | A7: bounded detached observations; A8: supported snapshot and codec roundtrips. |
| [api-345](../agent-loom/api-table.md#storage-is) | `storage.is` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-321](../agent-loom/api-table.md#storage-encode-3) | `storage.encode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-322](../agent-loom/api-table.md#storage-decode-3) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-323](../agent-loom/api-table.md#storage-decode-4) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-324](../agent-loom/api-table.md#storage-encode-4) | `storage.encode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-325](../agent-loom/api-table.md#storage-decode-5) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-365](../agent-loom/api-table.md#storage-decode-6) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-367](../agent-loom/api-table.md#storage-decode-7) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-368](../agent-loom/api-table.md#storage-decode-8) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-369](../agent-loom/api-table.md#storage-decode-9) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-370](../agent-loom/api-table.md#storage-encode-5) | `storage.encode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-371](../agent-loom/api-table.md#storage-encode-6) | `storage.encode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-372](../agent-loom/api-table.md#storage-decode-10) | `storage.decode` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-333](../agent-loom/api-table.md#type-data-snapshot) | `DataSnapshot` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-334](../agent-loom/api-table.md#type-format) | `Format` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-343](../agent-loom/api-table.md#type-decode-limits) | `DecodeLimits` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-344](../agent-loom/api-table.md#type-stored-kinds) | `StoredKinds` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-373](../agent-loom/api-table.md#type-snapshot) | `Snapshot` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-374](../agent-loom/api-table.md#type-world-snapshot) | `WorldSnapshot` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-375](../agent-loom/api-table.md#type-bundle-snapshot) | `BundleSnapshot` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-376](../agent-loom/api-table.md#type-sample) | `Sample` | A7 / A8 | Planned | A7: bounded detached observations; A8: supported snapshot and codec roundtrips. |
| [api-377](../agent-loom/api-table.md#type-history) | `History` | A7 / A8 | Planned | A7: bounded detached observations; A8: supported snapshot and codec roundtrips. |
| [api-379](../agent-loom/api-table.md#type-legacy-network-data) | `LegacyNetworkData` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-346](../agent-loom/api-table.md#type-wire-value) | `WireValue` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-347](../agent-loom/api-table.md#type-ref) | `Ref` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-348](../agent-loom/api-table.md#type-wire-envelope) | `WireEnvelope` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-349](../agent-loom/api-table.md#type-wire-record) | `WireRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-350](../agent-loom/api-table.md#type-world-record) | `WorldRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-351](../agent-loom/api-table.md#type-agent-record) | `AgentRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-352](../agent-loom/api-table.md#type-grid-record) | `GridRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-353](../agent-loom/api-table.md#type-field-record) | `FieldRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-354](../agent-loom/api-table.md#type-graph-record) | `GraphRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-355](../agent-loom/api-table.md#type-edge-record) | `EdgeRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-356](../agent-loom/api-table.md#type-random-record) | `RandomRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-357](../agent-loom/api-table.md#type-input-record) | `InputRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-358](../agent-loom/api-table.md#type-agenda-record) | `AgendaRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-359](../agent-loom/api-table.md#type-history-record) | `HistoryRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-360](../agent-loom/api-table.md#type-handle-record) | `HandleRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-361](../agent-loom/api-table.md#type-extension-record) | `ExtensionRecord` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |
| [api-362](../agent-loom/api-table.md#type-value-codec) | `ValueCodec` | A8 | Planned | Subdivide selected data, component/bundle snapshots, formats and complete continuation. |

## limits

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-378](../agent-loom/api-table.md#limits-netlogo) | `limits.netlogo` | A2 / A6 | Planned | Pinned compatibility RNG and activation budgets. |
| [api-378-geojson](../agent-loom/api-table.md#limits-geojson) | `limits.geojson` | A3 / A5 / A8 | Planned | Planar geometry validation, graph interchange and storage formats. |
| [api-378-compatibilityNetwork](../agent-loom/api-table.md#limits-compatibility-network) | `limits.compatibilityNetwork` | A5 / A8 | Planned | Legacy network interchange and storage decoding. |
| [api-378-behaviorspace](../agent-loom/api-table.md#limits-behaviorspace) | `limits.behaviorspace` | A8 | Planned | BehaviorSpace import/binding budgets. |
| [api-378-study](../agent-loom/api-table.md#limits-study) | `limits.study` | A8 | Planned | Finite experiment, sample and planning budgets. |

## Exports and shared types

| Source entry ID | Operation / type | Delivery | Status | Scope / evidence needed |
| --- | --- | --- | --- | --- |
| [api-1](../agent-loom/api-table.md#exports-agent-loom) | `agent-loom` | A1–A8 | Partial | Deliberate root exports grow only with delivered contracts; City Library package-name mapping is a separate explicit decision. A1 evidence: [five scripts](a1.md#author-task-and-frozen-examples), [tests and checks](a1-evidence.md); review findings and author responses recorded. |
| [api-8](../agent-loom/api-table.md#exports-agent-loom-storage) | `agent-loom/storage` | A7 / A8 | Planned | History and storage entry; reconcile City Library subpath explicitly. |
| [api-9](../agent-loom/api-table.md#exports-agent-loom-experiments-node) | `agent-loom/experiments/node` | A8 | Planned | Explicit host-only entry; never loaded eagerly by the root. |
| [api-2](../agent-loom/api-table.md#type-space) | `Space` | A3 | Planned | Dimensions, extents and normalized boundary semantics. |
| [api-6](../agent-loom/api-table.md#type-vector) | `Vector` | A3 | Planned | Movement displacement input. |
| [api-7](../agent-loom/api-table.md#type-component) | `Component` | A1–A7 | Planned | A1 Agent closure; extend as Grid/Graph/Agenda/Input actually arrive. No public named type is exported in A1. |
| [api-168](../agent-loom/api-table.md#type-position) | `Position` | A1 / A3 | Planned | A1 Agent default coordinate readback; A3 complete structural XY/XYZ input contract. No public named type is exported in A1. |
