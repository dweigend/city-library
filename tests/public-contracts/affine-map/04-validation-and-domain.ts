import assert from "node:assert/strict";
import { geometry, type Bounds } from "../../../index.ts";
const valid:Bounds=[0,10,0,10];
for(const bad of [[0,0,0,10],[10,0,0,10],[0,10,5,5]] as const) {
 assert.throws(()=>geometry.map({x:0,y:0},{from:bad,to:valid}),RangeError);
 assert.throws(()=>geometry.map({x:0,y:0},{from:valid,to:bad}),RangeError);
}
assert.throws(()=>geometry.map({x:Infinity,y:0},{from:valid,to:valid}),RangeError);
assert.throws(()=>geometry.map({x:0,y:0,z:0} as {x:number;y:number},{from:valid,to:valid}),TypeError);
assert.throws(()=>geometry.map({x:0,y:0},{from:[0,10,0] as unknown as Bounds,to:valid}),TypeError);
assert.throws(()=>geometry.map({x:0,y:0},{from:valid,to:valid,mode:"clip"} as never),TypeError);
let reads=0;
assert.throws(()=>geometry.map({x:0,y:0},{from:valid,get to(){reads++;return valid;}}),TypeError);
assert.equal(reads,0);
assert.throws(()=>geometry.map({x:Number.MAX_VALUE,y:0},{from:[-Number.MAX_VALUE,0,0,1],to:valid}),RangeError);
