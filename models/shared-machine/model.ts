import { Agent, World } from "city-library";
import type { Definition } from "../definition.ts";
import { validateStepCount } from "../parameters.ts";

export type User = "A" | "B";
export type Phase = "idle" | "reserved" | "running" | "repair";
export type Workshop = ReturnType<typeof createWorkshop>;

export function createWorkshop() {
  const world = World.create();
  const inventory = Agent.create({ unitCount: 2, consumedUnitCount: 0 });
  const machine = Agent.create<{
    phase: Phase; occupant: User | null; readyAt: number; completedJobCount: number;
  }>({ phase: "idle", occupant: null, readyAt: 0, completedJobCount: 0 });

  world.add(inventory);
  world.add(machine);

  return { world, inventory, machine };
}

export function reserve(model: Workshop, user: User) {
  if (model.machine.phase !== "idle" || model.inventory.unitCount < 1) return false;

  model.machine.phase = "reserved";
  model.machine.occupant = user;

  return true;
}

export function start(model: Workshop, user: User) {
  if (model.machine.phase !== "reserved" || model.machine.occupant !== user) return false;
  if (model.inventory.unitCount < 1) return false;

  model.inventory.unitCount -= 1;
  model.inventory.consumedUnitCount += 1;
  model.machine.phase = "running";

  return true;
}

export function cancel(model: Workshop, user: User) {
  if (model.machine.phase !== "reserved" || model.machine.occupant !== user) return false;

  model.machine.phase = "idle";
  model.machine.occupant = null;

  return true;
}

export function fail(model: Workshop, duration: number) {
  if (model.machine.phase !== "running") return false;

  model.machine.phase = "repair";
  model.machine.occupant = null;
  model.machine.readyAt = model.world.tick.value + duration;

  return true;
}

export function repair(model: Workshop) {
  if (model.machine.phase !== "repair") return false;
  if (model.world.tick.value < model.machine.readyAt) return false;

  model.machine.phase = "idle";

  return true;
}

export function complete(model: Workshop, user: User) {
  if (model.machine.phase !== "running" || model.machine.occupant !== user) return false;

  model.machine.completedJobCount += 1;
  model.machine.phase = "idle";
  model.machine.occupant = null;

  return true;
}

export function observe(model: Workshop) {
  const reserved = Number(model.machine.phase === "reserved");

  return {
    tick: model.world.tick.value,
    inventoryUnitCount: model.inventory.unitCount,
    availableUnitCount: model.inventory.unitCount - reserved,
    consumedUnitCount: model.inventory.consumedUnitCount,
    phase: model.machine.phase,
    occupant: model.machine.occupant,
    readyAt: model.machine.readyAt,
    completedJobCount: model.machine.completedJobCount,
  };
}

export function create() {
  const state = createWorkshop();
  return {
    reserve: (user: User) => reserve(state, user),
    start: (user: User) => start(state, user),
    cancel: (user: User) => cancel(state, user),
    fail: () => fail(state, 1),
    repair: () => repair(state),
    complete: (user: User) => complete(state, user),
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      state.world.tick.advance(stepCount);
    },
    read() { return observe(state); },
  };
}

export const model = {
  title: "Shared Machine",
  description: "Jobs reserve material and one machine, which can fail and must be repaired. Time in hours.",
  inputs: {},
  create,
} satisfies Definition<Record<string, never>, ReturnType<typeof create>>;
