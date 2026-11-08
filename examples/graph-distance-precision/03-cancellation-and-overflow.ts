import assert from "node:assert/strict";
import { Graph } from "../../index.ts";
for(const sign of [1,-1]) {
 const graph=Graph.add<object,{cost:number}>({edgeState:{cost:0}});
 const n=Array.from({length:4},()=>graph.nodes.add({}));
 for(const [i,cost] of [sign*2**100,sign*Number.MIN_VALUE,-sign*2**100].entries())
  graph.edges.add({from:n[i]!,to:n[i+1]!,directed:true,state:{cost}});
 assert.equal(graph.distances({from:n[0]!,cost:e=>e.cost,algorithm:"bellman-ford"}).get(n[3]!),sign*Number.MIN_VALUE);
}
for(const tail of [1,2**970,Number.MAX_VALUE]) {
 const graph=Graph.add<object,{cost:number}>({edgeState:{cost:tail}});
 const a=graph.nodes.add({}),b=graph.nodes.add({}),c=graph.nodes.add({});
 graph.edges.add({from:a,to:b,directed:true,state:{cost:Number.MAX_VALUE}});
 graph.edges.add({from:b,to:c,directed:true});
 for(const algorithm of ["auto","dijkstra","bellman-ford"] as const) {
  const query=()=>graph.distances({from:a,cost:e=>e.cost,algorithm});
  if(tail===1) assert.equal(query().get(c),Number.MAX_VALUE); // preserve finite rounded overflow boundary.
  else assert.throws(query,RangeError);
 }
}
