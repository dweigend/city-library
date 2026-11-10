import type { TopologyGeneratorSpec } from "./topology-options.ts";
import { addConnection, type Connection } from "./validation.ts";

type TopologyKindSpec<N, K extends TopologyGeneratorSpec<N>["kind"]> = Extract<TopologyGeneratorSpec<N>, { kind: K }>;

/** Edition 1 is topology only; births/layout/native RNG/blocks never run here. */
export function planTopology<N>(config: TopologyGeneratorSpec<N>): Connection[] {
  const connections: Connection[] = [];
  switch (config.kind) {
    case "wheel":
      planWheel(config, connections);
      break;
    case "lattice":
    case "kleinberg":
      planLattice(config, connections);
      break;
    case "preferential":
      planPreferential(config, connections);
      break;
    case "small-world":
      planSmallWorld(config, connections);
      break;
  }
  return connections;
}

/** Rim cycle over all nodes but the last, then spokes to or from the last node as hub. */
function planWheel<N>(config: TopologyKindSpec<N, "wheel">, connections: Connection[]): void {
  const hub = config.nodes.length - 1;
  for (let rim = 0; rim < hub; rim++) addConnection(connections, rim, (rim + 1) % hub);
  for (let rim = 0; rim < hub; rim++) {
    if (config.spokes === "out") addConnection(connections, hub, rim);
    else addConnection(connections, rim, hub);
  }
}

/** Row-major lattice; Kleinberg then adds one long-range draw per source node. */
function planLattice<N>(config: TopologyKindSpec<N, "lattice" | "kleinberg">, connections: Connection[]): void {
  const count = config.nodes.length;
  const [columns, rows] = config.shape;
  const seen = new Set<number>();
  function once(from: number, to: number) {
    const key = config.directed ? from * count + to : Math.min(from, to) * count + Math.max(from, to);
    if (!seen.has(key)) { seen.add(key); addConnection(connections, from, to); }
  }
  for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
    const from = row * columns + column;
    if (column + 1 < columns) once(from, from + 1);
    else if (config.wrap && columns > 2) once(from, row * columns);
    if (row + 1 < rows) once(from, from + columns);
    else if (config.wrap && rows > 2) once(from, column);
  }
  if (config.kind !== "kleinberg") return;
  for (let from = 0; from < count; from++) {
    const target = kleinbergTarget(config, from);
    if (target !== undefined) once(from, target);
  }
}

/**
 * Draws one target with mass (lattice distance)^-clusteringExponent.
 * Returns undefined without a draw when the total mass is zero.
 */
function kleinbergTarget<N>(config: TopologyKindSpec<N, "kleinberg">, from: number): number | undefined {
  const count = config.nodes.length;
  const [columns, rows] = config.shape;
  // Number sums and flat CDF plateaus are intentional edition semantics.
  const cumulative: number[] = [];
  let total = 0;
  for (let to = 0; to < count; to++) {
    if (to === from) { cumulative.push(total); continue; }
    let dx = Math.abs(from % columns - to % columns);
    let dy = Math.abs(Math.floor(from / columns) - Math.floor(to / columns));
    if (config.wrap) { dx = Math.min(dx, columns - dx); dy = Math.min(dy, rows - dy); }
    total += Math.pow(dx + dy, -config.clusteringExponent);
    cumulative.push(total);
  }
  if (total <= 0) return undefined;
  const pick = config.random.number() * total;
  let chosen = count - 1 === from ? count - 2 : count - 1;
  for (let to = 0; to < count; to++) if (to !== from && pick <= cumulative[to]!) { chosen = to; break; }
  return chosen;
}

/** Seed clique, then endpoint-of-random-edge sampling over the edges present before each node. */
function planPreferential<N>(config: TopologyKindSpec<N, "preferential">, connections: Connection[]): void {
  const count = config.nodes.length;
  for (let from = 0; from <= config.edgesPerNode; from++) for (let to = from + 1; to <= config.edgesPerNode; to++) addConnection(connections, from, to);
  for (let node = config.edgesPerNode + 1; node < count; node++) {
    const poolSize = connections.length;
    const selected = new Set<number>();
    const targets: number[] = [];
    while (targets.length < config.edgesPerNode) {
      const sampled = connections[Math.floor(config.random.number() * poolSize)]!;
      const target = config.random.number() < 0.5 ? sampled[0] : sampled[1];
      if (!selected.has(target)) { selected.add(target); targets.push(target); }
    }
    for (const target of targets) addConnection(connections, node, target);
  }
}

/** Ring lattice followed by per-edge rewiring with a partial Fisher–Yates target scan. */
function planSmallWorld<N>(config: TopologyKindSpec<N, "small-world">, connections: Connection[]): void {
  const count = config.nodes.length;
  const adjacency = Array.from({ length: count }, () => new Set<number>());
  for (let from = 0; from < count; from++) for (let offset = 1; offset <= config.neighborsPerSide; offset++) {
    const to = (from + offset) % count;
    addConnection(connections, from, to); adjacency[from]!.add(to); adjacency[to]!.add(from);
  }
  const buffer = Array.from({ length: count }, (_, index) => index);
  for (let index = 0; index < connections.length; index++) {
    const [from, old] = connections[index]!;
    if (config.random.number() >= config.probability) continue;
    adjacency[from]!.delete(old); adjacency[old]!.delete(from);
    let cursor = 0;
    // Terminates: the removed endpoint `old` is always eligible again.
    while (true) {
      const position = cursor + Math.floor(config.random.number() * (count - cursor));
      const target = buffer[position]!;
      [buffer[position], buffer[cursor]] = [buffer[cursor]!, target];
      cursor++;
      if (target === from || adjacency[from]!.has(target)) continue;
      adjacency[from]!.add(target); adjacency[target]!.add(from);
      connections[index] = [from, target];
      break;
    }
  }
}
