# Discrete-event composition contract

Status: the bounded Agenda, service queue, Resource, Store, Signal, trace and time-weighted contracts are implemented. The public examples preserve the accepted calls and expected results. Model-level scientific calibration and broader upstream parity remain separate requirements.

## Time and causality

`Agenda.create<E>()` implements the binding `add`, `delete`, `time` and `advance({until,maxEventCount})` API unchanged. Event order is ascending `(at, priority, sequence)`. Priorities are signed safe integers. Time is finite, nonnegative model time. Events contain supported detached data and preserve canonical framework references; callbacks, accessors and thenables are unsupported event data. Handles are issued by one Agenda; forged or foreign handles reject, and repeated deletion of a valid issued handle is a no-op. `size` is the pending event count.

The additive operation `agenda.next({until}): Event<E> | undefined` removes at most one due event. On success, it sets `time` to that event's `at`, **including when that was the last due event**. On absence, it sets `time` to `until`. `until` must be finite and at least current time. This permits a handler at time 2 to schedule time 3 before reaching horizon 10. The batch `advance` still moves to the horizon when no due work remains; dispatching its returned batch is unsuitable for causal chains that create earlier follow-up events.

Models explicitly dispatch returned data with ordinary synchronous TypeScript. Every loop has a finite positive event budget; equal-time and zero-delay chains count against it. Exhausting the budget leaves the cursor at the last returned event and does not silently skip work or advance World tick. The caller may resume at the same horizon. If exactly the final event consumes the budget, a later empty `next` is needed to advance to the horizon. No guarantee of progress exists for a model that continually schedules zero-delay work. No hidden callback, timer, Promise, World step or second Environment engine exists.

Agenda is usable without World. `world.add(agenda)`, `world.delete(agenda)` and readonly `world.agendas` are implemented by the normally merged Mesa attachment slice (69ed507), using existing membership semantics, including atomic batches and at most one World owner. World attachment never dispatches events. World tick and Agenda time are distinct; models document an explicit unit/horizon mapping. A successful `run(world, step, 1)` increments tick once regardless of event count; fractional explicit tick advances remain valid.

All public Agenda arguments validate before mutation. Missing/non-record options, unknown keys, accessors and nonnumeric times throw TypeError; nonfinite/out-of-range times and invalid numeric budgets/priorities throw RangeError. Invalid `next` leaves the cursor and pending events unchanged.

## Service queue and resources

```ts
ServiceQueue.create<T>({ policy?: "fifo" | "priority" }): ServiceQueue<T>
queue.add(value: T, options?: { priority?: number }): QueueHandle<T>
queue.take(): T | undefined
queue.delete(handle: QueueHandle<T>): void
queue.entries: readonly T[]

Resource.create<T>({ capacity: number, policy?: "fifo" | "priority" }): Resource<T>
resource.request({ owner: T, units?: number, priority?: number }): ResourceRequest<T>
resource.release(ticket: ResourceRequest<T>): void
resource.cancel(ticket: ResourceRequest<T>): void
resource.setCapacity(capacity: number, options?: { occupied?: "reject" | "retain" }): void
resource.capacity: number
resource.used: number
resource.available: number
resource.waiting: readonly ResourceRequest<T>[]
```

Capacity is a nonnegative safe integer; request units are positive safe integers, default 1. A new request larger than current capacity rejects. Priority defaults to 0 and is a signed safe integer. FIFO is default. Priority orders lower values first with stable insertion ties. Strict head-of-line admission never skips a blocked earlier request to admit a smaller later request. Admission never skips the policy-sorted head. Priority may reorder waiting tickets when a higher-priority request arrives, but never preempts holders. A request ticket exposes readonly `id`, canonical `owner`, `units` and live `status: "waiting" | "granted" | "released" | "cancelled"`. Resource is the only owner of waiting and granted occupancy. `used` sums granted units; `available = max(0, capacity-used)`.

Release accepts granted tickets, returns their units and synchronously admits waiting requests; repeated release of a released ticket is a no-op. Cancel removes a waiting request or returns a granted request's units, sets cancelled status and synchronously admits waiters; repeated cancel of terminal tickets is a no-op. Releasing a waiting or cancelled ticket rejects. Foreign or forged tickets reject before mutation. No method dispatches model callbacks. Models inspect ticket statuses and explicitly schedule new completions, once per newly granted ticket.

