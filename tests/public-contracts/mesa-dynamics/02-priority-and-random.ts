import assert from "node:assert/strict";
import { Agent, Random, World } from "city-library";

function schedule(seed: number) {
  const world = World.add({ random: Random.add({ seed }) });
  const people = [3, 1, 1, 2].map((priority, index) => world.add(Agent.add({ priority, index })));
  const visits: number[] = [];
  world.activate(people, ({ self }) => { visits.push(self.index); }, {
    order: "priority", priority: (person) => person.priority,
  });
  assert.deepEqual(visits, [1, 2, 3, 0]);
  assert.equal(world.random.number(), Random.add({ seed }).number());
  visits.length = 0;
  world.activate(people, ({ self }) => { visits.push(self.index); });
  return visits;
}
assert.deepEqual(schedule(17), schedule(17));
assert.equal(new Set(schedule(17)).size, 4);
