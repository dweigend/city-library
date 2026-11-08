# Binomial Rabbits

Status: complete. Scientific research checked 2026-11-05.

Why can repeated random steps produce a stable population-level distribution? NetLogo Binomial Rabbits moves agents according to weighted hop patterns and plots accumulated displacements and averages. Wilensky's original educational study [1] is especially relevant: the model preserves a student's construction developed while reasoning about normality. Durrett [2] supplies probability foundations for sums of independent increments, and Berry [3] identifies conditions affecting normal approximation error. The model allows more than two hop patterns, so not every setting is literally a binomial experiment. Step magnitudes, relative weights, and hop count determine the distribution. Finite populations and discrete supports remain visible, and correlations or altered rules can invalidate simple limiting arguments. The rabbits represent repeated sampling rather than organisms with heredity or growth; a familiar-looking histogram does not explain human height without additional biological assumptions.

## Scientific publications

1. **Uri Wilensky (1997). What is Normal Anyway? Therapy for Epistemological Anxiety.** Educational Studies in Mathematics. [10.1023/a:1002935313957](https://doi.org/10.1023/a:1002935313957).

   Direct research provenance: the original educational case discusses the student reasoning behind this model.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1023%2FA%3A1002935313957). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Rick Durrett (2019). Probability: Theory and Examples.** Cambridge University Press. [10.1017/9781108591034](https://doi.org/10.1017/9781108591034).

   Random-walk sums, expectations and limiting distributions support the hop mechanism.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2F9781108591034). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Andrew C. Berry (1941). The accuracy of the Gaussian approximation to the sum of independent variates.** Transactions of the American Mathematical Society. [10.1090/s0002-9947-1941-0003498-3](https://doi.org/10.1090/s0002-9947-1941-0003498-3).

   Finite-sample Gaussian approximation provides a precise limit on interpreting bell-shaped displacement distributions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1090%2FS0002-9947-1941-0003498-3). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/Binomial%20Rabbits.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 e40418be852b206f11c8dec06eabd1923b384ef113f61e6612d813b27f480e17.

Original model citation: Wilensky, U. (1997).  NetLogo Binomial Rabbits model.  http://ccl.northwestern.edu/netlogo/models/BinomialRabbits.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/binomial-rabbits.nlogox` and `evidence/computing/binomial-rabbits-info.txt`.
