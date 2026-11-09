# Mesa / Salabim integration contracts

## Current integration status

The coordination-only commit is `91e4c11`. The public-example freeze commits are `1570b64` (five DES scripts), `0ea94f1` (five phase-A city pairs) and `73a3bf9` (five phase-B city pairs). Additive APIs below are now frozen and implemented through `e624416`; Mesa World attachment is normally merged from `69ed507`. Native pre-freeze logic review passed; Gemini requested contract clarifications, responses are recorded in `docs/development/des-design-review.md`, and the final Gemini DES design/source review is approved (docs/development/des-gemini-final-review.md); the late shared canvas resize correction passed its separate source/browser gates (docs/development/des-canvas-resize-review.md and docs/development/des-integration-evidence.md). The original coordination baseline below explains the delivery boundary.

## Status and ownership

Coordination baseline: `cc6d5c3136c07cda94d5a4449b6e384c435f6ad4`. Salabim worktree `/home/david/.t3/worktrees/city-library/t3-4aa89a8c`, owned branch `feat/salabim-concepts`. Mesa worktree `/home/david/.t3/worktrees/city-library/t3-4fc992c0`; its coordinator reports its own branch/commit independently.

The original coordination commit preceded example freeze and runtime. At baseline the public exports were Agent, World, run, Random, Graph, Grid, topology, stats and geometry and their existing types, with no Agenda, History, Resource or Process export. The current signatures below are frozen and implemented; the current integration status above identifies the commits. Implementation and passing target checks remain separate from final independent acceptance.

| Owner | Scope |
| --- | --- |
| Salabim | Agenda, ServiceQueue, Resource, Store, explicit wait conditions, TimeWeighted and event diagnostics |
| Mesa | Measurement definitions, storage.history / History, parameter studies, existing World activation/report/select, two-phase updates, global execution budgets, continuous thresholds, groups and Graph membership |

There is one capacity owner: Resource. Mesa composes Resource rather than implementing another reservation counter. No duplicate History, activation scheduler or global budget API is introduced. Each track owns its files; no edits are made in the counterpart checkout. Integrate through normal merges preserving example-first history. Each track adds only its own root exports; the Mesa integration coordinator resolves textual export conflicts.

## Agenda: frozen public surface

```ts
Agenda.add<E = unknown>(): Agenda<E>
agenda.time: number
agenda.size: number
agenda.add(options: { at: number; data: E; priority?: number }): EventHandle<E>
agenda.delete(handle: EventHandle<E>): void
agenda.advance(options: { until: number; maxEvents?: number }): readonly Event<E>[]
agenda.next(options: { until: number }): Event<E> | undefined
type EventHandle<E> = { readonly id: string; readonly agenda: Agenda<E> }
type Event<E> = {
  readonly id: string; readonly at: number; readonly priority: number;
  readonly sequence: number; readonly data: E;
}
```

The binding batch API is preserved. Time starts at zero; event time is finite and at least current Agenda time. Priority defaults to zero, signed safe integer; sort by time, lower priority, then insertion sequence. `until` is finite and at least current time. Event data is detached supported data with canonical framework references. Issued handles are receiver-specific; forged/foreign handles reject, repeated deletion of an issued absent event is a no-op.

**Causal dispatch:** successful `next` removes one event and sets time to `event.at`, even for the last due event. Empty `next` returns undefined and advances time to `until`. Caller dispatches each result before the next extraction. A handler at 2 can schedule 3 within horizon 10. Batch `advance` is unsuitable for causal callback dispatch because it can already have advanced to 10. Its positive integer `maxEvents` defaults to 1000: stop at last extracted event if due work remains, otherwise advance to horizon.

The caller's per-call event limit counts equal-time events and zero-delay chains. Exhaustion leaves the clock at the last event; no hidden skipping, World tick update or global run-budget consumption occurs. Mesa global run budgets count their separately defined execution unit. Neither budget silently substitutes for the other.

Agenda is usable standalone and World-attached. Mesa owns `src/world/world.ts` and `src/world/activation/`; Salabim will not edit those. Binding attachment is `world.add(agenda)`, `world.delete(agenda)`, `world.agendas: readonly Agenda[]`, sharing existing atomic membership and single-World ownership without implicit dispatch. Mesa implemented that seam in 69ed507; attachment/clock/identity checks now pass on the merged target.

## Process interaction and activation

No public `Process`, `ProcessEvent` or `Process.activate` scheduler is frozen or delivered by Salabim. A previously proposed facade is superseded before freeze by this coordination decision. Process interaction is ordinary typed model state plus Agenda events/handles: delay schedules an event, reactivation replaces a pending handle, passivation cancels it while retaining state, cancellation marks a terminal state, and timeout is an explicitly ordered event. A dispatcher may explicitly invoke Mesa's existing `world.activate`; Agenda does not duplicate selection, activation frames or two-phase updates. Exact Mesa activation signatures remain owned by its contract/example commit.

## Resource and capacity: frozen public surface

```ts
Resource.add<T>(options: { capacity: number; policy?: "fifo" | "priority" }): Resource<T>
resource.request(options: { owner: T; units?: number; priority?: number }): ResourceRequest<T>
resource.release(ticket: ResourceRequest<T>): void
resource.cancel(ticket: ResourceRequest<T>): void
resource.setCapacity(capacity: number, options?: { occupied?: "reject" | "retain" }): void
resource.capacity: number
resource.used: number
resource.available: number
resource.waiting: readonly ResourceRequest<T>[]
type ResourceRequest<T> = {
  readonly id: string; readonly owner: T; readonly units: number;
  readonly status: "waiting" | "granted" | "released" | "cancelled";
}
```

