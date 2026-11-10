/** Synthetic civic office. Time is minutes; no calibrated demand is claimed. */
import { Agenda, Resource } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface OfficeParameters { residentCount: number; clerkCount: number; serviceMinutes: number }
export const inputs: Inputs<OfficeParameters> = {
  residentCount: { kind: "number", default: 3, min: 0, max: 100, integer: true },
  clerkCount: { kind: "number", default: 1, min: 1, max: 10, integer: true },
  serviceMinutes: { kind: "number", default: 2, min: 1, max: 20, integer: true },
};
export function create(options: Partial<OfficeParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const agenda = Agenda.create<{ resident: number }>();
  const desks = Resource.create<number>({ capacity: settings.clerkCount });
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
  for (let index = 0; index < settings.residentCount; index += 1) addResident();
  record();
  return {
    addResident,
    setClerks(clerks: number) {
      const next = parseParameters(inputs, { ...settings, clerkCount: clerks });
      desks.setCapacity(clerks, { occupied: "retain" });
      settings = next;
      startGranted();
    },
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let step = 0; step < stepCount; step += 1) {
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
        tick: agenda.time, parameters: { ...settings }, waitingResidentCount: desks.waiting.length,
        waitingResidents: desks.waiting.map((request) => request.owner),
        busyClerkCount: desks.used, completedResidentCount: completed.length,
        totalWaitMinutes: residents.reduce((sum, resident) => sum + (resident.started === undefined ? agenda.time : resident.started) - resident.arrived, 0),
        residents: residents.map((resident) => ({ number: resident.number, arrived: resident.arrived, started: resident.started ?? -1, completed: resident.completed ?? -1, status: resident.ticket.status })),
        history: history.map((point) => ({ ...point })),
      };
    },
  };
}
export const model = { title: "Civic Office Queue", description: "Residents queue for a limited number of service desks during one morning.", inputs, create } satisfies Definition<OfficeParameters, ReturnType<typeof create>>;
