import { describe, expect, test } from "bun:test";
import { create as grid } from "../experiments/traffic-grid/model.ts";
import { create as goal } from "../experiments/traffic-grid-goal/model.ts";
import { create as taxi, inputs } from "../experiments/taxi-cabs/model.ts";
import type {
  DemandKey,
  TaxiParameters,
} from "../experiments/taxi-cabs/model.ts";

function noDemand(): Partial<TaxiParameters> {
  return Object.fromEntries(
    Object.keys(inputs)
      .filter((key) => key.startsWith("prob-"))
      .map((key) => [key, 0]),
  );
}

describe("selected B04 city traffic public contracts", () => {
  test("grid initial stopped accounting precedes initial speed assignment", () => {
    const model = grid({ seed: 2, numCars: 12 });
    const initial = model.snapshot();
    expect(initial.numCarsStopped).toBe(12);
    expect(initial.cars.every((car) => car.waitTime === 1)).toBe(true);
    expect(initial.intersections.length).toBe(25);
    expect(new Set(initial.cars.map((car) => `${car.x},${car.y}`)).size).toBe(
      12,
    );
    expect(initial.history[0]!.numCarsStopped).toBe(12);
    expect(initial.cars.some((car) => car.speed > 0)).toBe(true);
  });

  test("signal phase uses equality before advancing; power changes have deferred recoloring", () => {
    const model = grid({ numCars: 1, ticksPerCycle: 3 });
    const initial = model.snapshot();
    const selected = initial.currentIntersectionId;
    model.setParameters({ power: false, currentAuto: false });
    expect(model.snapshot().cells).toEqual(initial.cells);
    model.changeLight();
    const selectedLight = model
      .snapshot()
      .intersections.find((light) => light.id === selected)!;
    expect(selectedLight.greenLightUp).toBe(false);
    const horizontalLight = model
      .snapshot()
      .cells.find(
        (cell) => cell.x === selectedLight.x - 1 && cell.y === selectedLight.y,
      )!;
    expect(horizontalLight.color).toBe("#ffffff");
    model.step(3);
    expect(model.snapshot().phase).toBe(0);
    expect(
      model.snapshot().intersections.find((light) => light.id === selected)!
        .auto,
    ).toBe(false);
  });

  test("grid selection accepts an actual intersection; goal selection takes nearest", () => {
    const plain = grid({ numCars: 1 });
    const targeted = goal({ numCars: 1 });
    const background = plain
      .snapshot()
      .cells.find((cell) => !cell.intersection)!;
    expect(plain.selectIntersection(background)).toBe(false);
    expect(targeted.selectIntersection(background)).toBe(true);
    const intersection = plain.snapshot().intersections.at(-1)!;
    expect(plain.selectIntersection(intersection)).toBe(true);
    expect(plain.snapshot().currentIntersectionId).toBe(intersection.id);
  });

  test("goal work/home references remain distinct and watch cleanup preserves enlarged source car", () => {
    const model = goal({ seed: 4, numCars: 8 });
    const initial = model.snapshot();
    expect(
      initial.cars.every(
        (car) => car.houseId !== car.workId && car.goalId === car.workId,
      ),
    ).toBe(true);
    const id = initial.cars[0]!.id;
    model.watchCar(id);
    expect(model.snapshot().cars.find((car) => car.id === id)!.size).toBe(2);
    expect(
      model
        .snapshot()
        .cells.filter((cell) => ["house", "work"].includes(cell.label)).length,
    ).toBe(2);
    model.stopWatching();
    expect(model.snapshot().watchedCarId).toBe(null);
    expect(model.snapshot().cars.find((car) => car.id === id)!.size).toBe(2);
    expect(
      model
        .snapshot()
        .cells.some((cell) => ["house", "work"].includes(cell.label)),
    ).toBe(false);
    model.step(100);
    expect(model.snapshot().cars.length).toBe(8);
    expect(model.snapshot().tick).toBe(100);
  });

  test("taxi exposes45 independent demand inputs and exact source defaults", () => {
    const demandKeys = Object.keys(inputs).filter((key) =>
      key.startsWith("prob-"),
    ) as DemandKey[];
    expect(demandKeys.length).toBe(45);
    expect(inputs["prob-res-cbd-AM"].default).toBe(1);
    expect(inputs["prob-cbd-cbd-MD"].default).toBe(0.97);
    const model = taxi({ numTaxicab: 4, ...noDemand() });
    const initial = model.snapshot();
    expect(initial.passengers.length).toBe(0);
    expect(
      initial.cabs.every((cab) => cab.numTotalTrips === 0 && cab.vacancy),
    ).toBe(true);
    model.step(100);
    expect(model.snapshot().passengers.length).toBe(0);
    expect(
      model
        .snapshot()
        .cabs.every(
          (cab) =>
            cab.numBusinessMiles === 0 &&
            cab.numTotalMiles === cab.numDeadMiles,
        ),
    ).toBe(true);
  });

  test("taxi phase changes at source pre-step period boundary and wraps all five phases", () => {
    const model = taxi({ numTaxicab: 1, lengthOfTimePeriod: 2, ...noDemand() });
    model.step(2);
    expect(model.snapshot().currentPhase).toBe("AM Peak");
    model.step(1);
    expect(model.snapshot().currentPhase).toBe("Midday");
    model.step(2);
    expect(model.snapshot().currentPhase).toBe("PM Peak");
    model.step(2);
    expect(model.snapshot().currentPhase).toBe("Evening");
    model.step(2);
    expect(model.snapshot().currentPhase).toBe("Early Morning");
    model.step(2);
    expect(model.snapshot().currentPhase).toBe("AM Peak");
  });

  test("source zero-length green control raises an explicit error without completing tick", () => {
    const model = taxi({ lengthOfGreenLight: 0 });
    expect(() => model.step()).toThrow("modulo by zero");
    expect(model.snapshot().tick).toBe(0);
  });

  test("taxi current passenger count and completed-trip samples conserve accounting", () => {
    const model = taxi({
      seed: 8,
      numTaxicab: 25,
      waitTimeMean: 200,
      waitTimeSd: 0,
    });
    model.step(400);
    const state = model.snapshot();
    expect(state.cabs.length).toBe(25);
    expect(state.cabs.some((cab) => cab.tripIncomes.length > 0)).toBe(true);
    for (const cab of state.cabs) {
      expect(cab.numTotalMiles).toBe(cab.numBusinessMiles + cab.numDeadMiles);
      expect(cab.tripIncomes.length).toBe(cab.tripDistances.length);
      expect(cab.tripIncomes.length).toBe(cab.tripDurations.length);
      expect(cab.totalIncome).toBeCloseTo(
        cab.tripIncomes.reduce((sum, value) => sum + value, 0),
        10,
      );
      expect(cab.numTotalTrips).toBe(
        cab.tripIncomes.length + (cab.vacancy ? 0 : 1),
      );
    }
  });

  test("read models are detached and observation never changes RNG continuation", () => {
    for (const factory of [grid, goal]) {
      const observed = factory({ seed: 2, numCars: 5 });
      const control = factory({ seed: 2, numCars: 5 });
      const read = observed.snapshot();
      read.cells[0]!.color = "mutated observation";
      read.cars[0]!.speed = 999;
      observed.step(10);
      control.step(10);
      expect(observed.snapshot()).toEqual(control.snapshot());
    }
    const observed = taxi({ seed: 3, numTaxicab: 3 });
    const control = taxi({ seed: 3, numTaxicab: 3 });
    observed.snapshot().cabs[0]!.tripIncomes.push(999);
    observed.snapshot();
    observed.step(10);
    control.step(10);
    expect(observed.snapshot()).toEqual(control.snapshot());
  });

  test("setup-only controls reject live mutation without changing state", () => {
    const model = grid({ numCars: 1 });
    expect(() => model.setParameters({ numCars: 2 })).toThrow("setup-only");
    expect(model.snapshot().parameters.numCars).toBe(1);
    const service = taxi({ numTaxicab: 1 });
    expect(() => service.setParameters({ numTaxicab: 2 })).toThrow(
      "setup-only",
    );
    expect(service.snapshot().parameters.numTaxicab).toBe(1);
  });
});

