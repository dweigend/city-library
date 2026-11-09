import { defineUI, type LiveChanges } from '../../ui/index.ts';
import { model } from './04-drafts-errors-and-legacy.ts';
const valid: LiveChanges<{ amount: number }> = { amount: 4 };
void valid;
defineUI(model, { change: (instance, changes) => instance.setAmount(changes), live: { amount: {} }, views: [] });
// @ts-expect-error An omitted setter requires an explicit common write action.
defineUI(model, { live: { amount: {} }, views: [] });
defineUI(model, { change: (instance, changes) => instance.setAmount(changes), live: {
  // @ts-expect-error A local override receives the declared numeric input.
  amount: { set: (instance, value: string) => instance.setAmount({ amount: Number(value) }) },
}, views: [] });
// @ts-expect-error Legacy arrays cannot acquire a competing change default.
defineUI(model, { change: (instance, changes) => instance.setAmount(changes), live: [{ field: 'amount', value: state => state.parameters.amount, set: (instance, value) => instance.setAmount({ amount: Number(value) }) }], views: [] });
// @ts-expect-error Changes retain the exact parameter value type.
const wrong: LiveChanges<{ amount: number }> = { amount: 'four' };
// @ts-expect-error Unknown parameter keys are not inferred actions.
const unknown: LiveChanges<{ amount: number }> = { missing: 4 };
void wrong; void unknown;
