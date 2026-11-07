# Selected materials exact served source audit

Inventory Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`. Archived research originals copied only after SHA-256, byte count and pinned Git blob match. Desktop membership is not Web catalog membership. No new literature pass.

## Sandpile

Canonical path: `Sample Models/Chemistry & Physics/Sandpile`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Sandpile.nlogox. SHA-256 `652510bc00315490d7f7af08898296b4af80f84e1f73b9cf297cba70ffbee252`; bytes 19823; Git blob `44e64035df50eec231fb32e43e0b495efbf790ee`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard 101×101 lattice. Setup random draws integer 0..3; setup-uniform uses grains-per-patch=1. Drop defaults random; center and mouse-click are alternatives. go adds one grain then stabilizes complete avalanche before one tick. Each stabilization round snapshots overloaded membership, subtracts exactly FOUR (despite misleading Info saying all grains), adds one to each existing faces neighbor; missing edge neighbors lose grains. Next active membership is neighbors of overloaded sites, not a global rescan. Lifetime counts nonempty overload rounds; size is unique fired sites. No terminal condition. Explore pushes/restores n without ticking, but source restores first with but-last (one-element stack normally). total-on-tick remains zero after setup while total and plot are initialized. Record positive avalanche sizes/lifetimes only; log histogram refresh every 100 ticks. Clear data does not reset pile/tick. Animation is presentation timing, not a new phase.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="435" wrappingAllowedX="false" y="10" frameRate="90.0" minPycor="-50" height="408" showTickCounter="true" patchSize="4.0" fontSize="10" wrappingAllowedY="false" width="408" tickCounterLabel="ticks" maxPycor="50" updateMode="1" maxPxcor="50" minPxcor="-50" />
    <button x="5" y="47" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="145" display="setup uniform">setup-uniform grains-per-patch</button>
    <chooser x="5" y="159" height="60" variable="drop-location" current="1" width="250" display="drop-location">
      <choice type="string" value="center" />
      <choice type="string" value="random" />
      <choice type="string" value="mouse-click" />
    </chooser>
    <button x="5" y="10" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="145" display="setup random">setup-random</button>
    <slider x="155" step="1" y="10" max="3" width="275" display="grains-per-patch" height="55" min="0" direction="Horizontal" default="1.0" variable="grains-per-patch" />
    <button x="5" y="95" height="50" disableUntilTicks="true" forever="true" kind="Observer" width="105">go</button>
    <button x="115" y="95" height="50" disableUntilTicks="true" forever="false" kind="Observer" width="115" display="go once">go</button>
    <switch x="260" y="160" height="60" on="false" variable="animate-avalanches?" width="170" display="animate-avalanches?" />
    <button x="5" y="230" height="55" disableUntilTicks="false" forever="true" kind="Observer" width="145">explore</button>
    <monitor x="160" precision="4" y="230" height="60" fontSize="11" width="115" display="average">total-on-tick / count patches</monitor>
    <plot x="5" autoPlotX="true" yMax="2.1" autoPlotY="true" yAxis="grains" y="295" xMin="0.0" height="185" legend="false" xMax="1.0" yMin="2.0" width="375" xAxis="ticks" display="Average grain count">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="average" color="-16777216" legend="true">
        <setup />
        <update>plot total / count patches</update>
      </pen>
    </plot>
    <plot x="885" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="log count" y="10" xMin="0.0" height="185" legend="false" xMax="1.0" yMin="0.0" width="355" xAxis="log lifetime" display="Avalanche lifetimes">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>if ticks mod 100 = 0 and not empty? lifetimes [
  plot-pen-reset
  let counts n-values (1 + max lifetimes) [0]
  foreach lifetimes [ lifetime -&gt;
    set counts replace-item lifetime counts (1 + item lifetime counts)
  ]
  let l 0
  foreach counts [ c -&gt;
    ; We only care about plotting avalanches (l &gt; 0), but dropping l = 0
    ; from the counts list is actually more awkward than just ignoring it
    if (l &gt; 0 and c &gt; 0) [
      plotxy (log l 10) (log c 10)
    ]
    set l l + 1
  ]
]</update>
      </pen>
    </plot>
    <plot x="885" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="log count" y="200" xMin="0.0" height="185" legend="false" xMax="1.0" yMin="0.0" width="355" xAxis="log size" display="Avalanche sizes">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>if ticks mod 100 = 0 and not empty? sizes [
  plot-pen-reset
  let counts n-values (1 + max sizes) [0]
  foreach sizes [ the-size -&gt;
    set counts replace-item the-size counts (1 + item the-size counts)
  ]
  let s 0
  foreach counts [ c -&gt;
    ; We only care about plotting avalanches (s &gt; 0), but dropping s = 0
    ; from the counts list is actually more awkward than just ignoring it
    if (s &gt; 0 and c &gt; 0) [
      plotxy (log s 10) (log c 10)
    ]
    set s s + 1
  ]
]</update>
      </pen>
    </plot>
    <button x="885" y="400" height="50" disableUntilTicks="false" forever="false" kind="Observer" width="200" display="clear size and lifetime data">set sizes []
set lifetimes []
set-current-plot "Avalanche lifetimes"
set-plot-y-range 0 1
set-plot-x-range 0 1
set-current-plot "Avalanche sizes"
set-plot-y-range 0 1
set-plot-x-range 0 1</button>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  ;; By always keeping track of how much sand is on the table, we can compute the
  ;; average number of grains per patch instantly, without having to count.
  total
  ;; We don't want the average monitor to updating wildly, so we only have it
  ;; update every tick.
  total-on-tick
  ;; Keep track of avalanche sizes so we can histogram them
  sizes
  ;; Size of the most recent run
  last-size
  ;; Keep track of avalanche lifetimes so we can histogram them
  lifetimes
  ;; Lifetime of the most recent run
  last-lifetime
  ;; The patch the mouse hovers over while exploring
  selected-patch
  ;; These colors define how the patches look normally, after being fired, and in
  ;; explore mode.
  default-color
  fired-color
  selected-color
]

patches-own [
  ;; how many grains of sand are on this patch
  n
  ;; A list of stored n so that we can easily pop back to a previous state. See
  ;; the NETLOGO FEATURES section of the Info tab for a description of how stacks
  ;; work
  n-stack
  ;; Determines what color to scale when coloring the patch.
  base-color
]

;; The input task says what each patch should do at setup time
;; to compute its initial value for n.  (See the Tasks section
;; of the Programming Guide for information on tasks.)
to setup [setup-task]
  clear-all

  set default-color blue
  set fired-color red
  set selected-color green

  set selected-patch nobody
  ask patches [
    set n runresult setup-task
    set n-stack []
    set base-color default-color
  ]
  let ignore stabilize false
  ask patches [ recolor ]
  set total sum [ n ] of patches
  ;; set this to the empty list so we can add items to it later
  set sizes []
  set lifetimes []
  reset-ticks
end

;; For example, "setup-uniform 2" gives every patch a task which reports 2.
to setup-uniform [initial]
  setup [ -> initial ]
end

;; Every patch uses a task which reports a random value.
to setup-random
  setup [ -> random 4 ]
end

;; patch procedure; the colors are like a stoplight
to recolor
  set pcolor scale-color base-color n 0 4
end

to go
  let drop drop-patch
  if drop != nobody [
    ask drop [
      update-n 1
      recolor
    ]
    let results stabilize animate-avalanches?
    let avalanche-patches first results
    let lifetime last results

    ;; compute the size of the avalanche and throw it on the end of the sizes list
    if any? avalanche-patches [
      set sizes lput (count avalanche-patches) sizes
      set lifetimes lput lifetime lifetimes
    ]
    ;; Display the avalanche and guarantee that the border of the avalanche is updated
    ask avalanche-patches [ recolor ask neighbors4 [ recolor ] ]
    display
    ;; Erase the avalanche
    ask avalanche-patches [ set base-color default-color recolor ]
    ;; Updates the average monitor
    set total-on-tick total
    tick
  ]
end

to explore
  ifelse mouse-inside? [
    let p patch mouse-xcor mouse-ycor
    set selected-patch p
    ask patches [ push-n ]
    ask selected-patch [ update-n 1 ]
    let results stabilize false
    ask patches [ pop-n ]
    ask patches [ set base-color default-color recolor ]
    let avalanche-patches first results
    ask avalanche-patches [ set base-color selected-color recolor ]
    display
  ] [
    if selected-patch != nobody [
      set selected-patch nobody
      ask patches [ set base-color default-color recolor ]
    ]
  ]
end

;; Stabilizes the sandpile. Reports which sites fired and how many iterations it took to
;; stabilize.
to-report stabilize [animate?]
  let active-patches patches with [ n > 3 ]

  ;; The number iterations the avalanche has gone for. Use to calculate lifetimes.
  let iters 0

  ;; we want to count how many patches became overloaded at some point
  ;; during the avalanche, and also flash those patches. so as we go, we'll
  ;; keep adding more patches to to this initially empty set.
  let avalanche-patches no-patches

  while [ any? active-patches ] [
    let overloaded-patches active-patches with [ n > 3 ]
    if any? overloaded-patches [
      set iters iters + 1
    ]
    ask overloaded-patches [
      set base-color fired-color
      ;; subtract 4 from this patch
      update-n -4
      if animate? [ recolor ]
      ;; edge patches have less than four neighbors, so some sand may fall off the edge
      ask neighbors4 [
        update-n 1
        if animate? [ recolor ]
      ]
    ]
    if animate? [ display ]
    ;; add the current round of overloaded patches to our record of the avalanche
    ;; the patch-set primitive combines agentsets, removing duplicates
    set avalanche-patches (patch-set avalanche-patches overloaded-patches)
    ;; find the set of patches which *might* be overloaded, so we will check
    ;; them the next time through the loop
    set active-patches patch-set [ neighbors4 ] of overloaded-patches
  ]
  report (list avalanche-patches iters)
end

;; patch procedure. input might be positive or negative, to add or subtract sand
to update-n [ how-much ]
  set n n + how-much
  set total total + how-much
end

to-report drop-patch
  if drop-location = "center" [ report patch 0 0 ]
  if drop-location = "random" [ report one-of patches ]
  if drop-location = "mouse-click" and mouse-down? [
    every 0.3 [ report patch mouse-xcor mouse-ycor ]
  ]
  report nobody
end

;; Save the patches state
to push-n ;; patch procedure
  set n-stack fput n n-stack
end

;; restore the patches state
to pop-n ;; patch procedure
  ; need to go through update-n to keep total statistic correct
  update-n ((first n-stack) - n)
  set n-stack but-last n-stack
end


; Public Domain:
; To the extent possible under law, Uri Wilensky has waived all
; copyright and related or neighboring rights to this model.
```

