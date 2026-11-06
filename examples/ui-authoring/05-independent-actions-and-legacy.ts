import { defineUI, type UISpec } from '../../ui/index.ts';
import { model, type WealthParameters } from '../../experiments/wealth-distribution/model.ts';
import { assert, equal, labels, button } from './assertions.ts';

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

export function browserChecks(container: HTMLElement) {
  const left = container.ownerDocument.createElement('section');
  const right = container.ownerDocument.createElement('section');
  const old = container.ownerDocument.createElement('section');
  container.append(left, right, old);
  const mounted = [ui.mount(left), ui.mount(right), legacyUI.mount(old)];
  try {
    equal(labels(left), ['Growth Amount'], 'Explicit empty setup leaves only live controls');
    equal(labels(old).filter(label => label === 'Growth Amount').length, 2, 'Legacy omitted setup preserves duplicate live/setup behavior');
    button(left, 'Setup').click(); button(right, 'Setup').click();
    const action = button(left, 'One interval'); action.click();
    equal(left.querySelector('dd')?.textContent?.trim(), '1', 'Mounted action advances only its model');
    equal(right.querySelector('dd')?.textContent?.trim(), '0', 'Second mounted entry remains independent');
    mounted[0]!.dispose();
    action.click();
    equal(right.querySelector('dd')?.textContent?.trim(), '0', 'A stale disposed action cannot affect another entry');
    assert(!container.querySelector('[role="alert"]'), 'No host error in exercised interactions');
  } finally { for (const handle of mounted) handle.dispose(); left.remove(); right.remove(); old.remove(); }
}
