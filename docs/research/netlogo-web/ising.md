# Ising

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo Ising investigates how thermal noise competes with local spin alignment. Binary spins occupy a square lattice and selected spins flip according to their four-neighbor energy difference and a Metropolis acceptance probability. Introduces the spin-interaction problem underlying this model family [1]. Supplies the energy-dependent sampling mechanism used explicitly by the NetLogo Procedures [2]. Provides the two-dimensional equilibrium benchmark rather than a fit to this finite simulation [3]. The simulation assumes nearest-neighbor interactions, idealized spins and finite lattice size; update counts are computational time, not calibrated magnetic relaxation time. The simulation illustrates ordering, fluctuations and temperature-dependent magnetization. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. Ernst Ising (1925). **Beitrag zur Theorie des Ferromagnetismus**. Zeitschrift für Physik, 31; 1; 253-258. DOI: [10.1007/bf02980577](https://doi.org/10.1007/bf02980577).

Introduces the spin-interaction problem underlying this model family; relevant here to ordering, fluctuations and temperature-dependent magnetization.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1007/BF02980577). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

2. Nicholas Metropolis; Arianna W. Rosenbluth; Marshall N. Rosenbluth; Augusta H. Teller; Edward Teller (1953). **Equation of State Calculations by Fast Computing Machines**. The Journal of Chemical Physics, 21; 6; 1087-1092. DOI: [10.1063/1.1699114](https://doi.org/10.1063/1.1699114).

Supplies the energy-dependent sampling mechanism used explicitly by the NetLogo Procedures; relevant here to ordering, fluctuations and temperature-dependent magnetization.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1063/1.1699114). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: A general method, suitable for fast computing machines, for investigating such properties as equations of state for substances consisting of interacting individual molecules is described. The method consists of a modified Monte Carlo integration over configuration space. Results for the two-dimensional rigid-sphere system have been obtained on the Los Alamos MANIAC and are presented here. These results are compared to the free volume equation of state and to a four-term virial coefficient expansion.

3. Lars Onsager (1944). **Crystal Statistics. I. A Two-Dimensional Model with an Order-Disorder Transition**. Physical Review, 65; 3-4; 117-149. DOI: [10.1103/physrev.65.117](https://doi.org/10.1103/physrev.65.117).

Provides the two-dimensional equilibrium benchmark rather than a fit to this finite simulation; relevant here to ordering, fluctuations and temperature-dependent magnetization.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1103/PhysRev.65.117). Open publisher abstract; full article access not established. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

Abstract specifies a two-dimensional zero-field Ising solution and finite-strip limitations, supporting the benchmark caveat.

Additional primary evidence: [https://journals.aps.org/pr/abstract/10.1103/PhysRev.65.117](https://journals.aps.org/pr/abstract/10.1103/PhysRev.65.117)

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Ising.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 41727ee27957e2c797362ed3387742bc1c2038eabf5e2fa54df8e1152185b8d2.

* Wilensky, U. (2003).  NetLogo Ising model.  http://ccl.northwestern.edu/netlogo/models/Ising.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
