import assert from 'node:assert/strict';
import { create as genetic, hammingDistance } from '../../../models/simple-genetic-algorithm/model.ts';
import { create as robby } from '../../../models/robby-the-robot/model.ts';

assert.equal(hammingDistance([0,0,1,1],[0,1,0,1]),.5);
const g=genetic({width:4,populationSize:5,crossoverRate:100,mutationRate:0});
g.setScenario({genomes:Array.from({length:5},()=>[0,0,0,0])});
g.advance();
assert.equal(g.read().tick,1);assert.equal(g.read().population.length,5);
assert(g.read().population.every(x=>x.fitness===0 && x.bits.length===4));
g.setScenario({genomes:[[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]});
const t=g.read().tick;g.advance(10);assert.equal(g.read().tick,t); // ALL-ONES preflight stop.
g.setScenario({genomes:Array.from({length:5},()=>[0,0,0,0])});
g.setParameters({crossoverRate:0,mutationRate:10}); // Native slider maximum is10 percent.
g.advance();assert(g.read().population.every(x=>x.fitness===x.bits.reduce((a,b)=>a+b,0)));

const r=robby({populationSize:20,seed:19});
assert.equal(r.read().population.length,20);
assert(r.read().population.every(x=>x.chromosome.length===243));
assert(r.read().population.every(x=>x.fitness>=-500 && x.fitness<=1000));
const stay=Array(243).fill('stay-put');
r.setTrial({strategy:stay,cans:[{x:0,y:0}],x:0,y:0,score:0});r.trialStep();
assert.equal(r.read().robot!.score,0);assert.equal(r.read().cans.length,1);
const pick=Array(243).fill('pick-up-can');
r.setTrial({strategy:pick,cans:[{x:0,y:0}],x:0,y:0,score:0});r.trialStep();
assert.equal(r.read().robot!.score,10);assert.equal(r.read().cans.length,0);
r.trialStep();assert.equal(r.read().robot!.score,9);
r.setTrial({strategy:Array(243).fill('move-west'),cans:[],x:0,y:0,score:0});r.trialStep();
assert.equal(r.read().robot!.score,-5);assert.equal(r.read().robot!.x,0);
assert.equal(r.read().tick,0); // trial actions do not evolve.
r.advance();assert.equal(r.read().tick,1); // real20×100 fitness evaluation, tournament15.
r.showEnvironment();assert.equal(r.read().stepCounter,1);
r.trialStep();assert.equal(r.read().stepCounter,2);
r.showStrategies();assert.equal(r.read().robot,null);
console.log('tournament genetics, all-ones stop and actual Robby strategy actions passed');