test("public Grid speed procedures retain overshoot and negative following-speed source boundaries", () => {
  const model = grid({ numCars: 2 });
  const [first, second] = model.cars();
  const location = model.roads.find(
    (patch) =>
      patch.color === "#ffffff" &&
      model.grid.fieldAt({ x: patch.x + 1, y: patch.y })!.road,
  )!;
  first!.move({ to: location });
  first!.upCar = false;
  const ahead = model.grid.fieldAt({ x: location.x + 1, y: location.y })!;
  second!.move({ to: ahead });
  second!.upCar = false;
  second!.speed = 0.01;
  model.setCarSpeed(first!);
  expect(first!.speed).toBeCloseTo(-0.089, 12);
  second!.move({ to: { x: 0, y: 0 } });
  first!.speed = 1;
  model.setCarSpeed(first!);
  expect(first!.speed).toBe(1.099);
});

test("Taxi U-turn bypasses occupancy while ordinary movement waits, and only movement charges fare", () => {
  const model = taxi({
    numTaxicab: 2,
    ...noDemand(),
    eachGridCost: 1,
    eachTickCost: 0.5,
  });
  const [first, second] = model.cabs();
  first!.move({ to: { x: 3, y: 3 } });
  second!.move({ to: { x: 3, y: 4 } });
  first!.rotate(0 - first!.heading);
  model.moveUp(first!);
  expect(first!.numTotalMiles).toBe(0);
  first!.rotate(90 - first!.heading);
  first!.vacancy = false;
  first!.currentTripIncome = 2;
  model.makeUTurn(first!);
  expect(first!.x).toBe(3);
  expect(first!.y).toBe(4);
  expect(first!.heading).toBe(270);
  expect(first!.numBusinessMiles).toBe(1);
  expect(first!.currentTripIncome).toBe(3.5);
  first!.destinationX = 3;
  first!.destinationX2 = 3;
  first!.destinationY = 4;
  first!.destinationY2 = 4;
  model.dropoffPassenger(first!);
  expect(first!.vacancy).toBe(true);
  expect(first!.totalIncome).toBe(3.5);
  expect(first!.tripIncomes).toEqual([3.5]);
});

