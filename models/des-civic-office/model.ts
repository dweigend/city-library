/** Synthetic civic office. Time is minutes; no calibrated demand is claimed. */
import { Agenda, Resource } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface OfficeParameters { residents: number; clerks: number; serviceMinutes: number }
export const inputs: Inputs<OfficeParameters> = {
  residents: { kind: "number", default: 3, min: 0, max: 100, integer: true },
  clerks: { kind: "number", default: 1, min: 1, max: 10, integer: true },
  serviceMinutes: { kind: "number", default: 2, min: 1, max: 20, integer: true },
};
export function create(options: Partial<OfficeParameters> = {}) {
  let settings = parameters(inputs, options);
  const agenda = Agenda.create<{ resident: number }>();
  const desks = Resource.create<number>({ capacity: settings.clerks });
  const residents: { number: number; arrived: number; started?: number; completed?: number; ticket: ReturnType<typeof desks.request> }[] = [];
  const history: { x: number; y: number }[] = [];
  function startGranted() {
    for (const resident of residents) {
      if (resident.ticket.status !== "granted" || resident.started !== undefined) continue;
      resident.started = agenda.time;
      agenda.add({ at: agenda.time + settings.serviceMinutes, data: { resident: resident.number } });
    }
  }
  function addResident() {
    const number = residents.length + 1;
    residents.push({ number, arrived: agenda.time, ticket: desks.request({ owner: number }) });
    startGranted();
  }
  function record() {
    history.push({ x: agenda.time, y: desks.waiting.length });
    if (history.length > 1000) history.shift();
  }
  for (let index = 0; index < settings.residents; index += 1) addResident();
  record();
  return {
    addResident,
    setClerks(clerks: number) {
      const next = parameters(inputs, { ...settings, clerks });
      desks.setCapacity(clerks, { occupied: "retain" });
      settings = next;
      startGranted();
    },
    advance(count = 1) {
      stepCount(count);
      for (let step = 0; step < count; step += 1) {
        const until = agenda.time + 1;
        for (let events = 0; ; events += 1) {
          if (events >= 10_000) throw new RangeError("Office event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          const resident = residents[event.data.resident - 1]!;
          resident.completed = agenda.time;
          desks.release(resident.ticket);
          startGranted();
        }
        record();
      }
    },
    read() {
      const completed = residents.filter((resident) => resident.completed !== undefined);
      return {
        tick: agenda.time, parameters: { ...settings }, waiting: desks.waiting.length,
        busy: desks.used, completed: completed.length,
        totalWait: residents.reduce((sum, resident) => sum + (resident.started === undefined ? agenda.time : resident.started) - resident.arrived, 0),
        residents: residents.map((resident) => ({ number: resident.number, arrived: resident.arrived, started: resident.started ?? -1, completed: resident.completed ?? -1, status: resident.ticket.status })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = { title: "DES Civic Office", description: "A finite morning queue, FIFO desks and explicit capacity changes. Minutes; synthetic scenario.", inputs, create } satisfies Definition<OfficeParameters, ReturnType<typeof create>>;
