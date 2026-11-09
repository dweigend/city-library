/** Adapted from NetLogo Traffic Intersection (Wilensky, 1998); see NOTICE.md. */
import { Agent, Grid, Random, World, geometry, run } from "city-library";
import type { Field } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface TrafficIntersectionParameters {
  seed: number;
  auto: boolean;
  speedLimit: number;
  maxAccel: number;
  maxBrake: number;
  freqNorth: number;
  freqEast: number;
  greenLength: number;
  yellowLength: number;
}
export const inputs: Inputs<TrafficIntersectionParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  auto: { kind: "boolean", default: true },
  speedLimit: { kind: "number", default: 5, min: 1, max: 10, integer: true },
  maxAccel: { kind: "number", default: 2, min: 1, max: 10, integer: true },
  maxBrake: { kind: "number", default: 4, min: 1, max: 10, integer: true },
  freqNorth: { kind: "number", default: 60, min: 0, max: 100 },
  freqEast: { kind: "number", default: 100, min: 0, max: 100 },
  greenLength: { kind: "number", default: 12, min: 1, max: 50, integer: true },
  yellowLength: { kind: "number", default: 3, min: 0, max: 10, integer: true },
};
type Car = Agent<{ kind: "car"; speed: number; color: string }>;
type Light = Agent<{ kind: "light"; color: "red" | "green" | "yellow" }>;
type Accident = Agent<{ kind: "accident"; clearIn: number }>;

