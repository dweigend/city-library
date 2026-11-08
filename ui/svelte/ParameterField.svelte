<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import type { Parameter, Value } from "./session.ts";

  let { parameter, value, pending = false, disabled = false, error, live = false, onchange }: {
    parameter: Parameter; value: Value; pending?: boolean; disabled?: boolean; error?: string; live?: boolean;
    onchange(value: Value): void;
  } = $props();
  const uid = $props.id();
  const id = $derived(`${uid}-${parameter.field}`);
  const descriptor = $derived(parameter.descriptor);
  const items = $derived((descriptor.options ?? []).map(value => ({ value, label: value })));
  function read(input: HTMLInputElement): Value {
    return descriptor.kind === "number" ? input.valueAsNumber : input.value;
  }
  function change(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    if (input.reportValidity()) onchange(read(input));
  }
</script>

<Field.Field data-invalid={!!error} data-disabled={disabled} data-pending={pending} orientation={descriptor.kind === "boolean" ? "horizontal" : "vertical"}>
  <Field.Label for={id}>{parameter.label}{#if pending}<span class="text-muted-foreground" aria-label="Pending setup change"> ·</span>{/if}</Field.Label>
  {#if descriptor.kind === "boolean"}
    <Checkbox {id} name={parameter.field} checked={Boolean(value)} {disabled} aria-invalid={!!error} onCheckedChange={onchange} />
  {:else if descriptor.kind === "choice"}
    <Select.Root type="single" {items} name={parameter.field} value={String(value)} {disabled} onValueChange={onchange}>
      <Select.Trigger {id} aria-invalid={!!error}><Select.Value /></Select.Trigger>
      <Select.Content><Select.Group>{#each items as item (item.value)}<Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>{/each}</Select.Group></Select.Content>
    </Select.Root>
  {:else}
    <Input {id} name={parameter.field} type={parameter.widget === "color" ? "color" : descriptor.kind === "number" ? "number" : "text"}
      value={String(value)} {disabled} min={descriptor.min} max={descriptor.max} step={descriptor.step ?? (descriptor.integer ? 1 : "any")}
      required autocomplete="off" inputmode={descriptor.kind === "number" ? descriptor.integer ? "numeric" : "decimal" : undefined}
      aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
      oninput={live ? undefined : (event) => onchange(read(event.currentTarget))}
      onchange={live ? change : undefined} />
    {#if parameter.widget === "range" && descriptor.min !== undefined && descriptor.max !== undefined}
      <Slider type="single" min={descriptor.min} max={descriptor.max} step={descriptor.step ?? 1} value={Number(value)} {disabled} aria-label={parameter.label} onValueChange={onchange} />
    {/if}
  {/if}
  {#if error}<Field.Error id={`${id}-error`}>{error}</Field.Error>{/if}
</Field.Field>
