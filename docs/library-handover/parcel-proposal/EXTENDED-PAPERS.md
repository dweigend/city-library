# Extended urban-generation papers: focused method review

Date: 2026-11-07. Read-only primary-source review for a proposed City Library contract. This records inspected methods, not reproduction or runtime acceptance. No model training or implementation was run. The video bibliography is a discovery list, not proof that the video's prototype implements each paper.

## Bibliographic corrections

The earlier Gemini report needs three corrections confirmed against primary records/title pages:

- GlobalMapper, ICCV 2023, pages **454–464**, not 2009–2018. Authors Liu He and Daniel Aliaga. [CVF record](https://openaccess.thecvf.com/content/ICCV2023/html/He_GlobalMapper_Arbitrary-Shaped_Urban_Layout_Generation_ICCV_2023_paper.html).
- Example-Driven Procedural Urban Roads, Computer Graphics Forum **35(6), 5–17**, 2016, not 103–116. Authors Gen Nishida, Ignacio Garcia-Dorado and Daniel G. Aliaga. DOI [10.1111/cgf.12728](https://doi.org/10.1111/cgf.12728). The author PDF carries 2015 copyright; retain the 2016 issue year.
- The Extended L-System author is **Yandong Mei**, not “M. Yandong”. Institution repository and original title page agree. [Hosei record](https://hosei.ecats-library.jp/da/repository/00021530/), DOI [10.15002/00021513](https://doi.org/10.15002/00021513).

## GlobalMapper — building layouts conditioned on block shape

He and Aliaga, 2023. [Full author preprint](https://arxiv.org/html/2307.09693v1). Inspected §3.1–3.3 and §4.1.

Input: road-bounded blocks, optionally a prior layout. Output: building footprints and their arrangement, not a cadastral partition. A skeleton-derived main axis maps buildings into a canonical shallow-grid graph. A conditional variational autoencoder combines a CNN block-mask encoder and graph-attention layout encoder/decoder. Predicted building position, size, shape class and occupancy are mapped back; parameterized footprint synthesis follows. It requires trained weights and preprocessing.

Transfer decision: optional learned building-layout generator later. The useful near-term lesson is explicit normalization and inverse mapping, not adding neural inference to polygon splitting. Its empirical overlap/out-of-block metrics are not hard geometric guarantees. This method does not establish conserved parcel coverage or street access.

## COHO — context across neighboring blocks

He and Aliaga, ECCV 2024. [Full author preprint](https://arxiv.org/html/2407.11294v1); DOI [10.1007/978-3-031-72624-8_1](https://doi.org/10.1007/978-3-031-72624-8_1). Inspected §3.1–3.3 and §4.1.

Input: city-block geometry/adjacency and optional existing layout context. Output: 2.5D building layouts across blocks. Each block is a graph node containing shape/location features and a quantized latent building-layout vector. A trained block VAE supplies those vectors; a graph masked autoencoder predicts missing layout features. Priority-based iterative sampling accepts confident blocks first, allowing their context to influence neighbors.

Transfer decision: later optional city-scale learned generator. It supports separating geometry, block adjacency and building style. It is not a small deterministic parcel operation; it requires dataset preparation, learned encoders/codebooks/weights and an inference stack. Contextual realism does not prove non-overlap or planning compliance.

## Zheng et al. — planning as learned sequential decisions

Yu Zheng, Yuming Lin, Liang Zhao, Tinghai Wu, Depeng Jin, Yong Li. Nature Computational Science 3, 748–762 (2023). [Publisher](https://www.nature.com/articles/s43588-023-00503-5), [official implementation](https://github.com/tsinghua-fib-lab/DRL-urban-planning), DOI [10.1038/s43588-023-00503-5](https://doi.org/10.1038/s43588-023-00503-5).

Inspected publisher Extended Data 1–3 and official input/training documentation; full main Methods text was not exposed by the publisher response. Input: initial land blocks, roads, junctions and explicit functionality/area objectives. Output: land-use and road plans. Two sequential stages place land uses and then select boundaries as roads. A heterogeneous contiguity graph feeds shared GNN encoding and separate policy networks.

Transfer decision: planning policy/experiment layer later, not polygon kernel. Separate spatial actions and observations from learned policy. Access/transport efficiency rewards and land-use requirements are declared assumptions, not universal parcel constraints. Python/PyTorch training and geographic preprocessing are substantial dependencies.

## Chen et al. — tensor-guided street graphs

Guoning Chen, Gregory Esch, Peter Wonka, Pascal Müller, Eugene Zhang, 2008. [Institutional author PDF](https://www.sci.utah.edu/~chengu/street_sig08/street_sig08.pdf). Inspected §3 pipeline, §4 tensor background, §5 field design and §6 street graph generation. DOI carried in the earlier report was not independently resolved in this review.

Input: water, park/forest, height and population maps plus user field/edit controls. Output: an editable geometric street graph. A sampled tensor field supplies major/minor eigenvector directions; tracing hyperstreamlines and applying graph editing creates major/minor streets. Rotation fields and boundary-derived fields vary orientation.

Transfer decision: later pure street-layout generator with separate authoring UI. Reusable concepts are direction-field sampling, bounded tracing and explicit graph geometry. Tensor samples need not become mutable Grid Fields. The method generates street centerlines; it does not remove the need for finite-width corridors, junction unions, planarization and labeled land-block extraction.

## Nishida et al. — example-driven road growth

Bibliography corrected above. [Institutional author PDF](https://www.cs.purdue.edu/cgvlab/www/resources/papers/Nishida-CGF-2016-Example_Driven_Procedual_Urban_Roads.pdf). Downloaded and inspected §3 and §4.1–4.3.4, including Algorithm 1 and patch legality/local constraints.

Input: target regions/terrain and one or more example road graphs, using OSM roads in the paper. Output: generated arterial/local street graph; later postprocessing adds blocks/parcels/buildings. Extracted patches preserve recognizable structures; statistical procedural growth fills/adapts roads. A FIFO work queue applies either growth mode, with collision and terrain legality checks; warping/blending are optional controls.

Transfer decision: later generator variant. Example graphs are data, not compulsory OSM/network I/O in core. Pure patch extraction, matching and bounded growth could be separated, but this is a substantially larger closure than parcel bisection. Do not make statistical resemblance an access or topological validity guarantee.

## Zhang et al. — GIS/CGA workflow

Ming Zhang, Jielin Wu, Yang Liu, Ji Zhang, Guanyao Li. ISPRS International Journal of Geo-Information 11(10), 531 (2022). [Publisher full text](https://www.mdpi.com/2220-9964/11/10/531), DOI [10.3390/ijgi11100531](https://doi.org/10.3390/ijgi11100531). Inspected §3.1–3.3.2, particularly §3.3.1 and Figure 3 via indexed primary full text; direct requests returned 429/403.

Input: terrain imagery, road centerlines and zoning polygons. Output: parcel/lot layouts then extruded/textured buildings in CityEngine. The workflow uses existing recursive/offset/skeleton tools and adds partition rules using absolute sizes, counts or ratios, followed by indexed lot grouping and transforms.

Transfer decision: useful later partition/grouping variant. Keep ordinary TypeScript composition; do not import CGA grammar machinery or CityEngine dependencies. The paper's skeleton-access statement applies to its workflow, not a universal guarantee for all skeleton implementations or road labels.

## Mei — extended L-system city generation

Yandong Mei. Bulletin of Hosei University Graduate School, Computer and Information Sciences 13, 1–6 (2017). [Original institutional PDF](https://hosei.ecats-library.jp/da/repository/00021530/gradcis_13_15t2004.pdf). Inspected road generation/local constraints and lot-subdivision sections, including printed pp. 3–4. DOI metadata verified through institutional HTML; its repository-generated PDF cover is additional to the six article pages.

Input: generated/user image maps, density and random seed. Output: road graph, blocks/parcels and buildings. Priority-queued segment growth separates global goals from local constraints. A minimum-cycle-basis operation extracts regions; OBB-oriented recursive cuts subdivide them with displaced cut positions and density-based termination.

Transfer decision: later road-growth variant; its queue/goal/constraint separation fits ordinary functions. Its cycle extraction is not by itself a substitute for finite-width land extraction, bridges or general planar-face classification. Randomized recursion requires explicit stream and work limits; source reproducibility claims need target fixtures.

## Concrete consequence for the small TypeScript library

Keep the first kernel geometric: accepted polygon data, corridor/subtract/overlap primitives, explicit road-facing boundary intervals and bounded subdivision outcomes preserving all area. OBB, strips and skeleton are distinct method contracts. Later road generators return descriptions consumed by that kernel. Building-layout learning and land-use policy consume public geometry/graph APIs from separate modules or external applications; they should not add mandatory training, GPU, GIS service, DSL or World dependencies to a simple parcel call.

No direct code copying or licensing decision was made. Source inspection establishes algorithm context, not target correctness, visual acceptance or permission to claim identical results. Screenshot assets for classic methods are produced by the separate paper-analysis stream.


## Townscaper boundary

The [Townscaper integration](TOWNSCAPER.md) supplies a deterministic finite topology track alongside the parcel kernel. Dual module placement, level/color occupancy and compatible architectural pieces remain separate future generation/model tasks. Like the learned layout and road-growth approaches above, they do not redefine parcel validity, frontage or state ownership. No training/inference, WFC solver or rendering dependency is added to geometry/topology by the finite generator.
