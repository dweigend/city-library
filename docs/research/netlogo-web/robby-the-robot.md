# Robby the Robot

Status: complete. Scientific research checked 2026-11-05.

How can evolutionary search improve a robot's behavior without directly programming a successful strategy? NetLogo Robby the Robot evolves lookup tables mapping local observations to actions in a can-collecting world. Mitchell's Complexity [1] describes Robby's original teaching example; Holland [2] supplies genetic-search foundations; Mitchell's genetic-algorithm monograph [3] develops selection, recombination, mutation, and evaluation. A strategy is tested through rewards for collecting cans and penalties for inappropriate actions or collisions. Reproduction changes the strategy population, while a separate demonstration shows one controller acting. Performance depends on the reward scheme, evaluation environments, population size, and evolutionary settings. The finite sensor table assumes local observations are sufficient for useful behavior and does not guarantee an optimal policy. Improvement on sampled rooms illustrates adaptation to a specified fitness test, rather than general robotic intelligence or unrestricted real-world transfer.

## Scientific publications

1. **Melanie Mitchell (2009). Complexity A Guided Tour.** Oxford University PressNew York, NY. [10.1093/oso/9780195124415.001.0001](https://doi.org/10.1093/oso/9780195124415.001.0001).

   Direct provenance: NetLogo Info identifies Mitchell’s Robby example and its strategy-table experiment.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1093%2Foso%2F9780195124415.001.0001). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **John H. Holland (1992). Adaptation in Natural and Artificial Systems: An Introductory Analysis with Applications to Biology, Control, and Artificial Intelligence.** The MIT Press. [10.7551/mitpress/1090.001.0001](https://doi.org/10.7551/mitpress/1090.001.0001).

   Genetic adaptation grounds selection, crossover and mutation of controller encodings.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.7551%2Fmitpress%2F1090.001.0001). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Melanie Mitchell (1996). An Introduction to Genetic Algorithms.** The MIT Press. [10.7551/mitpress/3927.001.0001](https://doi.org/10.7551/mitpress/3927.001.0001).

   Explains evaluation, representation choices and limitations of genetic search for behavior.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.7551%2Fmitpress%2F3927.001.0001). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Robby%20the%20Robot.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 ecaa2ce7c1d195fe6383354fc790025aa5c9d239f25f99f0fed71e04eaaf8d19.

Original model citation: Mitchell, M., Tisue, S. and Wilensky, U. (2012).  NetLogo Robby the Robot model.  http://ccl.northwestern.edu/netlogo/models/RobbytheRobot.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/robby-the-robot.nlogox` and `evidence/computing/robby-the-robot-info.txt`.
