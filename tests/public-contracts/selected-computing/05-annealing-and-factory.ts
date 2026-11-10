import assert from 'node:assert/strict';
import { create as annealing } from '../../../models/simulated-annealing/model.ts';
import { create as factory } from '../../../models/robotic-factory/model.ts';

const a=annealing({width:4,height:4,coolingRate:10,swapRadius:1});
// Alternating columns: vertical agreement plus horizontal disagreement yields ZERO energy.
const striped=Array.from({length:16},(_,i)=>i%4%2);
a.setScenario({brightness:striped,temperature:0});
assert.equal(a.read().globalEnergy,0);
assert.equal(a.energyAt(0,0),0);
assert.equal(a.attemptSwap(0,0,1,0),false); // worsening atT0 rolls back exactly.
assert.deepEqual(a.read().brightness,striped);
a.setScenario({brightness:striped,temperature:1});
assert.equal(a.attemptSwap(0,0,1,0),true); // source always accepts atT1 regardless delta.
const ones=a.read().brightness.reduce((x,y)=>x+y,0);
a.advance();assert.equal(a.read().tick,1);assert.equal(a.read().temperature,.9);
assert.equal(a.read().brightness.reduce((x,y)=>x+y,0),ones);
assert.equal(a.read().attempts,1001); // one explicit attempt since scenario reset +1000 native attempts.
assert.equal(a.read().globalEnergy,Array.from({length:16},(_,i)=>a.energyAt(i%4,Math.floor(i/4))).reduce((x,y)=>x+y,0));

const f=factory({seed:4,numberOfRobots:3,fullCharge:350,makeTrails:false});
const initial=f.read();assert.equal(initial.robots.length,3);
assert.equal(initial.machines.length,9);
assert.equal(initial.machines.find(x=>x.kind==='loading-dock')!.supply,10);
assert(initial.robots.every(x=>x.energy===350));
const robot=initial.robots[0]!;
const dock=initial.machines.find(x=>x.kind==='loading-dock')!;
// Move along OLD heading, then face the destination; movement energy uses current cargo.
f.setScenario({robots:[{...robot,x:0,y:0,heading:0,energy:100,product:0,destination:dock.id}]});
f.advance();let current=f.read().robots.find(x=>x.id===robot.id)!;
assert(Math.abs(current.x)<1e-12);assert(Math.abs(current.y-1)<1e-12);
assert.equal(current.energy,99);
const cutter=f.read().machines.find(x=>x.kind==='cutter')!;
f.setScenario({robots:[{...current,x:cutter.x,y:cutter.y,product:0,destination:cutter.id,energy:100}],machines:[{...cutter,supply:0,product:2}]});
f.advance();current=f.read().robots.find(x=>x.id===robot.id)!;
assert.equal(current.product,1);
assert.equal(f.read().machines.find(x=>x.id===cutter.id)!.product,2); // native pickup bug retained.
const room=f.read().machines.find(x=>x.kind==='robot-room')!;
f.setScenario({robots:[{...current,x:room.x,y:room.y,product:1,energy:0,destination:room.id}]});
f.advance();current=f.read().robots.find(x=>x.id===robot.id)!;
assert.equal(current.product,0);assert.equal(current.energy,3); // movement loses2 then recharge+5.
assert.equal(f.read().tick,3);
console.log('B18 anisotropic energy, source acceptance/cooling and factory ordering/quirks passed');
