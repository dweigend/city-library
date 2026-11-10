import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  views: [
    { type: "bar", label: "Monthly flows", yAxis: { unit: "units / month" }, series: state => [
      { label: "Amount", points: [
        { x: "Income", y: state.income },
        { x: "Rent", y: state.rent },
      ] },
    ] },
  ],
  monitors: [
    { label: "Month", value: state => state.tick },
    { label: "Balance", value: state => state.balance },
    { label: "Income per month", value: state => state.income },
    { label: "Rent per month", value: state => state.rent },
  ],
});
