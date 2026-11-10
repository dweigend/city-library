/** Source: Wilensky (2014), CC BY-NC-SA 3.0; exact source and attribution beside this file. */
import { Agent, Random, World, run, geometry } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parseParameters, validateStepCount } from '../parameters.ts';
export interface HeroesParameters {
  seed: number;
  personCount: number;
  personalities: 'brave' | 'cowardly' | 'mixed';
}
export interface ActorInput {
  readonly x: number;
  readonly y: number;
  readonly personality: 'brave' | 'cowardly';
  readonly friend: number;
  readonly enemy: number;
}
export const inputs: Inputs<HeroesParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  personCount: { kind: 'number', default: 68, min: 3, max: 200, integer: true },
  personalities: {
    kind: 'choice',
    default: 'mixed',
    options: ['brave', 'cowardly', 'mixed'],
  },
};
export const presets = Object.freeze([
  { label: 'dot', seed: -1177467632 },
  { label: 'frozen', seed: -1153988890 },
  { label: 'slinky', seed: -608717654 },
  { label: 'spiral', seed: 1086013561 },
  { label: 'slinky 2', seed: -1315170766 },
  { label: 'spiral 2', seed: 878469395 },
  { label: 'yo-yo', seed: -180308068 },
  { label: 'wandering flock', seed: 961107169 },
  { label: 'generally cool one that eventually stops', seed: 284529528 },
]);
type Actor = Agent<{
  who: number;
  personality: 'brave' | 'cowardly';
  friend: number;
  enemy: number;
}>;
export function create(options: Partial<HeroesParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 33, y: 33, boundary: 'hard' }, { random });
  const actors = () => world.agents as readonly Actor[];
  let diagnostic: string | null = null;
  const history: Readonly<{ tick: number; count: number }>[] = [];
  function record() {
    history.push(Object.freeze({ tick: world.tick.value, count: actors().length }));
    if (history.length > 1001) history.splice(1, 1);
  }
  function setup() {
    for (const a of [...actors()]) a.delete();
    world.tick.reset();
    history.length = 0;
    diagnostic = null;
    for (let who = 0; who < settings.personCount; who++)
      world.add(
        Agent.create(
          { who, personality: 'brave' as const, friend: 0, enemy: 0 },
          { orientation: { heading: Math.floor(random.number() * 360) } },
        ),
      );
    for (const a of random.sample(actors(), {
      sampleCount: actors().length,
      algorithm: 'fisher-yates-descending',
    })) {
      a.move({
        to: { x: random.number() * 33 - 16.5, y: random.number() * 33 - 16.5 },
      });
      a.personality =
        settings.personalities === 'mixed'
          ? random.number() < 0.5
            ? 'cowardly'
            : 'brave'
          : settings.personalities;
      const others = actors().filter((b) => b !== a);
      a.friend = others[Math.floor(random.number() * others.length)]!.who;
      a.enemy = others[Math.floor(random.number() * others.length)]!.who;
    }
    record();
  }
  setup();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        diagnostic = null;
        // Native optimized fd < 1 retains a blocked position and continues the phase.
        run(world, () => {
          for (const a of random.sample(actors(), {
            sampleCount: actors().length,
            algorithm: 'fisher-yates-descending',
          })) {
            const friend = actors()[a.friend]!,
              enemy = actors()[a.enemy]!;
            const target =
              a.personality === 'brave'
                ? { x: (friend.x + enemy.x) / 2, y: (friend.y + enemy.y) / 2 }
                : {
                    x: friend.x + (friend.x - enemy.x) / 2,
                    y: friend.y + (friend.y - enemy.y) / 2,
                  };
            // directionTo permits external aiming points and keeps coincident orientation unchanged.
            const direction = a.directionTo(target);
            if (direction) a.rotate(direction.heading - a.heading);
            const d = geometry.direction({ heading: a.heading });
            const endpoint = geometry.normalize(
              { x: a.x + d.x * 0.1, y: a.y + d.y * 0.1 },
              { space: world.space!, endpoints: 'half-open' },
            );
            if (endpoint) a.move({ to: endpoint });
          }
        });
        record();
      }
    },
    preset(seed: number) {
      const next = parseParameters(inputs, { seed, personCount: 68, personalities: 'mixed' });
      settings = next;
      random.reseed(seed);
      setup();
    },
    setActors(rows: readonly ActorInput[]) {
      if (!Array.isArray(rows)) throw new TypeError('Actors must be an array.');
      if (rows.length < 3 || rows.length > 200)
        throw new RangeError('Supply 3..200 actors.');
      if (
        Reflect.ownKeys(rows).some(
          (k) =>
            k !== 'length' &&
            (typeof k !== 'string' ||
              !/^(0|[1-9][0-9]*)$/.test(k) ||
              Number(k) >= rows.length),
        )
      )
        throw new TypeError('Actor arrays cannot contain extra properties.');
      const copy: ActorInput[] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = Object.getOwnPropertyDescriptor(rows, String(i));
        if (!row || !('value' in row))
          throw new TypeError('Actor arrays must be dense data.');
        const a: unknown = row.value;
        if (
          typeof a !== 'object' ||
          a === null ||
          ![Object.prototype, null].includes(Object.getPrototypeOf(a)) ||
          Reflect.ownKeys(a).length !== 5 ||
          Reflect.ownKeys(a).some(
            (k) =>
              typeof k !== 'string' ||
              !['x', 'y', 'personality', 'friend', 'enemy'].includes(k) ||
              !('value' in Object.getOwnPropertyDescriptor(a, k)!),
          )
        )
          throw new TypeError('Supply complete actor data.');
        const v = a as ActorInput;
        if (
          typeof v.x !== 'number' ||
          typeof v.y !== 'number' ||
          !Number.isFinite(v.x) ||
          !Number.isFinite(v.y) ||
          v.x < -16.5 ||
          v.x >= 16.5 ||
          v.y < -16.5 ||
          v.y >= 16.5
        )
          throw new RangeError('Actor position outside half-open world.');
        if (
          !['brave', 'cowardly'].includes(v.personality) ||
          ![v.friend, v.enemy].every(
            (n) => Number.isInteger(n) && n >= 0 && n < rows.length && n !== i,
          )
        )
          throw new RangeError('Invalid actor personality or target.');
        copy.push({
          x: v.x,
          y: v.y,
          personality: v.personality,
          friend: v.friend,
          enemy: v.enemy,
        });
      }
      for (const a of [...actors()]) a.delete();
      for (const [who, a] of copy.entries())
        world.add(
          Agent.create(
            { who, personality: a.personality, friend: a.friend, enemy: a.enemy },
            { position: { x: a.x, y: a.y }, orientation: { heading: 90 } },
          ),
        );
      world.tick.reset();
      history.length = 0;
      diagnostic = null;
      record();
    },
    setParameters(p: Record<string, never>) {
      parseParameters(inputs, p);
      if (Reflect.ownKeys(p).length)
        throw new TypeError('All Heroes and Cowards parameters are setup-only.');
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 33,
        height: 33,
        parameters: settings,
        stopped: false,
        diagnostic,
        agents: Object.freeze(
          actors().map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              x: a.x,
              y: a.y,
              heading: a.heading,
              personality: a.personality,
              friend: a.friend,
              enemy: a.enemy,
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
  title: "Heroes and Cowards",
  description: "Each person moves relative to a friend and an enemy, either protecting or hiding. Wilensky (2014), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<HeroesParameters, ReturnType<typeof create>>;
