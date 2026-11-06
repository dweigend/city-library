import { validateOptions } from "../../agent/state.ts";
import type { Edge } from "../edge.ts";
import { addCosts, dyadic, roundedCost, unitCost } from "./dyadic-costs.ts";

type Algorithm = "auto" | "breadth" | "dijkstra" | "bellman-ford";
export interface DistanceOptions<N extends object, E extends object> {
  cost?: (edge: Edge<N, E>) => number;
  algorithm?: Algorithm;
}
export interface SummaryOptions<N extends object, E extends object> {
  cost?: (edge: Edge<N, E>) => number;
  disconnected?: "reachable" | "reject";
}
export interface DistanceSummary<N extends object> {
  readonly mean?: number;
  readonly diameter?: number;
  readonly radius?: number;
  readonly eccentricity: ReadonlyMap<N, number>;
  readonly reachablePairs: number;
}
interface Arc<N> { to: N; cost: bigint }
interface Prepared<N> { nodes: readonly N[]; adjacency: Map<N, Arc<N>[]> }
type Cost<N extends object, E extends object> = (edge: Edge<N, E>) => number;

function costOption<N extends object, E extends object>(value: unknown): Cost<N, E> | undefined {
  if (value !== undefined && typeof value !== "function") throw new TypeError("Cost must be a function.");
  return value as Cost<N, E> | undefined;
}
function algorithmOption(value: unknown, cost: unknown): Exclude<Algorithm, "auto"> {
  if (value !== undefined && value !== "auto" && value !== "breadth" && value !== "dijkstra" && value !== "bellman-ford")
    throw new TypeError("Invalid distance algorithm.");
  if (value === "breadth" && cost !== undefined) throw new TypeError("Breadth does not accept explicit costs.");
  return value === undefined || value === "auto" ? cost === undefined ? "breadth" : "dijkstra" : value;
}
/** Consume the actual guarded collection, keeping callbacks inside its read lock.
 * Each top-level query owns this snapshot; no weights survive between queries. */
