/** HIV (Wilensky, 1997). Toy transmission mechanism, not health guidance. See NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface HIVParameters {
  seed: number;
  initialPersonCount: number;
  averageCommitment: number;
  averageCouplingTendency: number;
  averageCondomUse: number;
  averageTestFrequency: number;
}
export const inputs: Inputs<HIVParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialPersonCount: {
    kind: "number",
    default: 300,
    min: 50,
    max: 500,
    integer: true,
  },
  averageCommitment: { kind: "number", default: 50, min: 1, max: 200 },
  averageCouplingTendency: { kind: "number", default: 5, min: 0, max: 10 },
  averageCondomUse: { kind: "number", default: 0, min: 0, max: 10 },
  averageTestFrequency: { kind: "number", default: 0, min: 0, max: 2 },
};
interface PersonState {
  who: number;
  infected: boolean;
  known: boolean;
  infectionLength: number;
  coupled: boolean;
  coupleLength: number;
  commitment: number;
  couplingTendency: number;
  condomUse: number;
  testFrequency: number;
  righty: boolean;
  partner: Person | null;
}
type Person = Agent<PersonState>;
export function create(options: Partial<HIVParameters> = {}) {
  let settings = parseParameters(inputs, options);
  let checked = settings;
  const random = Random.create({ seed: settings.seed });
  const space = { x: 25, y: 25, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { coupled: false } });
  world.add(grid);
  const infectionChance = 50;
  const symptomsShow = 200;
  let stopped = false;
  const history: {
    tick: number;
    infectedPersonCount: number;
    diagnosedPersonCount: number;
    coupledPersonCount: number;
  }[] = [];
  const all = () => world.agents as readonly Person[];
  const shuffled = (people: readonly Person[]) =>
    random.sample(people, {
      sampleCount: people.length,
      algorithm: "fisher-yates-descending",
    });
  function randomNear(center: number) {
    let result = 0;
    for (let index = 0; index < 40; index++) result += random.number() * center;
    return result / 20;
  }
  function assignCommitment(person: Person) {
    person.commitment = randomNear(settings.averageCommitment);
  }
  function assignCouplingTendency(person: Person) {
    person.couplingTendency = randomNear(settings.averageCouplingTendency);
  }
  function assignCondomUse(person: Person) {
    person.condomUse = randomNear(settings.averageCondomUse);
  }
  function assignTestFrequency(person: Person) {
    person.testFrequency = randomNear(settings.averageTestFrequency);
  }
  function setupPeople() {
    for (let who = 0; who < settings.initialPersonCount; who++) {
      const person = world.add(
        Agent.create<PersonState>(
          {
            who,
            infected: who < settings.initialPersonCount * 0.025,
            known: false,
            infectionLength: 0,
            coupled: false,
            coupleLength: 0,
            commitment: 0,
            couplingTendency: 0,
            condomUse: 0,
            testFrequency: 0,
            righty: random.number() < 0.5,
            partner: null,
          },
          {
            position: {
              x: random.number() * 25 - 12.5,
              y: random.number() * 25 - 12.5,
            },
            orientation: {
              heading: random.number({ min: 0, max: 360, integer: true }),
            },
          },
        ),
      );
      if (person.infected)
        person.infectionLength = random.number() * symptomsShow;
      assignCommitment(person);
      assignCouplingTendency(person);
      assignCondomUse(person);
      assignTestFrequency(person);
    }
  }
  function checkSliders() {
    if (checked.averageCommitment !== settings.averageCommitment)
      for (const person of shuffled(all())) assignCommitment(person);
    if (checked.averageCouplingTendency !== settings.averageCouplingTendency)
      for (const person of shuffled(all())) assignCouplingTendency(person);
    if (checked.averageCondomUse !== settings.averageCondomUse)
      for (const person of shuffled(all())) assignCondomUse(person);
    if (checked.averageTestFrequency !== settings.averageTestFrequency)
      for (const person of shuffled(all())) assignTestFrequency(person);
    checked = settings;
  }
  function move(person: Person) {
    person.rotate(random.number() * 360);
    person.move(1);
  }
  function couple(person: Person) {
    const here = grid.fieldAt(person)!;
    const left = grid.fieldAt({ x: here.x - 1, y: here.y })!;
    const candidate = random.sample(
      all().filter(
        (other) =>
          !other.coupled && !other.righty && grid.fieldAt(other) === left,
      ),
    )[0];
    if (candidate && random.number() * 10 < candidate.couplingTendency) {
      person.partner = candidate;
      candidate.partner = person;
      person.coupled = true;
      candidate.coupled = true;
      person.move({ to: { x: here.x, y: here.y } });
      const candidateField = grid.fieldAt(candidate)!;
      candidate.move({ to: { x: candidateField.x, y: candidateField.y } });
      here.coupled = true;
      left.coupled = true;
    }
  }
  function uncouple(person: Person) {
    const partner = person.partner;
    if (
      person.coupled &&
      person.righty &&
      partner &&
      (person.coupleLength > person.commitment ||
        partner.coupleLength > partner.commitment)
    ) {
      const here = grid.fieldAt(person)!;
      here.coupled = false;
      grid.fieldAt({ x: here.x - 1, y: here.y })!.coupled = false;
      person.coupled = false;
      person.coupleLength = 0;
      partner.coupled = false;
      partner.coupleLength = 0;
      person.partner = null;
      partner.partner = null;
    }
  }
  function infect(person: Person) {
    const partner = person.partner;
    if (person.coupled && person.infected && !person.known && partner) {
      if (
        random.number() * 10 > person.condomUse ||
        random.number() * 10 > partner.condomUse
      ) {
        if (random.number() * 100 < infectionChance) partner.infected = true;
      }
    }
  }
  function test(person: Person) {
    if (random.number() * 52 < person.testFrequency && person.infected)
      person.known = true;
    if (person.infectionLength > symptomsShow && random.number() * 100 < 5)
      person.known = true;
  }
  function percentInfected() {
    return all().length
      ? (all().filter((person) => person.infected).length / all().length) * 100
      : 0;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      infectedPersonCount: percentInfected(),
      diagnosedPersonCount:
        (all().filter((person) => person.known).length / all().length) * 100,
      coupledPersonCount: all().filter((person) => person.coupled).length,
    });
    if (history.length > 2001) history.shift();
  }
  function go() {
    if (all().every((person) => person.known)) {
      stopped = true;
      return;
    }
    run(
      world,
      () => {
        checkSliders();
        for (const person of shuffled(all())) {
          if (person.infected) person.infectionLength++;
          if (person.coupled) person.coupleLength++;
        }
        for (const person of shuffled(all())) if (!person.coupled) move(person);
        for (const person of shuffled(all()))
          if (
            !person.coupled &&
            person.righty &&
            random.number() * 10 < person.couplingTendency
          )
            couple(person);
        for (const person of shuffled(all())) uncouple(person);
        for (const person of shuffled(all())) infect(person);
        for (const person of shuffled(all())) test(person);
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
    update: Partial<Omit<HIVParameters, "seed" | "initialPersonCount">>,
  ) {
    if (
      Object.keys(update).some(
        (key) => key === "seed" || key === "initialPersonCount",
      )
    )
      throw new TypeError("Setup parameters require a new model.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 25,
      height: 25,
      parameters: { ...settings },
      stopped,
      infectionChance,
      symptomsShow,
      percentInfected: percentInfected(),
      agents: all().map((person) => ({
        id: person.id,
        who: person.who,
        group: "person",
        x: person.x,
        y: person.y,
        heading: person.heading,
        infected: person.infected,
        known: person.known,
        infectionLength: person.infectionLength,
        coupled: person.coupled,
        coupleLength: person.coupleLength,
        commitment: person.commitment,
        couplingTendency: person.couplingTendency,
        condomUse: person.condomUse,
        testFrequency: person.testFrequency,
        righty: person.righty,
        partnerId: person.partner?.id ?? null,
        color: person.infected
          ? person.known
            ? "#e43838"
            : "#428de0"
          : "#3ca34d",
      })),
      cells: grid.fields
        .filter((field) => field.coupled)
        .map((field) => ({
          id: field.id,
          x: field.x,
          y: field.y,
          color: "#555555",
        })),
      history: history.map((point) => ({ ...point })),
    };
  }
  setupPeople();
  record();
  return {
    read,
    advance,
    go,
    setParameters,
    randomNear,
    assignCommitment,
    assignCouplingTendency,
    assignCondomUse,
    assignTestFrequency,
    setupPeople,
    checkSliders,
    move,
    couple,
    uncouple,
    infect,
    test,
    percentInfected,
  };
}
export const model: Definition<HIVParameters, ReturnType<typeof create>> = {
  title: "HIV Transmission",
  description: "People form and end couples, use condoms and get tested, which shapes how HIV spreads.",
  inputs,
  create,
};
