# Scientific research completion report

Checked: 2026-11-05T23:07:58.511257+00:00. Scope is exactly the unchanged, user-selected 200 NetLogo Web models.

- Research-complete: **200**. Research-incomplete/planned/in-progress: **0**.
- Dossiers: **200 JSON + 200 Markdown**, one pair per selected slug and catalog path.
- Publications: **600 model-specific assignments**, exactly three distinct verified bibliographic identities per model; **416 different DOI/stable-URL identities** across the collection.
- English mini-texts: **103–139 words**, within the requested 100–160 range.
- Original sources: **200 retained served NetLogo XML artifacts**, with Info, Procedures, retrieval URL/date and checked SHA-256. The four earlier reference models match the pre-existing served hashes exactly.
- Global validator: **0 errors**.

## Checks actually executed

`python docs/research/netlogo-web/validate.py` checks exact selected slug/path/batch/launch identities; one JSON/Markdown pair per selected model; complete-state word limits; exactly three unique DOI/bibliographic identities and verified flags; required citation and access fields; retained evidence existence; DOI presence in referenced primary evidence; Markdown mini-text agreement; original-source URL identity, XML Info/Procedures and SHA-256 integrity; and absence of unresolved gaps in complete dossiers. It regenerates INDEX.md and status.json. A separate comparison confirmed the research selection equals the original authorized selection object exactly; the permanent catalog selection has the same ordered slug/path identities.

Bibliographic and mechanism checks were performed by four disjoint research workers and reconciled by the coordinator. The validator is an offline integrity check: it cannot establish scientific truth, relevance or an empirical validation claim by itself. Online primary evidence was actually consulted and is retained per citation. Bibliographic initials remain as credited rather than invented expansions.

## Evidence interpretation

Metadata-only citations are labeled as such. Publisher/registry abstracts, accessible institutional full-text sections, inaccessible/paywalled publications and unsuccessful access attempts are distinguished. A complete dossier means all requested literature/provenance components are present, with their evidence tier explicit; it does not mean every source was read in full. No DOI was filled from memory without title verification. DOI searches that did not confirm an identifier remain documented as negative checks and stable primary/institutional links are supplied. Search-candidate records are not the accepted bibliography.

Book reissues and historical works are identified in reading notes. Notable corrections include the isothermal piston's artificial fixed-energy mechanism, Geiger's misspelled registrant name, Szilard's corrupt title character, incorrect publisher-deposited contributor lists and missing conference/publication years. ETH's Doppler catalog date (1842) and the scanned offprint imprint (1843) are both recorded; the cited digitized edition uses 1843.

This work makes **no claim of runtime implementation, browser acceptance, source-to-target equivalence, empirical validation, or independent implementation approval**. The existing implementation ledger was read but not changed. All writes are confined to docs/research/netlogo-web/ in the authorized worktree. No commits, pushes, GitHub mutations, UI changes or runtime changes were performed. Concurrent work outside this directory was preserved.

## Integration points

- [Complete index](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/research/netlogo-web/INDEX.md)
- [Machine-readable ledger](../status.json)
- [Data contract and command](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/research/netlogo-web/README.md)
- [Social/urban report](batches/social-urban/REPORT.md)
- [Biology report](batches/biology/README.md)
- [Physics/chemistry report](batches/physics/REPORT.md)
- [Computing/mathematics report](batches/computing/REPORT.md)
- [Sibling literature consistency spot check](batches/social-urban/physics-qa.md) — findings and responses, not independent implementation approval.

The implementation coordinator owns catalog-ledger updates, runtime interpretation, commits and GitHub integration.
