# Coding standards

These rules apply to library code, model scripts, UI, examples and tests. Use Minimum Sufficient Architecture: the smallest understandable design that fully solves the actual problem. Follow the [architecture and domain boundaries](ARCHITECTURE.md), [public specification](agent-loom/README.md), [UI contract](ui/README.md) and [delivery gates](../PLAN.md) alongside these standards.

## Priorities

Preserve correctness and accepted public contracts first. Then improve clarity, simplicity, modularity, maintainability and reuse, in that order. Each change needs a concrete benefit. Fewer lines are useful only when behavior and understanding survive. Prefer local corrections over rewrites, composition over inheritance and concrete solutions over speculative abstractions. Layers describe responsibilities; they do not require extra directories or wrappers.

## Readable code

- Follow the system-wide [naming conventions](NAMING_CONVENTIONS.md) for identifiers, files, operations and canonical vocabulary.
- Give functions one clear task and files one cohesive responsibility. About 20 lines per function and 200 per file are review signals, not limits. Keep related logic together; do not fragment code to meet a count.
- Keep abstraction levels consistent. Handle exceptional cases with guard clauses where clearer. Prefer positive, simple conditions and explicit control flow; avoid nested ternaries and clever one-liners.
- Avoid ambiguous boolean parameters. Use named options or domain types when they clarify intent. Keep signatures small; group related parameters when useful.
- Name meaningful numeric and string literals: thresholds, amounts, radii, angles, units, limits and compatibility choices. Obvious zero/one values and defaults already explained by named descriptor fields need no artificial constants. Equal values with different meanings are separate concepts. Derive related values only when their relationship is part of the contract. Document source-specific values and units where needed.
- Remove unused code, imports, variables and commented-out alternatives. Comments explain reasons, assumptions, invariants, units and compatibility decisions, rather than narrating obvious code.

## Types and contracts

Use strict TypeScript. Treat untrusted data as unknown rather than any. Make public parameter and result contracts explicit and precise; use inference for obvious internal types. Prefer narrow unions and discriminated states, handle variants exhaustively and model nullability deliberately. Type assertions and non-null assertions need a demonstrable invariant; prefer narrowing when practical.

Validate external inputs at boundaries. Avoid repeated internal validation of already established guarantees, while preserving public validation and error contracts. Document meaningful inputs, outputs, units, defaults, bounds, ordering, mutations, errors and ownership. Distinguish detached snapshots from live references.

## State and dependencies

Give each domain fact one owner. Derive values instead of storing redundant state. Avoid unnecessary mutation; local mutation and state-owning simulation kernels remain valid when clear and encapsulated. Calculations should be pure where practical. Make state changes, I/O, logging, async ordering and failures explicit; do not hide dependencies in globals or service locators or silently suppress errors.

Prefer functions. Use classes for real identity, encapsulated state or lifecycle needs; preserve existing accepted methods and authoring contracts. Separate UI, domain logic, orchestration and I/O according to the [architecture](ARCHITECTURE.md#layers-and-implementation-boundaries). Public domain capabilities must be usable headlessly; private implementation helpers need not become exports. UI changes model state only through defined actions.

Keep domain kernels, algorithms and variants distinct. Put types with their semantic owner. Avoid catch-all utils/helpers/manager modules, universal registries, unnecessary factories/interfaces and speculative configuration. Abstract only when it reduces concrete duplication of domain logic, complexity or coupling. Similar code alone does not justify generalization. Consider existing capabilities before adding code or dependencies; optimize after measurement.

## Model scripts as examples

Every model.ts and ui.ts is also an example of good code. Readers should understand its purpose and normal flow from the code itself, without a separate explanation. Favor familiar TypeScript, descriptive names, visible data flow and a coherent reading order over terseness or generic machinery.

Keep model parameters, setup, named scientific rules, execution and observations easy to find. Keep each model's mechanism visible; extract a helper when its name explains a meaningful operation, not merely to hide lines. Use one ordinary authoring syntax. Keep ui.ts a flat presentation description with useful defaults, short projections inline and longer named functions below the description. Domain measurements belong in the model; UI may format them. Do not introduce a new DSL, wrapper or API to make a script look simpler. Preserve accepted syntax and source provenance.

## Refactoring and verification

1. Read the relevant contracts, code, imports, tests and examples. Check Git status and preserve concurrent changes.
2. Diagnose concrete problems; distinguish behavior defects and readability problems from stylistic preferences. For each proposed change identify its benefit, affected modules and risk.
3. Make small, independently reviewable changes. Preserve public calls, errors, mutations, canonical identity, iteration/activation order, tick/step semantics and RNG draw order/continuation. Do not weaken accepted examples to fit an implementation.
4. Run bun run typecheck for TypeScript changes and relevant behavior checks. Use public examples and consumer checks for affected library contracts; bun run check supplies the current full type/test/example/build/consumer chain. Add focused regression coverage for meaningful unprotected contracts, not tests of private layout.
5. Verify affected browser flows in a real browser. For visual changes inspect relevant viewport screenshots; for interaction changes exercise the flow and resulting state. Report concrete blockers and unexecuted checks.
6. Report what changed, why it is clearer, checks actually executed and remaining risks. Passing author checks is separate from independent review.

The example-first gate requires four or five asserted public scripts per API expansion phase, not new scripts for every internal refactor. Existing coordination and independent-review requirements in AGENTS.md and PLAN remain in force. Documentation-only edits do not establish runtime or browser acceptance.

Use the existing Bun and test workflow. Biome is the intended lint/format tool but is not configured in this checkout yet; its adoption is separate work. Do not claim a Biome check until installed and executed, add a competing toolchain or include repository-wide formatting in a local refactor.

## Done

A refactor preserves behavior and contracts, passes relevant checks, makes responsibilities and dependencies easier to understand and reduces concrete complexity without unnecessary abstractions or dependencies. Size and style guidelines support judgment; clarity takes priority over mechanical compliance.
