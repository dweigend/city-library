# Selected ecology exact served source audit

Inventory Galapagos revision: `90be931773fcf499049247a8aaa1aecbe003654c`. All XML bytes below were freshly fetched and reconciled against the immutable served inventory. Desktop membership is not used. Scientific dossiers are not duplicated.


## Simple Birth Rates

Canonical path: `Sample Models/Biology/Simple Birth Rates`; SHA-256 `028b5c737080e0ba2165f46705999d3f1eb9c298d348f338895c923cf2bf083a`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="270" wrappingAllowedX="true" y="7" frameRate="30.0" minPycor="-50" height="408" showTickCounter="true" patchSize="4.0" fontSize="10" wrappingAllowedY="true" width="408" tickCounterLabel="ticks" maxPycor="50" updateMode="1" maxPxcor="50" minPxcor="-50" />
    <slider x="10" step="0.1" y="102" max="10.0" width="252" display="blue-fertility" height="50" min="0.0" direction="Horizontal" default="2.0" variable="blue-fertility" units="children" />
    <slider x="10" step="0.1" y="154" max="10.0" width="252" display="red-fertility" height="50" min="0.0" direction="Horizontal" default="2.0" variable="red-fertility" units="children" />
    <button x="75" y="8" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="60" display="go">go</button>
    <button x="10" y="8" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="60" display="setup">setup</button>
    <slider x="10" step="1" y="50" max="4000" width="252" display="carrying-capacity" height="50" min="1" direction="Horizontal" default="1000.0" variable="carrying-capacity" units="turtles" />
    <button x="140" y="8" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="122" display="run-experiment">go-experiment</button>
    <output x="685" y="295" height="94" fontSize="12" width="295" />
    <plot x="685" autoPlotX="true" yMax="1200.0" autoPlotY="true" yAxis="Population" y="72" xMin="0.0" height="219" legend="true" xMax="50.0" yMin="0.0" width="295" xAxis="Generations" display="Populations">
      <setup>set-plot-y-range 0 floor (carrying-capacity * 1.2)</setup>
      <update />
      <pen interval="1.0" mode="0" display="Reds" color="-2674135" legend="true">
        <setup />
        <update>set red-count count turtles with [ color = red ]
plot red-count</update>
      </pen>
      <pen interval="1.0" mode="0" display="Blues" color="-13345367" legend="true">
        <setup />
        <update>set blue-count count turtles with [ color = blue ]
plot blue-count</update>
      </pen>
      <pen interval="1.0" mode="0" display="Total" color="-10899396" legend="true">
        <setup />
        <update>plot count turtles</update>
      </pen>
    </plot>
    <monitor x="685" precision="3" y="7" height="60" fontSize="11" width="145" display="# reds">red-count</monitor>
    <monitor x="835" precision="3" y="7" height="60" fontSize="11" width="145" display="# blues">blue-count</monitor>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
globals
[
  red-count            ; population of red turtles
  blue-count           ; population of blue turtles
]

turtles-own
[
  fertility            ; the whole number part of fertility
  fertility-remainder  ; the fractional part (after the decimal point)
]

to setup
  clear-output
  setup-experiment
end

to setup-experiment
  clear-patches
  clear-turtles
  clear-all-plots
  clear-ticks
  create-turtles carrying-capacity
  [
    setxy random-xcor random-ycor         ; randomize turtle locations
    ifelse who < (carrying-capacity / 2)  ; start out with equal numbers of reds and blues
      [ set color blue ]
      [ set color red ]
    set size 2                            ; easier to see
  ]
  reset-ticks
end

to go
  reproduce
  grim-reaper
  tick
end

;; to enable many repetitions with same settings
to go-experiment
  go
  if red-count = 0
  [
    output-print (word "red extinct after " ticks " generations")
    setup-experiment
  ]
  if blue-count = 0
  [
    output-print (word "blue extinct after " ticks " generations")
    setup-experiment
  ]
end

to wander  ;; turtle procedure
  rt random-float 30 - random-float 30
  fd 1
end

to reproduce
  ask turtles
  [
    ifelse color = red
    [
      set fertility floor red-fertility
      set fertility-remainder red-fertility - (floor red-fertility)
    ]
    [
      set fertility floor blue-fertility
      set fertility-remainder blue-fertility - (floor blue-fertility)
    ]
    ifelse (random-float 100) < (100 * fertility-remainder)
      [ hatch fertility + 1 [ wander ]]
      [ hatch fertility     [ wander ]]
  ]
end

;; kill turtles in excess of carrying capacity
;; note that reds and blues have equal probability of dying
to grim-reaper
  let num-turtles count turtles
  if num-turtles <= carrying-capacity
    [ stop ]
  let chance-to-die (num-turtles - carrying-capacity) / num-turtles
  ask turtles
  [
    if random-float 1.0 < chance-to-die
      [ die ]
  ]
end


; Copyright 1997 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Daisyworld

Canonical path: `Sample Models/Biology/Daisyworld`; SHA-256 `338f52146740123181194ea1bc46fd221a7b7d2cb95a395e7a1e7db5aec5a0f4`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="295" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-14" height="439" showTickCounter="true" patchSize="15.0" fontSize="10" wrappingAllowedY="true" width="439" tickCounterLabel="ticks" maxPycor="14" updateMode="1" maxPxcor="14" minPxcor="-14" />
    <slider x="18" step="1" y="10" max="50" width="250" display="start-%-whites" height="50" min="0" direction="Horizontal" default="20.0" variable="start-%-whites" />
    <slider x="15" step="1" y="65" max="50" width="250" display="start-%-blacks" height="51" min="0" direction="Horizontal" default="20.0" variable="start-%-blacks" />
    <plot x="750" autoPlotX="true" yMax="1.5" autoPlotY="true" y="10" xMin="0.0" height="193" legend="false" xMax="100.0" yMin="0.5" width="256" display="Luminosity">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot solar-luminosity</update>
      </pen>
    </plot>
    <plot x="750" autoPlotX="true" yMax="50.0" autoPlotY="true" y="210" xMin="0.0" height="193" legend="false" xMax="100.0" yMin="-20.0" width="256" display="Global Temperature">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot global-temperature</update>
      </pen>
    </plot>
    <plot x="750" autoPlotX="true" yMax="100.0" autoPlotY="true" y="410" xMin="0.0" height="193" legend="true" xMax="100.0" yMin="0.0" width="256" display="Population">
      <setup />
      <update>set num-whites count turtles with [color = white]
set num-blacks count turtles with [color = black]</update>
      <pen interval="1.0" mode="0" display="black" color="-16777216" legend="true">
        <setup />
        <update>plot num-blacks</update>
      </pen>
      <pen interval="1.0" mode="0" display="white" color="-7500403" legend="true">
        <setup />
        <update>plot num-whites</update>
      </pen>
    </plot>
    <button x="50" y="125" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="80">setup</button>
    <chooser x="15" y="295" height="60" variable="scenario" current="1" width="250" display="scenario">
      <choice type="string" value="ramp-up-ramp-down" />
      <choice type="string" value="maintain current luminosity" />
      <choice type="string" value="low solar luminosity" />
      <choice type="string" value="our solar luminosity" />
      <choice type="string" value="high solar luminosity" />
    </chooser>
    <slider x="15" step="0.0010" y="360" max="3" width="250" display="solar-luminosity" height="50" min="0.0010" direction="Horizontal" default="0.8" variable="solar-luminosity" />
    <slider x="15" step="0.01" y="417" max="1" width="250" display="albedo-of-surface" height="50" min="0" direction="Horizontal" default="0.4" variable="albedo-of-surface" />
    <slider x="15" step="0.01" y="235" max="0.99" width="250" display="albedo-of-whites" height="50" min="0" direction="Horizontal" default="0.75" variable="albedo-of-whites" />
    <slider x="15" step="0.01" y="180" max="0.99" width="250" display="albedo-of-blacks" height="50" min="0" direction="Horizontal" default="0.25" variable="albedo-of-blacks" />
    <button x="140" y="125" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="85">go</button>
    <switch x="295" y="465" height="40" on="true" variable="show-temp-map?" width="150" display="show-temp-map?" />
    <switch x="295" y="510" height="40" on="true" variable="show-daisies?" width="150" display="show-daisies?" />
    <chooser x="455" y="465" height="60" variable="paint-daisies-as" current="2" width="120" display="paint-daisies-as">
      <choice type="string" value="add black" />
      <choice type="string" value="add white" />
      <choice type="string" value="remove" />
    </chooser>
    <button x="580" y="465" height="60" disableUntilTicks="false" forever="true" kind="Observer" width="120" display="paint daisies">paint-daisies</button>
    <button x="580" y="530" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="120" display="remove all daisies">ask daisies [die]
