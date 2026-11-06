import { defineUI, type UISpec } from '../../ui/index.ts';
import { model, type VotingParameters } from '../../experiments/voting/model.ts';
import { assert, equal, labels, button, control } from './assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  live: {
    changeVote: { set: (instance, value) => instance.setRules({ changeVote: value }) },
    awardCloseCallsToLoser: { set: (instance, value) => instance.setRules({ awardCloseCallsToLoser: value }) },
  },
  monitors: [{ label: 'Tick', value: state => state.tick }],
  views: [],
} as const satisfies UISpec<VotingParameters, Instance>;
let creations = 0;
export const ui = defineUI({ ...model, create(options) { creations++; return model.create(options); } }, spec);
equal(creations, 0, 'UI declaration must remain inert');
const actual = model.create({ width: 5, height: 5, seed: 11 });
const before = actual.read();
spec.live.changeVote.set(actual, true);
equal(actual.read().parameters.changeVote, true, 'Boolean setter calls the real model action');
equal(actual.read().tick, before.tick, 'Changing a rule does not advance time');
equal(actual.read().randomState, before.randomState, 'Changing a rule does not draw randomness');

/** Invoke only in an actual browser, against either public UI adapter. */
export function browserChecks(container: HTMLElement) {
  const mounted = ui.mount(container);
  try {
    equal(creations, 0, 'Mount must not create the model');
    equal(labels(container), ['Width', 'Height', 'Seed', 'Change vote', 'Award close calls to loser'], 'Implicit setup excludes keyed live fields and preserves descriptor/key order');
    equal(container.querySelectorAll('label').length, 5, 'Each field renders once');
    const width = control(container, 'Width');
    assert(width instanceof HTMLInputElement, 'Width is a numeric input');
    equal(width.value, String(model.inputs.width.default), 'Descriptor supplies setup default');
    button(container, 'Setup').click();
    equal(creations, 1, 'Setup creates exactly one real instance');
    equal(container.querySelector('dd')?.textContent?.trim(), '0', 'Initial tick monitor');
  } finally { mounted.dispose(); }
}
