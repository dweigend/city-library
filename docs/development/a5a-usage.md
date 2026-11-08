# Graph kernel and network diffusion usage

The bounded A5a slice exposes `Graph` and the `Graph`/`Edge` types through `city-library`. Graphs work without a World, coordinates or a renderer. The [five public examples](a5a-examples.md) are executable acceptance contracts; the [binding reference](../agent-loom/api-reference.md#graph-representations) remains the complete target.

## Original objects and persistent contacts

```ts
import { Agent, Graph, World, run } from "city-library";

const people = [
  Agent.add({ informed: true }),
  Agent.add({ informed: false }),
  Agent.add({ informed: false }),
];
const graph = Graph.add<typeof people[number], { strength: number }>({
  edgeState: { strength: 1 },
});
for (const person of people) graph.nodes.add(person);
graph.edges.add({ from: people[0]!, to: people[1]! });
graph.edges.add({ from: people[1]!, to: people[2]! });

const world = World.add();
world.add(people);
run(world, () => {
  const previous = new Map(people.map((person) => [person, person.informed]));
  const next = people.map((person) => previous.get(person) ||
    graph.neighbors(person).some((neighbor) => previous.get(neighbor)));
  people.forEach((person, index) => { person.informed = next[index]!; });
});
// Exactly people[0] and people[1] are informed; people[2] waits for the next tick.
```

The Graph retains the supplied objects. Registering an Agent in a Graph neither copies it nor attaches it to a World. Nodes may belong to multiple graphs. Removing node membership deletes incident edges only in that graph. Agent deletion removes its membership and incident edges across all graphs; World detachment preserves them. Graph deletion clears contents, preserving node objects and the usable graph itself.

Simple undirected duplicates return the same edge. Direction belongs to each edge; opposite directed edges may coexist. Mixed connections for a pair require `parallel: true`; parallel graph-global keys and self-loops have explicit opt-ins. Custom edge state is copied independently at creation and then written directly by headless model code. Endpoint/identity/representation fields remain immutable.

Query arrays are frozen snapshots of canonical references. Node/edge collection iteration is insertion-ordered; structural mutation during active iteration throws before changing anything. Capture `Array.from(graph.nodes)` or `Array.from(graph.edges)` first when a model intends to change structure. Closing a manual iterator releases its guard. Agent deletion preflights every participating graph before detaching or deleting anything.

## Interactive headless composition

```ts
import { createNetworkDiffusionModel } from "../../examples/models/network-diffusion.ts";

const model = createNetworkDiffusionModel({
  count: 60,
  seed: 1,
  topology: "communities",
  transmission: 0.35,
  activeTicks: 6,
  bridges: false,
});
model.advance(100);
const observation = model.read();
// Agent Lab imports this same composition; no browser is required here.
```

The model import is a repository example composition, not a new package export. From the repository root, import `./examples/models/network-diffusion.ts` instead. The first example block above is the public library authoring surface; its rule is deliberately simpler than the probabilistic interactive composition.

Agents progress from unaware to active to settled. An active node can transmit through actual contacts for a configured number of ticks. Several active neighbors combine exposure using `1 - (1 - transmission)^k`. Every tick reads the old state of all agents and commits next values together. A newly activated node cannot transmit within that same tick. Fixed seeds, node order and explicit zero/one probability draw rules make replay deterministic.

Communities are three explicitly constructed contact groups; bridges connect consecutive groups. Ring and hub fixtures expose different propagation patterns. These are caller-written example topologies, not implementations of `graph.generate`, community detection or layout algorithms. The simulator is illustrative and makes no empirical predictions.

`select(id)`, `seedSelected()` and `setBridges(boolean)` are explicit model actions. Only an unaware selected node can be externally activated. Bridge edits are available for communities and affect future exposure without resetting existing adoption. Readbacks contain all persistent edges, node states, selected degree, counts, completion, RNG continuation and bounded count history. They never contain writable live Graph/Agent objects.

## Current boundary

The delivered kernel includes creation/representation, node and edge membership, direction queries, lifecycle and supported-state copying. Spatial edge paths/ties, World graph attachment, views/copy, routing/analysis/generators/layouts and interchange remain future slices. Supplying unsupported spatial paths rejects explicitly. Broad reference entries remain partial where those branches are pending.

The external lab owns drawing and display coordinates only. Run/Pause controls are explicit callers of the same headless model. Counts, history, contact creation and spread rules come from that model; Cytoscape does not invent or simulate them.
