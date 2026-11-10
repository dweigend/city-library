/** NetLogo Daisyworld (Wilensky, 2006), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  startBlacks: number;
  startWhites: number;
  solarLuminosity: number;
  albedoSurface: number;
  albedoBlacks: number;
  albedoWhites: number;
  scenario:
    | "ramp-up-ramp-down"
    | "maintain current luminosity"
    | "low solar luminosity"
    | "our solar luminosity"
    | "high solar luminosity";
  showTempMap: boolean;
  showDaisies: boolean;
  paintDaisiesAs: "add black" | "add white" | "remove";
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  startBlacks: {
    kind: "number",
    default: 20,
    min: 0,
    max: 50,
    integer: true,
  },
  startWhites: {
    kind: "number",
    default: 20,
    min: 0,
    max: 50,
    integer: true,
  },
  solarLuminosity: {
    kind: "number",
    default: 0.8,
    min: 0.001,
    max: 3,
  },
  albedoSurface: {
    kind: "number",
    default: 0.4,
    min: 0,
    max: 1,
  },
  albedoBlacks: {
    kind: "number",
    default: 0.25,
    min: 0,
    max: 0.99,
  },
  albedoWhites: {
    kind: "number",
    default: 0.75,
    min: 0,
    max: 0.99,
  },
  scenario: {
    kind: "choice",
    default: "maintain current luminosity",
    options: [
      "ramp-up-ramp-down",
      "maintain current luminosity",
      "low solar luminosity",
      "our solar luminosity",
      "high solar luminosity",
    ],
  },
  showTempMap: {
    kind: "boolean",
    default: true,
  },
  showDaisies: {
    kind: "boolean",
    default: true,
  },
  paintDaisiesAs: {
    kind: "choice",
    default: "remove",
    options: ["add black", "add white", "remove"],
  },
};
type Daisy = Agent<{
  kind: "black" | "white";
  age: number;
  albedo: number;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({
    seed: settings.seed,
  });
  const space = {
    x: 29,
    y: 29,
    boundary: "wrap" as const,
  };
  const world = World.create(space, {
    random,
  });
  const grid = Grid.create(space, {
    state: {
      temperature: 0,
    },
  });
  world.add(grid);
  const population = () => world.agents as readonly Daisy[];
  const at = (f: (typeof grid.fields)[number]) =>
    grid.agentsAt(f, {
      source: population(),
    });
  const history: {
    tick: number;
    black: number;
    white: number;
    temperature: number;
    luminosity: number;
  }[] = [];
  function luminosity(scenario: Parameters["scenario"], initial = false) {
    if (scenario === "ramp-up-ramp-down" && initial) return 0.8;
    if (scenario === "low solar luminosity") return 0.6;
    if (scenario === "our solar luminosity") return 1;
    if (scenario === "high solar luminosity") return 1.4;
    return settings.solarLuminosity;
  }
  settings = parameters(inputs, {
    ...settings,
    solarLuminosity: luminosity(settings.scenario, true),
  });
  function sprout(f: (typeof grid.fields)[number], kind: "black" | "white") {
    const a = Agent.create(
      {
        kind,
        age: 0,
        albedo:
          kind === "black" ? settings.albedoBlacks : settings.albedoWhites,
      },
      {
        position: {
          x: f.x,
          y: f.y,
        },
        orientation: {
          heading: Math.floor(random.number() * 360),
        },
      },
    );
    world.add(a);
    return a;
  }
  for (const [kind, count] of [
    ["black", Math.round((settings.startBlacks * 841) / 100)],
    ["white", Math.floor((settings.startWhites * 841) / 100)],
  ] as const)
    for (const f of random.sample(
      grid.fields.filter((f) => at(f).length === 0),
      {
        count,
      },
    ))
      sprout(f, kind);
  for (const a of population()) a.age = Math.floor(random.number() * 25);
  function calcTemperature() {
    for (const f of grid.fields) {
      const flower = at(f)[0];
      const absorbed =
        (1 - (flower?.albedo ?? settings.albedoSurface)) *
        settings.solarLuminosity;
      const heating = absorbed > 0 ? 72 * Math.log(absorbed) + 80 : 80;
      f.temperature = (f.temperature + heating) / 2;
    }
  }
  const temperature = () =>
    grid.fields.reduce((sum, f) => sum + f.temperature, 0) / 841;
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        black: population().filter((a) => a.kind === "black").length,
        white: population().filter((a) => a.kind === "white").length,
        temperature: temperature(),
        luminosity: settings.solarLuminosity,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  calcTemperature();
  record();
  function rules() {
    calcTemperature();
    grid.diffuse("temperature", {
      rate: 0.5,
      neighborhood: "moore",
    });
    const old = population();
    for (const a of random.sample(old, {
      count: old.length,
      algorithm: "fisher-yates-descending",
    })) {
      a.age++;
      if (a.age >= 25) {
        a.delete();
        continue;
      }
      const f = grid.fieldAt(a)!;
      const t = f.temperature;
      const threshold = 0.1457 * t - 0.0032 * t * t - 0.6443;
      if (random.number() < threshold) {
        const free = grid
          .neighbors(f, {
            neighborhood: "moore",
          })
          .filter((n) => at(n).length === 0);
        const n = random.sample(free)[0];
        if (n) sprout(n, a.kind);
      }
    }
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, rules);
        record();
        let solar = luminosity(settings.scenario);
        if (settings.scenario === "ramp-up-ramp-down") {
          if (world.tick.value > 200 && world.tick.value <= 400)
            solar = Number((solar + 0.005).toFixed(4));
          if (world.tick.value > 600 && world.tick.value <= 850)
            solar = Number((solar - 0.0025).toFixed(4));
        }
        settings = parameters(inputs, {
          ...settings,
          solarLuminosity: solar,
        });
      }
    },
    paint(x: number, y: number, mode: Parameters["paintDaisiesAs"]) {
      if (!["add black", "add white", "remove"].includes(mode))
        throw new TypeError("Unknown painting mode.");
      const f = grid.fieldAt({
        x,
        y,
      });
      if (!f) throw new RangeError("No field.");
      const existing = at(f);
      if (mode === "remove") for (const a of existing) a.delete();
      else if (existing.length === 0)
        sprout(f, mode === "add black" ? "black" : "white");
    },
    removeAllDaisies() {
      for (const a of [...population()]) a.delete();
    },
    setRules(
      rules: Partial<Omit<Parameters, "seed" | "startBlacks" | "startWhites">>,
    ) {
      if (
        Reflect.ownKeys(rules).some(
          (k) =>
            ![
              "solarLuminosity",
              "albedoSurface",
              "albedoBlacks",
              "albedoWhites",
              "scenario",
              "showTempMap",
              "showDaisies",
              "paintDaisiesAs",
            ].includes(String(k)),
        )
      )
        throw new TypeError("Unknown live rule.");
      settings = parameters(inputs, {
        ...settings,
        ...rules,
      });
    },
    read() {
      const daisies = population().map((a) =>
        Object.freeze({
          id: a.id,
          x: a.x,
          y: a.y,
          kind: a.kind,
          age: a.age,
          albedo: a.albedo,
        }),
      );
      return Object.freeze({
        tick: world.tick.value,
        width: 29,
        height: 29,
        parameters: settings,
        globalTemperature: temperature(),
        blackCount: daisies.filter((a) => a.kind === "black").length,
        whiteCount: daisies.filter((a) => a.kind === "white").length,
        daisies: Object.freeze(daisies),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              temperature: f.temperature,
            }),
          ),
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Daisyworld",
  description:
    "Local albedo feedback, thermal diffusion and daisy populations. Wilensky (2006), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
