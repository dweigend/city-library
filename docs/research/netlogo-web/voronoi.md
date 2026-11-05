# Voronoi

Status: complete. Scientific research checked 2026-11-05.

How does nearest-site assignment partition space? NetLogo Voronoi places sites and colors every grid patch according to its closest site, producing a raster approximation to a Voronoi diagram. Dragging a site changes the affected territories, which are redrawn outward from the interaction region. Fortune's algorithm [1] establishes the exact geometric construction as a useful comparison; computational geometry [2] explains diagram structure and algorithmic choices; spatial tessellation theory [3] connects nearest-site regions with scientific applications. The NetLogo baseline deliberately uses patch classification rather than calculating exact polygon vertices. Resolution, ties, finite boundaries, and coincident sites therefore matter. The experiment illustrates how a global partition follows from a local distance criterion, while its visual resemblance to cells or territories does not demonstrate any particular biological or urban growth mechanism.

## Scientific publications

1. **Steven Fortune (1987). A sweepline algorithm for Voronoi diagrams.** Algorithmica. [10.1007/bf01840357](https://doi.org/10.1007/bf01840357).

   Exact sweepline construction contrasts with NetLogo’s raster nearest-site approximation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF01840357). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Mark de Berg; Otfried Cheong; Marc van Kreveld; Mark Overmars (2008). Computational Geometry: Algorithms and Applications.** Springer Berlin Heidelberg. [10.1007/978-3-540-77974-2](https://doi.org/10.1007/978-3-540-77974-2).

   Voronoi geometry, degeneracies and computational representations directly support the mechanism.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-3-540-77974-2). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Atsuyuki Okabe; Barry Boots; Kokichi Sugihara; Sung Nok Chiu; D. G. Kendall (editor) (2000). Spatial Tessellations: Concepts and Applications of Voronoi Diagrams.** Wiley Series in Probability and Statistics. [10.1002/9780470317013](https://doi.org/10.1002/9780470317013).

   Scientific monograph on Voronoi tessellations supplies applications and assumptions of nearest-site territorial models.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1002%2F9780470317013). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text. Wiley book page also checked: full title, all five listed contributors, 12 July 2000, second edition. Publisher summary and contents accessible; chapters not read.   

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Voronoi.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 d0e70a519c77947710ea1fb8860ab1cd83e447704246ecb22048b823a6a570b2.

Original model citation: Wilensky, U. (2006).  NetLogo Voronoi model.  http://ccl.northwestern.edu/netlogo/models/Voronoi.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/voronoi.nlogox` and `evidence/computing/voronoi-info.txt`.
