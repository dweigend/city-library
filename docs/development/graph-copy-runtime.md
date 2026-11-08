# Independent Graph.copy: author implementation evidence

The accepted [copy contract](graph-copy-contract.md), frozen before implementation at `2488cf5`, is implemented through the existing public `Graph.copy` signature. All five unchanged [public scripts](../../examples/graph-copy-proposal/) pass. This returns an independent, fully usable current Graph with original canonical nodes and fresh owned Edges. It adds no view, ReadonlyGraph facade, unsupported method or public batch abstraction. These are author checks, not independent approval; Argon/high remains quota-blocked.

## Implementation and reuse

[graph.ts](../../src/graph/graph.ts) keeps one private topology/lifecycle owner. Public construction and prepared copy publication use that same owner; its normal collections, deletion hooks, queries, generation, routing and analysis remain the actual methods on the result. [copy.ts](../../src/graph/copy.ts) handles selection, representation and state preparation. Reuse is local: the existing descriptor-separation approach used by Agent.copy, `cloneEdgeState`/supported-value cloning, `collectionGuard.read`, `createEdge` and canonical framework records. No dependency or transferred external graph implementation was added; those would not supply this owner's private membership, key and deletion-hook contracts.

Copy runs under the source read guard, including option/array reflection, state extraction, cloning and publication preparation. It snapshots entry membership, validates both selection-array shapes, then checks identities and endpoints. Explicit arrays act as deduplicated filters; output follows source insertion order. Reverse swaps directed endpoints only. Undirected conversion retains every edge and promotes simple representation to parallel only when a pair collision requires it. Existing representation flags and parallel keys survive; promoted keys follow output order. The new automatic cursor starts at zero and skips retained occupied keys.

Defaults and each selected edge state have separate clone sessions. Descriptor extraction excludes actual framework-owned Edge members, preserves nonenumerable model data and rejects custom accessors/symbols through existing clone rules. Pure data cycles/aliases and supported containers/buffer views retain their existing semantics. Living framework references remain the original identities. In particular, an explicit model reference to a source Edge, including `edge.self === edge`, stays that source Edge; it is not rebound to the copied Edge. A subsequently added edge can still have an ordinary default-root cycle pointing to its own newly allocated state root, as before.

After **all** caller-controlled source reflection, a walk of the prepared plain clones revalidates framework-reference liveness, including Map keys/values, Set members and nested cycles. Selected framework nodes are checked again. Only then is any target owner constructed. Edge identities are materialized before any target Agent membership hook is installed; publication invokes no caller callback or original-state reflection. This avoids hidden partially constructed owners when a later edge clone fails. Arbitrary Proxy external effects are not rolled back.

Source reads remain legal inside an existing source collection iteration. Pure nested source queries and edits to an independent graph remain legal during preparation. Actual source edits and participating Agent deletion reject. Every failure releases only the copy operation's own reader. No generator node/edge cap applies to copy, and construction does not loop over public `edges.add` scans. Preparation/publication take linear structural work in selected/source entries plus supported-state cloning and reference traversal; memory includes all prepared clones and fresh Edges before publication.

## Executed verification

[checks.json](graph-copy-runtime-evidence/checks.json) records commands and scope; raw logs and input hashes are alongside it.

| Executed check | Actual result |
| --- | --- |
| Focused copy and earlier Graph/generator/analysis/precision/connectivity/A5a tests | **55 passed, 0 failed, 20845 assertions**, seven test files |
| Frozen public scripts | Five copy plus all 20 earlier Graph scripts passed unchanged |
| Frozen input fingerprints | All 25 script hashes passed |
| `bun run typecheck` | All four configured TypeScript projects passed at the recorded checkpoint |
| Additional strict source check of all five copy scripts | Passed using the real tsc and a stdin configuration extending the existing development settings; no configuration file or frozen script was changed |
| `bun run build` | Browser ESM bundle and declaration emission passed |
| `bun run consumer` | Existing local packed-consumer checks passed: Bun, Node ESM and ambient-free TypeScript |
| Additional [packed copy probe](graph-copy-runtime-evidence/verify-packed-copy.ts) | Fresh local package: strict declarations, Bun source condition and Node ESM bundle all passed actual copy, direction/key/state, full receiver and lifecycle assertions |
| `git diff --check` | Passed |

The focused tests directly inspect real private Agent deletion-participant counts. They demonstrate unchanged counts during and after a late throwing Proxy reflection, failure after a later trap deletes a foreign reference from an earlier cloned state/default, exact recovery registration, cleanup, and shared-Agent deletion across owners. They also exercise source reentrancy rejection, legal nested reads/independent-owner edits, array subclasses, validation before state reflection, no getter calls, null-prototype/hidden data and a 30000-node generated-edge batch.

The unchanged fifth public script successfully copies **100001 nodes**, beyond the generator-only node cap. An additional [measured fixture](graph-copy-runtime-evidence/performance.json) generated a directed path on the first 100000 of 100001 source nodes, then copied all **100001 nodes and 99999 edges** in reverse. The copy call took **501.767294 ms** in one local observation; canonical endpoints, fresh identities, reverse traversal and the retained isolate passed. This is an executed workload, not a universal timing bound or a positive million-edge benchmark.

An initial global typecheck encountered the parallel Random expansion's obsolete unsupported-exponential negative fixture, plus two subsequently fixed non-null annotations in the new copy test. The coordinator updated that historical Random type fixture separately; the recorded final four-project typecheck passes. The shared checkout/build included that concurrent authorized Random work. These Graph checks do not replace the other phase's own verification or a final integrated repository check.

## Explicit limits

**Path coverage is only `undefined`, the complete currently constructible Edge path surface.** There is no actual spatial path constructor in this phase; reverse-oriented/cloned path geometry is neither stubbed nor claimed. A future working path API needs separate frozen examples and tests. Large state graphs still incur the existing clone recursion/resource costs; no new arbitrary copy cap was added.

No browser or NetLogo model comparison was run for this headless operation. Copy does not deliver native directed preferential attachment, alternate rewiring laws, a wheel hub adaptation or Kleinberg. No model acceptance count, scientific-equivalence assertion, rights decision, global ledger or independent approval changes follow. Global example/configuration registration and final integration remain the coordinator's work.
