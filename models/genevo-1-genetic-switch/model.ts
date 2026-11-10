/** NetLogo GenEvo 1 Genetic Switch. See source.nlogox and NOTICE.md. */
import { Agent, Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface SwitchParameters {
  seed: number;
  lacICount: number;
  rnapCount: number;
  lactose: boolean;
  glucose: boolean;
  levelSpace: boolean;
  lacIBondLeakage: number;
  lacILactoseBindingChance: number;
  lacILactoseSeparationChance: number;
  lacYDegradationChance: number;
  lacZDegradationChance: number;
}
export const inputs: Inputs<SwitchParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  lacICount: { kind: "number", default: 25, min: 1, max: 50, integer: true },
  rnapCount: { kind: "number", default: 25, min: 0, max: 50, integer: true },
  lactose: { kind: "boolean", default: false },
  glucose: { kind: "boolean", default: true },
  levelSpace: { kind: "boolean", default: false },
  lacIBondLeakage: { kind: "number", default: 0.02, min: 0, max: 0.1 },
  lacILactoseBindingChance: {
    kind: "number",
    default: 0.99991,
    min: 0.9999,
    max: 1,
  },
  lacILactoseSeparationChance: {
    kind: "number",
    default: 0.001,
    min: 0,
    max: 0.01,
  },
  lacYDegradationChance: { kind: "number", default: 0.0004, min: 0, max: 0.01 },
  lacZDegradationChance: { kind: "number", default: 0.0001, min: 0, max: 0.01 },
};
interface MoleculeData {
  who: number;
  group: "lacI" | "lacY" | "lacZ" | "rnap" | "lactose";
  partner: Molecule | null;
  boundToOperator: boolean;
  onDNA: boolean;
  inside: boolean;
}
type Molecule = Agent<MoleculeData>;
export function create(options: Partial<SwitchParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 121, y: 67, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { color: "#111111", pump: false } });
  world.add(grid);
  let who = 0;
  let energy = 1000;
  let initialEnergy = 1000;
  let divisionCount = 0;
  let cellDivisionTime = 0;
  let ticksAtStartOfCellDivision = 0;
  let inhibited = false;
  let stopped = false;
  let message = "";
  let cellColor = "#976939";
  const history: {
    tick: number;
    energy: number;
    lacZCount: number;
    lacYCount: number;
    divisionCount: number;
    cellDivisionTime: number;
  }[] = [];
  const all = () => world.agents as readonly Molecule[];
  const group = (kind: Molecule["group"]) =>
    all().filter((p) => p.group === kind);
  const shuffled = (values: readonly Molecule[]) =>
    random.sample(values, {
      sampleCount: values.length,
      algorithm: "fisher-yates-descending",
    });
  const cellWall = (x: number, y: number) =>
    (Math.abs(y) === 16 && Math.abs(x) <= 44) ||
    (Math.abs(x) === 44 && Math.abs(y) <= 16);
  const cellInterior = (x: number, y: number) =>
    Math.abs(x) < 44 && Math.abs(y) < 16;
  const promoter = (x: number, y: number) =>
    y >= 0 && y <= 1 && x > -22 && x < -14;
  const operator = (x: number, y: number) =>
    (y === 0 && x > -15 && x < -9) || (y === 1 && [-10, -12, -14].includes(x));
  const terminator = (x: number, y: number) =>
    y >= 0 && y <= 1 && x > 16 && x < 19;
  function fieldAhead(p: Molecule, distance: number) {
    const d = geometry.direction({ heading: p.heading });
    const position = geometry.normalize(
      { x: p.x + d.x * distance, y: p.y + d.y * distance },
      { space, endpoints: "half-open" },
    )!;
    return grid.fieldAt(position)!;
  }
  function genXYInsideInside(p: Molecule) {
    do {
      p.move({
        to: {
          x: -60.5 + random.number() * 121,
          y: -33.5 + random.number() * 67,
        },
      });
    } while (!cellInterior(grid.fieldAt(p)!.x, grid.fieldAt(p)!.y));
  }
  function genXYInsideOutside(p: Molecule) {
    do {
      p.move({
        to: {
          x: -60.5 + random.number() * 121,
          y: -33.5 + random.number() * 67,
        },
      });
    } while (
      cellInterior(grid.fieldAt(p)!.x, grid.fieldAt(p)!.y) ||
      cellWall(grid.fieldAt(p)!.x, grid.fieldAt(p)!.y)
    );
  }
  function addMolecule(kind: Molecule["group"], inside = true) {
    const p: Molecule = world.add(
      Agent.create<MoleculeData>(
        {
          who: who++,
          group: kind,
          partner: null,
          boundToOperator: false,
          onDNA: false,
          inside,
        },
        {
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      ),
    );
    if (inside) genXYInsideInside(p);
    else genXYInsideOutside(p);
    return p;
  }
  function setCellColor(color: string) {
    cellColor = color;
    for (const f of grid.fields)
      if (cellWall(f.x, f.y)) {
        f.color = color;
        f.pump = false;
      }
  }
  function showSwitchColor() {
    const count = group("lacZ").length;
    const color =
      count <= 10
        ? "#ffffff"
        : count <= 20
          ? "#e2f8ff"
          : count <= 30
            ? "#b9e6f6"
            : "#8ad0eb";
    for (const f of grid.fields) {
      if (cellInterior(f.x, f.y)) f.color = color;
      if (f.y >= 0 && f.y <= 1 && f.x > -10 && f.x < 17) f.color = "#3060bc";
      if (promoter(f.x, f.y)) f.color = "#36a25b";
      if (operator(f.x, f.y)) f.color = "#e79531";
      if (terminator(f.x, f.y)) f.color = "#888888";
    }
  }
  function drawCell() {
    for (const f of grid.fields) {
      f.color = "#111111";
      f.pump = false;
    }
    setCellColor("#976939");
    showSwitchColor();
  }
  function updateLactose(upperLimit = 1500) {
    if (!Number.isSafeInteger(upperLimit) || upperLimit < 0)
      throw new RangeError("Lactose upper limit must be nonnegative.");
    const outside = group("lactose").filter((p) => !p.inside);
    if (outside.length > upperLimit)
      for (const p of random.sample(outside, {
        sampleCount: outside.length - upperLimit,
      }))
        p.delete();
    else
      for (let i = outside.length; i < upperLimit; i++)
        addMolecule("lactose", false);
  }
  function record() {
    history.push({
      tick: world.tick.value,
      energy,
      lacZCount: group("lacZ").length,
      lacYCount: group("lacY").length,
      divisionCount: divisionCount,
      cellDivisionTime,
    });
  }
  function setup() {
    for (const p of all()) p.delete();
    world.tick.reset();
    who = 0;
    initialEnergy = 1000;
    energy = initialEnergy;
    divisionCount = 0;
    cellDivisionTime = 0;
    ticksAtStartOfCellDivision = 0;
    inhibited = false;
    stopped = false;
    message = "";
    history.length = 0;
    drawCell();
    for (let i = 0; i < settings.lacICount; i++) addMolecule("lacI");
    for (let i = 0; i < settings.rnapCount; i++) addMolecule("rnap");
    if (!settings.levelSpace && settings.lactose) updateLactose();
    record();
  }
  function reset() {
    settings = parseParameters(inputs, {
      ...settings,
      lacICount: 25,
      rnapCount: 25,
      lacIBondLeakage: 0.02,
      lacILactoseBindingChance: 0.99991,
      lacILactoseSeparationChance: 0.001,
      lacYDegradationChance: 0.0004,
      lacZDegradationChance: 0.0001,
    });
  }
  function move(p: Molecule) {
    p.rotate(random.number() * 360);
    while (
      [1, 2].some((distance) => {
        const f = fieldAhead(p, distance);
        return cellWall(f.x, f.y);
      })
    )
      p.rotate(random.number() * 360);
    p.move(1);
  }
  function dissociateFromOperator(p: Molecule) {
    if (!p.boundToOperator) return;
    p.boundToOperator = false;
    inhibited = false;
    p.move(3);
  }
  function goLacIs() {
    for (const p of shuffled(group("lacI").filter((p) => p.boundToOperator)))
      if (random.number() < settings.lacIBondLeakage) dissociateFromOperator(p);
    for (const p of shuffled(group("lacI").filter((p) => p.partner !== null))) {
      if (random.number() < settings.lacILactoseSeparationChance) {
        const partner = p.partner!;
        partner.partner = null;
        partner.move({ to: p });
        partner.move(1);
        p.partner = null;
        p.move(-1);
      }
    }
    for (const p of shuffled(group("lacI").filter((p) => p.partner === null))) {
      const here = grid.fieldAt(p)!;
      const ahead = fieldAhead(p, 1);
      if (
        !inhibited &&
        (operator(here.x, here.y) || operator(ahead.x, ahead.y))
      ) {
        p.boundToOperator = true;
        inhibited = true;
        p.rotate(-p.heading);
        p.move({ to: { x: -12, y: 1 } });
      } else {
        const freeLactose = group("lactose").filter(
          (q) => q.partner === null && grid.fieldAt(q) === here,
        );
        if (
          freeLactose.length > 0 &&
          random.number() < settings.lacILactoseBindingChance
        ) {
          const partner = random.sample(freeLactose, { sampleCount: 1 })[0]!;
          p.partner = partner;
          partner.partner = p;
          dissociateFromOperator(p);
        }
      }
    }
    for (const p of shuffled(group("lacI").filter((p) => !p.boundToOperator)))
      move(p);
  }
  function goLacYs() {
    for (const p of shuffled(group("lacY"))) {
      const f = fieldAhead(p, 2);
      if (cellWall(f.x, f.y)) {
        f.pump = true;
        f.color = "#e96767";
        p.delete();
      } else move(p);
    }
    for (const f of grid.fields)
      if (f.pump && random.number() < settings.lacYDegradationChance) {
        f.pump = false;
        f.color = cellColor;
      }
  }
  function goLacZs() {
    for (const p of shuffled(
      group("lacZ").filter(
        (p) =>
          p.neighbors({
            radius: 1,
            source: group("lactose").filter((q) => q.partner === null),
          }).length > 0,
      ),
    )) {
      for (const lactose of shuffled(
        p.neighbors({
          radius: 2,
          source: group("lactose").filter((q) => q.partner === null),
        }) as readonly Molecule[],
      )) {
        energy += 10;
        lactose.delete();
      }
    }
    for (const p of shuffled(group("lacZ"))) {
      move(p);
      if (random.number() < settings.lacZDegradationChance) p.delete();
    }
  }
  function goLactoses() {
    for (const p of shuffled(
      group("lactose").filter((p) => !p.inside && fieldAhead(p, 2).pump),
    )) {
      p.move({ to: fieldAhead(p, 2) });
      const heading = (Math.atan2(-p.x, -p.y) * 180) / Math.PI;
      p.rotate(heading - p.heading);
      p.move(3);
      p.inside = true;
    }
    for (const p of shuffled(group("lactose"))) move(p);
  }
  function synthesizeProteins(_parent?: Molecule) {
    for (let i = 0; i < 5; i++) addMolecule("lacY");
    for (let i = 0; i < 5; i++) addMolecule("lacZ");
    energy -= 100;
  }
  function goRNAPs() {
    if (!inhibited)
      for (const p of shuffled(
        group("rnap").filter((p) =>
          [0, 1, 2].some((distance) => {
            const f =
              distance === 0 ? grid.fieldAt(p)! : fieldAhead(p, distance);
            return promoter(f.x, f.y);
          }),
        ),
      )) {
        if (random.number() < (settings.glucose ? 0.1 : 1)) {
          p.move({ to: { x: p.x, y: 1 } });
          p.rotate(90 - p.heading);
          p.onDNA = true;
        }
      }
    for (const p of shuffled(group("rnap").filter((p) => p.onDNA))) {
      p.move(1);
      const f = grid.fieldAt(p)!;
      if (terminator(f.x, f.y)) {
        synthesizeProteins(p);
        p.onDNA = false;
        genXYInsideInside(p);
      }
    }
    for (const p of shuffled(group("rnap").filter((p) => !p.onDNA))) {
      move(p);
      if (Math.abs(p.x) > 41) genXYInsideInside(p);
    }
  }
  function divideCell() {
    const freeInside = group("lactose").filter(
      (p) => p.inside && p.partner === null,
    );
    for (const collection of [freeInside, group("lacY"), group("lacZ")])
      for (const p of random.sample(collection, {
        sampleCount: Math.round(collection.length / 2),
      }))
        p.delete();
    const pumps = grid.fields.filter((f) => f.pump);
    for (const f of random.sample(pumps, {
      sampleCount: Math.round(pumps.length / 2),
    })) {
      f.pump = false;
      f.color = cellColor;
    }
    energy /= 2;
    divisionCount++;
    cellDivisionTime = world.tick.value - ticksAtStartOfCellDivision;
    ticksAtStartOfCellDivision = world.tick.value;
  }
  function go() {
    goLacIs();
    goLacYs();
    goLacZs();
    goLactoses();
    goRNAPs();
    if (settings.glucose) energy += 10;
    energy -=
      (group("rnap").length + group("lacI").length + group("lacZ").length) /
      100;
    if (!settings.levelSpace) {
      if (settings.lactose) updateLactose();
      if (energy > 2 * initialEnergy) divideCell();
      if (energy < 0) {
        stopped = true;
        message = "The cell has run out of energy. It's dead!";
        return;
      }
    }
    showSwitchColor();
  }
  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let i = 0; i < stepCount; i++) {
      if (stopped) break;
      // A source STOP after energy exhaustion retains phase mutations and does not tick.
      go();
      if (stopped) break;
      run(world, () => {});
      record();
    }
  }
  function setParameters(update: Partial<Omit<SwitchParameters, "seed">>) {
    if (Object.hasOwn(update, "seed"))
      throw new TypeError("Seed is setup-only.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }
  function setInitialVariables(values: readonly (number | boolean | string)[]) {
    if (values.length < 10)
      throw new RangeError("LevelSpace handoff requires ten source values.");
    const numberAt = (index: number) => {
      const value = values[index];
      if (typeof value !== "number" || !Number.isFinite(value))
        throw new TypeError("Expected finite handoff number.");
      return value;
    };
    settings = parseParameters(inputs, {
      ...settings,
      levelSpace: true,
      lactose: Boolean(values[8]),
      glucose: Boolean(values[9]),
    });
    setCellColor(String(values[0]));
    initialEnergy = numberAt(1);
    energy = initialEnergy;
    const wall = grid.fields.filter((f) => cellWall(f.x, f.y));
    for (const f of random.sample(wall, { sampleCount: Math.round(numberAt(3)) })) {
      f.pump = true;
      f.color = "#e96767";
    }
    for (let i = 0; i < numberAt(2); i++) addMolecule("lacY");
    for (let i = 0; i < numberAt(4); i++) addMolecule("lacZ");
    for (let i = 0; i < numberAt(6); i++) addMolecule("lactose");
    for (const p of random.sample(group("lacI"), {
      sampleCount: Math.round(numberAt(5)),
    })) {
      const partner = addMolecule("lactose");
      partner.move({ to: p });
      partner.partner = p;
      p.partner = partner;
    }
  }
  function sendVariablesList() {
    return [
      energy,
      group("lacY").length,
      grid.fields.filter((f) => f.pump).length,
      group("lacZ").length,
      group("lacI").filter((p) => p.partner !== null).length,
      group("lactose").filter((p) => p.inside && p.partner === null).length,
      group("lactose").filter((p) => !p.inside).length,
    ];
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 121,
      height: 67,
      stopped,
      message,
      parameters: { ...settings },
      energy,
      initialEnergy,
      divisionCount: divisionCount,
      cellDivisionTime,
      inhibited,
      lacZCount: group("lacZ").length,
      lacYCount: group("lacY").length,
      lacICount: group("lacI").length,
      rnapCount: group("rnap").length,
      lactoseCount: group("lactose").length,
      pumpCount: grid.fields.filter((f) => f.pump).length,
      history: history.map((p) => ({ ...p })),
      cells: grid.fields.map((f) => ({
        id: f.id,
        x: f.x,
        y: f.y,
        color: f.color,
        pump: f.pump,
      })),
      agents: all().map((p) => ({
        id: p.id,
        who: p.who,
        group: p.group,
        x: p.x,
        y: p.y,
        heading: p.heading,
        color:
          p.group === "lacI"
            ? "#d98729"
            : p.group === "rnap"
              ? "#956834"
              : p.group === "lactose"
                ? "#ccccdd"
                : "#e96767",
        size: p.group === "lactose" ? 3 : 5,
        hidden: p.group === "lactose" && p.partner !== null,
        partnerId: p.partner?.id ?? null,
        boundToOperator: p.boundToOperator,
        onDNA: p.onDNA,
        inside: p.inside,
      })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    reset,
    drawCell,
    setCellColor,
    showSwitchColor,
    updateLactose,
    move,
    genXYInsideInside,
    genXYInsideOutside,
    dissociateFromOperator,
    goLacIs,
    goLacYs,
    goLacZs,
    goLactoses,
    goRNAPs,
    synthesizeProteins,
    divideCell,
    go,
    setParameters,
    setInitialVariables,
    sendVariablesList,
    world,
    grid,
  };
}
export const model = {
  title: "Lac Operon Genetic Switch",
  description: "A repressor and lactose switch a bacterium's lac genes on or off.",
  inputs,
  create,
} satisfies Definition<SwitchParameters, ReturnType<typeof create>>;
