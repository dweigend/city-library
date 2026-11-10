/** Depot backpressure, one-trip parcel agents and graph-derived round trips. */
import { Agent, Agenda, Graph, Resource, Store, World, run } from "city-library";
import type { ResourceRequest } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface ParcelParameters { parcels: number; depotCapacity: number; loadingMinutes: number }
export const inputs: Inputs<ParcelParameters> = {
  parcels: { kind: "number", default: 2, min: 0, max: 30, integer: true },
  depotCapacity: { kind: "number", default: 1, min: 1, max: 10, integer: true },
  loadingMinutes: { kind: "number", default: 1, min: 1, max: 10, integer: true },
};
type Parcel = Agent<{ number: number; destination: string }>;
interface ParcelJourney {
  agent: Parcel;
  minutes: number;
  dispatched?: number;
  delivered?: number;
  returned?: number;
  ticket?: ResourceRequest<Parcel>;
}
export function create(options: Partial<ParcelParameters> = {}) {
  const settings = parameters(inputs, options);
  const world = World.create();
  const agenda = Agenda.add<{ kind: "deliver" | "return"; parcel: number }>();
  const graph = Graph.add<{ id: string; label: string }, { minutes: number }>({ edgeState: { minutes: 1 } });
  const depot = graph.nodes.add({ id: "place:depot", label: "Depot" });
  const east = graph.nodes.add({ id: "place:east", label: "East" });
  const west = graph.nodes.add({ id: "place:west", label: "West" });
  graph.edges.add({ from: depot, to: east, state: { minutes: 2 } });
  graph.edges.add({ from: depot, to: west, state: { minutes: 3 } });
  graph.edges.add({ from: east, to: west, state: { minutes: 4 } });
  const distances = graph.distances({ from: depot, cost: (edge) => edge.minutes });
  const buffer = Store.add<Parcel>({ capacity: settings.depotCapacity });
  const van = Resource.add<Parcel>({ capacity: 1 });
  const parcels: ParcelJourney[] = [];
  const history: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  function dispatch() {
    if (van.available === 0) return;
    const agent = buffer.take();
    if (!agent) return;
    const parcel = parcels[agent.number - 1]!;
    parcel.ticket = van.request({ owner: agent });
    parcel.dispatched = agenda.time;
    agenda.add({ at: agenda.time + settings.loadingMinutes + parcel.minutes, data: { kind: "deliver", parcel: agent.number } });
  }
  function addParcel() {
    const number = parcels.length + 1;
    const destination = number % 2 === 1 ? east : west;
    const agent = world.add(Agent.create({ number, destination: destination.label }));
    parcels.push({ agent, minutes: distances.get(destination)! });
    buffer.put(agent);
    dispatch();
  }
  for (let index = 0; index < settings.parcels; index += 1) addParcel();
  return {
    addParcel,
    advance(count = 1) {
      stepCount(count);
      run(world, () => {
        const until = agenda.time + 1;
        for (let events = 0; ; events += 1) {
          if (events >= 10_000) throw new RangeError("Parcel event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          const parcel = parcels[event.data.parcel - 1]!;
          if (event.data.kind === "deliver") {
            parcel.delivered = agenda.time;
            agenda.add({ at: agenda.time + parcel.minutes, data: { kind: "return", parcel: parcel.agent.number } });
          } else {
            parcel.returned = agenda.time;
            van.release(parcel.ticket!);
            dispatch();
          }
        }
        history.push({ x: agenda.time, y: parcels.filter((parcel) => parcel.delivered !== undefined).length });
        if (history.length > 1000) history.shift();
      }, count);
    },
    read() {
      return {
        tick: world.tick.value, time: agenda.time, parameters: { ...settings },
        queued: buffer.items.length, blocked: buffer.waitingPuts.length, vanBusy: van.used,
        delivered: parcels.filter((parcel) => parcel.delivered !== undefined).length,
        parcels: parcels.map((parcel) => ({ number: parcel.agent.number, destination: parcel.agent.destination, routeMinutes: parcel.minutes, dispatched: parcel.dispatched ?? -1, delivered: parcel.delivered ?? -1, returned: parcel.returned ?? -1 })),
        nodes: [...graph.nodes].map((node) => ({ ...node })),
        edges: [...graph.edges].map((edge) => ({ id: edge.id, from: edge.from.id, to: edge.to.id })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = { title: "DES Parcel Logistics", description: "A bounded depot feeds a single van; delivery and return follow weighted network costs. Synthetic minutes.", inputs, create } satisfies Definition<ParcelParameters, ReturnType<typeof create>>;
