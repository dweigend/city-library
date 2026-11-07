# State Machine Example

Status: complete. Scientific research checked 2026-11-05.

What changes when an agent's ongoing behavior is represented as explicit states? NetLogo State Machine Example rewrites the Termites model so each agent stores a task and advances through it under an observer-controlled update. Mealy [1] supplies foundational finite-state machine theory, Dijkstra [2] explains why process ordering matters, and Resnick [3] studies decentralized computational microworlds and the interpretation of collective order. The original Info warns that this version is not behaviorally identical to the turtle-forever-button implementation because the unit of an agent's turn differs. The model therefore illustrates both state decomposition and scheduler semantics. Local chip-handling actions can organize piles without a central plan, but changing execution granularity can change transients. A visually similar final configuration is insufficient to establish equivalent trajectories or a scientifically calibrated model of termite construction.

## Scientific publications

1. **George H. Mealy (1955). A method for synthesizing sequential circuits.** The Bell System Technical Journal. [10.1002/j.1538-7305.1955.tb03788.x](https://doi.org/10.1002/j.1538-7305.1955.tb03788.x).

   Foundational state-machine formalism supports encoding behavior as states and transitions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1002%2Fj.1538-7305.1955.tb03788.x). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **E. W. Dijkstra (1971). Hierarchical ordering of sequential processes.** Acta Informatica. [10.1007/bf00289519](https://doi.org/10.1007/bf00289519).

   Sequential-process ordering provides the direct methodological context for scheduler and execution-granularity differences.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF00289519). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Mitchel Resnick (1996). Beyond the Centralized Mindset.** Journal of the Learning Sciences. [10.1207/s15327809jls0501_1](https://doi.org/10.1207/s15327809jls0501_1).

   Original research on decentralized microworlds explains how local rules can produce aggregate organization without centralized direction.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1207%2Fs15327809jls0501_1). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Code%20Examples/State%20Machine%20Example.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 fcd207f3584023fd50a45a304c87aa46fa541ce8a7e3ce339e3308894fc958cc.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/state-machine-example.nlogox` and `evidence/computing/state-machine-example-info.txt`.
