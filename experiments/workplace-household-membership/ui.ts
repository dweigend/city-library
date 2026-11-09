import { defineUI, netLogoColor, type Observation, type NetworkNode } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  actions: [{ label: "Reassign first resident", run: instance => instance.reassign(0) }],
  monitors: [{ label: "Tick", value: state => state.tick }, { label: "Memberships", value: state => state.memberships },
    { label: "Workplace A", value: state => state.workplaceA }],
  views: [
    { type: "network", label: "Homes ← residents → workplaces", nodes: membershipNodes,
      edges: state => state.edges.map(edge => ({ ...edge, width: 2,
        color: netLogoColor(edge.to.startsWith("household-") ? 105 : 125) })) },
    { type: "inspector", label: "Member", value: (state, selected): Readonly<Record<string, string>> | undefined => {
      const person = state.people.find(person => person.id === selected);
      if (person) return { resident: person.label, household: person.household, workplace: person.workplace };
      const place = state.nodes.find(node => node.id === selected);
      return place ? { place: place.label, kind: place.kind } : undefined;
    } },
  ],
});

/** Three presentation columns expose the existing bipartite memberships, not travel coordinates. */
export function membershipNodes(state: Observation<typeof model>): readonly NetworkNode[] {
  return state.nodes.map(node => {
    const residentIndex = state.people.findIndex(person => person.id === node.id);
    if (residentIndex >= 0) return { id: node.id, label: `R${residentIndex + 1}`, color: netLogoColor(75), size: 16,
      position: { x: 0, y: (residentIndex - (state.people.length - 1) / 2) * 32 } };
    const household = node.kind === "household";
    const first = node.id.endsWith("-a");
    return { id: node.id, label: `${household ? "Home" : "Work"} ${first ? "A" : "B"}`,
      color: netLogoColor(household ? 105 : 125), size: 30,
      position: { x: household ? -170 : 170, y: first ? -85 : 85 } };
  });
}
