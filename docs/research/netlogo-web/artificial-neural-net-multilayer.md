# Artificial Neural Net - Multilayer

Status: complete. Scientific research checked 2026-11-05.

How does adding nonlinear hidden units change what a small network can learn? NetLogo Artificial Neural Net Multilayer propagates weighted inputs through a hidden layer and sigmoid activations, then adjusts weights using supervised errors. Rosenblatt [1] supplies the single-perceptron reference point, Rumelhart and colleagues [2] establish backpropagation learning, and Cybenko [3] provides a theoretical account of approximation by sigmoidal networks. The teaching example makes the architectural contrast with exclusive OR visible: hidden representations can separate cases that one linear threshold cannot. Random initial weights, learning rate, hidden structure, and the finite training sequence affect progress. Expressive capacity is distinct from successful optimization, and decreasing training error alone does not establish generalization. The baseline illustrates a deliberately small learning mechanism rather than modern large-scale neural training or a physiological model of a brain.

## Scientific publications

1. **F. Rosenblatt (1958). The perceptron: A probabilistic model for information storage and organization in the brain..** Psychological Review. [10.1037/h0042519](https://doi.org/10.1037/h0042519).

   The original threshold model supplies the baseline whose linear limitation motivates a hidden layer.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1037%2Fh0042519). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **David E. Rumelhart; Geoffrey E. Hinton; Ronald J. Williams (1986). Learning representations by back-propagating errors.** Nature. [10.1038/323533a0](https://doi.org/10.1038/323533a0).

   Direct foundational method for error-based weight updates through multilayer representations.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1038%2F323533a0). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **G. Cybenko (1989). Approximation by superpositions of a sigmoidal function.** Mathematics of Control, Signals, and Systems. [10.1007/bf02551274](https://doi.org/10.1007/bf02551274).

   Sigmoidal approximation theory connects nonlinear hidden units with increased expressive capacity, without guaranteeing convergence.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF02551274). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Artificial%20Neural%20Net%20-%20Multilayer.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 dec9e3394cde9d0fae15d15a0e75763f854dd908e00804924667e92e8211d4e9.

Original model citation: Rand, W. and Wilensky, U. (2006).  NetLogo Artificial Neural Net - Multilayer model.  http://ccl.northwestern.edu/netlogo/models/ArtificialNeuralNet-Multilayer.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/artificial-neural-net-multilayer.nlogox` and `evidence/computing/artificial-neural-net-multilayer-info.txt`.
