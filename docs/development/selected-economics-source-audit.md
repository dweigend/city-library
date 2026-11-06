# Selected economics exact served source audit

Inventory Galapagos revision `90be931773fcf499049247a8aaa1aecbe003654c`. Archived research originals copied only after SHA-256, byte count and pinned Git blob match. Desktop membership is not Web catalog membership. No new literature pass.

## Fruit Wars

Canonical path: `Sample Models/Social Science/Economics/Fruit Wars`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Fruit%20Wars.nlogox. SHA-256 `42551ae637f11439da6cd3e715a3830779f8f00dbe864c5590a96216422386ae`; bytes 64650; Git blob `1e3368bd9b6ffd4e6a6536479b1037849107317e`. Includes `None`; extensions `[]`.

### Binding semantic audit

Wrapped 65x65. Forty bushes sampled from separated modulo-3 sites, amounts500+random501; forty foragers with240-bit genomes, energy100. Sequential random forager asks; fleeing branch excludes energy/reproduction, foraging drains bush10 but credits intelligence/group bonus; movement costs1. Arrival threats/fights can kill different membership from count-fighters: preserve source counters. Reproduction at energy>200 mutates bits, child resets age/energy/flags. Age>max-age dies. Death marks expire age>10. Empty population stops before any work. Bush growth n-of1 may fail if no eligible sites. Average population uses PRE-tick denominator and starts0; death-count unused. Source plot mean on extinct set can fail. Visualization/labels are presentation. Defaults and all plot equations below.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="490" wrappingAllowedX="true" y="7" frameRate="30.0" minPycor="-32" height="719" showTickCounter="true" patchSize="11.0" fontSize="10" wrappingAllowedY="true" width="719" tickCounterLabel="ticks" maxPycor="32" updateMode="1" maxPxcor="32" minPxcor="-32" />
    <slider x="5" step="1" y="7" max="40" width="205" display="initial-fruit-bushes" height="50" min="0" direction="Horizontal" default="40.0" variable="initial-fruit-bushes" />
    <monitor x="5" precision="17" y="265" height="60" fontSize="11" width="100" display="Population">count foragers</monitor>
    <monitor x="110" precision="17" y="265" height="60" fontSize="11" width="100" display="Avg Population">precision average-population 3</monitor>
    <chooser x="5" y="200" height="60" variable="visualization" current="1" width="205" display="visualization">
      <choice type="string" value="None" />
      <choice type="string" value="Reactive Aggression" />
      <choice type="string" value="Proactive Aggression" />
      <choice type="string" value="Strength" />
      <choice type="string" value="Speed" />
      <choice type="string" value="Intelligence" />
    </chooser>
    <button x="43" y="115" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="63">setup</button>
    <switch x="43" y="155" height="40" on="false" variable="show-energy?" width="130" display="show-energy?" />
    <button x="110" y="115" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="63">go</button>
    <slider x="5" step="1" y="60" max="100" width="205" display="initial-foragers" height="50" min="1" direction="Horizontal" default="40.0" variable="initial-foragers" />
    <slider x="5" step="1" y="330" max="100" width="205" display="ticks-to-flee" height="50" min="0" direction="Horizontal" default="49.0" variable="ticks-to-flee" />
    <slider x="5" step="0.1" y="385" max="10" width="205" display="rate-of-mutation" height="50" min="0" direction="Horizontal" default="1.0" variable="rate-of-mutation" />
    <slider x="5" step="0.01" y="440" max="5" width="205" display="collaboration-bonus" height="50" min="0.1" direction="Horizontal" default="5.0" variable="collaboration-bonus" />
    <slider x="5" step="1" y="495" max="500" width="205" display="max-age" height="50" min="1" direction="Horizontal" default="500.0" variable="max-age" />
    <slider x="5" step="1" y="550" max="100" width="205" display="bush-growth-chance" height="50" min="0" direction="Horizontal" default="6.0" variable="bush-growth-chance" />
    <plot x="5" autoPlotX="true" yMax="10.0" autoPlotY="true" y="605" xMin="0.0" height="150" legend="false" xMax="10.0" yMin="0.0" width="205" display="Forage Rate">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot avg-forage</update>
      </pen>
    </plot>
    <plot x="215" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis=" Values" y="605" xMin="0.0" height="150" legend="true" xMax="10.0" yMin="0.0" width="270" xAxis="Ticks" display="Traits over Time">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Strength" color="-2674135" legend="true">
        <setup />
        <update>plot mean [strength] of foragers</update>
      </pen>
      <pen interval="1.0" mode="0" display="Speed" color="-13840069" legend="true">
        <setup />
        <update>plot mean [speed] of foragers</update>
      </pen>
      <pen interval="1.0" mode="0" display="Intelligence" color="-13345367" legend="true">
        <setup />
        <update>plot mean [intelligence] of foragers</update>
      </pen>
    </plot>
    <plot x="215" autoPlotX="true" yMax="10.0" autoPlotY="true" y="395" xMin="0.0" height="205" legend="true" xMax="61.0" yMin="0.0" width="270" display="Types of Aggression (Histogram)">
      <setup />
      <update />
      <pen interval="1.0" mode="1" display="Reactive" color="-817084" legend="true">
        <setup />
        <update>histogram [reactive-aggression] of foragers</update>
      </pen>
      <pen interval="1.0" mode="1" display="Proactive" color="-5825686" legend="true">
        <setup />
        <update>histogram [proactive-aggression] of foragers</update>
      </pen>
    </plot>
    <plot x="215" autoPlotX="true" yMax="60.0" autoPlotY="true" yAxis="Value" y="215" xMin="0.0" height="170" legend="true" xMax="10.0" yMin="0.0" width="270" xAxis="Ticks" display="Types of Aggression (Mean)">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Reactive" color="-817084" legend="true">
        <setup />
        <update>plot mean [reactive-aggression] of foragers</update>
      </pen>
      <pen interval="1.0" mode="0" display="Proactive" color="-5825686" legend="true">
        <setup />
        <update>plot mean [proactive-aggression] of foragers</update>
      </pen>
    </plot>
    <plot x="215" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="Percent" y="7" xMin="0.0" height="200" legend="true" xMax="10.0" yMin="0.0" width="270" xAxis="Ticks" display="Deaths by Type">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Murders" color="-16777216" legend="true">
        <setup />
        <update>plot murder-rate</update>
      </pen>
      <pen interval="1.0" mode="0" display="Old Age" color="-8431303" legend="true">
        <setup />
        <update>plot age-death-rate</update>
      </pen>
      <pen interval="1.0" mode="0" display="Starvation" color="-15302303" legend="true">
        <setup />
        <update>plot starvation-rate</update>
      </pen>
    </plot>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
breed [ foragers forager ] ; foragers are the main agents in the model
breed [ fruit-bushes fruit-bush ] ; bushes that are foraged from
breed [ deaths death ] ; red marks representing homicides

foragers-own
[
  energy ; metabolic energy
  genome ; list encoding parameters that is heritable
  foraging? ; boolean status whether forager is foraging
  fleeing? ; boolean status whether forager is fleeing
  fleeing-turns ; number of turns remaining to flee if fleeing
  age ; age of forager in ticks
  speed ; speed attribute determines movement
  strength ; strength attribute determines fighting success
  intelligence ; intelligence attribute determines group foraging rate
  reactive-aggression ; determines likelihood to threaten on arrival
  proactive-aggression ; determines likelihood to defend
]

fruit-bushes-own
[
  amount ; amount of energy in bush
]

deaths-own
[
  age ; persistence of red-X
]

globals
[
  murder-count ; total number of homicides
  starvation-count ; total number of starvation events
  age-death-count ; total deaths from old age
  death-count ; total of all deaths
  murder-rate ; rate of murders to all deaths
  starvation-rate ; rate of starvation events to all deaths
  age-death-rate ; rate of deaths from old age to all deaths
  total-foraged ; total amount foraged
  num-forages ; total number of forages
  avg-forage ; average yield of forages
  total-population ; total foragers in all ticks
  average-population ; average foragers alive in any given tick
]

to setup ; initial setup
  clear-all
  ask patches [ set pcolor 53 ]
  grow-fruit-bushes initial-fruit-bushes
  create-foragers initial-foragers
  [
    set shape "person"
    set color gray
    set size 2
    set xcor random-xcor
    set ycor random-ycor
    set energy 100
    set genome new-genome 240
    set foraging? false
    set fleeing? false
    set strength get-strength
    set speed get-speed
    set intelligence get-intelligence
    set reactive-aggression get-reactive-aggression
    set proactive-aggression get-proactive-aggression
    set age 0
  ]
  set total-population 0
  set murder-count 0
  set death-count 0
  set murder-rate 0
  set num-forages 0
  set total-foraged 0
  set avg-forage 0
  reset-ticks
end

to grow-fruit-bushes [ num-bushes ] ; procedure to create fruit-bushes on a grid without overlap
  ask n-of num-bushes patches with ; only spawn new bushes on patches spaced 3 apart
  [
    pxcor mod 3 = 0
    and pycor mod 3 = 0
    and (abs (pycor - max-pycor)) > 1 ; avoid being to closer to the edge
    and (abs (pxcor - max-pxcor)) > 1
    and (abs (pycor - min-pycor)) > 1
    and (abs (pxcor - min-pxcor)) > 1
    and not any? fruit-bushes-here
  ]
  [
    sprout-fruit-bushes 1
    [
      set shape "Bush"
      set color one-of [ red blue orange yellow ]
      set amount 500 + random 501
      set size 3
    ]
  ]
end

to go
  if not any? foragers [ stop ]
  ask deaths ; draw red Xs on the view
  [
    set age age + 1
    if age > 10 [ die ]
  ]
  if random 100 < bush-growth-chance [ grow-fruit-bushes 1 ]
  move-foragers ; producer to handle foragers' actions
  if-else (murder-count + age-death-count + starvation-count) = 0
  [
    set murder-rate 0
    set starvation-rate 0
    set age-death-rate 0
  ]
  [
    set murder-rate 100 * murder-count / (murder-count + age-death-count + starvation-count)
    set starvation-rate 100 * starvation-count / (murder-count + age-death-count + starvation-count)
    set age-death-rate 100 * age-death-count / (murder-count + age-death-count + starvation-count)
  ]
  if-else num-forages = 0
    [ set avg-forage 0 ]
    [ set avg-forage total-foraged / num-forages ]

  set total-population total-population + count foragers
  if-else ticks = 0
    [ set average-population 0 ]
    [ set average-population total-population / ticks ]
  tick
end

to move-foragers ; forager procedure
  ask foragers
  [
    if-else fleeing? ; if they are fleeing only move randomly
    [
      lt (random 31) - 15
      fd (speed / 60)
      set fleeing-turns fleeing-turns - 1
      if fleeing-turns = 0 [ set fleeing? false ]
    ]
    [
      if-else any? fruit-bushes in-radius 0.1 and foraging?
      [
        forage
      ]
      [
        set foraging? false
        if-else any? fruit-bushes in-radius 5
        [ ; face nearest fruit-bush in radius of 5 units
          face min-one-of fruit-bushes in-radius 5 [distance myself]
        ]
        [
          lt (random 31) - 15
        ]
        if-else any? fruit-bushes in-radius 1
        [ ; arrive at any fruit-bush closer than 1 unit away
          move-to one-of fruit-bushes in-radius 1
          arrive
        ]
        [
          fd (speed / 60)
          set energy energy - 1
        ]
        if energy < 0
        [
          set starvation-count starvation-count + 1
          die
        ]
        if energy > 200
        [ ; reproduce
          set energy energy - 100
          hatch-foragers 1
          [
            set genome mutate [genome] of myself rate-of-mutation
            set shape "person"
            set color gray
            set size 2
            set energy 100
            set foraging? false
            set fleeing? false
            set strength get-strength
            set speed get-speed
            set intelligence get-intelligence
            set reactive-aggression get-reactive-aggression
            set proactive-aggression get-proactive-aggression
            set age 0
          ]
        ]
      ]
    ]
    set age age + 1
    if age > max-age
    [
      set age-death-count age-death-count + 1
      die
    ]
    if-else show-energy?
      [ set label precision energy 0 ]
      [ set label " " ]
    (ifelse
      visualization = "Strength"
      [
        set color scale-color red strength 0 40
      ]
      visualization = "Speed"
      [
        set color scale-color green speed 0 40
      ]
      visualization = "Intelligence"
      [
        set color scale-color blue intelligence 0 40
      ]
      visualization = "Reactive Aggression"
      [
        set color scale-color orange reactive-aggression 0 40
      ]
      visualization = "Proactive Aggression"
      [
        set color scale-color 115 proactive-aggression 0 40
      ]
      [
        set color grey
    ])
  ]
end

to arrive ; forager procedure
  if-else any? other foragers in-radius 0.1
  [
    if-else random-float 1 < (reactive-aggression / 60)
    [ ; determines whether arriving forager threatens
      let count-fighters 0
      let total-strength 0
      ask other foragers in-radius 0.1
      [
        if-else random-float 1 < (proactive-aggression / 60)
        [ ; determines if other forager fights back
          set count-fighters count-fighters + 1
          set total-strength total-strength + strength
        ]
        [ ; they relent
          set foraging? false
          set fleeing? true
          set fleeing-turns ticks-to-flee
        ]
      ]
      if-else count-fighters > 0
      [
        if-else random-float 1 < (strength / ((total-strength * 0.75) + strength))
        [
          set murder-count murder-count + count-fighters
          ask other foragers in-radius 0.1 with [foraging?]
          [
            hatch-deaths 1 [set color red set shape "x" set age 0]
            die
          ]
        ]
        [
          set murder-count murder-count + 1
          hatch-deaths 1 [set color red set shape "x" set age 0]
          die
        ]
      ]
      [
        set foraging? true
      ]
    ]
    [ ; arriving forager cooperates
      let okay? true
      if (count other foragers in-radius 0.1) = 1
      [ ; if there is more than one forager present
        ; assume they have already cooperated
        ask other foragers in-radius 0.1
        [
          if random-float 1 < (reactive-aggression / 60)
          [ ; they threaten me
            set okay? false
          ]
        ]
      ]
      if-else okay?
      [
        set foraging? true
      ]
      [
        set fleeing? true
        set fleeing-turns ticks-to-flee
      ]
    ]
  ]
  [
    set foraging? true
  ]
end

to forage ; forager procedure
  let forage-rate 0
  if-else any? other foragers in-radius 0.1 with [foraging?]
  [ ; set foraging rate based on average group intelligence and collab-bonus
    let i-n sum [intelligence] of foragers in-radius 0.1 with [foraging?]
    let i-d (count foragers in-radius 0.1 with [foraging?]) * 20
    let i-ratio i-n / i-d
    set forage-rate i-ratio * 10 * collaboration-bonus
  ]
  [
    set forage-rate 10
  ]

  ask one-of fruit-bushes in-radius 0.1
  [
    set amount amount - 10
    if (amount < 0) [ die ]
  ]
  set energy energy + forage-rate
  set num-forages num-forages + 1
  set total-foraged total-foraged + forage-rate
