# Selected models

The catalog scope is exactly 200 models. These models cover urban systems and the wider mechanisms needed for reusable simulations and games. Each source path and slug is fixed by the [selection manifest](selection.json).

The [acceptance ledger](../progress.json) records current implementation and verification. The [model source index](../research/INDEX.md) explains the scientific questions, source provenance and relevant literature. Neither selection nor literature research establishes implementation acceptance.

## Selection principles

The collection includes all eleven Urban Suite models, five core reference models and complementary mechanisms from ecology, genetics, disease, physics, mathematics and computing. Related models belong where they exercise different rules: lane changes and car following, goal-directed movement, spatial formation, interventions, learning and alternative topologies. Presentation-only variants and large families of near-identical elementary rules are outside this selection.

## Model groups

Topic groups organize the selection; they do not define implementation order or acceptance status. The required public contracts and source-specific dependencies determine the next work.

### Reference models and networks

| Model | Mechanisms |
| --- | --- |
| [Preferential Attachment](../../preferential-attachment/research.json) | network, growth, stochastic |
| [Voting](../../voting/research.json) | grid, collective-decision, deterministic |
| [Wolf Sheep Predation](../../wolf-sheep-predation/research.json) | ecology, movement, stochastic |
| [Wealth Distribution](../../wealth-distribution/research.json) | economy, resources, inequality |
| [Segregation](../../segregation/research.json) | urban, relocation, thresholds |
| [Giant Component](../research/giant-component.json) | network, connectivity, stochastic |
| [Small Worlds](../research/small-worlds.json) | network, rewiring, path-length |
| [Diffusion on a Directed Network](../../diffusion-on-a-directed-network/research.json) | network, directed, diffusion |
| [Virus on a Network](../../virus-on-a-network/research.json) | network, epidemic, stochastic |
| [Team Assembly](../research/team-assembly.json) | network, formation, collaboration |

### Social learning and collective decisions

| Model | Mechanisms |
| --- | --- |
| [Consumer Choice](../../consumer-choice/research.json) | social, choice, heterogeneity |
| [Rebellion](../../rebellion/research.json) | social, conflict, thresholds |
| [Language Change](../../language-change/research.json) | social, language, learning |
| [Party](../../party/research.json) | social, movement, preferences |
| [Ethnocentrism](../../ethnocentrism/research.json) | social, identity, cooperation |
| [Minority Game](../../minority-game/research.json) | social, adaptation, competition |
| [Rumor Mill](../../rumor-mill/research.json) | social, information, diffusion |
| [Signaling Game](../../signaling-game/research.json) | game-theory, signaling, learning |
| [Piaget-Vygotsky Game](../../piaget-vygotsky-game/research.json) | psychology, learning, interaction |
| [Heroes and Cowards](../../heroes-and-cowards/research.json) | social, heterogeneity, coordination |

### Markets, allocation and strategic interaction

