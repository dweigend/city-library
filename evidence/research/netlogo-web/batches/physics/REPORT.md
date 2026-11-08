# Physics and chemistry research report

B11–B15: all 50 assigned dossiers are complete, with 150 publication assignments and 98 distinct DOI-identified works. Mini-texts contain 103–139 whitespace-delimited words. Each model has three distinct scientific publications and its exact served NetLogo source, including Info and Procedures, archived under `evidence/physics/`.

Bibliographic verification uses live primary DOI-registrant records. This proves the recorded metadata, not a claim to have read inaccessible full publications. Some records include publisher-deposited abstracts; additional publisher abstracts and accessible original sections were consulted and identified individually. Access failures remain visible in evidence logs. Reprints/translations are distinguished from historical theory dates.

Documented corrections and interpretation decisions:

- The isothermal piston has no implemented heat bath: simulation pauses for repositioning and work is omitted. Its artificial constant-energy convention is explained explicitly.
- The 1909 scattering record misspells Geiger as “Gegier”. The institutional original-text copy credits H. Geiger and E. Marsden; the accepted citation preserves those initials.
- The Szilard title's corrupt initial character was corrected from the Springer publisher page, with accessible abstract evidence.
- ETH metadata date Doppler's work 1842, while the downloaded offprint cover says 1843. The accepted citation dates the particular digitized offprint 1843 and records the catalog/original-presentation date separately. The direct OCR download succeeded even though the web-tool OCR call returned 403.
- A central-force astrodynamics monograph replaced a weaker many-body approximation contrast for Gravitation. Griffiths' electrodynamics text strengthens the electrostatics/scattering theory connection. A measured decay-period paper replaces a redundant general stochastic-method citation for Decay.
- Fire's undirected occupied-tree connectivity, Percolation's directed stochastic front and the growth/lightning mechanism of self-organized forest-fire models are kept distinct.
- Monte Carlo proposals are not physical time, Chladni's imposed node field is not a solved elastic plate, Boiling is an automaton analogy, and the source's one-way force conventions are explicit.

Candidate lookup files can contain rejected results: they are search evidence, not the accepted bibliography. Notably reject the unrelated immune-system record returned for a guessed Bunimovich DOI, the fermentation paper returned for a guessed lattice-gas DOI, book reviews returned for Callen/Crank/Carslaw/Goldstein queries, unrelated records from tentative Fuchs/Eldridge/Shapiro candidates, and wrong Van Slyke DOI candidates. Only publications in the 50 authoritative dossier JSON files are accepted. No guessed DOI was accepted without an exact-title check.

`validation.json` inventories accepted assignments. `finalize_physics.py` applies the documented corrections after the content generation scripts. Global `validate.py` separately checks all 200 dossiers and regenerates the ledger. These are author literature checks and a sibling literature-consistency spot check, not independent implementation review or runtime/browser acceptance. No Git/GitHub mutations were performed.
