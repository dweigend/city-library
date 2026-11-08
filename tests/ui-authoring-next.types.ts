/** Compile-only optional/extracted monitor contracts; not a runtime fixture. */
import { defineUI, type Monitor, type Observation } from '../ui/index.ts';
import { defineUI as defineSvelteUI, type Monitor as SvelteMonitor } from '../ui/svelte/index.ts';
import { model } from '../experiments/voting/model.ts';

function optionalFormatterContracts(
  wrongScalar: { value: (state: Observation<typeof model>) => number; format?: (value: string) => string; label: string },
  wrongUnion: { value: (state: Observation<typeof model>) => number | string; format?: (value: number) => string; label: string },
  valid: Monitor<Observation<typeof model>, number>,
  validFromSvelte: SvelteMonitor<Observation<typeof model>, number>,
) {
  // @ts-expect-error An optional formatter still has to accept its paired numeric result.
  defineUI(model, { monitors: [wrongScalar], views: [] });
  // @ts-expect-error The same optional mismatch is rejected by the other host.
  defineSvelteUI(model, { monitors: [wrongScalar], views: [] });
  // @ts-expect-error An optional numeric formatter cannot consume every union result.
  defineUI(model, { monitors: [wrongUnion], views: [] });
  // @ts-expect-error Svelte keeps the same full-union requirement.
  defineSvelteUI(model, { monitors: [wrongUnion], views: [] });
  defineUI(model, { monitors: [valid, validFromSvelte], views: [] });
  defineSvelteUI(model, { monitors: [valid, validFromSvelte], views: [] });
}
void optionalFormatterContracts;
