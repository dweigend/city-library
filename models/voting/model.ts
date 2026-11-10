/** Adapted from NetLogo Voting, Uri Wilensky (1998), CC BY-NC-SA 3.0.
 * https://ccl.northwestern.edu/netlogo/models/Voting
 * Source commit bf0626a89358b48494066862843a91f36f2556cf.
 * Changes: typed binary state, public interventions, detached history, pure staged stop check.
 */
import { Grid, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";

export interface VotingParameters {
  width: number;
  height: number;
  seed: number;
  changeVote: boolean;
  awardCloseCallsToLoser: boolean;
}
export const inputs: Inputs<VotingParameters> = {
  width: { kind: "number", default: 151, min: 1, max: 201, integer: true },
  height: { kind: "number", default: 151, min: 1, max: 201, integer: true },
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  changeVote: { kind: "boolean", default: false },
  awardCloseCallsToLoser: { kind: "boolean", default: false },
};
export function create(options: Partial<VotingParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const grid = Grid.create(
    { x: settings.width, y: settings.height, boundary: "wrap" },
    { state: { vote: 0 } },
  );
  const fields = grid.fields;
  const neighbors = fields.map((field) => grid.neighbors(field));
  for (const field of fields) field.vote = Math.floor(random.number() * 2);
  const history: { tick: number; zero: number; one: number }[] = [];
  function counts() {
    const one = fields.reduce((sum, field) => sum + field.vote, 0);
    return { zero: fields.length - one, one };
  }
  function record() {
    const point = Object.freeze({ tick: world.tick.value, ...counts() });
    if (history.at(-1)?.tick === point.tick)
      history[history.length - 1] = point;
    else history.push(point);
    if (history.length > 1001) history.splice(1, 1);
  }
  function candidate() {
    return fields.map((field, index) => {
      const total = neighbors[index]!.reduce(
        (sum, neighbor) => sum + neighbor.vote,
        0,
      );
      if (total < 3) return 0;
      if (total > 5) return 1;
      if (total === 3) return settings.awardCloseCallsToLoser ? 1 : 0;
      if (total === 5) return settings.awardCloseCallsToLoser ? 0 : 1;
      return settings.changeVote ? 1 - field.vote : field.vote;
    });
  }
  let done = false;
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i += 1) {
        if (done) break;
        const next = candidate();
        if (next.every((vote, index) => vote === fields[index]!.vote)) {
          done = true;
          break;
        }
        run(world, () => {
          fields.forEach((field, index) => {
            field.vote = next[index]!;
          });
        });
        record();
      }
    },
    setVotes(votes: readonly number[]) {
      if (!Array.isArray(votes))
        throw new RangeError("Supply one binary vote per cell.");
      const copied = Array.from(votes);
      if (
        copied.length !== fields.length ||
        copied.some((vote) => vote !== 0 && vote !== 1)
      )
        throw new RangeError("Supply one binary vote per cell.");
      fields.forEach((field, index) => {
        field.vote = copied[index]!;
      });
      done = false;
      record();
    },
    setRules(
      rules: Partial<
        Pick<VotingParameters, "changeVote" | "awardCloseCallsToLoser">
      >,
    ) {
      if (
        typeof rules !== "object" ||
        rules === null ||
        Reflect.ownKeys(rules).some(
          (key) => key !== "changeVote" && key !== "awardCloseCallsToLoser",
        )
      )
        throw new TypeError("Unknown voting rule.");
      settings = parameters(inputs, { ...settings, ...rules });
      done = false;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: settings.width,
        height: settings.height,
        parameters: settings,
        cells: Object.freeze(
          fields.map((field) =>
            Object.freeze({
              id: field.id,
              x: field.x,
              y: field.y,
              vote: field.vote,
            }),
          ),
        ),
        counts: Object.freeze(counts()),
        history: Object.freeze([...history]),
        randomState: random.state,
        done,
      });
    },
  };
}
export const model = {
  title: "Voting",
  description: "Each cell adopts the majority vote of its neighbors, forming stable voting blocs. Adapted from Uri Wilensky (1998), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<VotingParameters, ReturnType<typeof create>>;
