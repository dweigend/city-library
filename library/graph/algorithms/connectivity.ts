/** Pure connectivity over one captured graph structure; node objects stay canonical. */
export type ComponentMode = "weak" | "strong" | "biconnected";
interface Connection<N> { readonly from: N; readonly to: N; readonly directed: boolean }

function collect(start: number, adjacency: readonly (readonly number[])[], seen: Uint8Array): number[] {
  const part: number[] = [];
  const pending = [start];
  seen[start] = 1;
  while (pending.length) {
    const node = pending.pop()!;
    part.push(node);
    for (const next of adjacency[node]!) if (!seen[next]) {
      seen[next] = 1;
      pending.push(next);
    }
  }
  return part;
}

function weakParts(adjacency: readonly (readonly number[])[]): number[][] {
  const seen = new Uint8Array(adjacency.length);
  const parts: number[][] = [];
  for (let node = 0; node < adjacency.length; node++)
    if (!seen[node]) parts.push(collect(node, adjacency, seen));
  return parts;
}

/** Kosaraju: iterative finish order on the graph, then collection on its reverse. */
function strongParts(adjacency: readonly (readonly number[])[], reverse: readonly (readonly number[])[]): number[][] {
  const seen = new Uint8Array(adjacency.length);
  const finished: number[] = [];
  for (let root = 0; root < adjacency.length; root++) {
    if (seen[root]) continue;
    seen[root] = 1;
    const pending = [{ node: root, cursor: 0 }];
    while (pending.length) {
      const frame = pending[pending.length - 1]!;
      const targets = adjacency[frame.node]!;
      if (frame.cursor === targets.length) {
        finished.push(frame.node);
        pending.pop();
      } else {
        const next = targets[frame.cursor++]!;
        if (!seen[next]) {
          seen[next] = 1;
          pending.push({ node: next, cursor: 0 });
        }
      }
    }
  }
  seen.fill(0);
  const parts: number[][] = [];
  while (finished.length) {
    const root = finished.pop()!;
    if (!seen[root]) parts.push(collect(root, reverse, seen));
  }
  return parts;
}

/** Hopcroft–Tarjan vertex blocks from an iterative DFS edge stack; isolated nodes form singletons. */
function biconnectedParts(size: number, endpoints: readonly (readonly [number, number])[]): number[][] {
  const adjacency: { node: number; edge: number }[][] = Array.from({ length: size }, () => []);
  endpoints.forEach(([from, to], edge) => {
    // Loops cannot split a vertex block or create a larger maximal vertex set.
    if (from === to) return;
    adjacency[from]!.push({ node: to, edge });
    adjacency[to]!.push({ node: from, edge });
  });
  const discovered = Array<number>(size).fill(0);
  const low = Array<number>(size).fill(0);
  const parent = Array<number>(size).fill(-1);
  const parentEdge = Array<number>(size).fill(-1);
  const edgeStack: number[] = [];
  const parts: number[][] = [];
  let clock = 0;
  for (let root = 0; root < size; root++) {
    if (discovered[root]) continue;
    discovered[root] = low[root] = ++clock;
    if (adjacency[root]!.length === 0) { parts.push([root]); continue; }
    const pending = [{ node: root, cursor: 0 }];
    while (pending.length) {
      const frame = pending[pending.length - 1]!;
      const node = frame.node;
      if (frame.cursor < adjacency[node]!.length) {
        const next = adjacency[node]![frame.cursor++]!;
        if (!discovered[next.node]) {
          parent[next.node] = node;
          parentEdge[next.node] = next.edge;
          edgeStack.push(next.edge);
          discovered[next.node] = low[next.node] = ++clock;
          pending.push({ node: next.node, cursor: 0 });
        } else if (next.edge !== parentEdge[node] && discovered[next.node]! < discovered[node]!) {
          // Distinguish the parent edge by identity, so parallel alternatives
          // are genuine back edges rather than incorrectly ignored parents.
          edgeStack.push(next.edge);
          low[node] = Math.min(low[node]!, discovered[next.node]!);
        }
      } else {
        pending.pop();
        const previous = parent[node]!;
        if (previous === -1) continue;
        low[previous] = Math.min(low[previous]!, low[node]!);
        if (low[node]! >= discovered[previous]!) {
          const vertices = new Set<number>();
          let edge: number;
          do {
            edge = edgeStack.pop()!;
            for (const endpoint of endpoints[edge]!) vertices.add(endpoint);
          } while (edge !== parentEdge[node]);
          parts.push([...vertices]);
        }
      }
    }
  }
  return parts;
}

/**
 * Weak, strong or biconnected node groups. Members and groups are ordered by
 * node position in `nodes`. Biconnected groups may share articulation nodes.
 */
export function components<N extends object>(nodes: readonly N[], edges: readonly Connection<N>[], mode: ComponentMode): readonly (readonly N[])[] {
  if (mode === "biconnected" && edges.some(edge => edge.directed))
    throw new TypeError("Biconnected components require undirected edges.");
  const indices = new Map(nodes.map((node, index) => [node, index]));
  const endpoints = edges.map(edge => [indices.get(edge.from)!, indices.get(edge.to)!] as const);
  let parts: number[][];
  if (mode === "biconnected") parts = biconnectedParts(nodes.length, endpoints);
  else {
    const adjacency: number[][] = Array.from({ length: nodes.length }, () => []);
    const reverse: number[][] = Array.from({ length: nodes.length }, () => []);
    edges.forEach((edge, index) => {
      const [from, to] = endpoints[index]!;
      adjacency[from]!.push(to);
      reverse[to]!.push(from);
      if (mode === "weak" || !edge.directed) {
        adjacency[to]!.push(from);
        reverse[from]!.push(to);
      }
    });
    parts = mode === "weak" ? weakParts(adjacency) : strongParts(adjacency, reverse);
  }
  for (const part of parts) part.sort((a, b) => a - b);
  parts.sort((a, b) => {
    for (let index = 0; index < Math.min(a.length, b.length); index++) {
      const difference = a[index]! - b[index]!;
      if (difference) return difference;
    }
    return a.length - b.length;
  });
  return Object.freeze(parts.map(part => Object.freeze(part.map(index => nodes[index]!))));
}
