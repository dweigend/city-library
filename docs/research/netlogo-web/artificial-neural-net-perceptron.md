# Artificial Neural Net - Perceptron

Status: complete. Scientific research checked 2026-11-05.

Which Boolean distinctions can a single learned threshold represent? NetLogo Artificial Neural Net Perceptron trains weighted connections from two inputs and a bias to one output, comparing predictions with a selected target function. Rosenblatt [1] provides the original perceptron framework. Rumelhart and colleagues [2] establish a multilayer alternative, and Cybenko [3] analyzes the expressive power of networks with sigmoidal hidden units. These comparisons clarify why changing learning rate cannot make one linear separator represent exclusive OR. The baseline displays weights, classification boundaries, and training error under repeated examples. Inputs, thresholding, finite examples, and update rules are deliberate simplifications. Failure on a nonseparable task is a representational limitation rather than evidence of faulty training alone. The model illustrates supervised learning and its architectural constraints; it does not reproduce biological neural circuitry or demonstrate generalization to unseen datasets.

## Scientific publications

1. **F. Rosenblatt (1958). The perceptron: A probabilistic model for information storage and organization in the brain..** Psychological Review. [10.1037/h0042519](https://doi.org/10.1037/h0042519).

   Original threshold-learning architecture directly supports the baseline mechanism.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1037%2Fh0042519). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **David E. Rumelhart; Geoffrey E. Hinton; Ronald J. Williams (1986). Learning representations by back-propagating errors.** Nature. [10.1038/323533a0](https://doi.org/10.1038/323533a0).

   Multilayer backpropagation provides the scientifically relevant contrast to single-layer limitations.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1038%2F323533a0). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **G. Cybenko (1989). Approximation by superpositions of a sigmoidal function.** Mathematics of Control, Signals, and Systems. [10.1007/bf02551274](https://doi.org/10.1007/bf02551274).

   Approximation theory clarifies what adding nonlinear hidden units changes; it does not guarantee learning or generalization.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF02551274). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Artificial%20Neural%20Net%20-%20Perceptron.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 d9cd6c06309d80a0f6e0b48105912f23529c14ae63ee030152a7172cb60e13cb.

Original model citation: Rand, W. and Wilensky, U. (2006).  NetLogo Artificial Neural Net - Perceptron model.  http://ccl.northwestern.edu/netlogo/models/ArtificialNeuralNet-Perceptron.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/artificial-neural-net-perceptron.nlogox` and `evidence/computing/artificial-neural-net-perceptron-info.txt`.
