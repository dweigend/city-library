# Selected social B02 exact source audit

All ten immutable browser-catalog identities are reconciled to archived research SHA-256, freshly fetched served bytes and pinned Galapagos Git blob/bytes. No literature or selection work is repeated. Full XML retains Info, shapes and experiments. Procedure annotations follow separately before contract freeze.

## Consumer Choice

Canonical path: `Sample Models/Social Science/Consumer Choice`; SHA-256 `b8973c79622215eee5fb4aa29abf5c92cd80480b1d1c81c7d5c8d5b569d15236`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="240" wrappingAllowedX="false" y="11" frameRate="30.0" minPycor="-25" height="514" showTickCounter="true" patchSize="10.0" fontSize="10" wrappingAllowedY="false" width="514" tickCounterLabel="ticks" maxPycor="25" updateMode="1" maxPxcor="25" minPxcor="-25" />
    <note x="5" y="10" backgroundDark="0" fontSize="14" width="186" markdown="false" height="18" textColorDark="-1" textColorLight="-5298144" backgroundLight="0">Community Settings</note>
    <slider x="5" step="10" y="35" max="1000" width="220" display="num-consumers" height="50" min="0" direction="Horizontal" default="100.0" variable="num-consumers" />
    <slider x="5" step="1" y="90" max="10" width="220" display="avg-connections" height="50" min="0" direction="Horizontal" default="5.0" variable="avg-connections" />
    <slider x="5" step="10" y="145" max="100" width="220" display="initial-%-orange-product" height="50" min="0" direction="Horizontal" default="50.0" variable="initial-%-orange-product" units="%" />
    <button x="5" y="205" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="70">setup</button>
    <button x="155" y="205" height="40" disableUntilTicks="true" forever="false" kind="Observer" width="70" display="go-once">go</button>
    <button x="80" y="205" height="40" disableUntilTicks="true" forever="true" kind="Observer" width="70" display="go">go</button>
    <slider x="5" step="0.05" y="290" max="1" width="220" display="norm-influence" height="50" min="0" direction="Horizontal" default="0.15" variable="norm-influence" />
    <slider x="5" step="0.05" y="550" max="1" width="220" display="quality-blue" height="50" min="0" direction="Horizontal" default="0.5" variable="quality-blue" />
    <note x="0" y="470" backgroundDark="0" fontSize="14" width="165" markdown="false" height="19" textColorDark="-1" textColorLight="-5298144" backgroundLight="0">Product Settings</note>
    <note x="10" y="265" backgroundDark="0" fontSize="14" width="115" markdown="false" height="18" textColorDark="-1" textColorLight="-5298144" backgroundLight="0">Agent Settings</note>
    <slider x="5" step="0.05" y="345" max="1" width="220" display="information-exchange" height="50" min="0" direction="Horizontal" default="0.05" variable="information-exchange" />
    <slider x="5" step="0.01" y="400" max="1" width="220" display="exploration" height="50" min="0" direction="Horizontal" default="0.01" variable="exploration" />
    <slider x="5" step="0.05" y="495" max="1" width="220" display="quality-orange" height="50" min="0" direction="Horizontal" default="0.5" variable="quality-orange" />
    <plot x="770" autoPlotX="true" yMax="10.0" autoPlotY="true" y="9" xMin="0.0" height="260" legend="false" xMax="10.0" yMin="0.0" width="410" xAxis="ticks" display="market-shares">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="orange" color="-955883" legend="true">
        <setup />
        <update>plot count turtles with [choice = 0]</update>
      </pen>
      <pen interval="1.0" mode="0" display="blue" color="-13345367" legend="true">
        <setup />
        <update>plot count turtles with [choice = 1]</update>
      </pen>
    </plot>
    <plot x="770" autoPlotX="true" yMax="1.0" autoPlotY="true" y="283" xMin="0.0" height="255" legend="false" xMax="10.0" yMin="0.0" width="410" xAxis="ticks" display="consumers-clustering">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot consumer-cluster</update>
      </pen>
    </plot>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
breed [ consumers consumer ]

consumers-own [
  choice               ; Selected product by the consumer: 0 for orange or 1 for blue
  satisfaction         ; Levels of satisfaction based on product quality
  personal-experience  ; Consumer's personal experience from using products
  utilities            ; Overall utilities from personal experiences and information gathered from neighbors
]

;;;;;;;;;;;;;;;;;;;;;;;;
;;; Setup Procedures ;;;
;;;;;;;;;;;;;;;;;;;;;;;;
to setup
  clear-all
  ask patches [set pcolor white]
  setup-consumers
  setup-connections
  reset-ticks
end

to setup-consumers
  set-default-shape turtles "circle"
  create-consumers num-consumers [
    setxy random-xcor random-ycor
    ; Randomly assign consumers to be either orange or blue product consumers
    ifelse random 100 < initial-%-orange-product [
      ; Orange product consumer initialization
      set choice 0                                ; Set choice to 0 for orange product
      set utilities [1 0]                         ; Initial utilities for choosing orange
    ] [
      ; Blue product consumer initialization
      set choice 1                                ; Set choice to 1 for blue product
      set utilities [0 1]                           ; Initial utilities for choosing blue
    ]

    ; Set initial satisfaction based on consumer's choice
    set satisfaction satisfaction-formation       ; Initial satisfaction based on product quality
    set personal-experience [0 0]                 ; Initial experience (no prior consumption)

    ; Update consumer appearance (color, shape, and size)
    update-consumer-appearance
  ]
end

to update-consumer-appearance                     ; Adjust appearance based on consumer's product choice
  ifelse choice = 0 [
    ; Appearance for orange product consumers
    set color orange
    set size 0.5 * (1 + 4 * quality-orange); Size based on quality of the orange product
  ] [
    ; Appearance for blue product consumers
    set color blue
    set size 0.5 * (1 + 4 * quality-blue)  ; Size based on quality of the blue product
  ]
end

to setup-connections                                    ; Establish social links among consumers based on average social connections
  let num-links (avg-connections * num-consumers) / 2
  while [ count links < num-links ] [                    ; Continue creating links until the desired number is reached
    ask one-of consumers [
      ; Find the nearest consumer not already linked to the current consumer
      let target min-one-of (other consumers with [ not link-neighbor? myself ]) [ distance myself ]
      if target != nobody [ create-link-with target ]  ; Create a link if a valid target is found
    ]
  ]
  update-link-appearance
end

to update-link-appearance                               ; Adjust link colors based on norm-influence and information-exchange values
  ask links [
   ifelse norm-influence = 0 and information-exchange = 0 [
      ; Set links to a visible light gray when both norm-influence and information-exchange are 0
      set color gray + 2
    ] [
      ; Scale link color to black based on value of norm-influence and information-exchange
      set color scale-color black (1 - (norm-influence + information-exchange)) 0.5 1
    ]
  ]
end

;;;;;;;;;;;;;;;;;;;;;;;
;;; Main Procedures ;;;
;;;;;;;;;;;;;;;;;;;;;;;
to go
  consume                                        ; Consumers make a choice between the two products
  update-utilities                               ; Update consumers' utiltiy based on the information
  update-link-appearance                         ; Adjust link appearance to reflect changes in norm-influence or information-exchange
  tick                                           ; Advance the simulation by one tick
end

to consume
  ask consumers [
    ; Decide whether to stick with current product, explore new options, or choose based on utilities
    (ifelse
      random-float 1 < item choice satisfaction [ set choice choice ] ; Higher satisfaction -> more likely to stick with current product
      random-float 1 < exploration [set choice 1 - choice]            ; If not satisfied, maybe try randomly switching to other product
      item 0 utilities != item 1 utilities [                          ; If not satisfied and not randomly exploring, pick product with higher utilities
          set choice ifelse-value (item 0 utilities > item 1 utilities) [0] [1]
      ]
    )

    ; Update consumers' satisfaction and appearance based on their choice
    set satisfaction satisfaction-formation
    update-consumer-appearance
  ]
end

to update-utilities           ; Calculates utilities by combining personal experiences and information gathered from neighbors
  ask consumers [
    foreach [0 1] [option ->
      ; Update personal experience based on current choice
      if choice = option [
        set personal-experience replace-item choice personal-experience (item choice quality-products)
      ]

      ; Gather product quality info from neighbors based on information-exchange probability.
      ; Currently, we assume that neighbor-info is fully updated if any linked neighbors have chosen the same product (as option)
      let neighbor-info 0     ; Stores product quality information from neighbors during calculations
      if (random-float 1 <= information-exchange) and (any? link-neighbors with [choice = option]) [
        set neighbor-info item option quality-products
      ]

      ; Update norm-utilities based on observed neighbor choices
      let norm-util 0         ; Stores norm-based utilities during calculations
      if any? link-neighbors [
        set norm-util (count link-neighbors with [choice = option] / count link-neighbors)
      ]
      ; Combine personal experience with neighbor information to create temporary product utility
      let self-info item option personal-experience
      let prod-util (self-info + neighbor-info) / 2

      ; Integrate product utility with norm-based utility using norm-influence
      set utilities replace-item option utilities (norm-influence * norm-util + (1 - norm-influence) * prod-util)
    ]
  ]
end

;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;Reporters ;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;
to-report quality-products       ; Report the quality of products
  report list quality-orange quality-blue
end

to-report satisfaction-formation
  ; We assume that the satisfaction derived from consuming a product has a logarithmic relationship with its quality.
  ; Alternatively, satisfaction could also follow a linear relationship with product quality.
  let satis-temp [0 0]
  set satis-temp replace-item choice satis-temp (log (1 + 9 * item choice quality-products) 10)   ; Logarithmic transformation
  ;set satis-temp replace-item choice satis-temp (item choice quality-products)                   ; Linear transformation
  report satis-temp
end

to-report consumer-cluster  ; Cluster analysis to assess clustering between the agent and neighboring agents
  let cluster-list []       ; Initialize an empty list to store cluster values
  ask consumers [
    let num-neighbors count link-neighbors                                       ; Count the number of neighboring agents
    let num-same count link-neighbors with [ choice = [choice] of myself ]       ; Count neighbors with the same choice
    let a-cluster ifelse-value (num-neighbors = 0) [0] [num-same / num-neighbors]; Calculate the cluster value, defaulting to 0 if there are no neighbors
    set cluster-list lput a-cluster cluster-list                                 ; Add the cluster value to the list
  ]
  report (sum cluster-list / num-consumers)                                      ; Return the average clustering value
end


; Copyright 2024 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Rebellion

