import { defineUI, scientificPalette, type SpatialData } from "../../../ui/index.ts";
import { assert, equal, settle } from "../ui-authoring/assertions.ts";

export const scene: SpatialData = {
  width: 10, height: 6, showLabels: false,
  description: "One outlined slot and one waiting resident; diagram coordinates are not World positions.",
  labels: [{ x: 0, y: 2, text: "Desk" }],
  agents: [
    { id: "slot:desk", x: 0, y: 0, shape: "rectangle", extent: { width: 4, height: 2 }, filled: false },
    { id: "resident:1", x: -4, y: 0, size: 8, color: scientificPalette.waiting },
  ],
};
equal(scene.agents[0]!.id, "slot:desk", "Projected slot id remains stable");
equal(scene.labels!.length, 1, "One nonselectable label remains");

/** Extent hit testing and keyboard identity are checked through the public UI. */
export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  let steps = 0;
  let disposed = 0;
  const model = { title: "Selection scene", inputs: {}, create: () => ({
    read: () => scene, advance() { steps++; }, dispose() { disposed++; },
  }) };
  const entry = bind(model, { views: [
    { type: "spatial", label: "Desk", data: state => state },
    { type: "inspector", label: "Selected", value: (_state, selected) => selected ? { selected } : undefined },
  ] });
  const mounted = entry.mount(container);
  await settle(container); await settle(container);
  const canvas = container.querySelector("canvas");
  assert(canvas, "Scene renders an actual canvas");
  const bounds = canvas.getBoundingClientRect();
  function clickAt(x: number, y: number) {
    canvas!.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: bounds.left + (x + 5) / 10 * bounds.width, clientY: bounds.top + (3 - y) / 6 * bounds.height }));
  }
  // Inside the rectangle near its right edge, outside the old two-unit center radius.
  clickAt(1.9, 0.9);
  await settle(container);
  assert(container.textContent?.includes("slot:desk"), "Picking returns the projected slot id");
  canvas.focus();
  canvas.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
  await settle(container);
  assert(container.textContent?.includes("resident:1"), "Keyboard order excludes annotations");
  assert(canvas.getAttribute("aria-label")?.includes("One outlined slot"), "Accessible description reflects actual scene meaning");
  mounted.dispose();
  await settle(container);
  equal(container.querySelector("canvas"), null, "Disposal removes the canvas");
  equal(disposed, 1, "Disposal runs once");
  equal(steps, 0, "Selection and disposal never step the model");
}
