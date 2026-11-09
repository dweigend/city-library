import { test, expect } from 'bun:test';
import { create as minority } from '../models/minority-game/model.ts';
import { create as rumor } from '../models/rumor-mill/model.ts';
import { create as signaling } from '../models/signaling-game/model.ts';
import { create as development } from '../models/piaget-vygotsky-game/model.ts';
import { create as heroes } from '../models/heroes-and-cowards/model.ts';

test('minority rewards old actual and virtual choices before shifting history',()=>{
 const m=minority({number:11,memory:2,strategiesPerAgent:3});const before=m.read();m.advance();const after=m.read();
 expect(after.history).toBe((2*before.history+before.minority)%4);
 for(const a of after.agents){const b=before.agents.find(b=>b.id===a.id)!;expect(a.score).toBe(Number(b.choice===before.minority));expect(a.strategyScores).toEqual(b.strategies.map(s=>Number(s[before.history]===before.minority)));expect(a.strategyScores[a.currentStrategy]).toBe(Math.max(...a.strategyScores));expect(a.choice).toBe(a.strategies[a.currentStrategy]![after.history]!);}
 expect(after.zeroCount).toBe(after.agents.filter(a=>a.choice===0).length);expect(after.minority).toBe(after.zeroCount<=5?0:1);
 expect(after.successHistogram.counts.reduce((a,b)=>a+b,0)).toBe(11);
});
test('minority source one-agent zero-mean movement failure retains scored tick',()=>{
 const m=minority({number:1,memory:1,strategiesPerAgent:1});m.advance(8);expect(m.read().tick).toBe(1);expect(m.read().avgScore).toBe(0);expect(m.read().diagnostic).toContain('divides by zero');expect(m.read().agents[0]!.score).toBe(0);
 expect(()=>minority({memory:1,strategiesPerAgent:5})).toThrow();expect(()=>minority({number:2})).toThrow();
});
test('rumor transmits only from pre-tick clique and counts repeated exposures',()=>{
 const m=rumor();expect(m.read().clique).toBe(1);m.advance();expect(m.read().clique).toBe(2);expect(m.read().totalHeard).toBe(2);
 m.hearAt({x:50,y:50});m.hearAt({x:50,y:50});expect(m.read().cells.find(c=>c.x===50&&c.y===50)!.timesHeard).toBe(2);
 const old=m.read();m.advance();expect(m.read().totalHeard).toBe(old.totalHeard+old.clique);expect(m.read().ratio).toBe(m.read().clique/m.read().previousClique);
});
test('rumor interventions are atomic and no-source setup is not a terminal state',()=>{
 const m=rumor({setup:'random',initClique:0});m.advance(3);expect(m.read().tick).toBe(3);expect(m.read().clique).toBe(0);expect(m.read().stopped).toBe(false);
 const before=m.read();expect(()=>m.hearAt({x:50.5,y:0})).toThrow();expect(()=>m.setColorMode('bad' as never)).toThrow();expect(m.read()).toEqual(before);m.seedOne();expect(m.read().clique).toBe(1);expect(m.read().cells.find(c=>c.x===0&&c.y===0)!.firstHeard).toBe(4);
});
test('rumor toroidal corner has four face neighbors',()=>{
 const m=rumor({setup:'random',initClique:0});m.hearAt({x:50,y:50});m.advance();const heard=m.read().cells.filter(c=>c.timesHeard>0&&!(c.x===50&&c.y===50));expect(heard).toHaveLength(1);const c=heard[0]!;expect([[49,50],[-50,50],[50,49],[50,-50]]).toContainEqual([c.x,c.y]);
});
test('signaling initializes both rectangular urn systems and reinforces matched choices only',()=>{
 const m=signaling({numberOfStates:3,numberOfSignals:2,printProbabilities:false});expect(m.read().probabilityOfSuccess).toBeCloseTo(1/3,14);
 for(let i=0;i<300;i++){const before=m.read();m.advance();const after=m.read();const round=after.lastRound!;expect(after.timesCorrect-before.timesCorrect).toBe(Number(round.correct));
  for(let s=0;s<3;s++)for(let g=0;g<2;g++){expect(after.senderUrns[s]![g]!-before.senderUrns[s]![g]!).toBe(Number(round.correct&&round.state===s&&round.signal===g));expect(after.receiverUrns[g]![s]!-before.receiverUrns[g]![s]!).toBe(Number(round.correct&&round.state===s&&round.signal===g));}}
 expect(m.read().timesWrong+m.read().timesCorrect).toBe(m.read().tick);
});
test('signaling prints detached output without a random draw or clock advance',()=>{
 const m=signaling();const before=m.read();expect(m.printProbabilities()).toContain('Sender probabilities:');expect(m.read().randomState).toEqual(before.randomState);expect(m.read().tick).toBe(0);expect(m.read().successRate).toBeNull();
});
test('development Piagetian zero-error memory and per-run stop preserve midpoint record',()=>{
 const m=development({numberOfPlayers:10,strategy:'Piagetian',randomizeStrategyEachRun:false,moveError:0,attemptsPerRun:2,stopAfterEachRun:true});m.advance();const first=m.read();expect(first.results.Piagetian).toEqual([first.meanScore]);expect(first.players.every(p=>p.score===p.bestScore&&p.maxMoves===p.bestMaxMoves)).toBe(true);m.advance(20);expect(m.read().tick).toBe(2);expect(m.read().stopped).toBe(true);expect(m.read().players.map(p=>p.score)).toEqual(first.players.map(p=>p.score));m.advance();expect(m.read().attempts).toBe(1);expect(m.read().tick).toBe(3);
});
test('all four development strategies preserve source legal distances and score barriers',()=>{
 for(const strategy of ['Random','Piagetian','Vygotskiian','P-V'] as const){const m=development({numberOfPlayers:10,strategy,randomizeStrategyEachRun:false,attemptsPerRun:5});m.advance(20);const s=m.read();expect(s.tick).toBe(20);expect(s.results[strategy]).toHaveLength(4);expect(s.players.every(p=>p.score===Math.abs(p.x)&&p.maxMoves>=0&&p.maxMoves<=120)).toBe(true);expect(s.players.every(p=>p.x>=-60&&p.x<=60&&p.y>=-25&&p.y<=25)).toBe(true);}
});
test('heroes source-specific midpoint and extrapolation work with asynchronous target positions',()=>{
 const m=heroes({number:3});const rows=[{x:0,y:0,personality:'cowardly' as const,friend:1,enemy:2},{x:1,y:0,personality:'brave' as const,friend:2,enemy:2},{x:5,y:0,personality:'brave' as const,friend:0,enemy:1}];m.setActors(rows);m.advance();expect(m.read().agents[0]!.x).toBeCloseTo(-0.1,14);m.setActors(rows.map((a,i)=>i===0?{...a,personality:'brave' as const}:a));m.advance();expect(m.read().agents[0]!.x).toBeCloseTo(0.1,14);
});
test('heroes rejects the upper half-open edge and atomic malformed references',()=>{
 const m=heroes({number:3});const before=m.read();const rows=[{x:0,y:0,personality:'brave' as const,friend:1,enemy:2},{x:1,y:0,personality:'brave' as const,friend:0,enemy:2},{x:2,y:0,personality:'brave' as const,friend:0,enemy:1}];expect(()=>m.setActors([{...rows[0]!,x:16.5},rows[1]!,rows[2]!])).toThrow();expect(()=>m.setActors([{...rows[0]!,friend:0},rows[1]!,rows[2]!])).toThrow();expect(m.read()).toEqual(before);
 const random=before.randomState;m.setActors(rows);expect(m.read().randomState).toEqual(random);m.preset(1086013561);expect(m.read().parameters.personalities).toBe('mixed');expect(m.read().agents).toHaveLength(68);expect(m.read().tick).toBe(0);
});
test('last-five observations are detached, validated writes are atomic, and counts reject invalid input',()=>{
 for(const m of [minority({number:11,memory:2,strategiesPerAgent:2}),rumor(),signaling(),development({numberOfPlayers:10}),heroes({number:3})]){
 const before=m.read();expect(m.read()).toEqual(before);expect(()=>m.advance(-1)).toThrow();expect(()=>m.advance(0.5)).toThrow();expect(m.read()).toEqual(before);
 const write=m.setParameters as (p:unknown)=>void;expect(()=>write({unknown:1})).toThrow();expect(()=>write({seed:2})).toThrow();expect(()=>write(Object.defineProperty({},'other',{get(){throw new Error('getter executed');},enumerable:true}))).toThrow();expect(m.read()).toEqual(before);m.advance(0);expect(m.read().randomState).toEqual(before.randomState);
 }
});
test('signaling natural learned threshold stops before another round or random draw',()=>{
 const m=signaling({printProbabilities:false});m.advance(100000);const before=m.read();expect(before.probabilityOfSuccess).toBeGreaterThan(0.99);expect(before.stopped).toBe(true);expect(before.tick).toBe(4373);m.advance(100);expect(m.read()).toEqual(before);m.advance(0);expect(m.read()).toEqual(before);
});
test('rumor all-informed stop is a preflight without time or randomness',()=>{
 const m=rumor();for(let y=-50;y<=50;y++)for(let x=-50;x<=50;x++)m.hearAt({x,y});const before=m.read();m.advance(100);const after=m.read();expect(after.clique).toBe(10201);expect(after.tick).toBe(0);expect(after.stopped).toBe(true);expect(after.randomState).toEqual(before.randomState);expect(after.totalHeard).toBe(before.totalHeard);m.advance(0);expect(m.read()).toEqual(after);
});

test('heroes blocked short forward retains position while the phase and tick continue',()=>{
 const m=heroes({number:3});
 m.setActors([
  {x:16.49,y:0,personality:'cowardly',friend:1,enemy:2},
  {x:16.4,y:0,personality:'brave',friend:2,enemy:2},
  {x:-16,y:0,personality:'brave',friend:1,enemy:1},
 ]);
 m.advance();const after=m.read();expect(after.agents[0]!.x).toBe(16.49);expect(after.agents[0]!.y).toBe(0);
 expect(after.agents[1]!.x).toBeCloseTo(16.3,12);expect(after.agents[2]!.x).toBeCloseTo(-15.9,12);
 expect(after.tick).toBe(1);expect(after.diagnostic).toBeNull();
 const natural=heroes();natural.advance(100);expect(natural.read().tick).toBe(100);expect(natural.read().diagnostic).toBeNull();
});
