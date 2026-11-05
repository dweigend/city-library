import type { LabSnapshot } from "../application/session.ts";

export interface NetworkNode {
  id: string;
  label: string;
  energy?: number;
  state?: "unaware" | "active" | "settled";
  community?: number;
  alive: boolean;
  attached: boolean;
  selected: boolean;
  active: boolean;
}
export interface NetworkEdge { id: string; source: string; target: string; kind?: "contact" | "bridge" }
export interface NetworkObservation {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  layout: "grid" | "communities" | "ring" | "hub";
  interactionLabel: string;
}

/** Copies public observations into renderer-independent records, never live Agents. */
export function projectNetwork(snapshot: LabSnapshot): NetworkObservation {
  if ("scenario" in snapshot) {
    return {
      nodes: snapshot.agents.map((agent) => ({ id: agent.id, label: agent.label, state: agent.state, community: agent.community, alive: agent.alive, attached: agent.attached, selected: agent.selected, active: agent.state === "active" })),
      edges: snapshot.edges.map((edge) => ({ id: edge.id, source: edge.from, target: edge.to, kind: edge.kind })),
      layout: snapshot.parameters.topology,
      interactionLabel: `${snapshot.contactCount} contacts · ${snapshot.newActivations} newly active`,
    };
  }
  const nodes = snapshot.agents.map((agent, index) => ({
    id: agent.id,
    label: "label" in agent ? agent.label : `Agent ${index + 1}`,
    energy: agent.energy,
    alive: agent.alive,
    attached: agent.attached,
    selected: agent.selected,
    active: "active" in agent && agent.active,
  }));
  const pair = "lastInteractionIds" in snapshot ? snapshot.lastInteractionIds : [];
  const first = nodes.find((node) => node.id === pair[0]);
  const second = nodes.find((node) => node.id === pair[1]);
  const hasPair = pair.length === 2 && first && second && first !== second;
  return {
    nodes,
    edges: hasPair ? [{ id: "last-interaction", source: first.id, target: second.id }] : [],
    layout: "grid",
    interactionLabel: hasPair ? `Last sampled pair: ${first.label} · ${second.label}` : "No sampled pair",
  };
}
