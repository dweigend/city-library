import type { Definition } from "../models/definition.ts";
import { defineUI } from "../ui/index.ts";

interface Parameters {
  seed: number;
  mode: "first" | "second";
}
interface Observation {
  tick: number;
  nodes: readonly { id: string }[];
  edges: readonly { id: string; from: string; to: string }[];
}
interface Instance {
  read(): Observation;
  advance(steps?: number): void;
  setRate(value: number): void;
}

/** Compile-only author tasks; never imported or executed by the application. */
function authorContract(definition: Definition<Parameters, Instance>) {
  defineUI(definition, {
    setup: [{ field: "seed" }],
    actions: [{ label: "Rate", run: (instance) => instance.setRate(0.5) }],
    monitors: [{ label: "Tick", value: (state) => state.tick }],
    views: [
      {
        type: "network",
        label: "Network",
        nodes: (state) => state.nodes,
        edges: (state) => state.edges,
      },
    ],
  });
  defineUI(definition, {
    setup: [
      // @ts-expect-error Misspelled parameter is not part of this model.
      { field: "sead" },
    ],
    views: [],
  });
  defineUI(definition, {
    live: [
      {
        // @ts-expect-error Live controls must reference a declared parameter.
        field: "missing",
        value: (state) => state.tick,
        set: (instance) => instance.setRate(0.5),
      },
    ],
    views: [],
  });
  defineUI(definition, {
    actions: [
      {
        label: "Invalid rate",
        run(instance) {
          // @ts-expect-error A typed public action requires a numeric argument.
          instance.setRate("wrong");
        },
      },
    ],
    views: [],
  });
  defineUI(definition, {
    views: [
      {
        type: "network",
        label: "Bad network",
        // @ts-expect-error Node observations require canonical string identifiers.
        nodes: (state) => state.nodes.map(() => ({ id: 1 })),
        edges: (state) => state.edges,
      },
    ],
  });
  defineUI(definition, {
    views: [
      {
        type: "grid",
        label: "Bad grid",
        // @ts-expect-error Grid observations need dimensions and cells, not a number.
        data: (state) => state.tick,
      },
    ],
  });
}
void authorContract;

/** Selected-grid author tasks, frozen before the shared renderer implementation. */
function drawingAuthorContracts(definition: Definition<Parameters, Instance>) {
  // 1. Existing authors opt out without any changes.
  defineUI(definition, { views: [{ type: "grid", label: "Read only", data: () => ({ width: 3, height: 3, cells: [] }) }] });
  // 2. Neutral cell intents dispatch typed public actions; no rendering policy.
  defineUI(definition, {
    drawing: { enabled: () => true, intent: (model, intent) => { if (intent.phase === "begin") model.setRate(intent.position!.x); } },
    views: [{ type: "grid", label: "Draw", data: () => ({ width: 3, height: 3, cells: [] }) }],
  });
  // 3. Color widgets remain typed live bindings to declared parameters.
  defineUI(definition, { live: [{ field: "mode", widget: "color", value: () => "#ffffff", set: (model) => model.setRate(1) }], views: [] });
  // 4. Invalid gesture phases and model writes fail author compilation.
  defineUI(definition, { drawing: { enabled: () => true, intent(model, intent) {
    // @ts-expect-error Only neutral begin/move/end phases exist.
    const phase: "paint" = intent.phase;
    // @ts-expect-error Typed model actions cannot accept arbitrary renderer data.
    model.setRate(intent);
    void phase;
  } }, views: [] });
}
void drawingAuthorContracts;
