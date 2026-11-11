# Naming conventions

Use a small vocabulary of clear domain nouns and precise verbs throughout City Library. The same concept has the same name in public APIs, implementation, models, examples, tests, UI and current documentation. Names describe what something means or does, without relying on its implementation history or another library.

This document owns system-wide naming rules and the canonical vocabulary. [Coding standards](CODING_STANDARDS.md) own code quality, [architecture](ARCHITECTURE.md) owns responsibility boundaries and the [time and domain semantics](agent-loom/terminology.md) explain the vocabulary's behavioral distinctions. Public references describe exact delivered and target signatures; a name here does not establish implementation availability.

## Status and migration

The English-language, casing, domain vocabulary, explicit units and capability-based documentation rules consolidate existing requirements. The verb families, type suffixes, collection/count patterns, PascalCase Svelte component filename rule and terminology refinements below complete those requirements for the naming migration. These conventions are accepted after independent review; repository-wide implementation and consumer verification determine conformance; a naming rule alone does not establish completion.

Migrate a public name together with its callers, exports, documentation and checks. Preserve behavior, identity, ordering, errors, random draws and accepted assertions. Record a public contract or serialized-format change explicitly. Do not retain a second alias API merely to preserve an old name. A frozen example's substantive API change needs its recorded naming decision; path changes also update integrity records without weakening assertions.

## Language and vocabulary

Write repository content, identifiers, UI labels and commits in English. Discussions may use German. Prefer an established domain word over an abbreviation or a generic infrastructure name. A resident or vehicle is more expressive than a generic agent when the model supplies that meaning. Preserve established scientific concepts and algorithm names.

Do not coin proper names for parts of the system; name a part after what it is or does. City Library names the project; its parts are named in the table below. "Agent Loom" was a working title for the core: current documentation says core, while historical records, frozen evidence and serialized identifiers keep the old name.

| System part | Term | Do not use |
| --- | --- | --- |
| The neutral headless foundation | core | Agent Loom, engine, framework |
| A domain capability built on the core, such as economy | city system | kit, plugin, mod (as an API concept), subsystem as a public concept; "subsystem folder" may describe the folder |
| An executable `model.ts` with its `ui.ts` | model | experiment as a type name |
| Code organisation | module | — |
| The browser host for models | Model Lab | Agent Lab |

Historical records and frozen evidence keep the earlier name "Agent Lab" and the path `ui/agent-lab/`, which now is `ui/model-lab/`.

| Meaning | Canonical name |
| --- | --- |
| Overall project and package | City Library; `city-library` |
| Parameterized series of model runs | study |
| One execution within a study | run |
| Model individual | `Agent`, agent |
| Membership and execution owner | `World`, world |
| Regular spatial topology | `Grid`, grid |
| Grid-owned member | `Field`, field |
| Rendered element or geometric cell dimensions | cell; `cells`, `cellSize` |
| Connection topology | `Graph`, graph |
| Existing object participating in a graph | node; no compulsory superclass |
| Graph-owned connection | `Edge`, edge |
| Explicit random stream | `Random`, random stream |
| Initial random input | seed; distinct from continuation state |
| One model procedure invocation | step |
| World-owned model time | tick; `world.tick.value` |
| Event queue and its distinct time cursor | `Agenda`, agenda time |
| Host scheduling callback | host callback; an animation frame is one kind |
| Initial model creation | setup |
| Detached model data | observation; returned by `read()` |
| Execution classification across member kinds | group |
| Numeric scientific color scale | indexed palette |
| Partial property update | changes |

Use network for scientific subject matter when appropriate; use Graph for the API structure. Biological cells remain cells. The `kind` discriminant describes structural category; group describes execution classification. species describes a biological distinction. Broad words such as simulation and experiment remain useful in prose, but do not introduce competing types for World, model or study. The study namespace is `studies`; model execution within a study uses `StudyModel` and operation choices use `StudyOptions`. These are migration targets, not claims about current exports.