function prepare<N extends object, E extends object>(nodes: readonly N[], edges: Iterable<Edge<N, E>>, cost: Cost<N, E> | undefined, signed: boolean): Prepared<N> {
  const adjacency = new Map(nodes.map(node => [node, [] as Arc<N>[]]));
  for (const edge of edges) {
    const weight = cost === undefined ? 1 : cost(edge);
    if (typeof weight !== "number" || !Number.isFinite(weight)) throw new TypeError("Edge cost must be a finite number.");
    if (!signed && weight < 0) throw new RangeError("Negative costs require explicit Bellman–Ford.");
    const exact = cost === undefined ? unitCost : dyadic(weight);
    adjacency.get(edge.from)!.push({ to: edge.to, cost: exact });
    if (!edge.directed && edge.from !== edge.to) adjacency.get(edge.to)!.push({ to: edge.from, cost: exact });
  }
  return { nodes, adjacency };
}
function sum(a: number, b: number): number {
  const result = a + b;
  if (!Number.isFinite(result)) throw new RangeError("Accumulated distance must remain finite.");
  return result;
}
function breadth<N>(graph: Prepared<N>, from: N): Map<N, number> {
  const result = new Map([[from, 0]]);
  const queue = [from];
  for (let index = 0; index < queue.length; index++) {
    const node = queue[index]!;
    for (const arc of graph.adjacency.get(node)!) if (!result.has(arc.to)) {
      result.set(arc.to, sum(result.get(node)!, 1));
      queue.push(arc.to);
    }
  }
  return result;
}
/** Lazy binary min heap: stale improvements are discarded when popped. */
function dijkstra<N>(graph: Prepared<N>, from: N): Map<N, bigint> {
  const result = new Map([[from, 0n]]);
  const heap: { node: N; value: bigint }[] = [];
  function push(node: N, value: bigint) {
    let index = heap.length;
    heap.push({ node, value });
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (heap[parent]!.value <= value) break;
      heap[index] = heap[parent]!;
      index = parent;
    }
    heap[index] = { node, value };
  }
  function pop() {
    const first = heap[0]!;
    const last = heap.pop()!;
    if (heap.length) {
      let index = 0;
      while (index * 2 + 1 < heap.length) {
        let child = index * 2 + 1;
        if (child + 1 < heap.length && heap[child + 1]!.value < heap[child]!.value) child++;
        if (last.value <= heap[child]!.value) break;
        heap[index] = heap[child]!;
        index = child;
      }
      heap[index] = last;
    }
    return first;
  }
  push(from, 0n);
  while (heap.length) {
    const { node, value } = pop();
    if (result.get(node) !== value) continue;
    for (const arc of graph.adjacency.get(node)!) {
      const candidate = addCosts(value, arc.cost);
      const previous = result.get(arc.to);
      if (previous === undefined || candidate < previous) {
        result.set(arc.to, candidate);
        push(arc.to, candidate);
      }
    }
  }
  return result;
}
function bellmanFord<N>(graph: Prepared<N>, from: N): Map<N, bigint> {
  const result = new Map([[from, 0n]]);
  for (let pass = 0; pass < graph.nodes.length; pass++) {
    let changed = false;
    for (const node of graph.nodes) {
      const value = result.get(node);
      if (value === undefined) continue;
      for (const arc of graph.adjacency.get(node)!) {
        const candidate = addCosts(value, arc.cost);
        const previous = result.get(arc.to);
        if (previous === undefined || candidate < previous) {
          if (pass === graph.nodes.length - 1) throw new RangeError("Reachable negative cycle.");
          result.set(arc.to, candidate);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
  return result;
}
function run<N>(graph: Prepared<N>, from: N, algorithm: Exclude<Algorithm, "auto">): Map<N, number> {
  if (algorithm === "breadth") return breadth(graph, from);
  const exact = algorithm === "dijkstra" ? dijkstra(graph, from) : bellmanFord(graph, from);
  return new Map([...exact].map(([node, value]) => [node, roundedCost(value)]));
}
export function distances<N extends object, E extends object>(nodes: readonly N[], edges: Iterable<Edge<N, E>>, options: DistanceOptions<N, E> & { from: N }): ReadonlyMap<N, number> {
  const settings = validateOptions(options, ["from", "cost", "algorithm"]);
  if (!nodes.includes(settings.from as N)) throw new TypeError("Expected a current graph node.");
  const cost = costOption<N, E>(settings.cost);
  const algorithm = algorithmOption(settings.algorithm, cost);
  return run(prepare(nodes, edges, cost, algorithm === "bellman-ford"), settings.from as N, algorithm);
}
export function allDistances<N extends object, E extends object>(nodes: readonly N[], edges: Iterable<Edge<N, E>>, options: DistanceOptions<N, E>): ReadonlyMap<N, ReadonlyMap<N, number>> {
  const settings = validateOptions(options, ["cost", "algorithm"]);
  const cost = costOption<N, E>(settings.cost);
  const algorithm = algorithmOption(settings.algorithm, cost);
  const graph = prepare(nodes, edges, cost, algorithm === "bellman-ford");
  return new Map(nodes.map(from => [from, run(graph, from, algorithm)]));
}
export function distanceSummary<N extends object, E extends object>(nodes: readonly N[], edges: Iterable<Edge<N, E>>, options: SummaryOptions<N, E>): DistanceSummary<N> {
  const settings = validateOptions(options, ["cost", "disconnected"]);
  const cost = costOption<N, E>(settings.cost);
  if (settings.disconnected !== undefined && settings.disconnected !== "reachable" && settings.disconnected !== "reject")
    throw new TypeError("Invalid disconnected policy.");
  const graph = prepare(nodes, edges, cost, false);
  const eccentricity = new Map<N, number>();
  let total = 0n;
  let reachablePairs = 0, diameter = 0, radius = Infinity;
  for (const from of nodes) {
    const result = run(graph, from, cost === undefined ? "breadth" : "dijkstra");
    if (settings.disconnected === "reject" && result.size !== nodes.length) throw new RangeError("Graph has unreachable pairs.");
    let maximum = 0;
    for (const [to, distance] of result) if (to !== from) {
      total = addCosts(total, dyadic(distance));
      reachablePairs++;
      maximum = Math.max(maximum, distance);
    }
    eccentricity.set(from, maximum);
    diameter = Math.max(diameter, maximum);
    radius = Math.min(radius, maximum);
  }
  return Object.freeze({
    ...(reachablePairs ? { mean: roundedCost(total) / reachablePairs } : {}),
    ...(nodes.length ? { diameter, radius } : {}),
    eccentricity, reachablePairs,
  });
}
