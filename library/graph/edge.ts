import { issueId, registerFramework } from "../agent/lifecycle.ts";
import { cloneModelState } from "../agent/state.ts";
import type { Graph } from "./graph.ts";

interface EdgeMembers<N extends object, E extends object> {
  /** Stable framework identity. */
  readonly id: string;
  readonly graph: Graph<N, E>;
  /** False after the edge, an endpoint or its graph is deleted. */
  readonly alive: boolean;
  readonly from: N;
  readonly to: N;
  readonly directed: boolean;
  /** Parallel-graph identity; always undefined in simple graphs. */
  readonly key: string | undefined;
  /** Reserved for optional edge geometry; currently always undefined. */
  readonly path: undefined;
  /** Removes this edge from its graph; repeated calls are no-ops. */
  delete(): void;
}
/** Canonical graph-owned connection whose own model state E stays directly writable. */
export type Edge<N extends object = object, E extends object = {}> = E & EdgeMembers<N, E>;

/** Framework members defined on every Edge; copies exclude exactly these keys from model state. */
export const edgeMemberKeys: ReadonlySet<string> = new Set(["id", "graph", "alive", "from", "to", "directed", "key", "path", "delete"]);
// tie/tieMode are additionally reserved for the specified edge motion relation.
const reservedEdgeKeys = new Set([...edgeMemberKeys, "tie", "tieMode"]);

/** One validated edge before it receives framework identity. */
export interface EdgeDraft<N extends object, E extends object> {
  readonly from: N;
  readonly to: N;
  readonly directed: boolean;
  readonly key: string | undefined;
  readonly state: E;
}

export function cloneEdgeState<E extends object>(state: E): E {
  return cloneModelState(state, reservedEdgeKeys, "Edge");
}

/** Turns the owned draft state into the canonical Edge; the caller publishes it. */
export function createEdge<N extends object, E extends object>(
  graph: Graph<N, E>, draft: EdgeDraft<N, E>, remove: (edge: Edge<N, E>) => void,
): Edge<N, E> {
  const edge = draft.state as Edge<N, E>;
  const record = registerFramework(edge, "edge");
  Object.defineProperties(edge, {
    id: { value: issueId(), enumerable: true }, graph: { value: graph, enumerable: true },
    alive: { get: () => record.alive, enumerable: true },
    from: { value: draft.from, enumerable: true }, to: { value: draft.to, enumerable: true },
    directed: { value: draft.directed, enumerable: true }, key: { value: draft.key, enumerable: true },
    path: { value: undefined, enumerable: true },
    delete: { value: () => { if (record.alive) remove(edge); } },
  });
  return edge;
}
