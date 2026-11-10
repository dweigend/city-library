/** Synthetic elevator dispatch in seconds. Concept sources and deviations:
 * docs/research/des-elevator-sources.md; no physical or performance calibration.
 */
import { Agent, Agenda, Resource, ServiceQueue, World, run } from "city-library";
import type { EventHandle, ResourceRequest } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface ElevatorParameters {
  floorCount: number;
  elevatorCount: number;
  capacity: number;
  travelTimeSeconds: number;
  doorTimeSeconds: number;
  transferTimeSeconds: number;
  initialPassengerCount: number;
  arrivalIntervalSeconds: number;
  arrivalCountLimit: number;
  maxEventCountPerStep: number;
}
export const inputs: Inputs<ElevatorParameters> = {
  floorCount: { kind: "number", default: 6, min: 2, max: 12, integer: true },
  elevatorCount: { kind: "number", default: 2, min: 1, max: 4, integer: true },
  capacity: { kind: "number", default: 4, min: 1, max: 8, integer: true },
  travelTimeSeconds: { kind: "number", default: 2, min: 1, max: 10, integer: true },
  doorTimeSeconds: { kind: "number", default: 1, min: 0, max: 5, integer: true },
  transferTimeSeconds: { kind: "number", default: 1, min: 0, max: 5, integer: true },
  initialPassengerCount: { kind: "number", default: 6, min: 0, max: 100, integer: true },
  arrivalIntervalSeconds: { kind: "number", default: 0, min: 0, max: 60, integer: true },
  arrivalCountLimit: { kind: "number", default: 0, min: 0, max: 100, integer: true },
  maxEventCountPerStep: { kind: "number", default: 1000, min: 1, max: 100000, integer: true },
};

type Direction = -1 | 0 | 1;
type CarStatus = "idle" | "scheduled" | "moving" | "opening" | "alighting" | "boarding" | "closing";
type Passenger = Agent<{ number: number; from: number; to: number; requested: number; boarded: number; arrived: number; car: number }>;
interface FloorLine {
  floor: number;
  direction: -1 | 1;
  queue: ServiceQueue<Passenger>;
  reservedBy?: number;
}
interface Car {
  agent: Agent<{ number: number; floor: number; direction: Direction; status: CarStatus }>;
  seats: Resource<Passenger>;
  claims: Map<number, ResourceRequest<Passenger>>;
  call?: FloorLine;
}
type ElevatorEvent =
  | { kind: "visit" | "opened" | "closed"; car: number }
  | { kind: "move"; car: number; floor: number }
  | { kind: "board" | "alight"; car: number; passenger: number }
  | { kind: "request"; index: number };

