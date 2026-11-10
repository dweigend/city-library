import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { scene } from "./scene.ts";
export const ui = defineUI(model, {
  actions: [{ label: "Add 3 supply units", run: (instance) => instance.addSupply() }],
  monitors: [
    { label: "Time (min)", value: (state) => state.time },
    { label: "Supply units", value: (state) => state.supply },
    { label: "Delivered units", value: (state) => state.supplied },
    { label: "Unmet units", value: (state) => state.unmet },
  ],
  views: [
    { type: "spatial", label: "District allocation patches", data: scene },
    { type: "bar", label: "District allocation", yAxis: { unit: "allocation units" }, series: (state) => [
      { label: "Demand", points: state.districts.map((district) => ({ x: district.name, y: district.demand })) },
      { label: "Supplied", points: state.districts.map((district) => ({ x: district.name, y: district.supplied })) },
    ] },
    {
      type: "table",
      label: "Allocation ledger",
      rows: (state) => state.districts.map((district) => ({
        district: district.name,
        demand: district.demand,
        supplied: district.supplied,
        status: district.status,
      })),
    },
  ],
});
