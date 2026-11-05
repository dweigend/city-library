# Tetris

Status: complete. Scientific research checked 2026-11-05.

Why can simple falling-piece rules create difficult sequential decisions? NetLogo Tetris drops tetrominoes into a finite well, permits translation and rotation, removes completed rows, and increases speed with progress. Breukelaar and colleagues [1] analyze the complexity of generalized offline Tetris, Szita and Lörincz [2] learn playing policies through noisy cross-entropy search, and Demaine and Demaine [3] study related polyomino-packing complexity. The baseline illustrates geometric constraints and the delayed consequences of each placement. Rotation conventions, piece sequence, available preview, starting debris, and scoring determine the actual task. Formal hardness on scalable boards with known future pieces does not make every human game equally difficult or establish the complexity of this fixed implementation. High scores from one strategy are performance observations under particular rules, rather than proof of optimal play.

## Scientific publications

1. **RON BREUKELAAR; ERIK D. DEMAINE; SUSAN HOHENBERGER; HENDRIK JAN HOOGEBOOM; WALTER A. KOSTERS; DAVID LIBEN-NOWELL (2004). TETRIS IS HARD, EVEN TO APPROXIMATE.** International Journal of Computational Geometry &amp; Applications. [10.1142/s0218195904001354](https://doi.org/10.1142/s0218195904001354).

   Original published complexity analysis directly addresses row clearing and survival in generalized Tetris, with offline and scalable-board assumptions.

   Verified 2026-11-05: [metadata and selected full-text sections](https://api.crossref.org/works/10.1142%2FS0218195904001354). Open institutional/author repository copy; selected sections read. Full-text access via publisher not established. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Abstract and introduction: offline information, scalable board, objectives and rule variants. The hardness results concern generalized offline tasks, and should not be described as a complexity proof for this fixed interactive NetLogo implementation.

2. **István Szita; András Lörincz (2006). Learning Tetris Using the Noisy Cross-Entropy Method.** Neural Computation. [10.1162/neco.2006.18.12.2936](https://doi.org/10.1162/neco.2006.18.12.2936).

   Original learning application shows how policy search can exploit the Tetris decision environment.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1162%2Fneco.2006.18.12.2936). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Erik D. Demaine; Martin L. Demaine (2007). Jigsaw Puzzles, Edge Matching, and Polyomino Packing: Connections and Complexity.** Graphs and Combinatorics. [10.1007/s00373-007-0713-4](https://doi.org/10.1007/s00373-007-0713-4).

   Polyomino-packing complexity supplies the related geometric-combinatorial context while lacking Tetris’s exact time and row-removal rules.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1007%2Fs00373-007-0713-4). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Games/Tetris.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 20d4006453b2882b36d6af0cf43dab2d520c5e786d38cbe885bebe45be5e8772.

Original model citation: Wilensky, U. (2001).  NetLogo Tetris model.  http://ccl.northwestern.edu/netlogo/models/Tetris.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/tetris.nlogox` and `evidence/computing/tetris-info.txt`.
