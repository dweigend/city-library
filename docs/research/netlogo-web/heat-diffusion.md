# Heat Diffusion

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo Heat Diffusion investigates how fixed edge temperatures shape transient and steady temperature fields. A thin square plate exchanges heat between neighboring locations while its perimeter temperatures are prescribed; thermal diffusivity controls the rate of spreading. Establishes heat conduction and its mathematical description; the cited DOI identifies the Cambridge reissue [1]. Offers the closely related gradient-transport equation, clarifying the shared diffusion structure [2]. Provides the numerical-stability context needed when a continuum transport equation is discretized [3]. The plate is uniform and thermally isolated on its faces; convection, radiation, temperature-dependent material properties and three-dimensional thickness effects are omitted. The simulation illustrates why boundary conditions determine steady states while diffusivity controls relaxation. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. Jean Baptiste Joseph Fourier (2009). **The Analytical Theory of Heat**. Cambridge University Press. DOI: [10.1017/cbo9780511693205](https://doi.org/10.1017/cbo9780511693205).

Establishes heat conduction and its mathematical description; the cited DOI identifies the Cambridge reissue; relevant here to why boundary conditions determine steady states while diffusivity controls relaxation.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1017/CBO9780511693205). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: First published in 1878, The Analytical Theory of Heat is Alexander Freeman's English translation of French mathematician Joseph Fourier's Théorie Analytique de la Chaleur, originally published in French in 1822. In this groundbreaking study, arguing that previous theories of mechanics advanced by such scientific greats as Archimedes, Galileo, Newton and their successors did not explain the laws of heat, Fourier set out to study the mathematical laws governing heat diffusion and proposed that an infinite mathematical series may be used to analyse the conduction of heat in solids. Known in scientific circles as the 'Fourier Series', this work paved the way for modern mathematical physics. This translation, now reissued, contains footnotes that cross-reference other writings by Fourier and his contemporaries, along with 20 figures and an extensive bibliography. This book will be especially useful for mathematicians who are interested in trigonometric series and their applications.

2. Adolph Fick (1855). **V. On liquid diffusion**. The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science, 10; 63; 30-39. DOI: [10.1080/14786445508641925](https://doi.org/10.1080/14786445508641925).

Offers the closely related gradient-transport equation, clarifying the shared diffusion structure; relevant here to why boundary conditions determine steady states while diffusivity controls relaxation.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1080/14786445508641925). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

3. R. Courant; K. Friedrichs; H. Lewy (1967). **On the Partial Difference Equations of Mathematical Physics**. IBM Journal of Research and Development, 11; 2; 215-234. DOI: [10.1147/rd.112.0215](https://doi.org/10.1147/rd.112.0215).

Provides the numerical-stability context needed when a continuum transport equation is discretized; relevant here to why boundary conditions determine steady states while diffusivity controls relaxation.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1147/rd.112.0215). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Materials%20Science/Heat%20Diffusion.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 28a9a04467718a26543bbe459500f57eb65c20c914733f6e19028ca68e97f090.

* Wilensky, U. (1998).  NetLogo Heat Diffusion model.  http://ccl.northwestern.edu/netlogo/models/HeatDiffusion.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
