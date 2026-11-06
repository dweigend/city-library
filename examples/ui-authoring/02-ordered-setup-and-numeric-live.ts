import { defineUI, type UISpec } from '../../ui/index.ts';
import { model, type WealthParameters } from '../../experiments/wealth-distribution/model.ts';
import { equal, labels, button, changeNumber, control } from './assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  setup: ['seed', { field: 'people', label: 'Population' }, 'bestLand'],
  live: {
    growthAmount: { set: (instance, value) => instance.setRules({ growthAmount: value }) },
  },
  monitors: [{ label: 'Growth', value: state => state.parameters.growthAmount }],
  views: [],
} as const satisfies UISpec<WealthParameters, Instance>;
export const ui = defineUI(model, spec);
const actual = model.create({ people: 2, seed: 21 });
spec.live.growthAmount.set(actual, 6);
equal(actual.read().parameters.growthAmount, 6, 'Numeric live setter needs no coercion');
equal(actual.read().tick, 0, 'A live action is not a model step');

export function browserChecks(container: HTMLElement) {
  const mounted = ui.mount(container);
  try {
    equal(labels(container), ['Seed', 'Population', 'Best Land', 'Growth Amount'], 'Explicit strings and a local override preserve authored order');
    button(container, 'Setup').click();
    changeNumber(container, 'Growth Amount', 6);
    equal(container.querySelector('dd')?.textContent?.trim(), '6', 'Implicit getter refreshes canonical numeric state');
    equal((control(container, 'Growth Amount') as HTMLInputElement).value, '6', 'Control reflects canonical observation');
  } finally { mounted.dispose(); }
}
