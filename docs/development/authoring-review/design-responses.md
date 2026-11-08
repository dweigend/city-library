# Authoring design review responses

Independent Gemini 3.8 Flash high and Astra high reviewed the proposed authoring slice. Raw feedback is retained alongside this response. Their source/design feedback is not runtime, screenshot or scientific approval.

Astra identified host divergence on overlapping setup/live fields, incomplete observation-union and DOM-decoding boundaries, nonportable browser-test selectors, synchronous rendering assumptions and unspecified categorical-bar behavior. The separate refreezes `ce42cc3` and `e03d731` retain the original manifests, strengthen type and browser assertions and correct test-harness assumptions without weakening scientific expectations. Both hosts must now retain separate presentation drafts and apply explicit live-reader precedence; decoder checks use actual descriptors without pretending to prove arbitrary refined TypeScript types. Browser checks await settled rendering.

Gemini approved the conceptual contract at its inspected earlier checkpoint. Its two runtime blockers (split numeric/categorical chart types and mount rejection of empty group labels) are implementation requirements, not evidence that the new runtime already passes. Its broader conclusion about private procedures does not close the explicit Tijuana public-procedure contract question. Its description of the project as open source is not adopted as a licensing claim; the documentation describes an open, composable system without selecting a license.

Controls/common normalization, chart rendering and catalog migration have separate implementation owners. New runtime, both-host interaction checks, independent screenshot review and fresh implementation reviews remain pending. Existing 200-model delivery and per-model scientific acceptance obligations are unchanged.

The model-refactor browser baseline is retained under `../authoring-browser-baseline/`, with raw reported CSS/PNG dimensions and artifact hashes. The T3 capture-size failure and configured Playwright MCP sandbox-start failure are recorded alongside the successful separate local headless-Chromium supplement. Baseline checks do not establish acceptance of the new UI syntax.
