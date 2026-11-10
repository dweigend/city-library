import assert from "node:assert/strict";
import { createExchangeModel } from "../models/exchange.ts";

function energies(model: ReturnType<typeof createExchangeModel>) {
  return model.read().agents.map((agent) => agent.energy);
}
const first = createExchangeModel({ count: 24, initialEnergy: 10, seed: 1 });
const second = createExchangeModel({ count: 24, initialEnergy: 10, seed: 1 });
const third = createExchangeModel({ count: 24, initialEnergy: 10, seed: 2 });
const initial = first.read();
assert.equal(initial.totalEnergy, 240);
assert.equal(initial.tick, 0);
assert.deepEqual(first.read(), initial);
assert.deepEqual(first.read(), initial);
first.advance(100);
second.advance(40);
second.advance(60);
third.advance(100);
assert.deepEqual(energies(first), energies(second));
assert.notDeepEqual(energies(first), energies(third));
for (const model of [first, second, third]) {
  const state = model.read();
  assert.equal(state.tick, 100);
  assert.equal(state.agentCount, 24);
  assert.equal(state.totalEnergy, 240);
  assert.ok(state.agents.every((agent) => Number.isSafeInteger(agent.energy) && agent.energy >= 0));
  assert.equal(state.agents.reduce((sum, agent) => sum + agent.sent, 0), state.agents.reduce((sum, agent) => sum + agent.received, 0));
  assert.equal(state.agents.filter((agent) => agent.active).length, 2);
}
const beforeSelection = first.read();
first.select(beforeSelection.agents[1]!.id);
assert.equal(first.read().id, beforeSelection.agents[1]!.id);
assert.deepEqual(first.read().randomState, beforeSelection.randomState);
assert.equal(first.read().tick, 100);
const secondBefore = second.read();
first.advance(5);
assert.deepEqual(second.read(), secondBefore);
console.log("resource-exchange: 24 canonical agents, conserved energy, repeatable seeded dynamics");
