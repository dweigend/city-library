import { strict as assert } from "node:assert";
import { create } from "../../models/urban-suite-recycling/model.ts";

const model = create({ recyclerCount: 0, wastefulCount: 0, resourceRegeneration: 0, recyclingWasteCost: 0.5 });
model.setResources(model.read().cells.map(() => "waste"));
model.setPeople([
  { kind: "recycler", x: 0, y: 0, heading: 0, energy: 1 },
  { kind: "wasteful", x: 0, y: 0, heading: 0, energy: 1 },
]);
model.advance();
// Recycler first restores the shared cell; wasteful then consumes recycled land.
// Recycler loses0.5+1 and dies, wasteful gains2 then pays1 movement.
assert.deepEqual(model.read().counts, { recyclers: 0, wastefuls: 1 });
assert.equal(model.read().people[0]!.energy, 2);
assert.equal(model.read().cells.find((cell) => cell.x === 0 && cell.y === 0)!.resource, "waste");
assert.equal(model.read().landPercentages.waste, 100);

model.setRules({ recyclingWasteCost: 0 });
model.setPeople([{ kind: "recycler", x: 0, y: 0, heading: 0, energy: 1 }]);
model.advance();
assert.equal(model.read().people[0]!.energy, 0); // zero survives; death is <0
assert.equal(model.read().counts.recyclers, 1);
assert.equal(model.read().cells.find((cell) => cell.x === 0 && cell.y === 0)!.resource, "recycled");
model.setPeople([]);
const tick = model.read().tick;
model.advance();
assert.equal(model.read().tick, tick + 1);
assert.equal(model.read().done, false); // empty populations still regenerate
