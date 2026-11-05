/** NetLogo Birthdays, Uri Wilensky (2004), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parameters, stepCount } from "../parameters.ts";
export interface Parameters {
  seed: number;
}
export const inputs: Inputs<Parameters> = {
  seed: {
    kind: "number",
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
};
export function makeMonth(month: string, length: number) {
  return Array.from({ length }, (_, i) => `${month} ${i + 1}`);
}
export function create(options: Partial<Parameters> = {}) {
  const settings = parameters(inputs, options),
    random = Random.add({ seed: settings.seed }),
    world = World.add({ random });
  const days = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].flatMap((m, i) =>
    makeMonth(m, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i]!),
  );
  let successes = 0;
  let people: {
    id: string;
    birthday: number;
    date: string;
    matched: boolean;
    x: number;
    y: number;
  }[] = [];
  const history: { tick: number; successRate: number }[] = [];
  function makeTurtles() {
    people = Array.from({ length: 23 }, (_, i) => {
      const birthday = Math.floor(random.number() * 365);
      return {
        id: `person-${i}`,
        birthday,
        date: days[birthday]!,
        matched: false,
        x: 4,
        y: 11 - i,
      };
    });
  }
  function sortTurtles() {
    people.sort((a, b) => a.birthday - b.birthday);
    people.forEach((p, i) => (p.y = 11 - i));
  }
  function showMatches() {
    const counts = new Map<number, number>();
    for (const p of people)
      counts.set(p.birthday, (counts.get(p.birthday) ?? 0) + 1);
    for (const p of people) p.matched = counts.get(p.birthday)! > 1;
  }
  function go() {
    makeTurtles();
    sortTurtles();
    showMatches();
    if (people.some((p) => p.matched)) successes++;
  }
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        run(world, go);
        history.push({
          tick: world.tick.value,
          successRate: (100 * successes) / world.tick.value,
        });
      }
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 9,
        height: 23,
        parameters: settings,
        days: Object.freeze([...days]),
        people: Object.freeze(people.map((p) => Object.freeze({ ...p }))),
        successes,
        successRate: world.tick.value
          ? (100 * successes) / world.tick.value
          : 0,
        history: Object.freeze(history.map((p) => Object.freeze({ ...p }))),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Birthdays",
  description:
    "Rooms of 23 people and matching birthdays. Uri Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
