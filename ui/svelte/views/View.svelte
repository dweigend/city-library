<script lang="ts">
  import { untrack } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import type { DrawingIntent, Inspector, GraphNodeData, View as ViewSpec } from "../../definition.ts";
  import { mountCanvas } from "../../views/canvas.ts";
  import { mountNetwork } from "../../views/network.ts";
  import { tablePage } from "../../views/table-page.ts";
  import { mountChart } from "../../views/chart.ts";
  import { readRendererTheme } from "./theme.ts";
  import "./views.css";

  let { view, state: observation, selected, drawing, onselect, onintent, onerror }: {
    view: ViewSpec<unknown> | Inspector<unknown>;
    state: unknown | undefined;
    selected: string | null;
    drawing: boolean;
    onselect: (id: string) => void;
    onintent: (intent: DrawingIntent) => void;
    onerror: (error: unknown) => void;
  } = $props();
  interface Renderer {
    update(observation: unknown, selected: string | null, drawing: boolean): void;
    dispose(): void;
    fit?(): void;
    layout?(): void;
    setLabels?(value: boolean): void;
  }
  const labelId = $props.id();
  let host = $state<HTMLDivElement>();
  let renderer = $state.raw<Renderer>();
  let nodes = $state<readonly GraphNodeData[]>([]);
  let labelControl = $state(false);
  let labels = $state(false);
  let rows = $state<readonly Readonly<Record<string, string | number | boolean>>[]>([]);
  let inspected = $state<Readonly<Record<string, string | number | boolean>>>();
  let page = $state(0);
  const visible = $derived(tablePage(rows, page));
  const columns = $derived(Object.keys(rows[0] ?? {}));
  const items = $derived(nodes.map((node, index) => ({ value: node.id, label: node.label ?? `Node ${index + 1}` })));

  $effect(() => {
    const target = host;
    const current = view;
    if (!target || !["network", "grid", "spatial", "line", "bar", "scatter"].includes(current.type)) return;
    let mounted: Renderer | undefined;
    let refresh: (() => void) | undefined;
    try {
      let theme = readRendererTheme(target);
      const options = { controls: false, theme: () => theme };
      if (current.type === "network") {
        const adapter = mountNetwork(target, id => onselect(id), options);
        mounted = { ...adapter, update: (value, id) => adapter.update(current.nodes(value), current.edges(value), id) };
      } else if (current.type === "grid" || current.type === "spatial") {
        const adapter = mountCanvas(target, id => onselect(id), value => onintent(value), options);
        mounted = { ...adapter, update: (value, id, enabled) => adapter.update(current.data(value), id, enabled) };
      } else if (current.type === "line" || current.type === "bar" || current.type === "scatter") {
        const adapter = mountChart(target, current.type, { ...options, xAxis: current.xAxis, yAxis: current.yAxis });
        mounted = { ...adapter, update: value => adapter.update(current.series(value)) };
      }
      renderer = mounted;
      refresh = () => {
        try {
          theme = readRendererTheme(target);
          if (observation !== undefined) mounted?.update(observation, selected, drawing);
        } catch (error) { untrack(() => onerror(error)); }
      };
      const appearance = window.matchMedia("(prefers-color-scheme: dark)");
      appearance.addEventListener("change", refresh);
      return () => {
        appearance.removeEventListener("change", refresh!);
        mounted?.dispose();
        renderer = undefined;
      };
    } catch (error) {
      mounted?.dispose();
      target.replaceChildren();
      untrack(() => onerror(error));
    }
  });

  $effect(() => {
    const value = observation;
    const current = view;
    const id = selected;
    const enabled = drawing;
    const mounted = renderer;
    if (value === undefined) return;
    try {
      if (current.type === "network") nodes = current.nodes(value);
      if (current.type === "spatial") {
        const data = current.data(value);
        labelControl = data.showLabels === undefined && data.agents.some(agent => Boolean(agent.label));
      }
      if (current.type === "table") {
        const projectedRows = current.rows(value);
        page = tablePage(projectedRows, untrack(() => page)).page;
        rows = projectedRows;
      }
      if (current.type === "inspector") inspected = current.value(value, id);
      untrack(() => mounted?.update(value, id, enabled));
    } catch (error) { untrack(() => onerror(error)); }
  });

  $effect(() => { renderer?.setLabels?.(labels); });
</script>

{#if observation !== undefined && (view.type !== "inspector" || inspected)}
  <figure class="model-view" aria-labelledby={labelId}>
    <figcaption id={labelId}>{view.label}</figcaption>
    {#if view.type === "network"}
      <div class="model-view-actions">
        <Button variant="outline" size="sm" onclick={() => renderer?.fit?.()}>Fit</Button>
        <Button variant="outline" size="sm" onclick={() => renderer?.layout?.()}>Layout</Button>
        <Select.Root type="single" value={selected ?? ""} {items} onValueChange={onselect}>
          <Select.Trigger aria-label="Select network node"><Select.Value placeholder="Inspect node" /></Select.Trigger>
          <Select.Content>
            <Select.Group>
              {#each items as item (item.value)}
                <Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>
              {/each}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    {:else if view.type === "spatial" && labelControl}
      <div class="model-view-actions">
        <Checkbox id={`${labelId}-labels`} bind:checked={labels} />
        <Label for={`${labelId}-labels`}>Labels</Label>
      </div>
    {/if}
    {#if view.type === "table"}
      <div class="model-table">
        <Table.Root>
          <Table.Header><Table.Row>
            {#each columns as key (key)}<Table.Head>{key}</Table.Head>{/each}
          </Table.Row></Table.Header>
          <Table.Body>
            {#each visible.rows as row}<Table.Row>
              {#each columns as key (key)}<Table.Cell>{String(row[key] ?? "")}</Table.Cell>{/each}
            </Table.Row>{/each}
          </Table.Body>
        </Table.Root>
      </div>
      {#if visible.isPaged}
        <div class="model-view-actions" data-pagination>
          <Button variant="outline" size="sm" disabled={!visible.hasPreviousPage} onclick={() => page--}>Previous rows</Button>
          <output aria-label="Visible rows">{visible.range}</output>
          <Button variant="outline" size="sm" disabled={!visible.hasNextPage} onclick={() => page++}>Next rows</Button>
        </div>
      {:else if rows.length === 0}<p>No rows</p>{/if}
    {:else if view.type === "inspector" && inspected}
      <dl class="model-inspector">
        {#each Object.entries(inspected) as [key, value] (key)}<dt>{key}</dt><dd>{String(value)}</dd>{/each}
      </dl>
    {:else}
      <div class="model-renderer" bind:this={host}></div>
    {/if}
  </figure>
{/if}
