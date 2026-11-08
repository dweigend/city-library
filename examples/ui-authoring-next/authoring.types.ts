/** Compile-only public contracts. Never import this file from a runtime harness. */
import { defineUI, type Observation } from '../../ui/index.ts';
import { defineUI as defineSvelteUI, type Observation as SvelteObservation } from '../../ui/svelte/index.ts';
import { model } from '../../experiments/voting/model.ts';

function observation(observed: Observation<typeof model>, alternate: SvelteObservation<typeof model>) {
  const tick: number = observed.tick;
  const same: typeof observed = alternate;
  // @ts-expect-error Observation retains the real numeric tick type.
  const text: string = observed.tick;
  // @ts-expect-error Observation does not invent members or widen to any.
  observed.missingMeasurement;
  void tick; void same; void text;
}
void observation;

function rejectedFormatters() {
  // @ts-expect-error A numeric getter cannot be coupled to a text-only formatter.
  defineUI(model, { monitors: [{ label: 'Wrong text', value: state => state.tick, format: (value: string) => value.toUpperCase() }], views: [] });
  // @ts-expect-error A text getter cannot be coupled to a numeric-only formatter.
  defineUI(model, { monitors: [{ label: 'Wrong number', value: state => String(state.tick), format: (value: number) => value.toFixed(2) }], views: [] });
  // @ts-expect-error A union getter cannot pretend that every result is numeric.
  defineUI(model, { monitors: [{ label: 'Wrong union', value: state => state.done ? 'done' : state.tick, format: (value: number) => value.toFixed(2) }], views: [] });
  // @ts-expect-error The Svelte adapter exposes the same correlated monitor contract.
  defineSvelteUI(model, { monitors: [{ label: 'Wrong host formatter', value: state => state.tick, format: (value: string) => value.toUpperCase() }], views: [] });
  defineUI(model, { monitors: [{ label: 'Concrete observation', value(state) {
    // @ts-expect-error A formatter cannot widen or replace the observation contract.
    state.missingMeasurement;
    return state.tick;
  } }], views: [] });
  defineUI(model, { actions: [{ label: 'Compatible selection', run(_instance, selected) {
    const identifier: string | null = selected;
    // @ts-expect-error This phase retains compatible string/null selection, not a new object API.
    const object: { kind: string; id: string } = selected;
    void identifier; void object;
  } }], views: [] });
}
void rejectedFormatters;

function extractedContracts() {
  const numeric = {
    monitors: [{ label: 'Extracted tick', value: (state: Observation<typeof model>) => state.tick,
      format: (value: number) => value.toFixed(3) }], views: [],
  } as const;
  defineUI(model, numeric);
  defineSvelteUI(model, numeric);
  const incompatible = {
    monitors: [{ label: 'Mismatched extracted formatter', value: (state: Observation<typeof model>) => state.tick,
      format: (value: string) => value.toUpperCase() }], views: [],
  } as const;
  // @ts-expect-error Extracting the spec cannot erase the getter/formatter correlation.
  defineUI(model, incompatible);
  // @ts-expect-error Both public adapters reject the incompatible extracted spec.
  defineSvelteUI(model, incompatible);
  // @ts-expect-error An object without a model factory cannot provide an observation.
  const noFactory: Observation<{ title: 'Not a definition' }> = 0;
  // @ts-expect-error A factory result without a read method cannot provide an observation.
  const noReader: Observation<{ create(): { advance(): void } }> = 0;
  void noFactory; void noReader;
}
void extractedContracts;

function instanceObservations(value: Observation<ReturnType<typeof model.create>>) {
  const same: Observation<typeof model> = value;
  // @ts-expect-error Instance observations preserve concrete measurement types.
  const wrong: string = value.tick;
  void same; void wrong;
}
void instanceObservations;
