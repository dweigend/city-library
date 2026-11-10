/** NetLogo Prisoner's Dilemma Two Person Iterated (Wilensky, 2002), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export const strategies = [
  "act-randomly",
  "cooperate",
  "defect",
  "tit-for-tat",
  "tit-for-two-tats",
  "unforgiving",
  "custom-strategy",
] as const;
export type Strategy = (typeof strategies)[number];
export interface IteratedParameters {
  humanStrategy: Strategy;
  computerStrategy: Strategy;
  selectComputerStrategy: boolean;
  displayHistory: boolean;
  seed: number;
}
export const inputs: Inputs<IteratedParameters> = {
  humanStrategy: {
    kind: "choice",
    default: "act-randomly",
    options: strategies,
  },
  computerStrategy: {
    kind: "choice",
    default: "tit-for-tat",
    options: strategies,
  },
  selectComputerStrategy: { kind: "boolean", default: true },
  displayHistory: { kind: "boolean", default: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
};
export interface Player {
  score: number;
  defectNow: boolean;
  partnerDefected: boolean;
  partnerDefectedPast: boolean;
}
export function payoff(defect: boolean, partnerDefect: boolean) {
  return partnerDefect ? (defect ? 1 : 0) : defect ? 5 : 3;
}
export function strategyAction(
  strategy: Strategy,
  memory: Pick<Player, "defectNow" | "partnerDefected" | "partnerDefectedPast">,
  random: ReturnType<typeof Random.add>,
): boolean {
  switch (strategy) {
    case "act-randomly":
      return random.sample([true, false])[0]!;
    case "cooperate":
      return false;
    case "defect":
      return true;
    case "tit-for-two-tats":
      return memory.partnerDefected && memory.partnerDefectedPast;
    case "unforgiving":
      return memory.partnerDefected || memory.defectNow;
    case "tit-for-tat":
    case "custom-strategy":
      return memory.partnerDefected;
    default:
      throw new RangeError("Unknown strategy.");
  }
}
export function create(options: Partial<IteratedParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ random });
  const human = Agent.add<Player>({
    score: 3,
    defectNow: false,
    partnerDefected: false,
    partnerDefectedPast: false,
  });
  const computer = Agent.add<Player>({
    score: 3,
    defectNow: false,
    partnerDefected: false,
    partnerDefectedPast: false,
  });
  world.add(human);
  world.add(computer);
  let hiddenStrategy: Strategy = "cooperate";
  const output: string[] = [];
  const history: Readonly<{
    tick: number;
    humanAverage: number;
    computerAverage: number;
    humanDefected: boolean;
    computerDefected: boolean;
  }>[] = [];
  function averageScore(player: Player) {
    return (
      Math.floor((player.score / (world.tick.value + 1)) * 1000 + 0.5) / 1000
    );
  }
  function prepareNextRound() {
    if (settings.displayHistory) {
      output.push(
        `Last turn you ${human.defectNow ? "defected" : "cooperated"}.`,
        `Last turn your partner ${human.partnerDefected ? "defected" : "cooperated"}.`,
        "Choose your action!",
      );
      if (output.length > 300) output.splice(0, output.length - 300);
    }
  }
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        humanAverage: averageScore(human),
        computerAverage: averageScore(computer),
        humanDefected: human.defectNow,
        computerDefected: computer.defectNow,
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    for (const p of [human, computer]) {
      p.score = 3;
      p.defectNow = false;
      p.partnerDefected = false;
      p.partnerDefectedPast = false;
    }
    hiddenStrategy = random.sample(strategies)[0]!;
    world.tick.reset();
    output.length = 0;
    history.length = 0;
    prepareNextRound();
    record();
  }
  function playARound() {
    human.defectNow = strategyAction(settings.humanStrategy, human, random);
    computer.defectNow = strategyAction(
      settings.selectComputerStrategy
        ? settings.computerStrategy
        : hiddenStrategy,
      computer,
      random,
    );
    // Both actions are chosen before either memory/payoff changes.
    for (const [p, partner] of [
      [human, computer],
      [computer, human],
    ] as const) {
      p.partnerDefectedPast = p.partnerDefected;
      p.partnerDefected = partner.defectNow;
      p.score += payoff(p.defectNow, partner.defectNow);
    }
  }
  function play() {
    run(world, playARound);
    prepareNextRound();
    record();
  }
  setup();
  function playerSnapshot(p: typeof human) {
    return Object.freeze({
      id: p.id,
      score: p.score,
      averageScore: averageScore(p),
      defectNow: p.defectNow,
      partnerDefected: p.partnerDefected,
      partnerDefectedPast: p.partnerDefectedPast,
    });
  }
  return {
    setup,
    play,
    playARound,
    prepareNextRound,
    setRules(changes: Partial<Omit<IteratedParameters, "seed">>) {
      settings = parameters(inputs, { ...settings, ...changes });
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) play();
    },
    read() {
      return Object.freeze({
        sourceMarker: "prisoners-dilemma-two-person-iterated:source-v1",
        tick: world.tick.value,
        parameters: settings,
        human: playerSnapshot(human),
        computer: playerSnapshot(computer),
        hiddenStrategy: settings.selectComputerStrategy ? null : hiddenStrategy,
        output: Object.freeze([...output]),
        history: Object.freeze([...history]),
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Prisoner's Dilemma Two Person Iterated",
  description:
    "Strategy memory and cumulative payoffs · Uri Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<IteratedParameters, ReturnType<typeof create>>;
