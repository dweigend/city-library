import assert from "node:assert/strict";
import { create as solid } from "../../../models/solid-diffusion/model.ts";
import { create as interstitial } from "../../../models/interstitial-diffusion/model.ts";
const atoms = solid({ width: 5, height: 3, seed: 4 });
assert.equal(atoms.read().atoms.length, 12);
assert.equal(atoms.read().vacancies, 3);
const greens = atoms.read().atoms.filter(a => a.color === "green").length;
atoms.advance(20);
assert.equal(atoms.read().atoms.length, 12);
assert.equal(atoms.read().atoms.filter(a => a.color === "green").length, greens);
assert.equal(atoms.read().vacancies, 3);
assert.equal(new Set(atoms.read().atoms.map(a => `${a.x},${a.y}`)).size, 12);
atoms.setAtoms([{ x: -1, y: 0, color: "green" }, { x: 2, y: 0, color: "blue" }]);
atoms.moveAtomToHere(0, 0);
assert.equal(atoms.read().atoms.find(a => a.color === "green")!.x, 0);
assert.equal(atoms.read().tick, 0);

const closed = interstitial({ width: 5, height: 5, initialBulkConcentration: 0, initialColumnsPopulated: 0, maxTicks: 2, seed: 5 });
closed.setProfile([1, 1, 1, 1, 1]);
closed.advance(3);
assert.equal(closed.read().atoms.length, 25); // exclusion forbids hops on full lattice
assert.equal(closed.read().tick, 2); // preflight max-ticks barrier
assert.equal(closed.read().done, true);
assert.ok(closed.read().profile.every(p => p.concentration === 1));
closed.drawColumn(0, 0);
assert.equal(closed.read().tick, 0);
assert.equal(closed.read().atoms.length, 20);
const reservoir = interstitial({ width: 5, height: 5, initialBulkConcentration: 0, initialColumnsPopulated: 0, constantLeftSurface: true, leftSurfaceConcentration: 1, constantRightSurface: true, rightSurfaceConcentration: 0, seed: 6 });
reservoir.advance();
assert.equal(reservoir.read().profile[0]!.concentration, 1);
assert.equal(reservoir.read().profile.at(-1)!.concentration, 0);
assert.equal(reservoir.read().tick, 1);
console.log("materials 03: vacancy exchange, exclusion and reservoirs passed");
