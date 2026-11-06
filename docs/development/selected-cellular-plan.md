# Selected cellular B19: scoped plan and source audit

Fixed scope: the nine models below; Life is excluded. Base: f32305e. No selection, root checkout, core, shared UI, research archive or global ledger changes.

## Sequence

1. Pin archived served sources, complete notices, widgets and procedures; freeze five complete asserted public scripts.
2. Delegate disjoint runtime/UI implementations to two native agents. Compose public World/Grid/Random/Agent/geometry APIs; request root contracts for genuine reusable gaps. No private generic simulation engines.
3. Integrate focused tests, execute frozen examples, typecheck, build and packed consumer.
4. Exercise each original and target in Chromium; pin the actually loaded source hash; commit paired setup/progress screenshots, controls, parameters, terminal checks, responsive/theme evidence and diagnostics.
5. Commit coherent steps and push the owned branch; link own draft PR and root PR #4 immediately after each push. Root owns integration and ledger.

## Acceptance and review

Implementation and author baseline evidence do not establish independent approval. Required Antigravity gemini-4-argon high review is quota-blocked (recorded failure 8194e842); pending, no retries or substitute approval. Browser milestones remain pending until executed for each model. Scientific evidence is reused from the existing computing archive, without new literature.

## Shared adaptations

Target Random is the public Mulberry stream. No NetLogo seed/trajectory identity is claimed. Deterministic rules retain their equations and update phases; stochastic comparisons concern mechanism/invariants unless a separate distribution study is executed. World owns ticks, Grid owns canonical field values, Agent owns mobile head position/orientation. Read operations are detached and RNG/time pure. Invalid inputs fail before mutation; preflight terminal conditions add no tick. Host setup/reset recreates an instance; run/pause belongs to existing playback.

Source archive candidates were compared with public core exports at this base. Existing Grid.neighbors, Grid.fieldAt, geometry.distance, Agent movement, Random, World/run are reused. Source-specific mathematical rules use ordinary composition, not a new engine. The exact source XML includes complete Info/notices; no external runtime, extension or transpiled NetLogo is copied into target behavior.

## SmoothLife

- Canonical path: `Sample Models/Computer Science/SmoothLife`.
- Exact archived served source: `experiments/smoothlife/source.nlogox`; SHA-256 `9ad3e7b9643589d8daa4391867cefd87e5688bd2c9142b514668bcf2fa663352`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/SmoothLife.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="190" wrappingAllowedX="true" y="62" frameRate="30.0" minPycor="0" height="516" showTickCounter="true" patchSize="4.0" fontSize="10" wrappingAllowedY="true" width="516" tickCounterLabel="ticks" maxPycor="127" updateMode="1" maxPxcor="127" minPxcor="0" />
    <slider x="5" step="0.5" y="10" max="50" width="180" display="outer-radius" height="50" min="0" direction="Horizontal" default="9.0" variable="outer-radius" />
    <button x="5" y="114" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="85">setup</button>
    <button x="100" y="114" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="85">go</button>
    <slider x="5" step="0.001" y="151" max="1" width="180" display="min-birth" height="50" min="0" direction="Horizontal" default="0.278" variable="min-birth" />
    <slider x="5" step="0.001" y="203" max="1" width="180" display="max-birth" height="50" min="0" direction="Horizontal" default="0.365" variable="max-birth" />
    <slider x="5" step="0.001" y="260" max="1" width="180" display="min-survive" height="50" min="0" direction="Horizontal" default="0.267" variable="min-survive" />
    <slider x="5" step="0.001" y="312" max="1" width="180" display="max-survive" height="50" min="0" direction="Horizontal" default="0.445" variable="max-survive" />
    <slider x="5" step="0.001" y="369" max="0.5" width="180" display="inner-step-width" height="50" min="0.001" direction="Horizontal" default="0.147" variable="inner-step-width" />
    <slider x="5" step="0.001" y="421" max="0.5" width="180" display="outer-step-width" height="50" min="0.001" direction="Horizontal" default="0.028" variable="outer-step-width" />
    <button x="645" y="10" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="65">paint</button>
    <button x="190" y="10" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="105">erase-all</button>
    <slider x="300" step="0.1" y="10" max="1" width="180" display="paint-value" height="50" min="0" direction="Horizontal" default="1.0" variable="paint-value" />
    <slider x="485" step="0.5" y="10" max="10" width="155" display="paint-radius" height="50" min="1" direction="Horizontal" default="3.0" variable="paint-radius" />
    <slider x="5" step="0.5" y="62" max="outer-radius" width="180" display="inner-radius" height="50" min="0" direction="Horizontal" default="3.0" variable="inner-radius" />
    <plot x="5" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="inner-state" y="515" xMin="0.0" height="182" legend="false" xMax="1.0" yMin="0.0" width="180" xAxis="outer-state" display="Transition Function">
      <setup />
      <update />
      <pen interval="1.0" mode="2" display="transition" color="-7500403" legend="true">
        <setup />
        <update />
      </pen>
    </plot>
    <button x="5" y="478" height="35" disableUntilTicks="false" forever="true" kind="Observer" width="180" display="visualize-transition">if (not netlogo-web?) [ every 0.5 [ visualize-transition ] ]</button>
  </widgets>
  
```

### Procedure audit

```netlogo
patches-own [
  inner-neighbors
  outer-neighbors
  inner-count
  outer-count
  inner-filling
  outer-filling
  state
]

to setup
  clear-all
  ; Plot the transition function for the current settings
  if (not netlogo-web?) [ visualize-transition ]
  ask patches [
    ; Store neighboring patches so that we don't have to calculate them each tick
    set inner-neighbors patches in-radius inner-radius
    set outer-neighbors patches in-radius outer-radius with [ distance myself > inner-radius ]
    ; Store counts so we don't have to recalculate them each tick
    set inner-count count inner-neighbors
    set outer-count count outer-neighbors
    set state random-float 0.75
    recolor
  ]
  reset-ticks
end

to go

  ; Patches add their state to their neighbors.
  ask patches with [ state > 1e-4 ] [
    let s state
    ask inner-neighbors [ set inner-filling inner-filling + s ]
    ask outer-neighbors [ set outer-filling outer-filling + s ]
  ]
  ; The obvious way of implementing the above code is:
  ; ask patches [
  ;   set inner-filling mean [ state ] of inner-neighbors
  ;   set outer-filling mean [ state ] of outer-neighbors
  ; ]
  ; However, since the majority of patches have states very close to 0 for most of
  ; the simulation the obvious implementation is unnecessarily slow. Instead, we
  ; only go over the patches with sufficiently large states (greater than 0.0001)
  ; and have them add their state to their neighbors. This makes the simulation much
  ; faster in general. Can you see why flipping the logic in this way works?

  ask patches [
    ; Since the patch behavior is made up entirely of updating their STATE variable
    ; based on the STATEs of those around them, we can encapsulate this behavior in
    ; reporter procedure. This makes the code much more flexible and easy to test.
    set state transition (outer-filling / outer-count) (inner-filling / inner-count)
    recolor
    set inner-filling 0
    set outer-filling 0
  ]
  tick
end


; Compute the next state of the patch based on state of the value of the "cell"
; centered at that patch and the surrounding neighborhood.
to-report transition [ outer inner ]
    report (sigmoid-outer outer
      (sigmoid-inner min-birth min-survive inner)
      (sigmoid-inner max-birth max-survive inner))
end


; Calculates a sigmoid (s-shaped) function with a few parameters:
; a is the location of the center of the curve
; step-width controls how gradual the curve is
to-report sigmoid [ x a step-width ]
  report 1 / (1 + exp (- (x - a) * 4 / step-width))
end


; Connects two sigmoids together, with one of the them reversed.
; In other words, this function starts at 0, curves up to 1 at B
; and then curve back down to 0 at A (assuming A < B).
to-report sigmoid-outer [ outer a b ]
  report (sigmoid outer a outer-step-width) * ( 1 - (sigmoid outer b outer-step-width))
