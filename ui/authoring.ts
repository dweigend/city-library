import type { Definition } from '../experiments/definition.ts';
import type { LegacyLiveField, ModelInstance, SetupField, Snapshot, UISpec } from './definition.ts';
import type { Descriptor } from './controls/form.ts';

export type ControlValue = string | number | boolean;
export type NormalizedSpec<P extends object, M extends ModelInstance> = Omit<UISpec<P, M>, 'setup' | 'live'> & {
  readonly setup: readonly SetupField<P>[];
  readonly live: readonly LegacyLiveField<P, M>[];
};

/** Descriptor decoding guards host values; scientific/refined type validation stays in actions. */
export function decodeControl(descriptor: Descriptor, value: unknown): ControlValue {
  if (descriptor.kind === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError('Expected a finite number.');
    if (descriptor.integer && !Number.isInteger(value)) throw new RangeError('Expected an integer.');
    if (descriptor.min !== undefined && value < descriptor.min) throw new RangeError(`Minimum is ${descriptor.min}.`);
    if (descriptor.max !== undefined && value > descriptor.max) throw new RangeError(`Maximum is ${descriptor.max}.`);
    return value;
  }
  if (descriptor.kind === 'boolean') {
    if (typeof value !== 'boolean') throw new TypeError('Expected a boolean.');
    return value;
  }
  if (typeof value !== 'string') throw new TypeError('Expected text.');
  if (descriptor.kind === 'choice' && !descriptor.options?.includes(value)) throw new RangeError('Unknown choice.');
  return value;
}

/** Internal mount-time normalization shared by the DOM and Svelte adapters. No model is created. */
export function normalizeAuthoring<P extends object, M extends ModelInstance>(definition: Definition<P, M>, spec: UISpec<P, M>): NormalizedSpec<P, M> {
  const descriptors = new Map(Object.entries(definition.inputs) as [Extract<keyof P, string>, Descriptor][]);
  const descriptorFor = (field: Extract<keyof P, string>) => {
    const descriptor = descriptors.get(field);
    if (!descriptor) throw new Error(`Unknown input: ${field}`);
    return descriptor;
  };
  const keyed = spec.live !== undefined && !Array.isArray(spec.live);
  const entries = keyed
    ? Object.entries(spec.live!).map(([field, binding]) => ({ ...binding, field }))
    : spec.live ?? [];
  // The public mapped type preserves correlation. This single erased host boundary decodes
  // each value using its own field descriptor before invoking the still-explicit action.
  const live = (entries as readonly {
    field: Extract<keyof P, string>; label?: string; widget?: 'color'; group?: string;
    value?: (state: Snapshot<M>) => unknown;
    set: (model: M, value: ControlValue) => void;
    enabled?: (state: Snapshot<M>) => boolean;
  }[]).map(binding => {
    const descriptor = descriptorFor(binding.field);
    if (binding.group !== undefined && (typeof binding.group !== 'string' || !binding.group.trim())) throw new TypeError(`Invalid empty group label for field: ${binding.field}`);
    if (typeof binding.set !== 'function') throw new TypeError(`Missing setter for ${binding.field}`);
    if (!keyed && typeof binding.value !== 'function') throw new TypeError(`Missing getter for ${binding.field}`);
    return {
      ...binding,
      value(state: Snapshot<M>): ControlValue {
        const result = binding.value ? binding.value(state) : (state as { parameters?: Record<string, unknown> }).parameters?.[binding.field];
        return decodeControl(descriptor, result);
      },
      set(model: M, value: ControlValue) { binding.set(model, decodeControl(descriptor, value)); },
    };
  });
  const setup = spec.setup?.map(field => typeof field === 'string' ? { field } : field) ?? [...descriptors.keys()]
    .filter(field => !keyed || !live.some(binding => binding.field === field)).map(field => ({ field }));
  for (const field of setup) descriptorFor(field.field);
  return { ...spec, setup, live };
}

/** Groups are view-only and keep first occurrence and within-group declaration order. */
export function groupLive<T extends { readonly group?: string }>(fields: readonly T[]): readonly { readonly label?: string; readonly fields: readonly T[] }[] {
  const groups: { label?: string; fields: T[] }[] = [];
  for (const field of fields) {
    const existing = field.group === undefined ? undefined : groups.find(group => group.label === field.group);
    if (existing) existing.fields.push(field);
    else groups.push({ label: field.group, fields: [field] });
  }
  return groups;
}
