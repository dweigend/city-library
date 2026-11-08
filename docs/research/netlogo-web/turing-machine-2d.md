# Turing Machine 2D

Status: complete. Scientific research checked 2026-11-05.

How can small read-write agents perform complicated computation on a shared field? NetLogo Turing Machine 2D extends the tape idea to a two-dimensional patch array and potentially many heads. Each head follows a transition table determined by its internal state and the current patch value, changing state, writing, and choosing a movement direction. Turing [1] provides the foundational computational formalism; Langton's self-reproduction study [2] and artificial-life work [3] connect local machines with spatial construction and collective patterns. The NetLogo baseline is a finite multihead teaching variant, not Turing's original one-dimensional tape. Shared writes and head activation order can affect interactions. An intricate picture does not prove universal computation or successful parallelism. The simulation illustrates explicit state transitions and the consequences of allowing several processors to modify one environment.

## Scientific publications

1. **A. M. Turing (1937). On Computable Numbers, with an Application to the Entscheidungsproblem.** Proceedings of the London Mathematical Society. [10.1112/plms/s2-42.1.230](https://doi.org/10.1112/plms/s2-42.1.230).

   Foundational account of stateful read-write computation is the direct theoretical ancestor.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1112%2Fplms%2Fs2-42.1.230). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Introduction and section 1, pp. 230–231: machine state, scanned symbol, write/erase and tape movement. The original single-head tape formalism is distinct from the finite multihead two-dimensional teaching variant. The manuscript was received/read in 1936; the DOI record dates publication 1937.

2. **Christopher G. Langton (1984). Self-reproduction in cellular automata.** Physica D: Nonlinear Phenomena. [10.1016/0167-2789(84)90256-2](https://doi.org/10.1016/0167-2789(84)90256-2).

   Spatial self-reproduction by local computational rules supplies a relevant extension beyond a one-dimensional tape.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2F0167-2789%2884%2990256-2). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Christopher G Langton (1986). Studying artificial life with cellular automata.** Physica D: Nonlinear Phenomena. [10.1016/0167-2789(86)90237-x](https://doi.org/10.1016/0167-2789(86)90237-x).

   Artificial-life cellular systems connect the moving-head mechanism to emergent spatial organization.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2F0167-2789%2886%2990237-X). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Turing%20Machine%202D.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 a267a617dd79a3d90b3ee88ea573ade860949c740fbd7b7543f211b551f169be.

Original model citation: Wilensky, U. (2002).  NetLogo Turing Machine 2D model.  http://ccl.northwestern.edu/netlogo/models/TuringMachine2D.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/turing-machine-2d.nlogox` and `evidence/computing/turing-machine-2d-info.txt`.
