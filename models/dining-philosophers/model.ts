/** Wilensky (2003), CC BY-NC-SA 3.0. Exact source and notices adjacent. */
import { Agent, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type PhilosopherState = "THINKING" | "HUNGRY" | "EATING";
export interface Parameters {
  seed: number;
  philosopherCount: number;
  hungryChance: number;
  fullChance: number;
  cooperation: boolean;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  philosopherCount: {
    kind: "number",
    default: 20,
    min: 2,
    max: 40,
    integer: true,
  },
  hungryChance: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.01 },
  fullChance: { kind: "number", default: 0.5, min: 0, max: 1, step: 0.01 },
  cooperation: { kind: "boolean", default: false },
};
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 1, y: 1, boundary: "hard" }, { random });
  const n = settings.philosopherCount;
  type Philosopher = Agent<{
    who: number;
    state: PhilosopherState;
    totalEaten: number;
  }>;
  type Fork = Agent<{
    who: number;
    owner: Philosopher | null;
    marked: boolean;
    homeX: number;
    homeY: number;
    homeHeading: number;
  }>;
  const philosophers: Philosopher[] = [],
    forks: Fork[] = [];
  for (let i = 0; i < n; i++) {
    const heading = (360 * i) / n,
      angle = (heading * Math.PI) / 180;
    philosophers.push(
      world.add(
        Agent.create(
          { who: i, state: "THINKING" as PhilosopherState, totalEaten: 0 },
          {
            position: { x: 0.35 * Math.sin(angle), y: 0.35 * Math.cos(angle) },
            orientation: { heading },
          },
        ),
      ),
    );
  }
  for (let i = 0; i < n; i++) {
    const angle = (((360 * i) / n + 180 / n) * Math.PI) / 180,
      homeX = 0.25 * Math.sin(angle),
      homeY = 0.25 * Math.cos(angle),
      homeHeading = ((360 * i) / n + 180 / n + 180) % 360;
    forks.push(
      world.add(
        Agent.create(
          {
            who: i + n,
            owner: null as Philosopher | null,
            marked: false,
            homeX,
            homeY,
            homeHeading,
          },
          {
            position: { x: homeX, y: homeY },
            orientation: { heading: homeHeading },
          },
        ),
      ),
    );
  }
  random.sample(forks)[0]!.marked = true;
  const history: {
    tick: number;
    thinking: number;
    hungry: number;
    eating: number;
  }[] = [];
  function counts() {
    return {
      thinking: philosophers.filter((p) => p.state === "THINKING").length,
      hungry: philosophers.filter((p) => p.state === "HUNGRY").length,
      eating: philosophers.filter((p) => p.state === "EATING").length,
    };
  }
  function record() {
    history.push({ tick: world.tick.value, ...counts() });
    if (history.length > 1001) history.shift();
  }
  function philosopher(id: number) {
    if (!Number.isSafeInteger(id) || id < 0 || id >= n)
      throw new RangeError("Unknown philosopher.");
    return philosophers[id]!;
  }
  function release(f: Fork) {
    f.owner = null;
    f.move({ to: { x: f.homeX, y: f.homeY } });
    f.rotate(f.homeHeading - f.heading);
  }
  function acquire(p: Philosopher, f: Fork, left: boolean) {
    f.owner = p;
    const heading = p.heading + (left ? 8 : -8);
    f.move({
      to: {
        x: p.x + 0.1 * Math.sin((heading * Math.PI) / 180),
        y: p.y + 0.1 * Math.cos((heading * Math.PI) / 180),
      },
    });
    f.rotate(heading - f.heading);
  }
  function update(id: number) {
    const p = philosopher(id),
      left = forks[id]!,
      right = forks[(id + n - 1) % n]!;
    if (p.state === "THINKING") {
      if (random.number() < settings.hungryChance) p.state = "HUNGRY";
      return;
    }
    if (p.state === "EATING") {
      p.totalEaten++;
      if (random.number() < settings.fullChance) {
        if (settings.cooperation) {
          if (left.marked) {
            left.marked = false;
            right.marked = true;
          } else if (right.marked) {
            right.marked = false;
            left.marked = true;
          }
        }
        release(left);
        release(right);
        p.state = "THINKING";
      }
      return;
    }
    if (
      left.owner === null &&
      (!settings.cooperation || !left.marked || right.owner === p)
    )
      acquire(p, left, true);
    if (
      right.owner === null &&
      (!settings.cooperation || !right.marked || left.owner === p)
    )
      acquire(p, right, false);
    if (left.owner === p && right.owner === p) p.state = "EATING";
  }
  function activate(id: number) {
    philosopher(id);
    run(world, () => update(id));
    record();
  }
  record();
  return {
    activate,
    counts,
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++)
        activate(random.sample(philosophers)[0]!.who);
    },
    setParameters(
      changes: Partial<Omit<Parameters, "seed" | "philosopherCount">>,
    ) {
      parameters(inputs, changes);
      if (
        Reflect.ownKeys(changes).some(
          (k) => k === "seed" || k === "philosopherCount",
        )
      )
        throw new TypeError("Population and seed are setup-only.");
      settings = parameters(inputs, { ...settings, ...changes });
    },
    setScenario(s: {
      states: readonly PhilosopherState[];
      owners: readonly (number | null)[];
      marked: readonly boolean[];
      totalEaten?: readonly number[];
    }) {
      if (
        s.states.length !== n ||
        s.owners.length !== n ||
        s.marked.length !== n ||
        s.states.some((v) => !["THINKING", "HUNGRY", "EATING"].includes(v)) ||
        s.marked.some((v) => typeof v !== "boolean") ||
        s.marked.filter(Boolean).length !== 1
      )
        throw new RangeError(
          "One state/fork per philosopher and exactly one marked fork required.",
        );
      if (
        s.owners.some(
          (id, i) =>
            id !== null &&
            (!Number.isSafeInteger(id) ||
              id < 0 ||
              id >= n ||
              (id !== i && id !== (i + 1) % n)),
        )
      )
        throw new RangeError("Fork owners must be adjacent philosophers.");
      if (
        s.states.some(
          (state, i) =>
            state === "EATING" &&
            (s.owners[i] !== i || s.owners[(i + n - 1) % n] !== i),
        )
      )
        throw new RangeError("Eating requires both forks.");
      if (
        s.states.some(
          (state, i) => state === "THINKING" && s.owners.includes(i),
        )
      )
        throw new RangeError("Thinking philosophers cannot own forks.");
      if (
        s.totalEaten &&
        (s.totalEaten.length !== n ||
          s.totalEaten.some((v) => !Number.isSafeInteger(v) || v < 0))
      )
        throw new RangeError("Nonnegative integer food counters required.");
      philosophers.forEach((p, i) => {
        p.state = s.states[i]!;
        if (s.totalEaten) p.totalEaten = s.totalEaten[i]!;
      });
      forks.forEach((f, i) => {
        release(f);
        f.marked = s.marked[i]!;
        const id = s.owners[i];
        if (id !== null && id !== undefined)
          acquire(philosophers[id]!, f, i === id);
      });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        randomState: random.state,
        ...counts(),
        philosophers: Object.freeze(
          philosophers.map((p) =>
            Object.freeze({
              id: p.who,
              state: p.state,
              totalEaten: p.totalEaten,
              x: p.x,
              y: p.y,
              heading: p.heading,
            }),
          ),
        ),
        forks: Object.freeze(
          forks.map((f, i) =>
            Object.freeze({
              id: i,
              owner: f.owner?.who ?? null,
              marked: f.marked,
              x: f.x,
              y: f.y,
              heading: f.heading,
            }),
          ),
        ),
        history: Object.freeze(history.map((h) => Object.freeze({ ...h }))),
      });
    },
  };
}
export const model = {
  title: "Dining Philosophers",
  description: "Philosophers share forks around a table; uncoordinated grabbing can leave some of them hungry. Wilensky (2003), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
