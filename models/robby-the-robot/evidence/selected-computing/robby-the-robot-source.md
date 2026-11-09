# Robby the Robot complete source contract inventory

Identity: `Sample Models/Computer Science/Robby the Robot`; SHA-256 `ecaa2ce7c1d195fe6383354fc790025aa5c9d239f25f99f0fed71e04eaaf8d19`; NetLogo 7.0.4. Includes: None; extensions: [].

All procedures, equations and textual activation order:

```netlogo
;; Each candidate strategy is represented by one individual.
;; These individuals don't appear in the view; they are an invisible source
;; of strategies for Robby to use.
breed [individuals individual]
individuals-own [
  chromosome   ;; list of procedure names
  fitness      ;; average final score
  scaled-fitness ;; Used for display functions
  allele-distribution
]

;; This is Robby.
;; Instead of making a separate variable to keep his current score in, we just
;; use the built-in variable "label", so we can see his score as he moves around.
breed [robots robot]
robots-own [strategy]

breed [cans can]

globals [
  can-density
  can-reward
  wall-penalty
  pick-up-penalty
  best-chromosome
  best-fitness
  step-counter ;; used for keeping track of Robby's movements in the trial
  visuals?     ;; only true when the set up environment button (SETUP-VISUALS procedure) is called. During the regular GA runs we
               ;; skimp on visuals to get greater speed.
  min-fit
  max-fit
  x-offset       ; For placing individuals in world
  tournament-size ; Size of "tournament" used to choose each parent.
  num-environments-for-fitness ; Number of environments for Robby to run in to calculate fitness
  num-actions-per-environment; Number of actions Robby takes in each environment for calculating fitness
]

;;; setup procedures


to setup
  clear-all
  reset-ticks
  ask patches [set pcolor white]
  set visuals? false
  initialize-globals
  set-default-shape robots "person"
  set-default-shape cans "dot"
  set-default-shape individuals "person"
  create-individuals population-size [
    set color 19
    set size .5

    ;; A situation consists of 5 sites, each of which can contain 3 possibilities (empty, can, wall).
    ;; So 243 (3^5) is the chromosome length allowing any possible situation to be represented.
    set chromosome n-values 243 [random-action]
    ;; calculate the frequency of the 7 basic actions (or "alleles") in each chromosome
    set allele-distribution map [ action -> occurrences action chromosome ] ["move-north" "move-east" "move-south" "move-west" "move-random" "stay-put" "pick-up-can"]
  ]
  calculate-population-fitnesses
  let best-individual max-one-of individuals [fitness]
  ask best-individual [
    set best-chromosome chromosome
    set best-fitness fitness
    output-print (word "generation " ticks ":")
    output-print (word "  best fitness = " fitness)
    output-print (word "  best strategy: " map action-symbol chromosome)
  ]
  display-fitness best-individual

  plot-pen-up

  ; plots are initialized to begin at an x-value of 0, this moves the plot-pen to
  ; the point (-1,0) so that best-fitness for generation 0 will be drawn at x = 0
  plotxy -1 0

  set-plot-y-range (precision best-fitness 0) (precision best-fitness 0) + 3
  plot best-fitness
  plot-pen-down
end

to initialize-globals
  set can-density 0.5
  set wall-penalty 5
  set can-reward 10
  set pick-up-penalty 1
  set min-fit  -100; For display.  Any fitness less than min-fit is displayed at the same location as min-fit.
  set max-fit 500 ; (approximate) maximum possible fitness that an individual could obtain assuming approx. 50 cans per environment.
  set x-offset 0
  set tournament-size 15
  set num-environments-for-fitness 20
  set num-actions-per-environment 100
end

;; randomly distribute cans, one per patch
to distribute-cans
  ask cans [ die ]
  ask patches with [random-float 1 < can-density] [
    sprout-cans 1 [
      set color orange
      if not visuals? [hide-turtle]
    ]
  ]
end

to draw-grid
  clear-drawing
  ask patches [
    sprout 1 [
      set shape "square"
      set color blue + 4
      stamp
      die
    ]
  ]
end

to-report random-action
  report one-of ["move-north" "move-east" "move-south" "move-west"
                 "move-random" "stay-put" "pick-up-can"]
end

;; converts action string to its associated symbol
to-report action-symbol [action]
  if action = "move-north"  [ report "↑" ]
  if action = "move-east"   [ report "→" ]
  if action = "move-south"  [ report "↓" ]
  if action = "move-west"   [ report "←" ]
  if action = "move-random" [ report "+" ]
  if action = "stay-put"    [ report "x" ]
  if action = "pick-up-can" [ report "●" ]
end

;; converts action string to its associated number
to-report action-number [action]
  if action = "move-north"  [ report 1 ]
  if action = "move-east"   [ report 2 ]
  if action = "move-south"  [ report 3 ]
  if action = "move-west"   [ report 4 ]
  if action = "move-random" [ report 5 ]
  if action = "stay-put"    [ report 6 ]
  if action = "pick-up-can" [ report 7 ]
end

to go
  create-next-generation
  calculate-population-fitnesses
  let best-individual max-one-of individuals [fitness]
  display-fitness best-individual
  ask best-individual [
    set best-chromosome chromosome
    set best-fitness fitness
    output-print (word "generation " (ticks + 1) ":")
    output-print (word "  best fitness = " fitness)
    output-print (word "  best strategy: " map action-symbol chromosome)
  ]
  tick
end

to go-n-generations
  if ticks < number-of-generations [go]
end


;; scale the color of the individuals according to their fitness: the higher the fitness, the darker the color
;; also move the individuals to an x coordinate that is a function of their fitness and a y coordinate that is a function of the allele distance to the best-individual
to display-fitness [best-individual]
  ask individuals [ set label "" set color scale-color red scaled-fitness 1 -.1]
  let mid-x max-pxcor / 2
  let mid-y max-pycor / 2
  ask best-individual [
    setxy ((precision scaled-fitness 2) * max-pxcor + x-offset) mid-y
    setxy ( scaled-fitness * max-pxcor + x-offset) mid-y
    ;; place the individuals at a distance from the center based on the similarity of their chromosome to the best chromosome
    ask other individuals [
      setxy ((precision scaled-fitness 2) * max-pxcor + x-offset) mid-y
      setxy ( scaled-fitness * max-pxcor + x-offset) mid-y
      set heading one-of [0 180]
      fd chromosome-distance self myself
      ]
  ]
  ask best-individual [set heading 90 set label-color black set label (word "Best:" (precision fitness  2)) ]
end


to initialize-robot [s]
  ask robots [ die ]
  create-robots 1 [
    set label 0
    ifelse visuals? [ ; Show robot if this is during a trial of Robby that will be displayed in the view.
      set color blue
      pen-down
      set label-color black
      ]
      [set hidden? true]  ; Hide robot if this is during the GA run.
    set strategy s
  ]
end

to create-next-generation ;[best-individual]

  ; The following line of code looks a bit odd, so we'll explain it.
  ; if we simply wrote "let old-generation individuals",
  ; then old-generation would mean the set of all individuals, and when
  ; new individuals were created, they would be added to the breed, and
  ; old-generation would also grow.  Since we don't want it to grow,
  ; we instead write "(turtle-set individuals)", which makes old-generation
  ; a new agentset which doesn't get updated when new individuals are created.
  let old-generation (turtle-set individuals)

  ; The new population is created by crossover.  Each crossover creates two children.
  ; There are population-size/2 crossovers done.  (Population size is constrained to
  ; be even.)
  let crossover-count population-size / 2

  repeat crossover-count [

    ; We use "tournament selection". So for example if tournament-size is 15
    ; then we randomly pick 15 individuals from the previous generation
    ; and allow the best-individuals to reproduce.

    let parent1 max-one-of (n-of tournament-size old-generation) [fitness]
    let parent2 max-one-of (n-of tournament-size old-generation) [fitness]

    ; get a two-element list containing two new chromosomes
    let child-chromosomes crossover ([chromosome] of parent1) ([chromosome] of parent2)

    ; create the two children, with their new genetic material
    let actions ["move-north" "move-east" "move-south" "move-west" "move-random" "stay-put" "pick-up-can"]
    ask parent1 [
      hatch 1 [
        rt random 360 fd random-float 3.0
        set chromosome item 0 child-chromosomes
        ;; record the distribution of basic actions (or "alleles") for each individual
        set allele-distribution map [ action -> occurrences action chromosome ] actions
      ]
    ]
    ask parent2 [
      hatch 1 [
        rt random 360 fd random-float 3.0
        set chromosome item 1 child-chromosomes
        ;; record the distribution of basic actions (or "alleles") for each individual
        set allele-distribution map [ action -> occurrences action chromosome ] actions
       ]
    ]
  ]

  ask old-generation [ die ]
  ask individuals [ mutate ]
end

;; each individual takes NUM-ACTIONS-PER-ENVIRONMENT actions according to its strategy on NUM-ENVIRONMENTS-FOR-FITNESS random environments
to calculate-population-fitnesses
  foreach sort individuals [ current-individual ->
    let score-sum 0
    repeat num-environments-for-fitness [
      initialize-robot [chromosome] of current-individual
      distribute-cans
      repeat num-actions-per-environment [
        ask robots [ run item state strategy ]
      ]
      set score-sum score-sum + sum [label] of robots
    ]
    ask current-individual [
      set fitness score-sum / num-environments-for-fitness
      ifelse fitness < min-fit
        [set scaled-fitness 0]
        [set scaled-fitness (fitness + (abs min-fit)) / (max-fit + (abs min-fit))]
    ]
  ]
end

;; This reporter performs one-point crossover on two chromosomes.
;; That is, it chooses a random location for a splitting point.
;; Then it reports two new lists, using that splitting point,
;; by combining the first part of chromosome1 with the second part of chromosome2
;; and the first part of chromosome2 with the second part of chromosome1;
;; it puts together the first part of one list with the second part of
;; the other.

to-report crossover [chromosome1 chromosome2]
  let split-point 1 + random (length chromosome1 - 1)
  report list (sentence (sublist chromosome1 0 split-point)
                        (sublist chromosome2 split-point length chromosome2))
              (sentence (sublist chromosome2 0 split-point)
                        (sublist chromosome1 split-point length chromosome1))
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; This procedure causes random mutations to occur in a solution's chromosome.
;; The probability that each item will be replaced is controlled by the
;; MUTATION-RATE slider.  In the MAP, "[?]" means "return the same value".

to mutate   ;; individual procedure
  set chromosome map [ action ->
    ifelse-value random-float 1 < mutation-rate
      [random-action]
      [action]
  ] chromosome
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;;; robot procedures

;; These procedures are called an extremely high number of times as the GA runs, so it's
;; important they be fast.  Therefore they are written in a style which maximizes
;; execution speed rather than maximizing clarity for the human reader.

;; Each possible state is encoded as an integer from 0 to 242 and then used as an index
;; into a strategy (which is a 243-element list).  Here's how the encoding works.  There
;; are five patches Robby can sense.  Each patch can be in one of three states, which
;; we encode as 0 (empty), 1 (can), and 2 (wall).  Putting the five states in an arbitrary
;; order (N, E, S, W, patch-here), we get a five digit number, for example 10220 (can
;; to the north, walls to the south and west, nothing to the east and here).  Then we
;; interpret this number in base 3, where the first digit is the 81s place,
;; the second digit is the 27s place, the third is the 9s place, the fourth is the 3s place,
;; and the fifth is the 1s place.  For speed, we do this math using a compact series of
;; nested IFELSE-VALUE expressions.
to-report state
  let north patch-at 0 1
  let east patch-at 1 0
  let south patch-at 0 -1
  let west patch-at -1 0
  report (ifelse-value is-patch? north [ifelse-value any? cans-on north [81] [0]] [162]) +
         (ifelse-value is-patch? east  [ifelse-value any? cans-on east  [27] [0]] [ 54]) +
         (ifelse-value is-patch? south [ifelse-value any? cans-on south [ 9] [0]] [ 18]) +
         (ifelse-value is-patch? west  [ifelse-value any? cans-on west  [ 3] [0]] [  6]) +
         (ifelse-value any? cans-here [1] [0])
end

;; Below are the definitions of Robby's seven basic actions
to move-north  set heading   0  ifelse can-move? 1 [ fd 1 ] [ set label label - wall-penalty ]  end
to move-east   set heading  90  ifelse can-move? 1 [ fd 1 ] [ set label label - wall-penalty ]  end
to move-south  set heading 180  ifelse can-move? 1 [ fd 1 ] [ set label label - wall-penalty ]  end
to move-west   set heading 270  ifelse can-move? 1 [ fd 1 ] [ set label label - wall-penalty ]  end
to move-random run one-of ["move-north" "move-south" "move-east" "move-west"] end
to stay-put    end  ;; Do nothing


to pick-up-can
  ifelse any? cans-here
    [ set label label + can-reward ]
    [ set label label - pick-up-penalty ]
  ask cans-here [
    ;; during RUN-TRIAL, leave gray circles behind so we can see where the cans were
    if visuals? [
      set color gray
      stamp
    ]
    die
  ]
end

to setup-robot-visuals
  if ticks = 0 [ stop ]  ;; must run at least one generation before a best-individual exists
  clear-output
  ask individuals [hide-turtle]
  set visuals? true
  draw-grid
  distribute-cans
  initialize-robot best-chromosome
  set step-counter 1
  output-print "Setting up a new random can distribution"
end

;;display the last view of strategies seen before entering Robot view
;;this only works while in Robot view
to setup-individual-visuals
  if visuals? [
    clear-output
    clear-drawing
    ask cans [die]
    ask robots [die]
    ask patches [set pcolor white]
    ask individuals [show-turtle]
    set visuals? false
    let best-individual max-one-of individuals [fitness]
    display-fitness best-individual
    ask best-individual[
      output-print (word "generation " ticks ":")
      output-print (word "  best fitness = " fitness)
      output-print (word "  best strategy: " map action-symbol chromosome)
    ]
  ]
end


;; Robby takes one step of best strategy
to run-trial-step
  if ticks = 0 [ stop ]  ;; must run at least one generation before a best-individual exists
  if step-counter > num-actions-per-environment [set step-counter 0 set visuals? false ]
  if step-counter = 1 [output-print "Stepping through the best strategy found at this generation"]
  ask robots [
      let current-action item state strategy
      run current-action
      ifelse step-counter != num-actions-per-environment
      [output-print (word step-counter ")  " current-action " (" action-symbol current-action "), score = " label)]
      [output-print (word step-counter ")  " current-action " (" action-symbol current-action "), final-score = " label)]
      ;; we're not using the tick counter here, so force a view update
      display
      set step-counter step-counter + 1
  ]
end

;; count the number of occurrences of an item in a list
to-report occurrences [x a-list]
  report reduce [ [n the-item] -> ifelse-value the-item = x [ n + 1 ] [ n ] ] (fput 0 a-list)
end

;; measure distance between two chromosomes
;; distance is Euclidean distance between their allele distributions, scaled to fit in view
to-report chromosome-distance [individual1 individual2]
  let max-dist  273 * sqrt 2
  ;; compute the euclidean distance between allele distributions
  let dist2 sum (map [ [a1 a2] -> (a1  - a2) ^ 2 ] [allele-distribution] of individual1 [allele-distribution] of individual2)
  ;; scale the distance to fit in the view
  let dist-candidate max-pxcor * sqrt dist2 / ( max-dist / 10)
  ;; if distance is too large, report the edge of the view
  report ifelse-value dist-candidate > max-pxcor [max-pxcor] [dist-candidate]
end


; Public Domain:
; To the extent possible under law, Uri Wilensky has waived all
; copyright and related or neighboring rights to this model.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="336" wrappingAllowedX="false" y="16" frameRate="90.0" minPycor="0" height="304" showTickCounter="true" patchSize="30.0" fontSize="10" wrappingAllowedY="false" width="304" tickCounterLabel="generations" maxPycor="9" updateMode="1" maxPxcor="9" minPxcor="0" />
    <slider x="12" step="2" y="285" max="500" width="172" display="population-size" height="50" min="20" direction="Horizontal" default="100.0" variable="population-size" />
    <slider x="13" step=".001" y="347" max="1" width="172" display="mutation-rate" height="50" min="0" direction="Horizontal" default="0.01" variable="mutation-rate" />
    <button x="43" y="74" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="73">setup</button>
    <plot x="11" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="Best Fitness" y="414" xMin="0.0" height="207" legend="false" xMax="5.0" yMin="-30.0" width="301" xAxis="Generation" display="Best Fitness">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="best" color="-16777216" legend="true">
        <setup />
        <update>plot best-fitness</update>
      </pen>
    </plot>
    <output x="682" y="10" height="542" fontSize="9" width="431" />
    <note x="1116" y="203" backgroundDark="0" fontSize="13" width="158" markdown="false" height="143" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">"↑" =   move-north
 "→"  = move-east
 "↓"  = move-south
 "←"  = move-west
 "+"   = move-random
 "x"    =  stay-put
"●"    =  pick-up-can</note>
    <note x="9" y="26" backgroundDark="0" fontSize="11" width="249" markdown="false" height="32" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Speed up speed slider or turn off
view updates for faster response.</note>
    <button x="339" y="483" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="189" display="step thru best strategy">run-trial-step</button>
    <slider x="13" step="1" y="226" max="1000" width="171" display="number-of-generations" height="50" min="1" direction="Horizontal" default="100.0" variable="number-of-generations" />
    <button x="13" y="177" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="143">go-n-generations</button>
    <note x="340" y="374" backgroundDark="0" fontSize="11" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-1069655" backgroundLight="0">Low Fitness</note>
    <note x="456" y="374" backgroundDark="0" fontSize="11" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-8053223" backgroundLight="0">Medium Fitness</note>
    <note x="588" y="373" backgroundDark="0" fontSize="11" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16449023" backgroundLight="0">High Fitness</note>
    <button x="339" y="442" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="193" display="view Robby's Environment">setup-robot-visuals</button>
    <note x="537" y="487" backgroundDark="0" fontSize="10" width="121" markdown="false" height="31" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Watch Robby move
one step at a time.</note>
    <note x="540" y="424" backgroundDark="0" fontSize="10" width="136" markdown="false" height="52" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Setup and view Robby's
environment by randomly
distributing cans
throughout the world.</note>
    <note x="339" y="393" backgroundDark="0" fontSize="14" width="321" markdown="false" height="42" textColorDark="-1" textColorLight="-13791810" backgroundLight="0">After running the GA,  watch Robby use
the best evolved strategy:</note>
    <button x="28" y="125" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="100" display="go-forever">go</button>
    <note x="249" y="226" backgroundDark="0" fontSize="11" width="150" markdown="false" height="56" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">More similar
to best strategy</note>
    <note x="250" y="63" backgroundDark="0" fontSize="11" width="150" markdown="false" height="42" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Less similar
to best strategy</note>
    <note x="249" y="294" backgroundDark="0" fontSize="11" width="150" markdown="false" height="42" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Less similar
to best strategy</note>
    <note x="254" y="185" backgroundDark="0" fontSize="14" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-13791810" backgroundLight="0">Population</note>
    <note x="250" y="132" backgroundDark="0" fontSize="11" width="150" markdown="false" height="28" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">More similar
to best strategy</note>
    <note x="9" y="10" backgroundDark="0" fontSize="14" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-13791810" backgroundLight="0">Run the GA:</note>
    <button x="339" y="528" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="181" display="view strategies">setup-individual-visuals</button>
    <note x="535" y="530" backgroundDark="0" fontSize="10" width="135" markdown="false" height="28" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Return to a view of
the strategies.</note>
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/robby-the-robot/source.nlogox) and [NOTICE](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/robby-the-robot/NOTICE.md). Runtime interpretation: [batch contract](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/selected-computing-contract.md). Execution evidence is separate.
