# B02 readability completion and post-format verification

This follow-up contains formatting only for the ten owned model.ts files. Code commit `c8700ec2566811172deb50f27de8f7da72fcf33e` follows the parent's already integrated `eaa698aca573b0c47b3b0e93b56acee6a646decd`. No UI, source XML, public example, rule, procedure name, state ownership, string value, core/shared/global file or dependency change is included. There are no model-specific helper files in these ten folders. This is implementation/readability completion, not independent review or a new acceptance/count decision.

## Equivalence and executed checks

Prettier3.6.2 from the existing local cache applies conventional multiline TypeScript,2-space indentation and88-column formatting. It normalizes whitespace, quote style, optional trailing commas and expression wrapping. TypeScript5.9.3 from the existing cache parses both the exact pre-format Git bytes and the formatted files. All ten normalized ASTs match, retaining ordered node kinds/flags, identifiers, literal values, operators and type-only/export-equals attributes. Only source positions/trivia/comments, SourceFile's full raw text, parenthesized expression/type wrappers and multiline/trailing-comma metadata are excluded. The formatter is idempotent for all ten. No names, rules or public syntax contracts were changed; all five frozen example files remain byte-identical.

[Equivalence records](selected-social-format-evidence/equivalence.json) pin before/after model hashes and normalized AST hashes. [Formatter recipe](selected-social-format.ts) uses only the already cached tools; no install or project configuration mutation occurred. The project's pinned TypeScript7 package has no JS compiler API, so the separate cached5.9 parser is only an audit tool; all actual project types use the pinned workflow. During verifier preparation, including SourceFile.text caused an expected raw-text mismatch; that nonsemantic field was excluded before any source file was written. No model failure was hidden by that correction.

Executed after formatting:

- `bun run typecheck`: all four TypeScript projects passed; [log](selected-social-format-evidence/typecheck.log).
- Focused suite:23 tests,4521 assertions,0 failures; [log](selected-social-format-evidence/focused-tests.log).
- All five frozen scripts passed; [execution](selected-social-format-evidence/frozen-examples.log) and [unchanged hashes](selected-social-format-evidence/frozen-hashes.log).
- `bun run build`: library JS and declaration build passed; [log](selected-social-format-evidence/build.log).
- `python docs/development/selected-social-format-verify.py`: AST/model/source/frozen/browser/PNG/ownership and historical hash reconciliation passed. [Verifier](selected-social-format-verify.py).

The parent is running integrated checks. No duplicate full integrated run, native baseline refresh, theme sweep or independent review is claimed by this follow-up.

## Fresh final build and browser evidence

The old own3112 server was stopped, then the formatted checkout was built by a new own3112 server. The root server in the parent checkout was left untouched. Actual T3 server Chromium156/Linux loaded every model from this fresh build using a unique navigation query. Each actual loaded ui.sourceMarker matches the unchanged original XML SHA. Every source.nlogox is byte-identical to the pre-format Git revision and pinned source manifest; no original session was rerun or relabelled as fresh native evidence.

For every model, actual host Setup initialized tick0, and an actual1-step button click reached tick1. Rendered monitors, setup parameters, error/rejection hooks, raster readback and actual loaded model/shared chunk bytes and build version are retained per model below. A separate instance of the loaded public headless definition confirmed the same tick accounting; it is not presented as the mounted UI instance. All20 retained desktop/light Setup/step PNGs were visually inspected at current code, with no new issue found. CSS viewport1440x1100; T3 reduced PNG1280x978. getImageData readback before capture remains a raster workaround, not a renderer fix.

Every model/shared chunk was freshly fetched and SHA-256 computed from actual served bytes after the fresh build. Five model chunks remain byte-identical because Bun normalizes their formatting; five have new bytes/hashes. No artificial code edit was made to force a different hash. Full source/model/actual chunk hashes and build versions: [current chunks](selected-social-format-evidence/current-chunks.json). Current source/core/shared renderer checksums: [runtime hashes](selected-social-format-evidence/runtime-SHA256SUMS).

