/** Adapted from NetLogo Traffic 2 Lanes (Wilensky and Payette, 1998); see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Position } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface TrafficLanesParameters {
  seed: number;
  carCount: number;
  acceleration: number;
  deceleration: number;
  maxPatience: number;
}
export const inputs: Inputs<TrafficLanesParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  carCount: { kind: "number", default: 40, min: 1, max: 82, integer: true },
  acceleration: { kind: "number", default: 0.005, min: 0.001, max: 0.01 },
  deceleration: { kind: "number", default: 0.02, min: 0.01, max: 0.1 },
  maxPatience: { kind: "number", default: 50, min: 1, max: 100, integer: true },
};
type Car = Agent<{
  speed: number;
  topSpeed: number;
  targetLane: number;
  patience: number;
  baseColor: string;
}>;
interface Sample {
  tick: number;
  meanSpeed: number;
  minSpeed: number;
  maxSpeed: number;
  selectedSpeed: number;
  meanPatience: number;
  minPatience: number;
  maxPatience: number;
  selectedPatience: number;
  lane1CarCount: number;
  lane2CarCount: number;
}

export function create(options: Partial<TrafficLanesParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 41, y: 17, boundary: { x: "wrap", y: "hard" } } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { color: "#4ba322" } });
  world.add(grid);
  const lanes = [1, -1] as const;
  const cars = () => world.agents as readonly Car[];
  let selectedCar: Car | undefined;
  let perspective: "normal" | "watch" | "follow" = "normal";
  const history: Sample[] = [];
  function choose<T>(values: readonly T[]) {
    return random.sample(values, { sampleCount: Math.min(1, values.length) })[0];
  }
  function drawRoad() {
    for (const field of grid.fields) {
      const shade = random.number();
      field.color =
        Math.abs(field.y) <= 2
          ? `hsl(0 0% ${25 + shade * 2}%)`
          : `hsl(100 60% ${34 + shade * 3}%)`;
    }
  }
  function createOrRemoveCars() {
    const roadFields = grid.fields.filter((field) =>
      lanes.includes(field.y as 1 | -1),
    );
    while (cars().length < settings.carCount) {
      const free = roadFields.filter(
        (field) => grid.agentsAt(field).length === 0,
      );
      const field = choose(free)!;
      const car = Agent.create(
        {
          speed: 0.5,
          topSpeed: 0.5 + random.number() * 0.5,
          targetLane: field.y,
          patience: Math.floor(random.number() * settings.maxPatience),
          baseColor: choose(["#3466d7", "#28bcd9", "#5fa2db"])!,
        },
        { position: field, orientation: { heading: 90 } },
      );
      world.add(car);
    }
    const excess = cars().length - settings.carCount;
    if (excess > 0) {
      const candidates = cars().filter((car) => car !== selectedCar);
      for (const car of random.sample(candidates, { sampleCount: excess }))
        car.delete();
    }
  }
  function slowDownCar(car: Car) {
    car.speed -= settings.deceleration;
    if (car.speed < 0) car.speed = settings.deceleration;
    car.patience--;
  }
  function speedUpCar(car: Car) {
    car.speed = Math.min(car.topSpeed, car.speed + settings.acceleration);
  }
  function closestBlocker(car: Car, radius: number, transverse: "x" | "y") {
    const blockers = car
      .neighbors({ source: cars(), radius, angle: 180 })
      .filter((other) => {
        const aligned =
          transverse === "x"
            ? { x: other.x, y: car.y }
            : { x: car.x, y: other.y };
        return other.distanceTo(aligned) <= 1;
      });
    if (!blockers.length) return undefined;
    const minimum = Math.min(...blockers.map((other) => car.distanceTo(other)));
    return choose(
      blockers.filter((other) => car.distanceTo(other) === minimum),
    );
  }
  function moveForward(car: Car) {
    car.rotate({ towards: { x: car.x + 1, y: car.y } });
    speedUpCar(car);
    const blocker = closestBlocker(car, 1 + car.speed, "x");
    if (blocker) {
      car.speed = blocker.speed;
      slowDownCar(car);
    }
    car.move(car.speed);
  }
  function chooseNewLane(car: Car) {
    const alternatives = lanes.filter((lane) => lane !== car.y);
    if (!alternatives.length) return;
    const minimum = Math.min(
      ...alternatives.map((lane) => Math.abs(lane - car.y)),
    );
    car.targetLane = choose(
      alternatives.filter((lane) => Math.abs(lane - car.y) === minimum),
    )!;
    car.patience = settings.maxPatience;
  }
  function moveToTargetLane(car: Car) {
    car.rotate({
      towards: { x: car.x, y: car.y + (car.targetLane < car.y ? -1 : 1) },
    });
    const blocker = closestBlocker(
      car,
      1 + Math.abs(car.y - car.targetLane),
      "y",
    );
    if (!blocker) {
      car.move(0.2);
      car.move({ to: { x: car.x, y: Math.round(car.y * 10) / 10 } });
    } else if (car.directionTo(blocker)!.heading <= 180) slowDownCar(car);
    else speedUpCar(car);
  }
  function go() {
    createOrRemoveCars();
    for (const car of random.sample(cars(), {
      sampleCount: cars().length,
      algorithm: "fisher-yates-descending",
    }))
      moveForward(car);
    const impatient = cars().filter((car) => car.patience <= 0);
    for (const car of random.sample(impatient, {
      sampleCount: impatient.length,
      algorithm: "fisher-yates-descending",
    }))
      chooseNewLane(car);
    const changing = cars().filter((car) => car.y !== car.targetLane);
    for (const car of random.sample(changing, {
      sampleCount: changing.length,
      algorithm: "fisher-yates-descending",
    }))
      moveToTargetLane(car);
  }
  function selectCar(id: string) {
    const car = cars().find((candidate) => candidate.id === id);
    if (!car) throw new RangeError("Unknown car.");
    selectedCar = car;
  }
  function selectCarAt(position: Position) {
    const field = grid.fieldAt(position);
    if (!field) return;
    const car = choose(grid.agentsAt(field, { source: cars() }));
    if (car) selectedCar = car;
  }
  function setPerspective(value: "normal" | "watch" | "follow") {
    if (!["normal", "watch", "follow"].includes(value))
      throw new RangeError("Unknown perspective.");
    perspective = value;
  }
  function record() {
    const speed = cars().map((car) => car.speed);
    const patience = cars().map((car) => car.patience);
    history.push({
      tick: world.tick.value,
      meanSpeed: speed.reduce((sum, value) => sum + value, 0) / speed.length,
      minSpeed: Math.min(...speed),
      maxSpeed: Math.max(...speed),
      selectedSpeed: selectedCar!.speed,
      meanPatience:
        patience.reduce((sum, value) => sum + value, 0) / patience.length,
      minPatience: Math.min(...patience),
      maxPatience: Math.max(...patience),
      selectedPatience: selectedCar!.patience,
      lane1CarCount: cars().filter((car) => Math.round(car.y) === 1).length,
      lane2CarCount: cars().filter((car) => Math.round(car.y) === -1).length,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function step(stepCount = 1) {
    validateStepCount(stepCount);
    for (let index = 0; index < stepCount; index++) {
      run(world, go);
      record();
    }
    return stepCount;
  }
  function setParameters(
    update: Partial<Omit<TrafficLanesParameters, "seed">>,
  ) {
    if (Object.keys(update).includes("seed"))
      throw new TypeError("Seed is setup-only.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }
  function snapshot() {
    return {
      tick: world.tick.value,
      width: 41,
      height: 17,
      parameters: { ...settings },
      selectedCarId: selectedCar!.id,
      perspective,
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        color: field.color,
      })),
      cars: cars().map((car) => ({
        id: car.id,
        x: car.x,
        y: car.y,
        heading: car.heading,
        speed: car.speed,
        topSpeed: car.topSpeed,
        targetLane: car.targetLane,
        patience: car.patience,
        color: car === selectedCar ? "#e53c3c" : car.baseColor,
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  drawRoad();
  createOrRemoveCars();
  selectedCar = choose(cars())!;
  record();
  return {
    step,
    advance: step,
    snapshot,
    read: snapshot,
    setParameters,
    selectCar,
    selectCarAt,
    setPerspective,
    createOrRemoveCars,
    speedUpCar,
    slowDownCar,
    moveForward,
    chooseNewLane,
    moveToTargetLane,
  };
}
export const model = {
  title: "Two-Lane Traffic",
  description: "Cars speed up, slow down and change lanes on a circular two-lane road.",
  inputs,
  create,
} satisfies Definition<TrafficLanesParameters, ReturnType<typeof create>>;