## Ising

Canonical path: `Sample Models/Chemistry & Physics/Ising`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Ising.nlogox. SHA-256 `41727ee27957e2c797362ed3387742bc1c2038eabf5e2fa54df8e1152185b8d2`; bytes 48850; Git blob `0269da3d79ee5a702980d792e83280e110d3b20b`. Includes `None`; extensions `[]`.

### Binding semantic audit

Wrapped 81×81 lattice. Setup independent random integer100 < probability-of-spin-up=50, spin ±1. go performs 1000 choices WITH replacement and immediate sequential updates, then advances attempted-flip ticks by 1000. Ediff=2*spin*sum(neighbors4.spin); accept Ediff<=0, else only temperature>0 and uniform<exp(-Ediff/temperature). Temperature default 2.27. Zero temperature never attempts exponential draw for uphill flips. sum-of-spins updated by twice NEW spin; magnetization=sum/count. No terminal condition. Probability only affects setup; temperature is live. Plot magnetization by attempted flips.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="315" wrappingAllowedX="true" y="10" frameRate="1000.0" minPycor="-40" height="409" showTickCounter="true" patchSize="5.0" fontSize="10" wrappingAllowedY="true" width="409" tickCounterLabel="attempted flips" maxPycor="40" updateMode="1" maxPxcor="40" minPxcor="-40" />
    <button x="160" y="62" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="145">go</button>
    <slider x="10" step="0.01" y="99" max="10" width="296" display="temperature" height="50" min="0" direction="Horizontal" default="2.27" variable="temperature" />
    <monitor x="100" precision="3" y="151" height="60" fontSize="11" width="114" display="magnetization">magnetization</monitor>
    <plot x="10" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="average spin" y="216" xMin="0.0" height="287" legend="false" xMax="20.0" yMin="-1.0" width="296" xAxis="time" display="Magnetization">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="average spin" color="-13345367" legend="true">
        <setup />
        <update>plotxy ticks magnetization</update>
      </pen>
      <pen interval="1.0" mode="0" display="axis" color="-16777216" legend="true">
        <setup>;; draw a horizontal line to show the x axis
auto-plot-off
plotxy 0 0
plotxy 1000000000000000 0
auto-plot-on</setup>
        <update />
      </pen>
    </plot>
    <slider x="10" step="1" y="10" max="100" width="295" display="probability-of-spin-up" height="50" min="0" direction="Horizontal" default="50.0" variable="probability-of-spin-up" units="%" />
    <button x="10" y="62" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="145">setup</button>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  sum-of-spins   ;; sum of all the spins -- keeping track of this
                 ;; means that we can always instantly calculate
                 ;; the magnetization (which is the average spin)
]

patches-own [
  spin           ;; holds -1 or 1
]

to setup
  clear-all
  ask patches [
    ifelse random 100 < probability-of-spin-up
      [ set spin  1 ]
      [ set spin -1 ]
    recolor
  ]
  set sum-of-spins sum [ spin ] of patches
  reset-ticks
end

to go
  ;; update 1000 patches at a time
  repeat 1000 [
    ask one-of patches [ update ]
  ]
  tick-advance 1000  ;; use `tick-advance`, as we are updating 1000 patches at a time
  update-plots       ;; unlike `tick`, `tick-advance` doesn't update the plots, so we need to do so explicitly
