/** NetLogo Turing Machine 2D, Wilensky (2002), CC BY-NC-SA 3.0.
 * Public Agent heads and Grid tape; explicit read / write / move phases.
 */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type HeadState = 0 | 1;
export type Turn = "--" | "Right" | "Backwards" | "Left";
export type Rule = readonly [
  state: HeadState,
  turn: 0 | 90 | 180 | 270,
  on: boolean,
];
export interface TuringParameters {
  width: number;
  height: number;
  seed: number;
  heads: number;
  colorPaths: boolean;
  example: number;
  off0State: number;
  off0Turn: Turn;
  off0On: boolean;
  off1State: number;
  off1Turn: Turn;
  off1On: boolean;
  on0State: number;
  on0Turn: Turn;
  on0On: boolean;
  on1State: number;
  on1Turn: Turn;
  on1On: boolean;
}
const directions = ["--", "Right", "Backwards", "Left"] as const;
const liveKeys = [
  "example",
  "off0State",
  "off0Turn",
  "off0On",
  "off1State",
  "off1Turn",
  "off1On",
  "on0State",
  "on0Turn",
  "on0On",
  "on1State",
  "on1Turn",
  "on1On",
] as const;
export const inputs: Inputs<TuringParameters> = {
  width: { kind: "number", default: 151, min: 3, max: 301, integer: true },
  height: { kind: "number", default: 151, min: 3, max: 301, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  heads: { kind: "number", default: 32, min: 1, max: 256, integer: true },
  colorPaths: { kind: "boolean", default: true },
  example: { kind: "number", default: 1, min: 1, max: 5, integer: true },
  off0State: { kind: "number", default: 1, min: 0, max: 1, integer: true },
  off0Turn: { kind: "choice", default: "Backwards", options: directions },
  off0On: { kind: "boolean", default: true },
  off1State: { kind: "number", default: 0, min: 0, max: 1, integer: true },
  off1Turn: { kind: "choice", default: "Right", options: directions },
  off1On: { kind: "boolean", default: true },
  on0State: { kind: "number", default: 0, min: 0, max: 1, integer: true },
  on0Turn: { kind: "choice", default: "--", options: directions },
  on0On: { kind: "boolean", default: true },
  on1State: { kind: "number", default: 1, min: 0, max: 1, integer: true },
  on1Turn: { kind: "choice", default: "Left", options: directions },
  on1On: { kind: "boolean", default: true },
};
const examples: readonly (readonly Rule[])[] = [
  [
    [1, 180, true],
    [1, 90, true],
    [0, 180, true],
    [1, 270, true],
  ],
  [
    [0, 270, true],
    [1, 180, false],
    [1, 90, true],
    [0, 0, true],
  ],
  [
    [1, 90, false],
    [0, 90, true],
    [0, 0, false],
    [0, 180, false],
  ],
  [
    [0, 90, true],
    [0, 0, false],
    [0, 270, false],
    [0, 0, false],
  ],
  [
    [1, 180, true],
    [1, 270, true],
    [0, 270, true],
    [1, 90, false],
  ],
];
export function directionToNumber(direction: Turn): Rule[1] {
  const index = directions.indexOf(direction);
  if (index < 0) throw new RangeError("Unknown turn direction.");
  return (index * 90) as Rule[1];
}
export function numberToDirection(angle: Rule[1]): Turn {
  if (![0, 90, 180, 270].includes(angle))
    throw new RangeError("Use a cardinal turn.");
  return directions[angle / 90]!;
}
export function create(options: Partial<TuringParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Turing source coordinates require odd dimensions.");
  const random = Random.add({ seed: settings.seed });
  const space = {
    x: settings.width,
    y: settings.height,
    boundary: "wrap" as const,
  };
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { on: false, colorNumber: 0 } });
  world.add(grid);
  const agents: Agent<{
    who: number;
    state: HeadState;
    foreground: number;
    ruleSet: Rule | null;
  }>[] = [];
  function rules(): readonly Rule[] {
    return Object.freeze([
      Object.freeze([
        settings.off0State,
        directionToNumber(settings.off0Turn),
        settings.off0On,
      ]) as Rule,
      Object.freeze([
        settings.off1State,
        directionToNumber(settings.off1Turn),
        settings.off1On,
      ]) as Rule,
      Object.freeze([
        settings.on0State,
        directionToNumber(settings.on0Turn),
        settings.on0On,
      ]) as Rule,
      Object.freeze([
        settings.on1State,
        directionToNumber(settings.on1Turn),
        settings.on1On,
      ]) as Rule,
    ]);
  }
  function setup() {
    for (const agent of agents) agent.delete();
    agents.length = 0;
    for (const field of grid.fields) {
      field.on = false;
      field.colorNumber = 0;
    }
    for (let who = 0; who < settings.heads; who++) {
      const color = 5 + 10 * random.number({ min: 0, max: 14, integer: true });
      const agent = Agent.add(
        {
          who,
          state: 0 as HeadState,
          foreground: settings.colorPaths ? color : 9.9,
          ruleSet: null as Rule | null,
        },
        { position: { x: 0, y: 0 }, orientation: { heading: 0 } },
      );
      world.add(agent);
      agent.move(who);
      const field = grid.fieldAt(agent)!;
      agent.move({ to: { x: field.x, y: field.y } });
      agents.push(agent);
    }
    world.tick.reset();
  }
  function findRule(
    agent: (typeof agents)[number],
    table: readonly Rule[],
  ): Rule {
    const cell = grid.fieldAt(agent)!;
    return table[(cell.on ? 2 : 0) + agent.state]!;
  }
  function go() {
    const table = rules();
    // The source has three separate asks. Every head reads the OLD tape before
    // any writes. Only the writing ask's order affects colliding heads.
    for (const agent of agents) agent.ruleSet = findRule(agent, table);
    for (const agent of random.sample(agents, {
      count: agents.length,
      compatibility: "legacy-shuffle",
    })) {
      const cell = grid.fieldAt(agent)!;
      cell.on = agent.ruleSet![2];
      cell.colorNumber = cell.on ? agent.foreground : 0;
    }
    for (const agent of agents) {
      const rule = agent.ruleSet!;
      const heading = (Math.round(agent.heading / 90) * 90 + rule[1]) % 360;
      const dx = heading === 90 ? 1 : heading === 270 ? -1 : 0;
      const dy = heading === 0 ? 1 : heading === 180 ? -1 : 0;
      agent.rotate({ towards: { x: agent.x + dx, y: agent.y + dy } });
      agent.move(1);
      const field = grid.fieldAt(agent)!;
      agent.move({ to: { x: field.x, y: field.y } });
      agent.state = rule[0];
    }
  }
  function setRules(values: readonly Rule[]) {
    if (!Array.isArray(values) || values.length !== 4)
      throw new RangeError(
        "Supply all four rules in off0, off1, on0, on1 order.",
      );
    const next = Array.from({ length: 4 }, (_, index) => {
      const entry = Object.getOwnPropertyDescriptor(values, index);
      if (
        !entry ||
        !("value" in entry) ||
        !Array.isArray(entry.value) ||
        entry.value.length !== 3
      )
        throw new TypeError("Supply four dense [state, turn, on] tuples.");
      const tuple: unknown[] = Array.from({ length: 3 }, (_, part) => {
        const item = Object.getOwnPropertyDescriptor(entry.value, part);
        if (!item || !("value" in item))
          throw new TypeError("Rules must contain data values.");
        return item.value;
      });
      if (
        ![0, 1].includes(tuple[0] as number) ||
        ![0, 90, 180, 270].includes(tuple[1] as number) ||
        typeof tuple[2] !== "boolean"
      )
        throw new RangeError(
          "Rule state must be 0/1, turn cardinal and tape state boolean.",
        );
      return tuple as unknown as Rule;
    });
    settings = parameters(inputs, {
      ...settings,
      off0State: next[0]![0],
      off0Turn: numberToDirection(next[0]![1]),
      off0On: next[0]![2],
      off1State: next[1]![0],
      off1Turn: numberToDirection(next[1]![1]),
      off1On: next[1]![2],
      on0State: next[2]![0],
      on0Turn: numberToDirection(next[2]![1]),
      on0On: next[2]![2],
      on1State: next[3]![0],
      on1Turn: numberToDirection(next[3]![1]),
      on1On: next[3]![2],
    });
  }
  setup();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) run(world, go);
    },
    setRules,
    setConfiguration(
      field: Partial<Pick<TuringParameters, (typeof liveKeys)[number]>>,
    ) {
      if (
        !field ||
        typeof field !== "object" ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(field)) ||
        Reflect.ownKeys(field).some(
          (key) =>
            typeof key !== "string" ||
            !(liveKeys as readonly string[]).includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(field, key)!),
        )
      )
        throw new TypeError("Supply only example or live transition values.");
      settings = parameters(inputs, { ...settings, ...field });
    },
    setupExample(index = settings.example) {
      if (!Number.isSafeInteger(index) || index < 1 || index > 5)
        throw new RangeError("Use example 1..5.");
      setRules(examples[index - 1]!);
      settings = parameters(inputs, { ...settings, example: index });
      setup();
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        done: false,
        rules: rules(),
        cells: Object.freeze(
          grid.fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              on: field.on,
              colorNumber: field.colorNumber,
            }),
          ),
        ),
        agents: Object.freeze(
          agents.map((agent) =>
            Object.freeze({
              id: agent.id,
              who: agent.who,
              x: agent.x,
              y: agent.y,
              heading: agent.heading,
              state: agent.state,
              foreground: agent.foreground,
              ruleSet: agent.ruleSet ? Object.freeze([...agent.ruleSet]) : null,
            }),
          ),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Turing Machine 2D",
  description:
    "Two-state moving heads with an explicit four-rule tape transition table. Wilensky (2002), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<TuringParameters, ReturnType<typeof create>>;
