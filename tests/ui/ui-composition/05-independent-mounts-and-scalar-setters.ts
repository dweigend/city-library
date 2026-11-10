import { defineUI, type UISpec, type Observation } from '../../../ui/index.ts';
import { model, type VotingParameters } from '../../../models/voting/model.ts';
import { assert, equal, button, monitor, settle } from './assertions.ts';

type Instance = ReturnType<typeof model.create>;
/** Existing extracted UISpec syntax with a broad, safe formatter stays compatible. */
export const legacySpec = {
  setup: ['seed'],
  live: [{ field: 'changeVote', value: (state: Observation<typeof model>) => state.parameters.changeVote,
    set: (instance: Instance, value: string | number | boolean) => instance.setRules({ changeVote: Boolean(value) }) }],
  monitors: [{ label: 'Tick', value: (state: Observation<typeof model>) => state.tick,
    format: (value: string | number) => String(value) }],
  views: [],
} satisfies UISpec<VotingParameters, Instance>;
export const ui = defineUI(model, legacySpec);
const first = model.create({ width: 5, height: 5, seed: 23 });
const second = model.create({ width: 5, height: 5, seed: 23 });
const secondBefore = JSON.stringify(second.read());
first.advance();
equal(first.read().tick, 1, 'First real model advances');
equal(JSON.stringify(second.read()), secondBefore, 'Second real model and RNG remain untouched');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const left = document.createElement('section');
  const right = document.createElement('section');
  container.append(left, right);
  const instances: Instance[] = [];
  const tracked = { ...model, create(options?: Parameters<typeof model.create>[0]) {
    const actual = model.create(options); instances.push(actual); return actual;
  } };
  const first = bind(tracked, legacySpec).mount(left);
  const second = bind(tracked, legacySpec).mount(right);
  try {
    await settle(container);
    button(left, 'Setup').click(); button(right, 'Setup').click(); await settle(container);
    button(left, '1 step').click(); await settle(container);
    equal(monitor(left, 'Tick'), '1', 'First mounted model advances');
    equal(monitor(right, 'Tick'), '0', 'Independent mounted model stays unchanged');
    const stale = button(left, '1 step');
    const disposedBefore = JSON.stringify(instances[0]!.read());
    first.dispose();
    stale.click(); await settle(container);
    equal(JSON.stringify(instances[0]!.read()), disposedBefore, 'Stale callback leaves its own disposed model tick and RNG unchanged');
    equal(monitor(right, 'Tick'), '0', 'Disposed callback cannot affect another owner');
    assert(right.isConnected, 'Other mount survives disposal');
  } finally { first.dispose(); second.dispose(); left.remove(); right.remove(); }
}
