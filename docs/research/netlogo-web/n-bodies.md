# N-Bodies

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo N-Bodies investigates how reciprocal inverse-square forces produce collective gravitational motion. Each particle contributes a gravitational pull on every other particle; initialization can impose symmetric positions and velocities, and the display can follow the center of mass. Provides the classical gravitational and mechanical foundation; the DOI identifies a modern translation [1]. Introduces an efficient force approximation as a comparison with direct all-pairs calculation [2]. Shows why integration structure matters for long-term gravitational dynamics [3]. Point masses and finite numerical steps omit relativity and physical collision structure; neither Barnes-Hut approximation nor a symplectic scheme is implied merely by citing those methods. The simulation illustrates the consequences of mutual interaction and sensitivity to initial configurations. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. Isaac Newton (2016). **The Principia: The Authoritative Translation**. University of California Press. DOI: [10.1525/9780520964785](https://doi.org/10.1525/9780520964785).

Provides the classical gravitational and mechanical foundation; the DOI identifies a modern translation; relevant here to the consequences of mutual interaction and sensitivity to initial configurations.

Verification (2026-11-05): [metadata](https://api.crossref.org/works?query=The%20Principia%20Mathematical%20Principles%20of%20Natural%20Philosophy%20Newton&rows=3). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

2. Josh Barnes; Piet Hut (1986). **A hierarchical O(N log N) force-calculation algorithm**. Nature, 324; 6096; 446-449. DOI: [10.1038/324446a0](https://doi.org/10.1038/324446a0).

Introduces an efficient force approximation as a comparison with direct all-pairs calculation; relevant here to the consequences of mutual interaction and sensitivity to initial configurations.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1038/324446a0). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

3. Jack Wisdom; Matthew Holman (1991). **Symplectic maps for the n-body problem**. The Astronomical Journal, 102; 1528. DOI: [10.1086/115978](https://doi.org/10.1086/115978).

Shows why integration structure matters for long-term gravitational dynamics; relevant here to the consequences of mutual interaction and sensitivity to initial configurations.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1086%2F115978). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Mechanics/Unverified/N-Bodies.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 f1c88ba2f39507b7f9ce625ba72f99276ea06d3beffff5d957bb694d7d86fbde.

* Wilensky, U. (1998).  NetLogo N-Bodies model.  http://ccl.northwestern.edu/netlogo/models/N-Bodies.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
