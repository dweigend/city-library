# Boiling

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo Boiling investigates how diffusion plus a local reset threshold creates bubbling-like patterns. Heat-like values increase and diffuse across a grid; a site exceeding the threshold wraps to zero and cools nearby locations during later updates. Provides the cellular-automaton framework for interpreting local update rules [1]. Supplies a physical boiling heat-transfer reference that the threshold automaton does not implement [2]. Reviews real boiling mechanisms and clarifies the gap between pattern resemblance and thermal prediction [3]. As the original Info explains, this is a simple automaton analogy: no mass-changing phase boundary, pressure, latent-heat balance or resolved bubble fluid mechanics is present. The simulation illustrates spatial feedback between threshold events and local diffusion. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. Stephen Wolfram (1983). **Statistical mechanics of cellular automata**. Reviews of Modern Physics, 55; 3; 601-644. DOI: [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

Provides the cellular-automaton framework for interpreting local update rules; relevant here to spatial feedback between threshold events and local diffusion.

Verification (2026-11-05): [metadata](https://doi.org/10.1103/RevModPhys.55.601). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

2. W. M. Rohsenow (1952). **A Method of Correlating Heat-Transfer Data for Surface Boiling of Liquids**. Journal of Fluids Engineering, 74; 6; 969-975. DOI: [10.1115/1.4015984](https://doi.org/10.1115/1.4015984).

Supplies a physical boiling heat-transfer reference that the threshold automaton does not implement; relevant here to spatial feedback between threshold events and local diffusion.

Verification (2026-11-05): [metadata and abstract](https://doi.org/10.1115/1.4015984). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: Abstract A method based on a logical explanation of the mechanism of heat transfer associated with the boiling process is presented for correlating heat-transfer data for nucleate boiling of liquids for the case of pool boiling. The suggested relation is clTxhfg=Csf(q/Aμlhfg(q/A)σg(ρl-ρv))0.33(clμlkl)1.7 where the various fluid properties are evaluated at the saturation temperature corresponding to the local pressure and Csf is a function of the particular heating surface-fluid combination.

3. V. K. Dhir (1998). **BOILING HEAT TRANSFER**. Annual Review of Fluid Mechanics, 30; 1; 365-401. DOI: [10.1146/annurev.fluid.30.1.365](https://doi.org/10.1146/annurev.fluid.30.1.365).

Reviews real boiling mechanisms and clarifies the gap between pattern resemblance and thermal prediction; relevant here to spatial feedback between threshold events and local diffusion.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1146/annurev.fluid.30.1.365). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: ▪ Abstract This review examines recent advances made in predicting boiling heat fluxes, including some key results from the past. The topics covered are nucleate boiling, maximum heat flux, transition boiling, and film boiling. The review focuses on pool boiling of pure liquids, but flow boiling is also discussed briefly.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Boiling.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 01354515425bab09602dee7f9b8746969777b0ad5c11071fdf09926d72a68e68.

* Wilensky, U. (1998).  NetLogo Boiling model.  http://ccl.northwestern.edu/netlogo/models/Boiling.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
