import { collectionDiagram, defineUI, scientificPalette, type CollectionRow } from '../../../ui/index.ts';
import { assert, equal, button, settle } from '../ui-authoring/assertions.ts';

export const rows: readonly CollectionRow[] = [
  { id: 'completed', label: 'Completed residents', kind: 'count', count: 0 },
  { id: 'water', label: 'Synthetic allocation', kind: 'capacity', used: 2.5, capacity: 2, unit: 'allocation units' },
  { id: 'empty', label: 'Empty waiting set', kind: 'items', items: [] },
  { id: 'identified', label: 'Identified residents', kind: 'items', items: [{ id: 'resident:7' }] },
];
const data = collectionDiagram(rows);
export const model = { title: 'Counts are not identities', inputs: {}, create: () => ({ read: () => data, advance() {} }) };
export const ui = defineUI(model, { views: [{ type: 'spatial', label: 'Distinct quantities', data: state => state }] });
equal(collectionDiagram([]).description, 'No collections', 'Empty input has a useful explicit default');
equal(collectionDiagram([]).agents.length, 0, 'Empty input invents no glyphs');
equal(data.agents.filter(agent => agent.selectable !== false).map(agent => agent.id), ['resident:7'], 'Anonymous counts and capacity cannot become selectable fake people');
equal(data.agents.find(agent => agent.id === 'resident:7')?.color, scientificPalette.neutral, 'Omitted item and row colors use neutral');
assert(data.description?.includes('0'), 'Zero count remains explicit');
assert(data.description?.includes('2.5') && data.description.includes('allocation units'), 'Fractional capacity and synthetic units are exact');
assert(!data.description?.includes('m³'), 'Synthetic water allocation is not silently assigned physical volume');
const before = JSON.stringify(rows);
const identity = data.agents.find(agent => agent.id === 'resident:7');
assert(identity, 'The detached identified output exists');
Object.assign(identity, { color: scientificPalette.active });
equal(JSON.stringify(rows), before, 'Mutating a returned presentation record cannot mutate its input');
function rejects(input: unknown, kind: typeof TypeError | typeof RangeError) {
  let correct = false;
  try { collectionDiagram(input as never); } catch (error) { correct = error instanceof kind; }
  assert(correct, `Invalid public collection input must throw ${kind.name}`);
}
for (const count of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) rejects([{ id: 'n', label: 'Count', kind: 'count', count }], RangeError);
rejects([{ id: 'n', label: 'Count', kind: 'count', count: '2' }], TypeError);
rejects([{ id: 'n', label: 'Wrong mixture', kind: 'count', count: 2, items: [] }], TypeError);
rejects([{ id: 'n', label: 'Wrong kind', kind: 'unknown', count: 2 }], TypeError);
rejects([{ id: 'n', label: 'Wrong order', kind: 'items', order: 'fifo', items: [] }], TypeError);
rejects([{ id: 'n', label: 'Wrong shape', kind: 'items', items: [{ id: 'person', shape: 'hexagon' }] }], TypeError);
rejects([{ id: 'n', label: 'One', kind: 'count', count: 1 }, { id: 'n', label: 'Two', kind: 'count', count: 2 }], RangeError);
rejects([{ id: 'a', label: 'One', kind: 'items', items: [{ id: 'same' }] }, { id: 'b', label: 'Two', kind: 'items', items: [{ id: 'same' }] }], RangeError);
rejects([{ id: 'capacity', label: 'Capacity', kind: 'capacity', used: 1, capacity: 2, unit: '' }], TypeError);
rejects([{ id: 'capacity', label: 'Capacity', kind: 'capacity', used: -1, capacity: 2, unit: 'units' }], RangeError);
const decoration = collectionDiagram([{ id: 'capacity', label: 'Capacity', kind: 'capacity', used: 1, capacity: 2, unit: 'units' }]).agents.find(agent => agent.selectable === false);
assert(decoration, 'Capacity uses a nonselectable symbolic decoration');
rejects([{ id: 'capacity', label: 'Capacity', kind: 'capacity', used: 1, capacity: 2, unit: 'units' },
  { id: 'people', label: 'People', kind: 'items', items: [{ id: decoration.id }] }], RangeError);

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, { views: [{ type: 'spatial', label: 'Distinct quantities', data: state => state }] }).mount(container);
  try {
    await settle(container); button(container, 'Setup').click(); await settle(container);
    const canvas = container.querySelector('canvas'); assert(canvas, 'The common spatial renderer mounts');
    canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })); await settle(container);
    assert(canvas.getAttribute('aria-label')?.includes('resident:7'), 'Keyboard selection skips all count/capacity decorations');
  } finally { mounted.dispose(); }
}
