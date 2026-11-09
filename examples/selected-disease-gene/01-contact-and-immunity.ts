import assert from "node:assert/strict";
import { create as disease } from "../../models/disease-solo/model.ts";
import { create as virus } from "../../models/virus/model.ts";

// Separate source models: persistent contact infection versus finite sickness/immunity.
const contact = disease({ seed: 11, numAndroids: 20, infectionChance: 0 });
assert.equal(contact.read().tick, 0);
assert.equal(contact.read().agents.length, 21);
assert.equal(contact.read().numSick, 0);
contact.infect();
contact.advance(8);
assert.equal(contact.read().tick, 8);
assert.equal(contact.read().numSick, 1);
assert.equal(contact.read().agents.filter(agent => agent.infected).length, 1);
const beforeMove = contact.read().agents.find(agent => agent.breed === "user")!;
contact.move(90);
assert.equal(contact.read().tick, 8);
assert.ok(contact.read().agents.find(agent => agent.breed === "user")!.x > beforeMove.x);
contact.setupKeep();
assert.equal(contact.read().tick, 0);
assert.equal(contact.read().runNumber, 2);
assert.equal(contact.read().numSick, 0);

const illness = virus({ seed: 12, numberPeople: 40, infectiousness: 0, duration: 0, chanceRecover: 0 });
assert.equal(illness.read().agents.length, 40);
assert.equal(illness.read().agents.filter(agent => agent.sick).length, 10);
illness.advance();
assert.equal(illness.read().tick, 1);
assert.equal(illness.read().agents.filter(agent => agent.sick).length, 0);
assert.ok(illness.read().agents.length <= 60);
assert.ok(illness.read().agents.every(agent => agent.remainingImmunity === 0));
assert.throws(() => virus({ numberPeople: 9 }), RangeError);
console.log("B09 contact and immunity passed");
