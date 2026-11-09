import { strict as assert } from "node:assert";
import { create } from "../../models/urban-suite-awareness/model.ts";

const model = create({ people: 0, centers: 0, nonUsageLimit: 0, seed: 7 });
model.setPeople([11, 11, 10].map((awareness) => ({ x: 0, y: -0.5, heading: 0, awareness })));
model.advance();
// Movement precedes contact. Black land subtracts one; the third person receives
// one message and stops being an eligible recipient as soon as awareness is 10.
assert.deepEqual(model.read().people.map((person) => person.awareness), [10, 10, 10]);
assert.equal(model.read().counts.wellInformed, 3);
assert.equal(model.read().tick, 1);

model.setPeople([]);
model.setCenters([{ x: 0, y: 0.5, kind: "original", nonUsage: 0 }]);
model.advance();
assert.equal(model.read().counts.centers, 0); // expiry is strictly > limit
assert.equal(model.read().done, false); // no source population terminal rule
assert.equal(model.read().meanAwareness, null); // explicit empty-mean adaptation
const state = model.read().randomState;
model.placeCenter({ x: 0, y: 0.5 });
assert.equal(model.read().cells.find((cell) => cell.x === 0 && cell.y === 0.5)!.nonUsage, 1);
assert.deepEqual(model.read().randomState, state); // painting does not reset age
assert.equal(model.read().tick, 2);
model.advance();
assert.equal(model.read().counts.centers, 0);

const activist = create({ people: 0, centers: 0 });
activist.setPeople([{ x: 0, y: -0.5, heading: 0, awareness: 15 }]);
activist.setCenters([{ x: 0, y: 0.5, kind: "original", nonUsage: 0 }]);
activist.advance();
assert.equal(activist.read().people[0]!.awareness, 15);
assert.equal(activist.read().counts.centers, 2);
assert.equal(activist.read().cells.filter((cell) => cell.center === "created").length, 1);
