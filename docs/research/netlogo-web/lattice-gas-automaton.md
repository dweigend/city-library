# Lattice Gas Automaton

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo Lattice Gas Automaton investigates how reversible local collision rules produce propagating density patterns. Binary occupied cells undergo alternating even and odd two-by-two block updates; reversing the order retraces the original evolution on an even-sized periodic grid. Develops transport properties of the classical lattice-gas family cited in the model Info [1]. Introduces improved lattice symmetry for the Navier-Stokes setting, a key contrast with square-grid rules [2]. Provides the statistical-mechanical interpretation of cellular automaton dynamics [3]. The NetLogo source calls this HPP-like construction limited; square-grid symmetry and discrete velocities prevent assuming general isotropic hydrodynamic validity from circular-looking waves. The simulation illustrates reversibility, conserved local motion and the importance of lattice geometry. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. J. Hardy; O. de Pazzis; Y. Pomeau (1976). **Molecular dynamics of a classical lattice gas: Transport properties and time correlation functions**. Physical Review A, 13; 5; 1949-1961. DOI: [10.1103/physreva.13.1949](https://doi.org/10.1103/physreva.13.1949).

Develops transport properties of the classical lattice-gas family cited in the model Info; relevant here to reversibility, conserved local motion and the importance of lattice geometry.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1103/PhysRevA.13.1949). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

2. U. Frisch; B. Hasslacher; Y. Pomeau (1986). **Lattice-Gas Automata for the Navier-Stokes Equation**. Physical Review Letters, 56; 14; 1505-1508. DOI: [10.1103/physrevlett.56.1505](https://doi.org/10.1103/physrevlett.56.1505).

Introduces improved lattice symmetry for the Navier-Stokes setting, a key contrast with square-grid rules; relevant here to reversibility, conserved local motion and the importance of lattice geometry.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1103%2FPhysRevLett.56.1505). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

3. Stephen Wolfram (1983). **Statistical mechanics of cellular automata**. Reviews of Modern Physics, 55; 3; 601-644. DOI: [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

Provides the statistical-mechanical interpretation of cellular automaton dynamics; relevant here to reversibility, conserved local motion and the importance of lattice geometry.

Verification (2026-11-05): [metadata](https://doi.org/10.1103/RevModPhys.55.601). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Waves/Lattice%20Gas%20Automaton.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 13f4798c5974e314067841d5af2e59d95243c300d8cddcefe17300e71f1a7b82.

* Wilensky, U. (2002).  NetLogo Lattice Gas Automaton model.  http://ccl.northwestern.edu/netlogo/models/LatticeGasAutomaton.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
