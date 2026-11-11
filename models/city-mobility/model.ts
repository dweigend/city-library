/** Original synthetic morning-peak model: queue-aware mode and route choice on FIFO capacity links. */
import { Graph, Resource, World, run, storage, type ResourceRequest } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, updateParameters, validateStepCount } from "../parameters.ts";

export interface MobilityParameters {
  initialTrips: number;
  carCapacity: number;
  carPenalty: number;
  walkMinutes: number;
  departuresPerMinute: number;
}
type PolicyKey = "carCapacity" | "carPenalty" | "walkMinutes" | "departuresPerMinute";
export type MobilityPolicy = Partial<Pick<MobilityParameters, PolicyKey>>;

export const inputs: Inputs<MobilityParameters> = {
  initialTrips: { kind: "number", default: 0, min: 0, max: 1000, integer: true },
  carCapacity: { kind: "number", default: 5, min: 1, max: 20, integer: true },
  carPenalty: { kind: "number", default: 0, min: 0, max: 10 },
  walkMinutes: { kind: "number", default: 18, min: 8, max: 30, integer: true },
  departuresPerMinute: { kind: "number", default: 3, min: 0, max: 10, integer: true },
};
const policyKeys: readonly PolicyKey[] = ["carCapacity", "carPenalty", "walkMinutes", "departuresPerMinute"];

export type Mode = "car" | "walk";
export type RouteName = "main" | "bypass" | "walk";
interface Stop { id: string; label: string; x: number; y: number }
interface LinkState { linkId: string; minutes: number }
interface Link {
  id: string;
  from: Stop;
  to: Stop;
  route: RouteName;
  minutes: number;
  resource: Resource<string>;
}
interface Trip {
  id: string;
  mode: Mode;
  route: RouteName;
  links: readonly Link[];
  linkIndex: number;
  ticket: ResourceRequest<string>;
  startedAt: number | null;
  linkMinutes: number;
  departedAt: number;
  completedAt: number | null;
  waitingMinutes: number;
}

const mainRoadMinutes = 5;
const bypassMinutes = 12;
const bypassCapacity = 3;
const walkingCapacity = 1000;
const peakMinutes = 60;
const maximumTrips = 5000;
const maximumDispatch = 1000;

