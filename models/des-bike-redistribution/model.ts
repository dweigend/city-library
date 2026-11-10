/** Synthetic closed bike balance. Edge costs are minutes, and stores own station inventory. */
import { Agent, Agenda, Graph, Store, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface BikeParameters { targetBikes: number; truckCapacity: number }
export const inputs: Inputs<BikeParameters> = {
  targetBikes: { kind: "number", default: 2, min: 1, max: 6, integer: true },
  truckCapacity: { kind: "number", default: 2, min: 1, max: 6, integer: true },
};
export function create(options: Partial<BikeParameters> = {}) {
  const settings = parameters(inputs, options);
  const world = World.create();
  const stations = ["Depot", "Market", "Park"].map((label, index) => Agent.create({ label }, { position: { x: index * 2 - 2, y: 0 } }));
  const truck = Agent.create({ label: "Redistribution truck" }, { position: { x: -2, y: 0 } });
  world.add([...stations, truck]);
  const graph = Graph.create<typeof stations[number]>();
  for (const site of stations) graph.nodes.add(site);
  graph.edges.add({ from: stations[0]!, to: stations[1]! });
  graph.edges.add({ from: stations[1]!, to: stations[2]! });
  const distance = graph.distances({ from: stations[0]! });
  const stationCapacity = 18;
  const inventory = stations.map(() => Store.create<{ number: number }>({ capacity: stationCapacity }));
  for (let number = 1; number <= settings.targetBikes * 3; number++) inventory[0]!.put({ number });
  const agenda = Agenda.create<{ kind: "load" | "deliver"; destination: number }>();
  let cargo: { number: number }[] = [];
  let delivered = 0;
  let done = false;
  const trips: { destination: string; quantity: number; arrived: number }[] = [];
  agenda.add({ at: 0, data: { kind: "load", destination: 0 } });
  function load() {
    const destination = inventory.findIndex((store, index) => index > 0 && store.items.length < settings.targetBikes);
    if (destination < 0) { done = true; return; }
    const quantity = Math.min(settings.truckCapacity, settings.targetBikes - inventory[destination]!.items.length);
    cargo = [];
    for (let index = 0; index < quantity; index++) {
      const bike = inventory[0]!.take();
      if (!bike) throw new Error("Redistribution stock exhausted.");
      cargo.push(bike);
    }
    agenda.add({ at: agenda.time + distance.get(stations[destination]!)!, data: { kind: "deliver", destination } });
  }
  return {
    advance(count = 1) {
      stepCount(count);
      run(world, () => {
        const until = agenda.time + 1;
        let events = 0;
        for (;;) {
          if (events++ >= 1000) throw new RangeError("Bike redistribution event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          if (event.data.kind === "load") {
            truck.move({ to: { x: stations[0]!.x, y: stations[0]!.y } });
            load();
          } else {
            const destination = event.data.destination;
            truck.move({ to: { x: stations[destination]!.x, y: stations[destination]!.y } });
            for (const bike of cargo) {
              if (inventory[destination]!.put(bike).status !== "stored") throw new Error("Station capacity violated.");
            }
            delivered += cargo.length;
            trips.push({ destination: stations[destination]!.label, quantity: cargo.length, arrived: agenda.time });
            cargo = [];
            done = inventory.slice(1).every((store) => store.items.length === settings.targetBikes);
            if (!done) agenda.add({ at: agenda.time + distance.get(stations[destination]!)!, data: { kind: "load", destination: 0 } });
          }
        }
      }, count);
    },
    read() {
      return {
        tick: world.tick.value, time: agenda.time, parameters: { ...settings }, done, delivered,
        inTransit: cargo.length, totalBikes: inventory.reduce((sum, store) => sum + store.items.length, cargo.length),
        stations: stations.map((station, index) => ({ id: station.id, label: station.label, x: station.x, y: station.y, bikes: inventory[index]!.items.length, capacity: stationCapacity })),
        truck: { id: truck.id, x: truck.x, y: truck.y }, trips: trips.map((trip) => ({ ...trip })),
      };
    },
  };
}
export const model = {
  title: "DES Bike Redistribution", description: "A closed bike fleet moves between bounded station stores along graph travel times. Bikes and minutes; synthetic demand.", inputs, create,
} satisfies Definition<BikeParameters, ReturnType<typeof create>>;
