# Simple Genetic Algorithm complete source contract inventory

Identity: `Sample Models/Computer Science/Simple Genetic Algorithm`; SHA-256 `aa1d94df44a71c7cbe8b02d11a0ac1e027fa19294a0726c1a03913786175c67e`; NetLogo 7.0.4. Includes: None; extensions: [].

All procedures, equations and textual activation order:

```netlogo
;; Each potential solution is represented by a turtle.

turtles-own [
  bits           ;; list of 0's and 1's
  fitness
]

globals [
  winner         ;; turtle that currently has the best solution
]

to setup
  clear-all
  create-turtles population-size [
    set bits n-values world-width [one-of [0 1]]
    calculate-fitness
    hide-turtle  ;; the turtles' locations are not used, so hide them
  ]
  update-display
  reset-ticks
end

to go
  if [fitness] of winner = world-width
    [ stop ]
  create-next-generation
  update-display
  tick
end

to update-display
  set winner max-one-of turtles [fitness]
  ask patches [
    ifelse item pxcor ([bits] of winner) = 1
      [ set pcolor white ]
      [ set pcolor black ]
  ]
end

;; ===== Generating Solutions

;; Each solution has its "fitness score" calculated.
;; Higher scores mean "more fit", and lower scores mean "less fit".
;; The higher a fitness score, the more likely that this solution
;;   will be chosen to reproduce and create offspring solutions
;;   in the next generation.
;;
to calculate-fitness       ;; turtle procedure
  ;; For the "ALL-ONES" problem, the fitness is simply equal to the number of ones
  ;; that occur in this solution's bits.
  ;; However, you could solve more interesting problems by changing this procedure
  ;; to evaluate the bits in other ways.  For instance, the bits might
  ;; encode rules for how a turtle should move across the world in a search for food.
  set fitness length (remove 0 bits)
end

;; This procedure does the main work of the genetic algorithm.
;; We start with the old generation of solutions.
;; We choose solutions with good fitness to produce offspring
;; through crossover (sexual recombination), and to be cloned
;; (asexual reproduction) into the next generation.
;; There is also a chance of mutation occurring in each individual.
;; After a full new generation of solutions has been created,
;; the old generation dies.
to create-next-generation
  ; The following line of code looks a bit odd, so we'll explain it.
  ; if we simply wrote "LET OLD-GENERATION TURTLES",
  ; then OLD-GENERATION would mean the set of all turtles, and when
  ; new solutions were created, they would be added to the breed, and
  ; OLD-GENERATION would also grow.  Since we don't want it to grow,
  ; we instead write "TURTLES WITH [TRUE]", which makes OLD-GENERATION
  ; an agentset, which doesn't get updated when new solutions are created.
  let old-generation turtles with [true]

  ; Some number of the population is created by crossover each generation
  ; we divide by 2 because each time through the loop we create two children.
  let crossover-count  (floor (population-size * crossover-rate / 100 / 2))

  repeat crossover-count
  [
    ; We use "tournament selection", with tournament size = 3.
    ; This means, we randomly pick 3 solutions from the previous generation
    ; and select the best one of those 3 to reproduce.

    let parent1 max-one-of (n-of 3 old-generation) [fitness]
    let parent2 max-one-of (n-of 3 old-generation) [fitness]

    let child-bits crossover ([bits] of parent1) ([bits] of parent2)

    ; create the two children, with their new genetic material
    ask parent1 [ hatch 1 [ set bits item 0 child-bits ] ]
    ask parent2 [ hatch 1 [ set bits item 1 child-bits ] ]
  ]

  ; the remainder of the population is created by cloning
  ; selected members of the previous generation
  repeat (population-size - crossover-count * 2)
  [
    ask max-one-of (n-of 3 old-generation) [fitness]
      [ hatch 1 ]
  ]

  ask old-generation [ die ]

  ; now we're just talking to the new generation of solutions here
  ask turtles
  [
    ; there's a chance of mutations occurring
    mutate
    ; finally we update the fitness value for this solution
    calculate-fitness
  ]
end

;; ===== Mutations

;; This reporter performs one-point crossover on two lists of bits.
;; That is, it chooses a random location for a splitting point.
;; Then it reports two new lists, using that splitting point,
;; by combining the first part of bits1 with the second part of bits2
;; and the first part of bits2 with the second part of bits1;
;; it puts together the first part of one list with the second part of
;; the other.
to-report crossover [bits1 bits2]
  let split-point 1 + random (length bits1 - 1)
  report list (sentence (sublist bits1 0 split-point)
                        (sublist bits2 split-point length bits2))
              (sentence (sublist bits2 0 split-point)
                        (sublist bits1 split-point length bits1))
end

;; This procedure causes random mutations to occur in a solution's bits.
;; The probability that each bit will be flipped is controlled by the
;; MUTATION-RATE slider.
to mutate   ;; turtle procedure
  set bits map [ b ->
    ifelse-value random-float 100.0 < mutation-rate
      [ 1 - b ]
      [ b ]
  ] bits
end

;; ===== Diversity Measures

;; Our diversity measure is the mean of all-pairs Hamming distances between
;; the genomes in the population.
to-report diversity
  let distances []
  ask turtles [
    let bits1 bits
    ask turtles with [self > myself] [
      set distances fput (hamming-distance bits bits1) distances
    ]
  ]
  ; The following  formula calculates how much 'disagreement' between genomes
  ; there could possibly be, for the current population size.
  ; This formula may not be immediately obvious, so here's a sketch of where
  ; it comes from.  Imagine a population of N turtles, where N is even, and each
  ; turtle has  only a single bit (0 or 1).  The most diverse this population
  ; can be is if half the turtles have 0 and half have 1 (you can prove this
  ; using calculus!). In this case, there are (N / 2) * (N / 2) pairs of bits
  ; that differ.  Showing that essentially the same formula (rounded down by
  ; the floor function) works when N is odd, is left as an exercise to the reader.
  let max-possible-distance-sum floor (count turtles * count turtles / 4)

  ; Now, using that number, we can normalize our diversity measure to be
  ; between 0 (completely homogeneous population) and 1 (maximally heterogeneous)
  report (sum distances) / max-possible-distance-sum
end

;; The Hamming distance between two bit sequences is the fraction
;; of positions at which the two sequences have different values.
;; We use MAP to run down the lists comparing for equality, then
;; we use LENGTH and REMOVE to count the number of inequalities.
to-report hamming-distance [bits1 bits2]
  report (length remove true (map [ [b1 b2] -> b1 = b2 ] bits1 bits2)) / world-width
end


; Copyright 2008 Uri Wilensky.
; See Info tab for full copyright and license.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="20" wrappingAllowedX="true" y="12" frameRate="30.0" minPycor="0" height="24" showTickCounter="true" patchSize="5.0" fontSize="10" wrappingAllowedY="true" width="504" tickCounterLabel="ticks" maxPycor="3" updateMode="1" maxPxcor="99" minPxcor="0" />
    <button x="108" y="110" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="85">go</button>
    <button x="20" y="68" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="173">setup</button>
    <slider x="20" step="5" y="152" max="200" width="172" display="population-size" height="50" min="5" direction="Horizontal" default="100.0" variable="population-size" />
    <plot x="200" autoPlotX="true" yMax="101.0" autoPlotY="true" yAxis="raw fitness" y="68" xMin="0.0" height="157" legend="true" xMax="20.0" yMin="0.0" width="330" xAxis="gen #" display="Fitness Plot">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="best" color="-2674135" legend="true">
        <setup />
        <update>plot max [fitness] of turtles</update>
      </pen>
      <pen interval="1.0" mode="0" display="avg" color="-10899396" legend="true">
        <setup />
        <update>plot mean [fitness] of turtles</update>
      </pen>
      <pen interval="1.0" mode="0" display="worst" color="-13345367" legend="true">
        <setup />
        <update>plot min [fitness] of turtles</update>
      </pen>
    </plot>
    <button x="20" y="110" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="85" display="step">go</button>
    <slider x="20" step="0.1" y="266" max="10" width="172" display="mutation-rate" height="50" min="0" direction="Horizontal" default="0.0" variable="mutation-rate" />
    <plot x="200" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="diversity" y="230" xMin="0.0" height="164" legend="false" xMax="20.0" yMin="0.0" width="332" xAxis="gen #" display="Diversity Plot">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="diversity" color="-8630108" legend="true">
        <setup />
        <update>if plot-diversity? [ plot diversity ]</update>
      </pen>
    </plot>
    <switch x="20" y="323" height="40" on="true" variable="plot-diversity?" width="172" display="plot-diversity?" />
    <slider x="20" step="1" y="209" max="100" width="172" display="crossover-rate" height="50" min="0" direction="Horizontal" default="70.0" variable="crossover-rate" />
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/simple-genetic-algorithm/source.nlogox) and [NOTICE](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/simple-genetic-algorithm/NOTICE.md). Runtime interpretation: [batch contract](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/selected-computing-contract.md). Execution evidence is separate.
