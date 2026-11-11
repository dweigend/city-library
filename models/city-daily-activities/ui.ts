import { defineUI, indexedColor, scientificPalette, type Observation, type SpatialAgent, type SpatialData } from "../../ui/index.ts";
import { model, type Activity } from "./model.ts";

const activityColors: Record<Activity, string> = {
  home: indexedColor(55),
  work: indexedColor(105),
  school: indexedColor(45),
  services: indexedColor(25),
  travel: indexedColor(125),
};
const routeColor = indexedColor(4);
const missedColor = indexedColor(15);
const errandColors = { done: indexedColor(55), planned: indexedColor(5), missed: missedColor };

export const ui = defineUI(model, {
  setup: [{ field: "householdCount", label: "Households (count)" }],
  live: {
    remoteWork: { label: "Remote work (applies next day)", set: (instance, value) => instance.setRemoteWork(value) },
    servicesLocation: { label: "Services used (applies next day)", set: (instance, value) => instance.setServicePolicy({ servicesLocation: value }) },
    servicesCloseHour: { label: "Services close at (hour, next day)", set: (instance, value) => instance.setServicePolicy({ servicesCloseHour: value }) },
  },
  monitors: [
    { label: "Clock", value: state => state.clock },
    { label: "Traveling now", value: state => state.travelingCount },
    { label: "Trips today", value: state => state.today.tripCount },
    { label: "Travel today (person h)", value: state => state.today.travelPersonHours },
    { label: "Errands done today", value: state => state.today.errandCount },
    { label: "Errands that cannot fit today", value: state => state.today.missedErrandCount },
  ],
  views: [
    { type: "spatial", label: "Town · Far, Middle, Near = home neighborhoods · circles adults, triangles children · green home, blue work, yellow school, orange services, magenta traveling · red ring: errand cannot fit today · gray box: services not used", data: townScene },
    { type: "bar", label: "Errands of adults today · done, still planned, cannot fit", xAxis: { label: "Errand status" }, yAxis: { label: "Adults" },
      series: state => {
        const counts = errandCounts(state);
        return [
          { label: "Done", color: errandColors.done, points: [{ x: "Done", y: counts.done }] },
          { label: "Still planned", color: errandColors.planned, points: [{ x: "Still planned", y: counts.planned }] },
          { label: "Cannot fit", color: errandColors.missed, points: [{ x: "Cannot fit", y: counts.missed }] },
        ];
      } },
    { type: "line", label: "Where residents are · 15-minute clock (equal counts overlap; school is drawn over work)", xAxis: { label: "Elapsed time", unit: "h" }, yAxis: { label: "Residents" },
      series: state => [
        whereSeries(state, "At home", "home", "atHomeCount"),
        whereSeries(state, "At work", "work", "atWorkCount"),
        whereSeries(state, "At school", "school", "atSchoolCount"),
        whereSeries(state, "At services", "services", "atServicesCount"),
        whereSeries(state, "Traveling", "travel", "travelingCount"),
      ] },
    { type: "bar", label: "Person-hours today by activity", xAxis: { label: "Activity" }, yAxis: { label: "Person-hours" },
      series: state => [{ label: "Today", color: activityColors.travel, points: (["home", "work", "school", "services", "travel"] as const)
        .map(activity => ({ x: activity === "travel" ? "Travel" : activity[0]!.toUpperCase() + activity.slice(1), y: state.today[activity] })) }] },
    { type: "inspector", label: "Selected resident's day", value: (state, selected) => {
      const resident = state.residents.find(candidate => candidate.id === selected);
      if (!resident) return undefined;
      return {
        resident: `${resident.role} from ${resident.neighborhood} homes`,
        now: resident.activity,
        errand: errandStatus(state, resident),
        plan: resident.plan.map(segment => `${hour(segment.startHour)}–${hour(segment.endHour)} ${segment.activity === "travel" ? `to ${segment.to}` : segment.activity}`).join("; "),
      };
    } },
  ],
});

type State = Observation<typeof model>;
// Scene coordinates are the model's km shifted right so the town is centered.
const offsetX = 1.5;
const offsetY = -0.25;
const clusterColumns = 6;
const clusterSpacing = 0.13;

