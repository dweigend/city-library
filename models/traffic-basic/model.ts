/** Adapted from NetLogo Traffic Basic (Wilensky, 1997); see NOTICE.md. */
import { Agent, Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface TrafficBasicParameters {
  seed: number;
  numberOfCars: number;
  acceleration: number;
  deceleration: number;
}
export const inputs: Inputs<TrafficBasicParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numberOfCars: { kind: "number", default: 20, min: 1, max: 51, integer: true },
  acceleration: { kind: "number", default: 0.0045, min: 0, max: 0.0099 },
  deceleration: { kind: "number", default: 0.026, min: 0, max: 0.099 },
};
type Car = Agent<{ speed: number }>;

export function create(options: Partial<TrafficBasicParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 51, y: 9, boundary: { x: "wrap", y: "hard" } } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  const cars = () => world.agents as readonly Car[];
  const history: {
    tick: number;
    selectedSpeed: number;
    minSpeed: number;
    maxSpeed: number;
  }[] = [];

  function setupCars() {
    for (let index = 0; index < settings.numberOfCars; index++) {
      const car = Agent.create(
        { speed: 0.1 + random.number() * 0.9 },
        {
          position: { x: -25.5 + random.number() * 51, y: 0 },
          orientation: { heading: 90 },
        },
      );
      world.add(car);
      while (grid.agentsAt(grid.fieldAt(car)!).length > 1) car.move(1);
    }
  }
  setupCars();
  const sampleCar = random.sample(cars(), { count: 1 })[0]!;

  function slowDownCar(car: Car, carAhead: Car) {
    car.speed = carAhead.speed - settings.deceleration;
  }
  function speedUpCar(car: Car) {
    car.speed += settings.acceleration;
  }
  function go() {
    for (const car of random.sample(cars(), {
      count: cars().length,
      algorithm: "fisher-yates-descending",
    })) {
      const positionAhead = geometry.normalize(
        { x: car.x + 1, y: car.y },
        { space, endpoints: "half-open" },
      )!;
      const ahead = grid.agentsAt(grid.fieldAt(positionAhead)!, {
        source: cars(),
      });
      const carAhead = random.sample(ahead, {
        count: Math.min(1, ahead.length),
      })[0];
      if (carAhead) slowDownCar(car, carAhead);
      else speedUpCar(car);
      car.speed = Math.max(0, Math.min(1, car.speed));
      car.move(car.speed);
    }
  }
  function record() {
    const speeds = cars().map((car) => car.speed);
    history.push({
      tick: world.tick.value,
      selectedSpeed: sampleCar.speed,
      minSpeed: Math.min(...speeds),
      maxSpeed: Math.max(...speeds),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function step(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      run(world, go);
      record();
    }
    return count;
  }
  function setParameters(
    update: Partial<
      Pick<TrafficBasicParameters, "acceleration" | "deceleration">
    >,
  ) {
    if (
      Object.keys(update).some(
        (key) => !["acceleration", "deceleration"].includes(key),
      )
    )
      throw new TypeError("Only live parameters may change.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function snapshot() {
    return {
      tick: world.tick.value,
      width: 51,
      height: 9,
      parameters: { ...settings },
      selectedCarId: sampleCar.id,
      cars: cars().map((car) => ({
        id: car.id,
        x: car.x,
        y: car.y,
        heading: car.heading,
        speed: car.speed,
        color: car === sampleCar ? "#e33c3c" : "#315fd1",
      })),
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        color: Math.abs(field.y) < 2 ? "#ffffff" : "#000000",
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  record();
  return {
    step,
    advance: step,
    snapshot,
    read: snapshot,
    setParameters,
    slowDownCar,
    speedUpCar,
  };
}
export const model = {
  title: "Traffic Basic",
  inputs,
  create,
} satisfies Definition<TrafficBasicParameters, ReturnType<typeof create>>;