end

; Sigmoid curve (with inner being the input) starting at STARTING-VALUE and going to
; ENDING-VALUE
to-report sigmoid-inner [ starting-value ending-value inner ]
  report starting-value * ( 1 - (sigmoid inner 0.5 inner-step-width))
       + ending-value   *       (sigmoid inner 0.5 inner-step-width)
end

; Plots the transition function used by patches
to visualize-transition
  set-current-plot-pen "transition"
  clear-plot
  ; Compute the resulting patch state for every combination of inner state and outer
  ; state. NetLogo plots don't have built-in support for displaying two dimensional
  ; images, so instead we plot an individual point for each such combination, and
  ; color the points based on the resulting patch state.
  foreach (range 0 1 0.01) [ outer-state ->
    foreach (range 0 1 0.01) [ inner-state ->
      set-plot-pen-color 10 * transition outer-state inner-state
      plotxy outer-state inner-state
    ]
  ]
end


to recolor
  set pcolor scale-color white state 0 1
end

to erase-all
  ask patches [
    set state 0
    recolor
  ]
end

to paint
  if mouse-inside? and mouse-down? [
    ask patch mouse-xcor mouse-ycor [
      ask patches in-radius paint-radius [
        set state paint-value
        recolor
      ]
    ]
    display
  ]
end


; Copyright 2017 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Hex Cell Aggregation

- Canonical path: `Sample Models/Computer Science/Hex Cell Aggregation`.
- Exact archived served source: `experiments/hex-cell-aggregation/source.nlogox`; SHA-256 `6cc59b8e960edbcbbf8a812c36e0200064a58e867f32cf78855b68ab588e7777`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Hex%20Cell%20Aggregation.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="289" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-50" height="408" showTickCounter="true" patchSize="4.0" fontSize="10" wrappingAllowedY="false" width="408" tickCounterLabel="ticks" maxPycor="50" updateMode="1" maxPxcor="50" minPxcor="-50" />
    <button x="8" y="37" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="164">setup</button>
    <button x="179" y="73" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="100">go</button>
    <button x="179" y="37" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="100">go</button>
    <switch x="9" y="74" height="40" on="true" variable="one-neighbor?" width="163" display="one-neighbor?" />
    <switch x="9" y="115" height="40" on="true" variable="two-neighbors?" width="163" display="two-neighbors?" />
    <switch x="9" y="156" height="40" on="true" variable="three-neighbors?" width="163" display="three-neighbors?" />
    <switch x="9" y="197" height="40" on="true" variable="four-neighbors?" width="163" display="four-neighbors?" />
    <switch x="9" y="238" height="40" on="true" variable="five-neighbors?" width="163" display="five-neighbors?" />
    <switch x="10" y="279" height="40" on="true" variable="six-neighbors?" width="162" display="six-neighbors?" />
    <button x="10" y="322" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="162">read-switches</button>
    <note x="181" y="133" backgroundDark="0" fontSize="10" width="99" markdown="false" height="67" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">The switches are
only considered
during SETUP and
READ-SWITCHES.</note>
  </widgets>
  
```

### Procedure audit

```netlogo
globals [
  ;; This list contains the numbers of the switches that are on,
  ;; for example, if all six switches are on, the list will be
  ;; [1 2 3 4 5 6].  The list is only built during SETUP and
  ;; READ-SWITCHES.
  switches
  ;; This is a list of cells which are eligible to become alive.
  eligibles
]

;; About the use of lists in this model:
;;
;; The model could be coded more simply without the "switches" and
;; "eligibles" lists.  But using those lists enables the model to run
;; much faster.
;;
;; The "switches" list is used so a cell can quickly check its live
;; neighbors count against the six switches without having to actually
;; inspect the switches one by one.  If the user flips a switch,
;; the list will be out of date, which is why we ask the user to
;; press the SETUP or READ-SWITCHES buttons after changing switches.
;;
;; The "eligibles" list is used so that when we are trying to decide
;; what cell will become alive next, we don't have to check every
;; cell.  The list contains only those cells we know are eligible.
;; Every time a cell becomes alive, we remove it from the list.
;; We must also check that cell's neighbors to see if they need
;; to be added or removed from the list.

breed [cells cell]

cells-own [
  hex-neighbors
  live-neighbor-count
  eligible?
]

to setup
  clear-all
  setup-grid
  read-switches
  ;; start with one live cell in the middle
  ask cells-on patch 0 0 [ become-alive ]
  reset-ticks
end

to go
  if empty? eligibles [ stop ]
  ask one-of eligibles [ become-alive ]
  tick
end

to become-alive  ;; cell procedure
  show-turtle
  set eligible? false
  set eligibles remove self eligibles
  ask hex-neighbors [
    set live-neighbor-count live-neighbor-count + 1
    if live-neighbor-count = 6 [ set color red ]
    update-eligibility
  ]
end

to update-eligibility  ;; cell procedure
  ifelse eligible?
  ;; case 1: currently eligible
  [
    if not member? live-neighbor-count switches [
      set eligible? false
      set eligibles remove self eligibles
    ]
  ]
  ;; case 2: not currently eligible
  [
    ;; the check for hidden? ensures the cell isn't already alive
    if hidden? and member? live-neighbor-count switches [
      set eligible? true
      ;; The order of the list doesn't matter, but in NetLogo
      ;; (as in Logo and Lisp generally), FPUT is much much
      ;; faster than LPUT.
      set eligibles fput self eligibles
    ]
  ]
end

;;; only allow the new alive cells to have number of neighbors as allowed by the switches
to read-switches
  set switches []
  if one-neighbor?    [ set switches lput 1 switches ]
  if two-neighbors?   [ set switches lput 2 switches ]
  if three-neighbors? [ set switches lput 3 switches ]
  if four-neighbors?  [ set switches lput 4 switches ]
  if five-neighbors?  [ set switches lput 5 switches ]
  if six-neighbors?   [ set switches lput 6 switches ]
  ask cells [
    set eligible? hidden? and member? live-neighbor-count switches
  ]
  set eligibles [self] of cells with [eligible?]
end

;;; this was mostly taken from Hex Cells Example
to setup-grid
  set-default-shape turtles "hex"
  ask patches [
    sprout-cells 1 [
      hide-turtle
      set color orange
      set eligible? false
      if pxcor mod 2 = 0 [
        set ycor ycor - 0.5
      ]
    ]
  ]
  ask cells [
    ifelse pxcor mod 2 = 0 [
      set hex-neighbors cells-on patches at-points [[0  1] [ 1  0] [ 1 -1]
                                                    [0 -1] [-1 -1] [-1  0]]
    ][
      set hex-neighbors cells-on patches at-points [[0  1] [ 1  1] [ 1  0]
                                                    [0 -1] [-1  0] [-1  1]]
    ]
  ]
end


; Copyright 2007 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Vants

- Canonical path: `Sample Models/Computer Science/Vants`.
- Exact archived served source: `experiments/vants/source.nlogox`; SHA-256 `66ee2a39c0879a05bd850ed5424d7650be59d23741be8126f8b2e7888c0977d7`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Vants.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="220" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-120" height="486" showTickCounter="true" patchSize="2.0" fontSize="10" wrappingAllowedY="true" width="486" tickCounterLabel="ticks" maxPycor="120" updateMode="1" maxPxcor="120" minPxcor="-120" />
    <button x="47" y="90" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="123">setup</button>
    <button x="67" y="185" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="84" display="forward">go-forward</button>
    <slider x="18" step="1" y="38" max="16" width="189" display="num-vants" height="50" min="1" direction="Horizontal" default="1.0" variable="num-vants" />
    <button x="67" y="221" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="84" display="reverse">go-reverse</button>
  </widgets>
  
```

### Procedure audit

```netlogo
to setup
  clear-all
  ask patches
    [ set pcolor white ]
  create-turtles num-vants
    [ face one-of neighbors4
      set color red
      set size 6 ]    ;; much easier to see this way
  reset-ticks
end

