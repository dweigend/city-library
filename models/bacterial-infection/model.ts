/** NetLogo Bacterial Infection, Wilensky (2016), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, geometry } from "city-library";
import type { Field } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export type Dosing =
  | "skip-all-doses"
  | "take-all-doses"
  | "skip-dose-2"
  | "skip-dose-3"
  | "skip-dose-4";
const dosingOptions: readonly Dosing[] = [
  "skip-all-doses",
  "take-all-doses",
  "skip-dose-2",
  "skip-dose-3",
  "skip-dose-4",
];
export interface Parameters {
  seed: number;
  reproduce: boolean;
  reproduceEvery: number;
  autoDoseA: Dosing;
  autoDoseB: Dosing;
  aDosage: number;
  bDosage: number;
  doseAEvery: number;
  doseBEvery: number;
  initialThreePoreBacteriumCountA: number;
  initialFourPoreBacteriumCountA: number;
  initialFivePoreBacteriumCountA: number;
  initialSixPoreBacteriumCountA: number;
  initialThreePoreBacteriumCountB: number;
  initialFourPoreBacteriumCountB: number;
  initialFivePoreBacteriumCountB: number;
  initialSixPoreBacteriumCountB: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  reproduce: { kind: "boolean", default: true },
  reproduceEvery: { kind: "number", default: 2, min: 0.5, max: 4, step: 0.5 },
  autoDoseA: {
    kind: "choice",
    default: "skip-dose-4",
    options: dosingOptions,
  },
  autoDoseB: {
    kind: "choice",
    default: "skip-dose-4",
    options: dosingOptions,
  },
  aDosage: { kind: "number", default: 50, min: 50, max: 200, step: 50 },
  bDosage: { kind: "number", default: 50, min: 50, max: 200, step: 50 },
  doseAEvery: { kind: "number", default: 4, min: 4, max: 24, step: 2 },
  doseBEvery: { kind: "number", default: 4, min: 4, max: 24, step: 4 },
  initialThreePoreBacteriumCountA: { kind: "number", default: 4, min: 0, max: 16, integer: true },
  initialFourPoreBacteriumCountA: { kind: "number", default: 4, min: 0, max: 16, integer: true },
  initialFivePoreBacteriumCountA: { kind: "number", default: 4, min: 0, max: 16, integer: true },
  initialSixPoreBacteriumCountA: { kind: "number", default: 4, min: 0, max: 16, integer: true },
  initialThreePoreBacteriumCountB: { kind: "number", default: 4, min: 0, max: 16, integer: true },
  initialFourPoreBacteriumCountB: { kind: "number", default: 4, min: 0, max: 16, integer: true },
  initialFivePoreBacteriumCountB: { kind: "number", default: 4, min: 0, max: 16, integer: true },
  initialSixPoreBacteriumCountB: { kind: "number", default: 4, min: 0, max: 16, integer: true },
};
export type Region = "A" | "B";
interface FieldState {
  region: Region | null;
  portType: "input" | "output" | "none";
  myBacteria: Bacteria | null;
}
export type Bacteria = Agent<{
  group: "bacteria";
  variation: number;
  age: number;
  target: Field<FieldState> | null;
}>;
export type Antibiotic = Agent<{ group: "antibiotic" }>;
export function giveDose(
  tick: number,
  doseEvery: number,
  wipedOut: boolean,
  autoDose: Dosing,
  dosesGiven: number,
) {
  return (
    tick % (doseEvery * 60) === 0 &&
    !wipedOut &&
    (autoDose === "take-all-doses" ||
      (autoDose === "skip-dose-2" && dosesGiven !== 1) ||
      (autoDose === "skip-dose-3" && dosesGiven !== 2) ||
      (autoDose === "skip-dose-4" && dosesGiven !== 3))
  );
}
export function create(options: Partial<Parameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 49, y: 21, boundary: "wrap" as const };
  const world = World.create(space, { random });
  const grid = Grid.create(space, {
    state: {
      region: null as Region | null,
      portType: "none" as FieldState["portType"],
      myBacteria: null as Bacteria | null,
    },
  });
  world.add(grid);
  const bacteria = () =>
    world.agents.filter(
      (a): a is Bacteria => (a as Bacteria | Antibiotic).group === "bacteria",
    );
  const antibiotics = () =>
    world.agents.filter(
      (a): a is Antibiotic =>
        (a as Bacteria | Antibiotic).group === "antibiotic",
    );
  let doseCountA = 0;
  let doseCountB = 0;
  let aWipedOut = false;
  let bWipedOut = false;
  let feverFactor = false;
  const antibioticFlowRate = 0.2;
  const history: { tick: number; a: number[]; b: number[] }[] = [];
  const regionAt = (agent: Bacteria | Antibiotic) =>
    grid.fieldAt(agent)!.region;
  function setupRegions() {
    for (const field of grid.fields) {
      field.region =
        field.x > -24 && field.x < -1
          ? "A"
          : field.x < 24 && field.x > 1
            ? "B"
            : null;
      field.myBacteria = null;
      field.portType = ![-24, -1, 1, 24].includes(field.x)
        ? field.y === 10
          ? "input"
          : field.y === -10
            ? "output"
            : "none"
        : "none";
    }
  }
  function makeBacteria(count: number, variation: number, region: Region) {
    if (
      !Number.isSafeInteger(count) ||
      count < 0 ||
      ![3, 4, 5, 6].includes(variation)
    )
      throw new RangeError("Invalid bacteria count or variation.");
    const created: Bacteria[] = [];
    for (let n = 0; n < count; n++) {
      const target = random.sample(
        grid.fields.filter((f) => f.region === region && !f.myBacteria?.alive),
      )[0];
      if (!target)
        throw new RangeError("No available field in the source region.");
      const agent = Agent.create(
        {
          group: "bacteria" as const,
          variation,
          age: settings.reproduceEvery * 60,
          target: target as Field<FieldState> | null,
        },
        {
          position: target,
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      );
      world.add(agent);
      target.myBacteria = agent;
      created.push(agent);
    }
    return created;
  }
  function setup() {
    world.delete(world.agents);
    world.tick.reset();
    doseCountA = 0;
    doseCountB = 0;
    aWipedOut = false;
    bWipedOut = false;
    feverFactor = false;
    history.length = 0;
    setupRegions();
    for (const region of ["A", "B"] as const) {
      for (const variation of [3, 4, 5, 6] as const) {
        const key = `initial${({ 3: "Three", 4: "Four", 5: "Five", 6: "Six" } as const)[variation as 3 | 4 | 5 | 6]}PoreBacteriumCount${region}` as keyof Parameters;
        makeBacteria(settings[key] as number, variation, region);
      }
    }
    record();
  }
  function checkBounceOffWalls(agent: Bacteria | Antibiotic) {
    const field = grid.fieldAt(agent)!;
    if (![-23, -2, 2, 23].includes(field.x)) return;
    const direction = geometry.direction({ heading: agent.heading });
    const ahead = geometry.normalize(
      { x: agent.x + 0.5 * direction.x, y: agent.y + 0.5 * direction.y },
      { space, endpoints: "half-open" },
    )!;
    if ([-24, -1, 1, 24].includes(grid.fieldAt(ahead)!.x)) {
      agent.move(-antibioticFlowRate);
      agent.rotate(-2 * agent.heading);
    }
  }
  function canReproduce(agent: Bacteria, totalCount: number) {
    const fever =
      totalCount > 50 && feverFactor ? 1 + 2 * ((totalCount - 50) / 75) : 1;
    return (
      agent.age >= settings.reproduceEvery * 60 * fever &&
      agent.neighbors({
        source: bacteria().filter((a) => a !== agent),
        radius: 0.75,
      }).length === 0 &&
      agent.target === grid.fieldAt(agent)
    );
  }
  function reproduceBacteriaIntoAvailableSpace() {
    const total = bacteria().length;
    const eligible = bacteria().filter((a) => canReproduce(a, total));
    if (!settings.reproduce) return;
    for (const agent of random.sample(eligible, {
      sampleCount: eligible.length,
      algorithm: "fisher-yates-descending",
    })) {
      const available = grid
        .neighbors(grid.fieldAt(agent)!, { neighborhood: "moore" })
        .filter((f) => f.region === regionAt(agent) && !f.myBacteria?.alive);
      if (!available.length) continue;
      const target = random.sample(available)[0]!;
      const child = agent.copy();
      child.target = target;
      world.add(child);
      // Preserve source this-bacteria binding: reservation is the parent, not child.
      target.myBacteria = agent;
    }
  }
  function moveBacteria(agent: Bacteria) {
    if (!agent.target)
      throw new TypeError("Bacteria has no source target field.");
    if (agent.distanceTo(agent.target) > 0.2) {
      agent.rotate({ towards: agent.target });
      agent.move(0.015);
      agent.age = 0;
    }
    checkBounceOffWalls(agent);
    agent.age++;
  }
  function bacteriaDeath(agent: Bacteria) {
    // is-field-set? on the single source field is false: no explicit reservation clear.
    agent.delete();
    // source model dead agent references compare as nobody; availability uses .alive above.
  }
  function doseRegion(region: Region, dosage?: number) {
    if (region !== "A" && region !== "B")
      throw new RangeError("Unknown region.");
    const amount =
      dosage ?? (region === "A" ? settings.aDosage : settings.bDosage);
    if (!Number.isSafeInteger(amount) || amount < 0 || amount > 10000)
      throw new RangeError("Invalid dose.");
    const inputs = grid.fields.filter(
      (f) => f.region === region && f.portType === "input",
    );
    for (let n = 0; n < amount; n++) {
      const field = random.sample(inputs)[0]!;
      const agent = Agent.create(
        { group: "antibiotic" as const },
        {
          position: {
            x: field.x - 0.5 + random.number(),
            y: field.y - 0.5 + random.number(),
          },
          orientation: {
            heading:
              180 +
              random.number({ min: 0, max: 35, integer: true }) -
              random.number({ min: 0, max: 35, integer: true }),
          },
        },
      );
      world.add(agent);
    }
    if (region === "A") doseCountA++;
    else doseCountB++;
  }
  function killThisBacteria(agent: Bacteria) {
    return (
      random.number({ min: 0, max: 100, integer: true }) < agent.variation * 10
    );
  }
  function checkAntibioticInteraction(agent: Antibiotic) {
    const sameField = grid.agentsAt(grid.fieldAt(agent)!, {
      source: bacteria(),
    });
    if (sameField.length) {
      const target = random.sample(sameField)[0]!;
      if (killThisBacteria(target)) bacteriaDeath(target);
      agent.delete();
      return;
    }
    if (
      grid.fieldAt(agent)!.portType === "output" &&
      random.number({
        min: 0,
        max: Math.round(2 / antibioticFlowRate),
        integer: true,
      }) === 0
    )
      agent.delete();
  }
  function moveAntibiotics() {
    for (const agent of random.sample(antibiotics(), {
      sampleCount: antibiotics().length,
      algorithm: "fisher-yates-descending",
    })) {
      agent.move(antibioticFlowRate);
      checkBounceOffWalls(agent);
      checkAntibioticInteraction(agent);
    }
  }
  function autoDose() {
    if (
      giveDose(
        world.tick.value,
        settings.doseAEvery,
        aWipedOut,
        settings.autoDoseA,
        doseCountA,
      )
    )
      doseRegion("A");
    if (
      giveDose(
        world.tick.value,
        settings.doseBEvery,
        bWipedOut,
        settings.autoDoseB,
        doseCountB,
      )
    )
      doseRegion("B");
  }
  function doseEachRegion() {
    if (!bacteria().some((a) => regionAt(a) === "A")) aWipedOut = true;
    if (!bacteria().some((a) => regionAt(a) === "B")) bWipedOut = true;
    autoDose();
  }
  function counts(region: Region) {
    return [3, 4, 5, 6].map(
      (v) =>
        bacteria().filter((a) => regionAt(a) === region && a.variation === v)
          .length,
    );
  }
  function record() {
    history.push({ tick: world.tick.value, a: counts("A"), b: counts("B") });
    if (history.length > 1001) history.splice(1, 1);
  }
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let n = 0; n < stepCount; n++) {
      reproduceBacteriaIntoAvailableSpace();
      for (const agent of random.sample(bacteria(), {
        sampleCount: bacteria().length,
        algorithm: "fisher-yates-descending",
      }))
        moveBacteria(agent);
      moveAntibiotics();
      doseEachRegion();
      world.tick.advance();
      record();
    }
  }
  function read() {
    return {

      parameters: { ...settings },
      randomState: random.state,
      width: 49,
      height: 21,
      tick: world.tick.value,
      minutes: world.tick.value,
      hours: Math.floor(world.tick.value / 60),
      days: Math.floor(Math.floor(world.tick.value / 60) / 2.4) / 10,
      antibioticFlowRate,
      feverFactor,
      doseCountA: doseCountA,
      doseCountB: doseCountB,
      aWipedOut,
      bWipedOut,
      bacteriaCountsRegionA: counts("A"),
      bacteriaCountsRegionB: counts("B"),
      bacteria: bacteria().map((a) => ({
        id: a.id,
        x: a.x,
        y: a.y,
        heading: a.heading,
        variation: a.variation,
        age: a.age,
        region: regionAt(a),
        targetX: a.target?.x ?? 0,
        targetY: a.target?.y ?? 0,
      })),
      antibiotics: antibiotics().map((a) => ({
        id: a.id,
        x: a.x,
        y: a.y,
        heading: a.heading,
        region: regionAt(a),
      })),
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        region: f.region,
        portType: f.portType,
        owner: f.myBacteria?.alive ? f.myBacteria.id : null,
      })),
      history: history.map((p) => ({ ...p, a: [...p.a], b: [...p.b] })),
    };
  }
  function setParameters(change: Partial<Parameters>) {
    settings = parseParameters(inputs, { ...settings, ...change });
  }
  function setFeverFactor(value: boolean) {
    if (typeof value !== "boolean")
      throw new TypeError("Fever factor must be boolean.");
    feverFactor = value;
  }
  setup();
  return {
    read,
    advance,
    setup,
    setParameters,
    setFeverFactor,
    makeBacteria,
    canReproduce,
    reproduceBacteriaIntoAvailableSpace,
    moveBacteria,
    bacteriaDeath,
    doseRegion,
    autoDose,
    doseEachRegion,
    checkBounceOffWalls,
    killThisBacteria,
    checkAntibioticInteraction,
    moveAntibiotics,
  };
}
export const model: Definition<Parameters, ReturnType<typeof create>> = {
  title: "Bacterial Infection",
  inputs,
  create,
};
