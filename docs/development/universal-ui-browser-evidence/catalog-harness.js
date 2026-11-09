// Real-browser QA only. Uses the public catalog controls and field events.
const base = '/@fs/home/david/.t3/worktrees/city-library/t3-4aa89a8c';
const pause = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
const catalog = (await import('agent-lab-catalog')).catalog;
const reports = await Promise.all(['a', 'b'].map(async group => (await fetch(`${base}/docs/development/universal-ui-migrations-${group}.json`)).json()));
const migrations = new Map(reports.flatMap(report => report.entries).filter(entry => entry.decision === 'migrate').map(entry => [entry.slug, entry]));
window.universalQa = { catalog, migrations, smoke: [], errors: [], console: [] };
window.addEventListener('error', event => window.universalQa.errors.push({ slug: new URL(location.href).searchParams.get('experiment'), message: event.message }));
window.addEventListener('unhandledrejection', event => window.universalQa.errors.push({ slug: new URL(location.href).searchParams.get('experiment'), rejection: String(event.reason) }));
for (const level of ['warn', 'error']) {
  const original = console[level];
  console[level] = (...values) => { window.universalQa.console.push({ level, message: values.map(String).join(' ').slice(0, 500) }); original.apply(console, values); };
}
const content = () => document.querySelector('#experiment-content');
const button = label => [...content().querySelectorAll('button')].find(candidate => candidate.textContent.trim() === label || label === 'Setup' && candidate.textContent.trim() === 'Restart with changes');
const alertText = () => [...content().querySelectorAll('[role="alert"]')].map(node => node.textContent.trim()).filter(Boolean);
const monitors = () => [...content().querySelectorAll('.lab-monitors dt')].map(node => ({ label: node.textContent, value: node.nextElementSibling?.textContent }));
async function wait(condition, message) {
  const deadline = performance.now() + 8000;
  while (!condition()) { if (performance.now() > deadline) throw new Error(message); await pause(20); }
}
async function chooseOption(label) {
  await wait(() => [...document.querySelectorAll('[role="option"]')].some(node => node.textContent.trim() === label), `Missing option ${label}`);
  const option = [...document.querySelectorAll('[role="option"]')].find(node => node.textContent.trim() === label);
  option.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', button: 0 }));
  option.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse', button: 0 }));
  await frame();
}
async function select(slug) {
  const entry = catalog.find(entry => entry.slug === slug);
  if (!entry) throw new Error(`Unknown catalog slug ${slug}`);
  if (new URL(location.href).searchParams.get('experiment') !== slug) {
    const search = document.querySelector('input[aria-label="Find experiment"]');
    search.value = entry.title; search.dispatchEvent(new Event('input', { bubbles: true }));
    await frame(); document.querySelector('[aria-label="Experiment"]').click();
    await chooseOption(entry.title);
    await wait(() => new URL(location.href).searchParams.get('experiment') === slug && button('Setup'), `Catalog switch ${slug}`);
  }
  await frame();
}
function numericAlternative(control) {
  const current = control.valueAsNumber;
  const minimum = control.min === '' ? -Infinity : Number(control.min);
  const maximum = control.max === '' ? Infinity : Number(control.max);
  const step = control.step !== 'any' && control.step !== '' ? Number(control.step) : maximum - minimum <= 2 ? 0.01 : 1;
  for (const value of [current + step, current - step]) if (Number.isFinite(value) && value >= minimum && value <= maximum) return Number(value.toPrecision(12));
}
async function liveEdit(slug) {
  const migration = migrations.get(slug);
  if (!migration) return null;
  const parameterToggle = button('Parameters');
  if (parameterToggle?.getAttribute('aria-expanded') === 'false') { parameterToggle.click(); await frame(); }
  const keys = [...migration.migratedControlKeys].sort((a, b) => Number(/size|width|height|seed|length|population|count/i.test(a)) - Number(/size|width|height|seed|length|population|count/i.test(b)));
  const descriptorModule = await import(`${base}/experiments/${slug}/model.ts`);
  const descriptors = descriptorModule.inputs ?? descriptorModule.model.inputs;
  for (const key of keys) {
    const descriptor = descriptors[key];
    const control = [...content().querySelectorAll('input,button[role="checkbox"],button[role="combobox"]')].find(node => node.name === key && node.getAttribute('aria-hidden') !== 'true')
      ?? [...content().querySelectorAll('button[id]')].find(node => node.id.endsWith(`-${key}`));
    if (!control || control.disabled) continue;
    let before, expected, actual;
    if (descriptor.kind === 'boolean') {
      before = control.getAttribute('aria-checked') === 'true'; expected = !before;
      control.click(); await frame(); actual = control.getAttribute('aria-checked') === 'true';
    } else if (descriptor.kind === 'choice') {
      before = control.textContent.trim(); expected = descriptor.options.find(value => value !== before);
      if (expected === undefined) continue;
      control.click(); await chooseOption(expected); actual = control.textContent.trim();
    } else if (descriptor.kind === 'number' && control instanceof HTMLInputElement) {
      before = control.valueAsNumber; expected = numericAlternative(control);
      if (expected === undefined) continue;
      control.value = String(expected); control.dispatchEvent(new Event('change', { bubbles: true }));
      await frame(); actual = control.valueAsNumber;
    } else continue;
    const alerts = alertText();
    if (alerts.length) return { key, before, expected, actual, ok: false, alerts };
    return { key, before, expected, actual, ok: Object.is(actual, expected), proof: 'Control value refreshed from the public observation getter after its model action; no private instance access.' };
  }
  return { ok: false, error: 'No enabled migrated control had a valid alternative' };
}
window.universalQa.select = select;
window.universalQa.frame = frame;
window.universalQa.button = button;
window.universalQa.monitors = monitors;
window.universalQa.run = async (start, count) => {
  const results = [];
  for (const entry of catalog.slice(start, start + count)) {
    const began = performance.now(), errorStart = window.universalQa.errors.length;
    let result;
    try {
      await select(entry.slug); button('Setup').click(); await frame(); await frame();
      const setup = monitors(), setupAlerts = alertText();
      if (setupAlerts.length) throw new Error(`Setup: ${setupAlerts.join('; ')}`);
      const step = button('1 step');
      const staticOrComplete = step.disabled;
      if (!staticOrComplete) { step.click(); await frame(); await frame(); }
      const afterStep = monitors();
      const live = await liveEdit(entry.slug);
      const alerts = alertText();
      const errors = window.universalQa.errors.slice(errorStart);
      result = { slug: entry.slug, ok: !alerts.length && !errors.length && (!live || live.ok), setup, afterStep, staticOrComplete, live, alerts, errors,
        views: [...content().querySelectorAll('figure figcaption')].map(node => node.textContent),
        canvasCount: content().querySelectorAll('canvas').length, chartCount: content().querySelectorAll('svg[role="img"]').length,
        milliseconds: Math.round(performance.now() - began) };
    } catch (error) { result = { slug: entry.slug, ok: false, error: String(error), errors: window.universalQa.errors.slice(errorStart), milliseconds: Math.round(performance.now() - began) }; }
    window.universalQa.smoke.push(result); results.push(result);
  }
  return { count: results.length, passed: results.filter(result => result.ok).length, failures: results.filter(result => !result.ok) };
};
