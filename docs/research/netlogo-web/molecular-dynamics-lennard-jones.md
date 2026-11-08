# Molecular Dynamics Lennard-Jones

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo Molecular Dynamics Lennard-Jones investigates how pair forces generate collective motion in a model fluid. Particles interact through attractive and strongly repulsive Lennard-Jones forces, and their positions and velocities evolve through numerical Newtonian updates. Provides the interaction-potential framework [1]. Demonstrates numerical molecular dynamics for Lennard-Jones fluids [2]. Provides a classic liquid-argon simulation linking microscopic trajectories and collective dynamical observables [3]. The potential is pairwise and schematic, while finite size, cutoffs, integration step and thermal control affect measured behavior; matching images is not a material calibration. The simulation illustrates the distinction between a force-driven trajectory and equilibrium sampling by Monte Carlo. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. J. E. Jones (1924). **On the determination of molecular fields. —II. From the equation of state of a gas**. Proceedings of the Royal Society of London. Series A, Containing Papers of a Mathematical and Physical Character, 106; 738; 463-477. DOI: [10.1098/rspa.1924.0082](https://doi.org/10.1098/rspa.1924.0082).

Provides the interaction-potential framework; relevant here to the distinction between a force-driven trajectory and equilibrium sampling by Monte Carlo.

Verification (2026-11-05): [metadata and abstract](https://doi.org/10.1098/rspa.1924.0082). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: Abstract The investigation of a preceding paper has shown that the temperature variation of viscosity, as determined experimentally, can be satisfactorily explained in many gases on the assumption that the repulsive and attractive parts of the molecular field are each according to an inverse power of the distance. In some cases, in argon, for example, it was further shown that the experimental facts can be explained by more than one molecular model, from which we inferred that viscosity results alone are insufficient to determine precisely the nature of molecular fields. The object of the present paper is to ascertain whether a molecular model of the same type will also explain available experimental data concerning the equation of state of a gas, and if so, whether the results so obtained, when taken in conjunction with those obtained from viscosity, will definitely fix the molecular field. Such an investigation is made possible by the elaborate analysis by Kamerlingh Onnes of the observational material. He has expressed the results in the form of an empirical equation of state of the type pv = A + B/v + C/v2 + D/v4 + E/v6 + F/v8, where the coefficients A ... F, called by him virial coefficients, are determined as functions of the temperature to fit the observations. Now it is possible by various methods to obtain a theoretical expression for B as a function of the temperature and a strict comparison can then be made between theory and experiment. Unfortunately the solution for B, although applicable to any molecular model of spherical symmetry, is purely formal and contains an integral which can be evaluated only in special cases. This has been done up to now for only two simple models, viz., a van der Waals molecule, and a molecule repelling according to an inverse power law (without attraction), but it is shown in this paper that it can also be evaluated in the case of the model, which was successful in explaining viscosity results. As the two other models just mentioned are particular cases of this, the appropriate formulæ for B are easily deduced from the general one given here.

2. Loup Verlet (1967). **Computer "Experiments" on Classical Fluids. I. Thermodynamical Properties of Lennard-Jones Molecules**. Physical Review, 159; 1; 98-103. DOI: [10.1103/physrev.159.98](https://doi.org/10.1103/physrev.159.98).

Demonstrates numerical molecular dynamics for Lennard-Jones fluids; relevant here to the distinction between a force-driven trajectory and equilibrium sampling by Monte Carlo.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1103/PhysRev.159.98). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

3. A. Rahman (1964). **Correlations in the Motion of Atoms in Liquid Argon**. Physical Review, 136; 2A; A405-A411. DOI: [10.1103/physrev.136.a405](https://doi.org/10.1103/physrev.136.a405).

Provides a classic liquid-argon simulation linking microscopic trajectories and collective dynamical observables; relevant here to the distinction between a force-driven trajectory and equilibrium sampling by Monte Carlo.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1103/PhysRev.136.A405). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Materials%20Science/Molecular%20Dynamics%20Lennard-Jones.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 6ecee907fcb2fdce4468df2d06e77cf5328f0c4ef42536202a86e886ee88ca1d.

* Kelter, J. and Wilensky, U. (2022).  NetLogo Molecular Dynamics Lennard-Jones model.  http://ccl.northwestern.edu/netlogo/models/MolecularDynamicsLennard-Jones.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
