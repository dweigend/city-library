import assert from "node:assert/strict";
import { create as rabbits } from "../../models/rabbits-grass-weeds/model.ts";
import { create as plants } from "../../models/invasive-plants/model.ts";
const extinct = rabbits({ number: 0, grassGrowRate: 0, weedsGrowRate: 0 });
extinct.advance(5);
assert.equal(extinct.read().tick, 0); // preflight stop occurs before growth and tick
assert.equal(extinct.read().rabbits.length, 0);
const hunger = rabbits({ number: 3, grassGrowRate: 0, weedsGrowRate: 0, seed: 4 });
hunger.advance(30);
assert.equal(hunger.read().rabbits.length, 0);
assert.ok(hunger.read().tick <= 19);
const invasion = plants({ initialDensity: 0, initialResistanceShape: "none", seedProductionRate: 0, weedKillerRate: 0 });
invasion.paint(0, 0, "infestation", 80);
assert.equal(invasion.read().aggregateInfestation, 80);
invasion.advance(3);
assert.equal(invasion.read().aggregateInfestation, 80);
assert.equal(invasion.read().seeds.length, 0);
invasion.paint(0, 0, "resistance", 100);
assert.equal(invasion.read().aggregateInfestation, 0);
assert.equal(invasion.read().cells.find(c => c.x === 0 && c.y === 0)!.resistance, 100);
assert.equal(invasion.read().tick, 3); // paint is an action; source drawing cadence is explicit separately
console.log("Extinction preflight, energy exhaustion and resistance drawing verified.");