display</button>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
globals [
  max-age               ;; maximum age that all daisies live to
  global-temperature    ;; the average temperature of the patches in the world
  num-blacks            ;; the number of black daisies
  num-whites            ;; the number of white daisies
  scenario-phase        ;; interval counter used to keep track of what portion of scenario is currently occurring
  ]

breed [daisies daisy]

patches-own [temperature]  ;; local temperature at this location

daisies-own [
  age       ;; age of the daisy
  albedo    ;; fraction (0-1) of energy absorbed as heat from sunlight
]


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Setup Procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to setup
  clear-all
  set-default-shape daisies "flower"
  ask patches [ set pcolor gray ]

  set max-age 25
  set global-temperature 0

  if (scenario = "ramp-up-ramp-down"    ) [ set solar-luminosity 0.8 ]
  if (scenario = "low solar luminosity" ) [ set solar-luminosity 0.6 ]
  if (scenario = "our solar luminosity" ) [ set solar-luminosity 1.0 ]
  if (scenario = "high solar luminosity") [ set solar-luminosity 1.4 ]

  seed-blacks-randomly
  seed-whites-randomly
  ask daisies [set age random max-age]
  ask patches [calc-temperature]
  set global-temperature (mean [temperature] of patches)
  update-display
  reset-ticks
end

to seed-blacks-randomly
   ask n-of round ((start-%-blacks * count patches) / 100) patches with [not any? daisies-here]
     [ sprout-daisies 1 [set-as-black] ]
end

to seed-whites-randomly
   ask n-of floor ((start-%-whites * count patches) / 100) patches with [not any? daisies-here]
     [ sprout-daisies 1 [set-as-white] ]
end


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Runtime Procedures ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


to go
   ask patches [calc-temperature]
   diffuse temperature .5
   ask daisies [check-survivability]
   set global-temperature (mean [temperature] of patches)
   update-display
   tick
   if scenario = "ramp-up-ramp-down" [
     if ticks > 200 and ticks <= 400 [
       set solar-luminosity precision (solar-luminosity + 0.005) 4
     ]
     if ticks > 600 and ticks <= 850 [
       set solar-luminosity precision (solar-luminosity - 0.0025) 4
     ]
   ]
   if scenario = "low solar luminosity"  [ set solar-luminosity 0.6 ]
   if scenario = "our solar luminosity"  [ set solar-luminosity 1.0 ]
   if scenario = "high solar luminosity" [ set solar-luminosity 1.4 ]
end

to set-as-black ;; turtle procedure
  set color black
  set albedo albedo-of-blacks
  set age 0
  set size 0.6
end

to set-as-white  ;; turtle procedure
  set color white
  set albedo albedo-of-whites
  set age 0
  set size 0.6
end

to check-survivability ;; turtle procedure
  let seed-threshold 0
  let not-empty-spaces nobody
  let seeding-place nobody

  set age (age + 1)
  ifelse age < max-age
  [
     set seed-threshold ((0.1457 * temperature) - (0.0032 * (temperature ^ 2)) - 0.6443)
     ;; This equation may look complex, but it is just a parabola.
     ;; This parabola has a peak value of 1 -- the maximum growth factor possible at an optimum
     ;; temperature of 22.5 degrees C
     ;; -- and drops to zero at local temperatures of 5 degrees C and 40 degrees C. [the x-intercepts]
     ;; Thus, growth of new daisies can only occur within this temperature range,
     ;; with decreasing probability of growth new daisies closer to the x-intercepts of the parabolas
     ;; remember, however, that this probability calculation is based on the local temperature.

     if (random-float 1.0 < seed-threshold) [
       set seeding-place one-of neighbors with [not any? daisies-here]

       if (seeding-place != nobody)
       [
         if (color = white)
         [
           ask seeding-place [sprout-daisies 1 [set-as-white]  ]
         ]
         if (color = black)
         [
           ask seeding-place [sprout-daisies 1 [set-as-black]  ]
         ]
       ]
     ]
  ]
  [die]
end

to calc-temperature  ;; patch procedure
  let absorbed-luminosity 0
  let local-heating 0
  ifelse not any? daisies-here
  [   ;; the percentage of absorbed energy is calculated (1 - albedo-of-surface) and then multiplied by the solar-luminosity
      ;; to give a scaled absorbed-luminosity.
    set absorbed-luminosity ((1 - albedo-of-surface) * solar-luminosity)
  ]
  [
      ;; the percentage of absorbed energy is calculated (1 - albedo) and then multiplied by the solar-luminosity
      ;; to give a scaled absorbed-luminosity.
    ask one-of daisies-here
      [set absorbed-luminosity ((1 - albedo) * solar-luminosity)]
  ]
  ;; local-heating is calculated as logarithmic function of solar-luminosity
  ;; where a absorbed-luminosity of 1 yields a local-heating of 80 degrees C
  ;; and an absorbed-luminosity of .5 yields a local-heating of approximately 30 C
  ;; and a absorbed-luminosity of 0.01 yields a local-heating of approximately -273 C
  ifelse absorbed-luminosity > 0
      [set local-heating 72 * ln absorbed-luminosity + 80]
      [set local-heating 80]
  set temperature ((temperature + local-heating) / 2)
     ;; set the temperature at this patch to be the average of the current temperature and the local-heating effect
end

to paint-daisies   ;; daisy painting procedure which uses the mouse location draw daisies when the mouse button is down
  if mouse-down?
  [
    ask patch mouse-xcor mouse-ycor [
      ifelse not any? daisies-here
      [
        if paint-daisies-as = "add black"
          [sprout-daisies 1 [set-as-black]]
        if paint-daisies-as = "add white"
          [sprout-daisies 1 [set-as-white]]
      ]
      [
        if paint-daisies-as = "remove"
          [ask daisies-here [die]]
      ]
      display  ;; update view
    ]
  ]
end

to update-display
  ifelse (show-temp-map? = true)
    [ ask patches [set pcolor scale-color red temperature -50 110] ]  ;; scale color of patches to the local temperature
    [ ask patches [set pcolor grey] ]

  ifelse (show-daisies? = true)
    [ ask daisies [set hidden? false] ]
    [ ask daisies [set hidden? true] ]
end


; Copyright 2006 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Termites

Canonical path: `Sample Models/Biology/Termites`; SHA-256 `c32e26a6d79055375f817571670b2d644cabc932a1d912f7b9063b1cc30dc8a6`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="200" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-100" height="406" showTickCounter="false" patchSize="2.0" fontSize="10" wrappingAllowedY="true" width="406" tickCounterLabel="ticks" maxPycor="100" updateMode="0" maxPxcor="100" minPxcor="-100" />
    <button x="100" y="149" height="35" disableUntilTicks="false" forever="true" kind="Turtle" width="65" display="go">go</button>
    <button x="25" y="149" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="65" display="setup">setup</button>
    <slider x="10" step="1" y="30" max="2000" width="175" display="number" height="50" min="1" direction="Horizontal" default="400.0" variable="number" />
    <slider x="10" step="1.0" y="87" max="100.0" width="175" display="density" height="50" min="0.0" direction="Horizontal" default="20.0" variable="density" units="%" />
  </widgets>
  
