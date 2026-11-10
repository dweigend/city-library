/** Original dwelling-slot reservation example. Eligibility edges are not occupancy. */
import { Agent, Graph, Resource, World, run, measurements, storage } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface OccupancyParameters { applicants: number; slots: number }
export const inputs: Inputs<OccupancyParameters> = {
  applicants: { kind: "number", default: 8, min: 1, max: 40, integer: true },
  slots: { kind: "number", default: 3, min: 1, max: 20, integer: true },
};
export function create(options: Partial<OccupancyParameters> = {}) {
  let settings = parameters(inputs, options);
  const world = World.create();
  const applicants = Array.from({ length: settings.applicants }, (_, index) => world.add(Agent.create({ label: `Household ${index + 1}` })));
  const building = { id: "building", label: "Dwelling slots" };
  const eligibility = Graph.add<(typeof applicants)[number] | typeof building>();
  eligibility.nodes.add(building);
  for (const applicant of applicants) {
    eligibility.nodes.add(applicant);
    eligibility.edges.add({ from: applicant, to: building });
  }
  // Resource tickets are the sole authority for waiting, granted and released allocations.
  const housing = Resource.add<(typeof applicants)[number]>({ capacity: settings.slots, policy: "fifo" });
  const tickets = applicants.map(owner => housing.request({ owner }));
  const measure = measurements.define((resource: typeof housing) => ({
    occupied: resource.used,
    available: resource.available,
    waiting: resource.waiting.length,
  }));
  const history = storage.history({ capacity: 120 });
  function record() {
    history.add({ tick: world.tick.value, values: measure.read(housing) });
  }
  function moveOut() {
    const ticket = tickets.find(ticket => ticket.status === "granted");
    if (ticket) {
      housing.release(ticket);
    }
  }
  const moveOutIntervalDays = 3;
  function step() {
    // One household moves out every three days; individual lease lengths are not modeled.
    if (world.tick.value % moveOutIntervalDays === moveOutIntervalDays - 1) {
      moveOut();
    }
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let index = 0; index < count; index += 1) {
        if (tickets.every(ticket => ticket.status === "released")) {
          break;
        }
        run(world, step);
        record();
      }
    },
    moveOut,
    setSlots(value: number) {
      const next = parameters(inputs, { ...settings, slots: value });
      housing.setCapacity(next.slots);
      settings = next;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        ...measure.read(housing),
        households: Object.freeze(tickets.map(ticket => Object.freeze({
          id: ticket.owner.id,
          label: ticket.owner.label,
          reservation: ticket.status,
        }))),
        eligibility: Object.freeze(eligibility.neighbors(building).map(applicant => Object.freeze({
          id: applicant.id,
          label: applicant.label,
        }))),
        history: history.samples,
        done: tickets.every(ticket => ticket.status === "released"),
      });
    },
  };
}
export const model = { title: "Residential Occupancy",
  description: "Illustrative FIFO dwelling-slot reservations with explicit releases and synthetic periodic household turnover; no housing forecast.", inputs, create,
} satisfies Definition<OccupancyParameters, ReturnType<typeof create>>;
