import { defineUI } from '../../ui/index.ts';
import { model } from '../../models/voting/model.ts';
import { assert, equal, button, changeNumber, restart, monitor, settle } from './assertions.ts';

const message = 'Deliberate presentation failure after stepping';
export function entry(bind: typeof defineUI = defineUI) {
  return bind(model, {
    setup: ['seed'],
    monitors: [{ label: 'Tick', value: state => state.tick, format(value: number) {
      if (value > 0) throw new Error(message);
      return value.toFixed(2);
    } }],
    views: [],
  });
}
export const ui = entry();
const actual = model.create({ width: 5, height: 5, seed: 7 });
const before = actual.read();
equal(before.tick.toFixed(2), '0.00', 'Initial raw value has valid presentation');
actual.advance();
equal(actual.read().tick, 1, 'Formatter failure cannot roll back or replace scientific time');
equal(typeof actual.read().tick, 'number', 'Model reports a number regardless of presentation');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = entry(bind).mount(container);
  try {
    await settle(container);
    button(container, 'Setup').click(); await settle(container);
    equal(monitor(container, 'Tick'), '0.00', 'Initial formatted state');
    button(container, '1 step').click(); await settle(container);
    assert(container.textContent?.includes(message), 'Formatter error reaches the host error path');
    changeNumber(container, 'Seed', 19); await settle(container);
    assert(container.textContent?.includes(message), 'Pending edit preserves primary error');
    restart(container); await settle(container);
    equal(monitor(container, 'Tick'), '0.00', 'A fresh real model recovers formatting');
    assert(!container.textContent?.includes(message), 'Successful restart clears previous error');
  } finally { mounted.dispose(); }
}
