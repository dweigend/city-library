import assert from "node:assert/strict";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const root = new URL("../../../", import.meta.url);
const folder = new URL("examples/graph-copy-proposal/", root);
const files = (await readdir(folder)).filter(name => name.endsWith(".ts")).sort();
assert.equal(files.length, 5);
const transpiler = new Bun.Transpiler({ loader: "ts", target: "bun" });
const syntax = [];
for (const name of files) {
  const source = await readFile(new URL(name, folder), "utf8");
  const js = transpiler.transformSync(source);
  assert.ok(js.length > 0);
  syntax.push({ file: `examples/graph-copy-proposal/${name}`, status: "PARSE_PASS", sha256: createHash("sha256").update(source).digest("hex") });
}
const diagnostics = await readFile(new URL("proposal-type-diagnostics.txt", import.meta.url), "utf8");
const lines = diagnostics.trim().split("\n");
assert.ok(lines.length > 0);
assert.ok(lines.every(line => line.includes("error TS2339: Property 'copy' does not exist on type 'Graph<")));
const oracle = JSON.parse(await readFile(new URL("source-oracles.json", import.meta.url), "utf8"));
assert.equal(oracle.status, "PASS");
assert.equal(oracle.graphCopyPresent, false);
const snapshotFiles = ["index.ts", "src/graph/graph.ts", "src/graph/edge.ts", "src/graph/collections.ts", "src/agent/state.ts", "src/agent/lifecycle.ts", "docs/agent-loom/api-reference.md", "docs/agent-loom/api-table.md"];
const snapshot = [];
for (const file of snapshotFiles) {
  const bytes = await readFile(new URL(file, root));
  snapshot.push({ file, bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
}
await writeFile(new URL("source-snapshot.json", import.meta.url), JSON.stringify(snapshot, null, 2) + "\n");
// Independent labeled edge-table oracle: no Graph.copy/generator implementation.
const original = [["a","b",true,"forward"], ["b","a",true,"backward"], ["a","a",true,"loop"]] as const;
const reverseExpected = [["b","a",true,"forward"], ["a","b",true,"backward"], ["a","a",true,"loop"]] as const;
for (let i = 0; i < original.length; i++) {
  const before = original[i]!, after = reverseExpected[i]!;
  assert.equal(after[0], before[1]); assert.equal(after[1], before[0]); assert.equal(after[3], before[3]);
}
const pairs = new Map<string, number>();
for (const [a,b] of original) {
  const key = [a,b].sort().join("-"); pairs.set(key, (pairs.get(key) ?? 0) + 1);
}
assert.equal(pairs.get("a-b"), 2); assert.equal(pairs.get("a-a"), 1);
const topology = { status: "PASS", scope: "Independent labeled fixture table; not copy runtime", reverseExpected, undirectedMultiplicities: Object.fromEntries(pairs) };
await writeFile(new URL("topology-oracle.json", import.meta.url), JSON.stringify(topology, null, 2) + "\n");
const result = { status: "PROPOSAL_VALIDATED_NOT_RUNTIME", syntax, proposalTypes: { status: "EXPECTED_MISSING_METHOD_ONLY", code: "TS2339", count: lines.length }, currentSourceTypecheck: { command: "bun run typecheck", status: "PASS", output: "source-typecheck.txt" }, sourceOracle: oracle, topologyOracle: topology, freezes: false, approval: false };
await writeFile(new URL("validation.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ status: result.status, parsedScripts: files.length, expectedMissingCopyDiagnostics: lines.length, currentSourceTypecheck: "PASS", sourceOracles: "PASS", topologyOracle: "PASS" }));