```

### Exact procedures for audit

```netlogo
to setup
  clear-all
  set-default-shape turtles "bug"
  ;; randomly distribute wood chips
  ask patches
  [ if random-float 100 < density
    [ set pcolor yellow ] ]
  ;; randomly distribute termites
  create-turtles number [
    set color white
    setxy random-xcor random-ycor
    set size 5  ;; easier to see
  ]
end

to go  ;; turtle procedure
  search-for-chip
  find-new-pile
  put-down-chip
end

to search-for-chip  ;; turtle procedure -- "picks up chip" by turning orange
  ifelse pcolor = yellow
  [ set pcolor black
    set color orange
    fd 20 ]
  [ wiggle
    search-for-chip ]
end

to find-new-pile  ;; turtle procedure -- look for yellow patches
  if pcolor != yellow
  [ wiggle
    find-new-pile ]
end

to put-down-chip  ;; turtle procedure -- finds empty spot & drops chip
  ifelse pcolor = black
  [ set pcolor yellow
    set color white
    get-away ]
  [ rt random 360
    fd 1
    put-down-chip ]
end

to get-away  ;; turtle procedure -- escape from yellow piles
  rt random 360
  fd 20
  if pcolor != black
    [ get-away ]
end

to wiggle ; turtle procedure
  fd 1
  rt random 50
  lt random 50
end


; Copyright 1997 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Shepherds

Canonical path: `Sample Models/Biology/Shepherds`; SHA-256 `e4e4d8447dfcd1b8971ded3dbfd12d9298bf210d43fceb2aec06646998b73100`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="270" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-25" height="412" showTickCounter="true" patchSize="8.0" fontSize="10" wrappingAllowedY="true" width="412" tickCounterLabel="ticks" maxPycor="25" updateMode="1" maxPxcor="25" minPxcor="-25" />
    <button x="137" y="11" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="120">go</button>
    <button x="12" y="11" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="120">setup</button>
    <slider x="10" step="0.01" y="164" max="0.2" width="250" display="sheep-speed" height="50" min="0" direction="Horizontal" default="0.02" variable="sheep-speed" />
    <slider x="10" step="1" y="57" max="100" width="250" display="num-shepherds" height="50" min="0" direction="Horizontal" default="30.0" variable="num-shepherds" />
    <slider x="10" step="1" y="110" max="500" width="250" display="num-sheep" height="50" min="0" direction="Horizontal" default="150.0" variable="num-sheep" />
    <monitor x="690" precision="1" y="10" height="60" fontSize="11" width="230" display="current efficiency">herding-efficiency</monitor>
    <plot x="690" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="Percent" y="80" xMin="0.0" height="173" legend="false" xMax="300.0" yMin="0.0" width="230" xAxis="Time" display="Herding Efficiency">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="efficiency" color="-13345367" legend="true">
        <setup />
        <update>if ticks mod 50 = 0  ;; since the calculations are expensive
[
  update-sheep-counts
  calculate-herding-efficiency
  plotxy ticks herding-efficiency
]</update>
      </pen>
    </plot>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
breed [sheep a-sheep]
breed [shepherds shepherd]

globals
[
  sheepless-neighborhoods       ;; how many patches have no sheep in any neighboring patches?
  herding-efficiency            ;; measures how well-herded the sheep are
]
patches-own
[
  sheep-nearby                  ;; how many sheep in neighboring patches?
]
shepherds-own
[
  carried-sheep         ;; the sheep I'm carrying (or nobody if I'm not carrying in)
  found-herd?           ;; becomes true when I find a herd to drop it in
]

to setup
  clear-all
  set-default-shape sheep "sheep"
  set-default-shape shepherds "person"
  ask patches
    [ set pcolor green + (random-float 0.8) - 0.4]   ;; varying the green just makes it look nicer
  create-sheep num-sheep
    [ set color white
      set size 1.5  ;; easier to see
      setxy random-xcor random-ycor ]
  create-shepherds num-shepherds
    [ set color brown
      set size 1.5  ;; easier to see
      set carried-sheep nobody
      set found-herd? false
      setxy random-xcor random-ycor ]
  reset-ticks
end

to update-sheep-counts
  ask patches
    [ set sheep-nearby (sum [count sheep-here] of neighbors) ]
  set sheepless-neighborhoods (count patches with [sheep-nearby = 0])
end

to calculate-herding-efficiency
  set herding-efficiency (sheepless-neighborhoods / (count patches with [not any? sheep-here])) * 100
end

to go
  ask shepherds
  [ ifelse carried-sheep = nobody
      [ search-for-sheep ]     ;; find a sheep and pick it up
    [ ifelse found-herd?
        [ find-empty-spot ]  ;; find an empty spot to drop the sheep
      [ find-new-herd ] ]  ;; find a herd to drop the sheep in
    wiggle
    fd 1
    if carried-sheep != nobody
    ;; bring my sheep to where I just moved to
    [ ask carried-sheep [ move-to myself ] ] ]
  ask sheep with [not hidden?]
  [ wiggle
    fd sheep-speed ]
  tick
end

to wiggle        ;; turtle procedure
  rt random 50 - random 50
end

to search-for-sheep ;; shepherds procedure
  set carried-sheep one-of sheep-here with [not hidden?]
  if (carried-sheep != nobody)
    [ ask carried-sheep
        [ hide-turtle ]  ;; make the sheep invisible to other shepherds
      set color blue     ;; turn shepherd blue while carrying sheep
      fd 1 ]
end

to find-new-herd ;; shepherds procedure
  if any? sheep-here with [not hidden?]
    [ set found-herd? true ]
end

to find-empty-spot ;; shepherds procedure
  if all? sheep-here [hidden?]
    [ ask carried-sheep
        [ show-turtle ]       ;; make the sheep visible again
      set color brown         ;; set my own color back to brown
      set carried-sheep nobody
      set found-herd? false
      rt random 360
      fd 20 ]
end


; Copyright 1998 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Rabbits Grass Weeds

Canonical path: `Sample Models/Biology/Rabbits Grass Weeds`; SHA-256 `0522868c3d257988941166f4ddaa930b82744fe35329335d0d52522d7aff2bc7`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="276" wrappingAllowedX="true" y="24" frameRate="30.0" minPycor="-20" height="496" showTickCounter="true" patchSize="12.0" fontSize="10" wrappingAllowedY="true" width="496" tickCounterLabel="ticks" maxPycor="20" updateMode="1" maxPxcor="20" minPxcor="-20" />
    <slider x="17" step="1.0" y="134" max="20.0" width="250" display="birth-threshold" height="50" min="0.0" direction="Horizontal" default="15.0" variable="birth-threshold" />
    <slider x="17" step="0.5" y="370" max="10.0" width="250" display="weed-energy" height="50" min="0.0" direction="Horizontal" default="0.0" variable="weed-energy" />
    <slider x="17" step="1.0" y="312" max="20.0" width="250" display="weeds-grow-rate" height="50" min="0.0" direction="Horizontal" default="0.0" variable="weeds-grow-rate" />
    <slider x="17" step="0.5" y="254" max="10.0" width="250" display="grass-energy" height="50" min="0.0" direction="Horizontal" default="5.0" variable="grass-energy" />
    <slider x="17" step="1.0" y="195" max="20.0" width="250" display="grass-grow-rate" height="50" min="0.0" direction="Horizontal" default="15.0" variable="grass-grow-rate" />
    <slider x="17" step="1.0" y="26" max="500.0" width="250" display="number" height="50" min="0.0" direction="Horizontal" default="150.0" variable="number" />
    <button x="63" y="82" height="43" disableUntilTicks="false" forever="false" kind="Observer" width="68" display="setup">setup</button>
    <button x="143" y="82" height="43" disableUntilTicks="true" forever="true" kind="Observer" width="77" display="go">go</button>
    <plot x="779" autoPlotX="true" yMax="111.0" autoPlotY="true" yAxis="Pop" y="86" xMin="0.0" height="263" legend="true" xMax="100.0" yMin="0.0" width="328" xAxis="Time" display="Populations">
      <setup>set-plot-y-range 0 number</setup>
      <update />
      <pen interval="1.0" mode="0" display="grass" color="-10899396" legend="true">
        <setup />
        <update>plot count patches with [pcolor = green] / 4</update>
      </pen>
      <pen interval="1.0" mode="0" display="rabbits" color="-2674135" legend="true">
        <setup />
        <update>plot count rabbits</update>
      </pen>
      <pen interval="1.0" mode="0" display="weeds" color="-8630108" legend="true">
        <setup />
        <update>plot count patches with [pcolor = violet] / 4</update>
      </pen>
    </plot>
    <monitor x="905" precision="1" y="357" height="60" fontSize="11" width="100" display="count rabbits">count rabbits</monitor>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
