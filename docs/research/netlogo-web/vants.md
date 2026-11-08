# Vants

Status: complete. Scientific research checked 2026-11-05.

Can a deterministic rule appear irregular while remaining reversible? NetLogo Vants moves virtual ants across a binary patch field, toggling the visited color and turning right or left according to that color. Langton [1] provides the artificial-life context, Gale and colleagues [2] investigate generalized ant dynamics, and Turing [3] supplies the broader connection between local read-write rules and computation. The original NetLogo rule moves before examining and changing the new patch, so operation order is part of its identity. Its world wraps, and multiple ants share the same writable field. Initial headings, ant count, activation order, and finite boundaries affect the visible trace. The model illustrates how simple deterministic interactions can generate long transients and structured paths; apparent disorder is not evidence of stochasticity, and reversibility requires an explicitly defined inverse update.

## Scientific publications

1. **Christopher G Langton (1986). Studying artificial life with cellular automata.** Physica D: Nonlinear Phenomena. [10.1016/0167-2789(86)90237-x](https://doi.org/10.1016/0167-2789(86)90237-x).

   Langton’s artificial-life research supplies the original rule-driven computational context credited by the model.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2F0167-2789%2886%2990237-X). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **David Gale; Jim Propp; Scott Sutherland; Serge Troubetzkoy (1995). Mathematical entertainments: Further Travels with My Ant.** The Mathematical Intelligencer. [10.1007/bf03024370](https://doi.org/10.1007/bf03024370).

   The original generalized-ant study directly examines turning rules and long-term trajectory organization.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF03024370). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **A. M. Turing (1937). On Computable Numbers, with an Application to the Entscheidungsproblem.** Proceedings of the London Mathematical Society. [10.1112/plms/s2-42.1.230](https://doi.org/10.1112/plms/s2-42.1.230).

   Read-write computational machines explain the conceptual relationship between a moving head and a mutable cell field.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1112%2Fplms%2Fs2-42.1.230). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Introduction and section 1, pp. 230–231: machine state, scanned symbol, write/erase and tape movement. The original single-head tape formalism is distinct from the finite multihead two-dimensional teaching variant. The manuscript was received/read in 1936; the DOI record dates publication 1937.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Vants.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 66ee2a39c0879a05bd850ed5424d7650be59d23741be8126f8b2e7888c0977d7.

Original model citation: Wilensky, U. (2005).  NetLogo Vants model.  http://ccl.northwestern.edu/netlogo/models/Vants.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/vants.nlogox` and `evidence/computing/vants-info.txt`.
