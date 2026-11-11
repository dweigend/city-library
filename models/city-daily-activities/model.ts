/** Original deterministic 15-minute activity schedules inspired by time geography; no empirical calibration. */
import { World, run, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export type Neighborhood = "near" | "middle" | "far";
export type ServicesLocation = "central" | "local";
export type Activity = "home" | "work" | "school" | "services" | "travel";
export interface DailyActivitiesParameters {
  householdCount: number;
  remoteWork: boolean;
  servicesLocation: ServicesLocation;
  servicesCloseHour: number;
}
export interface PersonHours {
  home: number;
  work: number;
  school: number;
  services: number;
  travel: number;
}

export const inputs: Inputs<DailyActivitiesParameters> = {
  householdCount: { kind: "number", default: 6, min: 1, max: 30, integer: true },
  remoteWork: { kind: "boolean", default: false },
  servicesLocation: { kind: "choice", default: "central", options: ["central", "local"] },
  servicesCloseHour: { kind: "number", default: 18, min: 16, max: 22, step: 0.25 },
};
type ServiceKey = "servicesLocation" | "servicesCloseHour";

const stepsPerHour = 4;
const stepsPerDay = 24 * stepsPerHour;
const hoursPerStep = 1 / stepsPerHour;
const kmPerStep = 3; // 12 km/h door to door.
const workStartStep = 8 * stepsPerHour;
const workEndStep = 16 * stepsPerHour;
const schoolStartStep = 8 * stepsPerHour;
const schoolEndStep = 14 * stepsPerHour;
const errandSteps = 1 * stepsPerHour;
const historyCapacity = 2 * stepsPerDay + 1;
const neighborhoods: readonly Neighborhood[] = ["near", "middle", "far"];

interface Place { id: string; label: string; x: number; y: number }
const places: readonly Place[] = [
  { id: "home:near", label: "Near", x: -1, y: 0 },
  { id: "home:middle", label: "Middle", x: -3, y: 0 },
  { id: "home:far", label: "Far", x: -5, y: 0 },
  { id: "work", label: "Work", x: 2, y: 0 },
  { id: "school", label: "School", x: -2, y: 1.5 },
  { id: "services:central", label: "Services", x: 2, y: -1 },
  { id: "services:local", label: "Local shops", x: -3, y: -1 },
];
const placesById = new Map(places.map(place => [place.id, place]));

/** One plan segment occupies slots [start, end) of the day. */
interface Segment { activity: Activity; from: Place; to: Place; start: number; end: number }
interface Resident {
  id: string;
  householdId: number;
  role: "adult" | "child";
  neighborhood: Neighborhood;
  home: Place;
  plan: Segment[];
  missedErrandToday: boolean;
}

function travelSteps(from: Place, to: Place) {
  return Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / kmPerStep);
}

/** Build a day from fixed anchors; travel fills the gaps between them. */
function planDay(resident: Resident, parameters: DailyActivitiesParameters): { plan: Segment[]; missed: boolean } {
  const plan: Segment[] = [];
  let at = resident.home;
  let slot = 0;
  const stay = (activity: Activity, place: Place, end: number) => {
    if (end > slot) plan.push({ activity, from: place, to: place, start: slot, end });
    slot = Math.max(slot, end);
  };
  const travel = (to: Place) => {
    const end = slot + travelSteps(at, to);
    plan.push({ activity: "travel", from: at, to, start: slot, end });
    slot = end;
    at = to;
  };
  const travelArrivingAt = (to: Place, arrival: number) => {
    stay(activity(at), at, arrival - travelSteps(at, to));
    travel(to);
  };
  const activity = (place: Place): Activity => place === resident.home ? "home" : place.id.startsWith("services") ? "services" : place.id === "school" ? "school" : "work";

  if (resident.role === "child") {
    const school = placesById.get("school")!;
    travelArrivingAt(school, schoolStartStep);
    stay("school", school, schoolEndStep);
    travel(resident.home);
    stay("home", resident.home, stepsPerDay);
    return { plan, missed: false };
  }
  if (parameters.remoteWork) {
    stay("home", resident.home, workStartStep);
    stay("work", resident.home, workEndStep);
  } else {
    const work = placesById.get("work")!;
    travelArrivingAt(work, workStartStep);
    stay("work", work, workEndStep);
  }
  const services = placesById.get(`services:${parameters.servicesLocation}`)!;
  const closeStep = parameters.servicesCloseHour * stepsPerHour;
  const missed = slot + travelSteps(at, services) + errandSteps > closeStep;
  if (!missed) {
    travel(services);
    stay("services", services, slot + errandSteps);
  }
  if (at !== resident.home) travel(resident.home);
  stay("home", resident.home, stepsPerDay);
  return { plan, missed };
}

function emptyHours(): PersonHours {
  return { home: 0, work: 0, school: 0, services: 0, travel: 0 };
}