end

;; update the spin of a single patch
to update  ;; patch procedure
  ;; flipping changes the sign on our energy,
  ;; so the difference in energy, if we flip,
  ;; is -2 times our current energy
  let Ediff 2 * spin * sum [ spin ] of neighbors4
  if (Ediff <= 0) or (temperature > 0 and (random-float 1.0 < exp ((- Ediff) / temperature))) [
    set spin (- spin)
    set sum-of-spins sum-of-spins + 2 * spin
    recolor
  ]
end

;; color the patches according to their spin
to recolor  ;; patch procedure
  ifelse spin = 1
    [ set pcolor blue + 2 ]
    [ set pcolor blue - 2 ]
end

;; a measure of magnetization, the average of the spins
to-report magnetization
  report sum-of-spins / count patches
end


; Copyright 2003 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Sand

Canonical path: `Sample Models/Chemistry & Physics/Sand`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Sand.nlogox. SHA-256 `7db053940a922d00b19dc6132a68e1eb7d53e0ec0e0dcd9d77d9ce0342db0e4a`; bytes 42125; Git blob `c2c4d49e6c81b1c339a2253f01447670a5067957`. Includes `None`; extensions `[]`.

### Binding semantic audit

81×81, x wraps, y hard. Setup gray floor y < -0.8*maxPycor; blue spouts y=round(.9*maxPycor), x mod round(.6*maxPxcor)=0. Tick starts at zero. go spouts when ticks mod spacing=0 (default3) with uniform100 <= release-chance(default100), then move-all-sand then tick. Snapshot pcolor into next-color; all brown decisions read OLD pcolor; commit only after all decisions. Down black wins; else lower-left brown/right black -> right; inverse -> left; both black -> random side. Other colors do not count as brown support. Competing writes may coalesce grains; conservation is NOT promised. dump-sand overlays brown with density(default10) between floor and spout, without clearing existing sand/ticking. No stop. Info density25 differs from actual widget10.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="270" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-40" height="409" showTickCounter="true" patchSize="5.0" fontSize="10" wrappingAllowedY="false" width="409" tickCounterLabel="ticks" maxPycor="40" updateMode="1" maxPxcor="40" minPxcor="-40" />
    <slider x="10" step="1.0" y="105" max="100.0" width="250" display="release-chance" height="50" min="0.0" direction="Horizontal" default="100.0" variable="release-chance" units="%" />
    <slider x="10" step="1.0" y="157" max="15.0" width="250" display="spacing" height="50" min="2.0" direction="Horizontal" default="3.0" variable="spacing" />
    <slider x="10" step="1.0" y="241" max="50.0" width="250" display="density" height="50" min="0.0" direction="Horizontal" default="10.0" variable="density" units="%" />
    <button x="140" y="40" height="56" disableUntilTicks="true" forever="true" kind="Observer" width="120">go</button>
    <button x="10" y="40" height="56" disableUntilTicks="false" forever="false" kind="Observer" width="120">setup</button>
    <button x="80" y="300" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="110">dump-sand</button>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  spout-patches    ;; set in setup so we don't have to keep recomputing it
  spout-ycor       ;; location of the spouts
  surface-ycor     ;; initial location of the surface of the sand at the bottom
]

patches-own [
  next-color       ;; patches first all decide what color to change to, then all change
]

to setup
  clear-all
  set surface-ycor -0.8 * max-pycor
  ask patches with [pycor < surface-ycor]
    [ set pcolor gray ]
  set spout-ycor round (max-pycor * 0.9)
  let spout-space round (max-pxcor * 0.6)
  ;; now set up the blue spouts at spout-space intervals
  set spout-patches patches with [(pxcor mod spout-space = 0) and
                                  (pycor = spout-ycor)]
  ask spout-patches
    [ set pcolor blue ]
  reset-ticks
end

to dump-sand
  ask patches with [(pycor < spout-ycor) and
                    (pycor > surface-ycor)]
    [ if random-float 100 < density
        [ set pcolor brown ] ]
end

to go
  spout
  move-all-sand
  tick
end

;; spouts sand particles depending on spacing (how often sand is released)
;; and the release-chance percent when the spacing interval is reached
to spout
  if ticks mod spacing = 0
    [ ask spout-patches with [random-float 100 <= release-chance]
        [ ask patch-at 0 -1 [ set pcolor brown ] ] ]
end

;; implements the four rules given in the info tab
;; to all the brown sand particles
to move-all-sand
  ask patches
    [ set next-color pcolor ]
  ask patches with [pcolor = brown]
    [ ifelse ([pcolor] of patch-at 0 -1 = black)
        [ move 0 ]
        [ ifelse ([pcolor] of patch-at -1 -1 = brown) and
                 ([pcolor] of patch-at  1 -1 = black)
           [ move 1 ]
           [ ifelse ([pcolor] of patch-at -1 -1 = black) and
                    ([pcolor] of patch-at  1 -1 = brown)
              [ move -1 ]
              [ if ([pcolor] of patch-at 1 -1 = black) and
                   ([pcolor] of patch-at -1 -1 = black)
                  [ move one-of [1 -1] ] ] ] ] ]
  ;; we do this in a separate "ask" so that all the patches decide
  ;; on their new colors before any of them actually change color
  ask patches
    [ set pcolor next-color ]
end

to move [x-offset];; patch procedure
  set next-color black
  ask patch-at x-offset -1 [ set next-color brown ]
end


