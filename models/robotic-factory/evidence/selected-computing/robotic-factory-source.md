# Robotic Factory complete source contract inventory

Identity: `Sample Models/Computer Science/Robotic Factory`; SHA-256 `d7e79d6b2647227ce73799b2b94c0f9dbdbfeb3d42e825ed96e270549194c9fd`; NetLogo 7.0.4. Includes: None; extensions: ['import-a', 'resource'].

All procedures, equations and textual activation order:

```netlogo
extensions [ import-a resource ]

breed [ cutters cutter ]
breed [ stitchers stitcher ]
breed [ finishers finisher ]
breed [ storages storage ]
breed [ robots robot ]
breed [ robot-rooms robot-room ]
breed [ loading-docks loading-dock ]
breed [ orders order ]

turtles-own   [
  product             ; the finished product the turtle has
  supply              ; the amount of material used to create a product
  turtles-present     ; the total number of turtles here
]

finishers-own
[
  deluxe-level        ; whether an order is luxurious or standard, which effects processing time at the finishers.
  build-counter       ; finishers process orders in different times based on if it is a standard, or a luxurious order,
                      ;      build-counter keeps track of that build time as the finisher processes
  queued-supply       ; finishers do not instantly process supply, this store the supply that robots bring to a finisher for future processing.
  processing-order?   ; the finisher can receive luxurious or standard orders, this boolean keeps track of the current order type
]
robots-own
[
  energy              ; what robots use to drive with
  laden?              ; whether the robot is carrying anything
  destination         ; where the robot is current going
  idleness            ; a counter of time this robot has spend idle
  product-type        ; keeps track of the order type in a string
]

orders-own [
  type-of-order       ; an order can be standard or luxurious, this keeps track of that for each order created.
]


to setup ; imports the base image from the folder, sets up the color of the factory, adds the processing machines, and robots.

  clear-all

  import-a:drawing resource:get "base"

  ask patches [ set pcolor grey + 4 ]

  ; There are two each of cutters, stitchers and finishers
  create-cutters 1 [ setxy 10 -6  set color blue set shape "x" ]
  create-cutters 1 [ setxy 10 -11 set color blue set shape "x" ]

  create-stitchers 1 [ setxy 4 8 set color red set shape "box 2" ]
  create-stitchers 1 [ setxy 4 3 set color red set shape "box 2" ]

  create-finishers 1 [ setxy 0 -4 set color green set deluxe-level 1 set shape "circle" set processing-order? false ]
  create-finishers 1 [ setxy 2 -8 set color green set deluxe-level 2 set shape "circle" set processing-order? false ]

  create-storages 1 [ setxy -6 4 set shape "box" set color magenta]

  create-robot-rooms 1 [ setxy -11 -7 set shape "box" set color yellow ]

  create-loading-docks 1 [ setxy 13 4 set shape "box" set color black set supply 10 set shape "box 2"]

  create-robots number-of-robots  [ ; creates a variable number of robots and sets their values
    setxy random-xcor random-ycor
    set color grey
    set destination "none"
    set laden? false
    set energy full-charge
  ]
  ask robots [set destination one-of loading-docks] ; sends all the robots to the loading dock to start

  reset-ticks
end

to go ; the simulation loops that repeats forever

  make-garments
  set-robots-destination
  return-home
  recharge
  deliver-more-material-sheets
  shift-change
  label-agents

  ask turtles [
    set turtles-present count turtles-here
    ifelse make-trails? [ pen-down ] [ pen-up ]
  ]

  tick
end


to set-robots-destination ; sets the destination of robot based on its energy, laden? status and current location
  ask robots [ ; ask all the robots to implement the following
    (ifelse ; takes account of the type of breed of machine here to operate across several states.
      ; LOADING DOCKS
      [ breed ] of destination = loading-docks [ ; if the robot's destination is loading dock

        ifelse any? loading-docks-here [ ; Check if the robot has reached the loading doc  ;

          if [supply] of one-of loading-docks-here > 0 [; if there is a loading dock here with supply
            set product product + 1 ; increase the robots production
            set product-type "bolts" ; keep track of the type of product with a string
            set destination one-of cutters ; set the robots destination of the cutters
            ask one-of loading-docks-here [ if supply > 0 [set supply supply - 1] ] ] ; then ask the loading dock to reduce its supply by 1
        ]
        [ move ] ; otherwise, If the robot is not at its destination, it moves towards its destination.
      ]
      ; CUTTERS
      [ breed ] of destination = cutters [ ; if the destination of the robot is cutters
        ifelse any? cutters-here [ ; if the robot is at a cutter
          if product > 0 [ ; if it has some product
            set product 0 ;  drop off the product
            ask one-of cutters-here [set supply supply + 1]; and add to the cutters supply of material to process
            stop ; and leave the loop to come back next tick.
          ]
          ifelse [product] of one-of cutters-here > 0 [; if the machine has some products to pick up
            set product product + 1 ; add some product to the robot
            set product-type "cuttings" ; set the product type to cutting
            set destination one-of stitchers ; set the destination to one of the stitchers
            ask one-of cutters-here [ if supply > 0 [set supply supply - 1] ] ] ; decrement supply
          [ set destination one-of loading-docks ] ; otherwise, go back to the loading docks
        ]
        [ move ] ; otherwise, if the robot is not at its destination, it moves towards its destination.
      ]
      ; STITCHERS
      [ breed ] of destination = stitchers [ ; if the destination of the robot is stitchers
        ifelse any? stitchers-here [ ; If the robot is at a sticker
          if product > 0 [ ; we drop off some supply
            set product 0  ;  drop off the product
            ask one-of stitchers-here [set supply supply + 1] ;the supply goes to the stitcher
            stop ; and leave the loop to come back next tick.
          ]
          ifelse [product] of one-of stitchers-here > 0 [ ; if the stitcher has some product, get the robots to carry it to the correct finisher
            set product product + 1 ; increase the robots product
            if any? orders [ ;then check the lit of orders,
              let order-now one-of orders ; assign the order to one of the robots
              set product-type [type-of-order] of order-now ; the robot sets its product type to the type of order of one of the outstanding orders.
              ask order-now [die] ; we check that order off the list
            ]
            ifelse product-type = 0 [ ; if the product type is standard,
              set destination one-of finishers ; we take the supply to either of the finishers.
            ][ ; otherwise, we take the order specifically the the finisher that can handle deluxe orders.
              set destination one-of finishers with [deluxe-level = 2]
            ]
            ask one-of stitchers-here [ if supply > 0 [ set supply supply - 1 ] ] ] ; then the stitcher reduces supply
          [
            set destination one-of loading-docks ; if there isn't anything to carry the robot heads back to the loading doc.
          ]
        ]
        [ move ] ; otherwise, if the robot is not at its destination, it moves towards its destination.
      ]
      ; FINISHERS
      [ breed ] of destination = finishers [; if the destination is finisher
        ifelse any? finishers-here [ ; if the robot reaches a finisher
          if product > 0 [ ; drop off some product if the robot is carrying any
            set product 0
            ; increase the finishers supply. Importantly through the make-garments and finish functions
            ; the finishers take account of how long it takes them to process an order based on order type.
            ask one-of finishers-here [set supply supply + 1]
            stop
          ]
          ifelse [product] of one-of finishers-here > 0 [; When the finishers finish processing the order based on the finish function, and they have some supply
            set product product + 1 ; increase the robots product
            set product-type "finishing" ; set the product type to finishing
            set destination one-of storages ; and set the destination the storage room.
            ask one-of finishers-here [ finish ] ; the finisher then processes the order.
          ][
            set destination one-of loading-docks ; if not any product, head back to start.
          ]
        ]
        [ move ] ; otherwise, if the robot is not at its destination, it moves towards its destination.
      ]
      ; STORAGE
      [ breed ] of destination = storages [ ; if the robot is at the storage
        ifelse any? storages-here [ ; when it arrives
          if product > 0 [ ; dropoff what the robot is carrying
            set product 0
            ask one-of storages-here [set supply supply + 1] ; increase the storage
          ]
          set product-type "nothing" ; empty the robot
          set destination one-of loading-docks ; send it back to start.
        ]
        [ move ]
      ]
      ; ROBOT ROOM
      [ breed ] of destination = robot-rooms [ move ] ; if the destination of a robot is robot room, go to the robot room

      ; EXCEPTIONS
      [ breed ] of destination = "none" [ set destination one-of loading-docks ] ; if the destination is not set, go to the loading docks
      [ breed ] of destination = nobody [ set destination one-of robot-rooms   ] ; if the destination is empty, go to the charging station

      [ set destination one-of loading-docks ] ; if we don't have a destination, go back to the start.
    )
  ]
end


to return-home
  ; When their energy level becomes low, robots must return to a robot room to recharge.
  ask robots [ if energy < 2 [ set destination one-of robot-rooms ] ]
end

to recharge
  ; They recharge at a rate of 5 units per simulation cycle.
  let choice 0

  ask robot-rooms [
    ask robots in-radius 2 [
      set laden? false
      set product 0
      set product-type 0
      set energy energy + 5
      set idleness idleness + 1

      if energy >= full-charge [
        set choice one-of [1 2 ]
        ifelse choice = 1 [
          set destination (one-of turtles with [turtles-present = robot-supply-need ])
        ][
          set destination (one-of loading-docks)
        ]
      ]
    ]
    if sum [supply] of loading-docks > 0 [ ; if robots are needed for immediate tasks, interrupt some charging and send a robot.
      if any? robots-here [
        ask one-of robots-here [
          ; note: this could be changed to a different heuristic, like selecting the robot
          ; with the most energy.
          if energy > just-in-time-supply-robot [ set destination one-of loading-docks ]
        ]
      ]
    ]
  ]
end

to make-garments ; Machines process supply into product at a rate of 1 per tick.
  ask cutters   [
    if supply > 0 [
      set product product + 1
      set supply supply - 1
    ]
  ]
  ask stitchers [
    if supply > 0 [
      set product product + 1
      set supply supply - 1
    ]
  ]
  ; There are two qualities of goods in the model, luxurious and standard. This only impacts the finishers.
  ; These are processed at a rate of once for 7 ticks and once per 4 ticks, respectively.
  finish
end


; there is external supply of new materials. In this model we simplify this, and every so often add a random additional supply to the loading dock
to controller-sends-garments
  ask loading-docks [ set supply supply + random 10 ]
end

to deliver-more-material-sheets ; 3% of the time, when the supply at the loading dock gets low, add some more supply to the loading dock.
  if random 100 < 3 [ if sum [supply] of loading-docks < 3 [ controller-sends-garments ] ]

  ask loading-docks [
    if random 100 < 3 [ ; additionally, orders come in 3% of the time that can be luxurious, or standard.
      hatch-orders random 3 [
        set type-of-order random 2
        set size 1 set shape "box"
      ]
    ]
  ]
end

; Robots move toward their destination set by the set-robots-destination procedure
to move
  if can-move? 1 [forward 1 face destination]
  ifelse product > 0 [ ; if the are carrying something, robots lose two energy
    set laden? true
    set energy energy - 2
  ]
  [
    set laden? false ; otherwise, if they are not carrying something they lose 1 energy,
    set energy energy - 1
    set idleness idleness + 1 ; and increase their idleness score by 1 each tick.
  ]
end




to finish ; the two finishers can hand either luxurious or standard orders. The one that does higher end orders, takes 7 ticks to process supply. The other one takes 4.
  ask finishers [
    if supply > 0 [
      set queued-supply queued-supply + 1 ; the finishers stores supply as its delivered for future processing.
      set supply supply - 1
    ]
    if queued-supply > 1 and not processing-order? and build-counter = 0 [
      ifelse deluxe-level = 1 [ set build-counter 4 ] [ set build-counter 7 ]
    ]
    if build-counter > 0 [
      set processing-order? true
      set build-counter build-counter - 1
    ]
    if build-counter = 0 and processing-order? [
      set product product + 1
      set processing-order? false
      set queued-supply queued-supply - 1
    ]
  ]
end

to shift-change ; occasionally, move robots back to the loading dock to initiate a new shift.
  if random 100 < 2 [ ask n-of 3 robots [ set destination one-of loading-docks ] ]
end

to label-agents ; places tbhe labels on the agents if switched on
  ifelse show-agent-name? [
    ask turtles [ set label (word breed " "  who) set label-color black ]
  ]
  [ ask turtles [ set label "" ] ]

end

to-report robot-supply-need
  let return nobody
  set return min [ turtles-present ] of turtles with [breed != robots]
  report return
end


; Copyright 2021 Uri Wilensky.
; See Info tab for full copyright and license.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="260" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-16" height="660" showTickCounter="true" patchSize="20.0" fontSize="10" wrappingAllowedY="false" width="660" tickCounterLabel="ticks" maxPycor="16" updateMode="1" maxPxcor="16" minPxcor="-16" />
    <slider x="5" step="1" y="264" max="1000" width="250" display="full-charge" height="50" min="0" direction="Horizontal" default="350.0" variable="full-charge" units="energy" />
    <slider x="5" step="1" y="316" max="300" width="250" display="just-in-time-supply-robot" height="50" min="0" direction="Horizontal" default="150.0" variable="just-in-time-supply-robot" />
    <slider x="5" step="1" y="212" max="20" width="250" display="number-of-robots" height="50" min="3" direction="Horizontal" default="5.0" variable="number-of-robots" />
    <plot x="945" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="Percentage of Time" y="12" xMin="0.0" height="150" legend="false" xMax="10.0" yMin="0.0" width="342" xAxis="Time" display="Percentage Time Robots Idle">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>if ticks &gt; 0 [
  plot (sum [ idleness ] of robots ) / ticks
]</update>
      </pen>
    </plot>
    <plot x="945" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="Orders" y="165" xMin="0.0" height="185" legend="true" xMax="10.0" yMin="0.0" width="342" xAxis="Time" display="Outstanding Orders">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Total Orders" color="-16777216" legend="true">
        <setup />
        <update>plot count orders</update>
      </pen>
      <pen interval="1.0" mode="0" display="Deluxe Orders" color="-7500403" legend="true">
        <setup />
        <update>plot count orders with [ type-of-order = 1 ]</update>
      </pen>
      <pen interval="1.0" mode="0" display="Standard Orders" color="-2674135" legend="true">
        <setup />
        <update>plot count orders with [ type-of-order = 0 ]</update>
      </pen>
    </plot>
    <plot x="945" autoPlotX="true" yMax="4.0" autoPlotY="true" yAxis="Percent of Robots" y="355" xMin="0.0" height="180" legend="false" xMax="600.0" yMin="0.0" width="342" xAxis="Time" display="Robots' Energy">
      <setup />
      <update />
      <pen interval="1.0" mode="1" display="default" color="-16777216" legend="true">
        <setup />
        <update>histogram [ energy ] of robots</update>
      </pen>
    </plot>
    <plot x="945" autoPlotX="true" yMax="10.0" autoPlotY="true" yAxis="Supply" y="540" xMin="0.0" height="185" legend="true" xMax="10.0" yMin="0.0" width="342" xAxis="Time" display="Supply of Machines">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="Finishers" color="-16777216" legend="true">
        <setup />
        <update>plot sum [ supply ] of finishers</update>
      </pen>
      <pen interval="1.0" mode="0" display="Cutters" color="-7500403" legend="true">
        <setup />
        <update>plot sum [ supply ] of cutters</update>
      </pen>
      <pen interval="1.0" mode="0" display="Stitchers" color="-2674135" legend="true">
        <setup />
        <update>plot sum [ supply ] of stitchers</update>
      </pen>
      <pen interval="1.0" mode="0" display="Loading Docks" color="-955883" legend="true">
        <setup />
        <update>plot sum [ supply ] of loading-docks</update>
      </pen>
    </plot>
    <switch x="25" y="376" height="40" on="true" variable="show-agent-name?" width="200" display="show-agent-name?" />
    <switch x="25" y="420" height="40" on="true" variable="make-trails?" width="200" display="make-trails?" />
    <monitor x="45" precision="17" y="142" height="60" fontSize="11" width="155" display="Products Ready for Van">sum [ supply ] of storages</monitor>
    <monitor x="45" precision="17" y="77" height="60" fontSize="11" width="155" display="New Sheets">sum [ supply ] of loading-docks</monitor>
    <button x="125" y="20" height="45" disableUntilTicks="true" forever="true" kind="Observer" width="75">go</button>
    <button x="45" y="20" height="45" disableUntilTicks="false" forever="false" kind="Observer" width="75" display="setup">setup
setup</button>
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/robotic-factory/source.nlogox) and [NOTICE](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/experiments/robotic-factory/NOTICE.md). Runtime interpretation: [batch contract](https://github.com/dweigend/city-library/blob/23693e90e199512faf68a04c9a2198b9eb50463b/docs/development/selected-computing-contract.md). Execution evidence is separate.
