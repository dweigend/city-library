import assert from "node:assert/strict";
import { model } from "../../../models/city-materials/model.ts";

const close = (actual: number, expected: number) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
function season(changes: Parameters<ReturnType<typeof model.create>["setPolicy"]>[0]) {
  const city = model.create();
  city.setPolicy(changes);
  city.advance(60);
  return city.read();
}

// Experiment A: better recycling changes where waste ends up, not how long it lies on the street.
const recycling = season({ recyclingFraction: 0.8 });
assert.equal(recycling.peakBacklog, 650);
assert.equal(recycling.clearedDay, 48);
close(recycling.totals.recycled, 4860);
close(recycling.totals.disposed, 1215);

// More collection capacity clears the backlog.
const collection = season({ collectionCapacity: 160 });
assert.equal(collection.peakBacklog, 450);
assert.equal(collection.clearedDay, 23);

// Experiment B: produce less waste.
const less = season({ wasteGeneration: 80 });
assert.equal(less.peakBacklog, 550);
assert.equal(less.clearedDay, 29);
close(less.totals.generated, 5550);
console.log("city-materials recycling, collection and generation experiments passed");
