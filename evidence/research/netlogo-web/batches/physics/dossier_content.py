from write_dossiers import write
# Each entry is question, original mechanism, scientific links, limitations and learning outcome.
DATA={
'sandpile':(
 'how slow loading can produce avalanches over many scales',
 'Grains are added to a square lattice; overloaded sites redistribute their entire load to four neighbors, and grains can escape at the boundary',
 [('bak','Introduces self-organized criticality through driven threshold dynamics'),('dhar','Provides the analytical sandpile-automaton framework and its restrictions'),('pruessner','Explains scaling tests and finite-size caveats needed before interpreting avalanche distributions')],
 'The original Info warns that these rules are not realistic granular mechanics; the all-load redistribution rule also deserves attention when comparing with strictly Abelian toppling',
 'how local thresholds, boundary dissipation and driving interact'),
'ising':(
 'how thermal noise competes with local spin alignment',
 'Binary spins occupy a square lattice and selected spins flip according to their four-neighbor energy difference and a Metropolis acceptance probability',
 [('isingoriginal','Introduces the spin-interaction problem underlying this model family'),('metropolis','Supplies the energy-dependent sampling mechanism used explicitly by the NetLogo Procedures'),('onsager','Provides the two-dimensional equilibrium benchmark rather than a fit to this finite simulation')],
 'The simulation assumes nearest-neighbor interactions, idealized spins and finite lattice size; update counts are computational time, not calibrated magnetic relaxation time',
 'ordering, fluctuations and temperature-dependent magnetization'),
'sand':(
 'how local occupancy rules create piles and falling granular patterns',
 'Particles descend into empty cells or move diagonally around obstructions, with random tie-breaking when both diagonal directions are available',
 [('bagnold','Establishes a physical granular-flow reference that exposes the missing force and stress variables'),('cundall','Introduces force-based discrete-element modeling as a mechanistic contrast to occupancy-only rules'),('granular','Reviews the collective behavior and physical limits of granular descriptions')],
 'The NetLogo baseline is a lattice rule system without contact forces, grain rotation or calibrated friction, so it does not reproduce the cited physical theories quantitatively',
 'how simple exclusion and gravity-directed motion generate macroscopic piles'),
'solid-diffusion':(
 'how random atomic exchanges smooth a concentration discontinuity between solids',
 'The original diffusion-couple representation lets differently colored atoms mix through local motion and observes the resulting concentration profile',
 [('fick','Provides the continuum concentration-gradient description against which mixing profiles can be interpreted'),('einstein','Connects random microscopic motion with macroscopic diffusion'),('shewmon','Explains solid-state mechanisms and temperature-dependent transport absent from a generic random walk')],
 'The lattice demonstration suppresses material-specific activation barriers, realistic crystal defects and independently measured transport coefficients',
 'the difference between stochastic atomic rearrangement and average concentration transport'),
'interstitial-diffusion':(
 'how small atoms migrate through unoccupied sites inside a host lattice',
 'Interstitial atoms attempt random nearest-site jumps, succeed only when the destination is empty, and may encounter controlled surface concentrations',
 [('wert','Studies interstitial diffusion coefficients and their atomic-scale interpretation'),('fick','Supplies the macroscopic concentration-gradient framework for the plotted profile'),('shewmon','Places interstitial jumps and boundary concentrations within solid-state transport theory')],
 'The host lattice remains fixed and jump probabilities do not encode a complete material-specific energy landscape; high occupancies exceed typical dilute interstitial conditions',
 'concentration smoothing, exclusion and the influence of maintained boundary reservoirs'),
'heat-diffusion':(
 'how fixed edge temperatures shape transient and steady temperature fields',
 'A thin square plate exchanges heat between neighboring locations while its perimeter temperatures are prescribed; thermal diffusivity controls the rate of spreading',
 [('fourier','Establishes heat conduction and its mathematical description; the cited DOI identifies the Cambridge reissue'),('fick','Offers the closely related gradient-transport equation, clarifying the shared diffusion structure'),('courant','Provides the numerical-stability context needed when a continuum transport equation is discretized')],
 'The plate is uniform and thermally isolated on its faces; convection, radiation, temperature-dependent material properties and three-dimensional thickness effects are omitted',
 'why boundary conditions determine steady states while diffusivity controls relaxation'),
'crystallization-basic':(
 'how local alignment during cooling creates crystal grains',
 'Initially mobile atomic orientations become fixed during solidification; atoms adjoining solid material align with it, producing differently oriented grains and boundaries',
 [('avrami1','Develops a theoretical treatment of nucleation and phase transformation'),('avrami2','Connects nucleation assumptions with transformation-time relations'),('rappaz','Provides a computational microstructure model linking probabilistic nucleation and grain development')],
 'The NetLogo orientation and cooling rules are schematic rather than a calibrated alloy model; their visible grain boundaries do not establish measured mechanical properties',
 'competition between local orientation inheritance, cooling and multiple growth centers'),
'dla':(
 'how diffusing particles can produce branched aggregate geometry',
 'Wandering particles become permanently attached when they reach the seeded cluster; replacement walkers maintain the incoming population, while their turning angle changes transport',
 [('witten','Introduces diffusion-limited aggregation as a kinetic growth model'),('meakin','Examines irreversible aggregation and the formation of fractal clusters'),('sander','Critically discusses diffusion-limited aggregation and its kinetic interpretation')],
 'Sticking is irreversible and the lattice, launch positions and persistent versus random motion influence growth; visual resemblance to coral or lightning is not validation',
 'screening of interior regions and preferential growth of exposed branches'),
'hydrogen-gas-production':(
 'how a surface reaction converts reactants into a gas with visible pressure effects',
 'Hydronium ions encounter stationary zinc, producing hydrogen and dissolved zinc ions; escaping hydrogen particles collide within an expanding balloon representation',
 [('gillespie1','Provides the stochastic chemical-reaction perspective for finite particle counts, rather than an assertion that this spatial model uses the same algorithm'),('maxwellgas','Supplies the kinetic collision framework behind gas pressure'),('arrhenius','Provides the temperature-dependent reaction-rate perspective needed to distinguish stoichiometry from calibrated reaction kinetics')],
 'The source explicitly describes balloon mechanics as approximate; chloride is implicit and the few simulated molecules exaggerate fluctuations',
 'limiting reactants, reaction location and the distinction between molecular events and macroscopic gas behavior'),
 'thermostat':(
 'how local measurement and on/off control regulate a leaky heated room',
 'Mobile heat-representing agents enter from a central heater, escape through a partially permeable boundary, and are sampled by a thermometer that controls heating',
 [('maxwellcontrol','Establishes dynamical feedback-control questions beyond simple target matching'),('astrom','Provides the modern feedback and stability framework for interpreting sensor-driven switching'),('wiener','Connects measurement and corrective action within a general control framework')],
 'Heat agents are explicitly a pedagogical representation rather than literal heat particles; sensor sampling, leakage and switching rules determine the apparent response',
 'feedback, fluctuations, heat loss and the consequences of measuring only locally'),
'gas-chromatography':(
 'how unequal surface retention separates moving molecular populations',
 'Two particle species wander downward through a porous medium; one sticks temporarily, delaying its arrival, while wall channels can bypass the packing',
 [('chrom1','Introduces partition chromatography and its separation principle'),('chrom2','Analyzes diffusion and mass-transfer contributions to chromatographic band spreading'),('chrom3','Demonstrates gas-liquid partition separation in a concrete experimental application')],
 'The baseline uses a fixed sticking delay and simplified downward motion instead of calibrated adsorption energetics, carrier-gas flow and column transport equations',
 'retention-time separation and the way preferential channels undermine it'),
'boiling':(
 'how diffusion plus a local reset threshold creates bubbling-like patterns',
 'Heat-like values increase and diffuse across a grid; a site exceeding the threshold wraps to zero and cools nearby locations during later updates',
 [('wolfram','Provides the cellular-automaton framework for interpreting local update rules'),('rohsenow','Supplies a physical boiling heat-transfer reference that the threshold automaton does not implement'),('dhir','Reviews real boiling mechanisms and clarifies the gap between pattern resemblance and thermal prediction')],
 'As the original Info explains, this is a simple automaton analogy: no mass-changing phase boundary, pressure, latent-heat balance or resolved bubble fluid mechanics is present',
 'spatial feedback between threshold events and local diffusion'),
'gaslab-maxwells-demon':(
 'what selective access to molecular velocities implies for entropy accounting',
 'Elastic gas particles move and collide in two chambers while an idealized valve transfers fast particles one way and slow particles the other',
 [('szilard','Connects information and entropy through an idealized measurement-controlled engine'),('landauer','Identifies thermodynamic consequences of logically irreversible information processing'),('bennett','Explains computation and memory within the resolution of demon-like thermodynamic puzzles')],
 'The NetLogo valve omits a physical sensor, controller memory and their energetic costs; separating temperatures therefore cannot establish a working violation of thermodynamics',
 'why observing a sorting mechanism requires a larger accounting boundary around the controller'),
'gaslab-free-gas':(
 'how freely moving elastic particles redistribute molecular speeds',
 'Particles travel along straight segments and exchange momentum and kinetic energy in local pair collisions, with coloring used to display their instantaneous speeds',
 [('maxwellgas','Develops the kinetic collision and speed-distribution foundations'),('alder','Provides an early computational hard-sphere reference and exposes the distinction between detailed molecular dynamics and simplified collision rules'),('boltzmann','Supplies the statistical-equilibrium perspective; the cited record is a later reprint of the historical work')],
 'The world and pair-selection rules are idealized, internal molecular energy and long-range interactions are absent, and displayed particle count is far below a macroscopic gas',
 'how conserved collision events can coexist with changing individual speeds'),
'gaslab-adiabatic-piston':(
 'how molecular impacts exchange energy with a movable loaded piston',
 'Elastic gas particles strike a weighted moving piston, changing both particle velocities and piston motion, while the containing walls exchange no heat',
 [('maxwellgas','Provides the microscopic collision basis for momentum transfer'),('piston','Analyzes the time evolution and thermodynamic subtleties of the adiabatic-piston problem'),('alder','Provides a computational kinetic reference for interpreting finite-particle collision dynamics')],
 'The model is two-dimensional and uses local collision detection; a small gas and simplified boundaries do not automatically realize quasistatic macroscopic thermodynamics',
 'mechanical pressure, piston fluctuations and energy exchange through work without supplied heat'),
'gaslab-single-collision':(
 'how one elastic encounter redistributes momentum and kinetic energy',
 'Two initialized particles collide along a selected line of centers; velocity components are transformed through the center-of-mass frame and displayed before and after the encounter',
 [('maxwellgas','Establishes elastic molecular collisions as the elementary kinetic mechanism'),('alder','Demonstrates the computational importance of resolving hard-particle collisions'),('verlet','Provides a contrasting continuous-force molecular-dynamics method, making numerical representation choices explicit')],
 'The source isolates a planar pair event rather than many-body equilibration; molecular deformation, internal degrees of freedom and dissipative collision physics are absent',
 'why individual particle speeds can change while the pair conserves total momentum and kinetic energy'),
'gaslab-atmosphere':(
 'how gravity and collisions influence the vertical distribution and escape of gas',
 'Particles receive downward acceleration, exchange velocities in elastic encounters, bounce from the ground and disappear when they cross the upper boundary',
 [('maxwellgas','Supplies the molecular kinetic framework behind speed redistribution'),('barometric','Analyzes the assumptions behind atmospheric density profiles'),('alder','Provides the collision-simulation reference for interpreting finite particle dynamics')],
 'Gravity is constant, geometry is planar and the top is an absorbing numerical boundary; this is not a complete planetary exosphere or realistic atmospheric escape model',
 'the competition between molecular motion, gravitational confinement and a finite escape boundary'),
'gaslab-isothermal-piston':(
 'how changing container volume affects pressure when particle energy is artificially held constant',
 'Gas particles collide elastically, while the user repositions the piston with the simulation paused; the source ignores work and particle-piston collisions during that repositioning',
 [('maxwellgas','Provides the molecular collision basis of pressure'),('piston','Clarifies why piston motion and equilibration require explicit dynamical and thermodynamic assumptions'),('fourier','Provides a physical heat-transfer contrast: this baseline has no heat bath and does not model the heat exchange required for real isothermal compression')],
 'The original Info explicitly calls compression physically impossible here: particle energy remains unchanged because compression work is omitted, rather than being removed through an implemented thermostat',
 'the pressure-volume relation under a fixed particle-energy convention, contrasted with energy-exchanging adiabatic piston dynamics'),
}

def deliver(slugs=None):
 for slug,(question,mechanism,refs,limits,outcome) in DATA.items():
  if slugs is not None and slug not in slugs:continue
  # Scientific context is explicitly tied to the three selected works, not claimed as implemented algorithms.
  text=f"NetLogo {__import__('write_dossiers').MODELS[slug]['name']} investigates {question}. {mechanism}. {refs[0][1]} [1]. {refs[1][1]} [2]. {refs[2][1]} [3]. {limits}. The simulation illustrates {outcome}. Reproducing these patterns establishes rule fidelity, not empirical validation."
  if len(text.split())<100:
   text+=' Comparisons should preserve the original boundary conditions, initialization and update order before interpreting parameter-dependent outcomes.'
  write(slug,text,[(ref[0],ref[1]+'; relevant here to '+outcome+'.',*ref[2:]) for ref in refs])
if __name__=='__main__':deliver()
