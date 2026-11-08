# Vector Fields

Status: complete. Scientific research checked 2026-11-05.

What does a local direction field imply about a particle's trajectory? NetLogo Vector Fields displays arrows tangent to circles around the origin, with magnitude increasing with distance, and moves particles through finite direction-following steps. Differential geometry [1] supplies the language of curves and tangent directions; computer graphics [2] explains arrows and spatial encoding; Cabral and Leedom [3] provide a related field-visualization method using line integral convolution. The original Info identifies an important numerical artifact: trajectories slowly spiral outward because particles travel before recalculating their headings. Changing step size changes this approximation. The baseline illustrates an abstract vector field rather than identifying a particular gravitational or electromagnetic law. A circular-looking vector plot alone cannot establish force-based orbital motion, since velocity fields and acceleration fields imply different differential equations.

## Scientific publications

1. **Andrew Pressley (2010). Elementary Differential Geometry.** Springer Undergraduate Mathematics Series. [10.1007/978-1-84882-891-9](https://doi.org/10.1007/978-1-84882-891-9).

   Curves and tangents provide the mathematical setting for integral paths.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-84882-891-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Peter Shirley; Michael Ashikhmin; Steve Marschner (2009). Fundamentals of Computer Graphics.** A K Peters/CRC Press. [10.1201/9781439865521](https://doi.org/10.1201/9781439865521).

   Vector glyphs and spatial transformations ground the visual encoding of magnitude and direction.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1201%2F9781439865521). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Brian Cabral; Leith Casey Leedom (1993). Imaging vector fields using line integral convolution.** Proceedings of the 20th annual conference on Computer graphics and interactive techniques. [10.1145/166117.166151](https://doi.org/10.1145/166117.166151).

   Original vector-field visualization research supplies a direct scientific comparison to NetLogo’s arrow glyphs and particle paths; NetLogo does not implement line integral convolution.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1145%2F166117.166151). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Abstract and sections 1–2: vector-field imaging, glyphs, streamlines and particle-trace limitations. Line integral convolution is a contrasting visualization method. The original NetLogo baseline uses arrows and particle trajectories, not LIC.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Vector%20Fields.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 0b712de04bcda60594291a6d9764a15d5c42711235a8193b3d2fe767d65839d0.

Original model citation: Wilensky, U. (1998).  NetLogo Vector Fields model.  http://ccl.northwestern.edu/netlogo/models/VectorFields.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/vector-fields.nlogox` and `evidence/computing/vector-fields-info.txt`.