export function create(options: Partial<TrafficIntersectionParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 35, y: 35, boundary: "hard" } as const;
  const world = World.add(space, { random });
  const grid = Grid.add(space);
  world.add(grid);
  const cars = () =>
    world.agents.filter((agent) => (agent as Car).kind === "car") as Car[];
  const lights = () =>
    world.agents.filter(
      (agent) => (agent as Light).kind === "light",
    ) as Light[];
  const accidents = () =>
    world.agents.filter(
      (agent) => (agent as Accident).kind === "accident",
    ) as Accident[];
  let ticksAtLastChange = 0;
  const history: {
    tick: number;
    waiting: number;
    waitingNorth: number;
    waitingEast: number;
    accidents: number;
  }[] = [];
  world.add(
    Agent.add(
      { kind: "light" as const, color: "green" as const },
      { position: { x: 0, y: -1 } },
    ),
  );
  world.add(
    Agent.add(
      { kind: "light" as const, color: "red" as const },
      { position: { x: -1, y: 0 } },
    ),
  );

  function fieldAhead(car: Car, distance: number) {
    const direction = geometry.direction({ heading: car.heading });
    const position = geometry.normalize(
      { x: car.x + direction.x * distance, y: car.y + direction.y * distance },
      { space, endpoints: "half-open" },
    );
    return position ? grid.fieldAt(position) : undefined;
  }
  function isBlocked(car: Car, field: Field) {
    const occupants = grid.agentsAt(field);
    return occupants.some((agent) => {
      if (agent === car) return false;
      const kind = (agent as Car | Light | Accident).kind;
      if (kind === "car" || kind === "accident") return true;
      const light = agent as Light;
      return (
        light.color === "red" ||
        (light.color === "yellow" && field !== grid.fieldAt(car))
      );
    });
  }
  function nextBlockedField(car: Car) {
    let field: Field | undefined = grid.fieldAt(car);
    while (field && !isBlocked(car, field))
      field = fieldAhead(car, car.distanceTo(field) + 1);
    return field;
  }
  function brakingDistanceAt(speed: number) {
    return speed + Math.max(speed - settings.maxBrake, 0);
  }
  function adjustSpeed(car: Car) {
    const minimum = Math.max(car.speed - settings.maxBrake, 0);
    let target = Math.min(car.speed + settings.maxAccel, settings.speedLimit);
    const blocked = nextBlockedField(car);
    if (blocked) {
      const spaceAhead = car.distanceTo(blocked) - 1;
      while (brakingDistanceAt(target) > spaceAhead && target > minimum)
        target--;
    }
    car.speed = target;
  }
  function move(car: Car) {
    adjustSpeed(car);
    for (let count = 0; count < car.speed; count++) {
      car.move(1);
      if (!fieldAhead(car, 1)) {
        car.delete();
        return;
      }
      const collisions = grid.agentsAt(grid.fieldAt(car)!, {
        source: accidents(),
      });
      if (collisions.length) {
        for (const accident of collisions) accident.clearIn = 5;
        car.delete();
        return;
      }
    }
  }
  function checkForCollisions() {
    const existing = accidents();
    for (const accident of random.sample(existing, {
      count: existing.length,
      compatibility: "legacy-shuffle",
    })) {
      accident.clearIn--;
      if (accident.clearIn === 0) accident.delete();
    }
    for (const field of grid.fields) {
      const crashed = grid.agentsAt(field, { source: cars() });
      if (crashed.length > 1) {
        world.add(
          Agent.add(
            { kind: "accident" as const, clearIn: 5 },
            { position: field },
          ),
        );
        for (const car of crashed) car.delete();
      }
    }
  }
  function makeNewCar(
    frequency: number,
    x: number,
    y: number,
    heading: number,
  ) {
    if (
      random.number() * 100 >= frequency ||
      grid.agentsAt(grid.fieldAt({ x, y })!).length
    )
      return;
    const color = random.sample(
      ["#d33d3d", "#335dd9", "#d8bb25", "#be4cd2", "#f19a26", "#43a4b9"],
      { count: 1 },
    )[0]!;
    const car = Agent.add(
      { kind: "car" as const, speed: 0, color },
      { position: { x, y }, orientation: { heading } },
    );
    world.add(car);
    adjustSpeed(car);
  }
  function changeToYellow() {
    for (const light of lights().filter((light) => light.color === "green")) {
      light.color = "yellow";
      ticksAtLastChange = world.tick.value;
    }
  }
  function changeToRed() {
    const yellow = lights().filter((light) => light.color === "yellow");
    for (const light of yellow) {
      light.color = "red";
      for (const other of lights()) if (other !== light) other.color = "green";
      ticksAtLastChange = world.tick.value;
    }
  }
  function elapsed(length: number) {
    return world.tick.value - ticksAtLastChange > length;
  }
  function go() {
    const active = cars();
    for (const car of random.sample(active, {
      count: active.length,
      compatibility: "legacy-shuffle",
    }))
      move(car);
    checkForCollisions();
    makeNewCar(settings.freqNorth, 0, -17, 0);
    makeNewCar(settings.freqEast, -17, 0, 90);
    if (settings.auto && elapsed(settings.greenLength)) changeToYellow();
    if (
      lights().some((light) => light.color === "yellow") &&
      elapsed(settings.yellowLength)
    )
      changeToRed();
  }
  function record() {
    const waiting = cars().filter((car) => car.speed === 0);
    history.push({
      tick: world.tick.value,
      waiting: waiting.length,
      waitingNorth: waiting.filter((car) => car.heading === 0).length,
      waitingEast: waiting.filter((car) => car.heading === 90).length,
      accidents: accidents().length,
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
    update: Partial<Omit<TrafficIntersectionParameters, "seed">>,
  ) {
    if (Object.keys(update).includes("seed"))
      throw new TypeError("Seed is setup-only.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function snapshot() {
    return {
      tick: world.tick.value,
      width: 35,
      height: 35,
      parameters: { ...settings },
      ticksAtLastChange,
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        color:
          Math.abs(field.x) <= 1 || Math.abs(field.y) <= 1
            ? "#000000"
            : "#389c24",
      })),
      cars: cars().map((car) => ({
        id: car.id,
        x: car.x,
        y: car.y,
        heading: car.heading,
        speed: car.speed,
        color: car.color,
      })),
      lights: lights().map((light) => ({
        id: light.id,
        x: light.x,
        y: light.y,
        color: light.color,
      })),
      accidents: accidents().map((accident) => ({
        id: accident.id,
        x: accident.x,
        y: accident.y,
        clearIn: accident.clearIn,
        color: "#f5d623",
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
    changeToYellow,
    changeToRed,
    elapsed,
    brakingDistanceAt,
    nextBlockedField,
    isBlocked,
    adjustSpeed,
    move,
    checkForCollisions,
    makeNewCar,
  };
}
export const model = {
  title: "Traffic Intersection",
  inputs,
  create,
} satisfies Definition<
  TrafficIntersectionParameters,
  ReturnType<typeof create>
>;
