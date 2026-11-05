# Social, economic, mobility and urban research delivery

Checked: 2026-11-05. Scope: immutable selection orders 1–50, delivery batches B01–B05.

All 50 assigned models have paired `<slug>.json` and `<slug>.md` dossiers. There are 150 publication slots containing 98 distinct scientific works. Each mini-text contains 113–139 whitespace-delimited English words. All 50 actual NetLogo Web model files and extracted Info sections are retained under `evidence/social-urban/`; each dossier identifies URL, served NetLogo 7.0.4 snapshot and SHA-256. This pins the served reference, not a City Library runtime revision.

Executed check: `python docs/research/netlogo-web/batches/social-urban/finalize.py` — 50 complete, 0 incomplete, 0 consistency errors. It checks selection identity, word limits, three unique publications, nonempty author/year fields and existing evidence snapshots, and regenerates Markdown companions. No TypeScript, runtime, UI or Git mutations were performed. No browser or implementation acceptance is claimed.

The 98 works have recorded accessible evidence: 33 abstracts, 62 bibliographic metadata records and three full-text original conference/working papers. Additional author-hosted Wolf–Sheep full text was consulted; its bibliographic record conservatively remains metadata-level. Metadata-only entries do not claim full-text comprehension, and author initials remain exactly as verified where expanded names were unavailable. Paywall/full-text uncertainty is explicit.

During title/author checks, unrelated DOI guesses were rejected. Two DOI-register defects were corrected using accessible primary/university records: the traffic-lights record incorrectly included email/affiliation strings as authors; the computer-virus conference record omitted its date. The publisher confirms Carlos Gershenson as the sole traffic-lights author; the conference and university record identify the computer-virus paper as 1991, by Jeffrey O. Kephart and Steve R. White. The corrections and evidence are retained.

`used-publications.json` is the authoritative set of accepted, corrected bibliographic records for this batch. Raw `*-crossref.json`, `*-fix.json` and `*-verified.json` snapshots also include discarded search candidates; the existence of a raw candidate is **not** verification of its relevance or acceptance. `reference-results.txt`, `fix-results.txt` and related logs are search history, not a bibliography. Do not import candidates without consulting `used-publications.json` or a completed model dossier.

These literature findings neither validate model outputs against real populations nor constitute independent implementation review. Particularly explicit cautions cover mechanical bank multipliers, gender and ethnic tags, awareness points, Tijuana forecasting, pollution/health relationships and arbitrary sprawl-site resets.