test("Taxi generated passengers age before pickup and zero patience removes them immediately", () => {
  const model = taxi({
    numTaxicab: 1,
    waitTimeMean: 0,
    waitTimeSd: 0,
    ...noDemand(),
    "prob-cbd-cbd-AM": 1,
  });
  model.generateDemand("cbd", "cbd");
  expect(model.passengers().length).toBe(1);
  expect(model.passengers()[0]!.beenWaiting).toBe(0);
  model.passengersWaitForRide();
  expect(model.passengers().length).toBe(0);
  expect(model.snapshot().tick).toBe(0);
});

test("Goal faces its local choice before speed lookup while retaining the setup upCar flag", () => {
  const model = goal({ numCars: 2 });
  const [commuter, blocker] = model.cars();
  const junction = model.intersections.find(
    (patch) => patch.x > -10 && patch.x < 10 && patch.y > -10 && patch.y < 10,
  )!;
  commuter!.move({ to: junction });
  commuter!.upCar = true;
  commuter!.rotate(180 - commuter!.heading);
  commuter!.speed = 0.4;
  commuter!.house = model.grid.fieldAt({ x: junction.x - 3, y: junction.y })!;
  commuter!.work = model.grid.fieldAt({ x: junction.x + 3, y: junction.y })!;
  commuter!.goal = commuter!.work;

  const downPatch = model.grid.fieldAt({ x: junction.x, y: junction.y - 1 })!;
  blocker!.move({ to: downPatch });
  blocker!.upCar = false;
  blocker!.speed = 0;
  downPatch.color = "#e33131";
  const waitBefore = commuter!.waitTime;

  model.step();

  expect(commuter!.heading).toBe(90);
  expect(commuter!.upCar).toBe(true);
  expect(commuter!.speed).toBe(0);
  expect(commuter!.x).toBe(junction.x);
  expect(commuter!.y).toBe(junction.y);
  expect(commuter!.waitTime).toBe(waitBefore + 1);
  expect(model.snapshot().phase).toBe(1);
  expect(model.snapshot().tick).toBe(1);
});

test("Goal applies both source adjacency checks instead of an else-if destination toggle", () => {
  const model = goal({ numCars: 1 });
  const commuter = model.cars()[0]!;
  const junction = model.intersections.find(
    (patch) => patch.x > -10 && patch.x < 10 && patch.y > -10 && patch.y < 10,
  )!;
  commuter.move({ to: junction });
  commuter.house = model.grid.fieldAt({ x: junction.x - 1, y: junction.y })!;
  commuter.work = model.grid.fieldAt({ x: junction.x + 1, y: junction.y })!;
  commuter.goal = commuter.house;

  const destination = model.nextPatch(commuter);

  expect(commuter.goal).toBe(commuter.house);
  expect(model.grid.neighbors(junction, { neighborhood: "moore" })).toContain(
    destination,
  );
  expect(["#ffffff", "#e33131", "#30b949"]).toContain(destination.color);
  expect(model.snapshot().tick).toBe(0);
});

test("explicit Grid and Goal compositions retain separate canonical state and caller-owned clocks", () => {
  const plain = grid({ seed: 4, numCars: 4 });
  const commuters = goal({ seed: 4, numCars: 4 });
  const goalBefore = commuters.snapshot();
  const canonicalRoad = plain.roads[0]!;
  expect(plain.grid.fields).toContain(canonicalRoad);
  expect(commuters.grid.fields).not.toContain(canonicalRoad);
  expect(plain.world.agents[0]).toBe(plain.cars()[0]);
  expect(commuters.world.agents[0]).toBe(commuters.cars()[0]);

  plain.setParameters({ power: false });
  plain.changeLight();
  plain.step(3);

  expect(commuters.snapshot()).toEqual(goalBefore);
  expect(plain.snapshot().tick).toBe(3);
  expect(commuters.snapshot().tick).toBe(0);
  expect(
    plain
      .snapshot()
      .cars.every(
        (car) =>
          car.houseId === null && car.workId === null && car.goalId === null,
      ),
  ).toBe(true);
  expect(
    commuters
      .cars()
      .every(
        (car) =>
          commuters.grid.fields.includes(car.house!) &&
          commuters.grid.fields.includes(car.work!),
      ),
  ).toBe(true);
});