Canonical path: `Sample Models/Social Science/Rebellion`; SHA-256 `859b52417ee69fda8f0f193be666828f9023bef4fce6b84f1d07e09836a53fce`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="270" wrappingAllowedX="true" y="9" frameRate="30.0" minPycor="0" height="404" showTickCounter="true" patchSize="10.0" fontSize="10" wrappingAllowedY="true" width="404" tickCounterLabel="ticks" maxPycor="39" updateMode="1" maxPxcor="39" minPxcor="0" />
    <note x="10" y="10" backgroundDark="0" fontSize="14" width="101" markdown="false" height="20" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Initial Settings</note>
    <slider x="9" step="0.1" y="36" max="100.0" width="205" display="initial-cop-density" height="50" min="0.0" direction="Horizontal" default="4.0" variable="initial-cop-density" units="%" />
    <slider x="9" step="1.0" y="89" max="100.0" width="205" display="initial-agent-density" height="50" min="0.0" direction="Horizontal" default="70.0" variable="initial-agent-density" units="%" />
    <slider x="10" step=".1" y="143" max="10.0" width="205" display="vision" height="50" min="0.0" direction="Horizontal" default="7.0" variable="vision" units="patches" />
    <button x="10" y="209" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="70">setup</button>
    <button x="87" y="209" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="70">go</button>
    <button x="164" y="209" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="94" display="watch one">set visualization "3D"
ask max-one-of agents [grievance]
  [ set size 2 watch-me ]</button>
    <monitor x="136" precision="3" y="248" height="61" fontSize="11" width="121" display="# of cops">count cops</monitor>
    <monitor x="9" precision="3" y="248" height="61" fontSize="11" width="121" display="# of agents">count agents</monitor>
    <switch x="9" y="423" height="40" on="true" variable="movement?" width="248" display="movement?" />
    <slider x="9" step="1.0" y="368" max="50.0" width="248" display="max-jail-term" height="50" min="0.0" direction="Horizontal" default="30.0" variable="max-jail-term" units="turns" />
    <slider x="9" step="0.01" y="313" max="1.0" width="248" display="government-legitimacy" height="50" min="0.0" direction="Horizontal" default="0.82" variable="government-legitimacy" />
    <chooser x="9" y="468" height="60" variable="visualization" current="0" width="248" display="visualization">
      <choice type="string" value="2D" />
      <choice type="string" value="3D" />
    </chooser>
    <monitor x="10" precision="1" y="537" height="60" fontSize="11" width="107" display="quiet (green)">count agents with [not active? and jail-term = 0]</monitor>
    <plot x="10" autoPlotX="true" yMax="150.0" autoPlotY="true" yAxis="agents" y="604" xMin="0.0" height="167" legend="true" xMax="20.0" yMin="0.0" width="335" xAxis="time" display="All agent types">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="quiet" color="-10899396" legend="true">
        <setup />
        <update>plot count agents with [not active? and jail-term = 0]</update>
      </pen>
      <pen interval="1.0" mode="0" display="jailed" color="-16777216" legend="true">
        <setup />
        <update>plot count agents with [jail-term &gt; 0]</update>
      </pen>
      <pen interval="1.0" mode="0" display="active" color="-2674135" legend="true">
        <setup />
        <update>plot count agents with [active?]</update>
      </pen>
    </plot>
    <monitor x="238" precision="3" y="539" height="60" fontSize="11" width="107" display="active (red)">count agents with [active?]</monitor>
    <monitor x="124" precision="1" y="537" height="60" fontSize="11" width="107" display="jailed (black)">count agents with [jail-term &gt; 0]</monitor>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
breed [ agents an-agent ]
breed [ cops cop ]

globals [
  k                   ; factor for determining arrest probability
  threshold           ; by how much must G > N to make someone rebel?
]

agents-own [
  risk-aversion       ; R, fixed for the agent's lifetime, ranging from 0-1 (inclusive)
  perceived-hardship  ; H, also ranging from 0-1 (inclusive)
  active?             ; if true, then the agent is actively rebelling
  jail-term           ; how many turns in jail remain? (if 0, the agent is not in jail)
]

patches-own [
  neighborhood        ; surrounding patches within the vision radius
]

to setup
  clear-all

  ; set globals
  set k 2.3
  set threshold 0.1

  ask patches [
    ; make background a slightly dark gray
    set pcolor gray - 1
    ; cache patch neighborhoods
    set neighborhood patches in-radius vision
  ]

  if initial-cop-density + initial-agent-density > 100 [
    user-message (word
      "The sum of INITIAL-COP-DENSITY and INITIAL-AGENT-DENSITY "
      "should not be greater than 100.")
    stop
  ]

  ; create cops
  create-cops round (initial-cop-density * .01 * count patches) [
    move-to one-of patches with [ not any? turtles-here ]
    display-cop
  ]

  ; create agents
  create-agents round (initial-agent-density * .01 * count patches) [
    move-to one-of patches with [ not any? turtles-here ]
    set heading 0
    set risk-aversion random-float 1.0
    set perceived-hardship random-float 1.0
    set active? false
    set jail-term 0
    display-agent
  ]

  ; start clock and plot initial state of system
  reset-ticks
end

to go
  ask turtles [
    ; Rule M: Move to a random site within your vision
    if (breed = agents and jail-term = 0) or breed = cops [ move ]
    ;   Rule A: Determine if each agent should be active or quiet
    if breed = agents and jail-term = 0 [ determine-behavior ]
    ;  Rule C: Cops arrest a random active agent within their radius
    if breed = cops [ enforce ]
  ]
  ; Jailed agents get their term reduced at the end of each clock tick
  ask agents [ if jail-term > 0 [ set jail-term jail-term - 1 ] ]
  ; update agent display
  ask agents [ display-agent ]
  ask cops [ display-cop ]
  ; advance clock and update plots
  tick
end

; AGENT AND COP BEHAVIOR

; move to an empty patch
to move ; turtle procedure
  if movement? or breed = cops [
    ; move to a patch in vision; candidate patches are
    ; empty or contain only jailed agents
    let targets neighborhood with [
      not any? cops-here and all? agents-here [ jail-term > 0 ]
    ]
    if any? targets [ move-to one-of targets ]
  ]
end

; AGENT BEHAVIOR

to determine-behavior
  set active? (grievance - risk-aversion * estimated-arrest-probability > threshold)
end

to-report grievance
  report perceived-hardship * (1 - government-legitimacy)
end

to-report estimated-arrest-probability
  let c count cops-on neighborhood
  let a 1 + count (agents-on neighborhood) with [ active? ]
  ; See Info tab for a discussion of the following formula
  report 1 - exp (- k * floor (c / a))
end

; COP BEHAVIOR

to enforce
  if any? (agents-on neighborhood) with [ active? ] [
    ; arrest suspect
    let suspect one-of (agents-on neighborhood) with [ active? ]
    move-to suspect  ; move to patch of the jailed agent
    ask suspect [
      set active? false
      set jail-term random max-jail-term
    ]
  ]
end

; VISUALIZATION OF AGENTS AND COPS

to display-agent  ; agent procedure
  ifelse visualization = "2D"
    [ display-agent-2d ]
    [ display-agent-3d ]
end

to display-agent-2d  ; agent procedure
  set shape "circle"
  ifelse active?
    [ set color red ]
    [ ifelse jail-term > 0
        [ set color black + 3 ]
        [ set color scale-color green grievance 1.5 -0.5 ] ]
end

to display-agent-3d  ; agent procedure
  set color scale-color green grievance 1.5 -0.5
  ifelse active?
    [ set shape "person active" ]
    [ ifelse jail-term > 0
        [ set shape "person jailed" ]
        [ set shape "person quiet" ] ]
end

to display-cop
  set color cyan
  ifelse visualization = "2D"
    [ set shape "triangle" ]
    [ set shape "person soldier" ]
end


; Copyright 2004 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Language Change

Canonical path: `Sample Models/Social Science/Language Change`; SHA-256 `99f71d55846902f726fdbe73059d852e9b8510a9102a3524dad3f625d8763e9f`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="390" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-45" height="368" showTickCounter="true" patchSize="4.0" fontSize="10" wrappingAllowedY="false" width="368" tickCounterLabel="ticks" maxPycor="45" updateMode="1" maxPxcor="45" minPxcor="-45" />
    <button x="10" y="10" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="95" display="setup">setup</button>
    <button x="10" y="220" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="193" display="reset states">reset-nodes</button>
    <slider x="10" step="1" y="55" max="100" width="195" display="num-nodes" height="50" min="2" direction="Horizontal" default="100.0" variable="num-nodes" />
    <slider x="10" step="1" y="115" max="100" width="194" display="percent-grammar-1" height="50" min="0" direction="Horizontal" default="60.0" variable="percent-grammar-1" units="%" />
    <slider x="225" step="0.0050" y="370" max="0.05" width="150" display="alpha" height="50" min="0" direction="Horizontal" default="0.025" variable="alpha" />
    <button x="10" y="175" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="194" display="redistribute grammars">redistribute-grammars</button>
    <slider x="225" step="0.05" y="210" max="1" width="150" display="threshold-val" height="50" min="0" direction="Horizontal" default="0.3" variable="threshold-val" />
    <switch x="225" y="270" height="40" on="true" variable="sink-state-1?" width="150" display="sink-state-1?" />
    <switch x="225" y="320" height="40" on="true" variable="logistic?" width="150" display="logistic?" />
    <button x="225" y="50" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="150" display="go once">go</button>
    <chooser x="225" y="140" height="60" variable="update-algorithm" current="0" width="150" display="update-algorithm">
      <choice type="string" value="individual" />
      <choice type="string" value="threshold" />
      <choice type="string" value="reward" />
    </chooser>
    <button x="225" y="90" height="35" disableUntilTicks="false" forever="true" kind="Observer" width="150">highlight</button>
    <button x="110" y="10" height="35" disableUntilTicks="false" forever="true" kind="Observer" width="95" display="layout">layout
display</button>
    <button x="225" y="10" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="150">go</button>
    <note x="10" y="265" backgroundDark="0" fontSize="10" width="200" markdown="false" height="155" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">* threshold-val and sink state only
apply for "individual" and "threshold"
updating algorithms

* when logistic? is off, there's a
built-in bias towards grammar 1

* alpha only applies to the
"reward" updating algorithm
and when logistic? is on</note>
    <plot x="15" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="State" y="430" xMin="0.0" height="150" legend="false" xMax="100.0" yMin="0.0" width="360" xAxis="Time" display="Mean state of language users in the network">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot mean [state] of nodes</update>
      </pen>
    </plot>
    <output x="390" y="390" height="70" fontSize="14" width="375" />
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
breed [nodes node]

nodes-own [
  state            ;; current grammar state (ranges from 0 to 1)
  orig-state       ;; each person's initially assigned grammar state
  spoken-state     ;; output of person's speech (0 or 1)
]

;;;
;;; SETUP PROCEDURES
;;;

to setup
  clear-all
  set-default-shape nodes "circle"
  ask patches [ set pcolor gray ]
  repeat num-nodes [ make-node ]
  distribute-grammars
  create-network
  repeat 100 [ layout ]
  reset-ticks
end

;; Create a new node, initialize its state
to make-node
  create-nodes 1 [
    ;; start in random position near edge of world
    rt random-float 360
    fd max-pxcor
    set size 2
    set state 0.0
  ]
end

