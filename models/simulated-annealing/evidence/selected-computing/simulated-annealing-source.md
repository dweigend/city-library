# Simulated Annealing complete source contract inventory

Identity: `Sample Models/Computer Science/Unverified/Simulated Annealing`; SHA-256 `ca4208f3c66a516874234d4f1670ebc20919f9b32a656a84a878a9a41304f6cb`; NetLogo 7.0.4. Includes: None; extensions: [].

All procedures, equations and textual activation order:

```netlogo
globals [ temperature global-energy ]
patches-own [ brightness ]

to setup
  clear-all
  ask n-of ((count patches) / 2) patches
  [
    set brightness 1
  ]
  ask patches [ update-visual ]
  set global-energy (sum [find-energy] of patches )
  set temperature 1
  reset-ticks
end


to go
  repeat 1000
  [
    ask one-of patches [
      try-swap
    ]
  ]
  ; we lower the temperature after 1000 attempted swaps
  set temperature temperature * (1 - cooling-rate / 100)
  set global-energy (sum [find-energy] of patches )
  tick
end

to update-visual
  set pcolor brightness * 9.9  ; 0 = black, 9.9 = white
end

;; The swap (change in state) will always be accepted if the new energy level is lower.
;; There is a switch in the interface (accept-equal-changes) which determines whether
;;   to always accept swaps that lead to equal energy levels.
;; Lastly, even if the swap increases energy, it may be accepted (with probability
;;   proportional to the current "temperature" of the system.)
to-report accept-change? [ old-energy new-energy ]
  report (new-energy < old-energy)
         or (accept-equal-changes? and new-energy = old-energy)
         or ((random-float 1.0) < temperature)
end

to try-swap
  let p2 one-of (patches in-radius swap-radius)
  if (brightness = [brightness] of p2) ; if same color, no point in swapping.
    [ stop ]
  ;; For efficiency, we only compute the change in energy in the region of patches
  ;;    affected by the swap.
  let affected-patches (patch-set self p2 neighbors4 ([neighbors4] of p2))
  let old-energy sum [find-energy] of affected-patches
  swap-values self p2
  let new-energy sum [find-energy] of affected-patches
  ifelse (accept-change? old-energy new-energy)
  [
    update-visual
    ask p2 [ update-visual ]
  ]
  [
    swap-values self p2
  ]
end

to swap-values [ p1 p2 ]
  let temp [ brightness ] of p1
  ask p1 [ set brightness [brightness] of p2 ]
  ask p2 [ set brightness temp ]
end

;; this is the "energy" function for a single patch, which simulated annealing is
;; trying to minimize globally
to-report find-energy  ; patch-procedure
  let unhappiness 0.0
  ask patch-at 0 1 [ set unhappiness unhappiness + (brightness - [brightness] of myself) ^ 2 ]
  ask patch-at 0 -1 [ set unhappiness unhappiness + (brightness - [brightness] of myself) ^ 2 ]
  ask patch-at 1 0 [ set unhappiness unhappiness + 1 - (brightness - [brightness] of myself) ^ 2 ]
  ask patch-at -1 0 [ set unhappiness unhappiness + 1 - (brightness - [brightness] of myself) ^ 2 ]
  ; maximum of 4, minimum of 0
  report unhappiness
end


; Copyright 2009 Uri Wilensky.
; See Info tab for full copyright and license.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="205" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="0" height="424" showTickCounter="true" patchSize="14.0" fontSize="10" wrappingAllowedY="true" width="424" tickCounterLabel="ticks" maxPycor="29" updateMode="1" maxPxcor="29" minPxcor="0" />
    <button x="10" y="37" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="90">setup</button>
    <button x="105" y="37" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="90">go</button>
    <slider x="10" step="0.1" y="144" max="50" width="180" display="cooling-rate" height="50" min="0" direction="Horizontal" default="1.0" variable="cooling-rate" units="%" />
    <slider x="10" step="1" y="196" max="5" width="180" display="swap-radius" height="50" min="1" direction="Horizontal" default="1.0" variable="swap-radius" />
    <switch x="10" y="248" height="40" on="false" variable="accept-equal-changes?" width="180" display="accept-equal-changes?" />
    <monitor x="50" precision="10" y="79" height="60" fontSize="11" width="100">temperature</monitor>
    <monitor x="50" precision="4" y="295" height="60" fontSize="11" width="105">global-energy</monitor>
    <plot x="10" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="energy" y="360" xMin="0.0" height="157" legend="false" xMax="10.0" yMin="0.0" width="180" xAxis="time" display="global energy">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-2674135" legend="true">
        <setup />
        <update>plot global-energy</update>
      </pen>
    </plot>
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](../../../experiments/simulated-annealing/source.nlogox) and [NOTICE](../../../experiments/simulated-annealing/NOTICE.md). Runtime interpretation: [batch contract](../../../docs/development/selected-computing-contract.md). Execution evidence is separate.
