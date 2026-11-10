# Integrate research through the accepted author scripts

The accepted scripts lead library development. Mesa and circular-economy research provide questions and contrasting cases for these scripts; they do not create a second implementation roadmap. The [example-first plan](PLAN.md) owns sequence and acceptance. [Architecture](../../ARCHITECTURE.md) and the Agent Loom reference retain their binding contracts.

Four scripts run with delivered APIs: household budget, neighborhood heat, scarce resource and shared machine. The generative quarter remains an unmet geometry target. See the [example index](../../../tests/public-contracts/city-simulation/README.md) for commands and acceptance.

## One authoring rule

Write ordinary TypeScript with a flat, block-like main flow: parameters → setup → rule execution → observations. Keep model rules in short named functions. Use existing public names and native collections. Required constructor and polygon nesting remains valid; avoid nested control flow and callback chains rather than inventing a YAML interpreter or hiding the model in large wrappers.

Use existing operations first. Below each future draft, list any genuinely missing library operations, their existing proposed names where available, their purpose and the evidence needed. A local model helper is not a new library export.

## What the accepted scripts teach

| Canonical script | Integrated responsibilities | Established expectation | What it does not establish |
| --- | --- | --- | --- |
| [Household budget](../../../tests/public-contracts/city-simulation/01-household-budget.ts) | Agent identity, explicit membership, caller rule and World execution. | Balance 19000 after 12 successful steps. | Closed money conservation, settlement between accounts, insolvency or allocation. Income and rent cross the model boundary. |
| [Neighborhood heat](../../../tests/public-contracts/city-simulation/02-neighborhood-heat.ts) | Canonical Fields, a local update rule, execution and observation. | Center 20, four face neighbors 22, sum 188 after one step. | General heat physics or irregular-grid diffusion. Temperature sum is an energy proxy only under the declared equal-capacity assumptions. |
| [Generative quarter](../../../tests/targets/city-simulation/03-generative-quarter.ts) | Script-generated lines, geometric corridors, subtraction, subdivision and retained results. | Site 10000 m², road union 1536 m², four blocks totaling 8464 m²; supported fixture fully subdivides. | Legal/network access, historic realism, geometric state migration or traffic. Its three missing geometry operations remain explicit targets. |

These are accepted reference tasks of different sizes, not competing universal model templates. Preserve their public syntax and expectations. Add contrasts in separate scripts instead of making the original examples harder to read.

## Semantic questions for each new brief

1. **Authority and boundary:** who owns each fact, in which units and system boundary? Derive availability from stock and reservations rather than keeping competing writable copies.
2. **Identity and meaning:** is the operation changing a quantity, ownership, temporary access, component assignment or product condition? A Graph relation does not enforce exclusive assignment by itself.
3. **Read state and order:** do decisions see the current state or a chosen old state? Is activation fixed, shuffled, staged or synchronous? Which Random stream is used?
4. **Joint feasibility:** can all accepted requests be fulfilled together? Shared reading does not resolve competition for one remaining item. Name the conflict rule where needed.
5. **Transition and time:** when does a promise become a reservation, consumption, arrival or completion? Define same-time ordering. Do not equate World tick, Agenda cursor and host playback time.
6. **Rejection, cancellation and failure:** expected rejection should leave the declared state unchanged. Cancellation after consumption needs explicit domain consequences. `run` does not roll back earlier changes after an exception; blind retries may duplicate effects.
7. **Observation and comparison:** state when measurements are taken. Observation/UI never consumes simulation randomness or changes time/state. Controlled demand/failure sequences can make strategy comparisons clearer than identical seeds with different draw orders.

This is a reasoning checklist, not a required read/decide/resolve/apply framework. A sequential model may validate and apply requests one at a time. Synchronous rules need only the relevant old values, not a complete World copy. Between validation and application, the chosen protocol must preserve the checked prerequisites.

## Responsibilities, not new modules

| Responsibility | Where it belongs |
| --- | --- |
| Identity, membership, Grid/Graph, execution, randomness and statistics | Existing public library domains and accepted contracts. |
| Recipes, demand, prices, compatibility, allocation priorities, booking/cancellation and repair rules | Headless model scripts first. A traffic, supply or circularity example does not require a built-in domain engine. |
| Independent models, external scenario inputs, sampling and evaluation | Experiment composition, without duplicating model state. |
| Controls, appearance, selection and playback | Separate UI modules calling public model actions and displaying observations. |

