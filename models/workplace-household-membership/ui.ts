import { defineUI, indexedColor, type Observation, type GraphNodeData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  actions: [{ label: "Reassign first resident", run: instance => instance.reassign(0) }],
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Memberships", value: state => state.memberships },
    { label: "Workplace A", value: state => state.workplaceA },
  ],
  views: [
    {
      type: "network",
      label: "Homes ← residents → workplaces",
      nodes: membershipNodes,
      edges: state => state.edges.map(edge => ({
        ...edge,
        width: 2,
        color: edge.to.startsWith("household-") ? HOUSEHOLD_COLOR : WORKPLACE_COLOR,
      })),
    },
    {
      type: "inspector",
      label: "Member",
      value: (state, selected): Readonly<Record<string, string>> | undefined => {
        const person = state.people.find(person => person.id === selected);
        if (person) return { resident: person.label, household: person.household, workplace: person.workplace };
        const place = state.nodes.find(node => node.id === selected);
        return place ? { place: place.label, kind: place.kind } : undefined;
      },
    },
  ],
});

/** Three presentation columns expose the existing bipartite memberships, not travel coordinates. */
export function membershipNodes(state: Observation<typeof model>): readonly GraphNodeData[] {
  return state.nodes.map(node => {
    const residentIndex = state.people.findIndex(person => person.id === node.id);
    if (residentIndex >= 0) {
      return {
        id: node.id,
        label: `R${residentIndex + 1}`,
        color: RESIDENT_COLOR,
        size: RESIDENT_SIZE,
        position: { x: 0, y: (residentIndex - (state.people.length - 1) / 2) * RESIDENT_SPACING },
      };
    }
    const household = node.kind === "household";
    const first = node.id.endsWith("-a");
    return {
      id: node.id,
      label: `${household ? "Home" : "Work"} ${first ? "A" : "B"}`,
      color: household ? HOUSEHOLD_COLOR : WORKPLACE_COLOR,
      size: PLACE_SIZE,
      position: {
        x: household ? -PLACE_COLUMN_OFFSET : PLACE_COLUMN_OFFSET,
        y: first ? -PLACE_ROW_OFFSET : PLACE_ROW_OFFSET,
      },
    };
  });
}

const RESIDENT_SPACING = 32;
const PLACE_COLUMN_OFFSET = 170;
const PLACE_ROW_OFFSET = 85;
const RESIDENT_SIZE = 16;
const PLACE_SIZE = 30;
const RESIDENT_COLOR = indexedColor(75);
const HOUSEHOLD_COLOR = indexedColor(105);
const WORKPLACE_COLOR = indexedColor(125);
