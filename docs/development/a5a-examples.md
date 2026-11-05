# A5a public example contracts

Status: five asserted scripts written and frozen before Graph runtime implementation on 5 November 2026; all now pass unchanged. This document records the example-first delivery gate for the [A5a assignment](a5a.md); [acceptance evidence](a5a-evidence.md) records verified target behavior. The [binding reference](../agent-loom/api-reference.md#graph-representations) remains authoritative.

All scripts import only the existing public package name `city-library` plus Node assertions. There are no mocks, private runtime imports, skipped assertions, speculative Graph aliases or renderer dependencies. Model rules in examples 04/05 are ordinary caller-owned compositions of public Graph/Agent/World/run operations. They do not introduce a library diffusion API, Graph generator, scheduler or hidden clock.

## Accepted author tasks and operation closure

| Script | Reference entries / contracts | Inputs and required observable result |
| --- | --- | --- |
| `01-structure-and-identity.ts` | Graph.add `api-78`; graph.parallel/selfLoops `api-131/132`; nodes.add/size/iteration `api-127/81/129`; hasNode `api-75`; edges.add/size/has/iteration/between `api-80/82/83/130/84`; hasEdge/neighbors `api-76/77`; edge.from/to/directed/key/path `api-133–137`, identity/life contract | Three plain object identities, simple undirected graph. Re-adding a node deduplicates by reference; absent endpoint insertion throws without creating nodes/edges; reverse duplicate returns original edge. Observations preserve original references and captured neighbors remain frozen/stable after later insertion. Built-in endpoint and collection replacement is refused. Non-spatial edge.path is undefined. |
| `02-direction-and-representation.ts` | Graph.add `api-78`; representation `api-131/132`; edges.add/between `api-80/84`; neighbors `api-77`; edge.delete `api-74`; endpoint/key contracts `api-133–136` | Simple opposite directed edges coexist. Out/in/all honor direction; all-neighbors deduplicates original nodes. Simple mixed overlap, loops and keys reject. Parallel self-loop graph accepts mixed edges; explicit graph-global key `0` deduplicates an undirected pair but rejects directed reuse. Omitted keys allocate `1`, then `2` after deletion, without recycling. Loops occur once in between/neighbors. |
| `03-lifecycle-and-state.ts` | Graph.add edge defaults `api-79`; node deletion/collections `api-128/127/129/81`; graph.delete `api-85`; edge creation/deletion `api-80/74`; shared supported-state and Agent/World lifecycle contracts | Graph creation copies nested defaults. Duplicate insertion never overwrites existing edge state. Agent state/copy retains canonical Graph/Edge references. World detachment preserves graph membership. Agent deletion removes membership and incident edges across two graphs; final edge state/endpoints remain readable and repeated edge deletion is harmless. Copying data retaining a deleted edge rejects. edgesOnly clears edges while preserving nodes and World state; full graph deletion preserves objects. Structural mutation during active iteration throws before mutation, and closing iteration releases the guard. |
| `04-synchronous-diffusion.ts` | Graph/node/edge creation and neighbors `api-78/127/80/77`; existing public Agent/World/run | Five agents on a directed chain start with index zero adopted. Caller-written synchronous commits reach exactly `[0,1]` after one tick, `[0,1,2]` after two and all five after four. Newly changed nodes cannot transmit within the same tick. Direction and topology persist; deterministic rules consume no randomness. |
| `05-bridges-change-outcomes.ts` | Graph/node/edge creation, neighbors, membership and edge deletion `api-78/127/80/77/75/74`; existing Agent/World/run | Two four-node cliques differ only by an explicit bridge. After five identical synchronous steps, separated and cut networks have 4/8 adopted, while the bridged network has 8/8. Original edge counts are 12 versus 13 and deleting the bridge restores 12. An eight-node ring reaches three adopters after one step; an eight-node hub seeded at its center reaches eight. World clocks match and graphs share no node identities. |

The network fixtures deliberately use guaranteed adoption on exposure to isolate topology causality from stochastic extinction. They do not assert that every probabilistic cascade eventually reaches every connected node. The two-community clique fixture is a small contract example; the interactive model separately specifies three communities with cyclic offset contacts in the A5a assignment.

Graph structure changes only through the declared public mutations. Node custom-state writes remain ordinary typed assignments inside headless author logic. The deterministic diffusion rule computes its next list from an entry snapshot before committing; graph collection iteration is never used as an implicit activation schedule.

## Freeze fingerprints

SHA-256 fingerprints of the accepted source bytes:

| Script | SHA-256 |
| --- | --- |
| `01-structure-and-identity.ts` | `9eff1e2c27cd6162940bd2c90efde00cde6e25290f5bbdd715728e95aeb1e908` |
| `02-direction-and-representation.ts` | `41a25de79f0df79b7c94815ae225020320a4a64cc2ffad95a687ba2170d765c6` |
| `03-lifecycle-and-state.ts` | `f2533274c6efdf09429feb77206d9a28345c93060ab85853e653c1185d4f9b81` |
| `04-synchronous-diffusion.ts` | `e4d4c09da36b14d8131e5be9fe49488269477187aedf1b50c9a082f3b7498560` |
| `05-bridges-change-outcomes.ts` | `1eb7a2f3c5e3e011b35ca76b0461ce21321b0d5db6cc2411ebe40b005a2bbd64` |

## Initial red evidence and handoff

Executed every `examples/a5a/*.ts` script through Bun before Graph implementation. All five exited 1 with `SyntaxError: Export named 'Graph' not found in module '/home/david/Projekte/city-library/index.ts'.` This is the expected missing-public-export failure, not a passing behavioral check. No runtime stubs were added to mask it. No Graph runtime files or exports were changed by example authoring.

The implementation must make these exact scripts typecheck and run with assertions intact. The coordinating agent will add this phase to the example runner and development typecheck when integrating its working runtime. Focused boundary/type tests must additionally cover malformed option records, getters, reserved names, duplicate option validation, failure atomicity, deleted/foreign references and iterator release; examples are not exhaustive unit tests.

Deferred: spatial paths/ties, Graph World attachment, views/copies, routing/traversal/analysis/generators/layouts and interchange. This bounded closure reads absent non-spatial `edge.path`; supplied path options reject rather than pretending spatial support. Shared types or reference entries grouping later operations remain partial where appropriate.
