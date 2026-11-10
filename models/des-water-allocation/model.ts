/** Allocation of finite service entitlements, not a hydraulic model. Time is minutes. */
import { Agenda, Grid, Resource, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface WaterParameters { supplyUnits: number; transferMinutes: number }
export const inputs: Inputs<WaterParameters> = {
  supplyUnits: { kind: "number", default: 6, min: 3, max: 12, step: 3, integer: true },
  transferMinutes: { kind: "number", default: 1, min: 1, max: 10, integer: true },
};
export function create(options: Partial<WaterParameters> = {}) {
  const settings = parameters(inputs, options);
  const world = World.create();
  const districts = Grid.create({ x: 2, y: 2 }, { state: { demand: 3, supplied: 0 } });
  world.add(districts);
  const entitlements = Resource.create<typeof districts.fields[number]>({ capacity: settings.supplyUnits });
  const agenda = Agenda.create<{ district: number }>();
  const requests = districts.fields.map((field) => ({ ticket: entitlements.request({ owner: field, units: field.demand }), scheduled: false }));
  function scheduleTransfers() {
    requests.forEach((request, index) => {
      if (request.ticket.status !== "granted" || request.scheduled) return;
      request.scheduled = true;
      agenda.add({ at: agenda.time + settings.transferMinutes, data: { district: index } });
    });
  }
  scheduleTransfers();
  return {
    addSupply(units = 3) {
      if (!Number.isSafeInteger(units) || units < 1 || units > 12) throw new RangeError("Supply addition must be 1 to 12 allocation units.");
      if (entitlements.capacity + units > 1_000_000) throw new RangeError("Supply limit exceeded.");
      entitlements.setCapacity(entitlements.capacity + units);
      scheduleTransfers();
    },
    advance(count = 1) {
      stepCount(count);
      run(world, () => {
        const until = agenda.time + 1;
        let events = 0;
        for (;;) {
          if (events++ >= 1000) throw new RangeError("Water allocation event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          const field = districts.fields[event.data.district]!;
          field.supplied = field.demand;
          // Retained claims represent consumed entitlements; release would reuse the same water.
        }
      }, count);
    },
    read() {
      const supplied = districts.fields.reduce((sum, field) => sum + field.supplied, 0);
      return {
        tick: world.tick.value, time: agenda.time, parameters: { ...settings }, supplied,
        supply: entitlements.capacity, committed: entitlements.used, available: entitlements.available,
        unmet: 12 - supplied, waiting: entitlements.waiting.length,
        districts: districts.fields.map((field, index) => ({ id: field.id, name: `District ${index + 1}`, x: field.x, y: field.y, demand: field.demand, supplied: field.supplied, status: requests[index]!.ticket.status })),
      };
    },
  };
}
export const model = {
  title: "DES Water Allocation", description: "FIFO allocation of finite supply units to four grid districts. Allocation only; no hydraulic pressure or flow claims.", inputs, create,
} satisfies Definition<WaterParameters, ReturnType<typeof create>>;
