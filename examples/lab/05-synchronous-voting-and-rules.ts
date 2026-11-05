import assert from "node:assert/strict";
import { model } from "../../experiments/voting/model.ts";

const votes = [1, 1, 1, 1, 0, 0, 0, 0, 0];
const instance = model.create({ width: 3, height: 3, seed: 1 });
instance.setVotes(votes);
const captured = instance.read();
instance.advance(1);
assert.deepEqual(instance.read().cells.map(cell => cell.vote), Array<number>(9).fill(0));
assert.equal(instance.read().tick, 1);
assert.deepEqual(instance.read().history.map(point => [point.tick, point.zero, point.one]), [[0, 5, 4], [1, 9, 0]]);
assert.deepEqual(captured.cells.map(cell => cell.vote), votes);
instance.advance(100);
assert.equal(instance.read().tick, 1);
assert.equal(instance.read().done, true);

const changed = model.create({ width: 3, height: 3, seed: 1 });
changed.setVotes(votes);
const random = changed.read().randomState;
changed.setRules({ changeVote: true });
assert.equal(changed.read().tick, 0);
assert.deepEqual(changed.read().randomState, random);
changed.advance(1);
assert.deepEqual(changed.read().cells.map(cell => cell.vote), votes.map(vote => 1 - vote));
assert.equal(changed.read().counts.one, 5);

const close = model.create({ width: 3, height: 3, seed: 1, awardCloseCallsToLoser: true });
close.setVotes(votes);
close.advance(1);
assert.deepEqual(close.read().cells.map(cell => cell.vote), votes);
assert.equal(close.read().tick, 0);
assert.equal(close.read().done, true);