Capacity shrink defaults to `occupied: "reject"`: reject below used units atomically. Explicit `retain` permits temporary overcapacity, never preempts holders, reports available zero until releases catch up, and keeps previously valid oversized waiters in order. Such a waiter may require a later increase or explicit cancellation. Growth synchronously admits waiters. Policies never modify Agent membership or time.

Queue entries retain canonical references. `entries` is an ordered readonly array snapshot. Taking or deleting removes participation; deleting an absent issued handle is a no-op. Handles are receiver-specific. Independent queues have no hidden shared state.

## Bounded stores

```ts
Store.create<T>({ capacity: number }): Store<T>
store.add(value: T): StoreAddition<T>
store.request(): StoreRequest<T>
store.take(): T | undefined
store.cancel(ticket: StoreAddition<T> | StoreRequest<T>): void
store.items: readonly T[]
store.waitingAdditions: readonly StoreAddition<T>[]
store.waitingRequests: readonly StoreRequest<T>[]
```

Capacity is a positive safe integer. Items retain canonical references. Both waiting producer and waiting consumer queues use FIFO; no arrival bypasses an older waiter. Addition tickets (`StoreAddition<T>`) expose `id`, `value`, `status: StoreAdditionStatus` (`"waiting" | "stored" | "cancelled"`); stored means the addition completed, including direct handoff. Request tickets (`StoreRequest<T>`) expose `id`, `value: T | undefined`, `status: StoreRequestStatus` (`"waiting" | "received" | "cancelled"`); the two ticket types stay separate because only a request can lack a value. inspect status to distinguish an undefined payload from no result. A producer waits when full. A consumer waits when empty. Available items synchronously satisfy consumers, then freed slots admit producers, with direct FIFO handoff where possible. `take` is a nonwaiting request and returns undefined when empty; use `request` for undefined-valued payloads. `cancel` withdraws a waiting ticket of either kind; finished tickets are ignored and foreign tickets reject. No hidden event or callback is generated.

Cancel affects only waiting tickets and otherwise is a no-op. It never undoes a completed transfer. Foreign or forged tickets reject. Snapshots do not expose writable store membership.

## State conditions, process interaction and timeouts

```ts
Signal.create<T>(value: T): Signal<T>
signal.value: T
signal.set(value: T): void
signal.wait(predicate: (value: T) => boolean): WaitRequest
signal.cancel(ticket: WaitRequest): void

```

Signal is an explicit state owner, independent of Agenda and World. Wait tickets have readonly `id`, live `status: "waiting" | "satisfied" | "cancelled"`. Initial predicates run synchronously. `set` evaluates pending predicates in insertion order against the proposed value before committing; a thrown predicate leaves the value and tickets unchanged. Satisfied waits are one-shot. Predicates must be synchronous, pure and non-reentrant. Cancellation does not undo satisfaction. Foreign tickets reject. Signal stores its value directly; observers must not mutate it.

Process interaction is ordinary explicit model state composed with Agenda data and cancellation handles. A model stores its stage, an optional pending handle, a generation number and a status. Scheduling at a later time expresses delay; deleting the previous handle and scheduling a replacement expresses interruption/reactivation; deleting without replacement expresses passivation; terminal model state plus deletion expresses cancellation. A model dispatches each `next` result before requesting another, checks its own generation and advances its stage synchronously. The example retains execution at time 2, an interrupted delay from 5 to 4, passive completion and terminal cancellation. There are no stored callbacks, hidden timers or duplicate activation scheduler.

