# Particle Swarm Optimization complete source contract inventory

Identity: `Sample Models/Computer Science/Particle Swarm Optimization`; SHA-256 `d03ded09553798a66fa7c70ee9aef25d5852dba403cdf388c4bcd2dd7a3b6d0e`; NetLogo 7.0.4. Includes: None; extensions: [].

All procedures, equations and textual activation order:

```netlogo
patches-own
[
  val  ; each patch has a "fitness" value associated with it
       ; the goal of the particle swarm is to find the patch with the best fitness value
]

turtles-own
[
  vx                  ; velocity in the x direction
  vy                  ; velocity in the y direction

  personal-best-val   ; best value I've run across so far
  personal-best-x     ; x coordinate of that best value
  personal-best-y     ; x coordinate of that best value
]

globals
[
  global-best-x    ; x coordinate of best value found by the swarm
  global-best-y    ; y coordinate of best value found by the swarm
  global-best-val  ; highest value found by the swarm
  true-best-patch  ; patch with the best value
]

to setup-search-landscape
  ;; make a landscape with hills and valleys
  ask patches [ set val random-float 1.0 ]
  ;; slightly smooth out the landscape
  repeat landscape-smoothness [ diffuse val 1 ]
  let min-val min [val] of patches
  let max-val max [val] of patches
  ; normalize the values to be between 0 and 1
  ask patches [ set val 0.99999 * (val - min-val) / (max-val - min-val)  ]

  ; make it so that there is only one global optimum, and its value is 1.0
  ask max-one-of patches [val]
  [
    set val 1.0
    set true-best-patch self
  ]

  ask patches [ set pcolor scale-color gray val 0.0 1.0]
end

to setup
  clear-all
  setup-search-landscape

  ; create particles and place them randomly in the world
  create-turtles population-size
  [
    setxy random-xcor random-ycor
    ; give the particles normally distributed random initial velocities for both x and y directions
    set vx random-normal 0 1
    set vy random-normal 0 1
    ; the starting spot is the particle's current best location.
    set personal-best-val val
    set personal-best-x xcor
    set personal-best-y ycor

    ; choose a random basic NetLogo color, but not gray
    set color one-of (remove-item 0 base-colors)
    ; make the particles a little more visible
    set size 4
  ]
  update-highlight
  reset-ticks
end

to go
  ask turtles [
    ; should the particles draw trails, or not?
    ifelse trails-mode = "None" [ pen-up ] [ pen-down ]

    ; update the "personal best" location for each particle,
    ; if they've found a new value better than their previous "personal best"
    if val > personal-best-val
    [
      set personal-best-val val
      set personal-best-x xcor
      set personal-best-y ycor
    ]
  ]

  ; update the "global best" location for the swarm, if necessary.
  ask max-one-of turtles [personal-best-val]
  [
    if global-best-val < personal-best-val
    [
      set global-best-val personal-best-val
      set global-best-x personal-best-x
      set global-best-y personal-best-y
    ]
  ]
  if global-best-val = [val] of true-best-patch
    [ stop ]

  if (trails-mode != "Traces")
    [ clear-drawing ]

  ask turtles
  [
    set vx particle-inertia * vx
    set vy particle-inertia * vy

    ; Technical note:
    ;   In the canonical PSO, the "(1 - particle-inertia)" term isn't present in the
    ;   mathematical expressions below.  It was added because it allows the
    ;   "particle-inertia" slider to vary particles motion on the the full spectrum
    ;   from moving in a straight line (1.0) to always moving towards the "best" spots
    ;   and ignoring its previous velocity (0.0).

    ; change my velocity by being attracted to the "personal best" value I've found so far
    facexy personal-best-x personal-best-y
    let dist distancexy personal-best-x personal-best-y
    set vx vx + (1 - particle-inertia) * attraction-to-personal-best * (random-float 1.0) * dist * dx
    set vy vy + (1 - particle-inertia) * attraction-to-personal-best * (random-float 1.0) * dist * dy

    ; change my velocity by being attracted to the "global best" value anyone has found so far
    facexy global-best-x global-best-y
    set dist distancexy global-best-x global-best-y
    set vx vx + (1 - particle-inertia) * attraction-to-global-best * (random-float 1.0) * dist * dx
    set vy vy + (1 - particle-inertia) * attraction-to-global-best * (random-float 1.0) * dist * dy

    ; speed limits are particularly necessary because we are dealing with a toroidal (wrapping) world,
    ; which means that particles can start warping around the world at ridiculous speeds
    if (vx > particle-speed-limit) [ set vx particle-speed-limit ]
    if (vx < 0 - particle-speed-limit) [ set vx 0 - particle-speed-limit ]
    if (vy > particle-speed-limit) [ set vy particle-speed-limit ]
    if (vy < 0 - particle-speed-limit) [ set vy 0 - particle-speed-limit ]

    ; face in the direction of my velocity
    facexy (xcor + vx) (ycor + vy)
    ; and move forward by the magnitude of my velocity
    forward sqrt (vx * vx + vy * vy)

  ]
  update-highlight
  tick
end

to update-highlight
  ifelse highlight-mode = "Best found"
  [ watch patch global-best-x global-best-y ]
  [
    ifelse highlight-mode = "True best"
    [  watch true-best-patch ]
    [  reset-perspective ]
  ]
end


; Copyright 2008 Uri Wilensky.
; See Info tab for full copyright and license.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="360" wrappingAllowedX="true" y="7" frameRate="30.0" minPycor="-100" height="406" showTickCounter="true" patchSize="2.0" fontSize="10" wrappingAllowedY="true" width="406" tickCounterLabel="ticks" maxPycor="100" updateMode="1" maxPxcor="100" minPxcor="-100" />
    <slider x="10" step="1" y="10" max="100" width="250" display="landscape-smoothness" height="50" min="0" direction="Horizontal" default="20.0" variable="landscape-smoothness" />
    <slider x="10" step="1" y="65" max="100" width="250" display="population-size" height="50" min="1" direction="Horizontal" default="50.0" variable="population-size" />
    <slider x="10" step="0.01" y="120" max="1.0" width="250" display="particle-inertia" height="50" min="0" direction="Horizontal" default="0.98" variable="particle-inertia" />
    <slider x="10" step="1" y="175" max="20" width="250" display="particle-speed-limit" height="50" min="1" direction="Horizontal" default="10.0" variable="particle-speed-limit" />
    <slider x="10" step="0.1" y="230" max="2" width="250" display="attraction-to-personal-best" height="50" min="0" direction="Horizontal" default="2.0" variable="attraction-to-personal-best" />
    <slider x="10" step="0.1" y="285" max="2" width="250" display="attraction-to-global-best" height="50" min="0" direction="Horizontal" default="1.0" variable="attraction-to-global-best" />
    <monitor x="80" precision="4" y="345" height="60" fontSize="11" width="112" display="best-value-found">global-best-val</monitor>
    <note x="65" y="410" backgroundDark="0" fontSize="14" width="165" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Visualization Options</note>
    <chooser x="10" y="430" height="60" variable="highlight-mode" current="0" width="250" display="highlight-mode">
      <choice type="string" value="None" />
      <choice type="string" value="Best found" />
      <choice type="string" value="True best" />
    </chooser>
    <chooser x="265" y="430" height="60" variable="trails-mode" current="0" width="250" display="trails-mode">
      <choice type="string" value="None" />
      <choice type="string" value="Tails" />
      <choice type="string" value="Traces" />
    </chooser>
    <button x="270" y="155" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="80" display="step">go</button>
    <button x="270" y="115" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="80">setup</button>
    <button x="270" y="195" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="80">go</button>
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/particle-swarm-optimization/source.nlogox) and [NOTICE](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/particle-swarm-optimization/NOTICE.md). Runtime interpretation: [batch contract](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/selected-computing-contract.md). Execution evidence is separate.
