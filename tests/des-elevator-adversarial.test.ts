import { describe, expect, test } from "bun:test";
import { create } from "../models/des-elevator/model.ts";

type Elevator = ReturnType<typeof create>;
type Observation = ReturnType<Elevator["read"]>;

/** Public state must describe one conserved population and one owner per rider. */
function checkPopulation(state: Observation): void {
  expect(state.created).toBe(state.passengers.length);
  expect(state.waiting + state.riding + state.arrived).toBe(state.created);
  expect(new Set(state.passengers.map(passenger => passenger.id)).size).toBe(state.created);
  const waiting = state.floorQueues.flatMap(line => line.passengers);
  const riding = state.cars.flatMap(car => car.passengers);
  expect(new Set([...waiting, ...riding]).size).toBe(waiting.length + riding.length);
  expect(waiting.length).toBe(state.waiting);
  expect(riding.length).toBe(state.riding);
  for (const car of state.cars) {
    expect(Number.isInteger(car.floor)).toBe(true);
    expect(car.floor).toBeGreaterThanOrEqual(0);
    expect(car.floor).toBeLessThan(state.parameters.floors);
    expect([-1, 0, 1]).toContain(car.direction);
    expect(car.used).toBe(car.passengers.length);
    expect(car.used).toBeGreaterThanOrEqual(0);
    expect(car.used).toBeLessThanOrEqual(car.capacity);
    expect(car.capacity).toBe(state.parameters.capacity);
    for (const number of car.passengers) {
      const passenger = state.passengers[number - 1]!;
      expect(passenger.car).toBe(car.number);
      expect(passenger.status).toBe("riding");
    }
  }
  for (const line of state.floorQueues) {
    for (const number of line.passengers) {
      const passenger = state.passengers[number - 1]!;
      expect(passenger.from).toBe(line.floor);
      expect(Math.sign(passenger.to - passenger.from)).toBe(line.direction);
      expect(passenger.status).toBe("waiting");
      expect(passenger.boarded).toBe(-1);
      expect(passenger.arrived).toBe(-1);
    }
  }
  for (const passenger of state.passengers) {
    expect(passenger.from).not.toBe(passenger.to);
    expect(passenger.from).toBeGreaterThanOrEqual(0);
    expect(passenger.to).toBeGreaterThanOrEqual(0);
    expect(passenger.from).toBeLessThan(state.parameters.floors);
    expect(passenger.to).toBeLessThan(state.parameters.floors);
    if (passenger.status === "arrived") {
      expect(waiting).not.toContain(passenger.number);
      expect(riding).not.toContain(passenger.number);
      expect(passenger.arrived).toBeGreaterThanOrEqual(passenger.boarded);
      expect(passenger.boarded).toBeGreaterThanOrEqual(passenger.requested);
    }
  }
}

function finish(model: Elevator, maximumSeconds: number): Observation {
  for (let second = 0; second < maximumSeconds; second++) {
    const state = model.read();
    checkPopulation(state);
    if (state.generated === state.parameters.arrivalLimit && state.arrived === state.created && state.pendingEvents === 0)
      return state;
    model.advance();
  }
  throw new Error(`Elevator did not finish finite demand within ${maximumSeconds} seconds.`);
}

function semanticTrace(state: Observation) {
  return {
    ...state,
    cars: state.cars.map(({ id: _id, ...car }) => car),
    passengers: state.passengers.map(({ id: _id, ...passenger }) => passenger),
  };
}

