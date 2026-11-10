/** NetLogo epiDEM Basic. See source.nlogox and NOTICE.md. Teaching model only. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface EpidemParameters {
  seed: number;
  initialPeople: number;
  infectionChance: number;
  recoveryChance: number;
  averageRecoveryTime: number;
}
export const inputs: Inputs<EpidemParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialPeople: {
    kind: "number",
    default: 100,
    min: 50,
    max: 400,
    integer: true,
  },
  infectionChance: { kind: "number", default: 30, min: 0, max: 100 },
  recoveryChance: { kind: "number", default: 60, min: 0, max: 100 },
  averageRecoveryTime: { kind: "number", default: 210, min: 0, max: 300 },
};
type Person = Agent<{
  who: number;
  infected: boolean;
  cured: boolean;
  susceptible: boolean;
  infectionLength: number;
  recoveryTime: number;
  nbInfected: number;
  nbRecovered: number;
}>;
export function create(options: Partial<EpidemParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 25, y: 25, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  let stopped = false;
  let betaN = 0;
  let gamma = 0;
  let r0 = 0;
  let nbInfectedPrevious = 0;
  const history: {
    tick: number;
    infected: number;
    cured: number;
    susceptible: number;
    r0: number;
  }[] = [];
  const people = () => world.agents as readonly Person[];
  const shuffled = (values: readonly Person[]) =>
    random.sample(values, {
      count: values.length,
      algorithm: "fisher-yates-descending",
    });

  function setupPeople() {
    for (let who = 0; who < settings.initialPeople; who++) {
      const recoveryTime = Math.max(
        0,
        Math.min(
          2 * settings.averageRecoveryTime,
          random.number({
            distribution: "normal",
            mean: settings.averageRecoveryTime,
            deviation: settings.averageRecoveryTime / 4,
          }),
        ),
      );
      const infected = random.number() * 100 < 5;
      world.add(
        Agent.create(
          {
            who,
            infected,
            cured: false,
            susceptible: !infected,
            infectionLength: infected
              ? Math.floor(random.number() * Math.ceil(recoveryTime))
              : 0,
            recoveryTime,
            nbInfected: 0,
            nbRecovered: 0,
          },
          {
            position: {
              x: -12.5 + random.number() * 25,
              y: -12.5 + random.number() * 25,
            },
            orientation: {
              heading: random.number({ min: 0, max: 360, integer: true }),
            },
          },
        ),
      );
    }
  }
  function record() {
    history.push({
      tick: world.tick.value,
      infected: people().filter((p) => p.infected).length,
      cured: people().filter((p) => p.cured).length,
      susceptible: people().filter((p) => !p.infected && !p.cured).length,
      r0,
    });
  }
  function setup() {
    for (const p of people()) p.delete();
    world.tick.reset();
    history.length = 0;
    stopped = false;
    betaN = 0;
    gamma = 0;
    r0 = 0;
    nbInfectedPrevious = 0;
    setupPeople();
    record();
  }
  function move(person: Person) {
    person.rotate(random.number() * 360);
    person.move(1);
  }
  function clearCount(person: Person) {
    person.nbInfected = 0;
    person.nbRecovered = 0;
  }
  function infect(person: Person) {
    const field = grid.fieldAt(person)!;
    const neighbors = new Set(grid.neighbors(field, { neighborhood: "moore" }));
    for (const target of shuffled(
      people().filter(
        (p) => !p.infected && !p.cured && neighbors.has(grid.fieldAt(p)!),
      ),
    )) {
      if (random.number() * 100 < settings.infectionChance) {
        target.infected = true;
        target.nbInfected++;
      }
    }
  }
  function maybeRecover(person: Person) {
    person.infectionLength++;
    if (
      person.infectionLength > person.recoveryTime &&
      random.number() * 100 < settings.recoveryChance
    ) {
      person.infected = false;
      person.cured = true;
      person.nbRecovered++;
    }
  }
  function calculateR0() {
    const newlyInfected = people().reduce((sum, p) => sum + p.nbInfected, 0);
    const newlyRecovered = people().reduce((sum, p) => sum + p.nbRecovered, 0);
    const infected = people().filter((p) => p.infected).length;
    nbInfectedPrevious = infected + newlyRecovered - newlyInfected;
    betaN = nbInfectedPrevious < 10 ? 0 : newlyInfected / nbInfectedPrevious;
    gamma = nbInfectedPrevious < 10 ? 0 : newlyRecovered / nbInfectedPrevious;
    const susceptibleT =
      settings.initialPeople -
      infected -
      people().filter((p) => p.cured).length;
    const s0 = people().filter((p) => p.susceptible).length;
    if (settings.initialPeople - susceptibleT !== 0 && susceptibleT !== 0) {
      if (s0 / susceptibleT <= 0)
        throw new RangeError(
          "Source R0 logarithm requires a positive argument.",
        );
      r0 =
        (Math.log(s0 / susceptibleT) /
          (settings.initialPeople - susceptibleT)) *
        s0;
    }
  }
  function go() {
    for (const person of shuffled(people())) {
      move(person);
      clearCount(person);
    }
    for (const person of shuffled(people().filter((p) => p.infected))) {
      infect(person);
      maybeRecover(person);
    }
    // Source invokes calculate-r0 once for every agent, with unchanged aggregate data.
    for (const _person of shuffled(people())) calculateR0();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      if (!people().some((p) => p.infected)) {
        stopped = true;
        break;
      }
      stopped = false;
      run(world, go);
      record();
    }
  }
  function setParameters(
    update: Partial<Omit<EpidemParameters, "seed" | "initialPeople">>,
  ) {
    if (
      Object.keys(update).some(
        (k) =>
          ![
            "infectionChance",
            "recoveryChance",
            "averageRecoveryTime",
          ].includes(k),
      )
    )
      throw new TypeError("Only live parameters may change.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 25,
      height: 25,
      stopped,
      parameters: { ...settings },
      betaN,
      gamma,
      r0,
      nbInfectedPrevious,
      infectedCount: people().filter((p) => p.infected).length,
      curedCount: people().filter((p) => p.cured).length,
      history: history.map((point) => ({ ...point })),
      cells: [],
      agents: people().map((p) => ({
        id: p.id,
        who: p.who,
        group: "person",
        x: p.x,
        y: p.y,
        heading: p.heading,
        color: p.infected ? "#e13c3c" : p.cured ? "#35ac69" : "#dddddd",
        infected: p.infected,
        cured: p.cured,
        susceptible: p.susceptible,
        infectionLength: p.infectionLength,
        recoveryTime: p.recoveryTime,
        nbInfected: p.nbInfected,
        nbRecovered: p.nbRecovered,
      })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    setupPeople,
    move,
    clearCount,
    infect,
    maybeRecover,
    calculateR0,
    go,
    setParameters,
    world,
    grid,
  };
}
export const model = {
  title: "epiDEM Basic",
  inputs,
  create,
} satisfies Definition<EpidemParameters, ReturnType<typeof create>>;