;; We can't use "ask turtles", because then the vants would
;; execute in a different random order each time.  So instead
;; we use SORT to get the turtles in order by who number.

to go-forward
  foreach sort turtles [ t ->
    ask t [
      fd 1
      turn
    ]
  ]
  tick
end

to go-reverse
  foreach reverse sort turtles [ t ->
    ask t [
      turn
      bk 1
    ]
  ]
  tick
end

to turn
  ifelse pcolor = white
    [ set pcolor black
      rt 90 ]
    [ set pcolor white
      lt 90 ]
end


; Copyright 2005 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Turing Machine 2D

- Canonical path: `Sample Models/Computer Science/Turing Machine 2D`.
- Exact archived served source: `experiments/turing-machine-2d/source.nlogox`; SHA-256 `a267a617dd79a3d90b3ee88ea573ade860949c740fbd7b7543f211b551f169be`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Turing%20Machine%202D.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="770" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-75" height="306" showTickCounter="true" patchSize="2.0" fontSize="10" wrappingAllowedY="true" width="306" tickCounterLabel="ticks" maxPycor="75" updateMode="1" maxPxcor="75" minPxcor="-75" />
    <slider x="10" step="1" y="110" max="5" width="250" display="example" height="50" min="1" direction="Horizontal" default="1.0" variable="example" />
    <switch x="265" y="65" height="40" on="true" variable="color-paths?" width="152" display="color-paths?" />
    <slider x="265" step="1" y="10" max="256" width="250" display="heads" height="50" min="1" direction="Horizontal" default="32.0" variable="heads" />
    <button x="135" y="10" height="50" disableUntilTicks="true" forever="true" kind="Observer" width="125">go</button>
    <button x="10" y="10" height="50" disableUntilTicks="false" forever="false" kind="Observer" width="120">setup</button>
    <button x="10" y="65" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="120" display="setup example">setup-example</button>
    <button x="135" y="65" height="40" disableUntilTicks="true" forever="false" kind="Observer" width="125" display="step">go</button>
    <chooser x="135" y="195" height="60" variable="off-0-turn" current="2" width="250" display="off-0-turn">
      <choice type="string" value="--" />
      <choice type="string" value="Right" />
      <choice type="string" value="Backwards" />
      <choice type="string" value="Left" />
    </chooser>
    <chooser x="135" y="260" height="60" variable="off-1-turn" current="1" width="250" display="off-1-turn">
      <choice type="string" value="--" />
      <choice type="string" value="Right" />
      <choice type="string" value="Backwards" />
      <choice type="string" value="Left" />
    </chooser>
    <slider x="390" step="1" y="260" max="1" width="250" display="off-1-state" height="60" min="0" direction="Horizontal" default="0.0" variable="off-1-state" />
    <chooser x="135" y="325" height="60" variable="on-0-turn" current="0" width="250" display="on-0-turn">
      <choice type="string" value="--" />
      <choice type="string" value="Right" />
      <choice type="string" value="Backwards" />
      <choice type="string" value="Left" />
    </chooser>
    <slider x="390" step="1" y="325" max="1" width="250" display="on-0-state" height="60" min="0" direction="Horizontal" default="0.0" variable="on-0-state" />
    <chooser x="135" y="390" height="60" variable="on-1-turn" current="3" width="250" display="on-1-turn">
      <choice type="string" value="--" />
      <choice type="string" value="Right" />
      <choice type="string" value="Backwards" />
      <choice type="string" value="Left" />
    </chooser>
    <slider x="390" step="1" y="390" max="1" width="250" display="on-1-state" height="60" min="0" direction="Horizontal" default="1.0" variable="on-1-state" />
    <switch x="645" y="195" height="60" on="true" variable="off-0-on?" width="111" display="off-0-on?" />
    <switch x="645" y="260" height="60" on="true" variable="off-1-on?" width="109" display="off-1-on?" />
    <switch x="645" y="325" height="60" on="true" variable="on-0-on?" width="108" display="on-0-on?" />
    <switch x="645" y="390" height="60" on="true" variable="on-1-on?" width="110" display="on-1-on?" />
    <slider x="390" step="1" y="195" max="1" width="250" display="off-0-state" height="60" min="0" direction="Horizontal" default="1.0" variable="off-0-state" />
    <note x="10" y="195" backgroundDark="0" fontSize="11" width="119" markdown="false" height="45" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">If cell is off and
head is in state 0:</note>
    <note x="10" y="260" backgroundDark="0" fontSize="11" width="118" markdown="false" height="45" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">If cell is off and
head is in state 1:</note>
    <note x="10" y="325" backgroundDark="0" fontSize="11" width="119" markdown="false" height="45" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">If cell is on and
head is in state 0:</note>
    <note x="10" y="390" backgroundDark="0" fontSize="11" width="115" markdown="false" height="45" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">If cell is on and
head is in state 1:</note>
    <note x="135" y="170" backgroundDark="0" fontSize="11" width="100" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Turn</note>
    <note x="390" y="170" backgroundDark="0" fontSize="11" width="100" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">New Head State</note>
    <note x="645" y="170" backgroundDark="0" fontSize="11" width="90" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">New Cell State</note>
  </widgets>
  
```

### Procedure audit

```netlogo
turtles-own [rule-set bg fg state]
patches-own [on?]

to setup
  clear-all
  create-turtles heads [
    set size 5
    set state 0    ;; initialize all head states to 0
    set heading 0
    fd who    ;; have all the turtles line up vertically
    set bg black
    ifelse color-paths?  ;; if show-path? is enabled, color the turtles
      [ set fg color ]
      [ set fg white ]
  ]
  ask patches [ set on? false ] ;; clear cell values
  reset-ticks
end

to setup-example
  if example = 1
    [ apply-rules [[1 180 true] [1 90 true] [0 180 true] [1 270 true]] ]
  if example = 2
    [ apply-rules [[0 270 true] [1 180 false] [1 90 true] [0 0 true]] ]
  if example = 3
    [ apply-rules [[1 90 false] [0 90 true] [0 0 false] [0 180 false]] ]
  if example = 4
    [ apply-rules [[0 90 true] [0 0 false] [0 270 false] [0 0 false]] ]
  if example = 5
    [ apply-rules [[1 180 true] [1 270 true] [0 270 true] [1 90 false]] ]
  setup
end

to go
  ask turtles [ set rule-set find-rule ]
  ask turtles [
    set on? last rule-set
    ifelse on?
      [ set pcolor fg ]
      [ set pcolor bg ]
  ]
  ask turtles [
    rt item 1 rule-set
    fd 1
    set state first rule-set
  ]
  tick
end

;; find the rule to use for current head state and cell state
to-report find-rule  ;; turtle procedure
  ifelse on?  ;; check state of this patch
  [
    if state = 0 [ report fput on-0-state list (direction-to-number on-0-turn) on-0-on? ]
    if state = 1 [ report fput on-1-state list (direction-to-number on-1-turn) on-1-on? ]
  ]
  [
    if state = 0 [ report fput off-0-state list (direction-to-number off-0-turn) off-0-on? ]
    if state = 1 [ report fput off-1-state list (direction-to-number off-1-turn) off-1-on? ]
  ]
end

;; change the current configuration to the given list of rules
to apply-rules [l]
  set off-0-state  item 0 item 0 l
  set off-0-turn   number-to-direction (item 1 item 0 l)
  set off-0-on?    item 2 item 0 l
  set off-1-state  item 0 item 1 l
  set off-1-turn   number-to-direction (item 1 item 1 l)
  set off-1-on?    item 2 item 1 l
  set on-0-state   item 0 item 2 l
  set on-0-turn    number-to-direction (item 1 item 2 l)
  set on-0-on?     item 2 item 2 l
  set on-1-state   item 0 item 3 l
  set on-1-turn    number-to-direction (item 1 item 3 l)
  set on-1-on?     item 2 item 3 l
end

