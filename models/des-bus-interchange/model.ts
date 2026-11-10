/** Weighted graph travel and a separate finite berth resource; minutes. */
import { Agent, Agenda, Graph, Resource, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface BusParameters { busCount: number; berthCount: number; dwellMinutes: number }
export const inputs: Inputs<BusParameters> = {
  busCount: { kind: "number", default: 2, min: 0, max: 30, integer: true },
  berthCount: { kind: "number", default: 1, min: 1, max: 5, integer: true },
  dwellMinutes: { kind: "number", default: 2, min: 1, max: 10, integer: true },
};
export function create(options: Partial<BusParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const world = World.create();
  const agenda = Agenda.create<{ kind: "arrive" | "depart"; bus: number }>();
  const graph = Graph.create<{ id: string; label: string }, { minutes: number }>({ edgeState: { minutes: 1 } });
  const origin = graph.nodes.add({ id: "stop:origin", label: "District" });
  const junction = graph.nodes.add({ id: "stop:junction", label: "Junction" });
  const interchange = graph.nodes.add({ id: "stop:interchange", label: "Interchange" });
  const outbound = graph.edges.add({ from: origin, to: junction, state: { minutes: 2 } });
  const inbound = graph.edges.add({ from: junction, to: interchange, state: { minutes: 3 } });
  graph.edges.add({ from: origin, to: interchange, state: { minutes: 8 } });
  const travelMinutes = graph.distances({ from: origin, cost: (edge) => edge.minutes }).get(interchange)!;
  const berths = Resource.create<Agent<{ number: number }>>({ capacity: settings.berthCount });
  const buses: { agent: Agent<{ number: number }>; dispatchedAt: number; arrived?: number; started?: number; departed?: number; ticket?: ReturnType<typeof berths.request> }[] = [];
  const history: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  function addBus() {
    const number = buses.length + 1;
    const agent = world.add(Agent.create({ number }));
    buses.push({ agent, dispatchedAt: agenda.time });
    agenda.add({ at: agenda.time + travelMinutes, data: { kind: "arrive", bus: number } });
  }
  function startGranted() {
    for (const bus of buses) {
      if (bus.ticket?.status !== "granted" || bus.started !== undefined) continue;
      bus.started = agenda.time;
      agenda.add({ at: agenda.time + settings.dwellMinutes, data: { kind: "depart", bus: bus.agent.number } });
    }
  }
  for (let index = 0; index < settings.busCount; index += 1) addBus();
  return {
    addBus,
    setBerths(capacity: number) {
      const next = parseParameters(inputs, { ...settings, berthCount: capacity });
      berths.setCapacity(capacity, { occupied: "retain" });
      settings = next;
      startGranted();
    },
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      run(world, () => {
        const until = agenda.time + 1;
        for (let events = 0; ; events += 1) {
          if (events >= 10_000) throw new RangeError("Bus event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          const bus = buses[event.data.bus - 1]!;
          if (event.data.kind === "arrive") {
            bus.arrived = agenda.time;
            bus.ticket = berths.request({ owner: bus.agent });
          } else {
            bus.departed = agenda.time;
            berths.release(bus.ticket!);
          }
          startGranted();
        }
        history.push({ x: agenda.time, y: berths.waiting.length });
        if (history.length > 1000) history.shift();
      }, stepCount);
    },
    read() {
      return {
        tick: world.tick.value, time: agenda.time, parameters: { ...settings }, travelMinutes,
        waitingBusCount: berths.waiting.length, occupiedBerthCount: berths.used, departedBusCount: buses.filter((bus) => bus.departed !== undefined).length,
        buses: buses.map((bus) => ({ number: bus.agent.number, arrived: bus.arrived ?? -1, started: bus.started ?? -1, departedAtMinutes: bus.departed ?? -1, dispatchedAt: bus.dispatchedAt })),
        nodes: [...graph.nodes].map((node) => ({ ...node })),
        edges: [...graph.edges].map((edge) => ({ id: edge.id, from: edge.from.id, to: edge.to.id })),
        route: [outbound, inbound].map((edge) => ({ from: edge.from.id, to: edge.to.id, minutes: edge.minutes })),
        edgeCosts: [...graph.edges].map((edge) => ({ id: edge.id, minutes: edge.minutes })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = { title: "Bus Interchange", description: "Buses travel to an interchange and wait for a free berth before passengers are served.", inputs, create } satisfies Definition<BusParameters, ReturnType<typeof create>>;
