/** Compile-only negative contracts using real models; never imported at runtime. */
import { defineUI } from '../../ui/index.ts';
import { model as voting } from '../../experiments/voting/model.ts';
import { model as wealth } from '../../experiments/wealth-distribution/model.ts';
import { alternate } from './03-alternate-observation.ts';

function negativeContracts() {
  defineUI(voting, { setup: [
    // @ts-expect-error Unknown parameter key.
    'missing',
  ], views: [] });
  defineUI(voting, { live: {
    // @ts-expect-error Unknown keyed live field.
    missing: { set() {} },
  }, views: [] });
  defineUI(voting, { live: { changeVote: { set(instance, value) {
    const booleanValue: boolean = value;
    // @ts-expect-error A boolean parameter is not a number.
    const numberValue: number = value;
    instance.setRules({ changeVote: booleanValue }); void numberValue;
  } } }, views: [] });
  defineUI(wealth, { live: { growthAmount: { set(instance, value) {
    const numberValue: number = value;
    // @ts-expect-error A numeric parameter is not text.
    const textValue: string = value;
    instance.setRules({ growthAmount: numberValue }); void textValue;
  } } }, views: [] });
  defineUI(alternate, { live: {
    // @ts-expect-error No compatible parameters observation: explicit value required.
    changeVote: { set(instance, value) { instance.setRules({ changeVote: value }); } },
  }, views: [] });
  defineUI(voting, { live: { changeVote: {
    // @ts-expect-error Getter must return the declared boolean field type.
    value: () => 3,
    set(instance, value) { instance.setRules({ changeVote: value }); },
  } }, views: [] });
  defineUI(voting, { views: [{ type: 'line', label: 'Numeric line', series: () => [{ label: 'Invalid', points: [
    // @ts-expect-error Categorical x is accepted only by bar charts.
    { x: 'category', y: 1 },
  ] }] }] });
}
void negativeContracts;
