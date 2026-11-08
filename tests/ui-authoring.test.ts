import { describe, expect, test } from 'bun:test';
import { normalizeAuthoring, decodeControl, groupLive } from '../ui/authoring.ts';
import { defineUI, type UISpec } from '../ui/index.ts';
import { model as voting, type VotingParameters } from '../experiments/voting/model.ts';
import { model as wealth } from '../experiments/wealth-distribution/model.ts';
import { inputs as wolfInputs } from '../experiments/wolf-sheep-predation/model.ts';
import { createSession, type SessionState } from '../ui/svelte/session.ts';

describe('public authoring contract at the common host boundary', () => {
  test('normalization is inert and a decoded keyed action affects only its real model', () => {
    let creations = 0;
    const definition = { ...voting, create(options?: Partial<VotingParameters>) {
      creations++; return voting.create(options);
    } };
    const spec = { live: { changeVote: { set: (model, value) => model.setRules({ changeVote: value }) } }, views: [] } satisfies UISpec<VotingParameters, ReturnType<typeof voting.create>>;
    const entry = defineUI(definition, spec);
    const normalized = normalizeAuthoring(definition, spec);
    expect(typeof entry.mount).toBe('function');
    expect(creations).toBe(0);
    expect(normalized.setup.map(field => field.field)).toEqual(['width', 'height', 'seed', 'awardCloseCallsToLoser']);
    const first = definition.create({ width: 3, height: 3, seed: 71 });
    const second = definition.create({ width: 3, height: 3, seed: 71 });
    const before = first.read();
    normalized.live[0]!.set(first, true);
    expect(first.read().parameters.changeVote).toBe(true);
    expect(second.read().parameters.changeVote).toBe(false);
    expect(first.read().tick).toBe(before.tick);
    expect(first.read().randomState).toEqual(before.randomState);
    expect(() => normalized.live[0]!.set(first, 'true')).toThrow(TypeError);
    expect(first.read().parameters.changeVote).toBe(true);
  });

  test('new exclusion does not change legacy defaults, explicit ordering or factory defaults', () => {
    const legacy = normalizeAuthoring(voting, { live: [{ field: 'changeVote', value: (state: ReturnType<ReturnType<typeof voting.create>['read']>) => state.parameters.changeVote, set: (model: ReturnType<typeof voting.create>, value: string | number | boolean) => model.setRules({ changeVote: Boolean(value) }) }], views: [] });
    expect(legacy.setup.map(field => field.field)).toEqual(Object.keys(voting.inputs) as (keyof VotingParameters)[]);
    expect(normalizeAuthoring(voting, { live: {}, views: [] }).setup.map(field => field.field)).toEqual(Object.keys(voting.inputs) as (keyof VotingParameters)[]);
    const explicit = normalizeAuthoring(voting, { setup: ['seed', { field: 'width', label: 'Columns' }], live: {}, views: [] });
    expect(explicit.setup).toEqual([{ field: 'seed' }, { field: 'width', label: 'Columns' }]);
    expect(voting.inputs.width.default).toBe(151);
  });

  test('explicit getter overrides a compatible conventional getter and remains pure', () => {
    const normalized = normalizeAuthoring(voting, { live: { changeVote: {
      value: state => !state.parameters.changeVote,
      set: (model, value) => model.setRules({ changeVote: !value }),
    } }, views: [] });
    const model = voting.create({ width: 3, height: 3 });
    const before = model.read();
    expect(normalized.live[0]!.value(before)).toBe(true);
    expect(model.read().randomState).toEqual(before.randomState);
    normalized.live[0]!.set(model, false);
    expect(model.read().parameters.changeVote).toBe(true);
    expect(normalized.live[0]!.value(model.read())).toBe(false);
  });

  test('group validation happens at normalization and keeps first occurrence without nesting', () => {
    const spec = { live: {
      changeVote: { group: 'Rules', set: (model, value) => model.setRules({ changeVote: value }) },
      awardCloseCallsToLoser: { group: 'Rules', set: (model, value) => model.setRules({ awardCloseCallsToLoser: value }) },
    }, views: [] } satisfies UISpec<VotingParameters, ReturnType<typeof voting.create>>;
    expect(groupLive(normalizeAuthoring(voting, spec).live).map(group => ({ label: group.label, fields: group.fields.map(field => field.field) }))).toEqual([{ label: 'Rules', fields: ['changeVote', 'awardCloseCallsToLoser'] }]);
    for (const group of ['', '   ']) {
      const invalid = { live: { changeVote: { group, set: (model, value) => model.setRules({ changeVote: value }) } }, views: [] } satisfies UISpec<VotingParameters, ReturnType<typeof voting.create>>;
      expect(() => defineUI(voting, invalid)).not.toThrow();
      expect(() => normalizeAuthoring(voting, invalid)).toThrow('Invalid empty group');
    }
    expect(groupLive([{ group: 'A', field: 1 }, { field: 2 }, { group: 'B', field: 3 }, { group: 'A', field: 4 }]).map(group => group.fields.map(field => field.field))).toEqual([[1, 4], [2], [3]]);
  });

  test('descriptor boundary rejects primitive confusion, nonfinite values and unknown choices', () => {
    const numeric = wealth.inputs.growthAmount;
    for (const value of ['4', NaN, Infinity, -Infinity, true, undefined, 1.5, 11]) expect(() => decodeControl(numeric, value)).toThrow();
    expect(decodeControl(numeric, 6)).toBe(6);
    expect(decodeControl(voting.inputs.changeVote, false)).toBe(false);
    expect(() => decodeControl(voting.inputs.changeVote, 0)).toThrow(TypeError);
    expect(decodeControl(wolfInputs.mode, 'sheep-wolves-grass')).toBe('sheep-wolves-grass');
    expect(() => decodeControl(wolfInputs.mode, 'unknown')).toThrow(RangeError);
    expect(() => decodeControl({ kind: 'text', default: '' }, 4)).toThrow(TypeError);
  });

  test('separate uninitialized drafts and disposed session never create or mutate a model', () => {
    let creations = 0;
    const definition = { ...wealth, create(options?: Parameters<typeof wealth.create>[0]) { creations++; return wealth.create(options); } };
    const session = createSession(definition, {
      setup: ['growthAmount'], live: { growthAmount: { set: (model, value) => model.setRules({ growthAmount: value }) } }, views: [],
    });
    let latest: SessionState | undefined;
    const unsubscribe = session.subscribe(state => latest = state);
    session.setLive('growthAmount', 6);
    session.setDraft('growthAmount', 8);
    expect(latest!.draft.growthAmount).toBe(8);
    expect(latest!.liveDraft.growthAmount).toBe(6);
    expect(creations).toBe(0);
    session.dispose();
    session.setLive('growthAmount', 9);
    session.setDraft('growthAmount', 9);
    expect(creations).toBe(0);
    expect(latest!.draft.growthAmount).toBe(8);
    expect(latest!.liveDraft.growthAmount).toBe(6);
    unsubscribe();
  });
});