end

to-report new-genome [ size-of ]
  let a-genome []
  repeat size-of [set a-genome lput random 2 a-genome]
  report a-genome
end

to-report mutate [ a-genome mutation-rate ]
  let n-genome []
  foreach a-genome [ x ->
    let roll random-float 100
    if-else roll < mutation-rate [
      if-else x = 1 [set n-genome lput 0 n-genome]
      [set n-genome lput 1 n-genome]
    ]
    [
      set n-genome lput x n-genome
    ]
  ]
  report n-genome
end

to-report divider1 ; forager reporter
  let s 0
  let c 0
  repeat 60 [set s s + item c genome set c c + 1]
  report s
end

to-report divider2 ; forager reporter
  let s 0
  let c 0
  repeat 60 [ set s s + item (c + 60) genome set c c + 1 ]
  report s
end

to-report get-intelligence ; forager reporter
  report min (list divider1 divider2)
end

to-report get-speed ; forager reporter
  report abs (divider1 - divider2)
end

to-report get-strength ; forager reporter
  report 60 - (max (list divider1 divider2))
end

to-report get-reactive-aggression ; forager reporter
  let s 0
  let c 0
  repeat 60 [ set s s + item (c + 120) genome set c c + 1 ]
  report s
end

to-report get-proactive-aggression ; forager reporter
  let s 0
  let c 0
  repeat 60 [ set s s + item (c + 180) genome set c c + 1 ]
  report s
end


; Copyright 2019 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Limited Order Book

Canonical path: `Sample Models/Social Science/Economics/Limited Order Book`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Limited%20Order%20Book.nlogox. SHA-256 `acb1b7eeeabf99a1bf651bfcae391273fce16bae15c9e67bb64ee9ef0ebdb597`; bytes 65701; Git blob `fca56d6ebbe98af7592b4df88b8d5dd45c90456b`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard41x41,50 honest+50 cunning. Reusable two orders per trader, separate pending/removed/listed states and owner references. random amount is integer random(amount)*.5+amount*.5. Orders rebuilt each go; utility refreshed BEFORE matching (lagged). Random pending-order activation, strict ask<bid crossing, equal prices do not trade. Execution price min(bid,ask), affordable units floor(cash/price/unit)*unit, stock bound and remaining bound; cash/tokens conserved. Inserts equal prices ahead despite comment older-first. Cunning uses previous best quotes. Recent EWMA .1; price-to-date divides total-volume/total-amount without zero guard: source zero-trade scenario error retained explicitly. No terminal condition. Precision setup-only trade-unit; initial assets/counts setup-only.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="203" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-20" height="537" showTickCounter="true" patchSize="13.0" fontSize="13" wrappingAllowedY="false" width="537" tickCounterLabel="ticks" maxPycor="20" updateMode="1" maxPxcor="20" minPxcor="-20" />
    <button x="15" y="11" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="80">setup
</button>
    <monitor x="960" precision="2" y="35" height="60" fontSize="11" width="113" display="Price to Date$">price-to-date</monitor>
    <monitor x="760" precision="2" y="35" height="60" fontSize="11" width="103" display="Latest Price$">latest-price</monitor>
    <monitor x="856" precision="2" y="35" height="60" fontSize="11" width="105" display="Latest Volume$">latest-volume</monitor>
    <monitor x="1195" precision="2" y="35" height="60" fontSize="11" width="100" display="Total Cash$">global-cash</monitor>
    <monitor x="1071" precision="2" y="35" height="60" fontSize="11" width="125" display="Circulating Tokens">global-tokens</monitor>
    <plot x="760" autoPlotX="true" yMax="5.0" autoPlotY="true" yAxis="Price" y="106" xMin="0.0" height="157" legend="true" xMax="20.0" yMin="5.0" width="525" xAxis="Ticks" display="Trading Prices">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Latest" color="-13345367" legend="true">
        <setup />
        <update>if ticks &gt; 0 [ plot latest-price ]</update>
      </pen>
    </plot>
    <note x="14" y="124" backgroundDark="0" fontSize="12" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Basic Parameters</note>
    <slider x="12" step="1" y="142" max="3" width="172" display="trade-precision" height="50" min="0" direction="Horizontal" default="0.0" variable="trade-precision" />
    <note x="13" y="208" backgroundDark="0" fontSize="12" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Traders &amp; Strategies</note>
    <slider x="12" step="1" y="228" max="100" width="172" display="honest-traders" height="50" min="0" direction="Horizontal" default="50.0" variable="honest-traders" />
    <slider x="12" step="1" y="286" max="100" width="172" display="cunning-traders" height="50" min="0" direction="Horizontal" default="50.0" variable="cunning-traders" />
    <note x="760" y="14" backgroundDark="0" fontSize="12" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Market situation</note>
    <note x="762" y="284" backgroundDark="0" fontSize="12" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Utility distribution</note>
    <monitor x="760" precision="0" y="306" height="60" fontSize="11" width="108" display="Total Utilities">sum [ utility ] of traders</monitor>
    <monitor x="867" precision="0" y="306" height="60" fontSize="11" width="117" display="Average Utilities">mean [ utility ] of traders</monitor>
    <monitor x="982" precision="0" y="306" height="60" fontSize="11" width="100" display="Avg (Honest)">mean [ utility ] of traders with [ strategy = "honest" ]</monitor>
    <monitor x="1080" precision="0" y="306" height="60" fontSize="11" width="100" display="Avg (Cunning)">mean [ utility ] of traders with [ strategy = "cunning" ]</monitor>
    <monitor x="1179" precision="3" y="306" height="60" fontSize="11" width="125" display="Cunning : Honest %">mean [ utility ] of traders with [ strategy = "cunning" ] / mean [ utility ] of traders with [ strategy = "honest" ] * 100</monitor>
    <plot x="760" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="Utilities" y="376" xMin="0.0" height="157" legend="true" xMax="10.0" yMin="0.0" width="527" xAxis="Ticks" display="Average Utilities Gain (%)">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Everyone" color="-11053225" legend="true">
        <setup />
        <update>if count traders = 0 [ stop ]
plot mean [ utility / initial-utility * 100 - 100 ] of traders</update>
      </pen>
      <pen interval="1.0" mode="0" display="Cunning" color="-13345367" legend="true">
        <setup />
        <update>if count traders with [ strategy = "cunning" ] = 0 [ stop ]
