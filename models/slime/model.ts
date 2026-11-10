/** NetLogo Slime, Wilensky (1997). See source.nlogox and NOTICE.md. */
import { Agent, Grid, Random, World, stats, geometry, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";

export interface SlimeParameters {
  seed: number;
  agentCount: number;
  sniffThreshold: number;
  sniffAngle: number;
  wiggleAngle: number;
  wiggleBias: number;
}
export const inputs: Inputs<SlimeParameters> = {
  seed: { kind: "number", default: 1, integer: true },
  agentCount: {
    kind: "number",
    default: 400,
    min: 1,
    max: 1500,
    integer: true,
  },
  sniffThreshold: { kind: "number", default: 1, min: 0, max: 5 },
  sniffAngle: { kind: "number", default: 45, min: 0, max: 180 },
  wiggleAngle: { kind: "number", default: 40, min: 0, max: 45 },
  wiggleBias: { kind: "number", default: 0, min: -40, max: 40 },
};

type Slime = Agent<{ who: number }>;
export function create(options: Partial<SlimeParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const space = { x: 81, y: 81, boundary: "wrap" } as const;
  const world = World.create(space, { random });
  const grid = Grid.create(space, { state: { chemical: 0 } });
  world.add(grid);
  const agents = () => world.agents as readonly Slime[];

  function setup() {
    world.delete(agents());
    for (const field of grid.fields) field.chemical = 0;
    for (let who = 0; who < settings.agentCount; who++) {
      world.add(
        Agent.create(
          { who },
          {
            position: {
              x: -40.5 + random.number() * 81,
              y: -40.5 + random.number() * 81,
            },
            orientation: {
              heading: random.number({ min: 0, max: 360, integer: true }),
            },
          },
        ),
      );
    }
    world.tick.reset();
  }

  function chemicalAhead(slime: Slime, angle: number) {
    const heading = ((slime.heading + angle) * Math.PI) / 180;
    const position = geometry.normalize(
      { x: slime.x + Math.sin(heading), y: slime.y + Math.cos(heading) },
      { space, endpoints: "half-open" },
    )!;
    return grid.fieldAt(position)!.chemical;
  }

  function turnTowardChemical(slime: Slime) {
    const ahead = chemicalAhead(slime, 0);
    const right = chemicalAhead(slime, settings.sniffAngle);
    const left = chemicalAhead(slime, -settings.sniffAngle);
    if (right >= ahead && right >= left) slime.rotate(settings.sniffAngle);
    else if (left >= ahead) slime.rotate(-settings.sniffAngle);
  }

  function go() {
    for (const slime of random.sample(agents(), {
      sampleCount: agents().length,
      algorithm: "fisher-yates-descending",
    })) {
      if (grid.fieldAt(slime)!.chemical > settings.sniffThreshold)
        turnTowardChemical(slime);
      slime.rotate(
        random.number() * settings.wiggleAngle -
          random.number() * settings.wiggleAngle +
          settings.wiggleBias,
      );
      slime.move(1);
      grid.fieldAt(slime)!.chemical += 2;
    }
    grid.diffuse("chemical", { rate: 1, neighborhood: "moore" });
    for (const field of grid.fields) field.chemical *= 0.9;
  }

  function advance(stepCount = 1) {
    validateStepCount(stepCount);
    for (let index = 0; index < stepCount; index++) run(world, go);
  }

  function setParameters(
    update: Partial<Omit<SlimeParameters, "seed" | "agentCount">>,
  ) {
    if (
      Object.keys(update).some(
        (key) =>
          ![
            "sniffThreshold",
            "sniffAngle",
            "wiggleAngle",
            "wiggleBias",
          ].includes(key),
      )
    )
      throw new TypeError("Only live parameters may change.");
    settings = parseParameters(inputs, { ...settings, ...update });
  }

  function read() {
    return {
      tick: world.tick.value,
      width: 81,
      height: 81,
      parameters: { ...settings },
      chemicalTotal: stats.describe(grid.fields.map((field) => field.chemical))
        .sum,
      cells: grid.fields.map((field) => ({
        id: field.id,
        x: field.x,
        y: field.y,
        chemical: field.chemical,
        color: `rgb(0 ${Math.round(Math.max(0, Math.min(1, (field.chemical - 0.1) / 2.9)) * 230)} 0)`,
      })),
      agents: agents().map((slime) => ({
        id: slime.id,
        who: slime.who,
        x: slime.x,
        y: slime.y,
        heading: slime.heading,
        color: "#d82e2e",
      })),
    };
  }
  setup();
  return {
    advance,
    read,
    setup,
    go,
    turnTowardChemical,
    chemicalAhead,
    setParameters,
  };
}
export const model = { title: "Slime Mold Aggregation", description: "Cells follow and release a chemical signal, gathering into clusters.", inputs, create } satisfies Definition<
  SlimeParameters,
  ReturnType<typeof create>
>;
