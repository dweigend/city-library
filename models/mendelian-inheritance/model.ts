/** NetLogo Mendelian Inheritance, Wilensky (2020), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const sourceMarker = "b08-mendelian-inheritance-source-composition-v1";
export type Genotype = "AA" | "Aa" | "aA" | "aa";
export interface Parameters {
  seed: number;
  maleGenotype: "AA" | "Aa" | "aa";
  femaleGenotype: "AA" | "Aa" | "aa";
  numberOfOffspring: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    integer: true,
    min: -2147483648,
    max: 4294967295,
  },
  maleGenotype: { kind: "choice", default: "Aa", options: ["AA", "Aa", "aa"] },
  femaleGenotype: {
    kind: "choice",
    default: "Aa",
    options: ["AA", "Aa", "aa"],
  },
  numberOfOffspring: {
    kind: "number",
    default: 6,
    min: 0,
    max: 10,
    integer: true,
  },
};
type Mouse = Agent<{ genotype: Genotype; generation: string; sex: string }>;
export function create(options: Partial<Parameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.add({ seed: settings.seed });
  const space = { x: 33, y: 33, boundary: "hard" as const };
  const world = World.add(space, { random });
  const grid = Grid.add(space);
  world.add(grid);
  let parent1: Mouse;
  let parent2: Mouse;
  let trialNumber = 0;
  let numberOfDarkOffspring = 0;
  let numberOfLightOffspring = 0;
  let previousNumberOfDarkOffspring = 0;
  let previousNumberOfLightOffspring = 0;
  let selectedGenotype: string | null = null;
  let message = "";
  const mice = () => world.agents as readonly Mouse[];
  function setup() {
    world.delete(mice());
    world.tick.reset();
    trialNumber = 0;
    numberOfDarkOffspring = 0;
    numberOfLightOffspring = 0;
    previousNumberOfDarkOffspring = 0;
    previousNumberOfLightOffspring = 0;
    selectedGenotype = null;
    message = "";
    parent1 = Agent.add(
      {
        genotype: settings.maleGenotype as Genotype,
        generation: "",
        sex: "male",
      },
      { position: { x: -7, y: 10 } },
    );
    parent2 = Agent.add(
      {
        genotype: settings.femaleGenotype as Genotype,
        generation: "",
        sex: "female",
      },
      { position: { x: 7, y: 10 } },
    );
    world.add([parent1, parent2]);
  }
  function setLocation(mouse: Mouse) {
    // Source recursively retries an integer position; use an equivalent loop without stack growth.
    do {
      mouse.move({
        to: {
          x: random.number({ min: 0, max: 28, integer: true }) - 14,
          y: random.number({ min: 0, max: 16, integer: true }) - 14,
        },
      });
    } while (
      mouse.neighbors({
        radius: 2,
        source: mice().filter((other) => other !== mouse),
      }).length > 0
    );
  }
  function makeF1Generation() {
    if (mice().length > 50) {
      message = "Too much population! Press 'setup' to start a new experiment.";
      return;
    }
    message = "";
    for (let n = 0; n < settings.numberOfOffspring; n++) {
      const maleGamete = random.sample([...parent1.genotype])[0]!;
      const femaleGamete = random.sample([...parent2.genotype])[0]!;
      const mouse = Agent.add({
        genotype: (maleGamete + femaleGamete) as Genotype,
        generation: "F1",
        sex: "",
      });
      world.add(mouse);
      setLocation(mouse);
    }
    trialNumber++;
    numberOfDarkOffspring =
      previousNumberOfDarkOffspring +
      mice().filter((a) => a.generation === "F1" && a.genotype.includes("A"))
        .length;
    numberOfLightOffspring =
      previousNumberOfLightOffspring +
      mice().filter((a) => a.generation === "F1" && !a.genotype.includes("A"))
        .length;
    world.tick.advance();
  }
  function clearF1Generation() {
    previousNumberOfDarkOffspring = numberOfDarkOffspring;
    previousNumberOfLightOffspring = numberOfLightOffspring;
    world.delete(mice().filter((a) => a.y <= 1));
  }
  function displayGenotype(id: string | null) {
    const mouse = mice().find((a) => a.id === id);
    selectedGenotype = mouse?.genotype ?? null;
    message = mouse ? "" : "Click on a mouse to know its genotype.";
    return selectedGenotype;
  }
  function read() {
    const both = numberOfDarkOffspring > 0 && numberOfLightOffspring > 0;
    return {
      sourceMarker,
      parameters: { ...settings },
      randomState: random.state,
      width: 33,
      height: 33,
      tick: world.tick.value,
      trialNumber,
      mice: mice().map((a) => ({
        id: a.id,
        x: a.x,
        y: a.y,
        genotype: a.genotype,
        generation: a.generation,
        sex: a.sex,
        dark: a.genotype.includes("A"),
      })),
      numberOfDarkOffspring,
      numberOfLightOffspring,
      previousNumberOfDarkOffspring,
      previousNumberOfLightOffspring,
      darkRatioValue: both
        ? numberOfDarkOffspring / numberOfLightOffspring
        : "N/A",
      lightRatioValue: both ? "1" : "N/A",
      selectedGenotype,
      message,
      done: mice().length > 50,
    };
  }
  function setParameters(change: Partial<Parameters>) {
    settings = parameters(inputs, { ...settings, ...change });
  }
  function advance(steps = 1) {
    stepCount(steps);
    for (let n = 0; n < steps; n++) {
      if (mice().length > 50) break;
      makeF1Generation();
    }
  }
  setup();
  return {
    read,
    advance,
    setup,
    setParameters,
    makeF1Generation,
    clearF1Generation,
    displayGenotype,
    setLocation,
  };
}
export const model: Definition<Parameters, ReturnType<typeof create>> = {
  title: "Mendelian Inheritance",
  inputs,
  create,
};
