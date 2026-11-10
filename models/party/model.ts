/** NetLogo Party (1997), Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parameters, stepCount } from '../parameters.ts';
export interface PartyParameters {
  seed: number;
  number: number;
  groupCount: number;
  tolerance: number;
}
export const inputs: Inputs<PartyParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  number: { kind: 'number', default: 70, min: 0, max: 300, integer: true },
  groupCount: { kind: 'number', default: 10, min: 5, max: 20, integer: true },
  tolerance: { kind: 'number', default: 25, min: 0, max: 99 },
};
type Person = Agent<{
  who: number;
  sex: 'male' | 'female';
  group: number;
  happy: boolean;
}>;
export function create(options: Partial<PartyParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create(
      { x: 82, y: 111, boundary: { x: 'wrap', y: 'hard' } },
      { random },
    ),
    grid = Grid.create({ x: 82, y: 111, boundary: { x: 'wrap', y: 'hard' } });
  world.add(grid);
  const interval = Math.floor(82 / settings.groupCount);
  // Sorted by source x coordinate: indices are stable public group identities.
  const sites = grid.fields.filter(
    (f) =>
      f.y === 0 &&
      f.x - 39.5 <= 0 &&
      (f.x - 39.5) % interval === 0 &&
      Math.floor(-(f.x - 39.5) / interval) < settings.groupCount,
  );
  const people = () => world.agents as readonly Person[];
  function happiness() {
    for (const a of people()) {
      const group = people().filter((b) => b.group === a.group);
      a.happy =
        group.filter((b) => b.sex !== a.sex).length / group.length <=
        settings.tolerance / 100;
    }
  }
  function spread() {
    for (const a of random.sample(people(), {
      count: people().length,
      compatibility: 'legacy-shuffle',
    })) {
      a.rotate({ towards: { x: a.x, y: a.y + (a.sex === 'female' ? -1 : 1) } });
      a.move(4);
      while (grid.agentsAt(grid.fieldAt(a)!).some((b) => b !== a)) {
        const direction = a.sex === 'female' ? -1 : 1;
        if (Math.abs(a.y + 2 * direction) <= 55.5) a.move(1);
        else {
          a.move({ to: { x: a.x - 1, y: 0 } });
          a.move(4);
        }
      }
    }
  }
  let stopped = false;
  const history: Readonly<{
    tick: number;
    happyCount: number;
    boringGroups: number;
  }>[] = [];
  function groupsNow() {
    return sites.map((f, index) => {
      const group = people().filter((a) => a.group === index),
        male = group.filter((a) => a.sex === 'male').length;
      return Object.freeze({
        id: f.id,
        index,
        x: f.x - 39.5,
        y: 0,
        count: group.length,
        male,
        female: group.length - male,
        boring: group.length > 0 && (male === 0 || male === group.length),
      });
    });
  }
  function countsNow() {
    return {
      happyCount: people().filter((a) => a.happy).length,
      boringGroups: groupsNow().filter((g) => g.boring).length,
    };
  }
  function record() {
    history.push(Object.freeze({ tick: world.tick.value, ...countsNow() }));
    if (history.length > 1001) history.splice(1, 1);
  }
  for (let who = 0; who < settings.number; who++) {
    const group = Math.floor(random.number() * sites.length),
      f = sites[group]!;
    world.add(
      Agent.create(
        {
          who,
          group,
          sex: random.number() < 0.5 ? ('female' as const) : ('male' as const),
          happy: false,
        },
        { position: { x: f.x, y: f.y } },
      ),
    );
  }
  happiness();
  spread();
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      stopped = false;
      for (let i = 0; i < count; i++) {
        if (people().every((a) => a.happy)) {
          stopped = true;
          break;
        }
        run(world, () => {
          for (const a of people()) a.move({ to: sites[a.group]! });
          happiness();
          for (const a of random.sample(people(), {
            count: people().length,
            compatibility: 'legacy-shuffle',
          }))
            if (!a.happy) {
              a.rotate({
                towards: { x: a.x + (random.number() < 0.5 ? -1 : 1), y: 0 },
              });
              a.move(1);
            }
          let malcontents = people().filter((a) => !sites.includes(grid.fieldAt(a)!));
          while (malcontents.length) {
            for (const a of random.sample(malcontents, {
              count: malcontents.length,
              compatibility: 'legacy-shuffle',
            }))
              a.move(1);
            malcontents = people().filter((a) => !sites.includes(grid.fieldAt(a)!));
          }
          for (const a of people()) a.group = sites.indexOf(grid.fieldAt(a)!);
          spread();
        });
        record();
      }
    },
    setParameters(values: Partial<Pick<PartyParameters, 'tolerance'>>) {
      if (
        typeof values !== 'object' ||
        values === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(values)) ||
        Reflect.ownKeys(values).some(
          (k) =>
            k !== 'tolerance' ||
            !('value' in Object.getOwnPropertyDescriptor(values, k)!),
        )
      )
        throw new TypeError('Supply only tolerance data.');
      settings = parameters(inputs, { ...settings, ...values });
      stopped = false;
    },
    setGroups(groups: readonly (readonly ('male' | 'female')[])[]) {
      if (
        !Array.isArray(groups) ||
        Object.getPrototypeOf(groups) !== Array.prototype ||
        groups.length !== sites.length
      )
        throw new RangeError('Supply one sex array per group.');
      const copied: ('male' | 'female')[][] = [];
      let count = 0;
      for (let i = 0; i < groups.length; i++) {
        const d = Object.getOwnPropertyDescriptor(groups, String(i));
        if (
          !d ||
          !('value' in d) ||
          !Array.isArray(d.value) ||
          Object.getPrototypeOf(d.value) !== Array.prototype
        )
          throw new TypeError('Groups must contain own array data.');
        const row: ('male' | 'female')[] = [];
        for (let j = 0; j < d.value.length; j++) {
          const entry = Object.getOwnPropertyDescriptor(d.value, String(j));
          if (
            !entry ||
            !('value' in entry) ||
            !['male', 'female'].includes(entry.value)
          )
            throw new TypeError('Sex entries must be male or female data.');
          row.push(entry.value as 'male' | 'female');
        }
        count += row.length;
        if (count > 300) throw new RangeError('At most300 people.');
        copied.push(row);
      }
      for (const a of [...people()]) a.delete();
      let who = 0;
      copied.forEach((row, group) => {
        for (const sex of row)
          world.add(
            Agent.create(
              { who: who++, sex, group, happy: false },
              { position: sites[group]! },
            ),
          );
      });
      happiness();
      spread();
      world.tick.reset();
      history.length = 0;
      stopped = false;
      record();
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 82,
        height: 111,
        parameters: settings,
        stopped,
        ...countsNow(),
        people: Object.freeze(
          people().map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              sex: a.sex,
              group: a.group,
              happy: a.happy,
              x: a.x - 39.5,
              y: a.y,
              heading: a.heading,
            }),
          ),
        ),
        groups: Object.freeze(groupsNow()),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: 'Party',
  description:
    'Tolerance and migration among social groups. Wilensky (1997), CC BY-NC-SA 3.0.',
  inputs,
  create,
} satisfies Definition<PartyParameters, ReturnType<typeof create>>;
