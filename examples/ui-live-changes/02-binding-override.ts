import { defineUI, type ChangeUISpec } from '../../ui/index.ts';
import { model, type VirusParameters } from '../../models/virus/model.ts';
import { assert, equal, button, changeNumber, control, settle } from '../ui-authoring/assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  setup: [], change: (instance, changes) => instance.setParameters(changes),
  live: {
    infectiousness: {}, chanceRecover: {},
    duration: { label: 'Duration override', set: (instance, value) => instance.setParameters({ duration: value + 1 }) },
  },
  monitors: [{ label: 'Duration', value: state => state.parameters.duration }], views: [],
} as const satisfies ChangeUISpec<VirusParameters, Instance>;
export const ui = defineUI(model, spec);
const actual = model.create({ numberPeople: 10, seed: 9 });
spec.live.duration.set(actual, 12);
equal(actual.read().parameters.duration, 13, 'A binding-specific transform remains an explicit public action');
spec.change(actual, { infectiousness: 40 });
equal(actual.read().parameters.infectiousness, 40, 'Other fields can use the common model action');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  let defaults = 0;
  const tracked = { ...model, create: (options?: Partial<VirusParameters>) => model.create({ numberPeople: 10, ...options }) };
  const mounted = bind(tracked, { ...spec, change(instance, changes) { defaults++; instance.setParameters(changes); } }).mount(container);
  try {
    await settle(container); button(container, 'Setup').click(); await settle(container);
    changeNumber(container, 'Duration override', 12); await settle(container);
    equal(defaults, 0, 'An explicit setter has precedence over change');
    equal((control(container, 'Duration override') as HTMLInputElement).value, '13', 'Canonical transformed value is reread');
    changeNumber(container, 'Infectiousness', 40); await settle(container);
    equal(defaults, 1, 'An omitted setter invokes change once');
    assert(!container.querySelector('[role="alert"]'), 'Override and default coexist');
  } finally { mounted.dispose(); }
}
