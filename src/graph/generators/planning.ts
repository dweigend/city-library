import { displacement, finite, position, type Position } from "../../geometry/space.ts";
import type { GeneratorSpec, GenericGeneratorSpec } from "./options.ts";
import { planTopology } from "./topology-planning.ts";
import { addConnection, type Connection } from "./validation.ts";

type KindSpec<N, K extends GenericGeneratorSpec<N>["kind"]> = Extract<GenericGeneratorSpec<N>, { kind: K }>;

/** Private degree prefix index; intervals match the stable cumulative scan. */
class DegreeIndex {
  private readonly tree: number[];
  constructor(size: number) { this.tree = Array<number>(size + 1).fill(0); }
  add(index: number, delta: number) {
    for (let slot = index + 1; slot < this.tree.length; slot += slot & -slot) this.tree[slot]! += delta;
  }
  /** Fenwick descent: the largest prefix whose cumulative degree does not exceed the threshold. */
  select(threshold: number): number {
    let index = 0, stride = 1;
    while (stride * 2 < this.tree.length) stride *= 2;
    for (; stride >= 1; stride = Math.floor(stride / 2)) {
      const next = index + stride;
      if (next < this.tree.length && this.tree[next]! <= threshold) {
        threshold -= this.tree[next]!;
        index = next;
      }
    }
    return index;
  }
}

/** Plan only integer endpoint indices. Graph alone materializes/publishes edges. */
export function planGenerator<N>(config: GeneratorSpec<N>): Connection[] {
  if ("profile" in config) return planTopology(config);
  const count = config.nodes.length;
  const connections: Connection[] = [];
  const add = (from: number, to: number) => addConnection(connections, from, to);
  switch (config.kind) {
    case "path":
      for (let node = 1; node < count; node++) add(node - 1, node);
      break;
    case "cycle":
      for (let node = 1; node < count; node++) add(node - 1, node);
      if (count > 2 || (count === 2 && config.directed)) add(count - 1, 0);
      break;
    case "star":
      for (let node = 1; node < count; node++) add(0, node);
      break;
    case "wheel":
      for (let node = 2; node < count; node++) add(node - 1, node);
      add(count - 1, 1);
      for (let node = 1; node < count; node++) add(0, node);
      break;
    case "complete":
      for (let from = 0; from < count; from++) for (let to = config.directed ? 0 : from + 1; to < count; to++)
        if (from !== to) add(from, to);
      break;
    case "tree":
      for (let node = 1; node < count; node++) add(Math.floor((node - 1) / config.branching), node);
      break;
    case "lattice":
      planLattice(config, add);
      break;
    case "random":
      for (let from = 0; from < count; from++) for (let to = config.directed ? 0 : from + 1; to < count; to++)
        if (from !== to && config.random.number() < config.probability) add(from, to);
      break;
    case "small-world":
      planSmallWorld(config, connections);
      break;
    case "preferential":
      planPreferential(config, add);
      break;
    case "geometric":
      planGeometric(config, add);
      break;
  }
  return connections;
}

/** Row-major node order; axis strides grow from the first shape entry. */
function planLattice<N>(config: KindSpec<N, "lattice">, add: (from: number, to: number) => void): void {
  const count = config.nodes.length;
  const seen = new Set<number>();
  for (let node = 0; node < count; node++) {
    let stride = 1;
    for (const axis of config.shape) {
      const coordinate = Math.floor(node / stride) % axis;
      const to = latticeSuccessor(node, coordinate, axis, stride, config.wrap);
      if (node !== to) {
        const key = config.directed ? node * count + to : Math.min(node, to) * count + Math.max(node, to);
        if (!seen.has(key)) { seen.add(key); add(node, to); }
      }
      stride *= axis;
    }
  }
}

/** Next node along one axis; the last coordinate wraps or returns the node itself. */
function latticeSuccessor(node: number, coordinate: number, axis: number, stride: number, wrap: boolean): number {
  if (coordinate + 1 < axis) return node + stride;
  if (wrap) return node - (axis - 1) * stride;
  return node;
}

/** Ring lattice, then a probability draw per edge and a target draw only when rewiring is possible. */
function planSmallWorld<N>(config: KindSpec<N, "small-world">, connections: Connection[]): void {
  const count = config.nodes.length;
  const neighbors = Array.from({ length: count }, () => new Set<number>());
  for (let from = 0; from < count; from++) for (let offset = 1; offset <= config.neighbors / 2; offset++) {
    const to = (from + offset) % count;
    addConnection(connections, from, to); neighbors[from]!.add(to); neighbors[to]!.add(from);
  }
  for (let index = 0; index < connections.length; index++) {
    const [from, old] = connections[index]!;
    if (config.random.number() >= config.probability) continue;
    const available = count - 1 - neighbors[from]!.size;
    if (!available) continue;
    // Rank among eligible nodes in supplied order, without an O(n) pool scan.
    let target = Math.floor(config.random.number() * available);
    const excluded = [from, ...neighbors[from]!].sort((a, b) => a - b);
    for (const node of excluded) { if (node <= target) target++; else break; }
    neighbors[from]!.delete(old); neighbors[old]!.delete(from);
    neighbors[from]!.add(target); neighbors[target]!.add(from);
    connections[index] = [from, target];
  }
}

/** Seed clique, then degree-proportional targets drawn without replacement per new node. */
function planPreferential<N>(config: KindSpec<N, "preferential">, add: (from: number, to: number) => void): void {
  const count = config.nodes.length;
  const degree = Array<number>(count).fill(0);
  const index = new DegreeIndex(count);
  let total = 0;
  for (let from = 0; from <= config.edgesPerNode; from++) for (let to = from + 1; to <= config.edgesPerNode; to++) {
    add(from, to); degree[from]!++; degree[to]!++;
  }
  for (let node = 0; node <= config.edgesPerNode; node++) { index.add(node, degree[node]!); total += degree[node]!; }
  for (let node = config.edgesPerNode + 1; node < count; node++) {
    const selected: number[] = [];
    let available = total;
    for (let choice = 0; choice < config.edgesPerNode; choice++) {
      const target = index.select(config.random.number() * available);
      selected.push(target); add(node, target);
      // Remove the chosen target from this node's remaining draws.
      index.add(target, -degree[target]!); available -= degree[target]!;
    }
    for (const target of selected) { degree[target]!++; index.add(target, degree[target]!); }
    degree[node] = config.edgesPerNode; index.add(node, config.edgesPerNode);
    total += config.edgesPerNode * 2;
  }
}

/** Captures every position first, then connects pairs within the radius. */
function planGeometric<N>(config: KindSpec<N, "geometric">, add: (from: number, to: number) => void): void {
  const count = config.nodes.length;
  let dimensions: 2 | 3 | undefined = config.space?.dimensions;
  const points: Position[] = [];
  for (const node of config.nodes) {
    const captured = position(config.position(node), dimensions);
    dimensions ??= captured.z === undefined ? 2 : 3;
    points.push(captured);
  }
  for (let from = 0; from < count; from++) for (let to = from + 1; to < count; to++) {
    const delta = displacement(points[from]!, points[to]!, config.space);
    const distance = finite(Math.hypot(delta.x, delta.y, ...(dimensions === 3 ? [delta.z!] : [])), "Geometric distance");
    if (distance <= config.radius) add(from, to);
  }
}
