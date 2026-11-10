import assert from "node:assert/strict";
import { Agent, Graph, World, run } from "city-library";

const world = World.create();
const household = { name: "Household" };
const workplace = { name: "Workplace" };
const resident = world.add(Agent.create({ demand: 2 }));
const membership = Graph.create<object>();
for (const member of [household, workplace, resident]) membership.nodes.add(member);
membership.edges.add({ from: household, to: resident });
membership.edges.add({ from: workplace, to: resident });
const householdMembers = Object.freeze([...membership.neighbors(household)]);
assert.equal(householdMembers[0], resident);
assert.equal(membership.neighbors(workplace)[0], resident);
run(world, () => {
  world.activate([resident], ({ self }) => { self.demand += 1; }, { order: "fixed" });
}, 2);
assert.equal(resident.demand, 4);
assert.equal(world.tick.value, 2);
membership.nodes.delete(resident);
assert.equal(membership.neighbors(household).length, 0);
assert.equal(householdMembers[0], resident);
assert.equal(resident.alive, true);
