# Hex Cell Aggregation

Status: complete. Scientific research checked 2026-11-05.

How do neighborhood eligibility rules influence the shape of a growing cluster? NetLogo Hex Cell Aggregation starts with one occupied central cell on a nonwrapping hexagonal lattice. At each tick, one eligible empty cell becomes occupied, with eligibility determined by the chosen occupied-neighbor counts. Wolfram [1] supplies the local-rule growth context, Reiter [2] studies a different hexagonal cellular growth model, and Witten and Sander [3] provide a contrasting stochastic aggregation mechanism. These comparisons separate geometry and growth order from the physics that might motivate an application. The baseline has no diffusion field, nutrient transport, or crystallographic energy. Finite boundaries, random choice among eligible cells, and the selected neighbor counts shape the outcome. The experiment illustrates geometric growth constraints; resemblance to a crystal or colony does not make it a validated model of either.

## Scientific publications

1. **Stephen Wolfram (1983). Statistical mechanics of cellular automata.** Reviews of Modern Physics. [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

   Local cellular rules provide the theoretical framework for growing configurations.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1103%2FRevModPhys.55.601). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **C REITER (2005). A local cellular model for snow crystal growth.** Chaos, Solitons &amp; Fractals. [10.1016/s0960-0779(04)00374-1](https://doi.org/10.1016/s0960-0779(04)00374-1).

   Hexagonal crystal-growth modeling offers a direct topology comparison while using different physical assumptions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2FS0960-0779%2804%2900374-1). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **T. A. Witten; L. M. Sander (1981). Diffusion-Limited Aggregation, a Kinetic Critical Phenomenon.** Physical Review Letters. [10.1103/physrevlett.47.1400](https://doi.org/10.1103/physrevlett.47.1400).

   Diffusion-limited aggregation is a scientifically important contrasting mechanism; NetLogo’s eligible-cell growth should not be mislabeled DLA.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1103%2FPhysRevLett.47.1400). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Hex%20Cell%20Aggregation.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 6cc59b8e960edbcbbf8a812c36e0200064a58e867f32cf78855b68ab588e7777.

Original model citation: Wilensky, U. (2007).  NetLogo Hex Cell Aggregation model.  http://ccl.northwestern.edu/netlogo/models/HexCellAggregation.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/hex-cell-aggregation.nlogox` and `evidence/computing/hex-cell-aggregation-info.txt`.
