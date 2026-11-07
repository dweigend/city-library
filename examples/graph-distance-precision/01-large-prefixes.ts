import assert from "node:assert/strict";
import { Graph } from "../../index.ts";
for (const algorithm of ["auto","dijkstra","bellman-ford"] as const) {
 const graph=Graph.add<object,{cost:number}>({edgeState:{cost:1}});
 const n=Array.from({length:5},()=>graph.nodes.add({}));
 graph.edges.add({from:n[0]!,to:n[1]!,directed:true,state:{cost:2**53}});
 for(let i=1;i<4;i++) graph.edges.add({from:n[i]!,to:n[i+1]!,directed:true});
 const d=graph.distances({from:n[0]!,cost:e=>e.cost,algorithm});
 assert.equal(d.get(n[2]!),2**53); // exact2^53+1, nearest/ties-to-even.
 assert.equal(d.get(n[3]!),2**53+2);
 assert.equal(d.get(n[4]!),2**53+4); // exact2^53+3, upper even neighbor.
 assert.equal(graph.allDistances({cost:e=>e.cost,algorithm}).get(n[0]!)!.get(n[4]!),2**53+4);
}
// A positive directed cycle can have equal published distances; it is not negative.
const graph=Graph.add<object,{cost:number}>({edgeState:{cost:1}});
const a=graph.nodes.add({}),b=graph.nodes.add({}),c=graph.nodes.add({});
graph.edges.add({from:a,to:b,directed:true,state:{cost:1e16}});
graph.edges.add({from:b,to:c,directed:true});graph.edges.add({from:c,to:b,directed:true});
assert.equal(graph.distances({from:a,cost:e=>e.cost,algorithm:"bellman-ford"}).get(c),1e16);
