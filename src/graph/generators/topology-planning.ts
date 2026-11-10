import type { GeneratorSpec } from "./options.ts";
import type { Connection } from "./planning.ts";
import { edgeLimit } from "./validation.ts";

/** Edition 1 is topology only; births/layout/native RNG/blocks never run here. */
export function planTopology<N>(config: GeneratorSpec<N>): Connection[] {
  const count = config.nodes.length;
  const result: Connection[] = [];
  function add(from: number, to: number) {
    if (result.length === edgeLimit) throw new RangeError("Generated edge count exceeds limit.");
    result.push([from, to]);
  }
  if (config.kind === "wheel") {
    const hub = count - 1;
    for (let rim = 0; rim < hub; rim++) add(rim, (rim + 1) % hub);
    for (let rim = 0; rim < hub; rim++) {
      if (config.spokes === "out") add(hub, rim);
      else add(rim, hub);
    }
  } else if (config.kind === "lattice" || config.kind === "kleinberg") {
    const [columns, rows] = config.shape as readonly [number, number];
    const seen = new Set<number>();
    function once(from: number, to: number) {
      const key = config.directed ? from * count + to : Math.min(from, to) * count + Math.max(from, to);
      if (!seen.has(key)) { seen.add(key); add(from, to); }
    }
    for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
      const from = row * columns + column;
      if (column + 1 < columns) once(from, from + 1);
      else if (config.wrap && columns > 2) once(from, row * columns);
      if (row + 1 < rows) once(from, from + columns);
      else if (config.wrap && rows > 2) once(from, column);
    }
    if (config.kind === "kleinberg") for (let from = 0; from < count; from++) {
      // Number sums and flat CDF plateaus are intentional edition semantics.
      const cumulative: number[] = [];
      let total = 0;
      for (let to = 0; to < count; to++) {
        if (to === from) { cumulative.push(total); continue; }
        let dx = Math.abs(from % columns - to % columns);
        let dy = Math.abs(Math.floor(from / columns) - Math.floor(to / columns));
        if (config.wrap) { dx = Math.min(dx, columns - dx); dy = Math.min(dy, rows - dy); }
        total += Math.pow(dx + dy, -config.clusteringExponent!);
        cumulative.push(total);
      }
      if (total > 0) {
        const pick = config.random!.number() * total;
        let chosen = count - 1 === from ? count - 2 : count - 1;
        for (let to = 0; to < count; to++) if (to !== from && pick <= cumulative[to]!) { chosen = to; break; }
        once(from, chosen);
      }
    }
  } else if (config.kind === "preferential") {
    for (let from = 0; from <= config.edgesPerNode; from++) for (let to = from + 1; to <= config.edgesPerNode; to++) add(from, to);
    for (let node = config.edgesPerNode + 1; node < count; node++) {
      const poolSize = result.length;
      const selected = new Set<number>();
      const targets: number[] = [];
      while (targets.length < config.edgesPerNode) {
        const link = result[Math.floor(config.random!.number() * poolSize)]!;
        const target = config.random!.number() < 0.5 ? link[0] : link[1];
        if (!selected.has(target)) { selected.add(target); targets.push(target); }
      }
      for (const target of targets) add(node, target);
    }
  } else if (config.kind === "small-world") {
    const adjacency = Array.from({ length: count }, () => new Set<number>());
    for (let from = 0; from < count; from++) for (let offset = 1; offset <= config.neighbors; offset++) {
      const to = (from + offset) % count;
      add(from, to); adjacency[from]!.add(to); adjacency[to]!.add(from);
    }
    const buffer = Array.from({ length: count }, (_, index) => index);
    for (let index = 0; index < result.length; index++) {
      const [from, old] = result[index]!;
      if (config.random!.number() >= config.probability) continue;
      adjacency[from]!.delete(old); adjacency[old]!.delete(from);
      let cursor = 0;
      while (true) {
        const position = cursor + Math.floor(config.random!.number() * (count - cursor));
        const target = buffer[position]!;
        [buffer[position], buffer[cursor]] = [buffer[cursor]!, target];
        cursor++;
        if (target === from || adjacency[from]!.has(target)) continue;
        adjacency[from]!.add(target); adjacency[target]!.add(from);
        result[index] = [from, target];
        break;
      }
    }
  }
  return result;
}
