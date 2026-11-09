import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const directory = "docs/development/";
interface SourceRecord { readonly slug: string; readonly [key: string]: unknown }
interface Migration extends SourceRecord {
  readonly decision: string;
  readonly reason: string;
  readonly publicMethod?: string;
  readonly migratedControlKeys?: readonly string[];
}
interface Inventory { readonly baseline: string; readonly entries: readonly SourceRecord[] }
// These versioned audit records are repository inputs; field/count checks below guard delivery.
const read = <T>(name: string): T => JSON.parse(readFileSync(`${directory}${name}.json`, "utf8")) as T;
const inventory = read<Inventory>("universal-ui-inventory");
const migrations = [...read<{ entries: Migration[] }>("universal-ui-migrations-a").entries, ...read<{ entries: Migration[] }>("universal-ui-migrations-b").entries];
const audits = [...read<{ entries: SourceRecord[] }>("universal-ui-audit-a").entries, ...read<{ entries: SourceRecord[] }>("universal-ui-audit-b").entries];
const hash = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
const collectionSlugs = new Set(["des-civic-office", "des-ev-charging", "des-goods-buffer"]);
const overlaySlugs = new Set(["particle-swarm-optimization", "vision-evolution"]);
const entries = inventory.entries.map((entry: Record<string, unknown>) => {
  const slug = String(entry.slug);
  const migration = migrations.find(record => record.slug === slug);
  const audit = audits.find(record => record.slug === slug);
  if (!migration || !audit) throw new Error(`Missing source review for ${slug}`);
  const ui = `experiments/${slug}/ui.ts`;
  const model = `experiments/${slug}/model.ts`;
  const baselineUI = entry.uiSha256 ?? entry.baselineUIHash;
  const baselineModel = entry.modelSha256 ?? entry.baselineModelHash;
  if (typeof baselineUI !== "string" || typeof baselineModel !== "string") throw new Error(`Missing baseline hashes for ${slug}`);
  const modelHash = hash(model);
  if (slug !== "des-civic-office" && modelHash !== baselineModel) throw new Error(`Unapproved model change: ${slug}`);
  const live = migration.decision === "migrate";
  const selection = overlaySlugs.has(slug) && readFileSync(ui, "utf8").includes("selectable: false");
  const changedFiles = hash(ui) !== baselineUI ? [ui] : [];
  if (collectionSlugs.has(slug)) changedFiles.push(`experiments/${slug}/scene.ts`);
  if (modelHash !== baselineModel) changedFiles.push(model);
  return {
    slug, ui, model,
    baselineUIHash: baselineUI, baselineModelHash: baselineModel,
    currentUIHash: hash(ui), currentModelHash: modelHash,
    decision: collectionSlugs.has(slug) ? "collection-projection" : live ? "common-live-write" : "retain",
    reason: collectionSlugs.has(slug)
      ? "Replace repeated abstract collection placement with the existing spatial pipeline and centralized defaults; actual identities, queue order and capacity units remain distinct."
      : migration.reason,
    changedFiles, publicChangeMethod: migration.publicMethod ?? null,
    migratedControlKeys: migration.migratedControlKeys ?? [],
    selectionCorrection: selection ? "Presentation-only overlay is explicitly nonselectable; scientific coordinates/colors and actual identities remain unchanged." : null,
    observationContract: slug === "des-civic-office"
      ? "Only waitingResidents is added, detached directly from Resource.waiting; every previous observation field is preserved."
      : "Model source is byte-identical to baseline.",
    semanticSourceAudit: audit,
    writeMigrationEvidence: migration,
    acceptanceEvidence: ["universal-ui-decisions.md", "universal-ui-test-review.md", "universal-ui-browser-review.md"],
  };
});
if (entries.length !== 146 || new Set(entries.map((entry: { slug: string }) => entry.slug)).size !== 146)
  throw new Error("The source inventory must cover exactly 146 distinct pairs.");
const summary = {
  reviewedPairs: entries.length,
  commonLiveWriteMigrations: entries.filter((entry: { publicChangeMethod: string | null }) => entry.publicChangeMethod).length,
  collectionProjections: collectionSlugs.size,
  retainedPairs: entries.filter((entry: { decision: string }) => entry.decision === "retain").length,
  changedUIFiles: entries.filter((entry: { ui: string; changedFiles: string[] }) => entry.changedFiles.includes(entry.ui)).length,
  selectionCorrections: entries.filter((entry: { selectionCorrection: string | null }) => entry.selectionCorrection).length,
};
writeFileSync(`${directory}universal-ui-inventory.json`, JSON.stringify({
  baseline: inventory.baseline,
  status: "All source decisions resolved. This inventory does not itself establish browser, runtime or scientific acceptance; consult the linked evidence.",
  generation: "bun scripts/universal-ui-inventory.ts; preserves baseline hashes and embeds independent per-pair semantic audits and exact writer proofs.",
  summary, entries,
}, null, 2) + "\n");
console.log(JSON.stringify(summary));
