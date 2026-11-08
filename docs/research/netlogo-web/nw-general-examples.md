# NW General Examples

Status: complete. Scientific research checked 2026-11-05.

How do network generation rules and graph direction affect the statistics reported for the same displayed nodes? NetLogo NW General Examples combines network generators, layouts, clusterers, and measurements from the NW extension. Watts and Strogatz [1] supply the small-world mechanism, Barabási and Albert [2] supply preferential growth, and Brandes [3] develops efficient betweenness centrality. The baseline exposes these distinct tasks through shared controls, making it important to distinguish topology from screen layout and generation from analysis. The original Info warns that selecting the wrong directed-link context can produce misleading zero measurements. Disconnected components, link types, and chosen generator parameters also change meaning. The example illustrates public graph capabilities and their assumptions; an attractive layout is not evidence of a small-world property, and successful measurement does not validate a network model against real social or urban data.

## Scientific publications

1. **Duncan J. Watts; Steven H. Strogatz (1998). Collective dynamics of ‘small-world’ networks.** Nature. [10.1038/30918](https://doi.org/10.1038/30918).

   Original small-world generator theory corresponds directly to a demonstrated network family.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1038%2F30918). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Albert-László Barabási; Réka Albert (1999). Emergence of Scaling in Random Networks.** Science. [10.1126/science.286.5439.509](https://doi.org/10.1126/science.286.5439.509).

   Original preferential-attachment paper supports the scale-biased growth generator.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1126%2Fscience.286.5439.509). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Ulrik Brandes (2001). A faster algorithm for betweenness centrality*.** The Journal of Mathematical Sociology. [10.1080/0022250x.2001.9990249](https://doi.org/10.1080/0022250x.2001.9990249).

   Direct centrality algorithm reference supports one of the example’s graph-analysis capabilities and its direction-sensitive interpretation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1080%2F0022250X.2001.9990249). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Code%20Examples/Extensions%20Examples/nw/NW%20General%20Examples.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 9c80d9fa4d5d4da96224e65cd707639267da3f6494309d9d45b758164d2703db.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/nw-general-examples.nlogox` and `evidence/computing/nw-general-examples-info.txt`.
