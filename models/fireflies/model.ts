/** NetLogo Fireflies, Wilensky (1997), CC BY-NC-SA 3.0; see exact source and NOTICE. */
import { Agent, Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
export interface FirefliesParameters {
  seed: number;
  fireflyCount: number;
  flashLength: number;
  cycleLength: number;
  flashCountToReset: number;
  strategy: "delay" | "advance";
  showDarkFireflies: boolean;
}
export const inputs: Inputs<FirefliesParameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  fireflyCount: { kind: "number", default: 1500, min: 0, max: 2000, integer: true },
  flashLength: { kind: "number", default: 1, min: 1, max: 10, integer: true },
  cycleLength: { kind: "number", default: 10, min: 5, max: 100, integer: true },
  flashCountToReset: { kind: "number", default: 1, min: 1, max: 3, integer: true },
  strategy: { kind: "choice", default: "delay", options: ["delay", "advance"] },
  showDarkFireflies: { kind: "boolean", default: false },
};
type Firefly = Agent<{
  clock: number;
  threshold: number;
  resetLevel: number;
  window: number;
  flashing: boolean;
}>;
export function create(options: Partial<FirefliesParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const width = 71,
    height = 71;
  const world = World.create(
    { x: width, y: height, boundary: "wrap" },
    { random },
  );
  // Canonical Grid occupancy narrows the radius-one query to the current
  // Moore neighborhood. It owns no second population or copied positions.
  const grid = Grid.create(
    { x: width, y: height, boundary: "wrap" },
    { state: {} },
  );
  world.add(grid);
  const neighborhoods = new Map(
    grid.fields.map((field) => [
      field,
      [field, ...grid.neighbors(field, { neighborhood: "moore" })],
    ]),
  );
  const fireflies = () => world.agents as readonly Firefly[];
  const history: Readonly<{ tick: number; flashingFireflyCount: number }>[] = [];
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        flashingFireflyCount: fireflies().filter((f) => f.flashing).length,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  for (let i = 0; i < settings.fireflyCount; i++) {
    const clock = Math.floor(
      random.number() * Math.round(settings.cycleLength),
    );
    world.add(
      Agent.create(
        {
          clock,
          threshold: settings.flashLength,
          resetLevel: settings.strategy === "delay" ? settings.flashLength : 0,
          window: settings.strategy === "delay" ? -1 : settings.flashLength + 1,
          flashing: clock < settings.flashLength,
        },
        {
          position: {
            x: random.number() * width - width / 2,
            y: random.number() * height - height / 2,
          },
          orientation: { heading: Math.floor(random.number() * 360) },
        },
      ),
    );
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, () => {
          const oldFlashes = new Set<Agent>(
            fireflies().filter((f) => f.flashing),
          );
          for (const f of random.sample(fireflies(), {
            sampleCount: fireflies().length,
            algorithm: "fisher-yates-descending",
          })) {
            f.rotate(random.number() * 90 - random.number() * 90);
            f.move(1);
            f.clock++;
            if (f.clock === settings.cycleLength) f.clock = 0;
            if (f.clock > f.window && f.clock >= f.threshold) {
              const nearby = neighborhoods
                .get(grid.fieldAt(f)!)!
                .flatMap((field) => grid.agentsAt(field));
              const flashes =
                f
                  .neighbors({ source: nearby, radius: 1 })
                  .filter((other) => oldFlashes.has(other)).length +
                (f.flashing ? 1 : 0);
              if (flashes >= settings.flashCountToReset) f.clock = f.resetLevel;
            }
          }
          for (const f of fireflies()) f.flashing = f.clock < f.threshold;
        });
        record();
      }
    },
    setRules(rules: Partial<Omit<FirefliesParameters, "seed" | "fireflyCount">>) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(rules)) ||
        Reflect.ownKeys(rules).some(
          (key) =>
            typeof key !== "string" ||
            ![
              "flashLength",
              "cycleLength",
              "flashesToReset",
              "strategy",
              "showDarkFireflies",
            ].includes(key) ||
            !("value" in Object.getOwnPropertyDescriptor(rules, key)!),
        )
      )
        throw new TypeError("Supply only live rule data.");
      settings = parseParameters(inputs, { ...settings, ...rules });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width,
        height,
        parameters: settings,
        flashingCount: fireflies().filter((f) => f.flashing).length,
        fireflies: Object.freeze(
          fireflies().map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              heading: f.heading,
              clock: f.clock,
              threshold: f.threshold,
              resetLevel: f.resetLevel,
              window: f.window,
              flashing: f.flashing,
              hidden: !f.flashing && !settings.showDarkFireflies,
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
  title: "Fireflies",
  description: "Fireflies reset their flashing clocks when neighbors flash and gradually synchronize. Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<FirefliesParameters, ReturnType<typeof create>>;
