/** Synthetic charging sessions; duration is an input, not a battery model. */
import { Agenda, Resource } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface ChargingParameters { chargers: number; sessionMinutes: number; vehicles: number }
export const inputs: Inputs<ChargingParameters> = {
  chargers: { kind: "number", default: 2, min: 1, max: 10, integer: true },
  sessionMinutes: { kind: "number", default: 2, min: 1, max: 30, integer: true },
  vehicles: { kind: "number", default: 3, min: 0, max: 100, integer: true },
};
export function create(options: Partial<ChargingParameters> = {}) {
  let settings = parameters(inputs, options);
  const agenda = Agenda.create<{ vehicle: number; kind: "finish" | "abandon" }>();
  const chargers = Resource.create<number>({ capacity: settings.chargers, policy: "priority" });
  const vehicles: { number: number; duration: number; started?: number; finished?: number; ticket: ReturnType<typeof chargers.request> }[] = [];
  const history: { x: number; y: number }[] = [];
  let abandoned = 0;
  function startGranted() {
    for (const vehicle of vehicles) {
      if (vehicle.ticket.status !== "granted" || vehicle.started !== undefined) continue;
      vehicle.started = agenda.time;
      agenda.add({ at: agenda.time + vehicle.duration, data: { kind: "finish", vehicle: vehicle.number } });
    }
  }
  function addVehicle(priority = 0) {
    if (!Number.isSafeInteger(priority)) throw new RangeError("Priority must be a safe integer.");
    const number = vehicles.length + 1;
    vehicles.push({ number, duration: settings.sessionMinutes * (number === 2 ? 2 : 1), ticket: chargers.request({ owner: number, priority }) });
    startGranted();
  }
  for (let index = 0; index < settings.vehicles; index += 1) addVehicle();
  return {
    addVehicle,
    abandonWaiting() {
      const vehicle = vehicles.find((candidate) => candidate.ticket.status === "waiting");
      if (!vehicle) return;
      chargers.cancel(vehicle.ticket);
      abandoned += 1;
      startGranted();
    },
    setChargers(capacity: number) {
      const next = parameters(inputs, { ...settings, chargers: capacity });
      chargers.setCapacity(capacity, { occupied: "retain" });
      settings = next;
      startGranted();
    },
    advance(count = 1) {
      stepCount(count);
      for (let step = 0; step < count; step += 1) {
        const until = agenda.time + 1;
        for (let events = 0; ; events += 1) {
          if (events >= 10_000) throw new RangeError("Charging event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          const vehicle = vehicles[event.data.vehicle - 1]!;
          vehicle.finished = agenda.time;
          chargers.release(vehicle.ticket);
          startGranted();
        }
        history.push({ x: agenda.time, y: chargers.used });
        if (history.length > 1000) history.shift();
      }
    },
    read() {
      return {
        tick: agenda.time, parameters: { ...settings }, active: chargers.used,
        waiting: chargers.waiting.length, completed: vehicles.filter((vehicle) => vehicle.finished !== undefined).length, abandoned,
        vehicles: vehicles.map((vehicle) => ({ number: vehicle.number, duration: vehicle.duration, started: vehicle.started ?? -1, finished: vehicle.finished ?? -1, status: vehicle.ticket.status })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = { title: "DES EV Charging", description: "Priority charging queue, heterogeneous session durations and cancellation. Minutes; no battery physics.", inputs, create } satisfies Definition<ChargingParameters, ReturnType<typeof create>>;
