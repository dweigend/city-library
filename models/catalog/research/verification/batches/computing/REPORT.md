# Scientific research batch B16–B20

Checked: 5 November 2026. Scope: immutable selection orders 151–200, exactly 50 selected models. All paired `<slug>.json` and `<slug>.md` dossiers are complete under the research criteria; no implementation, browser acceptance or independent implementation review is claimed.

- 50 complete dossiers; 0 incomplete in this assignment.
- Exactly 3 unique verified publications per dossier: 150 citation placements, representing 92 distinct publications.
- English mini-texts contain 122–138 whitespace-delimited words.
- 50 served original NetLogo XML files and extracted Info texts were retained, including source URLs, NetLogo 7.0.4 declaration and SHA-256 checks.
- Primary DOI registrant metadata was retrieved and retained for every selected publication; SmoothLife uses DataCite/arXiv because its originating work is a preprint. It is identified as a preprint, without a peer-review claim.
- Selected full-text sections were read for 7 cited works. One additional cyclic-automata chapter was consulted as background without becoming a fourth dossier publication. Exact consulted sections, URLs, observations and retrieval hashes appear in `original-reading-notes.json`. Metadata-only evidence remains explicitly distinguished from full-text reading for the other publications. The downloaded literature working copies were removed; their contents are not redistributed.
- Contributor lists preserve initials where the primary record does not expand names. Edited works have an explicit contributor-role field. Book subtitles were reconciled; Spatial Tessellations was additionally checked on Wiley's book page. Two IEEE conference records omit publication dates; the original NetLogo reference/event identity corroborates 1995, and the registered event name corroborates 1998.

`validation.json` records per-model word counts, three-source uniqueness and source-hash checks. `qa.py` performs author QA within the assigned file range and regenerates only these dossier Markdown companions. It does not update the global ledger.

Substantive baseline distinctions recorded include finite-step outward drift in Vector Fields, raster rather than exact-polygon Voronoi construction, correlated walking in Expected Value, nonuniform construction-history sampling in Partition Permutation Distribution, changed scheduling in State Machine Example, discrete-time finite-grid SmoothLife, toroidal/discrete-objective PSO adaptations, and the distinction between generalized offline Tetris hardness and a particular interactive game.

All writes stayed within the assigned research directory. No Git or GitHub mutations, runtime/UI changes, TypeScript changes or browser checks were performed by this research batch.
