# Artificial Neural Net - Multilayer complete source contract inventory

Identity: `Sample Models/Computer Science/Artificial Neural Net - Multilayer`; SHA-256 `dec9e3394cde9d0fae15d15a0e75763f854dd908e00804924667e92e8211d4e9`; NetLogo 7.0.4. Includes: None; extensions: [].

All procedures, equations and textual activation order:

```netlogo
links-own [ weight ]

breed [ bias-nodes bias-node ]
breed [ input-nodes input-node ]
breed [ output-nodes output-node ]
breed [ hidden-nodes hidden-node ]

turtles-own [
  activation     ;; Determines the nodes output
  err            ;; Used by backpropagation to feed error backwards
]

globals [
  epoch-error    ;; measurement of how many training examples the network got wrong in the epoch
  input-node-1   ;; keep the input and output nodes
  input-node-2   ;; in global variables so we can
  output-node-1  ;; refer to them directly
]

;;;
;;; SETUP PROCEDURES
;;;

to setup
  clear-all
  ask patches [ set pcolor gray ]
  set-default-shape bias-nodes "bias-node"
  set-default-shape input-nodes "circle"
  set-default-shape output-nodes "output-node"
  set-default-shape hidden-nodes "output-node"
  set-default-shape links "small-arrow-shape"
  setup-nodes
  setup-links
  propagate
  reset-ticks
end

to setup-nodes
  create-bias-nodes 1 [ setxy -4 6 ]
  ask bias-nodes [ set activation 1 ]
  create-input-nodes 1 [
    setxy -6 -2
    set input-node-1 self
  ]
  create-input-nodes 1 [
    setxy -6 2
    set input-node-2 self
  ]
  ask input-nodes [ set activation random 2 ]
  create-hidden-nodes 1 [ setxy 0 -2 ]
  create-hidden-nodes 1 [ setxy 0  2 ]
  ask hidden-nodes [
    set activation random 2
    set size 1.5
  ]
  create-output-nodes 1 [
    setxy 5 0
    set output-node-1 self
    set activation random 2
  ]
end

to setup-links
  connect-all bias-nodes hidden-nodes
  connect-all bias-nodes output-nodes
  connect-all input-nodes hidden-nodes
  connect-all hidden-nodes output-nodes
end

to connect-all [ nodes1 nodes2 ]
  ask nodes1 [
    create-links-to nodes2 [
      set weight random-float 0.2 - 0.1
    ]
  ]
end

to recolor
  ask turtles [
    set color item (step activation) [ black white ]
  ]
  ask links [
    set thickness 0.05 * abs weight
    ifelse show-weights? [
      set label precision weight 4
    ] [
      set label ""
    ]
    ifelse weight > 0
      [ set color [ 255 0 0 196 ] ] ; transparent red
      [ set color [ 0 0 255 196 ] ] ; transparent light blue
  ]
end

;;;
;;; TRAINING PROCEDURES
;;;

to train
  set epoch-error 0
  repeat examples-per-epoch [
    ask input-nodes [ set activation random 2 ]
    propagate
    backpropagate
  ]
  set epoch-error epoch-error / examples-per-epoch
  tick
end

;;;
;;; FUNCTIONS TO LEARN
;;;

to-report target-answer
  let a [ activation ] of input-node-1 = 1
  let b [ activation ] of input-node-2 = 1
  ;; run-result will interpret target-function as the appropriate boolean operator
  report ifelse-value run-result
    (word "a " target-function " b") [ 1 ] [ 0 ]
end

;;;
;;; PROPAGATION PROCEDURES
;;;

;; carry out one calculation from beginning to end
to propagate
  ask hidden-nodes [ set activation new-activation ]
  ask output-nodes [ set activation new-activation ]
  recolor
end

;; Determine the activation of a node based on the activation of its input nodes
to-report new-activation  ;; node procedure
  report sigmoid sum [ [ activation ] of end1 * weight ] of my-in-links
end

;; changes weights to correct for errors
to backpropagate
  let example-error 0
  let answer target-answer

  ask output-node-1 [
    ;; `activation * (1 - activation)` is used because it is the
    ;; derivative of the sigmoid activation function. If we used a
    ;; different activation function, we would use its derivative.
    set err activation * (1 - activation) * (answer - activation)
    set example-error example-error + ((answer - activation) ^ 2)
  ]
  set epoch-error epoch-error + example-error

  ;; The hidden layer nodes are given error values adjusted appropriately for their
  ;; link weights
  ask hidden-nodes [
    set err activation * (1 - activation) * sum [ weight * [ err ] of end2 ] of my-out-links
  ]
  ask links [
    set weight weight + learning-rate * [ err ] of end2 * [ activation ] of end1
  ]
end

;;;
;;; MISC PROCEDURES
;;;

;; computes the sigmoid function given an input value and the weight on the link
to-report sigmoid [input]
  report 1 / (1 + e ^ (- input))
end

;; computes the step function given an input value and the weight on the link
to-report step [input]
  report ifelse-value input > 0.5 [ 1 ] [ 0 ]
end

;;;
;;; TESTING PROCEDURES
;;;

;; test runs one instance and computes the output
to test
  let result result-for-inputs input-1 input-2
  let correct? ifelse-value result = target-answer [ "correct" ] [ "incorrect" ]
  user-message (word
    "The expected answer for " input-1 " " target-function " " input-2 " is " target-answer ".\n\n"
    "The network reported " result ", which is " correct? ".")
end

to-report result-for-inputs [n1 n2]
  ask input-node-1 [ set activation n1 ]
  ask input-node-2 [ set activation n2 ]
  propagate
  report step [ activation ] of one-of output-nodes
end


; Copyright 2006 Uri Wilensky.
; See Info tab for full copyright and license.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="255" wrappingAllowedX="false" y="10" frameRate="30.0" minPycor="-5" height="238" showTickCounter="true" patchSize="18.0" fontSize="10" wrappingAllowedY="false" width="310" tickCounterLabel="ticks" maxPycor="7" updateMode="1" maxPxcor="8" minPxcor="-8" />
    <button x="155" y="10" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="85" display="setup">setup</button>
    <button x="155" y="52" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="85" display="train">train</button>
    <button x="582" y="164" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="95" display="test">test</button>
    <chooser x="582" y="34" height="60" variable="input-1" current="1" width="100" display="input-1">
      <choice type="double" value="0.0" />
      <choice type="double" value="1.0" />
    </chooser>
    <chooser x="582" y="99" height="60" variable="input-2" current="0" width="100" display="input-2">
      <choice type="double" value="0.0" />
      <choice type="double" value="1.0" />
    </chooser>
    <monitor x="512" precision="3" y="310" height="60" fontSize="11" width="100" display="output">[precision activation 2] of one-of output-nodes</monitor>
    <slider x="10" step="1.0E-4" y="132" max="1.0" width="230" display="learning-rate" height="50" min="0.0" direction="Horizontal" default="0.5" variable="learning-rate" />
    <plot x="10" autoPlotX="true" yMax="1.0" autoPlotY="true" yAxis="Error" y="247" xMin="0.0" height="162" legend="false" xMax="10.0" yMin="0.0" width="230" xAxis="Epochs" display="Error vs. Epochs">
      <setup />
      <update />
      <pen interval="1.0" mode="0" display="default" color="-16777216" legend="true">
        <setup />
        <update>plot epoch-error</update>
      </pen>
    </plot>
    <slider x="10" step="1.0" y="189" max="1000.0" width="230" display="examples-per-epoch" height="50" min="1.0" direction="Horizontal" default="500.0" variable="examples-per-epoch" />
    <chooser x="257" y="279" height="60" variable="target-function" current="1" width="160" display="target-function">
      <choice type="string" value="or" />
      <choice type="string" value="xor" />
    </chooser>
    <note x="10" y="20" backgroundDark="0" fontSize="11" width="130" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">1. Setup neural net:</note>
    <note x="10" y="60" backgroundDark="0" fontSize="11" width="125" markdown="false" height="28" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">2. Train neural net:</note>
    <note x="582" y="14" backgroundDark="0" fontSize="11" width="150" markdown="false" height="18" textColorDark="-1" textColorLight="-16777216" backgroundLight="0">3. Test neural net:</note>
    <switch x="257" y="344" height="40" on="false" variable="show-weights?" width="160" display="show-weights?" />
    <button x="155" y="92" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="85" display="train once">train</button>
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](../../../experiments/artificial-neural-net-multilayer/source.nlogox) and [NOTICE](../../../experiments/artificial-neural-net-multilayer/NOTICE.md). Runtime interpretation: [batch contract](../selected-computing-contract.md). Execution evidence is separate.
