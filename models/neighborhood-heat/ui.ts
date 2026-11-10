import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  monitors: [
    { label: "Tick", value: state => state.tick },
    { label: "Center temperature", value: state => state.centerTemperature },
    { label: "Temperature sum", value: state => state.totalTemperature },
  ],
  views: [{ type: "table", label: "Field temperatures", rows: state => state.fields }],
});
