# Served NetLogo Web catalog inventory

Captured 2026-11-05 at 22:15:17 UTC for [epic #1](https://github.com/dweigend/city-library/issues/1), inventory batch [#2](https://github.com/dweigend/city-library/issues/2). This is source evidence and a delivery ledger, not scientific parity, target browser verification or independent approval.

## Scope established from the served launcher

The actual [official launcher](https://www.netlogoweb.org/launch) loads a fingerprinted `pages/47db6c1213fc35ad1601a035666d7c45-tortoise.js`, which imports `c92369b3.chunk.js`. That chunk fetches `./model/list.json` to populate the model selector and `./model/statuses.json` to mark/disable entries. It appends `.nlogox` to the extensionless listed path and removes the `public/` prefix when resolving model assets. The captured list, statuses, launcher and both JavaScript modules are retained under [pinned/](../../experiments/catalog/pinned/), with URLs, byte sizes and SHA-256 values in [inventory.json](../../experiments/catalog/inventory.json).

**The pinned served catalog contains 550 unique rows. All 550 model files were retrieved successfully** (31,871,737 source bytes). Served status metadata labels 467 `compiling` and 83 `not_compiling`. These labels are upstream metadata, not tests run by this project. All 83 disabled entries remain in scope and in the ledger. The launcher's short random-start recommendation list is not the whole catalog.

| Served category | Rows |
| --- | ---: |
| Sample Models | 279 |
| Code Examples | 127 |
| Curricular Models | 92 |
| IABM Textbook | 47 |
| Alternative Visualizations | 5 |
| Total | 550 |

## Immutable source correspondence

Galapagos revision **90be931773fcf499049247a8aaa1aecbe003654c** contains every captured served model byte-for-byte: all 550 live Git blob SHA-1 values match that revision's tree. Every row records SHA-256, bytes, Git blob SHA-1, and its immutable raw Galapagos URL. The pinned `ModelsLibrary.scala` explains production selection: recursively include `.nlogox` files under precisely the five categories above; development also includes demos/benchmarks. This corroborates the observed list; it does not replace it as the catalog authority.

The separately pinned NetLogo/models revision **bf0626a89358b48494066862843a91f36f2556cf** contains 633 `.nlogox` files in its full recursive tree. None of the 550 same-path desktop blobs matches the captured served bytes. Thus desktop repository membership/version is not asserted as Web source parity. The live files examined report NetLogo 7.0.4; each row carries its own parsed version. Upstream commit pointers were resolved with `gh api repos/NetLogo/{Galapagos,models}/commits/main`; their immutable trees are pinned, not a promise that these commits identify the deployed application's entire build.

## Row contents and status ownership

[delivery.csv](../../experiments/catalog/delivery.csv) contains one row per served entry with its canonical path, collision-free path-derived slug, source hash and separate implementation, source-audit, headless-verification, browser-verification and independent-approval states. It is a generated view of `inventory.json`; update delivery fields there and run `report` to refresh it. Canonical identity is the listed path, not the basename. Four exact source paths map to existing experiment folders. Segregation is explicitly marked as the first planned new slice; that mark claims no implementation evidence.

Every captured row retains the complete widget XML, procedure names, code/Info hashes, extension/include declarations, lexical mechanism signals, copyright/license notice and available citation/credits notices. Copyright notices for public-domain Code Examples are extracted from code comments when no Info copyright heading exists. All 550 rows have an extracted notice, but **license review remains pending**: extraction is not a legal classification or clearance. Full original source is accessible by its proven immutable URL; notices must accompany each actual port.

Source files are cached under ignored `.cache/netlogo-catalog/<sha256>.nlogox` rather than adding 32 MB of duplicate model/shapes text to Git. The tracked artifacts are approximately 5 MB. No source file, dependency, credential or package is silently replaced by the metadata. Fetch and verify immutable originals when auditing a row. A subsequent live capture is a new catalog revision and requires reconciliation; do not overwrite accepted delivery evidence casually.

## Capability signals and current library boundaries

[capability-matrix.json](../../experiments/catalog/capability-matrix.json) maps each signal to every matching canonical row. Signals are obtained by lexical matching after stripping NetLogo comments and string literals; extension/include extraction retains declaration contents. They are triage candidates, not resolved contracts or a NetLogo semantic parser. Widget XML, equations, nested model dependencies and called primitives require manual review per slice. Absence of a signal is not proof of absence of a dependency.

| Static signal | Matching rows | Current boundary to audit |
| --- | ---: | --- |
| Agents | 477 | Existing Agent/World subset; broader activation/lifecycle semantics pending |
| Randomness | 475 | Existing Mulberry subset; NetLogo MT/distributions pending |
| Movement | 421 | Existing bounded Space/movement; paths and broader geometry pending |
| Grid | 420 | Existing square Grid/Fields subset; broader topology pending |
| Fields/diffusion declarations | 154 | Existing bounded diffusion; model-specific units/rules require audit |
| Graph | 81 | Existing Graph kernel; algorithms/extensions require slices |
| Plot commands | 92 | Shared charts exist; source reporters/history semantics require audit |
| User/mouse interaction | 159 | Explicit host adapter/UI actions require audit |
| Files/import/export | 26 | Asset closure and browser I/O require audit |
| Dynamic execution | 75 | Resolve model rules explicitly; no transpiled engine substitute |
| HubNet | 14 | Host/network contract unresolved; retain rows |
| System dynamics XML | 6 | Equations/integration/order require a dedicated contract |
| Included source declarations | 4 | Fetch/audit included-source closure before porting |

Extension declarations include `sr`, `sound`, `palette`, `ls`, `time`, `csv`, `vid`, `bitmap`, `gis`, `table`, `rnd`, `nw`, `py`, `gogo`, `matrix`, `profiler`, `arduino`, `fetch`, `5d`, `view2`, `import-a`, and `resource`. Every matching row remains present, including extension, asset and hardware/host cases. Exact declaration-to-row sets are in the matrix. Their names do not establish compatibility or a delivered City Library equivalent. The initial matrix does not claim closed dependency graphs or complete mechanisms; unresolved contracts remain source-audit work.

## Reproduction and executed checks

Run from the repository root with Bun 1.4.2:

```sh
# New live snapshot; replaces inventory and initial delivery states. Review before using.
bun scripts/netlogo-catalog.ts capture
# Verify pinned mechanism artifacts and every locally cached model hash.
bun scripts/netlogo-catalog.ts verify
# Independently retrieve all originals at immutable matched Galapagos URLs.
bun scripts/netlogo-catalog.ts verify --remote
# Re-extract metadata from captured cache, retaining delivery fields.
bun scripts/netlogo-catalog.ts reextract
# Regenerate matrix and CSV after delivery-state updates.
bun scripts/netlogo-catalog.ts report
```

The capture command discovers the fingerprinted launcher module and its list-fetching direct import, rejects changed/missing mechanisms, validates unique served rows and rejects truncated upstream trees. Fetches use eight workers, finite timeouts and at most three attempts. A failed model retrieval remains a row with its concrete error; verification fails on any uncaptured row. Verify checks retained artifact hashes/byte sizes, row-to-list identity/order, unique slugs and every model's SHA-256/size. Remote verification refuses a model without proven immutable source correspondence rather than silently reading an unpinned live URL.

Executed: full capture retrieved 550/550 models; local verification checked all 9 mechanism/source artifacts and 550/550 model hashes. `bun run typecheck` passed after the coordinator installed the existing lockfile dependencies. The first attempt before installation failed with TS2688 (missing Bun type definitions); no dependency versions were changed. Remote verification result is recorded below after completion. No browser or target model behavior checks were performed by this inventory task.

Remote verification subsequently passed: **9/9 pinned mechanism/source files and 550/550 model hashes verified**, with all model bytes freshly downloaded from their immutable Galapagos revision URLs. No retrieval failures occurred in capture or immutable verification. This confirms source identity, not that all models compile or run successfully.
