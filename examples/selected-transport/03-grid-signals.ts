import assert from 'node:assert/strict';
import { create } from '../../models/traffic-grid/model.ts';

const traffic = create({ seed: 1, numCars: 1, ticksPerCycle: 2 });
const initial = traffic.snapshot();
assert.equal(initial.tick, 0);
assert.equal(initial.cars.length, 1);
assert.equal(initial.intersections.length, 25);
assert.equal(initial.numCarsStopped, 1);
assert.equal(initial.cars[0]!.waitTime, 1);
const selected = initial.currentIntersectionId;
traffic.changeLight();
assert.equal(traffic.snapshot().intersections.find(light => light.id === selected)!.greenLightUp,
  !initial.intersections.find(light => light.id === selected)!.greenLightUp);
traffic.setParameters({ currentAuto: false, currentPhase: 25, speedLimit: 0.1 });
traffic.step(1);
assert.equal(traffic.snapshot().phase, 1);
assert.equal(traffic.snapshot().intersections.find(light => light.id === selected)!.auto, false);
traffic.step(1);
assert.equal(traffic.snapshot().phase, 0);
assert.equal(traffic.snapshot().tick, 2);
assert.deepEqual(traffic.snapshot(), traffic.snapshot());
