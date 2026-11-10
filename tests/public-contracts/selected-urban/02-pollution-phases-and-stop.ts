import { strict as assert } from "node:assert";
import { create } from "../../../models/urban-suite-pollution/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-10);
const model = create({ initialPersonCount: 0, powerPlantCount: 0, birthRate: 0, plantingRate: 0 });
model.setPeople([{ x: 10, y: 10, heading: 0, health: 5 }]);
model.setTrees([{ x: 0, y: 0, heading: 0, health: 0.1 }]);
model.setEnvironment(model.read().cells.map((cell) => ({
  pollution: cell.x === 0 && cell.y === 0 ? 8 : 0,
  powerPlant: false,
})));
model.advance();
const observed = model.read();
// Moore diffusion: 8 -> center1.6, eight neighbors0.8; cleanup then subtracts
// one locally and 0.5 from each neighbor. The dying tree still cleans first.
close(observed.cells.find((cell) => cell.x === 0 && cell.y === 0)!.pollution, 0.6);
close(observed.cells.find((cell) => cell.x === 1 && cell.y === 0)!.pollution, 0.3);
close(observed.totalPollution, 3);
assert.equal(observed.counts.treeCount, 0);
assert.equal(observed.tick, 1);

model.setTrees([]);
model.setEnvironment(model.read().cells.map((cell) => ({ pollution: 0, powerPlant: cell.x === 0 && cell.y === 0 })));
model.advance();
close(model.read().totalPollution, 3);
model.advance();
close(model.read().totalPollution, 5.4); // plant resets to3, not +3

model.setPeople([{ x: 10, y: 10, heading: 0, health: 0.1 }]);
model.advance();
assert.equal(model.read().counts.personCount, 0);
assert.equal(model.read().tick, 4); // extinction step completes
const stopped = model.read();
assert.equal(stopped.done, true);
model.advance(10);
assert.deepEqual(model.read(), stopped); // preflight stop freezes trees/field/RNG
