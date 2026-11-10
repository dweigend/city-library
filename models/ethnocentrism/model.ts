/** NetLogo Ethnocentrism (2003), Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parseParameters, validateStepCount } from '../parameters.ts';
export interface EthnocentrismParameters {
  seed: number;
  setup: 'empty' | 'full';
  immigrantCountPerDay: number;
  initialPtr: number;
  costOfGiving: number;
  gainOfReceiving: number;
  mutationRate: number;
  deathRate: number;
  immigrantChanceCooperateWithSame: number;
  immigrantChanceCooperateWithDifferent: number;
}
export const inputs: Inputs<EthnocentrismParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  setup: { kind: 'choice', default: 'empty', options: ['empty', 'full'] },
  immigrantCountPerDay: {
    kind: 'number',
    default: 1,
    min: 0,
    max: 100,
    integer: true,
  },
  initialPtr: { kind: 'number', default: 0.12, min: 0, max: 1 },
  costOfGiving: { kind: 'number', default: 0.01, min: 0, max: 1 },
  gainOfReceiving: { kind: 'number', default: 0.03, min: 0, max: 1 },
  mutationRate: { kind: 'number', default: 0.005, min: 0, max: 1 },
  deathRate: { kind: 'number', default: 0.1, min: 0, max: 1 },
  immigrantChanceCooperateWithSame: {
    kind: 'number',
    default: 0.5,
    min: 0,
    max: 1,
  },
  immigrantChanceCooperateWithDifferent: {
    kind: 'number',
    default: 0.5,
    min: 0,
    max: 1,
  },
};
type Person = Agent<{
  who: number;
  tag: number;
  cooperateWithSame: boolean;
  cooperateWithDifferent: boolean;
  ptr: number;
}>;
interface Encounters {
  meet: number;
  meetOwn: number;
  meetOther: number;
  coopOwn: number;
  coopOther: number;
  defOther: number;
}
export function create(options: Partial<EthnocentrismParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 51, y: 51, boundary: 'wrap' }, { random }),
    grid = Grid.create({ x: 51, y: 51, boundary: 'wrap' });
  world.add(grid);
  const agents = () => world.agents as readonly Person[];
  const neighborhoods = new Map(
    grid.fields.map((f) => [f, grid.neighbors(f, { neighborhood: 'faces' })]),
  );
  let who = 0;
  const emptyStats = (): Encounters => ({
    meet: 0,
    meetOwn: 0,
    meetOther: 0,
    coopOwn: 0,
    coopOther: 0,
    defOther: 0,
  });
  let turn = emptyStats(),
    cumulative = emptyStats();
  const last100: Readonly<
    Encounters & { cc: number; cd: number; dc: number; dd: number }
  >[] = [];
  function genotypes() {
    return {
      cc: agents().filter((a) => a.cooperateWithSame && a.cooperateWithDifferent)
        .length,
      cd: agents().filter((a) => a.cooperateWithSame && !a.cooperateWithDifferent)
        .length,
      dc: agents().filter((a) => !a.cooperateWithSame && a.cooperateWithDifferent)
        .length,
      dd: agents().filter((a) => !a.cooperateWithSame && !a.cooperateWithDifferent)
        .length,
    };
  }
  const history: Readonly<{
    tick: number;
    personCount: number;
    cc: number;
    cd: number;
    dc: number;
    dd: number;
  }>[] = [];
  function record() {
    history.push(
      Object.freeze({
        tick: world.tick.value,
        personCount: agents().length,
        ...genotypes(),
      }),
    );
    if (history.length > 1001) history.splice(1, 1);
  }
  function immigrant(f: { x: number; y: number }) {
    return world.add(
      Agent.create(
        {
          who: who++,
          tag: Math.floor(random.number() * 4),
          cooperateWithSame:
            random.number() < settings.immigrantChanceCooperateWithSame,
          cooperateWithDifferent:
            random.number() < settings.immigrantChanceCooperateWithDifferent,
          ptr: 0,
        },
        { position: f },
      ),
    );
  }
  function setup(full: boolean) {
    for (const a of [...agents()]) a.delete();
    who = 0;
    turn = emptyStats();
    cumulative = emptyStats();
    last100.length = 0;
    world.tick.reset();
    history.length = 0;
    if (full)
      for (const f of random.sample(grid.fields, {
        sampleCount: grid.fields.length,
        algorithm: 'fisher-yates-descending',
      }))
        immigrant(f);
    record();
  }
  setup(settings.setup === 'full');
  function ratios(s: Encounters) {
    return Object.freeze({
      meetOwnPercent: s.meetOwn / Math.max(1, s.meet),
      coopOwnPercent: s.coopOwn / Math.max(1, s.meetOwn),
      defOtherPercent: s.defOther / Math.max(1, s.meetOther),
      consistEthnoPercent: (s.defOther + s.coopOwn) / Math.max(1, s.meet),
      coopPercent: (s.coopOwn + s.coopOther) / Math.max(1, s.meet),
    });
  }
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, () => {
          turn = emptyStats();
          const empty = grid.fields.filter((f) => !grid.agentsAt(f).length);
          for (const f of random.sample(empty, {
            sampleCount: Math.min(settings.immigrantCountPerDay, empty.length),
          }))
            immigrant(f);
          for (const a of agents()) a.ptr = settings.initialPtr;
          for (const a of random.sample(agents(), {
            sampleCount: agents().length,
            algorithm: 'fisher-yates-descending',
          })) {
            const ns = neighborhoods
              .get(grid.fieldAt(a)!)!
              .flatMap((f) => grid.agentsAt(f) as readonly Person[]);
            for (const b of random.sample(ns, {
              sampleCount: ns.length,
              algorithm: 'fisher-yates-descending',
            })) {
              turn.meet++;
              cumulative.meet++;
              if (a.tag === b.tag) {
                turn.meetOwn++;
                cumulative.meetOwn++;
                if (a.cooperateWithSame) {
                  turn.coopOwn++;
                  cumulative.coopOwn++;
                  a.ptr -= settings.costOfGiving;
                  b.ptr += settings.gainOfReceiving;
                }
              } else {
                turn.meetOther++;
                cumulative.meetOther++;
                if (a.cooperateWithDifferent) {
                  turn.coopOther++;
                  cumulative.coopOther++;
                  a.ptr -= settings.costOfGiving;
                  b.ptr += settings.gainOfReceiving;
                } else {
                  turn.defOther++;
                  cumulative.defOther++;
                }
              }
            }
          }
          const parents = random.sample(agents(), {
            sampleCount: agents().length,
            algorithm: 'fisher-yates-descending',
          });
          for (const a of parents)
            if (random.number() < a.ptr) {
              const destinations = neighborhoods
                .get(grid.fieldAt(a)!)!
                .filter((f) => !grid.agentsAt(f).length);
              if (destinations.length) {
                const f = random.sample(destinations)[0]!,
                  b = a.copy();
                b.who = who++;
                world.add(b);
                b.move({ to: f });
                if (random.number() < settings.mutationRate) {
                  const old = b.tag;
                  while (b.tag === old) b.tag = Math.floor(random.number() * 4);
                }
                if (random.number() < settings.mutationRate)
                  b.cooperateWithSame = !b.cooperateWithSame;
                if (random.number() < settings.mutationRate)
                  b.cooperateWithDifferent = !b.cooperateWithDifferent;
              }
            }
          for (const a of random.sample(agents(), {
            sampleCount: agents().length,
            algorithm: 'fisher-yates-descending',
          }))
            if (random.number() < settings.deathRate) a.delete();
          last100.push(Object.freeze({ ...turn, ...genotypes() }));
          if (last100.length > 100) last100.shift();
        });
        record();
      }
    },
    setupEmpty() {
      setup(false);
    },
    setupFull() {
      setup(true);
    },
    setParameters(values: Partial<Omit<EthnocentrismParameters, 'seed' | 'setup'>>) {
      if (
        typeof values !== 'object' ||
        values === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(values)) ||
        Reflect.ownKeys(values).some(
          (k) =>
            typeof k !== 'string' ||
            ![
              'immigrantsPerDay',
              'initialPtr',
              'costOfGiving',
              'gainOfReceiving',
              'mutationRate',
              'deathRate',
              'immigrantChanceCooperateWithSame',
              'immigrantChanceCooperateWithDifferent',
            ].includes(k) ||
            !('value' in Object.getOwnPropertyDescriptor(values, k)!),
        )
      )
        throw new TypeError('Supply only live parameter data.');
      settings = parseParameters(inputs, { ...settings, ...values });
    },
    read() {
      const totals = last100.reduce(
        (s, a) => ({
          meet: s.meet + a.meet,
          meetOwn: s.meetOwn + a.meetOwn,
          meetOther: s.meetOther + a.meetOther,
          coopOwn: s.coopOwn + a.coopOwn,
          coopOther: s.coopOther + a.coopOther,
          defOther: s.defOther + a.defOther,
        }),
        emptyStats(),
      );
      const genotypeMean = Object.freeze({
        cc: last100.reduce((s, a) => s + a.cc, 0) / Math.max(1, last100.length),
        cd: last100.reduce((s, a) => s + a.cd, 0) / Math.max(1, last100.length),
        dc: last100.reduce((s, a) => s + a.dc, 0) / Math.max(1, last100.length),
        dd: last100.reduce((s, a) => s + a.dd, 0) / Math.max(1, last100.length),
      });
      const denominator = Math.max(
        1,
        genotypeMean.cc + genotypeMean.cd + genotypeMean.dc + genotypeMean.dd,
      );
      return Object.freeze({
        tick: world.tick.value,
        width: 51,
        height: 51,
        parameters: settings,
        stopped: false,
        agents: Object.freeze(
          agents().map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              x: a.x + 25,
              y: a.y + 25,
              tag: a.tag,
              cooperateWithSame: a.cooperateWithSame,
              cooperateWithDifferent: a.cooperateWithDifferent,
              ptr: a.ptr,
            }),
          ),
        ),
        turn: Object.freeze({ ...turn }),
        cumulative: Object.freeze({ ...cumulative }),
        turnRatios: ratios(turn),
        cumulativeRatios: ratios(cumulative),
        last100Ratios: ratios(totals),
        genotypes: Object.freeze(genotypes()),
        genotypeMean,
        genotypePercent: Object.freeze({
          cc: genotypeMean.cc / denominator,
          cd: genotypeMean.cd / denominator,
          dc: genotypeMean.dc / denominator,
          dd: genotypeMean.dd / denominator,
        }),
        last100: Object.freeze([...last100]),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: "Ethnocentrism",
  description: "Agents choose whether to help neighbors of their own or other groups; strategies spread by reproduction. Wilensky (2003), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<EthnocentrismParameters, ReturnType<typeof create>>;
