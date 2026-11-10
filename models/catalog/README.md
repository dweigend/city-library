# Model catalog

This folder keeps the records behind the adapted models: which 200 NetLogo models were selected, the pinned sources, the research dossiers and the evidence for each acceptance stage. To browse or run models, start at [explore the models](../README.md).

Runnable implementations live directly under `models/<slug>/`, each with its own model, UI, README, source notice and research dossier. A selected model without an implementation keeps its research record here; selection does not create a delivered module.

## Tools and records

- `sources.ts` captures source identity and verifies pinned catalog records. Use `bun models/catalog/sources.ts verify` from the repository root with the captured `.cache/netlogo-catalog` source cache present; `verify --remote` instead checks the recorded immutable source URLs over the network. Neither command advances delivery stages.
- `progress.ts` validates selection membership and evidence-backed stages. Run `bun models/catalog/progress.ts verify` or `bun models/catalog/progress.ts report`.
- `selection/` and `pinned/` preserve binding selection and source snapshots. Recorded checksums identify the consulted bytes.
- [Research](research/README.md) owns the selected-model bibliography, shared publication snapshots and offline validator. Implemented models own their individual `research.json` files.
- [Acceptance records](acceptance/README.md) retain checks that cover several catalog models once. Model-specific probes and screenshots live with the owning model.
- `record-paths.json` resolves immutable research/source references and frozen selection-manifest paths, preserving original SHA-256 values. Acceptance reports link directly to their current owner or a pinned Git revision. It preserves provenance without changing acceptance stages.

A source audit, literature record, passing implementation check and independent review establish different things. The [model acceptance contract](../../docs/development/model-acceptance.md) defines the required gates; `progress.json` records which evidence is currently claimed for each model.

## Model-group contracts

These contracts define the expected behavior of adapted models, grouped by topic:

- Ecology, evolution and disease: [evolution](../../docs/development/selected-evolution-contract.md), [disease and genetics](../../docs/development/selected-disease-gene-contract.md)
- Society and economics: [social](../../docs/development/selected-social-contract.md), [economics](../../docs/development/selected-economics-contract.md), [Segregation](../segregation/contract.md)
- Cities: [Awareness, Pollution and Recycling](../../docs/development/selected-urban-contracts.md), [Positive Feedback, Path Dependence and Cells](../../docs/development/selected-urban-feedback-contracts.md), [Structure, Sprawl and Economic Disparity](../../docs/development/urban-structure-and-economy-contracts.md), [Tijuana Bordertowns](../urban-suite-tijuana-bordertowns/contract.md)
- Computing and networks: [computing](../../docs/development/selected-computing-contract.md), [networks](../../docs/development/selected-network-contracts.md), [Giant Component target](contracts/giant-component.md)
- Mathematics and materials: [Birthday, Galton, urn and probability](../../docs/development/probability-trials-and-distributions-contract.md), [sampling, combinations and Mandelbrot](../../docs/development/sampling-combinations-and-mandelbrot-contract.md), [materials](../../docs/development/selected-materials-contract.md)
- Grid models: [Fire, Life and Percolation](../../docs/development/grid-models-contract.md)
