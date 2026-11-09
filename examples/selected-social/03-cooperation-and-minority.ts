import assert from 'node:assert/strict';
import { create as ethnicity } from '../../models/ethnocentrism/model.ts';
import { create as minority } from '../../models/minority-game/model.ts';
const society = ethnicity({ setup: 'full', immigrantsPerDay: 0, initialPtr: 0, costOfGiving: 0, gainOfReceiving: 0,
  deathRate: 0, mutationRate: 0, immigrantChanceCooperateWithSame: 1, immigrantChanceCooperateWithDifferent: 1 });
assert.equal(society.read().agents.length, 2601);
society.advance();
assert.equal(society.read().turn.meet, 2601 * 4);
assert.equal(society.read().turn.coopOwn + society.read().turn.coopOther, 2601 * 4);
assert.equal(society.read().agents.length, 2601);
society.setParameters({ deathRate: 1 }); society.advance(); assert.equal(society.read().agents.length, 0);
society.advance(); assert.equal(society.read().turn.meet, 0); assert.equal(society.read().tick, 3);
society.setupEmpty(); assert.equal(society.read().tick, 0); assert.equal(society.read().agents.length, 0);
const game = minority({ number: 11, memory: 2, strategiesPerAgent: 3 });
const previous = game.read(); game.advance(); const current = game.read();
assert.equal(current.history, (previous.history * 2 + previous.minority) % 4);
for (const a of current.agents) {
  const old = previous.agents.find(b => b.id === a.id)!;
  assert.equal(a.score, old.score + Number(old.choice === previous.minority));
  assert.deepEqual(a.strategyScores, old.strategyScores.map((score,i) => score + Number(old.strategies[i]![previous.history] === previous.minority)));
  assert.equal(a.strategyScores[a.currentStrategy], Math.max(...a.strategyScores));
  assert.equal(a.choice, a.strategies[a.currentStrategy]![current.history]);
}
assert.equal(current.minority, current.zeroCount <= 5 ? 0 : 1);
assert.throws(() => minority({ memory: 1, strategiesPerAgent: 5 }));
console.log('directed cooperation phases and minority old-history rewards passed');
