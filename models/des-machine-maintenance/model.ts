/** Synthetic deterministic failures and queued repairs; no lifetime calibration. */
import { Agent, Agenda, EventTrace, Resource, TimeWeighted, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface MaintenanceParameters {
  repairTeamCount: number;
  repairMinutes: number;
  failureMinutes: number;
}
export const inputs: Inputs<MaintenanceParameters> = {
  repairTeamCount: { kind: "number", default: 1, min: 1, max: 3, integer: true },
  repairMinutes: { kind: "number", default: 3, min: 1, max: 10, integer: true },
  failureMinutes: { kind: "number", default: 4, min: 1, max: 20, integer: true },
};
export function create(options: Partial<MaintenanceParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const world = World.create();
  const machines = Array.from({ length: 3 }, (_, index) => Agent.create({ number: index + 1, operational: true, repairCount: 0 }, { position: { x: index * 3 - 3, y: 0 } }));
  world.add(machines);
  const teams = Resource.create<typeof machines[number]>({ capacity: settings.repairTeamCount });
  const agenda = Agenda.create<{ kind: "failure" | "repair"; machine: number }>();
  const requests = new Map<number, { ticket: ReturnType<typeof teams.request>; started: boolean }>();
  const uptime = machines.map(() => TimeWeighted.create({ value: 1 }));
  const trace = EventTrace.create<{ machine: number; kind: string }>({ capacity: 100 });
  machines.forEach((machine, index) => agenda.add({ at: index + 2, data: { kind: "failure", machine: machine.number } }));
  function startRepairs() {
    for (const [number, request] of requests) {
      if (request.ticket.status !== "granted" || request.started) continue;
      request.started = true;
      agenda.add({ at: agenda.time + settings.repairMinutes, data: { kind: "repair", machine: number } });
    }
  }
  function failMachine(index: number) {
    const machine = machines[index]!;
    machine.operational = false;
    uptime[index]!.set({ at: agenda.time, value: 0 });
    requests.set(machine.number, {
      ticket: teams.request({ owner: machine }),
      started: false,
    });
  }
  function completeRepair(index: number) {
    const machine = machines[index]!;
    machine.operational = true;
    machine.repairCount += 1;
    uptime[index]!.set({ at: agenda.time, value: 1 });
    teams.release(requests.get(machine.number)!.ticket);
    requests.delete(machine.number);
    agenda.add({
      at: agenda.time + settings.failureMinutes + index,
      data: { kind: "failure", machine: machine.number },
    });
  }
  function machineStatus(machine: typeof machines[number]): string {
    if (machine.operational) return "operational";
    const request = requests.get(machine.number)!;
    return request.ticket.status === "granted" ? "repairing" : "waiting";
  }
  return {
    setRepairTeams(repairTeamCount: number) {
      const next = parseParameters(inputs, { ...settings, repairTeamCount: repairTeamCount });
      teams.setCapacity(repairTeamCount, { occupied: "retain" });
      settings = next;
      startRepairs();
    },
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      run(world, () => {
        const until = agenda.time + 1;
        let events = 0;
        for (;;) {
          if (events++ >= 1000) throw new RangeError("Maintenance event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          const index = event.data.machine - 1;
          const machine = machines[index]!;
          if (event.data.kind === "failure") failMachine(index);
          else completeRepair(index);
          trace.record({ at: agenda.time, value: { machine: machine.number, kind: event.data.kind } });
          startRepairs();
        }
      }, stepCount);
    },
    read() {
      const availability = uptime.map((monitor) => monitor.read({ until: agenda.time }).mean ?? 1);
      return {
        tick: world.tick.value, time: agenda.time, parameters: { ...settings }, busyRepairTeamCount: teams.used,
        waitingMachineCount: teams.waiting.length, operationalMachineCount: machines.filter((machine) => machine.operational).length,
        completedRepairCount: machines.reduce((sum, machine) => sum + machine.repairCount, 0),
        availability: availability.reduce((sum, value) => sum + value, 0) / machines.length,
        machines: machines.map((machine, index) => ({
          id: machine.id, number: machine.number, x: machine.x, y: machine.y, repairCount: machine.repairCount,
          availability: availability[index]!, status: machineStatus(machine),
        })),
        trace: trace.read().map((sample) => ({ minute: sample.at, machine: sample.value.machine, event: sample.value.kind })),
      };
    },
  };
}
export const model = {
  title: "DES Machine Maintenance", description: "Spatial machines fail, wait for repair teams and record time-weighted availability. Minutes; synthetic failure cycles.", inputs, create,
} satisfies Definition<MaintenanceParameters, ReturnType<typeof create>>;
