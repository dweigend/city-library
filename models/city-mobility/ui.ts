import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData, type SpatialSegment } from "../../ui/index.ts";
import { model, type RouteName } from "./model.ts";

const routeColors: Record<RouteName, string> = {
  main: indexedColor(25),
  bypass: indexedColor(45),
  walk: indexedColor(105),
};
const queueColor = scientificPalette.waiting;
// Moving symbols are pale with a dark outline so they stand out on every route color.
const vehicleColor = scientificPalette.neutral;
const symbolOutline = indexedColor(0);
const dispatchSize = 20;

export const ui = defineUI(model, {
  setup: [{ field: "initialTrips", label: "Initial trips (people)" }],
  change: (instance, changes) => instance.setPolicy(changes),
  live: {
    carCapacity: { label: "Main road capacity (vehicles per link)" },
    walkMinutes: { label: "Walking/cycling path (min)" },
    carPenalty: { label: "Car penalty (min)" },
    departuresPerMinute: { label: "Departures per minute (first 60 min)" },
  },
  actions: [{ label: `Dispatch ${dispatchSize} extra trips now`, run: instance => instance.dispatchTrips(dispatchSize),
    enabled: state => state.tripCount + dispatchSize <= 5000 }],
  monitors: [
    { label: "Minute", value: state => state.tick },
    { label: "Car share (%)", value: state => state.carShare * 100, format: (value: number) => value.toFixed(0) },
    { label: "Queued cars", value: state => state.queuedCarCount },
    { label: "Mean trip (min)", value: state => state.meanCompletedTravelMinutes, format: (value: number) => value.toFixed(1) },
    { label: "Waiting (person-min)", value: state => state.totalWaitingMinutes },
    { label: "Main road now (min)", value: state => state.estimatedMinutes.main, format: (value: number) => value.toFixed(1) },
  ],
  views: [
    { type: "spatial", label: "Morning commute · orange main road, yellow bypass, blue walk/cycle · pale triangles cars, pale dots walkers · amber squares queued cars at each link entrance (+n beyond 12)", data: networkScene },
    { type: "line", label: "Departures by choice · cumulative", xAxis: { label: "Minute" }, yAxis: { label: "Trips" },
      series: state => [
        { label: "Main road", color: routeColors.main, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.carTripCount! - sample.values.bypassTripCount! })) },
        { label: "Bypass", color: routeColors.bypass, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.bypassTripCount! })) },
        { label: "Walk/cycle", color: routeColors.walk, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.walkTripCount! })) },
      ] },
    { type: "line", label: "Cars waiting in queues", xAxis: { label: "Minute" }, yAxis: { label: "Vehicles" },
      series: state => [{ label: "Queued cars", color: queueColor, points: state.history.map(sample => ({ x: sample.tick, y: sample.values.queuedCarCount! })) }] },
    { type: "bar", label: "Completed trip times by mode · shown once trips have arrived", xAxis: { label: "Door-to-door time", unit: "min" }, yAxis: { label: "Trips" },
      series: travelTimeHistogram },
  ],
});

type State = Observation<typeof model>;
type Point = { x: number; y: number };
// Presentation geometry only: three visibly separate paths between the same stops.
const stops: Record<string, Point> = { home: { x: -2.4, y: 0.25 }, junction: { x: 0, y: 1.25 }, jobs: { x: 2.4, y: 0.25 } };
const linkPaths: Record<string, readonly Point[]> = {
  "home-junction": [stops.home!, stops.junction!],
  "junction-jobs": [stops.junction!, stops.jobs!],
  "car-bypass": [stops.home!, { x: -1.2, y: -0.55 }, { x: 1.2, y: -0.55 }, stops.jobs!],
  "walking-path": [stops.home!, { x: -1.2, y: -1.3 }, { x: 1.2, y: -1.3 }, stops.jobs!],
};
const linkWidths: Record<RouteName, number> = { main: 5, bypass: 3.5, walk: 2.5 };
const maximumSymbolsPerLink = 60;
// Queued cars fill a fixed block of 4 × 3 squares beside the link entrance, so long queues never leave the scene.
const queueColumns = 4;
const queueRows = 3;
const queueSpacing = 0.15;
const queueBlocks: Record<string, Point | undefined> = {
  "home-junction": { x: -3.45, y: 0.75 },
  "car-bypass": { x: -3.45, y: -0.25 },
  "junction-jobs": { x: 0.6, y: 1.6 },
};

