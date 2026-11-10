/** Mandelbrot, Wilensky (1997), CC BY-NC-SA 3.0. Full source and notices: source.nlogox / NOTICE.md. */
import { Agent, Grid, Random, World, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
  agentCount: number;
  throw: number;
  scaleFactor: number;
}
export const inputs: Inputs<Parameters> = {
  seed: { kind: "number", default: 1, integer: true },
  agentCount: {
    kind: "number",
    default: 1500,
    min: 0,
    max: 1500,
    integer: true,
  },
  throw: { kind: "number", default: 10, min: 0, max: 99, integer: true },
  scaleFactor: {
    kind: "number",
    default: 100,
    min: 1,
    max: 500,
    integer: true,
  },
};
type ModelAgent = Agent<{
  sourceIndex: number;
  previousCount: number;
  color: string;
  hidden: boolean;
}>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const grid = Grid.create(
    { x: 301, y: 301, boundary: "hard" },
    { state: { cReal: 0, cImaginary: 0, zReal: 0, zImaginary: 0, counter: 0 } },
  );
  const world = World.create(grid.space, { random });
  world.add(grid);
  const fields = grid.fields;
  const setupScale = settings.scaleFactor;
  // All90601 canonical Fields are eagerly initialized, including unvisited fields.
  for (const field of fields) {
    field.cReal = field.x / setupScale;
    field.cImaginary = field.y / setupScale;
  }
  function agents() {
    return world.agents as readonly ModelAgent[];
  }
  function randomCoordinate() {
    return random.number() * 301 - 150.5;
  }
  function setupAgents() {
    for (let i = 0; i < settings.agentCount; i++) {
      const heading = Math.floor(random.number() * 360),
        x = randomCoordinate(),
        y = randomCoordinate();
      world.add(
        Agent.create(
          { sourceIndex: i, previousCount: 0, color: "#16a34a", hidden: false },
          { position: { x, y }, orientation: { heading } },
        ),
      );
    }
  }
  function mandelbrotCalcAndColor() {
    // This temporary set deduplicates occupied canonical Fields, not domain state.
    const occupied = new Set(agents().map((t) => grid.fieldAt(t)!));
    const eligible: ModelAgent[] = [];
    for (const field of occupied)
      if (Math.hypot(field.zReal, field.zImaginary) <= 2 && field.counter < 115)
        eligible.push(...(grid.agentsAt(field) as readonly ModelAgent[]));
    for (const t of random.sample(eligible, {
      count: eligible.length,
      algorithm: "fisher-yates-descending",
    })) {
      const p = grid.fieldAt(t)!,
        oldReal = p.zReal;
      p.zReal = p.cReal + oldReal * oldReal - p.zImaginary * p.zImaginary;
      p.zImaginary = p.cImaginary + 2 * oldReal * p.zImaginary;
      p.counter++;
    }
  }
  function step() {
    const population = agents();
    for (const agent of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    })) {
      const direction = geometry.direction({ heading: agent.heading });
      const position = geometry.normalize(
        { x: agent.x + direction.x, y: agent.y + direction.y },
        { space: world.space!, endpoints: "half-open" },
      );
      if (position) agent.move({ to: position });
      else
        agent.move({ to: { x: randomCoordinate(), y: randomCoordinate() } });
    }
  }
  function wiggle() {
    const population = agents();
    for (const agent of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    })) {
      agent.rotate(Math.floor(random.number() * 10));
      agent.rotate(-Math.floor(random.number() * 10));
    }
  }
  function climb() {
    const population = agents();
    for (const agent of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    })) {
      const field = grid.fieldAt(agent)!;
      if (field.counter >= agent.previousCount) {
        agent.previousCount = field.counter;
        agent.color = "#eab308";
        const direction = geometry.direction({ heading: agent.heading });
        const position = geometry.normalize(
          {
            x: agent.x + direction.x * settings.throw,
            y: agent.y + direction.y * settings.throw,
          },
          { space: world.space!, endpoints: "half-open" },
        );
        if (position) agent.move({ to: position });
      } else {
        agent.previousCount = field.counter;
        agent.color = "#2563eb";
        agent.rotate(180);
      }
    }
  }
  function go() {
    mandelbrotCalcAndColor();
    step();
    wiggle();
    climb();
    world.tick.advance();
  }
  setupAgents();
  return {
    get world() {
      return world;
    },
    get grid() {
      return grid;
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) go();
    },
    hideAgents() {
      for (const t of agents()) t.hidden = true;
    },
    setRules(
      change: Partial<Pick<Parameters, "throw" | "scaleFactor" | "agentCount">>,
    ) {
      settings = parameters(inputs, { ...settings, ...change });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 301,
        height: 301,
        parameters: settings,
        setupScale,
        maxIterations: 115,
        // Sparse display records are derived from the full canonical Grid.
        fields: Object.freeze(
          fields
            .filter((p) => p.counter > 0)
            .map((p) =>
              Object.freeze({
                id: `${p.x},${p.y}`,
                x: p.x,
                y: p.y,
                cReal: p.cReal,
                cImaginary: p.cImaginary,
                zReal: p.zReal,
                zImaginary: p.zImaginary,
                counter: p.counter,
              }),
            ),
        ),
        agents: Object.freeze(
          agents().map((t) =>
            Object.freeze({
              id: String(t.sourceIndex),
              x: t.x,
              y: t.y,
              heading: t.heading,
              previousCount: t.previousCount,
              color: t.color,
              hidden: t.hidden,
            }),
          ),
        ),
        computedFields: fields.filter((p) => p.counter > 0).length,
        iterations: fields.reduce((n, p) => n + p.counter, 0),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Mandelbrot",
  description:
    "Moving agents allocate complex-iteration work to fields. Wilensky (1997), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
