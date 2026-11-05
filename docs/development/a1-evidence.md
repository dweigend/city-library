# A1 acceptance evidence

Status: A1 implemented and author-verified after independent review findings were fixed. The fixes have not received a second independent approval. See the [development assignment](a1.md) and [usage](a1-usage.md). This record does not claim complete Agent Loom delivery.

## Example-first evidence

All five `examples/a1/*.ts` files were authored before runtime handoff. The first execution failed with `Cannot find package city-library`. SHA-256 fingerprints are retained in the assignment; the accepted files remain unchanged.

## Source research

The user-requested advisory agent researched the old project read-only. [Findings and selected responses](a1-source-research.md) distinguish transferable scenarios from incompatible old behavior. New runtime code has no import from the old checkout.

## Browser verification

The coordinating agent used the shared T3 browser against the local Bun HTML host on 5 November 2026. Source review also used current Vercel Web Interface Guidelines, fetched from the upstream command.md, plus the installed frontend-design and web-design-guidelines skills.

- Desktop 1280×800 and mobile CSS viewport 390×844, both light and dark screenshots inspected. Mobile scrollWidth equaled viewport width; controls/text fit without horizontal overflow.
- Five steps changed energy 10→5 and tick 0→5. A deliberate failing step changed energy 5→4 while tick stayed 5, with visible status feedback.
- Detach produced zero membership and disabled stepping. Reattach restored membership. Copy selected a detached new identity while retaining the original World agent; attaching the copy produced two registered agents, deleting it left the original and disabled deleted-agent controls.
- New model with energy 42 reset tick to 0 and membership to one living agent. Keyboard Tab focused one-step with a solid visible outline; Enter produced energy 41/tick 1.
- Invalid negative initial energy was blocked by native form validation, focused the field and preserved model state. Reset to valid energy 10 succeeded.
- Browser snapshots reported no console errors or failed network requests. No hidden timers or automatic steps exist. Destructive controls operate only on disposable local test models, with New model available to recreate the fixture; there is no user data store.

Screenshots were inspected as local verification artifacts; portable evidence is the procedure and observed results above. These checks are not a complete accessibility certification or cross-browser matrix.

## Shell verification

Coordinating-agent run on 5 November 2026: `bun run check` passed end to end. This runs library/development/UI strict typechecks, 30 behavior tests, five separate frozen example processes, browser-target ESM build and declaration emit, and the isolated packed-package consumer. The consumer passed on Bun 1.4.2, Node v26.8.2 and TypeScript 7.0.2 with no Bun/DOM ambient types. `git diff --check` passed. Exact example fingerprints remain unchanged.

The build uses no runtime dependencies. The package remains private. Generated dist output and temporary package artifacts are not committed. Node results apply to the installed version; compatibility with older Node versions is unverified.

## Independent review and author responses

Independent read-only review by Antigravity `gemini-4-argon` completed on 5 November 2026. Actual provider/model identity was confirmed. The reviewer independently ran the 26-test pre-fix check suite, five examples, build/consumer, fingerprint checks, 309-row inventory validation and adversarial runtime probes. It found two blockers rather than issuing approval.

Review evidence: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/thread:delegated-task:command%3Amcp%3A727936d3-c33f-48e5-9e8f-2795dcf917fd%3Adelegate-task%3A0aac3fa4-a2fe-41b3-b54d-cf968ba5a1a4>.

| Finding | Author response and regression evidence |
| --- | --- |
| TypedArray digit-only noncanonical keys such as 01 were accepted and silently dropped. | Validate canonical numeric indices within view length; reject extra own properties. New public regression covers 01, 00, 0001 and extra. |
| Copy skipped deferred reserved Agent keys assigned after creation. | Exclude only actual installed library members when collecting custom state; construction validation now rejects deferred reserved keys instead of dropping them. Test all seven deferred keys. |
| Optional: copy changed Object.prototype to null. | Preserve the allowed source prototype with safe own-property definitions; test both ordinary and null-prototype records. |
| Optional: resizable ArrayBuffer becomes fixed-length. | A1 preserves bytes, offsets and shared backing identity, not live resize policy. Document the limit; continuation/storage must address any stronger future requirement explicitly. |

The coordinating agent additionally reproduced and fixed rejection of callable iterable membership inputs. An asserted public test verifies add/delete and deduplication for a function implementing Symbol.iterator.

After these small fixes, the coordinating agent ran `bun run check` again: all 30 tests, unchanged five examples, all typechecks, build and packed consumer passed; whitespace checks passed. Fixes are author-verified responses, not a new independent approval. No known unresolved A1 blocker remains. The complete Agent Loom target remains open.

Test sources: [public boundary contracts](../../tests/a1-boundaries.test.ts), [runtime and review regressions](../../tests/a1-runtime.test.ts), [compile-time contracts](../../tests/a1-types.ts), [HTML application-model contracts](../../models/agent-lab/model.test.ts).
