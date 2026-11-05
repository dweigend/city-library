import { strict as assert } from "node:assert";
import { create } from "../../experiments/urban-suite-cells/model.ts";

const model = create();
assert.equal(model.read().counts.on, 1);
assert.equal(model.read().cells.find(cell => cell.x === 0 && cell.y === 0)!.seed, true);
model.advance();
assert.equal(model.read().counts.on, 5); // four faces, frozen predicate selection
assert.equal(model.read().tick, 1);
assert.ok(model.read().cells.filter(cell => cell.on).every(cell => cell.onTime === 0));
model.advance();
assert.equal(model.read().counts.on, 9); // diagonals have two on neighbors, excluded by '= 1'

const aging = create({ probability: 0, ageLimit: 1 });
aging.advance(2);
assert.equal(aging.read().counts.on, 1); // expire only onTime < pre-step ticks - limit
aging.advance();
assert.equal(aging.read().tick, 3);
assert.equal(aging.read().counts.on, 0);
assert.equal(aging.read().cells.find(cell => cell.x === 0 && cell.y === 0)!.seed, true); // marker survives death
assert.equal(aging.read().done, false);
const before = aging.read();
aging.addRandomSeed();
assert.equal(aging.read().tick, before.tick);
assert.equal(aging.read().counts.on, 1);
assert.ok(aging.read().cells.some(cell => cell.on && cell.seed && cell.onTime === 3));

// Source-timed color memory is canonical field data, independent of host cadence.
const palette = create({ probability: 0, ageLimit: 0 });
assert.equal(palette.read().cells.find(cell => cell.seed)!.colorNumber, 9.9);
const paletteStream = palette.read().randomState;
palette.cycleColors();
assert.ok(Math.abs(palette.read().cells.find(cell => cell.seed)!.colorNumber - 9.89) < 1e-12);
assert.equal(palette.read().tick, 0);
assert.deepEqual(palette.read().randomState, paletteStream); // declared omitted display-only source shuffle
palette.setCells(palette.read().cells.map(cell => ({ on: cell.seed, onTime: 0, seed: cell.seed, colorNumber: 0 })));
palette.cycleColors();
assert.equal(palette.read().cells.find(cell => cell.seed)!.colorNumber, 139.99);
palette.advance();
assert.equal(palette.read().cells.find(cell => cell.seed)!.colorNumber, 139.99); // seed skips normal recolor
