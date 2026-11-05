# CA Stochastic

Status: complete. Scientific research checked 2026-11-05.

How does uncertainty in a local transition change collective behavior? NetLogo CA Stochastic assigns a separate activation probability to each of the eight binary neighborhoods consisting of a cell and its immediate neighbors. Each generation is drawn as a new row, producing a one-dimensional space-time diagram. Wolfram [1] supplies the deterministic cellular foundation, Li and colleagues [2] study transitions across rule space, and Chaté and Manneville [3] analyze critical behavior. Setting probabilities to zero or one recovers deterministic cases, while intermediate values produce repeated runs with different realizations. Initial density, boundary conditions, and the eight probabilities jointly determine the observed patterns. The experiment illustrates stochastic update laws rather than merely uncertain initial conditions. A finite visual run cannot establish a critical point, a universal scaling law, or a faithful model of noisy natural processes.

## Scientific publications

1. **Stephen Wolfram (1983). Statistical mechanics of cellular automata.** Reviews of Modern Physics. [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

   Deterministic local rules supply the limiting cases when all probabilities are zero or one.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1103%2FRevModPhys.55.601). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Wentian Li; Norman H. Packard; Chris G. Langton (1990). Transition phenomena in cellular automata rule space.** Physica D: Nonlinear Phenomena. [10.1016/0167-2789(90)90175-o](https://doi.org/10.1016/0167-2789(90)90175-o).

   Transition phenomena motivate systematic parameter comparisons rather than judging a single image.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2F0167-2789%2890%2990175-O). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Hugues Chaté; Paul Manneville (1990). Criticality in cellular automata.** Physica D: Nonlinear Phenomena. [10.1016/0167-2789(90)90178-r](https://doi.org/10.1016/0167-2789(90)90178-r).

   Directly cited criticality study provides the scientific framework and limits for interpreting apparent regime changes.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2F0167-2789%2890%2990178-R). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/CA%20Stochastic.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 f4f22acee911ef5ae9e95f2a95f47dfda743f5887ac34a664e45356cb8e3b169.

Original model citation: Wilensky, U. (2003).  NetLogo CA Stochastic model.  http://ccl.northwestern.edu/netlogo/models/CAStochastic.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/ca-stochastic.nlogox` and `evidence/computing/ca-stochastic-info.txt`.
