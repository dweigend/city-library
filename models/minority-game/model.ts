/** Source: Wilensky (2004), CC BY-NC-SA 3.0; exact source and attribution beside this file. */
import { Agent, Random, World, run, stats, geometry } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parameters, stepCount } from '../parameters.ts';
export interface MinorityParameters {
  seed: number;
  number: number;
  memory: number;
  strategiesPerAgent: number;
  colorBy: 'choice' | 'success';
}
export const inputs: Inputs<MinorityParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  number: { kind: 'number', default: 501, min: 1, max: 1501, step: 2, integer: true },
  memory: { kind: 'number', default: 6, min: 1, max: 12, integer: true },
  strategiesPerAgent: { kind: 'number', default: 5, min: 1, max: 10, integer: true },
  colorBy: { kind: 'choice', default: 'success', options: ['choice', 'success'] },
};
type Player = Agent<{
  who: number;
  score: number;
  choice: number;
  strategies: number[][];
  currentStrategy: number;
  strategyScores: number[];
}>;
export function create(options: Partial<MinorityParameters> = {}) {
  let settings = parameters(inputs, options);
  if (settings.memory === 1 && settings.strategiesPerAgent > 4)
    throw new RangeError('Memory 1 supports at most four distinct strategies.');
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 35, y: 35, boundary: 'wrap' }, { random });
  const agents = () => world.agents as readonly Player[];
  let history = Math.floor(random.number() * 2 ** settings.memory),
    minority = 0,
    avgScore = 0,
    stdevScore: number | null = 0,
    zeroCount = 0,
    diagnostic: string | null = null;
  const observations: Readonly<{
    tick: number;
    zeroCount: number;
    avgScore: number;
    stdevScore: number | null;
    minScore: number;
    maxScore: number;
    minRate: number | null;
    maxRate: number | null;
    avgRate: number | null;
  }>[] = [];
  for (let who = 0; who < settings.number; who++) {
    let strategies: number[][] = [];
    do {
      strategies = Array.from({ length: settings.strategiesPerAgent }, () =>
        Array.from({ length: 2 ** settings.memory }, () =>
          Math.floor(random.number() * 2),
        ),
      );
    } while (
      new Set(strategies.map((s) => s.join(''))).size < settings.strategiesPerAgent
    );
    const currentStrategy = Math.floor(random.number() * settings.strategiesPerAgent);
    world.add(
      Agent.create(
        {
          who,
          score: 0,
          choice: strategies[currentStrategy]![history]!,
          strategies,
          currentStrategy,
          strategyScores: Array<number>(settings.strategiesPerAgent).fill(0),
        },
        {
          position: geometry.normalize(
            { x: 0, y: (35 * who) / settings.number },
            { space: world.space!, endpoints: 'half-open' },
          )!,
          orientation: { heading: 90 },
        },
      ),
    );
  }
  function updateSystem() {
    zeroCount = agents().filter((a) => a.choice === 0).length;
    minority = zeroCount <= (settings.number - 1) / 2 ? 0 : 1;
    const summary = stats.describe(
      agents().map((a) => a.score),
      { sample: true },
    );
    avgScore = summary.mean!;
    stdevScore = summary.standardDeviation ?? null;
  }
  function record() {
    observations.push(
      Object.freeze({
        tick: world.tick.value,
        zeroCount,
        avgScore,
        stdevScore,
        minScore: Math.min(...agents().map((a) => a.score)),
        maxScore: Math.max(...agents().map((a) => a.score)),
        minRate: world.tick.value
          ? Math.min(...agents().map((a) => a.score)) / world.tick.value
          : null,
        maxRate: world.tick.value
          ? Math.max(...agents().map((a) => a.score)) / world.tick.value
          : null,
        avgRate: world.tick.value ? avgScore / world.tick.value : null,
      }),
    );
    if (observations.length > 1001) observations.splice(1, 1);
  }
  updateSystem();
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let i = 0; i < count; i++) {
        diagnostic = null;
        run(world, () => {
          for (const a of random.sample(agents(), {
            count: agents().length,
            compatibility: 'legacy-shuffle',
          })) {
            a.strategyScores = a.strategyScores.map(
              (s, j) => s + Number(a.strategies[j]![history] === minority),
            );
            const max = Math.max(...a.strategyScores),
              ties = a.strategyScores.flatMap((s, j) => (s === max ? [j] : []));
            a.currentStrategy = ties[Math.floor(random.number() * ties.length)]!;
            if (a.choice === minority) a.score++;
          }
          history = (history * 2 + minority) % 2 ** settings.memory;
          for (const a of random.sample(agents(), {
            count: agents().length,
            compatibility: 'legacy-shuffle',
          }))
            a.choice = a.strategies[a.currentStrategy]![history]!;
        });
        updateSystem();
        record();
        if (avgScore === 0) {
          diagnostic =
            'Source move-agents divides by zero after scoring and tick; movement omitted.';
          break;
        }
        for (const a of random.sample(agents(), {
          count: agents().length,
          compatibility: 'legacy-shuffle',
        }))
          a.move(a.score / avgScore);
      }
    },
    setParameters(p: Partial<Pick<MinorityParameters, 'colorBy'>>) {
      const next = parameters(inputs, p);
      if (Reflect.ownKeys(p).some((k) => k !== 'colorBy'))
        throw new TypeError('Only colorBy is live.');
      settings = parameters(inputs, { ...settings, ...p });
      void next;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 35,
        height: 35,
        parameters: settings,
        stopped: false,
        diagnostic,
        history,
        fullHistory: Object.freeze(
          Array.from(
            { length: settings.memory },
            (_, i) => (history >>> (settings.memory - i - 1)) & 1,
          ),
        ),
        minority,
        avgScore,
        stdevScore,
        zeroCount,
        agents: Object.freeze(
          agents().map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              x: a.x,
              y: a.y,
              score: a.score,
              choice: a.choice,
              currentStrategy: a.currentStrategy,
              strategies: Object.freeze(a.strategies.map((s) => Object.freeze([...s]))),
              strategyScores: Object.freeze([...a.strategyScores]),
            }),
          ),
        ),
        successHistogram: stats.histogram(
          world.tick.value === 0 ? [] : agents().map((a) => a.score / world.tick.value),
          { edges: Array.from({ length: 26 }, (_, i) => i / 25) },
        ),
        scoreHistory: Object.freeze([...observations]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: 'Minority Game',
  description:
    'Adaptive competition through scored binary strategies. Wilensky (2004), CC BY-NC-SA 3.0.',
  inputs,
  create,
} satisfies Definition<MinorityParameters, ReturnType<typeof create>>;