State/balances, transformation, allocation/settlement, connections/transport, time/execution and observation/comparison are six research lenses. They are not package boundaries and do not justify six managers. Amounts, service slots and identifiable products retain distinct semantics.

## Delivered contrasts and future research

Scarcity and machine lifecycle are implemented in the [scarce-resource](../../../tests/public-contracts/city-simulation/04-scarce-resource.ts) and [shared-machine](../../../tests/public-contracts/city-simulation/05-shared-machine.ts) probes. The following table distinguishes those delivered contrasts from future graph and recovered-component work. Circular-economy comparisons remain future research. These do not change the quarter geometry target or Townscaper contracts.

| Contrast | Prescribed starting point and result | Question tested |
| --- | --- | --- |
| Last resource unit (delivered) | Stock 1, A=0, B=0; each requests 1. Priority A yields stock 0, A=1, B=0, unmet demand 1. Reversing priority changes the winner. | Eligibility versus joint capacity, explicit rejection and conserved quantity. |
| Machine lifecycle (delivered) | Stock 2; A reserves 1, leaving stock 2 and available 1. Start consumes 1. Failure releases the service slot but does not restore consumed material. Repair completion at time 2 precedes or follows B's definitive request by a stated rule. | Reservation versus consumption, service versus ownership, cancellation, same-time ordering and retained identity. |
| Recovered components (future) | Three windows compete for two openings; one is incompatible. Compare reuse, refurbishment and recycling without simultaneous assignment or double-counted mass. | Identity, quality/compatibility, assemblies and delayed recovery. Numeric dimensions suffice before geometric operations are necessary. |
| Optional graph counterexample (future) | A—B—C, only A informed. After one synchronous step B is informed; deleting B—C keeps C uninformed. Sequential order can produce a different result. | A useful model need not be resource accounting. Existing neighbor and edge operations can suffice without routing. |

Circular-economy comparisons also need a service requirement: for example, the same washing quantity, quality and deadline. Unmet service is not successful avoidance. Sharing, repair and material recycling retain different things; do not infer environmental benefit from an R label or one recycling score. Track energy, work, losses, lifetime and changed demand only where the selected question needs them.

No new public function is demonstrated as necessary by these briefs. A mechanism is a candidate for extraction only after contrasting cases require matching ownership, units, timing and failure behavior. Preserve the four-or-five-example expansion gate for any actual expansion.

## Documentation progression

Use one canonical executable source per lesson. Teach the existing budget first, then add measurement, alternative rules, a failure contrast and independent comparison. Grid/Graph are optional branches; a separate view comes after the headless behavior is understood. Reference pages retain exact contracts and link back to examples.

The three accepted scripts are preserved as reference tasks; they need not be rewritten into one large tutorial. Tutorials, task guides, concept explanations and API reference have different reader jobs. State delivered, partial or target status at each entry. New lessons need a runnable command, assumptions, expected output, a useful variation and the source revision. Design-only snippets must not look like installation instructions.

This is an information-architecture recommendation. No documentation website, visual theme, browser flow or accessibility acceptance is delivered here.

## Source context and limits

- [Mesa Getting Started](https://mesa.readthedocs.io/latest/getting_started.html), [activation](https://mesa.readthedocs.io/latest/tutorials/2_agent_activation.html), [time](https://mesa.readthedocs.io/latest/tutorials/3_event_scheduling.html), [data collection](https://mesa.readthedocs.io/latest/tutorials/5_collecting_data.html) and [best practices](https://mesa.readthedocs.io/latest/best-practices.html) informed the learning sequence and explicit activation. The inspected latest was labeled 4.0.0a0; its automatic registration and new clock architecture are not adopted.
- [PBL circular strategies](https://www.pbl.nl/en/publications/circular-economy-measuring-innovation-in-product-chains), [EMF technical cycle](https://www.ellenmacarthurfoundation.org/articles/the-technical-cycle-of-the-butterfly-diagram), [ODYM](https://doi.org/10.1111/jiec.12952) and [circular rebound](https://doi.org/10.1111/jiec.12545) informed the service, identity, material and comparison questions. These are our modeling deductions, not a shared API prescribed by those sources.

Historical source context, review scope and original checks are preserved byte-for-byte in the [review record](../../../models/catalog/acceptance/example-first/RESEARCH-INTEGRATION-REVIEW.md) and [verification record](../../../models/catalog/acceptance/example-first/RESEARCH-INTEGRATION-VERIFICATION.md). Their relative links and document hashes describe the original source tree, not current guide contents. Research is not scientific calibration or approval to change accepted expectations.
