import { describe, expect, test } from "bun:test";
import { Agent, Grid } from "city-library";
import { create as paths } from "../models/paths/model.ts";
import { create as basic } from "../models/traffic-basic/model.ts";
import { create as lanes } from "../models/traffic-2-lanes/model.ts";
import { create as crossing } from "../models/traffic-intersection/model.ts";

describe("selected transport source rules", () => {
  test("Paths building toggles use toroidal radius and do not advance time", () => {
    const model = paths({ walkerCount: 0 });
    model.toggleBuilding({ x: -50, y: 0 });
    model.toggleBuilding({ x: 50, y: 0 });
    expect(model.snapshot().buildings).toHaveLength(0);
    expect(model.snapshot().tick).toBe(0);
    expect(() => model.setParameters({ walkerCount: 3 } as never)).toThrow();
  });

  test("Paths preserves the original distance-self all-way tie", () => {
    const model = paths({
      seed: 4,
      walkerCount: 100,
      minimumRoutePopularity: 0,
      walkerVisionDist: 30,
    });
    model.step(3);
    const destinationGrid = Grid.create(
      { x: 101, y: 101, boundary: "wrap" },
      { state: { popularity: 0, route: false } },
    );
    const destination = destinationGrid.fieldAt({ x: 30, y: 0 })!;
    const walker = Agent.create({ kind: "walker" as const, goal: destination });
    const choices = Array.from({ length: 100 }, () =>
      model.bestWayTo(walker, destination),
    );
    const distances = new Set(
      choices.map((field) => Math.hypot(field.x, field.y)),
    );
    expect(distances.size).toBeGreaterThan(1);
  });

  test("Basic clamps speed and respects setup-only population", () => {
    const model = basic({ seed: 1, carCount: 1, acceleration: 0.0099 });
    model.step(200);
    expect(model.snapshot().cars[0]!.speed).toBe(1);
    expect(model.snapshot().cars[0]!.x).toBeGreaterThanOrEqual(-25.5);
    expect(model.snapshot().cars[0]!.x).toBeLessThan(25.5);
    expect(() => model.setParameters({ carCount: 2 } as never)).toThrow();
    const before = model.snapshot();
    expect(model.snapshot()).toEqual(before);
    expect(model.step(0)).toBe(0);
    expect(model.snapshot()).toEqual(before);
  });

  test("Two lanes preserves selected car when shrinking a live population", () => {
    const model = lanes({ carCount: 10 });
    const selected = model.snapshot().cars[3]!.id;
    model.selectCar(selected);
    model.setParameters({ carCount: 1 });
    model.step();
    expect(model.snapshot().cars.map((car) => car.id)).toEqual([selected]);
    expect(model.snapshot().selectedCarId).toBe(selected);
    model.setParameters({ carCount: 82 });
    model.step();
    expect(model.snapshot().cars).toHaveLength(82);
    expect(
      model.snapshot().cars.every((car) => car.y >= -1 && car.y <= 1),
    ).toBe(true);
  });

  test("Intersection uses strict elapsed time and yellow completes even in manual mode", () => {
    const model = crossing({
      freqNorth: 0,
      freqEast: 0,
      greenLength: 1,
      yellowLength: 1,
    });
    model.step(2);
    expect(
      model.snapshot().lights.some((light) => light.color === "yellow"),
    ).toBe(false);
    model.step();
    expect(
      model.snapshot().lights.some((light) => light.color === "yellow"),
    ).toBe(true);
    expect(model.snapshot().ticksAtLastChange).toBe(2);
    model.setParameters({ auto: false });
    model.step(2);
    expect(
      model.snapshot().lights.some((light) => light.color === "yellow"),
    ).toBe(false);
    expect(model.snapshot().ticksAtLastChange).toBe(4);
  });

  test("Intersection brake distance, unit substeps, hard exits and reporter purity", () => {
    const model = crossing({
      seed: 5,
      freqNorth: 100,
      freqEast: 100,
      maxBrake: 1,
      speedLimit: 10,
    });
    expect(model.brakingDistanceAt(5)).toBe(9);
    model.step(100);
    const state = model.snapshot();
    expect(state.tick).toBe(100);
    expect(
      state.cars.every(
        (car) => car.x >= -17 && car.x < 17 && car.y >= -17 && car.y < 17,
      ),
    ).toBe(true);
    expect(
      state.accidents.every(
        (accident) => accident.clearIn >= 1 && accident.clearIn <= 5,
      ),
    ).toBe(true);
    expect(model.snapshot()).toEqual(state);
    expect(() => model.step(-1)).toThrow();
  });
});
