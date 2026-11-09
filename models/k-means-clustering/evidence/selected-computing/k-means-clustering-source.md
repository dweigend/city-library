# K-Means Clustering complete source contract inventory

Identity: `Sample Models/Computer Science/K-Means Clustering`; SHA-256 `fdffc0ac8c8d8b25286039bb9ec53648bb7c12d8829600e5d56185980ba572c6`; NetLogo 7.0.4. Includes: None; extensions: [].

All procedures, equations and textual activation order:

```netlogo
breed [data-points data-point]
breed [centroids centroid]

globals [
  any-centroids-moved?
]

to setup
  clear-all
  set-default-shape data-points "circle"
  set-default-shape centroids "x"
  generate-clusters
  reset-centroids
end

to generate-clusters
  let cluster-std-dev 20 - num-clusters
  let cluster-size num-data-points / num-clusters
  repeat num-clusters [
    let center-x random-xcor / 1.5
    let center-y random-ycor / 1.5
    create-data-points cluster-size [
      setxy center-x center-y
      set heading random 360
      fd abs random-normal 0 (cluster-std-dev / 2) ;; Divide by two because abs doubles the width
    ]
  ]
end

to reset-centroids
  set any-centroids-moved? true
  ask data-points [ set color grey ]

  let colors base-colors
  ask centroids [die]
  create-centroids num-centroids [
    move-to one-of data-points
    set size 5
    set color last colors + 1
    set colors butlast colors
  ]
  clear-all-plots
  reset-ticks
end

to go
  if not any-centroids-moved? [stop]
  set any-centroids-moved? false
  assign-clusters
  update-clusters
  tick
end

to assign-clusters
  ask data-points [set color [color] of closest-centroid - 2]
end

to update-clusters
  let movement-threshold 0.1
  ask centroids [
    let my-points data-points with [ shade-of? color [ color ] of myself ]
    if any? my-points [
      let new-xcor mean [ xcor ] of my-points
      let new-ycor mean [ ycor ] of my-points
      if distancexy new-xcor new-ycor > movement-threshold [
        set any-centroids-moved? true
      ]
      setxy new-xcor new-ycor
    ]
  ]
  update-plots
end

to-report closest-centroid
  report min-one-of centroids [ distance myself ]
end

to-report square-deviation
  report sum [ (distance myself) ^ 2 ] of data-points with [ closest-centroid = myself ]
end


; Copyright 2014 Uri Wilensky.
; See Info tab for full copyright and license.
```

Complete widgets, defaults, actions, plot setup/update code and topology:

```xml
<widgets>
    <view x="310" wrappingAllowedX="false" y="11" frameRate="30.0" minPycor="-50" height="509" showTickCounter="true" patchSize="5.0" fontSize="10" wrappingAllowedY="false" width="509" tickCounterLabel="ticks" maxPycor="50" updateMode="1" maxPxcor="50" minPxcor="-50" />
    <slider x="5" step="1" y="123" max="14" width="275" display="num-centroids" height="50" min="1" direction="Horizontal" default="7.0" variable="num-centroids" />
    <button x="5" y="179" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="275">setup</button>
    <button x="5" y="261" height="35" disableUntilTicks="true" forever="true" kind="Observer" width="275" display="Find Clusters (go)">go</button>
    <button x="5" y="220" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="135" display="Assign Points">assign-clusters</button>
    <button x="145" y="220" height="35" disableUntilTicks="false" forever="false" kind="Observer" width="135" display="Update Centroids">update-clusters</button>
    <button x="5" y="302" height="35" disableUntilTicks="true" forever="false" kind="Observer" width="275" display="Reset centroids">reset-centroids</button>
    <monitor x="5" precision="0" y="600" height="60" fontSize="11" width="275" display="Total Square Deviation">mean [ square-deviation ] of centroids</monitor>
    <plot x="5" autoPlotX="true" yMax="10.0" autoPlotY="true" y="350" xMin="0.0" height="240" legend="false" xMax="10.0" yMin="0.0" width="275" display="Square Deviation of Clusters">
      <setup>ask centroids [
create-temporary-plot-pen (word color)
set-plot-pen-color color
]</setup>
      <update>ask centroids[
set-current-plot-pen (word color)
plot square-deviation * num-clusters
]</update>
    </plot>
    <slider x="5" step="1" y="11" max="14" width="275" display="num-clusters" height="50" min="1" direction="Horizontal" default="7.0" variable="num-clusters" />
    <slider x="5" step="1" y="67" max="1000" width="275" display="num-data-points" height="50" min="num-centroids + 1" direction="Horizontal" default="138.0" variable="num-data-points" />
  </widgets>
  
```

Complete Info, provenance, limitations and notices remain in [source](../../../experiments/k-means-clustering/source.nlogox) and [NOTICE](../../../experiments/k-means-clustering/NOTICE.md). Runtime interpretation: [batch contract](../../../docs/development/selected-computing-contract.md). Execution evidence is separate.
