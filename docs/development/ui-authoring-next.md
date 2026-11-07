# Readable observations, formatter types and selection identity

Status: pre-runtime public examples, corrected after independent Argon contract review. The coordinator must commit the freeze before implementation; the public spelling uses explicit scalar formatter annotations. This is an extension of the delivered authoring contract, not a rewrite of its historical freeze.

## Scope

Authors should be able to move a longer projection below `defineUI` without spelling nested `ReturnType` expressions. `Observation<typeof model>` names the existing detached result of `model.create(...).read()`. Both public UI entrypoints export the same type; the helper has no runtime, allocation or state owner.

Monitor getters retain numeric or textual scientific values. A formatter changes display text only. The new phase checks compatibility between each getter and its formatter; it must reject string-only formatters for numeric getters, numeric-only formatters for text getters and numeric-only formatters for genuine unions. Numeric and text formatters annotate their scalar argument, for example `format: (value: number) => value.toFixed(3)`. The getter retains its concrete inferred observation type. Unannotated formatters retain the compatibility `string | number` context and narrow when needed. Direct inference across a context-sensitive heterogeneous monitor array was investigated but is not promised by this phase. This small annotation avoids a new nested builder, a public `any` or an unchecked callback cast.

Selection keeps `string | null`. Within one mounted entry a projected ID identifies exactly one inspected/actionable entity, consistently across views. When source kinds use overlapping IDs, authors prefix projected IDs, for example `agent:${id}` and `cell:${id}`. Multiple views of the same entity reuse the same projected ID; unrelated entities cannot. Inspectors and actions resolve IDs against the current observation, including missing/stale IDs. Restart clears selection. This is presentation identity, not a second domain ID allocator or a reason to rewrite model IDs.

The collision example wraps the real Wealth model's observation only: it gives the sampled cell the sampled person's source ID and presents both at tick zero. Namespaces distinguish them; after a real step both leave this sampled projection, so their previous selection becomes stale. The underlying Wealth lifecycle, rules, parameters and RNG remain canonical.

Named color projections must preserve numerical channels exactly. Presentation refactors must not change trajectories, units, displayed precision, random draws or canonical scientific reporters. Remove literal assertions only where real contextual inference supports the same type.

## Five acceptance tasks

1. Numeric, textual and union-valued monitors through direct public `defineUI`; real Voting steps update formatted text.
2. Public observation types from both entrypoints, named Wealth projections, unchanged color anchors and class totals.
3. Equal source IDs across person/cell projections, namespaced inspection, selection-dependent explicit model actions, stale selection and restart across two views.
4. Formatter failure, pending setup edits and successful restart recovery through existing host error boundaries.
5. Independent mounted models, compatibility `UISpec`/live arrays and disposed callback isolation.

Each task is an asserted public script with separate exported actual-browser checks. The normal Bun script run does not execute browser checks. Compile-only negative contracts test incompatible formatters and preserve concrete observation/selection types. No historical accepted example is changed.

## Independent contract review response

Argon approved the architecture and raised four pre-freeze acceptance gaps. The examples now submit through the existing setup button regardless of host label, verify a shared field ID across both views, observe the disposed instance itself after a stale click, and place negative compiler directives on single-line calls. A browser harness and positive instance-observation type case were added. These strengthen the new unfrozen examples; historical accepted examples are unchanged. Source contract approval is not runtime or browser approval.
