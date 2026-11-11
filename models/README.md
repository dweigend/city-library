# Explore the models

Each folder here is a runnable model. Open it in Model Lab with `bun run dev`, or import its `model.ts` in a script: the model works without the UI.

There are two kinds of model:

- **Adapted models** come from a fixed selection of NetLogo models. They keep the mechanism of the original but use City Library's API, UI and random streams, so seeded runs do not reproduce NetLogo trajectories. The [model catalog](catalog/README.md) tracks their sources and acceptance stages.
- **Original city models** are small synthetic models written for City Library. They teach one mechanism each and make no claim of equivalence with any upstream model.

A model that runs and passes its checks is not thereby scientifically validated. The acceptance stages of adapted models are in the [catalog ledger](catalog/progress.json); original city models are not part of it.

## What a model folder contains

| File | Purpose |
| --- | --- |
| `README.md` | What the model explores and how to use it |
| `model.ts` | Headless model: inputs, state, rules and observations |
| `ui.ts` | Model Lab description: controls, monitors and views |
| `NOTICE.md` | Attribution and license terms of the adapted source, where present |
| `source.nlogox` or `original.nlogox` | Pinned original NetLogo source, where present |
| `research.json` | Scientific framing and publications |
| `contract.md`, `evidence/` | Model contract and recorded checks, where present |

Adapted models add source and research files. Original city models have only the first three; most event-driven ones add a `scene.ts` that builds their view. The shared files `definition.ts` and `parameters.ts` hold the model definition type and common parameter checks. [Concepts](../docs/concepts.md) explains how `model.ts` and `ui.ts` divide the work.

## Models by topic

### Ecology and collective behavior

[Wolf Sheep Predation](wolf-sheep-predation/README.md), [Simple Birth Rates](simple-birth-rates/README.md), [Daisyworld](daisyworld/README.md), [Termites](termites/README.md), [Shepherds](shepherds/README.md), [Rabbits Grass Weeds](rabbits-grass-weeds/README.md), [Invasive Plants](invasive-plants/README.md), [Ants](ants/README.md), [Heatbugs](heatbugs/README.md), [Flocking](flocking/README.md), [Fireflies](fireflies/README.md), [Chloroplasts and Food](chloroplasts-and-food/README.md), [Slime](slime/README.md), [Fur](fur/README.md), [Honeycomb](honeycomb/README.md), [Autumn](autumn/README.md), [Membrane Formation](membrane-formation/README.md), [Sunflower Emergent](sunflower-emergent/README.md)

### Evolution, genes and disease

[Blood Sugar Regulation](blood-sugar-regulation/README.md), [Tumor](tumor/README.md), [Muscle Development](muscle-development/README.md), [Mimicry](mimicry/README.md), [Anisogamy](anisogamy/README.md), [Peppered Moths](peppered-moths/README.md), [Baldwin Effect](baldwin-effect/README.md), [Mammoths](mammoths/README.md), [Sex Ratio Equilibrium](sex-ratio-equilibrium/README.md), [Bacterial Infection](bacterial-infection/README.md), [Vision Evolution](vision-evolution/README.md), [GenDrift T interact](gendrift-t-interact/README.md), [Disease Solo](disease-solo/README.md), [Repressilator 1D](repressilator-1d/README.md), [HIV](hiv/README.md), [Virus](virus/README.md), [CRISPR Bacterium](crispr-bacterium/README.md), [CRISPR Ecosystem](crispr-ecosystem/README.md), [DNA Protein Synthesis](dna-protein-synthesis/README.md), [Mendelian Inheritance](mendelian-inheritance/README.md), [GenEvo 1 Genetic Switch](genevo-1-genetic-switch/README.md), [epiDEM Basic](epidem-basic/README.md), [epiDEM Travel and Control](epidem-travel-and-control/README.md)

### Society, economics and games

