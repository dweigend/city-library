import assert from "node:assert/strict";
import { scientificPalette, defineUI, type SpatialData } from "../../ui/index.ts";
import { model } from "../../experiments/des-civic-office/model.ts";
import type { Observation } from "../../ui/index.ts";

export function scene(state: Observation<typeof model>): SpatialData {
  const waiting = state.residents.filter(resident => resident.status === "waiting");
  const busy = state.residents.filter(resident => resident.status === "granted");
  const completed = state.residents.filter(resident => resident.status === "released");
  return {
    width: 20, height: 8, showLabels: false,
    description: `${waiting.length} residents waiting, ${busy.length} receiving service, ${completed.length} completed. Outlined rectangles are clerk desks; dots are residents.`,
    agents: [
      ...Array.from({ length: state.parameters.clerks }, (_, index) => ({
        id: `desk:${index}`, x: index * 2, y: 0, shape: "rectangle" as const,
        extent: { width: 1.5, height: 1.5 }, filled: false, stroke: scientificPalette.neutral,
      })),
      ...waiting.map((resident, index) => ({ id: `resident:${resident.number}`, x: -8 + index, y: 0, color: scientificPalette.waiting, size: 8 })),
      ...busy.map((resident, index) => ({ id: `resident:${resident.number}`, x: index * 2, y: 0, color: scientificPalette.active, size: 8 })),
      ...completed.map((resident, index) => ({ id: `resident:${resident.number}`, x: 5 + index, y: 0, color: scientificPalette.completed, size: 8 })),
    ],
  };
}
export const ui = defineUI(model, { views: [{ type: "spatial", label: "Office service", data: scene }] });
const office = model.create();
const initial = office.read();
const projection = scene(initial);
assert.equal(projection.agents.filter(agent => agent.shape === "rectangle").length, 1);
assert.equal(projection.agents.filter(agent => agent.color === scientificPalette.waiting).length, 2);
assert.equal(projection.agents.filter(agent => agent.color === scientificPalette.active).length, 1);
assert.deepEqual(office.read(), initial);
office.advance(6);
assert.equal(scene(office.read()).agents.filter(agent => agent.color === scientificPalette.completed).length, 3);
assert.equal(office.read().totalWait, 6);
assert(Object.isFrozen(scientificPalette));
