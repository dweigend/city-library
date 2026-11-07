import { mount } from "svelte";
// @ts-expect-error The host generates this module from discovered experiment entries.
import { catalog, version, legacyEntries } from "agent-lab-catalog";
import type { CatalogEntry } from "../agent-lab/catalog.ts";
import type { BoundEntry } from "../definition.ts";
import App from "./App.svelte";
import "../agent-lab/app.css";

const target = document.getElementById("app");
if (!target) throw new Error("Agent Lab root element is missing.");
mount(App, { target, props: { entries: catalog as readonly CatalogEntry<BoundEntry>[], version: String(version), legacyEntries: legacyEntries as readonly string[] } });
