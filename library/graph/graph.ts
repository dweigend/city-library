import { frameworkOwner, frameworkRecord, registerFramework, type DeletionParticipant } from "../agent/lifecycle.ts";
import { validateOptions } from "../agent/state.ts";
import { collectionGuard } from "./collections.ts";
import { cloneEdgeState, createEdge, type Edge } from "./edge.ts";
import { isConnectingEdge, direction, opposite, type Direction } from "./queries.ts";
import { components, type ComponentMode } from "./algorithms/connectivity.ts";
import { distances, allDistances, distanceSummary, type DistanceOptions, type DistanceSummary, type SummaryOptions } from "./algorithms/distances.ts";
import { analyze, type AnalysisOptions } from "./algorithms/analysis.ts";
import { validateGenerator, type GeneratorOptions } from "./generators/options.ts";
import { planGenerator } from "./generators/planning.ts";
import { prepareCopy, type PreparedCopy } from "./copy.ts";

interface EdgeOptions<N extends object, E extends object> {
  from: N; to: N; directed?: boolean; key?: string; state?: E;
}
/**
 * Topology and lifecycle owner for canonical object nodes and Edges.
 * Collections iterate in insertion order; structural changes during an
 * active iteration or query callback throw. Query results are detached.
 */
export interface Graph<N extends object = object, E extends object = {}> {
  /** Whether several edges may join the same endpoints; such edges carry keys. */
  readonly parallel: boolean;
  readonly selfLoops: boolean;
  /** Adding a current member returns it unchanged; deleting a node removes its incident edges. */
  readonly nodes: Iterable<N> & { readonly size: number; add(node: N): N; delete(node: N): void };
  readonly edges: Iterable<Edge<N, E>> & {
    readonly size: number;
    /**
     * Connects two current members with a copy of `state` or the graph's edgeState.
     * Simple graphs return an existing matching edge; parallel graphs return the
     * edge of a supplied key that matches, or generate a decimal key.
     */
    add(options: EdgeOptions<N, E>): Edge<N, E>;
    has(edge: Edge<N, E>): boolean;
    /** Matching edges in insertion order; direction defaults to "out". */
    between(from: N, to: N, options?: { direction?: Direction }): readonly Edge<N, E>[];
  };
  hasNode(node: N): boolean;
  hasEdge(from: N, to: N): boolean;
  /** Distinct adjacent nodes in edge insertion order; direction defaults to "out". */
  neighbors(node: N, options?: { direction?: Direction }): readonly N[];
  /** Members follow node insertion order; groups sort lexicographically by member indices. Mode defaults to "weak". */
  components(options?: { mode?: ComponentMode }): readonly (readonly N[])[];
  /** True for at most one node or exactly one component. */
  isConnected(options?: { mode?: Exclude<ComponentMode, "biconnected"> }): boolean;
  distances(options: DistanceOptions<N, E> & { from: N }): ReadonlyMap<N, number>;
  allDistances(options?: DistanceOptions<N, E>): ReadonlyMap<N, ReadonlyMap<N, number>>;
  distanceSummary(options?: SummaryOptions<N, E>): DistanceSummary<N>;
  analyze(options: AnalysisOptions<N, E>): ReadonlyMap<N, number>;
  /**
   * Adds generated edges among selected current members whose induced subgraph
   * is edgeless. Options are validated before any callback or random draw;
   * all edges are published together in planning order.
   */
  generate(options: GeneratorOptions<N>): readonly Edge<N, E>[];
  /**
   * Independent graph over the same canonical nodes with copied edge state.
   * "reverse" flips directed edges; "undirected" removes direction.
   */
  copy(options?: { nodes?: readonly N[]; edges?: readonly Edge<N, E>[]; direction?: "original" | "reverse" | "undirected" }): Graph<N, E>;
  /** Removes all edges and, unless edgesOnly is true, all nodes. */
  delete(options?: { edgesOnly?: boolean }): void;
}
interface GraphOptions<E extends object> { edgeState?: E; parallel?: boolean; selfLoops?: boolean }
function readFlag(value: unknown): boolean {
  if (value !== undefined && typeof value !== "boolean") throw new TypeError("Graph flags must be boolean.");
  return value ?? false;
}
function create<N extends object = object>(options?: { parallel?: boolean; selfLoops?: boolean }): Graph<N, {}>;
function create<N extends object = object, E extends object = {}>(options: { edgeState: E; parallel?: boolean; selfLoops?: boolean }): Graph<N, E>;
function create<N extends object, E extends object>(options: GraphOptions<E> = {}): Graph<N, E> {
  if (arguments.length > 1) throw new TypeError("Graph.create accepts one options record.");
  const settings = validateOptions(options, ["edgeState", "parallel", "selfLoops"]);
  const parallel = readFlag(settings.parallel);
  const selfLoops = readFlag(settings.selfLoops);
  const defaults = cloneEdgeState((Object.hasOwn(settings, "edgeState") ? settings.edgeState : {}) as E);
  return owner<N, E>(parallel, selfLoops, defaults);
}
/** One topology/lifecycle owner, also used for fully prepared independent copies. */
function owner<N extends object, E extends object>(parallel: boolean, selfLoops: boolean, defaults: E, initial?: PreparedCopy<N, E>): Graph<N, E> {
  const members = new Set<N>();
  const edges = new Set<Edge<N, E>>();
  const keys = new Map<string, Edge<N, E>>();
  const hooks = new Map<N, DeletionParticipant>();
  function nodeComponent(node: N): object {
    const kind = frameworkRecord(node)?.kind;
    if (kind === "field") return (node as { grid: object }).grid;
    if (kind === "edge") return (node as { graph: object }).graph;
    return node;
  }
  const guard = collectionGuard();
  let nextKey = 0n;

  /** Parallel keys are decimal counters; caller-chosen keys are skipped. */
  function firstFreeKey(cursor: bigint): bigint {
    while (keys.has(String(cursor))) cursor += 1n;
    return cursor;
  }
  function publishEdge(edge: Edge<N, E>) {
    edges.add(edge);
    if (edge.key !== undefined) keys.set(edge.key, edge);
  }

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
    if (hook) {
      frameworkRecord(node)!.deletionParticipants.delete(hook);
      frameworkRecord(nodeComponent(node))?.deletionParticipants.delete(hook);
    }
    hooks.delete(node);
  }
  function between(from: N, to: N, options?: { direction?: Direction }): readonly Edge<N, E>[] {
    const mode = direction(options);
    return Object.freeze([...edges].filter((edge) => isConnectingEdge(edge, from, to, mode)));
  }
  function connectivityMode(options: unknown, allowBiconnected: boolean): ComponentMode {
    const supplied = validateOptions(options, ["mode"]).mode;
    const mode = supplied === undefined ? "weak" : supplied;
    if (mode !== "weak" && mode !== "strong" && !(allowBiconnected && mode === "biconnected"))
      throw new TypeError("Invalid graph connectivity mode.");
    return mode as ComponentMode;
  }
  const graph: Graph<N, E> = {
    parallel, selfLoops,
    nodes: Object.freeze({
      get size() { return members.size; },
      add(node: N) {
        if ((typeof node !== "object" && typeof node !== "function") || node === null) throw new TypeError("Graph nodes must be objects.");
        if (frameworkRecord(node)?.alive === false) throw new TypeError("Deleted framework node.");
        const nodeOwner = frameworkOwner(node);
        const graphOwner = frameworkRecord(graph)?.world;
        if (nodeOwner && graphOwner && nodeOwner !== graphOwner)
          throw new TypeError("Graph node belongs to another World.");
        if (members.has(node)) return node;
        guard.validate();
        members.add(node);
        const record = frameworkRecord(node);
        if (record) {
          const hook: DeletionParticipant = {
            validate: guard.validate,
            commit: () => removeNode(node),
            validateWorld(world) {
              const owner = frameworkRecord(graph)?.world;
              if (owner && owner !== world) throw new TypeError("Graph belongs to another World.");
            },
          };
          hooks.set(node, hook);
          record.deletionParticipants.add(hook);
          frameworkRecord(nodeComponent(node))?.deletionParticipants.add(hook);
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
        const directed = readFlag(values.directed);
        if (!parallel && Object.hasOwn(values, "key")) throw new TypeError("Simple edges have no key.");
        if (values.key !== undefined && (typeof values.key !== "string" || values.key.length === 0)) throw new TypeError("Edge key must be a nonempty string.");
        const state = cloneEdgeState((values.state === undefined ? defaults : values.state) as E);
        let key = values.key as string | undefined;
        if (parallel && key !== undefined) {
          const existing = keys.get(key);
          if (existing) {
            if (existing.directed !== directed || !isConnectingEdge(existing, from, to, "out")) throw new TypeError("Edge key already identifies another connection.");
            return existing;
          }
        }
        if (!parallel) {
          const pair = [...edges].filter((edge) => isConnectingEdge(edge, from, to, "all"));
          if (pair.some((edge) => edge.directed !== directed)) throw new TypeError("Mixed overlap requires parallel mode.");
          const existing = pair.find((edge) => isConnectingEdge(edge, from, to, "out"));
          if (existing) return existing;
        }
        guard.validate();
        if (parallel && key === undefined) {
          nextKey = firstFreeKey(nextKey);
          key = String(nextKey++);
        }
        const edge = createEdge(graph, { from, to, directed, key, state }, removeEdge);
        publishEdge(edge);
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
    components(options = {}) {
      const mode = connectivityMode(options, true);
      return components([...members], [...edges], mode);
    },
    isConnected(options = {}) {
      const mode = connectivityMode(options, false);
      const nodes = [...members];
      return nodes.length <= 1 || components(nodes, [...edges], mode).length === 1;
    },
    distances(options) { return distances([...members], graph.edges, options); },
    allDistances(options = {}) { return allDistances([...members], graph.edges, options); },
    distanceSummary(options = {}) { return distanceSummary([...members], graph.edges, options); },
    analyze(options) { return analyze([...members], graph.edges, options); },
    copy(options = {}) {
      return guard.read(() => {
        const prepared = prepareCopy({ nodes: [...members], edges: [...edges], defaults, parallel, selfLoops }, options);
        return owner(prepared.parallel, prepared.selfLoops, prepared.defaults, prepared);
      });
    },
    generate(options) {
      // Reject enclosing readers before any planning callback or draw.
      guard.validate();
      const config = validateGenerator(options);
      const selected = new Set(config.nodes);
      for (const node of config.nodes) if (!members.has(node)) throw new TypeError("Generator nodes must be current graph members.");
      for (const edge of edges) if (selected.has(edge.from) && selected.has(edge.to)) throw new TypeError("Selected induced subgraph must be edgeless.");
      // Reject defaults that reference deleted components before any planning callback or draw.
      cloneEdgeState(defaults);
      const prepared = guard.read(() => {
        const connections = planGenerator(config);
        // A callback may have deleted a referenced component outside this graph;
        // clone once even without connections so that deletion is still rejected.
        const first = cloneEdgeState(defaults);
        const states = connections.map((_, index) => index === 0 ? first : cloneEdgeState(defaults));
        return { connections, states };
      });
      guard.validate();
      let cursor = nextKey;
      const created = prepared.connections.map(([from, to], index) => {
        let key: string | undefined;
        if (parallel) {
          cursor = firstFreeKey(cursor);
          key = String(cursor++);
        }
        const draft = { from: config.nodes[from]!, to: config.nodes[to]!, directed: config.directed, key, state: prepared.states[index]! };
        return createEdge(graph, draft, removeEdge);
      });
      // No caller code runs between complete materialization and publication.
      for (const edge of created) publishEdge(edge);
      nextKey = cursor;
      return Object.freeze(created);
    },
    delete(options = {}) {
      const edgesOnly = readFlag(validateOptions(options, ["edgesOnly"]).edgesOnly);
      if (edges.size === 0 && (edgesOnly || members.size === 0)) return;
      guard.validate();
      for (const edge of edges) removeEdge(edge);
      if (!edgesOnly) for (const node of members) removeNode(node);
    },
  };
  registerFramework(graph, "graph");
  if (initial) {
    // Preparation already completed every caller-controlled reflection and
    // liveness check. Materialize before registering ANY Agent membership hook.
    const created = initial.edges.map(draft => createEdge(graph, draft, removeEdge));
    for (const node of initial.nodes) graph.nodes.add(node);
    for (const edge of created) publishEdge(edge);
    // Fresh cursor intentionally remains zero; future allocation skips live keys.
  }
  return Object.freeze(graph);
}
export const Graph = Object.freeze({ create });
