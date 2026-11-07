# Simple Genetic Algorithm

Status: complete. Scientific research checked 2026-11-05.

How do selection and variation search a space of binary strings? NetLogo Simple Genetic Algorithm evolves a population toward the all-ones string, using fitness based on the number of ones, reproduction, crossover, and mutation. Holland [1] supplies the foundational adaptation framework, Mitchell [2] explains representation and genetic operators, and Wolpert and Macready [3] limit claims that any optimizer is universally superior. The display follows the current best string while the population changes between generations. Population size and variation rates alter progress and diversity. The all-ones landscape is intentionally simple and separable; success here does not establish performance on deceptive, noisy, or constrained objectives. Stochastic runs can differ, and selecting a good parent does not guarantee a better child. The model illustrates fitness-driven search under a chosen encoding rather than a complete account of biological evolution.

## Scientific publications

1. **John H. Holland (1992). Adaptation in Natural and Artificial Systems: An Introductory Analysis with Applications to Biology, Control, and Artificial Intelligence.** The MIT Press. [10.7551/mitpress/1090.001.0001](https://doi.org/10.7551/mitpress/1090.001.0001).

   Foundational genetic adaptation theory supports the population, fitness and variation mechanism.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.7551%2Fmitpress%2F1090.001.0001). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Melanie Mitchell (1996). An Introduction to Genetic Algorithms.** The MIT Press. [10.7551/mitpress/3927.001.0001](https://doi.org/10.7551/mitpress/3927.001.0001).

   Scientific monograph explains algorithmic choices and how representation affects search.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.7551%2Fmitpress%2F3927.001.0001). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **D.H. Wolpert; W.G. Macready (1997). No free lunch theorems for optimization.** IEEE Transactions on Evolutionary Computation. [10.1109/4235.585893](https://doi.org/10.1109/4235.585893).

   Optimization limits directly qualify extrapolation from the easy all-ones objective to arbitrary problems.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1109%2F4235.585893). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Simple%20Genetic%20Algorithm.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 aa1d94df44a71c7cbe8b02d11a0ac1e027fa19294a0726c1a03913786175c67e.

Original model citation: Stonedahl, F. and Wilensky, U. (2008).  NetLogo Simple Genetic Algorithm model.  http://ccl.northwestern.edu/netlogo/models/SimpleGeneticAlgorithm.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/simple-genetic-algorithm.nlogox` and `evidence/computing/simple-genetic-algorithm-info.txt`.
