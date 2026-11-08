import assert from "node:assert/strict";
import { Agent } from "city-library";

// One indivisible unit; both applicants request one unit.
// Priority is model policy, not a Library scheduler or allocation service.
const first = createAllocation();
const reversed = createAllocation();
const invalidated = createAllocation();

const firstPriority = [first.alice, first.bob];
const reversedPriority = [reversed.bob, reversed.alice];
const initial = observe(first);

const firstChoice = chooseApplicant(firstPriority);
const reversedChoice = chooseApplicant(reversedPriority);

const firstAccepted = transferOne(first, firstChoice);
const untouchedReversed = observe(reversed);
const reversedAccepted = transferOne(reversed, reversedChoice);

const staleChoice = chooseApplicant([invalidated.alice, invalidated.bob]);

invalidated.alice.eligible = false;

const beforeRejection = observe(invalidated);
const accepted = transferOne(invalidated, staleChoice);

assert.equal(accepted, false);
assert.deepEqual(observe(invalidated), beforeRejection);

// Policy: a stale choice is rejected. Consider the next applicant only
// through another explicit selection, rather than an invisible retry.
const replacement = chooseApplicant([invalidated.alice, invalidated.bob]);

const replacementAccepted = transferOne(invalidated, replacement);
const duplicateAccepted = transferOne(first, first.bob);

const firstResult = observe(first);
const reversedResult = observe(reversed);
const invalidatedResult = observe(invalidated);

console.log({ firstResult, reversedResult, invalidatedResult });

assert.equal(firstAccepted, true);
assert.equal(reversedAccepted, true);
assert.equal(replacement, invalidated.bob);
assert.equal(replacementAccepted, true);
assert.equal(duplicateAccepted, false);
assert.deepEqual(untouchedReversed, initial);
assert.deepEqual(firstResult, { inventory: 0, alice: 1, bob: 0, unmet: 1 });
assert.deepEqual(reversedResult, { inventory: 0, alice: 0, bob: 1, unmet: 1 });
assert.deepEqual(invalidatedResult, reversedResult);
assert.deepEqual(observe(first), firstResult);
assert.deepEqual(observe(first), firstResult);
assert.notEqual(first.inventory, reversed.inventory);
assert.notEqual(first.alice, reversed.alice);

for (const model of [first, reversed, invalidated]) assertBalance(model);

type Allocation = ReturnType<typeof createAllocation>;
type Applicant = Allocation["alice"];

function createAllocation() {
  const inventory = Agent.add({ quantity: 1 });
  const alice = Agent.add({ name: "A", received: 0, eligible: true });
  const bob = Agent.add({ name: "B", received: 0, eligible: true });

  return { inventory, alice, bob };
}

function chooseApplicant(priority: readonly Applicant[]) {
  return priority.find(applicant => applicant.eligible);
}

function transferOne(model: Allocation, applicant: Applicant | undefined) {
  if (applicant === undefined || !applicant.eligible) return false;
  if (applicant !== model.alice && applicant !== model.bob) return false;
  if (applicant.received !== 0 || model.inventory.quantity < 1) return false;

  // No asynchronous work or callbacks occur between validation and application.
  model.inventory.quantity -= 1;
  applicant.received += 1;

  return true;
}

function observe(model: Allocation) {
  const received = model.alice.received + model.bob.received;

  return {
    inventory: model.inventory.quantity,
    alice: model.alice.received,
    bob: model.bob.received,
    unmet: 2 - received,
  };
}

function assertBalance(model: Allocation) {
  const result = observe(model);

  assert.equal(result.inventory + result.alice + result.bob, 1);
  assert.ok(result.inventory >= 0 && result.alice >= 0 && result.bob >= 0);
  assert.ok(result.alice + result.bob <= 1);
}