;; Initialize a select proportion of individuals to start with grammar 1
to distribute-grammars
  ask nodes [ set state 0 ]
  ;; ask a select proportion of people to switch to 1
  ask n-of ((percent-grammar-1 / 100) * num-nodes) nodes
    [ set state 1.0 ]
  ask nodes [
    set orig-state state     ;; used in reset-states
    set spoken-state state   ;; initial spoken state, for first timestep
    update-color
  ]
end

to create-network
  ;; make the initial network of two nodes and an edge
  let partner nobody
  let first-node one-of nodes
  let second-node one-of nodes with [self != first-node]
  ;; make the first edge
  ask first-node [ create-link-with second-node [ set color white ] ]
  ;; randomly select unattached node to add to network
  let new-node one-of nodes with [not any? link-neighbors]
  ;; and connect it to a partner already in the network
  while [new-node != nobody] [
    set partner find-partner
    ask new-node [ create-link-with partner [ set color white ] ]
    layout
    set new-node one-of nodes with [not any? link-neighbors]
  ]
end

to update-color
  set color scale-color red state 0 1
end

to reset-nodes
  clear-all-plots
  ask nodes [
    set state orig-state
    update-color
  ]
  reset-ticks
end

to redistribute-grammars
  clear-all-plots
  distribute-grammars
  reset-ticks
end

;; reports a string of the agent's initial grammar
to-report orig-grammar-string
  report ifelse-value orig-state = 1.0 ["1"] ["0"]
end

;;;
;;; GO PROCEDURES
;;;

to go
  ask nodes [ communicate-via update-algorithm ]
  ask nodes [ update-color ]
  tick
end

to communicate-via [ algorithm ] ;; node procedure
  ;; Discrete Grammar ;;
  ifelse (algorithm = "threshold")
  [ listen-threshold ]
  [ ifelse (algorithm = "individual")
    [ listen-individual ]
    [ ;; Probabilistic Grammar ;;
      ;; speak and ask all neighbors to listen
      if (algorithm = "reward")
      [ speak
        ask link-neighbors
        [ listen [spoken-state] of myself ]
   ]]]
end

;; Speaking & Listening
to listen-threshold ;; node procedure
  let grammar-one-sum sum [state] of link-neighbors
  ifelse grammar-one-sum >= (count link-neighbors * threshold-val)
  [ set state 1 ]
  [ ;; if there are not enough neighbors with grammar 1,
    ;; and 1 is not a sink state, then change to 0
    if not sink-state-1? [ set state 0 ]
  ]
end

to listen-individual
  set state [state] of one-of link-neighbors
end

to speak ;; node procedure
  ;; alpha is the level of bias in favor of grammar 1
  ;; alpha is constant for all nodes.
  ;; the alpha value of 0.025 works best with the logistic function
  ;; adjusted so that it takes input values [0,1] and output to [0,1]
  if logistic?
  [ let gain (alpha + 0.1) * 20
    let filter-val 1 / (1 + exp (- (gain * state - 1) * 5))
    ifelse random-float 1.0 <= filter-val
    [ set spoken-state 1 ]
    [ set spoken-state 0 ]
  ]
  ;; for probabilistic learners who only have bias for grammar 1
  ;; no preference for discrete grammars (i.e., no logistic)
  if not logistic?
  [ ;; the slope needs to be greater than 1, so we arbitrarily set to 1.5
    ;; when state is >= 2/3, the biased-val would be greater than or equal to 1
    let biased-val 1.5 * state
    if biased-val >= 1 [ set biased-val 1 ]
    ifelse random-float 1.0 <= biased-val
    [ set spoken-state 1 ]
    [ set spoken-state 0 ]
  ]
end

;; Listening uses a linear reward/punish algorithm
to listen [heard-state] ;; node procedure
  let gamma 0.01 ;; for now, gamma is the same for all nodes
  ;; choose a grammar state to be in
  ifelse random-float 1.0 <= state
  [
    ;; if grammar 1 was heard
    ifelse heard-state = 1
    [ set state state + (gamma * (1 - state)) ]
    [ set state (1 - gamma) * state ]
  ][
    ;; if grammar 0 was heard
    ifelse heard-state = 0
    [ set state state * (1 - gamma) ]
    [ set state gamma + state * (1 - gamma) ]
  ]
end

;;
;; Making the network
;;
;; This code is borrowed from Lottery Example, from the Code Examples section of the Models Library.
;; The idea behind this procedure is as the following.
;; The sum of the sizes of the turtles is set as the number of "tickets" we have in our lottery.
;; Then we pick a random "ticket" (a random number), and we step through the
;; turtles to find which turtle holds that ticket.
to-report find-partner
  let pick random-float sum [count link-neighbors] of (nodes with [any? link-neighbors])
  let partner nobody
  ask nodes
  [ ;; if there's no winner yet
    if partner = nobody
    [ ifelse count link-neighbors > pick
      [ set partner self]
      [ set pick pick - (count link-neighbors)]
    ]
  ]
  report partner
end

to layout
  layout-spring (turtles with [any? link-neighbors]) links 0.4 6 1
end

to highlight
  ifelse mouse-inside?
    [ do-highlight ]
    [ undo-highlight ]
  display
end

;; remove any previous highlights
to undo-highlight
  clear-output
  ask nodes [ update-color ]
  ask links [ set color white ]
end

to do-highlight
  let highlight-color blue
  let min-d min [distancexy mouse-xcor mouse-ycor] of nodes
  ;; get the node closest to the mouse
  let the-node one-of nodes with
  [any? link-neighbors and distancexy mouse-xcor mouse-ycor = min-d]
  ;; get the node that was previously the highlight-color
  let highlighted-node one-of nodes with [color = highlight-color]
  if the-node != nobody and the-node != highlighted-node
  [ ;; highlight the chosen node
    ask the-node
    [ undo-highlight
      output-print word "original grammar state: "  orig-grammar-string
      output-print word "current grammar state: " precision state 5
      set color highlight-color
      ;; highlight edges connecting the chosen node to its neighbors
      ask my-links [ set color cyan - 1 ]
      ;; highlight neighbors
      ask link-neighbors [ set color blue + 1 ]
    ]
  ]
end


; Copyright 2007 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Party

Canonical path: `Sample Models/Social Science/Party`; SHA-256 `a86f4b7e1d631f69bf9db2a4ff54d77387a8de802487d536c3f0c1f984ebf272`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="265" wrappingAllowedX="true" y="7" frameRate="30.0" minPycor="-55" height="559" showTickCounter="true" patchSize="5.0" fontSize="14" wrappingAllowedY="false" width="414" tickCounterLabel="ticks" maxPycor="55" updateMode="1" maxPxcor="1" minPxcor="-80" />
    <slider x="5" step="1" y="4" max="300" width="250" display="number" height="50" min="0" direction="Horizontal" default="70.0" variable="number" />
    <slider x="5" step="1.0" y="175" max="99.0" width="250" display="tolerance" height="50" min="0.0" direction="Horizontal" default="25.0" variable="tolerance" units="%" />
    <slider x="5" step="1" y="60" max="20" width="250" display="num-groups" height="50" min="5" direction="Horizontal" default="10.0" variable="num-groups" />
    <button x="6" y="120" height="44" disableUntilTicks="false" forever="false" kind="Observer" width="68" display="setup">setup</button>
    <button x="173" y="120" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="80" display="go">go</button>
    <button x="83" y="120" height="45" disableUntilTicks="true" forever="false" kind="Observer" width="81" display="go once">go</button>
    <monitor x="757" precision="3" y="10" height="60" fontSize="11" width="125" display="number happy">count turtles with [happy?]</monitor>
    <monitor x="760" precision="3" y="300" height="60" fontSize="11" width="125" display="single sex groups">boring-groups</monitor>
    <plot x="695" autoPlotX="true" yMax="150.0" autoPlotY="true" y="365" xMin="0.0" height="200" legend="false" xMax="10.0" yMin="0.0" width="265" xAxis="clock" display="Number Happy">
      <setup>set-plot-y-range 0 number</setup>
      <update />
      <pen interval="1.0" mode="0" display="Happy" color="-10899396" legend="true">
        <setup />
        <update>plot count turtles with [happy?]</update>
      </pen>
    </plot>
    <plot x="690" autoPlotX="true" yMax="12.0" autoPlotY="true" y="75" xMin="0.0" height="200" legend="false" xMax="10.0" yMin="0.0" width="265" xAxis="clock" display="Single Sex Groups">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Single Sex" color="-2674135" legend="true">
        <setup />
        <update>plot boring-groups</update>
      </pen>
    </plot>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
globals [
  group-sites    ;; agentset of patches where groups are located
  boring-groups  ;; how many groups are currently single-sex
]

turtles-own [
  happy?         ;; true or false
  my-group-site
]

to setup
  clear-all
  set group-sites patches with [group-site?]
  set-default-shape turtles "person"
  create-turtles number [
    choose-sex                   ;; become a man or a woman
    set size 3                   ;; be easier to see
    set my-group-site one-of group-sites
    move-to my-group-site
  ]
  ask turtles [ update-happiness ]
  count-boring-groups
  update-labels
  ask turtles [ spread-out-vertically ]
  reset-ticks
end

to go
  if all? turtles [happy?]
    [ stop ]  ;; stop the simulation if everyone is happy
  ask turtles [ move-to my-group-site ]  ;; put all people back to their group sites
  ask turtles [ update-happiness ]
  ask turtles [ leave-if-unhappy ]
  find-new-groups
  update-labels
  count-boring-groups
  ask turtles [
    set my-group-site patch-here
    spread-out-vertically
  ]
  tick
end

to update-happiness  ;; turtle procedure
  let total count turtles-here
  let same count turtles-here with [color = [color] of myself]
  let opposite (total - same)
  ;; you are happy if the proportion of people of the opposite sex
  ;; does not exceed your tolerance
  set happy? (opposite / total) <= (tolerance / 100)
end

to leave-if-unhappy  ;; turtle procedure
  if not happy? [
    set heading one-of [90 270]  ;; randomly face right or left
    fd 1                         ;; leave old group
  ]
end

to find-new-groups
  display   ;; force display update so we see animation
  let malcontents turtles with [not member? patch-here group-sites]
  if not any? malcontents [ stop ]
  ask malcontents [ fd 1 ]
  find-new-groups
end

to-report group-site?  ;; patch procedure
  ;; if your pycor is 0 and your pxcor is where a group should be located,
  ;; then you're a group site.
  ;; In this model (0,0) is near the right edge, so pxcor is usually
  ;; negative.
  ;; first figure out how many patches apart the groups will be
  let group-interval floor (world-width / num-groups)
  report
    ;; all group sites are in the middle row
    (pycor = 0) and
    ;; leave a right margin of one patch, for legibility
    (pxcor <= 0) and
    ;; the distance between groups must divide evenly into
    ;; our pxcor
    (pxcor mod group-interval = 0) and
    ;; finally, make sure we don't wind up with too many groups
    (floor ((- pxcor) / group-interval) < num-groups)
end

