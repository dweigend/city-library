# Expanded documentation verification

Date: 7 November 2026. Scope: documentation only, source branch docs/parcel-contract-proposal. Target implementation comparison is pinned to City Library 2a7f3eb.

Executed a scoped Python check on api-reference.md, api-table.md, COVERAGE.md, README.md and PLAN.md: local target existence, fragments including explicit HTML IDs and generated heading IDs, unique explicit IDs and balanced fenced blocks all passed. Compared matching first TypeScript signature blocks by operation anchor, excluding reference-only trailing MergeResult/SplitResult declarations: all 56 matched. Counted 49 numbered catalogue coverage rows and 27 supplementary type/result rows. git diff --check and staged diff whitespace checks passed.

The first literal whole-fence comparison included the extra result declarations in the reference and reported merge/split differences. Restricting comparison to the actual operation signature resolved those false differences; no public signature was changed to satisfy the check.

SHA-256 of final reader documents:

```text
api-reference.md 0c0c14948083a405e42aedf833a40cdf2a85d362cb95d2f4038e303c184e74cb
api-table.md 0e522ec999be27eb5bc9aef6980ce6bd28c2ce4dd4a58f6cd01a82744ae5dcea
COVERAGE.md 685b6f169fe75d1ca7db3bab4d3ac632f7b3d6fb49329351a3c540beb75c3478
```

Independent native Codex and fresh Gemini 4 Argon reviews are preserved beside this record; responses separate findings from coordinator corrections. No new API implementation, TypeScript typecheck, unit tests, build, packed consumer or browser interaction was run. Documentation code signatures include specification notation; balanced blocks and matching signatures do not establish executable example acceptance.
