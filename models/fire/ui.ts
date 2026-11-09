import { defineUI, type Observation, type GridData } from "../../ui/index.ts";

import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed", "density"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Fire",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    {
      label: "Burned (%)",
      value: (state) => state.percentBurned,
      format: (value: number) => value.toFixed(2),
    },
    { label: "Fires", value: (state) => state.counts.fires },
    { label: "Embers", value: (state) => state.counts.embers },
  ],
  views: [
    {
      type: "grid",
      label: "Forest",
      data: forestData,
    },
  ],
});

type UIObservation = Observation<typeof model>;

function forestData(state: UIObservation): GridData {
  return {
    width: state.width,
    height: state.height,
    cells: state.cells.map((cell) => ({
      ...cell,
      color:
        cell.status === "tree"
          ? "#38a339"
          : cell.status === "fire"
            ? "#ff2424"
            : cell.status === "ember" || cell.status === "burned"
              ? `rgb(${Math.round(255 * Math.max(0, (cell.emberColor - 10) / 5))}, 0, 0)`
              : "#000000",
    })),
  };
}
