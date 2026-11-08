<script lang="ts">
  import { onMount } from "svelte";
  import "./shell.css";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import type { BoundEntry } from "../definition.ts";
  import type { CatalogEntry } from "../agent-lab/catalog.ts";
  import { createCatalogLoader } from "../agent-lab/catalog.ts";
  import legacyStyles from "../agent-lab/styles.css?url";
  import legacyHostStyles from "./legacy-host.css?url";

  let { entries, version, legacyEntries }: { entries: readonly CatalogEntry<BoundEntry>[]; version: string; legacyEntries: readonly string[] } = $props();
  let host: HTMLElement;
  let selected = $state("");
  let filter = $state("");
  let error = $state("");
  let loading = $state(false);
  let updates = $state(false);
  let mounted: ReturnType<BoundEntry["mount"]> | undefined;
  let active = "";
  const items = $derived(entries.filter(entry => entry.title.toLocaleLowerCase().includes(filter.toLocaleLowerCase())).map(entry => ({ value: entry.slug, label: entry.title })));
  const loader = createCatalogLoader<BoundEntry>((entry, slug) => {
    const staging = document.createElement("div");
    let target = staging;
    if (legacyEntries.includes(slug)) {
      const shadow = staging.attachShadow({ mode: "open" });
      for (const href of [legacyStyles, legacyHostStyles]) {
        const link = document.createElement("link"); link.rel = "stylesheet"; link.href = href; shadow.append(link);
      }
      target = document.createElement("div"); shadow.append(target);
    }
    const candidate = entry.mount(target);
    mounted?.dispose();
    mounted = candidate;
    host.replaceChildren(staging);
    active = slug;
    const url = new URL(location.href); url.searchParams.set("experiment", slug); history.replaceState(null, "", url);
    loading = false; error = "";
  }, message => { error = message; loading = false; selected = active; });
  async function open(slug: string) {
    const entry = entries.find(entry => entry.slug === slug);
    if (!entry || slug === active) return;
    mounted?.pause?.(); loading = true; selected = slug;
    await loader.load(entry);
  }
  onMount(() => {
    const requested = new URL(location.href).searchParams.get("experiment");
    const first = entries.find(entry => entry.slug === requested) ?? entries[0];
    if (first) void open(first.slug);
    const timer = window.setInterval(async () => {
      try { const response = await fetch("/build-version", { cache: "no-store" }); if (response.ok) updates = (await response.text()) !== version; }
      catch { /* Retain the current usable run while the development host is unavailable. */ }
    }, 2000);
    return () => { window.clearInterval(timer); loader.dispose(); mounted?.dispose(); };
  });
</script>

<a class="lab-skip" href="#experiment-content">Skip to experiment</a>
<main class="lab-shell">
  <header class="lab-header">
    <h1>Agent Lab</h1>
    <div class="lab-chooser">
      <Input type="search" aria-label="Find experiment" placeholder="Find experiment" value={filter} oninput={(event) => filter = event.currentTarget.value} />
      <Select.Root type="single" {items} value={selected} onValueChange={open}>
        <Select.Trigger aria-label="Experiment"><Select.Value placeholder="Experiment" /></Select.Trigger>
        <Select.Content><Select.Group>{#each items as item (item.value)}<Select.Item value={item.value} label={item.label}>{item.label}</Select.Item>{/each}</Select.Group></Select.Content>
      </Select.Root>
    </div>
    {#if updates}<Button variant="outline" onclick={() => location.reload()}>Reload updates</Button>{/if}
  </header>
  {#if error}<p role="alert" class="lab-error">{error}</p>{/if}
  <span class="sr-only" role="status" aria-live="polite">{loading ? "Loading experiment" : ""}</span>
  <section id="experiment-content" aria-label="Experiment workbench" aria-busy={loading} bind:this={host}></section>
</main>
