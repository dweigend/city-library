import { defineUI } from '../../../ui/index.ts';
import type { Definition } from '../../../models/definition.ts';
import { assert, equal, button, settle } from '../ui-authoring/assertions.ts';

function create() {
  let phase = 0;
  return { advance() { phase++; }, read: () => ({ phase }) };
}
export const model: Definition<{}, ReturnType<typeof create>> = { title: 'Stable series identity', inputs: {}, create };
export const spec = {
  views: [{ type: 'line' as const, label: 'Conditional series', series: (state: { phase: number }) => {
    const first = { label: 'A', points: [{ x: 0, y: 1 }, { x: 1, y: 2 }] };
    const second = { label: 'B', points: [{ x: 0, y: 2 }, { x: 1, y: 3 }] };
    const fixed = { label: 'Fixed', color: '#123456', points: [{ x: 0, y: 3 }, { x: 1, y: 4 }] };
    if (state.phase === 1) return [second, fixed];
    if (state.phase === 2) return [second, first, fixed];
    if (state.phase === 3) return [{ ...first, label: 'Twin' }, { ...second, label: 'Twin' }];
    return [first, second, fixed];
  } }],
};
export const ui = defineUI(model, spec);
equal(spec.views[0]!.series({ phase: 0 }).map(series => series.label), ['A', 'B', 'Fixed'], 'Series labels are explicit presentation identity');
equal(spec.views[0]!.series({ phase: 1 }).map(series => series.label), ['B', 'Fixed'], 'A conditional series may disappear without changing remaining labels');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, spec).mount(container);
  const colors = () => [...container.querySelectorAll('svg[role="img"] path[stroke-width="2"]')].map(path => path.getAttribute('stroke'));
  try {
    await settle(container); button(container, 'Setup').click(); await settle(container);
    const initial = colors(); equal(initial.length, 3, 'Three data paths render');
    assert(initial[0] !== initial[1], 'Distinct default series use distinct initial palette slots');
    equal(initial[2], '#123456', 'Explicit scientific color takes precedence');
    button(container, '1 step').click(); await settle(container);
    equal(colors(), [initial[1], '#123456'], 'Filtering A preserves B color');
    button(container, '1 step').click(); await settle(container);
    equal(colors(), [initial[1], initial[0], '#123456'], 'Reordering retains unique-label color identity');
    button(container, '1 step').click(); await settle(container);
    equal(colors(), initial.slice(0, 2), 'Duplicate labels retain positional compatibility fallback');
    button(container, 'Setup').click(); await settle(container);
    equal(colors(), initial, 'Setup recreates the chart color lifetime');
  } finally { mounted.dispose(); }
}