export function create(options: Partial<MobilityParameters> = {}) {
  let parameters = parseParameters(inputs, options);
  const world = World.create();
  const history = storage.history({ capacity: 500 });
  const home: Stop = { id: "home", label: "Home", x: -2, y: 0 };
  const junction: Stop = { id: "junction", label: "Junction", x: 0, y: 1 };
  const jobs: Stop = { id: "jobs", label: "Jobs", x: 2, y: 0 };
  const nodes = [home, junction, jobs];
  const graph = Graph.create<Stop, LinkState>({ edgeState: { linkId: "", minutes: 1 } });
  for (const node of nodes) graph.nodes.add(node);
  const links: Link[] = [];
  function addLink(id: string, from: Stop, to: Stop, route: RouteName, minutes: number, capacity: number) {
    graph.edges.add({ from, to, directed: true, state: { linkId: id, minutes } });
    links.push({ id, from, to, route, minutes, resource: Resource.create<string>({ capacity }) });
  }
  addLink("home-junction", home, junction, "main", mainRoadMinutes, parameters.carCapacity);
  addLink("junction-jobs", junction, jobs, "main", mainRoadMinutes, parameters.carCapacity);
  addLink("car-bypass", home, jobs, "bypass", bypassMinutes, bypassCapacity);
  addLink("walking-path", home, jobs, "walk", parameters.walkMinutes, walkingCapacity);
  const walkingPath = links[3]!;
  const mainLinks = links.filter(link => link.route === "main");

  // The free-flow shortest car path through the graph is the main road.
  const distances = graph.allDistances({ cost: edge => edge.linkId === "walking-path" ? Infinity : edge.minutes });
  if (distances.get(home)?.get(jobs) !== 2 * mainRoadMinutes) throw new Error("The main road must be the free-flow car route.");
  const routes: Record<RouteName, readonly Link[]> = {
    main: mainLinks,
    bypass: [links[2]!],
    walk: [walkingPath],
  };

  function linkMinutes(link: Link) {
    return link === walkingPath ? parameters.walkMinutes : link.minutes;
  }

  /** Perceived time: link minutes plus the queue ahead divided by link throughput. */
  function estimatedMinutes(route: RouteName) {
    return routes[route].reduce((sum, link) => {
      const minutes = linkMinutes(link);
      const { used, waiting, capacity } = link.resource;
      return sum + minutes + Math.max(0, used + waiting.length + 1 - capacity) * minutes / capacity;
    }, 0);
  }

  const trips: Trip[] = [];
  let unservedDepartureCount = 0;

  function startGranted(minute: number) {
    for (const trip of trips) {
      if (trip.completedAt === null && trip.startedAt === null && trip.ticket.status === "granted") {
        trip.startedAt = minute;
        trip.linkMinutes = linkMinutes(trip.links[trip.linkIndex]!);
      }
    }
  }

  function departOne() {
    const mainMinutes = estimatedMinutes("main");
    const bypassEstimate = estimatedMinutes("bypass");
    const carRoute: RouteName = mainMinutes <= bypassEstimate ? "main" : "bypass";
    const mode: Mode = Math.min(mainMinutes, bypassEstimate) + parameters.carPenalty <= estimatedMinutes("walk") ? "car" : "walk";
    const route: RouteName = mode === "car" ? carRoute : "walk";
    const id = `trip-${trips.length + 1}`;
    trips.push({ id, mode, route, links: routes[route], linkIndex: 0,
      ticket: routes[route][0]!.resource.request({ owner: id }), startedAt: null, linkMinutes: 0,
      departedAt: world.tick.value, completedAt: null, waitingMinutes: 0 });
  }

  function dispatchTrips(count: number) {
    if (typeof count !== "number") throw new TypeError("Trip count must be numeric.");
    if (!Number.isSafeInteger(count) || count < 1 || count > maximumDispatch || count > maximumTrips - trips.length) {
      throw new RangeError("Dispatch 1 to 1000 trips within the 5000-trip lifetime limit.");
    }
    for (let index = 0; index < count; index++) departOne();
    startGranted(world.tick.value);
  }

  function step() {
    const minute = world.tick.value;
    if (minute < peakMinutes) {
      const room = maximumTrips - trips.length;
      const departing = Math.min(parameters.departuresPerMinute, room);
      unservedDepartureCount += parameters.departuresPerMinute - departing;
      for (let index = 0; index < departing; index++) departOne();
    }
    startGranted(minute);
    for (const trip of trips) {
      if (trip.completedAt === null && trip.ticket.status === "waiting") trip.waitingMinutes++;
    }
    for (const trip of trips) {
      if (trip.completedAt !== null || trip.startedAt === null) continue;
      if (trip.startedAt + trip.linkMinutes > minute + 1) continue;
      trip.links[trip.linkIndex]!.resource.release(trip.ticket);
      trip.linkIndex++;
      trip.startedAt = null;
      const nextLink = trip.links[trip.linkIndex];
      if (nextLink) trip.ticket = nextLink.resource.request({ owner: trip.id });
      else trip.completedAt = minute + 1;
    }
    startGranted(minute + 1);
  }

  function measures() {
    const completed = trips.filter(trip => trip.completedAt !== null);
    const waitingTrips = trips.filter(trip => trip.completedAt === null && trip.ticket.status === "waiting").length;
    const travelMinutes = (trip: Trip) => trip.completedAt! - trip.departedAt;
    const carTripCount = trips.filter(trip => trip.mode === "car").length;
    return {
      tripCount: trips.length,
      carTripCount,
      bypassTripCount: trips.filter(trip => trip.route === "bypass").length,
      walkTripCount: trips.length - carTripCount,
      carShare: trips.length === 0 ? 0 : carTripCount / trips.length,
      completedTrips: completed.length,
      waitingTrips,
      movingTrips: trips.length - completed.length - waitingTrips,
      queuedCarCount: links.filter(link => link.route !== "walk").reduce((sum, link) => sum + link.resource.waiting.length, 0),
      totalWaitingMinutes: trips.reduce((sum, trip) => sum + trip.waitingMinutes, 0),
      meanCompletedWaitingMinutes: completed.length === 0 ? 0 :
        completed.reduce((sum, trip) => sum + trip.waitingMinutes, 0) / completed.length,
      meanCompletedTravelMinutes: completed.length === 0 ? 0 :
        completed.reduce((sum, trip) => sum + travelMinutes(trip), 0) / completed.length,
      maximumCarTravelMinutes: Math.max(0, ...completed.filter(trip => trip.mode === "car").map(travelMinutes)),
    };
  }
  function sample() { history.add({ tick: world.tick.value, values: measures() }); }
  if (parameters.initialTrips > 0) dispatchTrips(parameters.initialTrips);
  sample();

  return {
    dispatchTrips,
    setPolicy(changes: MobilityPolicy) {
      const next = updateParameters(inputs, parameters, changes, policyKeys);
      // Existing holders keep their place; new grants wait until usage falls below capacity.
      for (const link of mainLinks) link.resource.setCapacity(next.carCapacity, { occupied: "retain" });
      parameters = next;
      startGranted(world.tick.value);
    },
    setCarPenalty(value: number) {
      parameters = updateParameters(inputs, parameters, { carPenalty: value }, ["carPenalty"]);
    },
    advance(steps = 1) {
      validateStepCount(steps);
      for (let index = 0; index < steps; index++) {
        run(world, step, 1);
        sample();
      }
    },
    read() {
      const minute = world.tick.value;
      return Object.freeze({
        tick: minute,
        peakMinutes,
        parameters: Object.freeze({ ...parameters }),
        ...measures(),
        unservedDepartureCount,
        estimatedMinutes: Object.freeze({ main: estimatedMinutes("main"), bypass: estimatedMinutes("bypass"), walk: estimatedMinutes("walk") }),
        nodes: Object.freeze(nodes.map(node => Object.freeze({ ...node }))),
        links: Object.freeze(links.map(link => Object.freeze({ id: link.id, from: link.from.id, to: link.to.id,
          route: link.route, minutes: linkMinutes(link), capacity: link.resource.capacity,
          used: link.resource.used, waiting: link.resource.waiting.length }))),
        trips: Object.freeze(trips.map(trip => {
          const status = trip.completedAt !== null ? "completed" as const : trip.ticket.status === "waiting" ? "waiting" as const : "moving" as const;
          return Object.freeze({ id: trip.id, mode: trip.mode, route: trip.route,
            currentLink: trip.completedAt === null ? trip.links[trip.linkIndex]!.id : null,
            // Fraction of the current link already traveled at this minute (0 while waiting).
            progress: status === "moving" && trip.startedAt !== null ? Math.min(1, (minute - trip.startedAt) / trip.linkMinutes) : 0,
            status, departedAt: trip.departedAt, completedAt: trip.completedAt, waitingMinutes: trip.waitingMinutes });
        })),
        history: history.samples,
      });
    },
  };
}

export const model = {
  title: "Urban Mobility",
  description: "A morning peak on a small network: travelers choose car or walking from the queues they see. Compare more road capacity with a faster walking route. Time in minutes.",
  inputs,
  create,
} satisfies Definition<MobilityParameters, ReturnType<typeof create>>;
