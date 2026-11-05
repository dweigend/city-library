import type { Definition } from "../experiments/definition.ts";
import { defineUI } from "./index.ts";

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
