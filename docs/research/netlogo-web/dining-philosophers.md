# Dining Philosophers

Status: complete. Scientific research checked 2026-11-05.

How can independent processes share exclusive resources without becoming permanently blocked? NetLogo Dining Philosophers places agents and forks around a ring; agents alternate between thinking, hunger, and eating, requiring both adjacent forks to eat. Dijkstra [1] supplies the classic synchronization context, Coffman and colleagues [2] analyze deadlock, and Chandy and Misra [3] develop related distributed resource coordination. The NetLogo switch compares a naive acquisition rule with a cooperative marking protocol, starting from one distinguished fork. One randomly selected philosopher updates per tick, making scheduling part of the baseline. The experiment illustrates how local ownership rules can alter global progress and fairness. A run without deadlock is not a proof of starvation freedom, and symmetric initial conditions or a different scheduler may change behavior. The cooperative teaching rule should not be identified automatically with every published solution.

## Scientific publications

1. **E. W. Dijkstra (1971). Hierarchical ordering of sequential processes.** Acta Informatica. [10.1007/bf00289519](https://doi.org/10.1007/bf00289519).

   Foundational work on sequential-process ordering supplies the classic resource-sharing problem context.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF00289519). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **E. G. Coffman; M. Elphick; A. Shoshani (1971). System Deadlocks.** ACM Computing Surveys. [10.1145/356586.356588](https://doi.org/10.1145/356586.356588).

   Conditions for deadlock explain the failure mode of locally reasonable fork acquisition.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1145%2F356586.356588). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **K. M. Chandy; J. Misra (1984). The drinking philosophers problem.** ACM Transactions on Programming Languages and Systems. [10.1145/1780.1804](https://doi.org/10.1145/1780.1804).

   Related distributed philosopher problem provides a scientific comparison for marked resources and fairness, not an assertion of identical algorithms.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1145%2F1780.1804). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Dining%20Philosophers.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 94a061a1c0c2d8e69a8e6f3dfd4a154222d44d6676693cdc3430fb7e76d47e51.

Original model citation: Wilensky, U. (2003).  NetLogo Dining Philosophers model.  http://ccl.northwestern.edu/netlogo/models/DiningPhilosophers.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/dining-philosophers.nlogox` and `evidence/computing/dining-philosophers-info.txt`.
