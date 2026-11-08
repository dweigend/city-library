# Planarity

Status: complete. Scientific research checked 2026-11-05.

How can moving vertices remove visual crossings without changing a graph's connections? NetLogo Planarity generates a solvable graph, scrambles vertex positions, and lets a player drag vertices until no edges cross. Hopcroft and Tarjan [1] establish algorithmic planarity testing, Tutte [2] studies graph drawing, and computational geometry [3] supplies segment-intersection and geometric representation methods. These sources clarify the difference between a graph's abstract topology and one particular drawing. A planar graph may initially look tangled, while some abstract graphs admit no crossing-free embedding. The baseline intentionally supplies solvable instances, so repeated success does not demonstrate a general planarity decision algorithm. Crossing detection depends on finite coordinates and the treatment of shared endpoints. The experiment illustrates geometric reorganization under fixed connectivity rather than a change in the underlying network.

## Scientific publications

1. **John Hopcroft; Robert Tarjan (1974). Efficient Planarity Testing.** Journal of the ACM. [10.1145/321850.321852](https://doi.org/10.1145/321850.321852).

   Foundational planarity-testing algorithm distinguishes deciding an abstract property from manually improving a drawing.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1145%2F321850.321852). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **W. T. Tutte (1963). How to Draw a Graph.** Proceedings of the London Mathematical Society. [10.1112/plms/s3-13.1.743](https://doi.org/10.1112/plms/s3-13.1.743).

   Classic graph-drawing research directly supports embedding and crossing-free representation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1112%2Fplms%2Fs3-13.1.743). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Mark de Berg; Otfried Cheong; Marc van Kreveld; Mark Overmars (2008). Computational Geometry: Algorithms and Applications.** Springer Berlin Heidelberg. [10.1007/978-3-540-77974-2](https://doi.org/10.1007/978-3-540-77974-2).

   Segment intersection and geometric predicates support the displayed crossing criterion and numerical limitations.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-3-540-77974-2). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Games/Planarity.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 cc561bd697aa33ae109c3577f0957452c1fcfb6091056a66875cb2d48fa91c9b.

Original model citation: Wilensky, U. (2007).  NetLogo Planarity model.  http://ccl.northwestern.edu/netlogo/models/Planarity.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/planarity.nlogox` and `evidence/computing/planarity-info.txt`.
