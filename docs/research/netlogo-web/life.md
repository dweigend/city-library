# Life

Status: complete. Scientific research checked 2026-11-05.

How can a fixed local rule generate persistent structures and apparently purposeful motion? NetLogo Life implements Conway's binary cellular automaton: a dead cell is born with three living neighbors, while a living cell survives with two or three. Neighbor counts are computed before any cell changes, preserving synchronous generations on the model's wrapping square lattice. Gardner's original exposition [1] supplies the historical rule context; Wolfram [2] places such local deterministic systems within statistical studies of cellular automata; Adamatzky's edited research volume [3] develops their computational and organizational implications. Random initial density and manually drawn patterns expose extinction, oscillation, and moving configurations. The finite torus, discrete time, and deliberately abstract states are essential assumptions. These patterns illustrate rule-driven emergence and sensitivity to initial conditions, rather than biological population dynamics or empirical validation.

## Scientific publications

1. **Martin Gardner (1970). Mathematical Games.** Scientific American. [10.1038/scientificamerican1070-120](https://doi.org/10.1038/scientificamerican1070-120).

   Original published introduction of Conway’s rule and its emergent patterns; the DOI record indexes the exact article title as Mathematical Games.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1038%2Fscientificamerican1070-120). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Original exposition, pp. 120–123: rules and simultaneous generations. The original exposition uses an infinite checkerboard; NetLogo uses a finite wrapping lattice. Rule agreement therefore does not imply identical long-term boundary behavior.

2. **Stephen Wolfram (1983). Statistical mechanics of cellular automata.** Reviews of Modern Physics. [10.1103/revmodphys.55.601](https://doi.org/10.1103/revmodphys.55.601).

   Connects deterministic local update rules to collective cellular-automaton behavior; provides a methodological framework rather than validation of Life as biology.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1103%2FRevModPhys.55.601). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Andrew Adamatzky (editor) (2010). Game of Life Cellular Automata.** Springer London. [10.1007/978-1-84996-217-9](https://doi.org/10.1007/978-1-84996-217-9).

   Research monograph on Life patterns, computation and complexity; supports interpretation of moving and persistent configurations. Adamatzky is the editor, not sole chapter author.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2F978-1-84996-217-9). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/Life.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 fa55f68a3f00b9aba56b384954db875e6d3b55ea318384eecae0561c36892802.

Original model citation: Wilensky, U. (1998).  NetLogo Life model.  http://ccl.northwestern.edu/netlogo/models/Life.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

Info credits John Conway and Martin Gardner; NetLogo model citation is Uri Wilensky (1998). This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/life.nlogox` and `evidence/computing/life-info.txt`.
