# Stochastic Patchwork

Status: complete. Scientific research checked 2026-11-05.

How is the variability of a sample proportion related to the number of independent trials? NetLogo Stochastic Patchwork repeatedly recolors a selected block of patches using the same target probability, then accumulates the fraction in the target color. Durrett [1] grounds the resulting Bernoulli sum and its mean, Berry [2] frames finite-sample Gaussian approximation, and Wilensky [3] connects constructive simulation with understanding distributional regularity. Larger blocks average more local random decisions, while changing the target probability changes both the mean and variability. Spatial adjacency is visual organization: the baseline color draws do not copy neighboring colors. Repeated histograms therefore illustrate sampling distributions rather than spatial contagion. Finite samples, discrete proportions, and probabilities close to zero or one limit bell-curve intuition. The experiment provides no evidence that a real spatial population has independent observations.

## Scientific publications

1. **Rick Durrett (2019). Probability: Theory and Examples.** Cambridge University Press. [10.1017/9781108591034](https://doi.org/10.1017/9781108591034).

   Independent Bernoulli sums determine the block’s sample proportion and variance.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2F9781108591034). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Andrew C. Berry (1941). The accuracy of the Gaussian approximation to the sum of independent variates.** Transactions of the American Mathematical Society. [10.1090/s0002-9947-1941-0003498-3](https://doi.org/10.1090/s0002-9947-1941-0003498-3).

   Approximation error clarifies when a finite-sample proportion histogram can look Gaussian.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1090%2FS0002-9947-1941-0003498-3). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Uri Wilensky (1997). What is Normal Anyway? Therapy for Epistemological Anxiety.** Educational Studies in Mathematics. [10.1023/a:1002935313957](https://doi.org/10.1023/a:1002935313957).

   Constructive educational research supports interpreting global regularity through repeated local random events.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1023%2FA%3A1002935313957). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Stochastic%20Patchwork.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 17ed2522164bcf7e92ffb5665b3c9a427640fbf7908ef332e985f8b06db99b2f.

Original model citation: Abrahamson, D. and Wilensky, U. (2004).  NetLogo Stochastic Patchwork model.  http://ccl.northwestern.edu/netlogo/models/StochasticPatchwork.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/stochastic-patchwork.nlogox` and `evidence/computing/stochastic-patchwork-info.txt`.
