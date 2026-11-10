import { collectionDiagram, defineUI, scientificPalette, type Observation, type SpatialData } from '../../ui/index.ts';
import { model } from '../../models/des-goods-buffer/model.ts';
import { assert, equal, button, settle } from '../ui-authoring/assertions.ts';

export function scene(state: Observation<typeof model>): SpatialData {
  return collectionDiagram([
    { id: 'blocked', label: 'Blocked puts', kind: 'items', order: 'supplied', color: scientificPalette.waiting,
      items: state.blockedCrates.map(crate => ({ id: `crate:${crate.crate}` })) },
    { id: 'stored', label: 'Stored crates', kind: 'items', order: 'supplied', color: scientificPalette.active,
      items: state.crates.map(crate => ({ id: `crate:${crate.crate}` })) },
    { id: 'capacity', label: 'Store capacity', kind: 'capacity', used: state.stored, capacity: state.parameters.capacity, unit: 'crates' },
    { id: 'collected', label: 'Collected crates', kind: 'items', color: scientificPalette.completed,
      items: state.deliveries.map(crate => ({ id: `crate:${crate.crate}` })) },
  ]);
}
export const spec = {
  actions: [{ label: 'Produce crate', run: (instance: ReturnType<typeof model.create>) => instance.produce() }],
  views: [{ type: 'spatial' as const, label: 'Goods ownership', data: scene }],
};
export const ui = defineUI(model, spec);
const actual = model.create(); actual.advance(3);
const before = actual.read(); const projected = scene(before);
equal(before.crates.map(crate => crate.crate), [1, 2], 'Actual Store owns the first two crates');
equal(before.blockedCrates.map(crate => crate.crate), [3], 'Actual waiting put owns the blocked crate');
equal(projected.agents.filter(agent => agent.selectable !== false).map(agent => agent.id), ['crate:3', 'crate:1', 'crate:2'], 'Supplied row and Store order are preserved exactly');
assert(projected.description?.includes('supplied'), 'Description identifies supplied order without inventing FIFO policy');
assert(projected.description?.includes('crates'), 'Capacity preserves its actual unit');
assert(projected.labels?.some(label => label.text.includes('Stored crates')), 'A named empty/nonempty row remains visible');
equal(actual.read(), before, 'Projection does not mutate Store, event time or observations');
actual.collect();
equal(scene(actual.read()).agents.filter(agent => agent.selectable !== false).map(agent => agent.id), ['crate:2', 'crate:3', 'crate:1'], 'Collection moves identities through actual Store ownership, not UI state');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, spec).mount(container);
  try {
    await settle(container); button(container, 'Setup').click(); await settle(container);
    button(container, 'Produce crate').click(); await settle(container);
    assert(container.querySelector('canvas')?.getAttribute('aria-label')?.includes('crates'), 'Actual shared canvas exposes the capacity unit');
    assert(!container.querySelector('[role="alert"]'), 'Existing spatial host accepts the public pure projection');
  } finally { mounted.dispose(); }
}
