# Mandelbrot

Status: complete. Scientific research checked 2026-11-05.

How can repeatedly applying a simple complex map generate an intricate boundary? NetLogo Mandelbrot evaluates the iteration z squared plus c at grid locations, using moving agents to distribute computation and color patches according to their accumulated iterations and escape behavior. Mandelbrot [1] provides an original study of complex quadratic iteration, Milnor [2] supplies the mathematical dynamics, and Peitgen and colleagues [3] connect iterative maps with fractal geometry and computation. The model distinguishes bounded-looking orbits from escaping ones through finite work. A maximum iteration count cannot prove that a point belongs to the infinite mathematical set, especially near its boundary. Grid resolution and allocation of agent visits affect the developing image. The simulation illustrates numerical exploration of deterministic dynamics, rather than stochastic creation of the set or empirical evidence for a physical process.

## Scientific publications

1. **Benoit B. Mandelbrot (1980). FRACTAL ASPECTS OF THE ITERATION OF z →Λz(1‐ z) FOR COMPLEX Λ AND z.** Annals of the New York Academy of Sciences. [10.1111/j.1749-6632.1980.tb29690.x](https://doi.org/10.1111/j.1749-6632.1980.tb29690.x).

   Original research on complex quadratic iteration supplies the historical mathematical connection.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1111%2Fj.1749-6632.1980.tb29690.x). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **John Milnor (2000). Dynamics in One Complex Variable.** Vieweg+Teubner Verlag. [10.1007/978-3-663-08092-3](https://doi.org/10.1007/978-3-663-08092-3).

   Complex dynamics explains bounded orbits and the difference between numerical evidence and membership proofs.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-3-663-08092-3). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Heinz-Otto Peitgen; Hartmut Jürgens; Dietmar Saupe (1992). Chaos and Fractals: New Frontiers of Science.** Springer New York. [10.1007/978-1-4757-4740-9](https://doi.org/10.1007/978-1-4757-4740-9).

   Fractal computation and scaling frame finite-resolution escape-time visualization.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-4757-4740-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Fractals/Mandelbrot.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 0ea8fa62224aaa01c5462a7e7351ce0e7d28a8843d1a3b8004af36a20848bac5.

Original model citation: Wilensky, U. (1997).  NetLogo Mandelbrot model.  http://ccl.northwestern.edu/netlogo/models/Mandelbrot.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/mandelbrot.nlogox` and `evidence/computing/mandelbrot-info.txt`.
