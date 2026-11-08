# GasLab Isothermal Piston

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo GasLab Isothermal Piston investigates how changing container volume affects pressure when particle energy is artificially held constant. Gas particles collide elastically, while the user repositions the piston with the simulation paused; the source ignores work and particle-piston collisions during that repositioning. Provides the molecular collision basis of pressure [1]. Clarifies why piston motion and equilibration require explicit dynamical and thermodynamic assumptions [2]. Provides a physical heat-transfer contrast: this baseline has no heat bath and does not model the heat exchange required for real isothermal compression [3]. The original Info explicitly calls compression physically impossible here: particle energy remains unchanged because compression work is omitted, rather than being removed through an implemented thermostat. The simulation illustrates the pressure-volume relation under a fixed particle-energy convention, contrasted with energy-exchanging adiabatic piston dynamics. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. J. C. Maxwell (1860). **V. Illustrations of the dynamical theory of gases.—Part I. On the motions and collisions of perfectly elastic spheres**. The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science, 19; 124; 19-32. DOI: [10.1080/14786446008642818](https://doi.org/10.1080/14786446008642818).

Provides the molecular collision basis of pressure; relevant here to the pressure-volume relation under a fixed particle-energy convention, contrasted with energy-exchanging adiabatic piston dynamics.

Verification (2026-11-05): [metadata](https://doi.org/10.1080/14786446008642818). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

2. Christian Gruber (1999). **Thermodynamics of systems with internal adiabatic constraints: time evolution of the adiabatic piston**. European Journal of Physics, 20; 4; 259-266. DOI: [10.1088/0143-0807/20/4/303](https://doi.org/10.1088/0143-0807/20/4/303).

Clarifies why piston motion and equilibration require explicit dynamical and thermodynamic assumptions; relevant here to the pressure-volume relation under a fixed particle-energy convention, contrasted with energy-exchanging adiabatic piston dynamics.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1088/0143-0807/20/4/303). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

3. Jean Baptiste Joseph Fourier (2009). **The Analytical Theory of Heat**. Cambridge University Press. DOI: [10.1017/cbo9780511693205](https://doi.org/10.1017/cbo9780511693205).

Provides a physical heat-transfer contrast: this baseline has no heat bath and does not model the heat exchange required for real isothermal compression; relevant here to the pressure-volume relation under a fixed particle-energy convention, contrasted with energy-exchanging adiabatic piston dynamics.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1017/CBO9780511693205). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: First published in 1878, The Analytical Theory of Heat is Alexander Freeman's English translation of French mathematician Joseph Fourier's Théorie Analytique de la Chaleur, originally published in French in 1822. In this groundbreaking study, arguing that previous theories of mechanics advanced by such scientific greats as Archimedes, Galileo, Newton and their successors did not explain the laws of heat, Fourier set out to study the mathematical laws governing heat diffusion and proposed that an infinite mathematical series may be used to analyse the conduction of heat in solids. Known in scientific circles as the 'Fourier Series', this work paved the way for modern mathematical physics. This translation, now reissued, contains footnotes that cross-reference other writings by Fourier and his contemporaries, along with 20 figures and an extensive bibliography. This book will be especially useful for mathematicians who are interested in trigonometric series and their applications.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/GasLab/GasLab%20Isothermal%20Piston.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 1a7c940848a508b2146803f542e4b5aa045674a0697ed8d7e5e3bdb99c2c003f.

* Wilensky, U. (1997).  NetLogo GasLab Isothermal Piston model.  http://ccl.northwestern.edu/netlogo/models/GasLabIsothermalPiston.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
