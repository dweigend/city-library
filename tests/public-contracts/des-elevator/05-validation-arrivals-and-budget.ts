import assert from "node:assert/strict";
import { create } from "../../../models/des-elevator/model.ts";

assert.throws(() => create({ floorCount: 1 }), RangeError);
assert.throws(() => create({ capacity: 0 }), RangeError);
assert.throws(() => create({ arrivalIntervalSeconds: 0, arrivalCountLimit: 1 }), RangeError);
const independent = create({ initialPassengerCount: 0 });
const before = independent.read();
assert.throws(() => independent.addPassenger(1, 1), RangeError);
assert.throws(() => independent.addPassenger(-1, 2), RangeError);
assert.throws(() => independent.advance(-1), RangeError);
assert.deepEqual(independent.read(), before);

const arrivals = create({ floorCount: 2, elevatorCount: 1, capacity: 2, travelTimeSeconds: 1, doorTimeSeconds: 0, transferTimeSeconds: 0, initialPassengerCount: 0, arrivalIntervalSeconds: 2, arrivalCountLimit: 3 });
arrivals.advance(20);
assert.equal(arrivals.read().generatedPassengerCount, 3);
assert.equal(arrivals.read().createdPassengerCount, 3);
assert.equal(arrivals.read().arrivedPassengerCount, 3);
assert.equal(arrivals.read().waitingPassengerCount + arrivals.read().ridingPassengerCount, 0);
assert.deepEqual(arrivals.read(), arrivals.read());
assert.equal(independent.read().time, 0);
const detached = arrivals.read();
detached.cars[0]!.floor = 999;
assert.notEqual(arrivals.read().cars[0]!.floor, 999);

const bounded = create({ initialPassengerCount: 0, maxEventCountPerStep: 1 });
bounded.addPassenger(0, 2);
assert.throws(() => bounded.advance(), RangeError);
assert.equal(bounded.read().tick, 0);
assert.ok(bounded.read().pendingEventCount > 0);
assert.equal(bounded.read().createdPassengerCount, bounded.read().waitingPassengerCount + bounded.read().ridingPassengerCount + bounded.read().arrivedPassengerCount);
bounded.dispose();
bounded.dispose();
assert.equal(bounded.read().pendingEventCount, 0);
assert.throws(() => bounded.advance());
assert.throws(() => bounded.addPassenger());
