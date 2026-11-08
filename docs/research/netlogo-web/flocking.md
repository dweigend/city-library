# Flocking

Status: complete. Scientific research only.

How can coordinated motion arise without a leader? NetLogo Flocking applies separation, alignment, and cohesion using locally visible neighbors. These rules correspond to the distributed flocking tradition introduced by Reynolds [1], while minimal alignment models [2] and empirical work on neighbor selection [3] clarify which assumptions matter. The simulation illustrates moving groups that form and reorganize through repeated local updates. Its bounded turns, chosen vision distance, and stylized motion do not explicitly model flight energetics, sensory uncertainty, or aerodynamic interactions. A coherent flock demonstrates an emergent property of these rules. It does not establish that a particular bird species uses the same metric neighborhood or that every parameter setting maintains cohesion.

## Scientific publications

1. Craig W. Reynolds (1987). **Flocks, herds and schools: A distributed behavioral model**. Proceedings of the 14th annual conference on Computer graphics and interactive techniques. [10.1145/37401.37406](https://doi.org/10.1145/37401.37406).

Introduces the separation, alignment and cohesion mechanism underlying the model lineage.

Verification: 2026-11-05; doi-registrant-metadata. Crossref publisher-deposited metadata accessible; publisher full-text access/paywall not tested. Consulted: https://api.crossref.org/works?query.title=Flocks+herds+and+schools+a+distributed+behavioral+model+Reynolds+1987&rows=3. Exact author list and bibliographic fields transcribed from registrant metadata; initials are preserved where the deposited credited name uses initials. Metadata verification does not imply full-text reading.

2. Tamás Vicsek; András Czirók; Eshel Ben-Jacob; Inon Cohen; Ofer Shochet (1995). **Novel Type of Phase Transition in a System of Self-Driven Particles**. Physical Review Letters. [10.1103/physrevlett.75.1226](https://doi.org/10.1103/physrevlett.75.1226).

Offers a minimal local-alignment model for comparison with multi-rule flocking.

Verification: 2026-11-05; doi-registrant-metadata. Crossref publisher-deposited metadata accessible; publisher full-text access/paywall not tested. Consulted: https://api.crossref.org/works?query.title=Novel+type+of+phase+transition+in+a+system+of+self-driven+particles+Vicsek+1995&rows=3. Exact author list and bibliographic fields transcribed from registrant metadata; initials are preserved where the deposited credited name uses initials. Metadata verification does not imply full-text reading.

3. M. Ballerini; N. Cabibbo; R. Candelier; A. Cavagna; E. Cisbani; I. Giardina; V. Lecomte; A. Orlandi; G. Parisi; A. Procaccini; M. Viale; V. Zdravkovic (2008). **Interaction ruling animal collective behavior depends on topological rather than metric distance: Evidence from a field study**. Proceedings of the National Academy of Sciences. [10.1073/pnas.0711437105](https://doi.org/10.1073/pnas.0711437105).

Empirical flock research tests assumptions about which neighbors determine collective motion.

Verification: 2026-11-05; primary-registrant-metadata-and-institutional-abstract. Crossref metadata and Europe PMC/PubMed abstract accessible; publisher full text/paywall not inferred from repository access. Consulted: https://api.crossref.org/works?query.title=Interaction+ruling+animal+collective+behavior+depends+on+topological+rather+than+metric+distance+evidence+from+a+field+study+2008&rows=3. Exact author list and bibliographic fields transcribed from registrant metadata; initials are preserved where the deposited credited name uses initials. Metadata verification does not imply full-text reading.

## Model provenance

* Wilensky, U. (1998).  NetLogo Flocking model.  http://ccl.northwestern.edu/netlogo/models/Flocking.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Best available served NetLogo Web artifact retrieved on 2026-11-05; SHA-256 0ce9a6b0ee385898dfcacc7ed06699286cd51e5302a80c90b32687e13cefa143

Consulted: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Biology/Flocking.nlogox

Evidence: [flocking Info](evidence/biology/flocking-info.txt). Research does not establish reimplementation acceptance.
