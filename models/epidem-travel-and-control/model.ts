/** NetLogo epiDEM Travel and Control. Toy mechanism, not health guidance. */
import { Agent, Graph, Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface TravelParameters {
  seed: number;
  initialPersonCount: number;
  initialAmbulanceCount: number;
  infectionChance: number;
  recoveryChance: number;
  averageRecoveryTime: number;
  averageIsolationTendency: number;
  averageHospitalGoingTendency: number;
  inoculationChance: number;
  intraMobility: number;
  travelTendency: number;
  edges: boolean;
  travel: boolean;
}
export const inputs: Inputs<TravelParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialPersonCount: {
    kind: "number",
    default: 250,
    min: 50,
    max: 400,
    integer: true,
  },
  initialAmbulanceCount: {
    kind: "number",
    default: 2,
    min: 0,
    max: 4,
    integer: true,
  },
  infectionChance: { kind: "number", default: 55, min: 0, max: 100 },
  recoveryChance: { kind: "number", default: 45, min: 0, max: 100 },
  averageRecoveryTime: { kind: "number", default: 110, min: 0, max: 300 },
  averageIsolationTendency: { kind: "number", default: 5, min: 0, max: 50 },
  averageHospitalGoingTendency: { kind: "number", default: 5, min: 0, max: 50 },
  inoculationChance: { kind: "number", default: 10, min: 0, max: 100 },
  intraMobility: { kind: "number", default: 0.4, min: 0, max: 1 },
  travelTendency: { kind: "number", default: 1, min: 0, max: 1 },
  edges: { kind: "boolean", default: false },
  travel: { kind: "boolean", default: false },
};
type Person = Agent<{
  who: number;
  infected: boolean;
  cured: boolean;
  susceptible: boolean;
  inoculated: boolean;
  isolated: boolean;
  hospitalized: boolean;
  ambulance: boolean;
  infectionLength: number;
  recoveryTime: number;
  isolationTendency: number;
  hospitalGoingTendency: number;
  continent: number;
  newlyInfectedPersonCount: number;
  newlyRecoveredPersonCount: number;
}>;
export function create(options: Partial<TravelParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 25, y: 25, boundary: "hard" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { color: "#111111" } });
  const graph = Graph.create<Person>();
  world.add(grid);
  let stopped = false;
  let betaN = 0;
  let gamma = 0;
  let r0 = 0;
  let previousNewlyInfectedPersonCount = 0;
  const history: {
    tick: number;
    infectedPersonCount: number;
    recoveredPersonCount: number;
    inoculatedPersonCount: number;
    isolatedPersonCount: number;
    hospitalizedPersonCount: number;
    r0: number;
  }[] = [];
  const people = () => world.agents as readonly Person[];
  const shuffled = (p: readonly Person[]) =>
    random.sample(p, { sampleCount: p.length, algorithm: "fisher-yates-descending" });
  const normalTendency = (mean: number) =>
    Math.max(
      0,
      Math.min(
        mean * 2,
        random.number({ distribution: "normal", mean, deviation: mean / 4 }),
      ),
    );
  function setupGlobals() {
    for (const f of grid.fields) f.color = f.x === 0 ? "#ead63c" : "#111111";
    grid.fieldAt({ x: -6, y: 0 })!.color = "#ffffff";
    grid.fieldAt({ x: 6, y: 0 })!.color = "#ffffff";
  }
  function assignTendency(person: Person) {
    person.isolationTendency = normalTendency(
      settings.averageIsolationTendency,
    );
    person.hospitalGoingTendency = normalTendency(
      settings.averageHospitalGoingTendency,
    );
    person.recoveryTime = normalTendency(settings.averageRecoveryTime);
  }
  function addPerson(who: number, ambulance: boolean) {
    const x = ambulance
      ? random.number() < 0.5
        ? -6
        : 6
      : -12.5 + random.number() * 25;
    const y = ambulance ? 0 : -12.5 + random.number() * 25;
    const person = world.add(
      Agent.create(
        {
          who,
          ambulance,
          infected: false,
          cured: false,
          susceptible: !ambulance,
          inoculated: false,
          isolated: false,
          hospitalized: false,
          infectionLength: 0,
          recoveryTime: 0,
          isolationTendency: 0,
          hospitalGoingTendency: 0,
          continent: x <= 0 ? 1 : 2,
          newlyInfectedPersonCount: 0,
          newlyRecoveredPersonCount: 0,
        },
        {
          position: { x, y },
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      ),
    );
    if (!ambulance) {
      assignTendency(person);
      if (random.number() * 100 < 5) {
        person.infected = true;
        person.susceptible = false;
        person.infectionLength = Math.floor(
          random.number() * Math.ceil(person.recoveryTime),
        );
      }
      if (
        !person.infected &&
        random.number() * 100 < settings.inoculationChance
      ) {
        person.inoculated = true;
        person.susceptible = false;
      }
    }
    graph.nodes.add(person);
    return person;
  }
  function setupPeople() {
    for (let who = 0; who < settings.initialPersonCount; who++)
      addPerson(who, false);
    if (settings.edges) makeNetwork();
  }
  function setupAmbulance() {
    for (let i = 0; i < settings.initialAmbulanceCount; i++)
      addPerson(settings.initialPersonCount + i, true);
  }
  function neighbors(person: Person) {
    const adjacent = new Set(
      grid.neighbors(grid.fieldAt(person)!, { neighborhood: "moore" }),
    );
    return people().filter((p) => adjacent.has(grid.fieldAt(p)!));
  }
  function makeNetwork() {
    for (const p of shuffled(people()))
      for (const q of shuffled(neighbors(p)))
        if (!graph.hasEdge(p, q)) graph.edges.add({ from: p, to: q });
  }
  function record() {
    history.push({
      tick: world.tick.value,
      infectedPersonCount: people().filter((p) => p.infected).length,
      recoveredPersonCount: people().filter((p) => p.cured).length,
      inoculatedPersonCount: people().filter((p) => p.inoculated).length,
      isolatedPersonCount: people().filter((p) => p.isolated).length,
      hospitalizedPersonCount: people().filter((p) => p.hospitalized).length,
      r0,
    });
  }
  function setup() {
    graph.delete();
    for (const p of people()) p.delete();
    world.tick.reset();
    history.length = 0;
    stopped = false;
    betaN = 0;
    gamma = 0;
    r0 = 0;
    previousNewlyInfectedPersonCount = 0;
    setupGlobals();
    setupPeople();
    setupAmbulance();
    record();
  }
  function forward(person: Person, distance: number) {
    // Native hard-world FD advances in units, stopping before a forbidden partial unit.
    let remaining = distance;
    while (remaining > 1e-12) {
      const amount = Math.min(1, remaining);
      const d = geometry.direction({ heading: person.heading });
      if (
        !geometry.normalize(
          { x: person.x + d.x * amount, y: person.y + d.y * amount },
          { space, endpoints: "half-open" },
        )
      )
        break;
      person.move(amount);
      remaining -= amount;
    }
  }
  function move(person: Person) {
    if (
      settings.travel &&
      random.number({ min: 0, max: 100, integer: true }) <
        settings.travelTendency &&
      !person.ambulance
    )
      person.move({ to: { x: -person.x, y: person.y } });
    if (
      (person.continent === 1 && person.x > -0.5) ||
      (person.continent === 2 && person.x < 1)
    ) {
      const angle = random.number() * 180;
      const sign = person.continent === 1 ? -1 : 1;
      const d = geometry.direction({ heading: angle });
      const field = grid.fieldAt({
        x: person.x + sign * d.x,
        y: person.y + sign * d.y,
      });
      if (field) person.move({ to: field });
    } else {
      const nearEdge =
        person.continent === 1 ? person.x < -11.5 : person.x > 11;
      const angle = random.number() * (nearEdge ? 180 : 360);
      person.rotate(person.continent === 1 ? angle : -angle);
      forward(person, settings.intraMobility * (person.ambulance ? 5 : 1));
    }
  }
  function clearCount(person: Person) {
    person.newlyInfectedPersonCount = 0;
    person.newlyRecoveredPersonCount = 0;
  }
  function infect(person: Person) {
    for (const target of shuffled(
      neighbors(person).filter((p) => !p.infected && !p.cured && !p.inoculated),
    )) {
      const chance =
        settings.infectionChance * (graph.hasEdge(person, target) ? 2 : 1);
      if (random.number({ min: 0, max: 100, integer: true }) < chance) {
        target.infected = true;
        target.newlyInfectedPersonCount++;
      }
    }
  }
  function isolate(person: Person) {
    person.isolated = true;
    person.move({ to: grid.fieldAt(person)! });
    grid.fieldAt(person)!.color = "#555555";
  }
  function hospitalize(person: Person) {
    person.hospitalized = true;
    grid.fieldAt(person)!.color = "#111111";
    person.move({ to: { x: person.continent === 1 ? -6 : 6, y: 0 } });
    grid.fieldAt(person)!.color = "#ffffff";
  }
  function unisolate(person: Person) {
    person.isolated = false;
    person.hospitalized = false;
    grid.fieldAt(person)!.color = "#111111";
    for (const f of grid.fields.filter((f) => f.x === 0)) f.color = "#ead63c";
    grid.fieldAt({ x: -6, y: 0 })!.color = "#ffffff";
    grid.fieldAt({ x: 6, y: 0 })!.color = "#ffffff";
  }
  function maybeRecover(person: Person) {
    person.infectionLength++;
    if (
      person.infectionLength >
        person.recoveryTime / (person.hospitalized ? 5 : 1) &&
      (person.hospitalized || random.number() * 100 < settings.recoveryChance)
    ) {
      person.infected = false;
      person.cured = true;
      person.newlyRecoveredPersonCount++;
    }
  }
  function calculateR0() {
    const newlyInfected = people().reduce((s, p) => s + p.newlyInfectedPersonCount, 0);
    const newlyRecovered = people().reduce((s, p) => s + p.newlyRecoveredPersonCount, 0);
    const infected = people().filter((p) => p.infected).length;
    previousNewlyInfectedPersonCount = infected + newlyRecovered - newlyInfected;
    betaN = previousNewlyInfectedPersonCount < 10 ? 0 : newlyInfected / previousNewlyInfectedPersonCount;
    gamma = previousNewlyInfectedPersonCount < 5 ? 0 : newlyRecovered / previousNewlyInfectedPersonCount;
    const susceptibleT =
      settings.initialPersonCount -
      infected -
      people().filter((p) => p.cured).length;
    const s0 = people().filter((p) => p.susceptible).length;
    if (settings.initialPersonCount - susceptibleT !== 0 && susceptibleT !== 0) {
      if (s0 / susceptibleT <= 0)
        throw new RangeError(
          "Source R0 logarithm requires a positive argument.",
        );
      r0 =
        (Math.log(s0 / susceptibleT) /
          (settings.initialPersonCount - susceptibleT)) *
        s0;
    }
  }
  function go() {
    for (const p of shuffled(people())) clearCount(p);
    for (const p of shuffled(people()))
      if (!p.isolated && !p.hospitalized && !p.ambulance) move(p);
    for (const p of shuffled(people()))
      if (p.infected && !p.isolated && !p.hospitalized) infect(p);
    for (const p of shuffled(people()))
      if (
        p.infected &&
        !p.isolated &&
        !p.hospitalized &&
        random.number({ min: 0, max: 100, integer: true }) < p.isolationTendency
      )
        isolate(p);
    for (const p of shuffled(people()))
      if (
        p.infected &&
        !p.isolated &&
        !p.hospitalized &&
        random.number({ min: 0, max: 100, integer: true }) <
          p.hospitalGoingTendency
      )
        hospitalize(p);
    for (const p of shuffled(people()))
      if (p.ambulance) {
        move(p);
        for (const q of shuffled(neighbors(p)))
          if (!q.ambulance && q.infected) hospitalize(q);
      }
    for (const p of shuffled(people())) if (p.infected) maybeRecover(p);
    for (const p of shuffled(people()))
      if ((p.isolated || p.hospitalized) && p.cured) unisolate(p);
    for (const _p of shuffled(people())) calculateR0();
  }
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let i = 0; i < stepCount; i++) {
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
    update: Partial<
      Omit<TravelParameters, "seed" | "initialPersonCount" | "initialAmbulanceCount">
    >,
  ) {
    if (
      Object.keys(update).some((k) =>
        ["seed", "initialPersonCount", "initialAmbulanceCount"].includes(k),
      )
    )
      throw new TypeError("Setup parameters are immutable.");
    settings = parseParameters(inputs, { ...settings, ...update });
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
      previousNewlyInfectedPersonCount: previousNewlyInfectedPersonCount,
      infectedCount: people().filter((p) => p.infected).length,
      curedCount: people().filter((p) => p.cured).length,
      history: history.map((p) => ({ ...p })),
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        color: f.color,
      })),
      edges: [...graph.edges].map((e) => ({
        id: e.id,
        from: e.from.id,
        to: e.to.id,
      })),
      agents: people().map((p) => ({
        id: p.id,
        who: p.who,
        x: p.x,
        y: p.y,
        heading: p.heading,
        group: p.ambulance ? "ambulance" : "person",
        color: p.ambulance
          ? "#e4cf33"
          : p.cured
            ? "#35ac69"
            : p.inoculated
              ? "#3596df"
              : p.infected
                ? "#e13c3c"
                : "#dddddd",
        infected: p.infected,
        cured: p.cured,
        susceptible: p.susceptible,
        inoculated: p.inoculated,
        isolated: p.isolated,
        hospitalized: p.hospitalized,
        ambulance: p.ambulance,
        continent: p.continent,
        infectionLength: p.infectionLength,
        recoveryTime: p.recoveryTime,
        isolationTendency: p.isolationTendency,
        hospitalGoingTendency: p.hospitalGoingTendency,
      })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    setupGlobals,
    setupPeople,
    setupAmbulance,
    assignTendency,
    makeNetwork,
    move,
    clearCount,
    infect,
    isolate,
    hospitalize,
    unisolate,
    maybeRecover,
    calculateR0,
    go,
    setParameters,
    world,
    grid,
    graph,
  };
}
export const model = {
  title: "Epidemic Travel and Control",
  description: "Travel and social links spread an infection; isolation, hospitals and vaccination slow it.",
  inputs,
  create,
} satisfies Definition<TravelParameters, ReturnType<typeof create>>;