| Model | Current chunk SHA-256 prefix | Relation to pre-format chunk | Current-code evidence | Setup / step PNGs |
| --- | --- | --- | --- | --- |
| consumer-choice | `7dd0130cd40e517f` | byte-identical | [record](selected-social-format-evidence/consumer-choice.json) | [Setup](selected-social-format-evidence/consumer-choice-setup.png) / [step](selected-social-format-evidence/consumer-choice-step.png) |
| rebellion | `e2bac16e1e03353b` | byte-identical | [record](selected-social-format-evidence/rebellion.json) | [Setup](selected-social-format-evidence/rebellion-setup.png) / [step](selected-social-format-evidence/rebellion-step.png) |
| language-change | `8077896a0f1ae102` | byte-identical | [record](selected-social-format-evidence/language-change.json) | [Setup](selected-social-format-evidence/language-change-setup.png) / [step](selected-social-format-evidence/language-change-step.png) |
| party | `3c9bca0eefd3aafe` | byte-identical | [record](selected-social-format-evidence/party.json) | [Setup](selected-social-format-evidence/party-setup.png) / [step](selected-social-format-evidence/party-step.png) |
| ethnocentrism | `365cae33a572c860` | byte-identical | [record](selected-social-format-evidence/ethnocentrism.json) | [Setup](selected-social-format-evidence/ethnocentrism-setup.png) / [step](selected-social-format-evidence/ethnocentrism-step.png) |
| minority-game | `fa52cb254fbe1e5c` | new bytes | [record](selected-social-format-evidence/minority-game.json) | [Setup](selected-social-format-evidence/minority-game-setup.png) / [step](selected-social-format-evidence/minority-game-step.png) |
| rumor-mill | `710c31c2bd21f4d7` | new bytes | [record](selected-social-format-evidence/rumor-mill.json) | [Setup](selected-social-format-evidence/rumor-mill-setup.png) / [step](selected-social-format-evidence/rumor-mill-step.png) |
| signaling-game | `a337df7445a42913` | new bytes | [record](selected-social-format-evidence/signaling-game.json) | [Setup](selected-social-format-evidence/signaling-game-setup.png) / [step](selected-social-format-evidence/signaling-game-step.png) |
| piaget-vygotsky-game | `122556d9525b7a76` | new bytes | [record](selected-social-format-evidence/piaget-vygotsky-game.json) | [Setup](selected-social-format-evidence/piaget-vygotsky-game-setup.png) / [step](selected-social-format-evidence/piaget-vygotsky-game-step.png) |
| heroes-and-cowards | `cd1bf13376684e5e` | new bytes | [record](selected-social-format-evidence/heroes-and-cowards.json) | [Setup](selected-social-format-evidence/heroes-and-cowards-setup.png) / [step](selected-social-format-evidence/heroes-and-cowards-step.png) |

## Historical evidence and handoff limits

The complete original/target interactions, native procedures, interventions, run/pause/reset, terminal checks, desktop/mobile and light/dark records in selected-social-evidence remain explicitly **pre-format evidence at eaa698a and the exact per-model hashes recorded there**. Those70 PNGs and their data/manifests were not overwritten or relabelled. In particular, selected-social-evidence/runtime-SHA256SUMS and final-served-chunks.json are historical manifests; verify their runtime paths against pre-format Git bytes, not the newly formatted working tree. The new verifier performs that historical Git reconciliation. The new current-code20-image/Setup/step evidence supplements the earlier functional proof; AST equivalence and focused/frozen checks connect the revisions.

The earlier full392-test check is historical; this follow-up claims only its newly executed four-project types,23 focused tests, five frozen scripts/hash checks, build and ten current-code browser checks. No cross-RNG trajectory/statistical equivalence or empirical validation is inferred. No Argon retry/substitute was attempted. Parent retains all200 scope, counts, global registration, integrated checks and independent approval.

Only new follow-up commits after eaa698a are intended for the parent. Apply the formatting commit first, then the evidence/report commit identified by the final PR head. Own issue21/draftPR22 remain the tracking records; rootPR4 remains linked. Own server and tabs are stopped at handoff.
