import { defineUI, type Observation, type SpatialData, type GridData } from '../../../ui/index.ts';
import { model as wealth } from '../../../models/wealth-distribution/model.ts';
import { assert, equal, button, restart, monitor, settle, stepOnce } from './assertions.ts';

/** Observation-only adapter exposes a deliberate cross-kind source-ID collision.
 * Scientific state, lifecycle, RNG and actions remain in the actual Wealth model. */
export const model = {
  ...wealth,
  create(options?: Parameters<typeof wealth.create>[0]) {
    const actual = wealth.create({ ...options, personCount: 2 });
    return {
      ...actual,
      read() {
        const state = actual.read();
        const agent = state.agents[0]!;
        // This sampled presentation is shown only at tick zero; later selection is stale.
        return { ...state, agents: state.tick === 0 ? [agent] : [],
          cells: state.tick === 0 ? [{ ...state.cells[0]!, id: agent.id }] : [] };
      },
    };
  },
};
type State = Observation<typeof model>;
export function inspect(state: State, selected: string | null) {
  if (selected === null) return undefined;
  const agent = state.agents.find(item => selected === `agent:${item.id}`);
  if (agent) return { kind: 'agent', sourceId: agent.id };
  const cell = state.cells.find(item => selected === `cell:${item.id}`);
  return cell ? { kind: 'cell', sourceId: cell.id } : undefined;
}
function people(state: State): SpatialData {
  return { width: state.width, height: state.height, cells: fields(state).cells, agents: state.agents.map(item => ({
    id: `agent:${item.id}`, x: item.x, y: item.y, color: '#355fa5', size: 12,
  })) };
}
function fields(state: State): GridData {
  return { width: state.width, height: state.height, cells: state.cells.map(item => ({
    id: `cell:${item.id}`, x: item.x, y: item.y, color: '#60ad2c',
  })) };
}
export function entry(bind: typeof defineUI = defineUI) {
  return bind(model, {
    setup: ['seed'],
    monitors: [{ label: 'Growth amount', value: state => state.parameters.growthAmount }],
    actions: [{
      label: 'Apply selected', enabled: (state, selected) => inspect(state, selected) !== undefined,
      run(instance, selected) {
        const item = inspect(instance.read(), selected);
        if (item) instance.setRules({ growthAmount: item.kind === 'agent' ? 6 : 7 });
      },
    }],
    views: [
      { type: 'inspector', label: 'Selected item', value: inspect },
      { type: 'spatial', label: 'People', data: people },
      { type: 'grid', label: 'Fields', data: fields },
    ],
  });
}
export const ui = entry();
const actual = model.create({ seed: 5 });
const before = actual.read();
equal(before.agents[0]!.id, before.cells[0]!.id, 'Fixture really contains equal source IDs across kinds');
equal(inspect(before, `agent:${before.agents[0]!.id}`)?.kind, 'agent', 'Agent namespace resolves agent');
equal(inspect(before, `cell:${before.cells[0]!.id}`)?.kind, 'cell', 'Cell namespace resolves cell');
equal(inspect(before, 'cell:missing'), undefined, 'Stale selection has no invented target');
equal(inspect(before, null), undefined, 'Unselected state has no target');
equal(people(before).cells![0]!.id, fields(before).cells[0]!.id, 'The same field shares its presentation ID across both views');
const previousId = `agent:${before.agents[0]!.id}`;
actual.advance();
equal(inspect(actual.read(), previousId), undefined, 'Leaving the sampled presentation invalidates its old target');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = entry(bind).mount(container);
  try {
    await settle(container);
    button(container, 'Reload').click(); await settle(container);
    const apply = button(container, 'Apply selected');
    assert(apply.disabled, 'Action starts unavailable without selection');
    const canvases = [...container.querySelectorAll('canvas')];
    equal(canvases.length, 2, 'Two views share one compatible selection contract');
    canvases[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })); await settle(container);
    assert(!apply.disabled && container.textContent?.includes('agent'), 'Agent selection resolves across inspector/action');
    apply.click(); await settle(container);
    equal(monitor(container, 'Growth amount'), '6', 'Selected agent invokes the real model action');
    canvases[1]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })); await settle(container);
    assert(!apply.disabled && container.textContent?.includes('cell'), 'Equal source ID can select the other kind');
    const sharedId = canvases[1]!.getAttribute('aria-label')?.split(' Selected ')[1];
    assert(sharedId?.startsWith('cell:'), 'Field view publishes the cell namespace');
    assert(canvases.every(canvas => canvas.getAttribute('aria-label')?.endsWith(` Selected ${sharedId}`)), 'The same selected field is shared across both views');
    apply.click(); await settle(container);
    equal(monitor(container, 'Growth amount'), '7', 'Selected cell invokes the other explicit model action');
    await stepOnce(container);
    assert(apply.disabled, 'An item leaving the projection leaves stale selection disabled');
    restart(container); await settle(container);
    assert(apply.disabled, 'Restart clears selection');
    equal(monitor(container, 'Growth amount'), '4', 'Restart uses canonical model defaults');
  } finally { mounted.dispose(); }
}
