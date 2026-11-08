# Simulated Annealing

Status: complete. Scientific research checked 2026-11-05.

Can accepting temporary deterioration help escape a poor local optimum? NetLogo Simulated Annealing swaps neighboring black and white pixels while minimizing an energy that favors vertical stripes. Kirkpatrick and colleagues [1] introduce annealing as an optimization method, Černý [2] independently develops the thermodynamic approach, and Metropolis and colleagues [3] provide the stochastic acceptance foundation. Temperature controls willingness to accept worse moves, and a cooling schedule gradually restricts exploration. The original model also exposes whether equal-energy changes are accepted. Swapping preserves color counts, so the search occurs within a constrained configuration space rather than all possible images. Cooling too quickly can leave defects or local traps. The simulation illustrates the tradeoff between exploration and stabilization; a low-energy image from one finite run is not a guarantee of a global optimum or a physical material prediction.

## Scientific publications

1. **S. Kirkpatrick; C. D. Gelatt; M. P. Vecchi (1983). Optimization by Simulated Annealing.** Science. [10.1126/science.220.4598.671](https://doi.org/10.1126/science.220.4598.671).

   Original optimization work directly grounds temperature-controlled acceptance and cooling.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1126%2Fscience.220.4598.671). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **V. Černý (1985). Thermodynamical approach to the traveling salesman problem: An efficient simulation algorithm.** Journal of Optimization Theory and Applications. [10.1007/bf00940812](https://doi.org/10.1007/bf00940812).

   Independent thermodynamic optimization development supports the method beyond the particular image objective.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF00940812). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Nicholas Metropolis; Arianna W. Rosenbluth; Marshall N. Rosenbluth; Augusta H. Teller; Edward Teller (1953). Equation of State Calculations by Fast Computing Machines.** The Journal of Chemical Physics. [10.1063/1.1699114](https://doi.org/10.1063/1.1699114).

   Stochastic energy-based acceptance is the foundational mechanism adapted by annealing.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1063%2F1.1699114). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Unverified/Simulated%20Annealing.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 ca4208f3c66a516874234d4f1670ebc20919f9b32a656a84a878a9a41304f6cb.

Original model citation: Stonedahl, F. and Wilensky, U. (2009).  NetLogo Simulated Annealing model.  http://ccl.northwestern.edu/netlogo/models/SimulatedAnnealing.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/simulated-annealing.nlogox` and `evidence/computing/simulated-annealing-info.txt`.