breed [rabbits rabbit]
rabbits-own [ energy ]

to setup
  clear-all
  grow-grass-and-weeds
  set-default-shape rabbits "rabbit"
  create-rabbits number [
    set color white
    setxy random-xcor random-ycor
    set energy random 10  ;start with a random amt. of energy
  ]
  reset-ticks
end

to go
  if not any? rabbits [ stop ]
  grow-grass-and-weeds
  ask rabbits
  [ move
    eat-grass
    eat-weeds
    reproduce
    death ]
  tick
end

to grow-grass-and-weeds
  ask patches [
    if pcolor = black [
      if random-float 1000 < weeds-grow-rate
        [ set pcolor violet ]
      if random-float 1000 < grass-grow-rate
        [ set pcolor green ]
  ] ]
end

to move  ;; rabbit procedure
  rt random 50
  lt random 50
  fd 1
  ;; moving takes some energy
  set energy energy - 0.5
end

to eat-grass  ;; rabbit procedure
  ;; gain "grass-energy" by eating grass
  if pcolor = green
  [ set pcolor black
    set energy energy + grass-energy ]
end

to eat-weeds  ;; rabbit procedure
  ;; gain "weed-energy" by eating weeds
  if pcolor = violet
  [ set pcolor black
    set energy energy + weed-energy ]
end

to reproduce     ;; rabbit procedure
  ;; give birth to a new rabbit, but it takes lots of energy
  if energy > birth-threshold
    [ set energy energy / 2
      hatch 1 [ fd 1 ] ]
end

to death     ;; rabbit procedure
  ;; die if you run out of energy
  if energy < 0 [ die ]
end


; Copyright 2001 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Invasive Plants

Canonical path: `Sample Models/Biology/Invasive Plants`; SHA-256 `657443adb46050bced1887759c92f23321227607bc28aceebb2bdcd4b0a5dd9e`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="300" wrappingAllowedX="false" y="7" frameRate="30.0" minPycor="-16" height="664" showTickCounter="true" patchSize="20.0" fontSize="10" wrappingAllowedY="false" width="664" tickCounterLabel="years" maxPycor="16" updateMode="1" maxPxcor="16" minPxcor="-16" />
    <switch x="170" y="345" height="45" on="true" variable="show-seeds?" width="120" display="show-seeds?" />
    <slider x="5" step="0.01" y="572" max="1" width="285" display="seed-production-rate" height="55" min="0" direction="Horizontal" default="0.05" variable="seed-production-rate" />
    <slider x="5" step="0.5" y="629" max="10" width="285" display="spread-distance" height="55" min="0" direction="Horizontal" default="1.0" variable="spread-distance" />
    <slider x="5" step="1" y="458" max="100" width="285" display="weed-killer-threshold" height="55" min="0" direction="Horizontal" default="66.0" variable="weed-killer-threshold" />
    <slider x="5" step="0.01" y="515" max="1" width="285" display="weed-killer-effectiveness" height="55" min="0" direction="Horizontal" default="0.95" variable="weed-killer-effectiveness" />
    <button x="85" y="340" height="55" disableUntilTicks="true" forever="true" kind="Observer" width="80">go</button>
    <slider x="5" step="1" y="401" max="30" width="285" display="weed-killer-rate" height="55" min="0" direction="Horizontal" default="5.0" variable="weed-killer-rate" />
    <plot x="985" autoPlotX="true" yMax="1000.0" autoPlotY="true" yAxis="patches" y="330" xMin="0.0" height="310" legend="false" xMax="100.0" yMin="0.0" width="320" xAxis="infestation" display="infestation levels">
      <setup />
      <update />
      <pen interval="10.0" mode="1" display="infestation" color="-16777216" legend="true">
        <setup />
        <update>;; A value of 100 would be out of range of the last interval, so
;; we need to clamp it to 0-99 to make sure they will appear in
;; the histogram.
histogram [min list 99 infestation] of patches</update>
      </pen>
    </plot>
    <button x="1045" y="645" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="200" display="clear plots">clear-all-plots</button>
    <plot x="985" autoPlotX="true" yMax="50000.0" autoPlotY="true" yAxis="infestation" y="7" xMin="0.0" height="310" legend="false" xMax="10.0" yMin="0.0" width="320" xAxis="ticks" display="aggregate infestation">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot sum [infestation] of patches</update>
      </pen>
    </plot>
    <note x="5" y="315" backgroundDark="-15329770" fontSize="12" width="298" markdown="false" height="25" textColorDark="-1" textColorLight="-16777216" backgroundLight="2125023">___________________________________________________</note>
    <slider x="5" step="0.01" y="5" max="1" width="285" display="initial-density" height="55" min="0" direction="Horizontal" default="0.01" variable="initial-density" />
    <chooser x="5" y="65" height="60" variable="initial-resistance-shape" current="1" width="195" display="initial-resistance-shape">
      <choice type="string" value="none" />
      <choice type="string" value="plus" />
      <choice type="string" value="circle" />
    </chooser>
    <button x="205" y="65" height="55" disableUntilTicks="false" forever="false" kind="Observer" width="85">setup</button>
    <note x="5" y="135" backgroundDark="0" fontSize="14" width="285" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Draw Infestation/Resistance</note>
    <note x="5" y="155" backgroundDark="0" fontSize="12" width="285" markdown="false" height="41" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Use draw button to then click and draw on the view to add resistance or infestation.</note>
    <button x="205" y="200" height="55" disableUntilTicks="true" forever="true" kind="Observer" width="85">draw</button>
    <chooser x="5" y="200" height="60" variable="draw-mode" current="1" width="195" display="draw-mode">
      <choice type="string" value="infestation" />
      <choice type="string" value="resistance" />
    </chooser>
    <slider x="5" step="1" y="265" max="100" width="195" display="draw-value" height="55" min="0" direction="Horizontal" default="100.0" variable="draw-value" />
    <button x="205" y="260" height="55" disableUntilTicks="true" forever="false" kind="Observer" width="85" display="clear ">clear-patches
ask resistance-blocks [die]</button>
    <button x="5" y="340" height="55" disableUntilTicks="true" forever="false" kind="Observer" width="75" display="go-once">go</button>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
breed [ seeds seed ]
breed [ resistance-blocks resistance-block ]

patches-own [
  infestation ;; level of infestation
  resistance  ;; degree of resistance to infestations
]

to setup
  clear-all

  set-default-shape seeds "circle"
  set-default-shape resistance-blocks "square"

  ask patches [
    sprout-resistance-blocks 1 [
      set color gray
    ]

    if random 100 < initial-density * 100 [
      set infestation 100
    ]

    update-patch-visuals
  ]

  (ifelse
    initial-resistance-shape = "plus" [put-plus-resistance-pattern]
    initial-resistance-shape = "circle" [put-circle-resistance-pattern]
  )

  reset-ticks
end

