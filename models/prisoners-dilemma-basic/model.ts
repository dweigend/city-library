/** NetLogo Prisoner's Dilemma Basic (Wilensky, 2002), CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Random, World } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface BasicParameters {
  youSilent: boolean;
  partnerSilent: boolean;
  partnerSilenceKnown: boolean;
  seed: number;
}
export const inputs: Inputs<BasicParameters> = {
  youSilent: { kind: "boolean", default: true },
  partnerSilent: { kind: "boolean", default: false },
  partnerSilenceKnown: { kind: "boolean", default: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
};
export function sentence(youSilent: boolean, partnerSilent: boolean) {
  if (typeof youSilent !== "boolean" || typeof partnerSilent !== "boolean")
    throw new TypeError("Choices must be boolean.");
  if (partnerSilent)
    return youSilent
      ? {
          years: 1,
          face: "silent",
          message:
            "You and your partner both remain silent. You are sentenced to one year imprisonment.",
        }
      : {
          years: 0,
          face: "devious",
          message: "You confess and your partner remains silent. You go free.",
        };
  return youSilent
    ? {
        years: 5,
        face: "sucker",
        message:
          "You remain silent, but your partner confesses. You are sentenced to five years imprisonment.",
      }
    : {
        years: 3,
        face: "rational",
        message:
          "You and your partner both confess. You are sentenced to three years imprisonment.",
      };
}
export function create(options: Partial<BasicParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ random });
  const prisoner = Agent.create({
    partnerIsSilent: false,
    years: null as number | null,
    face: "neutral",
    message: "Choose whether to remain silent, then answer.",
  });
  world.add(prisoner);
  // Native model has no ticks. Host rounds count answers only and never imply an iterated strategy.
  let rounds = 0;
  function setup() {
    prisoner.partnerIsSilent = settings.partnerSilenceKnown
      ? settings.partnerSilent
      : random.number({ max: 2, integer: true }) === 0;
    prisoner.years = null;
    prisoner.face = "neutral";
    prisoner.message = "Choose whether to remain silent, then answer.";
  }
  function answer() {
    setup();
    const result = sentence(settings.youSilent, prisoner.partnerIsSilent);
    prisoner.years = result.years;
    prisoner.face = result.face;
    prisoner.message = result.message;
    rounds++;
  }
  setup();
  return {
    setup() {
      setup();
      rounds = 0;
    },
    answer,
    setRules(changes: Partial<Omit<BasicParameters, "seed">>) {
      settings = parameters(inputs, { ...settings, ...changes });
    },
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) answer();
    },
    read() {
      return Object.freeze({
        sourceMarker: "prisoners-dilemma-basic:source-v1",
        tick: rounds,
        rounds,
        nativeTick: null,
        parameters: settings,
        partnerIsSilent: prisoner.partnerIsSilent,
        years: prisoner.years,
        face: prisoner.face,
        message: prisoner.message,
        randomState: random.state,
        done: false,
      });
    },
  };
}
export const model = {
  title: "Prisoner's Dilemma Basic",
  description: "Four one-shot outcomes · Uri Wilensky · CC BY-NC-SA 3.0",
  inputs,
  create,
} satisfies Definition<BasicParameters, ReturnType<typeof create>>;
