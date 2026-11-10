import assert from "node:assert/strict";
import { create as elementary } from "../../../models/ca-1d-elementary/model.ts";
import { create as continuous } from "../../../models/ca-continuous/model.ts";
const e = elementary({ width: 9, height: 5, rule: 90, initialization: "single", autoContinue: false });
e.advance();
assert.equal(e.read().tick, 1);
assert.deepEqual(e.read().cells.filter(c => c.y === 1 && c.on).map(c => c.x).sort((a,b) => a-b), [-1, 1]);
e.advance(3);
assert.equal(e.read().tick, 4);
e.advance();
assert.equal(e.read().tick, 4); // preflight bottom stop
const c = continuous({ width: 9, height: 5, initialization: "single", addConstant: 0.47, precisionLevel: 6 });
c.advance();
const row = c.read().cells.filter(p => p.y === 1);
for (const p of row) assert.equal(p.value, Math.abs(p.x) <= 1 ? 0.803333 : 0.47);
const before = c.read();
assert.deepEqual(c.read(), before); // detached/pure observation