to-report direction-to-number [direction]
  if direction = "--"
    [ report 0 ]
  if direction = "Right"
    [ report 90 ]
  if direction = "Backwards"
    [ report 180 ]
  if direction = "Left"
    [ report 270 ]
end

to-report number-to-direction [number]
  if number = 0
    [ report "--" ]
  if number = 90
    [ report "Right" ]
  if number = 180
    [ report "Backwards" ]
  if number = 270
    [ report "Left" ]
end


; Copyright 2002 Uri Wilensky.
; See Info tab for full copyright and license.
```

## CA 1D Elementary

- Canonical path: `Sample Models/Computer Science/Cellular Automata/CA 1D Elementary`.
- Exact archived served source: `experiments/ca-1d-elementary/source.nlogox`; SHA-256 `36c2d8020692b8d438e921255635437939eb6625b4ffd50184cce8ed34e32c27`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/CA%201D%20Elementary.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="384" wrappingAllowedX="true" y="26" frameRate="30.0" minPycor="-64" height="391" showTickCounter="true" patchSize="3.0" fontSize="10" wrappingAllowedY="false" width="775" tickCounterLabel="ticks" maxPycor="64" updateMode="1" maxPxcor="128" minPxcor="-128" />
    <button x="7" y="10" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="118" display="setup single">single-cell</button>
    <button x="7" y="47" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="118" display="setup random">setup-random</button>
    <switch x="10" y="350" height="40" on="false" variable="OOI" width="100" display="OOI" />
    <switch x="10" y="313" height="40" on="true" variable="OII" width="100" display="OII" />
    <switch x="10" y="276" height="40" on="true" variable="IOI" width="100" display="IOI" />
    <switch x="10" y="239" height="40" on="false" variable="III" width="100" display="III" />
    <note x="11" y="164" backgroundDark="0" fontSize="11" width="90" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Rule Switches:</note>
    <note x="13" y="443" backgroundDark="0" fontSize="11" width="90" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Colors:</note>
    <button x="8" y="96" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="71">go</button>
    <button x="12" y="396" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="99" display="show rules">show-rules</button>
    <switch x="82" y="96" height="40" on="false" variable="auto-continue?" width="140" display="auto-continue?" />
    <input x="14" multiline="false" y="462" height="60" variable="foreground" type="color" width="250">55.0</input>
    <input x="269" multiline="false" y="462" height="60" variable="background" type="color" width="250">0.0</input>
    <switch x="114" y="239" height="40" on="true" variable="IIO" width="98" display="IIO" />
    <switch x="114" y="276" height="40" on="false" variable="IOO" width="98" display="IOO" />
    <switch x="114" y="313" height="40" on="false" variable="OIO" width="98" display="OIO" />
    <switch x="114" y="350" height="40" on="true" variable="OOO" width="98" display="OOO" />
    <slider x="9" step="1.0" y="185" max="255.0" width="202" display="rule" height="50" min="0.0" direction="Horizontal" default="78.0" variable="rule" />
    <slider x="143" step="1.0" y="32" max="100.0" width="225" display="density" height="50" min="0.0" direction="Horizontal" default="10.0" variable="density" units="%" />
  </widgets>
  
```

### Procedure audit

```netlogo
globals
[
  row           ;; current row
  old-rule      ;; previous rule
  rules-shown?  ;; flag to check if rules have been displayed
  gone?         ;; flag to check if go has already been pressed
]

patches-own
[on?]

to startup  ;; initially, nothing has been displayed
  set rules-shown? false
  set gone? false
  set old-rule rule
end

;;;;;;;;;;;;;;;;;;;;;;;;
;;; Setup Procedures ;;;
;;;;;;;;;;;;;;;;;;;;;;;;

to setup-general  ;; setup general working environment
  clear-patches
  clear-turtles
  set row max-pycor   ;; reset current row
  refresh-rules
  set gone? false
  set rules-shown? false  ;; rules are no longer shown since the view has been cleared
end

to single-cell
  setup-general
  reset-ticks
  ask patches with [pycor = row] [set on? false set pcolor background]  ;; initialize top row
  ask patch 0 row [ set pcolor foreground ]  ;; setup single cell in top center
  ask patch 0 row [ set on? true ]
end

to setup-random
  setup-general
  reset-ticks
  ask patches with [pycor = row]  ;; randomly place cells across the top of the world
  [
    set on? ((random-float 100) < density)
    color-patch
  ]
end


to setup-continue
  let on?-list []
  if not gone?  ;; make sure go has already been called
    [ stop ]
  ;; copy cell states from the current row to a list
  set on?-list map [ p -> [ on? ] of p ] sort patches with [ pycor = row ]
  setup-general
  ask patches with [ pycor = row ]
  [
    set on? item (pxcor + max-pxcor) on?-list  ;; copy states from list to top row
    color-patch
  ]
end


;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; GO Procedures      ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;

to go
  if (rules-shown?)  ;; don't do unless we are properly set up
    [ stop ]
  if (row = min-pycor)  ;; if we reach the end, continue from the top or stop
  [
    ifelse auto-continue?
    [
        set gone? true
        display    ;; ensure everything gets drawn before we clear it
        setup-continue
    ]
    [
      ifelse gone?
        [ setup-continue ]       ;; a run has already been completed, so continue with another
        [ set gone? true stop ]  ;; otherwise just stop
    ]
  ]
  ask patches with [ pycor = row ]  ;; apply rule
    [ do-rule ]
  set row (row - 1)
  ask patches with [ pycor = row ]  ;; color in changed cells
    [ color-patch ]
  tick
end


to do-rule  ;; patch procedure
  let left-on? [on?] of patch-at -1 0  ;; set to true if the patch to the left is on
  let right-on? [on?] of patch-at 1 0  ;; set to true if the patch to the right is on

  ;; each of these lines checks the local area and (possibly)
  ;; sets the lower cell according to the corresponding switch
  let new-value
    (iii and left-on?       and on?       and right-on?)          or
    (iio and left-on?       and on?       and (not right-on?))    or
    (ioi and left-on?       and (not on?) and right-on?)          or
    (ioo and left-on?       and (not on?) and (not right-on?))    or
    (oii and (not left-on?) and on?       and right-on?)          or
    (oio and (not left-on?) and on?       and (not right-on?))    or
    (ooi and (not left-on?) and (not on?) and right-on?)          or
    (ooo and (not left-on?) and (not on?) and (not right-on?))
  ask patch-at 0 -1 [ set on? new-value ]
end


;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Utility Procedures ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;

to color-patch  ;;patch procedure
  ifelse on?
    [ set pcolor foreground ]
    [ set pcolor background ]
end


to-report bindigit [number power-of-two]
  ifelse (power-of-two = 0)
    [ report floor number mod 2 ]
    [ report bindigit (floor number / 2) (power-of-two - 1) ]
end

to refresh-rules  ;; update either switches or slider depending on which has been changed last
  ifelse (rule = old-rule)
  [
    if (rule != calculate-rule)
      [ set rule calculate-rule ]
  ]
  [ extrapolate-switches ]
  set old-rule rule
end

to extrapolate-switches
  ;; set the switches based on the slider
  set ooo ((bindigit rule 0) = 1)
  set ooi ((bindigit rule 1) = 1)
  set oio ((bindigit rule 2) = 1)
  set oii ((bindigit rule 3) = 1)
  set ioo ((bindigit rule 4) = 1)
  set ioi ((bindigit rule 5) = 1)
  set iio ((bindigit rule 6) = 1)
  set iii ((bindigit rule 7) = 1)
end

to-report calculate-rule
  ;; set the slider based on the switches
  let result 0
  if ooo [ set result result +   1 ]
  if ooi [ set result result +   2 ]
  if oio [ set result result +   4 ]
  if oii [ set result result +   8 ]
  if ioo [ set result result +  16 ]
  if ioi [ set result result +  32 ]
  if iio [ set result result +  64 ]
  if iii [ set result result + 128 ]
  report result
end


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; SHOW-RULES RELATED PROCEDURES ;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

to show-rules  ;; preview cell state transitions
  setup-general
  ask patches with [pycor > max-pycor - 12]
    [ set pcolor gray - 1 ]
  let i 0
  foreach list-rules [ the-rule ->
    let px (min-pxcor + i * floor (world-width / 8) + floor (world-width / 16)) - 4
    ask patch px (max-pycor - 4)
    [
      sprout 1
      [
        set xcor xcor - 3
        print-block item 0 the-rule  ;; left cell
        set xcor xcor + 3
        print-block item 1 the-rule  ;; center cell
        set xcor xcor + 3
        print-block item 2 the-rule  ;; right cell
        setxy (xcor - 3) (ycor - 3)
        print-block item 3 the-rule  ;; next cell state
        die
      ]
    ]
    set i (i + 1)
  ]
  set rules-shown? true
end

;; turtle procedure
to print-block [print-on?]  ;; draw a 3x3 block with the color determined by the state
  ask patches in-radius 1.5  ;; like "neighbors", but includes the patch we're on too
  [
    set on? print-on?
    color-patch
  ]
end

to-report list-rules  ;; return a list of state-transition 4-tuples corresponding to the switches
  report (list lput ooo [false false false]
               lput ooi [false false true ]
               lput oio [false true  false]
               lput oii [false true  true ]
               lput ioo [true  false false]
               lput ioi [true  false true ]
               lput iio [true  true  false]
               lput iii [true  true  true ])
end


; Copyright 1998 Uri Wilensky.
; See Info tab for full copyright and license.
```

