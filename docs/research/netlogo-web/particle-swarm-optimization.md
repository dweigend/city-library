# Particle Swarm Optimization

Status: complete. Scientific research checked 2026-11-05.

How can shared memories guide a population toward high-valued locations? NetLogo Particle Swarm Optimization gives each particle a position, velocity, personal best, and information about the swarm's best discovery. Kennedy and Eberhart [1] provide the originating algorithm, Shi and Eberhart [2] modify velocity control, and Clerc and Kennedy [3] analyze stability and convergence. Their work frames the balance between exploration and attraction to previously successful positions. The NetLogo Info explicitly describes adaptations for a wrapping two-dimensional world and a grid-valued objective, so it is a principle demonstration rather than an exact numerical replica of the original optimizer. Velocity settings, random influences, initialization, and the landscape affect success. Reaching a good displayed peak does not prove global optimality or validate the same parameters for continuous high-dimensional optimization.

## Scientific publications

1. **J. Kennedy; R. Eberhart (1995). Particle swarm optimization.** Proceedings of ICNN'95 - International Conference on Neural Networks. [10.1109/icnn.1995.488968](https://doi.org/10.1109/icnn.1995.488968).

   Originating particle-swarm algorithm gives personal and collective best-memory attraction. Year 1995 is corroborated by the original NetLogo Info and ICNN-95 proceedings identity; Crossref date is absent.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1109%2FICNN.1995.488968). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text. Publication year 1995 corroborated by original NetLogo Info reference and registered ICNN-95 event identity; Crossref published dates are absent.   

2. **Y. Shi; R. Eberhart (1998). A modified particle swarm optimizer.** 1998 IEEE International Conference on Evolutionary Computation Proceedings. IEEE World Congress on Computational Intelligence (Cat. No.98TH8360). [10.1109/icec.1998.699146](https://doi.org/10.1109/icec.1998.699146).

   Velocity-control modification is directly relevant to exploration and convergence; year 1998 is explicit in the registered event name.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1109%2FICEC.1998.699146). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text. Publication year 1998 corroborated by registered event name; Crossref published dates are absent.   

3. **M. Clerc; J. Kennedy (2002). The particle swarm - explosion, stability, and convergence in a multidimensional complex space.** IEEE Transactions on Evolutionary Computation. [10.1109/4235.985692](https://doi.org/10.1109/4235.985692).

   Stability analysis qualifies claims about particle movement and convergence, especially under NetLogo’s altered boundary conditions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1109%2F4235.985692). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Particle%20Swarm%20Optimization.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 d03ded09553798a66fa7c70ee9aef25d5852dba403cdf388c4bcd2dd7a3b6d0e.

Original model citation: Stonedahl, F. and Wilensky, U. (2008).  NetLogo Particle Swarm Optimization model.  http://ccl.northwestern.edu/netlogo/models/ParticleSwarmOptimization.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/particle-swarm-optimization.nlogox` and `evidence/computing/particle-swarm-optimization-info.txt`.