; Copyright 1996 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Solid Diffusion

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Solid Diffusion`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Solid%20Diffusion.nlogox. SHA-256 `a7c59f59babb00427e4343e98a0ce786bdb755af23c0492551798d9fc661f4c3`; bytes 42058; Git blob `287070b1fd3d5e8f66ad5c2d78cb77f0a41d57c6`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard 35×35 lattice. Setup one green Agent each x<0 and blue each x>0, vacancy column x=0. go snapshots vacancies, asks them in random order to choose one atom from faces-neighbor occupancy and move into vacancy immediately, then tick. A newly opened vacancy is not added to the snapshot; the same atom can move more than once. Count and species conserved, one occupancy per site. Report greens/blues by column and (rightmost green x - leftmost blue x)^2, not individual displacement or MSD. No parameters or stop in original.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="285" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-17" height="319" showTickCounter="true" patchSize="9.0" fontSize="10" wrappingAllowedY="false" width="319" tickCounterLabel="ticks" maxPycor="17" updateMode="1" maxPxcor="17" minPxcor="-17" />
    <button x="16" y="38" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="85">setup</button>
    <button x="106" y="38" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="80">go</button>
    <plot x="269" autoPlotX="false" yMax="1.0" autoPlotY="false" y="365" xMin="-1.0" height="162" legend="false" xMax="1.0" yMin="0.0" width="344" display="Atoms by Column">
      <setup>set-plot-x-range min-pxcor (max-pxcor + 1)
set-plot-y-range 0 world-height</setup>
      <update />
      <pen interval="1.0" mode="0" display="Greens" color="-10899396" legend="true">
        <setup />
        <update>plot-atoms greens</update>
      </pen>
      <pen interval="1.0" mode="0" display="Blues" color="-13345367" legend="true">
        <setup />
        <update>plot-atoms blues</update>
      </pen>
    </plot>
    <plot x="16" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="distance squared" y="85" xMin="0.0" height="237" legend="false" xMax="10.0" yMin="0.0" width="260" xAxis="time" display="Max Diffusion Distance">
      <setup />
      <update>let rightmost max [pxcor] of greens
let leftmost  min [pxcor] of blues
plot (rightmost - leftmost) ^ 2</update>
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update />
      </pen>
    </plot>
    <button x="191" y="38" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="82" display="go-once">go</button>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
to setup
  clear-all
  set-default-shape turtles "square"
  ;; make green atoms on left
  ask patches with [pxcor < 0]
    [ sprout 1 [ set color green ] ]
  ;; make blue atoms on right
  ask patches with [pxcor > 0]
    [ sprout 1 [ set color blue ] ]
  ;; plot the initial state of the system
  reset-ticks
end

to go
  ;; asks vacancies to ask a neighboring atom to
  ;; move into the vacancy
  ask patches with [not any? turtles-here]
    [ move-atom-to-here ]
  tick
end

;; chooses a neighboring atom to move onto a empty patch (vacancy)
to move-atom-to-here  ;; patch procedure
  let atom one-of turtles-on neighbors4
  if atom != nobody [
    ask atom [ move-to myself ]  ;; myself is the calling patch
  ]
end

;;; plotting procedures

to-report greens
  report turtles with [color = green]
end

to-report blues
  report turtles with [color = blue]
end

to plot-atoms [atoms]
  plot-pen-reset
  plot-pen-up
  let column min-pxcor
  repeat world-width [
    let y count atoms with [pxcor = column]
    plotxy column y
    plot-pen-down
    set column column + 1
    plotxy column y
  ]
end


; Copyright 2007 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Interstitial Diffusion

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Interstitial Diffusion`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Interstitial%20Diffusion.nlogox. SHA-256 `7526195f87a112e3568840bbc543ecfde2e52d6e186c6a1382fa8fd597a8ae55`; bytes 56102; Git blob `2f781b1def572a72b3e2ec799205be334a78afaa`. Includes `None`; extensions `[]`.

### Binding semantic audit

41×201 patch lattice, x hard, y wraps; native x0..40,y-200..0 adapted by coordinate translation only. Lattice markers at patch+(0.5,0.5), x<max; diffusing Agents initially x<=min+10 inclusive with Bernoulli concentration .8. Both constant surfaces default false; left concentration .7,right0. simulate preflight stops ticks>=max-ticks(default1000). Snapshot d-atoms random order, four headings equally probable INCLUDING failed off-world attempts; move only into empty d-atom site; occupancy sees preceding moves. Reapply enabled Bernoulli boundary surfaces after movement, calculate columns/count/world-height then tick. Source graph/drawing agents are presentation; canonical physical atoms remain World Agents. draw-profile hides lattice, edits one column with up-to-n-of(worldHeight*rounded concentration) atoms, resets tick and plot setup, no simulation step. Current, initial(tick0), and tick15 profiles are distinct. Lattice visibility and go-mode are native actions; no invented units.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="305" wrappingAllowedX="false" y="235" frameRate="30.0" minPycor="-200" height="2416" showTickCounter="true" patchSize="12.0" fontSize="10" wrappingAllowedY="true" width="496" tickCounterLabel="ticks" maxPycor="0" updateMode="1" maxPxcor="40" minPxcor="0" />
    <slider x="10" step=".01" y="5" max="1" width="225" display="initial-bulk-concentration" height="50" min="0" direction="Horizontal" default="0.8" variable="initial-bulk-concentration" />
    <slider x="10" step="1" y="60" max="world-width - 1" width="225" display="initial-columns-populated" height="50" min="0" direction="Horizontal" default="10.0" variable="initial-columns-populated" />
    <button x="10" y="240" height="59" disableUntilTicks="true" forever="true" kind="Observer" width="107">go</button>
    <input x="125" multiline="false" y="240" height="60" variable="max-ticks" type="number" width="113">1000.0</input>
    <button x="30" y="305" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="179" display="show/hide lattice atoms">ask l-atoms [set hidden? not hidden?]</button>
    <switch x="10" y="350" height="40" on="false" variable="constant-left-surface?" width="222" display="constant-left-surface?" />
    <slider x="10" step=".01" y="395" max="1" width="222" display="left-surface-concentration" height="50" min="0" direction="Horizontal" default="0.7" variable="left-surface-concentration" />
    <switch x="10" y="460" height="40" on="false" variable="constant-right-surface?" width="222" display="constant-right-surface?" />
    <slider x="10" step=".01" y="505" max="1" width="222" display="right-surface-concentration" height="50" min="0" direction="Horizontal" default="0.0" variable="right-surface-concentration" />
    <button x="75" y="120" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="90">setup</button>
    <chooser x="10" y="165" height="60" variable="go-mode" current="0" width="115" display="go-mode">
      <choice type="string" value="simulate" />
      <choice type="string" value="draw-profile" />
    </chooser>
    <note x="125" y="170" backgroundDark="0" fontSize="10" width="160" markdown="false" height="55" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Select "draw-profile" and click and drag in the world to change the concentration profile. </note>
    <plot x="288" autoPlotX="false" yMax="1.0" autoPlotY="false" y="5" xMin="0.0" height="220" legend="true" xMax="1.0" yMin="0.0" width="523" display="Concentration Profile">
      <setup>clear-plot
set-plot-x-range min-pxcor max-pxcor

</setup>
      <update />
      <pen interval="1.0" mode="0" display="current" color="-7171555" legend="true">
        <setup />
        <update>plot-pen-reset
plot-concentration
</update>
      </pen>
      <pen interval="1.0" mode="0" display="initial" color="-4539718" legend="true">
        <setup />
        <update>if ticks = 0 [plot-concentration]</update>
      </pen>
      <pen interval="1.0" mode="0" display="after 15 ticks" color="-7500403" legend="true">
        <setup />
        <update>if ticks = 15 [plot-concentration]</update>
      </pen>
    </plot>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
breed [l-atoms l-atom]            ;; lattice atoms
breed [d-atoms d-atom]            ;; diffusing atoms
breed [graph-points graph-point]  ;; these are used to draw the graph when sketching a concentration profile

graph-points-own [
  num-d-atoms        ;; the number of diffusing atoms at this graph-point's x-position
  concentration      ;; the concentration of diffusing atoms at this graph-point's x-position.
]

globals [
  graph-min-ycor       ;; the ycor which the bottom of the graph when sketching a concentration profile
  sorted-graph-points  ;; a list to hold the graph-points in sorted order for plotting purposes
]


