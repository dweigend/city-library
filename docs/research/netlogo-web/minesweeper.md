# Minesweeper

Status: complete. Scientific research checked 2026-11-05.

What can local numerical clues reveal about hidden global arrangements? NetLogo Minesweeper hides mines on a grid, reveals neighboring mine counts after safe clicks, and expands empty regions automatically. Winning requires uncovering every safe square; a mine click ends the game. Kaye [1] establishes the computational difficulty of a formal consistency problem, Golan [2] studies graph structure and tractable cases, and Jaynes [3] supplies probabilistic reasoning when clues do not determine a unique safe action. The interactive baseline illustrates constraints, partial information, and the distinction between deduction and risk. Its fixed board generation, finite size, and neighborhood definition matter. Worst-case complexity theorems concern generalized problem families, not the difficulty of each displayed board. The game is a computational illustration and provides no model of physical mine detection or humanitarian clearance performance.

## Scientific publications

1. **Richard Kaye (2000). Minesweeper is NP-complete.** The Mathematical Intelligencer. [10.1007/bf03025367](https://doi.org/10.1007/bf03025367).

   Direct original proof establishes generalized Minesweeper consistency complexity, with appropriate worst-case limits.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2FBF03025367). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Shahar Golan (2011). Minesweeper on graphs.** Applied Mathematics and Computation. [10.1016/j.amc.2011.01.046](https://doi.org/10.1016/j.amc.2011.01.046).

   Graph-based analysis links solvability and counting to structural restrictions such as bounded treewidth.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2Fj.amc.2011.01.046). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **E. T. Jaynes (2003). Probability Theory: The Logic of Science.** Cambridge University Press. [10.1017/cbo9780511790423](https://doi.org/10.1017/cbo9780511790423).

   Conditional probability supports risk assessment when multiple hidden boards satisfy the visible clues.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1017%2FCBO9780511790423). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Games/Minesweeper.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 82dcfd1e9c4cfcacfdb2a71738ffe72293d81ab42b3658547075c397d8decfbf.

Original model citation: Wilensky, U. (2005).  NetLogo Minesweeper model.  http://ccl.northwestern.edu/netlogo/models/Minesweeper.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/minesweeper.nlogox` and `evidence/computing/minesweeper-info.txt`.
