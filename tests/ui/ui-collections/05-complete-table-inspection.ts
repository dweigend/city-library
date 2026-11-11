import { collectionDiagram, defineUI } from '../../../ui/index.ts';
import { assert, equal, button, settle } from '../ui-authoring/assertions.ts';

function create() {
  let length = 401; let tick = 0;
  return {
    shrink() { length = 2; }, empty() { length = 0; }, advance() { tick++; },
    read: () => ({ tick, rows: Array.from({ length }, (_, index) => ({ id: `item:${index + 1}`, ordinal: index + 1 })) }),
  };
}
export const model = { title: 'Every item remains inspectable', inputs: {}, create };
export const spec = {
  actions: [{ label: 'Keep two', run: (instance: ReturnType<typeof create>) => instance.shrink() },
    { label: 'Empty', run: (instance: ReturnType<typeof create>) => instance.empty() }],
  views: [{ type: 'table' as const, label: 'All identities', rows: (state: ReturnType<ReturnType<typeof create>['read']>) => state.rows }],
};
export const ui = defineUI(model, spec);
const actual = create(); const before = actual.read();
const projected = collectionDiagram([{ id: 'all', label: 'All identified items', kind: 'items', items: before.rows.map(row => ({ id: row.id })) }]);
equal(projected.agents.filter(agent => agent.selectable !== false).length, 401, 'A complete large collection is not silently sliced at 200');
assert(projected.agents.some(agent => agent.id === 'item:401'), 'The last supplied identity is retained');
equal(actual.read(), before, 'A large diagram projection neither mutates data nor advances time');

function paging(root: HTMLElement, label: string) {
  const result = [...root.querySelectorAll<HTMLButtonElement>('button')].find(item => item.getAttribute('aria-label') === label || item.textContent?.trim() === label);
  assert(result, `Missing accessible paging action ${label}`); return result;
}
function ordinals(root: HTMLElement) {
  return [...root.querySelectorAll('table tr')].filter(row => row.querySelector('td')).map(row => row.textContent?.trim());
}
export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, spec).mount(container);
  try {
    await settle(container); button(container, 'Reload').click(); await settle(container);
    assert(container.textContent?.includes('1–200 of 401'), 'First page reports its visible range and total');
    equal(ordinals(container).length, 200, 'Existing 200-row first page remains bounded');
    paging(container, 'Next rows').click(); await settle(container);
    assert(container.textContent?.includes('201–400 of 401'), 'Row 201 is reachable');
    assert(ordinals(container)[0]?.includes('item:201'), 'Second page begins with the actual next row');
    paging(container, 'Next rows').click(); await settle(container);
    assert(container.textContent?.includes('401–401 of 401'), 'Last page reports the exact final row');
    equal(ordinals(container).length, 1, 'Only one actual final row exists');
    button(container, 'Keep two').click(); await settle(container);
    equal(ordinals(container).length, 2, 'Shrinking rows clamps paging to the valid first page');
    assert(ordinals(container)[0]?.includes('item:1'), 'Clamping never invents a replacement identity');
    button(container, 'Reload').click(); await settle(container);
    assert(container.textContent?.includes('1–200 of 401'), 'Setup resets paging');
    button(container, 'Empty').click(); await settle(container);
    equal(ordinals(container).length, 0, 'Empty data invents no rows');
    assert(/no rows|empty|0 of 0/i.test(container.textContent ?? ''), 'Empty inspection is explicit');
  } finally { mounted.dispose(); }
}
