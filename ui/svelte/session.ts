import { normalizeAuthoring, decodeControl, groupLive } from "../authoring.ts";
import { flushSync } from "svelte";
import { writable, type Readable } from "svelte/store";
import type { Definition } from "../../experiments/definition.ts";
import type { Descriptor } from "../controls/form.ts";
import type { DrawingIntent, Inspector, ModelInstance, Snapshot, UISpec, View } from "../definition.ts";
import { createPlayback } from "../playback.ts";
import { createRepeatedAction } from "../actions/repeat.ts";

export type Value = string | number | boolean;
export interface Parameter {
  field: string;
  label: string;
  descriptor: Descriptor;
  group?: string;
  widget?: "number" | "range" | "select" | "checkbox" | "text" | "color";
}
export interface SessionState {
  observation: unknown;
  initialized: boolean;
  running: boolean;
  complete: boolean;
  epoch: number;
  draft: Readonly<Record<string, Value>>;
  liveDraft: Readonly<Record<string, Value>>;
  pending: readonly string[];
  status: string;
  error: boolean;
  fieldErrors: Readonly<Record<string, string>>;
  selected: string | null;
  speed: number;
  drawing: boolean;
  drawingAvailable: boolean;
  actions: readonly { enabled: boolean; pressed?: boolean; repeating: boolean }[];
  liveEnabled: readonly boolean[];
  monitors: readonly { label: string; value: string | number }[];
}
export interface Session extends Readable<SessionState> {
  readonly setup: readonly Parameter[];
  readonly live: readonly Parameter[];
  readonly liveGroups: readonly { readonly label?: string; readonly fields: readonly Parameter[] }[];
  readonly actions: readonly { label: string; repeat?: { label: string; intervalMs: number } }[];
  readonly views: readonly (View<unknown> | Inspector<unknown>)[];
  readonly drawingLabel?: string;
  readonly description?: string;
  readonly source?: { readonly label: string; readonly url: string };
  initialize(): void;
  setDraft(field: string, value: Value): void;
  setLive(field: string, value: Value): void;
  run(): void;
  step(count: number): void;
  action(index: number): void;
  repeat(index: number): void;
  setSpeed(value: number): void;
  select(id: string): void;
  toggleDrawing(): void;
  intent(intent: DrawingIntent): void;
  pause(): void;
  fail(error: unknown): void;
  dispose(): void;
}

