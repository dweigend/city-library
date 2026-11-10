import assert from 'node:assert/strict';
import { create as drift } from '../../../models/gendrift-t-interact/model.ts';
import { create as mendel } from '../../../models/mendelian-inheritance/model.ts';

const d = drift({ seed: 51, number: 30, colors: 2 });
d.placeWall(0);
assert.ok(d.read().cells.filter(c => c.y === 0 || Math.abs(c.y) === 17).every(c => c.wall));
assert.ok(d.read().agents.every(t => Math.round(t.y) !== 0 && Math.abs(Math.round(t.y)) !== 17));
const walls = d.read().cells.filter(c => c.wall).length;
d.setup(); // source setup preserves drawn walls
assert.equal(d.read().cells.filter(c => c.wall).length, walls);
assert.equal(d.read().tick, 0);
d.removeWall(0);
assert.ok(d.read().cells.filter(c => c.y === 0).every(c => !c.wall));
d.removeAllWalls();
assert.ok(d.read().cells.every(c => !c.wall));
const single = drift({ number: 1 });
single.advance();
assert.equal(single.read().tick, 0); // variance zero stops before movement

const m = mendel({ seed: 52, maleGenotype: 'AA', femaleGenotype: 'aa', numberOfOffspring: 6 });
assert.equal(m.read().mice.length, 2);
m.makeF1Generation();
let s = m.read();
assert.equal(s.tick, 1);
assert.equal(s.trialNumber, 1);
assert.equal(s.numberOfDarkOffspring, 6);
assert.equal(s.numberOfLightOffspring, 0);
assert.equal(s.darkRatioValue, 'N/A');
assert.ok(s.mice.filter(a => a.generation === 'F1').every(a => a.genotype === 'Aa'));
m.clearF1Generation();
assert.equal(m.read().mice.length, 2);
assert.equal(m.read().tick, 1);
assert.equal(m.read().numberOfDarkOffspring, 6);
m.makeF1Generation();
s = m.read();
assert.equal(s.tick, 2);
assert.equal(s.numberOfDarkOffspring, 12);
assert.equal(s.trialNumber, 2);
assert.deepEqual(m.read(), s);
assert.equal(s.numberOfLightOffspring, 0);
console.log('B08 wall lifecycle, pre-step stop and cumulative Mendelian counters passed');