to spread-out-vertically  ;; turtle procedure
  ifelse woman?
    [ set heading 180 ]  ;; face south
    [ set heading   0 ]  ;; face north
  fd 4                   ;; leave a gap
  while [any? other turtles-here] [
    if-else can-move? 2 [
      fd 1
    ]
    [ ;; else, if we reached the edge of the screen
      set xcor xcor - 1  ;; take a step to the left
      set ycor 0         ;; and move to the base a new stack
      fd 4
    ]
  ]
end

to count-boring-groups
  ask group-sites [
    ifelse boring?
      [ set plabel-color gray  ]
      [ set plabel-color white ]
  ]
  set boring-groups count group-sites with [plabel-color = gray]
end

to-report boring?  ;; patch procedure
  ;; To see whether this group is single sex, we collect the colors
  ;; of the turtles into a list, then remove all the duplicates
  ;; from the list.  If the result is a list with exactly one color
  ;; in it, then the group is single sex.
  report length remove-duplicates ([color] of turtles-here) = 1
end

to update-labels
  ask group-sites [ set plabel count turtles-here ]
end

;;;
;;; color procedures
;;;

;; Blue represents male, pink represents female. No stereotypes are meant
;; to be promoted. Simply change the colors right here if you'd like.

to choose-sex  ;; turtle procedure
  set color one-of [pink blue]
end

to-report woman?  ;; turtle procedure
  report color = pink
end


; Copyright 1997 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Ethnocentrism

Canonical path: `Sample Models/Social Science/Ethnocentrism`; SHA-256 `366bca9cfe1417bf6ff6c456581573d91bcf9e252dd8f6a0afa80954edd3dc81`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="339" wrappingAllowedX="true" y="10" frameRate="30.0" minPycor="0" height="463" showTickCounter="true" patchSize="9.0" fontSize="10" wrappingAllowedY="true" width="463" tickCounterLabel="ticks" maxPycor="50" updateMode="1" maxPxcor="50" minPxcor="0" />
    <button x="9" y="11" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="104" display="setup empty">setup-empty</button>
    <slider x="8" step="1.0" y="238" max="100.0" width="166" display="immigrants-per-day" height="50" min="0.0" direction="Horizontal" default="1.0" variable="immigrants-per-day" />
    <slider x="8" step="0.05" y="180" max="1.0" width="166" display="death-rate" height="50" min="0.0" direction="Horizontal" default="0.1" variable="death-rate" />
    <slider x="8" step="0.0010" y="126" max="1.0" width="166" display="mutation-rate" height="50" min="0.0" direction="Horizontal" default="0.005" variable="mutation-rate" />
    <slider x="8" step="0.01" y="354" max="1.0" width="323" display="immigrant-chance-cooperate-with-different" height="50" min="0.0" direction="Horizontal" default="0.5" variable="immigrant-chance-cooperate-with-different" />
    <slider x="181" step="0.01" y="126" max="1.0" width="150" display="initial-PTR" height="50" min="0.0" direction="Horizontal" default="0.12" variable="initial-PTR" />
    <slider x="181" step="0.01" y="180" max="1.0" width="150" display="cost-of-giving" height="50" min="0.0" direction="Horizontal" default="0.01" variable="cost-of-giving" />
    <slider x="181" step="0.01" y="238" max="1.0" width="150" display="gain-of-receiving" height="50" min="0.0" direction="Horizontal" default="0.03" variable="gain-of-receiving" />
    <slider x="8" step="0.01" y="297" max="1.0" width="323" display="immigrant-chance-cooperate-with-same" height="50" min="0.0" direction="Horizontal" default="0.5" variable="immigrant-chance-cooperate-with-same" />
    <note x="9" y="52" backgroundDark="0" fontSize="11" width="322" markdown="false" height="65" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Circles cooperate with same color
Squares defect with same color
Filled-in shapes cooperate with different color
Empty shapes defect with different color
</note>
    <button x="231" y="11" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="101">go</button>
    <button x="121" y="11" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="102" display="setup full">setup-full</button>
    <plot x="8" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="count" y="409" xMin="0.0" height="209" legend="true" xMax="10.0" yMin="0.0" width="325" xAxis="time" display="Strategy Counts">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="CC" color="-10899396" legend="true">
        <setup />
        <update>plotxy ticks count turtles with [shape = "circle"]</update>
      </pen>
      <pen interval="1.0" mode="0" display="CD" color="-2674135" legend="true">
        <setup />
        <update>plotxy ticks count turtles with [shape = "circle 2"]</update>
      </pen>
      <pen interval="1.0" mode="0" display="DC" color="-4079321" legend="true">
        <setup />
        <update>plotxy ticks count turtles with [shape = "square"]</update>
      </pen>
      <pen interval="1.0" mode="0" display="DD" color="-16777216" legend="true">
        <setup />
        <update>plotxy ticks count turtles with [shape = "square 2"]</update>
      </pen>
    </plot>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
;; agents have a probablity to reproduce and a strategy
turtles-own [ ptr cooperate-with-same? cooperate-with-different? ]

globals [
  ;; the remaining variables support the replication of published experiments
  meet                  ;; how many interactions occurred this turn
  meet-agg              ;; how many interactions occurred through the run
  last100meet           ;; meet for the last 100 ticks
  meetown               ;; what number of individuals met someone of their own color this turn
  meetown-agg           ;; what number of individuals met someone of their own color throughout the run
  last100meetown        ;; meetown for the last 100 ticks
  meetother             ;; what number of individuals met someone of a different color this turn
  meetother-agg         ;; what number of individuals met someone of a different color throughout the run
  last100meetother      ;; meetother for the last 100 ticks
  coopown               ;; how many interactions this turn were cooperating with the same color
  coopown-agg           ;; how many interactions throughout the run were cooperating with the same color
  last100coopown        ;; coopown for the last 100 ticks
  coopother             ;; how many interactions this turn were cooperating with a different color
  coopother-agg         ;; how many interactions throughout the run were cooperating with a different color
  defother              ;; how many interactions this turn were defecting with a different color
  defother-agg          ;; how many interactions throughout the run were defecting with a different color
  last100defother       ;; defother for the last 100 ticks
  last100cc             ;; how many cooperate-cooperate genotypes have there been in the last 100 ticks
  last100cd             ;; how many cooperate-defect genotypes have there been in the last 100 ticks
  last100dc             ;; how many defect-cooperate genotypes have there been in the last 100 ticks
  last100dd             ;; how many defect-defect genotypes have there been in the last 100 ticks
  last100consist-ethno  ;; how many interactions consistent with ethnocentrism in the last 100 ticks
  last100coop           ;; how many interactions have been cooperation in the last 100 ticks
]

to setup-empty
  clear-all
  initialize-variables
  reset-ticks
end

;; creates a world with an agent on each patch
to setup-full
  clear-all
  initialize-variables
  ask patches [ create-turtle ]
  reset-ticks
end

to initialize-variables
  ;; initialize all the variables
  set meetown 0
  set meetown-agg 0
  set meet 0
  set meet-agg 0
  set coopown 0
  set coopown-agg 0
  set defother 0
  set defother-agg 0
  set meetother 0
  set meetother-agg 0
  set coopother 0
  set coopother-agg 0
  set last100dd []
  set last100cd []
  set last100cc []
  set last100dc []
  set last100coopown []
  set last100defother []
  set last100consist-ethno []
  set last100meetown []
  set last100meetother []
  set last100meet []
  set last100coop []
end

;; creates a new agent in the world
to create-turtle  ;; patch procedure
  sprout 1 [
    set color random-color
    ;; determine the strategy for interacting with someone of the same color
    set cooperate-with-same? (random-float 1.0 < immigrant-chance-cooperate-with-same)
    ;; determine the strategy for interacting with someone of a different color
    set cooperate-with-different? (random-float 1.0 < immigrant-chance-cooperate-with-different)
    ;; change the shape of the agent on the basis of the strategy
    update-shape
  ]
end

to-report random-color
  report one-of [red blue yellow green]
end

;; this is used to clear stats that change between each tick
to clear-stats
  set meetown 0
  set meet 0
  set coopown 0
  set defother 0
  set meetother 0
  set coopother 0
end

;; the main routine
to go
  clear-stats     ;; clear the turn based stats
  immigrate       ;; new agents immigrate into the world

  ;; reset the probability to reproduce
  ask turtles [ set ptr initial-ptr ]

  ;; have all of the agents interact with other agents if they can
  ask turtles [ interact ]
  ;; now they reproduce
  ask turtles [ reproduce ]
  death           ;; kill some of the agents
  update-stats    ;; update the states for the aggregate and last 100 ticks
  tick
end

;; random individuals enter the world on empty cells
to immigrate
  let empty-patches patches with [not any? turtles-here]
  ;; we can't have more immigrants than there are empty patches
  let how-many min list immigrants-per-day (count empty-patches)
  ask n-of how-many empty-patches [ create-turtle ]
end

to interact  ;; turtle procedure

  ;; interact with Von Neumann neighborhood
  ask turtles-on neighbors4 [
    ;; the commands inside the ASK are written from the point of view
    ;; of the agent being interacted with.  To refer back to the agent
    ;; that initiated the interaction, we use the MYSELF primitive.
    set meet meet + 1
    set meet-agg meet-agg + 1
    ;; do one thing if the individual interacting is the same color as me
    if color = [color] of myself [
      ;; record the fact the agent met someone of the own color
      set meetown meetown + 1
      set meetown-agg meetown-agg + 1
      ;; if I cooperate then I reduce my PTR and increase my neighbors
      if [cooperate-with-same?] of myself [
        set coopown coopown + 1
        set coopown-agg coopown-agg + 1
        ask myself [ set ptr ptr - cost-of-giving ]
        set ptr ptr + gain-of-receiving
      ]
    ]
    ;; if we are different colors we take a different strategy
    if color != [color] of myself [
      ;; record stats on encounters
      set meetother meetother + 1
      set meetother-agg meetother-agg + 1
      ;; if we cooperate with different colors then reduce our PTR and increase our neighbors
      ifelse [cooperate-with-different?] of myself [
        set coopother coopother + 1
        set coopother-agg coopother-agg + 1
        ask myself [ set ptr ptr - cost-of-giving ]
        set ptr ptr + gain-of-receiving
      ]
      [
        set defother defother + 1
        set defother-agg defother-agg + 1
      ]
    ]
  ]
end

;; use PTR to determine if the agent gets to reproduce
to reproduce  ;; turtle procedure
  ;; if a random variable is less than the PTR the agent can reproduce
  if random-float 1.0 < ptr [
    ;; find an empty location to reproduce into
    let destination one-of neighbors4 with [not any? turtles-here]
    if destination != nobody [
      ;; if the location exists hatch a copy of the current turtle in the new location
      ;;  but mutate the child
      hatch 1 [
        move-to destination
        mutate
      ]
    ]
  ]
end

