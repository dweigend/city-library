import type { Definition } from "../models/definition.ts";
import { defineUI } from "../ui/index.ts";
interface Parameters { seed: number }
interface Instance {
  read(): { tick: number; showEnergy: boolean };
  advance(count?: number): void;
  placeCenter(position: { x: number; y: number }): void;
}
/** Four public compile-only author tasks, frozen before the shared host extension. */
function authorContracts(model: Definition<Parameters, Instance>) {
  // Omission retains the existing UI-owned Labels checkbox and grid drawing.
  defineUI(model, { views: [{ type: "spatial", label: "People", data: () => ({ width: 5, height: 5, agents: [{ id: "a", x: 0, y: 0, label: "25" }] }) }] });
  defineUI(model, { views: [{ type: "spatial", label: "Energy", data: state => ({ width: 5, height: 5, showLabels: state.showEnergy, agents: [{ id: "a", x: 0, y: 0, label: "25" }] }) }] });
  defineUI(model, { drawing: { toggleLabel: "Place centers", enabled: () => true, intent(instance, intent) { if (intent.phase !== "end") instance.placeCenter(intent.position); } }, views: [{ type: "spatial", label: "Centers and people", data: () => ({ width: 37, height: 38, cells: [{ id: "c", x: 0, y: 0.5, color: "#000000" }], agents: [] }) }] });
  defineUI(model, { drawing: { toggleLabel: "Place centers", enabled: () => true, intent(instance, intent) {
    // @ts-expect-error An end intent has no position and cannot mutate a center.
    if (intent.phase === "end") instance.placeCenter(intent.position);
  } }, views: [] });
}
void authorContracts;
