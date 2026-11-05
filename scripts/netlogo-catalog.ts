/** Capture the served launcher catalog; verify pinned evidence without mutating delivery state. */
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";

const root = "experiments/catalog";
const cache = ".cache/netlogo-catalog";
const origin = "https://www.netlogoweb.org";
const upstream = {
  galapagos: "90be931773fcf499049247a8aaa1aecbe003654c",
  models: "bf0626a89358b48494066862843a91f36f2556cf",
};
const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const gitHash = (bytes: Uint8Array) => createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const decode = (bytes: Uint8Array) => new TextDecoder().decode(bytes);
const json = async (path: string, data: unknown) => Bun.write(path, JSON.stringify(data, null, 2) + "\n");
type TreeEntry = { path: string; sha: string; type: string };
type Tree = { tree: TreeEntry[]; truncated: boolean };
type Evidence = { file: string; url: string; sha256: string; bytes: number };
async function fetchBytes(url: string): Promise<Uint8Array> {
  let last: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!response.ok) throw new Error(`${response.status} ${url}`);
      return new Uint8Array(await response.arrayBuffer());
    } catch (error) { last = error; }
  }
  throw last;
}
async function pin(file: string, url: string): Promise<Evidence> {
  const bytes = await fetchBytes(url);
  await Bun.write(`${root}/pinned/${file}`, bytes);
  return { file: `pinned/${file}`, url, sha256: hash(bytes), bytes: bytes.length };
}
const tag = (xml: string, name: string) => xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`))?.[1]?.replace(/^<!\[CDATA\[|\]\]>$/g, "") ?? "";
const unique = (values: string[]) => [...new Set(values)].sort();
const known: Record<string, string> = {
  "Sample Models/Networks/Preferential Attachment": "preferential-attachment", "Sample Models/Social Science/Voting": "voting",
  "Sample Models/Biology/Wolf Sheep Predation": "wolf-sheep-predation", "Sample Models/Social Science/Economics/Wealth Distribution": "wealth-distribution",
};
function extract(xml: string) {
  const code = tag(xml, "code");
  // Signals are lexical candidates, not a semantic NetLogo parser or acceptance audit.
  const statements = code.replace(/;[^\n]*/g, "").replace(/"(?:\\.|[^"\\])*"/g, '""');
  const info = tag(xml, "info");
  const widgets = tag(xml, "widgets");
  const uncommented = code.replace(/;[^\n]*/g, "");
  const extensions = unique((uncommented.match(/extensions\s*\[([^\]]*)\]/i)?.[1] ?? "").match(/[\w-]+/g) ?? []);
  const includes = uncommented.match(/__includes\s*\[([^\]]*)\]/i)?.[1] ?? null;
  const signals: Record<string, RegExp> = {
    agents: /\b(turtles|breed|sprout|hatch|crt|create-turtles|create-\w+)\b/i,
    grid: /\b(patches|patch|neighbors|neighbors4|pcolor|patches-own)\b/i,
    movement: /\b(fd|forward|bk|back|rt|right|lt|left|move-to|setxy|jump)\b/i,
    graph: /\b(links|link-neighbors|create-links?-\w+|link-breed|undirected-link-breed|directed-link-breed)\b/i,
    fields: /\b(diffuse|diffuse4|patches-own)\b/i,
    randomness: /\b(random|random-float|random-normal|random-poisson|one-of|n-of|shuffle)\b/i,
    plots: /\b(plot|plotxy|histogram|set-current-plot|set-current-plot-pen)\b/i,
    files: /\b(file-[\w-]+|import-[\w-]+|export-[\w-]+)\b/i,
    userInteraction: /\b(user-[\w-]+|mouse-[\w?-]+)\b/i,
    dynamicExecution: /\b(run|runresult)\b/i,
    hubnet: /\bhubnet-[\w?-]+\b/i,
    systemDynamics: /<systemDynamics[\s>]/i,
  };
  return {
    extraction: "static lexical/XML extraction; rules, defaults and host semantics require manual audit",
    netlogoVersion: xml.match(/<model\s[^>]*version="([^"]+)"/)?.[1] ?? null,
    procedures: [...code.matchAll(/^\s*to(-report)?\s+([^\s\[]+)/gmi)].map(m => ({ name: m[2], reporter: Boolean(m[1]) })),
    extensions, includes,
    mechanismSignals: Object.entries(signals).filter(([name, expression]) => expression.test(name === "systemDynamics" ? xml : statements)).map(([name]) => name),
    widgetCounts: Object.fromEntries(unique([...widgets.matchAll(/<([a-zA-Z][\w-]*)(?:\s|>)/g)].map(m => m[1] ?? "")).map(name => [name, [...widgets.matchAll(new RegExp(`<${name}(?:\\s|>)`, "g"))].length])),
    widgetsXml: widgets,
    licenseNotice: info.split(/^## COPYRIGHT AND LICENSE\s*$/mi)[1]?.trim() ?? code.match(/;[^\n]*(?:Public Domain|Copyright|license)[^\n]*(?:\n;[^\n]*)*/i)?.[0] ?? null,
    creditsNotice: info.split(/^## CREDITS AND REFERENCES\s*$/mi)[1]?.split(/^## /m)[0]?.trim() ?? null,
    citationNotice: info.split(/^## HOW TO CITE\s*$/mi)[1]?.split(/^## /m)[0]?.trim() ?? null,
    licenseUrls: unique((info.match(/https?:\/\/[^\s<>\])]+/g) ?? []).filter(url => /creativecommons\.org\/licenses|opensource\.org|gnu\.org\/licenses/i.test(url))),
    infoSha256: hash(new TextEncoder().encode(info)),
    codeSha256: hash(new TextEncoder().encode(code)),
  };
}
async function capture() {
  await mkdir(`${root}/pinned`, { recursive: true });
  await mkdir(cache, { recursive: true });
  const evidence: Evidence[] = [];
  const launcher = await pin("launch.html", `${origin}/launch`); evidence.push(launcher);
  const html = await Bun.file(`${root}/${launcher.file}`).text();
  const modulePath = html.match(/src=['"]([^'"]*pages\/[^'"]*-tortoise\.js)['"]/)?.[1];
  if (!modulePath) throw new Error("Launcher module missing; catalog contract changed");
  const module = await pin("launcher.js", new URL(modulePath, `${origin}/launch`).href); evidence.push(module);
  const js = await Bun.file(`${root}/${module.file}`).text();
  let listModule: Evidence | undefined;
  for (const relative of unique([...js.matchAll(/from["']([^"']+)["']/g)].map(m => m[1] ?? ""))) {
    const bytes = await fetchBytes(new URL(relative, module.url).href);
    if (decode(bytes).includes('model/list.json')) {
      await Bun.write(`${root}/pinned/catalog-loader.js`, bytes);
      listModule = { file: "pinned/catalog-loader.js", url: new URL(relative, module.url).href, sha256: hash(bytes), bytes: bytes.length };
      break;
    }
  }
  if (!listModule) throw new Error("No direct launcher import fetches model/list.json; investigate changed mechanism");
  evidence.push(listModule);
  for (const [file, url] of [
    ["list.json", `${origin}/model/list.json`], ["statuses.json", `${origin}/model/statuses.json`],
    ["galapagos-tree.json", `https://api.github.com/repos/NetLogo/Galapagos/git/trees/${upstream.galapagos}?recursive=1`],
    ["models-tree.json", `https://api.github.com/repos/NetLogo/models/git/trees/${upstream.models}?recursive=1`],
    ["ModelsLibrary.scala", `https://raw.githubusercontent.com/NetLogo/Galapagos/${upstream.galapagos}/app/models/ModelsLibrary.scala`],
    ["routes", `https://raw.githubusercontent.com/NetLogo/Galapagos/${upstream.galapagos}/conf/routes`],
  ]) evidence.push(await pin(file!, url!));
  const list = await Bun.file(`${root}/pinned/list.json`).json() as string[];
  const statuses = await Bun.file(`${root}/pinned/statuses.json`).json() as Record<string, { status?: string }>;
  if (!Array.isArray(list) || list.some(p => typeof p !== "string" || !p.startsWith("public/modelslib/")) || new Set(list).size !== list.length) throw new Error("Invalid or duplicate served catalog rows");
  const galapagos = await Bun.file(`${root}/pinned/galapagos-tree.json`).json() as Tree;
  const models = await Bun.file(`${root}/pinned/models-tree.json`).json() as Tree;
  if (galapagos.truncated || models.truncated) throw new Error("Incomplete upstream tree");
  const gFiles = new Map(galapagos.tree.map(entry => [entry.path, entry]));
  const mFiles = new Map(models.tree.map(entry => [entry.path, entry]));
  const rows: unknown[] = Array(list.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (cursor < list.length) {
      const index = cursor++;
      const path = list[index]!;
      const relative = path.slice("public/modelslib/".length);
      const name = relative.split("/").at(-1)!;
      const url = `${origin}/assets/${path.slice("public/".length).split("/").map(encodeURIComponent).join("/")}.nlogox`;
      const base = { index, catalogKey: path, id: relative, slug: relative.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name, category: relative.split("/")[0], sourceUrl: url, launcherUrl: `${origin}/launch#${url}`, webStatus: statuses[path]?.status ?? "unknown" };
      try {
        const bytes = await fetchBytes(url);
        const sha256 = hash(bytes);
        await Bun.write(`${cache}/${sha256}.nlogox`, bytes);
        const blob = gitHash(bytes);
        const gFile = gFiles.get(`${path}.nlogox`);
        const mFile = mFiles.get(`${relative}.nlogox`);
        const metadata = extract(decode(bytes));
        rows[index] = { ...base, retrieval: "captured", sha256, bytes: bytes.length, gitBlobSha1: blob,
          galapagos: { revision: upstream.galapagos, blobSha1: gFile?.sha ?? null, matchesServedBytes: gFile?.sha === blob, url: gFile ? `https://raw.githubusercontent.com/NetLogo/Galapagos/${upstream.galapagos}/${path.split("/").map(encodeURIComponent).join("/")}.nlogox` : null },
          desktopModels: { revision: upstream.models, blobSha1: mFile?.sha ?? null, matchesServedBytes: mFile?.sha === blob },
          ...metadata,
          delivery: { experiment: known[relative] ?? (relative === "Sample Models/Social Science/Segregation" ? "segregation" : null), implementation: known[relative] ? "existing-reference-port-pending-catalog-audit" : relative === "Sample Models/Social Science/Segregation" ? "first-new-slice-planned" : "open", sourceAudit: "pending", headlessVerification: "pending-catalog-acceptance", browserVerification: "pending-catalog-acceptance", independentApproval: "pending" },
          blockers: [ ...(metadata.extensions.length ? ["extension-semantics-require-audit"] : []), ...(metadata.includes ? ["included-source-closure-requires-audit"] : []), ...(metadata.mechanismSignals.some(x => ["files", "hubnet", "userInteraction", "dynamicExecution", "systemDynamics"].includes(x)) ? ["host-or-special-runtime-signals-require-audit"] : []) ],
        };
      } catch (error) { rows[index] = { ...base, retrieval: "failed", error: String(error), delivery: { implementation: relative === "Sample Models/Social Science/Segregation" ? "first-new-slice-planned" : "open", sourceAudit: "blocked-source-retrieval", headlessVerification: "pending", browserVerification: "pending", independentApproval: "pending" } }; }
      if ((index + 1) % 50 === 0) console.log(`Captured ${index + 1}/${list.length}`);
    }
  }));
  await json(`${root}/inventory.json`, { schemaVersion: 1, capturedAt: new Date().toISOString(), upstream, evidence, count: list.length, rows });
  await report();
  console.log(`Captured ${list.length} catalog rows. Run verify to check pinned hashes and immutable source correspondence.`);
}
async function verify(remote: boolean) {
  const inventory = await Bun.file(`${root}/inventory.json`).json() as { count: number; evidence: Evidence[]; rows: Array<{ id: string; catalogKey: string; slug: string; sha256?: string; bytes?: number; retrieval: string; galapagos?: { matchesServedBytes: boolean; url: string | null } }> };
  const list = await Bun.file(`${root}/pinned/list.json`).json() as string[];
  if (list.length !== inventory.count || inventory.rows.length !== inventory.count || new Set(inventory.rows.map(r => r.slug)).size !== inventory.count || inventory.rows.some((row, index) => row.catalogKey !== list[index])) throw new Error("Inventory cardinality/slug mismatch");
  for (const item of inventory.evidence) {
    const bytes = new Uint8Array(await Bun.file(`${root}/${item.file}`).arrayBuffer());
    if (hash(bytes) !== item.sha256 || bytes.length !== item.bytes) throw new Error(`Pinned evidence mismatch: ${item.file}`);
  }
  let verified = 0;
  let cursor = 0;
  await Promise.all(Array.from({ length: remote ? 8 : 1 }, async () => {
  while (cursor < inventory.rows.length) {
    const row = inventory.rows[cursor++]!;
    if (row.retrieval !== "captured" || !row.sha256) throw new Error(`Uncaptured row: ${row.id}`);
    const file = Bun.file(`${cache}/${row.sha256}.nlogox`);
    const bytes = remote ? await fetchBytes(row.galapagos?.matchesServedBytes && row.galapagos.url ? row.galapagos.url : (() => { throw new Error(`No proven immutable URL for ${row.id}`); })()) : new Uint8Array(await file.arrayBuffer());
    if (hash(bytes) !== row.sha256 || bytes.length !== row.bytes) throw new Error(`Source hash mismatch: ${row.id}`);
    verified++;
  }
  }));
  console.log(`Verified ${inventory.evidence.length} pinned mechanism/source files and ${verified}/${inventory.count} model hashes (${remote ? "immutable upstream download" : "local capture cache"}).`);
}
type ReportRow = {
  id: string; slug: string; catalogKey: string; sha256: string; webStatus: string; retrieval: string;
  extensions: string[]; mechanismSignals: string[]; includes: string | null; licenseNotice: string | null;
  galapagos: { matchesServedBytes: boolean }; desktopModels: { matchesServedBytes: boolean };
  delivery: { experiment: string | null; implementation: string; sourceAudit: string; headlessVerification: string; browserVerification: string; independentApproval: string };
};
async function report() {
  const inventory = await Bun.file(`${root}/inventory.json`).json() as { count: number; rows: ReportRow[] };
  const groups: Record<string, string[]> = {};
  for (const row of inventory.rows) {
    for (const signal of row.mechanismSignals ?? []) (groups[signal] ??= []).push(row.id);
    for (const extension of row.extensions ?? []) (groups[`extension:${extension}`] ??= []).push(row.id);
    if (row.includes) (groups["included-source"] ??= []).push(row.id);
    if (!row.licenseNotice) (groups["license-notice-unresolved"] ??= []).push(row.id);
  }
  await json(`${root}/capability-matrix.json`, {
    meaning: "Static signals only; membership does not establish required API contracts or delivered capability coverage.",
    groups,
  });
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const columns = ["id", "slug", "webStatus", "retrieval", "sha256", "experiment", "implementation", "sourceAudit", "headlessVerification", "browserVerification", "independentApproval"];
  await Bun.write(`${root}/delivery.csv`, columns.join(",") + "\n" + inventory.rows.map(row => [row.id, row.slug, row.webStatus, row.retrieval, row.sha256, row.delivery.experiment ?? "", row.delivery.implementation, row.delivery.sourceAudit, row.delivery.headlessVerification, row.delivery.browserVerification, row.delivery.independentApproval].map(quote).join(",")).join("\n") + "\n");
}
async function reextract() {
  const inventory = await Bun.file(`${root}/inventory.json`).json() as { rows: ReportRow[] };
  for (const row of inventory.rows) {
    if (row.retrieval !== "captured") continue;
    const bytes = new Uint8Array(await Bun.file(`${cache}/${row.sha256}.nlogox`).arrayBuffer());
    if (hash(bytes) !== row.sha256) throw new Error(`Cached source hash mismatch: ${row.id}`);
    Object.assign(row, extract(decode(bytes)));
    if (row.id === "Sample Models/Social Science/Segregation" && row.delivery.experiment === null) {
      row.delivery.experiment = "segregation";
      row.delivery.implementation = "first-new-slice-planned";
    }
  }
  await json(`${root}/inventory.json`, inventory);
  await report();
}
const command = Bun.argv[2];
if (command === "capture") await capture();
else if (command === "reextract") await reextract();
else if (command === "report") await report();
else if (command === "verify") await verify(Bun.argv.includes("--remote"));
else throw new Error("Usage: bun scripts/netlogo-catalog.ts capture | verify [--remote] | reextract | report");
