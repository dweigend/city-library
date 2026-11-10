import assert from "node:assert/strict";
import { Agent, Graph, Random, World } from "../../../index.ts";
const random=Random.create({seed:1}),world=World.create({random});
const n=Array.from({length:4},()=>world.add(Agent.create({kind:"node"})));
const graph=Graph.create<typeof n[number],{cost:number}>({edgeState:{cost:1}});
n.forEach(x=>graph.nodes.add(x));
graph.edges.add({from:n[0]!,to:n[1]!,directed:true,state:{cost:1e16}});
graph.edges.add({from:n[1]!,to:n[2]!,directed:true});
graph.edges.add({from:n[2]!,to:n[3]!,directed:true});
const before=random.state,edges=[...graph.edges];let seen:unknown[]=[];
const cost=(edge:typeof edges[number])=>{seen.push(edge);return edge.cost;};
const rows=graph.allDistances({cost});assert.deepEqual(seen,edges);
seen=[];const summary=graph.distanceSummary({cost});assert.deepEqual(seen,edges);
const published=[...rows].flatMap(([from,row])=>[...row].filter(([to])=>to!==from).map(([,d])=>d));
const exactPublishedSum=published.reduce((sum,d)=>sum+BigInt(d),0n);
assert.equal(summary.mean,Number(exactPublishedSum)/published.length);
assert.equal(summary.diameter,1e16+2);assert.equal(summary.radius,0);
assert.equal(summary.eccentricity.get(n[0]!),rows.get(n[0]!)!.get(n[3]!));
assert.equal(world.tick.value,0);assert.deepEqual(random.state,before);
const overflow=Graph.create<object,{cost:number}>({edgeState:{cost:Number.MAX_VALUE}});
const a=overflow.nodes.add({}),b=overflow.nodes.add({}),c=overflow.nodes.add({});
overflow.edges.add({from:a,to:b,directed:true});overflow.edges.add({from:a,to:c,directed:true,state:{cost:1}});
overflow.edges.add({from:b,to:c,directed:true}); // overflows even though this candidate cannot improve c.
assert.throws(()=>overflow.distances({from:a,cost:e=>e.cost}),RangeError);
const aggregates=Graph.create<object,{cost:number}>({edgeState:{cost:Number.MAX_VALUE}});
const p=Array.from({length:4},()=>aggregates.nodes.add({}));
aggregates.edges.add({from:p[0]!,to:p[1]!,directed:true});aggregates.edges.add({from:p[2]!,to:p[3]!,directed:true});
assert.throws(()=>aggregates.distanceSummary({cost:e=>e.cost}),RangeError); // total checked before mean.
