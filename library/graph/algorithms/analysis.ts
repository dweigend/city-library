import { validateOptions } from "../../agent/state.ts";
import type { Edge } from "../edge.ts";
import { dijkstra, type CostGraph } from "./distances.ts";
import { addCosts, dyadic, roundedCost, unitCost } from "./dyadic-costs.ts";
import { one, plus, quotient, timesRatio, zero, type Rational } from "./rational.ts";

/**
 * One node centrality measure. Applicable options depend on `measure`:
 * degree (direction incl. "all", normalized, weight), closeness (direction,
 * disconnected, cost), betweenness (normalized, cost), eigenvector (weight,
 * tolerance, maxIterationCount) and page-rank (additionally damping).
 * Defaults: direction "out", normalized false, disconnected "reachable",
 * unit edge values, damping 0.85, tolerance 1e-9 and maxIterationCount 1000.
 */
export interface AnalysisOptions<N extends object, E extends object> {
  measure: "degree" | "closeness" | "betweenness" | "eigenvector" | "page-rank";
  direction?: "out" | "in" | "all";
  normalized?: boolean;
  disconnected?: "reachable" | "discount";
  cost?: (edge: Edge<N, E>) => number;
  weight?: (edge: Edge<N, E>) => number;
  damping?: number;
  tolerance?: number;
  maxIterationCount?: number;
}
type AnalysisDirection = NonNullable<AnalysisOptions<object, object>["direction"]>;
const optionsByMeasure = {
  degree: ["measure", "direction", "normalized", "weight"],
  closeness: ["measure", "direction", "disconnected", "cost"],
  betweenness: ["measure", "normalized", "cost"],
  eigenvector: ["measure", "weight", "tolerance", "maxIterationCount"],
  "page-rank": ["measure", "weight", "damping", "tolerance", "maxIterationCount"],
} as const;
type Measure = keyof typeof optionsByMeasure;
interface Captured<N> { from: N; to: N; directed: boolean; value: bigint }
const defaultTolerance = 1e-9;
const defaultMaxIterationCount = 1000;
const defaultDamping = 0.85;

function numeric(value: unknown, fallback: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError("Analysis parameters must be finite numbers.");
  return value;
}
function finite(value: number): number {
  if (!Number.isFinite(value)) throw new RangeError("Analysis arithmetic must remain finite.");
  return value;
}
function settings<N extends object, E extends object>(options: AnalysisOptions<N, E>) {
  const values = validateOptions(options, ["measure", "direction", "normalized", "disconnected", "cost", "weight", "damping", "tolerance", "maxIterationCount"]);
  const measure = values.measure;
  if (typeof measure !== "string" || !Object.hasOwn(optionsByMeasure, measure)) throw new TypeError("Invalid graph analysis measure.");
  const allowed: readonly string[] = optionsByMeasure[measure as Measure];
  if (Object.keys(values).some(key => !allowed.includes(key))) throw new TypeError("Inapplicable graph analysis option.");
  const direction = values.direction === undefined ? "out" : values.direction;
  if (direction !== "out" && direction !== "in" && !(measure === "degree" && direction === "all")) throw new TypeError("Invalid analysis direction.");
  const normalized = values.normalized === undefined ? false : values.normalized;
  if (typeof normalized !== "boolean") throw new TypeError("Normalized must be boolean.");
  const disconnected = values.disconnected === undefined ? "reachable" : values.disconnected;
  if (disconnected !== "reachable" && disconnected !== "discount") throw new TypeError("Invalid disconnected policy.");
  const callback = measure === "closeness" || measure === "betweenness" ? values.cost : values.weight;
  if (callback !== undefined && typeof callback !== "function") throw new TypeError("Analysis cost or weight must be a function.");
  const tolerance = numeric(values.tolerance, defaultTolerance);
  const maxIterationCount = numeric(values.maxIterationCount, defaultMaxIterationCount);
  const damping = numeric(values.damping, defaultDamping);
  if (tolerance <= 0 || maxIterationCount <= 0 || !Number.isInteger(maxIterationCount) || damping <= 0 || damping >= 1)
    throw new RangeError("Analysis iteration parameters are outside their supported range.");
  return { measure: measure as Measure, direction: direction as AnalysisDirection, normalized, disconnected,
    callback: callback as ((edge: Edge<N, E>) => number) | undefined, tolerance, maxIterationCount, damping };
}

function capture<N extends object, E extends object>(edges: Iterable<Edge<N, E>>, callback: ((edge: Edge<N, E>) => number) | undefined, positive: boolean): Captured<N>[] {
  const result: Captured<N>[] = [];
  // The actual graph iterable holds the structural guard across callbacks.
  for (const edge of edges) {
    const value = callback === undefined ? 1 : callback(edge);
    if (typeof value !== "number" || !Number.isFinite(value)) throw new TypeError("Analysis edge value must be a finite number.");
    if (value < 0 || (positive && value === 0)) throw new RangeError("Unsupported analysis edge value.");
    result.push({ from: edge.from, to: edge.to, directed: edge.directed, value: callback === undefined ? unitCost : dyadic(value) });
  }
  return result;
}
/**
 * Arc lists for path and spectral measures. `reverseDirected` follows incoming
 * arcs; `undirectedLoopsTwice` lets an undirected loop contribute both arc
 * directions, as in the spectral adjacency operator.
 */
