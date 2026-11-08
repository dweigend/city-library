# Cyclic CA

Status: complete. Scientific research checked 2026-11-05.

How can cyclic local competition organize a disordered field into waves and spirals? NetLogo Cyclic CA assigns each patch a state on a color cycle. A patch advances only when enough neighbors occupy its successor state, using a selectable Moore or von Neumann neighborhood and radius. Fisch and colleagues [1] study threshold-range scaling in cyclic and excitable automata, Shalizi and Shalizi [2] examine how to quantify organization in cyclic systems, and Greenberg and Hastings [3] provide a related excitable-media comparison. The original model freezes states before updating to preserve simultaneous decisions. Threshold, state count, neighborhood geometry, and finite boundaries determine whether activity persists or freezes. Attractive spiral images illustrate local interaction and symmetry breaking; they do not by themselves quantify organization or establish a chemical, neural, or ecological explanation.

## Scientific publications

1. **Robert Fisch; Janko Gravner; David Griffeath (1991). Threshold-range scaling of excitable cellular automata.** Statistics and Computing. [10.1007/bf01890834](https://doi.org/10.1007/bf01890834).

   Directly cited original study links threshold, interaction radius and color cycling to collective patterns.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1007%2FBF01890834). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Abstract and section 1: state cycle, threshold, interaction range, synchronous update, and GH versus CCA. Contact-driven cycling in every state differs from the automatic refractory progression in Greenberg–Hastings-type systems. Pattern resemblance does not erase this rule distinction.

2. **Cosma R. Shalizi; Kristina L. Shalizi (2003). Quantifying self-organization in cyclic cellular automata.** SPIE Proceedings. [10.1117/12.485805](https://doi.org/10.1117/12.485805).

   Directly cited scientific treatment distinguishes measured organization from visual impressions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1117%2F12.485805). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **J. M. Greenberg; S. P. Hastings (1978). Spatial Patterns for Discrete Models of Diffusion in Excitable Media.** SIAM Journal on Applied Mathematics. [10.1137/0134040](https://doi.org/10.1137/0134040).

   A foundational related model clarifies the distinction between contact-driven cyclic changes and automatic refractory transitions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1137%2F0134040). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/Cyclic%20CA.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 e8669163bfd4c70e39f2dfe3d4f2a775e6770a931d2fcf6fc73fcb4a82820c50.

Original model citation: Gurkan, C. and Wilensky, U. (2025).  NetLogo Cyclic CA model.  http://ccl.northwestern.edu/netlogo/models/CyclicCA.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/cyclic-ca.nlogox` and `evidence/computing/cyclic-ca-info.txt`.
