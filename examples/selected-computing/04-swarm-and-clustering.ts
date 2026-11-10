import assert from 'node:assert/strict';
import { create as swarm } from '../../models/particle-swarm-optimization/model.ts';
import { create as clustering } from '../../models/k-means-clustering/model.ts';

const p=swarm({width:5,height:5,populationSize:1,landscapeSmoothness:0,particleInertia:1,particleSpeedLimit:2});
const landscape=Array(25).fill(0);landscape[24]=1;
p.setScenario({landscape,particles:[{x:0,y:0,vx:1,vy:0,personalBestValue:0,personalBestX:0,personalBestY:0}]});
p.advance();assert.equal(p.read().tick,1);
assert.equal(p.read().particles[0]!.x,1);assert.equal(p.read().particles[0]!.y,0);
assert.equal(p.read().particles[0]!.vx,1); // inertia1 cancels attraction.
p.setScenario({landscape,particles:[{x:2,y:2,vx:1,vy:0,personalBestValue:0,personalBestX:0,personalBestY:0}]});
const tick=p.read().tick;p.advance();assert.equal(p.read().tick,tick); // found1 before movement.
assert.equal(p.read().globalBestValue,1);

const k=clustering({clusterCount:2,centroidCount:2,dataPointCount:10});
k.setScenario({points:[{x:-2,y:0},{x:0,y:0},{x:8,y:0},{x:10,y:0}],centroids:[{x:-2,y:0},{x:10,y:0}]});
k.assignClusters();assert.equal(k.read().tick,0);
assert.deepEqual(k.read().points.map(x=>x.cluster),[0,0,1,1]);
k.updateClusters();assert.deepEqual(k.read().centroids.map(x=>x.x),[-1,9]);
assert.equal(k.read().meanDeviation,2); // mean of centroid SSE2, not total4.
assert.equal(k.read().tick,0);
k.advance();assert.equal(k.read().tick,1);assert.equal(k.read().anyCentroidsMoved,false);
k.advance(20);assert.equal(k.read().tick,1);
k.setScenario({points:[{x:0,y:0},{x:.1,y:0}],centroids:[{x:0,y:0},{x:20,y:20}]});
k.advance();assert.equal(k.read().centroids[0]!.x,.05); // moves even below .1 stop threshold.
assert.equal(k.read().anyCentroidsMoved,false);
assert.deepEqual([k.read().centroids[1]!.x,k.read().centroids[1]!.y],[20,20]); // empty retained.
const points=k.read().points.map(({x,y})=>({x,y}));
k.resetCentroids();assert.equal(k.read().tick,0);
assert.deepEqual(k.read().points.map(({x,y})=>({x,y})),points);
console.log('inertia, best-before-move, Lloyd assignment, SSE and convergence passed');