;; modify the children of agents according to the mutation rate
to mutate  ;; turtle procedure
  ;; mutate the color
  if random-float 1.0 < mutation-rate [
    let old-color color
    while [color = old-color]
      [ set color random-color ]
  ]
  ;; mutate the strategy flags;
  ;; use NOT to toggle the flag
  if random-float 1.0 < mutation-rate [
    set cooperate-with-same? not cooperate-with-same?
  ]
  if random-float 1.0 < mutation-rate [
    set cooperate-with-different? not cooperate-with-different?
  ]
  ;; make sure the shape of the agent reflects its strategy
  update-shape
end

to death
  ;; check to see if a random variable is less than the death rate for each agent
  ask turtles [
    if random-float 1.0 < death-rate [ die ]
  ]
end

;; make sure the shape matches the strategy
to update-shape
  ;; if the agent cooperates with same they are a circle
  ifelse cooperate-with-same? [
    ifelse cooperate-with-different?
      [ set shape "circle" ]    ;; filled in circle (altruist)
      [ set shape "circle 2" ]  ;; empty circle (ethnocentric)
  ]
  ;; if the agent doesn't cooperate with same they are a square
  [
    ifelse cooperate-with-different?
      [ set shape "square" ]    ;; filled in square (cosmopolitan)
      [ set shape "square 2" ]  ;; empty square (egoist)
  ]
end

;; this routine calculates a moving average of some stats over the last 100 ticks
to update-stats
  set last100dd        shorten lput (count turtles with [shape = "square 2"]) last100dd
  set last100cc        shorten lput (count turtles with [shape = "circle"]) last100cc
  set last100cd        shorten lput (count turtles with [shape = "circle 2"]) last100cd
  set last100dc        shorten lput (count turtles with [shape = "square"]) last100dc
  set last100coopown   shorten lput coopown last100coopown
  set last100defother  shorten lput defother last100defother
  set last100meetown   shorten lput meetown last100meetown
  set last100coop      shorten lput (coopown + coopother) last100coop
  set last100meet      shorten lput meet last100meet
  set last100meetother shorten lput meetother last100meetother
end

;; this is used to keep all of the last100 lists the right length
to-report shorten [the-list]
  ifelse length the-list > 100
    [ report butfirst the-list ]
    [ report the-list ]
end

;; these are used in the BehaviorSpace experiments

to-report meetown-percent
  report meetown / max list 1 meet
end
to-report meetown-agg-percent
  report meetown-agg / max list 1 meet-agg
end
to-report coopown-percent
  report coopown / max list 1 meetown
end
to-report coopown-agg-percent
  report coopown-agg / max list 1 meetown-agg
end
to-report defother-percent
  report defother / max list 1 meetother
end
to-report defother-agg-percent
  report defother-agg / max list 1 meetother-agg
end
to-report consist-ethno-percent
  report (defother + coopown) / (max list 1 meet )
end
to-report consist-ethno-agg-percent
  report (defother-agg + coopown-agg) / (max list 1 meet-agg )
end
to-report coop-percent
  report (coopown + coopother) / (max list 1 meet )
end
to-report coop-agg-percent
  report (coopown-agg + coopother-agg) / (max list 1 meet-agg)
end
to-report cc-count
  report sum last100cc / max list 1 length last100cc
end
to-report cd-count
  report sum last100cd / max list 1 length last100cd
end
to-report dc-count
  report sum last100dc / max list 1 length last100dc
end
to-report dd-count
  report sum last100dd / max list 1 length last100dd
end
to-report cc-percent
  report cc-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))
end
to-report cd-percent
  report cd-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))
end
to-report dc-percent
  report dc-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))
end
to-report dd-percent
  report dd-count / (max list 1 (cc-count + cd-count + dc-count + dd-count))
end
to-report last100coopown-percent
  report sum last100coopown / max list 1 sum last100meetown
end
to-report last100defother-percent
  report sum last100defother / max list 1 sum last100meetother
end
to-report last100consist-ethno-percent
  report (sum last100defother + sum last100coopown) / max list 1 sum last100meet
end
to-report last100meetown-percent
  report sum last100meetown / max list 1 sum last100meet
end
to-report last100coop-percent
  report sum last100coop / max list 1 sum last100meet
end


; Copyright 2003 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Minority Game

Canonical path: `Sample Models/Social Science/Minority Game`; SHA-256 `5da641101e48d2ca325cfffa3f1bdaf27708152b628ab5504a95a2798a53e1a1`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="192" wrappingAllowedX="true" y="12" frameRate="30.0" minPycor="-17" height="319" showTickCounter="true" patchSize="9.0" fontSize="10" wrappingAllowedY="true" width="319" tickCounterLabel="ticks" maxPycor="17" updateMode="1" maxPxcor="17" minPxcor="-17" />
    <chooser x="11" y="278" height="60" variable="color-by" current="1" width="173" display="color-by">
      <choice type="string" value="choice" />
      <choice type="string" value="success" />
    </chooser>
    <monitor x="11" precision="3" y="214" height="60" fontSize="11" width="173" display="History">full-history</monitor>
    <button x="101" y="10" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="82" display="go">go</button>
    <button x="11" y="10" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="83" display="setup">setup</button>
    <slider x="11" step="1" y="160" max="10" width="173" display="strategies-per-agent" height="50" min="1" direction="Horizontal" default="5.0" variable="strategies-per-agent" />
    <slider x="11" step="1" y="106" max="12" width="172" display="memory" height="50" min="1" direction="Horizontal" default="6.0" variable="memory" />
    <slider x="11" step="2" y="52" max="1501" width="172" display="number" height="50" min="1" direction="Horizontal" default="501.0" variable="number" />
    <plot x="522" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="score" y="12" xMin="0.0" height="197" legend="true" xMax="1.0" yMin="0.0" width="249" xAxis="time" display="Scores">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="max" color="-2674135" legend="true">
        <setup />
        <update>let max-score max [score] of turtles
plot max-score</update>
      </pen>
      <pen interval="1.0" mode="0" display="min" color="-13345367" legend="true">
        <setup />
        <update>let min-score min [score] of turtles
plot min-score</update>
      </pen>
      <pen interval="1.0" mode="0" display="avg" color="-10899396" legend="true">
        <setup />
        <update>plot avg-score</update>
      </pen>
    </plot>
    <plot x="778" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="frequency" y="12" xMin="0.0" height="198" legend="false" xMax="1.0" yMin="0.0" width="250" xAxis="success" display="Success histogram">
      <setup>set-histogram-num-bars 25</setup>
      <update />
      <pen interval="0.02" mode="1" display="default" color="-16777216" legend="false">
        <setup />
        <update>if (ticks != 0) [ histogram [score / ticks] of turtles ]</update>
      </pen>
    </plot>
    <plot x="778" autoPlotX="true" yMax="0.05" autoPlotY="true" yAxis="success rate" y="215" xMin="0.0" height="202" legend="false" xMax="1.0" yMin="0.0" width="252" xAxis="time" display="Success rate">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="max" color="-2674135" legend="true">
        <setup />
        <update>let max-score max [score] of turtles