to draw
  (ifelse draw-mode = "infestation" [
    draw-plants
  ] draw-mode = "resistance" [
    draw-resistance
  ] [
    error "Unknown mode"
  ])

  tick
end

to go
  germinate-seeds
  apply-weed-killer
  generate-seeds
  spread-seeds

  ask patches [
    update-patch-visuals
  ]

  tick
end


to generate-seeds
  ask patches [
    let mean-new-seeds seed-production-rate * infestation

    ;; Ensure that the mean is positive so we don't end up generating seeds when
    ;; there's no infestation.
    if mean-new-seeds > 0 [
      let new-seeds max2 0 random-normal mean-new-seeds 1

      sprout-seeds new-seeds [
        set color green
        set size 0.5
      ]
    ]
  ]
end

to germinate-seeds
  ask seeds [
    ask patch-here [
      ;; The chance the the seed will successfully germinate depends on the
      ;; resistance of the patch it is on. The higher the resistance, the lower
      ;; the chance.
      if random 100 > resistance [
        set infestation min list 100 infestation + 1
      ]
    ]

    die
  ]
end

to spread-seeds
  ask seeds [
    set hidden? not show-seeds?
    fd random-float spread-distance
  ]
end

to apply-weed-killer
  let targets patches with [infestation > weed-killer-threshold]

  ask up-to-n-of weed-killer-rate targets [
    let effectiveness weed-killer-effectiveness
    set infestation max2 0 (infestation - effectiveness * infestation)

    ;; Kill a smaller number of plants in neighboring patches to simulate runoff.
    ask neighbors [
      set infestation max2 0 (infestation - (effectiveness / 2) * infestation)
    ]
  ]
end

to put-plus-resistance-pattern
  ask patches [
    if abs pxcor < 3 or abs pycor < 3 [
      set resistance draw-value
      set infestation 0
    ]
    update-patch-visuals
  ]
end

to put-circle-resistance-pattern
  ask patches [
    if (pxcor ^ 2 + pycor ^ 2) < 7 ^ 2 [
      set resistance draw-value
      set infestation 0
    ]
    update-patch-visuals
  ]
end

to update-patch-visuals ; patch procedure
  ;; Here, sqrt is used to make low values more visible. Also, the top end of
  ;; scale-color's range is set to 2 even though the input value will never go
  ;; higher than 1. This is so that we get regular green at maximum infestation
  ;; instead of white.
  let infestation-color scale-color green (sqrt (infestation / 100)) 0 2
  set pcolor infestation-color

  ask resistance-blocks-here [
    set size sqrt (resistance / 100)
  ]
end

to draw-plants
  if mouse-down? [
    ask patch mouse-xcor mouse-ycor [
      set infestation draw-value
      update-patch-visuals
    ]
  ]
end

to draw-resistance
  if mouse-down? [
    ask patch mouse-xcor mouse-ycor [
      set infestation 0
      set resistance draw-value
      update-patch-visuals
    ]
  ]
end

;; Works like max but accepts 2 numbers instead of a list.
to-report max2 [x y]
  report max (list x y)
end


; Copyright 2025 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Ants

Canonical path: `Sample Models/Biology/Ants`; SHA-256 `a7c54ba49c1a492efff67522e894cce469284783a3f3d87e91acc8692cc78ce6`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="317" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-35" height="501" showTickCounter="true" patchSize="7.0" fontSize="10" wrappingAllowedY="false" width="501" tickCounterLabel="ticks" maxPycor="35" updateMode="1" maxPxcor="35" minPxcor="-35" />
    <plot x="10" autoPlotX="true" yMax="120.0" autoPlotY="true" yAxis="food" y="245" xMin="0.0" height="264" legend="false" xMax="50.0" yMin="0.0" width="303" xAxis="time" display="Food in each pile">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="food-in-pile1" color="-11221820" legend="true">
        <setup />
        <update>plotxy ticks sum [food] of patches with [pcolor = cyan]</update>
      </pen>
      <pen interval="1.0" mode="0" display="food-in-pile2" color="-13791810" legend="true">
        <setup />
        <update>plotxy ticks sum [food] of patches with [pcolor = sky]</update>
      </pen>
      <pen interval="1.0" mode="0" display="food-in-pile3" color="-13345367" legend="true">
        <setup />
        <update>plotxy ticks sum [food] of patches with [pcolor = blue]</update>
      </pen>
    </plot>
    <slider x="36" step="1.0" y="180" max="99.0" width="250" display="evaporation-rate" height="50" min="0.0" direction="Horizontal" default="10.0" variable="evaporation-rate" />
    <slider x="36" step="1.0" y="11" max="200.0" width="250" display="population" height="50" min="0.0" direction="Horizontal" default="125.0" variable="population" />
    <slider x="36" step="1.0" y="122" max="99.0" width="250" display="diffusion-rate" height="50" min="0.0" direction="Horizontal" default="50.0" variable="diffusion-rate" />
    <button x="80" y="69" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="85">setup</button>
    <button x="170" y="69" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="90">go</button>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
patches-own [
  chemical             ;; amount of chemical on this patch
  food                 ;; amount of food on this patch (0, 1, or 2)
  nest?                ;; true on nest patches, false elsewhere
  nest-scent           ;; number that is higher closer to the nest
  food-source-number   ;; number (1, 2, or 3) to identify the food sources
]

;;;;;;;;;;;;;;;;;;;;;;;;
;;; Setup procedures ;;;
;;;;;;;;;;;;;;;;;;;;;;;;

to setup
  clear-all
  set-default-shape turtles "bug"
  create-turtles population
  [ set size 2         ;; easier to see
    set color red  ]   ;; red = not carrying food
  setup-patches
  reset-ticks
end

to setup-patches
  ask patches
  [ setup-nest
    setup-food
    recolor-patch ]
end

to setup-nest  ;; patch procedure
  ;; set nest? variable to true inside the nest, false elsewhere
  set nest? (distancexy 0 0) < 5
  ;; spread a nest-scent over the whole world -- stronger near the nest
  set nest-scent 200 - distancexy 0 0
end

to setup-food  ;; patch procedure
  ;; setup food source one on the right
  if (distancexy (0.6 * max-pxcor) 0) < 5
  [ set food-source-number 1 ]
  ;; setup food source two on the lower-left
  if (distancexy (-0.6 * max-pxcor) (-0.6 * max-pycor)) < 5
  [ set food-source-number 2 ]
  ;; setup food source three on the upper-left
  if (distancexy (-0.8 * max-pxcor) (0.8 * max-pycor)) < 5
  [ set food-source-number 3 ]
  ;; set "food" at sources to either 1 or 2, randomly
  if food-source-number > 0
  [ set food one-of [1 2] ]
end

to recolor-patch  ;; patch procedure
  ;; give color to nest and food sources
  ifelse nest?
  [ set pcolor violet ]
  [ ifelse food > 0
    [ if food-source-number = 1 [ set pcolor cyan ]
      if food-source-number = 2 [ set pcolor sky  ]
      if food-source-number = 3 [ set pcolor blue ] ]
    ;; scale color to show chemical concentration
    [ set pcolor scale-color green chemical 0.1 5 ] ]
end

;;;;;;;;;;;;;;;;;;;;;
;;; Go procedures ;;;
;;;;;;;;;;;;;;;;;;;;;

to go  ;; forever button
  ask turtles
  [ if who >= ticks [ stop ] ;; delay initial departure
    ifelse color = red
    [ look-for-food  ]       ;; not carrying food? look for it
    [ return-to-nest ]       ;; carrying food? take it back to nest
    wiggle
    fd 1 ]
  diffuse chemical (diffusion-rate / 100)
  ask patches
  [ set chemical chemical * (100 - evaporation-rate) / 100  ;; slowly evaporate chemical
    recolor-patch ]
  tick
end

to return-to-nest  ;; turtle procedure
  ifelse nest?
  [ ;; drop food and head out again
    set color red
    rt 180 ]
  [ set chemical chemical + 60  ;; drop some chemical
    uphill-nest-scent ]         ;; head toward the greatest value of nest-scent
