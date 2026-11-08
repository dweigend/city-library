import { issueId, registerFramework } from "../agent/lifecycle.ts";
import { cloneModelState } from "../agent/state.ts";
import type { Graph } from "./graph.ts";

interface EdgeMembers<N extends object, E extends object> {
  readonly id: string;
  readonly graph: Graph<N, E>;
  readonly alive: boolean;
  readonly from: N;
  readonly to: N;
  readonly directed: boolean;
  readonly key: string | undefined;
  readonly path: undefined;
  delete(): void;
}
export type Edge<N extends object = object, E extends object = {}> = E & EdgeMembers<N, E>;
const reserved = new Set(["id", "graph", "alive", "from", "to", "directed", "key", "path", "delete", "tie", "tieMode"]);
export function cloneEdgeState<E extends object>(state: E): E {
  return cloneModelState(state, reserved, "Edge");
}
export function createEdge<N extends object, E extends object>(
  graph: Graph<N, E>, from: N, to: N, directed: boolean, key: string | undefined,
  state: E, remove: (edge: Edge<N, E>) => void,
): Edge<N, E> {
  const edge = state as Edge<N, E>;
  const record = registerFramework(edge, "edge");
  Object.defineProperties(edge, {
    id: { value: issueId(), enumerable: true }, graph: { value: graph, enumerable: true },
    alive: { get: () => record.alive, enumerable: true },
    from: { value: from, enumerable: true }, to: { value: to, enumerable: true },
    directed: { value: directed, enumerable: true }, key: { value: key, enumerable: true },
    path: { value: undefined, enumerable: true },
    delete: { value: () => { if (record.alive) remove(edge); } },
  });
  return edge;
}
