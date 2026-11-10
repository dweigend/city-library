<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Field from "$lib/components/ui/field/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import ParameterField from "./ParameterField.svelte";
  import View from "./views/View.svelte";
  import type { Session, Parameter } from "./session.ts";
  import "./workbench.css";

  let { session }: { session: Session } = $props();
  let parametersOpen = $state(false);
  let infoOpen = $state(false);
  let form: HTMLFormElement;
  const uid = $props.id();
  const formId = `${uid}-setup`;
  const speedId = `${uid}-speed`;
  const snapshot = $derived($session);
  function setup() { if (form.reportValidity()) session.initialize(); }
</script>

{#snippet liveControl(parameter: Parameter)}
  <ParameterField {parameter} live value={snapshot.liveDraft[parameter.field]!} disabled={!snapshot.liveEnabled[session.live.indexOf(parameter)]} error={snapshot.fieldErrors[parameter.field]} onchange={value => session.setLive(parameter.field, value)} />
{/snippet}

<div class="lab-workbench">
  <div class="lab-transport" role="group" aria-label="Simulation controls">
    <Button type="submit" form={formId} variant="outline">{snapshot.pending.length ? "Restart with changes" : "Setup"}</Button>
    <Button onclick={() => session.run()} disabled={!snapshot.initialized || snapshot.complete} aria-pressed={snapshot.running}>{snapshot.running ? "Pause" : "Run"}</Button>
    {#each [1, 10, 100] as count}
      <Button variant="outline" onclick={() => session.step(count)} disabled={!snapshot.initialized || snapshot.complete}>{count} {count === 1 ? "step" : "steps"}</Button>
    {/each}
    <div class="lab-speed"><span id={speedId}>Speed</span><Slider type="single" min={1} max={10} step={1} value={snapshot.speed} aria-labelledby={speedId} onValueChange={value => session.setSpeed(value)} /></div>
    <Button variant="ghost" aria-expanded={parametersOpen} onclick={() => parametersOpen = !parametersOpen}>Parameters <ChevronDown data-icon="inline-end" aria-hidden="true" /></Button>
  </div>
  <aside class="lab-parameters" data-open={parametersOpen}>
    <form id={formId} bind:this={form} onsubmit={(event) => { event.preventDefault(); setup(); }} aria-label="Model setup">
      <Field.Group>
        {#each session.setup as parameter (parameter.field)}
          <ParameterField {parameter} value={snapshot.draft[parameter.field]!} pending={snapshot.pending.includes(parameter.field)} error={snapshot.fieldErrors[parameter.field]} onchange={value => session.setDraft(parameter.field, value)} />
        {/each}
        {#each session.liveGroups as group}
          {#if group.label !== undefined}
            <Field.Set><Field.Legend>{group.label}</Field.Legend><Field.Group>
              {#each group.fields as parameter (parameter.field)}{@render liveControl(parameter)}{/each}
            </Field.Group></Field.Set>
          {:else}
            {#each group.fields as parameter (parameter.field)}{@render liveControl(parameter)}{/each}
          {/if}
        {/each}
      </Field.Group>
    </form>
    {#if session.actions.length || session.drawingLabel}
      <div class="lab-model-actions" role="group" aria-label="Model actions">
        {#each session.actions as action, index}
          <Button variant="outline" disabled={!snapshot.actions[index]?.enabled} aria-pressed={snapshot.actions[index]?.pressed} onclick={() => session.action(index)}>{action.label}</Button>
          {#if action.repeat}<Button variant="outline" disabled={!snapshot.actions[index]?.enabled || snapshot.complete} aria-pressed={snapshot.actions[index]?.repeating} onclick={() => session.repeat(index)}>{action.repeat.label}</Button>{/if}
        {/each}
        {#if session.drawingLabel}<Button variant="outline" disabled={!snapshot.drawingAvailable} aria-pressed={snapshot.drawing} onclick={() => session.toggleDrawing()}>{session.drawingLabel}</Button>{/if}
      </div>
    {/if}
    {#if session.description || session.source}
      <Collapsible.Root bind:open={infoOpen}>
        <Collapsible.Trigger class="lab-info-trigger">Model info <ChevronDown aria-hidden="true" /></Collapsible.Trigger>
        <Collapsible.Content class="lab-model-info">
          {#if session.description}<p>{session.description}</p>{/if}
          {#if session.source}<a href={session.source.url} target="_blank" rel="noopener noreferrer">{session.source.label}</a>{/if}
        </Collapsible.Content>
      </Collapsible.Root>
    {/if}
  </aside>
  <section class="lab-results" aria-label="Model results">
    {#if snapshot.hasError}<p role="alert" class="lab-error">{snapshot.status}</p>{/if}
    {#if !snapshot.initialized}
      <p class="lab-empty" role="status">Setup to begin.</p>
    {:else}
      <dl class="lab-monitors">{#each snapshot.monitors as monitor}<div><dt>{monitor.label}</dt><dd>{monitor.value}</dd></div>{/each}</dl>
      <span class="sr-only" role="status" aria-live="polite">{snapshot.complete ? "Completed" : snapshot.running ? "Running" : "Paused"}{snapshot.pending.length ? ". Setup changes pending." : ""}</span>
      <div class="lab-views">
        {#key snapshot.epoch}
          {#each session.views as view}
            <View {view} state={snapshot.observation} selected={snapshot.selected} drawing={snapshot.drawing} onselect={session.select} onintent={session.intent} onerror={session.fail} />
          {/each}
        {/key}
      </div>
    {/if}
  </section>
</div>
