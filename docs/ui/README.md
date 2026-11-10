# UI API specification

A UI declaration connects a headless model to controls and views. The model keeps its state and rules; the shared host handles layout, playback and rendering. This specification defines that boundary. Read the [API table](api-table.md) for signatures and availability, then the [API reference](api-reference.md) for behavior and examples.

Apply the shared [coding standards](../CODING_STANDARDS.md); model and UI scripts are readable reference examples.

## Priorities

1. Readability comes first. An ordinary `ui.ts` reads as a flat description using normal typed TypeScript objects.
2. Defaults come first. The shared UI supplies controls, labels, layout, colors and lifecycle behavior wherever the contract defines a default.
3. Customization comes second. Add a local override only for a concrete need; keep model actions explicit and presentation separate from domain rules.

Check the API table before relying on a proposed operation. These priorities also govern future UI work.

## Using the contract

The Svelte UI implements the shared authoring API. Start with the [five authoring examples](../../tests/ui/ui-authoring/README.md), then the [formatter and observation examples](../../tests/ui/ui-composition/README.md). Keyed live controls, explicit common change actions, flat grouping, monitor formatters, categorical/labelled charts, collection diagrams and complete table paging use the same Svelte implementation. `ui/svelte/index.ts` is an import-compatibility alias for `ui/index.ts`, not another host. Browser checks and their limits are recorded in the [UI acceptance record](../../ui/agent-lab/acceptance/README.md).

Use `Observation<typeof model>` for named projections. Annotate scalar formatter parameters when you need their concrete type; automatic scalar-specific inference for unannotated formatters is not promised. Namespace projected entity IDs when different kinds share a source ID. The [reference](api-reference.md) explains these rules in detail.

Models own domain state, validation and model time; the UI owns presentation and host scheduling. Internal components and DOM structure are not extension points. The headless package does not export UI code. [Architecture](../ARCHITECTURE.md), [design](../DESIGN.md) and [terminology](../agent-loom/terminology.md) define the shared boundaries; [PLAN](../../PLAN.md) records remaining acceptance work.

Record documentation/implementation gaps and fix the implementation against the accepted contract. Do not silently change examples or claim a target is delivered. New runtime slices follow the [example-first delivery gate](../../PLAN.md#example-first-delivery-gate), including four or five asserted public scripts before implementation, relevant type/behavior checks and real-browser acceptance for affected flows. API changes require an explicit design decision; substantive changes to accepted example syntax require user agreement.

## Binding UI contracts

These contracts define shared UI behavior in detail:

- [UI authoring contract](../development/ui-authoring-contract.md) and [UI authoring decisions](../development/universal-ui-decisions.md): setup controls, live actions, groups, monitors and charts in one flat `defineUI(model, spec)` description.
- [Directed networks and repeated actions](../development/network-ui-contract.md) and the [network visualization decision](../decisions/network-visualization.md).
- [Spatial traces](../development/spatial-segment-contract.md), [observed numeric colors](../development/indexed-palette-ui-contract.md), [grid drawing and color controls](../development/grid-interaction-contract.md) and [urban presentation controls](../development/urban-ui-contract.md).

## Related documentation

- [Agent Lab](../../ui/agent-lab/README.md): run the application and add an entry.
- [Write a model](../development/model-authoring.md): connect headless behavior to observations and actions.
- [Agent Loom](../agent-loom/README.md): the headless domain contract.
