import { defineUI, type UISpec } from '../../../ui/index.ts';
import { model, type VotingParameters } from '../../../models/voting/model.ts';
import { assert, equal, button, control, settle } from './assertions.ts';

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

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(alternate, spec).mount(container);
  try {
    await settle(container);
    button(container, 'Setup').click(); await settle(container);
    equal(container.querySelector('dd')?.textContent?.trim(), 'false', 'Explicit getter initializes the control/monitor');
    control(container, 'Change Vote').click(); await settle(container);
    equal(container.querySelector('dd')?.textContent?.trim(), 'true', 'Boolean control invokes the explicit action with boolean value');
  } finally { mounted.dispose(); }
}

/** Explicit getter wins even when a conventional parameters getter is available. */
export const precedenceSpec = {
  setup: [],
  live: { changeVote: {
    value: (state: ReturnType<ReturnType<typeof model.create>['read']>) => !state.parameters.changeVote,
    set: (instance: ReturnType<typeof model.create>, value: boolean) => instance.setRules({ changeVote: !value }),
  } },
  monitors: [{ label: 'Canonical rule', value: state => String(state.parameters.changeVote) }], views: [],
} as const satisfies UISpec<VotingParameters, ReturnType<typeof model.create>>;
const conventional = model.create({ width: 3, height: 3 });
equal(precedenceSpec.live.changeVote.value(conventional.read()), true, 'Explicit getter overrides conventional false');
precedenceSpec.live.changeVote.set(conventional, false);
equal(conventional.read().parameters.changeVote, true, 'Explicit action alone determines inverse presentation semantics');

export async function precedenceBrowserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, precedenceSpec).mount(container);
  try {
    await settle(container);
    button(container, 'Setup').click(); await settle(container);
    const input = control(container, 'Change Vote');
    const checked = () => input instanceof HTMLInputElement ? input.checked : input.getAttribute('aria-checked') === 'true';
    equal(checked(), true, 'Explicit getter takes precedence over canonical false');
    input.click(); await settle(container);
    equal(container.querySelector('dd')?.textContent?.trim(), 'true', 'Explicit action receives the displayed boolean');
    equal(checked(), false, 'Explicit getter rereads canonical state after action');
  } finally { mounted.dispose(); }
}
