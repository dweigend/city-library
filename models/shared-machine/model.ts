import { Agent, World } from "city-library";
import type { Definition } from "../definition.ts";
import { stepCount } from "../parameters.ts";

export type User = "A" | "B";
export type Phase = "idle" | "reserved" | "running" | "repair";
export type Workshop = ReturnType<typeof createWorkshop>;

export function createWorkshop() {
  const world = World.add();
  const inventory = Agent.add({ quantity: 2, consumed: 0 });
  const machine = Agent.add<{
    phase: Phase; occupant: User | null; readyAt: number; completed: number;
  }>({ phase: "idle", occupant: null, readyAt: 0, completed: 0 });

  world.add(inventory);
  world.add(machine);

  return { world, inventory, machine };
}

export function reserve(model: Workshop, user: User) {
  if (model.machine.phase !== "idle" || model.inventory.quantity < 1) return false;

  model.machine.phase = "reserved";
  model.machine.occupant = user;

  return true;
}

export function start(model: Workshop, user: User) {
  if (model.machine.phase !== "reserved" || model.machine.occupant !== user) return false;
  if (model.inventory.quantity < 1) return false;

  model.inventory.quantity -= 1;
  model.inventory.consumed += 1;
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

  model.machine.completed += 1;
  model.machine.phase = "idle";
  model.machine.occupant = null;

  return true;
}

export function observe(model: Workshop) {
  const reserved = Number(model.machine.phase === "reserved");

  return {
    tick: model.world.tick.value,
    inventory: model.inventory.quantity,
    available: model.inventory.quantity - reserved,
    consumed: model.inventory.consumed,
    phase: model.machine.phase,
    occupant: model.machine.occupant,
    readyAt: model.machine.readyAt,
    completed: model.machine.completed,
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
    advance(count = 1) {
      stepCount(count);
      state.world.tick.advance(count);
    },
    read() { return observe(state); },
  };
}

export const model = {
  title: "Shared Machine",
  description: "Explicit reservation, consumption, failure and repair; time is in hours.",
  inputs: {},
  create,
} satisfies Definition<Record<string, never>, ReturnType<typeof create>>;
