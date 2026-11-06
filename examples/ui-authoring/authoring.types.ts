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
  // @ts-expect-error No compatible parameters observation: explicit value required.
  defineUI(alternate, { live: {
    changeVote: { set(instance, value) { instance.setRules({ changeVote: value }); } },
  }, views: [] });
  // @ts-expect-error Getter must return the declared boolean field type.
  defineUI(voting, { live: { changeVote: {
    value: () => 3,
    set(instance, value) { instance.setRules({ changeVote: value }); },
  } }, views: [] });
  defineUI(voting, { views: [{ type: 'line', label: 'Numeric line', series: () => [{ label: 'Invalid', points: [
    // @ts-expect-error Categorical x is accepted only by bar charts.
    { x: 'category', y: 1 },
  ] }] }] });
}
void negativeContracts;
import type { Definition } from '../../experiments/definition.ts';
import type { VotingParameters } from '../../experiments/voting/model.ts';
import { model as wolves, type WolfSheepParameters } from '../../experiments/wolf-sheep-predation/model.ts';
type VotingInstance = ReturnType<typeof voting.create>;
type VotingRead = ReturnType<VotingInstance['read']>;
type Base = Omit<VotingInstance, 'read'>;
type WithoutParameters = Omit<VotingRead, 'parameters'>;
type OptionalParameters = Base & { read(): WithoutParameters & { parameters?: VotingParameters } };
type OptionalField = Base & { read(): WithoutParameters & { parameters: Omit<VotingParameters, 'changeVote'> & { changeVote?: boolean } } };
type WrongField = Base & { read(): WithoutParameters & { parameters: Omit<VotingParameters, 'changeVote'> & { changeVote: string } } };
type MixedRead = Base & { read(): VotingRead | WithoutParameters };
type MixedWrongRead = Base & { read(): VotingRead | ReturnType<WrongField['read']> };
type CompatibleRead = Base & { read(): VotingRead | (VotingRead & { variant: 'second' }) };
/** Contracts derived from the real Voting API; these are compile-only inputs, not mocks. */
function observationCoverage(
  optionalParameters: Definition<VotingParameters, OptionalParameters>,
  optionalField: Definition<VotingParameters, OptionalField>,
  wrongField: Definition<VotingParameters, WrongField>,
  mixedRead: Definition<VotingParameters, MixedRead>,
  mixedWrongRead: Definition<VotingParameters, MixedWrongRead>,
  compatibleRead: Definition<VotingParameters, CompatibleRead>,
) {
  // @ts-expect-error parameters itself must be present in every observation.
  defineUI(optionalParameters, { live: {
    changeVote: { set(instance, value) { instance.setRules({ changeVote: value }); } },
  }, views: [] });
  // @ts-expect-error The individual parameters key must be required.
  defineUI(optionalField, { live: {
    changeVote: { set(instance, value) { instance.setRules({ changeVote: value }); } },
  }, views: [] });
  // @ts-expect-error An incompatible observed type requires an explicit getter.
  defineUI(wrongField, { live: {
    changeVote: { set(instance, value) { instance.setRules({ changeVote: value }); } },
  }, views: [] });
  // @ts-expect-error One suitable union branch is insufficient for an implicit getter.
  defineUI(mixedRead, { live: {
    changeVote: { set(instance, value) { instance.setRules({ changeVote: value }); } },
  }, views: [] });
  // @ts-expect-error All union branches must have a compatible field, not just one.
  defineUI(mixedWrongRead, { live: {
    changeVote: { set(instance, value) { instance.setRules({ changeVote: value }); } },
  }, views: [] });
  defineUI(compatibleRead, { live: { changeVote: { set(instance, value) {
    const typed: boolean = value; instance.setRules({ changeVote: typed });
  } } }, views: [] });
  defineUI(optionalParameters, { live: { changeVote: {
    value: state => state.parameters?.changeVote ?? false,
    set(instance, value) { instance.setRules({ changeVote: value }); },
  } }, views: [] });
}
void observationCoverage;
function directInference() {
  defineUI(wolves, { live: { mode: { set(instance, value) {
    const choice: WolfSheepParameters['mode'] = value;
    // @ts-expect-error Choice must retain its literal union, not widen to arbitrary string.
    const impossible: 'unrelated-mode' = value;
    instance.setRules({ mode: choice }); void impossible;
  } } }, views: [] });
  // @ts-expect-error Wrong callback value cannot widen P's boolean field to string.
  defineUI(voting, { live: { changeVote: {
    set: (instance: VotingInstance, value: string) => { void instance; void value; },
  } }, views: [] });
  // @ts-expect-error Wrong observation type cannot widen M or replace its read contract.
  defineUI(voting, { live: { changeVote: {
    value: (state: { parameters: { changeVote: string } }) => state.parameters.changeVote,
    set: (instance, value) => instance.setRules({ changeVote: value }),
  } }, views: [] });
  defineUI(voting, { monitors: [{ label: 'Inferred', value(state) {
    const tick: number = state.tick;
    // @ts-expect-error Concrete observation does not gain unknown properties through inference.
    void state.unknownMeasurement;
    return tick;
  } }], views: [] });
}
void directInference;
