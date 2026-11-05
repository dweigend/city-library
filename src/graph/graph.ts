import { frameworkRecord, registerFramework, type DeletionParticipant } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { collectionGuard } from "./collections.ts";
import { cloneEdgeState, createEdge, type Edge } from "./edge.ts";
import { connects, direction, opposite, type Direction } from "./queries.ts";

interface EdgeOptions<N extends object, E extends object> {
  from: N; to: N; directed?: boolean; key?: string; state?: E;
}
export interface Graph<N extends object = object, E extends object = {}> {
  readonly parallel: boolean;
  readonly selfLoops: boolean;
  readonly nodes: Iterable<N> & { readonly size: number; add(node: N): N; delete(node: N): void };
  readonly edges: Iterable<Edge<N, E>> & {
    readonly size: number;
    add(options: EdgeOptions<N, E>): Edge<N, E>;
    has(edge: Edge<N, E>): boolean;
    between(from: N, to: N, options?: { direction?: Direction }): readonly Edge<N, E>[];
  };
  hasNode(node: N): boolean;
  hasEdge(from: N, to: N): boolean;
  neighbors(node: N, options?: { direction?: Direction }): readonly N[];
  delete(options?: { edgesOnly?: boolean }): void;
}
interface GraphOptions<E extends object> { edgeState?: E; parallel?: boolean; selfLoops?: boolean }
function flag(value: unknown): boolean {
  if (value !== undefined && typeof value !== "boolean") throw new TypeError("Graph flags must be boolean.");
  return value ?? false;
}
function add<N extends object = object>(options?: { parallel?: boolean; selfLoops?: boolean }): Graph<N, {}>;
function add<N extends object = object, E extends object = {}>(options: { edgeState: E; parallel?: boolean; selfLoops?: boolean }): Graph<N, E>;
function add<N extends object, E extends object>(options: GraphOptions<E> = {}): Graph<N, E> {
  if (arguments.length > 1) throw new TypeError("Graph.add accepts one options record.");
  const settings = validateOptions(options, ["edgeState", "parallel", "selfLoops"]);
  const parallel = flag(settings.parallel);
  const selfLoops = flag(settings.selfLoops);
  const defaults = cloneEdgeState((Object.hasOwn(settings, "edgeState") ? settings.edgeState : {}) as E);
  const members = new Set<N>();
  const edges = new Set<Edge<N, E>>();
  const keys = new Map<string, Edge<N, E>>();
  const hooks = new Map<N, DeletionParticipant>();
  const guard = collectionGuard();
  let nextKey = 0n;

  function removeEdge(edge: Edge<N, E>) {
    if (!edges.has(edge)) return;
    guard.validate();
    edges.delete(edge);
    if (edge.key !== undefined) keys.delete(edge.key);
    frameworkRecord(edge)!.alive = false;
  }
  function removeNode(node: N) {
    if (!members.has(node)) return;
    guard.validate();
    for (const edge of edges) if (edge.from === node || edge.to === node) removeEdge(edge);
    members.delete(node);
    const hook = hooks.get(node);
    if (hook) frameworkRecord(node)!.deletionParticipants.delete(hook);
    hooks.delete(node);
  }
  function between(from: N, to: N, options?: { direction?: Direction }): readonly Edge<N, E>[] {
    const mode = direction(options);
    return Object.freeze([...edges].filter((edge) => connects(edge, from, to, mode)));
  }
  const graph: Graph<N, E> = {
    parallel, selfLoops,
    nodes: Object.freeze({
      get size() { return members.size; },
      add(node: N) {
        if ((typeof node !== "object" && typeof node !== "function") || node === null) throw new TypeError("Graph nodes must be objects.");
        if (frameworkRecord(node)?.alive === false) throw new TypeError("Deleted framework node.");
        if (members.has(node)) return node;
        guard.validate();
        members.add(node);
        const record = frameworkRecord(node);
        if (record?.kind === "agent") {
          const hook = { validate: guard.validate, commit: () => removeNode(node) };
          hooks.set(node, hook);
          record.deletionParticipants.add(hook);
        }
        return node;
      },
      delete: removeNode,
      [Symbol.iterator]: () => guard.iterate(members),
    }),
    edges: Object.freeze({
      get size() { return edges.size; },
      add(options: EdgeOptions<N, E>) {
        const values = validateOptions(options, ["from", "to", "directed", "key", "state"]);
        const from = values.from as N; const to = values.to as N;
        if (!members.has(from) || !members.has(to)) throw new TypeError("Edge endpoints must already be graph members.");
        if (!selfLoops && from === to) throw new TypeError("Self loops require explicit opt-in.");
        const directed = flag(values.directed);
        if (!parallel && Object.hasOwn(values, "key")) throw new TypeError("Simple edges have no key.");
        if (values.key !== undefined && (typeof values.key !== "string" || values.key.length === 0)) throw new TypeError("Edge key must be a nonempty string.");
        const state = cloneEdgeState((values.state === undefined ? defaults : values.state) as E);
        let key = values.key as string | undefined;
        if (parallel && key !== undefined) {
          const existing = keys.get(key);
          if (existing) {
            if (existing.directed !== directed || !connects(existing, from, to, "out")) throw new TypeError("Edge key already identifies another connection.");
            return existing;
          }
        }
        if (!parallel) {
          const pair = [...edges].filter((edge) => connects(edge, from, to, "all"));
          if (pair.some((edge) => edge.directed !== directed)) throw new TypeError("Mixed overlap requires parallel mode.");
          const existing = pair.find((edge) => connects(edge, from, to, "out"));
          if (existing) return existing;
        }
        guard.validate();
        if (parallel && key === undefined) {
          while (keys.has(String(nextKey))) nextKey += 1n;
          key = String(nextKey++);
        }
        const edge = createEdge(graph, from, to, directed, key, state, removeEdge);
        edges.add(edge);
        if (key !== undefined) keys.set(key, edge);
        return edge;
      },
      has: (edge: Edge<N, E>) => edges.has(edge),
      between,
      [Symbol.iterator]: () => guard.iterate(edges),
    }),
    hasNode: (node) => members.has(node),
    hasEdge: (from, to) => between(from, to).length > 0,
    neighbors(node, options) {
      const mode = direction(options);
      if (!members.has(node)) throw new TypeError("Expected a current graph node.");
      const result = new Set<N>();
      for (const edge of edges) {
        const neighbor = opposite(edge, node, mode);
        if (neighbor !== undefined) result.add(neighbor);
      }
      return Object.freeze([...result]);
    },
    delete(options = {}) {
      const edgesOnly = flag(validateOptions(options, ["edgesOnly"]).edgesOnly);
      if (edges.size === 0 && (edgesOnly || members.size === 0)) return;
      guard.validate();
      for (const edge of edges) removeEdge(edge);
      if (!edgesOnly) for (const node of members) removeNode(node);
    },
  };
  registerFramework(graph, "graph");
  return Object.freeze(graph);
}
export const Graph = Object.freeze({ add });
