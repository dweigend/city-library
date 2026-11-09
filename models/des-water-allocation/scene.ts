import { scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import type { model } from "./model.ts";

/** Four Grid districts; three glyphs per district are allocation units, not households. */
export function scene(state: Observation<typeof model>): SpatialData {
  const agents: SpatialAgent[] = [];
  const labels = [];
  for (const district of state.districts) {
    const x = district.x * 5;
    const y = district.y * 4;
    let status = "waiting";
    let stroke: string = scientificPalette.waiting;
    if (district.supplied) {
      status = "supplied";
      stroke = scientificPalette.completed;
    } else if (district.status === "granted") {
      status = "reserved";
      stroke = scientificPalette.active;
    }
    agents.push({ id: district.id, x, y, shape: "rectangle", extent: { width: 4.4, height: 3.3 }, filled: false,
      stroke });
    for (let unit = 0; unit < district.demand; unit++) agents.push({ id: `allocation:${district.id}:${unit}`, x: x - 1 + unit, y,
      shape: "rectangle", extent: { width: 0.65, height: 0.65 }, filled: unit < district.supplied,
      color: scientificPalette.completed, stroke: scientificPalette.waiting });
    labels.push({ x, y: y + 1, text: district.name }, { x, y: y - 1, text: `${district.supplied}/${district.demand} · ${status}` });
  }
  labels.push({ x: 0, y: 5, text: `Supply ${state.supply} · committed ${state.committed} · available ${state.available}` },
    { x: 0, y: -5, text: `Delivered ${state.supplied} · unmet ${state.unmet}` });
  return { width: 14, height: 12, showLabels: false, agents, labels,
    description: `Four district patches demand twelve discrete allocation units; ${state.supplied} supplied, ${state.unmet} unmet. Filled squares are delivered units, outlined squares unmet units. ${state.committed} supply units committed and ${state.available} available; patch labels distinguish reserved and waiting allocations. No hydraulic flow is represented.` };
}