function networkScene(state: State): SpatialData {
  const segments: SpatialSegment[] = state.links.flatMap(link => pairs(linkPaths[link.id]!).map(([from, to]) => ({
    from, to, color: routeColors[link.route], width: linkWidths[link.route],
  })));
  const agents: SpatialAgent[] = Object.entries(stops).map(([id, point]) => ({
    id, ...point, shape: "rectangle", extent: { width: 0.42, height: 0.32 }, color: scientificPalette.neutral,
  }));
  // Stop names sit above their boxes, clear of the routes that leave downward.
  const labels = Object.entries(stops).map(([id, point]) => ({ x: point.x, y: point.y + (id === "junction" ? 0.4 : 0.38), text: state.nodes.find(node => node.id === id)!.label }));
  for (const link of state.links) {
    const moving = state.trips.filter(trip => trip.currentLink === link.id && trip.status === "moving");
    const path = linkPaths[link.id]!;
    for (const trip of moving.slice(0, maximumSymbolsPerLink)) {
      const { point, heading } = along(path, trip.progress);
      agents.push({ id: trip.id, ...point, heading, size: link.route === "walk" ? 9 : 14,
        shape: trip.mode === "car" ? "triangle" : "circle", color: vehicleColor, stroke: symbolOutline, strokeWidth: 1 });
    }
    const queued = state.trips.filter(trip => trip.currentLink === link.id && trip.status === "waiting");
    const block = queueBlocks[link.id];
    if (block) {
      const shown = queueColumns * queueRows;
      queued.slice(0, shown).forEach((trip, index) => agents.push({
        id: trip.id, x: block.x + (index % queueColumns) * queueSpacing, y: block.y - Math.floor(index / queueColumns) * queueSpacing,
        size: 7, shape: "rectangle", color: queueColor, stroke: symbolOutline, strokeWidth: 1,
      }));
      if (queued.length > shown) labels.push({ x: block.x + (queueColumns - 1) * queueSpacing / 2, y: block.y + 0.22, text: `+${queued.length - shown}` });
    }
    if (link.id === "home-junction") continue;
    // Summaries have their own rows below every route and vehicle, even on phones.
    const row = { main: -2.0, bypass: -2.5, walk: -3.0 }[link.route];
    labels.push({ x: 0, y: row, text: `${link.route === "main" ? "Main" : link.route === "bypass" ? "Bypass" : "Walk/cycle"}: ${linkSummary(state, link.route)}` });
  }
  return {
    width: 7.2, height: 6.7, labels, segments, agents,
    description: `Minute ${state.tick}. ${state.movingTrips} trips moving, ${state.queuedCarCount} cars queued, ${state.completedTrips} completed. Car share ${(state.carShare * 100).toFixed(0)} percent.`,
  };
}

/** Short per-route text: travel time, occupancy and queue (main road sums both links). */
function linkSummary(state: State, route: RouteName) {
  const routeLinks = state.links.filter(link => link.route === route);
  const minutes = routeLinks.reduce((sum, link) => sum + link.minutes, 0);
  const used = routeLinks.reduce((sum, link) => sum + link.used, 0);
  const waiting = routeLinks.reduce((sum, link) => sum + link.waiting, 0);
  if (route === "walk") return `${minutes} min · ${used} walking`;
  return `${minutes} min · ${used} driving · ${waiting} queued`;
}

function pairs(path: readonly Point[]) {
  return path.slice(1).map((to, index) => [path[index]!, to] as const);
}

/** Position and heading at a fraction of a polyline's length. */
function along(path: readonly Point[], fraction: number) {
  const lengths = pairs(path).map(([from, to]) => Math.hypot(to.x - from.x, to.y - from.y));
  let remaining = fraction * lengths.reduce((sum, length) => sum + length, 0);
  for (const [index, [from, to]] of pairs(path).entries()) {
    const length = lengths[index]!;
    if (remaining <= length || index === lengths.length - 1) {
      const share = length === 0 ? 0 : Math.min(1, remaining / length);
      // Canvas heading: 0° points up, clockwise positive.
      const heading = Math.atan2(to.x - from.x, to.y - from.y) * 180 / Math.PI;
      return { point: { x: from.x + (to.x - from.x) * share, y: from.y + (to.y - from.y) * share }, heading };
    }
    remaining -= length;
  }
  return { point: path[0]!, heading: 0 };
}

const binMinutes = 5;
function travelTimeHistogram(state: State) {
  const completed = state.trips.filter(trip => trip.completedAt !== null);
  // No arrivals yet: no bins, rather than an all-zero histogram.
  if (completed.length === 0) return [];
  const longest = Math.max(binMinutes * 4, ...completed.map(trip => trip.completedAt! - trip.departedAt));
  const bins = Array.from({ length: Math.ceil((longest + 1) / binMinutes) }, (_, index) => index * binMinutes);
  const count = (mode: "car" | "walk", from: number) => completed.filter(trip => trip.mode === mode &&
    trip.completedAt! - trip.departedAt >= from && trip.completedAt! - trip.departedAt < from + binMinutes).length;
  return [
    { label: "Car", color: routeColors.main, points: bins.map(from => ({ x: `${from}–${from + binMinutes - 1}`, y: count("car", from) })) },
    { label: "Walk/cycle", color: routeColors.walk, points: bins.map(from => ({ x: `${from}–${from + binMinutes - 1}`, y: count("walk", from) })) },
  ];
}
