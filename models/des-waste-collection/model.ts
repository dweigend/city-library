/** Synthetic collection tour. Six fields start with two load units each; time is minutes. */
import { Agent, Agenda, Grid, Resource, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface WasteParameters { loadCapacity: number; unloadMinutes: number }
export const inputs: Inputs<WasteParameters> = {
  loadCapacity: { kind: "number", default: 4, min: 1, max: 12, integer: true },
  unloadMinutes: { kind: "number", default: 2, min: 1, max: 10, integer: true },
};
export function create(options: Partial<WasteParameters> = {}) {
  const settings = parameters(inputs, options);
  const world = World.create();
  const grid = Grid.create({ x: 3, y: 2 }, { state: { waste: 2 } });
  const truck = Agent.create({ load: 0 });
  world.add([grid, truck]);
  const agenda = Agenda.add<{ kind: "collect" | "unload" }>();
  const depot = Resource.add<typeof truck>({ capacity: 1 });
  let unloading: ReturnType<typeof depot.request> | undefined;
  let fieldIndex = 0;
  let delivered = 0;
  let done = false;
  const history: { x: number; y: number }[] = [];
  agenda.add({ at: 1, data: { kind: "collect" } });

  function collect() {
    const field = grid.fields[fieldIndex]!;
    truck.move({ to: { x: field.x, y: field.y } });
    const quantity = Math.min(field.waste, settings.loadCapacity - truck.load);
    field.waste -= quantity;
    truck.load += quantity;
    if (field.waste === 0) fieldIndex += 1;
    if (truck.load === settings.loadCapacity || fieldIndex === grid.fields.length) {
      unloading = depot.request({ owner: truck });
      if (unloading.status !== "granted") throw new Error("Single-truck depot must be available.");
      truck.move({ to: { x: -2, y: 0 } });
      agenda.add({ at: agenda.time + settings.unloadMinutes, data: { kind: "unload" } });
    } else agenda.add({ at: agenda.time + 1, data: { kind: "collect" } });
  }
  return {
    advance(count = 1) {
      stepCount(count);
      run(world, () => {
        const until = agenda.time + 1;
        let events = 0;
        for (;;) {
          if (events++ >= 1000) throw new RangeError("Waste collection event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          if (event.data.kind === "collect") collect();
          else {
            delivered += truck.load;
            truck.load = 0;
            depot.release(unloading!);
            unloading = undefined;
            done = fieldIndex === grid.fields.length;
            if (!done) agenda.add({ at: agenda.time + 1, data: { kind: "collect" } });
          }
        }
        history.push({ x: agenda.time, y: delivered });
        if (history.length > 300) history.shift();
      }, count);
    },
    read() {
      return {
        tick: world.tick.value, time: agenda.time, parameters: { ...settings }, done,
        remaining: grid.fields.reduce((sum, field) => sum + field.waste, 0),
        carried: truck.load, delivered, depotBusy: depot.used,
        truck: { id: truck.id, x: truck.x, y: truck.y },
        fields: grid.fields.map((field) => ({ id: field.id, x: field.x, y: field.y, waste: field.waste })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = {
  title: "DES Waste Collection", description: "A grid collection tour with a bounded truck and depot service. Load units and minutes; synthetic scenario.",
  inputs, create,
} satisfies Definition<WasteParameters, ReturnType<typeof create>>;
