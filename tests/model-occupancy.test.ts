import { expect, test } from "bun:test";
import { model } from "../models/residential-occupancy/model.ts";

test("dwelling reservations use Resource capacity and stable FIFO admission", () => {
  const instance = model.create({ applicantCount: 5, slotCount: 2 });
  const initial = instance.read();
  expect(initial.occupiedSlotCount).toBe(2);
  expect(initial.waitingHouseholdCount).toBe(3);
  expect(initial.households.map(household => household.reservation)).toEqual(["granted", "granted", "waiting", "waiting", "waiting"]);
  expect(instance.read()).toEqual(initial);
  expect(() => instance.setSlots(1)).toThrow(RangeError);
  expect(instance.read()).toEqual(initial);
  instance.moveOut();
  const moved = instance.read();
  expect(moved.tick).toBe(0);
  expect(moved.occupiedSlotCount).toBe(2);
  expect(moved.waitingHouseholdCount).toBe(2);
  expect(moved.households.map(household => household.reservation)).toEqual(["released", "granted", "granted", "waiting", "waiting"]);
  expect(moved.eligibility).toEqual(initial.eligibility);
  instance.setSlots(3);
  expect(instance.read().occupiedSlotCount).toBe(3);
  expect(instance.read().waitingHouseholdCount).toBe(1);
  instance.advance(2);
  expect(instance.read().occupiedSlotCount).toBe(3);
  instance.advance();
  expect(instance.read().waitingHouseholdCount).toBe(0);
  expect(instance.read().occupiedSlotCount).toBe(3);
  expect(instance.read().history.every(sample => sample.values.occupiedSlotCount! <= 3)).toBe(true);
  instance.advance(100);
  expect(instance.read().occupiedSlotCount).toBe(0);
  expect(instance.read().done).toBe(true);
  expect(instance.read().households.every(household => household.reservation === "released")).toBe(true);
});

test("occupancy validates inputs and observations remain detached", () => {
  expect(() => model.create({ slotCount: 0 })).toThrow(RangeError);
  const instance = model.create({ applicantCount: 3, slotCount: 1 });
  const initial = instance.read();
  expect(Object.isFrozen(initial.households[0])).toBe(true);
  expect(() => instance.advance(-1)).toThrow(RangeError);
  expect(instance.read()).toEqual(initial);
  instance.moveOut();
  expect(initial.households[0]!.reservation).toBe("granted");
  expect(instance.read().households[0]!.reservation).toBe("released");
});
