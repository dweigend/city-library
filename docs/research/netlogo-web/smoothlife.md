# SmoothLife

Status: complete. Scientific research checked 2026-11-05.

Which features of Life-like organization survive when binary states become continuous values? NetLogo SmoothLife averages a patch field over an inner disk and surrounding annulus, then uses smooth sigmoid transitions to calculate the next generation. Rafler's original preprint [1] supplies the direct rule provenance, Wolfram [2] provides cellular-automaton context, and Fisch and colleagues [3] connect neighborhood thresholds with excitable pattern formation. The NetLogo Info explicitly retains discrete time and approximates continuous space with a finite grid. It also omits very small state contributions as a numerical optimization. Radius, transition widths, and birth and survival intervals affect whether moving structures persist. The simulation illustrates a parameterized generalization of local rule-driven organization; organic appearance does not identify living behavior, and a discretized update is not an exact simulation of every continuous formulation.

## Scientific publications

1. **Stephan Rafler (2011). Generalization of Conway's "Game of Life" to a continuous domain - SmoothLife.** arXiv preprint arXiv:1111.1567, version 2. [10.48550/arXiv.1111.1567](https://arxiv.org/abs/1111.1567).

   Original SmoothLife rule generalizes Life to continuous-valued spatial averages and smooth transitions; directly cited by the NetLogo Info.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.datacite.org/dois/10.48550/arXiv.1111.1567). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. DataCite metadata cross-checked with arXiv abstract page (submitted 7 November 2011, revised 7 December 2011). No claim of full-text reading. Abstract and sections 2–4: inner disk, annulus, sigmoid transition and optional continuous time. The article explicitly separates the discrete-time update from a continuous-time variant. The served PDF bears the arXiv v2 label and a regenerated date of 27 November 2024; the repository publication year is 2011.

2. **Stephen Wolfram (1983). Statistical mechanics of cellular automata.** Reviews of Modern Physics. [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

   Cellular-automaton theory provides the discrete reference point for the continuous-valued generalization.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1103%2FRevModPhys.55.601). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Robert Fisch; Janko Gravner; David Griffeath (1991). Threshold-range scaling of excitable cellular automata.** Statistics and Computing. [10.1007/bf01890834](https://doi.org/10.1007/bf01890834).

   Threshold and neighborhood-range studies give a related framework for interpreting pattern formation, not a claim that the rules are identical.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1007%2FBF01890834). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Abstract and section 1: state cycle, threshold, interaction range, synchronous update, and GH versus CCA. Contact-driven cycling in every state differs from the automatic refractory progression in Greenberg–Hastings-type systems. Pattern resemblance does not erase this rule distinction.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/SmoothLife.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 9ad3e7b9643589d8daa4391867cefd87e5688bd2c9142b514668bcf2fa663352.

Original model citation: Head, B. and Wilensky, U. (2017).  NetLogo SmoothLife model.  http://ccl.northwestern.edu/netlogo/models/SmoothLife.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/smoothlife.nlogox` and `evidence/computing/smoothlife-info.txt`.