describe("independent elevator public-contract adversaries", () => {
  test("idle time has no polling events and a later request wakes explicitly without ticking", () => {
    const model = create({ initialPassengers: 0 });
    model.advance(100);
    const idle = model.read();
    expect(idle.pendingEvents).toBe(0);
    expect(idle.cars.every(car => car.status === "idle" && car.floor === 0 && car.direction === 0)).toBe(true);
    expect(model.addPassenger()).toBe(1);
    expect(model.read().tick).toBe(100);
    expect(model.read().time).toBe(100);
    const end = finish(model, 100);
    expect(end.passengers[0]!.requested).toBe(100);
    expect(end.passengers[0]!.boarded).toBe(102);
    expect(end.passengers[0]!.arrived).toBe(115);
    model.dispose();
  });

  test("a full directional call retains FIFO age while distinct calls use distinct cars", () => {
    const model = create({ floors: 4, elevators: 2, capacity: 1, initialPassengers: 0, travelTime: 1 });
    model.addPassenger(0, 3);
    model.addPassenger(0, 3);
    model.addPassenger(3, 0);
    model.addPassenger(1, 2);
    model.advance(3);
    const early = model.read();
    checkPopulation(early);
    expect(early.passengers[1]!.requested).toBe(0);
    expect(early.floorQueues.find(line => line.floor === 0 && line.direction === 1)!.passengers).toContain(2);
    expect(early.passengers[0]!.car).toBe(1);
    expect(early.cars[1]!.number).toBe(2);
    const end = finish(model, 200);
    expect(end.passengers[0]!.boarded).toBeLessThan(end.passengers[1]!.boarded);
    expect(end.passengers.every(passenger => passenger.requested === 0)).toBe(true);
    model.dispose();
  });

  test("opposite calls survive a same-floor alight then eligible boarding boundary", () => {
    const model = create({ floors: 3, elevators: 1, capacity: 1, travelTime: 1, initialPassengers: 0 });
    model.addPassenger(0, 1);
    model.addPassenger(1, 2);
    model.addPassenger(1, 0);
    model.advance(6);
    checkPopulation(model.read());
    expect(model.read().passengers[0]!.arrived).toBe(6);
    expect(model.read().passengers[1]!.boarded).toBe(-1);
    expect(model.read().cars[0]!.used).toBe(0);
    model.advance();
    expect(model.read().passengers[1]!.boarded).toBe(7);
    expect(model.read().floorQueues.find(line => line.floor === 1 && line.direction === -1)!.passengers).toEqual([3]);
    const end = finish(model, 100);
    expect(end.passengers.map(passenger => passenger.arrived)).toEqual([6, 11, 19]);
    expect(end.meanSystem).toBe(end.meanWait + end.meanRide);
    model.dispose();
  });

  test("same-time zero-duration chains remain conserved and finite for multiple cars", () => {
    const model = create({ floors: 5, elevators: 4, capacity: 3, initialPassengers: 30,
      arrivalInterval: 1, arrivalLimit: 30, travelTime: 1, doorTime: 0, transferTime: 0 });
    const end = finish(model, 1000);
    expect(end.created).toBe(60);
    expect(end.generated).toBe(30);
    expect(end.arrived).toBe(60);
    expect(end.cars.every(car => car.used === 0 && car.status === "idle")).toBe(true);
    model.dispose();
  });

  test("declared maximum topology and bounded demand complete without losing or duplicating riders", () => {
    const model = create({ floors: 12, elevators: 4, capacity: 8, initialPassengers: 100,
      arrivalInterval: 1, arrivalLimit: 100, travelTime: 1, doorTime: 0, transferTime: 0 });
    const end = finish(model, 4000);
    expect(end.created).toBe(200);
    expect(end.arrived).toBe(200);
    expect(end.floorQueues.every(line => line.passengers.length === 0)).toBe(true);
    model.dispose();
  });

  test("invalid setup and actions preserve the complete prior observation", () => {
    for (const options of [
      { floors: 1 }, { floors: 13 }, { elevators: 0 }, { elevators: 5 }, { capacity: 0 },
      { capacity: 9 }, { travelTime: 0 }, { doorTime: -1 }, { transferTime: NaN },
      { initialPassengers: 101 }, { arrivalInterval: 0, arrivalLimit: 1 }, { maxEventsPerStep: 0 },
    ]) expect(() => create(options)).toThrow();
    const model = create({ initialPassengers: 0 });
    const before = model.read();
    for (const [from, to] of [[0, 0], [-1, 2], [0, 6], [1.5, 2], [NaN, 2], [0, Infinity]]) {
      expect(() => model.addPassenger(from, to)).toThrow(RangeError);
      expect(model.read()).toEqual(before);
    }
    for (const steps of [-1, 1.5, NaN, Infinity]) {
      expect(() => model.advance(steps)).toThrow(RangeError);
      expect(model.read()).toEqual(before);
    }
    model.dispose();
  });

  test("a tiny event budget exposes partial effects but never completes the failed World step", () => {
    const model = create({ floors: 3, elevators: 1, initialPassengers: 0,
      travelTime: 1, doorTime: 0, transferTime: 0, maxEventsPerStep: 1 });
    model.addPassenger(0, 2);
    let failures = 0;
    for (let event = 0; event < 50 && model.read().pendingEvents > 0; event++) {
      const before = model.read();
      try { model.advance(); }
      catch (error) {
        expect(error).toBeInstanceOf(RangeError);
        expect(model.read().tick).toBe(before.tick);
        failures++;
      }
      checkPopulation(model.read());
    }
    expect(failures).toBeGreaterThan(0);
    expect(model.read().arrived).toBe(1);
    expect(model.read().pendingEvents).toBe(0);
    model.dispose();
  });

  test("independent instances and detached reads reproduce the same semantic event trace", () => {
    const first = create({ floors: 4, initialPassengers: 12, arrivalInterval: 2, arrivalLimit: 8 });
    const second = create({ floors: 4, initialPassengers: 12, arrivalInterval: 2, arrivalLimit: 8 });
    const original = first.read();
    const detached = first.read();
    detached.cars[0]!.floor = 999;
    detached.floorQueues[0]!.passengers.push(999);
    detached.passengers[0]!.requested = 999;
    expect(first.read()).toEqual(original);
    for (let secondNumber = 0; secondNumber < 100; secondNumber++) {
      expect(semanticTrace(first.read())).toEqual(semanticTrace(second.read()));
      first.advance(); second.advance();
    }
    first.dispose(); second.dispose();
  });

  test("disposal during active service cancels work and returns detached historical data", () => {
    const model = create({ initialPassengers: 20 });
    model.advance(4);
    const active = model.read();
    expect(active.pendingEvents).toBeGreaterThan(0);
    model.dispose(); model.dispose();
    const final = model.read();
    expect(final.pendingEvents).toBe(0);
    expect(final.created).toBe(active.created);
    expect(final.waiting + final.riding + final.arrived).toBe(final.created);
    expect(() => model.addPassenger()).toThrow(TypeError);
    expect(() => model.advance(0)).toThrow(TypeError);
    final.cars[0]!.passengers.push(999);
    expect(model.read().cars[0]!.passengers).not.toContain(999);
  });
});
