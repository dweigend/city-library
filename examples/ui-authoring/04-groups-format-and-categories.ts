import { defineUI, type UISpec } from '../../ui/index.ts';
import { model, type WealthParameters } from '../../experiments/wealth-distribution/model.ts';
import { assert, equal, labels, button, settle } from './assertions.ts';

type Instance = ReturnType<typeof model.create>;
export const spec = {
  setup: ['seed', 'people'],
  live: {
    growthAmount: { group: 'Resources', set: (instance, value) => instance.setRules({ growthAmount: value }) },
    minLife: { group: 'Lifespan', set: (instance, value) => instance.setRules({ minLife: value }) },
    growthInterval: { group: 'Resources', set: (instance, value) => instance.setRules({ growthInterval: value }) },
  },
  monitors: [{
    label: 'Gini', value: state => state.gini,
    format: (value: string | number) => typeof value === 'number' ? value.toFixed(3) : value,
  }],
  views: [{
    type: 'bar', label: 'Current wealth classes',
    xAxis: { label: 'Wealth class' }, yAxis: { label: 'Population', unit: 'people' },
    series: state => [{ label: 'Population', points: [
      { x: 'Low', y: state.classes.low },
      { x: 'Middle', y: state.classes.middle },
      { x: 'High', y: state.classes.high },
    ] }],
  }, {
    type: 'bar', label: 'Field coordinates',
    xAxis: { label: 'Sample field' }, yAxis: { label: 'Coordinate', unit: 'world units' },
    series: state => {
      const origin = state.cells.find(cell => cell.x === 0 && cell.y === 0)!;
      const west = state.cells.find(cell => cell.x === -1 && cell.y === 0)!;
      return [
        { label: 'X', points: [{ x: 'Origin', y: origin.x }, { x: 'West', y: west.x }] },
        { label: 'Y', points: [{ x: 'Origin', y: origin.y }, { x: 'West', y: west.y }] },
      ];
    },
  }],
} as const satisfies UISpec<WealthParameters, Instance>;
export const ui = defineUI(model, spec);
const actual = model.create({ seed: 31, people: 2 });
const before = actual.read();
const value = spec.monitors[0].value(before);
equal(typeof value, 'number', 'The scientific observation stays numeric');
equal(spec.monitors[0].format(value), before.gini.toFixed(3), 'Formatting is a separate presentation callback');
const points = spec.views[0].series(before)[0]!.points;
equal(points.map(point => point.x), ['Low', 'Middle', 'High'], 'Categories carry their own readable names');
equal(points.reduce((sum, point) => sum + point.y, 0), before.peopleCount, 'Chart projects existing headless class reporters');
const coordinates = spec.views[1].series(before);
equal(coordinates.map(series => series.points.map(point => point.y)), [[0, -1], [0, 0]], 'Real field coordinates exercise signed/zero values and shared categories without aggregation');
equal(actual.read().randomState, before.randomState, 'Presentation consumes no model RNG');

export async function browserChecks(container: HTMLElement, bind: typeof defineUI = defineUI) {
  const mounted = bind(model, spec).mount(container);
  try {
    await settle(container);
    const groups = [...container.querySelectorAll('fieldset')];
    equal(groups.map(group => group.querySelector('legend')?.textContent?.trim()), ['Resources', 'Lifespan'], 'Flat groups appear at first occurrence');
    equal(labels(groups[0]!, Object.keys(model.inputs)), ['Growth Amount', 'Growth Interval'], 'Non-adjacent members share one group in authored order');
    equal(labels(groups[1]!, Object.keys(model.inputs)), ['Min Life'], 'Second group retains its member');
    button(container, 'Setup').click(); await settle(container);
    const formatted = container.querySelector('dd')?.textContent?.trim() ?? '';
    assert(/^0\.\d{3}$/.test(formatted), 'Mounted monitor applies the formatter');
    const chart = container.querySelector('svg[role="img"]');
    assert(chart, 'Categorical chart renders');
    const accessible = `${chart.getAttribute('aria-label') ?? ''} ${chart.textContent ?? ''}`;
    for (const word of ['Low', 'Middle', 'High', 'Wealth class', 'Population (people)'])
      assert(accessible.includes(word), `Chart exposes ${word}`);
    const coordinateChart = [...container.querySelectorAll('svg[role="img"]')][1];
    assert(coordinateChart, 'Grouped signed coordinate bars render');
    const coordinateText = `${coordinateChart.getAttribute('aria-label') ?? ''} ${coordinateChart.textContent ?? ''}`;
    for (const word of ['Origin', 'West', '-1', 'Coordinate (world units)'])
      assert(coordinateText.includes(word), `Signed grouped chart exposes ${word}`);
  } finally { mounted.dispose(); }
}
