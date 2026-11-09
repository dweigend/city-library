import assert from "node:assert/strict";
import { defineUI, scientificPalette, type SpatialData } from "../../ui/index.ts";
import { button, settle } from "../ui-authoring/assertions.ts";

export const valid: SpatialData = {
  width: 10, height: 6, description: "One empty resource slot.",
  agents: [{ id: "slot:1", x: 0, y: 0, shape: "rectangle", extent: { width: 2, height: 1 }, filled: false, stroke: scientificPalette.neutral }],
};
export const invalid: readonly SpatialData[] = [
  { ...valid, width: 0 },
  { ...valid, description: "" },
  { ...valid, agents: [{ ...valid.agents[0]!, x: NaN }] },
  { ...valid, agents: [{ ...valid.agents[0]!, shape: "hexagon" as never }] },
  { ...valid, agents: [{ ...valid.agents[0]!, extent: { width: -1, height: 1 } }] },
  { ...valid, agents: [{ ...valid.agents[0]!, size: 10 }] },
  { ...valid, agents: [{ ...valid.agents[0]!, shape: "circle" }] },
  { ...valid, agents: [{ ...valid.agents[0]!, strokeWidth: -1 }] },
  { ...valid, labels: [{ x: Infinity, y: 0, text: "floor" }] },
];
assert.equal(invalid.length, 9);
assert.equal(valid.agents[0]!.extent!.width, 2);

/** Execute against each real public adapter; source-only execution is insufficient. */
export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  for (const data of invalid) {
    const model = { title: "Invalid scene", inputs: {}, create: () => ({ read: () => data, advance() {} }) };
    const entry = bind(model, { views: [{ type: "spatial", label: "Slot", data: state => state }] });
    const mounted = entry.mount(container);
    try {
      await settle(container);
      button(container, "Setup").click();
      await settle(container); await settle(container);
      assert(container.querySelector('[role="alert"]')?.textContent?.trim(), "Malformed scenes must report an accessible error");
    } finally { mounted.dispose(); }
  }
}
