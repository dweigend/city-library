# Parcel methods: primary-source review for a City Library proposal

Date: 7 November 2026. Scope: methods and transfer boundaries, not runtime delivery.
Read-only source checkout: `/home/david/Projekte/city_game`, main `3e1d34f1`.
Read root PLAN.md, existing parcels.md and GRID-PARCELS-API.md. No project files changed.

## Bibliography corrections

The earlier Gemini bibliography contains material errors. Use these publisher records:

- Wickramasuriya, R.; Chisholm, L. A.; Puotinen, M.; Gill, N.; Klepeis, P. (2011), *An automated land subdivision tool for urban and regional planning: Concepts, implementation and testing*. **Environmental Modelling & Software 26(12), 1675–1684**, DOI [10.1016/j.envsoft.2011.06.003](https://doi.org/10.1016/j.envsoft.2011.06.003). The previous compenvurbsys DOI and pages are wrong. [Publisher record](https://www.sciencedirect.com/science/article/pii/S1364815211001447).
- Koc, I.; Cay, T.; Babaoglu, I., *Approaches to automated land subdivision using binary search algorithm in zoning applications*. **Municipal Engineer 175(1), 16–28 (2022 issue); first published online 3 January 2020**. DOI [10.1680/jmuen.18.00066](https://doi.org/10.1680/jmuen.18.00066). The previous 38–50 page range is wrong. [Publisher record](https://www.emerald.com/jmuen/article/175/1/16/422340).

## 1. Vanegas et al. 2012: two real subdivision families

*Procedural Generation of Parcels in Urban Modeling*, Computer Graphics Forum 31(2pt3), 681–690. DOI [10.1111/j.1467-8659.2012.03047.x](https://doi.org/10.1111/j.1467-8659.2012.03047.x). [Author-hosted PDF](https://www.cs.purdue.edu/cgvlab/www/resources/papers/Vanegas-Eurographics-2012-Procedural_Generation_of_Parcels_in_Urban_Modeling.pdf).

Inspected §§3–4, especially §4.2 (printed pp.684–686) and §4.3 (pp.686–687).
Input: a CCW block contour, logical streets and style/size controls. Output: subdivision regions.
Skeleton mode computes inward contours and strips, combines faces belonging to the same logical street, corrects diagonal strip boundaries, then casts guided slicing rays. Postprocessing merges small or triangular lots. A finite inward offset may retain an inaccessible interior patio. The reference uses CGAL for the skeleton; a skeleton graph alone does not reproduce the parcel algorithm.
OBB mode fits edge-aligned minimum-area boxes, recursively cuts, optionally displaces cuts, and conditionally rotates when a child lacks road access. Per-child seeds support local edit stability. It is not the existing deterministic single-cut fixture.

Transfer recommendation: keep OBB and skeleton as distinct strategy contracts. Start OBB narrowly; require explicit residuals and access policy. Defer skeleton until robust offset/events, polygon unions and strip correction have an implementation decision. Inspect Appendix A separately before claiming a faithful port; the inspected main paper refers to it but it was not obtained here.

## 2. Aichholzer et al. 1995: straight-skeleton definition

*A Novel Type of Skeleton for Polygons*, JUCS 1(12), 752–761. DOI [10.3217/jucs-001-12-0752](https://doi.org/10.3217/jucs-001-12-0752). [Publisher PDF](https://www.jucs.org/jucs_1_12/a_novel_type_of/Aichholzer_O.pdf).

Inspected §1, pp.752–754, and §2, pp.755–757. Input: a simple planar polygon. Output: the straight-line skeleton/associated face structure. Equal-speed parallel inward edge motion produces edge-collapse and reflex-vertex split events, including simultaneous events. This is different from a medial axis and from arbitrary angle-bisector sketches. The paper defines geometry, not parcel feasibility or a street-access policy.

Transfer recommendation: use as the correctness reference for a future skeleton backend. Avoid presenting a naive spine/rib approximation under the same method name. Numerical event ordering and topology are substantial implementation obligations. This review does not establish hole support or an appropriate JavaScript dependency.

## 3. Parish & Müller 2001: recursive baseline

*Procedural Modeling of Cities*, SIGGRAPH 2001, 301–308. DOI [10.1145/383259.383292](https://doi.org/10.1145/383259.383292). [ETH author PDF](https://cgl.ethz.ch/Downloads/Publications/Papers/2001/p_Par01.pdf).

Inspected §4.1 and Figure 10, PDF p.5. After road generation, blocks are recursively divided along approximately parallel long edges until an area threshold. Concave allotments are forbidden; lots that are too small or have no street access are discarded. Figure 10 shows street map → blocks → lots.

Transfer recommendation: useful baseline, not a reason to drop output area. A City Library procedure should retain rejected/unsupported regions explicitly. A historical graphics pipeline's discard rule is not an acceptable unreported accounting loss.

## 4. Chen, Song & Ortner 2024: co-generation, not OBB

*Hierarchical Co-generation of Parcels and Streets in Urban Modeling*, CGF 43(2), e15053. DOI [10.1111/cgf.15053](https://doi.org/10.1111/cgf.15053). [Author project](https://sutd-cgl.github.io/supp/Publication/projects/2024-EG-UrbanModeling/index.html), [author PDF](https://sutd-cgl.github.io/supp/Publication/papers/2024-EG-UrbanModeling.pdf).

Inspected §§3–5, pp.3–8, and limitations p.13 from downloaded full text. Input is a planar polygonal region. Each hierarchy level considers about 20 cross-field streamlines as binary cuts, scoring area balance, regularity and existing access. It then adds I/L-shaped accesses for unreachable parcel groups and weighted Dijkstra connections to the street graph. A separate global mesh optimization improves sides, streets and junctions while retaining the domain. Its representation includes parcel mesh and several graphs. The prototype uses Rhino/Grasshopper/Python. It omits land-use guidance, terrain variation, traffic and practical street hierarchy.

Transfer recommendation: separate future co-generation procedure with intermediate stages, explicit work budget and topology validation. Do not hide it behind an OBB option or claim the full method from straight cuts plus shortest paths. Finite-width street accounting needs its own target contract.

## 5. Wickramasuriya 2011: bounded evidence only

Correct record above. Publisher indexed abstract/methods excerpt describe vector parcel input and lot/street output, with lot width/length and street width constraints; reported resemblance is strongest for parallel streets and roughly equal lots. **Full methods not accessed**: direct publisher open returned HTTP 403; no author-hosted full text found in this bounded search. No exact algorithm, implementation dependencies or test reproducibility is claimed.

Recommendation: retain as planning-comparison literature. Obtain legitimate full text before specifying or implementing a named faithful strategy. Do not confuse this article with a similarly named planning-journal citation.

## 6. Koc et al. online 2020 / issue 2022: bounded evidence only

Correct record above. Publisher abstract identifies edge-value, area-value and combined subdivision variants, Gauss area calculation and binary search for boundaries/area; application is a Konya zoning case. **Full methods unavailable at the publisher (purchase page)**. A third-party offprint was surfaced but was not used as primary-source method evidence.

Recommendation: investigate area-target cuts as a small primitive only after a separate mathematical contract and full-method review. Do not promise statutory compliance, exact zoning adaptation or reproduction from the abstract.

## Proposed library consequences (our synthesis, not paper claims)

1. Keep polygon operations detached from World, Grid and presentation. A cell layout and a continuous land block are distinct inputs.
2. Distinguish `split` (one geometric cut), `subdivide` (bounded recursive search) and street/parcel co-generation (a coupled procedure).
3. Preserve existing `geometry` and `topology` vocabulary; avoid a new manager or class hierarchy solely for methods.
4. Represent labelled road boundary intervals separately from network reachability. Point contact has zero frontage. Legal access is model policy.
5. Report accepted lots and retained residuals with reasons. Search-budget exhaustion does not prove infeasibility.
6. Treat area tolerance, length tolerance, coordinate units, maximum work, deterministic order, seed ownership and lineage as explicit contracts.
7. Freeze five public examples before runtime: rectangular OBB split; west-only road retry; bounded recursive area goal; rejected narrow region retained; independent seed runs. Add a separate corridor/block fixture before arbitrary street-derived inputs.
8. Keep learned urban-layout generators and reinforcement learning outside this first geometry contract. They require data/training/inference contracts and do not replace deterministic geometric invariants.

## Screenshot assets and attribution

Original PDF pages rasterized with `pdftoppm -scale-to 1600 -png`; no AI generation or geometry modification. These are review illustrations, not a redistribution/license clearance. Attribute beside each displayed image and link the original. Full-page PNGs preserve captions and credit; crops should preserve figure numbers and attribution. Screenshot imagery is not target-runtime output.

| Path (under `assets/`) | Original page / use |
| --- | --- |
| `vanegas-page-5.png` | PDF p.5 / printed p.685, Figs.3–4: skeleton strips and corner correction |
| `vanegas-page-7.png` | PDF p.7 / printed p.687, Fig.6: recursive OBB |
| `skeleton-page-2.png` | PDF p.2 / printed p.753, Fig.1: shrinking polygon and skeleton |
| `parish-page-5.png` | PDF p.5, Fig.10: streets, blocks, lots |
| `cogeneration-page-5.png` | PDF p.5, Figs.5–6: hierarchy, new accesses and candidate scoring |

Also retained local PDFs and `pdftotext -layout` text for audit. Visually inspected `vanegas-page-5.png` and `cogeneration-page-5.png`; both readable. Web PDF screenshot calls additionally ran for Vanegas pp.5/7, Aichholzer p.2 and Parish p.5. Browser PDF fetch of the 27.8 MB Chen PDF exceeded the web tool size limit; shell download and Poppler extraction succeeded.

No runtime checks or visual approval claimed. No application server started.


## Townscaper primary developer evidence

[TOWNSCAPER.md](TOWNSCAPER.md) adds timestamped author talks rather than treating a game-development algorithm as another parcel paper. Its finite triangular-patch/pair/refine sequence, square-target solver, module/player duality and cluster-interpolation seams have distinct consequences. Our local Laplace-smoothed prototype is inspiration, not a faithful original port. The accepted integration adds finite topology generation and a separate relaxation method; no result of this research supplies a parcel straight-skeleton backend or legal road access. See the [archived Astra advice](evidence/townscaper-astra-proposal.md).