function townScene(state: State): SpatialData {
  const activeServices = `services:${state.parameters.servicesLocation}`;
  const placeAgents: SpatialAgent[] = state.places.map(place => ({
    id: place.id, x: place.x + offsetX, y: place.y + offsetY, shape: "rectangle", extent: { width: 0.9, height: 0.62 },
    filled: false, stroke: place.id.startsWith("services") && place.id !== activeServices ? routeColor : scientificPalette.neutral,
    strokeWidth: 1.5, selectable: false,
  }));
  // Residents sharing a position (a place, or the same point of the same trip) form a centered cluster.
  const positionKey = (resident: State["residents"][number]) => `${resident.x.toFixed(2)},${resident.y.toFixed(2)}`;
  const clusterSizes = new Map<string, number>();
  for (const resident of state.residents) clusterSizes.set(positionKey(resident), (clusterSizes.get(positionKey(resident)) ?? 0) + 1);
  const clusterIndex = new Map<string, number>();
  const people: SpatialAgent[] = state.residents.map(resident => {
    const key = positionKey(resident);
    const index = clusterIndex.get(key) ?? 0;
    clusterIndex.set(key, index + 1);
    const size = clusterSizes.get(key)!;
    const rows = Math.ceil(size / clusterColumns);
    const columnCount = Math.min(size, clusterColumns);
    const dx = (index % clusterColumns - (columnCount - 1) / 2) * clusterSpacing;
    const dy = ((rows - 1) / 2 - Math.floor(index / clusterColumns)) * clusterSpacing;
    return {
      id: resident.id, x: resident.x + offsetX + dx, y: resident.y + offsetY + dy, size: 8,
      shape: resident.role === "adult" ? "circle" : "triangle", color: activityColors[resident.activity],
      ...(resident.missedErrandToday ? { stroke: missedColor, strokeWidth: 2 } : {}),
    };
  });
  const routes = new Map<string, { from: { x: number; y: number }; to: { x: number; y: number } }>();
  const placeById = new Map(state.places.map(place => [place.id, place]));
  for (const resident of state.residents) {
    for (const segment of resident.plan.filter(candidate => candidate.activity === "travel")) {
      const from = placeById.get(segment.from)!;
      const to = placeById.get(segment.to)!;
      routes.set([segment.from, segment.to].sort().join("|"), { from: { x: from.x + offsetX, y: from.y + offsetY }, to: { x: to.x + offsetX, y: to.y + offsetY } });
    }
  }
  return {
    width: 9.4, height: 5.4,
    labels: [
      { x: -3.4, y: 2.35, text: state.clock },
      // Homes, work and school are labeled above their box; service places below, away from the home row.
      ...state.places.map(place => ({ x: place.x + offsetX, y: place.y + offsetY + (place.id.startsWith("services") ? -0.55 : 0.52), text: place.label })),
      { x: 0, y: -2.45, text: `Errands today: ${state.today.errandCount} done · ${state.today.missedErrandCount} cannot fit` },
    ],
    segments: [...routes.values()].map(route => ({ ...route, color: routeColor, width: 1.5 })),
    agents: [...placeAgents, ...people],
    description: `${state.clock}. ${state.atHomeCount} at home, ${state.atWorkCount} working, ${state.atSchoolCount} at school, ${state.atServicesCount} at services, ${state.travelingCount} traveling. Errands today: ${state.today.errandCount} done, ${state.today.missedErrandCount} cannot fit.`,
  };
}

function whereSeries(state: State, label: string, activity: Activity, key: "atHomeCount" | "atWorkCount" | "atSchoolCount" | "atServicesCount" | "travelingCount") {
  return { label, color: activityColors[activity], points: state.history.map(sample => ({ x: sample.tick / 4, y: sample.values[key]! })) };
}

function hour(value: number) {
  const minutes = Math.round(value * 60);
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Clock hour of the current observation; at midnight after day one the finished plan is still shown. */
function clockHour(state: State) {
  return (state.tick % 96) / 4;
}

/** Errand state read from the resident's fixed plan for the day and the clock; no new rule. */
function errandStatus(state: State, resident: State["residents"][number]) {
  if (resident.role === "child") return "None";
  if (resident.missedErrandToday) return `Cannot fit: services close at ${hour(state.parameters.servicesCloseHour)}`;
  const visit = resident.plan.find(segment => segment.activity === "services");
  if (!visit) return "None";
  const now = state.tick > 0 && state.tick % 96 === 0 ? 24 : clockHour(state);
  if (now >= visit.endHour) return `Done ${hour(visit.startHour)}–${hour(visit.endHour)}`;
  if (now >= visit.startHour) return `At services until ${hour(visit.endHour)}`;
  return `Planned ${hour(visit.startHour)}–${hour(visit.endHour)}`;
}

/** Adults' errands today: done (counted by the model), missed (decided at day start) and the rest still planned. */
function errandCounts(state: State) {
  const adults = state.residents.filter(resident => resident.role === "adult").length;
  const done = state.today.errandCount;
  const missed = state.today.missedErrandCount;
  return { done, missed, planned: adults - done - missed };
}
