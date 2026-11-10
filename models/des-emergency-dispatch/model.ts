/** Synthetic dispatch with nonpreemptive priority and graph-derived round-trip minutes. */
import { Agent, Agenda, Graph, Resource, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface DispatchParameters { responders: number; serviceMinutes: number }
export const inputs: Inputs<DispatchParameters> = {
  responders: { kind: "number", default: 1, min: 1, max: 3, integer: true },
  serviceMinutes: { kind: "number", default: 2, min: 1, max: 10, integer: true },
};
export function create(options: Partial<DispatchParameters> = {}) {
  let settings = parameters(inputs, options);
  const world = World.create();
  const sites = ["Station", "Market", "School", "Hospital"].map((label, index) => Agent.create({ label }, { position: { x: index * 2 - 3, y: 0 } }));
  world.add(sites);
  const graph = Graph.create<typeof sites[number]>();
  for (const site of sites) graph.nodes.add(site);
  for (let index = 1; index < sites.length; index++) graph.edges.add({ from: sites[index - 1]!, to: sites[index]! });
  const distances = graph.distances({ from: sites[0]! });
  const teams = Resource.create<{ number: number }>({ capacity: settings.responders, policy: "priority" });
  const agenda = Agenda.create<{ call: number }>();
  const calls = [
    { number: 1, location: 1, priority: 5 },
    { number: 2, location: 3, priority: 0 },
    { number: 3, location: 2, priority: 5 },
  ].map((call) => ({ ...call, started: -1, completed: -1, ticket: teams.request({ owner: { number: call.number }, priority: call.priority }) }));
  const order: number[] = [];
  function startGranted() {
    for (const call of calls) {
      if (call.ticket.status !== "granted" || call.started >= 0) continue;
      call.started = agenda.time;
      const travelMinutes = distances.get(sites[call.location]!)! * 2;
      agenda.add({ at: agenda.time + travelMinutes + settings.serviceMinutes, data: { call: call.number } });
    }
  }
  startGranted();
  return {
    setResponders(responders: number) {
      const next = parameters(inputs, { ...settings, responders });
      teams.setCapacity(responders, { occupied: "retain" });
      settings = next;
      startGranted();
    },
    advance(count = 1) {
      stepCount(count);
      run(world, () => {
        const until = agenda.time + 1;
        let events = 0;
        for (;;) {
          if (events++ >= 1000) throw new RangeError("Dispatch event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          const call = calls[event.data.call - 1]!;
          call.completed = agenda.time;
          order.push(call.number);
          teams.release(call.ticket);
          startGranted();
        }
      }, count);
    },
    read() {
      return {
        tick: world.tick.value, time: agenda.time, parameters: { ...settings }, busy: teams.used,
        waiting: teams.waiting.length, completed: order.length, order: [...order],
        calls: calls.map((call) => ({ number: call.number, location: sites[call.location]!.label, priority: call.priority, started: call.started, completed: call.completed, status: call.ticket.status })),
        nodes: sites.map((site) => ({ id: site.id, label: site.label })),
        edges: [...graph.edges].map((edge) => ({ id: edge.id, from: edge.from.id, to: edge.to.id })),
      };
    },
  };
}
export const model = {
  title: "DES Emergency Dispatch", description: "Nonpreemptive priority on graph-derived service trips. Minutes; no clinical or operational calibration.", inputs, create,
} satisfies Definition<DispatchParameters, ReturnType<typeof create>>;
