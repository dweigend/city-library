# Research for urban insight models

Research date: 2026-11-10. This brief precedes the requested revision of the fifteen city models. It records scientific references, what was actually accessible, and proposed original teaching adaptations. It is a design brief, not evidence that the proposed mechanisms or views have been delivered.

## Purpose

Use small simulations to investigate cities: make a mechanism explicit, intervene, observe consequences and question assumptions. The user prioritizes interesting urban insights over empirical realism. Synthetic parameters, schematic geography and bounded populations are appropriate. Mathematical consistency, explicit units and honest interpretation still matter.

Epstein (2008), [Why Model?](https://www.jasss.org/11/4/12.html), JASSS 11(4), 12, separates explanation from prediction and discusses learning, uncertainty and trade-offs as modeling purposes. The article was opened and its modeling-goals discussion read. This provides the methodological rationale; it does not validate our implementations.

Every revised model should have a city question, a visible causal mechanism, two useful interventions, observations that distinguish their effects, a subject-specific main view and one or two supporting plots. Richness means meaningful entities, flows, spatial relationships, delays and distributions, rather than decorative buildings or extra dashboards. A simple stable equilibrium is acceptable when an intervention and transient explain something; artificial oscillation is not a quality criterion.

## Sources and original teaching adaptations

### 1. Population and Households — city-population

**Reference:** P. H. Leslie (1945), [On the Use of Matrices in Certain Population Mathematics](https://doi.org/10.1093/biomet/33.3.183), Biometrika 33, 183–212. [University-hosted original paper](https://www.math.utah.edu/~keener/classes/math5110/papers/leslie.pdf). Publisher metadata and the original scanned paper were opened; do not claim a complete modern demographic specification was extracted.

**Scientific connection:** age structure connects today's cohort sizes to later demographic flows. **Our proposed adaptation:** retain an accessible cohort model and integer population accounting, but remove the current cohort-flooring artifact. A deterministic total mortality allocation by largest remainders is a numerical design choice, not a Leslie result.

**City insight and experiments:** compare an immigration pulse of young adults with the same total inflow spread over years; compare population growth with household-size change. Housing demand can change even with similar population totals.

**View:** a readable age pyramid or cohort bars with change markers; births/deaths/migration as separate flows; population and household demand over time. Never invent household identity or physical residences for aggregate cohorts. The mortality contract and changed expected values must be decided before runtime edits.

### 2. Housing Market — city-housing

**Reference:** Stuart S. Rosenthal (2014), [Are Private Markets and Filtering a Viable Source of Low-Income Housing? Estimates from a “Repeat Income” Model](https://pubs.aeaweb.org/doi/10.1257/aer.104.2.687), American Economic Review 104(2), 687–706. Publisher-indexed abstract read; direct page fetch returned 403. No full-text replication or empirical rate transfer is claimed.

**Scientific connection:** housing changes occupants and affordability over time. **Our proposed adaptation:** show allocation, displacement, vacancies and delayed construction; use distinct affordability groups. Filtering is an inspiration only unless housing quality/aging or vacancy chains are explicitly represented.

**City insight and experiments:** compare a housing-allowance intervention with adding supply, then withdraw the allowance. Explain who becomes housed, who is displaced and what rent/supply feedback produces under the chosen rules.

**View:** actual homes as occupied/vacant slots and households by affordability/status, with selection details; visible rent/bid comparison and unmet demand. Replace the current tall text-only count canvas with a working allocation view or an honest compact table. Identity, status and colors should have observable meanings.

### 3. Land Use Change — city-land-use

**Reference:** Michael Batty and Yichun Xie (1994), [From Cells to Cities](https://journals.sagepub.com/doi/10.1068/b21S031), Environment and Planning B 21, 31–48. Publisher abstract read; full text restricted.

**Scientific connection:** local rules can produce aggregate urban form. **Our proposed adaptation:** an explicit parcel/neighborhood preference or conversion friction can make spatial allocation consequential; do not describe a demand-only allocator as a cellular-automaton reproduction.

**City insight and experiments:** compare compact conversion with dispersed development under the same demand; protect a connected green corridor versus the same protected area scattered across parcels. If a new rule is needed, document it as an original extension before implementing it.

**View:** a parcel map with use, protection and recently changed parcels; area by use and unmet demand. Equal-area cases should visibly differ in arrangement, or the UI must state that geometry is schematic.

### 4. Daily Activities — city-daily-activities

**Reference:** Torsten Hägerstrand (1970), [What About People in Regional Science?](https://doi.org/10.1111/j.1435-5597.1970.tb01464.x), Papers of the Regional Science Association 24, 7–21. [University-hosted original reprint](https://courses.washington.edu/cee500/What%20about%20people%20in%20regional%20science.pdf). Scanned reprint opened and indexed excerpts inspected; publisher fetch blocked. Detailed time-geography algorithms are not claimed as reproduced.

**Scientific connection:** people have finite time and activities impose spatial/temporal constraints. **Our proposed adaptation:** visible individual schedules, destinations and travel time rather than an aggregate trip counter alone.

**City insight and experiments:** compare remote work with nearer services; shift a school or service opening time and examine which activities remain feasible. Missed opportunities should be explicit if implemented.

**View:** a compact time/place schedule and current travelers/destination occupancy; person-hour accounting and completed/missed activities. The viewer must distinguish travel time from time at activities.

### 5. Urban Mobility — city-mobility

**Reference:** Dietrich Braess, Anna Nagurney and Tina Wakolbinger (2005), [On a Paradox of Traffic Planning](https://pubsonline.informs.org/doi/abs/10.1287/trsc.1050.0127), Transportation Science 39(4), 446–450; translation of Braess (1968). [Author-hosted full paper](https://homepage.ruhr-uni-bochum.de/Dietrich.Braess/Paradox-BNW.pdf) opened and its network/cost argument read.

**Scientific connection:** individually preferred routes need not minimize collective travel time. **Our proposed adaptation:** show queueing, mode choice and route costs; only claim a Braess paradox if flow-dependent routing and the contrasting outcomes are actually demonstrated. The current static routing does not establish it.

**City insight and experiments:** compare added road capacity with a walking improvement or car penalty; expose the difference between travel-time gains, waiting and mode share.

**View:** stops, moving trips, queues and both mode networks; bounded edge-width encoding, explicit occupancy/capacity and travel/wait distributions. A 1000-trip setting must remain readable. Preserve FIFO and resource conservation.

### 6. Urban Employment — city-economy

**Reference:** Stanislao Gualdi, Marco Tarzia, Francesco Zamponi and Jean-Philippe Bouchaud (2015), [Tipping Points in Macroeconomic Agent-Based Models](https://doi.org/10.1016/j.jedc.2014.08.003), Journal of Economic Dynamics and Control 50, 29–61. [Author preprint, version 4](https://arxiv.org/abs/1307.5319v4) opened; abstract and mechanism overview read.

**Scientific connection:** hiring/firing and demand feedback can create qualitatively different employment regimes. **Our proposed adaptation:** a small urban firm/household economy can expose a demand shock and delayed adjustment; a two-step arithmetic equilibrium is not evidence of a tipping point.

**City insight and experiments:** reduce external demand temporarily, then restore it; compare fast firing/slow hiring with symmetric adjustment if that rule is explicitly added. Show why recovery can differ from the initial decline.

**View:** firm employment/vacancies and household income/status; money flows and demand/payroll histories. Keep city-scale claims distinct from the macroeconomic reference. New debt/bankruptcy rules need explicit contracts.

### 7. Neighborhood Services — city-services

**Reference:** Wei Luo and Fahui Wang (2003), [Measures of Spatial Accessibility to Health Care in a GIS Environment: Synthesis and a Case Study in the Chicago Region](https://journals.sagepub.com/doi/10.1068/b29120), Environment and Planning B 30(6), 865–884. Publisher abstract read.

**Scientific connection:** access depends on both distance and competing demand for finite supply. **Our proposed adaptation:** use capacity allocation and explicit travel limits; do not call the allocation algorithm 2SFCA unless it computes that measure.

**City insight and experiments:** move/add a small facility versus expanding a central one at equal total capacity; change the acceptable travel distance. Compare served totals with spatial inequality, not just averages.

**View:** households, distinct service kinds, catchment/assignment links and capacity use; distinguish too-far from full. Add a distribution or underserved-household count so the same mean can expose unequal access.

### 8. Urban Energy Supply — city-energy

**Reference:** Paul Denholm and Robert Margolis (2016), [Energy Storage Requirements for Achieving 50% Solar Photovoltaic Energy Penetration in California](https://doi.org/10.2172/1298934), NREL/TP-6A20-66595. [Laboratory record](https://research-hub.nlr.gov/en/publications/energy-storage-requirements-for-achieving-50-solar-photovoltaic-e/) and [full report](https://www.nlr.gov/docs/fy16osti/66595.pdf) opened; abstract and summary inspected. This is a technical research report, not a journal article.

**Scientific connection:** storage value depends on renewable timing and other flexibility. **Our proposed adaptation:** daily synthetic supply/demand and finite battery dispatch; do not transfer California capacity estimates to a neighborhood.

**City insight and experiments:** compare more solar with more battery, then shift demand into sunny hours. More annual generation need not solve the peak-time shortage.

**View:** separate electricity/heat flows, battery fill, curtailment and unmet demand; align supply/demand on one time axis and distinguish power, interval energy and stored energy. Exclude the setup zero from interval-flow charts.

### 9. Water and Wastewater — city-water

**Reference:** Andrew J. Draper and Jay R. Lund (2004), [Optimal Hedging and Carryover Storage Value](https://ascelibrary.org/doi/abs/10.1061/%28ASCE%290733-9496%282004%29130%3A1%2883%29), Journal of Water Resources Planning and Management 130(1), 83–87. Publisher-indexed abstract read; direct fetch blocked (403).

**Scientific connection:** releasing water today trades off against retaining it for later uncertain demand. **Our proposed adaptation:** a finite reservoir with a synthetic dry spell and a transparent conservation/hedging rule. A fixed threshold is an original teaching rule, not an optimal policy established by this paper.

**City insight and experiments:** compare early modest conservation with late emergency rationing during the same dry spell; separate treatment expansion from drinking-water availability.

**View:** reservoir stock, daily supply/request/shortage, spill and treatment paths with actual quantities. Show cumulative shortage alongside the worst day's shortage; stock and flow units must remain distinct.

### 10. Urban Stormwater — city-stormwater

**Reference:** US EPA, [Storm Water Management Model](https://www.epa.gov/water-research/storm-water-management-model-swmm), SWMM 5.2 User's Manual (2022), hydrology and LID reference manuals. Official capabilities, manual catalog and infiltration/retention discussion read. This is an authoritative reference model/manual, not a claim that SWMM equations or code are ported.

**Scientific connection:** infiltration, storage and release change runoff timing and overflow. **Our proposed adaptation:** a short rainfall pulse or two pulses on schematic surfaces feeding a finite basin.

**City insight and experiments:** compare infiltration improvement with more retention under equal rainfall; compare an isolated storm with closely spaced storms. Storage can reduce a peak but need time to empty before the next event.

**View:** catchment surfaces, rainfall input, basin fill and outfall/overflow; a rain/runoff hydrograph with timing is more informative than cumulative lines alone. Keep the water balance visible on demand rather than dominating the view.

### 11. Urban Heat — city-heat

**Reference:** T. R. Oke (1982), [The Energetic Basis of the Urban Heat Island](https://doi.org/10.1002/qj.49710845502), Quarterly Journal of the Royal Meteorological Society 108, 1–24. Publisher record/available excerpts read; full publisher access was intermittent.

**Scientific connection:** urban heating depends on energy partition and heat storage, including its time course. **Our proposed adaptation:** explicit surface heat budgets with a synthetic day/night input; surface temperature is not equivalent to air temperature or thermal comfort.

**City insight and experiments:** compare shade with watered vegetation across a day and night; restrict water during the same hot period. Ask when interventions help and what resource they require.

**View:** separated sealed/mixed/planted surfaces on one fixed sequential temperature scale, current values and temperature histories; show heating/cooling phase and shade/water intervention. Avoid a permanently identical red strip and suppress display-only negative zero.

### 12. Air and Noise Exposure — city-air-noise

**References:** Ruwim Berkowicz (2000), [OSPM—A Parameterised Street Pollution Model](https://doi.org/10.1023/A:1006448321977), Environmental Monitoring and Assessment 65, 323–331; publisher abstract and [Aarhus model description](https://envs.au.dk/en/research-areas/air-pollution-emissions-and-effects/the-monitoring-program/air-pollution-models/ospm/description-of-the-ospm-model) read. Stylianos Kephalopoulos, Marco Paviotti and Fabienne Anfosso-Lédée (2012), [CNOSSOS-EU](https://publications.jrc.ec.europa.eu/repository/handle/JRC72550), JRC72550, official overview read.

**Scientific connection:** emission transport/exchange and receptor location matter; sound sources combine in energy rather than by arithmetic addition of dB. **Our proposed adaptation:** a small explicit mass-transport corridor and simple sound-energy calculation. Do not label it OSPM/CNOSSOS compliance.

**City insight and experiments:** compare fewer emitting vehicles with stronger ventilation; move a receptor behind/farther from the source only if the mechanism supports that change. A cleaner citywide mean can coexist with a local hotspot.

**View:** visible sources, transport direction, receptors and concentration/exposure differences; separate noise from pollution encodings, readable units and rounded values. Tables must be readable both in live use and retained screenshots.

### 13. Urban Habitat Connectivity — city-biodiversity

**Reference:** Ilkka Hanski (1998), [Metapopulation Dynamics](https://doi.org/10.1038/23876), Nature 396, 41–49. [Original review reprint](https://crcooper01.people.ysu.edu/Hanski%201998%20Metapopulation%20Dynamics%20Nature.pdf) opened; patch/isolation and habitat-loss/rescue discussion read. This is a synthesis by the model developer, not a new original experiment.

**Scientific connection:** local occupancy and persistence depend on patch quality, isolation and recolonization. **Our proposed adaptation:** a small heterogeneous patch network; distinguish expected occupancy from discrete presence and do not call probability changes observed extinction events.

**City insight and experiments:** connect existing patches versus improving one patch with equal intervention budget; remove a bridge patch and restore it. Explain why area alone does not characterize a habitat network.

**View:** patch area/quality, occupancy and active dispersal links; show local gains/losses and network-wide persistence. Avoid a decorative three-node graph whose spatial attributes never affect dynamics.

### 14. Urban Material Cycles — city-materials

**Reference:** Christopher Kennedy, John Cuddihy and Joshua Engel-Yan (2007), [The Changing Metabolism of Cities](https://doi.org/10.1162/jie.2007.1107), Journal of Industrial Ecology 11(2), 43–59. Publisher abstract read; record shows later online publication date. Use the issue's 2007 citation.

**Scientific connection:** urban metabolism tracks resource flows together with accumulation in stocks. **Our proposed adaptation:** waste generation, finite collection and material recovery with explicit uncollected stock.

**City insight and experiments:** raise recycling efficiency versus collection capacity during the same waste pulse; reduce generation and compare residual stock. A high recycling share does not remove material that is never collected.

**View:** material destinations, recovery/disposal amounts and growing backlog, with quantities and units; scale line widths safely and keep flow intervals separate from inventory. Add a finite processing bottleneck only with an explicit contract and useful experiment.

### 15. Municipal Finance — city-finance

**Reference:** Samer Madanat and Moshe Ben-Akiva (1994), [Optimal Inspection and Repair Policies for Infrastructure Facilities](https://doi.org/10.1287/trsc.28.1.55), Transportation Science 28(1), 55–62. Publisher abstract read.

**Scientific connection:** inspection, repair and condition uncertainty affect infrastructure decisions and costs. **Our proposed adaptation:** a municipal budget with wear, maintenance and deferred work. Deterministic visible condition does not reproduce the paper's latent-state model or optimize inspection.

**City insight and experiments:** defer maintenance for several years then restore the budget; compare steady preventive expenditure with a later repair burst under a stated cost rule. Show current cash together with the infrastructure obligation, not cash alone.

**View:** a small asset/condition inventory where supported, cash inflows/outflows, backlog and condition trajectories. Distinguish spending from wear and identify what is conserved. No credit, interest or nonlinear failure cost may be implied unless implemented.

## Revision decisions and verification gates

The user explicitly authorized Opus to rework all models after the independent findings and requested richer, more appropriate visualizations preceded by paper research. This authorizes the documented mortality correction, coherent live-policy validation, meaningful original model extensions and revised examples within these fifteen models; it does not authorize weakening assertions merely to pass checks or changing unrelated public library APIs.

Before each changed mechanism: state the exact question, mathematical rule, inputs, units, intervention and expected qualitative pattern. Resolve it against the source access level above. If a different mechanism/reference is chosen, research and document it before coding. Write four or five asserted author tasks for the revised mechanism first. Record which prior expectations change and why. Never claim a retroactive freeze commit. Retain the original expectation/hash history and label new hashes as current evidence, not proof of chronology.

Suggested consistent live-action rule: omitted record keys preserve the current value; explicitly supplied undefined is rejected with TypeError, including scalar actions. Apply only to these city models unless a shared helper can be introduced without changing existing consumers. Validate atomically before mutation. Preserve detached observation ownership; freezing is not a substitute for detachment.

Close every finding in the Opus review at /tmp/city-models-opus-5-5-review.md, including status contradictions, absent Air/Noise hashes, unsafe mobility widths, artificial setup-to-interval flow ramps and misleading labels. Keep the report and initial independent reviews as historical evidence. Current acceptance must remain open until the revised code and actual final pictures pass new checks.

Use public City Library functions, the existing defineUI authoring contract and shared scientific palette. Prefer existing visualization capabilities. If a genuinely reusable view gap blocks an informative model, deliver one small public view capability with frozen examples and checks; do not put DOM, lifecycle or CSS into model scripts. Detailed scientific visuals must still follow the fixed design system and remain readable at 1366×768 and 390×844 in light/dark. All UI actions must modify only the headless owner.

For each model, exercise at least the default and an informative intervention through actual browser controls. Capture the causal scene and supporting views, table headers and scrolled tables explicitly. Avoid approving full-page screenshot artifacts. Check labels, keyboard selection, large valid settings and encoding saturation. Report shell checks, direct browser observations, independent screenshot findings, author responses and independent reapproval separately.

Before final delivery run bun run typecheck, the model/public scripts and relevant regression checks; run bun run check and bun run build:ui for the integrated result. Review current scientific claims as explanations conditional on model rules, not evidence about a real city. No commit, push, PR, publication or Tailscale service is requested.


## Implementation note (revision 2)

The brief above stayed the design basis. The implemented question, rule and experiments for each model are summarized in the [model table](city-simulation-models.md#explore-a-model) and specified in each `models/<slug>/contract.md`. Where the implementation chose a specific rule the brief left open, it is an original teaching rule documented in the contract: largest-remainder mortality (Population), face-neighbor scoring (Land Use), queue-length route estimates (Mobility), a whole-job resting band (Employment), nearest-first service allocation (Services), a storage trigger (Water), a linear soil-store infiltration decline (Stormwater), an exponential dispersal kernel with square-root area extinction (Habitat) and a doubled late-repair cost (Finance). No additional external source was introduced.
