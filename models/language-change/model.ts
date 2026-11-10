/** NetLogo Language Change (2007), Uri Wilensky, CC BY-NC-SA 3.0; see NOTICE.md. */
import { Agent, Graph, Random, World, run } from 'city-library';
import type { Definition, Inputs } from '../definition.ts';
import { parseParameters, validateStepCount } from '../parameters.ts';
export interface LanguageChangeParameters {
  seed: number;
  nodeCount: number;
  percentGrammar1: number;
  updateAlgorithm: 'individual' | 'threshold' | 'reward';
  thresholdVal: number;
  sinkState1: boolean;
  logistic: boolean;
  alpha: number;
}
export const inputs: Inputs<LanguageChangeParameters> = {
  seed: {
    kind: 'number',
    default: 1,
    min: -2147483648,
    max: 4294967295,
    integer: true,
  },
  nodeCount: { kind: 'number', default: 100, min: 2, max: 100, integer: true },
  percentGrammar1: { kind: 'number', default: 60, min: 0, max: 100 },
  updateAlgorithm: {
    kind: 'choice',
    default: 'individual',
    options: ['individual', 'threshold', 'reward'],
  },
  thresholdVal: { kind: 'number', default: 0.3, min: 0, max: 1 },
  sinkState1: { kind: 'boolean', default: true },
  logistic: { kind: 'boolean', default: true },
  alpha: { kind: 'number', default: 0.025, min: 0, max: 0.05 },
};
type Node = Agent<{
  who: number;
  state: number;
  origState: number;
  spokenState: number;
}>;
export function create(options: Partial<LanguageChangeParameters> = {}) {
  let settings = parseParameters(inputs, options);
  const random = Random.create({ seed: settings.seed }),
    world = World.create({ x: 91, y: 91, boundary: 'hard' }, { random }),
    graph = Graph.create<Node>();
  const nodes: Node[] = [];
  for (let who = 0; who < settings.nodeCount; who++) {
    const heading = random.number() * 360;
    const a = world.add(
      Agent.create(
        { who, state: 0, origState: 0, spokenState: 0 },
        {
          orientation: { heading },
          position: {
            x: 45 * Math.sin((heading * Math.PI) / 180),
            y: 45 * Math.cos((heading * Math.PI) / 180),
          },
        },
      ),
    );
    nodes.push(a);
    graph.nodes.add(a);
  }
  function distribute() {
    for (const a of nodes) a.state = 0;
    for (const a of random.sample(nodes, {
      sampleCount: Math.floor((settings.percentGrammar1 / 100) * settings.nodeCount),
    }))
      a.state = 1;
    for (const a of nodes) {
      a.origState = a.state;
      a.spokenState = a.state;
    }
  }
  distribute();
  const first = random.sample(nodes)[0]!,
    second = random.sample(nodes.filter((n) => n !== first))[0]!;
  graph.edges.add({ from: first, to: second });
  let unattached = nodes.filter((a) => !graph.neighbors(a).length);
  while (unattached.length) {
    const a = random.sample(unattached)[0]!,
      b = random.sample(nodes, {
        weight: (n) => graph.neighbors(n).length,
      })[0]!;
    graph.edges.add({ from: a, to: b });
    unattached = nodes.filter((n) => !graph.neighbors(n).length);
  }
  const history: Readonly<{
    tick: number;
    grammar0SpeakerCount: number;
    grammar1SpeakerCount: number;
    meanState: number;
  }>[] = [];
  function counts() {
    return {
      grammar0SpeakerCount: nodes.filter((a) => a.state === 0).length,
      grammar1SpeakerCount: nodes.filter((a) => a.state === 1).length,
      meanState: nodes.reduce((s, a) => s + a.state, 0) / nodes.length,
    };
  }
  function record() {
    history.push(Object.freeze({ tick: world.tick.value, ...counts() }));
    if (history.length > 1001) history.splice(1, 1);
  }
  record();
  return {
    advance(stepCount = 1) {
      validateStepCount(stepCount);
      for (let i = 0; i < stepCount; i++) {
        run(world, () => {
          for (const a of random.sample(nodes, {
            sampleCount: nodes.length,
            algorithm: 'fisher-yates-descending',
          })) {
            const neighbors = graph.neighbors(a);
            if (settings.updateAlgorithm === 'individual')
              a.state = random.sample(neighbors)[0]!.state;
            else if (settings.updateAlgorithm === 'threshold') {
              if (
                neighbors.reduce((s, n) => s + n.state, 0) >=
                neighbors.length * settings.thresholdVal
              )
                a.state = 1;
              else if (!settings.sinkState1) a.state = 0;
            } else {
              const p = settings.logistic
                ? 1 / (1 + Math.exp(-((settings.alpha + 0.1) * 20 * a.state - 1) * 5))
                : Math.min(1, 1.5 * a.state);
              a.spokenState = random.number() <= p ? 1 : 0;
              for (const listener of random.sample(neighbors, {
                sampleCount: neighbors.length,
                algorithm: 'fisher-yates-descending',
              })) {
                const choseOne = random.number() <= listener.state;
                if (choseOne)
                  listener.state =
                    a.spokenState === 1
                      ? listener.state + 0.01 * (1 - listener.state)
                      : 0.99 * listener.state;
                else
                  listener.state =
                    a.spokenState === 0
                      ? 0.99 * listener.state
                      : 0.01 + 0.99 * listener.state;
              }
            }
          }
        });
        record();
      }
    },
    resetNodes() {
      for (const a of nodes) a.state = a.origState;
      world.tick.reset();
      history.length = 0;
      record();
    },
    redistributeGrammars() {
      distribute();
      world.tick.reset();
      history.length = 0;
      record();
    },
    setParameters(
      values: Partial<Omit<LanguageChangeParameters, 'seed' | 'nodeCount'>>,
    ) {
      if (
        typeof values !== 'object' ||
        values === null ||
        ![Object.prototype, null].includes(Object.getPrototypeOf(values)) ||
        Reflect.ownKeys(values).some(
          (k) =>
            typeof k !== 'string' ||
            ![
              'percentGrammar1',
              'updateAlgorithm',
              'thresholdVal',
              'sinkState1',
              'logistic',
              'alpha',
            ].includes(k) ||
            !('value' in Object.getOwnPropertyDescriptor(values, k)!),
        )
      )
        throw new TypeError('Supply only live parameter data.');
      settings = parseParameters(inputs, { ...settings, ...values });
    },
    read() {
      return Object.freeze({
        tick: world.tick.value,
        parameters: settings,
        stopped: false,
        ...counts(),
        nodes: Object.freeze(
          nodes.map((a) =>
            Object.freeze({
              id: a.id,
              who: a.who,
              x: a.x,
              y: a.y,
              state: a.state,
              origState: a.origState,
              spokenState: a.spokenState,
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
  title: "Language Change",
  description: "Speakers in a social network adopt one of two grammars from their neighbors. Wilensky (2007), CC BY-NC-SA 3.0.",
  inputs,
  create,
} satisfies Definition<LanguageChangeParameters, ReturnType<typeof create>>;
