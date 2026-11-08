import { expect, test } from "bun:test";
import { stages, validateProgressRow, verifyProgress, type ProgressRow } from "../scripts/netlogo-progress.ts";

test("all binding selected paths have source identity and evidence-backed milestones", async () => {
  const rows = await verifyProgress();
  expect(rows).toHaveLength(200);
  expect(rows.filter(row => row.path.startsWith("Curricular Models/Urban Suite/"))).toHaveLength(11);
  for (const slug of ["preferential-attachment", "voting", "wolf-sheep-predation", "wealth-distribution", "segregation"])
    expect(rows.find(row => row.slug === slug)?.stages.implemented.done).toBe(true);
});

test("milestones cannot claim browser/runtime or research completion without their required basis", async () => {
  const source = (await verifyProgress())[0]!;
  const clone = (): ProgressRow => structuredClone(source);
  const invalid = clone();
  invalid.blockers = "pending" as unknown as string[];
  expect(() => validateProgressRow(invalid)).toThrow(/Invalid blockers/);
  for (const stage of ["headless-verified", "browser-verified", "baseline-compared", "reviewed"] as const) {
    const row = clone();
    row.stages.implemented.done = false;
    for (const candidate of stages) if (candidate !== stage && candidate !== "selected") row.stages[candidate].done = false;
    row.stages[stage] = { done: true, evidence: ["docs/development/netlogo-model-acceptance.md"] };
    expect(() => validateProgressRow(row)).toThrow(/requires implementation/);
  }
  const research = clone();
  research.stages["research-verified"] = { done: true, evidence: ["docs/development/netlogo-model-acceptance.md"] };
  expect(() => validateProgressRow(research)).toThrow(/reserved research tree/);
});
