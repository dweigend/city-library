# Biology research batch: selected models 51–100

Completed on 2026-11-05: all 50 assigned B06–B10 dossiers, each with an English mini-text (105–116 words), exactly three distinct scientific publications, source-specific relevance, and dated primary bibliographic evidence. There are 150 model–publication references to 140 unique works; 81 works have accessible abstract evidence. These counts concern scientific literature research, not runtime acceptance or independent implementation approval.

The authoritative files are the 50 `<slug>.json` files in the research root and their Markdown companions. `report.json` lists all assigned models; `validation.json` records the executed batch validator. Helpers are confined to this batch directory. Evidence is retained under `../../evidence/biology/` (relative to this README).

## Evidence and limits

All 50 original served NetLogo Web `.nlogox` artifacts were retrieved successfully. Each dossier records its exact selected catalog path, served URL, retrieval date, SHA-256 and extracted Info citation. Info mechanism, attribution and reference sections informed the research. The model Procedures were not independently audited in this literature task. Behavioral baseline, source provenance, City Library reimplementation, browser verification and independent review remain distinct.

Crossref registrant metadata supplies verified DOI, title, complete credited author list, venue and year; initials are preserved when that is the deposited form. Relevant accessible Europe PMC/PubMed abstracts were additionally inspected and are identified separately. Metadata-only access never implies that a paywalled full paper was read. Publisher-checked exceptions and edition dates are noted per source. The Hinton–Nowlan original paper was additionally inspected as a repository scan (first two printed pages); this is separate from its later reprint cited by NetLogo.

Specific corrections during verification:

- Resnick: distinguish the original 1994 hardcover from the 1997 paperback; the publisher page was accessible through `web.open` despite a direct-request 403.
- Gazzola et al.: the Crossref chapter has no date; Springer explicitly supplies 2007 and an accessible abstract, while full chapter access is subscription restricted.
- Nilsson–Pelger: Crossref omits authors; the institutional bibliographic record supplies both credited authors.
- Bonner: the extra author deposited in Crossref was rejected after comparison with the PubMed record.
- Anderson et al.: a duplicated May author in Crossref was removed after comparison with the five-author PubMed record.
- Bates: use the original 1862 journal paper, not the differently dated BHL separatum or a later reprint.
- Charnov and Seeley: DOI editions have dates different from the original monographs named in model Info; both are explicitly distinguished.
- Habitat Preference Behavior: the concrete model is a pillbug moisture-chamber experiment with condition-dependent random movement. Its bibliography therefore uses humidity-response research and terrestrial-isopod biology, rather than generic ideal-free-distribution theory.

No Git staging, commit, push, GitHub mutation, UI change, runtime edit, or global research-index write was performed by this batch.

## Executed validation

`python docs/research/netlogo-web/batches/biology/validate.py` passed: assigned identities and pairs, 50 complete statuses, 100–160-word constraint, exactly three unique scientific references per model, mandatory metadata and verification fields, evidence-file existence, DOI syntax, HTTPS publication links, and served-source hashes. This structural check does not independently establish scientific truth. Scientific relevance and the limits stated above remain human-readable author assessments, not a second independent review.
