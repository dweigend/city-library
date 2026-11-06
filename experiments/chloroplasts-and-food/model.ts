/** NetLogo Chloroplasts and Food (Novak, Penuel and Wilensky, 2016). See NOTICE.md. */
import { Agent, Graph, Grid, Random, World, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface ChloroplastParameters {
  seed: number;
  initialChloroplasts: number;
  initialCarbonDioxide: number;
  waterflowThroughLeaf: number;
  intensityOfLight: number;
  autoStop: boolean;
  stopAt: number;
}
export const inputs: Inputs<ChloroplastParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  initialChloroplasts: {
    kind: "number",
    default: 3,
    min: 0,
    max: 6,
    integer: true,
  },
  initialCarbonDioxide: {
    kind: "number",
    default: 100,
    min: 0,
    max: 200,
    integer: true,
  },
  waterflowThroughLeaf: { kind: "number", default: 25, min: 0, max: 50 },
  intensityOfLight: { kind: "number", default: 50, min: 0, max: 100 },
  autoStop: { kind: "boolean", default: false },
  stopAt: { kind: "number", default: 2000, min: 100, max: 5000 },
};
type Breed =
  | "co2"
  | "o2"
  | "water"
  | "sugar"
  | "photon"
  | "chloroplast"
  | "atp"
  | "carbon"
  | "flow";
