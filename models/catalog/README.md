# Model catalog

The catalog selects and tracks NetLogo source models. Runnable implementations live directly under `models/<slug>/`, each with its own model, UI, README, source notice and research dossier. A selected model without an implementation keeps its research record here; selection does not create a delivered module.

- `sources.ts` captures source identity and verifies pinned catalog records. Use `bun models/catalog/sources.ts verify` from the repository root with the captured `.cache/netlogo-catalog` source cache present; `verify --remote` instead checks the recorded immutable source URLs over the network. Neither command advances delivery stages.
- `progress.ts` validates selection membership and evidence-backed stages. Run `bun models/catalog/progress.ts verify` or `bun models/catalog/progress.ts report`.
- `selection/` and `pinned/` preserve binding selection and source snapshots. Recorded checksums identify the consulted bytes.
- [Research](research/README.md) owns the selected-model bibliography, shared publication snapshots and offline validator. Implemented models own their individual `research.json` files.
- [Acceptance records](acceptance/README.md) retain checks that cover several catalog models once. Model-specific probes and screenshots live with the owning model.
- `record-paths.json` resolves historical paths inside immutable records to their current owner, records original SHA-256 values and supplies a pinned archive base for removed artifacts. It preserves provenance without changing acceptance stages.

A source audit, literature record, passing implementation check and independent review establish different things. The [model acceptance contract](../../docs/development/netlogo-model-acceptance.md) defines the required gates; `progress.json` records which evidence is currently claimed for each model.
