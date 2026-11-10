import assert from 'node:assert/strict';
import { create as dining } from '../../models/dining-philosophers/model.ts';
import { create as pagerank } from '../../models/pagerank/model.ts';

const d = dining({philosopherCount: 3, hungryChance: 1, fullChance: 1, cooperation: false});
d.setScenario({states: ['HUNGRY','HUNGRY','HUNGRY'], owners: [null,null,null], marked: [true,false,false]});
d.activate(0);
let s = d.read();
assert.equal(s.philosophers[0]!.state, 'EATING');
assert.equal(s.philosophers[0]!.totalEaten, 0); // acquisition isn't eating.
assert.deepEqual(s.forks.map(f=>f.owner), [0,null,0]);
d.activate(0);
assert.equal(d.read().philosophers[0]!.totalEaten, 1);
assert.equal(d.read().philosophers[0]!.state, 'THINKING');
assert(d.read().forks.every(f=>f.owner===null));
d.setParameters({cooperation: true});
d.setScenario({states: ['HUNGRY','THINKING','THINKING'], owners: [null,null,null], marked: [true,false,false]});
d.activate(0); // skips marked left, picks right, must wait for another activation.
assert.equal(d.read().philosophers[0]!.state, 'HUNGRY');
assert.deepEqual(d.read().forks.map(f=>f.owner), [null,null,0]);
d.activate(0);
assert.equal(d.read().philosophers[0]!.state, 'EATING');
d.activate(0);
assert.deepEqual(d.read().forks.map(f=>f.marked), [false,false,true]);

const p = pagerank({calculationMethod: 'diffusion', dampingFactor: .8});
p.setScenario({pages:[{id:0,rank:.5},{id:1,rank:.5}],edges:[{from:0,to:1}]});
p.advance();
const ranks = p.read().pages.map(x=>x.rank);
assert(Math.abs(ranks[0]!-.3)<1e-12); // dangling node redistributes to ALL nodes.
assert(Math.abs(ranks[1]!-.7)<1e-12);
assert(Math.abs(p.read().totalRank-1)<1e-12);
p.setParameters({calculationMethod:'random-surfer',numberOfSurfers:3});
p.advance(2);
assert.equal(p.read().surfers.length,3);
assert.equal(p.read().pages.reduce((a,x)=>a+x.visits,0),6); // visits counted BEFORE movement.
p.setParameters({numberOfSurfers:1});p.advance();
assert.equal(p.read().pages.reduce((a,x)=>a+x.visits,0),7);
p.setParameters({calculationMethod:'diffusion'});p.advance();
assert.equal(p.read().surfers.length,0);
assert.equal(p.read().pages.reduce((a,x)=>a+x.visits,0),7);
assert.equal(p.read().tick,5);
console.log('marked resource protocol and both PageRank mechanisms passed');