end

to look-for-food  ;; turtle procedure
  if food > 0
  [ set color orange + 1     ;; pick up food
    set food food - 1        ;; and reduce the food source
    rt 180                   ;; and turn around
    stop ]
  ;; go in the direction where the chemical smell is strongest
  if (chemical >= 0.05) and (chemical < 2)
  [ uphill-chemical ]
end

;; sniff left and right, and go where the strongest smell is
to uphill-chemical  ;; turtle procedure
  let scent-ahead chemical-scent-at-angle   0
  let scent-right chemical-scent-at-angle  45
  let scent-left  chemical-scent-at-angle -45
  if (scent-right > scent-ahead) or (scent-left > scent-ahead)
  [ ifelse scent-right > scent-left
    [ rt 45 ]
    [ lt 45 ] ]
end

;; sniff left and right, and go where the strongest smell is
to uphill-nest-scent  ;; turtle procedure
  let scent-ahead nest-scent-at-angle   0
  let scent-right nest-scent-at-angle  45
  let scent-left  nest-scent-at-angle -45
  if (scent-right > scent-ahead) or (scent-left > scent-ahead)
  [ ifelse scent-right > scent-left
    [ rt 45 ]
    [ lt 45 ] ]
end

to wiggle  ;; turtle procedure
  rt random 40
  lt random 40
  if not can-move? 1 [ rt 180 ]
end

to-report nest-scent-at-angle [angle]
  let p patch-right-and-ahead angle 1
  if p = nobody [ report 0 ]
  report [nest-scent] of p
end

to-report chemical-scent-at-angle [angle]
  let p patch-right-and-ahead angle 1
  if p = nobody [ report 0 ]
  report [chemical] of p
end


; Copyright 1997 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Heatbugs

Canonical path: `Sample Models/Biology/Heatbugs`; SHA-256 `9b439a81d1526f34fe9716a9d2d690d9948ecd119fa6f64502aee3b424c6fa59`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="371" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="0" height="404" showTickCounter="true" patchSize="4.0" fontSize="10" wrappingAllowedY="true" width="404" tickCounterLabel="ticks" maxPycor="99" updateMode="1" maxPxcor="99" minPxcor="0" />
    <slider x="14" step="1" y="30" max="500" width="262" display="bug-count" height="50" min="1" direction="Horizontal" default="100.0" variable="bug-count" units="bugs" />
    <button x="27" y="228" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="69">setup</button>
    <button x="98" y="228" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="68">go</button>
    <slider x="164" step="0.01" y="289" max="1" width="193" display="evaporation-rate" height="50" min="0" direction="Horizontal" default="0.01" variable="evaporation-rate" />
    <slider x="164" step="0.1" y="340" max="1" width="193" display="diffusion-rate" height="50" min="0" direction="Horizontal" default="0.9" variable="diffusion-rate" />
    <slider x="164" step="1.0" y="392" max="100" width="193" display="random-move-chance" height="50" min="0" direction="Horizontal" default="0.0" variable="random-move-chance" units="%" />
    <slider x="14" step="1" y="86" max="200" width="172" display="min-ideal-temp" height="50" min="0" direction="Horizontal" default="10.0" variable="min-ideal-temp" />
    <slider x="189" step="1" y="142" max="100" width="173" display="max-output-heat" height="50" min="0" direction="Horizontal" default="25.0" variable="max-output-heat" />
    <slider x="189" step="1" y="86" max="100" width="173" display="min-output-heat" height="50" min="0" direction="Horizontal" default="5.0" variable="min-output-heat" />
    <button x="179" y="228" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="92">deep-freeze</button>
    <button x="274" y="228" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="88">heat-up</button>
    <note x="10" y="10" backgroundDark="0" fontSize="11" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Initial settings for bugs</note>
    <note x="13" y="283" backgroundDark="0" fontSize="11" width="127" markdown="false" height="28" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Other parameters</note>
    <note x="12" y="207" backgroundDark="0" fontSize="11" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Actions</note>
    <note x="12" y="304" backgroundDark="0" fontSize="11" width="141" markdown="false" height="29" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">(OK to change
during run)</note>
    <note x="376" y="429" backgroundDark="0" fontSize="11" width="83" markdown="false" height="30" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Color bug by:</note>
    <button x="694" y="457" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="137">reset-perspective</button>
    <button x="573" y="459" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="118" display="watch happiest">watch min-one-of turtles [ unhappiness ]</button>
    <button x="462" y="459" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="107" display="watch saddest">watch max-one-of turtles [ unhappiness ]</button>
    <button x="573" y="421" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="116" display="happiness">set color-by-unhappiness? true</button>
    <button x="462" y="421" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="106" display="ideal-temp">set color-by-unhappiness? false
ask turtles [ color-by-ideal-temp ]</button>
    <plot x="787" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="unhappiness" y="10" xMin="0.0" height="235" legend="false" xMax="100.0" yMin="0.0" width="371" xAxis="time" display="Avg. Bug Unhappiness">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot mean [unhappiness] of turtles</update>
      </pen>
    </plot>
    <slider x="14" step="1" y="142" max="200" width="172" display="max-ideal-temp" height="50" min="0" direction="Horizontal" default="40.0" variable="max-ideal-temp" />
  </widgets>
  
```

### Exact procedures for audit

```netlogo
globals [ color-by-unhappiness? ]

turtles-own
[
  ideal-temp       ;; The temperature I want to be at
  output-heat      ;; How much heat I emit per time step
  unhappiness      ;; The magnitude of the difference between my ideal
                   ;;   temperature and the actual current temperature here
]

patches-own
[
  temp             ;; short for "temperature"
]

to setup
  clear-all
  set color-by-unhappiness? false

  ;; creating the bugs the following way ensures that we won't
  ;; wind up with more than one bug on a patch
  ask n-of bug-count patches [
    sprout 1 [
      set ideal-temp  min-ideal-temp  + random (max-ideal-temp  - min-ideal-temp)
      set output-heat min-output-heat + random (max-output-heat - min-output-heat)
      set unhappiness abs (ideal-temp - temp)
      color-by-ideal-temp
      face one-of neighbors
      set size 2  ;; easier to see
    ]
  ]
  ;; plot the initial state of the system
  reset-ticks
end

to color-by-ideal-temp
  ;; when scaling the color of turtles, adjust the value
  ;; range by this amount to avoid turtles being too dark or too light.
  let range-adjustment ( max-ideal-temp - min-ideal-temp ) / 2
  set color scale-color lime ideal-temp ( min-ideal-temp - range-adjustment )
                                        ( max-ideal-temp + range-adjustment )
end

to color-by-unhappiness [ max-unhappiness ]
  set color scale-color blue unhappiness  max-unhappiness 0
end

to go
  if not any? turtles [ stop ]
  ;; diffuse heat through world
  diffuse temp diffusion-rate
  ;; The world retains a percentage of its heat each cycle.
  ;; (The Swarm and Repast versions have 1.0 meaning no
  ;; evaporation and 0.0 meaning complete evaporation;
  ;; we reverse the scale to better match the name.)
  ask patches [ set temp temp * (1 - evaporation-rate) ]
  ;; agentsets in NetLogo are always in random order, so
  ;; "ask turtles" automatically shuffles the order of execution
  ;; each time.
  ask turtles [ step ]
  recolor-turtles
  recolor-patches
  tick
end

to recolor-turtles
  if color-by-unhappiness?
  [
    let max-unhappiness max [unhappiness] of turtles
    ask turtles [ color-by-unhappiness max-unhappiness ]
  ]
end

to recolor-patches
  ;; hotter patches will be red verging on white;
  ;; cooler patches will be black
  ask patches [ set pcolor scale-color red temp 0 150 ]
end

