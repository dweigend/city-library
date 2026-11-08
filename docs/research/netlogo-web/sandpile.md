# Sandpile

Research status: complete. Literature research only; implementation acceptance is separate.

NetLogo Sandpile investigates how slow loading can produce avalanches over many scales. Grains are added to a square lattice; overloaded sites redistribute their entire load to four neighbors, and grains can escape at the boundary. Introduces self-organized criticality through driven threshold dynamics [1]. Provides the analytical sandpile-automaton framework and its restrictions [2]. Explains scaling tests and finite-size caveats needed before interpreting avalanche distributions [3]. The original Info warns that these rules are not realistic granular mechanics; the all-load redistribution rule also deserves attention when comparing with strictly Abelian toppling. The simulation illustrates how local thresholds, boundary dissipation and driving interact. Reproducing these patterns establishes rule fidelity, not empirical validation.

## Scientific publications

1. Per Bak; Chao Tang; Kurt Wiesenfeld (1987). **Self-organized criticality: An explanation of the 1/ f noise**. Physical Review Letters, 59; 4; 381-384. DOI: [10.1103/physrevlett.59.381](https://doi.org/10.1103/physrevlett.59.381).

Introduces self-organized criticality through driven threshold dynamics; relevant here to how local thresholds, boundary dissipation and driving interact.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1103/PhysRevLett.59.381). Open publisher abstract; full article requires authorization. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

Publisher abstract relates spatially extended driven dynamics to criticality, flicker noise and fractal objects.

Additional primary evidence: [https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.59.381](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.59.381)

2. Deepak Dhar (1990). **Self-organized critical state of sandpile automaton models**. Physical Review Letters, 64; 14; 1613-1616. DOI: [10.1103/physrevlett.64.1613](https://doi.org/10.1103/physrevlett.64.1613).

Provides the analytical sandpile-automaton framework and its restrictions; relevant here to how local thresholds, boundary dissipation and driving interact.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works/10.1103%2FPhysRevLett.64.1613). Open publisher abstract; full article requires authorization. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. No abstract/full text was returned; mechanism interpretation is bounded by model Info and the bibliographic subject.

Abstract states the local-height toppling assumptions and exact finite-lattice analysis; these are comparison conditions, not proof that all NetLogo toppling variants are Abelian.

Additional primary evidence: [https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.64.1613](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.64.1613)

3. Gunnar Pruessner (2012). **Self-Organised Criticality**. Cambridge University Press. DOI: [10.1017/cbo9780511977671](https://doi.org/10.1017/cbo9780511977671).

Explains scaling tests and finite-size caveats needed before interpreting avalanche distributions; relevant here to how local thresholds, boundary dissipation and driving interact.

Verification (2026-11-05): [metadata and abstract](https://api.crossref.org/works?query=Self-Organised%20Criticality%20Theory%20Models%20and%20Characterisation%20Gunnar%20Pruessner&rows=3). Open DOI-registrant metadata; full publication access not assessed. Title, complete listed author sequence, publication date and DOI checked against live primary DOI registration metadata. Given names retain registered initials where supplied; no invented expansion. Registrant abstract consulted: Giving a detailed overview of the subject, this book takes in the results and methods that have arisen since the term 'self-organised criticality' was coined twenty years ago. Providing an overview of numerical and analytical methods, from their theoretical foundation to the actual application and implementation, the book is an easy access point to important results and sophisticated methods. Starting with the famous Bak-Tang-Wiesenfeld sandpile, ten key models are carefully defined, together with their results and applications. Comprehensive tables of numerical results are collected in one volume for the first time, making the information readily accessible to readers. Written for graduate students and practising researchers in a range of disciplines, from physics and mathematics to biology, sociology, finance, medicine and engineering, the book gives a practical, hands-on approach throughout. Methods and results are applied in ways that will relate to the reader's own research.

## Original model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20&%20Physics/Sandpile.nlogox), checked 2026-11-05. NetLogo 7.0.4; SHA-256 652510bc00315490d7f7af08898296b4af80f84e1f73b9cf297cba70ffbee252.

* Weintrop, D., Tisue, S., Tinker, R., Head, B. and Wilensky, U. (2011).  NetLogo Sandpile model.  http://ccl.northwestern.edu/netlogo/models/Sandpile.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

This dossier describes the original NetLogo baseline; it does not establish reimplementation behavior or empirical validation.
