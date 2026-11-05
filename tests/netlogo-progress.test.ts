import { expect, test } from "bun:test";
import { verifyProgress } from "../scripts/netlogo-progress.ts";

test("all binding selected paths have source identity and evidence-backed milestones", async () => {
  const rows = await verifyProgress();
  expect(rows).toHaveLength(200);
  expect(rows.filter(row => row.path.startsWith("Curricular Models/Urban Suite/"))).toHaveLength(11);
  for (const slug of ["preferential-attachment", "voting", "wolf-sheep-predation", "wealth-distribution", "segregation"])
    expect(rows.find(row => row.slug === slug)?.stages.implemented.done).toBe(true);
});
