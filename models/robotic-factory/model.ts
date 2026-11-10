/** Martin & Wilensky (2021), CC BY-NC-SA 3.0; native order and source defects preserved. */
import { Agent, Grid, Random, World, run, geometry, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type MachineKind =
  | "cutter"
  | "stitcher"
  | "finisher"
  | "storage"
  | "robot-room"
  | "loading-dock";
export type FactoryKind = MachineKind | "robot" | "order";
export interface FactoryParameters {
  seed: number;
  numberOfRobots: number;
  fullCharge: number;
  justInTimeSupplyRobot: number;
  showAgentName: boolean;
  makeTrails: boolean;
}
export const inputs: Inputs<FactoryParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numberOfRobots: {
    kind: "number",
    default: 5,
    min: 3,
    max: 20,
    integer: true,
  },
  fullCharge: { kind: "number", default: 350, min: 0, max: 1000, integer: true },
  justInTimeSupplyRobot: { kind: "number", default: 150, min: 0, max: 300, integer: true },
  showAgentName: { kind: "boolean", default: true },
  makeTrails: { kind: "boolean", default: true },
};
interface EntityState {
  sourceId: number;
  kind: FactoryKind;
  product: number;
  supply: number;
  agentsPresent: number;
  energy: number;
  laden: boolean;
  destination: Entity | null;
  idleness: number;
  productType: string | number;
  deluxeLevel: number;
  buildCounter: number;
  queuedSupply: number;
  processingOrder: boolean;
  typeOfOrder: number;
  label: string;
  penDown: boolean;
}
type Entity = Agent<EntityState>;
export interface EntitySnapshot {
  id: number;
  kind: FactoryKind;
  x: number;
  y: number;
  heading: number;
  product: number;
  supply: number;
  agentsPresent: number;
  energy: number;
  laden: boolean;
  destination: number | null;
  idleness: number;
  productType: string | number;
  deluxeLevel: number;
  buildCounter: number;
  queuedSupply: number;
  processingOrder: boolean;
  typeOfOrder: number;
  label: string;
  penDown: boolean;
}
export function create(options: Partial<FactoryParameters> = {}) {
  let settings = parameters(inputs, options);
  const space = { x: 33, y: 33, boundary: "hard" as const },
    random = Random.create({ seed: settings.seed }),
    world = World.create(space, { random }),
    grid = Grid.create(space);
  world.add(grid);
  let entities: Entity[] = [],
    nextId = 0,
    diagnostic: string | null = null;
  const trails: {
    from: {
      x: number;
      y: number;
    };
    to: {
      x: number;
      y: number;
    };
    id: number;
  }[] = [];
  const history: {
    tick: number;
    idle: number;
    orders: number;
    deluxe: number;
    standard: number;
    cutters: number;
    stitchers: number;
    finishers: number;
    dock: number;
    stored: number;
  }[] = [];
  function make(
    kind: FactoryKind,
    x: number,
    y: number,
    initial: Partial<EntityState> = {},
  ) {
    const a = world.add(
      Agent.create<EntityState>(
        {
          sourceId: nextId++,
          kind,
          product: 0,
          supply: 0,
          agentsPresent: 0,
          energy: 0,
          laden: false,
          destination: null,
          idleness: 0,
          productType: 0,
          deluxeLevel: 0,
          buildCounter: 0,
          queuedSupply: 0,
          processingOrder: false,
          typeOfOrder: 0,
          label: "",
          penDown: false,
          ...initial,
        },
        {
          position: { x, y },
          orientation: { heading: Math.floor(random.number() * 360) },
        },
      ),
    );
    entities.push(a);
    return a;
  }
  const of = (kind: FactoryKind) => entities.filter((a) => a.kind === kind);
  const shuffle = (items: readonly Entity[]) =>
    random.sample(items, {
      count: items.length,
      algorithm: "fisher-yates-descending",
    });
  function one(items: readonly Entity[]) {
    return items.length
      ? items[Math.floor(random.number() * items.length)]!
      : null;
  }
  function here(a: Entity, kind?: FactoryKind) {
    const field = grid.fieldAt(a)!;
    return (grid.agentsAt(field) as readonly Entity[]).filter(
      (b) => kind === undefined || b.kind === kind,
    );
  }
  function requireChoice(a: Entity | null): Entity {
    if (!a || !a.alive)
      throw new Error("Native destination is nobody; OF expected an agent.");
    return a;
  }
  function moveRobot(robot: Entity) {
    const d = geometry.direction({ heading: robot.heading }),
      x = robot.x + d.x,
      y = robot.y + d.y;
    if (geometry.normalize({ x, y }, { space, endpoints: "half-open" })) {
      const from = { x: robot.x, y: robot.y };
      robot.move(1);
      robot.rotate({ towards: requireChoice(robot.destination) });
      if (robot.penDown)
        trails.push({
          from,
          to: { x: robot.x, y: robot.y },
          id: robot.sourceId,
        });
    }
    if (robot.product > 0) {
      robot.laden = true;
      robot.energy -= 2;
    } else {
      robot.laden = false;
      robot.energy--;
      robot.idleness++;
    }
  }
  function finish() {
    for (const f of shuffle(of("finisher"))) {
      if (f.supply > 0) {
        f.queuedSupply++;
        f.supply--;
      }
      if (f.queuedSupply > 1 && !f.processingOrder && f.buildCounter === 0)
        f.buildCounter = f.deluxeLevel === 1 ? 4 : 7;
      if (f.buildCounter > 0) {
        f.processingOrder = true;
        f.buildCounter--;
      }
      if (f.buildCounter === 0 && f.processingOrder) {
        f.product++;
        f.processingOrder = false;
        f.queuedSupply--;
      }
    }
  }
  function makeGarments() {
    for (const kind of ["cutter", "stitcher"] as const)
      for (const m of shuffle(of(kind)))
        if (m.supply > 0) {
          m.product++;
          m.supply--;
        }
    finish();
  }
  function setRobotsDestination() {
    for (const r of shuffle(of("robot"))) {
      const destination = requireChoice(r.destination),
        kind = destination.kind;
      if (kind === "loading-dock") {
        const hs = here(r, kind);
        if (hs.length) {
          if (requireChoice(one(hs)).supply > 0) {
            r.product++;
            r.productType = "bolts";
            r.destination = one(of("cutter"));
            const d = requireChoice(one(hs));
            if (d.supply > 0) d.supply--;
          }
        } else moveRobot(r);
      } else if (
        kind === "cutter" ||
        kind === "stitcher" ||
        kind === "finisher"
      ) {
        const hs = here(r, kind);
        if (!hs.length) {
          moveRobot(r);
          continue;
        }
        if (r.product > 0) {
          r.product = 0;
          requireChoice(one(hs)).supply++;
          continue;
        }
        if (requireChoice(one(hs)).product > 0) {
          r.product++;
          if (kind === "cutter") {
            r.productType = "cuttings";
            r.destination = one(of("stitcher"));
            const m = requireChoice(one(hs));
            if (m.supply > 0) m.supply--;
          } else if (kind === "stitcher") {
            const orders = of("order");
            if (orders.length) {
              const order = requireChoice(one(orders));
              r.productType = order.typeOfOrder;
              order.delete();
              entities = entities.filter((a) => a !== order);
            }
            r.destination = one(
              of("finisher").filter(
                (f) => r.productType === 0 || f.deluxeLevel === 2,
              ),
            );
            const m = requireChoice(one(hs));
            if (m.supply > 0) m.supply--;
          } else {
            r.productType = "finishing";
            r.destination = one(of("storage"));
            one(hs);
            finish();
          } // native ASK one finisher [finish] still asks all finishers.
        } else r.destination = one(of("loading-dock"));
      } else if (kind === "storage") {
        const hs = here(r, kind);
        if (hs.length) {
          if (r.product > 0) {
            r.product = 0;
            requireChoice(one(hs)).supply++;
          }
          r.productType = "nothing";
          r.destination = one(of("loading-dock"));
        } else moveRobot(r);
      } else if (kind === "robot-room") moveRobot(r);
      else r.destination = one(of("loading-dock"));
    }
  }
  function returnHome() {
    for (const r of shuffle(of("robot")))
      if (r.energy < 2) r.destination = one(of("robot-room"));
  }
  function robotSupplyNeed() {
    return Math.min(
      ...entities
        .filter((a) => a.kind !== "robot")
        .map((a) => a.agentsPresent),
    );
  }
  function recharge() {
    for (const room of shuffle(of("robot-room"))) {
      const nearby = of("robot").filter(
        (r) => geometry.distance(room, r, { space }) <= 2,
      );
      for (const r of shuffle(nearby)) {
        r.laden = false;
        r.product = 0;
        r.productType = 0;
        r.energy += 5;
        r.idleness++;
        if (r.energy >= settings.fullCharge) {
          if (random.number() < 0.5) {
            const need = robotSupplyNeed();
            r.destination = one(
              entities.filter((a) => a.agentsPresent === need),
            );
          } else r.destination = one(of("loading-dock"));
        }
      }
      if (of("loading-dock").reduce((sum, a) => sum + a.supply, 0) > 0) {
        const idle = here(room, "robot");
        if (idle.length) {
          const r = requireChoice(one(idle));
          if (r.energy > settings.justInTimeSupplyRobot)
            r.destination = one(of("loading-dock"));
        }
      }
    }
  }
  function controllerSendsGarments() {
    for (const d of shuffle(of("loading-dock")))
      d.supply += Math.floor(random.number() * 10);
  }
  function deliverMoreMaterialSheets() {
    if (
      Math.floor(random.number() * 100) < 3 &&
      of("loading-dock").reduce((sum, a) => sum + a.supply, 0) < 3
    )
      controllerSendsGarments();
    for (const d of shuffle(of("loading-dock")))
      if (Math.floor(random.number() * 100) < 3) {
        const count = Math.floor(random.number() * 3);
        for (let n = 0; n < count; n++)
          make("order", d.x, d.y, {
            product: d.product,
            supply: d.supply,
            agentsPresent: d.agentsPresent,
            typeOfOrder: Math.floor(random.number() * 2),
            penDown: d.penDown,
          });
      }
  }
  function shiftChange() {
    if (Math.floor(random.number() * 100) < 2) {
      const robots = of("robot");
      if (robots.length < 3)
        throw new Error("Native n-of 3 exceeds robot count.");
      for (const r of shuffle(random.sample(robots, { count: 3 })))
        r.destination = one(of("loading-dock"));
    }
  }
  function labelAgents() {
    for (const a of shuffle(entities))
      a.label = settings.showAgentName ? `${a.kind} ${a.sourceId}` : "";
  }
  function record() {
    const sum = (kind: FactoryKind) =>
        of(kind).reduce((s, a) => s + a.supply, 0),
      orders = of("order");
    history.push({
      tick: world.tick.value,
      idle:
        world.tick.value > 0
          ? of("robot").reduce((s, r) => s + r.idleness, 0) / world.tick.value
          : 0,
      orders: orders.length,
      deluxe: orders.filter((o) => o.typeOfOrder === 1).length,
      standard: orders.filter((o) => o.typeOfOrder === 0).length,
      cutters: sum("cutter"),
      stitchers: sum("stitcher"),
      finishers: sum("finisher"),
      dock: sum("loading-dock"),
      stored: sum("storage"),
    });
    if (history.length > 2001) history.shift();
  }
  function snapshot(a: Entity): EntitySnapshot {
    return {
      id: a.sourceId,
      kind: a.kind,
      x: a.x,
      y: a.y,
      heading: a.heading,
      product: a.product,
      supply: a.supply,
      agentsPresent: a.agentsPresent,
      energy: a.energy,
      laden: a.laden,
      destination: a.destination?.alive ? a.destination.sourceId : null,
      idleness: a.idleness,
      productType: a.productType,
      deluxeLevel: a.deluxeLevel,
      buildCounter: a.buildCounter,
      queuedSupply: a.queuedSupply,
      processingOrder: a.processingOrder,
      typeOfOrder: a.typeOfOrder,
      label: a.label,
      penDown: a.penDown,
    };
  }
  function setScenario(s: {
    robots?: readonly EntitySnapshot[];
    machines?: readonly EntitySnapshot[];
    orders?: readonly EntitySnapshot[];
  }) {
    if (
      !s ||
      typeof s !== "object" ||
      Object.keys(s).some((k) => !["robots", "machines", "orders"].includes(k))
    )
      throw new TypeError("Invalid scenario.");
    const fields = [
      ...(s.robots ?? []),
      ...(s.machines ?? []),
      ...(s.orders ?? []),
    ];
    const ids = new Set<number>();
    for (const p of fields) {
      const current = entities.find((a) => a.sourceId === p.id);
      if (!current || current.kind !== p.kind || ids.has(p.id))
        throw new RangeError(
          "Scenario identities must be existing distinct entities.",
        );
      ids.add(p.id);
      if (
        ![
          p.x,
          p.y,
          p.heading,
          p.product,
          p.supply,
          p.agentsPresent,
          p.energy,
          p.idleness,
          p.deluxeLevel,
          p.buildCounter,
          p.queuedSupply,
          p.typeOfOrder,
        ].every(Number.isFinite) ||
        p.x < -16.5 ||
        p.x >= 16.5 ||
        p.y < -16.5 ||
        p.y >= 16.5 ||
        [
          p.product,
          p.supply,
          p.agentsPresent,
          p.idleness,
          p.buildCounter,
          p.queuedSupply,
        ].some((n) => n < 0) ||
        typeof p.laden !== "boolean" ||
        typeof p.processingOrder !== "boolean" ||
        typeof p.penDown !== "boolean" ||
        typeof p.label !== "string" ||
        !(
          typeof p.productType === "string" ||
          (typeof p.productType === "number" && Number.isFinite(p.productType))
        ) ||
        (p.destination !== null &&
          !entities.some((a) => a.sourceId === p.destination))
      )
        throw new RangeError("Invalid source state.");
    }
    for (const p of fields) {
      const a = entities.find((a) => a.sourceId === p.id)!;
      a.move({ to: { x: p.x, y: p.y } });
      a.rotate(p.heading - a.heading);
      a.product = p.product;
      a.supply = p.supply;
      a.agentsPresent = p.agentsPresent;
      a.energy = p.energy;
      a.laden = p.laden;
      a.destination =
        p.destination === null
          ? null
          : entities.find((a) => a.sourceId === p.destination)!;
      a.idleness = p.idleness;
      a.productType = p.productType;
      a.deluxeLevel = p.deluxeLevel;
      a.buildCounter = p.buildCounter;
      a.queuedSupply = p.queuedSupply;
      a.processingOrder = p.processingOrder;
      a.typeOfOrder = p.typeOfOrder;
      a.label = p.label;
      a.penDown = p.penDown;
    }
    diagnostic = null;
  }
  make("cutter", 10, -6);
  make("cutter", 10, -11);
  make("stitcher", 4, 8);
  make("stitcher", 4, 3);
  make("finisher", 0, -4, { deluxeLevel: 1 });
  make("finisher", 2, -8, { deluxeLevel: 2 });
  make("storage", -6, 4);
  make("robot-room", -11, -7);
  const dock = make("loading-dock", 13, 4, { supply: 10 });
  for (let i = 0; i < settings.numberOfRobots; i++)
    make("robot", random.number() * 33 - 16.5, random.number() * 33 - 16.5, {
      energy: settings.fullCharge,
      destination: dock,
    });
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        try {
          run(world, () => {
            makeGarments();
            setRobotsDestination();
            returnHome();
            recharge();
            deliverMoreMaterialSheets();
            shiftChange();
            labelAgents();
            for (const a of shuffle(entities)) {
              a.agentsPresent = here(a).length;
              a.penDown = settings.makeTrails;
            }
            if (trails.length > 20000) trails.splice(0, trails.length - 20000);
          });
          diagnostic = null;
          record();
        } catch (error) {
          diagnostic = error instanceof Error ? error.message : String(error);
          throw error;
        }
      }
    },
    setScenario,
    moveRobot: (id: number) =>
      moveRobot(requireChoice(entities.find((a) => a.sourceId === id) ?? null)),
    finish,
    makeGarments,
    setRobotsDestination,
    returnHome,
    recharge,
    controllerSendsGarments,
    deliverMoreMaterialSheets,
    shiftChange,
    labelAgents,
    robotSupplyNeed,
    setParameters(changes: Partial<FactoryParameters>) {
      if (
        Reflect.ownKeys(changes).some(
          (k) =>
            ![
              "fullCharge",
              "justInTimeSupplyRobot",
              "showAgentName",
              "makeTrails",
            ].includes(String(k)),
        )
      )
        throw new TypeError("Setup-only parameter.");
      settings = parameters(inputs, { ...settings, ...changes });
    },
    read() {
      const robots = of("robot").map(snapshot),
        machines = entities
          .filter((a) => a.kind !== "robot" && a.kind !== "order")
          .map(snapshot),
        orders = of("order").map(snapshot);
      return {
        width: 33,
        height: 33,
        tick: world.tick.value,
        parameters: { ...settings },
        robots,
        machines,
        orders,
        diagnostic,
        randomState: random.state,
        newSheets: of("loading-dock").reduce((s, a) => s + a.supply, 0),
        productsReady: of("storage").reduce((s, a) => s + a.supply, 0),
        idlePerTick:
          world.tick.value > 0
            ? robots.reduce((s, a) => s + a.idleness, 0) / world.tick.value
            : 0,
        energySummary: stats.describe(robots.map((r) => r.energy)),
        energyHistogram: stats.histogram(
          robots.map((r) => r.energy),
          { edges: Array.from({ length: 13 }, (_, i) => i * 50) },
        ),
        history: history.map((p) => ({ ...p })),
        trails: trails.map((t) => ({
          ...t,
          from: { ...t.from },
          to: { ...t.to },
        })),
      };
    },
  };
}
export const model = {
  title: "Robotic Factory",
  description:
    "Native garment-machine routing, finite energy, charging and stochastic orders. Martin and Wilensky (2021), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<FactoryParameters, ReturnType<typeof create>>;
