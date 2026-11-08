# UI API specification

A UI declaration connects a headless model to controls and views. The model keeps its state and rules; the shared host handles layout, playback and rendering. This specification defines that boundary. Read the [API table](api-table.md) for signatures and availability, then the [API reference](api-reference.md) for behavior and examples.

Apply the shared [coding standards](../CODING_STANDARDS.md); model and UI scripts are readable reference examples.

## Priorities

1. Readability comes first. An ordinary `ui.ts` reads as a flat description using normal typed TypeScript objects.
2. Defaults come first. The shared UI supplies controls, labels, layout, colors and lifecycle behavior wherever the contract defines a default.
3. Customization comes second. Add a local override only for a concrete need; keep model actions explicit and presentation separate from domain rules.

Check the API table before relying on a proposed operation. These priorities also govern future UI work.

## Using the contract

The Bun/legacy and Svelte hosts adapt the same authoring API. Start with the [five authoring examples](../../examples/ui-authoring/README.md), then the [formatter and observation examples](../../examples/ui-authoring-next/README.md). Keyed live controls, flat grouping, monitor formatters and categorical/labelled charts are implemented in both hosts.

Use `Observation<typeof model>` for named projections. Annotate scalar formatter parameters when you need their concrete type; automatic scalar-specific inference for unannotated formatters is not promised. Namespace projected entity IDs when different kinds share a source ID. The [reference](api-reference.md) explains these rules in detail.

Models own domain state, validation and model time; the UI owns presentation and host scheduling. Internal components and DOM structure are not extension points. The headless package does not export UI code. [Architecture](../ARCHITECTURE.md), [design](../DESIGN.md) and [terminology](../agent-loom/terminology.md) define the shared boundaries; [PLAN](../../PLAN.md) records remaining acceptance work.

Record documentation/implementation gaps and fix the implementation against the accepted contract. Do not silently change examples or claim a target is delivered. New runtime slices follow the [example-first delivery gate](../../PLAN.md#example-first-delivery-gate), including four or five asserted public scripts before implementation, relevant type/behavior checks and real-browser acceptance for affected flows. API changes require an explicit design decision; substantive changes to accepted example syntax require user agreement.

## Related documentation

- [Agent Lab](../../ui/agent-lab/README.md): run the application and add an entry.
- [Write a model](../development/model-authoring.md): connect headless behavior to observations and actions.
- [Agent Loom](../agent-loom/README.md): the headless domain contract.
