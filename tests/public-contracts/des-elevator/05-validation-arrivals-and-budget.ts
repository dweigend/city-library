import assert from "node:assert/strict";
import { create } from "../../../models/des-elevator/model.ts";

assert.throws(() => create({ floors: 1 }), RangeError);
assert.throws(() => create({ capacity: 0 }), RangeError);
assert.throws(() => create({ arrivalInterval: 0, arrivalLimit: 1 }), RangeError);
const independent = create({ initialPassengers: 0 });
const before = independent.read();
assert.throws(() => independent.addPassenger(1, 1), RangeError);
assert.throws(() => independent.addPassenger(-1, 2), RangeError);
assert.throws(() => independent.advance(-1), RangeError);
assert.deepEqual(independent.read(), before);

const arrivals = create({ floors: 2, elevators: 1, capacity: 2, travelTime: 1, doorTime: 0, transferTime: 0, initialPassengers: 0, arrivalInterval: 2, arrivalLimit: 3 });
arrivals.advance(20);
assert.equal(arrivals.read().generated, 3);
assert.equal(arrivals.read().created, 3);
assert.equal(arrivals.read().arrived, 3);
assert.equal(arrivals.read().waiting + arrivals.read().riding, 0);
assert.deepEqual(arrivals.read(), arrivals.read());
assert.equal(independent.read().time, 0);
const detached = arrivals.read();
detached.cars[0]!.floor = 999;
assert.notEqual(arrivals.read().cars[0]!.floor, 999);

const bounded = create({ initialPassengers: 0, maxEventsPerStep: 1 });
bounded.addPassenger(0, 2);
assert.throws(() => bounded.advance(), RangeError);
assert.equal(bounded.read().tick, 0);
assert.ok(bounded.read().pendingEvents > 0);
assert.equal(bounded.read().created, bounded.read().waiting + bounded.read().riding + bounded.read().arrived);
bounded.dispose();
bounded.dispose();
assert.equal(bounded.read().pendingEvents, 0);
assert.throws(() => bounded.advance());
assert.throws(() => bounded.addPassenger());
