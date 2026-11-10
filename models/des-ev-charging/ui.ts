import { defineUI } from "../../ui/index.ts";
import { model } from "./model.ts";
import { chargingScene } from "./scene.ts";

export const ui = defineUI(model, {
  setup: ["vehicleCount", "sessionMinutes"],
  live: { chargerCount: { set: (instance, value) => instance.setChargers(value) } },
  actions: [
    { label: "Add priority vehicle", run: (instance) => instance.addVehicle(-1) },
    { label: "Cancel waiting vehicle", run: (instance) => instance.abandonWaiting(), enabled: (state) => state.waitingVehicleCount > 0 },
  ],
  monitors: [
    { label: "Time (min)", value: (state) => state.tick },
    { label: "Charging", value: (state) => state.activeVehicleCount },
    { label: "Waiting", value: (state) => state.waitingVehicleCount },
    { label: "Completed", value: (state) => state.completedVehicleCount },
    { label: "Abandoned", value: (state) => state.abandoned },
  ],
  views: [
    { type: "spatial", label: "Vehicles and charger capacity", data: chargingScene },
    { type: "line", label: "Charger occupancy", xAxis: { label: "Time", unit: "min" }, yAxis: { label: "Vehicles" }, series: (state) => [{ label: "Charging", points: state.history }] },
    { type: "table", label: "Charging sessions", rows: (state) => state.vehicles },
  ],
});
