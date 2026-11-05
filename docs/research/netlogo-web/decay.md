# Decay

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo Decay investigates how a constant individual decay probability creates a population half-life. Each still-radioactive nucleus receives an independent per-tick chance to decay, briefly flashes, and then remains stable; population and per-tick decay counts are recorded. Provides the foundational radioactive-transformation interpretation [1]. Relates measured alpha-particle ranges to characteristic transformation periods, a physical connection deliberately absent from the constant-probability baseline [2]. Clarifies continuous-time event sampling, exposing the distinction from a fixed-step Bernoulli decay probability [3]. The baseline omits daughter chains and isotope-specific interactions; a discrete probability p corresponds to an exponential survival rate through minus log of one minus p per time interval, rather than simply p at all step sizes. The simulation illustrates why an irregular sequence of individual events can produce an approximately exponential aggregate curve. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. E. Rutherford; Frederick Soddy (1902). **LXXXIV.—The radioactivity of thorium compounds. II. The cause and nature of radioactivity**. J. Chem. Soc., Trans., 81; 0; 837-860. DOI: [10.1039/ct9028100837](https://doi.org/10.1039/ct9028100837).

Provides the foundational radioactive-transformation interpretation; relevant here to why an irregular sequence of individual events can produce an approximately exponential aggregate curve.

Verification (2026-11-05): [metadata](https://api.crossref.org/works?query=The%20cause%20and%20nature%20of%20radioactivity%20Rutherford%20Soddy%201902&rows=3). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

2. H. Geiger; J.M. Nuttall (1911). **LVII. The ranges of the α particles from various radioactive substances and a relation between range and period of transformation**. The London, Edinburgh, and Dublin Philosophical Magazine and Journal of Science, 22; 130; 613-621. DOI: [10.1080/14786441008637156](https://doi.org/10.1080/14786441008637156).

Relates measured alpha-particle ranges to characteristic transformation periods, a physical connection deliberately absent from the constant-probability baseline; relevant here to why an irregular sequence of individual events can produce an approximately exponential aggregate curve.

Verification (2026-11-05): [metadata](https://api.crossref.org/works?query=Geiger%20Nuttall%20ranges%20alpha%20particles%20radioactive%20substances%20period%20transformation&rows=3). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

3. Daniel T. Gillespie (1977). **Exact stochastic simulation of coupled chemical reactions**. The Journal of Physical Chemistry, 81; 25; 2340-2361. DOI: [10.1021/j100540a008](https://doi.org/10.1021/j100540a008).

Clarifies continuous-time event sampling, exposing the distinction from a fixed-step Bernoulli decay probability; relevant here to why an irregular sequence of individual events can produce an approximately exponential aggregate curve.

Verification (2026-11-05): [metadata](https://api.crossref.org/works/10.1021/j100540a008). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Radioactivity/Decay.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 5144c1681a1de36993cca053e6b989a2c17b293e23a74f1708b5a277c849155d.

* Wilensky, U. (1997).  NetLogo Decay model.  http://ccl.northwestern.edu/netlogo/models/Decay.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