## CA Continuous

- Canonical path: `Sample Models/Computer Science/Cellular Automata/CA Continuous`.
- Exact archived served source: `experiments/ca-continuous/source.nlogox`; SHA-256 `0f7c8d2a60f43bd33c127a3bc4ad99d1d92ab7fb2d252ba14c992ca1ee30595c`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/CA%20Continuous.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="257" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-100" height="406" showTickCounter="true" patchSize="2.0" fontSize="10" wrappingAllowedY="false" width="406" tickCounterLabel="ticks" maxPycor="100" updateMode="1" maxPxcor="100" minPxcor="-100" />
    <button x="123" y="42" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="120" display="Setup Random">setup-random</button>
    <button x="20" y="143" height="37" disableUntilTicks="true" forever="true" kind="Observer" width="74" display="Go">go</button>
    <switch x="99" y="143" height="40" on="false" variable="auto-continue?" width="144" display="auto-continue?" />
    <button x="18" y="42" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="103" display="Setup Single">setup-single</button>
    <slider x="20" step="1" y="249" max="16" width="223" display="precision-level" height="50" min="1" direction="Horizontal" default="16.0" variable="precision-level" units="decimal places" />
    <slider x="21" step="0.0010" y="194" max="1" width="222" display="add-constant" height="50" min="0" direction="Horizontal" default="0.47" variable="add-constant" />
    <slider x="18" step="0.01" y="80" max="1" width="225" display="max-value" height="50" min="0" direction="Horizontal" default="0.5" variable="max-value" />
  </widgets>
  
```

### Procedure audit

```netlogo
globals
[
  row             ;; current row we are now calculating
  done?           ;; flag used to allow you to press the go button multiple times
]

patches-own
[
  value           ;; some real number between 0 and 1
]

;; Setup general working environment.  The other setup procedures call this.
to setup-general
  set row max-pycor   ;; Set the current row to be the top
  set done? false
  clear-patches
  clear-turtles
end

;; Setup for a single point
to setup-single
  setup-general
  reset-ticks
  ;; Set only the middle patch to be 1 on the top row
  ask patches with [pycor = row]
  [
    ifelse pxcor = 0
      [ set value 1 ]
      [ set value 0 ]
    color-patch
  ]
end

;; Setup for a random top row
to setup-random
  setup-general
  reset-ticks
  ;; Randomize the values of the top row
  ask patches with [pycor = row]
  [
    set value random-float max-value
    color-patch
  ]
end

;; This is called when auto-continue? is enabled or go is clicked after a run.
;; Setup the patches to continue a particular model run.  This will copy the i
;; bottom row of patches to the top row.
to setup-continue
  let value-list []
  if not done?  ;; make sure go has already been called
    [ stop ]

  set value-list map [ p -> [value] of p ] sort patches with [pycor = row]  ;; copy cell states from bottom row to a list
  setup-general
  ask patches with [pycor = row]  ;; copy states from list to top row
  [
    set value item (pxcor + max-pxcor) value-list
    color-patch
  ]
  set done? false
end

;; Run the model.
to go
  ;; Did we reach the bottom row?
  if row = min-pycor
  [
    ;; If auto-continue? is enabled or we are clicking go again,
    ;; we continue from the top, otherwise we stop
    ifelse auto-continue? or done?
    [
       set done? true
       display    ;; ensure all the patches get drawn before we clear
       setup-continue
    ]
    [
       set done? true
       stop
    ]
  ]

  ;; Go down a row
  set row (row - 1)

  ;; Calculate the values for the current row
  ask patches with [pycor = row]
  [
    calculate-value
    color-patch
  ]
  tick
end

to calculate-value  ;; patch procedure
  ;; Retrieve the three patches that touch this patch one row above it
  let top-neighbors neighbors with [pycor = [pycor] of myself + 1]

  ;; Calculate the average of their values
  let mean-value mean [value] of top-neighbors

  ;; Perform a function to the average and set it as our value
  set value iterated-map mean-value
end

;; This is a simple function that takes in a number, adds a constant to it and
;; only reports the decimal portion rounded to a given number of decimal places.
to-report iterated-map [x]
  report precision (fractional-part (add-constant + x))
                   precision-level
end

;; Scales the patch's color according to its value
to color-patch  ;; patch procedure
  set pcolor scale-color green value 0 2
end

;; Reports only the decimal part of the number
to-report fractional-part [x]
  report x - (int x)
end


; Copyright 2003 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Brian's Brain

- Canonical path: `Sample Models/Computer Science/Cellular Automata/Brian's Brain`.
- Exact archived served source: `experiments/brians-brain/source.nlogox`; SHA-256 `f516529c1fdf0190dd9b73ea1b22d529301dd9f71e9a766317f017536a3627f6`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/Brian's%20Brain.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="290" wrappingAllowedX="true" y="10" frameRate="15.0" minPycor="-57" height="464" showTickCounter="true" patchSize="4.0" fontSize="10" wrappingAllowedY="true" width="352" tickCounterLabel="ticks" maxPycor="57" updateMode="1" maxPxcor="43" minPxcor="-43" />
    <slider x="126" step="0.01" y="77" max="1.0" width="156" display="initial-density" height="50" min="0.0" direction="Horizontal" default="0.3" variable="initial-density" />
    <button x="17" y="80" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="102">setup-random</button>
    <button x="50" y="279" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="78" display="go-once">go</button>
    <button x="139" y="279" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="91" display="go-forever">go</button>
    <button x="17" y="42" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="102">setup-blank</button>
    <note x="151" y="157" backgroundDark="0" fontSize="11" width="135" markdown="false" height="99" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">When one of these
buttons is down, you
can add or remove
cells by holding down
the mouse button
and "drawing".</note>
    <button x="12" y="161" height="35" disableUntilTicks="false" forever="true" kind="Observer" width="128" display="draw white cells">draw-cells white</button>
    <button x="12" y="198" height="35" disableUntilTicks="false" forever="true" kind="Observer" width="128" display="draw red cells">draw-cells red</button>
  </widgets>
  
```

### Procedure audit

```netlogo
globals [
  erasing?          ;; is the current draw-cells mouse click erasing or adding?
]

patches-own [
  firing?           ;; white cells
  refractory?       ;; red cells
  firing-neighbors  ;; counts how many neighboring cells are firing
]

to setup-blank
  clear-all
  ask patches
    [ cell-death ]
  reset-ticks
end

to setup-random
  clear-all
  ask patches
    [ ifelse random-float 1.0 < initial-density
      [ cell-birth ]
      [ cell-death ] ]
  reset-ticks
