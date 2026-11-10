import { defineUI, type ChangeUISpec } from '../../../ui/index.ts';
import { model, type TaxiParameters } from '../../../models/taxi-cabs/model.ts';
import { assert, equal, button, changeNumber, control, settle } from '../ui-authoring/assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  setup: [], change: (instance, changes) => instance.setParameters(changes),
  live: {
    'prob-cbd-cbd-AM': { label: 'CBD to CBD AM', group: 'AM' },
    waitTimeMean: { label: 'Waiting mean', group: 'Timing' },
    'prob-res-com-AM': { label: 'Residential to commercial AM', group: 'AM' },
    waitTimeSd: { label: 'Waiting deviation', group: 'Timing', enabled: state => state.parameters.waitTimeMean > 0 },
  },
  monitors: [{ label: 'Waiting mean', value: state => state.parameters.waitTimeMean }], views: [],
} as const satisfies ChangeUISpec<TaxiParameters, Instance>;
export const ui = defineUI(model, spec);
const actual = model.create({ numTaxicab: 1, seed: 3 });
spec.change(actual, { 'prob-cbd-cbd-AM': 0.5 });
equal(actual.read().parameters['prob-cbd-cbd-AM'], 0.5, 'Hyphenated input keys remain exact public keys');
equal(actual.read().tick, 0, 'A demand-rule edit does not advance taxi time');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const tracked = { ...model, create: (options?: Partial<TaxiParameters>) => model.create({ numTaxicab: 1, ...options }) };
  const mounted = bind(tracked, spec).mount(container);
  try {
    await settle(container);
    equal([...container.querySelectorAll('fieldset')].map(field => field.querySelector('legend')?.textContent?.trim()), ['AM', 'Timing'], 'Groups preserve first declaration order');
    button(container, 'Setup').click(); await settle(container);
    changeNumber(container, 'CBD to CBD AM', 0.5); await settle(container);
    equal((control(container, 'CBD to CBD AM') as HTMLInputElement).value, '0.5', 'Implicit getter supports exact demand keys');
    changeNumber(container, 'Waiting mean', 0); await settle(container);
    assert((control(container, 'Waiting deviation') as HTMLInputElement).disabled, 'Existing enabled predicate still disables the affected field');
  } finally { mounted.dispose(); }
}
