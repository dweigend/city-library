# NW generator source gaps: served Web behavior

Status: bounded primary-source audit, 6 November 2026. This closes factual questions about the selected original's Web generators; it defines no new public API, implements nothing and grants no acceptance or independent approval. The existing eleven-kind [Graph.generate binding](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/agent-loom/api-reference.md#graph-generate) remains authoritative. The earlier [selected source audit](selected-host-capabilities.md) supplies complete model Code/Info/widget context; this report does not repeat selection or literature research.

## Source identity and notices

The actual original was loaded in a fresh owned T3 preview tab, after `preview_status`, from [NW General Examples](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Code%20Examples/Extensions%20Examples/nw/NW%20General%20Examples.nlogox). Its live `session.nlogoSource.nlogo` SHA-256 was `9c80d9fa4d5d4da96224e65cd707639267da3f6494309d9d45b758164d2703db` both before and after the probes, matching the archived XML (65022 bytes, NetLogo 7.0.4). Source was never edited. [Initial capture](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/actual-served-primitives.json) and [final state](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/final-browser-state.json) retain identity, URL, timestamps, viewport and browser version.

The actual served [tortoise-engine.min.js](https://www.netlogoweb.org/tortoise-engine.min.js) was 1855271 bytes, SHA-256 `09f685d38681a850d9c79783d6b5c23c887d7d773c0117562fac56a64b63e1a2`. All ten live `Extensions.NW.prims` generator function strings occur byte-for-byte in that response. [Served module evidence](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/actual-served-module.json) retains the NW module excerpt and its SHA-256 `6f50765f6d7efa63ea0f328f901a72acb43d754fce282a2ac8b9eca5eb743062`; offsets are JavaScript string character offsets, not claimed byte offsets. [Dependency excerpts](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/actual-served-dependency-modules.json) pin the relevant turtle creation, agentset ask, color, shuffle and link creation modules in the same bundle. An independent [shell fetch](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/served-engine-shell-identity.json) matched its byte count and hash. The complete compiled engine is not retained as a library dependency.

Pinned Galapagos `90be931773fcf499049247a8aaa1aecbe003654c` [build.sbt](https://github.com/NetLogo/Galapagos/blob/90be931773fcf499049247a8aaa1aecbe003654c/build.sbt) declares `tortoiseVersion = "1.0-6168dd2"`; [retained declaration and identity](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/galapagos-build-identity.json). The official Tortoise commit API resolves that suffix to `6168dd20b9443d6fb614cc8c180d5f15a10a9bd9`. [Primary source manifest](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/primary-source-manifest.json) records immutable primary URLs, sizes, Git blob hashes and SHA-256 for eleven retained files. Readable [nw-generators.coffee](https://github.com/NetLogo/Tortoise/blob/6168dd20b9443d6fb614cc8c180d5f15a10a9bd9/engine/src/main/coffee/extensions/nw-generators.coffee) explains the actual module. The build declaration does not prove the deployed server's entire build is reproducible from that commit: deployed behavior is independently pinned by the actual function strings and module bytes.

The CoffeeScript headers attribute Uri Wilensky and link Tortoise. Its pinned [LICENSE.md](nw-generator-source-gaps-evidence/LICENSE.md) says NetLogo & Tortoise copyright 1999–2013 Uri Wilensky, GPL version 2 or later, with separately licensed third-party libraries listed. These retained files/excerpts are source evidence; this audit authorizes no code transfer into City Library. The model Code's public-domain waiver is a separate notice and does not make the extension GPL code public domain.

## Actual Web Kleinberg construction

The facts below follow `generateSmallWorld`, `buildLattice`, `linkOnce` and their live served equivalents, rather than a probability law inferred from a single generated graph.

1. Rows and columns each have minimum 2. Turtles are random-born first; row-major index is `row * cols + col`. The base lattice visits rows then columns, adds right then down, and adds each wrapping last-to-first seam only when that dimension is greater than 2. Thus directed wrapping on a two-cell dimension does **not** create an antiparallel seam.
2. For each source, visited in that same row-major order, candidates are every other cell, in target row-major order. Existing lattice neighbors and previously linked shortcut neighbors remain candidates. Self is excluded. There is no distance cutoff or degree exclusion.
3. Let `dr = abs(r-r2)` and `dc = abs(c-c2)`. Without wrap, distance is `dr+dc`. With wrap, replace these by `min(dr, rows-dr)` and `min(dc, cols-dc)` before adding: toroidal Manhattan distance. Display-world topology and geometric layout are not inputs.
4. Candidate weight is `Math.pow(distance, -clusteringExponent)`. The implementation adds weights into a cumulative **Number** total in target order. If total is positive, it consumes one `nextDouble()`, multiplies by total, and selects the first cumulative boundary satisfying `pick <= cumulative`, with the final candidate as fallback.
5. This is one shortcut **attempt** per source, not one guaranteed new link. `linkOnce` suppresses an already seen directed ordered pair or undirected unordered pair and does not redraw. Distinct reverse directed arcs are allowed. No self or repeated pair is added. Undirected dedup uses sorted IDs for its key, but stored end1/end2 order remains the original generation order.

For the ordinary finite positive-total domain, the ideal real-arithmetic categorical law is therefore

`P(v | u) = d(u,v)^(-r) / sum(w != u, d(u,w)^(-r))`.

Operational compatibility additionally requires the observed binary64 cumulative order and inclusive comparison; the ideal expression alone does not specify bitwise outcomes. In particular this is not uniform sampling among currently nonadjacent nodes. On a 2×3 nonwrapping grid, corner source 0 has target distances `[1,2,1,2,3]`: at r=0 all five ideal probabilities are 1/5; at r=2 they are `[18/47,9/94,18/47,9/94,2/47]`. On a wrapped 3×3 grid at r=2, four axial candidates have probability 1/5 each and four diagonal candidates 1/20 each. The retained exact-rational check verifies these small mathematical tables; it is not an implementation or stochastic-fit test.

`requireIntMinimum` is named as an integer helper but only checks `< minimum`. The primitive signature takes numbers. No independent finite/exponent-range/integer guard appears here. The original UI uses integer rows/columns 0…20 and exponent 0…10 in steps of .1. Fractional dimensions, extreme exponents and nonfinite inputs were not executed; no universal behavior is inferred for them. Source comments explicitly describe the lattice/Kleinberg code as structurally equivalent to desktop NW, **not bit-identical**, to avoid reimplementing JUNG. This report establishes the pinned Web behavior, not desktop RNG parity.

## Direction and seed structures actually supported

| Original Web generator | Source behavior and executed small fixture | Existing generic binding contrast |
| --- | --- | --- |
| Preferential attachment | Directed breed works. Seed consists of m+1 turtles with one i→j arc for every i<j. New turtle points to m distinct older targets. n=2,m=1 gives `0→1`; n=3,m=2 gives `0→1,0→2,1→2`; n=6,m=1 seed17 gives `0→1,2→0,3→0,4→2,5→0`. | `preferential` is undirected and uses one stable cumulative-degree draw per distinct choice. Directed source cannot be silently represented by it. |
| Watts–Strogatz | Directed breed works. k is **per-side** neighborhood size, seed forward arcs i→i+1…i+k mod n. n=4,k=1,p=0 gives a directed 4-cycle. At p=1 seed17 gives `0→2,1→3,2→3,3→0`. n=2,k=0 is valid and produces two nodes, zero edges. | `smallWorld` is undirected, n≥3, with total even `neighbors≥2`; k maps to total 2k only in overlapping domains. |
| Star | First turtle is hub, directed spokes **leaf→hub**. n=4 gives `1→0,2→0,3→0`. | Generic directed star points center→leaf. |
| Inward/outward wheel | Hub is **last**, rim first n−1; rim ascending cycle precedes spokes. n=4 inward: `0→1,1→2,2→0` plus `0→3,1→3,2→3`. Outward has same rim plus `3→0,3→1,3→2`. `GENERATE-WHEEL` and `GENERATE-WHEEL-INWARD` use the same inward builder flag. | Generic wheel hub is first and directed spokes are outward. Reversing every arc would also reverse the rim and is not equivalent. |
| Directed wrapped lattice | 2×2 gives only `0→1,0→2,1→3,2→3`; dimensions of length 2 suppress seam arcs. | Generic positive-axis wrapping retains distinct antiparallel directed pairs for length 2. |

PA selects an existing link using `nextInt(links.length)`, then an endpoint using `nextBoolean()`. Duplicate selected targets consume further attempts. The sampling pool stays fixed until all m new targets have been selected, then new links append. This weights total incident link ends, including both ends of directed links, not out-degree or in-degree alone. The law and RNG protocol differ from a single cumulative choice even when both produce degree preference.

WS preloads the full forward seed adjacency, including edges whose traversal has not occurred yet. Each source/offset consumes one `nextDouble` to decide rewiring. On rewiring it deletes the old target from adjacency **before** choosing, so the old target may be selected again. Candidate search uses a persistent permuted turtle buffer and a partial Fisher–Yates selection with `nextInt(remaining)`; self and either-direction neighbors are rejected. This has variable rejection draw counts. It is not evidence for replacing the current generic uniform eligible-endpoint and prescribed-draw contract.

### RNG and action boundaries

Random-born turtles consume random color and heading draws (`nextInt(BaseColors.length)` and `nextInt(360)` each). PA interleaves new turtle births and attachment choices. WS instead uses ordered turtles with deterministic color/heading and no birth RNG. All ten generators finish with `TurtleSet.ask(block-or-noop, true)`: the agentset shuffler consumes `nextInt(remaining)` while at least two live entries remain, including for an omitted/no-op block (n−1 shuffle draws for the ordinary all-alive population).

The original model's `generate` wrapper may clear, creates turtles, applies layout and updates plots at tick zero. Layout can add RNG consumption; the circle screenshot replays explicitly select circle. These are separate action/birth/layout protocols from a headless `Graph.generate` call on existing canonical nodes. Neither seed17 graph observations nor this source audit establish a portable common Random stream across the two systems.

## Executed native observations

[Probe index](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/native-probe-index.json) retains all **26** commands, timestamps, native console readbacks and raw graph reporters, with individual JSON files. Every command started with `setup random-seed 17`. Controls were changed by the native Command Center, using its actual editor and Enter dispatch; only console text was cleared between probes. Readback used the original session reporter for ticks, turtle/link counts, breed counts and sorted stored endpoint pairs. Sorted links are not claimed to be creation order. Screenshots are supporting views, not replacements for readbacks.

| Kleinberg native settings | Nodes / links | Source-derived base links / observed net additions |
| --- | --- | --- |
| 2×3, r0, no wrap, undirected | 6 / 11 | 7 / 4 |
| 2×3, r2, no wrap, undirected | 6 / 10 | 7 / 3 |
| 3×3, r2, no wrap, undirected | 9 / 16 | 12 / 4 |
| 3×3, r2, wrap, undirected | 9 / 20 | 18 / 2 |
| 2×2, r0, no wrap, directed | 4 / 8 | 4 / 4 |

These counts illustrate duplicate suppression; the attempted shortcuts were not individually instrumented or counted by a replacement runtime. Source traversal establishes the attempt count. Full endpoint arrays are in the JSONs. Circle-layout replay retained the wrapped 3×3 and inward-wheel graph readbacks.

The native errors below occurred with ticks=0 and zero nodes/links following setup. Each console line has the exact prefix `ERROR: Extension exception: `.

| Native primitive arguments after breeds | Exact message after prefix |
| --- | --- |
| `nw:generate-small-world … 0 3 2 false` and `… 1 3 2 false` | `The number of rows in the generated network must be at least 2.` |
| `nw:generate-small-world … 3 1 2 false` | `The number of columns in the generated network must be at least 2.` |
| `nw:generate-preferential-attachment … 1 1` | `The number of turtles must be larger than the minimum degree.` |
| `nw:generate-watts-strogatz … 4 2 0` | `Neighborhood size must be less than half the number of turtles.` |
| `nw:generate-watts-strogatz … 0 0 0` | `A positive number of turtles must be specified.` |
| `nw:generate-wheel-inward … 3` | `The number of nodes in the generated network must be at least 4.` |
| `nw:generate-ring … 2` | `The number of nodes in the generated network must be at least 3.` |

The exact commands resolve the ellipses and directed/undirected breeds in the index. Errors precede births for these probes; arbitrary callback failures or composite invalid-input precedence were not tested.

Inspected PNGs: [wrapped Kleinberg circle view](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/kleinberg-wrap-circle.png), [inward wheel circle view](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/wheel-inward-circle.png), and [visible ring-boundary Command Center error](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/ring-boundary-error.png). Captures use 1280×800, Chrome 156.0.0.0, 6 November 2026 UTC. They are bounded native interaction checks, not a mobile/full-page or completed model baseline. The owned tab was closed; no other tab was used.

## Decisions still required before an extension proposal can freeze

- **U1 — genuine Kleinberg family gap:** decide an explicit future construction contract for the source law, base lattice, one-attempt dedup and directed breed behavior. It cannot be mapped to existing `smallWorld`, which is Watts–Strogatz. No new kind or option name is introduced here. Choose numerical/exponent and dimension domains explicitly, using source UI and native error evidence rather than copying the misleading helper name.
- **U2 — directed PA and its RNG profile:** decide whether to expose the actual directed seed/growth and random-link/end rejection protocol as an explicit extension, or supply a separately approved source adapter. Preserve current undirected stable-one-draw `preferential`; incident-degree weighting and seed orientation must be explicit. Desktop bit parity remains unproved.
- **U3 — directed WS and small populations:** decide explicit directed support, per-side versus total neighbors, k0/n1/n2 domain, old-target eligibility and RNG schedule. Preserve the current generic contract; changing it silently to native rejection draws would break accepted examples.
- **U4 — orientation and identity:** decide source inward-star, last-hub wheel and two-cell lattice seam adaptations without changing generic outward-first-hub and positive-axis semantics. Native identity/order matters to reporters and later RNG. Merely obtaining an isomorphic graph does not settle that protocol.
- **U5 — model action composition:** decide a public adapter protocol for turtle births, native optional shuffled turtle blocks, append-versus-clear, layout and plot actions separately from graph topology construction. No inference from World space or hidden random streams is justified. Preserve current node/edge caps and graph ownership rules.

These are bounded missing contracts for actual source cases, not an unsupported-category disposition. No model target, API freeze or acceptance increase follows from the audit. No runtime, browser application code or TypeScript changed; build/typecheck/runtime tests were therefore not run for this evidence-only change. The executed [validation script and results](https://github.com/dweigend/city-library/blob/dc7b164abd23c8e7b7f11c902195ab030c5f1c4b/docs/development/nw-generator-source-gaps-evidence/validation.json) check source identities, captured-function identities, all retained JSON, probe consistency and small rational law tables. No independent review or approval is claimed.