to step  ;; turtle procedure
  ;; my unhappiness is the magnitude or absolute value of the difference
  ;; between by ideal temperature and the temperature of this patch
  set unhappiness abs (ideal-temp - temp)
  ;; if unhappy and not at the hottest neighbor,
  ;; then move to an open neighbor
  if unhappiness > 0
    [ ifelse random-float 100 < random-move-chance
        [ bug-move one-of neighbors ]
        [ bug-move best-patch ] ]
  set temp temp + output-heat
end

;; find the hottest or coolest location next to me; also
;; take my current patch into consideration
to-report best-patch  ;; turtle procedure
  ifelse temp < ideal-temp
    [ let winner max-one-of neighbors [temp]
      ifelse [temp] of winner > temp
        [ report winner ]
        [ report patch-here ] ]
    [ let winner min-one-of neighbors [temp]
      ifelse [temp] of winner < temp
        [ report winner ]
        [ report patch-here ] ]
end

to bug-move [target]  ;; turtle procedure
  ;; if we're already there, there's nothing to do
  if target = patch-here [ stop ]
  ;; move to the target patch (if it is not already occupied)
  if not any? turtles-on target [
    face target
    move-to target
    stop
  ]
  set target one-of neighbors with [not any? turtles-here]
  if target != nobody [ move-to target ]
  ;; The code above is a bit different from the original Heatbugs
  ;; model in Swarm.  In the NetLogo version, the bug will always
  ;; find an empty patch if one is available.
  ;; In the Swarm version, the bug picks a random
  ;; nearby patch, checks to see if it is occupied, and if it is,
  ;; picks again.  If after 10 tries it hasn't found an empty
  ;; patch, it gives up and stays where it is.  Since each try
  ;; is random and independent, even if there is an available
  ;; empty patch the bug will not always find it.  Presumably
  ;; the Swarm version is coded that way because there is no
  ;; concise equivalent in Swarm/Objective C to NetLogo's
  ;; 'one-of neighbors with [not any? turtles-here]'.
  ;; If you want to match the Swarm version exactly, remove the
  ;; last two lines of code above and replace them with this:
  ; let tries 0
  ; while [tries <= 9]
  ;   [ set tries tries + 1
  ;     set target one-of neighbors
  ;     if not any? turtles-on target [
  ;       move-to target
  ;       stop
  ;     ]
  ;   ]
end

;;; the following procedures support the two extra buttons
;;; in the interface

;; remove all heat from the world
to deep-freeze
  ask patches [ set temp 0 ]
end

;; add max-output-heat to all locations in the world, heating it evenly
to heat-up
  ask patches [ set temp temp + max-output-heat ]
end


; Copyright 2004 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Flocking

Canonical path: `Sample Models/Biology/Flocking`; SHA-256 `0ce9a6b0ee385898dfcacc7ed06699286cd51e5302a80c90b32687e13cefa143`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="269" wrappingAllowedX="true" y="12" frameRate="30.0" minPycor="-35" height="501" showTickCounter="true" patchSize="7.0" fontSize="10" wrappingAllowedY="true" width="501" tickCounterLabel="ticks" maxPycor="35" updateMode="1" maxPxcor="35" minPxcor="-35" />
    <slider x="4" step="1.0" y="10" max="1000.0" width="250" display="population" height="50" min="1.0" direction="Horizontal" default="300.0" variable="population" />
    <slider x="4" step="0.25" y="234" max="20.0" width="250" display="max-align-turn" height="50" min="0.0" direction="Horizontal" default="5.0" variable="max-align-turn" units="degrees" />
    <slider x="4" step="0.25" y="289" max="20.0" width="250" display="max-cohere-turn" height="50" min="0.0" direction="Horizontal" default="3.0" variable="max-cohere-turn" units="degrees" />
    <slider x="4" step="0.25" y="344" max="20.0" width="250" display="max-separate-turn" height="50" min="0.0" direction="Horizontal" default="1.5" variable="max-separate-turn" units="degrees" />
    <slider x="4" step="0.5" y="124" max="10.0" width="250" display="vision" height="50" min="0.0" direction="Horizontal" default="5.0" variable="vision" units="patches" />
    <slider x="4" step="0.25" y="179" max="5.0" width="250" display="minimum-separation" height="50" min="0.0" direction="Horizontal" default="1.0" variable="minimum-separation" units="patches" />
    <button x="37" y="68" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="88">setup</button>
    <button x="135" y="68" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="81">go</button>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
turtles-own [
  flockmates         ;; agentset of nearby turtles
  nearest-neighbor   ;; closest one of our flockmates
]

to setup
  clear-all
  create-turtles population
    [ set color yellow - 2 + random 7  ;; random shades look nice
      set size 1.5  ;; easier to see
      setxy random-xcor random-ycor
      set flockmates no-turtles ]
  reset-ticks
end

to go
  ask turtles [ flock ]
  ;; the following line is used to make the turtles
  ;; animate more smoothly.
  repeat 5 [ ask turtles [ fd 0.2 ] display ]
  ;; for greater efficiency, at the expense of smooth
  ;; animation, substitute the following line instead:
  ;;   ask turtles [ fd 1 ]
  tick
end

to flock  ;; turtle procedure
  find-flockmates
  if any? flockmates
    [ find-nearest-neighbor
      ifelse distance nearest-neighbor < minimum-separation
        [ separate ]
        [ align
          cohere ] ]
end

to find-flockmates  ;; turtle procedure
  set flockmates other turtles in-radius vision
end

to find-nearest-neighbor ;; turtle procedure
  set nearest-neighbor min-one-of flockmates [distance myself]
end

;;; SEPARATE

to separate  ;; turtle procedure
  turn-away ([heading] of nearest-neighbor) max-separate-turn
end

;;; ALIGN

to align  ;; turtle procedure
  turn-towards average-flockmate-heading max-align-turn
end

to-report average-flockmate-heading  ;; turtle procedure
  ;; We can't just average the heading variables here.
  ;; For example, the average of 1 and 359 should be 0,
  ;; not 180.  So we have to use trigonometry.
  let x-component sum [dx] of flockmates
  let y-component sum [dy] of flockmates
  ifelse x-component = 0 and y-component = 0
    [ report heading ]
    [ report atan x-component y-component ]
end

;;; COHERE

to cohere  ;; turtle procedure
  turn-towards average-heading-towards-flockmates max-cohere-turn
end

to-report average-heading-towards-flockmates  ;; turtle procedure
  ;; "towards myself" gives us the heading from the other turtle
  ;; to me, but we want the heading from me to the other turtle,
  ;; so we add 180
  let x-component mean [sin (towards myself + 180)] of flockmates
  let y-component mean [cos (towards myself + 180)] of flockmates
  ifelse x-component = 0 and y-component = 0
    [ report heading ]
    [ report atan x-component y-component ]
end

;;; HELPER PROCEDURES

to turn-towards [new-heading max-turn]  ;; turtle procedure
  turn-at-most (subtract-headings new-heading heading) max-turn
end

to turn-away [new-heading max-turn]  ;; turtle procedure
  turn-at-most (subtract-headings heading new-heading) max-turn
end

;; turn right by "turn" degrees (or left if "turn" is negative),
;; but never turn more than "max-turn" degrees
to turn-at-most [turn max-turn]  ;; turtle procedure
  ifelse abs turn > max-turn
    [ ifelse turn > 0
        [ rt max-turn ]
        [ lt max-turn ] ]
    [ rt turn ]
end


