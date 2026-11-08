# Scientific dossier integration

Integration check: 2026-11-05. The user-authorized research coordinator delivered the unchanged selected 200 as 200 JSON/Markdown dossier pairs, with exactly three scientific publications per model, retained primary verification evidence and original model XML. The research writing reservation is released. No new literature research or additional peer-review task was commissioned by this integration check.

## Executed integrity checks

Read the global data contract, report, validator and all four research-batch handoff reports before execution. `python docs/research/netlogo-web/validate.py` passed: total200, complete200, open0, validationErrors[]. The validator checks identities, word bounds, unique citations, required metadata/access/evidence fields, DOI presence in retained evidence, source XML/hashes and Markdown correspondence; it is explicitly offline and is not an independent scientific truth test.

An additional coordinator comparison confirmed that the research selection object equals the exact root-supplied original selection and that all 200 archived XML SHA-256 values match the independently captured served catalog. The source archives therefore do not merely validate their own declared hashes. No secret-token pattern or dependency/build/cache output was found in the delivered tree. Original NetLogo source notices and publication-access tiers remain intact.

## Content inspection and correction

The coordinator inspected complete model framings and their three model-specific publication/relevance assignments for the first model in each of the 20 thematic batches, covering all four research cohorts. Additionally inspected the active/upcoming Segregation, Fire, Life, Percolation, Giant Component, Virus on a Network, Directed Diffusion and GasLab Isothermal Piston dossiers against available concrete source contracts. This is a meaningful breadth and source-fidelity inspection, not a claim that the coordinator read all416 publications or independently repeated the workers' online checks. The supplied primary evidence remains auditable for all600 assignments.

One concrete mismatch was corrected before integration: Directed Diffusion starts all node values at1, rather than with an initially uneven quantity. Its JSON and Markdown framing now describe concentration from an initially uniform conserved quantity. Publication membership/relevance and evidence tiers are unchanged. The global validator passed again after the correction.

Retain these source-sensitive cautions for later runtime audits: the isothermal piston has no heat bath and omits compression work during paused repositioning; fixed-density Fire is not a growth/lightning self-organized forest-fire model; Percolation's directed stochastic front differs from Fire's undirected connectivity; SmoothLife retains discrete time and finite-grid approximations; raster Voronoi is not exact polygon construction; generalized game complexity results do not establish the difficulty of a particular displayed instance.

## Accepted scope and limits

All200 satisfy the requested research deliverable: English103–139-word framing, exactly three distinct publications, metadata/relevance, recorded online primary identity checks, explicit abstract/metadata/full-text access limits and source provenance. The archive has600 model-publication assignments and416 distinct DOI/stable-URL identities. `research-verified` records this integration acceptance with its stated evidence basis. It does not advance source-procedure audit, implementation, headless/browser/baseline or independent implementation-review stages. No empirical validation follows from reproducing NetLogo or from metadata verification.

See [research index](../research/netlogo-web/INDEX.md), [global report](../research/netlogo-web/REPORT.md), [machine-readable research status](../research/netlogo-web/status.json), and [binding model acceptance](netlogo-model-acceptance.md). Remaining runtime/source-review/interaction work stays in the selected-model progress ledger.
