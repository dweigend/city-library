# Universal UI migration baseline

All 146 paired experiment models and UI entries run headlessly at the starting source revision `a78bd2359e7a12ac537be131ca8d3023c4b718eb`. Two independent fresh-process captures produced identical complete serialized results for every entry. These observations provide a baseline for later authoring changes; they do not establish acceptance of a new API or rendered UI.

## Executed method

The capture enumerated every `experiments/<slug>/ui.ts` with a matching `model.ts`, sorted by slug. Each entry ran in its own fresh Bun process, with four processes active at once and a 30-second per-entry safety timeout. The worker imported the public model definition and UI entry, created the model with its unchanged defaults, and recorded complete observations after requested cumulative step counts 0, 1 and 3. It invoked `advance(1)` and then `advance(2)`; actual model tick/time and early-completion behavior were recorded rather than inferred from those requests.

At each point, immediate repeated `read()` calls had to serialize identically. Where an experiment explicitly exports a pure scene function, the worker projected the same observation twice and required identical projection output, then verified that a fresh model read still matched. No `defineUI` mock, private UI import, domain monkeypatch, parameter override, renderer or browser global was used. The UI entry imports completed without a `document` global, and their exported mounted-entry contract was present. Mounting was not attempted.

Serialization preserves otherwise lossy undefined, nonfinite-number and bigint values with explicit tagged records. Complete observations, identity fields and collection order are retained. No field normalization or ID remapping makes the comparison pass. Each per-entry file is gzip-compressed JSON; its manifest SHA256 covers the complete uncompressed capture, including exported scenes where available.

## Results

| Check | Executed result |
| --- | --- |
| Matching experiment/model pairs | 146 |
| First capture | 146 passed, no failures or timeouts |
| Second fresh-process capture | 146 passed, no failures or timeouts |
| Complete serialized capture hashes equal between runs | 146 / 146 |
| Full observations at requested steps 0, 1 and 3 | 438 per capture, all equal between captures |
| Entries exposing `randomState` in their observations | 98; captured without normalization |
| Entries with explicitly exported scene projections | 11 DES entries; stable and observation-preserving |
| Raw serialized bytes per complete capture | 192,511,453 |
| Compressed capture storage | Approximately 39 MB per capture |

The slowest first-pass entry was Membrane Formation at 13,575 ms; all entries completed within the unchanged 30-second timeout. These timings describe this session and are not performance thresholds.

The original first-pass manifest SHA256 is `b4169cc23dc3d515115a39285a238bb165879079585a7153036b12b00dab5d16`.

## Session artifacts and replay

Artifacts belong to the local session, not the published package or a new runtime dependency:

- `/tmp/universal-ui-baseline/before/`: preserved first-pass files and manifest.
- `/tmp/universal-ui-baseline/replay/`: second-pass files, manifest and `comparison.json`.
- `/tmp/universal-ui-baseline/capture-one.ts`: one fresh-process public consumer.
- `/tmp/universal-ui-baseline/capture-all.ts`: bounded process orchestration.
- `/tmp/universal-ui-baseline/compare.py`: complete observation comparison and separate projection-change report.
- `/tmp/universal-ui-baseline/run.log` and `replay.log`: actual per-entry outcomes.

Executed from the repository root:

```sh
bun /tmp/universal-ui-baseline/capture-all.ts
bun /tmp/universal-ui-baseline/capture-all.ts /tmp/universal-ui-baseline/replay
python3 /tmp/universal-ui-baseline/compare.py
```

The initial command wrote directly into the session directory; its completed results were moved intact into `before/`, then the capture helper gained an explicit output-directory argument. Subsequent captures must use a new directory so the original evidence is preserved. For a migration comparison:

```sh
bun /tmp/universal-ui-baseline/capture-all.ts /tmp/universal-ui-baseline/after
python3 /tmp/universal-ui-baseline/compare.py \
  /tmp/universal-ui-baseline/before /tmp/universal-ui-baseline/after
```

The comparator fails for missing or changed full observations. It reports scene projection changes separately because intended visual migrations may change diagram geometry or presentation fields. Any intentionally additive observation field requires an explicit contract decision and a separate comparison proving that original fields and ordering remain intact; the full-equality gate must not be silently weakened.

## Limits and remaining gates

The public `defineUI` result is an opaque `BoundEntry`: title, description and mount behavior. It does not expose ordinary monitor/view callbacks. Consequently, this baseline does not claim headless projection coverage of every non-exported callback in all 146 UI declarations. Those need the actual catalog/host runtime smoke checks and browser interaction required by the migration acceptance plan. The eleven scene checks use their actual exported experiment functions; the other 135 entries do not acquire imaginary projection coverage merely because their UI imports succeed.

Exact observed `randomState` equality for 98 models supports stream-position preservation at the captured points. The 48 other models expose no such field; matching observations establish the sampled trajectories, not complete internal RNG-state continuation. None of this claims full simulation checkpoint/restore or correctness outside the sampled default trajectories. Scientific equations, units, source compatibility and ordering still require their source/tests and independent review. This report does not claim browser rendering, screenshot, selection, lifecycle or accessibility acceptance of the forthcoming UI expansion.
