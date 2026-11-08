# Dining Philosophers complete source contract inventory

Identity: `Sample Models/Computer Science/Dining Philosophers`; SHA-256 `94a061a1c0c2d8e69a8e6f3dfd4a154222d44d6676693cdc3430fb7e76d47e51`; NetLogo 7.0.4. Includes: None; extensions: [].

All procedures, equations and textual activation order:

```netlogo
breed [philosophers philosopher]
philosophers-own [
  state                   ;; my current state: "HUNGRY", "EATING", or "THINKING"
  left-fork right-fork    ;; the forks on my right and left
  total-eaten             ;; how much I've had to eat
]

breed [forks fork]
forks-own [
  home-xpos home-ypos home-heading     ;; where I belong when I'm on the table
  owner                                ;; the philosopher that currently owns me (if any)
  marked?                              ;; whether I'm currently marked
]

to setup
  clear-all
  ;; set up the model
  make-turtles
  recolor
  reset-ticks
end

;; create all the turtles, place them, and associate forks with philosophers
to make-turtles
  set-default-shape philosophers "person torso"
  set-default-shape forks "fork"
  ;; create-ordered-<breed> equally spaces the headings of the turtles,
  ;; in who number order
  create-ordered-philosophers num-philosophers [
    set size 0.1
    jump 0.35
    set state "THINKING"
  ]
  create-ordered-forks num-philosophers [
    rt 180 / num-philosophers
    jump 0.25
    rt 180
    set size 0.1
    set marked? false
    set owner nobody
    ;; save my position and heading, so the philosophers can replace me later
    set home-xpos xcor
    set home-ypos ycor
    set home-heading heading
  ]
  ask philosophers [
    set left-fork fork (who + num-philosophers)
    ifelse who = 0
      [ set right-fork fork (2 * num-philosophers - 1) ]
      [ set right-fork fork (who + num-philosophers - 1) ]
  ]
  ask one-of forks [ set marked? true ]
end

to go
  ask one-of philosophers [ update ]
  recolor
  tick
end

;; everybody gets a new color.
to recolor
  ask philosophers [
    ;; look up the color in the colors list indexed by our current state
    ifelse state = "THINKING"
      [ set color blue ]
      [ ifelse state = "HUNGRY"
        [ set color red ]
        [ set color green ] ]
  ]
  ask forks [
    ;; we'll indicate marked forks only if cooperation is on.
    ifelse cooperation? and marked?
      [ set color magenta ]
      [ set color white ]
  ]
end

;; here's where philosophers actually do their thing. note that a philosopher
;; can go through several states in the same call to update.
to update  ;; philosopher procedure
  if state = "THINKING" [
    if random-float 1.0 < hungry-chance [
      set state "HUNGRY"
    ]
    stop
  ]
  if state = "EATING" [
    ;; keep track of how much we're eating.
    set total-eaten (total-eaten + 1)
    if random-float 1.0 < full-chance [
      ;; put down forks
      ifelse cooperation?
        [ release-forks-smart ]
        [ release-forks-naive ]
      ;; continue thinking
      set state "THINKING"
    ]
    stop
  ]
  if state = "HUNGRY" [
    ; try to pick up the forks.
    ifelse cooperation?
      [ acquire-forks-smart ]
      [ acquire-forks-naive ]
    ; if we've got both forks, eat.
    if got? left-fork and got? right-fork
      [ set state "EATING" ]
    stop
  ]
end

;; just drop the forks.
to release-forks-naive  ;; philosopher procedure
  release left-fork
  release right-fork
end

;; a more sophisticated strategy for releasing the forks, which switches any
;; marks to the other fork. see the info tab for details.
to release-forks-smart  ;; philosopher procedure
  ;; check left fork
  ifelse [marked?] of left-fork [
    ask left-fork [ set marked? false ]
    ask right-fork [ set marked? true ]
  ]
  [
    ;; otherwise, check right fork.
    if [marked?] of right-fork [
      ask right-fork [ set marked? false ]
      ask left-fork [ set marked? true ]
    ]
  ]
  ;; release the forks.
  release left-fork
  release right-fork
end

;; to release a fork, we set its owner to nobody and replace it on the table.
to release [the-fork]  ;; philosopher procedure
  ask the-fork [
    if owner != nobody [
      set owner nobody
      setxy home-xpos home-ypos
      set heading home-heading
    ]
  ]
end

;; just try to pick each fork up. if I get only one, i'll just hold it
;; until I get the other one.
to acquire-forks-naive  ;; philosopher procedure
  if [owner] of left-fork = nobody
    [ acquire-left ]
  if [owner] of right-fork = nobody
    [ acquire-right ]
end

;; a more sophisticated strategy for acquiring the forks. see the info tab
;; for details.
to acquire-forks-smart  ;; philosopher procedure
  if [owner] of left-fork = nobody [
    if ([not marked?] of left-fork) or got? right-fork
      [ acquire-left ]
  ]
  if [owner] of right-fork = nobody [
    if ([not marked?] of right-fork) or got? left-fork
      [ acquire-right ]
  ]
end

;; grab the left fork. set its owner to me and move it
to acquire-left  ;; philosopher procedure
  ask left-fork [
    set owner myself
    move-to owner
    set heading [heading] of owner
    rt 8  fd 0.1
  ]
end

;; grab the right fork. set its owner to me and move it
to acquire-right  ;; philosopher procedure
  ask right-fork [
    set owner myself
    move-to owner
    set heading [heading] of owner
    lt 8  fd 0.1
  ]
end

;; I've got a fork if it's owned by me.
to-report got? [the-fork]  ;; philosopher procedure
  report self = [owner] of the-fork
end


; Copyright 2003 Uri Wilensky.
; See Info tab for full copyright and license.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="354" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="0" height="404" showTickCounter="true" patchSize="400.0" fontSize="10" wrappingAllowedY="false" width="404" tickCounterLabel="ticks" maxPycor="0" updateMode="1" maxPxcor="0" minPxcor="0" />
    <button x="10" y="82" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="69">setup</button>
    <button x="85" y="82" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="70">go</button>
    <slider x="10" step="1.0" y="30" max="40.0" width="173" display="num-philosophers" height="50" min="2.0" direction="Horizontal" default="20.0" variable="num-philosophers" />
    <slider x="10" step="0.01" y="124" max="1.0" width="173" display="hungry-chance" height="50" min="0.0" direction="Horizontal" default="0.5" variable="hungry-chance" />
    <slider x="10" step="0.01" y="176" max="1.0" width="173" display="full-chance" height="50" min="0.0" direction="Horizontal" default="0.5" variable="full-chance" />
    <plot x="8" autoPlotX="true" yMax="25.0" autoPlotY="true" yAxis="Spaghetti" y="236" xMin="0.0" height="170" legend="false" xMax="100.0" yMin="0.0" width="337" xAxis="Philosopher ID" display="Spaghetti consumed">
      <setup>set-plot-x-range 0 (count philosophers + 1)</setup>
      <update />
      <pen interval="1.0" mode="1" display="default" color="-13345367" legend="false">
        <setup />
        <update>plot-pen-reset
ask philosophers [ plotxy who total-eaten ]</update>
      </pen>
    </plot>
    <plot x="8" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="No. of philosophers" y="408" xMin="0.0" height="199" legend="true" xMax="100.0" yMin="0.0" width="337" xAxis="Time" display="Resource allocation">
      <setup>set-plot-y-range 0 (count philosophers)</setup>
      <update />
      <pen interval="1.0" mode="0" display="Thinking" color="-13345367" legend="true">
        <setup />
        <update>plot count philosophers with [state = "THINKING"]</update>
      </pen>
      <pen interval="1.0" mode="0" display="Hungry" color="-2674135" legend="true">
        <setup />
        <update>plot count philosophers with [state = "HUNGRY"]</update>
      </pen>
      <pen interval="1.0" mode="0" display="Eating" color="-10899396" legend="true">
        <setup />
        <update>plot count philosophers with [state = "EATING"]</update>
      </pen>
    </plot>
    <switch x="190" y="124" height="40" on="false" variable="cooperation?" width="151" display="cooperation?" />
    <button x="160" y="82" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="76" display="go once">go</button>
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](../../../experiments/dining-philosophers/source.nlogox) and [NOTICE](../../../experiments/dining-philosophers/NOTICE.md). Runtime interpretation: [batch contract](../../../docs/development/selected-computing-contract.md). Execution evidence is separate.
