import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
export const ui = defineUI(model, {
  setup: ["width", "height", "seed"],
  source: {
    url: "https://ccl.northwestern.edu/netlogo/models/Voting",
    label: "Original NetLogo model · Uri Wilensky · CC BY-NC-SA 3.0",
  },
  complete: (state) => state.done,
  monitors: [
    { label: "Tick", value: (state) => state.tick },
    { label: "Blue", value: (state) => state.counts.one },
    { label: "Green", value: (state) => state.counts.zero },
  ],
  live: {
    changeVote: {
      label: "Change vote if tied",
      set: (instance, value) => instance.setRules({ changeVote: value }),
    },
    awardCloseCallsToLoser: {
      set: (instance, value) =>
        instance.setRules({ awardCloseCallsToLoser: value }),
    },
  },
  views: [
    {
      type: "inspector",
      label: "Selected",
      value: (state, selectedId) =>
        state.cells.find((cell) => cell.id === selectedId),
    },
    {
      type: "grid",
      label: "Votes",
      data: (state) => ({
        width: state.width,
        height: state.height,
        cells: state.cells.map((cell) => ({
          id: cell.id,
          x: cell.x,
          y: cell.y,
          color: cell.vote ? "#355fa5" : "#60b632",
        })),
      }),
    },
  ],
});