| Do not use as a competing system name | Use instead |
| --- | --- |
| turtle, patch, link for domain members | agent, field, edge |
| environment or simulation for the membership owner | world |
| breed for general execution classification | group |
| experiment for model selection or the study API | model or study according to the task |
| opaque phase codes and source-project abbreviations | the actual capability |
| `numAgents` and other `num*` count keys | `agentCount` and the corresponding singular noun plus `Count` |

## Spelling and structure

| Element | Convention | Example |
| --- | --- | --- |
| Variables, properties, parameters, functions and methods | `camelCase` | `agentCount`, `read`, `addEdge` |
| Types, interfaces, classes and component symbols | `PascalCase` | `StudySpec`, `GraphView` |
| Ordinary modules, folders and model slugs | `kebab-case` | `indexed-palette.ts`, `traffic-basic` |
| Svelte component files | `PascalCase.svelte` | `GraphView.svelte` |
| Runtime tests | capability name plus `.test.ts` | `graph-connectivity.test.ts` |
| Compile-only checks | capability name plus `-types.ts` | `ui-authoring-types.ts` |
| Package scripts and CLI flags | lowercase kebab-case; script groups may use `:` | `contracts:quad-layouts`, `--quad-layouts` |
| Stable string discriminants | lowercase kebab-case | `fixed-priority` |
| CSS classes and custom properties owned here | kebab-case and semantic meaning | `model-controls`, `--text-muted` |

Use `Id`, `Url` and `Xml` inside compound identifiers: `agentId`, `sourceUrl`, `originalXml`. Preserve `UI` as an established public acronym exception, including `defineUI` and `UISpec`; do not migrate it to `Ui`. Standalone platform types and required external protocol spellings retain their actual names. Module-level constants may use `UPPER_SNAKE_CASE`; local values use descriptive camelCase. Do not rename existing module constants merely to change between these accepted spellings. Keep required tool entry filenames, `index.ts`, `model.ts`, `ui.ts` and established repository entry documents such as `README.md` and `AGENTS.md`.

Name files and directories after a capability or domain responsibility. Avoid opaque delivery-phase codes, source-project abbreviations, temporary review labels and names such as `new`, `next`, `old` or `legacy`. Use meaningful algorithm/variant names where behaviors differ. Do not add empty folders or rename scientific models merely to make their names generic.

## Repository structure

Use a few top-level folders named for their responsibility. Keep source directly inside its owning area; do not add a second `src/` layer, nested packages, tiers or a folder merely to hold one file. Create folders only for working content.

