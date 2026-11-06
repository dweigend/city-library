# Both-host authoring browser acceptance

The runner uses separate real Chromium contexts after the documented T3 capture-size and configured Playwright MCP sandbox failures. Images are unmodified DPR-1 captures at 1366×768 and 390×844 in light and dark. The runner and raw result retain their original checkpoint attribution; source under test was the working payload subsequently committed through `7bfd706`, not an assertion that the earlier named chart commit alone supplied the complete runtime.

Both adapters passed the five frozen examples, explicit overlap/getter-precedence checks and nine additional chart/error/recovery fixtures each. Invalid renderer and formatter data during Run stops progression at tick 1; Setup recovers at tick 0 and genuine later failures still appear. The final run reports no page errors or horizontal overflow. These are UI behavior checks, not scientific acceptance of the selected models.

Two real Svelte failures were retained in the test history and fixed separately: reactive error publication and old queued renderer effects contaminating a restarted session. Screenshot inspection by an independent non-implementing agent and the fresh catalog smoke/rich-flow result remain separate gates. `artifact-map.json` records original paths, repository copies and SHA-256 hashes.
