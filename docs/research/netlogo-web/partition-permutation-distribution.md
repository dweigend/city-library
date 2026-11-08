# Partition Permutation Distribution

Status: complete. Scientific research checked 2026-11-05.

Does randomly building an integer total sample its mathematical partitions uniformly? NetLogo Partition Permutation Distribution repeatedly draws positive addends, retaining those that fit until the target sum is reached, then accumulates addend frequencies. A switch changes whether candidate values come from the remaining gap or the original range. Andrews [1] defines integer partitions, Hardy and Ramanujan [2] develop partition-count asymptotics, and Durrett [3] supplies the probability framework for analyzing the actual sampling procedure. These sources expose a crucial distinction: the baseline generates ordered construction histories with unequal probabilities, rather than enumerating unordered partitions uniformly. Histogram shape therefore reflects the stochastic algorithm as well as arithmetic constraints. The model illustrates how a shrinking sample space changes observed frequencies; it does not estimate the partition function merely by plotting successful addends.

## Scientific publications

1. **George E. Andrews (1984). The Theory of Partitions.** Cambridge University Press. [10.1017/cbo9780511608650](https://doi.org/10.1017/cbo9780511608650).

   Defines unordered integer partitions, clarifying what the teaching sampler does not enumerate uniformly.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2FCBO9780511608650). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **G. H. Hardy; S. Ramanujan (1918). Asymptotic Formulaae in Combinatory Analysis.** Proceedings of the London Mathematical Society. [10.1112/plms/s2-17.1.75](https://doi.org/10.1112/plms/s2-17.1.75).

   Original partition asymptotics provide a theoretical comparison to exact counting, rather than validation of the sampling algorithm.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1112%2Fplms%2Fs2-17.1.75). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Rick Durrett (2019). Probability: Theory and Examples.** Cambridge University Press. [10.1017/9781108591034](https://doi.org/10.1017/9781108591034).

   Conditional draws and induced sampling distributions explain bias from the diminishing remainder rule.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2F9781108591034). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Mathematics/Probability/ProbLab/Unverified/Partition%20Permutation%20Distribution.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 d19201a4109c7314ad2dd2bf26c00ea4631a6ee5a3ce4d096a4d7a4680815aa3.

Original model citation: Abrahamson, D. and Wilensky, U. (2004).  NetLogo Partition Permutation Distribution model.  http://ccl.northwestern.edu/netlogo/models/PartitionPermutationDistribution.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/partition-permutation-distribution.nlogox` and `evidence/computing/partition-permutation-distribution-info.txt`.
