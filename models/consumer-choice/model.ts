/** Jager & Wang (2024), NetLogo Consumer Choice; CC BY-NC-SA 3.0, see NOTICE.md. */
import { Agent, Graph, Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parameters, stepCount } from '../parameters.ts';
export interface ConsumerChoiceParameters {
  seed: number;
  consumerCount: number;
  avgConnections: number;
  initialOrangePercent: number;
  normInfluence: number;
  informationExchange: number;
  exploration: number;
  qualityOrange: number;
  qualityBlue: number;
}
export const inputs: Inputs<ConsumerChoiceParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  consumerCount: {
    kind: 'number',
    default: 100,
    min: 0,
    max: 1000,
    integer: true,
  },
  avgConnections: {
    kind: 'number',
    default: 5,
    min: 0,
    max: 10,
    integer: true,
  },
  initialOrangePercent: { kind: 'number', default: 50, min: 0, max: 100 },
  normInfluence: { kind: 'number', default: 0.15, min: 0, max: 1 },
  informationExchange: { kind: 'number', default: 0.05, min: 0, max: 1 },
  exploration: { kind: 'number', default: 0.01, min: 0, max: 1 },
  qualityOrange: { kind: 'number', default: 0.5, min: 0, max: 1 },
  qualityBlue: { kind: 'number', default: 0.5, min: 0, max: 1 },
};
type Consumer = Agent<{
  who: number;
  choice: number;
  satisfaction: number[];
  personalExperience: number[];
  utilities: number[];
}>;
type Live = Pick<
  ConsumerChoiceParameters,
  | 'normInfluence'
  | 'informationExchange'
  | 'exploration'
  | 'qualityOrange'
  | 'qualityBlue'
>;
export function create(options: Partial<ConsumerChoiceParameters> = {}) {
  let settings = parameters(inputs, options);
  if (
    Math.ceil((settings.avgConnections * settings.consumerCount) / 2) >
    (settings.consumerCount * (settings.consumerCount - 1)) / 2
  )
    throw new RangeError('Requested connections exceed the complete graph.');
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 51, y: 51, boundary: 'hard' }, { random }),
    graph = Graph.add<Consumer>();
  const consumers: Consumer[] = [];
  const qualities = () => [settings.qualityOrange, settings.qualityBlue];
  const satisfaction = (choice: number) =>
    [0, 1].map((i) => (i === choice ? Math.log10(1 + 9 * qualities()[i]!) : 0));
  for (let who = 0; who < settings.consumerCount; who++) {
    const choice =
      Math.floor(random.number() * 100) < settings.initialOrangePercent ? 0 : 1;
    const a = world.add(
      Agent.create(
        {
          who,
          choice,
          satisfaction: satisfaction(choice),
          personalExperience: [0, 0],
          utilities: choice === 0 ? [1, 0] : [0, 1],
        },
        {
          position: {
            x: random.number() * 51 - 25.5,
            y: random.number() * 51 - 25.5,
          },
        },
      ),
    );
    consumers.push(a);
    graph.nodes.add(a);
  }
  const target = (settings.avgConnections * settings.consumerCount) / 2;
  while (graph.edges.size < target) {
    const a = random.sample(consumers)[0]!;
    const candidates = consumers.filter((b) => b !== a && !graph.hasEdge(a, b));
    if (!candidates.length) continue;
    const min = Math.min(...candidates.map((b) => a.distanceTo(b)));
    const b = random.sample(candidates.filter((b) => a.distanceTo(b) === min))[0]!;
    graph.edges.add({ from: a, to: b });
  }
  function counts() {
    const orangeCount = consumers.filter((a) => a.choice === 0).length;
    return {
      orangeCount,
      blueCount: consumers.length - orangeCount,
      cluster: consumers.length
        ? consumers.reduce((sum, a) => {
            const ns = graph.neighbors(a);
            return (
              sum +
              (ns.length
                ? ns.filter((b) => b.choice === a.choice).length / ns.length
                : 0)
            );
          }, 0) / consumers.length
        : null,
    };
  }
  const history: Readonly<{
    tick: number;
    orangeCount: number;
    blueCount: number;
    cluster: number | null;
  }>[] = [];
  function record() {
    history.push(Object.freeze({ tick: world.tick.value, ...counts() }));
    if (history.length > 1001) history.splice(1, 1);
  }
  record();
  return {
    advance(count = 1) {
      stepCount(count);
      for (let n = 0; n < count; n++) {
        run(world, () => {
          for (const a of random.sample(consumers, {
            count: consumers.length,
            algorithm: 'fisher-yates-descending',
          })) {
            if (random.number() < a.satisfaction[a.choice]!) {
              /* retain satisfied choice */
            } else if (random.number() < settings.exploration) a.choice = 1 - a.choice;
            else if (a.utilities[0] !== a.utilities[1])
              a.choice = a.utilities[0]! > a.utilities[1]! ? 0 : 1;
            a.satisfaction = satisfaction(a.choice);
          }
          for (const a of random.sample(consumers, {
            count: consumers.length,
            algorithm: 'fisher-yates-descending',
          })) {
            const neighbors = graph.neighbors(a);
            for (const option of [0, 1]) {
              if (a.choice === option)
                a.personalExperience[option] = qualities()[option]!;
              const neighborInfo =
                random.number() <= settings.informationExchange &&
                neighbors.some((b) => b.choice === option)
                  ? qualities()[option]!
                  : 0;
              const norm = neighbors.length
                ? neighbors.filter((b) => b.choice === option).length / neighbors.length
                : 0;
              a.utilities[option] =
                settings.normInfluence * norm +
                ((1 - settings.normInfluence) *
                  (a.personalExperience[option]! + neighborInfo)) /
                  2;
            }
          }
        });
        record();
      }
    },
    setParameters(values: Partial<Live>) {
      if (
        typeof values !== 'object' ||
        values === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(values)) ||
        Reflect.ownKeys(values).some(
          (k) =>
            typeof k !== 'string' ||
            ![
              'normInfluence',
              'informationExchange',
              'exploration',
              'qualityOrange',
              'qualityBlue',
            ].includes(k) ||
            !('value' in Object.getOwnPropertyDescriptor(values, k)!),
        )
      )
        throw new TypeError('Supply only live parameter data.');
      settings = parameters(inputs, { ...settings, ...values });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        width: 51,
        height: 51,
        parameters: settings,
        stopped: false,
        ...counts(),
        consumers: Object.freeze(
          consumers.map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              x: a.x,
              y: a.y,
              choice: a.choice,
              satisfaction: Object.freeze([...a.satisfaction]),
              personalExperience: Object.freeze([...a.personalExperience]),
              utilities: Object.freeze([...a.utilities]),
            }),
          ),
        ),
        edges: Object.freeze(
          [...graph.edges].map((e) =>
            Object.freeze({ id: e.id, from: e.from.id, to: e.to.id }),
          ),
        ),
        history: Object.freeze([...history]),
        randomState: random.state,
      });
    },
  };
}
export const model = {
  title: 'Consumer Choice',
  description:
    'Experience, information and norms in product choice. Jager & Wang (2024), CC BY-NC-SA 3.0.',
  inputs,
  create,
} satisfies Definition<ConsumerChoiceParameters, ReturnType<typeof create>>;
