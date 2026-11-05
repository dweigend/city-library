# Brian's Brain

Status: complete. Scientific research checked 2026-11-05.

How does a refractory state alter the patterns supported by a local cellular rule? NetLogo Brian's Brain uses firing, refractory, and inactive states. Firing cells become refractory, refractory cells become inactive, and inactive cells fire when exactly two of their eight neighbors are firing. The original Info credits Brian Silverman for the rule. Wolfram [1] supplies cellular-automaton foundations, Greenberg and Hastings [2] study discrete excitable media, and Fisch and colleagues [3] analyze threshold and neighborhood effects in related systems. Counts are frozen before updates, preserving synchronous generations. The finite lattice, initialization, and exact two-neighbor birth condition shape moving configurations. This is a computational excitable pattern model rather than a physiological neuron simulation. Similar-looking waves in other systems motivate comparisons, but do not establish identical mechanisms or empirical validation.

## Scientific publications

1. **Stephen Wolfram (1983). Statistical mechanics of cellular automata.** Reviews of Modern Physics. [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

   General local-update theory supports the cellular-automaton interpretation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1103%2FRevModPhys.55.601). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **J. M. Greenberg; S. P. Hastings (1978). Spatial Patterns for Discrete Models of Diffusion in Excitable Media.** SIAM Journal on Applied Mathematics. [10.1137/0134040](https://doi.org/10.1137/0134040).

   Excitation followed by refractoriness is the directly relevant scientific analogy, while Brian’s rule is distinct.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1137%2F0134040). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Robert Fisch; Janko Gravner; David Griffeath (1991). Threshold-range scaling of excitable cellular automata.** Statistics and Computing. [10.1007/bf01890834](https://doi.org/10.1007/bf01890834).

   Threshold and range analysis explains why neighbor rules and state cycling influence propagating patterns.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1007%2FBF01890834). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Abstract and section 1: state cycle, threshold, interaction range, synchronous update, and GH versus CCA. Contact-driven cycling in every state differs from the automatic refractory progression in Greenberg–Hastings-type systems. Pattern resemblance does not erase this rule distinction.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/Brian's%20Brain.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 f516529c1fdf0190dd9b73ea1b22d529301dd9f71e9a766317f017536a3627f6.

Original model citation: Wilensky, U. (2002).  NetLogo Brian's Brain model.  http://ccl.northwestern.edu/netlogo/models/Brian'sBrain.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/brians-brain.nlogox` and `evidence/computing/brians-brain-info.txt`.