end

to cell-birth  ;; patch procedure
  set firing? true
  set refractory? false
  set pcolor white
end

to cell-aging  ;; patch procedure
  set firing? false
  set refractory? true
  set pcolor red
end

to cell-death  ;; patch procedure
  set firing? false
  set refractory? false
  set pcolor black
end

to go
  ask patches
    [ set firing-neighbors count neighbors with [firing?] ]
  ;; Starting a new "ask patches" here ensures that all the patches
  ;; finish executing the first ask before any of them start executing
  ;; the second ask.  This keeps all the patches in sync with each other,
  ;; so the births and deaths at each generation all happen in lockstep.
  ask patches
    [ ifelse firing?
      [ cell-aging ]
      [ ifelse refractory?
        [ cell-death ]
        [ if firing-neighbors = 2
          [ cell-birth ] ] ] ]
  tick
end

to draw-cells [target-color]
  ifelse mouse-down? [
    if erasing? = 0 [
      set erasing? target-color = [pcolor] of patch mouse-xcor mouse-ycor
    ]
    ask patch mouse-xcor mouse-ycor [
      ifelse erasing? [
        cell-death
      ] [
        ifelse target-color = white [
          cell-birth
        ] [
          cell-aging
        ]
      ]
    ]
    display
  ] [
    set erasing? 0
  ]
end


; Copyright 2002 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Cyclic CA

- Canonical path: `Sample Models/Computer Science/Cellular Automata/Cyclic CA`.
- Exact archived served source: `experiments/cyclic-ca/source.nlogox`; SHA-256 `e8669163bfd4c70e39f2dfe3d4f2a775e6770a931d2fcf6fc73fcb4a82820c50`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/Cyclic%20CA.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="285" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-100" height="406" showTickCounter="true" patchSize="2.0" fontSize="10" wrappingAllowedY="true" width="406" tickCounterLabel="ticks" maxPycor="100" updateMode="1" maxPxcor="100" minPxcor="-100" />
    <note x="15" y="5" backgroundDark="0" fontSize="9" width="250" markdown="false" height="35" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Choose preset parameter configurations.
Select "none" to vary parameter sliders.</note>
    <chooser x="15" y="40" height="60" variable="preset-parameters" current="0" width="250" display="preset-parameters">
      <choice type="string" value="none" />
      <choice type="string" value="133" />
      <choice type="string" value="3-color bootstrap" />
      <choice type="string" value="amoeba" />
      <choice type="string" value="black and white" />
      <choice type="string" value="cubism" />
      <choice type="string" value="cyclic spirals" />
      <choice type="string" value="diamond spirals" />
      <choice type="string" value="fossil debris" />
      <choice type="string" value="macaroni" />
      <choice type="string" value="multistrands" />
      <choice type="string" value="percolation mix" />
      <choice type="string" value="weak spirals" />
      <choice type="string" value="Greenberg–Hastings" />
      <choice type="string" value="imperfect" />
      <choice type="string" value="lava lamp" />
      <choice type="string" value="maps" />
      <choice type="string" value="perfect" />
      <choice type="string" value="squarish spirals" />
      <choice type="string" value="stripes" />
      <choice type="string" value="turbulent phase" />
    </chooser>
    <chooser x="15" y="105" height="60" variable="neighborhood" current="1" width="250" display="neighborhood">
      <choice type="string" value="von Neumann" />
      <choice type="string" value="Moore" />
    </chooser>
    <slider x="15" step="1" y="170" max="6" width="250" display="radius" height="50" min="1" direction="Horizontal" default="3.0" variable="radius" />
    <slider x="15" step="1" y="225" max="14" width="250" display="num-states" height="50" min="2" direction="Horizontal" default="3.0" variable="num-states" />
    <slider x="15" step="1" y="280" max="num-neighbors-with-these-settings" width="250" display="threshold" height="50" min="1" direction="Horizontal" default="3.0" variable="threshold" />
    <button x="140" y="335" height="40" disableUntilTicks="true" forever="true" kind="Observer" width="80">go</button>
    <button x="45" y="335" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="80">setup</button>
  </widgets>
  
```

### Procedure audit

```netlogo
globals [
  color-list       ;; list of colors for all the states in the run
  neighbor-offsets ;; list of (x, y) pair offsets that define the neighborhood of each patch
]

patches-own[
  init-pos         ;; initial state/color of the patch
  my-neighborhood  ;; a list that contains the neighbors of specified type and radius of each patch
]

;; setup
to setup
  clear-all

  ;; change slider values if a preset is chosen
  setup-preset
  ;; determine the list of available colors/states
  set color-list n-of num-states base-colors
  ;; compute the relative coordinates of the neighbors
  ifelse neighborhood = "von Neumann"
    [ set neighbor-offsets von-neumann-offsets radius ]
    [ set neighbor-offsets moore-offsets radius ]
  ;; check that the threshold value is not greater than the number of neighbors.
  if threshold > length neighbor-offsets [
    user-message (word "Threshold can't be greater than the number of neighbors.")
  ]

  ask patches [
    ;; initialize each patch to a random color/state
    set pcolor one-of color-list
    ;; record the neighbor patches of each patch on setup to make the runtime more efficient
    set my-neighborhood patches at-points neighbor-offsets
  ]
  reset-ticks
end



;; go
to go
  ;; save the current state of each patch. All patches need to do this before they start changing states.
  ask patches [
    set init-pos (position pcolor color-list)
  ]

  ;; update the state of each patch to the next state in the cycle if the update condition holds
  ask patches [
    let my-next-pos (init-pos + 1) mod num-states

    ;; if the number of neighbors that has the next state in the cycle is greater than or equal to the threshold,
    if count (my-neighborhood with [init-pos = my-next-pos]) >= threshold [
      set pcolor (item my-next-pos color-list)  ; update my color to the next color in the cycle
    ]
  ]
  tick
end


;; reporters that compute the patch neighbors for each patch

to-report moore-offsets [n]
  let result [list pxcor pycor] of patches with [abs pxcor <= n and abs pycor <= n]
  report remove [0 0] result
end


to-report von-neumann-offsets [n]
  let result [list pxcor pycor] of patches with [abs pxcor + abs pycor <= n]
  report remove [0 0] result
end

to-report num-neighbors-with-these-settings
  ;; used to set the maximum of the THRESHOLD slider
  report ifelse-value neighborhood = "von Neumann"
    [length von-neumann-offsets radius]
    [length moore-offsets radius]
end

;; preset parameter values that yield interesting patterns

