# City Library: selected NetLogo Web implementation scope (200 models)

Selected: 5 November 2026. Source: the [NetLogo Web launcher](https://www.netlogoweb.org/launch), browser-inventoried on the same date. The source catalog contains 550 unique entries: 467 selectable and 83 disabled. This selection contains **exactly 200 unique, selectable source paths**, with **200 unique proposed slugs**.

## Selection rationale and evidence limits

The complete selectable list was read and the following models were chosen deliberately for complementary mechanisms rather than taking the first 200 or sampling randomly. Sustainable-city relevance is emphasized through all eleven Urban Suite entries, several transport environments, markets, inequality, governance, energy, pollution, landscape dynamics and networks. Ecology, genetics, disease, chemistry, mathematical construction and computing prevent city relevance from narrowing the library's capability coverage.

The five mandatory anchors are included: Preferential Attachment, Voting, Wolf Sheep Predation, Wealth Distribution and Segregation. Existing implementation status is not re-certified here. Alternative visualizations, perspective demos and large families of near-identical elementary-rule variants were omitted. Some deliberate comparisons remain because they introduce distinct mechanisms: lane changes versus car following, goal-directed travel, formation geometry, intervention epidemics, multilayer learning, Monte Carlo versus force integration, and explicit polymer-chain topology.

**Every model below has `source-audit pending`.** Its reason and mechanism tags are initial selection hypotheses informed by the catalog and known model families. They are not claims that its NetLogo procedures, plots, licensing or scientific assumptions have already been analyzed. The browser verified catalog membership and availability flags; it did not prove successful execution of every model. The proposed delivery order must be refined through actual dependency audits. No implementation was performed by this selection task.

## Delivery and acceptance rules

- Pin and read each model's actual source, widget reporters, plots, defaults, Info and license before implementation; record deviations explicitly.
- Preserve one authority for domain state. Reusable domain behavior belongs in the headless public library; reusable presentation belongs in `ui/`; model-specific rules remain readable headless compositions.
- Write and freeze four or five asserted public example scripts before every library expansion phase. The thematic batches below do not replace this gate.
- Check source-specific initialization, update order, boundaries, stopping conditions and observations. Rendering and measurement must not consume simulation randomness or change time.
- Execute relevant type, behavior, example, build and public-consumer checks; verify changed browser flows and reference comparisons in real Chromium. Record independent review separately.
- Account for every selected path until implementation and target evidence exist. Difficult extension/host cases remain work, not placeholders or silent scope exclusions.

## Coverage

| Catalog category | Selected |
| --- | ---: |
| Sample Models | 170 |
| IABM Textbook | 3 |
| Curricular Models | 22 |
| Code Examples | 5 |
| **Total** | **200** |

No Alternative Visualizations entries were selected, because changing presentation alone adds less mechanism breadth than an independent model.

## B01: Existing anchors and network mechanisms (10 models)

**Scope:** Audit existing model compositions and establish graph growth, connectivity and directed contagion contracts.

**Verification criteria:** Preserve source initialization, graph direction, activation order and terminal rules; verify canonical identities and observation purity.

**Audit status:** source-audit pending for all ten entries.

1. **Preferential Attachment** — Required existing anchor for degree-biased network growth.
   - Source path: `Sample Models/Networks/Preferential Attachment`
   - Proposed slug: `preferential-attachment`; mechanisms: network, growth, stochastic.
2. **Voting** — Required existing anchor for synchronous local majority decisions.
   - Source path: `Sample Models/Social Science/Voting`
   - Proposed slug: `voting`; mechanisms: grid, collective-decision, deterministic.
3. **Wolf Sheep Predation** — Required existing anchor for predator-prey dynamics with renewable grass.
   - Source path: `Sample Models/Biology/Wolf Sheep Predation`
   - Proposed slug: `wolf-sheep-predation`; mechanisms: ecology, movement, stochastic.
4. **Wealth Distribution** — Required existing anchor for resource accumulation and inequality measurements.
   - Source path: `Sample Models/Social Science/Economics/Wealth Distribution`
   - Proposed slug: `wealth-distribution`; mechanisms: economy, resources, inequality.
5. **Segregation** — Required linked reference for preference-driven residential relocation.
   - Source path: `Sample Models/Social Science/Segregation`
   - Proposed slug: `segregation`; mechanisms: urban, relocation, thresholds.
6. **Giant Component** — Tests emergence of macroscopic connectivity as network density changes.
   - Source path: `Sample Models/Networks/Giant Component`
   - Proposed slug: `giant-component`; mechanisms: network, connectivity, stochastic.
7. **Small Worlds** — Adds local clustering versus shortcut-induced short paths.
   - Source path: `Sample Models/Networks/Small Worlds`
   - Proposed slug: `small-worlds`; mechanisms: network, rewiring, path-length.
8. **Diffusion on a Directed Network** — Separates directional influence propagation from undirected neighborhood assumptions.
   - Source path: `Sample Models/Networks/Diffusion on a Directed Network`
   - Proposed slug: `diffusion-on-a-directed-network`; mechanisms: network, directed, diffusion.
9. **Virus on a Network** — Adds infection and recovery on explicit persistent contact links.
   - Source path: `Sample Models/Networks/Virus on a Network`
   - Proposed slug: `virus-on-a-network`; mechanisms: network, epidemic, stochastic.
10. **Team Assembly** — Explores team composition through repeat collaboration and recruitment.
   - Source path: `Sample Models/Networks/Team Assembly`
   - Proposed slug: `team-assembly`; mechanisms: network, formation, collaboration.

## B02: Social learning and collective decisions (10 models)

**Scope:** Cover individual preferences, opinion transmission, coordination, conflict and cognitive learning.

**Verification criteria:** Audit decision timing, information available to agents, tie rules and outcome metrics; verify parameter changes affect canonical state.

**Audit status:** source-audit pending for all ten entries.

11. **Consumer Choice** — Adds heterogeneous purchasing preferences and consumer interactions.
   - Source path: `Sample Models/Social Science/Consumer Choice`
   - Proposed slug: `consumer-choice`; mechanisms: social, choice, heterogeneity.
12. **Rebellion** — Models conflict between grievance, policing and collective participation.
   - Source path: `Sample Models/Social Science/Rebellion`
   - Proposed slug: `rebellion`; mechanisms: social, conflict, thresholds.
13. **Language Change** — Explores linguistic conventions emerging through repeated local interactions.
   - Source path: `Sample Models/Social Science/Language Change`
   - Proposed slug: `language-change`; mechanisms: social, language, learning.
14. **Party** — Tests movement driven by preferences over nearby social composition.
   - Source path: `Sample Models/Social Science/Party`
   - Proposed slug: `party`; mechanisms: social, movement, preferences.
15. **Ethnocentrism** — Adds group identity and conditional cooperative behavior.
   - Source path: `Sample Models/Social Science/Ethnocentrism`
   - Proposed slug: `ethnocentrism`; mechanisms: social, identity, cooperation.
16. **Minority Game** — Represents adaptive competition for a scarce minority outcome.
   - Source path: `Sample Models/Social Science/Minority Game`
   - Proposed slug: `minority-game`; mechanisms: social, adaptation, competition.
17. **Rumor Mill** — Separates information exposure from willingness to retransmit rumors.
   - Source path: `Sample Models/Social Science/Rumor Mill`
   - Proposed slug: `rumor-mill`; mechanisms: social, information, diffusion.
18. **Signaling Game** — Studies emergence of shared signals through repeated signaling interactions.
   - Source path: `Sample Models/Philosophy/Signaling Game`
   - Proposed slug: `signaling-game`; mechanisms: game-theory, signaling, learning.
19. **Piaget-Vygotsky Game** — Provides a contrasting developmental-learning and social-interaction model.
   - Source path: `Sample Models/Psychology/Piaget-Vygotsky Game`
   - Proposed slug: `piaget-vygotsky-game`; mechanisms: psychology, learning, interaction.
20. **Heroes and Cowards** — Explores heterogeneous behavior through contrasting risk-response strategies.
   - Source path: `IABM Textbook/chapter 2/Heroes and Cowards`
   - Proposed slug: `heroes-and-cowards`; mechanisms: social, heterogeneity, coordination.

## B03: Markets, allocation and strategic interaction (10 models)

**Scope:** Model exchanges, financial stocks, strategic location, routing incentives and repeated games.

**Verification criteria:** Define ownership of orders, balances and allocations; test conservation where specified, market matching, payoffs and source stopping conditions.

**Audit status:** source-audit pending for all ten entries.

21. **Fruit Wars** — Adds competition for spatially distributed economic resources.
   - Source path: `Sample Models/Social Science/Economics/Fruit Wars`
   - Proposed slug: `fruit-wars`; mechanisms: economy, competition, resources.
22. **Limited Order Book** — Requires explicit limit orders, matching and price formation.
   - Source path: `Sample Models/Social Science/Economics/Limited Order Book`
   - Proposed slug: `limited-order-book`; mechanisms: economy, order-book, matching.
23. **Bidding Market** — Contrasts bidding-based allocation with an order-book market.
   - Source path: `Sample Models/Social Science/Economics/Bidding Market`
   - Proposed slug: `bidding-market`; mechanisms: economy, auction, allocation.
24. **Hotelling's Law** — Connects strategic firm locations with spatial consumer demand.
   - Source path: `Sample Models/Social Science/Economics/Hotelling's Law`
   - Proposed slug: `hotellings-law`; mechanisms: economy, spatial-choice, competition.
25. **Braess Paradox** — Tests counterintuitive congestion effects from individual route choice.
   - Source path: `Sample Models/Social Science/Economics/Braess Paradox`
   - Proposed slug: `braess-paradox`; mechanisms: transport, routing, congestion.
26. **Cash Flow** — Tracks circulation of money through explicit economic transfers.
   - Source path: `Sample Models/Social Science/Economics/Unverified/Cash Flow`
   - Proposed slug: `cash-flow`; mechanisms: economy, stocks, flows.
27. **Bank Reserves** — Adds bank balance sheets and reserve-constrained financial dynamics.
   - Source path: `Sample Models/Social Science/Economics/Unverified/Bank Reserves`
   - Proposed slug: `bank-reserves`; mechanisms: economy, banking, balance-sheet.
28. **Prisoner's Dilemma Basic** — Establishes a transparent baseline for cooperation and defection payoffs.
   - Source path: `Sample Models/Social Science/Prisoner's Dilemma/Prisoner's Dilemma Basic`
   - Proposed slug: `prisoners-dilemma-basic`; mechanisms: game-theory, payoffs, cooperation.
29. **Prisoner's Dilemma Two Person Iterated** — Adds strategy memory and repeated bilateral interaction.
   - Source path: `Sample Models/Social Science/Prisoner's Dilemma/Prisoner's Dilemma Two Person Iterated`
   - Proposed slug: `prisoners-dilemma-two-person-iterated`; mechanisms: game-theory, memory, repeated-game.
30. **El Farol** — Represents adaptive attendance under shared capacity constraints.
   - Source path: `IABM Textbook/chapter 3/El Farol Extensions/El Farol`
   - Proposed slug: `el-farol`; mechanisms: social, adaptive-expectations, capacity.

## B04: Transport, navigation and urban feedback (10 models)

**Scope:** Deliver distinct transport environments, navigation, adaptive decisions and feedback examples; retain documented behavioral variants only when they add mechanisms.

**Verification criteria:** Verify movement boundaries, collision/headway rules, signal timing, trip goals and feedback update order against source contracts.

**Audit status:** source-audit pending for all ten entries.

31. **Paths** — Investigates trail formation through repeated movement and environmental traces.
   - Source path: `Sample Models/Social Science/Paths`
   - Proposed slug: `paths`; mechanisms: transport, trails, feedback.
32. **Traffic 2 Lanes** — Adds lane changing to car-following dynamics.
   - Source path: `Sample Models/Social Science/Traffic 2 Lanes`
   - Proposed slug: `traffic-2-lanes`; mechanisms: transport, lane-change, car-following.
33. **Traffic Grid** — Combines intersections, signals and networked vehicle movement.
   - Source path: `Sample Models/Social Science/Traffic Grid`
   - Proposed slug: `traffic-grid`; mechanisms: transport, grid, signals.
34. **Taxi Cabs** — Adds passenger pickup and vehicle search behavior.
   - Source path: `Sample Models/Social Science/Taxi Cabs`
   - Proposed slug: `taxi-cabs`; mechanisms: transport, service, search.
35. **Traffic Basic** — Provides the minimal car-following and traffic-wave reference.
   - Source path: `Sample Models/Social Science/Traffic Basic`
   - Proposed slug: `traffic-basic`; mechanisms: transport, car-following, emergence.
36. **Traffic Intersection** — Isolates intersection conflict and traffic-control behavior.
   - Source path: `Sample Models/Social Science/Unverified/Traffic Intersection`
   - Proposed slug: `traffic-intersection`; mechanisms: transport, intersection, control.
37. **Urban Suite - Structure from Randomness 1** — Studies urban structure generated by repeated local random actions.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Structure from Randomness 1`
   - Proposed slug: `urban-suite-structure-from-randomness-1`; mechanisms: urban, emergence, stochastic.
38. **Traffic Grid Goal** — Adds destination-driven movement beyond the baseline traffic grid.
   - Source path: `IABM Textbook/chapter 5/Traffic Grid Goal`
   - Proposed slug: `traffic-grid-goal`; mechanisms: transport, goal-directed, routing.
39. **Urban Suite - Positive Feedback** — Makes reinforcing urban feedback an explicit modeled mechanism.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Positive Feedback`
   - Proposed slug: `urban-suite-positive-feedback`; mechanisms: urban, positive-feedback, emergence.
40. **Urban Suite - Path Dependence** — Shows how earlier decisions constrain later urban outcomes.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Path Dependence`
   - Proposed slug: `urban-suite-path-dependence`; mechanisms: urban, path-dependence, history.

## B05: Sustainable urban systems and landscapes (10 models)

**Scope:** Complete the Urban Suite coverage while connecting city processes to environmental fields and landscape change.

**Verification criteria:** Audit each Urban Suite rule independently; verify bounded quantities, environmental coupling, spatial decisions and declared policy measurements.

**Audit status:** source-audit pending for all ten entries.

41. **Urban Suite - Cells** — Provides a cell-based urban development composition.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Cells`
   - Proposed slug: `urban-suite-cells`; mechanisms: urban, cells, development.
42. **Urban Suite - Structure from Randomness 2** — Contrasts a second structure-from-randomness mechanism with its first form.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Structure from Randomness 2`
   - Proposed slug: `urban-suite-structure-from-randomness-2`; mechanisms: urban, structure, stochastic.
43. **Urban Suite - Tijuana Bordertowns** — Adds a geographically contextualized border-city development case.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Tijuana Bordertowns`
   - Proposed slug: `urban-suite-tijuana-bordertowns`; mechanisms: urban, spatial-development, context.
44. **Urban Suite - Pollution** — Links distributed urban activity to pollution exposure.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Pollution`
   - Proposed slug: `urban-suite-pollution`; mechanisms: urban, pollution, fields.
45. **Urban Suite - Economic Disparity** — Connects economic differences with spatial urban outcomes.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Economic Disparity`
   - Proposed slug: `urban-suite-economic-disparity`; mechanisms: urban, inequality, spatial-economy.
46. **Urban Suite - Awareness** — Explores awareness transmission as a sustainability-relevant social process.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Awareness`
   - Proposed slug: `urban-suite-awareness`; mechanisms: urban, awareness, diffusion.
47. **Urban Suite - Recycling** — Models recycling behavior and local environmental decisions.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Recycling`
   - Proposed slug: `urban-suite-recycling`; mechanisms: urban, recycling, behavior.
48. **Urban Suite - Sprawl Effect** — Provides a direct urban-sprawl and land-use reference.
   - Source path: `Curricular Models/Urban Suite/Urban Suite - Sprawl Effect`
   - Proposed slug: `urban-suite-sprawl-effect`; mechanisms: urban, land-use, sprawl.
49. **Climate Change** — Links radiative-energy processes to changing environmental conditions.
   - Source path: `Sample Models/Earth Science/Climate Change`
   - Proposed slug: `climate-change`; mechanisms: climate, energy, feedback.
50. **Erosion** — Adds terrain modification through erosion and transport.
   - Source path: `Sample Models/Earth Science/Erosion`
   - Proposed slug: `erosion`; mechanisms: landscape, erosion, transport.

## B06: Population ecology and collective movement (10 models)

**Scope:** Combine population turnover, renewable resources, distributed construction and animal movement.

**Verification criteria:** Check birth/death ordering, resource regrowth, population accounting, movement units and isolated random streams.

**Audit status:** source-audit pending for all ten entries.

51. **Simple Birth Rates** — Isolates population turnover before complex ecological coupling.
   - Source path: `Sample Models/Biology/Simple Birth Rates`
   - Proposed slug: `simple-birth-rates`; mechanisms: ecology, births, population.
52. **Daisyworld** — Couples organism composition to environmental temperature feedback.
   - Source path: `Sample Models/Biology/Daisyworld`
   - Proposed slug: `daisyworld`; mechanisms: ecology, climate, feedback.
53. **Termites** — Demonstrates collective construction from local material-handling rules.
   - Source path: `Sample Models/Biology/Termites`
   - Proposed slug: `termites`; mechanisms: collective, construction, stigmergy.
54. **Shepherds** — Adds herding and directed influence on moving populations.
   - Source path: `Sample Models/Biology/Shepherds`
   - Proposed slug: `shepherds`; mechanisms: collective, movement, control.
55. **Rabbits Grass Weeds** — Contrasts competing consumers over distinct renewable plant resources.
   - Source path: `Sample Models/Biology/Rabbits Grass Weeds`
   - Proposed slug: `rabbits-grass-weeds`; mechanisms: ecology, competition, regrowth.
56. **Invasive Plants** — Tests spatial spread and competition of invasive vegetation.
   - Source path: `Sample Models/Biology/Invasive Plants`
   - Proposed slug: `invasive-plants`; mechanisms: ecology, invasion, spatial-growth.
57. **Ants** — Combines foraging, pheromone fields and distributed resource discovery.
   - Source path: `Sample Models/Biology/Ants`
   - Proposed slug: `ants`; mechanisms: collective, foraging, fields.
58. **Heatbugs** — Couples agent movement preferences to a diffusing heat field.
   - Source path: `Sample Models/Biology/Heatbugs`
   - Proposed slug: `heatbugs`; mechanisms: ecology, diffusion, movement.
59. **Flocking** — Establishes alignment, separation and cohesion in collective motion.
   - Source path: `Sample Models/Biology/Flocking`
   - Proposed slug: `flocking`; mechanisms: collective, flocking, geometry.
60. **Fireflies** — Studies synchronization through local oscillator interactions.
   - Source path: `Sample Models/Biology/Fireflies`
   - Proposed slug: `fireflies`; mechanisms: collective, synchronization, oscillators.

## B07: Biological patterns and regulation (10 models)

**Scope:** Cover morphogenesis, physiological feedback, seasonal processes and local cellular interactions.

**Verification criteria:** Verify field update timing, local-neighborhood semantics, feedback response and each source model's observables and bounds.

**Audit status:** source-audit pending for all ten entries.

61. **Chloroplasts and Food** — Connects light-responsive cellular components to food production.
   - Source path: `Sample Models/Biology/Chloroplasts and Food`
   - Proposed slug: `chloroplasts-and-food`; mechanisms: biology, photosynthesis, resources.
62. **Slime** — Adds distributed aggregation and movement driven by local signals.
   - Source path: `Sample Models/Biology/Slime`
   - Proposed slug: `slime`; mechanisms: biology, aggregation, signaling.
63. **Fur** — Represents spatial pattern formation in biological tissue.
   - Source path: `Sample Models/Biology/Fur`
   - Proposed slug: `fur`; mechanisms: biology, patterns, local-rules.
64. **Blood Sugar Regulation** — Adds homeostatic regulation with explicit physiological feedback.
   - Source path: `Sample Models/Biology/Blood Sugar Regulation`
   - Proposed slug: `blood-sugar-regulation`; mechanisms: biology, homeostasis, feedback.
65. **Honeycomb** — Studies repeated local construction producing honeycomb geometry.
   - Source path: `Sample Models/Biology/Honeycomb`
   - Proposed slug: `honeycomb`; mechanisms: biology, construction, geometry.
66. **Autumn** — Represents seasonal biological change with spatially varying outcomes.
   - Source path: `Sample Models/Biology/Autumn`
   - Proposed slug: `autumn`; mechanisms: biology, seasonality, spatial-state.
67. **Membrane Formation** — Tests self-assembly of a biological boundary from local interactions.
   - Source path: `Sample Models/Biology/Membrane Formation`
   - Proposed slug: `membrane-formation`; mechanisms: biology, self-assembly, membranes.
68. **Sunflower Emergent** — Explores emergent seed-arrangement geometry rather than prescribed placement.
   - Source path: `Sample Models/Biology/Sunflower Emergent`
   - Proposed slug: `sunflower-emergent`; mechanisms: biology, phyllotaxis, emergence.
69. **Tumor** — Adds cellular growth and tumor-population dynamics.
   - Source path: `Sample Models/Biology/Tumor`
   - Proposed slug: `tumor`; mechanisms: biology, growth, cellular.
70. **Muscle Development** — Models local interactions during tissue development.
   - Source path: `Sample Models/Biology/Muscle Development`
   - Proposed slug: `muscle-development`; mechanisms: biology, development, local-interaction.

## B08: Evolution, inheritance and selection (10 models)

**Scope:** Span selection, learning interactions, genetic drift and inherited-trait distributions.

**Verification criteria:** Audit trait inheritance, mutation/selection order, reproductive sampling and population statistics; avoid inferring biological claims from visual similarity.

**Audit status:** source-audit pending for all ten entries.

71. **Mimicry** — Adds adaptive resemblance under environmental selection.
   - Source path: `Sample Models/Biology/Evolution/Mimicry`
   - Proposed slug: `mimicry`; mechanisms: evolution, mimicry, selection.
72. **Anisogamy** — Explores differentiation of reproductive strategies.
   - Source path: `Sample Models/Biology/Evolution/Anisogamy`
   - Proposed slug: `anisogamy`; mechanisms: evolution, reproduction, strategies.
73. **Peppered Moths** — Connects environmental change to differential survival of visible traits.
   - Source path: `Sample Models/Biology/Evolution/Peppered Moths`
   - Proposed slug: `peppered-moths`; mechanisms: evolution, camouflage, environment.
74. **Baldwin Effect** — Separates learning during life from inherited evolutionary change.
   - Source path: `Sample Models/Biology/Evolution/Baldwin Effect`
   - Proposed slug: `baldwin-effect`; mechanisms: evolution, learning, inheritance.
75. **Mammoths** — Adds extinction risk in a large-animal population context.
   - Source path: `Sample Models/Biology/Evolution/Mammoths`
   - Proposed slug: `mammoths`; mechanisms: evolution, population, extinction.
76. **Sex Ratio Equilibrium** — Studies selection acting on offspring sex allocation.
   - Source path: `Sample Models/Biology/Evolution/Sex Ratio Equilibrium`
   - Proposed slug: `sex-ratio-equilibrium`; mechanisms: evolution, sex-ratio, equilibrium.
77. **Bacterial Infection** — Couples infection processes with evolutionary population differences.
   - Source path: `Sample Models/Biology/Evolution/Bacterial Infection`
   - Proposed slug: `bacterial-infection`; mechanisms: evolution, infection, selection.
78. **Vision Evolution** — Treats perceptual capability as an evolving trait.
   - Source path: `Sample Models/Biology/Evolution/Vision Evolution`
   - Proposed slug: `vision-evolution`; mechanisms: evolution, perception, traits.
79. **GenDrift T interact** — Provides a genetic-drift model contrasting random change with selection.
   - Source path: `Sample Models/Biology/Evolution/Genetic Drift/GenDrift T interact`
   - Proposed slug: `gendrift-t-interact`; mechanisms: evolution, genetic-drift, sampling.
80. **Mendelian Inheritance** — Adds explicit Mendelian inheritance and offspring trait combinations.
   - Source path: `Curricular Models/CT-STEM/Mendelian Inheritance`
   - Proposed slug: `mendelian-inheritance`; mechanisms: genetics, inheritance, probability.

## B09: Epidemics and molecular mechanisms (10 models)

**Scope:** Cover spatial epidemics, interventions, intracellular processes, immune interaction and gene expression.

**Verification criteria:** Verify infection/recovery transitions, control effects, within-cell state ownership, reaction ordering and source metrics.

**Audit status:** source-audit pending for all ten entries.

81. **Disease Solo** — Establishes a compact individual-based disease-spread reference.
   - Source path: `Sample Models/Biology/Disease Solo`
   - Proposed slug: `disease-solo`; mechanisms: epidemic, contact, movement.
82. **Repressilator 1D** — Adds oscillatory gene-regulation dynamics at a molecular scale.
   - Source path: `Sample Models/Biology/Repressilator 1D`
   - Proposed slug: `repressilator-1d`; mechanisms: biology, gene-regulation, oscillators.
83. **HIV** — Represents immune-system interaction with an evolving infection process.
   - Source path: `Sample Models/Biology/HIV`
   - Proposed slug: `hiv`; mechanisms: epidemic, immunity, interaction.
84. **Virus** — Adds explicit infection, recovery and immunity to moving agents.
   - Source path: `Sample Models/Biology/Virus`
   - Proposed slug: `virus`; mechanisms: epidemic, recovery, immunity.
85. **CRISPR Bacterium** — Models bacterial defense at an intracellular CRISPR scale.
   - Source path: `Sample Models/Biology/CRISPR/CRISPR Bacterium`
   - Proposed slug: `crispr-bacterium`; mechanisms: biology, crispr, cellular.
86. **CRISPR Ecosystem** — Extends CRISPR interaction to an ecological population setting.
   - Source path: `Sample Models/Biology/CRISPR/CRISPR Ecosystem`
   - Proposed slug: `crispr-ecosystem`; mechanisms: biology, crispr, ecology.
87. **epiDEM Basic** — Provides a curricular epidemic baseline with teachable measurements.
   - Source path: `Curricular Models/epiDEM/epiDEM Basic`
   - Proposed slug: `epidem-basic`; mechanisms: epidemic, population, teaching.
88. **epiDEM Travel and Control** — Adds travel and intervention policies beyond the epidemic baseline.
   - Source path: `Curricular Models/epiDEM/epiDEM Travel and Control`
   - Proposed slug: `epidem-travel-and-control`; mechanisms: epidemic, mobility, control.
89. **GenEvo 1 Genetic Switch** — Introduces switch-like gene-expression regulation.
   - Source path: `Curricular Models/GenEvo/GenEvo 1 Genetic Switch`
   - Proposed slug: `genevo-1-genetic-switch`; mechanisms: biology, genetic-switch, regulation.
90. **DNA Protein Synthesis** — Represents transcription/translation-style molecular production processes.
   - Source path: `Curricular Models/BEAGLE Evolution/DNA Protein Synthesis`
   - Proposed slug: `dna-protein-synthesis`; mechanisms: biology, protein-synthesis, molecular.

## B10: Behavioral ecology and spatial organization (10 models)

**Scope:** Extend movement, foraging, cooperative decisions and environment-dependent patterning.

**Verification criteria:** Audit movement and sensing assumptions, interaction radii, trait/state differences and source-specific aggregation measurements.

**Audit status:** source-audit pending for all ten entries.

91. **Ant Lines** — Adds ordered group movement through local following behavior.
   - Source path: `Sample Models/Biology/Ant Lines`
   - Proposed slug: `ant-lines`; mechanisms: collective, following, trails.
92. **BeeSmart Hive Finding** — Models distributed evaluation and consensus during nest-site choice.
   - Source path: `Sample Models/Biology/BeeSmart Hive Finding`
   - Proposed slug: `beesmart-hive-finding`; mechanisms: collective, consensus, search.
93. **Moths** — Adds organism movement responding to environmental cues.
   - Source path: `Sample Models/Biology/Moths`
   - Proposed slug: `moths`; mechanisms: ecology, movement, response.
94. **Flocking Vee Formations** — Adds formation geometry beyond baseline flock alignment.
   - Source path: `Sample Models/Biology/Flocking Vee Formations`
   - Proposed slug: `flocking-vee-formations`; mechanisms: collective, formation, geometry.
95. **Slime Mold Network** — Connects adaptive biological transport to network formation.
   - Source path: `Sample Models/Biology/Slime Mold Network`
   - Proposed slug: `slime-mold-network`; mechanisms: biology, adaptive-network, transport.
96. **Rock Paper Scissors** — Provides cyclic competitive interactions and spatial coexistence.
   - Source path: `Sample Models/Biology/Rock Paper Scissors`
   - Proposed slug: `rock-paper-scissors`; mechanisms: ecology, cyclic-competition, spatial.
97. **Fairy Circles** — Explores landscape-scale vegetation pattern formation.
   - Source path: `Sample Models/Biology/Fairy Circles`
   - Proposed slug: `fairy-circles`; mechanisms: ecology, patterns, resources.
98. **Plant Growth** — Adds explicit development of plant structure over time.
   - Source path: `Sample Models/Biology/Unverified/Plant Growth`
   - Proposed slug: `plant-growth`; mechanisms: biology, growth, structure.
99. **Algae** — Adds aquatic producer-population dynamics.
   - Source path: `Sample Models/Biology/Unverified/Algae`
   - Proposed slug: `algae`; mechanisms: ecology, primary-production, population.
100. **Habitat Preference Behavior** — Connects habitat choice to measured environmental preferences.
   - Source path: `Curricular Models/CT-STEM/Habitat Preference Behavior`
   - Proposed slug: `habitat-preference-behavior`; mechanisms: ecology, habitat, choice.

## B11: Lattice fields, thresholds and aggregation (10 models)

**Scope:** Establish local updates, conservative transport where specified, critical thresholds and growth.

**Verification criteria:** Freeze neighborhood/boundary/update-order contracts; test conservation or source-defined loss, stable states and threshold behavior.

**Audit status:** source-audit pending for all ten entries.

101. **Sandpile** — Represents avalanche cascades from local overload thresholds.
   - Source path: `Sample Models/Chemistry & Physics/Sandpile`
   - Proposed slug: `sandpile`; mechanisms: lattice, thresholds, cascades.
102. **Ising** — Adds local energy-based spin transitions and collective order.
   - Source path: `Sample Models/Chemistry & Physics/Ising`
   - Proposed slug: `ising`; mechanisms: lattice, energy, stochastic.
103. **Sand** — Models granular transport and settling under local rules.
   - Source path: `Sample Models/Chemistry & Physics/Sand`
   - Proposed slug: `sand`; mechanisms: lattice, granular, transport.
104. **Solid Diffusion** — Represents diffusion within a solid-state medium.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Solid Diffusion`
   - Proposed slug: `solid-diffusion`; mechanisms: materials, diffusion, lattice.
105. **Interstitial Diffusion** — Adds transport through interstitial positions in a lattice.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Interstitial Diffusion`
   - Proposed slug: `interstitial-diffusion`; mechanisms: materials, interstitial, diffusion.
106. **Heat Diffusion** — Provides a thermal field diffusion reference.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Heat Diffusion`
   - Proposed slug: `heat-diffusion`; mechanisms: energy, heat, diffusion.
107. **Crystallization Basic** — Represents ordered crystal growth from local attachment.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Crystallization/Crystallization Basic`
   - Proposed slug: `crystallization-basic`; mechanisms: materials, crystallization, growth.
108. **DLA** — Adds random-walk-driven diffusion-limited aggregate growth.
   - Source path: `Sample Models/Chemistry & Physics/Diffusion Limited Aggregation/DLA`
   - Proposed slug: `dla`; mechanisms: aggregation, random-walk, fractal.
109. **Fire** — Models spread and termination over a spatial fuel distribution.
   - Source path: `Sample Models/Earth Science/Fire`
   - Proposed slug: `fire`; mechanisms: landscape, fire, spread.
110. **Percolation** — Tests connectivity thresholds in spatially random media.
   - Source path: `Sample Models/Earth Science/Percolation`
   - Proposed slug: `percolation`; mechanisms: lattice, connectivity, percolation.

## B12: Kinetic gases and thermodynamic controls (10 models)

**Scope:** Deliver particle collisions, containers, gas separation and controlled energy/volume changes.

**Verification criteria:** Specify particle units, collision handling, boundary interactions and thermal controls; verify source conservation laws within declared tolerances.

**Audit status:** source-audit pending for all ten entries.

111. **Hydrogen Gas Production** — Links a chemical-production setting to gas-particle generation.
   - Source path: `Sample Models/Chemistry & Physics/Hydrogen Gas Production`
   - Proposed slug: `hydrogen-gas-production`; mechanisms: chemistry, gas, production.
112. **Thermostat** — Adds a feedback controller regulating thermal behavior.
   - Source path: `Sample Models/Chemistry & Physics/Thermostat`
   - Proposed slug: `thermostat`; mechanisms: energy, control, temperature.
113. **Gas Chromatography** — Adds separation through different particle transport behavior.
   - Source path: `Sample Models/Chemistry & Physics/Gas Chromatography`
   - Proposed slug: `gas-chromatography`; mechanisms: chemistry, separation, transport.
114. **Boiling** — Represents phase-change behavior rather than only ideal gas motion.
   - Source path: `Sample Models/Chemistry & Physics/Boiling`
   - Proposed slug: `boiling`; mechanisms: physics, phase-change, temperature.
115. **GasLab Maxwells Demon** — Tests selective particle passage and thermodynamic sorting.
   - Source path: `Sample Models/Chemistry & Physics/GasLab/GasLab Maxwells Demon`
   - Proposed slug: `gaslab-maxwells-demon`; mechanisms: physics, selection, thermodynamics.
116. **GasLab Free Gas** — Establishes unconstrained gas-particle motion and collision behavior.
   - Source path: `Sample Models/Chemistry & Physics/GasLab/GasLab Free Gas`
   - Proposed slug: `gaslab-free-gas`; mechanisms: physics, kinetic-gas, collision.
117. **GasLab Adiabatic Piston** — Adds pressure-volume work through an adiabatic piston.
   - Source path: `Sample Models/Chemistry & Physics/GasLab/GasLab Adiabatic Piston`
   - Proposed slug: `gaslab-adiabatic-piston`; mechanisms: energy, piston, adiabatic.
118. **GasLab Single Collision** — Isolates a two-particle collision for precise mechanics verification.
   - Source path: `Sample Models/Chemistry & Physics/GasLab/GasLab Single Collision`
   - Proposed slug: `gaslab-single-collision`; mechanisms: physics, collision, conservation.
119. **GasLab Atmosphere** — Adds vertical distribution under gravity in a gas.
   - Source path: `Sample Models/Chemistry & Physics/GasLab/GasLab Atmosphere`
   - Proposed slug: `gaslab-atmosphere`; mechanisms: physics, gravity, atmosphere.
120. **GasLab Isothermal Piston** — Contrasts temperature-controlled compression with adiabatic work.
   - Source path: `Sample Models/Chemistry & Physics/GasLab/GasLab Isothermal Piston`
   - Proposed slug: `gaslab-isothermal-piston`; mechanisms: energy, piston, isothermal.

## B13: Continuous mechanics and interacting particles (10 models)

**Scope:** Cover chaotic motion, force fields, molecular interactions and continuous-time integration.

**Verification criteria:** Audit integration method/time step, force laws, singularities, boundaries and numerical tolerances; distinguish source equivalence from scientific validation.

**Audit status:** source-audit pending for all ten entries.

121. **Chaos in a Box** — Adds sensitivity to initial conditions in bounded motion.
   - Source path: `Sample Models/Chemistry & Physics/Chaos in a Box`
   - Proposed slug: `chaos-in-a-box`; mechanisms: physics, chaos, boundaries.
122. **Kicked Rotator** — Represents periodically driven rotational dynamics.
   - Source path: `Sample Models/Chemistry & Physics/Kicked Rotator`
   - Proposed slug: `kicked-rotator`; mechanisms: physics, rotation, chaos.
123. **Polymer Dynamics** — Adds connected-chain mechanics and conformational motion.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Polymer Dynamics`
   - Proposed slug: `polymer-dynamics`; mechanisms: materials, polymer, mechanics.
124. **Monte Carlo Lennard-Jones** — Adds stochastic equilibrium sampling for interacting molecular particles.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Monte Carlo Lennard-Jones`
   - Proposed slug: `monte-carlo-lennard-jones`; mechanisms: physics, monte-carlo, potential.
125. **Molecular Dynamics Lennard-Jones** — Contrasts force-based molecular dynamics with Monte Carlo sampling.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Molecular Dynamics Lennard-Jones`
   - Proposed slug: `molecular-dynamics-lennard-jones`; mechanisms: physics, integration, potential.
126. **N-Bodies** — Requires many-body gravitational force accumulation.
   - Source path: `Sample Models/Chemistry & Physics/Mechanics/Unverified/N-Bodies`
   - Proposed slug: `n-bodies`; mechanisms: physics, n-body, gravity.
127. **Gravitation** — Provides a contrasting gravitational-motion reference.
   - Source path: `Sample Models/Chemistry & Physics/Mechanics/Unverified/Gravitation`
   - Proposed slug: `gravitation`; mechanisms: physics, gravitation, orbits.
128. **Osmotic Pressure** — Connects selective permeability with particle pressure differences.
   - Source path: `Sample Models/Chemistry & Physics/Unverified/Osmotic Pressure`
   - Proposed slug: `osmotic-pressure`; mechanisms: physics, osmosis, membrane.
129. **Scattering** — Adds trajectories deflected by scattering interactions.
   - Source path: `Sample Models/Chemistry & Physics/Unverified/Scattering`
   - Proposed slug: `scattering`; mechanisms: physics, scattering, trajectories.
130. **Pendulum** — Provides a controlled oscillatory mechanical-system reference.
   - Source path: `Curricular Models/CT-STEM/Pendulum`
   - Proposed slug: `pendulum`; mechanisms: physics, pendulum, oscillation.

## B14: Waves, charge and material transport (10 models)

**Scope:** Combine field oscillation, discrete transport, electromagnetic interactions and material deformation.

**Verification criteria:** Specify lattice/continuous mappings, propagation speed, force/charge conventions and field observations; test boundary/reflection and source-specific invariants.

**Audit status:** source-audit pending for all ten entries.

131. **Current in a Semiconductor** — Models electrical current through semiconductor material.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Current in a Semiconductor`
   - Proposed slug: `current-in-a-semiconductor`; mechanisms: energy, semiconductor, charge.
132. **Dislocation Motion and Deformation** — Adds deformation through lattice defects and their movement.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Dislocation Motion and Deformation`
   - Proposed slug: `dislocation-motion-and-deformation`; mechanisms: materials, dislocations, deformation.
133. **Wave Machine** — Provides a propagating-wave and boundary-interaction reference.
   - Source path: `Sample Models/Chemistry & Physics/Waves/Wave Machine`
   - Proposed slug: `wave-machine`; mechanisms: physics, waves, propagation.
134. **Lattice Gas Automaton** — Represents transport through a discrete lattice-gas automaton.
   - Source path: `Sample Models/Chemistry & Physics/Waves/Lattice Gas Automaton`
   - Proposed slug: `lattice-gas-automaton`; mechanisms: physics, lattice-gas, automaton.
135. **Rope** — Adds coupled mechanical segments with wave propagation.
   - Source path: `Sample Models/Chemistry & Physics/Waves/Rope`
   - Proposed slug: `rope`; mechanisms: physics, coupled-oscillators, waves.
136. **Chladni Figures** — Connects excitation to spatial standing-wave patterns.
   - Source path: `Sample Models/Chemistry & Physics/Waves/Chladni Figures`
   - Proposed slug: `chladni-figures`; mechanisms: physics, standing-waves, patterns.
137. **Doppler** — Adds source/observer motion to perceived wave frequency.
   - Source path: `Sample Models/Chemistry & Physics/Waves/Unverified/Doppler`
   - Proposed slug: `doppler`; mechanisms: physics, doppler, waves.
138. **Current in a Wire** — Provides a teachable electrical-current model.
   - Source path: `Curricular Models/NIELS/Current in a Wire`
   - Proposed slug: `current-in-a-wire`; mechanisms: energy, current, charge.
139. **Parallel Circuit** — Adds branch topology to electrical circuit behavior.
   - Source path: `Curricular Models/NIELS/Parallel Circuit`
   - Proposed slug: `parallel-circuit`; mechanisms: energy, circuit, parallel.
140. **Electrostatics** — Adds electric-charge interactions and field response.
   - Source path: `Curricular Models/NIELS/Electrostatics`
   - Proposed slug: `electrostatics`; mechanisms: physics, electrostatics, fields.

## B15: Chemical kinetics and transformations (10 models)

**Scope:** Represent reaction counts, equilibrium, catalysis, polymer formation, acid chemistry and decay.

**Verification criteria:** Audit stoichiometry, reaction selection, rates, units and source conservation; ensure changes occur through explicit public model actions.

**Audit status:** source-audit pending for all ten entries.

141. **Radical Polymerization with Chains** — Requires explicit polymer-chain structure during radical growth.
   - Source path: `Sample Models/Chemistry & Physics/Materials Science/Radical Polymerization with Chains`
   - Proposed slug: `radical-polymerization-with-chains`; mechanisms: chemistry, polymer, chain-topology.
142. **Simple Kinetics 2** — Adds a distinct reaction-order kinetic reference.
   - Source path: `Sample Models/Chemistry & Physics/Chemical Reactions/Simple Kinetics 2`
   - Proposed slug: `simple-kinetics-2`; mechanisms: chemistry, kinetics, reaction-order.
143. **Radical Polymerization** — Focuses on radical reaction processes in polymer production.
   - Source path: `Sample Models/Chemistry & Physics/Chemical Reactions/Radical Polymerization`
   - Proposed slug: `radical-polymerization`; mechanisms: chemistry, radicals, polymerization.
144. **Chemical Equilibrium** — Adds reversible reactions and dynamic chemical equilibrium.
   - Source path: `Sample Models/Chemistry & Physics/Chemical Reactions/Chemical Equilibrium`
   - Proposed slug: `chemical-equilibrium`; mechanisms: chemistry, reversible, equilibrium.
145. **B-Z Reaction** — Provides oscillatory reaction-pattern dynamics.
   - Source path: `Sample Models/Chemistry & Physics/Chemical Reactions/B-Z Reaction`
   - Proposed slug: `b-z-reaction`; mechanisms: chemistry, oscillation, reaction-diffusion.
146. **Enzyme Kinetics** — Adds catalysis, binding and substrate-dependent rates.
   - Source path: `Sample Models/Chemistry & Physics/Chemical Reactions/Enzyme Kinetics`
   - Proposed slug: `enzyme-kinetics`; mechanisms: chemistry, enzymes, catalysis.
147. **Weak Acid** — Models incomplete dissociation and acid equilibrium.
   - Source path: `Sample Models/Chemistry & Physics/Chemical Reactions/Acids and Bases/Weak Acid`
   - Proposed slug: `weak-acid`; mechanisms: chemistry, acid, dissociation.
148. **Buffer** — Adds buffering response to chemical perturbations.
   - Source path: `Sample Models/Chemistry & Physics/Chemical Reactions/Acids and Bases/Buffer`
   - Proposed slug: `buffer`; mechanisms: chemistry, buffer, feedback.
149. **Decay** — Provides stochastic decay with a clear population trajectory.
   - Source path: `Sample Models/Chemistry & Physics/Radioactivity/Decay`
   - Proposed slug: `decay`; mechanisms: physics, radioactivity, decay.
150. **Connected Chemistry Solid Combustion** — Adds surface-mediated combustion of solid material.
   - Source path: `Curricular Models/Connected Chemistry/Connected Chemistry Solid Combustion`
   - Proposed slug: `connected-chemistry-solid-combustion`; mechanisms: chemistry, combustion, surface.

## B16: Geometry, pursuit and recursive construction (10 models)

**Scope:** Broaden spatial contracts through 2D/3D geometry, motion, tessellation and recursive algorithms.

**Verification criteria:** Freeze coordinate dimensions, units, transforms and termination depth; test geometric constraints, finite outputs and reproducible recursion.

**Audit status:** source-audit pending for all ten entries.

151. **3D Solids** — Adds three-dimensional geometric solids as public model data.
   - Source path: `Sample Models/Mathematics/3D Solids`
   - Proposed slug: `3d-solids`; mechanisms: geometry, 3d, solids.
152. **Vector Fields** — Represents motion and inspection within a spatial vector field.
   - Source path: `Sample Models/Mathematics/Vector Fields`
   - Proposed slug: `vector-fields`; mechanisms: geometry, vector-field, movement.
153. **Pursuit** — Models pursuit trajectories from explicit geometric target relationships.
   - Source path: `Sample Models/Mathematics/Pursuit`
   - Proposed slug: `pursuit`; mechanisms: geometry, pursuit, trajectories.
154. **3D Surface** — Adds scalar surfaces and three-dimensional sampling.
   - Source path: `Sample Models/Mathematics/3D Surface`
   - Proposed slug: `3d-surface`; mechanisms: geometry, surface, scalar-field.
155. **Turtles Circling** — Provides a small continuous-turning movement reference.
   - Source path: `Sample Models/Mathematics/Turtles Circling`
   - Proposed slug: `turtles-circling`; mechanisms: geometry, turning, collective-motion.
156. **Voronoi** — Adds spatial partitioning around generating sites.
   - Source path: `Sample Models/Mathematics/Voronoi`
   - Proposed slug: `voronoi`; mechanisms: geometry, voronoi, tessellation.
157. **Emergent Shapes - Ellipse** — Constructs elliptical structure from local geometric rules.
   - Source path: `Sample Models/Mathematics/Conic Sections/Emergent Shapes - Ellipse`
   - Proposed slug: `emergent-shapes-ellipse`; mechanisms: geometry, conic, emergence.
158. **Tree Simple** — Provides recursive branching with explicit geometric structure.
   - Source path: `Sample Models/Mathematics/Fractals/Tree Simple`
   - Proposed slug: `tree-simple`; mechanisms: geometry, tree, recursion.
159. **Koch Curve** — Adds recursive curve refinement and scale-dependent geometry.
   - Source path: `Sample Models/Mathematics/Fractals/Koch Curve`
   - Proposed slug: `koch-curve`; mechanisms: geometry, fractal, recursion.
160. **L-System Fractals** — Adds grammar-driven geometric growth beyond fixed recursion.
   - Source path: `Sample Models/Mathematics/Fractals/L-System Fractals`
   - Proposed slug: `l-system-fractals`; mechanisms: geometry, l-system, grammar.

## B17: Probability, sampling and nonlinear mathematics (10 models)

**Scope:** Exercise random distributions, combinatorics, inference from samples and nonlinear iteration.

**Verification criteria:** Audit distributions, independence assumptions, sampling units and numerical limits; use analytic expectations only where source assumptions warrant them.

**Audit status:** source-audit pending for all ten entries.

161. **Birthdays** — Tests collision probability among randomly assigned birthdays.
   - Source path: `Sample Models/Mathematics/Probability/Birthdays`
   - Proposed slug: `birthdays`; mechanisms: probability, collision, combinatorics.
162. **Galton Box** — Builds a distribution through accumulated binary random choices.
   - Source path: `Sample Models/Mathematics/Probability/Galton Box`
   - Proposed slug: `galton-box`; mechanisms: probability, binomial, aggregation.
163. **Binomial Rabbits** — Connects binomial sampling to a population-based example.
   - Source path: `Sample Models/Mathematics/Probability/Binomial Rabbits`
   - Proposed slug: `binomial-rabbits`; mechanisms: probability, binomial, population.
164. **Three Doors** — Represents conditional information in the three-door problem.
   - Source path: `Sample Models/Mathematics/Probability/Three Doors`
   - Proposed slug: `three-doors`; mechanisms: probability, conditional, decision.
165. **Stochastic Patchwork** — Visualizes spatial heterogeneity produced by stochastic assignment.
   - Source path: `Sample Models/Mathematics/Probability/ProbLab/Stochastic Patchwork`
   - Proposed slug: `stochastic-patchwork`; mechanisms: probability, spatial, randomness.
166. **Expected Value** — Makes expected-value reasoning an explicit teaching task.
   - Source path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Expected Value`
   - Proposed slug: `expected-value`; mechanisms: probability, expectation, teaching.
167. **Partition Permutation Distribution** — Adds combinatorial partition/permutation outcome distributions.
   - Source path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Partition Permutation Distribution`
   - Proposed slug: `partition-permutation-distribution`; mechanisms: probability, combinatorics, distribution.
168. **Central Limit Theorem** — Examines distributions of aggregated random samples.
   - Source path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Central Limit Theorem`
   - Proposed slug: `central-limit-theorem`; mechanisms: probability, sampling, central-limit.
169. **Random Combinations and Permutations** — Distinguishes random combinations from ordered permutations.
   - Source path: `Sample Models/Mathematics/Probability/ProbLab/Unverified/Random Combinations and Permutations`
   - Proposed slug: `random-combinations-and-permutations`; mechanisms: probability, combinations, permutations.
170. **Mandelbrot** — Adds nonlinear complex iteration and fractal-set classification.
   - Source path: `Sample Models/Mathematics/Fractals/Mandelbrot`
   - Proposed slug: `mandelbrot`; mechanisms: mathematics, nonlinear, fractal.

## B18: Learning, optimization and computational coordination (10 models)

**Scope:** Cover explicit algorithms with different state, objective and convergence requirements.

**Verification criteria:** Freeze algorithm parameters, update order, objective measurements and stopping criteria; verify deterministic fixtures and explicit random streams.

**Audit status:** source-audit pending for all ten entries.

171. **Robby the Robot** — Adds learned robot action selection in a task environment.
   - Source path: `Sample Models/Computer Science/Robby the Robot`
   - Proposed slug: `robby-the-robot`; mechanisms: computing, learning, robotics.
172. **Artificial Neural Net - Perceptron** — Provides a minimal trainable linear classifier.
   - Source path: `Sample Models/Computer Science/Artificial Neural Net - Perceptron`
   - Proposed slug: `artificial-neural-net-perceptron`; mechanisms: computing, perceptron, classification.
173. **Dining Philosophers** — Tests coordination and resource contention among concurrent actors.
   - Source path: `Sample Models/Computer Science/Dining Philosophers`
   - Proposed slug: `dining-philosophers`; mechanisms: computing, coordination, resource-contention.
174. **Simple Genetic Algorithm** — Adds population-based search with selection and variation.
   - Source path: `Sample Models/Computer Science/Simple Genetic Algorithm`
   - Proposed slug: `simple-genetic-algorithm`; mechanisms: computing, genetic-algorithm, optimization.
175. **Robotic Factory** — Represents coordinated production actors and task flow.
   - Source path: `Sample Models/Computer Science/Robotic Factory`
   - Proposed slug: `robotic-factory`; mechanisms: computing, factory, workflow.
176. **Particle Swarm Optimization** — Adds swarm-based continuous optimization.
   - Source path: `Sample Models/Computer Science/Particle Swarm Optimization`
   - Proposed slug: `particle-swarm-optimization`; mechanisms: computing, particle-swarm, optimization.
177. **Artificial Neural Net - Multilayer** — Adds hidden-layer learning beyond a linear classifier.
   - Source path: `Sample Models/Computer Science/Artificial Neural Net - Multilayer`
   - Proposed slug: `artificial-neural-net-multilayer`; mechanisms: computing, neural-network, learning.
178. **PageRank** — Provides directed-network ranking via iterative scores.
   - Source path: `Sample Models/Computer Science/PageRank`
   - Proposed slug: `pagerank`; mechanisms: computing, pagerank, network.
179. **K-Means Clustering** — Adds iterative clustering with explicit assignment and centroids.
   - Source path: `Sample Models/Computer Science/K-Means Clustering`
   - Proposed slug: `k-means-clustering`; mechanisms: computing, clustering, k-means.
180. **Simulated Annealing** — Adds temperature-controlled stochastic search and acceptance.
   - Source path: `Sample Models/Computer Science/Unverified/Simulated Annealing`
   - Proposed slug: `simulated-annealing`; mechanisms: computing, annealing, optimization.

## B19: Automata and alternative topologies (10 models)

**Scope:** Span discrete, continuous, stochastic and computational cellular rules without selecting many elementary-rule variants.

**Verification criteria:** Freeze cell topology, simultaneous versus sequential updates, boundary behavior and state domains; compare small exact source-rule fixtures.

**Audit status:** source-audit pending for all ten entries.

181. **SmoothLife** — Adds continuous-valued spatial dynamics beyond binary Life.
   - Source path: `Sample Models/Computer Science/SmoothLife`
   - Proposed slug: `smoothlife`; mechanisms: automata, continuous, patterns.
182. **Hex Cell Aggregation** — Requires hexagonal neighborhoods and aggregation geometry.
   - Source path: `Sample Models/Computer Science/Hex Cell Aggregation`
   - Proposed slug: `hex-cell-aggregation`; mechanisms: automata, hexagonal, aggregation.
183. **Vants** — Adds state-dependent turning agents that modify their environment.
   - Source path: `Sample Models/Computer Science/Vants`
   - Proposed slug: `vants`; mechanisms: automata, mobile-agent, local-state.
184. **Turing Machine 2D** — Represents computation through a moving machine head on a grid.
   - Source path: `Sample Models/Computer Science/Turing Machine 2D`
   - Proposed slug: `turing-machine-2d`; mechanisms: computing, turing-machine, grid.
185. **Life** — Establishes binary two-dimensional birth/survival cellular rules.
   - Source path: `Sample Models/Computer Science/Cellular Automata/Life`
   - Proposed slug: `life`; mechanisms: automata, binary, synchronous.
186. **CA 1D Elementary** — Provides the elementary one-dimensional rule-family interface.
   - Source path: `Sample Models/Computer Science/Cellular Automata/CA 1D Elementary`
   - Proposed slug: `ca-1d-elementary`; mechanisms: automata, 1d, rule-family.
187. **CA Continuous** — Contrasts continuous cell states with discrete automata.
   - Source path: `Sample Models/Computer Science/Cellular Automata/CA Continuous`
   - Proposed slug: `ca-continuous`; mechanisms: automata, continuous, local-update.
188. **Brian's Brain** — Adds multistate refractory behavior to cellular dynamics.
   - Source path: `Sample Models/Computer Science/Cellular Automata/Brian's Brain`
   - Proposed slug: `brians-brain`; mechanisms: automata, multistate, refractory.
189. **Cyclic CA** — Adds cyclic local state competition.
   - Source path: `Sample Models/Computer Science/Cellular Automata/Cyclic CA`
   - Proposed slug: `cyclic-ca`; mechanisms: automata, cyclic, neighborhood.
190. **CA Stochastic** — Introduces stochastic transition decisions in local cellular rules.
   - Source path: `Sample Models/Computer Science/Cellular Automata/CA Stochastic`
   - Proposed slug: `ca-stochastic`; mechanisms: automata, stochastic, transition.

## B20: Interactive algorithms and public capability probes (10 models)

**Scope:** Use distinct games and focused examples to validate interaction, state machines, graph algorithms and geospatial adapters.

**Verification criteria:** Audit each game's rules before implementation; test legal/illegal actions, state transitions, graph identity, spatial queries and GIS data/host boundaries.

**Audit status:** source-audit pending for all ten entries.

191. **Minesweeper** — Adds hidden-state grid constraints and reveal/failure actions.
   - Source path: `Sample Models/Games/Minesweeper`
   - Proposed slug: `minesweeper`; mechanisms: game, grid, hidden-state.
192. **Planarity** — Connects graph geometry with crossing-free interactive rearrangement.
   - Source path: `Sample Models/Games/Planarity`
   - Proposed slug: `planarity`; mechanisms: game, graph, planarity.
193. **Lunar Lander** — Combines controlled thrust, gravity and landing conditions.
   - Source path: `Sample Models/Games/Lunar Lander`
   - Proposed slug: `lunar-lander`; mechanisms: game, physics, control.
194. **Pac-Man** — Adds maze navigation, pursuit and interactive game state.
   - Source path: `Sample Models/Games/Pac-Man`
   - Proposed slug: `pac-man`; mechanisms: game, pathfinding, state-machine.
195. **Tetris** — Tests falling-piece collision, rotation and row-removal rules.
   - Source path: `Sample Models/Games/Tetris`
   - Proposed slug: `tetris`; mechanisms: game, grid, rotation.
196. **State Machine Example** — Directly probes explicit finite-state transitions in a small model.
   - Source path: `Code Examples/State Machine Example`
   - Proposed slug: `state-machine-example`; mechanisms: computing, state-machine, teaching.
197. **Moore & Von Neumann Example** — Makes contrasting neighborhood definitions independently observable.
   - Source path: `Code Examples/Moore & Von Neumann Example`
   - Proposed slug: `moore-von-neumann-example`; mechanisms: grid, neighborhood, teaching.
198. **Vision Cone Example** — Probes directional perception with angle and distance constraints.
   - Source path: `Code Examples/Vision Cone Example`
   - Proposed slug: `vision-cone-example`; mechanisms: geometry, perception, vision-cone.
199. **NW General Examples** — Adds a focused extension-level graph-algorithm integration reference.
   - Source path: `Code Examples/Extensions Examples/nw/NW General Examples`
   - Proposed slug: `nw-general-examples`; mechanisms: network, algorithms, extension.
200. **GIS General Examples** — Exercises geospatial-data adapters and coordinate/host boundaries.
   - Source path: `Code Examples/Extensions Examples/gis/GIS General Examples`
   - Proposed slug: `gis-general-examples`; mechanisms: gis, spatial-data, adapter.

## Provenance and validation

Source catalog: `/tmp/netlogo-web-catalog-20261105/catalog.json`.

SHA-256: `4e824a5f41e879d47c4cc8e616adb1695c0ebe8f69b0950adfc2380820426059`.

The accompanying `selection.json` retains original catalog IDs, exact paths, option values and availability flags, as well as reasons, tags, batch IDs and proposed slugs. `selection.csv` carries the same 200 entries. Direct links were constructed by the catalog task from observed source-path URL conventions and were not all individually loaded.

Validation checks: exactly 200 rows; all paths present and selectable in the source catalog; 200 unique paths; 200 unique slugs; all five mandatory anchors; all eleven Urban Suite entries; twenty batches of ten entries. These are scope-integrity checks, not implementation or scientific validation.

