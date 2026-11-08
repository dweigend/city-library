# Lunar Lander

Status: complete. Scientific research checked 2026-11-05.

How does directing thrust trade off position correction against a safe descent? NetLogo Lunar Lander lets a player rotate a module and fire a thruster while gravity accelerates it toward generated terrain. A successful landing requires reaching the pad with sufficiently gentle motion. Acikmese and Ploen [1] develop constrained powered-descent guidance, Betts [2] surveys trajectory optimization methods, and Yang and Liu [3] examine fuel-optimal descent with path constraints. These are relevant scientific comparisons, not algorithms claimed to run inside the arcade baseline. The NetLogo model simplifies vehicle dynamics, terrain, and collision geometry; its Info explicitly notes omitted edge collisions. Thrust, attitude, and landing thresholds are discrete teaching rules without mission-calibrated parameters. The simulation illustrates feedback control and competing constraints, while success in the game does not validate a spacecraft guidance system.

## Scientific publications

1. **Behcet Acikmese; Scott R. Ploen (2007). Convex Programming Approach to Powered Descent Guidance for Mars Landing.** Journal of Guidance, Control, and Dynamics. [10.2514/1.27553](https://doi.org/10.2514/1.27553).

   Powered-descent optimization provides the direct aerospace comparison for thrust and landing constraints.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.2514%2F1.27553). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **John T. Betts (1998). Survey of Numerical Methods for Trajectory Optimization.** Journal of Guidance, Control, and Dynamics. [10.2514/2.4231](https://doi.org/10.2514/2.4231).

   Trajectory optimization methods clarify what a formally optimized guidance solution would require beyond manual control.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.2514%2F2.4231). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Runqiu Yang; Xinfu Liu (2020). Fuel-optimal powered descent guidance with free final-time and path constraints.** Acta Astronautica. [10.1016/j.actaastro.2020.03.025](https://doi.org/10.1016/j.actaastro.2020.03.025).

   Free-final-time and path-constraint research highlights assumptions absent from the simplified arcade dynamics.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2Fj.actaastro.2020.03.025). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Games/Lunar%20Lander.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 16d4c632d0964fea98612f3aa2154094ca785e3fc4748075f8f95f42196f75c0.

Original model citation: Wilensky, U. (2005).  NetLogo Lunar Lander model.  http://ccl.northwestern.edu/netlogo/models/LunarLander.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/lunar-lander.nlogox` and `evidence/computing/lunar-lander-info.txt`.
