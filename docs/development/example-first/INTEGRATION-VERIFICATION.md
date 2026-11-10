# Cross-domain integration verification

Date: 8 November 2026. Baseline: City Library example-first checkpoint cf9baea. This addition implements two client-model probes and plan refinements, not library runtime APIs.

## Scope and provenance

Subagents wrote the scarce-unit/shared-machine scripts and integrated architecture/Mesa/circularity lessons into the existing PLAN and example README. The coordinator wired the scripts into existing runners and strict typecheck gates. The original three scripts and SCRIPT-SHA256SUMS remain unchanged. There is no new resource, scheduler, reservation or transaction API.

Research owners are city_game docs/GLOBAL-ARCHITECTURE-BRAINSTORM.md and docs/MESA-DESIGN-RESEARCH.md. A concurrent docs/model-research-integration branch has overlapping documentation drafts; it is preserved, not silently adopted or overwritten. Reconcile its documentation semantically before later integration. The source research's desk scenarios are distinct from the executions recorded here.

## Executed checks

- Both new scripts directly executed by their author with public city-library imports: passed.
- bun run contracts:city on the final two script versions: passed, now covering four delivered-API examples. Scarce unit changes winner under reversed priority without increasing total supply; stale selection is rejected without mutation before explicit reselection.
- Shared machine: reservation stock 2 / available 1; start stock 1 / consumed 1; failure at hour 1 yields no completed service and no refund; repair-first at hour 2 permits B, request-first rejects without hidden retry; final hour 3 stock 0 / consumed 2 / one completed service. Machine identity remains canonical, cancelled unstarted work restores availability, repeated observations and independent interleaved models preserve state.
- bun run typecheck:city: passed on final new scripts.
- bun run typecheck: passed with Svelte diagnostics 0 errors/0 warnings; script-only changes were separately rechecked by the focused command after the last readability edits.
- Original three script checksums: passed.
- bun run contracts:city:targets: exit 1 at the unchanged missing corridor export after all four ready scripts run; no skip or expected-error success.
- bun run typecheck:city:targets: exit 1 at the original missing APIs and derivative inference errors. No fake declarations or any casts.
- Complete registered bun run contracts: passed (exit 0); console preserved in [integration-examples-console.txt](integration-examples-console.txt). Final new-script runs after the last readability edits are separate passing evidence above.

Fresh independent Gemini 4 Argon review [approved this checkpoint](INTEGRATION-REVIEW.md) with no blockers; [coordinator response](INTEGRATION-RESPONSE.md) records the completed administrative items. No library src/index change, build, consumer or browser interaction is claimed. Explicit clock advances prescribe scenario hours; the machine model does not implement an automatic scheduler, failure distribution or general service-duration constraint. No environmental superiority or physical performance is established by these traces.

## Integrity and follow-up

Verify the untouched original contract manifest and the separate new probe manifest from the repository root:

```sh
sha256sum -c docs/development/example-first/SCRIPT-SHA256SUMS
sha256sum -c docs/development/example-first/INTEGRATION-SCRIPT-SHA256SUMS
```

Independent review and coordinator responses are linked above; their approval is limited to this client-model/plan checkpoint. The new probes exercise composition using existing exports; they are not a substitute for the four/five-public-example gate for any later library extension.
