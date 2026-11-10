# Selected models

The catalog scope is exactly 200 models. These models cover urban systems and the wider mechanisms needed for reusable simulations and games. Each source path and slug is fixed by the [selection manifest](selection.json).

The [acceptance ledger](../progress.json) records current implementation and verification. The [model source index](../../../models/catalog/research/INDEX.md) explains the scientific questions, source provenance and relevant literature. Neither selection nor literature research establishes implementation acceptance.

## Selection principles

The collection includes all eleven Urban Suite models, five core reference models and complementary mechanisms from ecology, genetics, disease, physics, mathematics and computing. Related models belong where they exercise different rules: lane changes and car following, goal-directed movement, spatial formation, interventions, learning and alternative topologies. Presentation-only variants and large families of near-identical elementary rules are outside this selection.

## Model groups

Topic groups organize the selection; they do not define implementation order or acceptance status. The required public contracts and source-specific dependencies determine the next work.

### Reference models and networks

| Model | Mechanisms |
| --- | --- |
| [Preferential Attachment](../../../models/preferential-attachment/research.json) | network, growth, stochastic |
| [Voting](../../../models/voting/research.json) | grid, collective-decision, deterministic |
| [Wolf Sheep Predation](../../../models/wolf-sheep-predation/research.json) | ecology, movement, stochastic |
| [Wealth Distribution](../../../models/wealth-distribution/research.json) | economy, resources, inequality |
| [Segregation](../../../models/segregation/research.json) | urban, relocation, thresholds |
| [Giant Component](../../../models/catalog/research/giant-component.json) | network, connectivity, stochastic |
| [Small Worlds](../../../models/catalog/research/small-worlds.json) | network, rewiring, path-length |
| [Diffusion on a Directed Network](../../../models/diffusion-on-a-directed-network/research.json) | network, directed, diffusion |
| [Virus on a Network](../../../models/virus-on-a-network/research.json) | network, epidemic, stochastic |
| [Team Assembly](../../../models/catalog/research/team-assembly.json) | network, formation, collaboration |

### Social learning and collective decisions

| Model | Mechanisms |
| --- | --- |
| [Consumer Choice](../../../models/consumer-choice/research.json) | social, choice, heterogeneity |
| [Rebellion](../../../models/rebellion/research.json) | social, conflict, thresholds |
| [Language Change](../../../models/language-change/research.json) | social, language, learning |
| [Party](../../../models/party/research.json) | social, movement, preferences |
| [Ethnocentrism](../../../models/ethnocentrism/research.json) | social, identity, cooperation |
| [Minority Game](../../../models/minority-game/research.json) | social, adaptation, competition |
| [Rumor Mill](../../../models/rumor-mill/research.json) | social, information, diffusion |
| [Signaling Game](../../../models/signaling-game/research.json) | game-theory, signaling, learning |
| [Piaget-Vygotsky Game](../../../models/piaget-vygotsky-game/research.json) | psychology, learning, interaction |
| [Heroes and Cowards](../../../models/heroes-and-cowards/research.json) | social, heterogeneity, coordination |

### Markets, allocation and strategic interaction

