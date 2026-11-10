/** Source: Wilensky (1997), CC BY-NC-SA 3.0; exact source and attribution beside this file. */
import { Grid, Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parameters, stepCount } from '../parameters.ts';
export interface RumorParameters {
  seed: number;
  setup: 'one' | 'random';
  initClique: number;
  eightMode: boolean;
}
export type ColorMode = 'normal' | 'when-heard' | 'times-heard';
export const inputs: Inputs<RumorParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  setup: { kind: 'choice', default: 'one', options: ['one', 'random'] },
  initClique: { kind: 'number', default: 0.1, min: 0, max: 10 },
  eightMode: { kind: 'boolean', default: false },
};
export function create(options: Partial<RumorParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed });
  const world = World.create({ random });
  const grid = Grid.create(
    { x: 101, y: 101, boundary: 'wrap' },
    { state: { timesHeard: 0, firstHeard: -1 } },
  );
  world.add(grid);
  let colorMode: ColorMode = 'normal',
    stopped = false;
  const history: Readonly<{
    tick: number;
    clique: number;
    previousClique: number;
    totalHeard: number;
    growth: number | null;
    ratio: number;
    difference: number;
    percent: number;
  }>[] = [];
  const hear = (f: (typeof grid.fields)[number], first = world.tick.value + 1) => {
    if (f.firstHeard < 0) f.firstHeard = first;
    f.timesHeard++;
  };
  function seedOne(initial = false) {
    hear(grid.fieldAt({ x: 0, y: 0 })!, initial ? 0 : world.tick.value + 1);
    stopped = false;
  }
  function seedRandom(initial = false) {
    for (const f of random.sample(
      grid.fields.filter((f) => f.timesHeard === 0),
      {
        count: grid.fields.filter((f) => f.timesHeard === 0).length,
        compatibility: 'legacy-shuffle',
      },
    ))
      if (random.number() * 100 < settings.initClique)
        hear(f, initial ? 0 : world.tick.value + 1);
    stopped = false;
  }
  function measurements() {
    const clique = grid.fields.filter((f) => f.firstHeard >= 0).length,
      previousClique = grid.fields.filter(
        (f) => f.firstHeard >= 0 && f.firstHeard < world.tick.value,
      ).length;
    return {
      clique,
      previousClique,
      totalHeard: grid.fields.reduce((s, f) => s + f.timesHeard, 0),
      growth: previousClique === 0 ? null : (clique - previousClique) / previousClique,
      ratio: previousClique === 0 ? 1 : clique / previousClique,
      difference: clique - previousClique,
      percent: (100 * clique) / grid.fields.length,
    };
  }
  function record() {
    history.push(Object.freeze({ tick: world.tick.value, ...measurements() }));
    if (history.length > 1001) history.splice(1, 1);
  }
  if (settings.setup === 'one') seedOne(true);
  else seedRandom(true);
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      if (count === 0) return;
      stopped = false;
      for (let i = 0; i < count; i++) {
        if (grid.fields.every((f) => f.timesHeard > 0)) {
          stopped = true;
          break;
        }
        run(world, () => {
          const sources = grid.fields.filter((f) => f.timesHeard > 0);
          for (const f of random.sample(sources, {
            count: sources.length,
            compatibility: 'legacy-shuffle',
          })) {
            const candidates = grid.neighbors(f, {
              neighborhood: settings.eightMode ? 'moore' : 'faces',
            });
            hear(candidates[Math.floor(random.number() * candidates.length)]!);
          }
        });
        record();
      }
    },
    seedOne() {
      seedOne();
    },
    seedRandom() {
      seedRandom();
    },
    hearAt(p: { x: number; y: number }) {
      if (
        typeof p !== 'object' ||
        p === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(p)) ||
        Reflect.ownKeys(p).some(
          (k) =>
            typeof k !== 'string' ||
            !['x', 'y'].includes(k) ||
            !('value' in Object.getOwnPropertyDescriptor(p, k)!),
        )
      )
        throw new TypeError('Supply a field coordinate.');
      if (
        !Number.isInteger(p.x) ||
        !Number.isInteger(p.y) ||
        p.x < -50 ||
        p.x > 50 ||
        p.y < -50 ||
        p.y > 50
      )
        throw new RangeError('Patch coordinate outside [-50,50].');
      hear(grid.fieldAt(p)!);
      stopped = false;
    },
    setColorMode(value: ColorMode) {
      if (!['normal', 'when-heard', 'times-heard'].includes(value))
        throw new RangeError('Unknown color mode.');
      colorMode = value;
    },
    setParameters(p: Partial<Pick<RumorParameters, 'initClique' | 'eightMode'>>) {
      parameters(inputs, p);
      if (
        Reflect.ownKeys(p).some((k) => !['initClique', 'eightMode'].includes(String(k)))
      )
        throw new TypeError('Only rumor rules are live.');
      settings = parameters(inputs, { ...settings, ...p });
      stopped = false;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 101,
        height: 101,
        parameters: settings,
        colorMode,
        stopped,
        ...measurements(),
        cells: Object.freeze(
          grid.fields.map((f) =>
            Object.freeze({
              id: f.id,
              x: f.x,
              y: f.y,
              timesHeard: f.timesHeard,
              firstHeard: f.firstHeard,
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
  title: 'Rumor Mill',
  description:
    'Repeated local exposure with a snapshot of informed senders. Wilensky (1997), CC BY-NC-SA 3.0.',
  inputs,
  create,
} satisfies Definition<RumorParameters, ReturnType<typeof create>>;