plot mean [ utility / initial-utility * 100 - 100 ] of traders with [ strategy = "cunning" ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="Honest" color="-10899396" legend="true">
        <setup />
        <update>if count traders with [ strategy = "honest" ] = 0 [ stop ]
plot mean [ utility / initial-utility * 100 - 100 ] of traders with [ strategy = "honest" ]</update>
      </pen>
    </plot>
    <slider x="12" step="1" y="345" max="2000" width="172" display="initial-cash" height="50" min="0" direction="Horizontal" default="1000.0" variable="initial-cash" units="$" />
    <slider x="12" step="1" y="404" max="200" width="172" display="initial-tokens" height="50" min="0" direction="Horizontal" default="50.0" variable="initial-tokens" />
    <slider x="11" step="1" y="464" max="100" width="172" display="initial-belief" height="50" min="0" direction="Horizontal" default="25.0" variable="initial-belief" />
    <button x="100" y="10" height="70" disableUntilTicks="true" forever="true" kind="Observer" width="85">go</button>
    <button x="15" y="45" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="80" display="go-once">go</button>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
;;; Global variables
globals [
  ; Global statistics
  trade-unit
  global-cash
  global-devotion
  global-tokens

  ; Global status
  asks          ; list<order>, Listed selling orders.
  bids          ; list<order>, Listed buying orders.
  latest-volume ; number, Latest average trading price (in $).
  latest-amount ; number, Latest trading amount (in $)
  latest-price  ; number, Latest average trading price (in $).
  total-volume  ; number, Total trading volume.
  total-amount  ; number, Total trading amount (in $)

  ; Some cache to improve the computational performance
  best-bid-price
  best-ask-price
  recent-price
  recent-amount
  recent-volume
  recent-change
  price-to-date
]

breed [ orders order ]  ; Each order (which is, in our case, always limited) is represented as a turtle.
orders-own [
  pending?    ; boolean, Whether the order is still pending? (and therefore, not matched yet and not visible to other pops)
  removed?    ; Whether the order has been removed? (we intend to reuse the turtle structure for optimization)
  buy-side?   ; boolean, True/Buy, False/Sell
  price       ; number, Price Limit
  quantity    ; number, Size of the order
  owner       ; turtle, Owner Turtle
  remaining   ; number, Remaining quantity of the order
]

; Each behavioral agent is represented as a turtle.
; Trader: represents a party that is capable to trade the token (representing gold, silver, stock, cryptocurrency token, etc).
breed [ traders trader ]
traders-own [
  cash       ; number, Cash at hand
  stockpile  ; table (or map) between <any, number>, Stockpile of the trader
  my-bid      ; order, The bidding order of mine
  my-ask      ; order, The asking order of mine
  belief     ; number, Constant belief of the price ($)
  utility    ; number, Cash + Belief * Stockpile ($)
  initial-utility ; number, utility value before the trading starts
  strategy   ; number, pre-defined strategy of the trader
]

;;; Backbone of the model
; setup: Initialize the model
to setup
  clear-all
  reset-ticks

  create-turtles 1 [
    set shape "circle"
  ]

  ; Create and populate traders
  create-traders honest-traders [
    set strategy "honest"
  ]
  create-traders cunning-traders [
    set strategy "cunning"
  ]

  ; Both kind of traders receive initial assets under the same rule
  ask traders [
    populate-trader
    set cash get-random-amount initial-cash
    set stockpile get-random-amount initial-tokens
    set belief get-random-amount initial-belief
    set utility cash + belief * stockpile
    set initial-utility utility
  ]
  arrange-traders

  ; Calculate the global statistics
  set global-tokens max list sum [ stockpile ] of traders 1
  set global-cash max list sum [ cash ] of traders 1

  ; Trade unit is calculated by the trade precision (e.g. precision=0, unit=1; precision=2, unit=0.01)
  set trade-unit 10 ^ (trade-precision * -1)
  render-traders
end

; go: Loop of the model
to go
  ; Clear previous orders
  let previous-price latest-price
  set asks []
  set bids []

  ; Ask people to trade
  ask traders [
    if strategy = "honest" [ honest-strategy ]
    if strategy = "cunning" [ cunning-strategy ]
    set utility cash + belief * stockpile
  ]
  matchmake-all
  calculate-info previous-price

  ; When there are no referencing prices, use the latest price to help inform traders
  ifelse length bids > 0 and length asks > 0 [
    set best-bid-price [ price ] of item 0 bids
    set best-ask-price [ price ] of item 0 asks
  ] [ calculate-best-order latest-price ]

  ; Finish the tick
  render-traders
  tick
end

; Calculate some information for the next tick
to calculate-info [ previous-price ]
  ifelse previous-price = 0 [
    set recent-change 0
    set recent-amount latest-amount
    set recent-volume latest-volume
    set recent-price latest-price
  ] [
    ifelse latest-amount > 0 [
      set recent-change moving-average recent-change ln (latest-price / previous-price)
      set recent-amount moving-average recent-amount latest-amount
      set recent-volume moving-average recent-volume latest-volume
      set recent-price recent-volume / recent-amount
    ] [
      set recent-change moving-average recent-change 0
    ]
  ]
  set price-to-date total-volume / total-amount
end

; honest-strategy: The "Honest" strategy
to honest-strategy
  if cash >= belief [
    submit-order my-bid belief 1
  ]
  if stockpile > 0 [
    ; We seek to prevent trading with oneself, and this is the easiest way - just add 0.01 to avoid it
    submit-order my-ask 0.01 + belief 1
  ]
end

; honest-strategy: The "Cunning" strategy
to cunning-strategy
  ; Get the best selling price and use it, if it is lower than my belief
  let purchase-price belief
  if best-ask-price != 0 and best-ask-price < purchase-price [ set purchase-price best-ask-price ]
  ; Get the best buying price and use it, if it is higher than my belief
  let sell-price belief + 0.01
  if best-bid-price > sell-price [ set sell-price best-bid-price ]
  ; Submit the orders
  if (cash >= purchase-price) [
    submit-order my-bid purchase-price 1
  ]
  if (stockpile > 0) [
    submit-order my-ask sell-price 1
  ]
end

;;; Helper: Distribution
; random-amount: Get a random amount of a uniform distribution from [amount/2, amount]
to-report get-random-amount [ amount ]
  report random amount * 0.5 + amount * 0.5
end

; moving-average: Get exponentially weighted moving average. 0 is impossible for price, so we treat it as NULL.
to-report moving-average [ existing-value new-value ]
  let weight 0.1
  report existing-value * (1 - weight) + new-value * weight
end

;;; Helper: Renderer
; Render all traders.
to render-traders
  if latest-amount = 0 [ stop ]
  ; Traders
  ask traders [
    set label precision stockpile trade-precision
  ]
  ; Market
  ask turtle 0 [
    set size sqrt latest-amount
    ifelse recent-change > 0 [
      set color scale-color red (recent-change / recent-price) 200 0
    ] [
      set color scale-color green (recent-change / recent-price) -200 0
    ]
  ]
end

; Arrange the traders in a circle.
to arrange-traders
  if behaviorspace-run-number != 0 [ stop ]
  let index 0
  let angle 360 / count traders
  ; We want to keep traders in the same order even when you dynamically introduce new trader.
  ; With "ask turtles", once new traders get introduced, we would get into trouble.
  foreach sort-on [who] traders [
    the-trader ->
      ask the-trader [
        setxy 0 0
        set heading index * angle
        fd max-pxcor * 0.9
      ]
      set index index + 1
  ]
end

; The following code is the basis of the matchmake mechanism
;;; Mechanism-related code
; This serves as a constructor which needs to be executed to initialize the trader
to populate-trader
  set my-bid spawn-order true
  set my-ask spawn-order false
  set size 2
end

; Spawn an order and return it / turtle-context
to-report spawn-order [ s ]
  let current 0
  hatch-orders 1 [
    set buy-side? s
    set pending? false
    set removed? true
    set hidden? true
    set current self
    set owner myself
  ]
  report current
end

; We are trying to re-use orders to boost the performance of traders
; s accepts an order; p means price; q means quantity.
to submit-order [ s p q ]
  if p <= 0 [ error "Price cannot go below zero!" ]
  if q <= 0 [ error "Quantity cannot go below zero!" ]
  ask s [
    set removed? false
    set pending? true
    set price p
    set quantity q
    set remaining q
  ]
end

; Matchmake all pending? orders
; All pending? orders are randomly sent to the market and get matched
; See the info tab for more details
to matchmake-all
  set latest-amount 0
  set latest-volume 0
  calculate-best-order 0
  let eligible-orders orders with [ removed? = false and pending? = true ]
  ask eligible-orders [ matchmake ]
  if latest-amount > 0 [ set latest-price latest-volume / latest-amount ]
end

; Matchmake a single pending? order
; If a trader run out of money/stockpile, the orders we touched will be cancelled
to matchmake
  set pending? false
  ; Deal with the order: if the order is fully fulfilled, we stop and skip the listing process
  ifelse buy-side? [
    ; Remove impossible orders to optimize the performance
    if price < best-ask-price [
      set removed? true
      stop
    ]
    ; Buy order
    while [ length asks > 0 and [ price ] of first asks < price ] [
      execute-order self first asks
      if removed? = true [ stop ]
    ]
  ] [
    ; Remove impossible orders to optimize the performance
    if price > best-bid-price [
      set removed? true
      stop
    ]
    ; Sell order
    while [ length bids > 0 and [ price ] of first bids > price ] [
      execute-order first bids self
      if removed? = true [ stop ]
    ]
  ]
  ; Finish the process and list this offer
  ; Here, we linearly find the proper position of this offer, and insert it
  ifelse buy-side? [
    let len length bids
    ifelse len = 0 [
      set bids (list self)
    ] [
      let index 0
      while [ index < len and [ price ] of (item index bids) > price ] [ set index index + 1 ]
      set bids insert-item index bids self
    ]
  ] [
    let len length asks
    ifelse len = 0 [
      set asks (list self)
    ] [
      let index 0
      while [ index < len and [ price ] of (item index asks) < price ] [ set index index + 1 ]
      set asks insert-item index asks self
    ]
  ]
end

; Calculate "Best" orders (the buying order with the highest price; the selling order with the lowest price)
to calculate-best-order [ default ]
  let best-bid max-one-of orders with [ removed? = false and buy-side? = true ] [ price ]
  set best-bid-price ifelse-value best-bid = nobody [ default * 0.999 ] [ [ price ] of best-bid ]
  let best-ask min-one-of orders with [ removed? = false and buy-side? = false ] [ price ]
  set best-ask-price ifelse-value best-ask = nobody [ default * 1.001 ] [ [ price ] of best-ask ]
end

; Order sorter (by price, asc)
; Implicit tiebreaker: time of the order (older orders get prioritized)
to-report min-order [ order1 order2 ]
  if order1 = nobody or [ removed? ] of order1 [
    ifelse order2 = nobody or [ removed? ] of order2
      [ report nobody ]
      [ report order2 ]
  ]
  if order2 = nobody or [ removed? ] of order2 [ report order1 ]
  ifelse [ price ] of order1 > [ price ] of order2
  [ report order2 ]
  [ report order1 ]
end

; Order sorter (by price, descending)
; Implicit tiebreaker: time of the order (older orders get prioritized)
to-report max-order [ order1 order2 ]
  if order1 = nobody or [ removed? ] of order1 [
    ifelse order2 = nobody or [ removed? ] of order2
      [ report nobody ]
      [ report order2 ]
  ]
  if order2 = nobody or [ removed? ] of order2 [ report order1 ]
  ifelse [ price ] of order1 < [ price ] of order2
  [ report order2 ]
  [ report order1 ]
end

; Try to execute the two orders
to execute-order [ bid-order ask-order ]
  let bidder [ owner ] of bid-order
  let asker [ owner ] of ask-order
  ; For now, the lowest price will be used
  let deal-price min (list [ price ] of bid-order [ price ] of ask-order)
  ; Calculate the maximum available
  let bidder-maximum floor-to-unit ([ [ cash ] of bidder / deal-price ] of bid-order)
  if bidder-maximum <= 0 [ ask bid-order [ remove-order ] stop ]
  let asker-maximum [ stockpile ] of asker
  if asker-maximum <= 0 [ ask ask-order [ remove-order ] stop ]
  ; Calculate the amount
  let deal-amount min (list
    [ remaining ] of bid-order
    [ remaining ] of ask-order
    bidder-maximum asker-maximum
  )
  ; Deal!
  ask bidder [
    set cash cash - deal-amount * deal-price
    set stockpile stockpile + deal-amount
  ]
  ask asker [
    set cash cash + deal-amount * deal-price
    set stockpile stockpile - deal-amount
  ]
  ; Record it
  set latest-amount latest-amount + deal-amount
  set total-amount total-amount + deal-amount
  set latest-volume latest-volume + deal-amount * deal-price
  set total-volume total-volume + deal-amount * deal-price
  ; Change the orders
  ask (turtle-set bid-order ask-order) [
    set remaining remaining - deal-amount
    check-order
  ]
end

; Check whether a given order is done and needs to be removed
to check-order
  if remaining = 0 [ remove-order ]
end

; Forcibly remove an order.
to remove-order
  ifelse buy-side? [
    set bids remove self bids
  ] [
    set asks remove self asks
  ]
  set pending? false
  set removed? true
end

; Clamp the number between a range.
to-report clamp [ min-value source max-value ]
  ifelse source > max-value [ report max-value ]
  [ ifelse source < min-value [ report min-value ] [ report source ] ]
end

; Floor to individual trade units
to-report floor-to-unit [ source ]
  report floor (source / trade-unit) * trade-unit
end


; Copyright 2021 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Bidding Market

Canonical path: `Sample Models/Social Science/Economics/Bidding Market`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Bidding%20Market.nlogox. SHA-256 `5f86c4f77da77e22e5f0070e0828af72b3c52bdf120c8c25aab58f77129de74c`; bytes 64068; Git blob `9501688de62e61a2bc508494068f7d23f694b0cb`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard29x29,50 sellers and50 buyers, ordered rings and stable cyclic pairing offset1+ticks%50. Setup supply/demand even1+random amount or concentrated1+floor exponential(amount/2); high50/low25. Starting prices half plus integer randomhalf rounded cents. Preflight stops no supply or no solvent unmet buyer. Sequential fixed seller pairing, one item per success if ask<=cash and willingness. Transfer rounded cents, residual<.01 to0; adapt willingness capped cash. Normal seller +2.5/-2%, desperate+.7/-5; buyer normal-2/+2.5, desperate-.5/+7.5; random integer-5..5. Seller ignore-full switch suppresses no-sale change only for normal/desperate. remaining-supply is PRE-commerce. Source post-commerce affordability sanity error possible. Source formulas and widgets below; stars/shadows/drawing presentation.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="270" wrappingAllowedX="false" y="7" frameRate="30.0" minPycor="-14" height="555" showTickCounter="true" patchSize="19.0" fontSize="10" wrappingAllowedY="false" width="555" tickCounterLabel="ticks" maxPycor="14" updateMode="1" maxPxcor="14" minPxcor="-14" />
    <slider x="5" step="25" y="7" max="500" width="260" display="starting-money" height="50" min="0" direction="Horizontal" default="500.0" variable="starting-money" />
    <chooser x="5" y="60" height="60" variable="supply-amount" current="0" width="120" display="supply-amount">
      <choice type="string" value="high" />
      <choice type="string" value="low" />
    </chooser>
    <chooser x="130" y="60" height="60" variable="supply-distribution" current="1" width="135" display="supply-distribution">
      <choice type="string" value="concentrated" />
      <choice type="string" value="even" />
    </chooser>
    <chooser x="5" y="125" height="60" variable="demand-amount" current="1" width="120" display="demand-amount">
      <choice type="string" value="low" />
      <choice type="string" value="high" />
    </chooser>
    <chooser x="130" y="125" height="60" variable="demand-distribution" current="1" width="135" display="demand-distribution">
      <choice type="string" value="concentrated" />
      <choice type="string" value="even" />
    </chooser>
    <chooser x="50" y="190" height="60" variable="seller-behavior" current="0" width="165" display="seller-behavior">
      <choice type="string" value="normal" />
      <choice type="string" value="desperate" />
      <choice type="string" value="random" />
      <choice type="string" value="mix of all" />
    </chooser>
    <button x="90" y="330" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="82" display="go-once">go</button>
    <button x="175" y="330" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="64" display="go">go</button>
    <chooser x="50" y="255" height="60" variable="buyer-behavior" current="0" width="165" display="buyer-behavior">
      <choice type="string" value="normal" />
      <choice type="string" value="desperate" />
      <choice type="string" value="random" />
      <choice type="string" value="mix of all" />
    </chooser>
    <switch x="20" y="375" height="40" on="false" variable="sellers-ignore-full-buyers?" width="220" display="sellers-ignore-full-buyers?" />
    <switch x="80" y="420" height="40" on="true" variable="stars?" width="103" display="stars?" />
    <plot x="830" autoPlotX="true" yMax="100.0" autoPlotY="true" y="7" xMin="0.0" height="150" legend="false" xMax="10.0" yMin="0.0" width="375" display="Seller Asking Prices (min, average, max)">
      <setup />
      <update>let top (floor ifelse-value average-price = 0 [max [asking-price] of sellers] [average-price * 2])
set-plot-y-range 0 ifelse-value top &lt; 1 [1] [top]</update>
      <pen interval="1.0" mode="0" display="avg-asking-price" color="-13345367" legend="true">
        <setup />
        <update>let ss (sellers with [items-for-sale &gt; 0])
ifelse (count ss = 0)
[ plot 0 ]
[ plot mean [asking-price] of ss ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="min-asking-price" color="-5325092" legend="true">
        <setup />
        <update>let ss (sellers with [items-for-sale &gt; 0])
ifelse (count ss = 0)
[ plot 0 ]
[ plot min [asking-price] of ss ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="max-asking-price" color="-5325092" legend="true">
        <setup />
        <update>let ss (sellers with [items-for-sale &gt; 0])
ifelse (count ss = 0)
[ plot 0 ]
[ plot max [asking-price] of ss ]</update>
      </pen>
    </plot>
    <plot x="830" autoPlotX="true" yMax="100.0" autoPlotY="true" y="160" xMin="0.0" height="151" legend="false" xMax="10.0" yMin="0.0" width="374" display="Buyer Willing-to-Pay (min, average, max)">
      <setup />
      <update>let top floor ifelse-value average-price = 0 [max [asking-price] of sellers] [average-price * 2]
set-plot-y-range 0 ifelse-value top &lt; 1 [1] [top]</update>
      <pen interval="1.0" mode="0" display="avg-willing" color="-5825686" legend="true">
        <setup />
        <update>let bs (buyers with [want-to-buy &gt; 0 and money &gt; 0])
ifelse (count bs = 0)
[ plot 0 ]
[ plot mean [willing-to-pay] of bs ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="max-willing" color="-2382653" legend="true">
        <setup />
        <update>let bs (buyers with [want-to-buy &gt; 0 and money &gt; 0])
ifelse (count bs = 0)
[ plot 0 ]
[ plot max [willing-to-pay] of bs ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="min-willing" color="-2382653" legend="true">
        <setup />
        <update>let bs (buyers with [want-to-buy &gt; 0 and money &gt; 0])
ifelse (count bs = 0)
[ plot 0 ]
[ plot min [willing-to-pay] of bs ]</update>
      </pen>
    </plot>
    <plot x="830" autoPlotX="true" yMax="10.0" autoPlotY="true" y="315" xMin="0.0" height="166" legend="true" xMax="10.0" yMin="0.0" width="373" display="Items">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="items-for-sale" color="-13345367" legend="true">
        <setup />
        <update>plot sum [items-for-sale] of sellers</update>
      </pen>
      <pen interval="1.0" mode="0" display="want-to-buy" color="-5825686" legend="true">
        <setup />
        <update>plot sum [want-to-buy] of buyers</update>
      </pen>
      <pen interval="1.0" mode="0" display="total-sales" color="-7500403" legend="true">
        <setup />
        <update>plot total-sales</update>
      </pen>
    </plot>
    <monitor x="1005" precision="1" y="490" height="60" fontSize="11" width="167" display="% of Starting Money Used">percent-money-taken</monitor>
    <monitor x="865" precision="2" y="490" height="60" fontSize="11" width="136" display="Average Sale Price $">average-price</monitor>
    <button x="20" y="330" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="66" display="setup">setup</button>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  ; these are setup-only variables, used to make changing the model easier
  min-price
  population
  sales-per-tick
  starting-asking-price
  starting-willing-to-pay
  amount-high
  amount-low

  ; these variables track data as the model runs
  avg-per-buyer
  avg-per-seller
  total-sales
  remaining-supply
  starting-money-actual
]

breed [ shadows shadow ]
breed [ sellers seller ]
breed [ buyers buyer ]
breed [ pops pop ]

turtles-own [
  money        ; keeps track of the amount of money the turtle has
  next-xcor    ; the x-coordinate of the next position
  next-ycor    ; the y-coordinate of the next position
  percent
  my-shadow    ; the shadow of the turtle
]

sellers-own [
  items-for-sale ; the quantity that the seller has to sell
  asking-price
  starting-supply
  behavior-after-sale ; the behavior of seller after a sale
  behavior-no-sale ; the behavior of the seller after a no sale
  sold ; the quantity that the seller has sold
]

buyers-own [
  want-to-buy ; the quantity the buyer wants to buy
  willing-to-pay
  starting-demand
  behavior-after-purchase
  behavior-no-purchase ; the behavior of the buyer after not buying
  bought ; the quantity that the buyer has bought
]

to setup
  clear-all

  ; set the global variables
  set min-price 0.01
  set population 50
  set total-sales 0
  set starting-asking-price 100
  set starting-willing-to-pay 10
  set amount-high 50
  set amount-low 25

  ; now create the sellers
  create-ordered-sellers population [
    forward 8
    set my-shadow nobody
    set money 0
    set items-for-sale get-random-amount supply-distribution supply-amount
    set starting-supply items-for-sale
    set asking-price get-starting-value starting-asking-price
    ; we set the behavior using anonymous procedures to make the usage during the run simple
    ; the behavior depends on the settings of the model
    let mix-behavior ifelse-value seller-behavior = "mix of all" [random 3] [-1]
    ifelse seller-behavior = "normal" or mix-behavior = 0 [
      set behavior-after-sale [         -> change-price 2.5 ]
      set behavior-no-sale    [ hide? -> if (not hide?) [ change-price -2.0 ] ]
    ] [
      ifelse seller-behavior = "desperate" or mix-behavior = 1 [
        set behavior-after-sale [         -> change-price 0.7 ]
        set behavior-no-sale    [ hide? -> if (not hide?) [ change-price -5.0 ] ]
      ] [
        ; "random" or mix-behavior = 2
        set behavior-after-sale [     -> change-price (random 11 - 5)]
        set behavior-no-sale    [     -> change-price (random 11 - 5)]
    ] ]
  ]

  ; now create the buyers
  create-ordered-buyers population [
    forward 13
    facexy 0 0
    set my-shadow nobody
    set want-to-buy get-random-amount demand-distribution demand-amount
    set starting-demand want-to-buy
    set money get-starting-value starting-money
    set willing-to-pay get-starting-value starting-willing-to-pay
    ; we set the behavior using anonymous procedures to make the usage during the run simple
    ; again, the behavior depends on the settings of the model
    let mix-behavior ifelse-value buyer-behavior = "mix of all" [random 3] [-1]
    ifelse buyer-behavior = "normal" or mix-behavior = 0 [
      set behavior-after-purchase [-> change-payment -2.0 ]
      set behavior-no-purchase    [-> change-payment  2.5 ]
    ] [
      ifelse buyer-behavior = "desperate" or mix-behavior = 1 [
        set behavior-after-purchase [-> change-payment -0.5 ]
        set behavior-no-purchase    [-> change-payment  7.5 ]
      ] [
          ; "random"  or mix-behavior = 2
          set behavior-after-purchase [-> change-payment (random 11 - 5)]
          set behavior-no-purchase    [-> change-payment (random 11 - 5)]
      ]
    ]
  ]

  ; create a shadow for all of our turtles
  create-ordered-shadows population [
    set color 2
    ask one-of sellers with [my-shadow = nobody] [ set my-shadow myself ]
  ]
  create-ordered-shadows population [
    set color 2
    ask one-of buyers with [my-shadow = nobody] [ set my-shadow myself ]
  ]

  ; update our tracking variables
  set avg-per-buyer (sum [starting-demand] of buyers) / (count buyers)
  set avg-per-seller (sum [starting-supply] of sellers) / (count sellers)

  ask sellers [
    update-seller-display
    ; seller shadow sizes are set at the start and do not change
    let shadow-size 1 + (items-for-sale / avg-per-seller)
    ask my-shadow [
      move-to myself
      set heading [heading] of myself
      set size shadow-size
    ]
  ]

  ask buyers [ update-buyer-display ]

  set starting-money-actual sum [money] of buyers

  reset-ticks
end

to-report get-random-amount [ dist amount ]
  report ifelse-value dist = "even" [
    1 + random (get-amount amount)
  ] [ ; "concentrated"
    1 + floor random-exponential ((get-amount amount) / 2)
  ]
end

to-report get-amount [ amount ]
  report ifelse-value amount = "high" [
    amount-high
  ] [ ; else "low"
    amount-low
  ]
end

to-report get-starting-value [ starting-value ]
  report precision ((starting-value / 2) + random (starting-value / 2)) 2
end

to go
  if (sum [items-for-sale] of sellers = 0 or (0 = count buyers with [money > 0 and want-to-buy > 0])) [ stop ]

  clear-drawing
  set sales-per-tick 0

  ; move our buyers to their next position in the circle
  ; record the positions first, since if we move before processing all of them, it screws things up
  ask buyers [
    let next ifelse-value who = (1 * population) [(2 * population) - 1] [who - 1]
    set next-xcor [xcor] of buyer next
    set next-ycor [ycor] of buyer next
  ]
  ; okay, now we can move
  ask buyers [
    set xcor next-xcor
    set ycor next-ycor
    facexy 0 0
  ]

  set remaining-supply (sum [items-for-sale] of sellers)

  let offset 1 + ticks mod population
  foreach (range 0 population) [ i ->
    let the-seller seller (population * 0 + i)
    let the-buyer buyer (population * 1 + ((i + offset) mod population))
    ask the-buyer [ do-commerce-with the-seller ]
  ]

  ask buyers [update-buyer-display]
  ask sellers [update-seller-display]
  set total-sales (total-sales + sales-per-tick)

  ask pops [
    ifelse (size < 0.1 or not stars?)
    [ die ]
    [
      set heading (atan (random-float 0.5 - 0.25) 1)
      jump 0.5
      set size size - 0.025
      set color color - 0.25
    ]
  ]

  ; sanity check
  if (any? buyers with [want-to-buy > 0 and willing-to-pay > money]) [ error "Cannot have turtles that want to pay more than their cash!" ]

  tick
end

to update-buyer-display
  if want-to-buy = 0 [
    set color 2
  ]
  set size 1 + (bought / avg-per-buyer)
  let shadow-size 1 + (want-to-buy / avg-per-buyer)
  ask my-shadow [
    move-to myself
    set heading [heading] of myself
    set size shadow-size
  ]
end

to update-seller-display
  if items-for-sale = 0 [ set color 2 ]
  set size 1 + (items-for-sale / avg-per-seller)
end

to do-commerce-with [ the-seller ]
  let asking [asking-price] of the-seller
  ifelse ([items-for-sale] of the-seller > 0 and want-to-buy > 0 and asking <= money and asking <= willing-to-pay) [
    create-link the-seller self yellow

    set sales-per-tick (sales-per-tick + 1)
    set want-to-buy (want-to-buy - 1)
    let price asking
    set money precision (money - price) 2
    set money ifelse-value money < min-price [0] [money]
    set bought (bought + 1)
    ask the-seller [
      set items-for-sale (items-for-sale - 1)
      set money precision (money + price) 2
      set sold (sold + 1)
      run behavior-after-sale
    ]
    run behavior-after-purchase
    create-star
  ] [
    ; else no purchase was made
    create-link the-seller self blue
    let hide? (sellers-ignore-full-buyers? and (want-to-buy = 0))
    ask the-seller [ (run behavior-no-sale hide?) ]
    run behavior-no-purchase
  ]
end

to create-star
  if stars? [
    hatch-pops 1 [
      set color yellow
      set shape "star"
      set size 0.5
      set label ""
    ]
  ]
end

to create-link [ some-seller some-buyer some-color ]
  ask some-seller [
    let oc color
    let x xcor
    let y ycor
    set color some-color
    set pen-size 3
    pen-down
    move-to some-buyer
    pen-up
    setxy x y
    set color oc
  ]
end

to change-price [ change ]
  let before asking-price
  set percent 1 + (change / 100)
  set asking-price check-for-min-price (precision (percent * asking-price) 2)
  if before = asking-price [
    if change < 0 and before != min-price [
      set asking-price precision (asking-price - min-price) 2
    ]
    if change > 0 [
      set asking-price precision (asking-price + min-price) 2
    ]
  ]
end

to change-payment [ change ]
  let before willing-to-pay
  set percent 1 + (change / 100)
  set willing-to-pay check-for-min-price (precision (percent * willing-to-pay) 2)
  if before = willing-to-pay [
    if change < 0 and before != min-price [
      set willing-to-pay precision (willing-to-pay - min-price) 2
    ]
    if change > 0 [
      set willing-to-pay precision (willing-to-pay + min-price) 2
    ]
  ]
  if willing-to-pay > money [ set willing-to-pay money ]
end

to-report seller-cash
  report sum [money] of sellers
end

to-report average-price
  report (ifelse-value total-sales = 0 [ 0.00 ] [ precision (seller-cash / total-sales) 2 ])
end

to-report percent-money-taken
  report 100 * sum [money] of sellers / starting-money-actual
end

to-report percent-items-sold
  report 100 * sum [sold] of sellers / sum [items-for-sale + sold] of sellers
end

to-report percent-demand-satisfied
  report 100 * sum [bought] of buyers / sum [want-to-buy + bought] of buyers
end

to-report check-for-min-price [ value ]
  report precision ifelse-value value < min-price [min-price] [value] 2
end


; Copyright 2017 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Hotelling's Law

Canonical path: `Sample Models/Social Science/Economics/Hotelling's Law`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Hotelling's%20Law.nlogox. SHA-256 `6241899fa70ee6ab961fb8d183321c662e12f011246684fbd99ea403f6a259ad`; bytes 52054; Git blob `377511fc0e5783207c701d97f1806e0e3e0ed05d`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard41x41 consumer line x=0 or plane; random store sites, price10, colors without replacement. Consumer choice min(price+distance), random ties. Plan all location tasks from old configuration, then all price tasks from old configuration; execute all moves then prices, then recalculate shares and tick. Local faces moves only in consumer set; include current first only if positive market share. Hypothetical share evaluation consumes tie randomness but restores coordinates/prices. Price candidates current first then random +/-1, revenue share*price; all-zero emergency lowers if>1. No general positive-price clamp. Layout/count setup-only; rules live. No stop. Shares partition consumers; plots show current shares/prices not histories where source says so.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="295" wrappingAllowedX="false" y="7" frameRate="30.0" minPycor="-20" height="578" showTickCounter="true" patchSize="14.0" fontSize="10" wrappingAllowedY="false" width="578" tickCounterLabel="ticks" maxPycor="20" updateMode="1" maxPxcor="20" minPxcor="-20" />
    <slider x="10" step="1" y="10" max="10" width="275" display="number-of-stores" height="50" min="2" direction="Horizontal" default="3.0" variable="number-of-stores" />
    <button x="200" y="130" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="85">go</button>
    <chooser x="10" y="187" height="60" variable="rules" current="0" width="275" display="rules">
      <choice type="string" value="normal" />
      <choice type="string" value="moving-only" />
      <choice type="string" value="pricing-only" />
    </chooser>
    <chooser x="10" y="65" height="60" variable="layout" current="0" width="275" display="layout">
      <choice type="string" value="plane" />
      <choice type="string" value="line" />
    </chooser>
    <button x="105" y="130" height="45" disableUntilTicks="true" forever="false" kind="Observer" width="90" display="go once">go</button>
    <button x="10" y="130" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="90">setup</button>
    <plot x="895" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="revenue" y="405" xMin="0.0" height="195" legend="false" xMax="10.0" yMin="0.0" width="335" xAxis="time" display="revenues">
      <setup>ask turtles [
  create-temporary-plot-pen (word who)
  set-plot-pen-color color
]</setup>
      <update>ask turtles [
  set-current-plot-pen (word who)
  plot (area-count *  price)
]</update>
    </plot>
    <plot x="895" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="price" y="5" xMin="0.0" height="195" legend="false" xMax="10.0" yMin="0.0" width="335" xAxis="time" display="prices">
      <setup>ask turtles [
  create-temporary-plot-pen (word who)
  set-plot-pen-color color
]</setup>
      <update>ask turtles [
  set-current-plot-pen (word who)
  plot (price)
]</update>
    </plot>
    <plot x="895" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="area" y="205" xMin="0.0" height="195" legend="false" xMax="10.0" yMin="0.0" width="335" xAxis="time" display="areas">
      <setup>ask turtles [
  create-temporary-plot-pen (word who)
  set-plot-pen-color color
]</setup>
      <update>ask turtles [
  set-current-plot-pen (word who)
  plot (area-count)
]</update>
    </plot>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
turtles-own [
  price               ; How much each store charges for its product
  area-count          ; The area (market share) that a store held at the end of the last tick
]

patches-own [
  preferred-store     ; The store currently preferred by the consumer
]

globals [
  consumers           ; The patches that will act as consumers, either a vertical line or all patches
]

;;;;;;;;;;;;;;;;;;;;;;;;
;;; setup procedures ;;;
;;;;;;;;;;;;;;;;;;;;;;;;

to setup
  clear-all
  setup-consumers
  setup-stores
  recalculate-area
  reset-ticks
end

to setup-consumers
  ; Store the agentset of patches that are going to be our
  ; consumers in a global variable for easy reference.
  set consumers ifelse-value layout = "line"
    [ patches with [ pxcor = 0 ] ]
    [ patches ]
end

to setup-stores
  ; We choose as many random colors as the number of stores we want to create
  foreach n-of number-of-stores base-colors [ c ->
    ; ...and we create a store of each of these colors on random consumer patches
    ask one-of consumers [
      sprout 1 [
        set color c ; use the color from the list that we are looping through
        set shape "Circle (2)"
        set size 2
        set price 10
        set pen-size 5
      ]
    ]
  ]
end

to go
  ; We accumulate location and price changes as lists of tasks to be run later
  ; in order to simulate simultaneous decision making on the part of the stores

  let location-changes ifelse-value rules = "pricing-only"
    [ (list) ] ; if we are doing "pricing-only", the list of moves is empty
    [ [ new-location-task ] of turtles ]

  let price-changes ifelse-value rules = "moving-only"
    [ (list) ] ; if we are doing "moving-only", the list of price changes is empty
    [ [ new-price-task ] of turtles ]

  foreach location-changes run
  foreach price-changes run
  recalculate-area
  tick
end

to recalculate-area
  ; Have each consumer (patch) indicate its preference by
  ; taking on the color of the store it chooses
  ask consumers [
    set preferred-store choose-store
    set pcolor ([ color ] of preferred-store + 2)
  ]
  ask turtles [
    set area-count count consumers with [ preferred-store = myself ]
  ]
end

;;;;;;;;;;;;;;;;;;;;;;;;;
;;; turtle procedures ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;

; Have the store consider the benefits of taking a unit step in each of the four cardinal directions
; and report a task that will allow the chosen location change to be enacted later
to-report new-location-task

  ; Use `[ self ] of` to turn the `neighbors4` agentset into a shuffled list
  let possible-moves [ self ] of neighbors4 with [ member? self consumers ]

  if area-count > 0 [
    ; Only consider the status quo if we already have a market share, but if we consider it,
    ; put it at the front of the list so it is favored in case of ties in sort-by
    set possible-moves fput patch-here possible-moves
  ]

  ; pair the potential moves with their market shares, and sort these pairs by market share
  let moves-with-market-shares
    sort-by [ [a b] -> last a > last b ]
    map [ move -> list move (market-share-if-move-to move) ] possible-moves

  ; report the first item of the first pair, i.e., the move with the best market share
  let chosen-location first first moves-with-market-shares

  let store self ; put self in a local variable so that it can be "captured" by the task
  report [ ->
    ask store [
      pen-down
      move-to chosen-location
      pen-up
    ]
  ]
end

; report the market share area the store would have if it moved to destination
to-report market-share-if-move-to [ destination ] ; turtle procedure
  let current-position patch-here
  move-to destination
  let market-share-at-destination potential-market-share
  move-to current-position
  report market-share-at-destination
end

to-report potential-market-share
  report count consumers with [ choose-store = myself ]
end

; Have the store consider the revenue from hypothetically increasing or decreasing its price by one unit
; and report a task that will allow the chosen price change to be enacted later
to-report new-price-task

  ; We build a list of candidate prices, keeping the status quo in first, but having -1 and +1 in random
  ; order after that. This order is going to be preserved by the `sort-by` primitive in case of ties,
  ; and we always want the status quo to win in this case, but -1 and +1 to have equal chances
  let possible-prices fput price shuffle list (price - 1) (price + 1)

  ; pair each potential price change with its potential revenue
  ; and sort them in decreasing order of revenue
  let prices-with-revenues
    sort-by [ [a b] -> last a > last b ]
    map [ the-price -> list the-price (potential-revenue the-price) ] possible-prices

  let all-zeros? (not member? false map [ pair -> last pair = 0 ] prices-with-revenues)
  let chosen-price ifelse-value all-zeros? and price > 1
    [ price - 1 ] ; if all potential revenues are zero, the store lowers its price as an emergency procedure if it can
    [ first first prices-with-revenues ] ; in any other case, we pick the price with the best potential revenues

  let store self ; put self in a local variable so that it can be "captured" by the task
  report [ ->
    ask store [
      set price chosen-price
    ]
  ]
end

to-report potential-revenue [ target-price ]
  let current-price price
  set price target-price
  let new-revenue (potential-market-share * target-price)
  set price current-price
  report new-revenue
end

;;;;;;;;;;;;;;;;;;;;;;;
;;; patch procedure ;;;
;;;;;;;;;;;;;;;;;;;;;;;

; report the store with the best deal, defined as the smallest sum of price and distance
to-report choose-store
  report min-one-of turtles [ (price) + (distance myself) ]
end


; Copyright 2009 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Braess Paradox

Canonical path: `Sample Models/Social Science/Economics/Braess Paradox`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Braess%20Paradox.nlogox. SHA-256 `472667ac315d7e5631332194a2dd305dafcc8d8bbf8afa0af8166fd833545c56`; bytes 65890; Git blob `d0213c47c60b83c452f31693d32d53e564dd5f60`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard49x49, corners+/-22. Source-specific patch roads, no generic graph routing API required. Top/bottom route names and road-type comments disagree: actual road-type1 gets dynamic determine-congestion, initial delay5/base10, type0 fixed10. Source waiting strictly ticks-here>delay; departure records last-here, moves patch-ahead, reset1; turns and exit after movement/wait. spawn-time>250/spawn-rate (strict), spawn happens before commuter ask, newborn participates immediately. After commuter asks update dynamic delays floor((250/rate)/(ticks-lastHere+1)*base), sentinel lastHere0 ->floor(base/2). Middle close waits until route2 empty. Three exact route algorithms/tie rules below; source greedy no-middle can divide0 or fractional power negative. Completed travel=(ticks-birth)/450, average EWMA1/20, route average1/smoothing; cars-spawned cumulative despite comment active. No stop.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="205" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-24" height="641" showTickCounter="true" patchSize="13.0" fontSize="10" wrappingAllowedY="false" width="641" tickCounterLabel="ticks" maxPycor="24" updateMode="1" maxPxcor="24" minPxcor="-24" />
    <button x="9" y="84" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="63">setup</button>
    <button x="9" y="125" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="63">go</button>
    <slider x="9" step="1" y="243" max="10" width="186" display="spawn-rate" height="50" min="1" direction="Horizontal" default="10.0" variable="spawn-rate" />
    <plot x="860" autoPlotX="true" yMax="2.0" autoPlotY="true" y="10" xMin="0.0" height="381" legend="true" xMax="10.0" yMin="0.0" width="420" xAxis="Ticks" display="Travel Time">
      <setup />
      <update />
      <pen interval="1.0" mode="1" display="Actual Time" color="-7500403" legend="true">
        <setup />
        <update>plot travel-time</update>
      </pen>
      <pen interval="1.0" mode="0" display="Top" color="-2674135" legend="true">
        <setup />
        <update>plot top</update>
      </pen>
      <pen interval="1.0" mode="0" display="Bottom" color="-14070903" legend="true">
        <setup />
        <update>plot bottom</update>
      </pen>
      <pen interval="1.0" mode="0" display="Middle" color="-13840069" legend="true">
        <setup />
        <update>plot middle</update>
      </pen>
      <pen interval="1.0" mode="2" display="Smoothed Average" color="-8990512" legend="true">
        <setup />
        <update>plot avg</update>
      </pen>
    </plot>
    <switch x="9" y="10" height="40" on="true" variable="middle-on?" width="187" display="middle-on?" />
    <slider x="8" step="1" y="303" max="10" width="186" display="smoothing" height="50" min="1" direction="Horizontal" default="10.0" variable="smoothing" />
    <chooser x="8" y="367" height="60" variable="mode" current="2" width="189" display="mode">
      <choice type="string" value="Best Known /w Random Deviation" />
      <choice type="string" value="Empirical Analytical" />
      <choice type="string" value="Probabilistic Greedy" />
    </chooser>
    <slider x="9" step="1" y="440" max="100" width="189" display="randomness" height="50" min="0" direction="Horizontal" default="16.0" variable="randomness" />
    <plot x="860" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="Number of Cars" y="399" xMin="0.0" height="157" legend="true" xMax="3.0" yMin="0.0" width="200" display="Routes Taken">
      <setup />
      <update />
      <pen interval="1.0" mode="1" display="Top" color="-2674135" legend="true">
        <setup />
        <update>clear-plot plotxy 0 count turtles with [route = 0]</update>
      </pen>
      <pen interval="1.0" mode="1" display="Bottom" color="-13345367" legend="true">
        <setup />
        <update>plotxy 1 count turtles with [route = 1]</update>
      </pen>
      <pen interval="1.0" mode="1" display="Middle" color="-13840069" legend="true">
        <setup />
        <update>plotxy 2 count turtles with [route = 2]</update>
      </pen>
    </plot>
    <plot x="1081" autoPlotX="true" yMax="1.0" autoPlotY="true" y="399" xMin="0.0" height="157" legend="true" xMax="3.0" yMin="0.0" width="200" display="Probabilities">
      <setup />
      <update />
      <pen interval="1.0" mode="1" display="Top" color="-2674135" legend="true">
        <setup />
        <update>clear-plot plotxy 0 top-prob</update>
      </pen>
      <pen interval="1.0" mode="1" display="Bottom" color="-13345367" legend="true">
        <setup />
        <update>plotxy 1 bottom-prob</update>
      </pen>
      <pen interval="1.0" mode="1" display="Middle" color="-13840069" legend="true">
        <setup />
        <update>plotxy 2 middle-prob</update>
      </pen>
    </plot>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals
[
  travel-time ; travel time of last turtle to complete route
  top ; travel time of last turtle to complete top route
  bottom ; travel time of last turtle to complete bottom route
  middle ; travel time of last turtle to complete middle route
  spawn-time ; next tick to spawn a new turtle
  middle-prev ; previous status of middle route
  avg ; total average of travel time (smoothed)
  cars-spawned ; total number of active commuters
  top-prob ; probability for agent to take top route
  bottom-prob ; probability for agent to take bottom route
  middle-prob ; probability for agent to take middle route
  top-left ; patch that is the top-left node of the grid
  top-right ; patch that is the top-left node of the grid
  bottom-right ; patch that is the bottom-right node of the grid
  bottom-left ; patch that is the bottom-left node of the grid
]

breed[ commuters commuter ]

patches-own
[
  delay ; ticks turtle has to spend before leaving patch
  base-delay ; base amount of ticks for dynamic delay road
  road-type ; road with static delay or road with dynamic delay
  last-here ; tick that the a dynamic road was last occupied
]

commuters-own
[
  birth-tick ; tick number that the turtle was created
  ticks-here ; number of ticks the turtle has been at its current patch
  route ; the route the turtle is taking
]

to setup
  clear-all
  set top-left patch -22 22 ; define corner nodes of the traffic grid
  set top-right patch 22 22
  set bottom-left patch -22 -22
  set bottom-right patch 22 -22
  setup-roads ; draw all the roads between the corner nodes
  reset-ticks
end

to go
  check-middle
  spawn-commuters
  ask commuters [ commuter-move ]
  ask patches with [road-type = 1] [ determine-congestion ]
  tick
end

to commuter-move ; turtle procedure
  ifelse ticks-here > delay ; advance if the turtle has waiting long enough
  [
    set last-here ticks
    move-to patch-ahead 1
    set ticks-here 1
  ]
  [ set ticks-here ticks-here + 1 ]
  if patch-here = top-right and route = 0  [face bottom-right ] ; turn if at corner patch
  if patch-here = top-right and route = 2 [ face bottom-left]
  if patch-here = bottom-left [ face bottom-right ]
  if patch-here = bottom-right [ end-commute ]; if turtle finished route
end

to end-commute   ; turtle procedure
  ; handles reporting the travel time when the commuter reaches the end of its route
  set travel-time (ticks - birth-tick) / 450
  ifelse avg = 0
  [
    set avg travel-time
  ]
  [
    set avg ((19 * avg + travel-time) / 20)
  ]
  ifelse route = 0
  [
    ifelse top = 0
    [
      set top travel-time
    ]
    [
      set top ((travel-time) + ((smoothing - 1) * top)) / smoothing
    ]
  ]
  [
  ifelse route = 1
    [
    ifelse bottom = 0
      [
        set bottom travel-time
      ]
      [
      set bottom ((travel-time) + ((smoothing - 1) * bottom)) / smoothing
      ]
    ]
    [
      ifelse middle = 0
      [
        set middle travel-time
      ]
      [
        set middle ((travel-time) + ((smoothing - 1) * middle)) / smoothing
      ]
    ]
  ]
  die

end

to spawn-commuters  ;turtle procedure
  ; spawns new commuters and sets up their properties
  ifelse spawn-time > (250 / spawn-rate) [
    ask patch -22 22 [
      sprout-commuters 1 [
        set cars-spawned cars-spawned + 1
        set color one-of [99]
        set birth-tick ticks
        set ticks-here 1
        set route new-route
        ifelse route = 0  or route = 2 [ facexy 22 22 ][ facexy -22 -22 ]
        set size 3.5
        set shape one-of [ "car" "truck" ]
      ]
    ]
    set spawn-time 0
  ]
  [ set spawn-time spawn-time + 1 ]
end

to determine-congestion ; patch procedure that determines congestion of dynamic patches
  ifelse last-here = 0 [ ; congestion is determine based on how recently the last commuter was here
    set delay int (base-delay / 2)
  ][
    set delay floor (((250 / spawn-rate)/(ticks - last-here + 1)) * base-delay)
  ]
  let g 255 + floor (255 * (0.5 - (delay / base-delay)))
  if g < 127 [set g 127]
  if g > 255 [set g 255]
  set pcolor (list 255 g 0)
end

to check-middle ; handle opening and closing the middle route
  if middle-on? != middle-prev
  [
    ifelse middle-on?
    [
      draw-road 3 top-right bottom-left
      set middle-prev middle-on?
    ]
    [
      if count commuters with [ route = 2 ] = 0
      [
        draw-road 4 top-right bottom-left
        set middle-prev middle-on?
      ]
    ]

  ]
end

to setup-roads
  ask patches [ ; create grass
    let g random 16 + 96
    let c (list 0 g 0)
    set pcolor c
  ]
  ask top-left [ ; setup corner patches
    set pcolor green
    set delay 10
    ask neighbors [set pcolor 5]
  ]
  ask bottom-right [
    set pcolor red
    set delay 10
    ask neighbors [set pcolor 5]
  ]
  ask bottom-left [
    set pcolor blue
    set delay 10
    ask neighbors [set pcolor 5]
  ]
  ask top-right [
    set pcolor blue
    set delay 10
    ask neighbors [set pcolor 5]
  ]
  ; Draw roads between corner nodes
  draw-road 1 top-left top-right
  draw-road 1 bottom-left bottom-right
  draw-road 0 top-left bottom-left
  draw-road 0 top-right bottom-right
  set middle-prev middle-on?
  ifelse middle-on?
  [
    draw-road 3 top-right bottom-left
  ]
  [
    draw-road 4 top-right bottom-left
  ]
end

to draw-road [type-of-road start finish]
  ; This procedure draws roads of different types between 2 patches.
  ; type-of-road in {0, 1, 3, 4}
  ; 0 - dynamic congestion road
  ; 1 - static congestion road
  ; 3 - middle road (zero congestion)
  ; 4 - deactivated middle road

  let the-heading atan ([pxcor] of finish - [pxcor] of start) ([pycor] of finish - [pycor] of start)
  if (type-of-road = 3)
  [
    set start [patch-at-heading-and-distance the-heading 1] of start
    set finish [patch-at-heading-and-distance (the-heading + 180) 1] of finish
  ]
  if (type-of-road = 4)
  [
    set start [patch-at-heading-and-distance the-heading 2] of start
    set finish [patch-at-heading-and-distance (the-heading + 180) 2] of finish
  ]
  let current-patch [patch-at-heading-and-distance the-heading 1] of start
  while [ not (current-patch = finish) ]
  [
    ask current-patch
    [
      if-else type-of-road < 4
      [
        if-else type-of-road = 1
        [
          set pcolor yellow
          set delay 5
          set road-type 1
          set base-delay 10
        ]
        [
          if-else type-of-road = 0
          [
            set pcolor orange
            set delay 10
          ]
          [
            set pcolor 9.9
            set delay 0
          ]
        ]
        ask patch-at-heading-and-distance (the-heading + 90) 1 [set pcolor 5]
        ask patch-at-heading-and-distance (the-heading - 90) 1 [set pcolor 5]
        if type-of-road = 3
        [
        ask patch-at-heading-and-distance (the-heading + 40) 1 [set pcolor 5]
        ask patch-at-heading-and-distance (the-heading - 45) 1 [set pcolor 5]
        ]
        set current-patch patch-at-heading-and-distance the-heading 1
      ]
      [
        set pcolor 2
        if (not (patch-at-heading-and-distance the-heading 1 = finish))
        [
          ask patch-at-heading-and-distance (the-heading + 40) 1 [set pcolor 2]
          ask patch-at-heading-and-distance (the-heading - 45) 1 [set pcolor 2]
        ]
        if (not (self = [patch-at-heading-and-distance the-heading 1] of start))
        and (not (patch-at-heading-and-distance the-heading 1 = finish))
        [
          ask patch-at-heading-and-distance (the-heading + 90) 1 [set pcolor 2]
          ask patch-at-heading-and-distance (the-heading - 90) 1 [set pcolor 2]
        ]
        set current-patch patch-at-heading-and-distance the-heading 1
      ]
    ]
  ]
end

to-report new-route ; turtle context reporter
 ; get route for new turtle based on selected mode
  ifelse mode = "Best Known /w Random Deviation"
  [ report best-random-route ]
  [
    ifelse mode = "Empirical Analytical"
    [ report analytical-route ]
    [
      ifelse mode = "Probabilistic Greedy"
      [report probabalistic-greedy-route ]
      [
        report 0
      ]
    ]
  ]
end

;; Algorithms for selecting routes:
to-report analytical-route ; turtle context reporter
  ifelse middle-on?
  [
    ifelse count other commuters = 0 [report random 3]
    [
      let top-score
      (count other commuters with [ route = 0 or route = 2 ] / count other commuters) * 1 + 1
      let bottom-score
      (count other commuters with [ route = 1 or route = 2 ] / count other commuters) * 1 + 1
      let middle-score
      (count other commuters with [ route = 2 ] / count other commuters) * 2
      ifelse top-score < bottom-score and top-score < middle-score
      [
        report 0
      ][
        ifelse bottom-score < middle-score and bottom-score < top-score
        [
          report 1
      ][
          ifelse top-score = bottom-score and middle-score = top-score
          [
            report random 3
          ][
            report 2
          ]
        ]
      ]
    ]
  ]
  [
    ifelse count other commuters = 0 [report random 2]
    [
      let top-score (count other commuters with [route = 0] / count other commuters) * 1 + 1
      let bottom-score (count other commuters with [route = 1] / count other commuters) * 1 + 1
      ifelse top-score < bottom-score [report 0][report 1]
    ]
  ]
end

to-report best-random-route ; turtle context reporter
  ; assigns a route to the commuter that currently has the best travel time
  ; with some random chance of deviating to a less optimal route
  ifelse middle-on?
  [
    ifelse middle = 0 or top = 0 or bottom = 0
    [
      report random 3
    ]
    [
      ifelse random 100 < 100 - randomness
      [
        ifelse middle < top and middle < bottom
        [
          report 2
        ][
          ifelse top < middle and top < bottom
          [
            report 0
          ][
            report 1
          ]
        ]
      ]
      [
        report random 3
      ]
    ]
  ]
  [
    ifelse top = 0 or bottom = 0 [report random 2]
    [
      ifelse random 100 < 100 - randomness
      [
        ifelse top < bottom
        [
          report 0
        ][
          report 1
        ]
      ]
      [
        report random 2
      ]
    ]
  ]
end

to-report probabalistic-greedy-route ; turtle context reporter
; assigns a route to the commuter with a probability proportional to
; how much better the route is than the other routes
  ifelse middle-on?
  [
    ifelse middle = 0 or top = 0 or bottom = 0 [report random 3]
    [

      let t-dif (2 - top)
      if t-dif < 0 [ set t-dif 0 ]
      set t-dif t-dif ^ (randomness / 10)
      let b-dif (2 - bottom)
      if b-dif < 0 [ set b-dif 0 ]
      set b-dif b-dif ^ (randomness / 10)
      let m-dif (2 - middle)
      if  m-dif < 0 [ set m-dif 0 ]
      set m-dif m-dif ^ (randomness / 10)
      let sigma1 0
      let sigma2 0
      if-else not ((t-dif + b-dif + m-dif) = 0 ) [
        set sigma1 t-dif / (t-dif + b-dif + m-dif)
        set sigma2 b-dif / (t-dif + b-dif + m-dif)
      ]
      [
        set sigma1 0.33
        set sigma2 0.33
      ]
      set top-prob sigma1
      set bottom-prob sigma2
      set middle-prob 1 - sigma1 - sigma2
      let split1 1000 * sigma1
      let split2 1000 * (sigma1 + sigma2)
      let rand random 1000
      ifelse rand < split1
      [
        report 0
      ][
        ifelse rand < split2
        [
          report 1
        ][
          report 2
        ]
      ]
    ]
  ]
  [
    ifelse top = 0 or bottom = 0 [report random 2]
    [
      let t-dif (2 - top) ^ (randomness / 10)
      let b-dif (2 - bottom) ^ (randomness / 10)
      let sigma t-dif / (t-dif + b-dif)
      set top-prob sigma
      set bottom-prob 1 - sigma
      let split 1000 * sigma
      ifelse random 1000 < split
      [
        report 0
      ][
        report 1
      ]
    ]
  ]
end


; Copyright 2019 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Cash Flow

Canonical path: `Sample Models/Social Science/Economics/Unverified/Cash Flow`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Unverified/Cash%20Flow.nlogox. SHA-256 `ab4aea96508e1d141a7c2571868fa1532b8db35b234824e0d7df5e1b66f9126c`; bytes 50537; Git blob `0712ecb09f4bd752f6f9b1fe4a43babc8cec85a4`. Includes `None`; extensions `[]`.

### Binding semantic audit

Wrapped17x17,473 people, wallet random2*10 (0 or10), savings/loans0. Entire business random sequential phase, then separate random sequential balance-books/color phase, then ONE bank balance sheet and classes then tick. Movement integer random360. Deposit/withdraw loans and repayment explicit source operations, bank-to-loan stale between balance phases except loan/repay updates. Source negative available-to-loan is passed into take-out-a-loan, can decrease loans: preserve and expose, no silent clamp. Balance reserves=percent*deposits; toLoan=deposits-reserves-loans. Wealth=savings-loans excludes wallet. Rich/poor thresholds>10, class count can overlap. All source sums/plots below. People setup, reserves live; no stop.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="320" wrappingAllowedX="true" y="7" frameRate="30.0" minPycor="-8" height="327" showTickCounter="true" patchSize="19.0" fontSize="10" wrappingAllowedY="true" width="327" tickCounterLabel="ticks" maxPycor="8" updateMode="1" maxPxcor="8" minPxcor="-8" />
    <slider x="5" step="1" y="50" max="500" width="150" display="people" height="50" min="0" direction="Horizontal" default="473.0" variable="people" />
    <slider x="160" step="1" y="50" max="100" width="150" display="reserves" height="50" min="0" direction="Horizontal" default="21.0" variable="reserves" />
    <button x="160" y="7" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="71" display="go">go</button>
    <button x="85" y="7" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="71" display="setup">setup</button>
    <monitor x="55" precision="2" y="105" height="60" fontSize="11" width="100" display="Savings total">savings-total</monitor>
    <monitor x="160" precision="2" y="105" height="60" fontSize="11" width="102" display="Wallets total">wallets-total</monitor>
    <monitor x="55" precision="2" y="170" height="60" fontSize="11" width="100" display="Loans total">loans-total</monitor>
    <monitor x="160" precision="2" y="170" height="60" fontSize="11" width="100" display="Money total">money-total</monitor>
    <note x="95" y="250" backgroundDark="0" fontSize="14" width="170" markdown="false" height="26" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Income Distribution</note>
    <monitor x="215" precision="2" y="275" height="60" fontSize="11" width="100" display="poor">poor</monitor>
    <monitor x="110" precision="2" y="275" height="60" fontSize="11" width="100" display="middle class">middle-class</monitor>
    <monitor x="5" precision="2" y="275" height="60" fontSize="11" width="100" display="rich">rich</monitor>
    <plot x="655" autoPlotX="false" yMax="100.0" autoPlotY="false" yAxis="People" y="7" xMin="-50.0" height="199" legend="false" xMax="50.0" yMin="0.0" width="284" xAxis="Wealth" display="Wealth Dist Hist">
      <setup>set-plot-y-range 0 people</setup>
      <update />
      <pen interval="1.0" mode="1" display="hist" color="-13345367" legend="true">
        <setup />
        <update>set-histogram-num-bars 10
histogram [wealth] of turtles</update>
      </pen>
      <pen interval="1.0" mode="0" display="ave-wealth" color="-7500403" legend="true">
        <setup />
        <update>let wealth-list [wealth] of turtles
let min-wealth round (min wealth-list)
let max-wealth round (max wealth-list)
ifelse min-wealth &lt; max-wealth
  [ set-plot-x-range min-wealth max-wealth ]
  [ set-plot-x-range min-wealth (min-wealth + 1) ]

;; draw gray line in center of distribution
plot-pen-reset
let ave-wealth mean wealth-list
plotxy ave-wealth 0
plotxy ave-wealth people</update>
      </pen>
    </plot>
    <plot x="655" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="People" y="210" xMin="0.0" height="199" legend="true" xMax="300.0" yMin="0.0" width="285" xAxis="Time" display="Income Dist">
      <setup>set-plot-x-range 0 xmax
set-plot-y-range 0 people</setup>
      <update />
      <pen interval="1.0" mode="0" display="rich" color="-10899396" legend="true">
        <setup />
        <update>plot rich</update>
      </pen>
      <pen interval="1.0" mode="0" display="middle" color="-16777216" legend="true">
        <setup />
        <update>plot middle-class</update>
      </pen>
      <pen interval="1.0" mode="0" display="poor" color="-2674135" legend="true">
        <setup />
        <update>plot poor</update>
      </pen>
    </plot>
    <plot x="5" autoPlotX="true" yMax="1100.0" autoPlotY="true" yAxis="Mny + Lns" y="340" xMin="0.0" height="220" legend="true" xMax="300.0" yMin="-50.0" width="310" xAxis="Time" display="Money &amp; Loans">
      <setup>set-plot-x-range 0 xmax
set-plot-y-range -50 ymax</setup>
      <update />
      <pen interval="1.0" mode="0" display="money" color="-16777216" legend="true">
        <setup />
        <update>plot money-total</update>
      </pen>
      <pen interval="1.0" mode="0" display="loans" color="-2674135" legend="true">
        <setup />
        <update>plot loans-total</update>
      </pen>
    </plot>
    <plot x="321" autoPlotX="true" yMax="1100.0" autoPlotY="true" yAxis="Svngs + Wllts" y="340" xMin="0.0" height="220" legend="true" xMax="300.0" yMin="-50.0" width="325" xAxis="Time" display="Savings &amp; Wallets">
      <setup>set-plot-x-range 0 xmax
set-plot-y-range -50 ymax</setup>
      <update />
      <pen interval="1.0" mode="0" display="savings" color="-10899396" legend="true">
        <setup />
        <update>plot savings-total</update>
      </pen>
      <pen interval="1.0" mode="0" display="wallets" color="-13345367" legend="true">
        <setup />
        <update>plot wallets-total</update>
      </pen>
    </plot>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  bank-loans
  bank-reserves
  bank-deposits
  bank-to-loan
  xmax
  ymax
  rich
  poor
  middle-class
  income-max
]

turtles-own [
  savings
  loans
  wallet
  temp-loan
  wealth
  customer
]

;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;                     ;;;
;;;  Setup Procedures   ;;;
;;;                     ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;


to setup
  clear-all
  initialize-settings
  create-turtles people [setup-turtles]
  poll-class
  setup-bank
  set xmax 300
  set ymax (2 * money-total)
  reset-ticks
end


to initialize-settings
  set rich 0
  set poor 0
  set middle-class 0
  set income-max 10
end

to setup-turtles  ;;Turtle Procedure
  set shape "person"
  setxy random-xcor random-ycor
  set wallet (random 2 * income-max)
  set savings 0
  set loans 0
  set wealth 0
  set customer -1
  get-color
end

to setup-bank
  set bank-loans 0
  set bank-reserves 0
  set bank-deposits 0
  set bank-to-loan 0
end

;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;                     ;;;
;;; Run Time Procedures ;;;
;;;                     ;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;

to go
  ask turtles [do-business]
  ask turtles [
    balance-books
    get-color
  ]
  bank-balance-sheet
  poll-class
  tick
end

;; polls the number in each corresponding economic class
to poll-class
  set rich (count turtles with [savings > income-max])
  set poor (count turtles with [loans > income-max])
  set middle-class (count turtles) - (rich + poor)
end

to do-business  ;;Turtle Procedure
  rt random 360
  fd 1
  ;; turtle has money to trade with, and there is
  ;; another turtle to trade with on the same patch
  if ((savings > 0) or (wallet > 0) or (bank-to-loan > 0)) [
    set customer one-of other turtles-here
    if customer != nobody and (random 2) = 0          ;;50% chance of trading
      [ifelse (random 2 = 0)                          ;;50% chance of trading $2 or $5, if trading
         [ask customer [set wallet wallet + 5]
          set wallet (wallet - 5)]
         [ask customer [set wallet wallet + 2]
          set wallet (wallet - 2)]
      ]
  ]
end

;; Check the balance of our wallet.
;; Put a positive balance in savings.  Try to get a loan to cover a
;; negative balance.  If we cannot get a loan (if bank-to-loan < 0)
;; then maintain the negative wallet balance until the next round.
to balance-books  ;;Turtle Procedure
  ifelse (wallet < 0)
   [ifelse (savings >= (- wallet))
      [withdraw-from-savings (- wallet)]
      [if (savings > 0)
         [withdraw-from-savings savings]
       set temp-loan bank-to-loan
       ifelse (temp-loan >= (- wallet))
         [take-out-a-loan (- wallet)]
         [take-out-a-loan temp-loan]
      ]
   ]
   [deposit-to-savings wallet]

;; repay loans if savings are available
  if (loans > 0) and (savings > 0) [
    ifelse (savings >= loans)
      [withdraw-from-savings loans
       repay-a-loan loans]
      [withdraw-from-savings savings
       repay-a-loan wallet]
  ]
end


;; Sets aside required amount from liabilities into
;; reserves, regardless of outstanding loans.  This may
;; result in a negative bank-to-loan amount, which
;; means that the bank will be unable to loan money
;; until it can set enough aside to account for reserves.
to bank-balance-sheet
  set bank-deposits sum [savings] of turtles
  set bank-loans sum [loans] of turtles
  set bank-reserves ((reserves / 100) * bank-deposits)
  set bank-to-loan (bank-deposits - (bank-reserves + bank-loans))
end


to deposit-to-savings [amount]  ;; Turtle Procedure
  set wallet (wallet - amount)
  set savings (savings + amount)
end

to withdraw-from-savings [amount]  ;; Turtle Procedure
  set wallet (wallet + amount)
  set savings (savings - amount)
end


to repay-a-loan [amount]  ;; Turtle Procedure
  set loans (loans - amount)
  set wallet (wallet - amount)
  set bank-to-loan (bank-to-loan + amount)
end

to take-out-a-loan [amount]  ;; Turtle Procedure
  set loans (loans + amount)
  set wallet (wallet + amount)
  set bank-to-loan (bank-to-loan - amount)
end


;; color codes the rich (green),
;; middle-class (gray), and poor (red)
to get-color ;;Turtle Procedure
  set color gray
  if (savings > income-max) [set color green]
  if (loans > income-max)  [set color red]
  set wealth (savings - loans)
end


to-report savings-total
  report sum [savings] of turtles
end

to-report loans-total
  report sum [loans] of turtles
end

to-report wallets-total
  report sum [wallet] of turtles
end

to-report money-total
  report sum [wallet + savings] of turtles
end


; Copyright 1998 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Bank Reserves

Canonical path: `Sample Models/Social Science/Economics/Unverified/Bank Reserves`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Economics/Unverified/Bank%20Reserves.nlogox. SHA-256 `bdd9b8eecf2776cc32ec96e570ba3f2ad5ec173a58bcc1db07ea929973b413ff`; bytes 50957; Git blob `6ff6a5845156a19ccc8e46bf74939a42127fce71`. Includes `None`; extensions `[]`.

### Binding semantic audit

Wrapped17x17,57 people, wallet random10+1. Distinct from Cash Flow: three ticks per cycle: ticks%3==0 business,==1 balance+shape,==2 EACH TURTLE calls bank sheet. Classes counted BEFORE phase, initial classes all0. Random-float360 movement. Negative available loan behavior same as source and explicitly preserved. Shape/color only sets green/red over previous blue/color and does not reset middle to gray. Wealth excludes wallets. Bank aggregates may lag; zero people means bank sheet ask never executes. Reserve percent live; people setup-only. No stop. Native histogram50/1 bins and income/savings/money histories specified below.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="320" wrappingAllowedX="true" y="7" frameRate="30.0" minPycor="-8" height="310" showTickCounter="true" patchSize="18.0" fontSize="10" wrappingAllowedY="true" width="310" tickCounterLabel="ticks" maxPycor="8" updateMode="1" maxPxcor="8" minPxcor="-8" />
    <plot x="645" autoPlotX="true" yMax="57.0" autoPlotY="true" yAxis="People" y="60" xMin="0.0" height="198" legend="true" xMax="300.0" yMin="0.0" width="263" xAxis="Time" display="Income Dist">
      <setup>set-plot-x-range 0 x-max
set-plot-y-range 0 (count turtles)</setup>
      <update />
      <pen interval="1.0" mode="0" display="rich" color="-10899396" legend="true">
        <setup />
        <update>plot rich</update>
      </pen>
      <pen interval="1.0" mode="0" display="middle" color="-16777216" legend="true">
        <setup />
        <update>plot middle-class</update>
      </pen>
      <pen interval="1.0" mode="0" display="poor" color="-2674135" legend="true">
        <setup />
        <update>plot poor</update>
      </pen>
    </plot>
    <plot x="255" autoPlotX="true" yMax="600.0" autoPlotY="true" yAxis="Svngs + Wllts" y="325" xMin="0.0" height="240" legend="true" xMax="300.0" yMin="-50.0" width="260" xAxis="Time" display="Savings &amp; Wallets">
      <setup>set-plot-x-range 0 x-max
set-plot-y-range -50 y-max</setup>
      <update />
      <pen interval="1.0" mode="0" display="savings" color="-13345367" legend="true">
        <setup />
        <update>plot savings-total</update>
      </pen>
      <pen interval="1.0" mode="0" display="wallets" color="-10899396" legend="true">
        <setup />
        <update>plot wallets-total</update>
      </pen>
    </plot>
    <plot x="5" autoPlotX="true" yMax="600.0" autoPlotY="true" yAxis="Mny + Lns" y="325" xMin="0.0" height="240" legend="true" xMax="300.0" yMin="-50.0" width="243" xAxis="Time" display="Money &amp; Loans">
      <setup>set-plot-x-range 0 x-max
set-plot-y-range -50 y-max</setup>
      <update />
      <pen interval="1.0" mode="0" display="money" color="-16777216" legend="true">
        <setup />
        <update>plot money-total</update>
      </pen>
      <pen interval="1.0" mode="0" display="loans" color="-2674135" legend="true">
        <setup />
        <update>plot loans-total</update>
      </pen>
    </plot>
    <plot x="520" autoPlotX="false" yMax="57.0" autoPlotY="false" yAxis="People" y="325" xMin="0.0" height="240" legend="false" xMax="100.0" yMin="0.0" width="313" xAxis="poor &lt;--------&gt; rich" display="Wealth Distribution Histogram">
      <setup>set-plot-y-range 0 (count turtles)</setup>
      <update />
      <pen interval="1.0" mode="0" display="hist" color="-13345367" legend="true">
        <setup />
        <update>if( ticks mod 10 = 1 ) [
  let max-wealth max [wealth] of turtles
  let min-wealth min [wealth] of turtles
  let one-fifth-wealth 0.2 * (max-wealth - min-wealth)
  let num-bins 10
  let index 1
  let interval round ((plot-x-max - plot-x-min) / num-bins)
  plot-pen-reset
  repeat num-bins [
    plotxy ((index - 1) * interval + 0.002)
                 (count turtles with [
                      wealth &lt; (min-wealth + index * one-fifth-wealth) and
                      wealth &gt;= (min-wealth + (index - 1) * one-fifth-wealth)
                  ]
                 )

    plotxy  (index * interval)
                 (count turtles with [
                      wealth &lt; (min-wealth + index * one-fifth-wealth) and
                      wealth &gt;= (min-wealth + (index - 1) * one-fifth-wealth)
                  ]
                 )

    plotxy (index * interval + 0.001) 0
    set index index + 1
  ]
]</update>
      </pen>
    </plot>
    <button x="65" y="17" height="37" disableUntilTicks="false" forever="false" kind="Observer" width="89" display="setup">setup</button>
    <monitor x="160" precision="2" y="245" height="60" fontSize="11" width="115" display="Loans Total">loans-total</monitor>
    <monitor x="30" precision="2" y="245" height="60" fontSize="11" width="125" display="Bank Reserves">bank-reserves</monitor>
    <monitor x="160" precision="2" y="180" height="60" fontSize="11" width="115" display="Wallets Total">wallets-total</monitor>
    <monitor x="30" precision="2" y="180" height="60" fontSize="11" width="125" display="Bank to Loan">bank-to-loan</monitor>
    <monitor x="160" precision="2" y="115" height="60" fontSize="11" width="115" display="Savings Total">savings-total</monitor>
    <monitor x="30" precision="2" y="115" height="60" fontSize="11" width="125" display="Money Total">money-total</monitor>
    <button x="160" y="17" height="37" disableUntilTicks="true" forever="true" kind="Observer" width="87" display="go">go</button>
    <slider x="160" step="1.0" y="60" max="200.0" width="150" display="people" height="50" min="0.0" direction="Horizontal" default="57.0" variable="people" />
    <slider x="5" step="1.0" y="60" max="100.0" width="150" display="reserves" height="50" min="0.0" direction="Horizontal" default="52.0" variable="reserves" />
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  bank-loans
  bank-reserves
  bank-deposits
  bank-to-loan
  x-max
  y-max
  rich
  poor
  middle-class
  rich-threshold
]


turtles-own [
  savings
  loans
  wallet
  temp-loan
  wealth
  customer
]


to setup
  clear-all
  initialize-variables
  ask patches [set pcolor black]
  set-default-shape turtles "person"
  create-turtles people [setup-turtles]
  setup-bank
  set x-max 300
  set y-max 2 * money-total
  reset-ticks
end


to setup-turtles  ;; turtle procedure
  set color blue
  setxy random-xcor random-ycor
  set wallet (random rich-threshold) + 1 ;;limit money to threshold
  set savings 0
  set loans 0
  set wealth 0
  set customer -1
end


to setup-bank ;;initialize bank
  set bank-loans 0
  set bank-reserves 0
  set bank-deposits 0
  set bank-to-loan 0
end


to initialize-variables
  set rich 0
  set middle-class 0
  set poor 0
  set rich-threshold 10
end


to get-shape  ;;turtle procedure
  if (savings > 10)  [set color green]
  if (loans > 10) [set color red]
  set wealth (savings - loans)
end


to go
  ;;tabulates each distinct class population
  set rich (count turtles with [savings > rich-threshold])
  set poor (count turtles with [loans > 10])
  set middle-class (count turtles - (rich + poor))
  ask turtles [
    ifelse ticks mod 3 = 0
      [do-business] ;;first cycle, "do business"
      [ifelse ticks mod 3 = 1  ;;second cycle, "balance books" and "get shape"
         [balance-books
          get-shape]
         [bank-balance-sheet] ;;third cycle, "bank balance sheet"
      ]
  ]
  tick
end


to do-business  ;;turtle procedure
  rt random-float 360
  fd 1

  if ((savings > 0) or (wallet > 0) or (bank-to-loan > 0))
    [set customer one-of other turtles-here
     if customer != nobody
     [if (random 2) = 0                      ;; 50% chance of trading with customer
           [ifelse (random 2) = 0            ;; 50% chance of trading $5 or $2
              [ask customer [set wallet wallet + 5] ;;give 5 to customer
               set wallet (wallet - 5) ] ;;take 5 from wallet
              [ask customer [set wallet wallet + 2] ;;give 2 to customer
               set wallet (wallet - 2) ] ;;take 2 from wallet
           ]
        ]
     ]
end



;; First checks balance of the turtle's wallet, and then either puts
;; a positive balance in savings, or tries to get a loan to cover
;; a negative balance.  If it cannot get a loan (if bank-to-loan < 0)
;; then it maintains the negative balance until the next round.  It
;; then checks if it has loans and money in savings, and if so, will
;; proceed to pay as much of that loan off as possible from the money
;; in savings.

to balance-books
  ifelse (wallet < 0)
    [ifelse (savings >= (- wallet))
       [withdraw-from-savings (- wallet)]
       [if (savings > 0)
          [withdraw-from-savings savings]

        set temp-loan bank-to-loan           ;;temp-loan = amount available to borrow
        ifelse (temp-loan >= (- wallet))
          [take-out-loan (- wallet)]
          [take-out-loan temp-loan]
       ]
     ]
    [deposit-to-savings wallet]

  if (loans > 0 and savings > 0)            ;; when there is money in savings to payoff loan
    [ifelse (savings >= loans)
       [withdraw-from-savings loans
        repay-a-loan loans]
       [withdraw-from-savings savings
        repay-a-loan wallet]
    ]
end


;; Sets aside required amount from liabilities into
;; reserves, regardless of outstanding loans.  This may
;; result in a negative bank-to-loan amount, which
;; means that the bank will be unable to loan money
;; until it can set enough aside to account for reserves.

to bank-balance-sheet ;;update monitors
  set bank-deposits sum [savings] of turtles
  set bank-loans sum [loans] of turtles
  set bank-reserves (reserves / 100) * bank-deposits
  set bank-to-loan bank-deposits - (bank-reserves + bank-loans)
end


to deposit-to-savings [amount] ;;fundamental procedures
  set wallet wallet - amount
  set savings savings + amount
end


to withdraw-from-savings [amount] ;;fundamental procedures
  set wallet (wallet + amount)
  set savings (savings - amount)
end


to repay-a-loan [amount] ;;fundamental procedures
  set loans (loans - amount)
  set wallet (wallet - amount)
  set bank-to-loan (bank-to-loan + amount)
end


to take-out-loan [amount] ;;fundamental procedures
  set loans (loans + amount)
  set wallet (wallet + amount)
  set bank-to-loan (bank-to-loan - amount)
end


to-report savings-total
  report sum [savings] of turtles
end


to-report loans-total
  report sum [loans] of turtles
end


to-report wallets-total
  report sum [wallet] of turtles
end


to-report money-total
  report sum [wallet + savings] of turtles
end


; Copyright 1998 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Prisoner's Dilemma Basic

Canonical path: `Sample Models/Social Science/Prisoner's Dilemma/Prisoner's Dilemma Basic`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Prisoner's%20Dilemma/Prisoner's%20Dilemma%20Basic.nlogox. SHA-256 `a2fdd21082bd5cd3e8e5c5fb91cde6631cd8ac146bd02ed702a0fe51e379237b`; bytes 46616; Git blob `c73fe1c34b4d405b19680600ebadd5a189387699`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard35x35 no simulation clock: setup draws face and samples partner unless known. answer ALWAYS calls setup, then four outcomes: both silent1, you confess/partner silent0, you silent/partner confesses5, both confess3 years. Known partner/default switches below. User message adapted as persistent accessible result; repeated Step/Run means repeated independent answer actions, never implied iterated strategy. No source reporters/plots/tick; target action count must be labeled host rounds, native clock absent.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="313" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-17" height="354" showTickCounter="false" patchSize="10.0" fontSize="10" wrappingAllowedY="false" width="354" tickCounterLabel="ticks" maxPycor="17" updateMode="1" maxPxcor="17" minPxcor="-17" />
    <button x="169" y="80" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="100">answer</button>
    <switch x="64" y="195" height="40" on="false" variable="partner-silent?" width="204" display="partner-silent?" />
    <button x="64" y="80" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="104">setup</button>
    <switch x="64" y="115" height="40" on="true" variable="you-silent?" width="204" display="you-silent?" />
    <switch x="64" y="155" height="40" on="true" variable="partner-silence-known?" width="204" display="partner-silence-known?" />
    <note x="119" y="340" backgroundDark="0" fontSize="11" width="181" markdown="false" height="60" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">                 TRUE      FALSE
TRUE      1 year    5 years
FALSE      none     3 years</note>
    <note x="70" y="270" backgroundDark="0" fontSize="11" width="204" markdown="false" height="30" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">            YOUR JAIL TIME
-------------------------</note>
    <note x="176" y="308" backgroundDark="0" fontSize="11" width="122" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">partner-silent?</note>
    <note x="21" y="362" backgroundDark="0" fontSize="11" width="90" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">you-silent?</note>
    <note x="14" y="24" backgroundDark="0" fontSize="11" width="294" markdown="false" height="56" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Decide whether to remain silent or confess and
then answer the police to receive your sentence.</note>
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [partner-is-silent?]

to setup
  clear-all
  ;;Build the jail cell
  ask patches with [ count neighbors != 8 ] [
    set pcolor gray]

  ;;make the face visible
  create-turtles 1 [set color gray set size 30 set shape "face"]
  ;; set up the prisoner's dilemma
  ifelse partner-silence-known? [
    set partner-is-silent? partner-silent?
  ]
  [
    ;;if partner silence is not known, choose randomly whether or not he is silent.
    ifelse random 2 = 0
    [ set partner-is-silent? true ]
    [ set partner-is-silent? false ]
  ]
end

;;play the game, changing the face depending on the outcome.
to answer
  setup  ;;clears variables away so that setup doesn't need to be pressed every time.

  ;;next the four possible combinations of choices are dealt with.
  ;;the result corresponds to the tables in the interface and Info tabs.
  ;;first check to see if your partner was silent.
  ifelse partner-is-silent? [
      ;;now go through your two possible choices
      ifelse you-silent? [
      ask turtles [set shape "face silent"]
      user-message "You and your partner both remain silent.  You are sentenced to one year imprisonment."
    ] [
      ask turtles [set shape "face devious"]
      user-message "You confess and your partner remains silent. You go free."
    ]
  ]
  ;;your partner confessed.
  [
    ;;again go through your two possible choices
    ifelse you-silent? [
      ask turtles [set shape "face sucker" ]
      user-message "You remain silent, but your partner confesses.  You are sentenced to five years imprisonment."
    ] [
      ask turtles [set shape "face rational"]
      user-message "You and you partner both confess.  You are sentenced to three years imprisonment."
    ]
  ]
end


; Copyright 2002 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Prisoner's Dilemma Two Person Iterated

Canonical path: `Sample Models/Social Science/Prisoner's Dilemma/Prisoner's Dilemma Two Person Iterated`. Source URL: https://www.netlogoweb.org/assets/modelslib/Sample%20Models/Social%20Science/Prisoner's%20Dilemma/Prisoner's%20Dilemma%20Two%20Person%20Iterated.nlogox. SHA-256 `32461d17a6a52c10378a3f907a699260d9d07972a728647baa45894f05999978`; bytes 51916; Git blob `a9d6d7820433afcf74785c877110d8d72fc72da2`. Includes `None`; extensions `[]`.

### Binding semantic audit

Hard35x17 two players. Setup scores3, all defect flags false, choose hidden strategy uniformly seven choices; custom exactly tit-for-tat. User strategy then computer strategy from previous partner memory, both actions computed BEFORE payoffs. Payoff mutualC3,temptation5,sucker0,mutualD1. Update previous/two-round memories, score then tick. Average precision(score/(ticks+1),3) includes initial3 pseudo-round. Unforgiving uses partnerLast OR ownLast flag. Live chosen/hidden strategy switch and display-history. No stop. Prepare-next after setup describes cooperative initial state. Source cumulative scores monitors and average histories remain distinct.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="339" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-8" height="191" showTickCounter="true" patchSize="11.0" fontSize="24" wrappingAllowedY="false" width="389" tickCounterLabel="ticks" maxPycor="8" updateMode="1" maxPxcor="17" minPxcor="-17" />
    <button x="6" y="23" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="81" display="Setup">setup</button>
    <monitor x="22" precision="3" y="239" height="60" fontSize="11" width="100" display="human score">[ score ] of one-of users</monitor>
    <monitor x="125" precision="3" y="239" height="60" fontSize="11" width="105" display="computer score">[ score ] of one-of computers</monitor>
    <plot x="22" autoPlotX="true" yMax="5.0" autoPlotY="true" yAxis="Ave Score" y="303" xMin="0.0" height="176" legend="true" xMax="10.0" yMin="0.0" width="283" xAxis="Iterations" display="Average Score">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="human" color="-16777216" legend="true">
        <setup />
        <update>plot [ average-score ] of one-of users</update>
      </pen>
      <pen interval="1.0" mode="0" display="computer" color="-13345367" legend="true">
        <setup />
        <update>plot [ average-score ] of one-of computers</update>
      </pen>
    </plot>
    <button x="87" y="23" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="96" display="Play Once">play</button>
    <button x="183" y="23" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="130" display="Play Repeatedly">play</button>
    <switch x="59" y="125" height="40" on="true" variable="select-computer-strategy?" width="199" display="select-computer-strategy?" />
    <chooser x="59" y="65" height="60" variable="human-strategy" current="0" width="199" display="human-strategy">
      <choice type="string" value="act-randomly" />
      <choice type="string" value="cooperate" />
      <choice type="string" value="defect" />
      <choice type="string" value="tit-for-tat" />
      <choice type="string" value="tit-for-two-tats" />
      <choice type="string" value="unforgiving" />
      <choice type="string" value="custom-strategy" />
    </chooser>
    <chooser x="59" y="165" height="60" variable="computer-strategy" current="3" width="199" display="computer-strategy">
      <choice type="string" value="act-randomly" />
      <choice type="string" value="cooperate" />
      <choice type="string" value="defect" />
      <choice type="string" value="tit-for-tat" />
      <choice type="string" value="tit-for-two-tats" />
      <choice type="string" value="unforgiving" />
      <choice type="string" value="custom-strategy" />
    </chooser>
    <output x="330" y="346" height="134" fontSize="12" width="393" />
    <switch x="340" y="305" height="40" on="true" variable="display-history?" width="172" display="display-history?" />
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
breed [ users user ]
breed [ computers computer ]

globals [
  hidden-strategy
]

turtles-own [
  score                  ; my current score
  defect-now?            ; what will I do this round?
  partner                ; my partner
  partner-defected?      ; did my partner defect last round?
  partner-defected-past? ; did my partner defect two rounds ago?
]

to setup
  clear-all
  ; place the computer
  set-default-shape computers "computer"
  create-computers 1 [
    set heading 90
    fd max-pxcor / 2
  ]
  ; place the human
  set-default-shape users "person"
  create-users 1 [
    set heading 270
    fd abs min-pxcor / 2
  ]
  ask turtles [
    set size 10
    set partner one-of other turtles
    ; initially assume you and your partner have always cooperated
    set defect-now? false
    set partner-defected? false
    set partner-defected-past? false
    set score 3.0
  ]
  ; choose the secret strategy the computer will
  ; play if select-computer-strategy? is off
  set hidden-strategy one-of [
    "act-randomly" "cooperate" "defect" "tit-for-tat"
    "tit-for-two-tats" "unforgiving" "custom-strategy"
  ]
  reset-ticks
  prepare-next-round
end

;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Runtime Procedures;;;
;;;;;;;;;;;;;;;;;;;;;;;;;

to play
  play-a-round
  tick
  prepare-next-round
end

to play-a-round
  ; run the strategy selected by the human
  ask users [ run human-strategy ]
  ; run the strategy selected for the computer, or the
  ; hidden strategy if `select-computer-strategy?` is off
  ifelse select-computer-strategy?
    [ ask computers [ run computer-strategy ] ]
    [ ask computers [ run hidden-strategy ] ]
  ; determine this round's payoffs based on the action each agent has chosen
  ask turtles [ get-payoff ]
end

to prepare-next-round
  ; update the displayed score in the view
  ask turtles [ set label average-score ]
  ; display the computer's action in the last round
  if display-history? [
    ask users [
      ifelse defect-now?
        [ output-print "Last turn you defected." ]
        [ output-print "Last turn you cooperated." ]
      ifelse partner-defected?
        [ output-print "Last turn your partner defected." ]
        [ output-print "Last turn your partner cooperated." ]
    ]
    output-print "Choose your action!"
  ]
end

to-report average-score ; Turtle reporter
  report precision (score / (ticks + 1)) 3
end

;;;;;;;;;;;;;;;;;;
;;; Strategies ;;;
;;;;;;;;;;;;;;;;;;

to act-randomly ; Turtle Procedure
  set defect-now? one-of [ true false ]
end

to cooperate ; Turtle Procedure
  set defect-now? false
end

to defect ; Turtle Procedure
  set defect-now? true
end

to tit-for-tat ; Turtle Procedure
  ifelse partner-defected?
    [ set defect-now? true ]
    [ set defect-now? false ]
end

to tit-for-two-tats ; Turtle Procedure
  ifelse partner-defected? and partner-defected-past?
    [ set defect-now? true ]
    [ set defect-now? false ]
end

to unforgiving ; Turtle Procedure
  ifelse partner-defected? or defect-now?
    [ set defect-now? true ]
    [ set defect-now? false ]
end

to custom-strategy ; Turtle Procedure
  ; Currently defaults to tit-for-tat.  Can you do better?
  ifelse partner-defected? ; partner defected stores your partner's action last round
    [ set defect-now? true ]
    [ set defect-now? false ]
end

;;;;;;;;;;;;;;;;;;;;;;
;;; End Strategies ;;;
;;;;;;;;;;;;;;;;;;;;;;

to get-payoff ; Turtle Procedure
  set partner-defected-past? partner-defected?
  set partner-defected? [ defect-now? ] of partner
  ifelse partner-defected?
    [ ifelse defect-now?
      [ set score score + 1 ]
      [ set score score + 0 ]
    ]
    [ ifelse defect-now?
      [ set score score + 5 ]
      [ set score score + 3 ]
    ]
end


; Copyright 2002 Uri Wilensky.
; See Info tab for full copyright and license.
```

## El Farol

Canonical path: `IABM Textbook/chapter 3/El Farol Extensions/El Farol`. Source URL: https://www.netlogoweb.org/assets/modelslib/IABM%20Textbook/chapter%203/El%20Farol%20Extensions/El%20Farol.nlogox. SHA-256 `236f508bc73e56fe5c8002615052842fd6b41b9a3777bc99fae835f4cdc8755a`; bytes 50864; Git blob `d3acc9d9ad2f8a804c084a52af3dd4d20d24012a`. Includes `None`; extensions `[]`.

### Binding semantic audit

Wrapped35x35,100 agents, memory5/10 strategies, threshold60. History starts2*memory random100 values; attendance first history although agents placed at home. Weights memory+1 in[-1,1], intercept100*w0, dot product past attendance; no clamp. Score sum absolute errors back memory weeks; initial bestScore=memory*100+1 (not infinity), <= ties last wins; if all exceed threshold retains previous strategy. After selection prediction is LAST scored strategy/week, not necessarily chosen strategy prediction. Predict all agents from common old history then random sequential relocation, attendance count bar, crowded iff>threshold, history prepend/drop, select strategies then tick. Unique occupancy presentation location has no behavioral meaning. Threshold live; memory/number strategies setup-bound to avoid inconsistent vector lengths; report source changing-memory errors if exercised. No terminal condition.

### Exact widgets, defaults, plots and actions

```xml
<widgets>
    <view x="298" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="-17" height="424" showTickCounter="true" patchSize="12.0" fontSize="24" wrappingAllowedY="true" width="424" tickCounterLabel="ticks" maxPycor="17" updateMode="1" maxPxcor="17" minPxcor="-17" />
    <button x="170" y="202" height="40" disableUntilTicks="true" forever="true" kind="Observer" width="63" display="go">go</button>
    <button x="40" y="202" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="66" display="setup">setup</button>
    <slider x="41" step="1" y="37" max="10" width="190" display="memory-size" height="50" min="1" direction="Horizontal" default="5.0" variable="memory-size" />
    <slider x="41" step="1" y="92" max="20" width="190" display="number-strategies" height="50" min="1" direction="Horizontal" default="10.0" variable="number-strategies" />
    <plot x="11" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="Attendance" y="262" xMin="0.0" height="212" legend="false" xMax="10.0" yMin="0.0" width="274" xAxis="Time" display="Bar Attendance">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="attendance" color="-16777216" legend="true">
        <setup />
        <update>plot attendance</update>
      </pen>
      <pen interval="1.0" mode="0" display="threshold" color="-2674135" legend="true">
        <setup />
        <update>;; plot a threshold line -- an attendance level above this line makes the bar
;; is unappealing, but below this line is appealing
plot-pen-reset
plotxy 0 overcrowding-threshold
plotxy plot-x-max overcrowding-threshold</update>
      </pen>
    </plot>
    <slider x="41" step="1" y="147" max="100" width="190" display="overcrowding-threshold" height="50" min="0" direction="Horizontal" default="60.0" variable="overcrowding-threshold" />
  </widgets>
  
```

### Exact named procedures and equations

```netlogo
globals [
  attendance        ;; the current attendance at the bar
  history           ;; list of past values of attendance
  home-patches      ;; agentset of green patches representing the residential area
  bar-patches       ;; agentset of blue patches representing the bar area
  crowded-patch     ;; patch where we show the "CROWDED" label
]

turtles-own [
  strategies      ;; list of strategies
  best-strategy   ;; index of the current best strategy
  attend?         ;; true if the agent currently plans to attend the bar
  prediction      ;; current prediction of the bar attendance
]

to setup
  clear-all
  set-default-shape turtles "person"

  ;; create the 'homes'
  set home-patches patches with [pycor < 0 or (pxcor <  0 and pycor >= 0)]
  ask home-patches [ set pcolor green ]

  ;; create the 'bar'
  set bar-patches patches with [pxcor > 0 and pycor > 0]
  ask bar-patches [ set pcolor blue ]

  ;; initialize the previous attendance randomly so the agents have a history
  ;; to work with from the start
  set history n-values (memory-size * 2) [random 100]
  ;; the history is twice the memory, because we need at least a memory worth of history
  ;; for each point in memory to test how well the strategies would have worked

  set attendance first history

  ;; use one of the patch labels to visually indicate whether or not the
  ;; bar is "crowded"
  ask patch (0.75 * max-pxcor) (0.5 * max-pycor) [
    set crowded-patch self
    set plabel-color yellow
  ]

  ;; create the agents and give them random strategies
  ;; these are the only strategies these agents will ever have though they
  ;; can change which of this "bag of strategies" they use every tick
  create-turtles 100 [
    set color white
    move-to-empty-one-of home-patches
    set strategies n-values number-strategies [random-strategy]
    set best-strategy first strategies
    update-strategies
  ]

  ;; start the clock
  reset-ticks
end


to go
  ;; update the global variables
  ask crowded-patch [ set plabel "" ]
  ;; each agent predicts attendance at the bar and decides whether or not to go
  ask turtles [
    set prediction predict-attendance best-strategy sublist history 0 memory-size
    set attend? (prediction <= overcrowding-threshold)  ;; true or false
  ]
  ;; depending on their decision, the agents go to the bar or stay at home
  ask turtles [
    ifelse attend?
      [ move-to-empty-one-of bar-patches
        set attendance attendance + 1 ]
      [ move-to-empty-one-of home-patches ]
  ]

  ;; if the bar is crowded indicate that in the view
  set attendance count turtles-on bar-patches
  if attendance > overcrowding-threshold [
    ask crowded-patch [ set plabel "CROWDED" ]
  ]
  ;; update the attendance history
  ;; remove oldest attendance and prepend latest attendance
  set history fput attendance but-last history
  ;; the agents decide what the new best strategy is
  ask turtles [ update-strategies ]
  ;; advance the clock
  tick
end

;; determines which strategy would have predicted the best results had it been used this round.
;; the best strategy is the one that has the sum of smallest differences between the
;; current attendance and the predicted attendance for each of the preceding
;; weeks (going back MEMORY-SIZE weeks)
;; this does not change the strategies at all, but it does (potentially) change the one
;; currently being used and updates the performance of all strategies
to update-strategies
  ;; initialize best-score to a maximum, which is the lowest possible score
  let best-score memory-size * 100 + 1
  foreach strategies [ the-strategy ->
    let score 0
    let week 1
    repeat memory-size [
      set prediction predict-attendance the-strategy sublist history week (week + memory-size)
      set score score + abs (item (week - 1) history - prediction)
      set week week + 1
    ]
    if (score <= best-score) [
      set best-score score
      set best-strategy the-strategy
    ]
  ]
end

;; this reports a random strategy. a strategy is just a set of weights from -1.0 to 1.0 which
;; determines how much emphasis is put on each previous time period when making
;; an attendance prediction for the next time period
to-report random-strategy
  report n-values (memory-size + 1) [1.0 - random-float 2.0]
end

;; This reports an agent's prediction of the current attendance
;; using a particular strategy and portion of the attendance history.
;; More specifically, the strategy is then described by the formula
;; p(t) = x(t - 1) * a(t - 1) + x(t - 2) * a(t -2) +..
;;      ... + x(t - MEMORY-SIZE) * a(t - MEMORY-SIZE) + c * 100,
;; where p(t) is the prediction at time t, x(t) is the attendance of the bar at time t,
;; a(t) is the weight for time t, c is a constant, and MEMORY-SIZE is an external parameter.
to-report predict-attendance [strategy subhistory]
  ;; the first element of the strategy is the constant, c, in the prediction formula.
  ;; one can think of it as the the agent's prediction of the bar's attendance
  ;; in the absence of any other data
  ;; then we multiply each week in the history by its respective weight
  report 100 * first strategy + sum (map [ [weight week] -> weight * week ] butfirst strategy subhistory)
end

;; In this model it doesn't really matter exactly which patch
;; a turtle is on, only whether the turtle is in the home area
;; or the bar area.  Nonetheless, to make a nice visualization
;; this procedure is used to ensure that we only have one
;; turtle per patch.
to move-to-empty-one-of [locations]  ;; turtle procedure
  move-to one-of locations
  while [any? other turtles-here] [
    move-to one-of locations
  ]
end


; Copyright 2007 Uri Wilensky.
; See Info tab for full copyright and license.
```
