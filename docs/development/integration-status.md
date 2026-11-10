# Integration status

Snapshot: 10 November 2026. Baseline `origin/main` = `64931bd9378e896411e1db625591fca33a44c898` after merged PRs #65 and #64. All 16 open GitHub issues are listed below. This is coordination evidence, not new runtime or scientific acceptance. No issue was closed.

Owners: M = exclusive model/visualization thread `790dbcd4-6c0d-439a-9672-12d3d32607f2`; O = observation thread `9a6bd2ea-1e40-4fe6-97d2-3aa0a72f4708`. Unassigned means no current implementation assignment established.

## Open issues

Every row retains the full acceptance criteria in its linked issue. All runtime expansions require frozen public examples, applicable checks, provenance and independent acceptance.

| Issue | Evidence / remaining gap | Dependency / next gate | Owner |
| --- | --- | --- | --- |
| [#1](https://github.com/dweigend/city-library/issues/1) Complete the fixed 200-model catalog and per-model acceptance | Partial catalog; 75 implementations and 199 final acceptances remain | #52–55, #19 | M |
| [#19](https://github.com/dweigend/city-library/issues/19) Deliver selected NW and GIS examples with explicit host and public API contracts | Graph/planar primitives delivered; NW/GIS models, codecs and host contracts missing | #32, #52; original-host failures | M |
| [#32](https://github.com/dweigend/city-library/issues/32) Reconcile acceptance evidence for delivered planar containment and bounds | Runtime delivered; exact planar guarantees and independent acceptance need mapping | #52 | Unassigned |
| [#38](https://github.com/dweigend/city-library/issues/38) E1: deliver street corridors and block extraction from frozen public examples | Corridor/subtraction remain target prerequisites | Freeze E1 contracts first | Unassigned |
| [#39](https://github.com/dweigend/city-library/issues/39) E2: implement bounded OBB subdivision and fulfill the quarter target | OBB subdivision and quarter remain targets | #38 | Unassigned |
| [#40](https://github.com/dweigend/city-library/issues/40) Docs: build a model-first learning path from the accepted city scripts | PR64 merged; rain-barrel tutorial and network guide exist, full budget learning path unproven | Criterion audit after PR64 | Unassigned |
| [#42](https://github.com/dweigend/city-library/issues/42) Research models: compare reuse, repair and recycling at equal service | Exploratory equal-service contrasts remain open | #41 delivered; model owner coordination | M |
| [#43](https://github.com/dweigend/city-library/issues/43) Track example-first City Library evolution, accepted contracts and research decisions | Coordination index; #41 and foundations integrated | Child issues #38–47 | O |
| [#44](https://github.com/dweigend/city-library/issues/44) E4: define frontage, nonconforming topology and explicit Grid state composition | Frontage/topology/state-transfer contracts remain open | #38, #39 | Unassigned |
| [#45](https://github.com/dweigend/city-library/issues/45) E5–E6 research: select parcel methods and preserve Townscaper scope boundaries | Research retained; bounded method decisions remain open | Source access and method selection | Unassigned |
| [#46](https://github.com/dweigend/city-library/issues/46) Design: clarify core, model, UI and mod extension boundaries | Architecture exists; extension story and dual-view probe unaccepted | Coordinate UI/model owner | Unassigned |
| [#47](https://github.com/dweigend/city-library/issues/47) Research models: connect production, energy, transport and feedback through shared primitives | Coupled production/energy/logistics probes remain open | #41/#42 contrasts; model owner | M |
| [#52](https://github.com/dweigend/city-library/issues/52) Reconcile operation-level API coverage with current public exports | Public APIs exist; complete operation-to-evidence reconciliation missing | Canonical operation count and actual exports | Unassigned |
| [#53](https://github.com/dweigend/city-library/issues/53) Complete shared Svelte UI behavior and accessibility acceptance | Shared UI exists; complete interaction/accessibility acceptance pending | Model/UI work in progress | M |
| [#54](https://github.com/dweigend/city-library/issues/54) Reconcile acceptance evidence for implemented selected models | Implemented models on main; remaining scientific evidence/approval missing | #52; reconcile before rerunning | M |
| [#55](https://github.com/dweigend/city-library/issues/55) Deliver Giant Component against the frozen public target scripts | Four frozen Giant targets exist; implementation not delivered | Source/API reconciliation | M |

## Worktrees

Read-only comparison: behind/ahead counts are `origin/main...HEAD`; zero ahead does not include dirty work. No cleanup is authorized.

| Branch | Behind / ahead | Working tree |
| --- | --- | --- |
| `main` | 6 / 0 | Clean |
| `docs/integration-status-ledger` | 0 / 0 | Clean |
| `t3/status-update` | 6 / 0 | Clean |
| `t3/review-models-and-names` | 8 / 0 | 258 changed paths; preserve owner work |
| `t3/tailscale-remote-server` | 10 / 0 | 2 changed paths; preserve owner work |
| `t3/documentation-review-standards` | 1 / 0 | Clean |
| `t3/remove-scripts-folder` | 4 / 0 | Clean |
| `t3/integrate-worktrees-issues` | 6 / 0 | Clean |

The tailscale worktree has no unique committed payload. Its uncommitted `ui/compose.ts` and `ui/svelte/Workbench.svelte` changes need owner attribution and overlap review before any delivery; branch naming does not establish remote-server implementation. No foreign files were modified.

## Documentation issue #40 after PR64

PR64 supplies a first-model rain-barrel tutorial, concepts and an updated network authoring guide. That is useful delivery, but it does not establish the requested household-budget sequence. Still map each criterion to canonical runnable sources: balance observations, rule/order variation, failures/nonrollback behavior, independent instances, optional Graph/Grid and separate view; verify open-flow budget, equal-capacity heat and quarter geometry limits, source revisions, links and commands. Do not close #40 based on the merge alone.

## Next independent packages

- #52: update the existing operation coverage inventory, including count reconciliation and exact public symbols/examples/checks; avoid model edits. Then scope #32 evidence reconciliation against that mapping.
- #40: audit the post-PR64 documentation criterion by criterion; fill only demonstrated learning-path gaps without rewriting contracts.
- #38: resolve and freeze the bounded corridor/subtraction examples and reuse decision; #39 follows, then #44. #45 research can proceed independently.
- #46: document one bounded extension story against existing architecture, coordinating any dual-view work with M.
- Keep #1/#19/#42/#47/#53/#54/#55 with M; ask that owner for remaining acceptance evidence and delivery, without duplicate model or visualization work.
- Ask the tailscale owner to identify the two dirty UI changes; do not clean or transplant them.

## Verification limits

Executed: fetch, GitHub open-issue enumeration, PR64 merge-state lookup, open-PR enumeration (none), all eight worktree ancestry/status inspections and source-document inspection. Runtime, browser and scientific acceptance were not rerun for this Markdown inventory. Existing issue/checkpoint counts are recorded evidence, not newly executed model tests.
