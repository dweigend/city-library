import type { Graph } from "city-library";
import type { ContactKind, DiffusionAgent, DiffusionTopology } from "./types.ts";

type ContactGraph = Graph<DiffusionAgent, { kind: ContactKind }>;
export type BridgeEndpoints = readonly (readonly [DiffusionAgent, DiffusionAgent])[];

/** Caller-authored contact fixtures, not a Graph generator API or a display layout. */
export function createContacts(graph: ContactGraph, agents: readonly DiffusionAgent[], topology: DiffusionTopology): BridgeEndpoints {
  const connect = (from: DiffusionAgent, to: DiffusionAgent) => {
    if (from !== to) graph.edges.add({ from, to });
  };
  if (topology === "hub") {
    for (const other of agents.slice(1)) connect(agents[0]!, other);
    return [];
  }
  if (topology === "ring") {
    agents.forEach((agent, index) => connect(agent, agents[(index + 1) % agents.length]!));
    return [];
  }
  const groups = [0, 1, 2].map((community) => agents.filter((agent) => agent.community === community));
  for (const group of groups) {
    group.forEach((agent, index) => {
      for (const offset of [1, 3]) connect(agent, group[(index + offset) % group.length]!);
    });
  }
  return [[groups[0]!.at(-1)!, groups[1]![0]!], [groups[1]!.at(-1)!, groups[2]![0]!]];
}

export function changeBridges(graph: ContactGraph, endpoints: BridgeEndpoints, enabled: boolean): void {
  if (enabled) {
    for (const [from, to] of endpoints) graph.edges.add({ from, to, state: { kind: "bridge" } });
    return;
  }
  for (const edge of Array.from(graph.edges)) if (edge.kind === "bridge") edge.delete();
}
