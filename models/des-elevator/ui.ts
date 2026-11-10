import { defineUI, scientificPalette } from "../../ui/index.ts";
import type { Observation, SpatialAgent, SpatialData } from "../../ui/index.ts";
import { model } from "./model.ts";

export const ui = defineUI(model, {
  setup: ["floorCount", "elevatorCount", "capacity", "travelTimeSeconds", "doorTimeSeconds", "transferTimeSeconds", "initialPassengerCount", "arrivalIntervalSeconds", "arrivalCountLimit"],
  actions: [{ label: "Add passenger", run: instance => instance.addPassenger() }],
  monitors: [
    { label: "Time (s)", value: state => state.time },
    { label: "Waiting", value: state => state.waitingPassengerCount },
    { label: "Riding", value: state => state.ridingPassengerCount },
    { label: "Arrived", value: state => state.arrivedPassengerCount },
    { label: "Mean wait (s)", value: state => state.meanWaitSeconds, format: (value: number) => value.toFixed(1) },
    { label: "Mean ride (s)", value: state => state.meanRideSeconds, format: (value: number) => value.toFixed(1) },
  ],
  views: [
    { type: "spatial", label: "Elevators", data: elevatorScene },
    { type: "table", label: "Passengers", rows: state => state.passengers },
  ],
});

export function elevatorScene(state: Observation<typeof model>): SpatialData {
  const longestLine = Math.max(0, ...state.floorQueues.map(line => line.passengers.length));
  const columns = Math.max(6, Math.min(20, Math.ceil(Math.sqrt(longestLine) * 2)));
  const queueRows = Math.ceil(longestLine / columns);
  const floorGap = Math.max(1.5, queueRows * 0.6 + 0.6);
  const floorSpan = (state.parameters.floorCount - 1) * floorGap;
  const width = columns * 0.35 + state.cars.length * 2.8 + 4;
  const height = floorSpan + floorGap * 1.4;
  const left = -width / 2;
  const queueLeft = left + 1.9;
  const carLeft = queueLeft + columns * 0.35 + 1.8;
  const floorY = (floor: number) => floor * floorGap - floorSpan / 2;
  const dotSize = longestLine > 20 ? 2 : longestLine > 10 ? 4 : 6;
  const riderSize = state.parameters.floorCount > 8 || longestLine > 20 ? 3 : 6;
  const agents: SpatialAgent[] = [];
  const labels = Array.from({ length: state.parameters.floorCount }, (_, floor) => ({
    x: left + 0.4, y: floorY(floor), text: String(floor),
  }));
  const segments = labels.map((_, floor) => ({
    from: { x: left + 1.4, y: floorY(floor) },
    to: { x: width / 2 - 0.5, y: floorY(floor) },
    color: scientificPalette.unavailable, width: 1,
  }));
  for (const line of state.floorQueues) {
    if (!line.passengers.length) continue;
    agents.push({ id: `call:${line.floor}:${line.direction}`, x: left + 1.1,
      y: floorY(line.floor) + line.direction * 0.25, shape: "triangle",
      heading: line.direction === 1 ? 0 : 180, size: 5, color: scientificPalette.waiting });
    line.passengers.forEach((number, index) => {
      const passenger = state.passengers[number - 1]!;
      agents.push({ id: passenger.id, x: queueLeft + index % columns * 0.35,
        y: floorY(line.floor) + line.direction * (0.25 + Math.floor(index / columns) * 0.3),
        shape: "circle", size: dotSize, color: scientificPalette.waiting });
    });
  }
  state.cars.forEach((car, index) => {
    const x = carLeft + index * 2.8;
    const y = floorY(car.floor);
    agents.push({ id: `shaft:${car.number}`, x, y: 0, shape: "rectangle",
      extent: { width: 2.2, height: floorSpan + 1.1 }, filled: false,
      stroke: scientificPalette.unavailable, strokeWidth: 1 });
    agents.push({ id: car.id, x, y, shape: "rectangle", extent: { width: 2.1, height: 0.9 },
      filled: false, stroke: car.used ? scientificPalette.active : scientificPalette.neutral, strokeWidth: 2 });
    labels.push({ x, y: floorSpan / 2 + floorGap * 0.5, text: `Car ${car.number}` });
    if (car.direction !== 0) agents.push({ id: `direction:${car.number}`, x, y: y + 0.65,
      shape: "triangle", heading: car.direction === 1 ? 0 : 180, size: 5, color: scientificPalette.neutral });
    const seatColumns = Math.min(4, car.capacity);
    const seatRows = Math.ceil(car.capacity / seatColumns);
    car.passengers.forEach((number, seat) => {
      const passenger = state.passengers[number - 1]!;
      agents.push({ id: passenger.id, x: x + (seat % seatColumns - (seatColumns - 1) / 2) * 0.4,
        y: y + ((seatRows - 1) / 2 - Math.floor(seat / seatColumns)) * 0.3,
        shape: "circle", size: riderSize, color: scientificPalette.active });
    });
  });
  return { width, height, agents, segments, labels, showLabels: false,
    description: `${state.parameters.floorCount} floors, ${state.cars.length} cars with ${state.parameters.capacity} slots each. ${state.waitingPassengerCount} amber floor dots waiting, ${state.ridingPassengerCount} teal cabin dots riding, ${state.arrivedPassengerCount} passengers have arrived and left the scene. Triangles indicate requested and car directions. Diagram coordinates; time ${state.time} seconds.` };
}