| Model | Mechanisms |
| --- | --- |
| [Fruit Wars](../../fruit-wars/research.json) | economy, competition, resources |
| [Limited Order Book](../../limited-order-book/research.json) | economy, order-book, matching |
| [Bidding Market](../../bidding-market/research.json) | economy, auction, allocation |
| [Hotelling's Law](../../hotellings-law/research.json) | economy, spatial-choice, competition |
| [Braess Paradox](../../braess-paradox/research.json) | transport, routing, congestion |
| [Cash Flow](../../cash-flow/research.json) | economy, stocks, flows |
| [Bank Reserves](../../bank-reserves/research.json) | economy, banking, balance-sheet |
| [Prisoner's Dilemma Basic](../../prisoners-dilemma-basic/research.json) | game-theory, payoffs, cooperation |
| [Prisoner's Dilemma Two Person Iterated](../../prisoners-dilemma-two-person-iterated/research.json) | game-theory, memory, repeated-game |
| [El Farol](../../el-farol/research.json) | social, adaptive-expectations, capacity |

### Transport, navigation and urban feedback

| Model | Mechanisms |
| --- | --- |
| [Paths](../../paths/research.json) | transport, trails, feedback |
| [Traffic 2 Lanes](../../traffic-2-lanes/research.json) | transport, lane-change, car-following |
| [Traffic Grid](../../traffic-grid/research.json) | transport, grid, signals |
| [Taxi Cabs](../../taxi-cabs/research.json) | transport, service, search |
| [Traffic Basic](../../traffic-basic/research.json) | transport, car-following, emergence |
| [Traffic Intersection](../../traffic-intersection/research.json) | transport, intersection, control |
| [Urban Suite - Structure from Randomness 1](../../urban-suite-structure-from-randomness-1/research.json) | urban, emergence, stochastic |
| [Traffic Grid Goal](../../traffic-grid-goal/research.json) | transport, goal-directed, routing |
| [Urban Suite - Positive Feedback](../../urban-suite-positive-feedback/research.json) | urban, positive-feedback, emergence |
| [Urban Suite - Path Dependence](../../urban-suite-path-dependence/research.json) | urban, path-dependence, history |

### Sustainable urban systems and landscapes

| Model | Mechanisms |
| --- | --- |
| [Urban Suite - Cells](../../urban-suite-cells/research.json) | urban, cells, development |
| [Urban Suite - Structure from Randomness 2](../../urban-suite-structure-from-randomness-2/research.json) | urban, structure, stochastic |
| [Urban Suite - Tijuana Bordertowns](../../urban-suite-tijuana-bordertowns/research.json) | urban, spatial-development, context |
| [Urban Suite - Pollution](../../urban-suite-pollution/research.json) | urban, pollution, fields |
| [Urban Suite - Economic Disparity](../../urban-suite-economic-disparity/research.json) | urban, inequality, spatial-economy |
| [Urban Suite - Awareness](../../urban-suite-awareness/research.json) | urban, awareness, diffusion |
| [Urban Suite - Recycling](../../urban-suite-recycling/research.json) | urban, recycling, behavior |
| [Urban Suite - Sprawl Effect](../../urban-suite-sprawl-effect/research.json) | urban, land-use, sprawl |
| [Climate Change](../research/climate-change.json) | climate, energy, feedback |
| [Erosion](../research/erosion.json) | landscape, erosion, transport |

### Population ecology and collective movement

| Model | Mechanisms |
| --- | --- |
| [Simple Birth Rates](../../simple-birth-rates/research.json) | ecology, births, population |
| [Daisyworld](../../daisyworld/research.json) | ecology, climate, feedback |
| [Termites](../../termites/research.json) | collective, construction, stigmergy |
| [Shepherds](../../shepherds/research.json) | collective, movement, control |
| [Rabbits Grass Weeds](../../rabbits-grass-weeds/research.json) | ecology, competition, regrowth |
| [Invasive Plants](../../invasive-plants/research.json) | ecology, invasion, spatial-growth |
| [Ants](../../ants/research.json) | collective, foraging, fields |
| [Heatbugs](../../heatbugs/research.json) | ecology, diffusion, movement |
| [Flocking](../../flocking/research.json) | collective, flocking, geometry |
| [Fireflies](../../fireflies/research.json) | collective, synchronization, oscillators |

### Biological patterns and regulation

| Model | Mechanisms |
| --- | --- |
| [Chloroplasts and Food](../../chloroplasts-and-food/research.json) | biology, photosynthesis, resources |
| [Slime](../../slime/research.json) | biology, aggregation, signaling |
| [Fur](../../fur/research.json) | biology, patterns, local-rules |
| [Blood Sugar Regulation](../../blood-sugar-regulation/research.json) | biology, homeostasis, feedback |
| [Honeycomb](../../honeycomb/research.json) | biology, construction, geometry |
| [Autumn](../../autumn/research.json) | biology, seasonality, spatial-state |
| [Membrane Formation](../../membrane-formation/research.json) | biology, self-assembly, membranes |
| [Sunflower Emergent](../../sunflower-emergent/research.json) | biology, phyllotaxis, emergence |
| [Tumor](../../tumor/research.json) | biology, growth, cellular |
| [Muscle Development](../../muscle-development/research.json) | biology, development, local-interaction |

### Evolution, inheritance and selection

| Model | Mechanisms |
| --- | --- |
| [Mimicry](../../mimicry/research.json) | evolution, mimicry, selection |
| [Anisogamy](../../anisogamy/research.json) | evolution, reproduction, strategies |
| [Peppered Moths](../../peppered-moths/research.json) | evolution, camouflage, environment |
| [Baldwin Effect](../../baldwin-effect/research.json) | evolution, learning, inheritance |
| [Mammoths](../../mammoths/research.json) | evolution, population, extinction |
| [Sex Ratio Equilibrium](../../sex-ratio-equilibrium/research.json) | evolution, sex-ratio, equilibrium |
| [Bacterial Infection](../../bacterial-infection/research.json) | evolution, infection, selection |
| [Vision Evolution](../../vision-evolution/research.json) | evolution, perception, traits |
| [GenDrift T interact](../../gendrift-t-interact/research.json) | evolution, genetic-drift, sampling |
| [Mendelian Inheritance](../../mendelian-inheritance/research.json) | genetics, inheritance, probability |

### Epidemics and molecular mechanisms

| Model | Mechanisms |
| --- | --- |
| [Disease Solo](../../disease-solo/research.json) | epidemic, contact, movement |
| [Repressilator 1D](../../repressilator-1d/research.json) | biology, gene-regulation, oscillators |
| [HIV](../../hiv/research.json) | epidemic, immunity, interaction |
| [Virus](../../virus/research.json) | epidemic, recovery, immunity |
| [CRISPR Bacterium](../../crispr-bacterium/research.json) | biology, crispr, cellular |
| [CRISPR Ecosystem](../../crispr-ecosystem/research.json) | biology, crispr, ecology |
| [epiDEM Basic](../../epidem-basic/research.json) | epidemic, population, teaching |
| [epiDEM Travel and Control](../../epidem-travel-and-control/research.json) | epidemic, mobility, control |
| [GenEvo 1 Genetic Switch](../../genevo-1-genetic-switch/research.json) | biology, genetic-switch, regulation |
| [DNA Protein Synthesis](../../dna-protein-synthesis/research.json) | biology, protein-synthesis, molecular |

### Behavioral ecology and spatial organization

| Model | Mechanisms |
| --- | --- |
| [Ant Lines](../research/ant-lines.json) | collective, following, trails |
| [BeeSmart Hive Finding](../research/beesmart-hive-finding.json) | collective, consensus, search |
| [Moths](../research/moths.json) | ecology, movement, response |
| [Flocking Vee Formations](../research/flocking-vee-formations.json) | collective, formation, geometry |
| [Slime Mold Network](../research/slime-mold-network.json) | biology, adaptive-network, transport |
| [Rock Paper Scissors](../research/rock-paper-scissors.json) | ecology, cyclic-competition, spatial |
| [Fairy Circles](../research/fairy-circles.json) | ecology, patterns, resources |
| [Plant Growth](../research/plant-growth.json) | biology, growth, structure |
| [Algae](../research/algae.json) | ecology, primary-production, population |
| [Habitat Preference Behavior](../research/habitat-preference-behavior.json) | ecology, habitat, choice |

### Lattice fields, thresholds and aggregation

| Model | Mechanisms |
| --- | --- |
| [Sandpile](../../sandpile/research.json) | lattice, thresholds, cascades |
| [Ising](../../ising/research.json) | lattice, energy, stochastic |
| [Sand](../../sand/research.json) | lattice, granular, transport |
| [Solid Diffusion](../../solid-diffusion/research.json) | materials, diffusion, lattice |
| [Interstitial Diffusion](../../interstitial-diffusion/research.json) | materials, interstitial, diffusion |
| [Heat Diffusion](../../heat-diffusion/research.json) | energy, heat, diffusion |
| [Crystallization Basic](../../crystallization-basic/research.json) | materials, crystallization, growth |
| [DLA](../../dla/research.json) | aggregation, random-walk, fractal |
| [Fire](../../fire/research.json) | landscape, fire, spread |
| [Percolation](../../percolation/research.json) | lattice, connectivity, percolation |

### Kinetic gases and thermodynamic controls

| Model | Mechanisms |
| --- | --- |
| [Hydrogen Gas Production](../research/hydrogen-gas-production.json) | chemistry, gas, production |
| [Thermostat](../research/thermostat.json) | energy, control, temperature |
| [Gas Chromatography](../research/gas-chromatography.json) | chemistry, separation, transport |
| [Boiling](../research/boiling.json) | physics, phase-change, temperature |
| [GasLab Maxwells Demon](../research/gaslab-maxwells-demon.json) | physics, selection, thermodynamics |
| [GasLab Free Gas](../research/gaslab-free-gas.json) | physics, kinetic-gas, collision |
| [GasLab Adiabatic Piston](../research/gaslab-adiabatic-piston.json) | energy, piston, adiabatic |
| [GasLab Single Collision](../research/gaslab-single-collision.json) | physics, collision, conservation |
| [GasLab Atmosphere](../research/gaslab-atmosphere.json) | physics, gravity, atmosphere |
| [GasLab Isothermal Piston](../research/gaslab-isothermal-piston.json) | energy, piston, isothermal |

### Continuous mechanics and interacting particles

| Model | Mechanisms |
| --- | --- |
| [Chaos in a Box](../research/chaos-in-a-box.json) | physics, chaos, boundaries |
| [Kicked Rotator](../research/kicked-rotator.json) | physics, rotation, chaos |
| [Polymer Dynamics](../research/polymer-dynamics.json) | materials, polymer, mechanics |
| [Monte Carlo Lennard-Jones](../research/monte-carlo-lennard-jones.json) | physics, monte-carlo, potential |
| [Molecular Dynamics Lennard-Jones](../research/molecular-dynamics-lennard-jones.json) | physics, integration, potential |
| [N-Bodies](../research/n-bodies.json) | physics, n-body, gravity |
| [Gravitation](../research/gravitation.json) | physics, gravitation, orbits |
| [Osmotic Pressure](../research/osmotic-pressure.json) | physics, osmosis, membrane |
| [Scattering](../research/scattering.json) | physics, scattering, trajectories |
| [Pendulum](../research/pendulum.json) | physics, pendulum, oscillation |

### Waves, charge and material transport

| Model | Mechanisms |
| --- | --- |
| [Current in a Semiconductor](../research/current-in-a-semiconductor.json) | energy, semiconductor, charge |
| [Dislocation Motion and Deformation](../research/dislocation-motion-and-deformation.json) | materials, dislocations, deformation |
| [Wave Machine](../research/wave-machine.json) | physics, waves, propagation |
| [Lattice Gas Automaton](../research/lattice-gas-automaton.json) | physics, lattice-gas, automaton |
| [Rope](../research/rope.json) | physics, coupled-oscillators, waves |
| [Chladni Figures](../research/chladni-figures.json) | physics, standing-waves, patterns |
| [Doppler](../research/doppler.json) | physics, doppler, waves |
| [Current in a Wire](../research/current-in-a-wire.json) | energy, current, charge |
| [Parallel Circuit](../research/parallel-circuit.json) | energy, circuit, parallel |
| [Electrostatics](../research/electrostatics.json) | physics, electrostatics, fields |

### Chemical kinetics and transformations

| Model | Mechanisms |
| --- | --- |
| [Radical Polymerization with Chains](../research/radical-polymerization-with-chains.json) | chemistry, polymer, chain-topology |
| [Simple Kinetics 2](../research/simple-kinetics-2.json) | chemistry, kinetics, reaction-order |
| [Radical Polymerization](../research/radical-polymerization.json) | chemistry, radicals, polymerization |
| [Chemical Equilibrium](../research/chemical-equilibrium.json) | chemistry, reversible, equilibrium |
| [B-Z Reaction](../research/b-z-reaction.json) | chemistry, oscillation, reaction-diffusion |
| [Enzyme Kinetics](../research/enzyme-kinetics.json) | chemistry, enzymes, catalysis |
| [Weak Acid](../research/weak-acid.json) | chemistry, acid, dissociation |
| [Buffer](../research/buffer.json) | chemistry, buffer, feedback |
| [Decay](../research/decay.json) | physics, radioactivity, decay |
| [Connected Chemistry Solid Combustion](../research/connected-chemistry-solid-combustion.json) | chemistry, combustion, surface |

### Geometry, pursuit and recursive construction

| Model | Mechanisms |
| --- | --- |
| [3D Solids](../research/3d-solids.json) | geometry, 3d, solids |
| [Vector Fields](../research/vector-fields.json) | geometry, vector-field, movement |
| [Pursuit](../research/pursuit.json) | geometry, pursuit, trajectories |
| [3D Surface](../research/3d-surface.json) | geometry, surface, scalar-field |
| [Turtles Circling](../research/turtles-circling.json) | geometry, turning, collective-motion |
| [Voronoi](../research/voronoi.json) | geometry, voronoi, tessellation |
| [Emergent Shapes - Ellipse](../research/emergent-shapes-ellipse.json) | geometry, conic, emergence |
| [Tree Simple](../research/tree-simple.json) | geometry, tree, recursion |
| [Koch Curve](../research/koch-curve.json) | geometry, fractal, recursion |
| [L-System Fractals](../research/l-system-fractals.json) | geometry, l-system, grammar |

### Probability, sampling and nonlinear mathematics

| Model | Mechanisms |
| --- | --- |
| [Birthdays](../../birthdays/research.json) | probability, collision, combinatorics |
| [Galton Box](../../galton-box/research.json) | probability, binomial, aggregation |
| [Binomial Rabbits](../../binomial-rabbits/research.json) | probability, binomial, population |
| [Three Doors](../../three-doors/research.json) | probability, conditional, decision |
| [Stochastic Patchwork](../../stochastic-patchwork/research.json) | probability, spatial, randomness |
| [Expected Value](../../expected-value/research.json) | probability, expectation, teaching |
| [Partition Permutation Distribution](../../partition-permutation-distribution/research.json) | probability, combinatorics, distribution |
| [Central Limit Theorem](../../central-limit-theorem/research.json) | probability, sampling, central-limit |
| [Random Combinations and Permutations](../../random-combinations-and-permutations/research.json) | probability, combinations, permutations |
| [Mandelbrot](../../mandelbrot/research.json) | mathematics, nonlinear, fractal |

### Learning, optimization and computational coordination

| Model | Mechanisms |
| --- | --- |
| [Robby the Robot](../../robby-the-robot/research.json) | computing, learning, robotics |
| [Artificial Neural Net - Perceptron](../../artificial-neural-net-perceptron/research.json) | computing, perceptron, classification |
| [Dining Philosophers](../../dining-philosophers/research.json) | computing, coordination, resource-contention |
| [Simple Genetic Algorithm](../../simple-genetic-algorithm/research.json) | computing, genetic-algorithm, optimization |
| [Robotic Factory](../../robotic-factory/research.json) | computing, factory, workflow |
| [Particle Swarm Optimization](../../particle-swarm-optimization/research.json) | computing, particle-swarm, optimization |
| [Artificial Neural Net - Multilayer](../../artificial-neural-net-multilayer/research.json) | computing, neural-network, learning |
| [PageRank](../../pagerank/research.json) | computing, pagerank, network |
| [K-Means Clustering](../../k-means-clustering/research.json) | computing, clustering, k-means |
| [Simulated Annealing](../../simulated-annealing/research.json) | computing, annealing, optimization |

### Automata and alternative topologies

| Model | Mechanisms |
| --- | --- |
| [SmoothLife](../../smoothlife/research.json) | automata, continuous, patterns |
| [Hex Cell Aggregation](../../hex-cell-aggregation/research.json) | automata, hexagonal, aggregation |
| [Vants](../../vants/research.json) | automata, mobile-agent, local-state |
| [Turing Machine 2D](../../turing-machine-2d/research.json) | computing, turing-machine, grid |
| [Life](../../life/research.json) | automata, binary, synchronous |
| [CA 1D Elementary](../../ca-1d-elementary/research.json) | automata, 1d, rule-family |
| [CA Continuous](../../ca-continuous/research.json) | automata, continuous, local-update |
| [Brian's Brain](../../brians-brain/research.json) | automata, multistate, refractory |
| [Cyclic CA](../../cyclic-ca/research.json) | automata, cyclic, neighborhood |
| [CA Stochastic](../../ca-stochastic/research.json) | automata, stochastic, transition |

### Interactive algorithms and public capability probes

| Model | Mechanisms |
| --- | --- |
| [Minesweeper](../research/minesweeper.json) | game, grid, hidden-state |
| [Planarity](../research/planarity.json) | game, graph, planarity |
| [Lunar Lander](../research/lunar-lander.json) | game, physics, control |
| [Pac-Man](../research/pac-man.json) | game, pathfinding, state-machine |
| [Tetris](../research/tetris.json) | game, grid, rotation |
| [State Machine Example](../research/state-machine-example.json) | computing, state-machine, teaching |
| [Moore & Von Neumann Example](../research/moore-von-neumann-example.json) | grid, neighborhood, teaching |
| [Vision Cone Example](../research/vision-cone-example.json) | geometry, perception, vision-cone |
| [NW General Examples](../research/nw-general-examples.json) | network, algorithms, extension |
| [GIS General Examples](../research/gis-general-examples.json) | gis, spatial-data, adapter |

## Maintain the scope

Keep the selected membership, source paths, slugs and source hashes unchanged unless a new scope is explicitly agreed. Update implementation and verification through the acceptance ledger. For required source, headless, browser and independent checks, follow the [model acceptance rules](../../../docs/development/model-acceptance.md).

The original selection record and checksum manifest are retained as [source records](recorded/selection.md). Their paths describe the original checkout; [location metadata](../record-paths.json) resolves them to retained files. The JSON and CSV manifests remain in this directory.
