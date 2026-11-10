/** CRISPR Bacterium (Wilensky, 2019). Complete notices: NOTICE.md. */
import { Agent, Graph, Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface CRISPRParameters {
  seed: number;
  initialArraySize: number;
  maxVirusTypeCount: number;
  guideUnbindChance: number;
  processivity: number;
  crisprFunction: number;
  labels: boolean;
}
export const inputs: Inputs<CRISPRParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialArraySize: {
    kind: "number",
    default: 15,
    min: 1,
    max: 30,
    integer: true,
  },
  maxVirusTypeCount: {
    kind: "number",
    default: 30,
    min: 1,
    max: 100,
    integer: true,
  },
  guideUnbindChance: { kind: "number", default: 5, min: 0, max: 10 },
  processivity: { kind: "number", default: 80, min: 0, max: 100 },
  crisprFunction: { kind: "number", default: 20, min: 0, max: 100 },
  labels: { kind: "boolean", default: false },
};
type AgentGroup = "rnap" | "cas9" | "guide" | "dimer" | "virus";
type Molecule = Agent<{
  group: AgentGroup;
  sequence: number;
  bound: boolean;
  onDNA: boolean;
  genomeBound: boolean;
}>;
export function create(options: Partial<CRISPRParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 33, y: 17, boundary: "hard" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, {
    state: {
      region: "cytoplasm" as
        | "cytoplasm"
        | "wall"
        | "dna"
        | "crispr"
        | "promoter",
    },
  });
  world.add(grid);
  const bonds = Graph.create<Molecule>();
  for (const field of grid.fields) {
    if (Math.abs(field.x) === 16 || Math.abs(field.y) === 8)
      field.region = "wall";
    if (
      (Math.abs(field.y) === 2 && Math.abs(field.x) <= 10) ||
      (Math.abs(field.x) === 10 && Math.abs(field.y) <= 2)
    )
      field.region = "dna";
    if (field.y === 0 && Math.abs(field.x) <= 2)
      field.region = field.x === -2 ? "promoter" : "crispr";
  }
  let array: number[] = [];
  let virusEvent = "";
  let stopped = false;
  let followingId: string | null = null;
  const history: {
    tick: number;
    cas9Count: number;
    guideCount: number;
    dimerCount: number;
    virusCount: number;
    spacerCount: number;
  }[] = [];
  const all = () => world.agents as readonly Molecule[];
  const group = (kind: AgentGroup) =>
    all().filter((molecule) => molecule.group === kind);
  const shuffled = (molecules: readonly Molecule[]) =>
    random.sample(molecules, {
      sampleCount: molecules.length,
      algorithm: "fisher-yates-descending",
    });
  const integer = (upper: number) =>
    random.number({ min: 0, max: upper, integer: true });
  const cellWall = grid.fields.filter((field) => field.region === "wall");
  const crisprFields = grid.fields.filter(
    (field) => field.region === "crispr" || field.region === "promoter",
  );
  function dnaFields() {
    return grid.fields.filter((field) => field.region === "dna");
  }
  function addMolecule(
    kind: AgentGroup,
    x = 0,
    y = 0,
    sequence = 0,
    heading = integer(360),
  ) {
    const molecule = world.add(
      Agent.create(
        {
          group: kind,
          sequence,
          bound: false,
          onDNA: false,
          genomeBound: false,
        },
        { position: { x, y }, orientation: { heading } },
      ),
    );
    bonds.nodes.add(molecule);
    return molecule;
  }
  function forward(molecule: Molecule, distance: number) {
    const direction = geometry.direction({ heading: molecule.heading });
    if (
      !geometry.normalize(
        {
          x: molecule.x + direction.x * distance,
          y: molecule.y + direction.y * distance,
        },
        { space, endpoints: "half-open" },
      )
    )
      return;
    const partner = bonds.neighbors(molecule)[0];
    molecule.move(distance);
    // These two molecular complexes are co-located; no general rigid-body/tie engine is introduced.
    if (partner) partner.move({ to: { x: molecule.x, y: molecule.y } });
  }
  function fieldAhead(molecule: Molecule, distance: number) {
    const direction = geometry.direction({ heading: molecule.heading });
    return grid.fieldAt({
      x: molecule.x + direction.x * distance,
      y: molecule.y + direction.y * distance,
    });
  }
  function wallAhead(molecule: Molecule) {
    return (
      fieldAhead(molecule, 1)?.region === "wall" ||
      fieldAhead(molecule, 2)?.region === "wall"
    );
  }
  function move(molecule: Molecule, speed = 1) {
    molecule.rotate(random.number() * 360);
    while (wallAhead(molecule)) molecule.rotate(random.number() * 360);
    forward(molecule, speed);
  }
  function transcribe(polymerase: Molecule) {
    const cas9 = addMolecule("cas9", 0, 0, 0, polymerase.heading);
    for (let index = 0; index < 5; index++) move(cas9);
    if (random.number() < 0.25) {
      const dimer = addMolecule("dimer", 0, 0, 0, polymerase.heading);
      for (let index = 0; index < 5; index++) move(dimer);
    }
    for (const spacer of array) {
      const guide = addMolecule("guide", 0, 0, spacer, polymerase.heading);
      for (let index = 0; index < 5; index++) move(guide);
      if (random.number() * 100 > settings.processivity) break;
    }
  }
  function goRNAPs(polymerase: Molecule) {
    if (polymerase.onDNA) {
      forward(polymerase, 1);
      const field = grid.fieldAt(polymerase)!;
      if (field.region !== "crispr" && field.region !== "promoter") {
        polymerase.onDNA = false;
        transcribe(polymerase);
      }
    } else {
      move(polymerase);
      if (
        grid.fieldAt(polymerase)!.region === "promoter" &&
        random.number() * 100 < settings.crisprFunction
      ) {
        polymerase.onDNA = true;
        const field = grid.fieldAt(polymerase)!;
        polymerase.move({ to: { x: field.x, y: field.y } });
        polymerase.rotate(90 - polymerase.heading);
      }
    }
  }
  function goCas9s(cas9: Molecule) {
    if (cas9.bound) {
      const virusesHere = group("virus").filter(
        (virus) => grid.fieldAt(virus) === grid.fieldAt(cas9),
      );
      if (virusesHere.some((virus) => !virus.bound)) {
        // Native eligibility tests unbound existence, then samples all viruses on the field.
        const virus = random.sample(virusesHere)[0]!;
        const guide = bonds.neighbors(cas9)[0];
        if (!guide) throw new Error("Source bound Cas9 has no guide partner.");
        if (guide.sequence === virus.sequence) {
          virusEvent = `Virus ${virus.sequence} was cleaved by cas9.`;
          virus.delete();
        }
      }
      if (random.number() * 100 < settings.guideUnbindChance) {
        const guide = bonds.neighbors(cas9)[0];
        for (const edge of [...bonds.edges])
          if (edge.from === cas9 || edge.to === cas9) edge.delete();
        cas9.bound = false;
        if (guide) {
          guide.bound = false;
          move(guide);
        }
      }
    }
    move(cas9);
    if (!cas9.bound) {
      const guide = random.sample(
        group("guide").filter(
          (guide) => !guide.bound && grid.fieldAt(guide) === grid.fieldAt(cas9),
        ),
      )[0];
      if (guide) {
        cas9.move({ to: { x: guide.x, y: guide.y } });
        bonds.edges.add({ from: cas9, to: guide });
        cas9.bound = true;
        guide.bound = true;
      }
    }
  }
  function goGuideRNAs(guide: Molecule) {
    if (!guide.bound) move(guide);
  }
  function goCasDimers(dimer: Molecule) {
    if (dimer.bound) {
      dimer.rotate({ towards: random.sample(crisprFields)[0]! });
      forward(dimer, 1);
      if (crisprFields.includes(grid.fieldAt(dimer)!)) {
        const virus = bonds.neighbors(dimer)[0];
        if (!virus)
          throw new Error("Source bound Cas1/2 has no virus partner.");
        array.unshift(virus.sequence);
        virusEvent = `Virus ${virus.sequence} was added to the array.`;
        virus.delete();
        dimer.bound = false;
      }
    } else {
      move(dimer);
      const virus = random.sample(
        group("virus").filter(
          (virus) =>
            !virus.bound && grid.fieldAt(virus) === grid.fieldAt(dimer),
        ),
      )[0];
      if (virus) {
        dimer.move({ to: { x: virus.x, y: virus.y } });
        bonds.edges.add({ from: dimer, to: virus });
        dimer.bound = true;
        virus.bound = true;
        virusEvent = `Virus ${virus.sequence} was bound by cas1/2.`;
      }
    }
  }
  function goViruses(virus: Molecule) {
    if (!virus.bound) {
      virus.rotate({ towards: random.sample(dnaFields())[0]! });
      forward(virus, 0.05);
      if (grid.fieldAt(virus)!.region === "dna") {
        const field = grid.fieldAt(virus)!;
        virus.move({ to: { x: field.x, y: field.y } });
        virus.genomeBound = true;
        virus.bound = true;
        virusEvent = `Virus ${virus.sequence} infected the genome.`;
        followingId = virus.id;
      }
    }
  }
  function degradeMolecule(molecule: Molecule) {
    if (molecule.bound)
      for (const partner of bonds.neighbors(molecule)) partner.bound = false;
    molecule.delete();
  }
  function degrade() {
    for (const molecule of shuffled(
      all().filter(
        (molecule) => molecule.group === "cas9" || molecule.group === "guide",
      ),
    ))
      if (random.number() * 100 < 0.05) degradeMolecule(molecule);
    for (const virus of shuffled(group("virus")))
      if (random.number() * 100 < 0.5) {
        virusEvent = `Virus ${virus.sequence} was degraded by innate resistance.`;
        degradeMolecule(virus);
      }
    for (const dimer of shuffled(group("dimer")))
      if (random.number() * 100 < 0.2) degradeMolecule(dimer);
    if (random.number() * 100 < 0.001 && array.length)
      array.splice(integer(array.length), 1);
  }
  function infect(sequence: number) {
    if (!Number.isSafeInteger(sequence) || sequence < 0)
      throw new RangeError("Virus sequence must be a nonnegative integer.");
    const wall = random.sample(cellWall)[0]!;
    addMolecule("virus", wall.x, wall.y, sequence);
    virusEvent = `Virus ${sequence} invaded the cell.`;
  }
  function randomInfection() {
    infect(integer(settings.maxVirusTypeCount));
  }
  function commonInfection() {
    const counts = [...new Set(array)]
      .map((sequence) => ({
        sequence,
        count: group("guide").filter((guide) => guide.sequence === sequence)
          .length,
      }))
      .sort((a, b) => b.count - a.count);
    const frontRange = Math.ceil((settings.processivity / 200) * array.length);
    if (frontRange > counts.length)
      throw new RangeError(
        "Source common-infection sublist exceeds unique guide sequences.",
      );
    const choice = random.sample(counts.slice(0, frontRange))[0];
    if (!choice)
      throw new RangeError(
        "Source common-infection cannot select from an empty prefix.",
      );
    infect(choice.sequence);
  }
  function infected() {
    return group("virus").some((virus) => virus.genomeBound);
  }
  function updateLabels() {
    return settings.labels;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      cas9Count: group("cas9").length,
      guideCount: group("guide").length,
      dimerCount: group("dimer").length,
      virusCount: group("virus").length,
      spacerCount: array.length,
    });
    if (history.length > 2001) history.shift();
  }
  function go() {
    updateLabels();
    if (infected()) {
      stopped = true;
      return;
    }
    run(
      world,
      () => {
        for (const molecule of shuffled(group("rnap"))) goRNAPs(molecule);
        for (const molecule of shuffled(group("cas9"))) goCas9s(molecule);
        for (const molecule of shuffled(group("guide"))) goGuideRNAs(molecule);
        for (const molecule of shuffled(group("dimer"))) goCasDimers(molecule);
        for (const molecule of shuffled(group("virus"))) goViruses(molecule);
        degrade();
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
    update: Partial<Omit<CRISPRParameters, "seed" | "initialArraySize">>,
  ) {
    if (
      Object.keys(update).some(
        (key) => key === "seed" || key === "initialArraySize",
      )
    )
      throw new TypeError("Setup parameters require a new model.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }
  function read() {
    const color = {
      rnap: "#a76c37",
      cas9: "#3ca34d",
      guide: "#4ac6ae",
      dimer: "#ed9437",
      virus: "#e43838",
    };
    return {
      tick: world.tick.value,
      width: 33,
      height: 17,
      parameters: { ...settings },
      array: [...array],
      virusEvent,
      stopped,
      infected: infected(),
      followingId,
      rnapCount: group("rnap").length,
      cas9Count: group("cas9").length,
      guideCount: group("guide").length,
      dimerCount: group("dimer").length,
      virusCount: group("virus").length,
      agents: all().map((molecule) => ({
        id: molecule.id,
        group: molecule.group,
        x: molecule.x,
        y: molecule.y,
        heading: molecule.heading,
        sequence: molecule.sequence,
        bound: molecule.bound,
        onDNA: molecule.onDNA,
        genomeBound: molecule.genomeBound,
        color: color[molecule.group],
        size: 1,
        label:
          settings.labels &&
          (molecule.group === "guide" || molecule.group === "virus")
            ? String(molecule.sequence)
            : "",
      })),
      cells: grid.fields
        .filter((field) => field.region !== "cytoplasm")
        .map((field) => ({
          id: field.id,
          x: field.x,
          y: field.y,
          region: field.region,
          color:
            field.region === "wall"
              ? "#888888"
              : field.region === "dna"
                ? "#3657ce"
                : field.region === "promoter"
                  ? "#39d8eb"
                  : "#7ac7ed",
        })),
      edges: [...bonds.edges].map((edge) => ({
        id: edge.id,
        from: edge.from.id,
        to: edge.to.id,
      })),
      guideSequences: group("guide").map((guide) => guide.sequence),
      history: history.map((point) => ({ ...point })),
    };
  }
  array = Array.from({ length: settings.initialArraySize }, () =>
    integer(settings.maxVirusTypeCount),
  );
  for (let index = 0; index < 25; index++) addMolecule("rnap");
  for (const polymerase of shuffled(group("rnap")))
    for (let index = 0; index < 5; index++)
      if (random.number() * 100 < settings.crisprFunction)
        transcribe(polymerase);
  for (
    let index = 0;
    index < Math.round((125 * settings.crisprFunction) / 8);
    index++
  )
    degrade();
  for (const molecule of shuffled(all())) {
    do {
      molecule.move({
        to: { x: random.number() * 33 - 16.5, y: random.number() * 17 - 8.5 },
      });
    } while (grid.fieldAt(molecule)!.region === "wall");
  }
  record();
  return {
    read,
    advance,
    go,
    setParameters,
    infect,
    randomInfection,
    commonInfection,
    transcribe,
    goRNAPs,
    goCas9s,
    goGuideRNAs,
    goCasDimers,
    goViruses,
    move,
    wallAhead,
    degrade,
    infected,
    dnaFields,
    updateLabels,
  };
}
export const model: Definition<CRISPRParameters, ReturnType<typeof create>> = {
  title: "CRISPR Bacterium",
  description:
    "Intracellular guide recognition, spacer acquisition and viral invasion.",
  inputs,
  create,
};