test('repeated renderer failures do not republish an unchanged error state', () => {
  const session = createSession(voting, { setup: [], views: [] });
  let notifications = 0;
  const unsubscribe = session.subscribe(() => notifications++);
  session.fail(new Error('Invalid chart data'));
  const afterFirst = notifications;
  session.fail(new Error('Invalid chart data'));
  expect(notifications).toBe(afterFirst);
  session.fail(new Error('Different failure'));
  expect(notifications).toBe(afterFirst + 1);
  session.dispose(); unsubscribe();
});

test('client session restart installs a fresh owner and clears only the prior projection failure', () => {
  // Use Svelte's real client scheduler, without faking a document or claiming a browser test.
  // Rendering/effect ordering is additionally exercised by the real-browser acceptance fixture.
  const result = Bun.spawnSync([process.execPath, '--conditions=browser', '-e', `
    import { strict as assert } from 'node:assert';
    import { createSession } from './ui/svelte/session.ts';
    import { model } from './experiments/wealth-distribution/model.ts';
    const instances = [];
    const definition = { ...model, create(options) { const instance = model.create({ ...options, people: 2 }); instances.push(instance); return instance; } };
    const session = createSession(definition, { setup: [], monitors: [{ label: 'Tick', value: state => state.tick, format(value) { if (value === 1) throw Error('Actual projection failure'); return String(value); } }], views: [] });
    let state;
    const unsubscribe = session.subscribe(value => state = value);
    session.initialize();
    assert.equal(state.initialized, true);
    session.step(1);
    assert.equal(instances[0].read().tick, 1);
    assert.equal(state.error, true);
    assert.equal(state.status, 'Actual projection failure');
    session.initialize();
    assert.equal(instances.length, 2);
    assert.equal(state.epoch, 2);
    assert.equal(instances[1].read().tick, 0);
    assert.equal(instances[0].read().tick, 1);
    assert.equal(state.error, false);
    assert.equal(state.status, '');
    session.step(1);
    assert.equal(state.error, true, 'A genuine new-owner failure must still be displayed');
    session.dispose(); unsubscribe();
  `], { cwd: import.meta.dir + '/..', stdout: 'pipe', stderr: 'pipe' });
  expect(new TextDecoder().decode(result.stderr)).toBe('');
  expect(result.exitCode).toBe(0);
});

function clientSessionCase(source: string) {
  const result = Bun.spawnSync([process.execPath, '--conditions=browser', '-e', `
    import { strict as assert } from 'node:assert';
    import { createSession } from './ui/svelte/session.ts';
    import { model } from './experiments/wealth-distribution/model.ts';
    ${source}
  `], { cwd: import.meta.dir + '/..', stdout: 'pipe', stderr: 'pipe' });
  expect(new TextDecoder().decode(result.stderr)).toBe('');
  expect(result.exitCode).toBe(0);
}

