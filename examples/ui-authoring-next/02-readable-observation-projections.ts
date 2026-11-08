import { defineUI, type Observation, type SpatialData, type BarSeries } from '../../ui/index.ts';
import type { Observation as SvelteObservation } from '../../ui/svelte/index.ts';
import { model } from '../../experiments/wealth-distribution/model.ts';
import { assert, equal, button, monitor, settle } from './assertions.ts';

type Wealth = Observation<typeof model>;
/** Named presentation mapping; the original model scale and RGB channels are unchanged. */
export function grainColor(grain: number): string {
  const channel = Math.round((grain / 50) * 255);
  return `rgb(${channel},${channel},0)`;
}
export function resources(state: Wealth): SpatialData {
  return {
    width: state.width, height: state.height,
    cells: state.cells.map(cell => ({ id: `field:${cell.id}`, x: cell.x, y: cell.y, color: grainColor(cell.grain) })),
    agents: state.agents.map(agent => ({
      id: `person:${agent.id}`, x: agent.x, y: agent.y,
      heading: agent.heading, shape: 'triangle', size: 8, color: '#355fa5',
    })),
  };
}
export function classes(state: SvelteObservation<typeof model>): readonly BarSeries[] {
  return [{ label: 'People', points: [
    { x: 'Low', y: state.classes.low }, { x: 'Middle', y: state.classes.middle }, { x: 'High', y: state.classes.high },
  ] }];
}
export function entry(bind: typeof defineUI = defineUI) {
  return bind(model, {
    setup: ['seed', 'people'],
    monitors: [{ label: 'People', value: state => state.peopleCount }],
    views: [
      { type: 'spatial', label: 'Resources and people', data: resources },
      { type: 'bar', label: 'Wealth classes', xAxis: { label: 'Class' }, yAxis: { label: 'People' }, series: classes },
    ],
  });
}
export const ui = entry();
const simulation = model.create({ seed: 3, people: 2 });
const state: Wealth = simulation.read();
const before = JSON.stringify(state);
equal(grainColor(0), 'rgb(0,0,0)', 'Zero-grain color remains black');
equal(grainColor(50), 'rgb(255,255,0)', 'Full-grain color remains yellow');
equal(resources(state).agents.length, 2, 'Projection keeps the real population');
equal(classes(state)[0]!.points.reduce((sum, point) => sum + point.y, 0), 2, 'Categories use canonical class reporters');
equal(JSON.stringify(simulation.read()), before, 'Projection does not mutate observations or draw randomness');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = entry(bind).mount(container);
  try {
    await settle(container);
    button(container, 'Setup').click(); await settle(container);
    equal(monitor(container, 'People'), '250', 'Public observation alias adds no wrapper or population');
    assert(container.querySelector('canvas'), 'Named spatial projection renders');
    const chart = container.querySelector('svg[role="img"]');
    assert(chart && chart.getAttribute('aria-label')?.includes('Low'), 'Named categorical projection renders accessible categories');
  } finally { mounted.dispose(); }
}