to setup-preset
  (ifelse
    preset-parameters = "133" [
      set radius 1
      set threshold 3
      set num-states 3
      set neighborhood "Moore"
    ]
    preset-parameters = "3-color bootstrap" [
      set radius 2
      set threshold 11
      set num-states 3
      set neighborhood "Moore"
    ]
    preset-parameters = "amoeba" [
      set radius 3
      set threshold 10
      set num-states 2
      set neighborhood "von Neumann"
    ]
    preset-parameters = "black and white" [
      set radius 3
      set threshold 23
      set num-states 2
      set neighborhood "von Neumann"
    ]
    preset-parameters = "diamond spirals" [
      set radius 1
      set threshold 1
      set num-states 14
      set neighborhood "von Neumann"
    ]
    preset-parameters = "cubism" [
      set radius 2
      set threshold 5
      set num-states 3
      set neighborhood "von Neumann"
    ]
    preset-parameters = "cyclic spirals" [
      set radius 3
      set threshold 5
      set num-states 8
      set neighborhood "Moore"
    ]
    preset-parameters = "fossil debris" [
      set radius 2
      set threshold 9
      set num-states 4
      set neighborhood "Moore"
    ]
    preset-parameters = "macaroni" [
      set radius 2
      set threshold 4
      set num-states 5
      set neighborhood "Moore"
    ]
    preset-parameters = "multistrands" [
      set radius 5
      set threshold 15
      set num-states 6
      set neighborhood "Moore"
    ]
    preset-parameters = "percolation mix" [
      set radius 5
      set threshold 10
      set num-states 8
      set neighborhood "Moore"
    ]
    preset-parameters = "weak spirals" [
      set radius 4
      set threshold 9
      set num-states 7
      set neighborhood "Moore"
    ]
    preset-parameters = "Greenberg–Hastings" [
      set radius 3
      set threshold 5
      set num-states 8
      set neighborhood "Moore"
    ]
    preset-parameters = "imperfect" [
      set radius 1
      set threshold 2
      set num-states 4
      set neighborhood "Moore"
    ]
    preset-parameters = "lava lamp" [
      set radius 2
      set threshold 10
      set num-states 3
      set neighborhood "Moore"
    ]
    preset-parameters = "maps" [
      set radius 2
      set threshold 3
      set num-states 5
      set neighborhood "von Neumann"
    ]
    preset-parameters = "perfect" [
      set radius 1
      set threshold 3
      set num-states 4
      set neighborhood "Moore"
    ]
    preset-parameters = "squarish spirals" [
      set radius 2
      set threshold 2
      set num-states 6
      set neighborhood "von Neumann"
    ]
    preset-parameters = "stripes" [
      set radius 3
      set threshold 4
      set num-states 5
      set neighborhood "von Neumann"
    ]
    preset-parameters = "turbulent phase" [
      set radius 2
      set threshold 5
      set num-states 8
      set neighborhood "Moore"
    ]
  )
end


; Copyright 2025 Uri Wilensky.
; See Info tab for full copyright and license.
```

## CA Stochastic

- Canonical path: `Sample Models/Computer Science/Cellular Automata/CA Stochastic`.
- Exact archived served source: `experiments/ca-stochastic/source.nlogox`; SHA-256 `f4f22acee911ef5ae9e95f2a95f47dfda743f5887ac34a664e45356cb8e3b169`.
- Served URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Computer%20Science/Cellular%20Automata/CA%20Stochastic.nlogox
- Version: NetLogo 7.0.4; upstream commit not provided by served artifact. Content hash is the pin. Live-session hash verification is pending.
- License: complete source Info and NOTICE retained; CC BY-NC-SA 3.0.

### Widgets (exact XML attributes and commands)

```xml
<widgets>
    <view x="567" wrappingAllowedX="true" y="15" frameRate="30.0" minPycor="-80" height="326" showTickCounter="true" patchSize="2.0" fontSize="10" wrappingAllowedY="false" width="326" tickCounterLabel="ticks" maxPycor="80" updateMode="1" maxPxcor="80" minPxcor="-80" />
    <button x="11" y="102" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="119" display="Go">go</button>
    <slider x="11" step="0.5" y="197" max="100" width="250" display="III" height="50" min="0" direction="Horizontal" default="0.0" variable="III" units="%" />
    <slider x="264" step="0.5" y="193" max="100" width="250" display="IIO" height="50" min="0" direction="Horizontal" default="50.0" variable="IIO" units="%" />
    <slider x="11" step="0.5" y="249" max="100" width="250" display="IOI" height="50" min="0" direction="Horizontal" default="50.0" variable="IOI" units="%" />
    <slider x="264" step="0.5" y="245" max="100" width="250" display="IOO" height="50" min="0" direction="Horizontal" default="50.0" variable="IOO" units="%" />
    <slider x="11" step="0.5" y="301" max="100" width="250" display="OII" height="50" min="0" direction="Horizontal" default="50.0" variable="OII" units="%" />
    <slider x="264" step="0.5" y="297" max="100" width="250" display="OIO" height="50" min="0" direction="Horizontal" default="50.0" variable="OIO" units="%" />
    <slider x="11" step="0.5" y="353" max="100" width="250" display="OOI" height="50" min="0" direction="Horizontal" default="50.0" variable="OOI" units="%" />
    <slider x="264" step="0.5" y="349" max="100" width="250" display="OOO" height="50" min="0" direction="Horizontal" default="0.0" variable="OOO" units="%" />
    <button x="11" y="15" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="119" display="Setup Random">setup-random</button>
    <note x="21" y="179" backgroundDark="0" fontSize="11" width="189" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Probability Cell Turns On:</note>
    <slider x="12" step="0.5" y="481" max="100" width="250" display="off-color" height="50" min="0" direction="Horizontal" default="0.0" variable="off-color" />
    <slider x="12" step="0.5" y="429" max="100" width="250" display="on-color" height="50" min="0" direction="Horizontal" default="95.0" variable="on-color" />
    <note x="24" y="411" backgroundDark="0" fontSize="11" width="90" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Colors:</note>
    <button x="11" y="53" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="119" display="Setup Example">setup-example</button>
    <switch x="289" y="494" height="40" on="true" variable="auto-clear?" width="120" display="auto-clear?" />
    <slider x="170" step="0.5" y="15" max="100" width="250" display="density" height="50" min="0" direction="Horizontal" default="25.0" variable="density" units="%" />
    <slider x="170" step="1" y="67" max="5" width="250" display="example" height="50" min="1" direction="Horizontal" default="1.0" variable="example" />
    <switch x="170" y="127" height="40" on="false" variable="auto-continue?" width="138" display="auto-continue?" />
    <switch x="289" y="429" height="40" on="true" variable="plot?" width="120" display="plot?" />
    <plot x="531" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="entropy" y="450" xMin="0.0" height="171" legend="true" xMax="320.0" yMin="0.0" width="468" xAxis="time" display="entropy-plot">
      <setup />
      <update>if not plot? [ stop ]</update>
      <pen interval="1.0" mode="0" display="topologic" color="-8630108" legend="true">
        <setup />
        <update>;; X = 4 (correlation length): size of subsequences analyzed
;; topological entropy = 1/X * the log of the sum of the probabilities rounded up
plotxy ticks 1 / 4 * (log (sum (map [1] (filter [ prob -&gt; prob &gt; 0] prob-list))) 2)</update>
      </pen>
      <pen interval="1.0" mode="0" display="metric" color="-955883" legend="true">
        <setup />
        <update>;; metric entropy = -1/X * the sum of the products of each probability and its log
plotxy ticks -1 / 4 * sum ( map [ prob -&gt; prob * log prob 2 ] (filter [ prob -&gt; prob &gt; 0 ] prob-list))</update>
      </pen>
    </plot>
  </widgets>
  
```

### Procedure audit

```netlogo
globals [
  row        ;; current row we are now calculating
  done?      ;; flag set to allow you to press the go button multiple times
  prob-list  ;; list of the probabilities of each pattern occurring
]

patches-own [on?]

;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; SETUP PROCEDURES     ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; setup general working environment.  the other setup procedures call this.
to setup-general
  clear-patches
  set row max-pycor   ;; reset current row
  set done? false
end

;; setup a random selection of patches in the top row to have on? true
to setup-random
  setup-general
  clear-all-plots
  ;; randomly place cells across the top of the world
  ask patches with [pycor = row]
  [
    set on? ((random-float 100) < density)
    color-patch
  ]
  build-prob-list
  reset-ticks
end

;; setup the patches to continue a particular model run.  this will copy the bottom
;; row of patches to the top row.
to setup-continue
  let on?-list []

  ;; make sure go has already been called
  if not done?  [ stop ]

  if auto-clear?
  [
    clear-plot
    set-plot-x-range ticks (ticks + world-height)
  ]

  set on?-list map [ p -> [on?] of p ] sort patches with [ pycor = row ]  ;; copy states from bottom row to list
  setup-general
  ask patches with [ pycor = row ]
  [
    set on? item (pxcor + max-pxcor) on?-list  ;; copy states from list to top row
    color-patch
  ]
  set done? false
end

