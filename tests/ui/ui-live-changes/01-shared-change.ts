import { defineUI, type ChangeUISpec } from '../../../ui/index.ts';
import { model, type WolfSheepParameters } from '../../../models/wolf-sheep-predation/model.ts';
import { assert, equal, button, changeNumber, settle } from '../ui-authoring/assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  setup: [],
  change: (instance, changes) => instance.setRules(changes),
  live: {
    sheepGain: { label: 'Sheep food gain' },
    wolfGain: { label: 'Wolf food gain' },
    sheepReproduce: {},
    wolfReproduce: {},
  },
  monitors: [{ label: 'Food gain', value: state => state.parameters.sheepGain }],
  views: [],
} as const satisfies ChangeUISpec<WolfSheepParameters, Instance>;
export const ui = defineUI(model, spec);
const actual = model.create({ initialSheepCount: 2, initialWolfCount: 1, seed: 17 });
const independent = model.create({ initialSheepCount: 2, initialWolfCount: 1, seed: 17 });
const before = independent.read();
spec.change(actual, { sheepGain: 7 });
equal(actual.read().parameters.sheepGain, 7, 'One explicit public action changes food gain');
equal(actual.read().tick, 0, 'Changing a rule does not step');
equal(independent.read().randomState, before.randomState, 'An independent model retains its RNG');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const calls: Partial<WolfSheepParameters>[] = [];
  const tracked = { ...model, create: (options?: Partial<WolfSheepParameters>) => model.create({ initialSheepCount: 2, initialWolfCount: 1, ...options }) };
  const mounted = bind(tracked, { ...spec, change(instance, changes) {
    calls.push({ ...changes }); instance.setRules(changes);
  } }).mount(container);
  try {
    await settle(container);
    equal(calls, [], 'An inert declaration invokes no change action');
    button(container, 'Setup').click(); await settle(container);
    changeNumber(container, 'Sheep food gain', 7); await settle(container);
    equal(calls, [{ sheepGain: 7 }], 'The default write receives exactly one decoded own-key change');
    equal(container.querySelector('dd')?.textContent?.trim(), '7', 'Implicit parameter getter refreshes');
    assert(!container.querySelector('[role="alert"]'), 'The ordinary default path is error-free');
  } finally { mounted.dispose(); }
}
