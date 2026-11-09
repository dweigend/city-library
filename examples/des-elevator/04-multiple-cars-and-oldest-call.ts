import assert from "node:assert/strict";
import { create } from "../../models/des-elevator/model.ts";

const multiple = create({ floors: 3, elevators: 2, capacity: 1, travelTime: 1, doorTime: 1, transferTime: 1, initialPassengers: 0 });
multiple.addPassenger(0, 2);
multiple.addPassenger(2, 0);
multiple.advance(10);
assert.deepEqual(multiple.read().passengers.map(passenger => passenger.car), [1, 2]);
assert.deepEqual(multiple.read().passengers.map(passenger => passenger.boarded), [2, 4]);
assert.deepEqual(multiple.read().passengers.map(passenger => passenger.arrived), [7, 9]);
assert.equal(multiple.read().cars.every(car => car.used === 0), true);

// Original age wins over a later request at the car's current floor.
const oldest = create({ floors: 3, elevators: 1, capacity: 1, travelTime: 1, doorTime: 1, transferTime: 1, initialPassengers: 0 });
oldest.addPassenger(2, 0);
oldest.addPassenger(0, 2);
oldest.advance(16);
assert.deepEqual(oldest.read().passengers.map(passenger => passenger.boarded), [4, 10]);
assert.deepEqual(oldest.read().passengers.map(passenger => passenger.arrived), [9, 15]);
assert.equal(oldest.read().cars[0]!.status, "idle");
