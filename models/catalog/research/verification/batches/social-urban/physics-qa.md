# Physics literature consistency spot-check

Date: 2026-11-05. Read-only inspection requested by the research coordinator. This is an author-to-author literature/source consistency check, **not** independent implementation review or approval. No physics dossiers or runtime files were changed.

Scope: all B11–B15 titles/DOIs screened for conspicuous mismatch; detailed reading of `decay`, `gravitation`, `electrostatics`, `gaslab-isothermal-piston`, plus contextual checks of Fire, Percolation, Sand, Hydrogen Gas Production and Maxwell's Demon. Model evidence was read from the coordinator's retained served `.nlogox` files.

## Findings communicated to the coordinator

1. **Substantive source mismatch — GasLab Isothermal Piston.** The inspected mini-text described heat exchange or temperature control. The source's HOW TO USE IT instead states that execution pauses for piston relocation, collisions during piston manipulation are ignored, and energy/temperature remain artificially constant even for inward motion. Its `bounce` procedure reflects particle headings without changing speed at the piston. This is a simplified boundary relocation with omitted compression work, not an implemented thermal bath. Rewrite the scientific question/mechanism and make heat-conduction literature a physical contrast rather than an implemented mechanism. The coordinator acknowledged this correction and is applying it.

2. **Incorrect registered surname — Geiger/Marsden 1909.** `electrostatics` and `scattering` reproduced the Crossref typo `H. Gegier`. A successful institutional copy of the original text confirms `H. GEIGER` followed by `E. MARSDEN`, 1909, volume 82, pp. 495–500. Do not expand initials solely from this copy. Primary original-text URL: https://www.bo.infn.it/herab/people/zoccoli/didattica/esperimenti_fisica/E1.1_Scattering_Geiger%20%26%20Marsden%20Study%20Alpha%20Particle%20Scattering.pdf . Successful `web.open` evidence is retained at `evidence/social-urban/physics-qa-geiger-original.json`. Direct Royal Society fetches returned 403/unavailable; an indexed metadata record that repeats the typo is not independent confirmation.

3. **Relevance qualification — Gravitation.** The mini-text correctly distinguishes a prescribed central mass and test particles from reciprocal many-body dynamics. Newton is directly relevant; Wisdom–Holman and especially Barnes–Hut are comparisons from interacting gravitational systems, not algorithms implemented by this NetLogo model. The current contrast wording is honest, but a central-force/orbit-integration reference would better satisfy the request for three particularly relevant works. Barnes–Hut publisher abstract confirms an adaptive hierarchical N-body force calculation. No claim of an incorrect DOI is made.

4. **Title encoding — Maxwell's Demon/Szilard.** The displayed first publication title begins with the replacement character `�ber`. Restore the actual Unicode title against a primary record and note the source metadata repair. This is a bibliographic exactness issue, not a disputed physical mechanism.

## Bounded positive observations

- Decay accurately distinguishes per-step Bernoulli probability from a continuous exponential hazard, including the `-log(1-p)` mapping. The Rutherford–Soddy DOI/title/year match the RSC publisher's indexed primary page. The two Gillespie works are distinct verified publications and are explicitly used as stochastic-kinetics comparisons, not as assertions that the NetLogo code implements SSA. A radioactive-decay-specific statistical reference could improve the third choice, but no mismatch was established.
- Electrostatics accurately calls out the one-way imposed charge and the source's unconventional use of a direct `permittivity` multiplier. Rutherford/Geiger scattering work provides a physical application rather than implementation validation; Maxwell supplies the broader field framework.
- Fire explicitly distinguishes its density-controlled spread from Drossel–Schwabl regrowth/lightning and avoids equating the baseline with self-organized criticality.
- Percolation explicitly uses directed diagonal entry rather than importing Fire's undirected threshold.
- Sand clearly labels force-based granular papers as contrasts to occupancy-only lattice rules.

Limits: this spot-check does not reverify every physics citation online and does not independently approve all 50 dossiers. Primary access failures and successful original-text alternatives are recorded in `evidence/social-urban/physics-qa-*.json`. No scientific or implementation completeness is inferred merely from structural validator success.
