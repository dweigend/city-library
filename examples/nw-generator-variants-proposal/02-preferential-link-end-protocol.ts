// UNFROZEN PROPOSAL: explicit opt-in profile, not a change to generic preferential.
import assert from "node:assert/strict";
import { Graph, Random, type Edge } from "city-library";
type Node = { index: number };
for (const directed of [false,true]) for (const fixture of [
  { seed:1,draws:12,pairs:[[0,1],[0,2],[1,2],[3,0],[3,2],[4,3],[4,0],[5,2],[5,3]],degrees:[4,2,4,4,2,2] },
  { seed:7,draws:14,pairs:[[0,1],[0,2],[1,2],[3,0],[3,2],[4,1],[4,2],[5,0],[5,1]],degrees:[4,4,4,2,2,2] },
]) {
  const graph=Graph.add<Node>(),nodes=Array.from({length:6},(_,index)=>graph.nodes.add({index}));
  const random=Random.add({seed:fixture.seed}),control=random.copy();
  for(let draw=0;draw<fixture.draws;draw++)control.number();
  // Draft portable mapping: unit link-index selector, then unit<.5 selects end1.
  // Repeated targets consume both selectors again; new links join after the batch.
  const edges=graph.generate({kind:"preferential",profile:"nw-web",nodes,links:2,directed,random});
  assert.deepEqual(edges.map((edge:Edge<Node>)=>[edge.from.index,edge.to.index]),fixture.pairs);
  assert.deepEqual(random.state,control.state);
  assert.deepEqual([...graph.analyze({measure:"degree",direction:"all"}).values()],fixture.degrees);
  assert.ok(edges.every((edge:Edge<Node>)=>edge.directed===directed));
  for(let node=3;node<6;node++) {
    const targets=edges.filter((edge:Edge<Node>)=>edge.from===nodes[node]).map((edge:Edge<Node>)=>edge.to);
    assert.equal(targets.length,2);assert.equal(new Set(targets).size,2);
  }
  if(fixture.seed===7)assert.equal(fixture.draws,2*(6+1)); // Six accepted choices plus one rejected attempt.
}
for(const count of [2,3]) {
  const graph=Graph.add<Node>(),nodes=Array.from({length:count},(_,index)=>graph.nodes.add({index}));
  const random=Random.add({seed:17}),before=random.state;
  const edges=graph.generate({kind:"preferential",profile:"nw-web",nodes,links:count-1,directed:true,random});
  assert.deepEqual(edges.map((edge:Edge<Node>)=>[edge.from.index,edge.to.index]),count===2?[[0,1]]:[[0,1],[0,2],[1,2]]);
  assert.deepEqual(random.state,before); // Seed construction has no headless topology draws.
}
const generic=Graph.add<Node>(),nodes=Array.from({length:6},(_,index)=>generic.nodes.add({index}));
const random=Random.add({seed:7}),control=random.copy();for(let i=0;i<6;i++)control.number();
assert.throws(()=>generic.generate({kind:"preferential",nodes,links:2,directed:true,random} as never),TypeError);
const original=generic.generate({kind:"preferential",nodes,links:2,random});
assert.deepEqual(original.map(edge=>[edge.from.index,edge.to.index]),[[0,1],[0,2],[1,2],[3,0],[3,1],[4,3],[4,1],[5,2],[5,1]]);
assert.deepEqual(random.state,control.state); // Existing one-draw CDF profile is unchanged.
console.log("proposal02: native-shaped PA seed, incident-degree link-end choices and rejection selectors");
