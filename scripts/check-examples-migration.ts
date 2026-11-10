import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import receipt from "../docs/development/examples-path-migration.json";

if (existsSync("examples")) throw new Error("The retired examples directory must not exist.");
const sources = new Set<string>();
const destinations = new Set<string>();
let assertions = 0;
for (const record of receipt.records) {
  if (sources.has(record.source) || destinations.has(record.destination)) {
    throw new Error(`Duplicate migration entry: ${record.source}`);
  }
  sources.add(record.source);
  destinations.add(record.destination);
  const content = readFileSync(record.destination);
  const digest = createHash("sha256").update(content).digest("hex");
  if (digest !== record.migratedSha256) throw new Error(`Migration hash mismatch: ${record.destination}`);
  const count = [...content.toString().matchAll(/\b(?:assert|expect)\s*[.(]/g)].length;
  if (count !== record.assertions || count !== record.migratedAssertions) {
    throw new Error(`Assertions changed: ${record.destination}`);
  }
  if (record.role === "historical-manifest" && digest !== record.originalSha256) {
    throw new Error(`Historical manifest bytes changed: ${record.destination}`);
  }
  assertions += count;
}
console.log(`Migration receipt passed: ${sources.size} files, ${assertions} assertion calls; historical manifests unchanged.`);
