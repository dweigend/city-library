# Preferential Attachment

Status: **complete** · Checked: 2026-11-05 · Mini-text: 128 words

The scientific question is whether growth with degree-biased attachment can produce a network dominated by hubs. In NetLogo's Preferential Attachment model, one new node attaches to one existing node with probability proportional to its degree, beginning with a connected pair. The selected literature connects this mechanism to cumulative advantage and its statistical assessment: growth and preferential attachment generate heterogeneous degrees [1]; cumulative advantage provides an earlier reinforcement mechanism [2]; likelihood-based testing challenges visual power-law identification [3]. Finite networks, one-edge arrivals and the absence of deletion restrict the comparison; a straight line on a logarithmic plot is insufficient evidence for a power law. The original NetLogo behavior is the baseline for reimplementation. This simulation offers a controlled thought experiment, and agreement with its output does not establish empirical validation.

## Model provenance

[Selected NetLogo Web model](https://www.netlogoweb.org/launch#https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Networks/Preferential%20Attachment.nlogox) · [Served source snapshot](evidence/social-urban/preferential-attachment.nlogox)

For the model itself: * Wilensky, U. (2005). NetLogo Preferential Attachment model. http://ccl.northwestern.edu/netlogo/models/PreferentialAttachment. Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Scientific origin recorded in Info: This model is based on: Albert-László Barabási. Linked: The New Science of Networks, Perseus Publishing, Cambridge, Massachusetts, pages 79-92. For a more technical treatment, see: Albert-László Barabási & Reka Albert. Emergence of Scaling in Random Networks, Science, Vol 286, Issue 5439, 15 October 1999, pages 509-512. The layout algorithm is based on the Fruchterman-Reingold layout algorithm. More information about this algorithm can be obtained at: http://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf. For a model similar to the one described in the first suggested extension, please consult: W. Brian Arthur, "Urban Systems and Historical Path-Dependence", Chapt. 4 in Urban systems and Infrastructure, J. Ausubel and R. Herman (eds.), National Academy of Sciences, Washington, D.C., 1988.

Source revision: Served NetLogo Web snapshot retrieved 2026-11-05; {'version': 'NetLogo 7.0.4', 'snapToGrid': 'false'}. SHA-256: `2648b17e0c01c3b1a65c7abd5d5f2cb1880e14ff62dfb60b6fafffbcb25267cc`.

This literature dossier is separate from runtime execution, empirical validation and independent implementation approval.

## Scientific publications

### [1] Emergence of Scaling in Random Networks

Albert-László Barabási; Réka Albert (1999). *Science*. [Canonical record](https://doi.org/10.1126/science.286.5439.509). DOI: 10.1126/science.286.5439.509.

Model relevance: growth and preferential attachment generate heterogeneous degrees.

Verification: [abstract](https://api.crossref.org/works/10.1126%2Fscience.286.5439.509), 2026-11-05. Public Crossref registrant metadata; publisher-deposited abstract available. Exact title, complete author list, year, venue and DOI checked against the saved DOI-registrant record. Initials are retained where the primary record supplies initials; no names expanded by guesswork. Full text not claimed. [Saved evidence](evidence/social-urban/ba-crossref.json).

### [2] A general theory of bibliometric and other cumulative advantage processes

Derek De Solla Price (1976). *Journal of the American Society for Information Science*. [Canonical record](https://doi.org/10.1002/asi.4630270505). DOI: 10.1002/asi.4630270505.

Model relevance: cumulative advantage provides an earlier reinforcement mechanism.

Verification: [abstract](https://api.crossref.org/works/10.1002%2Fasi.4630270505), 2026-11-05. Public Crossref registrant metadata; publisher-deposited abstract available. Exact title, complete author list, year, venue and DOI checked against the saved DOI-registrant record. Initials are retained where the primary record supplies initials; no names expanded by guesswork. Full text not claimed. [Saved evidence](evidence/social-urban/price-crossref.json).

### [3] Power-Law Distributions in Empirical Data

Aaron Clauset; Cosma Rohilla Shalizi; M. E. J. Newman (2009). *SIAM Review*. [Canonical record](https://doi.org/10.1137/070710111). DOI: 10.1137/070710111.

Model relevance: likelihood-based testing challenges visual power-law identification.

Verification: [abstract](https://api.crossref.org/works/10.1137%2F070710111), 2026-11-05. Public Crossref registrant metadata; publisher-deposited abstract available. Exact title, complete author list, year, venue and DOI checked against the saved DOI-registrant record. Initials are retained where the primary record supplies initials; no names expanded by guesswork. Full text not claimed. [Saved evidence](evidence/social-urban/clauset-crossref.json).
