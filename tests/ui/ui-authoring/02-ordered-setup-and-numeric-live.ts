import { defineUI, type UISpec } from '../../../ui/index.ts';
import { model, type WealthParameters } from '../../../models/wealth-distribution/model.ts';
import { equal, labels, button, changeNumber, control, controls, changeInput, settle } from './assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  setup: ['seed', { field: 'personCount', label: 'Population' }, 'bestLand'],
  live: {
    growthAmount: { set: (instance, value) => instance.setRules({ growthAmount: value }) },
  },
  monitors: [{ label: 'Growth', value: state => state.parameters.growthAmount }],
  views: [],
} as const satisfies UISpec<WealthParameters, Instance>;
export const ui = defineUI(model, spec);
const actual = model.create({ personCount: 2, seed: 21 });
spec.live.growthAmount.set(actual, 6);
equal(actual.read().parameters.growthAmount, 6, 'Numeric live setter needs no coercion');
equal(actual.read().tick, 0, 'A live action is not a model step');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, spec).mount(container);
  try {
    await settle(container);
    equal(labels(container, Object.keys(model.inputs)), ['Seed', 'Population', 'Best Land', 'Growth Amount'], 'Explicit strings and a local override preserve authored order');
    changeNumber(container, 'Growth Amount', 6); await settle(container);
    equal(container.querySelector('dd')?.textContent?.trim(), '6', 'Implicit getter refreshes canonical numeric state');
    equal((control(container, 'Growth Amount') as HTMLInputElement).value, '6', 'Control reflects canonical observation');
  } finally { mounted.dispose(); }
}

/** Separate presentation drafts: live reader wins regardless of edit order. */
export async function overlapBrowserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  for (const usesArrayFields of [false, true]) for (const liveFirst of [false, true]) {
    const instances: Instance[] = [];
    const tracked = { ...model, create(options?: Partial<WealthParameters>) {
      const actual = model.create(options); instances.push(actual); return actual;
    } };
    const live = usesArrayFields ? [{ field: 'growthAmount' as const,
      value: (state: ReturnType<Instance['read']>) => state.parameters.growthAmount,
      set: (instance: Instance, value: string | number | boolean) => instance.setRules({ growthAmount: Number(value) }),
    }] : { growthAmount: { set: (instance: Instance, value: number) => instance.setRules({ growthAmount: value }) } };
    const mounted = bind(tracked, {
      setup: [{ field: 'growthAmount' }], live,
      monitors: [{ label: 'Growth', value: state => state.parameters.growthAmount }], views: [],
    }).mount(container);
    try {
    await settle(container);
      const pair = controls(container, 'Growth Amount');
      equal(pair.length, 2, 'Explicit overlap has separate setup and live controls');
      const setupInput = pair[0]!; const liveInput = pair[1]!;
      if (liveFirst) { changeInput(liveInput, 6); await settle(container); changeInput(setupInput, 8); await settle(container); }
      else { changeInput(setupInput, 8); await settle(container); changeInput(liveInput, 6); await settle(container); }
      equal((setupInput as HTMLInputElement).value, '8', 'Setup draft stays separate');
      equal((liveInput as HTMLInputElement).value, '6', 'Live draft is not overwritten by a setup edit');
      equal(instances[0]!.read().parameters.growthAmount, 6, 'Only live edit changes the automatically initialized model');
      equal(instances.length, 1, 'Neither draft creates another model');
      // The setup submit action reads Reload with changes after setup edits.
      const submit = [...container.querySelectorAll<HTMLButtonElement>('button')].find(item => item.textContent?.trim() === 'Reload' || item.textContent?.trim() === 'Reload with changes');
      if (!submit) throw new Error('Missing Reload button');
      submit.click(); await settle(container);
      equal(instances.at(-1)!.read().parameters.growthAmount, 6, 'Live reader wins at Reload in both edit orders and hosts');
    } finally { mounted.dispose(); container.replaceChildren(); }
  }
}
