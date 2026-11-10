/** NetLogo Braess' Paradox, Wilensky 2019; CC BY-NC-SA 3.0, see NOTICE.md. */
import { Agent, Grid, Random, World, run, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  middleOn: boolean;
  spawnRate: number;
  smoothing: number;
  mode:
    | "Best Known /w Random Deviation"
    | "Empirical Analytical"
    | "Probabilistic Greedy";
  randomness: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  middleOn: { kind: "boolean", default: true },
  spawnRate: { kind: "number", default: 10, min: 1, max: 10, integer: true },
  smoothing: { kind: "number", default: 10, min: 1, max: 10, integer: true },
  mode: {
    kind: "choice",
    default: "Probabilistic Greedy",
    options: [
      "Best Known /w Random Deviation",
      "Empirical Analytical",
      "Probabilistic Greedy",
    ],
  },
  randomness: { kind: "number", default: 16, min: 0, max: 100, integer: true },
};
type Commuter = Agent<{ birthTick: number; ticksHere: number; route: number }>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 49, y: 49, boundary: "hard" as const };
  const world = World.create(space, { random });
  const grid = Grid.create(space, {
    state: {
      delay: 0,
      baseDelay: 0,
      roadType: 0,
      lastHere: 0,
      color: "#006600",
    },
  });
  world.add(grid);
  type ModelField = (typeof grid.fields)[number];
  const fields = grid.fields;
  const commuters = () => world.agents as readonly Commuter[];
  const integer = (n: number) => Math.floor(random.number() * n);
  const shuffle = <T>(a: readonly T[]) =>
    random.sample(a, { count: a.length, algorithm: "fisher-yates-descending" });
  const topLeft = grid.fieldAt({ x: -22, y: 22 })!;
  const topRight = grid.fieldAt({ x: 22, y: 22 })!;
  const bottomLeft = grid.fieldAt({ x: -22, y: -22 })!;
  const bottomRight = grid.fieldAt({ x: 22, y: -22 })!;
  let travelTime = 0;
  let top = 0;
  let bottom = 0;
  let middle = 0;
  let spawnTime = 0;
  let middlePrev = settings.middleOn;
  let avg = 0;
  let carsSpawned = 0;
  let completed = 0;
  let topProb = 0;
  let bottomProb = 0;
  let middleProb = 0;
  const history: {
    tick: number;
    top: number;
    bottom: number;
    middle: number;
    avg: number;
    topCount: number;
    bottomCount: number;
    middleCount: number;
  }[] = [];
  function offset(field: ModelField, heading: number, distance = 1) {
    const vector = geometry.direction({ heading });
    const target = grid.fieldAt({
      x: field.x + vector.x * distance,
      y: field.y + vector.y * distance,
    });
    if (!target) throw new Error("Source road operation left the field world.");
    return target;
  }
  function drawRoad(type: number, originalStart: ModelField, originalFinish: ModelField) {
    const heading =
      (Math.atan2(
        originalFinish.x - originalStart.x,
        originalFinish.y - originalStart.y,
      ) *
        180) /
      Math.PI;
    const start =
      type === 3
        ? offset(originalStart, heading)
        : type === 4
          ? offset(originalStart, heading, 2)
          : originalStart;
    const finish =
      type === 3
        ? offset(originalFinish, heading + 180)
        : type === 4
          ? offset(originalFinish, heading + 180, 2)
          : originalFinish;
    let current = offset(start, heading);
    const first = current;
    while (current !== finish) {
      const next = offset(current, heading);
      if (type < 4) {
        if (type === 1) {
          current.color = "#ffff00";
          current.delay = 5;
          current.roadType = 1;
          current.baseDelay = 10;
        } else if (type === 0) {
          current.color = "#ff7f00";
          current.delay = 10;
        } else {
          current.color = "#ffffff";
          current.delay = 0;
        }
        offset(current, heading + 90).color = "#808080";
        offset(current, heading - 90).color = "#808080";
        if (type === 3) {
          offset(current, heading + 40).color = "#808080";
          offset(current, heading - 45).color = "#808080";
        }
      } else {
        current.color = "#333333";
        if (next !== finish) {
          offset(current, heading + 40).color = "#333333";
          offset(current, heading - 45).color = "#333333";
        }
        if (current !== first && next !== finish) {
          offset(current, heading + 90).color = "#333333";
          offset(current, heading - 90).color = "#333333";
        }
      }
      current = next;
    }
  }
  function setupRoads() {
    for (const field of shuffle(fields))
      field.color = `rgb(0 ${96 + integer(16)} 0)`;
    for (const [field, color] of [
      [topLeft, "#00aa00"],
      [bottomRight, "#dd0000"],
      [bottomLeft, "#0000dd"],
      [topRight, "#0000dd"],
    ] as const) {
      field.color = color;
      field.delay = 10;
      for (const neighbor of grid.neighbors(field)) neighbor.color = "#808080";
    }
    drawRoad(1, topLeft, topRight);
    drawRoad(1, bottomLeft, bottomRight);
    drawRoad(0, topLeft, bottomLeft);
    drawRoad(0, topRight, bottomRight);
    drawRoad(settings.middleOn ? 3 : 4, topRight, bottomLeft);
  }
  function analyticalRoute() {
    const agents = commuters();
    if (!agents.length) return integer(settings.middleOn ? 3 : 2);
    if (settings.middleOn) {
      const t =
        agents.filter((a) => a.route === 0 || a.route === 2).length /
          agents.length +
        1;
      const b =
        agents.filter((a) => a.route === 1 || a.route === 2).length /
          agents.length +
        1;
      const m =
        (agents.filter((a) => a.route === 2).length / agents.length) * 2;
      if (t < b && t < m) return 0;
      if (b < m && b < t) return 1;
      if (t === b && m === t) return integer(3);
      return 2;
    }
    const t = agents.filter((a) => a.route === 0).length / agents.length + 1;
    const b = agents.filter((a) => a.route === 1).length / agents.length + 1;
    return t < b ? 0 : 1;
  }
  function bestRandomRoute() {
    const count = settings.middleOn ? 3 : 2;
    if (top === 0 || bottom === 0 || (settings.middleOn && middle === 0))
      return integer(count);
    if (integer(100) >= 100 - settings.randomness) return integer(count);
    if (!settings.middleOn) return top < bottom ? 0 : 1;
    if (middle < top && middle < bottom) return 2;
    return top < middle && top < bottom ? 0 : 1;
  }
  function probabilisticGreedyRoute() {
    if (top === 0 || bottom === 0 || (settings.middleOn && middle === 0))
      return integer(settings.middleOn ? 3 : 2);
    const exponent = settings.randomness / 10;
    if (settings.middleOn) {
      const t = Math.max(0, 2 - top) ** exponent;
      const b = Math.max(0, 2 - bottom) ** exponent;
      const m = Math.max(0, 2 - middle) ** exponent;
      const total = t + b + m;
      topProb = total === 0 ? 0.33 : t / total;
      bottomProb = total === 0 ? 0.33 : b / total;
      middleProb = 1 - topProb - bottomProb;
      const roll = integer(1000);
      return roll < 1000 * topProb
        ? 0
        : roll < 1000 * (topProb + bottomProb)
          ? 1
          : 2;
    }
    const t = (2 - top) ** exponent;
    const b = (2 - bottom) ** exponent;
    const sigma = t / (t + b);
    if (!Number.isFinite(sigma))
      throw new Error(
        "Source probabilistic greedy: invalid power or division by zero without middle road.",
      );
    topProb = sigma;
    bottomProb = 1 - sigma;
    return integer(1000) < sigma * 1000 ? 0 : 1;
  }
  function newRoute() {
    if (settings.mode === "Empirical Analytical") return analyticalRoute();
    if (settings.mode === "Best Known /w Random Deviation")
      return bestRandomRoute();
    return probabilisticGreedyRoute();
  }
  function checkMiddle() {
    if (settings.middleOn === middlePrev) return;
    if (!settings.middleOn && commuters().some((a) => a.route === 2)) return;
    drawRoad(settings.middleOn ? 3 : 4, topRight, bottomLeft);
    middlePrev = settings.middleOn;
  }
  function spawnCommuters() {
    if (spawnTime > 250 / settings.spawnRate) {
      const route = newRoute();
      const agent = Agent.create(
        { birthTick: world.tick.value, ticksHere: 1, route },
        { position: topLeft },
      );
      world.add(agent);
      agent.rotate({
        towards: route === 0 || route === 2 ? topRight : bottomLeft,
      });
      integer(2); // source car/truck shape selection; presentation only
      carsSpawned++;
      spawnTime = 0;
    } else spawnTime++;
  }
  function endCommute(agent: Commuter) {
    travelTime = (world.tick.value - agent.birthTick) / 450;
    avg = avg === 0 ? travelTime : (19 * avg + travelTime) / 20;
    const smooth = (previous: number) =>
      previous === 0
        ? travelTime
        : (travelTime + (settings.smoothing - 1) * previous) /
          settings.smoothing;
    if (agent.route === 0) top = smooth(top);
    else if (agent.route === 1) bottom = smooth(bottom);
    else middle = smooth(middle);
    completed++;
    agent.delete();
  }
  function commuterMove(agent: Commuter) {
    const field = grid.fieldAt(agent)!;
    if (agent.ticksHere > field.delay) {
      field.lastHere = world.tick.value;
      agent.move({ to: offset(field, agent.heading) });
      agent.ticksHere = 1;
    } else agent.ticksHere++;
    const current = grid.fieldAt(agent)!;
    if (current === topRight && agent.route === 0)
      agent.rotate({ towards: bottomRight });
    if (current === topRight && agent.route === 2)
      agent.rotate({ towards: bottomLeft });
    if (current === bottomLeft) agent.rotate({ towards: bottomRight });
    if (current === bottomRight) endCommute(agent);
  }
  function determineCongestion(field: ModelField) {
    field.delay =
      field.lastHere === 0
        ? Math.trunc(field.baseDelay / 2)
        : Math.floor(
            (250 /
              settings.spawnRate /
              (world.tick.value - field.lastHere + 1)) *
              field.baseDelay,
          );
    const green = Math.max(
      127,
      Math.min(
        255,
        255 + Math.floor(255 * (0.5 - field.delay / field.baseDelay)),
      ),
    );
    field.color = `rgb(255 ${green} 0)`;
  }
  function go() {
    checkMiddle();
    spawnCommuters();
    for (const agent of shuffle(commuters())) commuterMove(agent);
    for (const field of shuffle(fields.filter((p) => p.roadType === 1)))
      determineCongestion(field);
  }
  function record() {
    history.push({
      tick: world.tick.value,
      top,
      bottom,
      middle,
      avg,
      topCount: commuters().filter((a) => a.route === 0).length,
      bottomCount: commuters().filter((a) => a.route === 1).length,
      middleCount: commuters().filter((a) => a.route === 2).length,
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  setupRoads();
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        record();
      }
    },
    setRules(value: Partial<Omit<Parameters, "seed">>) {
      settings = parameters(inputs, { ...settings, ...value });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 49,
        height: 49,
        parameters: settings,
        sourceMarker: "braess-paradox:source-v1",
        done: false,
        travelTime,
        top,
        bottom,
        middle,
        spawnTime,
        middlePrev,
        avg,
        carsSpawned,
        completed,
        topProb,
        bottomProb,
        middleProb,
        routeCounts: Object.freeze(
          [0, 1, 2].map(
            (route) => commuters().filter((a) => a.route === route).length,
          ),
        ),
        commuters: Object.freeze(
          commuters().map((a) =>
            Object.freeze({
              id: a.id,
              x: a.x,
              y: a.y,
              heading: a.heading,
              route: a.route,
              birthTick: a.birthTick,
              ticksHere: a.ticksHere,
            }),
          ),
        ),
        cells: Object.freeze(
          fields.map((p) =>
            Object.freeze({
              id: p.id,
              x: p.x,
              y: p.y,
              delay: p.delay,
              baseDelay: p.baseDelay,
              roadType: p.roadType,
              lastHere: p.lastHere,
              color: p.color,
            }),
          ),
        ),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Braess' Paradox",
  description: "Commuters choose routes through congestion; adding a shortcut can make every trip slower. Wilensky, CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
