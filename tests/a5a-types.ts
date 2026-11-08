import { Agent, Graph, type Edge } from "city-library";
const a = Agent.add({ signal: 1 });
const b = Agent.add({ signal: 2 });
const graph = Graph.add<typeof a, { weight: number }>({ edgeState: { weight: 1 } });
graph.nodes.add(a); graph.nodes.add(b);
const edge: Edge<typeof a, { weight: number }> = graph.edges.add({ from: a, to: b });
edge.weight = 3;
edge.from.signal = 4;
// @ts-expect-error endpoints are immutable
edge.from = b;
// @ts-expect-error identity is immutable
edge.id = "other";
// @ts-expect-error collections are immutable
graph.nodes = new Set();
// @ts-expect-error incorrect edge model property
graph.edges.add({ from: a, to: b, state: { weight: "wrong" } });
// @ts-expect-error a custom edge type requires defaults
Graph.add<typeof a, { weight: number }>();
// @ts-expect-error spatial paths are not delivered
graph.edges.add({ from: a, to: b, path: [] });
