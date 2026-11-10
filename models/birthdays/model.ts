/** NetLogo Birthdays, Uri Wilensky (2004), CC BY-NC-SA 3.0. Full notices: NOTICE.md. */
import { Agent, Random, World, run } from "city-library";
import type { Definition, Inputs } from "../definition.ts";
import { parseParameters, validateStepCount } from "../parameters.ts";
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
  const settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create(
    { x: 9, y: 23, boundary: { x: "hard", y: "wrap" } },
    { random },
  );
  type Person = Agent<{
    displayId: string;
    birthday: number;
    date: string;
    matched: boolean;
  }>;
  const people = () => world.agents as readonly Person[];
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
  ].flatMap((month, i) =>
    makeMonth(month, [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i]!),
  );
  let successCount = 0;
  const history: { tick: number; successRate: number }[] = [];
  function makeAgents() {
    for (const person of people()) person.delete();
    for (let i = 0; i < 23; i++) {
      const birthday = Math.floor(random.number() * days.length);
      world.add(
        Agent.create(
          {
            displayId: `person-${i}`,
            birthday,
            date: days[birthday]!,
            matched: false,
          },
          { position: { x: 4, y: 11 - i }, orientation: { heading: 90 } },
        ),
      );
    }
  }
  function sortAgents() {
    const sorted = people().toSorted((a, b) => a.birthday - b.birthday);
    sorted.forEach((person, i) =>
      person.move({ to: { x: person.x, y: 11 - i } }),
    );
  }
  function showMatches() {
    const counts = new Map<number, number>();
    for (const person of people())
      counts.set(person.birthday, (counts.get(person.birthday) ?? 0) + 1);
    for (const person of people())
      person.matched = counts.get(person.birthday)! > 1;
  }
  function go() {
    makeAgents();
    sortAgents();
    showMatches();
    if (people().some((person) => person.matched)) successCount++;
  }
  return {
    get world() {
      return world;
    },
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, go);
        history.push({
          tick: world.tick.value,
          successRate: (100 * successCount) / world.tick.value,
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
        // id is a stable source/display label only. Canonical membership uses Agent.id.
        people: Object.freeze(
          people()
            .toSorted((a, b) => a.birthday - b.birthday)
            .map((person) =>
              Object.freeze({
                id: person.displayId,
                birthday: person.birthday,
                date: person.date,
                matched: person.matched,
                x: person.x,
                y: person.y,
              }),
            ),
        ),
        successCount: successCount,
        successRate: world.tick.value
          ? (100 * successCount) / world.tick.value
          : 0,
        history: Object.freeze(
          history.map((point) => Object.freeze({ ...point })),
        ),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Birthdays",
  description: "Each room holds 23 people; count how often two of them share a birthday. Uri Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<Parameters, ReturnType<typeof create>>;
