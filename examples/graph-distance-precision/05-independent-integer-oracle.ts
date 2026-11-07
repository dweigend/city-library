import assert from "node:assert/strict";
import { Graph } from "../../index.ts";
for(const signed of [false,true]) {
 for(const reversed of [false,true]) {
  const graph=Graph.add<{i:number},{cost:number}>({edgeState:{cost:1}});
  const nodes=Array.from({length:7},(_,i)=>graph.nodes.add({i}));
  const specs:{a:number;b:number;cost:number}[]=[];
  for(let a=0;a<7;a++)for(let b=a+1;b<7;b++) {
   const costs=signed?[1e16,1,-1,2,-2,0]:[1e16,1,2,0];
   specs.push({a,b,cost:costs[(a*3+b)%costs.length]!});
  }
  const oracle:(bigint|undefined)[][]=nodes.map((_,i)=>nodes.map((__,j)=>i===j?0n:undefined));
  for(const e of specs)oracle[e.a]![e.b]=BigInt(e.cost);
  for(let k=0;k<7;k++)for(let i=0;i<7;i++)for(let j=0;j<7;j++) {
   const a=oracle[i]![k],b=oracle[k]![j];if(a===undefined||b===undefined)continue;
   const candidate=a+b,previous=oracle[i]![j];
   if(previous===undefined||candidate<previous)oracle[i]![j]=candidate;
  }
  for(const e of reversed?[...specs].reverse():specs)graph.edges.add({from:nodes[e.a]!,to:nodes[e.b]!,directed:true,state:{cost:e.cost}});
  const algorithms=signed?["bellman-ford"] as const:["auto","dijkstra","bellman-ford"] as const;
  for(const algorithm of algorithms) {
   const rows=graph.allDistances({cost:e=>e.cost,algorithm});
   for(let i=0;i<7;i++)for(let j=0;j<7;j++) {
    const expected=oracle[i]![j];assert.equal(rows.get(nodes[i]!)!.get(nodes[j]!),expected===undefined?undefined:Number(expected));
   }
  }
  const unit=graph.allDistances();
  const explicit=graph.allDistances({cost:()=>1});
  for(const node of nodes)assert.deepEqual(explicit.get(node),unit.get(node));
 }
}
