# GIS General Examples

Status: complete. Scientific research checked 2026-11-05.

How can geographic datasets become queryable agent and grid information without losing their spatial meaning? NetLogo GIS General Examples loads city points, river lines, country polygons, and an elevation raster, then demonstrates drawing, queries, projection choices, and conversion to turtles or patches. Westervelt [1] connects GIS with agent modeling, Parker and colleagues [2] review spatial land-change simulation, and Crooks and colleagues [3] discuss geospatial modeling challenges. These sources motivate the integration problem rather than treating a successful map import as a scientific model. Coordinate reference systems, projection, resolution, geometry type, and data coverage are essential assumptions. Drawing layers are representations, while converted agent or patch attributes can become inputs to later rules. The baseline illustrates geospatial interoperability; it does not itself explain urban growth, establish dataset accuracy, or validate a subsequent agent-based application.

## Scientific publications

1. **James D. Westervelt (2002). Geographic Information Systems and Agent-Based Modeling.** Integrating Geographic Information Systems and Agent-Based Modeling Techniques for Understanding Social and Ecological Processes. [10.1093/oso/9780195143362.003.0010](https://doi.org/10.1093/oso/9780195143362.003.0010).

   Scientific treatment of GIS and agent integration directly grounds the demonstrated adapter functions.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1093%2Foso%2F9780195143362.003.0010). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Dawn C. Parker; Steven M. Manson; Marco A. Janssen; Matthew J. Hoffmann; Peter Deadman (2003). Multi-Agent Systems for the Simulation of Land-Use and Land-Cover Change: A Review.** Annals of the Association of American Geographers. [10.1111/1467-8306.9302004](https://doi.org/10.1111/1467-8306.9302004).

   Review of spatial land-change models establishes why geographic inputs and spatial assumptions matter.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1111%2F1467-8306.9302004). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Andrew Crooks; Christian Castle; Michael Batty (2008). Key challenges in agent-based modelling for geo-spatial simulation.** Computers, Environment and Urban Systems. [10.1016/j.compenvurbsys.2008.09.004](https://doi.org/10.1016/j.compenvurbsys.2008.09.004).

   Geospatial simulation challenges qualify claims about projections, data scale and converting mapped data into model state.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2Fj.compenvurbsys.2008.09.004). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Code%20Examples/Extensions%20Examples/gis/GIS%20General%20Examples.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 eb7880d4eff9dca3f1d82fb3122877fb439262e115720663de72f3f74528c1ea.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/gis-general-examples.nlogox` and `evidence/computing/gis-general-examples-info.txt`.