;*********************************************
;*************SETUP PROCEDURES****************
;*********************************************
to setup
  clear-all

  set-default-shape turtles "circle"
  set graph-min-ycor (max-pycor - 25)

  ; Create lattice atoms
  ask patches with [pxcor < max-pxcor] [
    sprout-l-atoms 1 [
      set color blue
      set size 0.9
      set heading 45
      fd (sqrt 2) / 2
    ]
  ]

  ; Initialize bulk concentration
  ask patches with [pxcor <= (min-pxcor + initial-columns-populated)] [
    ;; Create an atom with probability equal to the intial bulk concentration
    if random-float 1 < initial-bulk-concentration [
      create-d-atom
    ]
  ]

  ; Initialize surface concentrations
  if constant-left-surface? [set-constant-left-surface]
  if constant-right-surface? [set-constant-right-surface]

  ; Create the graph for drawing concentration profiles
  create-axes
  create-graph-pnts
  hide-graph
  calc-concentration

  reset-ticks
end


; patch procedure to create a diffusing atom
to create-d-atom
    sprout-d-atoms 1 [
      set color yellow
      set size .3
    ]
end

;******************************************
;*************GO PROCEDURES****************
;******************************************

to go
  (ifelse
    go-mode = "simulate" [simulate]
    go-mode = "draw-profile" [draw-profile]
  )
end


; observer procedure to run the simulation. This would normally be
; the go procedure but since there are two go-modes, the code for
; running the simulation is in this procedure
to simulate
  if ticks = 0 [
    hide-graph
    ask l-atoms [show-turtle]
  ]

  if ticks >= max-ticks [stop]

  ; The core of the diffusion model is diffusing atoms executing a random walk
  ask d-atoms [random-walk]

  ; If either of the surfaces are being held at constant concentration, it needs to be set
  if constant-left-surface? [set-constant-left-surface]
  if constant-right-surface? [set-constant-right-surface]

  calc-concentration
  tick
end


; turtle procedure for atoms  to random walk
to random-walk
  ; This random-walk procedure picks a direction and then moves to that site if it is open.
  ; It is important to use this instead of `move-to one-of neighbors4`, so that boundary atoms
  ; have the same probability of moving inwards as non-boundary atoms have to move outwards.
  ; Using `move-to one-of neighbors4` would result in boundary atoms having only three neighbors
  ; and therefore a higher  probability of moving inwards than non-boundary atoms with four neighbrs
  ; have of moving outwards.

  set heading one-of [0 90 180 270]  ; turn to one of 4 neighbors
  let neighbor patch-ahead 1
  if neighbor != nobody and not any? d-atoms-on neighbor [
    move-to neighbor
  ]
end


; procedure to set the left surface concentration based on the left-surface-concentration slider
to set-constant-left-surface
  ask patches with [pxcor = min-pxcor] [
    ask d-atoms-here [die] ;; First remove all atoms on the surface
    if random-float 1 < left-surface-concentration [ ;; Create an atoms on surface with probability equal to surface-concentration
      create-d-atom
    ]
  ]
end


; procedure to set the right surface concentration based on the right-surface-concentration slider
to set-constant-right-surface
  ask patches with [pxcor = max-pxcor] [
    ask d-atoms-here [die]  ;; First remove all atoms on the surface
    if random-float 1 < right-surface-concentration [ ;; Create an atoms on surface with probability equal to surface-concentration
      create-d-atom
    ]
  ]
end


;************************************************************************
;*************CALCULATE AND PLOT CONCENTRATION PROFILE CODE**************
;************************************************************************

; procedure to calculate the concentration of d-atoms at each x-location and set the concentration
; variable of each corresponding graph-point agent
to calc-concentration
  ask graph-points [set num-d-atoms 0]
  ask d-atoms [
    let my-pxcor pxcor
    ask graph-points with [pxcor = my-pxcor] [set num-d-atoms num-d-atoms + 1]
  ]
  ask graph-points [
    set concentration num-d-atoms / world-height
    set ycor ycor-from-concentration
  ]
end

; procedure to plot the concentration based on stored concentration variables
; of the graph points. It is defined here rather than directly in the plot
; so it can be resused multiple times.
to plot-concentration
  foreach sorted-graph-points [gp -> ask gp [plotxy pxcor concentration]]
end


;********************************************************************
;*****************DRAW CONCENTRATIAON PROFILE CODE*******************
;********************************************************************


; hides the graph the user sketches with
to hide-graph
  ask turtles with [any? my-links] [set hidden? true]
  ask links [set hidden? true]
end

; shows the graph the user sketches with
to show-graph
  ask turtles with [any? my-links] [set hidden? false]
  ask links [set hidden? false]
end

; Create the graph-point agents that make up the user-sketched graph
to create-graph-pnts

  ; create a graph-point at each x-position
  ask patches with [pycor = graph-min-ycor] [
    sprout-graph-points 1 [
      set color yellow
      set size 0.5
    ]
  ]

  ; link the graph points together so that they form a single curve
  ask graph-points [
    create-links-with other graph-points with [abs (xcor - [xcor] of myself) = 1] [
      set thickness 0.3
      set color yellow
    ]
  ]

  set sorted-graph-points sort-on [pxcor] graph-points ; for plotting the graph
end


; procedure to allow the user to sketch a concentration profile
to draw-profile
  ask l-atoms [hide-turtle] ; hide the lattice atoms
  show-graph
  setup-plots ; reset the plots since we are resetting the concentration profile by doing this

  if mouse-down? and mouse-ycor >= graph-min-ycor [
    let prev-concentration 0

    ask graph-points with [pxcor = round mouse-xcor] [ ; get the graph point at the user's mouse position
      set ycor mouse-ycor  ; move up to the mouse position
      set prev-concentration concentration
      set concentration concentration-from-ycor

      if prev-concentration != concentration [ ; if the concentration has changed (mouse moved)
        let my-pxcor pxcor
        ; reset the number of d-atoms at this x-position to match the concentration
        ask d-atoms with [pxcor = my-pxcor] [die]
        ask up-to-n-of (world-height * concentration) patches with [pxcor = my-pxcor] [create-d-atom]
      ]
    ]
  ]
  reset-ticks
end


; graph-point procedure to calculate the concentration represented by its ycor
to-report concentration-from-ycor
  report precision ((graph-min-ycor - ycor) / graph-min-ycor) 2
end

; graph-point procedure to calculate what its ycor should be based on its concentration
to-report ycor-from-concentration
  report  graph-min-ycor * (1 - concentration)
end


; create the axes for the graph to sketch concentrations
to create-axes
  let origin-turtle nobody

  ; create a turtle for the origin
  create-turtles 1 [
    setxy (min-pxcor) graph-min-ycor
    set origin-turtle self
    set size 0
  ]

  ; create a turtle for the end of the x-axis and connect it with the origin
  create-turtles 1 [
    setxy max-pxcor graph-min-ycor
    create-link-with origin-turtle [set thickness 0.2 set color white]
    set size 0
  ]

  ; create a turtle for the end of the y-axis and connect it with the origin
  create-turtles 1 [
    setxy min-pxcor max-pycor
    create-link-with origin-turtle [set thickness 0.2 set color white]
    set size 0
  ]
