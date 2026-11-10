import assert from "node:assert/strict";
import { create as sunflower } from "../../../models/sunflower-emergent/model.ts";
import { create as tumor } from "../../../models/tumor/model.ts";

const flower = sunflower({ seed: 1, ringDist: 1, fixedTemps: true });
assert.equal(flower.read().tick, 1);
assert.equal(flower.read().particles.length, 1);
flower.advance(3);
assert.equal(flower.read().tick, 4);
assert.equal(flower.read().particles.length, 4);
assert.equal(flower.read().temporaryParticleCount, 360);
for (const [index, particle] of flower.read().particles.entries()) {
  assert.ok(Math.abs(Math.hypot(particle.x, particle.y) - (index + 1)) < 1e-9);
}
flower.advance(100);
assert.equal(flower.read().tick, 79);
assert.equal(flower.read().particles.length, 79);
assert.equal(flower.read().stopped, true);

const growth = tumor({ seed: 2, leaveTrail: false });
assert.equal(growth.read().cells.length, 2);
assert.ok(growth.read().cells.every(cell => cell.stem && cell.age === 0));
growth.advance();
assert.equal(growth.read().tick, 1);
assert.equal(growth.read().cells.length, 4);
assert.ok(growth.read().cells.filter(cell => !cell.stem).every(cell => cell.age === 0));
growth.killOriginalStemCell();
growth.killMovingStemCell();
growth.killTransitoryCells();
assert.equal(growth.read().cells.length, 0);
growth.advance();
assert.equal(growth.read().tick, 2);
assert.equal(growth.read().cellCount, 0);
assert.equal(growth.read().stopped, true);
