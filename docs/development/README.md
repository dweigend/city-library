# Development documentation

Keep public usage, accepted contracts, executable-example manifests, delivery coverage, source/license provenance and concise acceptance/review summaries in Git. Retain open limitations and distinguish independent approval from author remediation.

Detailed agent handoffs, command transcripts, browser logs and screenshots are local working artifacts. Store new artifacts under `.local/development-archive/` (ignored by Git), outside this documentation tree. Portable historical summaries, source records and review evidence live under [evidence](../../models/catalog/README.md). Its location map resolves relocated records and pins removed historical detail to Git revisions. This local archive is not available in a fresh clone and is not a backup.

The pinned reference sources, notices and reference-comparison records under `models/catalog/reference-sources/` remain versioned provenance. Target UI screenshots are disposable verification artifacts.

Do not replace versioned contracts or provenance with links into a local archive. Record relevant checks, dates, scope, findings and unresolved limits in a short portable summary. New check results must come from executed checks; documentation cleanup does not revalidate historical runtime behavior.

## Check the repository

The root `tsconfig.json` covers supported TypeScript and Svelte source, examples and tests. Run `bun run typecheck` for the combined check. Two frozen targets remain outside this green gate: the generative-quarter script needs corridor, subtraction and subdivision APIs, and Giant Component needs its model implementation. `bun run typecheck:city:targets` and `bun run typecheck:giant-component:targets` expose those missing contracts; `bun run typecheck:targets` requires both to pass. Keep their asserted scripts unchanged while implementing the missing capabilities.

`bun run build` regenerates the headless package and declarations. `bun run consumer` validates the packed package with Bun, Node ESM and an ambient-free TypeScript consumer. `bun run check` runs the regular type, test, example, build and consumer gates.
