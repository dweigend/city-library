# Fire

Research status: complete. Literature research only; implementation acceptance is separate.

How does habitat connectivity determine whether a spreading disturbance crosses a landscape? NetLogo Fire initializes randomly occupied tree patches and ignites the left boundary. Burning trees ignite their four orthogonal neighbors; empty patches interrupt transmission. Broadbent and Hammersley provide the random-medium framework for interpreting connected paths [1], while Grassberger relates epidemic propagation to dynamical percolation [2]. The simulation illustrates a sharp connectivity-dependent change in crossing probability, with finite landscapes and random realizations producing variable outcomes. It assumes no wind, spotting, fuel variation or regrowth. Drossel and Schwabl supply a useful contrast: their forest-fire model adds growth and lightning and investigates self-organized criticality [3]. Those mechanisms are absent from this baseline, so its density-controlled transition does not by itself demonstrate self-organization or validate predictions for actual wildfires.

## Scientific publications

1. S. R. Broadbent; J. M. Hammersley (1957). **Percolation processes**. Mathematical Proceedings of the Cambridge Philosophical Society, 53; 3; 629-641. DOI: [10.1017/s0305004100032680](https://doi.org/10.1017/s0305004100032680).

Foundational random-medium connectivity theory supports the occupied-tree crossing question; the source is not an empirical wildfire study.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1017%2FS0305004100032680). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: ABSTRACT The paper studies, in a general way, how the random properties of a ‘medium’ influence the percolation of a ‘fluid’ through it. The treatment diifers from conventional diffusion theory, in which it is the random properties of the fluid that matter. Fluid and medium bear general interpretations: for example, solute diffusing through solvent, electrons migrating over an atomic lattice, molecules penetrating a porous solid, disease infecting a community, etc.

2. P. Grassberger (1983). **On the critical behavior of the general epidemic process and dynamical percolation**. Mathematical Biosciences, 63; 2; 157-172. DOI: [10.1016/0025-5564(82)90036-0](https://doi.org/10.1016/0025-5564(82)90036-0).

Relates epidemic-like local propagation to percolation, supporting the interpretation of a one-pass burning front.

Verification (2026-11-05): [metadata](https://api.crossref.org/works?query.title=On%20the%20critical%20behavior%20of%20the%20general%20epidemic%20process%20and%20dynamical%20percolation%20Grassberger%201983&rows=1). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

3. B. Drossel; F. Schwabl (1992). **Self-organized critical forest-fire model**. Physical Review Letters, 69; 11; 1629-1632. DOI: [10.1103/physrevlett.69.1629](https://doi.org/10.1103/physrevlett.69.1629).

A critical extension with regrowth and lightning clarifies why fixed-density NetLogo Fire is not the self-organized forest-fire model.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1103/PhysRevLett.69.1629). Open publisher abstract; full article requires authorization. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

Publisher abstract specifies lightning, separated growth/burning scales and the self-organized limit, supporting the contrast with fixed-density Fire.

Additional primary evidence: [https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.69.1629](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.69.1629)

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Earth%20Science/Fire.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 0a2420e463481fb2cd7791aacdc068735db0d900c14d3fece0a93a085246b171.

* Wilensky, U. (1997).  NetLogo Fire model.  http://ccl.northwestern.edu/netlogo/models/Fire.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