export function create(options: Partial<ElevatorParameters> = {}) {
  const settings = parseParameters(inputs, options);
  if (settings.arrivalCountLimit > 0 && settings.arrivalIntervalSeconds === 0)
    throw new RangeError("Scheduled arrivals require a positive arrival interval.");
  const world = World.create();
  const agenda = Agenda.create<ElevatorEvent>();
  const pending = new Map<string, EventHandle<ElevatorEvent>>();
  const passengers: Passenger[] = [];
  const lines: FloorLine[] = [];
  for (let floor = 0; floor < settings.floorCount; floor++) {
    for (const direction of [-1, 1] as const)
      lines.push({ floor, direction, queue: ServiceQueue.create<Passenger>() });
  }
  const cars: Car[] = Array.from({ length: settings.elevatorCount }, (_, index) => ({
    agent: world.add(Agent.create({ number: index + 1, floor: 0, direction: 0 as Direction, status: "idle" as CarStatus })),
    seats: Resource.create<Passenger>({ capacity: settings.capacity }),
    claims: new Map(),
  }));
  let generatedPassengerCount = 0;
  let disposed = false;
  let finalObservation: ReturnType<typeof observe> | undefined;

  function requireActive() {
    if (disposed) throw new TypeError("The elevator model has been disposed.");
  }
  function schedule(at: number, data: ElevatorEvent) {
    const handle = agenda.add({ at, data });
    pending.set(handle.id, handle);
  }
  function lineAt(floor: number, direction: -1 | 1): FloorLine {
    return lines[floor * 2 + (direction === 1 ? 1 : 0)]!;
  }
  function oldestCall(car: Car, floor?: number): FloorLine | undefined {
    return lines.filter(line => (floor === undefined || line.floor === floor) &&
      (line.reservedBy === undefined || line.reservedBy === car.agent.number) && line.queue.entries.length > 0)
      .sort((first, second) => first.queue.entries[0]!.number - second.queue.entries[0]!.number)[0];
  }
  function reserve(car: Car, line: FloorLine) {
    line.reservedBy = car.agent.number;
    car.call = line;
  }
  function releaseCall(car: Car) {
    if (car.call?.reservedBy === car.agent.number) car.call.reservedBy = undefined;
    car.call = undefined;
  }
  function wakeIdleCars() {
    for (const car of cars) {
      if (car.agent.status !== "idle") continue;
      const call = oldestCall(car);
      if (!call) continue;
      reserve(car, call);
      car.agent.status = "scheduled";
      schedule(agenda.time, { kind: "visit", car: car.agent.number });
    }
  }
  function addPassenger(from = 0, to = settings.floorCount - 1): number {
    requireActive();
    if (!Number.isSafeInteger(from) || !Number.isSafeInteger(to) || from < 0 || to < 0 ||
        from >= settings.floorCount || to >= settings.floorCount || from === to)
      throw new RangeError("Passenger floors must be distinct integers within the building.");
    const passenger = world.add(Agent.create({ number: passengers.length + 1, from, to,
      requested: agenda.time, boarded: -1, arrived: -1, car: -1 }));
    passengers.push(passenger);
    lineAt(from, to > from ? 1 : -1).queue.add(passenger);
    wakeIdleCars();
    return passenger.number;
  }
  function deterministicRequest(index: number) {
    if (index % 2 === 0) addPassenger(0, 1 + index % (settings.floorCount - 1));
    else addPassenger(settings.floorCount - 1, index % (settings.floorCount - 1));
  }
  function beginMove(car: Car) {
    const destination = car.claims.size > 0
      ? car.claims.values().next().value!.owner.to
      : car.call?.floor;
    if (destination === undefined) {
      car.agent.status = "idle";
      car.agent.direction = 0;
      return;
    }
    if (destination === car.agent.floor) {
      visitFloor(car);
      return;
    }
    if (car.claims.size === 0) car.agent.direction = destination > car.agent.floor ? 1 : -1;
    car.agent.status = "moving";
    schedule(agenda.time + settings.travelTimeSeconds, {
      kind: "move", car: car.agent.number, floor: car.agent.floor + car.agent.direction,
    });
  }
  function visitFloor(car: Car) {
    if (car.claims.size === 0 && car.call?.floor !== car.agent.floor) {
      beginMove(car);
      return;
    }
    const mustAlight = [...car.claims.values()].some(claim => claim.owner.to === car.agent.floor);
    if (car.claims.size > 0 && !mustAlight) {
      beginMove(car);
      return;
    }
    if (car.claims.size === 0 && car.call) car.agent.direction = car.call.direction;
    car.agent.status = "opening";
    schedule(agenda.time + settings.doorTimeSeconds, { kind: "opened", car: car.agent.number });
  }
  function closeDoors(car: Car) {
    car.agent.status = "closing";
    schedule(agenda.time + settings.doorTimeSeconds, { kind: "closed", car: car.agent.number });
  }
  function reserveNextCall(car: Car) {
    if (car.claims.size > 0 || car.call?.floor === car.agent.floor) return;
    const local = oldestCall(car, car.agent.floor);
    if (local) reserve(car, local);
    else if (!car.call) {
      const next = oldestCall(car);
      if (next) reserve(car, next);
    }
  }
  function boardNext(car: Car) {
    reserveNextCall(car);
    if (car.claims.size === 0 && car.call?.floor === car.agent.floor)
      car.agent.direction = car.call.direction;
    const line = car.agent.direction === 0 ? undefined : lineAt(car.agent.floor, car.agent.direction);
    const eligible = line && (line.reservedBy === undefined || line.reservedBy === car.agent.number);
    const passenger = eligible ? line.queue.entries[0] : undefined;
    if (!passenger || car.seats.available === 0) {
      closeDoors(car);
      return;
    }
    reserve(car, line!);
    car.agent.status = "boarding";
    schedule(agenda.time + settings.transferTimeSeconds, { kind: "board", car: car.agent.number, passenger: passenger.number });
  }
  function alightNext(car: Car) {
    const claim = [...car.claims.values()].find(ticket => ticket.owner.to === car.agent.floor);
    if (!claim) { boardNext(car); return; }
    car.agent.status = "alighting";
    schedule(agenda.time + settings.transferTimeSeconds, { kind: "alight", car: car.agent.number, passenger: claim.owner.number });
  }
  function finishBoarding(car: Car, number: number) {
    const line = car.call!;
    const passenger = line.queue.entries[0];
    if (!passenger || passenger.number !== number) throw new Error("Reserved elevator queue changed unexpectedly.");
    const claim = car.seats.request({ owner: passenger });
    if (claim.status !== "granted") throw new Error("Boarding exceeded canonical car capacity.");
    line.queue.take();
    car.claims.set(number, claim);
    passenger.boarded = agenda.time;
    passenger.car = car.agent.number;
    boardNext(car);
  }
  function finishAlighting(car: Car, number: number) {
    const claim = car.claims.get(number)!;
    claim.owner.arrived = agenda.time;
    car.seats.release(claim);
    car.claims.delete(number);
    alightNext(car);
  }
  function finishClosing(car: Car) {
    if (car.call?.floor === car.agent.floor) releaseCall(car);
    if (car.claims.size === 0 && !car.call) {
      car.agent.status = "idle";
      car.agent.direction = 0;
    } else beginMove(car);
    wakeIdleCars();
  }
  function dispatch(event: ElevatorEvent) {
    if (event.kind === "request") {
      deterministicRequest(event.index);
      generatedPassengerCount++;
      return;
    }
    const car = cars[event.car - 1]!;
    switch (event.kind) {
      case "visit": visitFloor(car); break;
      case "move": car.agent.floor = event.floor; visitFloor(car); break;
      case "opened": alightNext(car); break;
      case "board": finishBoarding(car, event.passenger); break;
      case "alight": finishAlighting(car, event.passenger); break;
      case "closed": finishClosing(car); break;
    }
  }
  function observe() {
    const boarded = passengers.filter(passenger => passenger.boarded >= 0);
    const arrived = passengers.filter(passenger => passenger.arrived >= 0);
    const waitingPassengerCount = lines.reduce((sum, line) => sum + line.queue.entries.length, 0);
    const ridingPassengerCount = cars.reduce((sum, car) => sum + car.seats.used, 0);
    return {
      parameters: { ...settings }, time: agenda.time, tick: world.tick.value,
      createdPassengerCount: passengers.length, waitingPassengerCount: waitingPassengerCount, ridingPassengerCount: ridingPassengerCount, arrivedPassengerCount: arrived.length, generatedPassengerCount: generatedPassengerCount,
      meanWaitSeconds: boarded.length ? boarded.reduce((sum, passenger) => sum + passenger.boarded - passenger.requested, 0) / boarded.length : 0,
      meanRideSeconds: arrived.length ? arrived.reduce((sum, passenger) => sum + passenger.arrived - passenger.boarded, 0) / arrived.length : 0,
      meanSystemSeconds: arrived.length ? arrived.reduce((sum, passenger) => sum + passenger.arrived - passenger.requested, 0) / arrived.length : 0,
      pendingEventCount: agenda.size,
      cars: cars.map(car => ({ id: car.agent.id, number: car.agent.number, floor: car.agent.floor,
        direction: car.agent.direction, status: car.agent.status, used: car.seats.used,
        capacity: car.seats.capacity, passengers: [...car.claims.keys()] })),
      passengers: passengers.map(passenger => ({ id: passenger.id, number: passenger.number,
        from: passenger.from, to: passenger.to, requested: passenger.requested, boarded: passenger.boarded,
        arrived: passenger.arrived, car: passenger.car,
        status: passenger.arrived >= 0 ? "arrived" : passenger.boarded >= 0 ? "riding" : "waiting" })),
      floorQueues: lines.map(line => ({ floor: line.floor, direction: line.direction,
        passengers: line.queue.entries.map(passenger => passenger.number) })),
    };
  }

  for (let index = 0; index < settings.initialPassengerCount; index++) deterministicRequest(index);
  for (let index = 0; index < settings.arrivalCountLimit; index++) {
    schedule((index + 1) * settings.arrivalIntervalSeconds, {
      kind: "request", index: settings.initialPassengerCount + index,
    });
  }
  return {
    addPassenger,
    advance(stepCount = 1) {
      requireActive();
      validateStepCount(stepCount);
      run(world, () => {
        const until = agenda.time + 1;
        for (let count = 0; ; count++) {
          if (count >= settings.maxEventCountPerStep) throw new RangeError("Elevator event budget exhausted.");
          const event = agenda.next({ until });
          if (!event) break;
          pending.delete(event.id);
          dispatch(event.data);
        }
      }, stepCount);
    },
    read() { return structuredClone(finalObservation ?? observe()); },
    dispose() {
      if (disposed) return;
      finalObservation = observe();
      finalObservation.pendingEventCount = 0;
      disposed = true;
      for (const handle of pending.values()) agenda.delete(handle);
      pending.clear();
      for (const line of lines) while (line.queue.entries.length) line.queue.take();
      for (const car of cars) {
        for (const claim of car.claims.values()) car.seats.release(claim);
        car.claims.clear();
        releaseCall(car);
      }
      for (const passenger of passengers) passenger.delete();
      for (const car of cars) car.agent.delete();
    },
  };
}

export const model = {
  title: "Elevator Service", description: "Two elevator cars pick up passengers waiting on six floors, with limited room per car.",
  inputs, create,
} satisfies Definition<ElevatorParameters, ReturnType<typeof create>>;
