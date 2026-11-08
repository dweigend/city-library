# Vision Cone Example

Status: complete. Scientific research checked 2026-11-05.

What information is available to an agent that can only perceive objects ahead? NetLogo Vision Cone Example uses the in-cone primitive to filter nearby turtles or patches according to distance, heading, and angular extent. Reynolds [1] develops autonomous-agent steering with local perception, Couzin and colleagues [2] study collective motion with directional interactions, and Couzin and colleagues [3] examine leadership under local information. These papers supply scientific settings in which the demonstrated geometric filter matters; the example itself does not implement their complete behavioral models. Changing heading rotates the eligible region, while radius and angle independently limit perception. Occlusion, sensory errors, and species-specific detection are additional assumptions absent from a simple cone query. The simulation illustrates a perception boundary that can be reused in models, rather than evidence that real agents perceive every object inside an ideal geometric sector.

## Scientific publications

1. **Craig W. Reynolds (1987). Flocks, herds and schools: A distributed behavioral model.** Proceedings of the 14th annual conference on Computer graphics and interactive techniques. [10.1145/37401.37406](https://doi.org/10.1145/37401.37406).

   Foundational flocking work directly motivates local directional perception for steering agents.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1145%2F37401.37406). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **IAIN D. COUZIN; JENS KRAUSE; RICHARD JAMES; GRAEME D. RUXTON; NIGEL R. FRANKS (2002). Collective Memory and Spatial Sorting in Animal Groups.** Journal of Theoretical Biology. [10.1006/jtbi.2002.3065](https://doi.org/10.1006/jtbi.2002.3065).

   Collective-motion theory connects perception geometry and spatial organization.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1006%2Fjtbi.2002.3065). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Iain D. Couzin; Jens Krause; Nigel R. Franks; Simon A. Levin (2005). Effective leadership and decision-making in animal groups on the move.** Nature. [10.1038/nature03236](https://doi.org/10.1038/nature03236).

   Leadership and decision-making research provides a concrete application of limited local information, without validating the teaching cone as animal vision.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1038%2Fnature03236). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Code%20Examples/Vision%20Cone%20Example.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 bb99819068cd011287038aaf552b263c330463ba1d913bc18dea3f6ad288bb64.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/vision-cone-example.nlogox` and `evidence/computing/vision-cone-example-info.txt`.
