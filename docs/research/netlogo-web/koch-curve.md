# Koch Curve

Status: complete. Scientific research checked 2026-11-05.

How can a finite replacement rule create an increasingly intricate curve? NetLogo Koch Curve repeatedly replaces each segment with four shorter segments arranged around a triangular bump. The construction makes successive approximations visible, allowing segment count, scale, and apparent roughness to be compared. Chaos and Fractals [1] explains self-similar constructions and dimension; Mandelbrot's research monograph [2] places such curves within fractal geometry; the Algorithmic Beauty of Plants [3] provides a complementary rewriting and turtle-graphics formulation. The mathematical limiting curve differs fundamentally from any finite display: the simulation always stops at a finite iteration depth and finite numerical resolution. The model illustrates recursive substitution and scaling, rather than directly simulating erosion or coastline formation. Similar-looking natural boundaries require their own mechanisms and empirical measurements before fractal analogies become explanatory claims.

## Scientific publications

1. **Heinz-Otto Peitgen; Hartmut Jürgens; Dietmar Saupe (1992). Chaos and Fractals: New Frontiers of Science.** Springer New York. [10.1007/978-1-4757-4740-9](https://doi.org/10.1007/978-1-4757-4740-9).

   Self-similar replacement and fractal dimension directly explain the iterative construction.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-4757-4740-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Benoit B. Mandelbrot (2004). Fractals and Chaos.** Springer New York. [10.1007/978-1-4757-4017-2](https://doi.org/10.1007/978-1-4757-4017-2).

   Fractal geometry provides the limiting-curve context and cautions against equating visual roughness with physical mechanism.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-4757-4017-2). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Przemyslaw Prusinkiewicz; Aristid Lindenmayer (1990). The Algorithmic Beauty of Plants.** The Virtual Laboratory. [10.1007/978-1-4613-8476-2](https://doi.org/10.1007/978-1-4613-8476-2).

   Rewriting and turtle graphics supply a scientific generative representation of recursive curves.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1007%2F978-1-4613-8476-2). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Chapter 1, pp. 1–7: Koch replacement, parallel rewriting, DOL systems and turtle interpretation. Selected chapter sections support the grammar-to-geometry mechanism; the entire book was not read.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Fractals/Koch%20Curve.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 4ba38749967fabce7b4b17bd1f0719df46b18251ed7c4b0ca76cdbd636aca7bd.

Original model citation: Wilensky, U. (1998).  NetLogo Koch Curve model.  http://ccl.northwestern.edu/netlogo/models/KochCurve.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/koch-curve.nlogox` and `evidence/computing/koch-curve-info.txt`.
