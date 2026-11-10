/** Source: Wilensky (2005), CC BY-NC-SA 3.0; exact source and attribution beside this file. */
import { Agent, Grid, Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parameters, stepCount } from '../parameters.ts';
export type Strategy = 'Random' | 'Piagetian' | 'Vygotskiian' | 'P-V';
export interface DevelopmentParameters {
  seed: number;
  numberOfPlayers: number;
  attemptsPerRun: number;
  strategy: Strategy;
  randomizeStrategyEachRun: boolean;
  stopAfterEachRun: boolean;
  trails: boolean;
  zpd: number;
  vygotskiianNeighbors: number;
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
  numberOfPlayers: {
    kind: 'number',
    default: 30,
    min: 10,
    max: 50,
    step: 10,
    integer: true,
  },
  attemptsPerRun: { kind: 'number', default: 30, min: 1, max: 100, integer: true },
  strategy: {
    kind: 'choice',
    default: 'Vygotskiian',
    options: ['Random', 'Piagetian', 'Vygotskiian', 'P-V'],
  },
  randomizeStrategyEachRun: { kind: 'boolean', default: true },
  stopAfterEachRun: { kind: 'boolean', default: false },
  trails: { kind: 'boolean', default: true },
  zpd: { kind: 'number', default: 15, min: 0, max: 60 },
  vygotskiianNeighbors: {
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
  maxMoves: number;
  bestMaxMoves: number;
  movesLeft: number;
  score: number;
  bestScore: number;
}>;
export function create(options: Partial<DevelopmentParameters> = {}) {
  let settings = parameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 121, y: 51, boundary: 'hard' }, { random });
  const grid = Grid.create(
    { x: 121, y: 51, boundary: 'hard' },
    { state: { trailColor: 0 } },
  );
  world.add(grid);
  const players = () => world.agents as readonly Player[];
  let attempts = 0,
    stopped = false;
  const results: Record<Strategy, number[]> = {
    Random: [],
    Piagetian: [],
    Vygotskiian: [],
    'P-V': [],
  };
  const history: Readonly<{
    tick: number;
    attempt: number;
    strategy: Strategy;
    meanScore: number;
  }>[] = [];
  for (let who = 0; who < settings.numberOfPlayers; who++)
    world.add(
      Agent.create(
        {
          who,
          color: 5 + 10 * Math.floor(random.number() * 14) + 0.1,
          maxMoves: 0,
          bestMaxMoves: 0,
          movesLeft: 0,
          score: 0,
          bestScore: 0,
        },
        {
          position: {
            x: 0,
            y: Math.floor(-25.5 + (51 / settings.numberOfPlayers) * (who + 0.5) + 0.5),
          },
        },
      ),
    );
  function setupRun() {
    attempts = 0;
    if (settings.randomizeStrategyEachRun)
      settings = parameters(inputs, {
        ...settings,
        strategy: (['Random', 'Piagetian', 'Vygotskiian', 'P-V'] as const)[
          Math.floor(random.number() * 4)
        ]!,
      });
    for (const p of random.sample(players(), {
      count: players().length,
      algorithm: 'fisher-yates-descending',
    })) {
      p.score = 122;
      p.bestScore = 122;
      p.maxMoves = Math.floor(random.number() * 121);
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
        attempt: attempts,
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
    advance(count = 1) {
      stepCount(count);
      if (count === 0) return;
      stopped = false;
      for (let iteration = 0; iteration < count; iteration++) {
        run(world, () => {
          if (attempts >= settings.attemptsPerRun) setupRun();
          setupAttempt();
          for (const p of players()) p.movesLeft = legal(p.maxMoves);
          while (players().some((p) => p.movesLeft > 0)) {
            const moving = players().filter((p) => p.movesLeft > 0);
            for (const p of random.sample(moving, {
              count: moving.length,
              algorithm: 'fisher-yates-descending',
            })) {
              p.movesLeft--;
              p.move(1);
              if (Math.floor(p.x + 0.5) >= 59) {
                p.rotate(270 - p.heading);
                p.move(1);
                p.move(1);
              }
              if (settings.trails)
                grid.fieldAt(p)!.trailColor =
                  p.color - 5 + (10 * (p.maxMoves - p.movesLeft)) / p.maxMoves;
            }
          }
          for (const p of players()) p.score = Math.abs(p.x);
          for (const p of random.sample(players(), {
            count: players().length,
            algorithm: 'fisher-yates-descending',
          })) {
            if (settings.strategy === 'Random') {
              p.bestMaxMoves =
                Math.abs(Math.floor(p.x + 0.5)) > 0
                  ? Math.floor(random.number() * 121)
                  : 121 / 2 - 1;
              p.maxMoves = p.bestMaxMoves;
              continue;
            }
            let fellow: Player | undefined;
            if (settings.strategy === 'Vygotskiian' || settings.strategy === 'P-V') {
              do {
                fellow =
                  players()[
                    p.who -
                      settings.vygotskiianNeighbors / 2 +
                      Math.floor(random.number() * (1 + settings.vygotskiianNeighbors))
                  ];
              } while (!fellow || fellow === p);
            }
            if (
              (settings.strategy === 'Piagetian' || settings.strategy === 'P-V') &&
              p.score < p.bestScore
            ) {
              p.bestScore = p.score;
              p.bestMaxMoves = p.maxMoves;
            }
            if (fellow) {
              if (
                p.bestScore > fellow.bestScore &&
                p.bestScore - settings.zpd <= fellow.bestScore
              ) {
                p.bestScore = fellow.bestScore;
                p.bestMaxMoves = fellow.bestMaxMoves;
              } else if (settings.strategy === 'Vygotskiian') {
                p.bestScore = p.score;
                p.bestMaxMoves = p.maxMoves;
              }
            }
            const noise = random.number({
              distribution: 'normal',
              mean: 0,
              deviation: (settings.moveError * p.bestScore) / 121,
            });
            p.maxMoves = legal(
              p.bestMaxMoves +
                (settings.strategy === 'Vygotskiian'
                  ? noise
                  : p.x > 0
                    ? -Math.abs(noise)
                    : Math.abs(noise)),
            );
          }
          attempts++;
          if (attempts === Math.floor(settings.attemptsPerRun / 2 + 0.5))
            results[settings.strategy].push(mean());
        });
        record();
        if (attempts >= settings.attemptsPerRun && settings.stopAfterEachRun) {
          stopped = true;
          break;
        }
      }
    },
    setParameters(p: Partial<Omit<DevelopmentParameters, 'seed' | 'numberOfPlayers'>>) {
      parameters(inputs, p);
      if (
        Reflect.ownKeys(p).some((k) => ['seed', 'numberOfPlayers'].includes(String(k)))
      )
        throw new TypeError('Population and seed are setup-only.');
      settings = parameters(inputs, { ...settings, ...p });
      stopped = false;
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 121,
        height: 51,
        parameters: settings,
        stopped,
        attempts,
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
              maxMoves: p.maxMoves,
              bestMaxMoves: p.bestMaxMoves,
              movesLeft: p.movesLeft,
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
          (['Random', 'Piagetian', 'Vygotskiian', 'P-V'] as const).map((strategy) =>
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
          Random: Object.freeze([...results.Random]),
          Piagetian: Object.freeze([...results.Piagetian]),
          Vygotskiian: Object.freeze([...results.Vygotskiian]),
          'P-V': Object.freeze([...results['P-V']]),
        }),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: 'Piaget-Vygotsky Game',
  description:
    'Individual memory and socially bounded learning in repeated target throws. Wilensky (2005), CC BY-NC-SA 3.0.',
  inputs,
  create,
} satisfies Definition<DevelopmentParameters, ReturnType<typeof create>>;
