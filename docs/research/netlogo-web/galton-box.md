# Galton Box

Status: complete. Scientific research checked 2026-11-05.

How do repeated binary choices build a bell-shaped histogram? NetLogo Galton Box drops balls through rows of pegs, choosing left or right with a controllable probability and accumulating destination counts. Durrett [1] supplies binomial and limit-theorem foundations; Berry [2] quantifies approximation of sums by a Gaussian distribution; Wilensky [3] examines learning about normality through constructive simulation. The baseline illustrates how many paths can reach the same final position and how bias shifts the resulting distribution. Its decisions are probabilistic rules rather than simulated impacts with friction or elasticity. A finite number of rows gives a discrete distribution, while finite ball counts create sampling noise. Pile-up and display capacity also affect what remains visible. A normal approximation is conditional on the sum structure and parameter regime, rather than a universal property of random movement.

## Scientific publications

1. **Rick Durrett (2019). Probability: Theory and Examples.** Cambridge University Press. [10.1017/9781108591034](https://doi.org/10.1017/9781108591034).

   Independent Bernoulli sums explain the discrete destination distribution.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2F9781108591034). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Andrew C. Berry (1941). The accuracy of the Gaussian approximation to the sum of independent variates.** Transactions of the American Mathematical Society. [10.1090/s0002-9947-1941-0003498-3](https://doi.org/10.1090/s0002-9947-1941-0003498-3).

   Gaussian approximation error is directly relevant to interpreting a finite-row histogram.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1090%2FS0002-9947-1941-0003498-3). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Uri Wilensky (1997). What is Normal Anyway? Therapy for Epistemological Anxiety.** Educational Studies in Mathematics. [10.1023/a:1002935313957](https://doi.org/10.1023/a:1002935313957).

   Research on constructive explanations of normal distributions connects the simulation to its educational mechanism.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1023%2FA%3A1002935313957). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/Galton%20Box.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 39df3f1d9edd12a141f62c3cd36ae1ae5c62d5dab72750c55ad66e2374229fd4.

Original model citation: Wilensky, U. (2002).  NetLogo Galton Box model.  http://ccl.northwestern.edu/netlogo/models/GaltonBox.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/galton-box.nlogox` and `evidence/computing/galton-box-info.txt`.