/** One session owns the model reference; stores carry only detached observations and UI state. */
export function createSession<P extends object, M extends ModelInstance>(definition: Definition<P, M>, sourceSpec: UISpec<P, M>): Session {
  const spec = normalizeAuthoring(definition, sourceSpec);
  const descriptors = new Map(Object.entries(definition.inputs) as [string, Descriptor][]);
  const title = (field: string) => field.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, value => value.toUpperCase());
  function parameter(field: string, label?: string, widget?: Parameter["widget"]): Parameter {
    const descriptor = descriptors.get(field);
    if (!descriptor) throw new Error(`Unknown input: ${field}`);
    return { field, label: label ?? title(field), descriptor, widget };
  }
  const setup = (spec.setup ?? [...descriptors.keys()].map(field => ({ field }))).map(field => parameter(field.field, "label" in field ? field.label : undefined, "widget" in field ? field.widget : undefined));
  const live = spec.live.map(field => ({ ...parameter(field.field, field.label, field.widget), group: field.group }));
  let draft: Record<string, Value> = Object.fromEntries([...descriptors].map(([field, descriptor]) => [field, descriptor.default]));
  let liveDraft: Record<string, Value> = Object.fromEntries(live.map(item => [item.field, item.descriptor.default]));
  let applied: Record<string, Value> | undefined;
  let fieldErrors: Record<string, string> = {};
  let instance: M | undefined;
  let observation: Snapshot<M> | undefined;
  let selected: string | null = null;
  let disposed = false;
  let epoch = 0;
  let speed = 5;
  let running = false;
  let drawing = false;
  let status = "";
  let error = false;
  const repeatFlags = new Set<number>();
  const store = writable<SessionState>();
  const isComplete = () => observation !== undefined && (spec.complete?.(observation) ?? false);
  function publish() {
    if (disposed) return;
    const available = observation !== undefined;
    store.set({
      observation, initialized: !!instance, running, complete: isComplete(), epoch,
      draft: { ...draft }, liveDraft: { ...liveDraft }, pending: applied ? setup.filter(field => draft[field.field] !== applied![field.field]).map(field => field.field) : [],
      status, error, fieldErrors: { ...fieldErrors }, selected, speed,
      drawing: available && !error && !!spec.drawing?.enabled(observation!) && (!spec.drawing?.toggleLabel || drawing),
      drawingAvailable: available && !!spec.drawing?.enabled(observation!),
      actions: (spec.actions ?? []).map((action, index) => ({ enabled: available && (action.enabled?.(observation!, selected) ?? true), pressed: available ? action.pressed?.(observation!) : undefined, repeating: repeatFlags.has(index) })),
      liveEnabled: (spec.live ?? []).map(field => !available || (field.enabled?.(observation!) ?? true)),
      monitors: available ? (spec.monitors ?? []).map(monitor => ({ label: monitor.label, value: monitor.format ? monitor.format(monitor.value(observation!)) : monitor.value(observation!) })) : [],
    });
  }
  function stopRepeats() { for (const repeat of repeats) repeat?.stop(); }
  function pause() {
    playback.stop(); stopRepeats(); drawing = false;
    try { publish(); } catch (cause) { fail(cause); }
  }
  function fail(cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    // A failed renderer effect can be called again by the error-state render.
    // Publishing the same failure repeatedly would recursively invalidate that effect.
    if (error && status === message && !running && !drawing) return;
    status = message; error = true; drawing = false;
    playback.stop(); stopRepeats();
    // A broken projection must not prevent the primary error from being displayed.
    try { publish(); } catch { store.update(value => ({ ...value, running: false, drawing: false, error: true, status })); }
  }
  function observe() {
    if (!instance) return;
    observation = instance.read() as Snapshot<M>;
    for (const field of spec.live ?? []) liveDraft[field.field] = field.value(observation);
    if (isComplete()) { playback.stop(); stopRepeats(); drawing = false; }
    if (spec.drawing && !spec.drawing.enabled(observation)) drawing = false;
    for (const repeat of repeats) repeat?.sync();
    publish();
  }
  function act(action: (model: M) => void) {
    if (!instance || disposed) return false;
    try { action(instance); error = false; status = ""; observe(); return true; }
    catch (cause) {
      fail(cause);
      try { observe(); } catch { /* Retain primary error. */ }
      return false;
    }
  }
  const playback = createPlayback(
    () => !isComplete() && act(model => model.advance(1)) && !isComplete(),
    value => { running = value; try { publish(); } catch (cause) { fail(cause); } },
    frame => {
      const owner = instance;
      const id = window.setInterval(() => { if (!disposed && owner === instance) frame(); }, 550 - speed * 50);
      return () => window.clearInterval(id);
    },
  );
  const repeats = (spec.actions ?? []).map((action, index) => action.repeat ? createRepeatedAction({
    current: () => disposed || isComplete() ? undefined : instance,
    enabled: model => action.enabled?.(model.read() as Snapshot<M>, selected) ?? true,
    perform: model => { action.run(model, selected); error = false; status = ""; observe(); },
    changed: value => { if (value) repeatFlags.add(index); else repeatFlags.delete(index); publish(); },
    failed: fail,
    intervalMs: action.repeat.intervalMs,
    schedule: (frame, interval) => { const id = window.setInterval(frame, interval); return () => window.clearInterval(id); },
  }) : undefined);
  const views = spec.views.map(view => {
    if (view.type === "network") return { ...view, nodes: (state: unknown) => view.nodes(state as Snapshot<M>), edges: (state: unknown) => view.edges(state as Snapshot<M>) };
    if (view.type === "grid") return { ...view, data: (state: unknown) => view.data(state as Snapshot<M>) };
    if (view.type === "spatial") return { ...view, data: (state: unknown) => view.data(state as Snapshot<M>) };
    if (view.type === "inspector") return { ...view, value: (state: unknown, id: string | null) => view.value(state as Snapshot<M>, id) };
    if (view.type === "table") return { ...view, rows: (state: unknown) => view.rows(state as Snapshot<M>) };
    if (view.type === "bar") return { ...view, series: (state: unknown) => view.series(state as Snapshot<M>) };
    return { ...view, series: (state: unknown) => view.series(state as Snapshot<M>) };
  });
  publish();
  return {
    subscribe: store.subscribe, setup, live, liveGroups: groupLive(live), views, actions: spec.actions ?? [],
    drawingLabel: spec.drawing?.toggleLabel, description: definition.description, source: spec.source,
    initialize() {
      if (disposed) return;
      pause();
      let next: M | undefined;
      try {
        const options = { ...draft, ...liveDraft };
        for (const [field, descriptor] of descriptors) options[field] = decodeControl(descriptor, options[field]);
        next = definition.create(options as Partial<P>);
        const nextObservation = next.read() as Snapshot<M>;
        // Validate projections before destroying a working session.
        for (const field of spec.live ?? []) field.value(nextObservation);
        for (const monitor of spec.monitors ?? []) { const value = monitor.value(nextObservation); monitor.format?.(value); }
        spec.complete?.(nextObservation);
        spec.drawing?.enabled(nextObservation);
        for (const action of spec.actions ?? []) { action.enabled?.(nextObservation, null); action.pressed?.(nextObservation); }
        const old = instance;
        // flushSync first drains previously queued renderer effects. Keep their errors
        // attached to the old model until the callback installs the new owner/epoch.
        try {
          flushSync(() => {
            instance = next; observation = nextObservation; selected = null;
            applied = { ...draft }; fieldErrors = {}; epoch++; error = false; status = "";
            observe();
          });
        } finally { old?.dispose?.(); }
      } catch (cause) {
        if (next && next !== instance) next.dispose?.();
        fail(cause);
      }
    },
    setDraft(field, value) { if (disposed || !setup.some(item => item.field === field)) return; draft[field] = value; delete fieldErrors[field]; publish(); },
    setLive(field, value) {
      if (disposed) return;
      const index = live.findIndex(item => item.field === field);
      const binding = spec.live[index];
      if (!binding) return;
      playback.stop(); stopRepeats();
      try {
        const decoded = decodeControl(live[index]!.descriptor, value);
        if (!instance) { liveDraft[field] = decoded; delete fieldErrors[field]; error = false; publish(); return; }
        if (observation === undefined || !(binding.enabled?.(observation) ?? true)) return;
        binding.set(instance, decoded); delete fieldErrors[field]; error = false; status = ""; observe();
      } catch (cause) { fieldErrors[field] = cause instanceof Error ? cause.message : String(cause); fail(cause); try { observe(); } catch { /* Primary error retained. */ } }
    },
    run() { if (running) { pause(); return; } if (!instance || isComplete()) return; stopRepeats(); drawing = false; playback.start(); },
    step(count) { pause(); if (!isComplete()) act(model => model.advance(count)); },
    action(index) {
      pause(); const action = spec.actions?.[index];
      if (!action || observation === undefined || !(action.enabled?.(observation, selected) ?? true)) return;
      act(model => action.run(model, selected));
    },
    repeat(index) { const repeat = repeats[index]; if (!repeat) return; playback.stop(); drawing = false; if (repeat.running) repeat.stop(); else repeat.start(); publish(); },
    setSpeed(value) { const resume = running; playback.stop(); speed = value; if (resume) playback.start(); publish(); },
    select(id) { selected = id; try { publish(); } catch (cause) { fail(cause); } },
    toggleDrawing() { playback.stop(); stopRepeats(); drawing = !drawing; publish(); },
    intent(intent) { playback.stop(); act(model => spec.drawing?.intent(model, intent)); },
    pause, fail,
    dispose() {
      if (disposed) return;
      pause(); disposed = true; instance?.dispose?.(); instance = undefined; observation = undefined;
    },
  };
}
