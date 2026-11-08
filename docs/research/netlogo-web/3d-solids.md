# 3D Solids

Status: complete. Scientific research checked 2026-11-05.

How can a two-dimensional display communicate three-dimensional shape? NetLogo 3D Solids samples points on selected solid surfaces, stores spherical coordinates, rotates them by changing an angle, and projects their positions into the view. Brightness supplies an additional depth cue. The graphics methods in [1], differential geometry in [2], and computational geometry in [3] provide complementary foundations for separating a surface, its parameterization, and its displayed approximation. The model illustrates coordinate conversion and rotation rather than physical motion of a rigid material. Its random point cloud is finite, the display omits a full optical rendering pipeline, and visual smoothness depends on sampling. Recognizing a convincing sphere or cube therefore demonstrates a useful representation, without proving uniform surface sampling or geometric accuracy of every generated point.

## Scientific publications

1. **Peter Shirley; Michael Ashikhmin; Steve Marschner (2009). Fundamentals of Computer Graphics.** A K Peters/CRC Press. [10.1201/9781439865521](https://doi.org/10.1201/9781439865521).

   Coordinate transformations, projection and depth cues explain the point-cloud representation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1201%2F9781439865521). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Andrew Pressley (2010). Elementary Differential Geometry.** Springer Undergraduate Mathematics Series. [10.1007/978-1-84882-891-9](https://doi.org/10.1007/978-1-84882-891-9).

   Surface parameterizations distinguish spherical coordinates from the underlying geometric surface.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-84882-891-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Mark de Berg; Otfried Cheong; Marc van Kreveld; Mark Overmars (2008). Computational Geometry: Algorithms and Applications.** Springer Berlin Heidelberg. [10.1007/978-3-540-77974-2](https://doi.org/10.1007/978-3-540-77974-2).

   Geometric representations and spatial computations frame the distinction between sampled points and exact solids.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-3-540-77974-2). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/3D%20Solids.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 78d4274c446271d1eda3964b30c82cc7c3ffcab6463998249d770c6f2a182fb5.

Original model citation: Wilensky, U. (1998).  NetLogo 3D Solids model.  http://ccl.northwestern.edu/netlogo/models/3DSolids.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/3d-solids.nlogox` and `evidence/computing/3d-solids-info.txt`.
