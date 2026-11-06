/** NetLogo Traffic Grid (2003), Uri Wilensky; CC BY-NC-SA 3.0, see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Field, Position } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface TrafficParameters {
  seed: number;
  gridSizeX: number;
  gridSizeY: number;
  numCars: number;
  speedLimit: number;
  ticksPerCycle: number;
  currentPhase: number;
  currentAuto: boolean;
  power: boolean;
}
export const inputs: Inputs<TrafficParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  gridSizeX: { kind: "number", default: 5, min: 1, max: 9, integer: true },
  gridSizeY: { kind: "number", default: 5, min: 1, max: 9, integer: true },
  numCars: { kind: "number", default: 200, min: 1, max: 400, integer: true },
  speedLimit: { kind: "number", default: 1, min: 0.1, max: 1 },
  ticksPerCycle: {
    kind: "number",
    default: 20,
    min: 1,
    max: 100,
    integer: true,
  },
  currentPhase: { kind: "number", default: 0, min: 0, max: 99, integer: true },
  currentAuto: { kind: "boolean", default: true },
  power: { kind: "boolean", default: true },
};
interface PatchState {
  road: boolean;
  intersection: boolean;
  greenLightUp: boolean;
  row: number;
  column: number;
  phase: number;
  auto: boolean;
  color: string;
  label: string;
}
type Patch = Field<PatchState>;
type Car = Agent<{
  who: number;
  speed: number;
  upCar: boolean;
  waitTime: number;
  color: string;
  size: number;
  label: string;
}>;

export function create(options: Partial<TrafficParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ x: 37, y: 37, boundary: "wrap" }, { random });
  const grid = Grid.add(
    { x: 37, y: 37, boundary: "wrap" },
    {
      state: {
        road: false,
        intersection: false,
        greenLightUp: true,
        row: -1,
        column: -1,
        phase: -1,
        auto: false,
        color: "#9b7653",
        label: "",
      },
    },
  );
  world.add(grid);
  const cars = () => world.agents as readonly Car[];
  const patchId = (patch: Patch) => `${patch.x},${patch.y}`;
  const carId = (car: Car) => `car-${car.who}`;
  const shuffled = <T>(items: readonly T[]) =>
    random.sample(items, { count: items.length });
  const choose = <T>(items: readonly T[]): T => {
    if (!items.length)
      throw new Error("The original model requested one-of an empty agentset.");
    return items[Math.floor(random.number() * items.length)]!;
  };
  const xIncrement = 37 / settings.gridSizeX;
  const yIncrement = 37 / settings.gridSizeY;
  const modulo = (value: number, divisor: number) =>
    ((value % divisor) + divisor) % divisor;
  const vertical = (x: number) =>
    Math.floor(modulo(x + 18 - Math.floor(xIncrement - 1), xIncrement)) === 0;
  const horizontal = (y: number) =>
    Math.floor(modulo(y + 18, yIncrement)) === 0;
  const roads: Patch[] = [];
  const intersections: Patch[] = [];
  let current: Patch;
  let phase = 0;
  let numCarsStopped = 0;
  const history: {
    tick: number;
    numCarsStopped: number;
    meanSpeed: number;
    meanWait: number;
  }[] = [];

  function setSignalColors(patch: Patch) {
    grid.fieldAt({ x: patch.x - 1, y: patch.y })!.color = !settings.power
      ? "#ffffff"
      : patch.greenLightUp
        ? "#e33131"
        : "#30b949";
    grid.fieldAt({ x: patch.x, y: patch.y + 1 })!.color = !settings.power
      ? "#ffffff"
      : patch.greenLightUp
        ? "#30b949"
        : "#e33131";
  }
  function setupPatches() {
    for (const patch of grid.fields) {
      patch.road = vertical(patch.x) || horizontal(patch.y);
      patch.intersection = vertical(patch.x) && horizontal(patch.y);
      if (patch.road) {
        patch.color = "#ffffff";
        roads.push(patch);
      }
      if (patch.intersection) {
        patch.phase = 0;
        patch.auto = true;
        patch.row = Math.floor((patch.y + 18) / yIncrement);
        patch.column = Math.floor((patch.x + 18) / xIncrement);
        intersections.push(patch);
      }
    }
  }

  function setupSignals() {
    for (const patch of shuffled(intersections)) setSignalColors(patch);
    grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = "current";
    settings = parameters(inputs, {
      ...settings,
      currentPhase: current.phase,
      currentAuto: current.auto,
    });
  }

  function recordData(car: Car) {
    if (car.speed === 0) {
      numCarsStopped++;
      car.waitTime++;
    } else car.waitTime = 0;
  }
  function setCarColor(car: Car) {
    car.color = car.speed < settings.speedLimit / 2 ? "#355bd5" : "#258b9b";
  }
  function setCarSpeed(car: Car) {
    const here = grid.fieldAt(car)!;
    if (here.color === "#e33131") {
      car.speed = 0;
      return;
    }
    // Traffic Grid follows the source setup direction throughout the run.
    const ahead = grid.fieldAt({
      x: here.x + (car.upCar ? 0 : 1),
      y: here.y + (car.upCar ? -1 : 0),
    })!;
    const blockers = grid.agentsAt(ahead, { source: cars() });
    if (blockers.length) {
      if (blockers.some((other) => other.upCar !== car.upCar)) car.speed = 0;
      else {
        car.speed = choose(blockers).speed;
        car.speed = car.speed <= 0 ? 0 : car.speed - 0.099;
      }
    } else
      car.speed =
        car.speed > settings.speedLimit
          ? settings.speedLimit
          : car.speed + 0.099;
  }
  function setupCars() {
    for (let who = 0; who < settings.numCars; who++) {
      const location = choose(
        roads.filter((patch) => grid.agentsAt(patch).length === 0),
      );
      const upCar = location.intersection
        ? random.number() < 0.5
        : vertical(location.x);
      const car = Agent.add(
        {
          who,
          speed: 0,
          upCar,
          waitTime: 0,
          color: "#355bd5",
          size: 1,
          label: "",
        },
        { position: location, orientation: { heading: upCar ? 180 : 90 } },
      );
      world.add(car);
      setCarColor(car);
      recordData(car);
    }
  }

  function setup() {
    setupPatches();
    current = choose(intersections);
    setupSignals();
    if (settings.numCars > roads.length) {
      throw new RangeError(
        "Too many cars for the amount of road; setup stopped.",
      );
    }
    setupCars();
    // Initial stopped/wait accounting occurs before this speed assignment.
    for (const car of shuffled(cars())) setCarSpeed(car);
  }

  function updateCurrent() {
    current.phase = settings.currentPhase;
    current.auto = settings.currentAuto;
  }
  function setSignals() {
    for (const patch of shuffled(
      intersections.filter(
        (patch) =>
          patch.auto &&
          phase === Math.floor((patch.phase * settings.ticksPerCycle) / 100),
      ),
    )) {
      patch.greenLightUp = !patch.greenLightUp;
      setSignalColors(patch);
    }
  }

  function nextPhase() {
    phase++;
    if (phase % settings.ticksPerCycle === 0) phase = 0;
  }

  function go() {
    updateCurrent();
    setSignals();
    numCarsStopped = 0;
    for (const car of shuffled(cars())) {
      setCarSpeed(car);
      car.move(car.speed);
      recordData(car);
      setCarColor(car);
    }
    nextPhase();
  }
  function record() {
    history.push({
      tick: world.tick.value,
      numCarsStopped,
      meanSpeed:
        cars().reduce((sum, car) => sum + car.speed, 0) / cars().length,
      meanWait:
        cars().reduce((sum, car) => sum + car.waitTime, 0) / cars().length,
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
  function selectIntersection(position: Position) {
    const point = { x: position.x, y: position.y };
    const selected = grid.fieldAt(point);
    if (!selected?.intersection) return false;
    if (!selected) return false;
    updateCurrent();
    grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = "";
    current = selected;
    settings = parameters(inputs, {
      ...settings,
      currentPhase: current.phase,
      currentAuto: current.auto,
    });
    grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = "current";
    return true;
  }
  function changeLight() {
    current.greenLightUp = !current.greenLightUp;
    setSignalColors(current);
  }
  function setParameters(values: Partial<TrafficParameters>) {
    if (
      Reflect.ownKeys(values).some((key) =>
        ["seed", "gridSizeX", "gridSizeY", "numCars"].includes(String(key)),
      )
    ) {
      throw new TypeError(
        "Seed, grid dimensions and population are setup-only.",
      );
    }
    settings = parameters(inputs, { ...settings, ...values });
  }
  function snapshot() {
    return {
      tick: world.tick.value,
      width: 37,
      height: 37,
      parameters: { ...settings },
      phase,
      numCarsStopped,
      currentIntersectionId: patchId(current),
      watchedCarId: null,
      cars: cars().map((car) => ({
        id: carId(car),
        x: car.x,
        y: car.y,
        heading: car.heading,
        speed: car.speed,
        upCar: car.upCar,
        waitTime: car.waitTime,
        color: car.color,
        size: car.size,
        label: car.label,
        houseId: null,
        workId: null,
        goalId: null,
      })),
      intersections: intersections.map((patch) => ({
        id: patchId(patch),
        x: patch.x,
        y: patch.y,
        greenLightUp: patch.greenLightUp,
        auto: patch.auto,
        phase: patch.phase,
        row: patch.row,
        column: patch.column,
      })),
      cells: grid.fields.map((patch) => ({
        id: patchId(patch),
        x: patch.x,
        y: patch.y,
        color: patch.color,
        road: patch.road,
        intersection: patch.intersection,
        label: patch.label,
      })),
      history: history.map((sample) => ({ ...sample })),
    };
  }
  setup();
  record();
  return {
    step,
    advance: step,
    snapshot,
    read: snapshot,
    setParameters,
    selectIntersection,
    changeLight,
    world,
    grid,
    cars,
    roads,
    intersections,
    setSignalColors,
    recordData,
    setCarColor,
    setCarSpeed,
    updateCurrent,
    setSignals,
    nextPhase,
    go,
  };
}

export const model = {
  title: "Traffic Grid",
  inputs,
  create,
  description:
    "Sequential car following on a signal-controlled road grid. Wilensky (2003), CC BY-NC-SA 3.0.",
} satisfies Definition<TrafficParameters, ReturnType<typeof create>>;
