# Heatbugs

Status: complete. Scientific research only.

How can individual temperature preferences generate collective spatial patterns? NetLogo Heatbugs places heat-producing agents on a grid with heat diffusion and cooling. Uncomfortable bugs seek warmer or cooler unoccupied neighboring cells, with occasional random movement. The scientific context is an artificial-agent platform demonstration [1,2] and the problem of aligning implementations [3], rather than a species-specific biological theory. The Info explicitly says that rigorous equivalence with Swarm and Repast was not established. Heterogeneous preferences, occupancy constraints, and field dynamics can produce clusters or avoidance. These are outcomes of the specified artificial rules; they do not establish biological thermoregulation, physical calibration of heat units, or verified equivalence among toolkit versions.

## Scientific publications

1. Nelson Minar; Roger Burkhart; Christopher G. Langton; Manor Askenazi (1996). **The Swarm Simulation System: A Toolkit for Building Multi-Agent Simulations**. Santa Fe Institute Working Paper 96-06-042. [Stable primary source](https://www.santafe.edu/research/results/working-papers/the-swarm-simulation-system-a-toolkit-for-building).

Documents the Swarm platform named in the model lineage; supports interpretation as an artificial-agent demonstration.

Verification: 2026-11-05; institutional-abstract-and-metadata. Institutional abstract and metadata accessible; working paper rather than a peer-reviewed journal article. Consulted: https://www.santafe.edu/research/results/working-papers/the-swarm-simulation-system-a-toolkit-for-building. Author ordering follows the original paper title page, not the institutional page’s alphabetical display. No DOI located in the institutional record. Follow-up DOI search on 2026-11-05: official Swarm documentation recommends SFI Working Paper 96-06-042 without a DOI; Crossref produced no matching original-report DOI. Other toolkit publications were rejected. Retain DOI null without asserting universal absence. See evidence/biology/doi-followup-report.json.

2. Michael J. North; Nicholson T. Collier; Jerry R. Vos (2006). **Experiences creating three implementations of the repast agent modeling toolkit**. ACM Transactions on Modeling and Computer Simulation. [10.1145/1122012.1122013](https://doi.org/10.1145/1122012.1122013).

Documents another platform explicitly named by NetLogo Heatbugs and the importance of implementation semantics.

Verification: 2026-11-05; doi-registrant-abstract-and-metadata. Publisher-deposited abstract and metadata accessible; publisher full-text access/paywall not tested. Consulted: https://api.crossref.org/works?query.title=Experiences+creating+three+implementations+of+the+repast+agent+modeling+toolkit+North+Collier+Vos+2006&rows=3. Exact author list and bibliographic fields transcribed from registrant metadata; initials are preserved where the deposited credited name uses initials. Metadata verification does not imply full-text reading.

3. Robert Axtell; Robert Axelrod; Joshua M. Epstein; Michael D. Cohen (1996). **Aligning simulation models: A case study and results**. Computational and Mathematical Organization Theory. [10.1007/bf01299065](https://doi.org/10.1007/bf01299065).

Addresses alignment between independently implemented agent models, directly relevant to the Info caveat about untested cross-toolkit equivalence.

Verification: 2026-11-05; doi-registrant-metadata. Crossref publisher-deposited metadata accessible; publisher full-text access/paywall not tested. Consulted: https://api.crossref.org/works?query.title=Aligning+simulation+models+a+case+study+and+results+Axtell+Axelrod+Epstein+Cohen+1996&rows=3. Exact author list and bibliographic fields transcribed from registrant metadata; initials are preserved where the deposited credited name uses initials. Metadata verification does not imply full-text reading.

## Model provenance

* Wilensky, U. (2004).  NetLogo Heatbugs model.  http://ccl.northwestern.edu/netlogo/models/Heatbugs.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Best available served NetLogo Web artifact retrieved on 2026-11-05; SHA-256 9b439a81d1526f34fe9716a9d2d690d9948ecd119fa6f64502aee3b424c6fa59

Consulted: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Heatbugs.nlogox

Evidence: [heatbugs Info](evidence/biology/heatbugs-info.txt). Research does not establish reimplementation acceptance.