The proposed public `Process`/`ProcessEvent` facade was superseded before freeze by explicit Agenda composition and Mesa's delivered activation seam. Mesa owns activation and global run budgets; Salabim contributes Agenda event-time operations and per-call event limits. Per-call Agenda budgets do not define another global run-budget API. No facade-level provenance or owner lifecycle API is exposed; ordinary model state and issued Agenda handles provide the accepted process composition.
Timeouts are ordinary typed Agenda events that cancel waiting resource/store/signal tickets or activate a process. No hidden timeout engine exists. At equal time the first event actually dispatched wins, according to Agenda priority/sequence. Timeout handlers explicitly check `status === "waiting"` before cancellation. This guard matters for Resource: its general cancel operation intentionally also releases an already granted allocation. Store and Signal cancellation never undo completed transfer/satisfaction. A release followed by a guarded timeout therefore differs from timeout followed by release; assertions freeze this distinction. Infinite zero-delay activation remains bounded by the caller's event budget.

## Canonical identity and deletion

Agent references remain the original living objects; no DES wrapper becomes another Agent identity. Queue entries, waiting/granted resource owners, stored or waiting-producer Agent values register deletion participants with existing Agent lifecycle coordination. Deletion rejects atomically while participation remains. Taking/deleting queue entries, consuming store items, and releasing/cancelling requests remove their participation. A completed request ticket is a historical caller-held reference, not ongoing occupancy. Detached ordinary records are allowed as owners/values and have no Agent deletion hook. Dead Agents reject on admission. World detachment alone neither releases resources nor cancels requests. The caller performs its explicit domain cleanup before deleting an Agent.

Each ticket, queue entry and store occupancy slot registers its own deletion participant, including repeated references to the same Agent in one container. Removing one participation never unregisters another. Pending addition participation transfers to its stored slot until consumption; completed direct handoff leaves no store occupancy. Independent containers retain their independent hooks.

## Observations, trace data and random draws

```ts
TimeWeighted.create({ at?: number, value: number }): TimeWeighted
weighted.set({ at: number, value: number }): void
weighted.read({ until: number }): { duration: number; integral: number; mean: number | undefined }
EventTrace.create<T>({ capacity: number }): EventTrace<T>
trace.add({ at: number, value: T }): void
trace.read(): readonly { readonly at: number; readonly value: T }[]
```

Mesa owns measurement definitions, History and parameter studies. EventTrace is the agreed name for bounded event diagnostics; it does not create a duplicate History API. TimeWeighted owns the DES integration of a caller-selected signal over explicit time. Observation times are finite and nonnegative. TimeWeighted initial time defaults to zero; set times are nondecreasing and define a right-continuous piecewise constant signal. `read` is pure and may extend the last value to a horizon at least the last set time. Duration is from initial time; zero duration has integral zero and undefined mean. Numeric values/integrals must remain finite. EventTrace uses finite positive safe-integer capacity, retains the newest samples, allows equal times, rejects backward times and returns detached supported data. Typed trace data is `EventTrace<{ kind: string; agentId?: string; detail?: ... }>`: recording is explicit; no console logging, hidden subscribers or duplicate clock. This is event trace data, not complete-state continuation.

Reuse existing explicit Random uniform, normal, exponential and Poisson distributions. Add `random.number({distribution:"bernoulli",probability})` returning 0/1; `triangular` with required finite min/mode/max and min <= mode <= max; `gamma` with required finite positive shape/rate. Validation precedes draws. Bernoulli requires finite probability in [0,1]; endpoints 0/1 consume no draws. Triangular requires finite min <= mode <= max; a constant consumes no draws and every nonconstant call consumes exactly one uniform double. Shape/type failures throw TypeError and finite/range violations throw RangeError before draws. Gamma follows the binding standard Marsaglia–Tsang sampler with shape boosting below 1, rate in inverse-output units and a maximum of 1,000,000 rejection attempts; it uses the existing cached standard Gaussian. It uses a documented bounded rejection sampler and finite-result checks; its rejection exhaustion throws. All draws use the supplied stream; copy/state/local continue to work. These methods do not establish Salabim stream compatibility or full model continuation.

## Example gates and status

The five scripts in `tests/public-contracts/des/` freeze: causal/tied/budgeted Agenda; resource and queue conservation/lifecycle; store producer-consumer backpressure; explicit state/process/timeouts; time-weighted samples/trace and Random continuation. They use public root imports, assert expected results and initially failed because exports did not yet exist. No mock runtime or disabled assertions are permitted. Ten real model/UI pairs are specified separately in the city-example acceptance document.