test('live enabled preflight rejects first setup and restart without replacing or disposing a valid owner', () => {
  clientSessionCase(`
    for (const startWithValidOwner of [false, true]) {
      const created = [], disposed = [];
      const definition = { ...model, create(options) {
        const actual = model.create(options); created.push(actual);
        return { ...actual, dispose() { disposed.push(actual.read().peopleCount); } };
      } };
      const session = createSession(definition, {
        setup: ['people'], live: { growthAmount: {
          enabled: state => { if (state.peopleCount === 3) throw Error('Candidate enabled failure'); return true; },
          set: (instance, value) => instance.setRules({ growthAmount: value }),
        } }, views: [],
      });
      let state; const unsubscribe = session.subscribe(value => state = value);
      if (startWithValidOwner) { session.setDraft('people', 2); session.initialize(); }
      session.setDraft('people', 3); session.initialize();
      assert.equal(state.error, true);
      assert.equal(state.status, 'Candidate enabled failure');
      assert.equal(state.epoch, startWithValidOwner ? 1 : 0);
      assert.equal(state.initialized, startWithValidOwner);
      assert.equal(state.observation?.peopleCount, startWithValidOwner ? 2 : undefined);
      assert.deepEqual(disposed, [3], 'Only the rejected candidate is disposed');
      session.setDraft('people', 2); session.initialize();
      assert.equal(state.error, false, 'A successful later setup recovers');
      assert.equal(state.observation.peopleCount, 2);
      session.dispose(); unsubscribe();
    }
  `);
});

test('a callback failure after candidate preflight publishes the current owner and epoch, never disposed-owner state', () => {
  clientSessionCase(`
    const created = [], disposed = []; let candidateCalls = 0;
    const definition = { ...model, create(options) {
      const actual = model.create(options); created.push(actual);
      return { ...actual, dispose() { disposed.push(actual.read().peopleCount); } };
    } };
    const session = createSession(definition, {
      setup: ['people'], live: { growthAmount: {
        enabled: state => { if (state.peopleCount === 3 && ++candidateCalls === 2) throw Error('Post-preflight failure'); return true; },
        set: (instance, value) => instance.setRules({ growthAmount: value }),
      } }, monitors: [{ label: 'Tick', value: state => state.tick }], views: [],
    });
    let state; const unsubscribe = session.subscribe(value => state = value);
    session.setDraft('people', 2); session.initialize();
    session.setDraft('people', 3); session.initialize();
    assert.equal(state.error, true);
    assert.equal(state.status, 'Post-preflight failure');
    assert.equal(state.initialized, true);
    assert.equal(state.epoch, 2);
    assert.equal(state.observation.peopleCount, 3);
    assert.equal(state.observation.tick, 0);
    assert.deepEqual(disposed, [2], 'Old owner is disposed after replacement');
    session.step(1);
    assert.equal(created[1].read().tick, 1, 'Actions target the same owner exposed by the store');
    assert.equal(created[0].read().tick, 0);
    assert.equal(state.error, false);
    assert.equal(state.observation.peopleCount, 3);
    session.dispose(); unsubscribe();
  `);
});

test('persistent formatter failure keeps draft and speed current, preserves the primary error and recovers on restart', () => {
  clientSessionCase(`
    const created = [];
    const definition = { ...model, create(options) { const actual = model.create(options); created.push(actual); return actual; } };
    const session = createSession(definition, { setup: ['people'], monitors: [{ label: 'Tick', value: state => state.tick,
      format(value) { if (value === 1) throw Error('Primary formatter failure'); return String(value); },
    }], views: [] });
    let state; const unsubscribe = session.subscribe(value => state = value);
    session.setDraft('people', 2); session.initialize(); session.step(1);
    assert.equal(state.error, true); assert.equal(state.status, 'Primary formatter failure');
    assert.doesNotThrow(() => session.setDraft('people', 3));
    assert.equal(state.draft.people, 3);
    assert.doesNotThrow(() => session.setSpeed(7));
    assert.equal(state.speed, 7);
    assert.equal(state.status, 'Primary formatter failure');
    assert.equal(state.observation.tick, 1);
    assert.deepEqual(state.pending, ['people']);
    session.initialize();
    assert.equal(created.length, 2); assert.equal(created[1].read().peopleCount, 3);
    assert.equal(state.observation.tick, 0); assert.equal(state.epoch, 2);
    assert.equal(state.error, false); assert.equal(state.status, ''); assert.deepEqual(state.pending, []);
    session.dispose(); const before = state;
    for (const action of [() => session.setDraft('people', 4), () => session.setSpeed(1), () => session.select('stale'),
      () => session.toggleDrawing(), () => session.run(), () => session.step(1), () => session.action(0),
      () => session.repeat(0), () => session.intent({ phase: 'end' }), () => session.initialize(), () => session.fail(Error('stale'))])
      assert.doesNotThrow(action);
    assert.equal(state, before, 'Disposed presentation actions do not republish');
    assert.equal(created.length, 2); assert.equal(created[1].read().tick, 0);
    unsubscribe();
  `);
});