type Molecule = Agent<{
  who: number;
  breed: Breed;
  chloroplastId: string;
  pair: number;
  charged: boolean;
  hidden: boolean;
}>;
export function create(options: Partial<ChloroplastParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 28, y: 19, boundary: "wrap" } as const;
  const world = World.add(space, { random });
  const grid = Grid.add(space, { state: { region: 0 } });
  world.add(grid);
  const flowEdges = Graph.add<Molecule>();
  let nextWho = 0;
  let glucoseProduced = 0;
  let carbonDioxide = 0;
  let oxygen = 0;
  const history: {
    tick: number;
    carbonDioxide: number;
    oxygen: number;
    glucoseProduced: number;
  }[] = [];
  const all = () => world.agents as readonly Molecule[];
  const ofBreed = (breed: Breed) =>
    all().filter((molecule) => molecule.breed === breed);
  const shuffled = (source: readonly Molecule[]) =>
    random.sample(source, {
      count: source.length,
      compatibility: "legacy-shuffle",
    });

  function createMolecule(
    breed: Breed,
    sourceX = 0,
    y = 0,
    heading = random.number({ min: 0, max: 360, integer: true }),
  ) {
    return world.add(
      Agent.add(
        {
          who: nextWho++,
          breed,
          chloroplastId: "",
          pair: 0,
          charged: false,
          hidden: false,
        },
        {
          position: geometry.normalize(
            { x: sourceX - 4.5, y },
            { space, endpoints: "half-open" },
          )!,
          orientation: { heading },
        },
      ),
    );
  }

  function makeSystemBoundary() {
    for (const field of grid.fields) {
      const x = field.x + 4.5;
      if (x === -9 || (x >= -9 && x < 10 && field.y === 9)) field.region = 3;
      else if (x > -9 && x < 10 && field.y !== 9) field.region = 4;
      else if (x === 10 || (x >= -9 && x < 10 && field.y === -9))
        field.region = 5;
      else if (x > 10) field.region = 6;
      else field.region = 0;
    }
  }

  function makeInitialChloroplasts() {
    const offset = random.number({ min: 0, max: 360, integer: true });
    const divider = 360 / settings.initialChloroplasts;
    for (let index = 0; index < settings.initialChloroplasts; index++) {
      const jitterBound = Math.ceil(divider / 3);
      const heading =
        offset +
        index * divider +
        random.number({ min: 0, max: jitterBound, integer: true }) -
        random.number({ min: 0, max: jitterBound, integer: true });
      const chloroplast = createMolecule("chloroplast", 0, 0, heading);
      chloroplast.move(3.5 + random.number() * 3.5);
    }
    for (const chloroplast of shuffled(ofBreed("chloroplast"))) {
      const atpOffset = random.number({ min: 0, max: 60, integer: true });
      chloroplast.rotate(-chloroplast.heading);
      for (let index = 0; index < 6; index++) {
        const site = createMolecule(
          "atp",
          chloroplast.x + 4.5,
          chloroplast.y,
          atpOffset + index * 60,
        );
        site.chloroplastId = chloroplast.id;
        site.pair = Math.floor(index / 2);
        site.hidden = true;
      }
    }
  }

  function setup() {
    world.delete(all());
    flowEdges.delete();
    nextWho = 0;
    glucoseProduced = 0;
    makeSystemBoundary();
    for (let index = 0; index < settings.initialCarbonDioxide; index++) {
      createMolecule(
        "co2",
        -10 + random.number() * 20,
        random.number({ min: 0, max: 20, integer: true }),
      );
    }
    if (settings.initialChloroplasts > 0) makeInitialChloroplasts();
    const flow = createMolecule("flow", 0, 0, 90);
    flow.hidden = true;
    flowEdges.nodes.add(flow);
    world.tick.reset();
    updateCounts();
    history.length = 0;
    record();
  }

  function doPhotonFlow() {
    if (
      settings.intensityOfLight >
      random.number({ min: 0, max: 100, integer: true })
    ) {
      const field = random.sample(
        grid.fields.filter((field) => field.region === 3),
      )[0]!;
      const photon = createMolecule("photon", field.x + 4.5, field.y, 135);
      photon.hidden = true;
    }
    for (const photon of shuffled(ofBreed("photon"))) {
      photon.move(0.15);
      if (grid.fieldAt(photon)!.region === 5) photon.delete();
      else if (grid.fieldAt(photon)!.x + 4.5 >= -9.6) photon.hidden = false;
    }
  }

  function wiggle(molecule: Molecule) {
    molecule.rotate(random.number({ min: 0, max: 10, integer: true }));
    molecule.rotate(-random.number({ min: 0, max: 10, integer: true }));
  }

  function doWaterAndSugarFlow() {
    if (
      settings.waterflowThroughLeaf >
        random.number({ min: 0, max: 100, integer: true }) &&
      random.number({ min: 0, max: 3, integer: true }) === 0
    ) {
      const field = random.sample(
        grid.fields.filter(
          (field) => field.region === 3 && field.x + 4.5 === -9,
        ),
      )[0]!;
      const water = createMolecule("water", field.x + 4.5, field.y);
      water.hidden = true;
      flowEdges.nodes.add(water);
      flowEdges.edges.add({
        from: ofBreed("flow")[0]!,
        to: water,
        directed: true,
      });
    }
    for (const molecule of shuffled(
      all().filter(
        (molecule) => molecule.breed === "water" || molecule.breed === "sugar",
      ),
    )) {
      molecule.move(0.04);
      wiggle(molecule);
      if (grid.fieldAt(molecule)!.x + 4.5 >= 10) molecule.delete();
    }
  }

  function doGasFlow() {
    for (const molecule of shuffled(
      all().filter(
        (molecule) => molecule.breed === "co2" || molecule.breed === "o2",
      ),
    )) {
      molecule.move(0.04);
      if (molecule.x + 4.5 > 10)
        molecule.move({ to: { x: -13.5, y: molecule.y } });
      if (molecule.x + 4.5 < -9)
        molecule.move({ to: { x: 5.5, y: molecule.y } });
    }
  }

  function updateADPATPs() {
    for (const site of shuffled(
      ofBreed("atp").filter((site) => !site.charged),
    )) {
      const waters = site.neighbors({ source: ofBreed("water"), radius: 2 });
      const photons = site.neighbors({ source: ofBreed("photon"), radius: 2 });
      const both = ofBreed("atp").filter(
        (other) =>
          other.pair === site.pair &&
          other.chloroplastId === site.chloroplastId &&
          !other.charged,
      );
      const otherCharged = ofBreed("atp").some(
        (other) =>
          other.pair !== site.pair &&
          other.chloroplastId === site.chloroplastId &&
          other.charged,
      );
      if (
        photons.length > 0 &&
        waters.length >= 2 &&
        !otherCharged &&
        both.length === 2
      ) {
        for (const water of random.sample(waters, { count: 2 })) water.delete();
        const gas = createMolecule("o2", site.x + 4.5, site.y);
        gas.hidden = site.hidden;
        site.hidden = false;
        for (const member of shuffled(both)) {
          member.hidden = false;
          member.charged = true;
        }
      }
    }
    for (const site of shuffled(ofBreed("atp"))) {
      for (const photon of site.neighbors({
        source: ofBreed("photon"),
        radius: 2,
      }))
        photon.delete();
    }
    for (const site of shuffled(
      ofBreed("atp").filter((site) => site.charged),
    )) {
      const both = ofBreed("atp").filter(
        (other) =>
          !other.hidden &&
          other.pair === site.pair &&
          other.chloroplastId === site.chloroplastId &&
          other.charged,
      );
      if (both.length !== 2) continue;
      const carbonDioxides = site.neighbors({
        source: ofBreed("co2"),
        radius: 2,
      });
      if (carbonDioxides.length < 2) continue;
      const otherSite = both.find((other) => other !== site)!;
      const chosen = random.sample(carbonDioxides, { count: 2 });
      for (const [index, carbon] of chosen.entries()) {
        const destination = index === 0 ? site : otherSite;
        carbon.rotate(destination.heading - carbon.heading);
        carbon.move({ to: { x: destination.x, y: destination.y } });
        carbon.breed = "carbon";
        carbon.chloroplastId = site.chloroplastId;
      }
      createMolecule("o2", site.x + 4.5, site.y);
      for (const member of both) member.charged = false;
    }
    for (const site of ofBreed("atp")) {
      site.hidden = !site.charged;
      if (site.charged) {
        // Source color and electric-shape draws affect subsequent stochastic calls.
        random.number();
        random.number({ min: 0, max: 10, integer: true });
      }
    }
  }

  function updateChloroplasts() {
    for (const chloroplast of shuffled(ofBreed("chloroplast"))) {
      const complexes = ofBreed("carbon").filter(
        (carbon) => carbon.chloroplastId === chloroplast.id,
      );
      if (complexes.length !== 6) continue;
      for (const carbon of complexes) carbon.delete();
      const sugar = createMolecule("sugar", chloroplast.x + 4.5, chloroplast.y);
      flowEdges.nodes.add(sugar);
      flowEdges.edges.add({
        from: ofBreed("flow")[0]!,
        to: sugar,
        directed: true,
      });
      glucoseProduced++;
      for (const site of ofBreed("atp").filter(
        (site) => site.chloroplastId === chloroplast.id,
      )) {
        site.hidden = true;
        site.charged = false;
      }
    }
  }

  function updateCounts() {
    carbonDioxide = ofBreed("co2").length;
    oxygen = ofBreed("o2").length;
  }
  function go() {
    for (const molecule of all().filter((molecule) =>
      ["co2", "o2", "water", "sugar", "photon"].includes(molecule.breed),
    ))
      molecule.hidden = grid.fieldAt(molecule)!.region !== 4;
    doPhotonFlow();
    doWaterAndSugarFlow();
    doGasFlow();
    for (const flow of ofBreed("flow")) {
      flow.move(0.05);
      for (const molecule of flowEdges.neighbors(flow, { direction: "out" }))
        molecule.move({ by: { x: 0.05, y: 0 } });
    }
    updateADPATPs();
    updateChloroplasts();
    updateCounts();
  }
  function record() {
    history.push({
      tick: world.tick.value,
      carbonDioxide,
      oxygen,
      glucoseProduced,
    });
    if (history.length > 2001) history.splice(1, 1);
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      if (settings.autoStop && world.tick.value >= settings.stopAt) break;
      run(world, go);
      record();
    }
  }
  function setParameters(
    update: Partial<
      Pick<
        ChloroplastParameters,
        "waterflowThroughLeaf" | "intensityOfLight" | "autoStop" | "stopAt"
      >
    >,
  ) {
    if (
      Object.keys(update).some(
        (key) =>
          ![
            "waterflowThroughLeaf",
            "intensityOfLight",
            "autoStop",
            "stopAt",
          ].includes(key),
      )
    )
      throw new TypeError("Only live parameters may change.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    const agents = all().map((molecule) => ({
      id: molecule.id,
      who: molecule.who,
      breed: molecule.breed,
      x: molecule.x,
      y: molecule.y,
      heading: molecule.heading,
      hidden: molecule.hidden,
      charged: molecule.charged,
      chloroplastId: molecule.chloroplastId,
      pair: molecule.pair,
      color:
        molecule.breed === "chloroplast"
          ? "#00c800"
          : molecule.breed === "photon"
            ? "#ffe45e"
            : molecule.breed === "o2"
              ? "#ef4545"
              : molecule.breed === "water"
                ? "#6cc0ff"
                : molecule.breed === "atp"
                  ? "#ffb649"
                  : "#222222",
    }));
    return {
      tick: world.tick.value,
      width: 28,
      height: 19,
      parameters: { ...settings },
      stopped: settings.autoStop && world.tick.value >= settings.stopAt,
      carbonDioxide,
      oxygen,
      glucoseProduced,
      agents,
      flowEdges: [...flowEdges.edges].map((edge) => ({
        id: edge.id,
        from: edge.from.id,
        to: edge.to.id,
      })),
      chloroplasts: agents.filter(
        (molecule) => molecule.breed === "chloroplast",
      ),
      atpSites: agents.filter((molecule) => molecule.breed === "atp"),
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        region: field.region,
        color: field.region === 4 ? "#97c8ef" : "#b4b4b4",
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    go,
    makeSystemBoundary,
    makeInitialChloroplasts,
    doPhotonFlow,
    doWaterAndSugarFlow,
    doGasFlow,
    wiggle,
    updateADPATPs,
    updateChloroplasts,
    updateCounts,
    setParameters,
  };
}
export const model = {
  title: "Chloroplasts and Food",
  inputs,
  create,
} satisfies Definition<ChloroplastParameters, ReturnType<typeof create>>;
