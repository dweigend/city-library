# Expected Value

Status: complete. Scientific research checked 2026-11-05.

How can uncertain individual outcomes yield a predictable average value? NetLogo Expected Value assigns numerical values to patches according to chosen ratios, calculates a probability-weighted expectation, and lets a moving sampler collect values into repeated totals. Jaynes [1] supplies the weighted-expectation interpretation, Durrett [2] formalizes means and dependence, and Wilensky [3] provides relevant research on learning statistical regularities through simulation. The original Procedures use a local walk for the sampler; successive observations need not be independent draws from the whole patch population. Consequently, finite-run agreement depends on spatial arrangement and movement as well as assigned proportions. The simulation illustrates the distinction between an outcome's probability and its numerical worth. It does not make the expected value a guaranteed payoff, nor does a matching long-run mean alone establish unbiased or independent sampling.

## Scientific publications

1. **E. T. Jaynes (2003). Probability Theory: The Logic of Science.** Cambridge University Press. [10.1017/cbo9780511790423](https://doi.org/10.1017/cbo9780511790423).

   Probability-weighted values provide the direct meaning of expectation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2FCBO9780511790423). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Rick Durrett (2019). Probability: Theory and Examples.** Cambridge University Press. [10.1017/9781108591034](https://doi.org/10.1017/9781108591034).

   Dependence and averaging are essential because the original sampler follows a local walk.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2F9781108591034). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Uri Wilensky (1997). What is Normal Anyway? Therapy for Epistemological Anxiety.** Educational Studies in Mathematics. [10.1023/a:1002935313957](https://doi.org/10.1023/a:1002935313957).

   Research on constructive statistical reasoning supports comparison of local outcomes and aggregate distributions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1023%2FA%3A1002935313957). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Expected%20Value.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 84883dc6b6538fd5d9e04e61cc68a01cec5c11a528aaab5a84250908425b98eb.

Original model citation: Abrahamson, D. and Wilensky, U. (2004).  NetLogo Expected Value model.  http://ccl.northwestern.edu/netlogo/models/ExpectedValue.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/expected-value.nlogox` and `evidence/computing/expected-value-info.txt`.