;; setup the sliders to have specific values that are interesting to study
to setup-example
  if( example = 1 )
    [ set III 0 set IIO 50 set IOI 50 set IOO 50 set OII 50 set OIO 50 set OOI 50 set OOO 0 ]
  if( example = 2 )
    [ set III 0 set IIO 50 set IOI 0 set IOO 50 set OII 50 set OIO 100 set OOI 50 set OOO 100 ]
  if( example = 3 )
    [ set III 0 set IIO 50 set IOI 50 set IOO 66 set OII 50 set OIO 50 set OOI 100 set OOO 0 ]
  if( example = 4 )
    [ set III 0 set IIO 50 set IOI 50 set IOO 66 set OII 50 set OIO 50 set OOI 50 set OOO 0 ]
  if( example = 5 )
    [ set III 0 set IIO 100 set IOI 0 set IOO 66 set OII 100 set OIO 0 set OOI 66 set OOO 0 ]
  set density 25
  setup-random
end


;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; RUNTIME PROCEDURES   ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; run the model.  this applies the current rules to the patches with pycor equal to row.
;; if that row of patches is the bottom row and auto-continue? is true, we will setup the
;; model to continue.
to go
   ;; if the end has been reached, continue from the top or stop
  if (row = min-pycor)
  [
    ifelse auto-continue?
    [
       ;; if we are stuck in an absorbing state, there is not reason to continue
       ifelse( ((sum ([true-false-to-int on?] of patches with [pycor = row]) = 0) and OOO = 0.0) or
               ((sum ([true-false-to-int on?] of patches with [pycor = row]) = world-width)
                 and III = 100.0))
         [ stop ]
         [
           set done? true
           display    ;; ensure all the patches get drawn before we clear
           setup-continue
         ]
    ]
    [
      ;; if a run has already been completed, continue with another.  otherwise just stop
      ifelse done?
        [ setup-continue ]
        [
          set done? true
          stop
        ]
    ]
  ]
  ask patches with [ pycor = row ]  ;; apply rule
    [ do-rule ]

  set row (row - 1)
  ask patches with [ pycor = row ]  ;; color in changed cells
    [ color-patch ]

  build-prob-list
  tick
end

;; the patch will set the on? value of the patch below it based on three factors,
;; 1) its own on? value
;; 2) the on? values of the patches to the left and right of it
;; 3) the current settings for the rules
to do-rule  ;; patch procedure
  let left-on? [on?] of patch-at -1 0  ;; set to true if the patch to the left is on
  let right-on? [on?] of patch-at 1 0  ;; set to true if the patch to the right is on

  ;; each of these lines checks the local area and (possibly)
  ;; sets the lower cell according to the corresponding switch
  let new-value
    (III != 0  and left-on?       and on?       and right-on?          and (random-float 100) < III)    or
    (IIO != 0  and left-on?       and on?       and (not right-on?)    and (random-float 100) < IIO)    or
    (IOI != 0  and left-on?       and (not on?) and right-on?          and (random-float 100) < IOI)    or
    (IOO != 0  and left-on?       and (not on?) and (not right-on?)    and (random-float 100) < IOO)    or
    (OII != 0  and (not left-on?) and on?       and right-on?          and (random-float 100) < OII)    or
    (OIO != 0  and (not left-on?) and on?       and (not right-on?)    and (random-float 100) < OIO)    or
    (OOI != 0  and (not left-on?) and (not on?) and right-on?          and (random-float 100) < OOI)    or
    (OOO != 0  and (not left-on?) and (not on?) and (not right-on?)    and (random-float 100) < OOO)
  ask patch-at 0 -1 [ set on? new-value ]
end

;; for plotting
to build-prob-list
  let i min-pxcor  ;; index of where in the row we are currently doing calculations
  ;; make a 16 element list for storing the number of occurrences of each distinct 4-patch pattern
  let counter-list n-values 16 [0]

  ;; fill the counter-list with the appropriate values.  that is to say, count
  ;; the number of occurrences of each distinct 4-patch pattern of on? values.
  while [ i < max-pxcor ]
  [
    let an-index binary-list-to-index (patches-to-binary-list i)
    set counter-list replace-item an-index counter-list (item an-index counter-list + 1)
    set i (i + 1)
  ]

  ;; make a list of the probabilities of each pattern occurring
  set prob-list map [ counter -> counter / (sum counter-list)] counter-list
end


;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; UTILITY PROCEDURES   ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; report the base 10 equivalent of a binary number represented by a list of 0's and 1's.
;; in the list, the 0th item is the highest power of 2 and the highest item is the lowest power.
to-report binary-list-to-index [binary-list]
  let list-sum 0
  let i 0
  let list-length length binary-list
  while [i < list-length ] [
    set list-sum list-sum + (2 ^ i) * ((item (list-length - i - 1) binary-list) mod 2)
    set i i + 1
  ]
  report list-sum
end

;; report a list of binary digits based on the values of on? for the current row's
;; patches starting at 'offset'
to-report patches-to-binary-list [offset]
  let binary-list []
  set binary-list lput ([true-false-to-int on?] of patch offset row) binary-list
  set binary-list lput ([true-false-to-int on?] of patch (offset + 1) row) binary-list
  set binary-list lput ([true-false-to-int on?] of patch (offset + 2) row) binary-list
  set binary-list lput ([true-false-to-int on?] of patch (offset + 3) row) binary-list
  report binary-list
end

;; convert true/false values to 1/0
to-report true-false-to-int [b]
  ifelse b
    [ report 1 ]
    [ report 0 ]
end

;; color the patch based on whether on? is true or false
to color-patch  ;; patch procedure
  ifelse on?
    [ set pcolor on-color ]
    [ set pcolor off-color ]
end


; Copyright 2003 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Frozen public scripts

Five scripts under `examples/selected-cellular/` are frozen by `SHA256SUMS` before runtime. They import the public experiment model entrypoints (no private/deep core imports). First execution of script 01 failed as expected: missing SmoothLife model module, Bun 1.4.2. No mock/stub runtime exists.

1. SmoothLife: 9×9 periodic grid, inner radius 1 / outer radius 2, uniform 0.4; normalized means yield the explicit sigmoid equation to 1e-12. Invalid fixture/radius rejection is atomic.
2. Hex: bounded 9×9 offset-column hex topology, one center seed has exactly six eligible neighbors; ten activations yield eleven live cells. Empty accepted neighbor counts stop without ticks.
3. Vants: two canonical moving heads, 25 forward and 25 reverse steps recover tape and oriented positions; ticks count both directions. Turing: complete four-rule table reads tape/state, writes, rotates and moves to (1,0), state 1.
4. Elementary rule 90: a single top cell yields two children at x=±1. Five-row sweep performs four ticks; bottom preflight adds none. Continuous: three-parent mean plus 0.47, fractional part and six-digit precision yield 0.803333 / 0.47.
5. Brian: firing→refractory→off with synchronous two-neighbor birth; cyclic successor threshold reads frozen old states; stochastic OOO=100 creates an all-on next row, and OOO=0 absorbing continuation stops at bottom. Four-cell source histogram sums to one.

Setup dimensions are explicit test adaptations; source defaults remain production defaults. Row coordinates are centered, top=max y. Typed live actions must validate before mutation, preserve canonical state and expose detached observations. Additional assertions will cover defaults, random purity, boundaries, all widgets/procedures and stop/resume distinctions. This is the frozen minimum contract, not the full acceptance report.


## Root source/contract integration

The source/five-example commit f926a58 was cherry-picked as ace9d35 into the integration branch before root runtime transfer. The coordinator inspected all five asserted scripts and confirmed their hashes. All nine XML archives parsed and SHA-256 matched both the independently captured served inventory and the existing scientific source dossiers. Inventory correspondence pins each byte-identical source to Galapagos90be931773fcf499049247a8aaa1aecbe003654c, even though the served XML itself does not embed that repository revision. No desktop source was substituted.

Only source-audited and contract-frozen stages rise at this checkpoint. Author runtime and in-progress browser work in the separate bound branch are not counted as integrated implementation. Required independent approval remains pending. The current global model counts remain30 implemented and1 fully accepted; scientific research remains200 complete. No root library/shared UI, selection, Life or research artifact was changed by this source/contract transfer.
