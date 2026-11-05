# Random Combinations and Permutations

Status: complete. Scientific research checked 2026-11-05.

How do ordering and repeated symbols change the probability of a match? NetLogo Random Combinations and Permutations lets a user select a target configuration, then generates guesses and separately counts exact ordered matches and matches after disregarding order. Durrett [1] supplies finite probability spaces, Jaynes [2] grounds the explicit assignment of probabilities, and Stanley [3] develops enumerative combinatorics, directly grounding the multiplicities created when order is disregarded. The model's own terminology should therefore be interpreted from its comparison rules rather than assumed to match every textbook convention. The number of positions, available symbols, and repeated target symbols determine multiplicities and waiting times. Random search assumes the configured generator, not intelligent inference. Finite success counts fluctuate, and treating all unordered outcomes as equally likely can misrepresent the experiment.

## Scientific publications

1. **Rick Durrett (2019). Probability: Theory and Examples.** Cambridge University Press. [10.1017/9781108591034](https://doi.org/10.1017/9781108591034).

   Finite sample spaces and counting probabilities directly support ordered versus unordered matching.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2F9781108591034). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **E. T. Jaynes (2003). Probability Theory: The Logic of Science.** Cambridge University Press. [10.1017/cbo9780511790423](https://doi.org/10.1017/cbo9780511790423).

   Explicit probability assignments prevent confusing equally likely ordered guesses with equally likely outcome classes.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2FCBO9780511790423). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Richard P. Stanley (2011). Enumerative Combinatorics.** Cambridge University Press. [10.1017/cbo9781139058520](https://doi.org/10.1017/cbo9781139058520).

   Enumerative combinatorics supplies the direct counting framework for arrangements, repeated symbols and equivalence under permutation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2FCBO9781139058520). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Random%20Combinations%20and%20Permutations.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 a5c22544e455bb150941529bab9e2c3798fe73adf1fdeae92dc868c9e3ecef38.

Original model citation: Abrahamson, D. and Wilensky, U. (2004).  NetLogo Random Combinations and Permutations model.  http://ccl.northwestern.edu/netlogo/models/RandomCombinationsandPermutations.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/random-combinations-and-permutations.nlogox` and `evidence/computing/random-combinations-and-permutations-info.txt`.
