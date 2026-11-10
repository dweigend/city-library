/** Biology Virus (Wilensky, 1998), distinct from Virus on a Network. See NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface VirusParameters {
  seed: number;
  numberPeople: number;
  infectiousness: number;
  chanceRecover: number;
  duration: number;
  agentShape: "person" | "circle";
}
export const inputs: Inputs<VirusParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numberPeople: {
    kind: "number",
    default: 150,
    min: 10,
    max: 300,
    integer: true,
  },
  infectiousness: { kind: "number", default: 65, min: 0, max: 99 },
  chanceRecover: { kind: "number", default: 75, min: 0, max: 99 },
  duration: { kind: "number", default: 20, min: 0, max: 99 },
  agentShape: {
    kind: "choice",
    default: "person",
    options: ["person", "circle"],
  },
};
type Person = Agent<{
  sick: boolean;
  remainingImmunity: number;
  sickTime: number;
  age: number;
}>;
export function create(options: Partial<VirusParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 35, y: 35, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  const lifespan = 2600;
  const carryingCapacity = 300;
  const chanceReproduce = 1;
  const immunityDuration = 52;
  let percentInfected = 0;
  let percentImmune = 0;
  const history: {
    tick: number;
    population: number;
    infected: number;
    immune: number;
  }[] = [];
  const all = () => world.agents as readonly Person[];
  const shuffled = (people: readonly Person[]) =>
    random.sample(people, {
      count: people.length,
      compatibility: "legacy-shuffle",
    });
  const integer = (upper: number) =>
    random.number({ min: 0, max: upper, integer: true });
  function getSick(person: Person) {
    person.sick = true;
    person.remainingImmunity = 0;
  }
  function getHealthy(person: Person) {
    person.sick = false;
    person.remainingImmunity = 0;
    person.sickTime = 0;
  }
  function becomeImmune(person: Person) {
    person.sick = false;
    person.sickTime = 0;
    person.remainingImmunity = immunityDuration;
  }
  function immune(person: Person) {
    return person.remainingImmunity > 0;
  }
  function setupAgents() {
    for (let index = 0; index < settings.numberPeople; index++) {
      world.add(
        Agent.create(
          {
            sick: false,
            remainingImmunity: 0,
            sickTime: 0,
            age: integer(lifespan),
          },
          {
            position: {
              x: random.number() * 35 - 17.5,
              y: random.number() * 35 - 17.5,
            },
            orientation: { heading: integer(360) },
          },
        ),
      );
    }
    for (const person of random.sample(all(), { count: 10 })) getSick(person);
  }
  function updateGlobalVariables() {
    if (all().length) {
      percentInfected =
        (all().filter((person) => person.sick).length / all().length) * 100;
      percentImmune = (all().filter(immune).length / all().length) * 100;
    }
  }
  function getOlder(person: Person) {
    person.age++;
    if (person.age > lifespan) {
      person.delete();
      return;
    }
    if (immune(person)) person.remainingImmunity--;
    if (person.sick) person.sickTime++;
  }
  function move(person: Person) {
    person.rotate(integer(100));
    person.rotate(-integer(100));
    person.move(1);
  }
  function infect(person: Person) {
    const field = grid.fieldAt(person)!;
    for (const recipient of shuffled(
      all().filter(
        (other) =>
          other !== person &&
          !other.sick &&
          !immune(other) &&
          grid.fieldAt(other) === field,
      ),
    )) {
      if (random.number() * 100 < settings.infectiousness) getSick(recipient);
    }
  }
  function recoverOrDie(person: Person) {
    if (person.sickTime > settings.duration) {
      if (random.number() * 100 < settings.chanceRecover) becomeImmune(person);
      else person.delete();
    }
  }
  function reproduce(person: Person) {
    if (
      all().length < carryingCapacity &&
      random.number() * 100 < chanceReproduce
    ) {
      const child = world.add(
        Agent.create(
          { sick: false, remainingImmunity: 0, sickTime: 0, age: 1 },
          {
            position: { x: person.x, y: person.y },
            orientation: { heading: person.heading },
          },
        ),
      );
      child.rotate(-45);
      child.move(1);
    }
  }
  function record() {
    history.push({
      tick: world.tick.value,
      population: all().length,
      infected: percentInfected,
      immune: percentImmune,
    });
    if (history.length > 2001) history.shift();
  }
  function go() {
    run(
      world,
      () => {
        for (const person of shuffled(all())) {
          getOlder(person);
          if (!all().includes(person)) continue;
          move(person);
          if (person.sick) recoverOrDie(person);
          if (!all().includes(person)) continue;
          if (person.sick) infect(person);
          else reproduce(person);
        }
        updateGlobalVariables();
      },
      1,
    );
    record();
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) go();
  }
  function setParameters(
    update: Partial<Omit<VirusParameters, "seed" | "numberPeople">>,
  ) {
    if (
      Object.keys(update).some(
        (key) => key === "seed" || key === "numberPeople",
      )
    )
      throw new TypeError("Setup parameters require a new model.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 35,
      height: 35,
      parameters: { ...settings },
      percentInfected,
      percentImmune,
      lifespan,
      carryingCapacity,
      chanceReproduce,
      immunityDuration,
      stopped: false,
      agents: all().map((person) => ({
        id: person.id,
        group: "person",
        x: person.x,
        y: person.y,
        heading: person.heading,
        sick: person.sick,
        remainingImmunity: person.remainingImmunity,
        sickTime: person.sickTime,
        age: person.age,
        shape: settings.agentShape,
        size: 1.5,
        color: person.sick ? "#e43838" : immune(person) ? "#888888" : "#3ca34d",
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  setupAgents();
  updateGlobalVariables();
  record();
  return {
    read,
    advance,
    go,
    setParameters,
    setupAgents,
    updateGlobalVariables,
    getOlder,
    move,
    infect,
    recoverOrDie,
    reproduce,
    getSick,
    getHealthy,
    becomeImmune,
    immune,
  };
}
export const model: Definition<VirusParameters, ReturnType<typeof create>> = {
  title: "Virus",
  description:
    "Moving hosts, infection, recovery, immunity and demographic turnover.",
  inputs,
  create,
};
