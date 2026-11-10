/** NetLogo Traffic Grid Goal (2008), Uri Wilensky; CC BY-NC-SA 3.0, see NOTICE.md. */
import { Agent, Grid, Random, World, geometry, run } from "city-library";
import type { Field, Position } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface TrafficParameters {
  seed: number;
  gridSizeX: number;
  gridSizeY: number;
  carCount: number;
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
  carCount: { kind: "number", default: 200, min: 1, max: 400, integer: true },
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
interface FieldState {
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
type ModelField = Field<FieldState>;
type Car = Agent<{
  who: number;
  speed: number;
  upCar: boolean;
  waitTime: number;
  color: string;
  size: number;
  label: string;
  house: ModelField | null;
  work: ModelField | null;
  goal: ModelField | null;
}>;

export function create(options: Partial<TrafficParameters> = {}) {
  // One step updates signals, visits cars in sampled order, then advances the phase.
  // step/advance commits World time before recording; read/snapshot only observes.
  // Public interventions select an intersection or edit its light/rules. Watch actions change inspection state.
  function go() {
    updateCurrent();
    setSignals();
    stoppedCarCount = 0;
    for (const car of shuffled(cars())) {
      car.rotate({ towards: nextField(car) });
      setCarSpeed(car);
      car.move(car.speed);
      recordData(car);
      setCarColor(car);
    }
    if (watched)
      watched.label = watched.goal === watched.house ? "house" : "work";
    nextPhase();
  }
  function step(stepCount = 1) {
    validateStepCount(stepCount);
    for (let index = 0; index < stepCount; index++) {
      run(world, go);
      record();
    }
    return stepCount;
  }

  // This factory owns rules, signals and history; World/Grid own live agents and fields.
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 37, y: 37, boundary: "wrap" }, { random });
  const grid = Grid.create(
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
  const fieldId = (field: ModelField) => `${field.x},${field.y}`;
  const carId = (car: Car) => `car-${car.who}`;
  const shuffled = <T>(items: readonly T[]) =>
    random.sample(items, { sampleCount: items.length });
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
  const roads: ModelField[] = [];
  const intersections: ModelField[] = [];
  let current: ModelField;
  let phase = 0;
  let stoppedCarCount = 0;
  let watched: Car | null = null;
  const history: {
    tick: number;
    stoppedCarCount: number;
    meanSpeed: number;
    meanWait: number;
  }[] = [];

  function setSignalColors(field: ModelField) {
    grid.fieldAt({ x: field.x - 1, y: field.y })!.color = !settings.power
      ? "#ffffff"
      : field.greenLightUp
        ? "#e33131"
        : "#30b949";
    grid.fieldAt({ x: field.x, y: field.y + 1 })!.color = !settings.power
      ? "#ffffff"
      : field.greenLightUp
        ? "#30b949"
        : "#e33131";
  }
  function setupFields() {
    for (const field of grid.fields) {
      field.road = vertical(field.x) || horizontal(field.y);
      field.intersection = vertical(field.x) && horizontal(field.y);
      if (field.road) {
        field.color = "#ffffff";
        roads.push(field);
      }
      if (field.intersection) {
        field.phase = 0;
        field.auto = true;
        field.row = Math.floor((field.y + 18) / yIncrement);
        field.column = Math.floor((field.x + 18) / xIncrement);
        intersections.push(field);
      }
    }
  }

  function setupSignals() {
    for (const field of shuffled(intersections)) setSignalColors(field);
    grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = "current";
    settings = parseParameters(inputs, {
      ...settings,
      currentPhase: current.phase,
      currentAuto: current.auto,
    });
  }

  function recordData(car: Car) {
    if (car.speed === 0) {
      stoppedCarCount++;
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
    // Goal deliberately retains this setup direction even after changing heading.
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
    const goalCandidates = grid.fields.filter(
      (field) =>
        field.color === "#9b7653" &&
        grid
          .neighbors(field, { neighborhood: "moore" })
          .some((other) => other.color === "#ffffff"),
    );
    for (let who = 0; who < settings.carCount; who++) {
      const location = choose(
        roads.filter((field) => grid.agentsAt(field).length === 0),
      );
      const upCar = location.intersection
        ? random.number() < 0.5
        : vertical(location.x);
      const car = Agent.create(
        {
          who,
          speed: 0,
          upCar,
          waitTime: 0,
          color: "#355bd5",
          size: 1,
          label: "",
          house: null as ModelField | null,
          work: null as ModelField | null,
          goal: null as ModelField | null,
        },
        { position: location, orientation: { heading: upCar ? 180 : 90 } },
      );
      world.add(car);
      setCarColor(car);
      recordData(car);
      car.house = choose(goalCandidates);
      car.work = choose(goalCandidates.filter((field) => field !== car.house));
      car.goal = car.work;
    }
  }

  function setup() {
    setupFields();
    current = choose(intersections);
    setupSignals();
    if (settings.carCount > roads.length) {
      throw new RangeError(
        "Too many cars for the amount of road; setup stopped.",
      );
    }
    setupCars();
    // Initial stopped/wait accounting occurs before this speed assignment.
    for (const car of shuffled(cars())) setCarSpeed(car);
  }

  function nextField(car: Car) {
    const here = grid.fieldAt(car)!;
    if (
      car.goal === car.house &&
      grid.neighbors(car.house!, { neighborhood: "faces" }).includes(here)
    )
      car.goal = car.work;
    if (
      car.goal === car.work &&
      grid.neighbors(car.work!, { neighborhood: "faces" }).includes(here)
    )
      car.goal = car.house;
    const choices = grid
      .neighbors(here, { neighborhood: "moore" })
      .filter((field) =>
        ["#ffffff", "#e33131", "#30b949"].includes(field.color),
      );
    const distances = choices.map((field) =>
      geometry.distance(field, car.goal!, { space: world.space! }),
    );
    const minimum = Math.min(...distances);
    return choose(choices.filter((_, index) => distances[index] === minimum));
  }
  function updateCurrent() {
    current.phase = settings.currentPhase;
    current.auto = settings.currentAuto;
  }
  function setSignals() {
    for (const field of shuffled(
      intersections.filter(
        (field) =>
          field.auto &&
          phase === Math.floor((field.phase * settings.ticksPerCycle) / 100),
      ),
    )) {
      field.greenLightUp = !field.greenLightUp;
      setSignalColors(field);
    }
  }

  function nextPhase() {
    phase++;
    if (phase % settings.ticksPerCycle === 0) phase = 0;
  }

  function record() {
    history.push({
      tick: world.tick.value,
      stoppedCarCount,
      meanSpeed:
        cars().reduce((sum, car) => sum + car.speed, 0) / cars().length,
      meanWait:
        cars().reduce((sum, car) => sum + car.waitTime, 0) / cars().length,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function selectIntersection(position: Position) {
    const point = { x: position.x, y: position.y };
    const distances = intersections.map((field) =>
      geometry.distance(field, point, { space: world.space! }),
    );
    const minimum = Math.min(...distances);
    const selected = choose(
      intersections.filter((_, index) => distances[index] === minimum),
    );
    if (!selected) return false;
    updateCurrent();
    grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = "";
    current = selected;
    settings = parseParameters(inputs, {
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
  function stopWatching() {
    for (const field of grid.fields) {
      if (field.color === "#f5db33" || field.color === "#ee8b24") {
        field.color = "#9b7653";
        field.label = "";
      }
    }
    for (const car of cars()) car.label = "";
    watched = null;
  }
  function watchCar(id?: string) {
    stopWatching();
    const car =
      id === undefined
        ? choose(cars())
        : cars().find((car) => carId(car) === id);
    if (!car) throw new RangeError("Unknown car.");
    watched = car;
    car.size = 2;
    car.house!.color = "#f5db33";
    car.house!.label = "house";
    car.work!.color = "#ee8b24";
    car.work!.label = "work";
    car.label = car.goal!.label;
  }
  function setParameters(values: Partial<TrafficParameters>) {
    if (
      Reflect.ownKeys(values).some((key) =>
        ["seed", "gridSizeX", "gridSizeY", "carCount"].includes(String(key)),
      )
    ) {
      throw new TypeError(
        "Seed, grid dimensions and population are setup-only.",
      );
    }
    settings = parseParameters(inputs, { ...settings, ...values });
  }
  function snapshot() {
    return {
      tick: world.tick.value,
      width: 37,
      height: 37,
      parameters: { ...settings },
      phase,
      stoppedCarCount,
      currentIntersectionId: fieldId(current),
      watchedCarId: watched ? carId(watched) : null,
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
        houseId: car.house ? fieldId(car.house) : null,
        workId: car.work ? fieldId(car.work) : null,
        goalId: car.goal ? fieldId(car.goal) : null,
      })),
      intersections: intersections.map((field) => ({
        id: fieldId(field),
        x: field.x,
        y: field.y,
        greenLightUp: field.greenLightUp,
        auto: field.auto,
        phase: field.phase,
        row: field.row,
        column: field.column,
      })),
      cells: grid.fields.map((field) => ({
        id: fieldId(field),
        x: field.x,
        y: field.y,
        color: field.color,
        road: field.road,
        intersection: field.intersection,
        label: field.label,
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
    watchCar,
    stopWatching,
    world,
    grid,
    cars,
    roads,
    intersections,
    setSignalColors,
    recordData,
    setCarColor,
    setCarSpeed,
    nextField,
    updateCurrent,
    setSignals,
    nextPhase,
    go,
  };
}

export const model = {
  title: "Traffic Grid Goal",
  inputs,
  create,
  description:
    "Local destination-seeking cars with source-specific signal and following rules. Wilensky (2008), CC BY-NC-SA 3.0.",
} satisfies Definition<TrafficParameters, ReturnType<typeof create>>;
