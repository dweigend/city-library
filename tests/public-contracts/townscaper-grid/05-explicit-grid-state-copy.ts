import assert from "node:assert/strict";
import { Grid, Random, topology } from "city-library";

const raw = topology.quadrilaterals({ rings: 3, edgeLength: 4, random: Random.add({ seed: 7 }) });
const relaxed = topology.relax({ layout: raw, method: "squareTarget", iterations: 8 });
const before = Grid.add({ layout: raw, state: { population: 0, observation: "old" } });
const after = Grid.add({ layout: relaxed, state: { population: 0, observation: "new" } });
before.fields.forEach((field, index) => { field.population = index + 1; });
// Only this named extensive value is copied by the method's cell correspondence.
// Density or agent relocation would need a separate model policy.
for (const cell of raw.cells) after.fields[cell]!.population = before.fields[cell]!.population;
assert.notEqual(before, after);
assert.equal(before.layout, raw);
assert.equal(after.layout, relaxed);
assert.equal(before.fields.length, 122);
assert.equal(after.fields.reduce((total, field) => total + field.population, 0), 122 * 123 / 2);
for (const cell of raw.cells) {
  const oldField = before.fields[cell]!;
  const newField = after.fields[cell]!;
  assert.notEqual(oldField, newField);
  assert.notEqual(oldField.id, newField.id);
  assert.equal(oldField.grid, before);
  assert.equal(newField.grid, after);
  assert.equal(newField.observation, "new");
  assert.equal(oldField.observation, "old");
  assert.equal(after.fieldAt(newField), newField);
  assert.deepEqual(after.neighbors(newField).map(field => after.fields.indexOf(field)), relaxed.neighbors({ cell }));
}
after.fields[0]!.population = 999;
assert.equal(before.fields[0]!.population, 1);
assert.equal("space" in after, false);
assert.equal("cellSize" in after, false);
assert.equal("diffuse" in after, false);