function costGraph<N>(nodes: readonly N[], edges: readonly Captured<N>[], layout: { reverseDirected: boolean; undirectedLoopsTwice: boolean }): CostGraph<N> {
  const adjacency = new Map(nodes.map(node => [node, [] as { to: N; cost: bigint }[]]));
  for (const edge of edges) {
    const from = layout.reverseDirected && edge.directed ? edge.to : edge.from;
    const to = layout.reverseDirected && edge.directed ? edge.from : edge.to;
    adjacency.get(from)!.push({ to, cost: edge.value });
    if (!edge.directed && (layout.undirectedLoopsTwice || from !== to)) adjacency.get(to)!.push({ to: from, cost: edge.value });
  }
  return { nodes, adjacency };
}
function degree<N>(nodes: readonly N[], edges: readonly Captured<N>[], direction: AnalysisDirection, normalized: boolean): Map<N, number> {
  const scores = new Map(nodes.map(node => [node, 0n]));
  for (const edge of edges) {
    if (!edge.directed || direction !== "in") scores.set(edge.from, addCosts(scores.get(edge.from)!, edge.value));
    if (!edge.directed || direction !== "out") scores.set(edge.to, addCosts(scores.get(edge.to)!, edge.value));
  }
  const divisor = normalized ? Math.max(1, nodes.length - 1) : 1;
  return new Map(nodes.map(node => [node, roundedCost(scores.get(node)!) / divisor]));
}
function closeness<N>(graph: CostGraph<N>, discount: boolean): Map<N, number> {
  const scores = new Map<N, number>();
  for (const source of graph.nodes) {
    const distances = dijkstra(graph, source);
    let total = 0n;
    for (const [node, value] of distances) if (node !== source) total = addCosts(total, dyadic(roundedCost(value)));
    const reachable = distances.size - 1;
    const raw = reachable ? finite(reachable / roundedCost(total)) : 0;
    scores.set(source, discount ? finite(raw * (reachable / Math.max(1, graph.nodes.length - 1))) : raw);
  }
  return scores;
}
/** Brandes dependency accumulation with exact path counts and rational dependencies. */
function betweenness<N>(graph: CostGraph<N>, undirected: boolean, normalized: boolean): Map<N, number> {
  const scores = new Map(graph.nodes.map(node => [node, zero]));
  for (const source of graph.nodes) {
    const distances = dijkstra(graph, source);
    // Stable sort keeps discovery order among equal distances.
    const order = [...distances.keys()].sort((a, b) => compareCosts(distances.get(a)!, distances.get(b)!));
    const counts = new Map<N, bigint>([[source, 1n]]);
    const predecessors = new Map(order.map(node => [node, new Map<N, bigint>()]));
    for (const from of order) for (const arc of graph.adjacency.get(from)!) {
      if (addCosts(distances.get(from)!, arc.cost) !== distances.get(arc.to)) continue;
      counts.set(arc.to, (counts.get(arc.to) ?? 0n) + counts.get(from)!);
      const shortestArcs = predecessors.get(arc.to)!;
      shortestArcs.set(from, (shortestArcs.get(from) ?? 0n) + 1n);
    }
    const dependency = new Map<N, Rational>();
    for (let index = order.length - 1; index >= 0; index--) {
      const node = order[index]!;
      const delta = dependency.get(node) ?? zero;
      const successor = plus(one, delta);
      for (const [previous, multiplicity] of predecessors.get(node)!) {
        const increment = timesRatio(successor, counts.get(previous)! * multiplicity, counts.get(node)!);
        dependency.set(previous, plus(dependency.get(previous) ?? zero, increment));
      }
      if (node !== source) scores.set(node, plus(scores.get(node)!, delta));
    }
  }
  return new Map(graph.nodes.map(node => {
    let score = scores.get(node)!;
    if (undirected) score = timesRatio(score, 1n, 2n);
    if (normalized) {
      if (graph.nodes.length < 3) return [node, 0];
      const denominator = BigInt(graph.nodes.length - 1) * BigInt(graph.nodes.length - 2);
      score = timesRatio(score, undirected ? 2n : 1n, denominator);
    }
    return [node, quotient(score.numerator, score.denominator)];
  }));
}
function compareCosts(first: bigint, second: bigint): number {
  if (first < second) return -1;
  if (first > second) return 1;
  return 0;
}
/** Compensated finite Number sum for bounded spectral values. */
function stableSum(values: Iterable<number>): number {
  let sum = 0, correction = 0;
  for (const value of values) {
    const next = sum + value;
    correction += Math.abs(sum) >= Math.abs(value) ? (sum - next) + value : (value - next) + sum;
    sum = next;
  }
  return finite(sum + correction);
}
function eigenvector<N>(graph: CostGraph<N>, edgeCount: number, tolerance: number, maxIterationCount: number): Map<N, number> {
  const nodes = graph.nodes;
  if (!edgeCount) return new Map(nodes.map(node => [node, 0]));
  let current = new Map(nodes.map(node => [node, 1 / Math.sqrt(nodes.length)]));
  for (let iteration = 0; iteration < maxIterationCount; iteration++) {
    // Exact products use units 2^-2148; the identity is part of the same operator.
    const exact = new Map(nodes.map(node => [node, dyadic(current.get(node)!) * unitCost]));
    for (const from of nodes) {
      const value = dyadic(current.get(from)!);
      for (const arc of graph.adjacency.get(from)!) exact.set(arc.to, exact.get(arc.to)! + arc.cost * value);
    }
    let maximum = 0n;
    for (const value of exact.values()) if (value > maximum) maximum = value;
    // ONE common scale across the entire output vector, never per row.
    const scaled = nodes.map(node => quotient(exact.get(node)!, maximum));
    const norm = Math.sqrt(stableSum(scaled.map(value => value * value)));
    const next = new Map(nodes.map((node, index) => [node, finite(scaled[index]! / norm)]));
    const change = stableSum(nodes.map(node => Math.abs(next.get(node)! - current.get(node)!)));
    if (change <= nodes.length * tolerance) return next;
    current = next;
  }
  throw new Error("Eigenvector analysis did not converge.");
}
function pageRank<N>(graph: CostGraph<N>, damping: number, tolerance: number, maxIterationCount: number): Map<N, number> {
  const nodes = graph.nodes;
  const rows = new Map<N, { to: N; probability: number }[]>();
  for (const from of nodes) {
    const weights = new Map<N, bigint>();
    let total = 0n;
    for (const arc of graph.adjacency.get(from)!) {
      weights.set(arc.to, (weights.get(arc.to) ?? 0n) + arc.cost);
      total += arc.cost;
    }
    const row = total ? [...weights].map(([to, value]) => ({ to, probability: quotient(value, total) })) : [];
    const mass = stableSum(row.map(arc => arc.probability));
    rows.set(from, row.map(arc => ({ to: arc.to, probability: arc.probability / mass })));
  }
  let current = new Map(nodes.map(node => [node, 1 / nodes.length]));
  for (let iteration = 0; iteration < maxIterationCount; iteration++) {
    const dangling = stableSum(nodes.filter(node => rows.get(node)!.length === 0).map(node => current.get(node)!));
    const incoming = new Map(nodes.map(node => [node, [] as number[]]));
    for (const from of nodes) for (const arc of rows.get(from)!) incoming.get(arc.to)!.push(current.get(from)! * arc.probability);
    const values = nodes.map(node => finite((1 - damping) / nodes.length + damping * (stableSum(incoming.get(node)!) + dangling / nodes.length)));
    const mass = stableSum(values);
    const next = new Map(nodes.map((node, index) => [node, finite(values[index]! / mass)]));
    const change = stableSum(nodes.map(node => Math.abs(next.get(node)! - current.get(node)!)));
    if (change <= nodes.length * tolerance) return next;
    current = next;
  }
  throw new Error("PageRank analysis did not converge.");
}
/**
 * Captures edge values once through the guarded edge iterable, then scores
 * every node. Path costs and edge weights are exact dyadic values.
 * @throws TypeError for invalid or inapplicable options and non-finite edge values.
 * @throws RangeError for unsupported edge values, parameter ranges or non-finite results.
 * @throws Error when an iterative measure does not converge within maxIterationCount.
 */
export function analyze<N extends object, E extends object>(nodes: readonly N[], edges: Iterable<Edge<N, E>>, options: AnalysisOptions<N, E>): ReadonlyMap<N, number> {
  const config = settings(options);
  const captured = capture(edges, config.callback, config.measure === "closeness" || config.measure === "betweenness");
  if (!nodes.length) return new Map();
  if (config.measure === "degree") return degree(nodes, captured, config.direction, config.normalized);
  const graph = costGraph(nodes, captured, {
    reverseDirected: config.measure === "closeness" && config.direction === "in",
    undirectedLoopsTwice: config.measure === "eigenvector" || config.measure === "page-rank",
  });
  if (config.measure === "closeness") return closeness(graph, config.disconnected === "discount");
  if (config.measure === "betweenness") return betweenness(graph, captured.every(edge => !edge.directed), config.normalized);
  if (config.measure === "eigenvector") return eigenvector(graph, captured.length, config.tolerance, config.maxIterationCount);
  return pageRank(graph, config.damping, config.tolerance, config.maxIterationCount);
}
