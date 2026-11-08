import assert from "node:assert/strict";
import { create as sandpile } from "../../experiments/sandpile/model.ts";
import { create as ising } from "../../experiments/ising/model.ts";

// Full avalanche is a phase barrier: one drop completes before one tick.
const pile = sandpile({ width: 3, height: 3, initial: "uniform", grainsPerField: 3, dropLocation: "center", seed: 1 });
assert.equal(pile.read().total, 27);
assert.equal(pile.read().tick, 0);
const before = pile.read();
const explored = pile.exploreAt(0, 0);
assert.ok(explored.size > 0 && explored.lifetime > 0);
assert.deepEqual(pile.read().cells.map(c => c.n), before.cells.map(c => c.n));
assert.equal(pile.read().total, before.total);
assert.equal(pile.read().tick, 0);
pile.advance();
const after = pile.read();
assert.equal(after.tick, 1);
assert.ok(after.total < 28); // open boundary dissipation
assert.ok(after.cells.every(c => c.n >= 0 && c.n <= 3));
assert.equal(after.sizes.at(-1), explored.size);
assert.equal(after.lifetimes.at(-1), explored.lifetime);
assert.equal(after.total, after.cells.reduce((s, c) => s + c.n, 0));
pile.clearData();
assert.deepEqual(pile.read().sizes, []);
assert.equal(pile.read().tick, 1);
pile.setupUniform(0);
pile.dropAt(0, 0);
assert.equal(pile.read().total, 1);
assert.equal(pile.read().tick, 1);

// Metropolis uses signed neighbor energy and attempted-flip time.
const spins = ising({ width: 3, height: 3, probabilityOfSpinUp: 100, temperature: 0, seed: 2 });
spins.advance();
assert.equal(spins.read().tick, 1000);
assert.equal(spins.read().magnetization, 1); // no uphill flip at T=0
spins.setSpins(spins.read().cells.map(c => c.x === 0 && c.y === 0 ? -1 : 1));
assert.equal(spins.updateAt(0, 0), true); // delta E=-8
assert.equal(spins.read().magnetization, 1);
assert.equal(spins.read().sumOfSpins, 9);
assert.equal(spins.read().tick, 0); // source patch procedure does not advance observer clock
console.log("materials 01: avalanche barrier and Metropolis mechanism passed");
