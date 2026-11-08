import assert from "node:assert/strict";
import { create } from "../../experiments/smoothlife/model.ts";
// Uniform input must remain uniform: normalized disk/annulus means are both 0.4.
const m = create({ width: 9, height: 9, innerRadius: 1, outerRadius: 2, seed: 1 });
m.setCells(m.read().cells.map(() => 0.4));
const sigmoid = (x: number, a: number, w: number) => 1 / (1 + Math.exp(-(x - a) * 4 / w));
const blend = sigmoid(0.4, 0.5, 0.147);
const low = 0.278 * (1 - blend) + 0.267 * blend;
const high = 0.365 * (1 - blend) + 0.445 * blend;
const expected = sigmoid(0.4, low, 0.028) * (1 - sigmoid(0.4, high, 0.028));
m.advance();
assert.equal(m.read().tick, 1);
for (const c of m.read().cells) assert.ok(Math.abs(c.value - expected) < 1e-12);
const before = m.read();
assert.throws(() => m.setCells([NaN]));
assert.deepEqual(m.read(), before);
assert.throws(() => create({ innerRadius: 3, outerRadius: 3 }));
