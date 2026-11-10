/** NetLogo Membrane Formation (Wilensky, 2013). Complete notices: NOTICE.md. */
import { Agent, Graph, Random, World, run, stats } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface MembraneParameters {
  seed: number;
  waterCount: number;
  lipidCount: number;
  waterWaterForce: number;
  waterOilForce: number;
  tooCloseForce: number;
  randomForce: number;
}
export const inputs: Inputs<MembraneParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  waterCount: { kind: "number", default: 750, min: 0, max: 1000, integer: true },
  lipidCount: { kind: "number", default: 250, min: 1, max: 500, integer: true },
  waterWaterForce: { kind: "number", default: 0.2, min: 0, max: 2 },
  waterOilForce: { kind: "number", default: -0.7, min: -2, max: 0 },
  tooCloseForce: { kind: "number", default: -0.3, min: -2, max: 0 },
  randomForce: { kind: "number", default: 0.1, min: 0, max: 1 },
};
type Molecule = Agent<{ group: "water" | "oil"; hydrophilic: boolean }>;
export function create(options: Partial<MembraneParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ x: 51, y: 51, boundary: "wrap" }, { random });
  const graph = Graph.create<Molecule>();
  const molecules = () => world.agents as readonly Molecule[];
  const history: { tick: number; hydrophobicIsolation: number }[] = [];

  function setupMolecules() {
    for (
      let index = 0;
      index < settings.waterCount + settings.lipidCount;
      index++
    ) {
      const water = Agent.create(
        { group: "water" as const, hydrophilic: false },
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
      graph.nodes.add(water);
    }
    for (let index = 0; index < settings.lipidCount; index++) {
      const partner = random.sample(
        molecules().filter(
          (molecule) =>
            molecule.group === "water" &&
            graph.neighbors(molecule).length === 0,
        ),
      )[0]!;
      const oil = Agent.create(
        { group: "oil" as const, hydrophilic: false },
        {
          position: partner,
          orientation: {
            heading: random.number({ min: 0, max: 360, integer: true }),
          },
        },
      );
      world.add(oil);
      graph.nodes.add(oil);
      oil.move(2);
      graph.edges.add({ from: oil, to: partner });
      partner.hydrophilic = true;
    }
  }
  /** Positions of the population during one `go` sweep; only the active molecule moves. */
  let sweepPositions: Map<Molecule, { x: number; y: number }> | undefined;
  /** Cheap wrapped bounding-box prefilter. It keeps world order and every molecule
   * that `neighbors` could accept, so the exact radius test and random draws are unchanged. */
  function moleculesNear(molecule: Molecule, radius: number) {
    const worldSize = 51;
    const wrappedOffset = (a: number, b: number) => {
      const offset = Math.abs(a - b) % worldSize;
      return Math.min(offset, worldSize - offset);
    };
    const bound = radius + 1e-9;
    const { x, y } = molecule;
    const population = sweepPositions ? [...sweepPositions.keys()] : molecules();
    return population.filter((candidate) => {
      const position = sweepPositions?.get(candidate) ?? candidate;
      return wrappedOffset(position.x, x) <= bound && wrappedOffset(position.y, y) <= bound;
    });
  }
  function interactWithNeighbor(molecule: Molecule) {
    const near = random.sample(
      molecule
        .neighbors({ radius: 4, source: moleculesNear(molecule, 4) })
        .filter((candidate) => !graph.hasEdge(molecule, candidate)),
    )[0];
    if (!near) return;
    molecule.rotate({ towards: near });
    molecule.move(
      near.group === molecule.group
        ? settings.waterWaterForce
        : settings.waterOilForce,
    );
  }
  function repelTooCloseNeighbor(molecule: Molecule) {
    const near = random.sample(
      molecule.neighbors({ radius: 1.3, source: moleculesNear(molecule, 1.3) }),
    )[0];
    if (!near) return;
    molecule.rotate({ towards: near });
    molecule.move(settings.tooCloseForce);
  }
  function interactWithPartner(molecule: Molecule) {
    const partner = random.sample(graph.neighbors(molecule))[0];
    if (partner) {
      molecule.rotate({ towards: partner });
      molecule.move(molecule.distanceTo(partner) - 2);
    }
    molecule.rotate(-random.number({ min: 0, max: 360, integer: true }));
    molecule.move(settings.randomForce);
  }
  function hydrophobicIsolation() {
    const oils = molecules().filter((molecule) => molecule.group === "oil");
    return stats.describe(
      oils.map((oil) => {
        // source model in-radius includes self. Its denominator excludes only the linked partner.
        const neighbors = [
          oil,
          ...oil.neighbors({ radius: 4, source: moleculesNear(oil, 4) }),
        ];
        const numerator = neighbors.filter(
          (molecule) => molecule.group === "oil",
        ).length;
        const denominator = neighbors.filter(
          (molecule) => !graph.hasEdge(oil, molecule),
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
    const population = molecules();
    sweepPositions = new Map(population.map((molecule) => [molecule, { x: molecule.x, y: molecule.y }]));
    try {
      for (const molecule of random.sample(population, {
        count: population.length,
        algorithm: "fisher-yates-descending",
      })) {
        interactWithNeighbor(molecule);
        repelTooCloseNeighbor(molecule);
        interactWithPartner(molecule);
        sweepPositions.set(molecule, { x: molecule.x, y: molecule.y });
      }
    } finally {
      sweepPositions = undefined;
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
      Omit<MembraneParameters, "seed" | "waterCount" | "lipidCount">
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
        group: molecule.group,
        hydrophilic: molecule.hydrophilic,
        color:
          molecule.group === "oil"
            ? "#ed9228"
            : molecule.hydrophilic
              ? "#b94be0"
              : "#357be5",
        size: 1,
      })),
      edges: [...graph.edges].map((edge) => ({
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
  description: "Lipid molecules with water-loving heads and water-avoiding tails assemble into membranes.",
  inputs,
  create,
} satisfies Definition<MembraneParameters, ReturnType<typeof create>>;
