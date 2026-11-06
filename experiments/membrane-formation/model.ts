/** NetLogo Membrane Formation (Wilensky, 2013). Complete notices: NOTICE.md. */
import { Agent, Graph, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface MembraneParameters {
  seed: number;
  numWater: number;
  numLipids: number;
  waterWaterForce: number;
  waterOilForce: number;
  tooCloseForce: number;
  randomForce: number;
}
export const inputs: Inputs<MembraneParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  numWater: { kind: "number", default: 750, min: 0, max: 1000, integer: true },
  numLipids: { kind: "number", default: 250, min: 1, max: 500, integer: true },
  waterWaterForce: { kind: "number", default: 0.2, min: 0, max: 2 },
  waterOilForce: { kind: "number", default: -0.7, min: -2, max: 0 },
  tooCloseForce: { kind: "number", default: -0.3, min: -2, max: 0 },
  randomForce: { kind: "number", default: 0.1, min: 0, max: 1 },
};
type Molecule = Agent<{ breed: "water" | "oil"; hydrophilic: boolean }>;
export function create(options: Partial<MembraneParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const world = World.add({ x: 51, y: 51, boundary: "wrap" }, { random });
  const links = Graph.add<Molecule>();
  const molecules = () => world.agents as readonly Molecule[];
  const history: { tick: number; hydrophobicIsolation: number }[] = [];

  function setupMolecules() {
    for (
      let index = 0;
      index < settings.numWater + settings.numLipids;
      index++
    ) {
      const water = Agent.add(
        { breed: "water" as const, hydrophilic: false },
        {
          position: {
            x: random.number() * 51 - 25.5,
            y: random.number() * 51 - 25.5,
          },
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      );
      world.add(water);
      links.nodes.add(water);
    }
    for (let index = 0; index < settings.numLipids; index++) {
      const partner = random.sample(
        molecules().filter(
          (molecule) =>
            molecule.breed === "water" &&
            links.neighbors(molecule).length === 0,
        ),
      )[0]!;
      const oil = Agent.add(
        { breed: "oil" as const, hydrophilic: false },
        {
          position: partner,
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      );
      world.add(oil);
      links.nodes.add(oil);
      oil.move(2);
      links.edges.add({ from: oil, to: partner });
      partner.hydrophilic = true;
    }
  }
  function interactWithNeighbor(molecule: Molecule) {
    const near = random.sample(
      molecule
        .neighbors({ radius: 4, source: molecules() })
        .filter((candidate) => !links.hasEdge(molecule, candidate)),
    )[0];
    if (!near) return;
    molecule.rotate({ towards: near });
    molecule.move(
      near.breed === molecule.breed
        ? settings.waterWaterForce
        : settings.waterOilForce,
    );
  }
  function repelTooCloseNeighbor(molecule: Molecule) {
    const near = random.sample(
      molecule.neighbors({ radius: 1.3, source: molecules() }),
    )[0];
    if (!near) return;
    molecule.rotate({ towards: near });
    molecule.move(settings.tooCloseForce);
  }
  function interactWithPartner(molecule: Molecule) {
    const partner = random.sample(links.neighbors(molecule))[0];
    if (partner) {
      molecule.rotate({ towards: partner });
      molecule.move(molecule.distanceTo(partner) - 2);
    }
    molecule.rotate(-random.number({ min: 0, max: 360, integer: true }));
    molecule.move(settings.randomForce);
  }
  function hydrophobicIsolation() {
    const oils = molecules().filter((molecule) => molecule.breed === "oil");
    return stats.describe(
      oils.map((oil) => {
        // NetLogo in-radius includes self. Its denominator excludes only the linked partner.
        const neighbors = [
          oil,
          ...oil.neighbors({ radius: 4, source: molecules() }),
        ];
        const numerator = neighbors.filter(
          (molecule) => molecule.breed === "oil",
        ).length;
        const denominator = neighbors.filter(
          (molecule) => !links.hasEdge(oil, molecule),
        ).length;
        return numerator / denominator;
      }),
    ).mean!;
  }
  function record() {
    history.push({
      tick: world.tick.value,
      hydrophobicIsolation: hydrophobicIsolation(),
    });
    if (history.length > 1001) history.splice(1, 1);
  }
  function go() {
    for (const molecule of random.sample(molecules(), {
      count: molecules().length,
      compatibility: "legacy-shuffle",
    })) {
      interactWithNeighbor(molecule);
      repelTooCloseNeighbor(molecule);
      interactWithPartner(molecule);
    }
  }
  function advance(count = 1) {
    stepCount(count);
    for (let index = 0; index < count; index++) {
      run(world, go);
      record();
    }
  }
  function setParameters(
    update: Partial<
      Omit<MembraneParameters, "seed" | "numWater" | "numLipids">
    >,
  ) {
    if (
      Object.keys(update).some(
        (key) =>
          ![
            "waterWaterForce",
            "waterOilForce",
            "tooCloseForce",
            "randomForce",
          ].includes(key),
      )
    )
      throw new TypeError("Only forces are live.");
    settings = parameters(inputs, { ...settings, ...update });
  }
  function read() {
    return {
      tick: world.tick.value,
      width: 51,
      height: 51,
      parameters: { ...settings },
      hydrophobicIsolation: hydrophobicIsolation(),
      agents: molecules().map((molecule) => ({
        id: molecule.id,
        x: molecule.x,
        y: molecule.y,
        heading: molecule.heading,
        breed: molecule.breed,
        hydrophilic: molecule.hydrophilic,
        color:
          molecule.breed === "oil"
            ? "#ed9228"
            : molecule.hydrophilic
              ? "#b94be0"
              : "#357be5",
        size: 1,
      })),
      links: [...links.edges].map((edge) => ({
        id: edge.id,
        oilId: edge.from.id,
        waterId: edge.to.id,
        from: { x: edge.from.x, y: edge.from.y },
        to: { x: edge.to.x, y: edge.to.y },
      })),
      history: history.map((point) => ({ ...point })),
    };
  }
  setupMolecules();
  record();
  return {
    advance,
    read,
    setParameters,
    setupMolecules,
    interactWithNeighbor,
    repelTooCloseNeighbor,
    interactWithPartner,
    hydrophobicIsolation,
    go,
  };
}
export const model = {
  title: "Membrane Formation",
  inputs,
  create,
} satisfies Definition<MembraneParameters, ReturnType<typeof create>>;
