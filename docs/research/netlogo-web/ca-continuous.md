# CA Continuous

Status: complete. Scientific research checked 2026-11-05.

What changes when a cellular rule acts on real-valued states instead of bits? NetLogo CA Continuous averages a cell and its nearest neighbors, adds a chosen constant, and keeps the fractional part to obtain the next state. Values are plotted in successive rows as a space-time diagram. Kaneko [1] supplies the coupled-map-lattice context explicitly cited in the original Info, Wolfram [2] provides a discrete cellular comparison, and Peitgen and colleagues [3] explain iterated-map and numerical-chaos concepts. The precision control quantizes the nominally continuous values, while finite arithmetic and a bounded lattice impose further constraints. The update is deterministic; varied patterns are not evidence of random forcing. The experiment illustrates the interaction of local coupling, nonlinear iteration, and numerical precision, rather than a validated physical diffusion law or literally infinite state space.

## Scientific publications

1. **Kunihiko Kaneko (1989). Pattern dynamics in spatiotemporal chaos.** Physica D: Nonlinear Phenomena. [10.1016/0167-2789(89)90227-3](https://doi.org/10.1016/0167-2789(89)90227-3).

   Direct original-Info reference for coupled map lattices and spatiotemporal patterns.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2F0167-2789%2889%2990227-3). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Stephen Wolfram (1983). Statistical mechanics of cellular automata.** Reviews of Modern Physics. [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

   Discrete-state cellular theory provides the comparison motivating continuous cell values.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1103%2FRevModPhys.55.601). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Heinz-Otto Peitgen; Hartmut Jürgens; Dietmar Saupe (1992). Chaos and Fractals: New Frontiers of Science.** Springer New York. [10.1007/978-1-4757-4740-9](https://doi.org/10.1007/978-1-4757-4740-9).

   Iterated maps and finite numerical approximations support interpretation of nonlinear local dynamics.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-4757-4740-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/CA%20Continuous.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 0f7c8d2a60f43bd33c127a3bc4ad99d1d92ab7fb2d252ba14c992ca1ee30595c.

Original model citation: Wilensky, U. (2003).  NetLogo CA Continuous model.  http://ccl.northwestern.edu/netlogo/models/CAContinuous.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/ca-continuous.nlogox` and `evidence/computing/ca-continuous-info.txt`.
