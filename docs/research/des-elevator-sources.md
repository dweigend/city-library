# Elevator mechanism and source checks

Use the elevator as a small discrete-event mechanism demonstration. Waiting people, cabin occupants and completed journeys must agree with the same headless observations. Neither the selected image nor an upstream sample establishes calibrated traffic, passenger comfort, mechanical safety or certified lift operation.

## Verified primary sources

Checked on 2026-11-09 against Salabim commit [`99bc8b2213d66a7287f04952cabc1fb9aa6c369d`](https://github.com/salabim/salabim/tree/99bc8b2213d66a7287f04952cabc1fb9aa6c369d), dated 2026-05-29T12:37:40Z. The repository's current master resolved to that commit during this check. Both complete Python files and the pinned license were retrieved directly, then hashed before analysis.

| File | Verified SHA-256 |
| --- | --- |
| [Elevator.py](https://raw.githubusercontent.com/salabim/salabim/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/sample%20models/Elevator.py) | `30de9231170420d9242fccd6beb164995b64ea83d4491f6a51f298e111f4c4d6` |
| [Elevator animated.py](https://raw.githubusercontent.com/salabim/salabim/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/sample%20models/Elevator%20animated.py) | `f0960431488fc2b6b5838f19e508931d65ea04e9e2e88cb56917a158ff38a110` |
| [MIT license](https://raw.githubusercontent.com/salabim/salabim/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/salabim/LICENSE.txt) | `620e0896ac1ff640bced5fc1f1cc349856b1a98e561357527bb194e5b31e014a` |

The license names Ruud van der Ham, copyright 2016. This work studies the mechanisms; copied substantial implementation material would require retaining the license notice. No Python dependency, coroutine bridge or animated desktop host is required for the TypeScript adaptation. The official [Component manual](https://salabim.org/manual/Component.html) describes scheduling, passivation and explicit activation; City Library expresses these through existing Agenda data and ordinary model state rather than another Process scheduler.

## What the samples establish

The plain example generates journeys with distinct origin/destination floors. Arrivals enter a floor queue and register a floor/direction request; idle cars wake. Cars start at floor zero, alight before boarding, travel one floor at a time and seek an oldest directional request when empty. Defaults are three cars, capacity four, floors 0–15, movement duration 10, and door/transfer durations 3. Its `3600 / load` interarrival calculation suggests seconds if load denotes passengers/hour; that unit interpretation is an inference, not empirical calibration. [Pinned plain sample](https://raw.githubusercontent.com/salabim/salabim/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/sample%20models/Elevator.py).

The animated sample uses the same broad queue/dispatch mechanism and adds floor lines, direction indicators, cabin/queue rendering and sliders. Its displayed car position interpolates between discrete floor events. Topology/capacity slider changes restart the model through the host loop. Desktop rendering, video, global sliders and implicit restart are host-specific mechanisms, not requirements for Model Lab. The `n_0` generator correctly selects `load_n_0` in this version. [Pinned animated sample](https://raw.githubusercontent.com/salabim/salabim/99bc8b2213d66a7287f04952cabc1fb9aa6c369d/sample%20models/Elevator%20animated.py).

## Transfer cautions found in source

These are direct source observations and policy limitations, not claims that the upstream package fails generally:

- In plain `Elevator.py`, the `n_0` branch selects `load_0_n`, despite a separate `load_n_0` setting. The animated version differs as noted above. Do not reproduce the plain parameter mismatch.
- In both files, the entry delay is outside the matching-direction/capacity tests. It runs for floor visitors who do not board too. Local transfer timing should charge only its explicitly defined transfer events.
- A full-car directional call is removed and reinserted with the current time. Its age can change while the original passenger still waits. Local oldest-request policy should preserve original arrival sequence rather than inherit this age reset.
- Source tie order follows request-dictionary iteration; all passive cars wake on arrival. That does not itself specify coordinated car reservations or prove starvation freedom under continuing demand. Local dispatch ties and reservation cleanup need explicit contracts.

The useful adaptation is directional waiting, alight-before-board service and discrete adjacent-floor travel. Local capacity, timing, ties and reservation rules must be frozen independently rather than copied accidentally from Python control flow.

## Local policy checks before implementation

The proposed local default is six floors, two cars and capacity four. That is a smaller teaching configuration, not a scaled prediction of the source building. The contract/example agent owns the exact accepted durations, initial arrivals and result fixtures; research does not retrospectively alter them.

The proposed adaptation uses FIFO floor/direction queues, original passenger arrival sequence, deterministic car-number ties and reservations only for dispatch intent. Each cabin uses Resource as its sole occupied-capacity authority. Request a cabin unit only when actually boarding; do not create a second Resource waiting queue that duplicates the floor queue. Capacity for free/occupied slots must come from Resource rather than a separate mutable load counter.

An empty car may reserve an oldest unreserved directional call. A reservation neither removes a waiting passenger nor occupies cabin capacity. If another car serves that call first, release the stale intent and choose again. Preserve the remaining call when a full cabin departs. Opposite-direction waiting must not disappear merely because a car stops at that floor.

Define the observation boundary for transfers before freezing times: whether boarding starts or completes when waiting ends, when a Resource unit becomes occupied, and when alighting releases it. Report waiting duration and cabin/journey duration against those same boundaries. Waiting plus riding time can be checked against completed system time only when the boundaries match. Individual transfer delays are an explicit local deviation from the sample's batched exit delay.

Positive travel time prevents adjacent-floor movement from producing an unbounded same-time chain. If door or transfer durations allow zero, every event still counts toward the per-call Agenda limit. Budget exhaustion must throw or stop the interval before a successful World tick is counted. It must not discard pending events, invent a later timestamp or silently complete the interval.

## Deterministic validation expectations

These expectations are proposed checks, not executed implementation results:

1. At every event and observation, `waiting + riding + arrived = created`. Every passenger is in exactly one semantic state and at most one floor queue or cabin. A car's Resource usage equals its actual riding passenger count and never exceeds its configured capacity.
2. Origins/destinations are integer floors in range and distinct; every adjacent-floor event stays within the building. Reject invalid setup/actions before creating a passenger, ticket or event.
3. At a shared stop, all required alighting transfers finish before boarding. Freed units can then admit eligible waiting passengers; simultaneous arrivals, car ties and FIFO ties have fixed expected order.
4. A capacity-one fixture with two same-direction passengers leaves the second original request pending. A separate opposite-direction fixture retains its call. Eventual completion should be demonstrated for a finite bounded workload; ongoing arrivals are not a starvation or finite-mean waiting guarantee.
5. An idle/no-demand model advances explicitly without spurious car movement. Adding a valid request wakes eligible idle cars through normal model actions and Agenda events, without wall-clock timers or hidden model steps.
6. Reading observations or rendering repeatedly leaves Agenda time, World tick, queue order, Resource use and Random state unchanged. Independent instances cannot share queues, events, reservations or Random state.
7. Test zero-duration door/transfer chains against a deliberately small event limit, cancellation/disposal of obsolete work where offered, and partial effects on failure. No complete-state continuation claim follows from seeded replay alone.

An M/M/1 stationary formula is not an appropriate elevator acceptance oracle: these cars batch passengers, visit floors and have state-dependent service times. Use exact event fixtures and conservation first. Empirical predictions would need independently measured demand by floor/direction/time, service/door/travel distributions, a declared dispatch policy and validation against observed journeys.

## Selected image and state parity

The researcher opened the actual selected `11-elevator.png`. It supplies a simple visual vocabulary: flat floor lines, outlined shafts/cabins, passenger dots and directional marks. Its controls and oversized title are not a replacement for Model Lab.

The image shows four dots in each of two cabins, while its Riding monitor says five. Its floor waiting dots total ten. Therefore it cannot define a valid simulation fixture. Draw exactly the passengers supplied by the current observation; a full cabin at capacity four must never depict a fifth passenger, and empty slots must agree with Resource availability. Floor-direction marks represent actual pending queues, not decorative arrows. Diagram coordinates can describe an elevation without pretending to be physical World positions.

This document records primary-source inspection and independent reasoning only. Model implementation, public expected-result execution, scientific validity, renderer parity and browser/image approval remain separate gates.