; Copyright 1998 Uri Wilensky.
; See Info tab for full copyright and license.
```


## Fireflies

Canonical path: `Sample Models/Biology/Fireflies`; SHA-256 `3e27054691236c9aadca9d425a1c4b66cc0452e4195c2266e09ba3729f5e7cb2`. Includes: `None`; extensions: `[]`.

### Exact widgets

```xml
<widgets>
    <view x="270" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-35" height="430" showTickCounter="true" patchSize="6.0" fontSize="10" wrappingAllowedY="true" width="430" tickCounterLabel="ticks" maxPycor="35" updateMode="1" maxPxcor="35" minPxcor="-35" />
    <slider x="10" step="1" y="10" max="2000" width="250" display="number" height="50" min="0" direction="Horizontal" default="1500.0" variable="number" />
    <slider x="10" step="1" y="132" max="10" width="250" display="flash-length" height="50" min="1" direction="Horizontal" default="1.0" variable="flash-length" />
    <chooser x="10" y="67" height="60" variable="strategy" current="0" width="250" display="strategy">
      <choice type="string" value="delay" />
      <choice type="string" value="advance" />
    </chooser>
    <slider x="10" step="1" y="241" max="3" width="250" display="flashes-to-reset" height="50" min="1" direction="Horizontal" default="1.0" variable="flashes-to-reset" />
    <switch x="55" y="350" height="40" on="false" variable="show-dark-fireflies?" width="182" display="show-dark-fireflies?" />
    <slider x="10" step="1" y="295" max="100" width="250" display="cycle-length" height="50" min="5" direction="Horizontal" default="10.0" variable="cycle-length" />
    <button x="40" y="190" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="90" display="setup">setup</button>
    <button x="140" y="190" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="95" display="go">go</button>
    <plot x="705" autoPlotX="true" yMax="1500.0" autoPlotY="true" yAxis="Number" y="75" xMin="0.0" height="265" legend="false" xMax="100.0" yMin="0.0" width="340" xAxis="Time" display="Flashing Fireflies">
      <setup>set-plot-y-range 0 number</setup>
      <update />
      <pen interval="1.0" mode="0" display="flashing" color="-2674135" legend="true">
        <setup />
        <update>plot count turtles with [color = yellow]</update>
      </pen>
    </plot>
  </widgets>
  
```

### Exact procedures for audit

```netlogo
turtles-own
[ clock        ;; each firefly's clock
  threshold    ;; the clock tick at which a firefly stops its flash
  reset-level  ;; the clock tick a firefly will reset to when it is triggered by other flashing
  window       ;; a firefly can't reset its cycle if (clock <= window)
]

to setup
  clear-all
  create-turtles number
    [ setxy random-xcor random-ycor
      set shape "butterfly"
      set clock random (round cycle-length)
      set threshold flash-length
      ifelse strategy = "delay"
      [ set reset-level threshold
        set window -1 ]
      [ set reset-level 0
        set window (threshold + 1) ]
      set size 2  ;; easier to see
      recolor ]
  reset-ticks
end

to go
  ask turtles [
    move
    increment-clock
    if ( (clock > window) and (clock >= threshold) )
      [ look ]
  ]
  ask turtles [
    recolor
  ]
  tick
end


to recolor ; turtle procedure
  ifelse (clock < threshold)
    [ show-turtle
      set color yellow ]
    [ set color gray - 2
      ifelse show-dark-fireflies?
        [ show-turtle ]
        [ hide-turtle ] ]
end

to move ; turtle procedure
  rt random-float 90 - random-float 90
  fd 1
end

to increment-clock ; turtle procedure
  set clock (clock + 1)
  if clock = cycle-length
    [ set clock 0 ]
end

to look ; turtle procedure
  if count turtles in-radius 1 with [color = yellow] >= flashes-to-reset
    [ set clock reset-level ]
end


; Copyright 1997 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Audited execution contracts

- Simple Birth Rates: capacity turtles at setup; `who < capacity / 2` is blue (odd capacity rounds blue upward). Each old turtle hatches integer fertility plus Bernoulli remainder; parents survive reproduction. Mortality then samples each turtle independently using excess/total, so capacity is an expectation, not an exact cap. Experiment mode logs extinction then resets; ordinary go never stops on extinction. Plot updates own red/blue counts.
- Daisyworld: 29×29 torus; black count rounds and white count floors, without overlap. Initial ages are uniform integers below 25. Local heating is `72 ln((1-albedo)*luminosity)+80`, with nonpositive absorbed energy using 80. Half-step thermal relaxation precedes Moore diffusion 0.5, then sequential shuffled aging/death/seeding; seedlings do not activate immediately. Plot/tick precedes scenario luminosity changes. Daisy albedo is captured at creation; surface albedo is live. Drawing does not advance ticks.
- Termites: 201×201 torus, 400 termites and 20% chips. Recursive search/pickup, move 20, find pile, find empty/drop, escape 20. Turtle forever button has no observer ticks. Bounded resumable procedure work is required to preserve responsiveness for empty/full landscapes; work count must not masquerade as NetLogo ticks. Chip-on-patch plus carried-chip conservation is exact.
- Shepherds: 51×51 torus; shepherds act sequentially before visible sheep. Pickup hides the same canonical sheep. Carried sheep moves to shepherd after shepherd movement. Finding a herd and dropping at an empty place are separate activations; drop includes a 20-unit escape. Plot update computes Moore-neighbor sheep counts and empty-neighborhood/empty-patch efficiency; hidden carried sheep still count in patch occupancy.
- Rabbits Grass Weeds: 41×41 torus. Empty patches independently attempt weeds then grass; grass overwrites a just-grown weed. Extinction preflight precedes growth. Each old rabbit moves, pays 0.5, eats grass/weeds, reproduces only at energy strictly greater than threshold (halved, child moves one), then dies only below zero. Resource plot divides patch counts by four.
- Invasive Plants: 33×33 hard world; germinate all old seeds and delete, then sample weed-killer targets from original qualifying patches, sequential runoff on Moore neighbors, then generate normally distributed nonnegative seed counts, then spread. Initial Bernoulli uses random integer 100. Plus/circle resistance clears infestation and uses draw-value. Resistance germination comparison is strict `random 100 > resistance`. Drawing/reset patches/clear plots are distinct actions. Seed movement beyond a hard boundary requires explicit source-runtime verification rather than an invented wrapping rule.
- Ants: 71×71 hard world. Nest radius strictly below five; three radius-five food circles, with later source assignments overriding overlap. All ants start at origin. `who >= ticks` stops only that turtle, so first go moves none. Food pickup returns from its procedure, then wiggle/move still occurs. Nest return deposits chemical 60 outside nest. Three heading samples choose right only when strictly larger than left; ties choose left. Diffusion then evaporation follows all agents. Food plots use visible pile-color patch sums.
- Heatbugs: 100×100 torus with no duplicate initial occupied patches; ideal/output ranges are integer upper-exclusive. Moore diffusion and evaporation precede sequential shuffled agents; unhappiness is measured before movement and heat emission. Best neighbor is compared strictly to current field; occupied destination falls back to any free neighbor. Heat-up and freeze change fields without time. Coloring and watch/perspective actions are presentation semantics, separate from equations.
- Flocking: 71×71 torus. Sequential shuffled heading updates see earlier headings; nearest-distance ties are random. Separation turns away from neighbor heading, not its position. Alignment and cohesion use circular vector means; exact zero vector preserves heading. Five 0.2 moves follow all flock decisions, then one tick.
- Fireflies: 71×71 torus; setup captures strategy-dependent threshold/reset/window per agent. Each shuffled agent moves, increments its clock, resets only at exact cycle equality, then senses still-old yellow colors within radius one including self. Recolor is a distinct second pass. Cycle length/reset threshold are not generic modulo oscillators. Empty world still ticks; visibility does not remove agents from sensing.

## Frozen phase B06 examples

Five complete asserted public scripts under `examples/selected-ecology/` are pinned by SHA256SUMS before runtime delegation. They cover all ten public factories, deterministic equations and invariants, interventions, preflight/empty-world time and pure observation. They use public model entrypoints and canonical library composition rather than private core imports. Script 01 was executed before implementation and failed with missing Simple Birth Rates module (Bun 1.4.2); no stub was added. Production defaults remain source defaults; explicit test settings isolate asserted mechanisms. These are a minimum contract; complete widget/procedure and browser coverage remains required.
