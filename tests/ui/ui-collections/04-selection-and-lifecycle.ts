import { defineUI, type SpatialData } from '../../../ui/index.ts';
import { assert, equal, button, settle } from '../ui-authoring/assertions.ts';

export const scene: SpatialData = {
  width: 10, height: 6, showLabels: false, description: 'One identified item and one nonselectable outline.',
  agents: [
    { id: 'resident:1', x: 0, y: 0, size: 12 },
    { id: 'decoration', x: 0, y: 0, shape: 'rectangle', extent: { width: 4, height: 2 }, filled: false, selectable: false },
  ],
};
let steps = 0;
export const model = { title: 'Identity without decoration selection', inputs: {}, create: () => {
  let invalid = false;
  return { read: () => invalid ? { ...scene, width: 0 } : scene, advance() { steps++; }, invalidate() { invalid = true; } };
} };
export const ui = defineUI(model, { views: [{ type: 'spatial', label: 'Item', data: state => state }] });
equal(scene.agents.filter(agent => agent.selectable !== false).map(agent => agent.id), ['resident:1'], 'Only actual identity participates in selection');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, { actions: [{ label: 'Invalid projection', run: instance => instance.invalidate() }], views: [
    { type: 'spatial', label: 'Item', data: state => state },
    { type: 'inspector', label: 'Selected identity', value: (_state, selected) => selected ? { selected } : undefined },
  ] }).mount(container);
  try {
    await settle(container); button(container, 'Reload').click(); await settle(container);
    const canvas = container.querySelector('canvas'); assert(canvas, 'An actual canvas is mounted');
    const bounds = canvas.getBoundingClientRect();
    canvas.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: bounds.left + bounds.width / 2, clientY: bounds.top + bounds.height / 2 }));
    await settle(container);
    assert(container.textContent?.includes('resident:1'), 'A painted decorative outline cannot steal the underlying item');
    canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })); await settle(container);
    assert(canvas.getAttribute('aria-label')?.includes('resident:1'), 'End skips nonselectable decoration');
    equal(steps, 0, 'Picking and keyboard do not step scientific time');
    const validPixels = canvas.toDataURL();
    button(container, 'Invalid projection').click(); await settle(container);
    assert(container.querySelector('[role="alert"]')?.textContent?.trim(), 'A malformed candidate reports an accessible error');
    equal(canvas.toDataURL(), validPixels, 'Rejecting an invalid projection preserves the previous valid canvas');
    mounted.dispose(); await settle(container);
    const width = canvas.width, height = canvas.height;
    window.dispatchEvent(new Event('resize')); await settle(container);
    equal(container.querySelector('canvas'), null, 'Dispose detaches the canvas');
    equal([canvas.width, canvas.height], [width, height], 'A later resize cannot rewrite disposed buffer dimensions');
  } finally { mounted.dispose(); }
  const circularScene = { ...scene, agents: [{ id: 'near', x: 0, y: 0, size: 2 }, { id: 'ignored', x: 1, y: 0, size: 2, selectable: false }] };
  const old = bind({ ...model, create: () => ({ read: () => circularScene, advance() {} }) }, { views: [{ type: 'spatial', label: 'Circular nearest', data: state => state }] }).mount(container);
  try {
    await settle(container); button(container, 'Reload').click(); await settle(container);
    const canvas = container.querySelector('canvas'); assert(canvas, 'Circular symbols use the same renderer');
    canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })); await settle(container);
    assert(canvas.getAttribute('aria-label')?.includes('near'), 'Circular nearest/keyboard compatibility excludes explicitly ignored symbols');
  } finally { old.dispose(); }
}