end


; Copyright 2025 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Heat Diffusion

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Heat Diffusion`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Heat%20Diffusion.nlogox. SHA-256 `28a9a04467718a26543bbe459500f57eb65c20c914733f6e19028ca68e97f090`; bytes 48585; Git blob `d6344d1dad0a4c2f46a74ad73a2afc20f00a95f3`. Includes `None`; extensions `[]`.

### Binding semantic audit

Wrapped 51×51 patch lattice. plate-size=round(.6*maxPxcor)=15. Initial interior |x|,|y|<15 uses44; boundary strips left1,right/top/bottom50; corner quadrants average incident boundaries. old-temperature initialized before decorative legend mutates temperature only. go asks patches RANDOM SEQUENTIALLY: temperature=d*sum(neighbors4.old)+(1-4d)*old, clamp edges, immediately old=temperature. This is NOT a simultaneous Euler Grid.diffuse call; later patches see earlier old writes. d=.25*exp(-1/(alpha+.3)), alpha=.8418. update-alpha explicitly selects wood .00128,stone .012,iron .2034,aluminum .8418,silver1.7004; other keeps manually supplied alpha. Live edge changes clamp on next go, initial temp is setup only. Legend is presentation; record any omission/adaptation. No terminal condition or native plots.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="520" wrappingAllowedX="true" y="65" frameRate="30.0" minPycor="-25" height="259" showTickCounter="true" patchSize="5.0" fontSize="10" wrappingAllowedY="true" width="259" tickCounterLabel="ticks" maxPycor="25" updateMode="1" maxPxcor="25" minPxcor="-25" />
    <button x="5" y="7" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="115" display="Setup">setup</button>
    <button x="130" y="7" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="75" display="Go Once">go</button>
    <button x="215" y="7" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="65" display="Go">go</button>
    <slider x="5" step="1.0" y="50" max="100.0" width="275" display="initial-plate-temp" height="50" min="1.0" direction="Horizontal" default="44.0" variable="initial-plate-temp" />
    <chooser x="5" y="110" height="60" variable="material-type" current="3" width="275" display="material-type">
      <choice type="string" value="wood" />
      <choice type="string" value="stone" />
      <choice type="string" value="iron" />
      <choice type="string" value="aluminum" />
      <choice type="string" value="silver" />
      <choice type="string" value="other" />
    </chooser>
    <slider x="5" step="1.0E-4" y="180" max="10.0" width="275" display="alpha" height="50" min="0.0010" direction="Horizontal" default="0.8418" variable="alpha" />
    <button x="290" y="195" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="98" display="Update Alpha">update-alpha</button>
    <note x="290" y="110" backgroundDark="0" fontSize="11" width="160" markdown="false" height="73" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Choose a material and
then press UPDATE ALPHA
based on that material,
or set ALPHA directly
from the slider.</note>
    <slider x="520" step="1.0" y="335" max="100.0" width="259" display="bottom-temp" height="50" min="1.0" direction="Horizontal" default="50.0" variable="bottom-temp" />
    <slider x="520" step="1.0" y="5" max="100.0" width="259" display="top-temp" height="50" min="1.0" direction="Horizontal" default="50.0" variable="top-temp" />
    <slider x="460" step="1.0" y="65" max="100.0" width="50" display="left-temp" height="259" min="1.0" direction="Vertical" default="1.0" variable="left-temp" />
    <slider x="790" step="1.0" y="65" max="100.0" width="50" display="right-temp" height="259" min="1.0" direction="Vertical" default="50.0" variable="right-temp" />
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  plate-size  ; the size of the plate on which heat is diffusing
  ; Used for scaling the color of the patches
  min-temp  ; the minimum temperature at setup time
  max-temp  ; the maximum temperature at setup time
]

patches-own [
  old-temperature  ; the temperature of the patch the last time thru go
  temperature  ; the current temperature of the patch
]

;;;;;;;;;;;;;;;;;;;;;;
;; Setup Procedures ;;
;;;;;;;;;;;;;;;;;;;;;;
to setup
  clear-all
  ; initialize variables
  set plate-size round (0.6 * max-pxcor)  ; use 0.6 to make a nice sized plate

  ; set up the plate
  ask patches [
    set pcolor gray
    set-initial-temperatures
    set-edge-temperatures
    set old-temperature temperature
  ]

  set min-temp min [old-temperature] of patches
  set max-temp max [old-temperature] of patches

  draw-legend

  ask patches [ draw-plate ]

  reset-ticks
end

; Sets the temperature for inside of the plate
to set-initial-temperatures  ; Patch Procedure
  if ((abs pycor) < plate-size) and ((abs pxcor) < plate-size)
    [ set temperature initial-plate-temp ]
end

; Sets the temperatures of the plate edges and corners
to set-edge-temperatures  ; patch procedure
  ; set the temperatures of the edges
  if (pxcor >= plate-size) and ((abs pycor) < plate-size)
    [set temperature right-temp]
  if (pxcor <= (- plate-size)) and ((abs pycor) < plate-size)
    [set temperature left-temp]
  if (pycor >= plate-size) and ((abs pxcor) < plate-size)
    [set temperature top-temp]
  if (pycor <= (- plate-size)) and ((abs pxcor) < plate-size )
    [set temperature bottom-temp]

  ; set the temperatures of the corners
  if (pxcor >= plate-size) and (pycor >= plate-size)
    [set temperature 0.5 * (right-temp + top-temp)]
  if (pxcor >= plate-size) and (pycor <= (- plate-size))
    [set temperature 0.5 * (right-temp + bottom-temp)]
  if (pxcor <= (- plate-size)) and (pycor >= plate-size)
    [set temperature 0.5 * (left-temp + top-temp)]
  if (pxcor <= (- plate-size)) and (pycor <= (- plate-size))
    [set temperature 0.5 * (left-temp + bottom-temp)]
end


;;;;;;;;;;;;;;;;;;;;;;;;
;; Runtime Procedures ;;
;;;;;;;;;;;;;;;;;;;;;;;;

; Runs the simulation through a loop
to go
  ask patches [
    ; diffuse the heat of a patch with its neighbors
    set temperature (heat-diffusivity * (sum [old-temperature] of neighbors4)) + ((1 - ( 4 * heat-diffusivity )) * old-temperature)
    ; set the edges back to their constant heat
    set-edge-temperatures
    set old-temperature temperature
    draw-plate
  ]
  tick
end

; Draws the patches that are within the plate
to draw-plate  ; Patch Procedure
  if ((abs pycor) <= plate-size) and ((abs pxcor) <= plate-size)
    [color-patch]
end

; color the patch based on its temperature
to color-patch  ; Patch Procedure
  set pcolor scale-color red temperature min-temp max-temp
end

; report the heat diffusivity constant that we use for the calculations
to-report heat-diffusivity
  ; a few notes on the constants used here:
  ; 1. we use .25 as a time step that causes the heat to diffuse at a reasonable pace
  ; 2. we use alpha + .3 instead of just alpha here since alpha would be too
  ; small to view any changes between some of the preset materials
  ; 3. these constants are necessary since this model uses an Euler approximation to
  ; calculate the temperature. The approximation is only valid within a certain range
  ; of time-steps and this range changes depending upon the value of alpha.
  report .25 * e ^ (-1 / (alpha + .3))
end

; Sets the material
to update-alpha
  (
    ifelse
      material-type = "wood"     [ set alpha 0.00128 ]
      material-type = "stone"    [ set alpha 0.012   ]
      material-type = "iron"     [ set alpha 0.2034  ]
      material-type = "aluminum" [ set alpha 0.8418  ]
      material-type = "silver"   [ set alpha 1.7004  ]
      [ user-message "Choose your own value for alpha!" ]
  )
end

; Draws the Color Scale Legend (this code isn't fundamental to the mechanism at hand)
to draw-legend  ; Patch Procedure
  let x (1 + min-pxcor)
  repeat 3 [
    let y 0
    repeat 10 [
      ask patch (x + 4) (y * 2 - 11) [ set temperature (y * 10) ]
      ask patch (x + 4) (y * 2 - 10) [ set temperature (y * 10) ]
      set y y + 1
    ]
    set x x + 1
  ]

  set x (1 + min-pxcor)
  repeat 3 [
    let y 0
    repeat 10 [
      ask patch (x + 4) (y * 2 - 11) [color-patch ]
      ask patch (x + 4) (y * 2 - 10) [color-patch ]
      set y y + 1
    ]
    set x x + 1
  ]

  set x (1 + min-pxcor)
  repeat 3 [
    let y 0
    repeat 11 [
      if (x = (3 + min-pxcor)) [ ask patch  x (y * 2 - 12) [ set plabel (y * 10) ] ]
    set y y + 1
    ]
    set x x + 1
  ]

end


; Copyright 1998 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Crystallization Basic

Canonical path: `Sample Models/Chemistry & Physics/Materials Science/Crystallization/Crystallization Basic`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Materials%20Science/Crystallization/Crystallization%20Basic.nlogox. SHA-256 `2fca2bd7824f49a01a657ccfbdb1364930de54de3e7decab2df9575c8f898b89`; bytes 48095; Git blob `ca9d39cb6f0a33cadb98e7c2e22a016dbe25896a`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard 33×33 lattice, initial rectangle width/height31 with STRICT |x|<width/2,|y|<height/2 (31×31 atoms); circle toggle uses Euclidean radius width/2. Agents own temp1550 and heading. Cached neighboring-turtles includes self plus Moore sites; sides-exposed=9-count. go preflight max(temp)<melting550 stops WITHOUT tick. Reset num-frozen; randomized sequential cool-turtles uses (sum(neighboring temps)+room100*sidesExposed+own temp)/10, own twice, preceding writes visible. Separate color phase then separate rotate phase. temp-range=(initial-melting)/6 frozen at setup; color index floor((temp-melting)/range)+1; only index<0 increments num-frozen (NOT simply temp<melting). Liquid temp>=melting copies a random neighbor with temp<=melting (may include self at equality), otherwise random turn. Average after full phase then tick. Histograms are current color bins; num-frozen history uses source threshold. No latent heat, physical units or empirical validation inferred.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="390" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-16" height="400" showTickCounter="true" patchSize="12.0" fontSize="10" wrappingAllowedY="false" width="400" tickCounterLabel="ticks" maxPycor="16" updateMode="1" maxPxcor="16" minPxcor="-16" />
    <slider x="165" step="2" y="7" max="31" width="150" display="height" height="50" min="1" direction="Horizontal" default="31.0" variable="height" units="atoms" />
    <slider x="10" step="2" y="7" max="31" width="150" display="width" height="50" min="1" direction="Horizontal" default="31.0" variable="width" units="atoms" />
    <slider x="10" step="10" y="65" max="2500" width="225" display="init-metal-temp" height="50" min="1550" direction="Horizontal" default="1550.0" variable="init-metal-temp" />
    <button x="35" y="120" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="75">setup</button>
    <button x="115" y="120" height="45" disableUntilTicks="true" forever="false" kind="Observer" width="75" display="go once">go</button>
    <button x="195" y="120" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="90" display="go">go</button>
    <slider x="35" step="1" y="175" max="1500" width="250" display="melting-temp" height="50" min="500" direction="Horizontal" default="550.0" variable="melting-temp" />
    <slider x="35" step="1" y="230" max="100" width="250" display="room-temp" height="50" min="-20" direction="Horizontal" default="100.0" variable="room-temp" />
    <plot x="15" autoPlotX="false" yMax="625.0" autoPlotY="false" yAxis="quantity" y="290" xMin="0.0" height="201" legend="true" xMax="8.0" yMin="0.0" width="300" xAxis="colors" display="Temperatures">
      <setup>set-plot-y-range 0 count turtles
set-histogram-num-bars 1 + (length colors)

let bottom (round room-temp)
let top (round melting-temp)
let index 0
foreach colors [ c -&gt;
  create-temporary-plot-pen (word bottom " - " top)
  set-plot-pen-mode 1
  set-plot-pen-color c
  set pens lput (word bottom " - " top) pens

  set index index + 1
  set bottom top
  set top (round ((index * temp-range) + melting-temp))
]</setup>
      <update>if histogram? [
  let index 0
  foreach colors [ c -&gt;
    set-current-plot-pen (item index pens)
    plot-pen-reset
    if any? turtles with [ color = c ] [
      plotxy index count turtles with [ color = c ]
    ]
    set index index + 1
  ]
]</update>
      <pen interval="1.0" mode="1" display="quantity" color="-2674135" legend="false">
        <setup />
        <update />
      </pen>
    </plot>
    <switch x="245" y="70" height="40" on="false" variable="circle?" width="70" display="circle?" />
    <switch x="40" y="505" height="40" on="true" variable="histogram?" width="123" display="histogram?" />
    <monitor x="170" precision="3" y="495" height="60" fontSize="11" width="115" display="ave-metal-temp">ave-metal-temp</monitor>
    <plot x="600" autoPlotX="true" yMax="625.0" autoPlotY="true" yAxis="crystal quant." y="415" xMin="0.0" height="201" legend="false" xMax="100.0" yMin="0.0" width="275" xAxis="time" display="Number Solidified">
      <setup>set-plot-y-range 0 count turtles</setup>
      <update />
      <pen interval="1.0" mode="0" display="amount" color="-16777216" legend="false">
        <setup />
        <update>plot num-frozen</update>
      </pen>
    </plot>
    <plot x="320" autoPlotX="true" yMax="1550.0" autoPlotY="true" yAxis="ave-metal-temp" y="415" xMin="0.0" height="201" legend="true" xMax="100.0" yMin="20.0" width="275" xAxis="time" display="Average Metal Temperature">
      <setup>set-plot-y-range room-temp init-metal-temp</setup>
      <update />
      <pen interval="1.0" mode="0" display="ave-metal-temp" color="-2674135" legend="false">
        <setup />
        <update>plot ave-metal-temp</update>
      </pen>
    </plot>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
turtles-own [
  temp                ;; this turtle's temperature
  neighboring-turtles ;; agentset of surrounding turtles
  sides-exposed       ;; how many sides turtle has exposed
]

globals [
  ave-metal-temp   ;; shows average temperature of all metal
  num-frozen       ;; keeps track of how many atoms are frozen
  temp-range       ;; for histogram
  colors           ;; used both to color turtles, and for histogram
  pens             ;; keeps track of all the histogram's pen names
]

to setup
  clear-all
  set colors sentence (white - 1) [cyan sky blue violet magenta red]
  set pens []
  set temp-range (init-metal-temp - melting-temp) / (length colors - 1)
  ;; create turtles everywhere inside the given box range
  ask patches [
    if (not circle? and ((abs pycor) < height / 2) and ((abs pxcor) < width / 2))
       or (circle? and distancexy 0 0 < width / 2)
    [
      sprout 1
      [
        set shape "T"
        set temp init-metal-temp
        set-color
      ]
    ]
  ]
  ask turtles [
    set neighboring-turtles (turtles at-points [[-1  1] [ 0  1] [1  1]
                                                [-1  0] [ 0  0] [1  0]
                                                [-1 -1] [ 0 -1] [1 -1]])
    set sides-exposed (9 - (count neighboring-turtles))
  ]
  set ave-metal-temp init-metal-temp
  reset-ticks
end


to go
  ;; stop if all turtles are below melting temp
  if (max ([temp] of turtles) < melting-temp) [ stop ]
  ;; otherwise...
  set num-frozen 0
  ask turtles [ cool-turtles ]
  ask turtles [ set-color ]
  ask turtles [ rotate ]
  set ave-metal-temp (mean [temp] of turtles)
  tick
end

;; turtle procedure -- if metal is liquid and it is next to a solid,
;; change its heading to that of the solid; otherwise, just rotate
;; randomly
to rotate
  if (temp >= melting-temp) [
    let frozen-neighbors (neighboring-turtles with [temp <= melting-temp])
    ifelse (any? frozen-neighbors)
      [ set heading ([heading] of (one-of frozen-neighbors)) ]
      [ rt random-float 360 ]
  ]
end


;; turtle procedure -- sets turtle's temp to ave temp of all
;; neighboring turtles and patches added turtle's own temp in twice so
;; it changes more slowly
to cool-turtles
  let total-temp ((sum [temp] of neighboring-turtles) + (room-temp * sides-exposed) + temp)
  set temp (total-temp / 10)
end

;; turtle procedure
to set-color
  ;; create index ranging from 1 to 8 for all melting colors
  let index (floor ((temp - melting-temp) / temp-range)) + 1
  ifelse (index < 0 ) [
    set color white - 1
    set num-frozen (num-frozen + 1)
  ]
  [
    if index >= length colors
      [ set index (length colors) - 1 ]
    set color item index colors
  ]
end


; Copyright 2002 Uri Wilensky.
; See Info tab for full copyright and license.
```