Capacity is a nonnegative safe integer; units default to 1 and are positive safe integers. New requests exceeding current capacity reject. FIFO defaults; priority uses lower-first stable ties. Strict head-of-line admission never bypasses blocked waiters. Resource alone owns waiting/granted state. Used is the sum of granted units; available is max(0, capacity-used).

Release of a granted ticket synchronously grants eligible waiters; repeated release is a no-op. Release of waiting/cancelled tickets rejects. Cancel of waiting or granted tickets makes them cancelled, returns any occupied units and admits waiters; cancel of terminal tickets is a no-op. Forged/foreign tickets reject before mutation. Timeouts must guard `ticket.status === "waiting"` before cancel because generic cancel intentionally also releases a grant. At equal times dispatch order determines the winner.

Shrink defaults to reject below used units atomically. Explicit retain preserves existing claims without preemption, allows temporary overcapacity, and reports zero available until releases catch up. Previously valid oversized waiting requests can block until growth/cancellation. Growth admits waiters. No callback or activation occurs automatically.

## Queue, Store and wait conditions: frozen surface

```ts
ServiceQueue.add<T>(options?: { policy?: "fifo" | "priority" }): ServiceQueue<T>
queue.add(value: T, options?: { priority?: number }): QueueHandle<T>
queue.take(): T | undefined
queue.delete(handle: QueueHandle<T>): void
queue.entries: readonly T[]
Store.add<T>(options: { capacity: number }): Store<T>
store.put(value: T): PutRequest<T>
store.get(): GetRequest<T>
store.take(): T | undefined
store.cancelPut(ticket: PutRequest<T>): void
store.cancelGet(ticket: GetRequest<T>): void
store.items: readonly T[]
store.waitingPuts: readonly PutRequest<T>[]
store.waitingGets: readonly GetRequest<T>[]
Signal.add<T>(value: T): Signal<T>
signal.value: T
signal.set(value: T): void
signal.wait(predicate: (value: T) => boolean): WaitRequest
signal.cancel(ticket: WaitRequest): void
```

Store capacity is positive safe integer. Producers and consumers are FIFO. Put status is waiting/stored/cancelled; get status waiting/received/cancelled with `value: T | undefined`. Stored includes completed direct handoff. Completed operations cannot be undone by cancellation. Signal waits are one-shot waiting/satisfied/cancelled; proposed-value predicates evaluate synchronously before commit, and failure preserves prior value/status. No scheduler or implicit timeout is introduced. See [detailed DES contract](docs/development/des-contract.md) for ordering and failure details.

## Lifecycle and shared files

Canonical Agent references are retained. Queue entries, resource owners and stored/waiting-producer Agent values use existing `deletionParticipants`. Agent deletion rejects atomically while participation remains. Removal, consumption, release or cancellation unregisters the relevant participant. Dead Agents reject on admission; World detachment alone does not clean up domain participation. No second identity registry or shadow occupancy is allowed.

Salabim may add a focused private helper using `frameworkRecord`/`requireLivingAgent`; Mesa activation uses the existing hooks. Any needed change to `src/agent/lifecycle.ts` must be communicated before integration. Salabim currently needs no change to that file for queue/resource/store participation. World Agenda attachment would need the `agenda` framework kind and is coordinated with Mesa rather than edited concurrently.

## Time-weighted measurement and History bridge

```ts
TimeWeighted.add(options: { at?: number; value: number }): TimeWeighted
weighted.set(sample: { at: number; value: number }): void
weighted.read(options: { until: number }): {
  readonly duration: number;
  readonly integral: number;
  readonly mean: number | undefined;
}
EventTrace.add<T>(options: { capacity: number }): EventTrace<T>
trace.record(event: { at: number; value: T }): void
trace.read(): readonly { readonly at: number; readonly value: T }[]
```

TimeWeighted initial at defaults to 0. Finite times are nonnegative/nondecreasing; values and accumulated arithmetic are finite. Samples define a right-continuous piecewise constant level. Read is pure, until is at least the latest set time, duration starts at initialization, and zero duration yields integral 0 and mean undefined. Same-time sets add zero area. This is an aggregate, not retained History samples.

EventTrace replaces the pre-freeze name EventSamples. It is bounded **event diagnostics**, allows equal at values, rejects backward timestamps, retains newest entries, and copies supported data. It is not a measurement-definition system or numerical History substitute. No automatic recording/subscription/console output.

Mesa reports these delivered signatures (its own example-freeze SHA is authoritative):

```ts
storage.history(options?: { capacity?: number }): History // default 300, cap 1_000_000
history.add(sample: { tick: number; values: Readonly<Record<string, number>> }): void
history.samples: readonly { readonly tick: number; readonly values: Readonly<Record<string, number>> }[]
history.delete(): void
measurements.define<Model, Values extends Readonly<Record<string, number>>>(
  project: (model: Model) => Values
): { read(model: Model): Readonly<Values> }
```

History uses strictly increasing tick and a fixed exact finite metric schema; reads are detached. Its tick is an explicitly supplied recording axis, not an automatic World clock. Caller may supply World tick or deliberately map Agenda time into tick in consistent units. Aggregate same-time event effects before one History add, or record them in EventTrace. Never invent epsilon ticks or modify World tick to satisfy History. Undefined time-weighted mean at zero duration must be omitted or explicitly handled by caller before numeric History recording. Neither read advances any clock or draws Random.

## Merge and evidence

This coordination document is merge-ready independently of runtime. The example-first commits must precede runtime, preserve asserted public syntax/results and record review findings/fixes separately from approval. Root additions, shared lifecycle hooks and World attachment require cross-track merge verification. No push, PR or main merge is authorized.