if (ticks != 0)[ plot max-score / ticks ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="min" color="-13345367" legend="true">
        <setup />
        <update>let min-score min [score] of turtles
if (ticks != 0)[ plot min-score / ticks ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="avg" color="-10899396" legend="true">
        <setup />
        <update>if (ticks != 0)[ plot avg-score / ticks ]</update>
      </pen>
    </plot>
    <plot x="522" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="count" y="215" xMin="0.0" height="203" legend="false" xMax="1.0" yMin="0.0" width="249" xAxis="time" display="Number Picking Zero">
      <setup>set-plot-y-range 0 number</setup>
      <update />
      <pen interval="1.0" mode="0" display="number" color="-10899396" legend="true">
        <setup />
        <update />
      </pen>
    </plot>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
globals [
  history      ;; the history of which number was the minority (encoded into a binary number)
  minority     ;; the current number in the minority
  avg-score    ;; keeps track of the turtles' average score
  stdev-score  ;; keeps tracks of the standard deviation of the turtles' scores
]

turtles-own [
  score             ;; each turtle's score
  choice            ;; each turtle's choice
  strategies        ;; each turtle's strategies (a list of lists)
  current-strategy  ;; each turtle's current strategy (index in above list)
  strategies-scores ;; the accumulated virtual scores for each of the turtle's strategies (a list)
]

;; setup procedure
to setup
  clear-all
  if (memory = 1 and strategies-per-agent > 4 )  ;; prevent an infinite loop from occurring
    [ user-message word "You need to increase the memory variable or\n"
                        "decrease the strategies-per-agent variable"
      stop ]
  initialize-system
  initialize-turtles
  update-system
  reset-ticks
end

;; resets state variables
to initialize-system
  set history random (2 ^ memory)
  set avg-score 0
  set stdev-score 0
end

;; creates the specified number of turtles
to initialize-turtles
  create-turtles number
    [ setxy 0 (world-height * who / number)  ;; disperse over the y-axis
      set heading 90
      assign-strategies
      set current-strategy random strategies-per-agent
      set choice item history (item current-strategy strategies)
      ifelse (color-by = "choice")
        [ recolor-by-choice ]
        [ set color green ]  ;; we initially set all to green to prevent divide by zero error
      set score 0
      set strategies-scores n-values strategies-per-agent [0] ]
end

;; gives the turtles their allotted number of unique strategies
to assign-strategies  ;; turtle procedure
  set strategies []
  while [ length remove-duplicates strategies < strategies-per-agent ]
    [ set strategies n-values strategies-per-agent [create-strategy] ]
end

;; reports a random strategy (a list of 1 or 0's)
to-report create-strategy
  report n-values (2 ^ memory) [random 2]
end

to go
  ask turtles [ update-scores-and-strategy ]
  set history decimal (lput minority but-first full-history)
  ask turtles [ update-choice-and-color ]
  tick
  update-system
  move-turtles
end

;; moves the turtles about the world (a visual aid to see their collective behavior)
to move-turtles
  ask turtles [ fd score / avg-score ]
end

;; updates minority, avg-score, and stdev-score globals
to update-system
  let num-picked-zero count turtles with [choice = 0]
  ifelse (num-picked-zero <= (number - 1) / 2)
    [ set minority 0 ]
    [ set minority 1 ]
  ;; plot this here for speed or optimization
  set-current-plot "Number Picking Zero"
  plot num-picked-zero

  set avg-score mean [score] of turtles
  set stdev-score standard-deviation [score] of turtles
end

;; updates turtle's score and their strategies' virtual scores
to update-scores-and-strategy  ;; turtles procedure
  increment-scores
  let max-score max strategies-scores
  let max-strategies []
  let counter 0
  ;; this picks a strategy with the largest virtual score
  foreach strategies-scores [ the-score ->
    if (the-score = max-score) [
      set max-strategies lput counter max-strategies
    ]
    set counter counter + 1
  ]
  set current-strategy one-of max-strategies
  if (choice = minority)
    [ set score score + 1 ]
end

;; this increases the virtual scores of each strategy
;; that selected the minority
to increment-scores  ;; turtles procedure
  ;; here we use MAP to simultaneously walk down both the list
  ;; of strategies, and the list of those strategies' scores.
  ;; For each strategy, we check to see if that strategy selected
  ;; the minority.  If it did, we increase its score by one,
  ;; otherwise we leave the score alone.
  set strategies-scores (map [ [the-strategy the-score] ->
    ifelse-value item history the-strategy = minority [ the-score + 1] [ the-score ]
  ] strategies strategies-scores)
end

;; updates turtle's choice and re-colors them
to update-choice-and-color ;; turtles procedure
  set choice (item history (item current-strategy strategies))
  ifelse (color-by = "choice")
    [ recolor-by-choice ]
    [ recolor-by-success ]
end

to recolor-by-choice ;; turtles procedure
  ifelse (choice = 0)
      [ set color red ]
      [ set color blue ]
end

to recolor-by-success ;; turtles procedure
  ifelse (score > avg-score + stdev-score)
    [ set color red ]
    [ ifelse (score < avg-score - stdev-score)
        [ set color blue ]
        [ set color green ] ]
end

;; reports the history in binary format (with padding if needed)
to-report full-history
  report sentence n-values (memory - length binary history) [0] (binary history)
end

;; converts a decimal number to a binary number (stored in a list of 0's and 1's)
to-report binary [decimal-num]
  let binary-num []
  loop
    [ set binary-num fput (decimal-num mod 2) binary-num
      set decimal-num int (decimal-num / 2)
      if (decimal-num = 0)
        [ report binary-num ] ]
end

;; converts a binary number (stored in a list of 0's and 1's) to a decimal number
to-report decimal [binary-num]
  report reduce [ [a b] -> (2 * a) + b ] binary-num
end


; Copyright 2004 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Rumor Mill

Canonical path: `Sample Models/Social Science/Rumor Mill`; SHA-256 `4807e040a21562f9feaa2bf5a99c6819f26918b0cd76e0460af802d980521b63`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="186" wrappingAllowedX="true" y="11" frameRate="30.0" minPycor="-50" height="307" showTickCounter="true" patchSize="3.0" fontSize="10" wrappingAllowedY="true" width="307" tickCounterLabel="ticks" maxPycor="50" updateMode="1" maxPxcor="50" minPxcor="-50" />
    <slider x="8" step="0.1" y="91" max="10" width="163" display="init-clique" height="50" min="0" direction="Horizontal" default="0.1" variable="init-clique" />
    <button x="8" y="190" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="80" display="step">go</button>
    <button x="93" y="190" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="78" display="go">go</button>
    <button x="8" y="51" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="163" display="setup-random">setup false</button>
    <button x="8" y="11" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="163" display="setup-one">setup true</button>
    <monitor x="8" precision="3" y="238" height="60" fontSize="11" width="163" display="clique %">(clique / count patches)
  * 100</monitor>
    <switch x="8" y="146" height="40" on="false" variable="eight-mode?" width="163" display="eight-mode?" />
    <plot x="533" autoPlotX="true" yMax="2.0" autoPlotY="true" yAxis="ratio" y="329" xMin="0.0" height="186" legend="false" xMax="20.0" yMin="0.0" width="234" xAxis="time" display="Successive Ratios">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-2674135" legend="true">
        <setup />
        <update>ifelse previous-clique = 0 [ plot 1 ] [ plot clique / previous-clique ]</update>
      </pen>
    </plot>
    <plot x="8" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="percent" y="329" xMin="0.0" height="186" legend="false" xMax="20.0" yMin="0.0" width="239" xAxis="time" display="Rumor Spread">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-2674135" legend="true">
        <setup />
        <update>plot (clique / count patches) * 100</update>
      </pen>
    </plot>
    <plot x="260" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="difference" y="329" xMin="0.0" height="186" legend="false" xMax="20.0" yMin="0.0" width="260" xAxis="time" display="Successive Differences">
      <setup>set-plot-y-range 0 precision (count patches / 100) -2</setup>
      <update />
      <pen interval="1.0" mode="0" display="default" color="-2674135" legend="true">
        <setup />
        <update>plot clique - previous-clique</update>
      </pen>
    </plot>
    <button x="504" y="10" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="206">spread-rumor-with-mouse</button>
    <button x="504" y="58" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="206" display="color: normal">set color-mode 0
ask patches
  [ recolor ]</button>
    <button x="504" y="97" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="206" display="color: when heard">set color-mode 1
ask patches
  [ recolor ]</button>
    <button x="504" y="136" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="206" display="color: times heard">set color-mode 2
ask patches
  [ recolor ]</button>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
globals [
  color-mode       ;; 0 = normal, 1 = when heard, 2 = times heard
]

patches-own [
  times-heard    ;; tracks times the rumor has been heard

  ;; Clock tick when first heard the rumor. -1 means that a patch hasn't heard the rumor.
  ;; 0 means that the rumor was seeded with the rumor in setup.
  first-heard
]

;;; setup procedures

to setup [seed-one?]
  clear-all
  set color-mode 0
  ask patches [
    set first-heard -1
    set times-heard 0
    recolor
  ]
  ifelse seed-one? [
    seed-one
  ] [
    seed-random
  ]
  reset-ticks
end

to seed-one
  ;; tell the center patch the rumor
  ask patch 0 0 [
    hear-rumor
  ]
end

to seed-random
  ;; seed with random number of rumor sources governed by init-clique slider
  ask patches with [times-heard = 0] [
    if (random-float 100.0) < init-clique [
      hear-rumor
    ]
  ]
end

to go
  if all? patches [times-heard > 0] [ stop ]
  ask patches with [ times-heard > 0 ] [ spread-rumor ]
  tick
end

to spread-rumor  ;; patch procedure
  let neighbor nobody
  ifelse eight-mode? [
    set neighbor one-of neighbors
  ] [
    set neighbor one-of neighbors4
  ]
  ;; Spread the rumor
  ask neighbor [ hear-rumor ]
end

to hear-rumor  ;; patch procedure
  ;; If RESET-TICKS hasn't been called, we need to set FIRST-HEARD to 0. Unfortunately,
  ;; the only way to know if RESET-TICKS hasn't been called yet is to try to get the TICKS
  ;; and catch the ensuing error. On normal ticks, we use TICKS + 1 because that's going
  ;; to be the tick on which this patch will be included in statistics.
  if not heard-rumor? [
    carefully [
      set first-heard ticks + 1
    ] [
      set first-heard 0
    ]
  ]
  set times-heard times-heard + 1
  recolor
end

;;; coloring procedures

to recolor  ;; patch procedure
  ifelse color-mode = 0 [
    recolor-normal
  ] [
    ifelse color-mode = 1 [
      recolor-by-when-heard
    ] [
      recolor-by-times-heard
    ]
  ]
end

to recolor-normal  ;; patch procedure
  ifelse heard-rumor? [
    set pcolor red
  ] [
    set pcolor blue
  ]
end

to recolor-by-when-heard  ;; patch procedure
  ifelse heard-rumor? [
    set pcolor scale-color yellow first-heard world-width 0
  ] [
    set pcolor black
  ]
end

to recolor-by-times-heard   ;; patch procedure
  set pcolor scale-color green times-heard 0 world-width
end

;;; mouse handling

to spread-rumor-with-mouse
  if mouse-down? [
    ask patch mouse-xcor mouse-ycor [
      hear-rumor
    ]
    display
  ]
end

to-report heard-rumor?
  report first-heard >= 0
end

to-report clique
  report count patches with [ heard-rumor? ]
end

to-report previous-clique
  report count patches with [ heard-rumor? and first-heard < ticks ]
end


; Copyright 1997 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Signaling Game

Canonical path: `Sample Models/Philosophy/Signaling Game`; SHA-256 `399be72f527afb3d0e9ba27969d1a25e8a94364358aca2e707f0b01f24009bf5`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="315" wrappingAllowedX="false" y="5" frameRate="30.0" minPycor="-14" height="410" showTickCounter="true" patchSize="14.0" fontSize="20" wrappingAllowedY="false" width="578" tickCounterLabel="ticks" maxPycor="14" updateMode="1" maxPxcor="20" minPxcor="-20" />
    <output x="895" y="5" height="400" fontSize="12" width="350" />
    <slider x="35" step="1" y="5" max="8" width="265" display="number-of-states" height="50" min="2" direction="Horizontal" default="2.0" variable="number-of-states" />
    <slider x="35" step="1" y="60" max="8" width="265" display="number-of-signals" height="50" min="2" direction="Horizontal" default="2.0" variable="number-of-signals" />
    <button x="215" y="115" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="85">go</button>
    <button x="120" y="115" height="45" disableUntilTicks="true" forever="false" kind="Observer" width="90" display="go once">go</button>
    <button x="35" y="115" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="80">setup</button>
    <plot x="35" autoPlotX="true" yMax="100.0" autoPlotY="true" yAxis="%" y="165" xMin="0.0" height="197" legend="false" xMax="10.0" yMin="0.0" width="265" xAxis="ticks" display="probability of success">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot probability-of-success * 100</update>
      </pen>
    </plot>
    <monitor x="35" precision="2" y="365" height="60" fontSize="11" width="265" display="probability-of-success">word (precision (probability-of-success * 100) 2) " %"</monitor>
    <monitor x="15" precision="17" y="430" height="60" fontSize="11" width="100" display="times wrong">times-wrong</monitor>
    <monitor x="120" precision="17" y="430" height="60" fontSize="11" width="100" display="times correct">times-correct</monitor>
    <monitor x="225" precision="2" y="430" height="60" fontSize="11" width="100" display="success rate">word precision ((times-correct / ticks) * 100) 2 " %"</monitor>
    <switch x="975" y="410" height="40" on="true" variable="print-probabilities?" width="187" display="print-probabilities?" />
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
globals [
  sender      ; the player perceiving a world state and sending a signal
  receiver    ; the player perceiving a signal and guessing the state
  world-state ; the currently active world state
]

; There are two players: a sender and a receiver.
breed [ players player ]

; States represent the possible states that the world can be in.
; Only one of them is active on each tick.
breed [ states state ]

; Signals represent possible signals that the sender can use
; to try to communicate the observed world state to the receiver.
breed [ signals signal ]

; Observations link a world state to the sender that's perceiving it
; or a signal to the receiver that's perceiving it.
directed-link-breed [ observations observation ]

; Choices link the sender to the world state that the sender thinks
; the receiver meant by the chosen signal.
directed-link-breed [ choices choice ]

; Urns are used to represent the associations between states and signals in the
; minds of the players:
;
; - The sender has an urn for each possible world state, and each ball in the urn
;   is a signal that the sender can use to represent that state. When the sender
;   observes a state, the sender picks a "signal ball" in the corresponding "state
;   urn" and sends that signal to the receiver.
; - The receiver has an urn for each possible signal. When the receiver sees a
;   signal, the receiver picks a ball in the corresponding "signal urn": each
;   ball is a state that the receiver can interpret the signal to mean.
;
; When communication is successful, the sender puts another copy of the "signal ball"
; in the "state urn" and the receiver puts another copy of the "state ball" in the
; "signal urn", increasing the probability that this state is associated with this
; signal in the future.
undirected-link-breed [ urns urn ]
urns-own [ balls ]

to setup
  clear-all
  ask patches [ set pcolor black + 1 ]
  setup-states
  setup-signals
  setup-players
  reset-ticks
end

to go
  if probability-of-success > 0.99 [ stop ]
  ; prepare the world for this round
  ask choices [ die ]
  ask observations [ die ]
  ask states [ look-inactive ]
  ask signals [ look-inactive ]
  ask players [ set shape "face neutral" ]
  set world-state one-of states
  ask world-state [ look-active ]

  ; the sender chooses a signal in response to the world state
  ask sender [
    observe world-state
    pick-from urn-with world-state
  ]
  ask chosen-signal [ look-active ]

  ; the receiver chooses the world state to act on, in response to the signal
  ask receiver [
    observe chosen-signal
    pick-from urn-with chosen-signal
  ]

  ifelse (guessed-state = world-state) [
    ; when the choice is correct, both players are happy
    ask [ my-out-choices ] of receiver [ set color lime ]
    ask players [ set shape "face happy" ]
    ; and the probability of choosing the same signal and actions
    ; is increased by adding the successful choices as balls in the players urns:
    ask [ urn-with world-state ] of sender [ set balls lput chosen-signal balls ]
    ask [ urn-with chosen-signal ] of receiver [ set balls lput guessed-state balls ]
  ]
  [ ; when the choice is wrong, both players are sad
    ask [ my-out-choices ] of receiver [ set color red ]
    ask players [ set shape "face sad" ]
  ]

  if print-probabilities? [ print-probabilities ]
  tick
end

to setup-states
  set-default-shape states "circle 2"
  foreach state-labels number-of-states [ the-label ->
    create-states 1 [
      set label the-label
      set color sky
      look-inactive
    ]
  ]
  spread-x (max-pycor - (world-height / 6)) states
  create-turtles 1 [ setxy 4.75 max-pycor - 2 set label "world states" set size 0 set label-color grey ]
end

to setup-signals
  set-default-shape signals "square 2"
  foreach signal-labels number-of-signals [ the-label ->
    create-signals 1 [
      set label the-label
      set color magenta
      look-inactive
    ]
  ]
  spread-x (min-pycor + (world-height / 6)) signals
  create-turtles 1 [
    setxy 2.75 min-pycor + 1
    set label "signals"
    set size 0
    set label-color grey
  ]
end

to setup-players
  set-default-shape players "face neutral"
  set-default-shape urns "empty"
  create-players 1 [
    set label "sender       "
    set sender self
    create-urns-with states [
      ; each possible world state is associated with an urn from which
      ; the sender picks signals, with equal probability at first
      set balls sort signals
    ]
  ]
  create-players 1 [
    set label "receiver       "
    set receiver self
    create-urns-with signals [
      ; each possible signal is associated with an urn from which
      ; the receiver picks states, with equal probability at first
      set balls sort states
    ]
  ]
  ask players [
    set size 3
    set color yellow
  ]
  spread-x 0 players
end

to observe [ thing ] ; player procedure
  create-observation-from thing [
    set color black + 2
  ]
  display
end

to pick-from [ this-urn ] ; player procedure
  create-choice-to [ one-of balls ] of this-urn [
    set thickness 0.3
    set color white
  ]
  display
end

to look-active ; states and signals procedure
  set color color + 3
  set label-color white
  set size size + 1
  set shape remove " 2" shape
end

to look-inactive ; states and signals procedure
  set size 2
  set color (base-shade-of color) - 3
  set label-color (base-shade-of color) + 3
  set shape word (remove " 2" shape) (" 2")
end

to spread-x [ y agents ] ; observer procedure
  let d world-width / (count agents + 1)
  let xs n-values count agents [ n -> (min-pxcor - 0.5) + d + (d * n) ]
  (foreach sort agents xs [ [a x] -> ask a [ setxy x y ] ])
end

to-report state-labels [ n ]
  report sublist ["A" "B" "C" "D" "E" "F" "G" "H"] 0 n
end

to-report signal-labels [ n ]
  report n-values n [ the-label -> the-label ]
end

to-report base-shade-of [ some-color ]
  report some-color - (some-color mod 10) + 5
end

to-report chosen-signal
  report [ one-of out-choice-neighbors ] of sender
end

to-report guessed-state
  report [ one-of out-choice-neighbors ] of receiver
end

to-report times-correct
  report [ sum [ length balls - count signals ] of my-urns ] of sender
end

to-report times-wrong
  report ticks - times-correct
end

to print-probabilities
  clear-output
  output-print "Sender probabilities:"
  output-print probability-table states signals sender
  output-print ""
  output-print "Receiver probabilities:"
  output-print probability-table signals states receiver
end

to-report probability-table [ ys xs this-player ]
  let columns-labels fput "" map [ x -> [ label ] of x ] sort xs
  let separators fput "" n-values count xs [ "---" ]
  let rows map [ y -> [ make-row urn-with y ] of this-player ] sort ys
  let formatted-rows map format-list (fput columns-labels fput separators rows)
  report reduce [ [a b] -> (word a "\n" b) ] formatted-rows
end

to-report make-row [ this-urn ]
  let header-column word ([ label ] of [ end1 ] of this-urn) " :"
  let other-columns map [ p -> p * 100 ] probabilities this-urn
  report fput header-column other-columns
end

to-report format-list [ this-list ]
  let formatted-values map [ value -> format-value value 4 ] this-list
  report reduce [ [a b] -> (word a "  " b) ] formatted-values
end

to-report format-value [ x width ]
  let str (word ifelse-value is-number? x [ precision x 0 ] [ x ])
  let padding ifelse-value length str < width
    [ reduce word (n-values (width - length str) [ " " ]) ]
    [ "" ]
  report word padding str
end

to-report probabilities [ this-urn ]
  let this-breed [ breed ] of first [ balls ] of this-urn
  report normalize map [ a -> instances a [ balls ] of this-urn ] sort this-breed
end

to-report instances [ x this-list ]
  ; report the number of instances of x in this-list
  report reduce [ [a b] -> a + ifelse-value b = x [ 1 ] [ 0 ] ] fput 0 this-list
end

to-report normalize [ this-list ]
  let total sum this-list
  report map [ n -> n / total ] this-list
end

to-report probability-of-success
  report (sum [ probability-of-state-success ] of states) / count states
end

to-report probability-of-state-success ; state reporter
  let target-state self
  let this-urn [ urn-with target-state ] of sender
  report sum [
    [ probability-of-choosing myself ] of this-urn * probability-of-signal-success target-state
  ] of signals
end

to-report probability-of-signal-success [ target-state ] ; signal reporter
  let this-urn [ urn-with myself ] of receiver
  report [ probability-of-choosing target-state ] of this-urn
end

to-report probability-of-choosing [ target ] ; urn reporter
  report (instances target balls) / (length balls)
end


; Copyright 2016 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Piaget-Vygotsky Game

Canonical path: `Sample Models/Psychology/Piaget-Vygotsky Game`; SHA-256 `f0020ad932d3667cc9e5b710018366515484172bd10814aa4b1f2575f2db84c1`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="265" wrappingAllowedX="false" y="5" frameRate="30.0" minPycor="-25" height="259" showTickCounter="true" patchSize="5.0" fontSize="10" wrappingAllowedY="false" width="609" tickCounterLabel="ticks" maxPycor="25" updateMode="0" maxPxcor="60" minPxcor="-60" />
    <slider x="10" step="10" y="5" max="50" width="250" display="number-of-players" height="50" min="10" direction="Horizontal" default="30.0" variable="number-of-players" />
    <slider x="10" step="1" y="61" max="100" width="250" display="attempts-per-run" height="50" min="1" direction="Horizontal" default="30.0" variable="attempts-per-run" />
    <switch x="85" y="168" height="40" on="true" variable="trails?" width="90" display="trails?" />
    <slider x="10" step="5" y="277" max="60" width="250" display="ZPD" height="50" min="0" direction="Horizontal" default="15.0" variable="ZPD" />
    <slider x="10" step="2" y="333" max="18" width="250" display="#-vygotskiian-neighbors" height="50" min="2" direction="Horizontal" default="4.0" variable="#-vygotskiian-neighbors" />
    <slider x="10" step="1" y="389" max="30" width="250" display="move-error" height="50" min="0" direction="Horizontal" default="4.0" variable="move-error" />
    <switch x="10" y="445" height="40" on="true" variable="randomize-strategy-each-run?" width="250" display="randomize-strategy-each-run?" />
    <switch x="10" y="488" height="40" on="false" variable="stop-after-each-run?" width="250" display="stop-after-each-run?" />
    <button x="180" y="117" height="45" disableUntilTicks="true" forever="false" kind="Observer" width="80" display="go once">go</button>
    <button x="10" y="117" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="75">setup</button>
    <button x="90" y="117" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="85">go</button>
    <chooser x="10" y="211" height="60" variable="strategy" current="2" width="250" display="strategy">
      <choice type="string" value="Random" />
      <choice type="string" value="Piagetian" />
      <choice type="string" value="Vygotskiian" />
      <choice type="string" value="P-V" />
    </chooser>
    <plot x="270" autoPlotX="true" yMax="50.0" autoPlotY="true" yAxis="Distance From Target" y="275" xMin="1.0" height="252" legend="true" xMax="30.0" yMin="0.0" width="605" xAxis="Attempts" display="Avg Distance From Target">
      <setup>set-plot-x-range 1 attempts-per-run</setup>
      <update>if attempts &gt; 0 [
  set-current-plot-pen strategy
  plotxy attempts (mean [ score ] of turtles)
]</update>
      <pen interval="1.0" mode="0" display="Random" color="-10899396" legend="true">
        <setup />
        <update />
      </pen>
      <pen interval="1.0" mode="0" display="Piagetian" color="-13345367" legend="true">
        <setup />
        <update />
      </pen>
      <pen interval="1.0" mode="0" display="Vygotskiian" color="-2674135" legend="true">
        <setup />
        <update />
      </pen>
      <pen interval="1.0" mode="0" display="P-V" color="-16777216" legend="true">
        <setup />
        <update />
      </pen>
    </plot>
    <plot x="880" autoPlotX="true" yMax="15.0" autoPlotY="true" y="5" xMin="0.0" height="520" legend="true" xMax="4.0" yMin="0.0" width="395" display="Strategy Avgs">
      <setup />
      <update />
      <pen interval="1.0" mode="1" display="Random" color="-10899396" legend="true">
        <setup />
        <update>if not empty? r-results [
  plot-pen-reset
  plotxy 0 mean r-results
]</update>
      </pen>
      <pen interval="1.0" mode="1" display="Piagetian" color="-13345367" legend="true">
        <setup />
        <update>if not empty? p-results [
  plot-pen-reset
  plotxy 1 mean p-results
]</update>
      </pen>
      <pen interval="1.0" mode="1" display="Vygotskiian" color="-2674135" legend="true">
        <setup />
        <update>if not empty? v-results [
  plot-pen-reset
  plotxy 2 mean v-results
]</update>
      </pen>
      <pen interval="1.0" mode="1" display="P-V" color="-16777216" legend="true">
        <setup />
        <update>if not empty? pv-results [
  plot-pen-reset
  plotxy 3 mean pv-results
]</update>
      </pen>
    </plot>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
globals [
  target     ; the target line in the middle
  max-dist   ; the maximum distance to that wall
  attempts   ; the number of attempts made so far with the current strategy

  ; lists of each run's distance halfway through the run's attempts
  p-results
  v-results
  pv-results
  r-results
]

turtles-own [
  max-moves      ; the max-moves of the current throw
  best-max-moves ; the best throw of the agent (or, if no memory, the current throw)
  moves-left     ; the number of moves left until the ball comes to rest
  score          ; the current score (how far from target... lower is better)
  best-score     ; best score (or, if no memory, current throw)
]

to setup
  clear-all

  ; the target is the line in the center of the screen, one patch thick
  set target patches with [ pxcor = 0 ]

  set-default-shape turtles "circle-arrow"
  set max-dist world-width

  create-turtles number-of-players [
    set size (world-height / number-of-players)
    set color color + 0.1 ; to make trails a little easier to see
  ]
  spread-out-turtles-evenly

  ; initialize result lists
  set p-results  []
  set v-results  []
  set pv-results []
  set r-results  []

  setup-run
  setup-attempt
  reset-ticks
end

to spread-out-turtles-evenly
  let d (world-height / count turtles)
  let y (min-pycor - 0.5 + (d / 2))
  foreach sort turtles [ t ->
    ask t [ set ycor round y ]
    set y (y + d)
  ]
end

to setup-run
  set attempts 0
  ; random strategies lets you keep the simulation running
  ; picking from the available strategies at random
  if randomize-strategy-each-run? [
    set strategy one-of [ "Random" "Piagetian" "Vygotskiian" "P-V" ]
  ]
  ask turtles [
    set score (max-dist + 1) ; start with a dummy score that is sure to be beaten
    set best-score score
    ; their max-moves are randomly distributed over the length of the playing field
    set max-moves random max-dist
  ]
end

to-report get-strategy-color
  if strategy = "Random"      [ report green ]
  if strategy = "Piagetian"   [ report blue  ]
  if strategy = "Vygotskiian" [ report red   ]
  if strategy = "P-V"         [ report grey  ]
end

to setup-attempt
  clear-patches
  ask target [
    set pcolor get-strategy-color
  ]
  ; place turtles at starting line
  ask turtles [
    set heading 90
    set xcor min-pxcor
  ]
end

to go

  if attempts >= attempts-per-run [ setup-run ]
  setup-attempt

  ; move all the turtles forward to their max-moves spot
  move-turtles

  ; the score is their distance from the target line
  ask turtles [ set score distancexy 0 ycor ]

  ; act according to the strategy, e.g,. in Vygotskiian, you compare
  ; your scores to a neighbor and possibly update your score
  ask turtles [ adjust ]

  set attempts (attempts + 1)
  if attempts = round (attempts-per-run / 2) [ record-result ]
  tick
  if attempts >= attempts-per-run and stop-after-each-run? [
    stop
  ]

end

to move-turtles
  ; move all the turtles forward to their max-moves spot.
  ; we can't just say "forward max-moves" because we want
  ; them to bounce off the wall and leave a dissipating trail
  ask turtles [ set moves-left limit-legal-distance max-moves ]
  let moving-turtles turtles with [ moves-left > 0 ]
  while [ any? moving-turtles ] [
    set moving-turtles turtles with [ moves-left > 0 ]
    ask moving-turtles [
      move-x
      if trails? [
        set pcolor (color - 5) + (10 * (max-moves - moves-left) / max-moves)
      ]
    ]
  ]
end

to record-result
  let current-mean mean [ score ] of turtles
  if strategy = "Random"      [ set  r-results lput current-mean  r-results ]
  if strategy = "Piagetian"   [ set  p-results lput current-mean  p-results ]
  if strategy = "Vygotskiian" [ set  v-results lput current-mean  v-results ]
  if strategy = "P-V"         [ set pv-results lput current-mean pv-results ]
end

to move-x
  set moves-left moves-left - 1
  forward 1
  if pxcor >= (max-pxcor - 1) [
    set heading 270
    forward 2
  ]
end

to-report limit-legal-distance [ val ]
  report min (list (max-dist - 1) max (list 0 val))
end

to adjust
  if strategy = "Random" [
    r-adjust
    set max-moves best-max-moves
    stop
  ]
  if strategy = "Piagetian" [ p-adjust ]
  if strategy = "Vygotskiian" [ v-adjust ]
  if strategy = "P-V" [ pv-adjust ]

  if strategy = "Vygotskiian" [
    set max-moves limit-legal-distance
      (best-max-moves + (random-normal 0 (move-error * best-score / max-dist)))
    stop
  ]

  ifelse xcor > 0 [
    set max-moves limit-legal-distance
      (best-max-moves +  (- abs random-normal 0 (move-error * best-score / max-dist)))
  ] [
    set max-moves limit-legal-distance
      (best-max-moves + (abs random-normal 0 (move-error * best-score / max-dist)))
  ]
end

to p-adjust
  ; if your score is better, that's your new best, otherwise stick with the old
  if score < best-score [ ; note that lower scores are better (closer to target line)
    set best-score score
    set best-max-moves max-moves
  ]
end

to v-adjust
  let fellow nobody
  while [ fellow = nobody or fellow = self ] [
    set fellow turtle (who + (- (#-vygotskiian-neighbors / 2)) + random (1 + #-vygotskiian-neighbors))
  ]
  ; look randomly to one of your neighbors

  ; if the score is better and it is within your ZPD, use their max-moves.
  ifelse (best-score > [ best-score ] of fellow) and (best-score - ZPD <= [ best-score ] of fellow) [
    set best-score [ best-score ] of fellow
    set best-max-moves [ best-max-moves ] of fellow
  ]
  [
    set best-score score
    set best-max-moves max-moves
  ]
end

to pv-adjust

  ; look randomly to one of your neighbors
  let fellow nobody
  while [ fellow = nobody or fellow = self ] [
    set fellow turtle (who + (- (#-vygotskiian-neighbors / 2)) + random (1 + #-vygotskiian-neighbors))
  ]

  ; maximize your own score and...
  if score < best-score [
    set best-score score
    set best-max-moves max-moves
  ]

  ; check it against your neighbor's score
  if (best-score > [ best-score ] of fellow) and (best-score - ZPD <= [ best-score ] of fellow) [
    set best-score [ best-score ] of fellow
    set best-max-moves [ best-max-moves ] of fellow
  ]
end

to r-adjust
  ; random strategy changes max-moves to a random number x if it's not at the wall
  ; where 0 < x < max-dist
  ; if it is at the target, it stops changing.
  ifelse abs pxcor > 0 [
    set best-max-moves (random max-dist)
  ] [
    set best-max-moves (max-dist / 2) - 1
  ]
end


; Copyright 2005 Uri Wilensky.
; See Info tab for full copyright and license.
```

## Heroes and Cowards

Canonical path: `IABM Textbook/chapter 2/Heroes and Cowards`; SHA-256 `dc605f80d321c18a7e6711f85f1c5e58ea2e4780451369b94977a49a7d87c280`. Includes/extensions: see complete declarations below.

### Exact widgets: defaults, topology, actions, reporters and plots

```xml
<widgets>
    <view x="290" wrappingAllowedX="false" y="15" frameRate="200.0" minPycor="-16" height="433" showTickCounter="true" patchSize="13.0" fontSize="10" wrappingAllowedY="false" width="433" tickCounterLabel="ticks" maxPycor="16" updateMode="1" maxPxcor="16" minPxcor="-16" />
    <button x="55" y="157" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="85">setup</button>
    <button x="155" y="157" height="40" disableUntilTicks="true" forever="true" kind="Observer" width="75">go</button>
    <chooser x="55" y="87" height="60" variable="personalities" current="2" width="175" display="personalities">
      <choice type="string" value="brave" />
      <choice type="string" value="cowardly" />
      <choice type="string" value="mixed" />
    </chooser>
    <slider x="55" step="1" y="30" max="200" width="175" display="number" height="50" min="3" direction="Horizontal" default="68.0" variable="number" />
    <button x="150" y="254" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="125" display="frozen">preset -1153988890
</button>
    <button x="15" y="254" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="130" display="dot">preset -1177467632
</button>
    <button x="15" y="301" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="130" display="slinky">preset -608717654
</button>
    <button x="150" y="301" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="125" display="spiral">preset 1086013561
</button>
    <button x="15" y="395" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="130" display="yo-yo">preset -180308068
</button>
    <note x="20" y="229" backgroundDark="0" fontSize="10" width="245" markdown="false" height="20" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">Preset configurations - Press button, then GO.</note>
    <button x="150" y="395" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="125" display="wandering flock">preset 961107169
</button>
    <button x="15" y="447" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="260" display="generally cool one that eventually stops">preset 284529528
</button>
    <button x="150" y="348" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="125" display="spiral 2">preset 878469395
</button>
    <button x="15" y="348" height="40" disableUntilTicks="false" forever="false" kind="Observer" width="130" display="slinky 2">preset -1315170766
</button>
  </widgets>
  
```

### Complete procedures: equations, phase barriers, update order and stops

```netlogo
turtles-own [ friend enemy ]

to setup
  clear-all
  ask patches [ set pcolor white ]  ;; create a blank background
  create-turtles number [
    setxy random-xcor random-ycor

    ;; set the turtle personalities based on chooser
    if (personalities = "brave")     [ set color blue ]
    if (personalities = "cowardly")  [ set color red ]
    if (personalities = "mixed")     [ set color one-of [ red blue ] ]

    ;; choose friend and enemy targets
    set friend one-of other turtles
    set enemy one-of other turtles
  ]
  reset-ticks
end

to go
  ask turtles [
    if (color = blue)  [ act-bravely ]
    if (color = red)   [ act-cowardly ]
  ]
  tick
end

to act-bravely
  ;; move toward the midpoint of your friend and enemy
  facexy ([xcor] of friend + [xcor] of enemy) / 2
         ([ycor] of friend + [ycor] of enemy) / 2
  fd 0.1
end

to act-cowardly
  ;; put your friend between you and your enemy
  facexy [xcor] of friend + ([xcor] of friend - [xcor] of enemy) / 2
         [ycor] of friend + ([ycor] of friend - [ycor] of enemy) / 2
  fd 0.1
end

to preset [ seed ]
  ;; sets up the model for use with a particular random seed and constant
  ;; model parameters, so that a particular pattern can be re-created.
  set personalities "mixed"
  set number 68
  random-seed seed
  setup
end


; Copyright 2014 Uri Wilensky.
; See Info tab for full copyright and license.
```

