/** Shared source-specific Traffic Grid procedures; Goal preserves its original quirks. */
import { Agent, Grid, Random, World, geometry, run } from 'city-library';
import type { Field, Position } from 'city-library';
import type { Inputs } from '../definition.ts';
import { parameters, stepCount } from '../parameters.ts';

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
  seed: { kind: 'number', default: 1, integer: true },
  gridSizeX: { kind: 'number', default: 5, min: 1, max: 9, integer: true },
  gridSizeY: { kind: 'number', default: 5, min: 1, max: 9, integer: true },
  numCars: { kind: 'number', default: 200, min: 1, max: 400, integer: true },
  speedLimit: { kind: 'number', default: 1, min: 0.1, max: 1 },
  ticksPerCycle: { kind: 'number', default: 20, min: 1, max: 100, integer: true },
  currentPhase: { kind: 'number', default: 0, min: 0, max: 99, integer: true },
  currentAuto: { kind: 'boolean', default: true },
  power: { kind: 'boolean', default: true },
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
  house: Patch | null;
  work: Patch | null;
  goal: Patch | null;
}>;

export function createGridTraffic(options: Partial<TrafficParameters> = {}, goalMode = false) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ x: 37, y: 37, boundary: 'wrap' }, { random });
  const grid = Grid.add({ x: 37, y: 37, boundary: 'wrap' }, {
    state: { road: false, intersection: false, greenLightUp: true, row: -1,
      column: -1, phase: -1, auto: false, color: '#9b7653', label: '' },
  });
  world.add(grid);
  const cars = () => world.agents as readonly Car[];
  const patchId = (patch: Patch) => `${patch.x},${patch.y}`;
  const carId = (car: Car) => `car-${car.who}`;
  const shuffled = <T>(items: readonly T[]) => random.sample(items, { count: items.length });
  const choose = <T>(items: readonly T[]): T => {
    if (!items.length) throw new Error('The original model requested one-of an empty agentset.');
    return items[Math.floor(random.number() * items.length)]!;
  };
  const xIncrement = 37 / settings.gridSizeX;
  const yIncrement = 37 / settings.gridSizeY;
  const modulo = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;
  const vertical = (x: number) => Math.floor(modulo(x + 18 - Math.floor(xIncrement - 1), xIncrement)) === 0;
  const horizontal = (y: number) => Math.floor(modulo(y + 18, yIncrement)) === 0;
  for (const patch of grid.fields) {
    patch.road = vertical(patch.x) || horizontal(patch.y);
    patch.intersection = vertical(patch.x) && horizontal(patch.y);
    if (patch.road) patch.color = '#ffffff';
    if (patch.intersection) {
      patch.phase = 0;
      patch.auto = true;
      patch.row = Math.floor((patch.y + 18) / yIncrement);
      patch.column = Math.floor((patch.x + 18) / xIncrement);
    }
  }
  const roads = grid.fields.filter(patch => patch.road);
  const intersections = grid.fields.filter(patch => patch.intersection);
  let current = choose(intersections);
  let phase = 0;
  let numCarsStopped = 0;
  let watched: Car | null = null;
  const history: { tick: number; numCarsStopped: number; meanSpeed: number; meanWait: number }[] = [];

  function setSignalColors(patch: Patch) {
    grid.fieldAt({ x: patch.x - 1, y: patch.y })!.color = !settings.power ? '#ffffff'
      : patch.greenLightUp ? '#e33131' : '#30b949';
    grid.fieldAt({ x: patch.x, y: patch.y + 1 })!.color = !settings.power ? '#ffffff'
      : patch.greenLightUp ? '#30b949' : '#e33131';
  }
  for (const patch of shuffled(intersections)) setSignalColors(patch);
  grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = 'current';
  settings = parameters(inputs, { ...settings, currentPhase: current.phase, currentAuto: current.auto });
  if (settings.numCars > roads.length) throw new RangeError('Too many cars for the amount of road; setup stopped.');
  const goalCandidates = grid.fields.filter(patch => patch.color === '#9b7653'
    && grid.neighbors(patch, { neighborhood: 'moore' }).some(other => other.color === '#ffffff'));

  function recordData(car: Car) {
    if (car.speed === 0) {
      numCarsStopped++;
      car.waitTime++;
    } else car.waitTime = 0;
  }
  function setCarColor(car: Car) {
    car.color = car.speed < settings.speedLimit / 2 ? '#355bd5' : '#258b9b';
  }
  function setCarSpeed(car: Car) {
    const here = grid.fieldAt(car)!;
    if (here.color === '#e33131') {
      car.speed = 0;
      return;
    }
    // Goal deliberately retains this setup direction even after changing heading.
    const ahead = grid.fieldAt({ x: here.x + (car.upCar ? 0 : 1), y: here.y + (car.upCar ? -1 : 0) })!;
    const blockers = grid.agentsAt(ahead, { source: cars() });
    if (blockers.length) {
      if (blockers.some(other => other.upCar !== car.upCar)) car.speed = 0;
      else {
        car.speed = choose(blockers).speed;
        car.speed = car.speed <= 0 ? 0 : car.speed - 0.099;
      }
    } else car.speed = car.speed > settings.speedLimit ? settings.speedLimit : car.speed + 0.099;
  }
  for (let who = 0; who < settings.numCars; who++) {
    const location = choose(roads.filter(patch => grid.agentsAt(patch).length === 0));
    const upCar = location.intersection ? random.number() < 0.5 : vertical(location.x);
    const car = Agent.add({ who, speed: 0, upCar, waitTime: 0, color: '#355bd5', size: 1,
      label: '', house: null as Patch | null, work: null as Patch | null, goal: null as Patch | null },
      { position: location, orientation: { heading: upCar ? 180 : 90 } });
    world.add(car);
    setCarColor(car);
    recordData(car);
    if (goalMode) {
      car.house = choose(goalCandidates);
      car.work = choose(goalCandidates.filter(patch => patch !== car.house));
      car.goal = car.work;
    }
  }
  for (const car of shuffled(cars())) setCarSpeed(car);

  function nextPatch(car: Car) {
    const here = grid.fieldAt(car)!;
    if (car.goal === car.house && grid.neighbors(car.house!, { neighborhood: 'faces' }).includes(here)) car.goal = car.work;
    if (car.goal === car.work && grid.neighbors(car.work!, { neighborhood: 'faces' }).includes(here)) car.goal = car.house;
    const choices = grid.neighbors(here, { neighborhood: 'moore' }).filter(patch =>
      ['#ffffff', '#e33131', '#30b949'].includes(patch.color));
    const distances = choices.map(patch => geometry.distance(patch, car.goal!, { space: world.space! }));
    const minimum = Math.min(...distances);
    return choose(choices.filter((_, index) => distances[index] === minimum));
  }
  function updateCurrent() {
    current.phase = settings.currentPhase;
    current.auto = settings.currentAuto;
  }
  function go() {
    updateCurrent();
    for (const patch of shuffled(intersections.filter(patch => patch.auto
      && phase === Math.floor(patch.phase * settings.ticksPerCycle / 100)))) {
      patch.greenLightUp = !patch.greenLightUp;
      setSignalColors(patch);
    }
    numCarsStopped = 0;
    for (const car of shuffled(cars())) {
      if (goalMode) car.rotate({ towards: nextPatch(car) });
      setCarSpeed(car);
      car.move(car.speed);
      recordData(car);
      setCarColor(car);
    }
    if (watched) watched.label = watched.goal === watched.house ? 'house' : 'work';
    phase++;
    if (phase % settings.ticksPerCycle === 0) phase = 0;
  }
  function record() {
    history.push({ tick: world.tick.value, numCarsStopped,
      meanSpeed: cars().reduce((sum, car) => sum + car.speed, 0) / cars().length,
      meanWait: cars().reduce((sum, car) => sum + car.waitTime, 0) / cars().length });
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
    let selected: Patch | undefined;
    if (goalMode) {
      const distances = intersections.map(patch => geometry.distance(patch, point, { space: world.space! }));
      const minimum = Math.min(...distances);
      selected = choose(intersections.filter((_, index) => distances[index] === minimum));
    } else {
      const patch = grid.fieldAt(point);
      if (patch?.intersection) selected = patch;
    }
    if (!selected) return false;
    updateCurrent();
    grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = '';
    current = selected;
    settings = parameters(inputs, { ...settings, currentPhase: current.phase, currentAuto: current.auto });
    grid.fieldAt({ x: current.x - 1, y: current.y + 1 })!.label = 'current';
    return true;
  }
  function changeLight() {
    current.greenLightUp = !current.greenLightUp;
    setSignalColors(current);
  }
  function stopWatching() {
    for (const patch of grid.fields) {
      if (patch.color === '#f5db33' || patch.color === '#ee8b24') {
        patch.color = '#9b7653';
        patch.label = '';
      }
    }
    for (const car of cars()) car.label = '';
    watched = null;
  }
  function watchCar(id?: string) {
    if (!goalMode) return;
    stopWatching();
    const car = id === undefined ? choose(cars()) : cars().find(car => carId(car) === id);
    if (!car) throw new RangeError('Unknown car.');
    watched = car;
    car.size = 2;
    car.house!.color = '#f5db33';
    car.house!.label = 'house';
    car.work!.color = '#ee8b24';
    car.work!.label = 'work';
    car.label = car.goal!.label;
  }
  function setParameters(values: Partial<TrafficParameters>) {
    if (Reflect.ownKeys(values).some(key => ['seed', 'gridSizeX', 'gridSizeY', 'numCars'].includes(String(key)))) {
      throw new TypeError('Seed, grid dimensions and population are setup-only.');
    }
    settings = parameters(inputs, { ...settings, ...values });
  }
  function snapshot() {
    return {
      tick: world.tick.value, width: 37, height: 37, parameters: { ...settings }, phase,
      numCarsStopped, currentIntersectionId: patchId(current), watchedCarId: watched ? carId(watched) : null,
      cars: cars().map(car => ({ id: carId(car), x: car.x, y: car.y, heading: car.heading,
        speed: car.speed, upCar: car.upCar, waitTime: car.waitTime, color: car.color,
        size: car.size, label: car.label, houseId: car.house ? patchId(car.house) : null,
        workId: car.work ? patchId(car.work) : null, goalId: car.goal ? patchId(car.goal) : null })),
      intersections: intersections.map(patch => ({ id: patchId(patch), x: patch.x, y: patch.y,
        greenLightUp: patch.greenLightUp, auto: patch.auto, phase: patch.phase, row: patch.row, column: patch.column })),
      cells: grid.fields.map(patch => ({ id: patchId(patch), x: patch.x, y: patch.y, color: patch.color,
        road: patch.road, intersection: patch.intersection, label: patch.label })),
      history: history.map(sample => ({ ...sample })),
    };
  }
  record();
  return {
    step, advance: step, snapshot, read: snapshot, setParameters,
    selectIntersection, changeLight, watchCar, stopWatching,
    world, grid, cars, roads, intersections,
    setSignalColors, recordData, setCarColor, setCarSpeed,
    nextPatch, updateCurrent, go,
  };
}