[Voting](voting/README.md), [Wealth Distribution](wealth-distribution/README.md), [Segregation](segregation/README.md), [Consumer Choice](consumer-choice/README.md), [Rebellion](rebellion/README.md), [Language Change](language-change/README.md), [Party](party/README.md), [Ethnocentrism](ethnocentrism/README.md), [Minority Game](minority-game/README.md), [Rumor Mill](rumor-mill/README.md), [Fruit Wars](fruit-wars/README.md), [Limited Order Book](limited-order-book/README.md), [Bidding Market](bidding-market/README.md), [Hotelling's Law](hotellings-law/README.md), [Cash Flow](cash-flow/README.md), [Bank Reserves](bank-reserves/README.md), [Prisoner's Dilemma Basic](prisoners-dilemma-basic/README.md), [Prisoner's Dilemma Two Person Iterated](prisoners-dilemma-two-person-iterated/README.md), [Heroes and Cowards](heroes-and-cowards/README.md), [El Farol](el-farol/README.md), [Signaling Game](signaling-game/README.md), [Piaget-Vygotsky Game](piaget-vygotsky-game/README.md)

### Cities, traffic and landscapes

[Urban Suite - Structure from Randomness 1](urban-suite-structure-from-randomness-1/README.md), [Urban Suite - Structure from Randomness 2](urban-suite-structure-from-randomness-2/README.md), [Urban Suite - Positive Feedback](urban-suite-positive-feedback/README.md), [Urban Suite - Path Dependence](urban-suite-path-dependence/README.md), [Urban Suite - Cells](urban-suite-cells/README.md), [Urban Suite - Tijuana Bordertowns](urban-suite-tijuana-bordertowns/README.md), [Urban Suite - Pollution](urban-suite-pollution/README.md), [Urban Suite - Economic Disparity](urban-suite-economic-disparity/README.md), [Urban Suite - Awareness](urban-suite-awareness/README.md), [Urban Suite - Recycling](urban-suite-recycling/README.md), [Urban Suite - Sprawl Effect](urban-suite-sprawl-effect/README.md), [Braess' Paradox](braess-paradox/README.md), [Paths](paths/README.md), [Traffic 2 Lanes](traffic-2-lanes/README.md), [Traffic Grid](traffic-grid/README.md), [Taxi Cabs](taxi-cabs/README.md), [Traffic Basic](traffic-basic/README.md), [Traffic Intersection](traffic-intersection/README.md), [Traffic Grid Goal](traffic-grid-goal/README.md), [Fire](fire/README.md), [Percolation](percolation/README.md)

### Computing and networks

[Robby the Robot](robby-the-robot/README.md), [Artificial Neural Net - Perceptron](artificial-neural-net-perceptron/README.md), [Artificial Neural Net - Multilayer](artificial-neural-net-multilayer/README.md), [Dining Philosophers](dining-philosophers/README.md), [Simple Genetic Algorithm](simple-genetic-algorithm/README.md), [Robotic Factory](robotic-factory/README.md), [Particle Swarm Optimization](particle-swarm-optimization/README.md), [PageRank](pagerank/README.md), [K-Means Clustering](k-means-clustering/README.md), [Simulated Annealing](simulated-annealing/README.md), [SmoothLife](smoothlife/README.md), [Hex Cell Aggregation](hex-cell-aggregation/README.md), [Vants](vants/README.md), [Turing Machine 2D](turing-machine-2d/README.md), [Life](life/README.md), [CA 1D Elementary](ca-1d-elementary/README.md), [CA Continuous](ca-continuous/README.md), [Brian's Brain](brians-brain/README.md), [Cyclic CA](cyclic-ca/README.md), [CA Stochastic](ca-stochastic/README.md), [Preferential Attachment](preferential-attachment/README.md), [Diffusion on a Directed Network](diffusion-on-a-directed-network/README.md), [Virus on a Network](virus-on-a-network/README.md)

### Mathematics, chemistry and physics

[Birthdays](birthdays/README.md), [Galton Box](galton-box/README.md), [Binomial Rabbits](binomial-rabbits/README.md), [Three Doors](three-doors/README.md), [Stochastic Patchwork](stochastic-patchwork/README.md), [Expected Value](expected-value/README.md), [Partition Permutation Distribution](partition-permutation-distribution/README.md), [Central Limit Theorem](central-limit-theorem/README.md), [Random Combinations and Permutations](random-combinations-and-permutations/README.md), [Mandelbrot](mandelbrot/README.md), [Sandpile](sandpile/README.md), [Ising](ising/README.md), [Sand](sand/README.md), [Solid Diffusion](solid-diffusion/README.md), [Interstitial Diffusion](interstitial-diffusion/README.md), [Heat Diffusion](heat-diffusion/README.md), [Crystallization Basic](crystallization-basic/README.md), [DLA](dla/README.md)

### Original city models

[Household Budget](household-budget/README.md), [Resource exchange](resource-exchange/README.md), [Neighborhood Heat](neighborhood-heat/README.md), [Neighborhood Heat Intervention](neighborhood-heat-intervention/README.md), [Shared Machine](shared-machine/README.md), [Scarce Resource](scarce-resource/README.md), [Zoning Scenario Comparison](zoning-scenario-comparison/README.md), [Stormwater Retention](stormwater-retention/README.md), [Pedestrian Crossing Phases](pedestrian-crossing-phases/README.md), [Household Energy Demand](household-energy-demand/README.md), [Residential Occupancy](residential-occupancy/README.md), [Urban Tree Watering](urban-tree-watering/README.md), [Solar Battery Microgrid](solar-battery-microgrid/README.md), [Household Recycling Behavior](household-recycling-behavior/README.md), [Workplace and Household Membership](workplace-household-membership/README.md)

### City simulation models

Fifteen additional independent models explore [urban systems](../docs/development/city-simulation-models.md). They are synthetic teaching models, with per-model public contracts and verification records; independent acceptance is tracked separately from implementation.

[Population and Households](city-population/README.md), [Housing Market](city-housing/README.md), [Land Use Change](city-land-use/README.md), [Daily Activities](city-daily-activities/README.md), [Urban Mobility](city-mobility/README.md), [Urban Employment](city-economy/README.md), [Neighborhood Services](city-services/README.md), [Urban Energy Supply](city-energy/README.md), [Water and Wastewater](city-water/README.md), [Urban Stormwater](city-stormwater/README.md), [Urban Heat](city-heat/README.md), [Air and Noise Exposure](city-air-noise/README.md), [Urban Habitat Connectivity](city-biodiversity/README.md), [Urban Material Cycles](city-materials/README.md), [Municipal Finance](city-finance/README.md)

### Original event-driven city models

[DES Emergency Dispatch](des-emergency-dispatch/README.md), [DES Urban Goods Buffer](des-goods-buffer/README.md), [DES Civic Office](des-civic-office/README.md), [DES Elevator](des-elevator/README.md), [DES Parcel Logistics](des-parcel-logistics/README.md), [DES Waste Collection](des-waste-collection/README.md), [DES Bike Redistribution](des-bike-redistribution/README.md), [DES Machine Maintenance](des-machine-maintenance/README.md), [DES EV Charging](des-ev-charging/README.md), [DES Bus Interchange](des-bus-interchange/README.md), [DES Water Allocation](des-water-allocation/README.md)

The event-driven models are explained together in the [discrete-event examples guide](../docs/development/des-examples.md).
