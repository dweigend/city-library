import assert from 'node:assert/strict';
import { create as choice } from '../../../models/consumer-choice/model.ts';
import { create as rebellion } from '../../../models/rebellion/model.ts';
// Dissatisfaction followed by certain exploration switches every consumer.
const market = choice({ numConsumers: 10, avgConnections: 0, initialOrangePercent: 100,
  qualityOrange: 0, qualityBlue: 0, exploration: 1, normInfluence: 0, informationExchange: 0 });
assert.equal(market.read().orangeCount, 10);
market.advance();
assert.equal(market.read().orangeCount, 0);
assert.ok(market.read().consumers.every(c => c.choice === 1 && c.personalExperience.every(v => v === 0) && c.utilities.every(v => v === 0)));
market.setParameters({ qualityOrange: 1 }); // old satisfaction remains until consumption
market.advance();
assert.equal(market.read().orangeCount, 10);
assert.ok(market.read().consumers.every(c => c.satisfaction[0] === 1 && c.personalExperience[0] === 1 && c.utilities[0] === 0.5));
market.advance(3);
assert.equal(market.read().orangeCount, 10); // satisfaction dominates exploration
const before = market.read(); assert.deepEqual(market.read(), before);
assert.throws(() => market.setParameters({ qualityOrange: -1 })); assert.deepEqual(market.read(), before);
// With no police there is no perceived arrest risk; movement can be disabled.
const revolt = rebellion({ initialCopDensity: 0, initialAgentDensity: 1, governmentLegitimacy: 0, movement: false });
const citizens = revolt.read().agents;
assert.equal(citizens.length, 16);
revolt.advance();
for (const a of revolt.read().agents) {
  const old = citizens.find(c => c.id === a.id)!;
  assert.equal(a.active, a.hardship > 0.1); assert.equal(a.x, old.x); assert.equal(a.y, old.y);
}
revolt.setParameters({ governmentLegitimacy: 1 }); revolt.advance();
assert.equal(revolt.read().activeCount, 0); assert.equal(revolt.read().quietCount, 16);
assert.equal(revolt.read().tick, 2);
console.log('choice phase barrier and grievance intervention passed');