## DLA

Canonical path: `Sample Models/Chemistry & Physics/Diffusion Limited Aggregation/DLA`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Chemistry%20%26%20Physics/Diffusion%20Limited%20Aggregation/DLA.nlogox. SHA-256 `a9a425d1e2ddda41985a1132b99e8a7a1789e044af54b43c45ac9fec4622d7c0`; bytes 45079; Git blob `461733911fba0ff72007ba0d6aaaf16d2ecac9f4`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard 171×171 lattice. Setup center green, radius0, zero walkers,tick0. go preflight radius>=maxPxcor-3 stops. Birth while count<max-particles100 AND count<ticks (first go births none). Random heading at creation, jump radius+1.5 or maxPxcor85 (use-whole-world default true), then turn180 toward center. Snapshot walkers random sequential: wander turns by U(wiggle60)-U(wiggle60), dies if cannot move1; otherwise forward1. If ANY Moore neighbor is green, mark current patch green, radius=max(radius, continuous distance of walker), die. Later walkers see newly deposited patches. With whole-world false kill beyond radius+3 after sticking check. tick only after completed go; parameters live. Radius uses continuous position, not patch-center distance; no seed/trajectory identity with NetLogo.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="267" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-85" height="517" showTickCounter="true" patchSize="3.0" fontSize="10" wrappingAllowedY="false" width="517" tickCounterLabel="ticks" maxPycor="85" updateMode="1" maxPxcor="85" minPxcor="-85" />
    <slider x="8" step="1" y="141" max="300" width="253" display="max-particles" height="50" min="1" direction="Horizontal" default="100.0" variable="max-particles" />
    <button x="65" y="42" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="63">setup</button>
    <button x="140" y="42" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="63">go</button>
    <slider x="8" step="1.0" y="90" max="360.0" width="253" display="wiggle-angle" height="50" min="0.0" direction="Horizontal" default="60.0" variable="wiggle-angle" units="degrees" />
    <switch x="54" y="221" height="40" on="true" variable="use-whole-world?" width="169" display="use-whole-world?" />
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  radius   ;; distance of the farthest green patch from the center
]