export function create(options: Partial<DailyActivitiesParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const residents: Resident[] = [];
  for (let householdId = 0; householdId < parameters.householdCount; householdId += 1) {
    const neighborhood = neighborhoods[householdId % neighborhoods.length]!;
    const home = placesById.get(`home:${neighborhood}`)!;
    for (const role of ["adult", "child"] as const) {
      residents.push({ id: `${householdId}:${role}`, householdId, role, neighborhood, home, plan: [], missedErrandToday: false });
    }
  }
  const personHours = emptyHours();
  let today = { ...emptyHours(), tripCount: 0, errandCount: 0, missedErrandCount: 0 };
  let tripCount = 0;
  let errandCount = 0;
  let missedErrandCount = 0;
  const history = storage.history({ capacity: historyCapacity });

  function planResidents() {
    for (const resident of residents) {
      const { plan, missed } = planDay(resident, parameters);
      resident.plan = plan;
      resident.missedErrandToday = missed;
    }
  }

  /** Plans are fixed for the whole day; a missed errand counts when its day begins. */
  function startDay() {
    if (world.tick.value > 0) planResidents();
    today = { ...emptyHours(), tripCount: 0, errandCount: 0, missedErrandCount: 0 };
    today.missedErrandCount = residents.filter(resident => resident.missedErrandToday).length;
    missedErrandCount += today.missedErrandCount;
  }

  function segmentAt(resident: Resident, slot: number) {
    return resident.plan.find(segment => segment.start <= slot && slot < segment.end)!;
  }

  function step() {
    const slot = world.tick.value % stepsPerDay;
    if (slot === 0) startDay();
    for (const resident of residents) {
      const segment = segmentAt(resident, slot);
      personHours[segment.activity] += hoursPerStep;
      today[segment.activity] += hoursPerStep;
      if (segment.activity === "travel" && segment.end === slot + 1) {
        tripCount += 1;
        today.tripCount += 1;
      }
      if (segment.activity === "services" && segment.end === slot + 1) {
        errandCount += 1;
        today.errandCount += 1;
      }
    }
  }

  /** Location and activity at the current clock time (the slot about to start). */
  function positionOf(resident: Resident) {
    if (resident.plan.length === 0) return { activity: "home" as Activity, x: resident.home.x, y: resident.home.y };
    const slot = world.tick.value % stepsPerDay;
    // At midnight the old plan has ended and everyone is home.
    const segment = world.tick.value > 0 && slot === 0 ? undefined : segmentAt(resident, slot);
    if (!segment) return { activity: "home" as Activity, x: resident.home.x, y: resident.home.y };
    const progress = segment.activity === "travel" ? (slot - segment.start + 0.5) / (segment.end - segment.start) : 0;
    return {
      activity: segment.activity,
      x: segment.from.x + (segment.to.x - segment.from.x) * progress,
      y: segment.from.y + (segment.to.y - segment.from.y) * progress,
    };
  }

  function occupancy() {
    const counts = emptyHours();
    for (const resident of residents) counts[positionOf(resident).activity] += 1;
    return counts;
  }

  function record() {
    const counts = occupancy();
    history.add({ tick: world.tick.value, values: {
      atHomeCount: counts.home, atWorkCount: counts.work, atSchoolCount: counts.school,
      atServicesCount: counts.services, travelingCount: counts.travel, tripCount,
    } });
  }
  // Plans exist from setup so the first day can be shown before any step.
  planResidents();
  record();

  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let index = 0; index < stepCount; index += 1) {
        run(world, step);
        record();
      }
    },
    setRemoteWork(remoteWork: boolean) {
      parameters = updateParameters(inputs, parameters, { remoteWork }, ["remoteWork"]);
      if (world.tick.value === 0) planResidents();
    },
    setServicePolicy(changes: Partial<Pick<DailyActivitiesParameters, ServiceKey>>) {
      parameters = updateParameters(inputs, parameters, changes, ["servicesLocation", "servicesCloseHour"]);
      if (world.tick.value === 0) planResidents();
    },
    read() {
      const minutes = (world.tick.value % stepsPerDay) * 60 / stepsPerHour;
      const day = Math.floor(world.tick.value / stepsPerDay) + 1;
      const counts = occupancy();
      return Object.freeze({
        tick: world.tick.value,
        clock: `Day ${day} · ${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`,
        parameters: Object.freeze({ ...parameters }),
        residentCount: residents.length,
        places: Object.freeze(places.map(place => Object.freeze({ ...place }))),
        residents: Object.freeze(residents.map(resident => Object.freeze({
          id: resident.id, householdId: resident.householdId, role: resident.role,
          neighborhood: resident.neighborhood, missedErrandToday: resident.missedErrandToday,
          ...positionOf(resident),
          plan: Object.freeze(resident.plan.map(segment => Object.freeze({
            activity: segment.activity, from: segment.from.id, to: segment.to.id,
            startHour: segment.start / stepsPerHour, endHour: segment.end / stepsPerHour,
          }))),
        }))),
        atHomeCount: counts.home,
        atWorkCount: counts.work,
        atSchoolCount: counts.school,
        atServicesCount: counts.services,
        travelingCount: counts.travel,
        personHours: Object.freeze({ ...personHours }),
        accountedPersonHours: Object.values(personHours).reduce((sum, hours) => sum + hours, 0),
        today: Object.freeze({ ...today, travelPersonHours: today.travel }),
        tripCount,
        errandCount,
        missedErrandCount,
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Daily Activities",
  description: "Residents follow 15-minute schedules with real travel times. Remote work, service location and closing time decide which errands still fit into a day.",
  inputs,
  create,
} satisfies Definition<DailyActivitiesParameters, ReturnType<typeof create>>;
