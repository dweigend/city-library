import { expect, test } from 'bun:test';

test('scalar formatting reads once per publication and preserves the real numeric observation', () => {
  // Exercise Svelte's real client scheduler. Browser rendering is checked separately.
  const result = Bun.spawnSync([process.execPath, '--conditions=browser', '-e', `
    import { strict as assert } from 'node:assert';
    import { defineUI } from './ui/index.ts';
    import { model as voting } from './models/voting/model.ts';
    import { createSession } from './ui/svelte/session.ts';
    const reads = [], formatted = [];
    const definition = { ...voting, create(options) { return voting.create({ ...options, width: 3, height: 3 }); } };
    const spec = { monitors: [{
      label: 'Tick',
      value(state) { reads.push(state.tick); return state.tick; },
      format(value: number) { formatted.push(value); return value.toFixed(3); },
    }], views: [] };
    assert.equal(typeof defineUI(definition, spec).mount, 'function');
    assert.deepEqual(reads, [], 'Defining an entry is inert');
    const session = createSession(definition, spec);
    let latest, publications = 0;
    const unsubscribe = session.subscribe(state => { latest = state; publications++; });
    try {
      session.initialize();
      assert.deepEqual(latest.monitors, [{ label: 'Tick', value: '0.000' }]);
      const before = latest.observation;
      reads.length = 0; formatted.length = 0; publications = 0;
      session.step(1);
      assert.equal(reads.length, publications, 'One getter evaluation per publication');
      assert.deepEqual(formatted, reads, 'Each formatter receives its paired raw result exactly once');
      assert.equal(reads.at(-1), 1);
      assert.deepEqual(latest.monitors, [{ label: 'Tick', value: '1.000' }]);
      assert.equal(latest.observation.tick, 1);
      assert.equal(before.tick, 0, 'Formatting does not mutate detached prior observations');
      assert.equal(latest.error, false);
    } finally { session.dispose(); unsubscribe(); }
  `], { cwd: import.meta.dir + '/..', stdout: 'pipe', stderr: 'pipe' });
  expect(new TextDecoder().decode(result.stderr)).toBe('');
  expect(result.exitCode).toBe(0);
});
