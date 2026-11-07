# PageRank

Status: complete. Scientific research checked 2026-11-05.

How can hyperlink structure define a page's relative importance? NetLogo PageRank compares two agent-based ways to distribute rank over directed links, making mass flow and random-surfer behavior visible. Brin and Page [1] give the search-engine context, Bianchini and colleagues [2] analyze PageRank mathematically, and Kleinberg [3] supplies a related but distinct link-authority approach. Damping changes the balance between following links and redistributing visits, while graph structure controls which nodes collect rank. The model illustrates a ranking measure rather than answering a content query. Direction, dangling nodes, normalization, and the chosen update procedure are essential assumptions. Rank need not measure factual quality, fairness, or relevance to a particular user. Agreement between two numerical procedures can corroborate their shared mathematical target, but it does not empirically validate the assumption that incoming links indicate usefulness.

## Scientific publications

1. **Sergey Brin; Lawrence Page (1998). The anatomy of a large-scale hypertextual Web search engine.** Computer Networks and ISDN Systems. [10.1016/s0169-7552(98)00110-x](https://doi.org/10.1016/s0169-7552(98)00110-x).

   Original scientific account of the Google prototype establishes the hyperlink-ranking context.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2FS0169-7552%2898%2900110-X). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **Monica Bianchini; Marco Gori; Franco Scarselli (2005). Inside PageRank.** ACM Transactions on Internet Technology. [10.1145/1052934.1052938](https://doi.org/10.1145/1052934.1052938).

   Direct mathematical analysis of PageRank supports damping, convergence and structural interpretation.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1145%2F1052934.1052938). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Jon M. Kleinberg (1999). Authoritative sources in a hyperlinked environment.** Journal of the ACM. [10.1145/324133.324140](https://doi.org/10.1145/324133.324140).

   HITS provides a relevant alternative notion of authority, clarifying that link-based importance is a modeling choice.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1145%2F324133.324140). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/PageRank.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 6a4ec440d110460a3af4bbca59212bf14dc0db11378eeee1691d910a5d362703.

Original model citation: Stonedahl, F. and Wilensky, U. (2009).  NetLogo PageRank model.  http://ccl.northwestern.edu/netlogo/models/PageRank.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/pagerank.nlogox` and `evidence/computing/pagerank-info.txt`.
