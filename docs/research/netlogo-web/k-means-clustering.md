# K-Means Clustering

Status: complete. Scientific research checked 2026-11-05.

How can repeated assignment and averaging divide observations into groups? NetLogo K-Means Clustering creates points, initializes centroids, assigns points to their closest centroid, and relocates centroids toward the means of their assigned groups. Lloyd [1] supplies the least-squares quantization method, Hartigan and Wong [2] develop a major k-means algorithm, and Jain [3] reviews the assumptions and limitations of clustering. The model distinguishes the number of generating groups from the number of centroids requested by the user. Initialization, Euclidean distance, outliers, and the chosen value of k affect the result. Different runs can settle on different partitions, and visually plausible groups need not recover a unique underlying truth. The experiment illustrates optimization of a geometric within-group criterion, rather than proving that every dataset contains spherical clusters or that convergence identifies the global minimum.

## Scientific publications

1. **S. Lloyd (1982). Least squares quantization in PCM.** IEEE Transactions on Information Theory. [10.1109/tit.1982.1056489](https://doi.org/10.1109/tit.1982.1056489).

   Foundational least-squares quantization explains alternating assignment and centroid adjustment.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1109%2FTIT.1982.1056489). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

2. **J. A. Hartigan; M. A. Wong (1979). Algorithm AS 136: A K-Means Clustering Algorithm.** Applied Statistics. [10.2307/2346830](https://doi.org/10.2307/2346830).

   A central k-means algorithm provides methodological context; NetLogo’s teaching update need not duplicate every optimization step.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.2307%2F2346830). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

3. **Anil K. Jain (2010). Data clustering: 50 years beyond K-means.** Pattern Recognition Letters. [10.1016/j.patrec.2009.09.011](https://doi.org/10.1016/j.patrec.2009.09.011).

   Field review supplies limitations concerning cluster shape, initialization and interpreting partitions as discovered truth.

   Verified 2026-11-05: [metadata](https://api.crossref.org/works/10.1016%2Fj.patrec.2009.09.011). Public Crossref registrant metadata; publisher full text not accessed. Exact title, author/editor list, year, venue/publisher and DOI checked against the retained DOI registration response. Mechanism discussion draws on the original NetLogo Info and established method, not a claim to have read paywalled full text.

## Original-model provenance

[Served original model](https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/K-Means%20Clustering.nlogox). NetLogo 7.0.4 served 2026-11-05; SHA-256 fdffc0ac8c8d8b25286039bb9ec53648bb7c12d8829600e5d56185980ba572c6.

Original model citation: Hjorth, A., Head, B. and Wilensky, U. (2014).  NetLogo K-Means Clustering model.  http://ccl.northwestern.edu/netlogo/models/K-MeansClustering.  Center for Connected Learning and Computer-Based Modeling, Northwestern University, Evanston, IL.

 This dossier describes scientific connections to the original NetLogo teaching model; it does not certify a City Library reimplementation or empirical validity.

Full source and original Info are retained in `evidence/computing/k-means-clustering.nlogox` and `evidence/computing/k-means-clustering-info.txt`.
