/** NetLogo Rebellion (2004), Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Grid, Random, World, run, geometry } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parseParameters, validateStepCount } from '../parameters.ts';
export interface RebellionParameters {
  seed: number;
  initialCopDensity: number;
  initialAgentDensity: number;
  vision: number;
  governmentLegitimacy: number;
  maxJailTerm: number;
  movement: boolean;
  visualization: '2d' | '3d';
}
export const inputs: Inputs<RebellionParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  initialCopDensity: { kind: 'number', default: 4, min: 0, max: 100 },
  initialAgentDensity: { kind: 'number', default: 70, min: 0, max: 100 },
  vision: { kind: 'number', default: 7, min: 0, max: 10 },
  governmentLegitimacy: { kind: 'number', default: 0.82, min: 0, max: 1 },
  maxJailTerm: { kind: 'number', default: 30, min: 0, max: 50, integer: true },
  movement: { kind: 'boolean', default: true },
  visualization: { kind: 'choice', default: '2d', options: ['2d', '3d'] },
};
type Citizen = Agent<{
  who: number;
  kind: 'citizen' | 'cop';
  hardship: number;
  riskAversion: number;
  active: boolean;
  jailTerm: number;
}>;
export function create(options: Partial<RebellionParameters> = {}) {
  let settings = parseParameters(inputs, options);
  if (settings.initialCopDensity + settings.initialAgentDensity > 100)
    throw new RangeError('Initial densities must sum to at most100%.');
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 40, y: 40, boundary: 'wrap' }, { random }),
    grid = Grid.create({ x: 40, y: 40, boundary: 'wrap' });
  world.add(grid);
  const agents = () => world.agents as readonly Citizen[];
  // The torus is translation-invariant. Measure one canonical neighborhood, then
  // resolve translated Field identities through Grid rather than redoing O(N²) distances.
  const anchor = grid.fields[0]!;
  const pattern = grid.fields.filter(
    (g) => geometry.distance(anchor, g, { space: grid.space }) <= settings.vision,
  );
  const neighborhoods = new Map(
    grid.fields.map((f) => [
      f,
      pattern.map(
        (g) => grid.fieldAt({ x: f.x + g.x - anchor.x, y: f.y + g.y - anchor.y })!,
      ),
    ]),
  );
  const counts = {
    cop: Math.round(settings.initialCopDensity * 0.01 * 1600),
    citizen: Math.round(settings.initialAgentDensity * 0.01 * 1600),
  };
  if (counts.cop + counts.citizen > 1600)
    throw new RangeError('Rounded initial counts exceed available fields.');
  let who = 0;
  for (const kind of ['cop', 'citizen'] as const)
    for (let i = 0; i < counts[kind]; i++) {
      const f = random.sample(grid.fields.filter((f) => !grid.agentsAt(f).length))[0]!;
      world.add(
        Agent.create(
          {
            who: who++,
            kind,
            hardship: kind === 'citizen' ? random.number() : 0,
            riskAversion: kind === 'citizen' ? random.number() : 0,
            active: false,
            jailTerm: 0,
          },
          {
            position: { x: f.x, y: f.y },
            orientation: {
              heading: kind === 'cop' ? Math.floor(random.number() * 360) : 0,
            },
          },
        ),
      );
    }
  let watchedId: string | null = null;
  function nearby(a: Citizen) {
    return neighborhoods.get(grid.fieldAt(a)!)!;
  }
  function countsNow() {
    const people = agents().filter((a) => a.kind === 'citizen');
    return {
      agentCount: people.length,
      copCount: agents().length - people.length,
      quietCount: people.filter((a) => !a.active && a.jailTerm === 0).length,
      activeCount: people.filter((a) => a.active).length,
      jailedCount: people.filter((a) => a.jailTerm > 0).length,
    };
  }
  const history: Readonly<{
    tick: number;
    quietCount: number;
    activeCount: number;
    jailedCount: number;
    agentCount: number;
    copCount: number;
  }>[] = [];
  function record() {
    history.push(Object.freeze({ tick: world.tick.value, ...countsNow() }));
    if (history.length > 1001) history.splice(1, 1);
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, () => {
          for (const a of random.sample(agents(), {
            sampleCount: agents().length,
            algorithm: 'fisher-yates-descending',
          })) {
            if (a.kind === 'cop' || a.jailTerm === 0) {
              if (settings.movement || a.kind === 'cop') {
                const targets = nearby(a).filter((f) =>
                  grid.agentsAt(f).every((b) => {
                    const p = b as Citizen;
                    return p.kind !== 'cop' && p.jailTerm > 0;
                  }),
                );
                if (targets.length) {
                  const f = random.sample(targets)[0]!;
                  a.move({ to: f });
                }
              }
              const local = nearby(a).flatMap(
                (f) => grid.agentsAt(f) as readonly Citizen[],
              );
              if (a.kind === 'citizen') {
                const c = local.filter((b) => b.kind === 'cop').length,
                  active =
                    1 + local.filter((b) => b.kind === 'citizen' && b.active).length;
                const arrest = 1 - Math.exp(-2.3 * Math.floor(c / active));
                a.active =
                  a.hardship * (1 - settings.governmentLegitimacy) -
                    a.riskAversion * arrest >
                  0.1;
              } else {
                const suspects = local.filter((b) => b.kind === 'citizen' && b.active);
                if (suspects.length) {
                  const b = random.sample(suspects)[0]!;
                  a.move({ to: b });
                  b.active = false;
                  b.jailTerm = Math.floor(random.number() * settings.maxJailTerm);
                }
              }
            }
          }
          for (const a of agents())
            if (a.kind === 'citizen' && a.jailTerm > 0) a.jailTerm--;
        });
        record();
      }
    },
    setParameters(
      values: Partial<
        Pick<
          RebellionParameters,
          'governmentLegitimacy' | 'maxJailTerm' | 'movement' | 'visualization'
        >
      >,
    ) {
      if (
        typeof values !== 'object' ||
        values === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(values)) ||
        Reflect.ownKeys(values).some(
          (k) =>
            typeof k !== 'string' ||
            ![
              'governmentLegitimacy',
              'maxJailTerm',
              'movement',
              'visualization',
            ].includes(k) ||
            !('value' in Object.getOwnPropertyDescriptor(values, k)!),
        )
      )
        throw new TypeError('Supply only live parameter data.');
      settings = parseParameters(inputs, { ...settings, ...values });
    },
    watchOne() {
      const people = agents().filter((a) => a.kind === 'citizen');
      watchedId =
        people.reduce<Citizen | undefined>(
          (best, a) => (!best || a.hardship > best.hardship ? a : best),
          undefined,
        )?.id ?? null;
      settings = parseParameters(inputs, { ...settings, visualization: '3d' });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 40,
        height: 40,
        parameters: settings,
        stopped: false,
        watchedId,
        ...countsNow(),
        agents: Object.freeze(
          agents().map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              kind: a.kind,
              x: a.x + 19.5,
              y: a.y + 19.5,
              hardship: a.hardship,
              riskAversion: a.riskAversion,
              grievance: a.hardship * (1 - settings.governmentLegitimacy),
              active: a.active,
              jailTerm: a.jailTerm,
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
  title: "Rebellion",
  description: "Citizens rebel when grievance outweighs the risk of arrest; police jail active rebels. Wilensky (2004), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<RebellionParameters, ReturnType<typeof create>>;
