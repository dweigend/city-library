import type { Definition } from "../experiments/definition.ts";
import { defineUI } from "./index.ts";
interface Parameters { seed: number }
interface Instance {
  read(): { tick: number; active: boolean };
  advance(count?: number): void;
  rewire(): void;
}
/** Compile-only public examples frozen before shared runtime implementation. */
function authorContracts(model: Definition<Parameters, Instance>) {
  defineUI(model, { actions: [{ label: "Rewire", run: instance => instance.rewire() }], views: [] });
  defineUI(model, { views: [{ type: "network", label: "Transport",
    nodes: () => [{ id: "a", position: { x: 0, y: 0 } }, { id: "b", position: { x: 80, y: 0 } }],
    edges: () => [{ id: "ab", from: "a", to: "b", directed: true, color: "#555555", width: 2 }],
  }] });
  defineUI(model, { actions: [{ label: "Rewire a link", repeat: { label: "Keep rewiring", intervalMs: 200 },
    run: instance => instance.rewire(), enabled: state => state.active,
  }], views: [] });
  defineUI(model, { actions: [{ label: "Invalid", repeat: { label: "Repeat", intervalMs: 200 }, run(instance) {
    // @ts-expect-error A renderer/action cannot invent an untyped domain write.
    instance.rewire("silent alternate algorithm");
  } }], views: [] });
}
void authorContracts;
