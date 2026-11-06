import { defineUI, type UISpec } from '../../ui/index.ts';
import { model, type WealthParameters } from '../../experiments/wealth-distribution/model.ts';
import { assert, equal, labels, button, settle } from './assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  setup: [],
  live: { growthAmount: { set: (instance, value) => instance.setRules({ growthAmount: value }) } },
  actions: [{ label: 'One interval', run: instance => instance.advance(1) }],
  monitors: [{ label: 'Tick', value: state => state.tick }],
  views: [],
} as const satisfies UISpec<WealthParameters, Instance>;
export const ui = defineUI(model, spec);
export const legacySpec = {
  live: [{ field: 'growthAmount', value: state => state.parameters.growthAmount,
    set: (instance, value) => instance.setRules({ growthAmount: Number(value) }) }],
  views: [],
} as const satisfies UISpec<WealthParameters, Instance>;
export const legacyUI = defineUI(model, legacySpec);
const first = model.create({ people: 2, seed: 41 });
const second = model.create({ people: 2, seed: 41 });
const secondBefore = second.read();
spec.live.growthAmount.set(first, 7);
spec.actions[0].run(first);
equal(first.read().tick, 1, 'Explicit action advances one real interval');
equal(first.read().parameters.growthAmount, 7, 'Canonical keyed action is applied');
equal(second.read().tick, secondBefore.tick, 'Other instance time remains independent');
equal(second.read().randomState, secondBefore.randomState, 'Other instance RNG remains independent');
legacySpec.live[0].set(second, 5);
equal(second.read().parameters.growthAmount, 5, 'Legacy scalar-union setter remains accepted');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const left = container.ownerDocument.createElement('section');
  const right = container.ownerDocument.createElement('section');
  const old = container.ownerDocument.createElement('section');
  container.append(left, right, old);
  const browserInstances: Instance[] = [];
  const tracked = { ...model, create(options?: Partial<WealthParameters>) {
    const actual = model.create(options); browserInstances.push(actual); return actual;
  } };
  const browserUI = bind(tracked, spec);
  const mounted = [browserUI.mount(left), browserUI.mount(right), bind(model, legacySpec).mount(old)];
  try {
    await settle(container);
    equal(labels(left, Object.keys(model.inputs)), ['Growth Amount'], 'Explicit empty setup leaves only live controls');
    equal(labels(old, Object.keys(model.inputs)).filter(label => label === 'Growth Amount').length, 2, 'Legacy omitted setup preserves duplicate live/setup behavior');
    button(left, 'Setup').click(); await settle(container); button(right, 'Setup').click(); await settle(container);
    const action = button(left, 'One interval'); action.click(); await settle(container);
    equal(left.querySelector('dd')?.textContent?.trim(), '1', 'Mounted action advances only its model');
    equal(right.querySelector('dd')?.textContent?.trim(), '0', 'Second mounted entry remains independent');
    const disposedModel = browserInstances[0]!;
    const disposedBefore = disposedModel.read();
    mounted[0]!.dispose();
    action.click(); await settle(container);
    equal(disposedModel.read().tick, disposedBefore.tick, 'A stale action cannot advance its disposed original model');
    equal(disposedModel.read().randomState, disposedBefore.randomState, 'A stale action cannot consume its disposed original RNG');
    equal(right.querySelector('dd')?.textContent?.trim(), '0', 'A stale disposed action cannot affect another entry');
    assert(!container.querySelector('[role="alert"]'), 'No host error in exercised interactions');
  } finally { for (const handle of mounted) handle.dispose(); left.remove(); right.remove(); old.remove(); }
}
