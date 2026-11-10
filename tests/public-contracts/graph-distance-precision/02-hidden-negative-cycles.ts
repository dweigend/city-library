import assert from "node:assert/strict";
import { Graph } from "../../../index.ts";
for(const prefix of [1e16,Number.MAX_VALUE]) {
 const graph=Graph.add<object,{cost:number}>({edgeState:{cost:0}});
 const origin=graph.nodes.add({}),a=graph.nodes.add({}),b=graph.nodes.add({}),isolated=graph.nodes.add({});
 graph.edges.add({from:origin,to:a,directed:true,state:{cost:prefix}});
 graph.edges.add({from:a,to:b,directed:true});
 graph.edges.add({from:b,to:a,directed:true,state:{cost:-Number.MIN_VALUE}});
 const options={cost:(edge:{cost:number})=>edge.cost,algorithm:"bellman-ford" as const};
 assert.throws(()=>graph.distances({from:origin,...options}),RangeError);
 assert.deepEqual(graph.distances({from:isolated,...options}),new Map([[isolated,0]]));
 assert.throws(()=>graph.allDistances(options),RangeError);
 assert.throws(()=>graph.distances({from:isolated,cost:options.cost}),RangeError); // Dijkstra rejects signed costs even unreachable.
}
const undirected=Graph.add<object,{cost:number}>({edgeState:{cost:-Number.MIN_VALUE}});
const a=undirected.nodes.add({}),b=undirected.nodes.add({});
undirected.edges.add({from:a,to:b});
assert.throws(()=>undirected.distances({from:a,cost:e=>e.cost,algorithm:"bellman-ford"}),RangeError);