to setup
  clear-all
  set radius 0
  ask patch 0 0
    [ set pcolor green ]
  reset-ticks
end

to go
  ;; stop when we get near the edge of the world
  if radius >= max-pxcor - 3
    [ stop ]
  ;; make new turtles, up to a maximum controlled by the MAX-PARTICLES
  ;; slider; also check clock so we don't make too many turtles too
  ;; soon, otherwise we get a big green clump at the center (only happens
  ;; USE-WHOLE-WORLD? is false)
  while [count turtles < max-particles and
         count turtles < ticks]
    [ make-new-turtle ]
  ;; now move the turtles
  ask turtles
    [ wander
      if any? neighbors with [pcolor = green]
        [ set pcolor green
          ;; increase radius if appropriate
          if distancexy 0 0 > radius
            [ set radius distancexy 0 0 ]
          die ]
      ;; kill turtles that wander too far away from the center
      if not use-whole-world? and distancexy 0 0 > radius + 3
        [ die ] ]
  ;; advance clock
  tick
end

to make-new-turtle
  ;; each new turtle starts its random walk from a position
  ;; a bit outside the current radius and facing the center
  create-turtles 1
    [ set color red
      set size 3  ;; easier to see
      setxy 0 0
      ifelse use-whole-world?
        [ jump max-pxcor ]
        [ jump radius + 1.5 ]
      rt 180 ]
end

to wander   ;; turtle procedure
  ;; the WIGGLE-ANGLE slider makes our path straight or wiggly
  rt random-float wiggle-angle - random-float wiggle-angle
  ;; kill off particles that reach the edge
  if not can-move? 1 [ die ]
  ;; move
  fd 1
end


; Copyright 1997 Uri Wilensky.
; See Info tab for full copyright and license.
```
