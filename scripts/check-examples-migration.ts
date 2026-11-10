import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import receipt from "../docs/development/examples-path-migration.json";

if (existsSync("examples")) throw new Error("The retired examples directory must not exist.");
import namingIntegration from "./main-naming-integration-receipt.json";
const integrationBySource = new Map(namingIntegration.records.map(record => [record.source, record]));

const sources = new Set<string>();
const destinations = new Set<string>();
let assertions = 0;
for (const record of receipt.records) {
  if (sources.has(record.source) || destinations.has(record.destination)) {
    throw new Error(`Duplicate migration entry: ${record.source}`);
  }
  sources.add(record.source);
  destinations.add(record.destination);
  const integration = integrationBySource.get(record.destination);
  if (integration && integration.sourceSha256 !== record.migratedSha256) throw new Error(`Naming integration source hash mismatch: ${record.destination}`);
  const destination = integration?.destination ?? record.destination;
  const content = readFileSync(destination);
  const digest = createHash("sha256").update(content).digest("hex");
  if (digest !== (integration?.destinationSha256 ?? record.migratedSha256)) throw new Error(`Migration hash mismatch: ${record.destination}`);
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
