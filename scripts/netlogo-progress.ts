/** Validate the binding selection and render evidence-backed delivery progress. */
import { createHash } from "node:crypto";
const root = "experiments/catalog";
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
export const stages = ["selected", "source-audited", "contract-frozen", "implemented", "headless-verified", "browser-verified", "baseline-compared", "research-verified", "reviewed"] as const;
export type Stage = typeof stages[number];
export interface Milestone { done: boolean; evidence: string[]; basis?: string }
export interface ProgressRow {
  path: string; slug: string; batch: string;
  stages: Record<Stage, Milestone>;
  blockers: string[];
}
export function validateProgressRow(row: ProgressRow): void {
  if (!Array.isArray(row.blockers) || row.blockers.some(value => typeof value !== "string"))
    throw new Error(`Invalid blockers: ${row.path}`);
  for (const stage of stages) {
    const milestone = row.stages[stage];
    if (!milestone || typeof milestone.done !== "boolean" || !Array.isArray(milestone.evidence) || milestone.evidence.some(file => typeof file !== "string") || (milestone.done && milestone.evidence.length === 0))
      throw new Error(`Missing evidence for ${stage}: ${row.path}`);
  }
  for (const stage of ["headless-verified", "browser-verified", "baseline-compared", "reviewed"] as const)
    if (row.stages[stage].done && !row.stages.implemented.done)
      throw new Error(`${stage} requires implementation: ${row.path}`);
  if (row.stages["research-verified"].done && !row.stages["research-verified"].evidence.some(file => file.startsWith("docs/research/netlogo-web/")))
    throw new Error(`Research evidence must use the reserved research tree: ${row.path}`);
}

export async function verifyProgress() {
  const selection = await Bun.file(`${root}/selection/selection.json`).json() as {
    total: number;
    sourceCatalog: { repositoryPath: string; sha256: string };
    provenance: { originalSelectionRepositoryPath: string; originalSelectionSha256: string };
    models: { catalogPath: string; slug: string; deliveryBatch: string }[];
  };
  const source = await Bun.file(selection.sourceCatalog.repositoryPath).text();
  if (sha256(source) !== selection.sourceCatalog.sha256) throw new Error("Browser catalog hash mismatch.");
  const original = await Bun.file(selection.provenance.originalSelectionRepositoryPath).text();
  if (sha256(original) !== selection.provenance.originalSelectionSha256) throw new Error("Original selection hash mismatch.");
  const originalSelection = JSON.parse(original) as { models: unknown[] };
  if (JSON.stringify(selection.models) !== JSON.stringify(originalSelection.models)) throw new Error("Binding selected membership/rationale/order changed.");
  const browser = JSON.parse(source) as { models: { catalogPath: string; disabled: boolean }[] };
  const available = new Map(browser.models.map(row => [row.catalogPath, row]));
  const inventory = await Bun.file(`${root}/inventory.json`).json() as { rows: { id: string; webStatus: string; scope: { selected: boolean } }[] };
  const captured = new Map(inventory.rows.map(row => [row.id, row]));
  if (selection.total !== 200 || selection.models.length !== 200 || new Set(selection.models.map(row => row.catalogPath)).size !== 200 || new Set(selection.models.map(row => row.slug)).size !== 200) throw new Error("Expected exactly 200 unique paths and slugs.");
  for (const row of selection.models)
    if (!available.has(row.catalogPath) || available.get(row.catalogPath)!.disabled || captured.get(row.catalogPath)?.webStatus !== "compiling" || !captured.get(row.catalogPath)!.scope.selected)
      throw new Error(`Selected source unavailable: ${row.catalogPath}`);
  if (inventory.rows.length !== 550 || inventory.rows.filter(row => row.scope.selected).length !== 200) throw new Error("Expected 200 selected and 350 outside-current-scope rows.");
  const progress = await Bun.file(`${root}/progress.json`).json() as { rows: ProgressRow[] };
  const paths = new Map(selection.models.map(row => [row.catalogPath, row]));
  if (progress.rows.length !== 200 || new Set(progress.rows.map(row => row.path)).size !== 200) throw new Error("Progress ledger must have 200 unique selected rows.");
  for (const row of progress.rows) {
    const selected = paths.get(row.path);
    if (!selected || selected.slug !== row.slug || selected.deliveryBatch !== row.batch) throw new Error(`Progress identity mismatch: ${row.path}`);
    validateProgressRow(row);
    for (const stage of stages) {
      const milestone = row.stages[stage];
      for (const file of milestone.evidence)
        if (!(await Bun.file(file).exists())) throw new Error(`Evidence missing: ${file}`);
    }
    if (!row.stages.selected.done) throw new Error(`Selected stage missing: ${row.path}`);
  }
  return progress.rows;
}

async function report() {
  const rows = await verifyProgress();
  const counts = Object.fromEntries(stages.map(stage => [stage, rows.filter(row => row.stages[stage].done).length]));
  const complete = rows.filter(row => stages.every(stage => row.stages[stage].done) && row.blockers.length === 0).length;
  const summary = { selected: 200, outsideCurrentScope: 350, stages: counts, fullyVerified: complete, remainingAcceptance: 200 - complete };
  await Bun.write(`${root}/progress-summary.json`, JSON.stringify(summary, null, 2) + "\n");
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  await Bun.write(`${root}/progress.csv`, ["path,slug,batch," + stages.join(",") + ",complete,blockers", ...rows.map(row => [row.path, row.slug, row.batch, ...stages.map(stage => row.stages[stage].done ? "yes" : "pending"), stages.every(stage => row.stages[stage].done) && row.blockers.length === 0 ? "yes" : "pending", row.blockers.join("; ")].map(quote).join(","))].join("\n") + "\n");
  console.log(JSON.stringify(summary));
}
if (import.meta.main) {
  if (Bun.argv[2] === "report") await report();
  else if (Bun.argv[2] === "verify") { await verifyProgress(); console.log("Verified binding selection, 200 evidence ledgers and 350 outside-scope rows."); }
  else throw new Error("Usage: bun scripts/netlogo-progress.ts verify | report");
}
