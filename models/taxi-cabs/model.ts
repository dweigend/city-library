/** NetLogo Taxi Cabs, Dongping and Wilensky (2019), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Field } from "city-library";
import type { Definition } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
import { inputs } from "./parameters.ts";
import type {
  DemandKey,
  DemandPhase,
  TaxiParameters,
  Zone,
} from "./parameters.ts";
export { inputs };
export type { TaxiParameters, DemandKey, DemandPhase, Zone };

interface FieldState {
  road: boolean;
  intersection: boolean;
  trafficLight: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  directionCount: number;
  greenLightUp: boolean;
  zone: Zone;
  color: string;
}
type ModelField = Field<FieldState>;
type Cab = Agent<{
  group: "cab";
  who: number;
  vacancy: boolean;
  prevIntersection: number;
  onboardPassengerCount: number;
  totalDistanceMiles: number;
  businessDistanceMiles: number;
  deadheadDistanceMiles: number;
  currentTripFieldCount: number;
  tripDistances: number[];
  totalTripCount: number;
  totalIncome: number;
  currentTripIncome: number;
  tripIncomes: number[];
  tickAtPickup: number;
  currentTripDuration: number;
  tripDurations: number[];
  pickupOnHorizontal: boolean;
  pickupOnVertical: boolean;
  destinationX: number;
  destinationX2: number;
  destinationY: number;
  destinationY2: number;
  pickupX: number;
  pickupY: number;
  color: string;
}>;
type Passenger = Agent<{
  group: "passenger";
  who: number;
  patienceToWait: number;
  beenWaiting: number;
  destination: ModelField | null;
  destinationX: number;
  destinationY: number;
  waitingPassengerCount: number;
}>;

export function create(options: Partial<TaxiParameters> = {}) {
  // One step updates lights/demand/waiting, then samples cabs for pickup and travel.
  // step/advance commits World time before history; read/snapshot derives observations.
  // Public rule and procedure actions below operate on this same canonical state.
  function go() {
    startTrafficLight();
    reportCurrentPhase();
    taxiDemandAtField();
    passengersWaitForRide();
    for (const cab of shuffled(cabs())) {
      pickupPassengers(cab);
      if (cab.vacancy) taxicabMoveRandom(cab);
      else taxicabMoveDeliver(cab);
    }
  }
  function step(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      run(world, go);
      record();
    }
    return count;
  }

  // Rules, demand phase and history belong here; World/Grid own agents and road fields.
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 65, y: 65, boundary: "wrap" }, { random });
  const grid = Grid.create(
    { x: 65, y: 65, boundary: "wrap" },
    {
      state: {
        road: false,
        intersection: false,
        trafficLight: false,
        left: false,
        right: false,
        up: false,
        down: false,
        directionCount: 0,
        greenLightUp: false,
        zone: "res" as Zone,
        color: "#cfcfcf",
      },
    },
  );
  world.add(grid);
  const cabs = () =>
    world.agents.filter(
      (agent) => (agent as Cab | Passenger).group === "cab",
    ) as Cab[];
  const passengers = () =>
    world.agents.filter(
      (agent) => (agent as Cab | Passenger).group === "passenger",
    ) as Passenger[];
  const fieldId = (field: ModelField) => `${field.x},${field.y}`;
  const cabId = (cab: Cab) => `cab-${cab.who}`;
  const shuffled = <T>(items: readonly T[]) =>
    random.sample(items, { count: items.length });
  function choose<T>(items: readonly T[]): T {
    if (!items.length)
      throw new Error("The original model requested an empty road agentset.");
    return items[Math.floor(random.number() * items.length)]!;
  }
  const full = (items: readonly number[]) => [
    ...items.map((value) => -value),
    ...items,
  ];
  const roadIndices = full([3, 4, 10, 11, 17, 18, 24, 25, 31, 32]);
  const rightIndices = [
    ...[3, 10, 17, 24, 31],
    ...[3, 10, 17, 24, 31].map((value) => -(value + 1)),
  ];
  const leftIndices = [
    ...[4, 11, 18, 25, 32],
    ...[4, 11, 18, 25, 32].map((value) => -(value - 1)),
  ];
  const lightIndices = full([2, 5, 9, 12, 16, 19, 23, 26, 30]);
  for (const field of grid.fields) {
    if (Math.abs(field.x) < 12 && Math.abs(field.y) < 12) {
      field.zone = "cbd";
      field.color = "#ffbc79";
    } else if (Math.abs(field.x) < 26 && Math.abs(field.y) < 26) {
      field.zone = "com";
      field.color = "#a2c8ec";
    }
    field.road = roadIndices.includes(field.x) || roadIndices.includes(field.y);
    field.intersection =
      roadIndices.includes(field.x) && roadIndices.includes(field.y);
    if (!field.road) continue;
    field.color = "#000000";
    field.trafficLight =
      lightIndices.includes(field.x) || lightIndices.includes(field.y);
    field.right = rightIndices.includes(field.y);
    field.left = leftIndices.includes(field.y);
    field.up = leftIndices.includes(field.x);
    field.down = rightIndices.includes(field.x);
    if (field.y === 32) field.up = false;
    if (field.y === -32) field.down = false;
    if (field.x === 32) field.right = false;
    if (field.x === -32) field.left = false;
    if (field.x === -31 && field.y === 32) {
      field.up = false;
      field.left = true;
    }
    if (field.x === -32 && field.y === -31) {
      field.left = false;
      field.down = true;
    }
    if (field.x === 32 && field.y === 31) {
      field.right = false;
      field.up = true;
    }
    if (field.x === 31 && field.y === -32) {
      field.down = false;
      field.right = true;
    }
    field.directionCount =
      Number(field.up) +
      Number(field.down) +
      Number(field.left) +
      Number(field.right);
  }
  const roads = grid.fields.filter((field) => field.road);
  const lights = roads.filter((field) => field.trafficLight);
  // The source reassigns these sets after an earlier, reversed assignment.
  const rowLights = lights.filter((field) => lightIndices.includes(field.x));
  const columnLights = lights.filter((field) => lightIndices.includes(field.y));
  for (const field of rowLights) field.color = "#30b949";
  for (const field of columnLights) field.color = "#e33131";
  for (const field of lights) field.greenLightUp = field.color === "#30b949";
  let rowGreen = true;
  let columnGreen = false;
  let phaseCounter = 1;
  const phases = [
    "AM Peak",
    "Midday",
    "PM Peak",
    "Evening",
    "Early Morning",
  ] as const;
  const phaseAbbreviations: readonly DemandPhase[] = [
    "AM",
    "MD",
    "PM",
    "EVE",
    "EM",
  ];
  let currentPhase: (typeof phases)[number] = "AM Peak";
  let currentPhaseAbbreviation: DemandPhase = "AM";
  let passengerWho = 0;
  const history: {
    tick: number;
    totalMiles: number;
    businessMiles: number;
    deadMiles: number;
    waitingPassengers: number;
    occupiedCabs: number;
    totalIncome: number;
  }[] = [];

  function setHeading(cab: Cab, heading: number) {
    cab.rotate(heading - cab.heading);
  }
  function setupCabs() {
    for (let who = 0; who < settings.taxicabCount; who++) {
      const field = choose(
        roads.filter(
          (field) => grid.agentsAt(field, { source: cabs() }).length === 0,
        ),
      );
      const cab = Agent.create(
        {
          group: "cab" as const,
          who,
          vacancy: true,
          prevIntersection: 0,
          onboardPassengerCount: 0,
          totalDistanceMiles: 0,
          businessDistanceMiles: 0,
          deadheadDistanceMiles: 0,
          currentTripFieldCount: 0,
          tripDistances: [] as number[],
          totalTripCount: 0,
          totalIncome: 0,
          currentTripIncome: 0,
          tripIncomes: [] as number[],
          tickAtPickup: 0,
          currentTripDuration: 0,
          tripDurations: [] as number[],
          pickupOnHorizontal: false,
          pickupOnVertical: false,
          destinationX: 0,
          destinationX2: 0,
          destinationY: 0,
          destinationY2: 0,
          pickupX: 0,
          pickupY: 0,
          color: "#f5db33",
        },
        { position: field },
      );
      world.add(cab);
      if (field.up && field.right)
        setHeading(cab, Math.floor(random.number() * 100) > 50 ? 0 : 90);
      else if (field.up && field.left)
        setHeading(cab, Math.floor(random.number() * 100) > 50 ? 0 : 270);
      else if (field.down && field.right)
        setHeading(cab, Math.floor(random.number() * 100) > 50 ? 180 : 90);
      else if (field.down && field.left)
        setHeading(cab, Math.floor(random.number() * 100) > 50 ? 180 : 270);
      else if (field.up) setHeading(cab, 0);
      else if (field.down) setHeading(cab, 180);
      else if (field.left) setHeading(cab, 270);
      else if (field.right) setHeading(cab, 90);
    }
  }
  setupCabs();

  function changeTrafficLightColors() {
    if (rowGreen) {
      for (const field of rowLights) field.color = "#30b949";
      for (const field of columnLights) field.color = "#e33131";
    }
    if (columnGreen) {
      for (const field of rowLights) field.color = "#e33131";
      for (const field of columnLights) field.color = "#30b949";
    }
  }
  function startTrafficLight() {
    // Source asks each set and repeatedly writes the globals; all ordinary members agree.
    for (const field of shuffled(rowLights))
      rowGreen = field.color === "#30b949";
    for (const field of shuffled(columnLights))
      columnGreen = field.color === "#30b949";
    changeTrafficLightColors();
    if (settings.lengthOfGreenLight === 0)
      throw new RangeError(
        "Green-light duration must be greater than zero.",
      );
    if (world.tick.value % settings.lengthOfGreenLight === 0) {
      rowGreen = !rowGreen;
      columnGreen = !rowGreen;
      changeTrafficLightColors();
    }
    for (const field of lights) field.greenLightUp = field.color === "#30b949";
  }
  function reportCurrentPhase() {
    if (phaseCounter > 4) phaseCounter = 0;
    if (
      world.tick.value >= settings.lengthOfTimePeriod &&
      world.tick.value % settings.lengthOfTimePeriod === 0
    ) {
      currentPhase = phases[phaseCounter]!;
      currentPhaseAbbreviation = phaseAbbreviations[phaseCounter]!;
      phaseCounter++;
    }
  }
  const pickupRoads = (zone: Zone) =>
    roads.filter((field) => field.zone === zone && !field.intersection);
  const dropoffRoads = (zone: Zone) =>
    roads.filter(
      (field) =>
        field.zone === zone && !field.intersection && !field.trafficLight,
    );
  const pickupByZone = {
    cbd: pickupRoads("cbd"),
    com: pickupRoads("com"),
    res: pickupRoads("res"),
  };
  const dropoffByZone = {
    cbd: dropoffRoads("cbd"),
    com: dropoffRoads("com"),
    res: dropoffRoads("res"),
  };
  function generateDemand(origin: Zone, destination: Zone) {
    const key: DemandKey = `prob-${origin}-${destination}-${currentPhaseAbbreviation}`;
    if (random.number() >= settings[key]) return;
    const field = choose(pickupByZone[origin]);
    const destinationField = choose(dropoffByZone[destination]);
    const passenger = Agent.create(
      {
        group: "passenger" as const,
        who: passengerWho++,
        patienceToWait: random.number({
          distribution: "normal",
          mean: settings.waitTimeMean,
          deviation: settings.waitTimeSd,
        }),
        beenWaiting: 0,
        destination: null as ModelField | null,
        destinationX: destinationField.x,
        destinationY: destinationField.y,
        waitingPassengerCount: 1 + Math.floor(random.number() * 4),
      },
      { position: field },
    );
    passenger.destination = destinationField;
    world.add(passenger);
  }
  function taxiDemandAtField() {
    // Executed source key→zone pairs, including misleading source comments, are preserved.
    generateDemand("cbd", "cbd");
    generateDemand("cbd", "com");
    generateDemand("cbd", "res");
    generateDemand("com", "com");
    generateDemand("com", "cbd");
    generateDemand("com", "res");
    generateDemand("res", "res");
    generateDemand("res", "cbd");
    generateDemand("res", "com");
  }
  function passengersWaitForRide() {
    for (const passenger of shuffled(passengers())) {
      passenger.beenWaiting++;
      if (passenger.beenWaiting >= passenger.patienceToWait) passenger.delete();
    }
  }
  function updateDeliveryAndIncome(cab: Cab) {
    cab.totalDistanceMiles++;
    if (cab.vacancy) cab.deadheadDistanceMiles++;
    else {
      cab.businessDistanceMiles++;
      cab.currentTripFieldCount++;
      cab.currentTripIncome += settings.eachGridCost + settings.eachTickCost;
      cab.currentTripDuration = world.tick.value - cab.tickAtPickup;
    }
  }
  function stopForRedElseGo(cab: Cab) {
    const here = grid.fieldAt(cab)!;
    const direction =
      cab.heading === 0
        ? { x: 0, y: 1 }
        : cab.heading === 90
          ? { x: 1, y: 0 }
          : cab.heading === 180
            ? { x: 0, y: -1 }
            : { x: -1, y: 0 };
    const ahead = grid.fieldAt({
      x: cab.x + direction.x,
      y: cab.y + direction.y,
    })!;
    if (here.trafficLight && !here.greenLightUp && ahead.intersection) return;
    if (grid.agentsAt(ahead, { source: cabs() }).length === 0) {
      cab.move({ by: direction });
      updateDeliveryAndIncome(cab);
    }
  }
  function moveUp(cab: Cab) {
    setHeading(cab, 0);
    stopForRedElseGo(cab);
  }
  function moveDown(cab: Cab) {
    setHeading(cab, 180);
    stopForRedElseGo(cab);
  }
  function moveRight(cab: Cab) {
    setHeading(cab, 90);
    stopForRedElseGo(cab);
  }
  function moveLeft(cab: Cab) {
    setHeading(cab, 270);
    stopForRedElseGo(cab);
  }
  function moveStraight(cab: Cab) {
    stopForRedElseGo(cab);
  }
  function makeUTurn(cab: Cab) {
    const heading = cab.heading;
    setHeading(
      cab,
      heading === 0 ? 270 : heading === 180 ? 90 : heading === 90 ? 0 : 180,
    );
    // The source U-turn deliberately does not check red lights or occupancy.
    const direction =
      cab.heading === 0
        ? { x: 0, y: 1 }
        : cab.heading === 90
          ? { x: 1, y: 0 }
          : cab.heading === 180
            ? { x: 0, y: -1 }
            : { x: -1, y: 0 };
    cab.move({ by: direction });
    updateDeliveryAndIncome(cab);
    setHeading(cab, (heading + 180) % 360);
  }
  function updateDestinationCoordinates(cab: Cab) {
    const destination = grid.fieldAt({
      x: cab.destinationX,
      y: cab.destinationY,
    })!;
    if (destination.up || destination.down) {
      cab.destinationX2 = roadIndices.includes(cab.destinationX + 1)
        ? cab.destinationX + 1
        : cab.destinationX - 1;
      cab.destinationY2 = cab.destinationY;
    }
    if (destination.right || destination.left) {
      cab.destinationY2 = roadIndices.includes(cab.destinationY + 1)
        ? cab.destinationY + 1
        : cab.destinationY - 1;
      cab.destinationX2 = cab.destinationX;
    }
  }
  function highlightDestinationFields(cab: Cab, color: string) {
    if (cab.destinationY2 !== 0) {
      grid.fieldAt({ x: cab.destinationX, y: cab.destinationY })!.color = color;
      grid.fieldAt({ x: cab.destinationX, y: cab.destinationY2 })!.color =
        color;
    }
    if (cab.destinationX2 !== 0) {
      grid.fieldAt({ x: cab.destinationX, y: cab.destinationY })!.color = color;
      grid.fieldAt({ x: cab.destinationX2, y: cab.destinationY })!.color =
        color;
    }
  }
  function deliveryRelation(cab: Cab) {
    return {
      top: cab.y > cab.destinationY && cab.y > cab.destinationY2,
      bottom: cab.y < cab.destinationY && cab.y < cab.destinationY2,
      right: cab.x > cab.destinationX && cab.x > cab.destinationX2,
      left: cab.x < cab.destinationX && cab.x < cab.destinationX2,
      sameX: cab.x === cab.destinationX || cab.x === cab.destinationX2,
      sameY: cab.y === cab.destinationY || cab.y === cab.destinationY2,
      up: cab.heading === 0,
      east: cab.heading === 90,
      down: cab.heading === 180,
      west: cab.heading === 270,
    };
  }
  function changeDirectionForDelivery(cab: Cab) {
    const relation = deliveryRelation(cab);
    if (relation.sameX && relation.top) {
      if (relation.up) makeUTurn(cab);
    } else if (relation.sameX && relation.bottom) {
      if (relation.down) makeUTurn(cab);
    } else if (relation.sameY && relation.right) {
      if (relation.east) makeUTurn(cab);
    } else if (relation.sameY && relation.left) {
      if (relation.west) makeUTurn(cab);
    } else if (relation.top && relation.right) {
      if (relation.up || relation.east) makeUTurn(cab);
    } else if (relation.top && relation.left) {
      if (relation.up || relation.west) makeUTurn(cab);
    } else if (relation.bottom && relation.right) {
      if (relation.down || relation.east) makeUTurn(cab);
    } else if (relation.bottom && relation.left) {
      if (relation.down || relation.west) makeUTurn(cab);
    }
  }
  function pickupPassengers(cab: Cab) {
    if (!cab.vacancy) return;
    const waiting = grid.agentsAt(grid.fieldAt(cab)!, { source: passengers() });
    if (!waiting.length) return;
    const passenger = choose(waiting);
    cab.vacancy = false;
    cab.color = "#b749d4";
    cab.onboardPassengerCount = passenger.waitingPassengerCount;
    cab.currentTripIncome =
      settings.firstPassengerCost +
      (cab.onboardPassengerCount - 1) * settings.eachAdditionalPassengerCost;
    cab.tickAtPickup = world.tick.value;
    cab.pickupX = cab.x;
    cab.pickupY = cab.y;
    cab.totalTripCount++;
    cab.destinationX = passenger.destinationX;
    cab.destinationY = passenger.destinationY;
    passenger.delete();
    const here = grid.fieldAt(cab)!;
    cab.pickupOnHorizontal = here.left || here.right;
    cab.pickupOnVertical = here.up || here.down;
    updateDestinationCoordinates(cab);
    highlightDestinationFields(cab, "#b749d4");
    changeDirectionForDelivery(cab);
  }
  function taxicabMoveRandom(cab: Cab) {
    const field = grid.fieldAt(cab)!;
    if (field.directionCount === 1) {
      cab.prevIntersection = 0;
      if (field.right) moveRight(cab);
      else if (field.left) moveLeft(cab);
      else if (field.up) moveUp(cab);
      else if (field.down) moveDown(cab);
      return;
    }
    cab.prevIntersection++;
    if (field.up && field.right) {
      if (cab.prevIntersection === 2) moveRight(cab);
      else if (random.number() < 0.5) moveUp(cab);
      else moveRight(cab);
    } else if (field.up && field.left) {
      if (cab.prevIntersection === 2) moveUp(cab);
      else if (random.number() < 0.5) moveUp(cab);
      else moveLeft(cab);
    } else if (field.down && field.right) {
      if (cab.prevIntersection === 2) moveDown(cab);
      else if (random.number() < 0.5) moveDown(cab);
      else moveRight(cab);
    } else if (field.down && field.left) {
      if (cab.prevIntersection === 2) moveLeft(cab);
      else if (random.number() < 0.5) moveDown(cab);
      else moveLeft(cab);
    }
  }
  function resetCabAfterTrip(cab: Cab) {
    cab.vacancy = true;
    cab.color = "#f5db33";
    cab.onboardPassengerCount = 0;
    cab.currentTripFieldCount = 0;
    cab.currentTripIncome = 0;
    cab.currentTripDuration = 0;
    highlightDestinationFields(cab, "#000000");
    cab.destinationX = 0;
    cab.destinationX2 = 0;
    cab.destinationY = 0;
    cab.destinationY2 = 0;
    // source model assigns numeric zero to these flags; false preserves subsequent conditional meaning.
    cab.pickupOnHorizontal = false;
    cab.pickupOnVertical = false;
  }
  function dropoffPassenger(cab: Cab) {
    if (
      (cab.x === cab.destinationX || cab.x === cab.destinationX2) &&
      (cab.y === cab.destinationY || cab.y === cab.destinationY2)
    ) {
      cab.totalIncome += cab.currentTripIncome;
      cab.tripDistances.push(cab.currentTripFieldCount);
      cab.tripIncomes.push(cab.currentTripIncome);
      cab.tripDurations.push(cab.currentTripDuration);
      resetCabAfterTrip(cab);
    }
  }
  function taxicabMoveDeliver(cab: Cab) {
    const relation = deliveryRelation(cab);
    const field = grid.fieldAt(cab)!;
    const dropoffVertical = cab.destinationY === cab.destinationY2;
    const dropoffHorizontal = cab.destinationX === cab.destinationX2;
    if (cab.pickupOnVertical && dropoffVertical) {
      if (relation.left) {
        if (field.right) moveRight(cab);
        else if (field.intersection && relation.down) moveDown(cab);
        else moveStraight(cab);
      } else if (relation.right) {
        if (field.left) moveLeft(cab);
        else if (field.intersection && relation.up) moveUp(cab);
        else moveStraight(cab);
      } else if (relation.sameX) {
        if (relation.top) {
          if (field.down) moveDown(cab);
          else if (relation.west) moveLeft(cab);
        } else if (relation.bottom) {
          if (field.up) moveUp(cab);
          else if (relation.east) moveRight(cab);
        }
      }
    }
    if (cab.pickupOnHorizontal && dropoffHorizontal) {
      if (relation.top) {
        if (field.down) moveDown(cab);
        else moveStraight(cab);
      } else if (relation.bottom) {
        if (field.up) moveUp(cab);
        else moveStraight(cab);
      } else if (relation.sameY) {
        if (relation.right) {
          if (field.left) moveLeft(cab);
          else if (relation.up) moveUp(cab);
        } else if (relation.left) {
          if (field.right) moveRight(cab);
          else if (relation.down) moveDown(cab);
        }
      }
    }
    if (cab.pickupOnVertical && dropoffHorizontal) {
      if (relation.top) {
        if (field.down) moveDown(cab);
        else moveStraight(cab);
      } else if (relation.bottom) {
        if (field.up) moveUp(cab);
        else moveStraight(cab);
      } else if (relation.sameY) {
        if (relation.right) {
          if (field.left) moveLeft(cab);
          else if (relation.up) moveUp(cab);
        } else if (relation.left) {
          if (field.right) moveRight(cab);
          else if (relation.down) moveDown(cab);
        }
      }
    }
    if (cab.pickupOnHorizontal && dropoffVertical) {
      if (relation.right) {
        if (field.left) moveLeft(cab);
        else moveStraight(cab);
      } else if (relation.left) {
        if (field.right) moveRight(cab);
        else moveStraight(cab);
      } else if (relation.sameX) {
        if (relation.top) {
          if (field.down) moveDown(cab);
          else if (relation.west) moveLeft(cab);
        } else if (relation.bottom) {
          if (field.up) moveUp(cab);
          else if (relation.east) moveRight(cab);
        }
      }
    }
    dropoffPassenger(cab);
  }
  function record() {
    history.push({
      tick: world.tick.value,
      totalMiles: cabs().reduce((sum, cab) => sum + cab.totalDistanceMiles, 0),
      businessMiles: cabs().reduce((sum, cab) => sum + cab.businessDistanceMiles, 0),
      deadMiles: cabs().reduce((sum, cab) => sum + cab.deadheadDistanceMiles, 0),
      waitingPassengers: passengers().length,
      occupiedCabs: cabs().filter((cab) => !cab.vacancy).length,
      totalIncome: cabs().reduce((sum, cab) => sum + cab.totalIncome, 0),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function setParameters(values: Partial<TaxiParameters>) {
    if (
      Reflect.ownKeys(values).some((key) =>
        ["seed", "taxicabCount"].includes(String(key)),
      )
    ) {
      throw new TypeError("Seed and taxi population are setup-only.");
    }
    settings = parameters(inputs, { ...settings, ...values });
  }
  function snapshot() {
    return {
      tick: world.tick.value,
      occupiedCabs: cabs().filter((cab) => !cab.vacancy).length,
      totalIncome: cabs().reduce((sum, cab) => sum + cab.totalIncome, 0),
      width: 65,
      height: 65,
      parameters: { ...settings },
      currentPhase,
      currentPhaseAbbreviation,
      phaseCounter,
      rowGreen,
      columnGreen,
      cells: grid.fields.map((field) => ({
        id: fieldId(field),
        x: field.x,
        y: field.y,
        color: field.color,
        road: field.road,
        intersection: field.intersection,
        trafficLight: field.trafficLight,
        zone: field.zone,
        left: field.left,
        right: field.right,
        up: field.up,
        down: field.down,
        greenLightUp: field.greenLightUp,
      })),
      cabs: cabs().map((cab) => ({
        id: cabId(cab),
        x: cab.x,
        y: cab.y,
        heading: cab.heading,
        color: cab.color,
        vacancy: cab.vacancy,
        onboardPassengerCount: cab.onboardPassengerCount,
        totalDistanceMiles: cab.totalDistanceMiles,
        businessDistanceMiles: cab.businessDistanceMiles,
        deadheadDistanceMiles: cab.deadheadDistanceMiles,
        totalTripCount: cab.totalTripCount,
        totalIncome: cab.totalIncome,
        currentTripIncome: cab.currentTripIncome,
        currentTripDuration: cab.currentTripDuration,
        currentTripFieldCount: cab.currentTripFieldCount,
        destinationX: cab.destinationX,
        destinationX2: cab.destinationX2,
        destinationY: cab.destinationY,
        destinationY2: cab.destinationY2,
        pickupOnHorizontal: cab.pickupOnHorizontal,
        pickupOnVertical: cab.pickupOnVertical,
        tripDistances: [...cab.tripDistances],
        tripIncomes: [...cab.tripIncomes],
        tripDurations: [...cab.tripDurations],
      })),
      passengers: passengers().map((passenger) => ({
        id: `passenger-${passenger.who}`,
        x: passenger.x,
        y: passenger.y,
        beenWaiting: passenger.beenWaiting,
        patienceToWait: passenger.patienceToWait,
        destinationX: passenger.destinationX,
        destinationY: passenger.destinationY,
        waitingPassengerCount: passenger.waitingPassengerCount,
      })),
      tripDistances: cabs().flatMap((cab) => cab.tripDistances),
      tripIncomes: cabs().flatMap((cab) => cab.tripIncomes),
      tripDurations: cabs().flatMap((cab) => cab.tripDurations),
      history: history.map((sample) => ({ ...sample })),
    };
  }
  record();
  return {
    step,
    advance: step,
    snapshot,
    read: snapshot,
    setParameters,
    world,
    grid,
    cabs,
    passengers,
    startTrafficLight,
    changeTrafficLightColors,
    reportCurrentPhase,
    generateDemand,
    taxiDemandAtField,
    passengersWaitForRide,
    updateDeliveryAndIncome,
    stopForRedElseGo,
    moveUp,
    moveDown,
    moveRight,
    moveLeft,
    moveStraight,
    makeUTurn,
    updateDestinationCoordinates,
    highlightDestinationFields,
    deliveryRelation,
    changeDirectionForDelivery,
    pickupPassengers,
    taxicabMoveRandom,
    resetCabAfterTrip,
    dropoffPassenger,
    taxicabMoveDeliver,
    go,
  };
}
export const model = {
  title: "Taxi Cabs",
  inputs,
  create,
  description:
    "Zonal taxi demand, source-specific delivery branches and trip accounting. Dongping and Wilensky (2019), CC BY-NC-SA 3.0.",
} satisfies Definition<TaxiParameters, ReturnType<typeof create>>;
