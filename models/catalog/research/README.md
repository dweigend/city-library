# Model sources and scientific context

Each selected model has a short explanation of its scientific question, its assumptions and limits, and three relevant publications. Use the [model index](INDEX.md) to find a model, then follow its source snapshot and publication records.

The collection covers the [selected 200 models](selection.json). A complete literature record establishes source identity and bibliographic checks. It does not establish empirical validity, runtime equivalence or implementation acceptance.

## Read a model record

Each implemented model owns its authoritative `models/<slug>/research.json` dossier. Selected models that have not been implemented retain their `<slug>.json` dossier in this catalog research folder. It contains the model identity, English explanation, source provenance, publications and unresolved gaps. Original NetLogo sources and model-specific bibliographic records live with their model. Bibliographic snapshots shared by multiple dossiers have one owner in `sources/`. The [record path map](../record-paths.json) resolves original paths inside immutable dossiers and records their checksums.

Each publication records its authors, title, year, venue, DOI or stable URL, relevance to the model, and the evidence consulted. Metadata checks establish bibliographic identity; they do not imply full-text access. Author names and initials follow the cited primary record. A missing DOI means that none is confirmed in that record.

Source provenance includes the consulted URL, retrieval date, revision and SHA-256. These identify the source used for comparison, rather than a claim that the upstream model cannot change.

## Maintain the collection

Run this offline integrity check from the repository root:

```sh
python models/catalog/research/validate.py
```

It validates the selection, dossier structure, citations, retained evidence, source XML and hashes, then regenerates the [index](INDEX.md) and [machine-readable status](status.json). A complete record needs three distinct model-relevant publications, retained primary metadata and no unresolved gaps. Unverified entries remain incomplete.

The validator checks local records. Updating scientific claims or bibliography requires checking the relevant sources; a successful local run does not replace that work. Implementation acceptance follows the separate [model acceptance rules](../../../docs/development/netlogo-model-acceptance.md).
