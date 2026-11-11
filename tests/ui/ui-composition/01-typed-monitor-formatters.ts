import { defineUI } from '../../../ui/index.ts';
import { model } from '../../../models/voting/model.ts';
import { assert, equal, button, monitor, settle, stepOnce } from './assertions.ts';

/** Scalar annotations select the matching monitor contract; genuine unions still narrow. */
export function entry(bind: typeof defineUI = defineUI) {
  return bind(model, {
    setup: ['seed'],
    monitors: [
      { label: 'Tick', value: state => state.tick, format: (value: number) => value.toFixed(2) },
      { label: 'Phase', value: state => state.done ? 'done' : 'running', format: (value: string) => value.toUpperCase() },
      { label: 'Mixed', value: state => state.done ? 'done' : state.tick,
        format: value => typeof value === 'number' ? value.toFixed(1) : value.toUpperCase() },
    ],
    views: [],
  });
}
export const ui = entry();
const simulation = model.create({ width: 5, height: 5, seed: 17 });
const before = simulation.read();
equal(before.tick.toFixed(2), '0.00', 'Numeric presentation retains two places');
equal(typeof before.tick, 'number', 'Scientific tick stays numeric');
simulation.advance();
assert(simulation.read().tick === 1, 'Real Voting advances one procedure');
equal(before.tick, 0, 'Formatting and later stepping do not mutate detached observations');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = entry(bind).mount(container);
  try {
    await settle(container);
    button(container, 'Reload').click(); await settle(container);
    equal(monitor(container, 'Tick'), '0.00', 'Number formatter receives a number');
    assert(['RUNNING', 'DONE'].includes(monitor(container, 'Phase')), 'Text formatter receives text');
    equal(monitor(container, 'Mixed'), '0.0', 'Union formatter narrows numeric branch');
    await stepOnce(container);
    equal(monitor(container, 'Tick'), '1.00', 'Typed formatter refreshes after a real step');
  } finally { mounted.dispose(); }
}
