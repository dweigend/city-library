/** NetLogo Interstitial Diffusion (Wilensky, 2025), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run, geometry } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export type GoMode = "simulate" | "draw-profile";
export interface InterstitialParameters {
  width: number;
  height: number;
  seed: number;
  initialBulkConcentration: number;
  initialColumnsPopulated: number;
  maxTicks: number;
  constantLeftSurface: boolean;
  leftSurfaceConcentration: number;
  constantRightSurface: boolean;
  rightSurfaceConcentration: number;
  goMode: GoMode;
}
export const inputs: Inputs<InterstitialParameters> = {
  width: { kind: "number", default: 41, min: 3, max: 101, integer: true },
  height: { kind: "number", default: 201, min: 3, max: 301, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initialBulkConcentration: { kind: "number", default: 0.8, min: 0, max: 1 },
  initialColumnsPopulated: {
    kind: "number",
    default: 10,
    min: 0,
    max: 100,
    integer: true,
  },
  maxTicks: { kind: "number", default: 1000, min: 0, max: 1000000 },
  constantLeftSurface: { kind: "boolean", default: false },
  leftSurfaceConcentration: { kind: "number", default: 0.7, min: 0, max: 1 },
  constantRightSurface: { kind: "boolean", default: false },
  rightSurfaceConcentration: { kind: "number", default: 0, min: 0, max: 1 },
  goMode: {
    kind: "choice",
    default: "simulate",
    options: ["simulate", "draw-profile"],
  },
};
export function create(options: Partial<InterstitialParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.width % 2 !== 1 || settings.height % 2 !== 1)
    throw new RangeError("Use odd cell dimensions for integer native fields.");
  const random = Random.create({ seed: settings.seed });
  const space = {
    x: settings.width,
    y: settings.height,
    boundary: { x: "hard" as const, y: "wrap" as const },
  };
  const world = World.create(space, { random });
  const grid = Grid.create(space);
  world.add(grid);
  const minX = -(settings.width - 1) / 2;
  const maxY = (settings.height - 1) / 2;
  const columns = Array.from({ length: settings.width }, (_, index) =>
    grid.fields.filter((f) => f.x === minX + index),
  );
  let latticeVisible = true;
  type Profile = readonly Readonly<{
    x: number;
    concentration: number;
    count: number;
  }>[];
  let initialProfile: Profile = [],
    profileAt15: Profile | undefined;
  const history: Readonly<{ tick: number; atoms: number }>[] = [];
  function calcConcentration(): Profile {
    // This readback derives counts from canonical Grid occupancy, never a
    // second mutable occupancy matrix or graph-point simulation authority.
    return Object.freeze(
      columns.map((fields, index) => {
        const count = fields.reduce(
          (sum, field) => sum + grid.agentsAt(field).length,
          0,
        );
        return Object.freeze({
          x: minX + index,
          concentration: count / settings.height,
          count,
        });
      }),
    );
  }
  function record() {
    history.push(
      Object.freeze({ tick: world.tick.value, atoms: world.agents.length }),
    );
    if (history.length > 1001) history.splice(1, 1);
    if (world.tick.value === 15) profileAt15 = calcConcentration();
  }
  function createDAtom(field: (typeof grid.fields)[number]) {
    return world.add(
      Agent.create(
        {},
        {
          position: { x: field.x, y: field.y },
          orientation: { heading: Math.floor(random.number() * 360) },
        },
      ),
    );
  }
  function setSurface(index: number, concentration: number) {
    for (const field of random.sample(columns[index]!, {
      count: settings.height,
      algorithm: "fisher-yates-descending",
    })) {
      world.delete(grid.agentsAt(field));
      if (random.number() < concentration) createDAtom(field);
    }
  }
  function setConstantLeftSurface() {
    setSurface(0, settings.leftSurfaceConcentration);
  }
  function setConstantRightSurface() {
    setSurface(settings.width - 1, settings.rightSurfaceConcentration);
  }
  function setup() {
    world.delete(world.agents);
    const initialSites = grid.fields.filter(
      (f) => f.x <= minX + settings.initialColumnsPopulated,
    );
    for (const field of random.sample(initialSites, {
      count: initialSites.length,
      algorithm: "fisher-yates-descending",
    }))
      if (random.number() < settings.initialBulkConcentration)
        createDAtom(field);
    if (settings.constantLeftSurface) setConstantLeftSurface();
    if (settings.constantRightSurface) setConstantRightSurface();
    latticeVisible = true;
    world.tick.reset();
    history.length = 0;
    profileAt15 = undefined;
    initialProfile = calcConcentration();
    record();
  }
  function randomWalk(id: string) {
    const atom = world.agents.find((a) => a.id === id);
    if (!atom) throw new RangeError("Expected a live diffusing atom id.");
    const heading = random.sample([0, 90, 180, 270])[0]!;
    atom.rotate(heading - atom.heading);
    const direction = geometry.direction({ heading });
    const next = geometry.normalize(
      {
        x: atom.x + Math.round(direction.x),
        y: atom.y + Math.round(direction.y),
      },
      { space, endpoints: "half-open" },
    );
    if (!next) return; // failed hard-edge direction remains a sampled attempt
    const target = grid.fieldAt(next)!;
    if (grid.agentsAt(target).length === 0)
      atom.move({ to: { x: target.x, y: target.y } });
  }
  function simulateAtoms() {
    if (world.tick.value === 0) latticeVisible = true;
    const population = world.agents;
    for (const atom of random.sample(population, {
      count: population.length,
      algorithm: "fisher-yates-descending",
    }))
      randomWalk(atom.id);
    if (settings.constantLeftSurface) setConstantLeftSurface();
    if (settings.constantRightSurface) setConstantRightSurface();
  }
  function simulate() {
    if (world.tick.value >= settings.maxTicks) return;
    run(world, simulateAtoms);
    record();
  }
  function done() {
    return (
      settings.goMode === "simulate" && world.tick.value >= settings.maxTicks
    );
  }
  function concentration(value: number) {
    if (
      typeof value !== "number" ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 1
    )
      throw new RangeError("Concentration must be between zero and one.");
    return value;
  }
  function replaceColumn(index: number, value: number) {
    const fields = columns[index]!;
    for (const field of fields) world.delete(grid.agentsAt(field));
    // up-to-n-of truncates its nonnegative requested count to an integer.
    for (const field of random.sample(fields, {
      count: Math.floor(settings.height * value),
    }))
      createDAtom(field);
  }
  function drawColumn(index: number, value: number) {
    if (!Number.isSafeInteger(index) || index < 0 || index >= settings.width)
      throw new RangeError("Expected a column index.");
    concentration(value);
    replaceColumn(index, Math.round(value * 100) / 100);
    latticeVisible = false;
    world.tick.reset();
    history.length = 0;
    profileAt15 = undefined;
    initialProfile = calcConcentration();
    record();
  }
  function setProfile(values: readonly number[]) {
    if (!Array.isArray(values) || values.length !== settings.width)
      throw new RangeError("Supply a concentration per column.");
    const validated = Array.from(values, concentration);
    validated.forEach((value, index) => replaceColumn(index, value));
    world.tick.reset();
    history.length = 0;
    profileAt15 = undefined;
    initialProfile = calcConcentration();
    record();
  }
  function drawProfile(x: number, y: number) {
    if (!Number.isFinite(x) || !Number.isFinite(y))
      throw new RangeError("Drawing coordinates must be finite.");
    latticeVisible = false;
    const graphMinY = maxY - 25;
    if (y >= graphMinY && x >= minX - 0.5 && x < -minX + 0.5)
      drawColumn(
        Math.round(x) - minX,
        Math.max(0, Math.min(1, (y - graphMinY) / 25)),
      );
    else {
      world.tick.reset();
      history.length = 0;
      profileAt15 = undefined;
      initialProfile = calcConcentration();
      record();
    }
  }
  function setRules(
    changes: Partial<
      Pick<
        InterstitialParameters,
        | "maxTicks"
        | "constantLeftSurface"
        | "leftSurfaceConcentration"
        | "constantRightSurface"
        | "rightSurfaceConcentration"
        | "goMode"
      >
    >,
  ) {
    for (const key of Object.keys(changes))
      if (
        ![
          "maxTicks",
          "constantLeftSurface",
          "leftSurfaceConcentration",
          "constantRightSurface",
          "rightSurfaceConcentration",
          "goMode",
        ].includes(key)
      )
        throw new TypeError("Only live interstitial rules may change.");
    settings = parameters(inputs, { ...settings, ...changes });
  }
  setup();
  return {
    setup,
    simulate,
    calcConcentration,
    randomWalk,
    setConstantLeftSurface,
    setConstantRightSurface,
    setRules,
    setProfile,
    drawColumn,
    drawProfile,
    toggleLattice() {
      latticeVisible = !latticeVisible;
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count && !done(); i++) {
        if (settings.goMode === "draw-profile") {
          latticeVisible = false;
          world.tick.reset();
          initialProfile = calcConcentration();
          history.length = 0;
          profileAt15 = undefined;
          record();
        } else simulate();
      }
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        done: done(),
        latticeVisible,
        cells: Object.freeze(
          grid.fields.map((f) => Object.freeze({ id: f.id, x: f.x, y: f.y })),
        ),
        atoms: Object.freeze(
          world.agents.map((a) =>
            Object.freeze({ id: a.id, x: a.x, y: a.y, heading: a.heading }),
          ),
        ),
        lattice: Object.freeze(
          grid.fields
            .filter((f) => f.x < -minX)
            .map((f) =>
              Object.freeze({
                id: f.id,
                x: f.x + 0.5,
                y: geometry.normalize(
                  { x: f.x + 0.5, y: f.y + 0.5 },
                  { space },
                )!.y,
              }),
            ),
        ),
        profile: calcConcentration(),
        initialProfile,
        profileAt15,
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Interstitial Diffusion",
  description:
    "Exclusion random walks on a mixed-boundary lattice with optional reservoirs. Wilensky (2025), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<InterstitialParameters, ReturnType<typeof create>>;
