import type { Definition } from '../models/definition.ts';
import type { ChangeUISpec, KeyedLive, LiveField, LiveChanges, ModelInstance, SetupField, Snapshot, UISpec } from './definition.ts';
import type { Descriptor } from './inputs.ts';

export type ControlValue = string | number | boolean;
/** Internal union of the two typed variants of the existing flat declaration. */
export type AuthoringSpec<P extends object, M extends ModelInstance> = UISpec<P, M> | ChangeUISpec<P, M>;
/** Internal erasure of the getter/formatter existential pair. Public Monitor uses strict
 * function properties; the method signature here accepts every approved scalar case.
 * Hosts always pass the result of this record's getter to this record's formatter. */
interface RuntimeMonitor<S> {
  readonly label: string;
  readonly value: (state: S) => string | number;
  format?(value: string | number): string;
}
export type RuntimeSpec<P extends object, M extends ModelInstance> = Omit<AuthoringSpec<P, M>, 'monitors' | 'live' | 'change'> & {
  readonly change?: (model: M, changes: LiveChanges<P>) => void;
  readonly live?: readonly LiveField<P, M>[] | KeyedLive<P, M, true>;
  readonly monitors?: readonly RuntimeMonitor<Snapshot<M>>[];
};

/** Check required and optional formatters after contextual typing. Distribution keeps
 * extracted unions valid without allowing a narrower formatter for a union getter. */
type CompatibleMonitor<T> = T extends {
  readonly value: (...args: never[]) => infer V;
  readonly format?: (value: infer F) => string;
} ? [V] extends [F] ? T : never : T;
type CompatibleMonitors<T> = { readonly [K in keyof T]: CompatibleMonitor<T[K]> };
type WithMonitors<S, T> = S extends unknown ? Omit<S, 'monitors'> & { readonly monitors?: T } : never;
export type MonitorSpec<P extends object, M extends ModelInstance, T extends readonly RuntimeMonitor<Snapshot<M>>[]> =
  WithMonitors<AuthoringSpec<P, M>, T & CompatibleMonitors<T>>;

export type NormalizedSpec<P extends object, M extends ModelInstance> = Omit<RuntimeSpec<P, M>, 'setup' | 'live'> & {
  readonly setup: readonly SetupField<P>[];
  readonly live: readonly LiveField<P, M>[];
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
export function normalizeAuthoring<P extends object, M extends ModelInstance>(definition: Definition<P, M>, spec: RuntimeSpec<P, M>): NormalizedSpec<P, M> {
  const descriptors = new Map(Object.entries(definition.inputs) as [Extract<keyof P, string>, Descriptor][]);
  const descriptorFor = (field: Extract<keyof P, string>) => {
    const descriptor = descriptors.get(field);
    if (!descriptor) throw new Error(`Unknown input: ${field}`);
    return descriptor;
  };
  const keyed = spec.live !== undefined && !Array.isArray(spec.live);
  if (spec.change !== undefined && typeof spec.change !== 'function') throw new TypeError('Change must be a function.');
  if (Array.isArray(spec.live) && spec.change !== undefined) throw new TypeError('Live field arrays cannot use change.');
  const entries = keyed
    ? Object.entries(spec.live!).map(([field, binding]) => ({ ...binding, field }))
    : spec.live ?? [];
  // The public mapped type preserves correlation. This single erased host boundary decodes
  // each value using its own field descriptor before invoking the still-explicit action.
  const live = (entries as readonly {
    field: Extract<keyof P, string>; label?: string; widget?: 'color'; group?: string;
    value?: (state: Snapshot<M>) => unknown;
    set?: (model: M, value: ControlValue) => void;
    enabled?: (state: Snapshot<M>) => boolean;
  }[]).map(binding => {
    const descriptor = descriptorFor(binding.field);
    if (binding.group !== undefined && (typeof binding.group !== 'string' || !binding.group.trim())) throw new TypeError(`Invalid empty group label for field: ${binding.field}`);
    if (binding.set !== undefined && typeof binding.set !== 'function') throw new TypeError(`Invalid setter for ${binding.field}`);
    const localSet = binding.set;
    const change = spec.change;
    if (!localSet && (!keyed || !change)) throw new TypeError(`Missing setter for ${binding.field}`);
    if (!keyed && typeof binding.value !== 'function') throw new TypeError(`Missing getter for ${binding.field}`);
    return {
      ...binding,
      value(state: Snapshot<M>): ControlValue {
        const result = binding.value ? binding.value(state) : (state as { parameters?: Record<string, unknown> }).parameters?.[binding.field];
        return decodeControl(descriptor, result);
      },
      set(model: M, value: ControlValue) {
        const decoded = decodeControl(descriptor, value);
        if (localSet) localSet.call(binding, model, decoded);
        else if (change) {
          // Each field descriptor establishes its value type at this erased host boundary.
          const changes = { [binding.field]: decoded } as LiveChanges<P>;
          change(model, changes);
        }
      },
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
