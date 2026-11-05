# NetLogo reference snapshots

These source artifacts are retained for the authorized research/reference ports. They are not runtime experiment entrypoints. Discovery must require model.ts AND ui.ts rather than treat this directory as a runnable experiment.

- pinned/: exact upstream model bytes at NetLogo/models commit bf0626a89358b48494066862843a91f36f2556cf; Git blob hashes match upstream.
- web/: exact files fetched from netlogoweb.org on 2026-11-05, each declaring NetLogo 7.0.4.
- manifest.json: URLs, SHA-256 hashes, Git blob hashes and comparison results.
- model-audit.json: extracted view/control/plot definitions; an audit aid, not a new model specification.

Each model contains its complete original Info, citation, copyright and license notice. All four declare Creative Commons Attribution-NonCommercial-ShareAlike 3.0 (https://creativecommons.org/licenses/by-nc-sa/3.0/). Copyright Uri Wilensky: Preferential Attachment 2005; Voting 1998; Wolf Sheep Predation 1997; Wealth Distribution 1998. Preserve these notices and identify adaptations in derived reference models. This notice does not relicense independently authored general City Library code.

The upstream repository README says licenses vary by model and directs readers to each Info tab; it has no root LICENSE file at this revision. Source and model notices, not the NetLogo application license, are the basis of the model artifact attribution.

Pinned and web XML differ in declared version, serialization and trailing Info citation comments; the trimmed Procedures text and XML widget subtrees are equal for all four. This checks model files, not runtime engine compatibility or rendered behavior.
