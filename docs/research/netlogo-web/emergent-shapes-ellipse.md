# Emergent Shapes - Ellipse

Status: complete. Scientific research checked 2026-11-05.

Can simple feedback recover a geometric constraint without directly drawing its equation? NetLogo Emergent Shapes Ellipse asks agents to approach positions whose distances to two fixed foci sum to a prescribed constant. Agents continue when their movement improves the constraint and choose a new direction when it worsens. Differential geometry [1] gives the curve context, computational geometry [2] supplies distance-based geometric reasoning, and Rosin's ellipse-fitting study [3] provides a contrasting numerical approach with its own normalization issues. The resulting point distribution illustrates decentralized search for a level set. Agent step size, stopping tolerance, initial positions, and random choices influence the approximation. This is a demonstration of constraint satisfaction, rather than evidence that natural elliptical forms arise by this rule or that every agent samples the ellipse uniformly.

## Scientific publications

1. **Andrew Pressley (2010). Elementary Differential Geometry.** Springer Undergraduate Mathematics Series. [10.1007/978-1-84882-891-9](https://doi.org/10.1007/978-1-84882-891-9).

   Curve geometry provides the mathematical interpretation of the two-focus distance constraint.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-84882-891-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Mark de Berg; Otfried Cheong; Marc van Kreveld; Mark Overmars (2008). Computational Geometry: Algorithms and Applications.** Springer Berlin Heidelberg. [10.1007/978-3-540-77974-2](https://doi.org/10.1007/978-3-540-77974-2).

   Distance predicates and finite approximations frame the spatial constraint calculation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-3-540-77974-2). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Paul L. Rosin (1993). A note on the least squares fitting of ellipses.** Pattern Recognition Letters. [10.1016/0167-8655(93)90062-i](https://doi.org/10.1016/0167-8655(93)90062-i).

   Ellipse fitting is a directly relevant contrasting numerical method; it does not describe NetLogo’s agent search rule.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2F0167-8655%2893%2990062-I). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Conic%20Sections/Emergent%20Shapes%20-%20Ellipse.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 9df0c7739f8abdae7c93861153488577c1f2b7245669f7828c6a6bbd1fb6f12e.

Original model citation: Brandes, A. and Wilensky, U. (1998).  NetLogo Emergent Shapes - Ellipse model.  http://ccl.northwestern.edu/netlogo/models/EmergentShapes-Ellipse.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/emergent-shapes-ellipse.nlogox` and `evidence/computing/emergent-shapes-ellipse-info.txt`.
