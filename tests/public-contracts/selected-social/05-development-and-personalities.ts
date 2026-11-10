import assert from 'node:assert/strict';
import { create as development } from '../../../models/piaget-vygotsky-game/model.ts';
import { create as heroes } from '../../../models/heroes-and-cowards/model.ts';
const learners = development({ playerCount: 10, strategy: 'piagetian', randomizeStrategyEachRun: false,
  moveError: 0, attemptCountPerRun: 2, stopAfterEachRun: true });
learners.advance(); const first = learners.read();
assert.equal(first.attemptCount, 1); assert.equal(first.results.piagetian.length, 1);
assert.equal(first.results.piagetian[0], first.players.reduce((s,p)=>s+p.score,0)/10);
assert.ok(first.players.every(p => p.bestScore === p.score && p.maxMoveCount === p.bestMaxMoveCount));
learners.advance(5); const second = learners.read();
assert.equal(second.tick, 2); assert.equal(second.attemptCount, 2); assert.equal(second.stopped, true);
assert.deepEqual(second.players.map(p=>p.score),first.players.map(p=>p.score));
learners.advance(); assert.equal(learners.read().attemptCount, 1); assert.equal(learners.read().tick, 3);
const crowd = heroes({ personCount: 3, personalities: 'brave' });
// Extrapolation puts a coward left of its friend, away from its enemy.
const actors = [
  { x:0, y:0, personality:'cowardly' as const, friend:1, enemy:2 },
  { x:1, y:0, personality:'brave' as const, friend:2, enemy:2 },
  { x:5, y:0, personality:'brave' as const, friend:0, enemy:1 },
];
crowd.setActors(actors); crowd.advance();
assert.ok(Math.abs(crowd.read().agents[0]!.x + 0.1)<1e-12);
assert.ok(Math.abs(crowd.read().agents[0]!.y)<1e-12);
// The same targets put a brave actor toward their midpoint, to the right.
crowd.setActors(actors.map((a,i)=>i===0?{...a,personality:'brave' as const}:a));
crowd.advance(); assert.ok(Math.abs(crowd.read().agents[0]!.x - 0.1)<1e-12);
assert.equal(crowd.read().tick,1);
const snap=crowd.read(); assert.throws(()=>crowd.setActors([{x:0,y:0,personality:'brave',friend:0,enemy:0}])); assert.deepEqual(crowd.read(),snap);
crowd.preset(1086013561); assert.equal(crowd.read().agents.length,68); assert.equal(crowd.read().tick,0);
console.log('development run barriers and personality interventions passed');