**Target structure (accepted 2026-11-11, not yet migrated).** The [accepted repository structure](evolution/structure.md) replaces the current folders below. No files have moved yet; current paths stay valid until the [migration order](evolution/structure.md#migration-order) renames them, and a target folder appears only with its first working slice.

| Target folder | Today | Responsibility |
| --- | --- | --- |
| `library-core/<module>/` | `library/<module>/` | Autonomous headless modules; no module imports another core module. Folder names match their public export; only folders without an API name of their own use descriptive names. |
| `library-core/world-composition/` | `library/world/`, `library/studies/` | The only aggregating folder: identity and lifecycle, supported state copying, World, activation, run/tick, grid occupancy and studies. |
| `library-city/<subsystem>/` | — | City systems, one subsystem folder each; each imports only `"city-library"`, never another city system. |
| `library-generative-design/` | — | Later; headless generative design, a separate track importing only `"city-library"`. |
| `models/<slug>/` | `models/<slug>/` | Flat; executable models, their UI descriptions and source and evidence records, each covering one small test case. |
| `ui-web/` | `ui/` | Shared presentation components, Model Lab and later game UI. |
| `ui-3d/` | — | Later; Three.js presentation using only public APIs. |
| `tests/` | `tests/` | Flat, plus `public-contracts/`, `ui/` and `targets/`; `import-boundaries.test.ts` and `duplicated-helpers.test.ts` check the structure. |
| `docs/` | `docs/` | Unchanged. |

Current folders:

| Folder | Responsibility |
| --- | --- |
| `library/` | Headless City Library modules, grouped by domain; the core lives here. |
| `models/` | Executable models, their UI descriptions and model-specific source and evidence records. |
| `ui/` | Shared presentation components and Model Lab. |
| `tests/` | Automated checks, public contract scripts and unmet target fixtures. |
| `docs/` | Guides, binding contracts and development evidence. |

Place a development tool with the area it supports: library build and declaration tools belong in `library/development/` (target: `library-core/development/`); test runners belong in `tests/`. Keep migration receipts and path mappings in `docs/development/`, preserving immutable evidence bytes. Do not collect unrelated tools and evidence under a top-level `scripts/` folder. Use an existing evidence folder before creating another one.

Keep the public package entry `index.ts` and required tool configuration at the root. Folder moves do not introduce package subpaths or rename public APIs. Update imports, build inputs, package contents, checks and current documentation together; map historical paths without rewriting frozen evidence.

This layout applies to the whole repository. The central [README](../README.md#repository-structure) shows the orientation tree; [architecture](ARCHITECTURE.md#binding-domain-layout-and-extension-rules) owns domain boundaries below `library/` and its target `library-core/`.

## Objects, collections and values

Use a singular noun for one object (`agent`) and a plural noun for a collection (`agents`). Discrete counts use `<singularNoun>Count`; other quantities name the measured quantity and unit, such as `totalDistanceMiles` or `populationSize`. Use `agentCount` for a count and `edgesPerNode` for a per-item quantity. Public `num*` input and observation keys migrate with their controls, serialization consumers and assertions; this is an explicit public-key change, not an internal variable cleanup. Name indexes and mappings for their lookup relationship when it helps: `agentsById`, `fieldIndex`. Avoid duplicating information already clear from a small local context.

Use positive boolean names that read as a statement: `isActive`, `hasCapacity`, `canMove`. Predicate functions use the same form. Domain attributes may use an established adjective, such as `directed`; do not add a prefix mechanically. Observation state adjectives such as `done`, `stopped` and `full` retain their state meaning; callable predicates use affirmative names such as `isComplete` or `isFull`. Catalog membership labels such as `selected-` may qualify a test area when they identify the binding selected-model set, rather than delivery order. Avoid negative flags and ambiguous boolean arguments.

Use `id` within its unambiguous owner and qualify references such as `agentId`. Identity, collection index and display label are different concepts. Include units where callers could confuse them (`durationMs`, `distanceMeters`); document abstract units explicitly. Do not imply that tick, step, frame or agenda time share a unit. Name meaningful thresholds, amounts, radii, angles and limits; equal literals with different meanings remain separate concepts.

## Operations

Use the universal, unopinionated verb. Each kind of operation has exactly one verb; small nuances between functions do not get their own verbs. The table is the canonical verb vocabulary (decided 2026-11-11).

| Kind of operation | Verb | Do not use | Rule |
| --- | --- | --- | --- |
| Construct | `create` | make, new*, build, free `createX` | `Name.create(options)` builds and never adds membership. |
| Insert into an owner or collection | `add` | put, insert, attach, register, admit, join, record, push (in the API) | Any membership change or append, including one that may wait. |
| Remove or empty | `delete` | remove, detach, clear, dispose, destroy | Removes one member; called with no argument on a container, it empties the container. |
| Take out and return | `take` | pop, dequeue, get | Removes the next item and returns it immediately. |
| Read state | `read` | observe, get, report, snapshot (as a verb) | Returns data without changing anything. "Observation" stays the data noun. |
| Write a value | `set` | update, assign, put | Replaces a value, such as `set` or `setCapacity`. |
| Ticket that may wait | `request` | acquire, get, put | Returns a ticket with a status. |
| Withdraw a ticket | `cancel` | cancelPut, cancelGet, abort | One verb for every ticket type. |
| End a grant | `release` | free, return | Only for granted resource units. |
| Wait for a condition | `wait` | await*, notify, listen | Only on `Signal`. |
| Act on members | `activate` | ask, report, forEach (in the API) | Runs a callback for each member and returns the results. |
| Filter members | `select` | find, query, filter, with, search | A predicate goes in, members come out. |
| Random draw | `sample` | pick, choose | Uses up draws from an explicit `Random`. |
| Move time | `advance` | step or tick as verbs | Only `tick` and `Agenda` advance. A model's `advance(stepCount)` runs steps; it is the delivered model contract. |
| Execute a model | `run` | start, play, simulate | `run` is the driver; `step` and `tick` stay nouns. |
| Start and restore | `setup`, `reset` | init, initialize | `setup` is the start procedure; `reset` is a defined restore. |
| Spatial change | `move`, `rotate` | place, setPosition, jump | Position is a property; movement is a verb. |
| Computed results | nouns | get*, find*, compute* | Such as `neighbors`, `distances` or `route`. |

Static factories migrate from `Type.add(...)` to `Type.create(...)`; instance `world.add(component)` retains its membership meaning. Representation boundaries keep `validate`/`parse` and `encode`/`decode`. A domain verb such as `diffuse` names only an operation that no kind above covers. Forbidden words remain usable as nouns and in prose that does not name an operation; native platform APIs keep their own spelling.

Keep public commands and their UI actions semantically aligned. Labels use short ordinary English, such as “Add agent” and “Run”; accessible names preserve the same action and subject. The Model Lab button label “Reload” means re-running `setup` with the current values; the model contract and API keep `setup`. Do not force getters, setters or wrappers around every property to satisfy a naming pattern.

## Types and state

Use a suffix only when it distinguishes a real role. Do not generate parallel types for every suffix.

| Name | Meaning |
| --- | --- |
| `Options` | Optional choices for a specific operation. |
| `Parameters` | Domain inputs to a model or study. |
| `Spec` | Declarative description interpreted or bound by an operation. |
| `State` | Explicit state with a documented owner and lifecycle. |
| `Snapshot` | Detached capture of declared state; no implied complete continuation. |
| `Observation` | Detached model output for inspection or measurement. |
| `Result` | Output of an operation when a more precise domain noun is unavailable. |
| `Data` | Plain transport or presentation representation, where that distinction matters. |

Avoid using Config and Options interchangeably. Prefer Options for operation choices and Spec for declarative descriptions; retain Config only where a separately defined persistent configuration role is necessary. Avoid automatic `I` interface prefixes, `Impl` suffixes and vague Manager/Helper/Utils containers. Types live with their semantic owner. Local `ModelAgent` and `ModelField` types are permitted when imported core types already use Agent and Field.

## Profiles, formats and source records

Name an algorithm variant or profile for its precise behavior, with a version only when that behavior needs versioning. Define seed handling, draw consumption, ordering and distributions before choosing a random profile name. Active profile names and discriminants must not use external brands, historical phase names, `legacy` or `compatibility` as their identity. Never disguise an unresolved contract with `standard` or `compatible`. Analyze the implementation and promised behavior before selecting the replacement; a familiar algorithm name alone may omit seed, distribution or ordering rules. A format identifier describes an actual representation; renaming it requires an explicit format migration.

Current product language, API names, examples and reader guides use the system's own vocabulary. Only dependency package names and import paths retain their required spellings. External protocol field spellings remain confined to explicit representation boundaries. Own profiles, discriminants, format identifiers, options and paths never use an external library or brand name; source identity lives only in dedicated source/evidence records. Required attribution, licenses, original source titles and URLs, raw fixtures, quotations and immutable verification records retain their accurate identities in dedicated source or evidence records. Do not falsify those records to make a text search empty. Keep source identity under `models/<slug>/source.*`, `models/<slug>/NOTICE.md`, catalog research/source records and explicit source-reference documents; keep recorded verification under model `evidence/` and Lab `acceptance/` records or a fixed-revision archive. These are evidence boundaries, not exemptions for current executable API names or ordinary reader prose. Preserve frozen artifact bytes and integrity hashes; migrate references or add explicit path or key mappings instead of rewriting recorded results. Current guides link to those records when needed and define behavior locally rather than through another library's documentation.

## Review checklist

- Does the name express one clear concept using the canonical vocabulary?
- Do its casing, number, verb and type role match its meaning?
- Can a reader understand the name without knowing a former project or delivery phase?
- Do API, model, UI, examples, tests and documentation use the same concept consistently?
- Are behavior, public contracts, format boundaries and required source records preserved or explicitly migrated?
