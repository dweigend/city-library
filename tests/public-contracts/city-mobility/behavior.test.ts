import { expect, test } from "bun:test";
import { model } from "../../../models/city-mobility/model.ts";

test("capacity and conservation hold through mixed departures and live policy", () => {
  const instance = model.create({ initialTrips: 20, carCapacity: 3 });
  for (let minute = 0; minute < 70; minute++) {
    instance.setPolicy({ carPenalty: minute % 2 === 0 ? 0 : 2, carCapacity: 1 + minute % 7, walkMinutes: 8 + minute % 20 });
    instance.dispatchTrips(3);
    instance.advance();
    const state = instance.read();
    expect(state.completedTrips + state.waitingTrips + state.movingTrips).toBe(state.tripCount);
    expect(state.carTripCount + state.walkTripCount).toBe(state.tripCount);
    expect(state.trips.reduce((sum, trip) => sum + trip.waitingMinutes, 0)).toBe(state.totalWaitingMinutes);
    for (const link of state.links) {
      expect(link.used).toBe(state.trips.filter(trip => trip.currentLink === link.id && trip.status === "moving").length);
      expect(link.waiting).toBe(state.trips.filter(trip => trip.currentLink === link.id && trip.status === "waiting").length);
    }
    for (const trip of state.trips) expect(trip.progress >= 0 && trip.progress <= 1).toBe(true);
  }
  instance.advance(400);
  expect(instance.read().completedTrips).toBe(instance.read().tripCount);
});

test("waiting trips keep FIFO order on the main road", () => {
  const instance = model.create({ initialTrips: 0, departuresPerMinute: 0, carCapacity: 1, walkMinutes: 30, carPenalty: 0 });
  instance.dispatchTrips(4);
  const order: string[] = [];
  for (let minute = 0; minute < 40; minute++) {
    instance.advance();
    for (const trip of instance.read().trips) if (trip.status === "completed" && !order.includes(trip.id)) order.push(trip.id);
  }
  const mainTrips = instance.read().trips.filter(trip => trip.route === "main").map(trip => trip.id);
  expect(order.filter(id => mainTrips.includes(id))).toEqual(mainTrips);
});

test("history retains 500 samples and observations are frozen", () => {
  const instance = model.create({ departuresPerMinute: 1 });
  instance.dispatchTrips(1);
  expect(instance.read().history[0]!.values.tripCount).toBe(0);
  instance.advance(501);
  const state = instance.read();
  expect(state.history.length).toBe(500);
  expect(state.history[0]!.tick).toBe(2);
  expect(state.completedTrips).toBe(61);
  expect(Object.isFrozen(state.trips[0])).toBe(true);
});
