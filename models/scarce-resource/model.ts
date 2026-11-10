import { Agent } from "city-library";
import type { Definition } from "../definition.ts";
import { stepCount } from "../parameters.ts";

export type Allocation = ReturnType<typeof createAllocation>;
export type Applicant = Allocation["alice"];

export function createAllocation() {
  const inventory = Agent.create({ quantity: 1 });
  const alice = Agent.create({ name: "A", received: 0, eligible: true });
  const bob = Agent.create({ name: "B", received: 0, eligible: true });

  return { inventory, alice, bob };
}

export function chooseApplicant(priority: readonly Applicant[]) {
  return priority.find(applicant => applicant.eligible);
}

export function transferOne(model: Allocation, applicant: Applicant | undefined) {
  if (applicant === undefined || !applicant.eligible) return false;
  if (applicant !== model.alice && applicant !== model.bob) return false;
  if (applicant.received !== 0 || model.inventory.quantity < 1) return false;

  // No asynchronous work or callbacks occur between validation and application.
  model.inventory.quantity -= 1;
  applicant.received += 1;

  return true;
}

export function observe(model: Allocation) {
  const received = model.alice.received + model.bob.received;

  return {
    inventory: model.inventory.quantity,
    alice: model.alice.received,
    bob: model.bob.received,
    unmet: 2 - received,
  };
}

export function create() {
  const state = createAllocation();
  return {
    allocate(user: "A" | "B") { return transferOne(state, user === "A" ? state.alice : state.bob); },
    // Allocation requires an explicit applicant; playback must not invent a priority.
    advance(count = 1) { stepCount(count); },
    read() { return observe(state); },
  };
}

export const model = {
  title: "Scarce Resource",
  description: "One indivisible unit and two applicants; explicit priority decides allocation.",
  inputs: {},
  create,
} satisfies Definition<Record<string, never>, ReturnType<typeof create>>;
