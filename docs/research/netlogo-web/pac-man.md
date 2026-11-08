# Pac-Man

Status: complete. Scientific research checked 2026-11-05.

How should an agent balance collecting rewards with avoiding pursuit in a changing maze? NetLogo Pac-Man combines navigation, pellets, pursuing ghosts, temporary power effects, lives, and level progression. Pepels and colleagues [1] study real-time Monte Carlo planning in Ms Pac-Man, Gan and colleagues [2] develop another real-time search approach, and Bellemare and colleagues [3] frame arcade games as controlled evaluation environments. These publications motivate scientific questions about action selection and benchmarking; the NetLogo game does not thereby implement their planners. The concrete rules for ghost behavior, movement timing, power duration, scoring, and resetting define this baseline. Related arcade environments can differ materially, so scores are not interchangeable. The simulation illustrates an interactive decision process with competing short-term goals rather than a validated model of human strategy or evidence of general intelligence.

## Scientific publications

1. **Tom Pepels; Mark H. M. Winands; Marc Lanctot (2014). Real-Time Monte Carlo Tree Search in Ms Pac-Man.** IEEE Transactions on Computational Intelligence and AI in Games. [10.1109/tciaig.2013.2291577](https://doi.org/10.1109/tciaig.2013.2291577).

   Original Ms Pac-Man planning research is a close scientific application; its MCTS controller is distinct from NetLogo’s built-in game rules.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1109%2FTCIAIG.2013.2291577). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Xiaocong Gan; Yun Bao; Zhangang Han (2011). Real-Time Search Method in Nondeterministic Game — Ms. Pac-Man.** ICGA Journal. [10.3233/icg-2011-34404](https://doi.org/10.3233/icg-2011-34404).

   Independent real-time search work supports analysis of decisions under time pressure and uncertain opponent behavior.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.3233%2FICG-2011-34404). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **M. G. Bellemare; Y. Naddaf; J. Veness; M. Bowling (2013). The Arcade Learning Environment: An Evaluation Platform for General Agents.** Journal of Artificial Intelligence Research. [10.1613/jair.3912](https://doi.org/10.1613/jair.3912).

   Arcade evaluation methodology explains why fixed rules and reproducible scoring matter when comparing agents.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1613%2Fjair.3912). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Games/Pac-Man.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 5b31ca1dff490dca1665a5410903dc6db352628332c7ceee8655e235cf786892.

Original model citation: Wilensky, U. (2001).  NetLogo Pac-Man model.  http://ccl.northwestern.edu/netlogo/models/Pac-Man.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/pac-man.nlogox` and `evidence/computing/pac-man-info.txt`.
