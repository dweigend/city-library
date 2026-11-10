import { defineUI, type ChangeUISpec } from '../../../ui/index.ts';
import type { Definition } from '../../../models/definition.ts';
import { assert, equal, button, changeNumber, settle } from '../ui-authoring/assertions.ts';

interface Parameters { amount: number }
function create(options: Partial<Parameters> = {}) {
  let amount = options.amount ?? 2; let tick = 0;
  return {
    setAmount(changes: Partial<Parameters>) {
      if (changes.amount === 13) throw new RangeError('Thirteen is reserved');
      if (changes.amount !== undefined) amount = changes.amount;
    },
    advance() { tick++; }, read: () => ({ tick, parameters: { amount } }),
  };
}
export const model: Definition<Parameters, ReturnType<typeof create>> = {
  title: 'Explicit rule editing', inputs: { amount: { kind: 'number', default: 2, min: 0, max: 20, integer: true } }, create,
};
export const spec = {
  setup: [], change: (instance, changes) => instance.setAmount(changes), live: { amount: {} },
  monitors: [{ label: 'Amount', value: state => state.parameters.amount }], views: [],
} as const satisfies ChangeUISpec<Parameters, ReturnType<typeof create>>;
export const ui = defineUI(model, spec);
const actual = create();
spec.change(actual, { amount: 4 }); equal(actual.read().parameters.amount, 4, 'The rule action owns validation');
let rejected = false;
try { spec.change(actual, { amount: 13 }); } catch (error) { rejected = error instanceof RangeError; }
assert(rejected, 'The actual model rejects its reserved value before mutation');
equal(actual.read().parameters.amount, 4, 'This model validates before mutation; no host rollback is implied');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  let calls = 0;
  const mounted = bind(model, { ...spec, change(instance, changes) { calls++; instance.setAmount(changes); } }).mount(container);
  try {
    await settle(container); changeNumber(container, 'Amount', 4); await settle(container);
    equal(calls, 0, 'Before Setup a live edit changes only the initialization draft');
    button(container, 'Setup').click(); await settle(container);
    equal(container.querySelector('dd')?.textContent?.trim(), '4', 'Setup consumes the live draft');
    changeNumber(container, 'Amount', 13); await settle(container);
    equal(calls, 1, 'The decoded rejected edit invokes the action exactly once');
    assert(container.querySelector('[role="alert"]')?.textContent?.includes('Thirteen'), 'Action failure is accessible');
    equal(container.querySelector('dd')?.textContent?.trim(), '4', 'Rejected model action leaves this fixture unchanged');
  } finally { mounted.dispose(); }
  let missing = false;
  try { bind(model, { live: { amount: {} }, views: [] } as never).mount(container); }
  catch (error) { missing = error instanceof TypeError && error.message.includes('Missing setter for amount'); }
  assert(missing, 'JavaScript callers without either write path reject at mount');
  const old = bind(model, {
    setup: [], live: [{ field: 'amount', value: state => state.parameters.amount,
      set: (instance, value) => instance.setAmount({ amount: Number(value) }) }], views: [],
  }).mount(container);
  try { await settle(container); button(container, 'Setup').click(); await settle(container); changeNumber(container, 'Amount', 6); await settle(container); }
  finally { old.dispose(); }
}
