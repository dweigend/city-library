import assert from "node:assert/strict";
import { geometry, type Bounds } from "../../index.ts";
const from:Bounds=[-10,10,-5,5],to:Bounds=[0,100,0,50];
assert.deepEqual(geometry.map({x:30,y:-15},{from,to}),{x:200,y:-50});
for(const mode of ["uniform-centered","independent-axes"] as const) {
 for(const p of [{x:-10,y:-5},{x:2,y:3},{x:30,y:-15}]) {
  const mapped=geometry.map(p,{from,to,mode});
  const restored=geometry.map(mapped,{from:to,to:from,mode});
  assert(Math.abs(restored.x-p.x)<1e-12);assert(Math.abs(restored.y-p.y)<1e-12);
 }
}
// Generic affine mapping has no undocumented GeoJSON coordinate-magnitude cap.
assert.deepEqual(geometry.map({x:2e10,y:3e10},{from:[0,4e10,0,4e10],to:[0,4,0,4]}),{x:2,y:3});
