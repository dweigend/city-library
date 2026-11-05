# 3D Surface

Status: complete. Scientific research checked 2026-11-05.

How can a moving point cloud suggest a smooth surface? NetLogo 3D Surface randomly samples horizontal coordinates and computes height from a time-dependent cosine expression. It displays the resulting three-dimensional points through an oblique two-dimensional projection and varies color with height. Computer graphics [1] grounds projection and visual depth cues; differential geometry [2] explains a surface defined as a height function; computational geometry [3] frames the difference between discrete samples and an underlying continuous object. Changing sample count or the height formula reveals how representation affects perceived continuity. The displayed wave is prescribed mathematically: no elastic forces or material equations generate it. Finite sampling and projection can hide structure or introduce apparent overlaps. The simulation illustrates coordinate mapping and animated parameterization, without validating membrane mechanics or a physical wave equation.

## Scientific publications

1. **Peter Shirley; Michael Ashikhmin; Steve Marschner (2009). Fundamentals of Computer Graphics.** A K Peters/CRC Press. [10.1201/9781439865521](https://doi.org/10.1201/9781439865521).

   Projection and visual encoding explain the apparent depth of the sampled surface.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1201%2F9781439865521). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Andrew Pressley (2010). Elementary Differential Geometry.** Springer Undergraduate Mathematics Series. [10.1007/978-1-84882-891-9](https://doi.org/10.1007/978-1-84882-891-9).

   A height function is a surface parameterization; this is the relevant mathematical structure.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-84882-891-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Mark de Berg; Otfried Cheong; Marc van Kreveld; Mark Overmars (2008). Computational Geometry: Algorithms and Applications.** Springer Berlin Heidelberg. [10.1007/978-3-540-77974-2](https://doi.org/10.1007/978-3-540-77974-2).

   Discrete geometric representations clarify that the point cloud is an approximation to a continuous surface.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-3-540-77974-2). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/3D%20Surface.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 529920490e0581e1caacd9879f9a0edac891733b315eb387361ac2a347ad4f47.

Original model citation: Wilensky, U. (1998).  NetLogo 3D Surface model.  http://ccl.northwestern.edu/netlogo/models/3DSurface.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/3d-surface.nlogox` and `evidence/computing/3d-surface-info.txt`.
