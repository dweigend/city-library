import assert from "node:assert/strict";
import { createAllocation, chooseApplicant, transferOne, observe, type Allocation } from "../../../models/scarce-resource/model.ts";

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

function assertBalance(model: Allocation) {
  const result = observe(model);

  assert.equal(result.inventory + result.alice + result.bob, 1);
  assert.ok(result.inventory >= 0 && result.alice >= 0 && result.bob >= 0);
  assert.ok(result.alice + result.bob <= 1);
}