| Model | Mechanisms |
| --- | --- |
| [Fruit Wars](../../../models/fruit-wars/research.json) | economy, competition, resources |
| [Limited Order Book](../../../models/limited-order-book/research.json) | economy, order-book, matching |
| [Bidding Market](../../../models/bidding-market/research.json) | economy, auction, allocation |
| [Hotelling's Law](../../../models/hotellings-law/research.json) | economy, spatial-choice, competition |
| [Braess Paradox](../../../models/braess-paradox/research.json) | transport, routing, congestion |
| [Cash Flow](../../../models/cash-flow/research.json) | economy, stocks, flows |
| [Bank Reserves](../../../models/bank-reserves/research.json) | economy, banking, balance-sheet |
| [Prisoner's Dilemma Basic](../../../models/prisoners-dilemma-basic/research.json) | game-theory, payoffs, cooperation |
| [Prisoner's Dilemma Two Person Iterated](../../../models/prisoners-dilemma-two-person-iterated/research.json) | game-theory, memory, repeated-game |
| [El Farol](../../../models/el-farol/research.json) | social, adaptive-expectations, capacity |

### Transport, navigation and urban feedback

| Model | Mechanisms |
| --- | --- |
| [Paths](../../../models/paths/research.json) | transport, trails, feedback |
| [Traffic 2 Lanes](../../../models/traffic-2-lanes/research.json) | transport, lane-change, car-following |
| [Traffic Grid](../../../models/traffic-grid/research.json) | transport, grid, signals |
| [Taxi Cabs](../../../models/taxi-cabs/research.json) | transport, service, search |
| [Traffic Basic](../../../models/traffic-basic/research.json) | transport, car-following, emergence |
| [Traffic Intersection](../../../models/traffic-intersection/research.json) | transport, intersection, control |
| [Urban Suite - Structure from Randomness 1](../../../models/urban-suite-structure-from-randomness-1/research.json) | urban, emergence, stochastic |
| [Traffic Grid Goal](../../../models/traffic-grid-goal/research.json) | transport, goal-directed, routing |
| [Urban Suite - Positive Feedback](../../../models/urban-suite-positive-feedback/research.json) | urban, positive-feedback, emergence |
| [Urban Suite - Path Dependence](../../../models/urban-suite-path-dependence/research.json) | urban, path-dependence, history |

### Sustainable urban systems and landscapes

| Model | Mechanisms |
| --- | --- |
| [Urban Suite - Cells](../../../models/urban-suite-cells/research.json) | urban, cells, development |
| [Urban Suite - Structure from Randomness 2](../../../models/urban-suite-structure-from-randomness-2/research.json) | urban, structure, stochastic |
| [Urban Suite - Tijuana Bordertowns](../../../models/urban-suite-tijuana-bordertowns/research.json) | urban, spatial-development, context |
| [Urban Suite - Pollution](../../../models/urban-suite-pollution/research.json) | urban, pollution, fields |
| [Urban Suite - Economic Disparity](../../../models/urban-suite-economic-disparity/research.json) | urban, inequality, spatial-economy |
| [Urban Suite - Awareness](../../../models/urban-suite-awareness/research.json) | urban, awareness, diffusion |
| [Urban Suite - Recycling](../../../models/urban-suite-recycling/research.json) | urban, recycling, behavior |
| [Urban Suite - Sprawl Effect](../../../models/urban-suite-sprawl-effect/research.json) | urban, land-use, sprawl |
| [Climate Change](../../../models/catalog/research/climate-change.json) | climate, energy, feedback |
| [Erosion](../../../models/catalog/research/erosion.json) | landscape, erosion, transport |

### Population ecology and collective movement

| Model | Mechanisms |
| --- | --- |
| [Simple Birth Rates](../../../models/simple-birth-rates/research.json) | ecology, births, population |
| [Daisyworld](../../../models/daisyworld/research.json) | ecology, climate, feedback |
| [Termites](../../../models/termites/research.json) | collective, construction, stigmergy |
| [Shepherds](../../../models/shepherds/research.json) | collective, movement, control |
| [Rabbits Grass Weeds](../../../models/rabbits-grass-weeds/research.json) | ecology, competition, regrowth |
| [Invasive Plants](../../../models/invasive-plants/research.json) | ecology, invasion, spatial-growth |
| [Ants](../../../models/ants/research.json) | collective, foraging, fields |
| [Heatbugs](../../../models/heatbugs/research.json) | ecology, diffusion, movement |
| [Flocking](../../../models/flocking/research.json) | collective, flocking, geometry |
| [Fireflies](../../../models/fireflies/research.json) | collective, synchronization, oscillators |

### Biological patterns and regulation

| Model | Mechanisms |
| --- | --- |
| [Chloroplasts and Food](../../../models/chloroplasts-and-food/research.json) | biology, photosynthesis, resources |
| [Slime](../../../models/slime/research.json) | biology, aggregation, signaling |
| [Fur](../../../models/fur/research.json) | biology, patterns, local-rules |
| [Blood Sugar Regulation](../../../models/blood-sugar-regulation/research.json) | biology, homeostasis, feedback |
| [Honeycomb](../../../models/honeycomb/research.json) | biology, construction, geometry |
| [Autumn](../../../models/autumn/research.json) | biology, seasonality, spatial-state |
| [Membrane Formation](../../../models/membrane-formation/research.json) | biology, self-assembly, membranes |
| [Sunflower Emergent](../../../models/sunflower-emergent/research.json) | biology, phyllotaxis, emergence |
| [Tumor](../../../models/tumor/research.json) | biology, growth, cellular |
| [Muscle Development](../../../models/muscle-development/research.json) | biology, development, local-interaction |

### Evolution, inheritance and selection

| Model | Mechanisms |
| --- | --- |
| [Mimicry](../../../models/mimicry/research.json) | evolution, mimicry, selection |
| [Anisogamy](../../../models/anisogamy/research.json) | evolution, reproduction, strategies |
| [Peppered Moths](../../../models/peppered-moths/research.json) | evolution, camouflage, environment |
| [Baldwin Effect](../../../models/baldwin-effect/research.json) | evolution, learning, inheritance |
| [Mammoths](../../../models/mammoths/research.json) | evolution, population, extinction |
| [Sex Ratio Equilibrium](../../../models/sex-ratio-equilibrium/research.json) | evolution, sex-ratio, equilibrium |
| [Bacterial Infection](../../../models/bacterial-infection/research.json) | evolution, infection, selection |
| [Vision Evolution](../../../models/vision-evolution/research.json) | evolution, perception, traits |
| [GenDrift T interact](../../../models/gendrift-t-interact/research.json) | evolution, genetic-drift, sampling |
| [Mendelian Inheritance](../../../models/mendelian-inheritance/research.json) | genetics, inheritance, probability |

### Epidemics and molecular mechanisms

| Model | Mechanisms |
| --- | --- |
| [Disease Solo](../../../models/disease-solo/research.json) | epidemic, contact, movement |
| [Repressilator 1D](../../../models/repressilator-1d/research.json) | biology, gene-regulation, oscillators |
| [HIV](../../../models/hiv/research.json) | epidemic, immunity, interaction |
| [Virus](../../../models/virus/research.json) | epidemic, recovery, immunity |
| [CRISPR Bacterium](../../../models/crispr-bacterium/research.json) | biology, crispr, cellular |
| [CRISPR Ecosystem](../../../models/crispr-ecosystem/research.json) | biology, crispr, ecology |
| [epiDEM Basic](../../../models/epidem-basic/research.json) | epidemic, population, teaching |
| [epiDEM Travel and Control](../../../models/epidem-travel-and-control/research.json) | epidemic, mobility, control |
| [GenEvo 1 Genetic Switch](../../../models/genevo-1-genetic-switch/research.json) | biology, genetic-switch, regulation |
| [DNA Protein Synthesis](../../../models/dna-protein-synthesis/research.json) | biology, protein-synthesis, molecular |

### Behavioral ecology and spatial organization

| Model | Mechanisms |
| --- | --- |
| [Ant Lines](../../../models/catalog/research/ant-lines.json) | collective, following, trails |
| [BeeSmart Hive Finding](../../../models/catalog/research/beesmart-hive-finding.json) | collective, consensus, search |
| [Moths](../../../models/catalog/research/moths.json) | ecology, movement, response |
| [Flocking Vee Formations](../../../models/catalog/research/flocking-vee-formations.json) | collective, formation, geometry |
| [Slime Mold Network](../../../models/catalog/research/slime-mold-network.json) | biology, adaptive-network, transport |
| [Rock Paper Scissors](../../../models/catalog/research/rock-paper-scissors.json) | ecology, cyclic-competition, spatial |
| [Fairy Circles](../../../models/catalog/research/fairy-circles.json) | ecology, patterns, resources |
| [Plant Growth](../../../models/catalog/research/plant-growth.json) | biology, growth, structure |
| [Algae](../../../models/catalog/research/algae.json) | ecology, primary-production, population |
| [Habitat Preference Behavior](../../../models/catalog/research/habitat-preference-behavior.json) | ecology, habitat, choice |

### Lattice fields, thresholds and aggregation

| Model | Mechanisms |
| --- | --- |
| [Sandpile](../../../models/sandpile/research.json) | lattice, thresholds, cascades |
| [Ising](../../../models/ising/research.json) | lattice, energy, stochastic |
| [Sand](../../../models/sand/research.json) | lattice, granular, transport |
| [Solid Diffusion](../../../models/solid-diffusion/research.json) | materials, diffusion, lattice |
| [Interstitial Diffusion](../../../models/interstitial-diffusion/research.json) | materials, interstitial, diffusion |
| [Heat Diffusion](../../../models/heat-diffusion/research.json) | energy, heat, diffusion |
| [Crystallization Basic](../../../models/crystallization-basic/research.json) | materials, crystallization, growth |
| [DLA](../../../models/dla/research.json) | aggregation, random-walk, fractal |
| [Fire](../../../models/fire/research.json) | landscape, fire, spread |
| [Percolation](../../../models/percolation/research.json) | lattice, connectivity, percolation |

### Kinetic gases and thermodynamic controls

| Model | Mechanisms |
| --- | --- |
| [Hydrogen Gas Production](../../../models/catalog/research/hydrogen-gas-production.json) | chemistry, gas, production |
| [Thermostat](../../../models/catalog/research/thermostat.json) | energy, control, temperature |
| [Gas Chromatography](../../../models/catalog/research/gas-chromatography.json) | chemistry, separation, transport |
| [Boiling](../../../models/catalog/research/boiling.json) | physics, phase-change, temperature |
| [GasLab Maxwells Demon](../../../models/catalog/research/gaslab-maxwells-demon.json) | physics, selection, thermodynamics |
| [GasLab Free Gas](../../../models/catalog/research/gaslab-free-gas.json) | physics, kinetic-gas, collision |
| [GasLab Adiabatic Piston](../../../models/catalog/research/gaslab-adiabatic-piston.json) | energy, piston, adiabatic |
| [GasLab Single Collision](../../../models/catalog/research/gaslab-single-collision.json) | physics, collision, conservation |
| [GasLab Atmosphere](../../../models/catalog/research/gaslab-atmosphere.json) | physics, gravity, atmosphere |
| [GasLab Isothermal Piston](../../../models/catalog/research/gaslab-isothermal-piston.json) | energy, piston, isothermal |

### Continuous mechanics and interacting particles

| Model | Mechanisms |
| --- | --- |
| [Chaos in a Box](../../../models/catalog/research/chaos-in-a-box.json) | physics, chaos, boundaries |
| [Kicked Rotator](../../../models/catalog/research/kicked-rotator.json) | physics, rotation, chaos |
| [Polymer Dynamics](../../../models/catalog/research/polymer-dynamics.json) | materials, polymer, mechanics |
| [Monte Carlo Lennard-Jones](../../../models/catalog/research/monte-carlo-lennard-jones.json) | physics, monte-carlo, potential |
| [Molecular Dynamics Lennard-Jones](../../../models/catalog/research/molecular-dynamics-lennard-jones.json) | physics, integration, potential |
| [N-Bodies](../../../models/catalog/research/n-bodies.json) | physics, n-body, gravity |
| [Gravitation](../../../models/catalog/research/gravitation.json) | physics, gravitation, orbits |
| [Osmotic Pressure](../../../models/catalog/research/osmotic-pressure.json) | physics, osmosis, membrane |
| [Scattering](../../../models/catalog/research/scattering.json) | physics, scattering, trajectories |
| [Pendulum](../../../models/catalog/research/pendulum.json) | physics, pendulum, oscillation |

### Waves, charge and material transport

| Model | Mechanisms |
| --- | --- |
| [Current in a Semiconductor](../../../models/catalog/research/current-in-a-semiconductor.json) | energy, semiconductor, charge |
| [Dislocation Motion and Deformation](../../../models/catalog/research/dislocation-motion-and-deformation.json) | materials, dislocations, deformation |
| [Wave Machine](../../../models/catalog/research/wave-machine.json) | physics, waves, propagation |
| [Lattice Gas Automaton](../../../models/catalog/research/lattice-gas-automaton.json) | physics, lattice-gas, automaton |
| [Rope](../../../models/catalog/research/rope.json) | physics, coupled-oscillators, waves |
| [Chladni Figures](../../../models/catalog/research/chladni-figures.json) | physics, standing-waves, patterns |
| [Doppler](../../../models/catalog/research/doppler.json) | physics, doppler, waves |
| [Current in a Wire](../../../models/catalog/research/current-in-a-wire.json) | energy, current, charge |
| [Parallel Circuit](../../../models/catalog/research/parallel-circuit.json) | energy, circuit, parallel |
| [Electrostatics](../../../models/catalog/research/electrostatics.json) | physics, electrostatics, fields |

### Chemical kinetics and transformations

| Model | Mechanisms |
| --- | --- |
| [Radical Polymerization with Chains](../../../models/catalog/research/radical-polymerization-with-chains.json) | chemistry, polymer, chain-topology |
| [Simple Kinetics 2](../../../models/catalog/research/simple-kinetics-2.json) | chemistry, kinetics, reaction-order |
| [Radical Polymerization](../../../models/catalog/research/radical-polymerization.json) | chemistry, radicals, polymerization |
| [Chemical Equilibrium](../../../models/catalog/research/chemical-equilibrium.json) | chemistry, reversible, equilibrium |
| [B-Z Reaction](../../../models/catalog/research/b-z-reaction.json) | chemistry, oscillation, reaction-diffusion |
| [Enzyme Kinetics](../../../models/catalog/research/enzyme-kinetics.json) | chemistry, enzymes, catalysis |
| [Weak Acid](../../../models/catalog/research/weak-acid.json) | chemistry, acid, dissociation |
| [Buffer](../../../models/catalog/research/buffer.json) | chemistry, buffer, feedback |
| [Decay](../../../models/catalog/research/decay.json) | physics, radioactivity, decay |
| [Connected Chemistry Solid Combustion](../../../models/catalog/research/connected-chemistry-solid-combustion.json) | chemistry, combustion, surface |

### Geometry, pursuit and recursive construction

| Model | Mechanisms |
| --- | --- |
| [3D Solids](../../../models/catalog/research/3d-solids.json) | geometry, 3d, solids |
| [Vector Fields](../../../models/catalog/research/vector-fields.json) | geometry, vector-field, movement |
| [Pursuit](../../../models/catalog/research/pursuit.json) | geometry, pursuit, trajectories |
| [3D Surface](../../../models/catalog/research/3d-surface.json) | geometry, surface, scalar-field |
| [Turtles Circling](../../../models/catalog/research/turtles-circling.json) | geometry, turning, collective-motion |
| [Voronoi](../../../models/catalog/research/voronoi.json) | geometry, voronoi, tessellation |
| [Emergent Shapes - Ellipse](../../../models/catalog/research/emergent-shapes-ellipse.json) | geometry, conic, emergence |
| [Tree Simple](../../../models/catalog/research/tree-simple.json) | geometry, tree, recursion |
| [Koch Curve](../../../models/catalog/research/koch-curve.json) | geometry, fractal, recursion |
| [L-System Fractals](../../../models/catalog/research/l-system-fractals.json) | geometry, l-system, grammar |

### Probability, sampling and nonlinear mathematics

| Model | Mechanisms |
| --- | --- |
| [Birthdays](../../../models/birthdays/research.json) | probability, collision, combinatorics |
| [Galton Box](../../../models/galton-box/research.json) | probability, binomial, aggregation |
| [Binomial Rabbits](../../../models/binomial-rabbits/research.json) | probability, binomial, population |
| [Three Doors](../../../models/three-doors/research.json) | probability, conditional, decision |
| [Stochastic Patchwork](../../../models/stochastic-patchwork/research.json) | probability, spatial, randomness |
| [Expected Value](../../../models/expected-value/research.json) | probability, expectation, teaching |
| [Partition Permutation Distribution](../../../models/partition-permutation-distribution/research.json) | probability, combinatorics, distribution |
| [Central Limit Theorem](../../../models/central-limit-theorem/research.json) | probability, sampling, central-limit |
| [Random Combinations and Permutations](../../../models/random-combinations-and-permutations/research.json) | probability, combinations, permutations |
| [Mandelbrot](../../../models/mandelbrot/research.json) | mathematics, nonlinear, fractal |

### Learning, optimization and computational coordination

| Model | Mechanisms |
| --- | --- |
| [Robby the Robot](../../../models/robby-the-robot/research.json) | computing, learning, robotics |
| [Artificial Neural Net - Perceptron](../../../models/artificial-neural-net-perceptron/research.json) | computing, perceptron, classification |
| [Dining Philosophers](../../../models/dining-philosophers/research.json) | computing, coordination, resource-contention |
| [Simple Genetic Algorithm](../../../models/simple-genetic-algorithm/research.json) | computing, genetic-algorithm, optimization |
| [Robotic Factory](../../../models/robotic-factory/research.json) | computing, factory, workflow |
| [Particle Swarm Optimization](../../../models/particle-swarm-optimization/research.json) | computing, particle-swarm, optimization |
| [Artificial Neural Net - Multilayer](../../../models/artificial-neural-net-multilayer/research.json) | computing, neural-network, learning |
| [PageRank](../../../models/pagerank/research.json) | computing, pagerank, network |
| [K-Means Clustering](../../../models/k-means-clustering/research.json) | computing, clustering, k-means |
| [Simulated Annealing](../../../models/simulated-annealing/research.json) | computing, annealing, optimization |

### Automata and alternative topologies

| Model | Mechanisms |
| --- | --- |
| [SmoothLife](../../../models/smoothlife/research.json) | automata, continuous, patterns |
| [Hex Cell Aggregation](../../../models/hex-cell-aggregation/research.json) | automata, hexagonal, aggregation |
| [Vants](../../../models/vants/research.json) | automata, mobile-agent, local-state |
| [Turing Machine 2D](../../../models/turing-machine-2d/research.json) | computing, turing-machine, grid |
| [Life](../../../models/life/research.json) | automata, binary, synchronous |
| [CA 1D Elementary](../../../models/ca-1d-elementary/research.json) | automata, 1d, rule-family |
| [CA Continuous](../../../models/ca-continuous/research.json) | automata, continuous, local-update |
| [Brian's Brain](../../../models/brians-brain/research.json) | automata, multistate, refractory |
| [Cyclic CA](../../../models/cyclic-ca/research.json) | automata, cyclic, neighborhood |
| [CA Stochastic](../../../models/ca-stochastic/research.json) | automata, stochastic, transition |

### Interactive algorithms and public capability probes

| Model | Mechanisms |
| --- | --- |
| [Minesweeper](../../../models/catalog/research/minesweeper.json) | game, grid, hidden-state |
| [Planarity](../../../models/catalog/research/planarity.json) | game, graph, planarity |
| [Lunar Lander](../../../models/catalog/research/lunar-lander.json) | game, physics, control |
| [Pac-Man](../../../models/catalog/research/pac-man.json) | game, pathfinding, state-machine |
| [Tetris](../../../models/catalog/research/tetris.json) | game, grid, rotation |
| [State Machine Example](../../../models/catalog/research/state-machine-example.json) | computing, state-machine, teaching |
| [Moore & Von Neumann Example](../../../models/catalog/research/moore-von-neumann-example.json) | grid, neighborhood, teaching |
| [Vision Cone Example](../../../models/catalog/research/vision-cone-example.json) | geometry, perception, vision-cone |
| [NW General Examples](../../../models/catalog/research/nw-general-examples.json) | network, algorithms, extension |
| [GIS General Examples](../../../models/catalog/research/gis-general-examples.json) | gis, spatial-data, adapter |

## Maintain the scope

Keep the selected membership, source paths, slugs and source hashes unchanged unless a new scope is explicitly agreed. Update implementation and verification through the acceptance ledger. For required source, headless, browser and independent checks, follow the [model acceptance rules](../../../docs/development/model-acceptance.md).

The original selection record and checksum manifest are retained as [source records](../../../models/catalog/selection/recorded/selection.md). Their paths describe the original checkout; [location metadata](../../../models/catalog/record-paths.json) resolves them to retained files. The JSON and CSV manifests remain in this directory.
