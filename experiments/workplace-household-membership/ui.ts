import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  actions: [{ label: "Reassign first resident", run: instance => instance.reassign(0) }],
  monitors: [{ label: "Tick", value: state => state.tick }, { label: "Memberships", value: state => state.memberships },
    { label: "Workplace A", value: state => state.workplaceA }],
  views: [{ type: "network", label: "Membership graph", nodes: state => state.nodes, edges: state => state.edges },
    { type: "table", label: "Resident groups", rows: state => state.people }],
});
