// @ts-expect-error The host generates this module for each catalog build.
import { catalog, version } from "agent-lab-catalog";
import type { CatalogEntry } from "./catalog.ts";
import type { BoundEntry } from "../definition.ts";
import { createCatalogLoader } from "./catalog.ts";

const entries = catalog as readonly CatalogEntry<BoundEntry>[];
const select = document.querySelector<HTMLSelectElement>("#experiment");
const content = document.querySelector<HTMLElement>("#experiment-content");
const notice = document.querySelector<HTMLElement>("#catalog-status");
if (!select || !content || !notice)
  throw new Error("Agent Lab host elements are missing.");
let mounted: { dispose(): void; pause?(): void } | undefined;
let activeSlug = "";
const loader = createCatalogLoader<BoundEntry>(
  (entry, slug) => {
    const staging = document.createElement("div");
    const candidate = entry.mount(staging);
    mounted?.dispose();
    content.replaceChildren(staging);
    mounted = candidate;
    activeSlug = slug;
    notice.textContent = "";
    const url = new URL(location.href);
    url.searchParams.set("experiment", slug);
    history.replaceState(null, "", url);
  },
  (message) => {
    notice.textContent = message;
    if (activeSlug) select.value = activeSlug;
  },
);
for (const entry of entries)
  select.add(
    new Option(entry.title + (entry.error ? " — unavailable" : ""), entry.slug),
  );
const chooser = select;
const banner = notice;
async function open() {
  const entry = entries.find((entry) => entry.slug === chooser.value);
  if (entry) {
    mounted?.pause?.();
    banner.textContent = "Loading…";
    await loader.load(entry);
  }
}
select.addEventListener("change", open);
const requested = new URL(location.href).searchParams.get("experiment");
if (requested && entries.some((entry) => entry.slug === requested))
  select.value = requested;
if (entries.length) void open();
else notice.textContent = "No experiment entries found.";
const refresh = window.setInterval(async () => {
  try {
    const response = await fetch("/build-version");
    if (
      response.ok &&
      (await response.text()) !== version &&
      !document.querySelector("#reload-updates")
    ) {
      const reload = document.createElement("button");
      reload.id = "reload-updates";
      reload.type = "button";
      reload.textContent = "Reload updates";
      reload.addEventListener("click", () => location.reload());
      document.querySelector("header")?.append(reload);
    }
  } catch {
    /* A restarting development server will return shortly. */
  }
}, 2000);
window.addEventListener("pagehide", () => {
  clearInterval(refresh);
  loader.dispose();
  mounted?.dispose();
});
