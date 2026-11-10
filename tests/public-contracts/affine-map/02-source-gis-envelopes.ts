import assert from "node:assert/strict";
import { geometry, type Bounds } from "../../../index.ts";
// Pinned GIS world ASC: xll=-180,yll=-90,ncols=360,nrows=180,cellsize=1.
// Library Bounds order differs from the SHP/ASC XY-envelope order.
const from: Bounds = [-180,180,-90,90], to: Bounds = [-72.5,72.5,-36.5,36.5];
assert.deepEqual(geometry.map({x:0,y:0},{from,to}),{x:0,y:0});
assert.deepEqual(geometry.map({x:0,y:90},{from,to}),{x:0,y:36.25});
assert.deepEqual(geometry.map({x:0,y:90},{from,to,mode:"independent-axes"}),{x:0,y:36.5});
// Actual archived cities SHP record1, Murmansk; affine calculation, not CRS conversion.
const p=geometry.map({x:33.08604049682617,y:68.96354675292969},{from,to,mode:"independent-axes"});
assert(Math.abs(p.x-13.326321866777208)<1e-12);
assert(Math.abs(p.y-27.968549516465927)<1e-12);
