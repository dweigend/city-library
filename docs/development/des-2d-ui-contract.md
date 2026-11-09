# Flat spatial scene contract

Status: proposed example-first contract; no runtime acceptance is claimed. The five scripts in `examples/ui-des-scenes/` must be committed before these extensions are implemented. Existing UI calls, shapes, controls and default rendering remain supported by both hosts.

## Existing system and visual target

Use `defineUI(model, spec)` and the existing `type: "spatial"` view. Scenes are detached observation projections, not another model or renderer. The selected office, EV, goods, bus and elevator PNGs were opened and inspected. Their useful target is a flat charcoal scene with simple visible counts, slots and links. Their faux NetLogo menus/playback chrome, gradients and contradictory illustrative counts are not contracts. Actual model observations determine every count and state.

The current shared `--view-background` is already `#151515` in both light and dark modes; the legacy canvas uses the same default. No new background/theme API is needed. Scientific colors belong to one frozen public palette; application chrome keeps the existing tokens and components.

## Additive public data

```ts
export const scientificPalette: Readonly<{
  neutral: string; waiting: string; active: string;
  completed: string; unavailable: string;
}>;

interface SpatialAgent extends NetworkNode {
  readonly x: number; readonly y: number;
  readonly heading?: number;
  readonly shape?: "circle" | "triangle" | "rectangle" | "diamond";
  readonly extent?: { readonly width: number; readonly height: number };
  readonly filled?: boolean;
  readonly stroke?: string;
  readonly strokeWidth?: number;
}
interface SpatialLabel {
  readonly x: number; readonly y: number; readonly text: string;
}
interface SpatialData {
  readonly width: number; readonly height: number;
  readonly description?: string;
  readonly labels?: readonly SpatialLabel[];
  // Existing cells, segments, agents and showLabels remain unchanged.
}
```

The palette contains fixed central CSS colors: neutral `#e5e7eb`, waiting `#fbbf24`, active `#2dd4bf`, completed `#86efac`, unavailable `#9ca3af`. Authors import these names instead of defining experiment palettes. Color does not replace shape, status text or accessible descriptions. Existing CSS color strings remain accepted.

Coordinates use the existing centered rectangle: x increases right, y increases upward, visible bounds are `[-width/2,width/2] × [-height/2,height/2]`. In a diagram these are presentation coordinates, not physical World positions. Finite offscreen coordinates are clipped by the canvas; no implicit movement, topology or layout state is created.

Existing `size` retains CSS-pixel symbol diameter semantics. Without `extent`, new rectangle and diamond symbols use the same CSS-pixel size convention; rectangle is square and diamond has four axis vertices. `extent` is permitted only on rectangles and gives full width/height in diagram units, centered on x/y. Supplying both `size` and `extent` rejects. Heading retains clockwise screen rotation from an upward-facing triangle; rectangle picking applies the same rotation.

`filled` defaults to true. False omits fill and draws an outline using `stroke` or the view foreground. Explicit `stroke` also outlines filled shapes. Stroke width defaults to 1 CSS pixel, zero omits the outline, and never represents physical wall thickness. Shape dimensions must be finite and positive; stroke widths finite and nonnegative. Coordinates/headings must be finite. Unsupported shapes, malformed records, wrong primitive types and invalid field combinations throw TypeError; nonfinite/out-of-domain numbers throw RangeError before replacing the last valid canvas data. Existing inputs are not mutated.

Labels use fixed host typography and foreground, are centered at their diagram coordinates, and draw above shapes. They are presentation annotations, not selectable entities or simulation Agents. Text must be nonempty. Layer order remains cells, segments, agents in array order, labels, with selection/agent labels handled by the renderer. No arbitrary draw callback or per-model vector engine is added.

## Selection, access and lifetime

An extent rectangle is picked by its actual rotated bounds, not the old nearest-center two-unit tolerance. On overlap, the last drawn hit rectangle wins. New CSS rectangle/diamond icons likewise use their visible symbol bounds. Scenes containing only legacy circle/triangle symbols retain their original nearest-center behavior. Mixed diagrams with a new rectangle/diamond opt into visible-bounds reverse-painter-order picking, so passenger dots drawn over cabins remain selectable. A nearest legacy-symbol fallback remains outside any visible hit. Selection returns the original projected id. Static annotations do not enter keyboard selection. Arrow/Home/End selection retains the existing projected agent order.

`description`, when supplied, must be nonempty and becomes the accessible plain-text scene equivalent in both hosts. It states actual quantities and meaningful shape/status relationships. It replaces the legacy generic agent-count wording for that scene; scenes that omit it retain the old default wording. Canvas controls and keyboard instructions remain accessible. Ordinary monitors/tables may retain detailed values; the scene description adds no panel or duplicated state owner.

Reading/projection never advances tick/Agenda or Random. Imports are inert. Both hosts share the same validation and canvas renderer. The existing coalesced resize animation frame, disposal cancellation and stale-frame guards remain required. Replacing or disposing a scene cannot draw into a detached canvas or resurrect old observations.

## Five frozen author tasks

1. Civic residents and clerk outlines: public spatial projection preserves actual queue/service/completion counts and a single central palette.
2. Goods slots and blocked producers: diagram extents, immutable input observations and exact backpressure counts.
3. Floor/graph-style annotations and legacy defaults: labels are nonselectable, CSS sizes stay distinct from diagram extents, and descriptions preserve units/counts.
4. Browser validation through `defineUI`: invalid shapes, extents, dimensions, coordinates, stroke widths and descriptions report errors without silently coercing data.
5. Both-host rectangle picking and disposal: projected ids respect visible bounds, keyboard order remains deterministic, and dispose removes the canvas and its pending rendering work.

Headless assertions establish projected data and import contracts only. Exported `browserChecks` must also run against both real adapters; screenshot/state parity and independent image inspection remain separate acceptance gates.
