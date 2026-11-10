/** Source: Wilensky (2005), CC BY-NC-SA 3.0; exact source and attribution beside this file. */
import { Agent, Grid, Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parseParameters, validateStepCount } from '../parameters.ts';
export type Strategy = 'random' | 'piagetian' | 'vygotskiian' | 'piaget-vygotsky';
export interface DevelopmentParameters {
  seed: number;
  playerCount: number;
  attemptCountPerRun: number;
  strategy: Strategy;
  randomizeStrategyEachRun: boolean;
  stopAfterEachRun: boolean;
  trails: boolean;
  zpd: number;
  vygotskiianNeighborCount: number;
  moveError: number;
}
export const inputs: Inputs<DevelopmentParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  playerCount: {
    kind: 'number',
    default: 30,
    min: 10,
    max: 50,
    step: 10,
    integer: true,
  },
  attemptCountPerRun: { kind: 'number', default: 30, min: 1, max: 100, integer: true },
  strategy: {
    kind: 'choice',
    default: 'vygotskiian',
    options: ['random', 'piagetian', 'vygotskiian', 'piaget-vygotsky'],
  },
  randomizeStrategyEachRun: { kind: 'boolean', default: true },
  stopAfterEachRun: { kind: 'boolean', default: false },
  trails: { kind: 'boolean', default: true },
  zpd: { kind: 'number', default: 15, min: 0, max: 60 },
  vygotskiianNeighborCount: {
    kind: 'number',
    default: 4,
    min: 2,
    max: 18,
    step: 2,
    integer: true,
  },
  moveError: { kind: 'number', default: 4, min: 0, max: 30 },
};
type Player = Agent<{
  who: number;
  color: number;
  maxMoveCount: number;
  bestMaxMoveCount: number;
  remainingMoveCount: number;
  score: number;
  bestScore: number;
}>;
export function create(options: Partial<DevelopmentParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 121, y: 51, boundary: 'hard' }, { random });
  const grid = Grid.create(
    { x: 121, y: 51, boundary: 'hard' },
    { state: { trailColor: 0 } },
  );
  world.add(grid);
  const players = () => world.agents as readonly Player[];
  let attemptCount = 0,
    stopped = false;
  const results: Record<Strategy, number[]> = {
    random: [],
    piagetian: [],
    vygotskiian: [],
    'piaget-vygotsky': [],
  };
  const history: Readonly<{
    tick: number;
    attempt: number;
    strategy: Strategy;
    meanScore: number;
  }>[] = [];
  for (let who = 0; who < settings.playerCount; who++)
    world.add(
      Agent.create(
        {
          who,
          color: 5 + 10 * Math.floor(random.number() * 14) + 0.1,
          maxMoveCount: 0,
          bestMaxMoveCount: 0,
          remainingMoveCount: 0,
          score: 0,
          bestScore: 0,
        },
        {
          position: {
            x: 0,
            y: Math.floor(-25.5 + (51 / settings.playerCount) * (who + 0.5) + 0.5),
          },
        },
      ),
    );
  function setupRun() {
    attemptCount = 0;
    if (settings.randomizeStrategyEachRun)
      settings = parseParameters(inputs, {
        ...settings,
        strategy: (['random', 'piagetian', 'vygotskiian', 'piaget-vygotsky'] as const)[
          Math.floor(random.number() * 4)
        ]!,
      });
    for (const p of random.sample(players(), {
      sampleCount: players().length,
      algorithm: 'fisher-yates-descending',
    })) {
      p.score = 122;
      p.bestScore = 122;
      p.maxMoveCount = Math.floor(random.number() * 121);
    }
  }
  function setupAttempt() {
    for (const f of grid.fields) f.trailColor = 0;
    for (const p of players()) {
      p.rotate(90 - p.heading);
      p.move({ to: { x: -60, y: p.y } });
    }
  }
  const legal = (x: number) => Math.min(120, Math.max(0, x));
  function mean() {
    return players().reduce((sum, p) => sum + p.score, 0) / players().length;
  }
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        attempt: attemptCount,
        strategy: settings.strategy,
        meanScore: mean(),
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  setupRun();
  setupAttempt();
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      if (stepCount === 0) return;
      stopped = false;
      for (let iteration = 0; iteration < stepCount; iteration++) {
        run(world, () => {
          if (attemptCount >= settings.attemptCountPerRun) setupRun();
          setupAttempt();
          for (const p of players()) p.remainingMoveCount = legal(p.maxMoveCount);
          while (players().some((p) => p.remainingMoveCount > 0)) {
            const moving = players().filter((p) => p.remainingMoveCount > 0);
            for (const p of random.sample(moving, {
              sampleCount: moving.length,
              algorithm: 'fisher-yates-descending',
            })) {
              p.remainingMoveCount--;
              p.move(1);
              if (Math.floor(p.x + 0.5) >= 59) {
                p.rotate(270 - p.heading);
                p.move(1);
                p.move(1);
              }
              if (settings.trails)
                grid.fieldAt(p)!.trailColor =
                  p.color - 5 + (10 * (p.maxMoveCount - p.remainingMoveCount)) / p.maxMoveCount;
            }
          }
          for (const p of players()) p.score = Math.abs(p.x);
          for (const p of random.sample(players(), {
            sampleCount: players().length,
            algorithm: 'fisher-yates-descending',
          })) {
            if (settings.strategy === 'random') {
              p.bestMaxMoveCount =
                Math.abs(Math.floor(p.x + 0.5)) > 0
                  ? Math.floor(random.number() * 121)
                  : 121 / 2 - 1;
              p.maxMoveCount = p.bestMaxMoveCount;
              continue;
            }
            let fellow: Player | undefined;
            if (settings.strategy === 'vygotskiian' || settings.strategy === 'piaget-vygotsky') {
              do {
                fellow =
                  players()[
                    p.who -
                      settings.vygotskiianNeighborCount / 2 +
                      Math.floor(random.number() * (1 + settings.vygotskiianNeighborCount))
                  ];
              } while (!fellow || fellow === p);
            }
            if (
              (settings.strategy === 'piagetian' || settings.strategy === 'piaget-vygotsky') &&
              p.score < p.bestScore
            ) {
              p.bestScore = p.score;
              p.bestMaxMoveCount = p.maxMoveCount;
            }
            if (fellow) {
              if (
                p.bestScore > fellow.bestScore &&
                p.bestScore - settings.zpd <= fellow.bestScore
              ) {
                p.bestScore = fellow.bestScore;
                p.bestMaxMoveCount = fellow.bestMaxMoveCount;
              } else if (settings.strategy === 'vygotskiian') {
                p.bestScore = p.score;
                p.bestMaxMoveCount = p.maxMoveCount;
              }
            }
            const noise = random.number({
              distribution: 'normal',
              mean: 0,
              deviation: (settings.moveError * p.bestScore) / 121,
            });
            p.maxMoveCount = legal(
              p.bestMaxMoveCount +
                (settings.strategy === 'vygotskiian'
                  ? noise
                  : p.x > 0
                    ? -Math.abs(noise)
                    : Math.abs(noise)),
            );
          }
          attemptCount++;
          if (attemptCount === Math.floor(settings.attemptCountPerRun / 2 + 0.5))
            results[settings.strategy].push(mean());
        });
        record();
        if (attemptCount >= settings.attemptCountPerRun && settings.stopAfterEachRun) {
          stopped = true;
          break;
        }
      }
    },
    setParameters(p: Partial<Omit<DevelopmentParameters, 'seed' | 'playerCount'>>) {
      parseParameters(inputs, p);
      if (
        Reflect.ownKeys(p).some((k) => ['seed', 'playerCount'].includes(String(k)))
      )
        throw new TypeError('Population and seed are setup-only.');
      settings = parseParameters(inputs, { ...settings, ...p });
      stopped = false;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 121,
        height: 51,
        parameters: settings,
        stopped,
        attemptCount: attemptCount,
        strategy: settings.strategy,
        meanScore: mean(),
        players: Object.freeze(
          players().map((p) =>
            Object.freeze({
              id: p.id,
              who: p.who,
              x: p.x,
              y: p.y,
              heading: p.heading,
              color: p.color,
              maxMoveCount: p.maxMoveCount,
              bestMaxMoveCount: p.bestMaxMoveCount,
              remainingMoveCount: p.remainingMoveCount,
              score: p.score,
              bestScore: p.bestScore,
            }),
          ),
        ),
        cells: Object.freeze(
          grid.fields
            .filter((f) => f.trailColor !== 0 || f.x === 0)
            .map((f) =>
              Object.freeze({
                id: f.id,
                x: f.x,
                y: f.y,
                target: f.x === 0,
                trailColor: f.trailColor,
              }),
            ),
        ),
        strategyAverages: Object.freeze(
          (['random', 'piagetian', 'vygotskiian', 'piaget-vygotsky'] as const).map((strategy) =>
            Object.freeze({
              strategy,
              mean: results[strategy].length
                ? results[strategy].reduce((a, b) => a + b, 0) /
                  results[strategy].length
                : null,
            }),
          ),
        ),
        results: Object.freeze({
          random: Object.freeze([...results.random]),
          piagetian: Object.freeze([...results.piagetian]),
          vygotskiian: Object.freeze([...results.vygotskiian]),
          'piaget-vygotsky': Object.freeze([...results['piaget-vygotsky']]),
        }),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Piaget-Vygotsky Game",
  description: "Players learn to throw at a target alone or with help from better players nearby. Wilensky (2005), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<DevelopmentParameters, ReturnType<typeof create>>;
