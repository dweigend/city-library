import { defineUI, type UISpec } from '../../ui/index.ts';
import { model, type VotingParameters } from '../../experiments/voting/model.ts';
import { assert, equal, button, control } from './assertions.ts';

/** A real model adapter: only the observation name changes; all behavior delegates. */
export const alternate = {
  ...model,
  create(options?: Partial<VotingParameters>) {
    const actual = model.create(options);
    return {
      ...actual,
      read() { const { parameters, ...observation } = actual.read(); return { ...observation, rules: parameters }; },
    };
  },
};
type Instance = ReturnType<typeof alternate.create>;
export const spec = {
  setup: [],
  live: {
    changeVote: {
      value: state => state.rules.changeVote,
      set: (instance, value) => instance.setRules({ changeVote: value }),
    },
  },
  monitors: [{ label: 'Rule', value: state => String(state.rules.changeVote) }],
  views: [],
} as const satisfies UISpec<VotingParameters, Instance>;
export const ui = defineUI(alternate, spec);
const actual = alternate.create({ width: 3, height: 3 });
spec.live.changeVote.set(actual, true);
equal(spec.live.changeVote.value(actual.read()), true, 'Alternate getter observes the real action');
assert(!('parameters' in actual.read()), 'This observation cannot use the implicit parameters convention');

export function browserChecks(container: HTMLElement) {
  const mounted = ui.mount(container);
  try {
    button(container, 'Setup').click();
    equal(container.querySelector('dd')?.textContent?.trim(), 'false', 'Explicit getter initializes the control/monitor');
    control(container, 'Change vote').click();
    equal(container.querySelector('dd')?.textContent?.trim(), 'true', 'Boolean control invokes the explicit action with boolean value');
  } finally { mounted.dispose(); }
}
