import assert from 'node:assert/strict';
import { create as rumor } from '../../../models/rumor-mill/model.ts';
import { create as signaling } from '../../../models/signaling-game/model.ts';
const mill = rumor({ setup: 'one', eightMode: false });
assert.equal(mill.read().clique, 1); assert.equal(mill.read().totalHeard, 1);
mill.advance(); assert.equal(mill.read().clique, 2); assert.equal(mill.read().totalHeard, 2);
const first = mill.read().cells.filter(c => c.firstHeard === 1); assert.equal(first.length, 1);
assert.equal(Math.abs(first[0]!.x) + Math.abs(first[0]!.y), 1);
mill.hearAt({ x: 50, y: 50 }); assert.equal(mill.read().clique, 3);
assert.equal(mill.read().cells.find(c => c.x === 50 && c.y === 50)!.firstHeard, 2);
const continuation = mill.read().randomState; mill.setColorMode('when-heard');
assert.deepEqual(mill.read().randomState, continuation); assert.equal(mill.read().tick, 1);
mill.setParameters({ eightMode: true }); const oldHeard = mill.read().totalHeard, oldClique = mill.read().clique;
mill.advance(); assert.equal(mill.read().totalHeard, oldHeard + oldClique);
const game = signaling({ numberOfStates: 2, numberOfSignals: 3, printProbabilities: false });
assert.equal(game.read().probabilityOfSuccess, 0.5); assert.equal(game.read().successRate, null);
for (let i=0;i<100;i++) {
  const before = game.read(); game.advance(); const after = game.read();
  assert.equal(after.tick, before.tick + 1);
  const win = Number(after.lastRound!.correct);
  assert.equal(after.timesCorrect, before.timesCorrect + win);
  assert.equal(after.senderUrns.flat().reduce((a,b)=>a+b,0), 6 + after.timesCorrect);
  assert.equal(after.receiverUrns.flat().reduce((a,b)=>a+b,0), 6 + after.timesCorrect);
  const probability = after.senderProbabilities.reduce((sum,row,s) => sum + row.reduce((p,v,g) => p + v * after.receiverProbabilities[g]![s]!,0),0)/2;
  assert.ok(Math.abs(after.probabilityOfSuccess-probability)<1e-12);
}
const beforePrint = game.read(); game.printProbabilities();
assert.equal(game.read().tick, beforePrint.tick); assert.deepEqual(game.read().randomState, beforePrint.randomState);
console.log('rumor activation snapshot and two-sided urn reinforcement passed');
