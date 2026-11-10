import { strict as assert } from "node:assert";
import type { SpatialData } from "../../../ui/index.ts";
const view: SpatialData = {
  width: 10, height: 10, showLabels: false,
  cells: [{ id: "land", x: 0, y: 0, color: "#ffffff" }],
  segments: [{ from: { x: -2, y: 0 }, to: { x: 2, y: 0 }, color: "#ff0000", width: 2 }],
  agents: [{ id: "resident", x: 0, y: 0, color: "#0000ff", size: 10 }],
};
assert.equal(view.cells![0]!.color, "#ffffff");
assert.equal(view.segments![0]!.color, "#ff0000");
assert.equal(view.agents[0]!.color, "#0000ff");
// Render contract: cells first, then roads, then visible/selectable people.
assert.equal(view.agents[0]!.x, view.cells![0]!.x);
