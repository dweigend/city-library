import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import receipt from "../docs/development/examples-path-migration.json";

if (existsSync("examples")) throw new Error("The retired examples directory must not exist.");
import namingIntegration from "../docs/development/main-naming-integration-receipt.json";
import namingCompletion from "../docs/development/naming-completion-receipt.json";
import vocabularyMigration from "../docs/development/vocabulary-migration-receipt.json";
const completionBySource = new Map(namingCompletion.records.map(record => [record.source, record]));
if (completionBySource.size !== namingCompletion.records.length) throw new Error("Duplicate naming completion source.");
const usedCompletions = new Set<string>();
const integrationBySource = new Map(namingIntegration.records.map(record => [record.source, record]));
const vocabularyBySource = new Map(vocabularyMigration.records.map(record => [record.source, record]));
if (vocabularyBySource.size !== vocabularyMigration.records.length) throw new Error("Duplicate vocabulary migration source.");
const usedVocabulary = new Set<string>();

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
  const historicalDestination = integration?.destination ?? record.destination;
  const completion = completionBySource.get(historicalDestination);
  const priorDigest = integration?.destinationSha256 ?? record.migratedSha256;
  if (completion) {
    if (completion.sourceSha256 !== priorDigest || completion.assertions !== record.assertions) {
      throw new Error(`Naming completion source mismatch: ${historicalDestination}`);
    }
    usedCompletions.add(historicalDestination);
  }
  const completedDestination = completion?.destination ?? historicalDestination;
  const completedDigest = completion?.destinationSha256 ?? priorDigest;
  const vocabulary = vocabularyBySource.get(completedDestination);
  if (vocabulary) {
    if (vocabulary.sourceSha256 !== completedDigest || vocabulary.assertions !== record.assertions) {
      throw new Error(`Vocabulary migration source mismatch: ${completedDestination}`);
    }
    usedVocabulary.add(completedDestination);
  }
  const destination = vocabulary?.destination ?? completedDestination;
  const content = readFileSync(destination);
  const digest = createHash("sha256").update(content).digest("hex");
  if (digest !== (vocabulary?.destinationSha256 ?? completedDigest)) throw new Error(`Migration hash mismatch: ${record.destination}`);
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

if (usedCompletions.size !== completionBySource.size) throw new Error("Unmatched naming completion record.");
if (usedVocabulary.size !== vocabularyBySource.size) throw new Error("Unmatched vocabulary migration record.");

for (const sourceRecord of namingCompletion.names.provenance.sourceRecords) {
  const content = readFileSync(sourceRecord.path);
  const digest = createHash("sha256").update(content).digest("hex");
  if (digest !== sourceRecord.sha256) throw new Error(`Source record hash mismatch: ${sourceRecord.path}`);
}
console.log(`Source provenance passed: ${namingCompletion.names.provenance.sourceRecords.length} records.`);
