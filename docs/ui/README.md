# UI API specification

This is the binding authoring contract for City Library's shared UI layer. Read the [API table](api-table.md) for signatures and availability, then the [API reference](api-reference.md) for behavior and examples.

## Priorities

1. Readability comes first. An ordinary `ui.ts` reads as a flat description using normal typed TypeScript objects.
2. Defaults come first. The shared UI supplies controls, labels, layout, colors and lifecycle behavior wherever the contract defines a default.
3. Customization comes second. Add a local override only for a concrete need; keep model actions explicit and presentation separate from domain rules.

These priorities are normative for future UI work. They do not make a proposed operation available in an existing runtime.

## Status and authority

The table and reference define the repository UI contract. The Bun/legacy host and Svelte host are adapters for the same authoring API; private components and DOM structure are not extension points. The headless `city-library` package does not export UI code.

The readable-authoring slice is frozen in [five public examples](../../examples/ui-authoring/README.md), with [design feedback and responses](../development/authoring-review/design-responses.md). Its runtime and catalog migration are in progress. Source availability, passing examples, browser checks and independent acceptance are tracked separately in [PLAN](../../PLAN.md). Historical branch baselines do not describe today's feature availability.

The [design rules](../DESIGN.md) and [Agent Loom terminology](../agent-loom/terminology.md) remain binding. The UI owns presentation and host scheduling; models own domain state, validation and model time. [System architecture](../ARCHITECTURE.md) owns domain boundaries and state ownership. Internal Svelte components, renderer options and private DOM structures are not an experiment-author API.

When documentation and implementation differ, record the gap and fix the implementation against the accepted contract. Do not silently change examples or claim a target is delivered. New runtime slices follow the [example-first delivery gate](../../PLAN.md#example-first-delivery-gate), including four or five asserted public scripts before implementation, relevant type/behavior checks and real-browser acceptance for affected flows. API changes require an explicit design decision; substantive changes to accepted example syntax require user agreement.

## Related documentation

- [Agent Lab usage](../../ui/agent-lab/README.md): running the application and adding an entry.
- [Refactor assignment](../development/agent-lab-refactor.md): application boundaries and discovery.
- [Agent Loom specification](../agent-loom/README.md): headless domain API, a separate contract.

The UI specification was commissioned on 6 November 2026 alongside terminology normalization, catalog development, the Svelte migration and the `ui.ts` readability discussion. Proposed syntax is identified separately from source-confirmed behavior. Independent review findings and responses are recorded separately from delivery evidence.

## Verification and independent review

The original documentation review was blocked by provider quota. Later Gemini 3.8 Flash high and Astra high reviews supplied concrete authoring-contract feedback; their scope and responses are recorded in the linked review documents. They do not establish runtime or visual approval. Current implementation checks, browser screenshots and remaining tasks belong to PLAN and the slice evidence.
