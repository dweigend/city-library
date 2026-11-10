/** Disease Solo (Wilensky, 2005). Complete original notices: NOTICE.md. */
import { Agent, Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface DiseaseParameters {
  seed: number;
  androidCount: number;
  infectionChance: number;
  stepSize: number;
  chase: boolean;
  avoid: boolean;
}
export const inputs: Inputs<DiseaseParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  androidCount: { kind: "number", default: 60, min: 1, max: 300, integer: true },
  infectionChance: { kind: "number", default: 100, min: 0, max: 100 },
  stepSize: { kind: "number", default: 1, min: 1, max: 5, integer: true },
  chase: { kind: "boolean", default: false },
  avoid: { kind: "boolean", default: false },
};
type Person = Agent<{ group: "android" | "user"; infected: boolean }>;
export function create(options: Partial<DiseaseParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 21, y: 25, boundary: "hard" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  let sickCount = 0;
  let runNumber = 1;
  let delay = 0;
  let stopped = false;
  const history: { tick: number; sickPersonCount: number; run: number }[] = [];
  const all = () => world.agents as readonly Person[];
  const androids = () => all().filter((person) => person.group === "android");
  const shuffled = (people: readonly Person[]) =>
    random.sample(people, {
      sampleCount: people.length,
      algorithm: "fisher-yates-descending",
    });
  const integer = (upper: number) =>
    random.number({ min: 0, max: upper, integer: true });
  function forward(person: Person, amount: number) {
    // Native FD tries unit substeps; a hard-edge substep leaves the current location intact.
    let left = amount;
    while (left > 1e-12) {
      const part = Math.min(1, left);
      const direction = geometry.direction({ heading: person.heading });
      if (
        !geometry.normalize(
          {
            x: person.x + direction.x * part,
            y: person.y + direction.y * part,
          },
          { space, endpoints: "half-open" },
        )
      )
        break;
      person.move(part);
      left -= part;
    }
  }
  function createSomeAndroids() {
    for (let index = 0; index < settings.androidCount; index++) {
      const person = world.add(
        Agent.create(
          { group: "android" as const, infected: false },
          {
            position: { x: integer(21) - 10, y: integer(25) - 12 },
            orientation: { heading: integer(4) * 90 },
          },
        ),
      );
      void person;
    }
  }
  function createUser() {
    return world.add(
      Agent.create(
        { group: "user" as const, infected: false },
        { position: { x: 0, y: 0 }, orientation: { heading: integer(4) * 90 } },
      ),
    );
  }
  function setupWorld() {
    for (const person of all()) person.delete();
    sickCount = 0;
    delay = 0;
    stopped = false;
    createSomeAndroids();
    createUser();
    world.tick.reset();
    record();
  }
  function setupClear() {
    history.length = 0;
    runNumber = 1;
    setupWorld();
  }
  function setupKeep() {
    runNumber++;
    setupWorld();
  }
  function getSick(person: Person) {
    person.infected = true;
  }
  function infect() {
    const selected = random.sample(androids())[0];
    if (selected) getSick(selected);
  }
  function maybeGetSick(person: Person) {
    if (!person.infected && integer(100) < settings.infectionChance)
      getSick(person);
  }
  function spreadDisease(person: Person) {
    const field = grid.fieldAt(person)!;
    for (const other of shuffled(
      all().filter(
        (candidate) =>
          candidate !== person && grid.fieldAt(candidate) === field,
      ),
    ))
      maybeGetSick(other);
  }
  function avoid(person: Person) {
    const candidates = grid.fields.filter(
      (field) =>
        person.distanceTo(field) <= 1 &&
        !all().some((other) => other.infected && grid.fieldAt(other) === field),
    );
    const chosen = random.sample(candidates)[0];
    if (chosen) person.rotate({ towards: chosen });
    else person.rotate(integer(4) * 90);
  }
  function chase(person: Person) {
    const chosen = random.sample(
      all().filter((other) => !other.infected && person.distanceTo(other) <= 1),
    )[0];
    if (chosen) person.rotate({ towards: chosen });
    else person.rotate(integer(4) * 90);
  }
  function androidsWander() {
    for (const person of shuffled(androids())) {
      if (settings.avoid && !person.infected) avoid(person);
      else if (settings.chase && person.infected) chase(person);
      else person.rotate(integer(4) * 90);
    }
    for (const person of shuffled(androids())) forward(person, 1);
  }
  function move(newHeading: number) {
    if (!Number.isFinite(newHeading))
      throw new RangeError("Heading must be finite.");
    for (const person of all().filter((person) => person.group === "user")) {
      person.rotate(newHeading - person.heading);
      forward(person, settings.stepSize);
    }
  }
  function record() {
    history.push({ tick: world.tick.value, sickPersonCount: sickCount, run: runNumber });
    if (history.length > 2001) history.shift();
  }
  function go() {
    if (sickCount === all().length) delay++;
    if (delay > 50) {
      stopped = true;
      return;
    }
    run(
      world,
      () => {
        androidsWander();
        for (const person of shuffled(
          all().filter((person) => person.infected),
        ))
          spreadDisease(person);
        sickCount = all().filter((person) => person.infected).length;
      },
      1,
    );
    record();
  }
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let index = 0; index < stepCount && !stopped; index++) go();
  }
  function setParameters(
    update: Partial<Omit<DiseaseParameters, "seed" | "androidCount">>,
  ) {
    if (
      Object.keys(update).some((key) => key === "seed" || key === "androidCount")
    )
      throw new TypeError("Setup parameters require a new model.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 21,
      height: 25,
      parameters: { ...settings },
      sickCount,
      runNumber,
      delay,
      stopped,
      agents: all().map((person) => ({
        id: person.id,
        group: person.group,
        infected: person.infected,
        x: person.x,
        y: person.y,
        heading: person.heading,
        color: person.infected
          ? "#e43838"
          : person.group === "user"
            ? "#58b8ed"
            : "#888888",
        size: person.group === "user" ? 1.5 : 1,
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  setupClear();
  return {
    read,
    advance,
    go,
    setParameters,
    setupClear,
    setupKeep,
    setupWorld,
    infect,
    move,
    createSomeAndroids,
    createUser,
    androidsWander,
    avoid,
    chase,
    spreadDisease,
    maybeGetSick,
    getSick,
  };
}
export const model: Definition<DiseaseParameters, ReturnType<typeof create>> = {
  title: "Disease Solo",
  description: "You steer one person among wandering androids while an infection spreads by contact.",
  inputs,
  create,
};
