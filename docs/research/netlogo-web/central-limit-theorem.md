# Central Limit Theorem

Status: complete. Scientific research checked 2026-11-05.

Why can repeated sample means look more regular than the population they summarize? NetLogo Central Limit Theorem builds a bounded population, repeatedly selects groups, and records their sums and means. Lindeberg [1] supplies an original limit-theorem contribution, Durrett [2] presents the probability framework and assumptions, and Berry [3] addresses finite-sample approximation error. Changing the population shape and sample size makes the distinction between individual values and distributions of averages visible. The simulation uses a finite population and an explicit selection procedure; replacement rules and dependence must be considered before applying an independent-sample theorem literally. A larger sample does not make the original population normal. The experiment illustrates convergence ideas and sampling variability under controlled assumptions, while finite histograms alone cannot prove a limiting theorem or establish its applicability to arbitrary real datasets.

## Scientific publications

1. **J. W. Lindeberg (1922). Eine neue Herleitung des Exponentialgesetzes in der Wahrscheinlichkeitsrechnung.** Mathematische Zeitschrift. [10.1007/bf01494395](https://doi.org/10.1007/bf01494395).

   Original mathematical limit-theorem work anchors the theoretical concept illustrated.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF01494395). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Rick Durrett (2019). Probability: Theory and Examples.** Cambridge University Press. [10.1017/9781108591034](https://doi.org/10.1017/9781108591034).

   Modern treatment distinguishes population distributions, sample means, independence and finite-population sampling.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2F9781108591034). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Andrew C. Berry (1941). The accuracy of the Gaussian approximation to the sum of independent variates.** Transactions of the American Mathematical Society. [10.1090/s0002-9947-1941-0003498-3](https://doi.org/10.1090/s0002-9947-1941-0003498-3).

   Finite-sample error bounds explain why apparent normality depends on more than increasing repetitions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1090%2FS0002-9947-1941-0003498-3). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Central%20Limit%20Theorem.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 0b28357e33b60122cadc80abdc4826cd000f8fbcdf18a67eed9c75053cced92c.

Original model citation: Abrahamson, D. and Wilensky, U. (2005).  NetLogo Central Limit Theorem model.  http://ccl.northwestern.edu/netlogo/models/CentralLimitTheorem.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/central-limit-theorem.nlogox` and `evidence/computing/central-limit-theorem-info.txt`.
