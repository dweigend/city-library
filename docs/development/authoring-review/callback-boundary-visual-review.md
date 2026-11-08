# Independent callback boundary visual review

Date: 2026-11-06. Target: callback boundary revision `d069be3`; evidence captured from the integration checkout. Reviewer did not implement the runtime change or operate the capture browser. This is a separate review from [the earlier authoring visual review](independent-visual-review.md); its V1–V3 closures retain their original scope.

## Verdict

**Scoped visual approval for the captured Svelte callback failure and recovery states.** No new blocking layout or visibility finding in this scope. All 54 supplied after-state PNGs were opened individually and inspected: 36 base captures, six post-preflight captures, and 12 reachability captures. The last group contains eight failure-state images and four desktop follow-up images.

Actual PNG dimensions are 1366 × 768 and 390 × 844. Both light and dark themes were inspected. This does not approve all catalog models, scientific behavior, keyboard or screen-reader behavior, or the merge to main.

## What the images establish

| Scenario | Direct visual observation | Scope |
| --- | --- | --- |
| Replacement rejected during enabled preflight | Error is visible above the canonical observation. Table remains instance 1 / people 2 / tick 0; draft People 3 and “Restart with changes” remain visible. Follow-up shows instance 1 / people 2 / tick 1. | Svelte, both sizes and themes; follow-up desktop in both themes. |
| First setup rejected | “Enabled failure” and “Setup to begin.” remain visible; run and step controls appear disabled. No candidate observation is presented as initialized. | Svelte, both sizes and themes. The unsuffixed desktop captures also show this failure; they are not recovery evidence. |
| Formatter fails after one tick | “Formatter failure” remains visible while canonical observation shows instance 1 / people 2 / tick 1. The formatted monitor group is replaced, but the independent table remains legible. | Svelte, both sizes and themes. |
| Draft and speed edited while formatter fails | Expanded mobile Parameters panel shows People 3, its pending marker, Speed, the error, and the current 1 / 2 / 1 table together without overlap. Desktop shows the same draft/current distinction. Restart follow-up shows instance 2 / people 3 / tick 0. | Reachability captures, both sizes/themes; restart follow-up desktop in both themes. |
| Enabled callback fails after ownership publication | Error says “Enabled publish failure”; canonical observation already shows instance 2 / people 3 / tick 0. Follow-up monitors and table agree at instance 2 / people 3 / tick 1. | Post-preflight captures, both sizes/themes; follow-up desktop in both themes. |

The Svelte toolbar wraps into two rows at 390px. Parameter disclosure, restart, run, step controls and speed slider remain within the viewport. Expanded parameters use normal document flow and leave the error and observation below them without obscuring either. Table column labels and values remain readable in both themes. No clipped text, overlapping controls, or horizontal overflow is visible in these fixtures. Slider position is visible; its exact numeric value 6 is supported by the operator’s DOM evidence, not readable from the pixels alone.

## Evidence boundaries and remaining work

- Browser interaction, disposal counts, absence of uncaught page errors, and exact owner lifetime are operator-executed evidence in the manifests below. This reviewer checked their recorded states and independently inspected the resulting pixels; the flows were not rerun by this reviewer. Static instance labels do not independently prove disposal correctness.
- The legacy comparison fixture is visibly unstyled: toolbar text and table headers run together. Its enabled failures retain partial monitor output, and its formatter failure retains the previous tick-0 table. These images establish the recorded comparison behavior, not design parity or rollback. The targeted change is in the Svelte session; no claim is made that it introduced or fixes legacy rendering. Any broad legacy visual approval requires a styled production-host capture rather than these diagnostic fixture images.
- Earlier before-formatter pictures were captured after recovery. They cannot establish the historical visible error state; the earlier DOM snapshots and page-error logs carry that negative proof. No before/after pixel regression claim is inferred from those images.
- Keep the separate source/contract review and final integrated browser regression results alongside this visual verdict. The frozen authoring examples, catalog consistency, scientific ledgers, outstanding independent reviews, and the fixed 200-model scope remain governed by PLAN. This report closes none of those gates.
- Preserve or copy the temporary evidence before relying on it for durable release review. Hashes below identify the exact inspected PNGs; `/tmp` paths are local capture artifacts.

Review criteria followed the project AGENTS/DESIGN instructions and the already-read frontend-design, frontend-design-shadcn-svelte, shadcn-svelte and web-design-guidelines skills. Current Vercel interface rules were fetched to `/tmp/city-library-callback-visual-guidelines.md`. This review applies their relevant layout, labeling, contrast and error-visibility checks; it is not a complete accessibility audit.

## Operator manifests

- `/tmp/city-library-authoring-error-boundaries-summary.json`
- `/tmp/city-library-authoring-error-boundaries-after.json`
- `/tmp/city-library-authoring-error-boundaries-after-postpreflight.json`
- `/tmp/city-library-authoring-error-boundaries-after-reachability.json`

All nine manifest cases record empty `pageErrors` arrays. This is recorded browser evidence, not an independently rerun assertion. The reachability manifest has 12 screenshots, even though the summary describes only its eight failure-state pictures.

## Inspected image inventory

Every path below was opened with the image-viewing tool. Dimensions and SHA-256 were then read from the exact local PNG files.

| Image | Actual dimensions | SHA-256 |
| --- | --- | --- |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-replacement-1366-light-error.png` | 1366 × 768 | `01c09928bc03b52057c91d83d363fe4a1d96facdd52522f1a0647f0efcd5ceeb` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-replacement-1366-dark-error.png` | 1366 × 768 | `a0717646e92498bfb26d8d16bb709068065dbb1e147483636ff00dc5ca9e6920` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-replacement-390-light-error.png` | 390 × 844 | `6f11eb6690dcecf354593c0ea7457437d7d3930de522a70f1a1f34a999d6ca0b` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-replacement-390-dark-error.png` | 390 × 844 | `8d724f5ab7e437d29bb7504c355a8c1e1186890ceb88e2b50474019fd33e943d` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-replacement-light.png` | 1366 × 768 | `01c09928bc03b52057c91d83d363fe4a1d96facdd52522f1a0647f0efcd5ceeb` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-replacement-dark.png` | 1366 × 768 | `a0717646e92498bfb26d8d16bb709068065dbb1e147483636ff00dc5ca9e6920` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-first-setup-1366-light-error.png` | 1366 × 768 | `bda3abeb51b3fe2a5ddbf2be9804d5f685c5482f3b24da4b64bcba4bf2e543eb` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-first-setup-1366-dark-error.png` | 1366 × 768 | `418112fa99c4e1f1b43da23d371491c6d7b08e20789e98af8c37031e78848105` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-first-setup-390-light-error.png` | 390 × 844 | `096fd9528d4a231ac2b5f1e209d554877c032f4c90547426eec1389014a91efc` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-first-setup-390-dark-error.png` | 390 × 844 | `5b197cadc5b2cd0f19e58bafd281708b7a4f079389a0cce0284a230f4cf5827a` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-first-setup-light.png` | 1366 × 768 | `bda3abeb51b3fe2a5ddbf2be9804d5f685c5482f3b24da4b64bcba4bf2e543eb` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-enabled-first-setup-dark.png` | 1366 × 768 | `418112fa99c4e1f1b43da23d371491c6d7b08e20789e98af8c37031e78848105` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-formatter-1366-light-error.png` | 1366 × 768 | `c6b916fb127d731e27732546988ab3641195be75a77e1aa560e97c177e38ab2a` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-formatter-1366-dark-error.png` | 1366 × 768 | `d8beb621a200fa0ba18d57863a2250f6e0e492f2e60c7d2c49f9306c49263566` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-formatter-390-light-error.png` | 390 × 844 | `f2ab525ec36c6c3611c2c2257f634ee560a13c84d76ccced3eb4b223251b5e2f` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-formatter-390-dark-error.png` | 390 × 844 | `e3578b1e11e8d70cd2ecf1da29f89c996a1626118e08427646c4130b8567911e` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-formatter-light.png` | 1366 × 768 | `767efa8aeecf98c36d93ad060ea212dbcbc6b5afa32cc4999abfc188bb2da2e1` |
| `/tmp/city-library-authoring-error-boundaries-after-legacy-formatter-dark.png` | 1366 × 768 | `879a4069814e21d220a8b0a9af7963cac80232608adf43e5138e53a8461bc224` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-replacement-1366-light-error.png` | 1366 × 768 | `46f09bb89103d78bb0a9c488fede2b2d83ea40332b98a216735eb28abbcdc10a` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-replacement-1366-dark-error.png` | 1366 × 768 | `d94f80e6396451dffa83f3adfb8aaba3843730ee3634ab1793340bc9c69a0c92` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-replacement-390-light-error.png` | 390 × 844 | `0d4ef52ef7e13edf1be67e967eb643f6c072c8ad10960f42920a9cceb1b02f89` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-replacement-390-dark-error.png` | 390 × 844 | `cfd0b8f522fc48134c51b8606d709d66a3c107e1f0853e4db80a091f50cec93e` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-replacement-light.png` | 1366 × 768 | `2a52e1fca3162109268e4c0f32864132b9a700251f778027a69175502e2cf047` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-replacement-dark.png` | 1366 × 768 | `1e60168fe5456430f485d243086970f6c10b5226c707f7bebcc4c2e1ed282535` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-first-setup-1366-light-error.png` | 1366 × 768 | `bc0fb3b27fae092c0c22e870f96bc914bdad3ba94dbf54b82928856d5cd587ac` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-first-setup-1366-dark-error.png` | 1366 × 768 | `84a15aa4920ff59cab491b619a50d0ec5aa8a3a5c310d1a708141ecfc12a7656` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-first-setup-390-light-error.png` | 390 × 844 | `da01521078dbf56e5c948b0224b53d908cdd0c1840ae5c6ce46b23ed4dbcd62f` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-first-setup-390-dark-error.png` | 390 × 844 | `bf04e0504cb364cc227403ee220dd6811999273c05afcafad7a19e26692e8604` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-first-setup-light.png` | 1366 × 768 | `19641dd765d8f092a90b3acaa082f83ab5c2a1f14782499cbb589f4dc9502ea4` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-enabled-first-setup-dark.png` | 1366 × 768 | `c348f1b0056debbb2a26e34b5bf2f4efc3ba10e5957ae545261f880121f3d7b7` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-formatter-1366-light-error.png` | 1366 × 768 | `684ce1ae46cbfd87c415118002254df302af7202009ace6afa1437b256fedba5` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-formatter-1366-dark-error.png` | 1366 × 768 | `a4680bcce59352bc7ea3cea352aa14dd282e03e67f0f3bf89b8fd44dab5eb137` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-formatter-390-light-error.png` | 390 × 844 | `6edd64f08794ac991287ea0c2ed9b8c44a8af10ab973f412e9b41dc73442efb5` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-formatter-390-dark-error.png` | 390 × 844 | `682f4d3c8de1242333f1707260fed0eccf7c3b77e89f647dcb21d6239ca0d183` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-formatter-light.png` | 1366 × 768 | `535860d3076e4de396fed1be1d743c26f009fd9d544a53e78c7e055e9ac17e6d` |
| `/tmp/city-library-authoring-error-boundaries-after-svelte-formatter-dark.png` | 1366 × 768 | `6f5fdb5913709271dcf5e82206f738ba70790b490b55fd91c5db45919761a759` |
| `/tmp/city-library-authoring-error-boundaries-after-postpreflight-svelte-enabled-replacement-1366-light-error.png` | 1366 × 768 | `e134ffb66bd6c0fcc4559639ba231eccf915d63edaf0d70b90d8bacc1bf8e834` |
| `/tmp/city-library-authoring-error-boundaries-after-postpreflight-svelte-enabled-replacement-1366-dark-error.png` | 1366 × 768 | `30f78bbef3a499172d7d61d7aa82abfa81a09074deb1d9c9435984996be4e854` |
| `/tmp/city-library-authoring-error-boundaries-after-postpreflight-svelte-enabled-replacement-390-light-error.png` | 390 × 844 | `20f15a0ae5de6577f6cd9a88228f4ddc50edcd1a1b90722327fbdc43f11c5466` |
| `/tmp/city-library-authoring-error-boundaries-after-postpreflight-svelte-enabled-replacement-390-dark-error.png` | 390 × 844 | `51586426cb8c0d330e56af8c05af176d07fc96a5f72cdd4b1958b82008c2a452` |
| `/tmp/city-library-authoring-error-boundaries-after-postpreflight-svelte-enabled-replacement-light.png` | 1366 × 768 | `741c2460bcf343dd0b39ea8a5428b314aae467688e111e3ac8cea56322ffc75b` |
| `/tmp/city-library-authoring-error-boundaries-after-postpreflight-svelte-enabled-replacement-dark.png` | 1366 × 768 | `f80ea4559b59a0cdc777495d2bfd2eb8f22d898d3161ff8247eb915f996a1c21` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-enabled-replacement-1366-light-error.png` | 1366 × 768 | `46f09bb89103d78bb0a9c488fede2b2d83ea40332b98a216735eb28abbcdc10a` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-enabled-replacement-1366-dark-error.png` | 1366 × 768 | `d94f80e6396451dffa83f3adfb8aaba3843730ee3634ab1793340bc9c69a0c92` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-enabled-replacement-390-light-error.png` | 390 × 844 | `66de60c4e88ec3a5293e07a6f130c843472710a9f2536043c1c269d23d6bda6a` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-enabled-replacement-390-dark-error.png` | 390 × 844 | `b0e5a54364d221de6eb3a3d6a9b98dc1cdb66121fafaa48d5232f0a4fa86b4ad` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-enabled-replacement-light.png` | 1366 × 768 | `2a52e1fca3162109268e4c0f32864132b9a700251f778027a69175502e2cf047` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-enabled-replacement-dark.png` | 1366 × 768 | `1e60168fe5456430f485d243086970f6c10b5226c707f7bebcc4c2e1ed282535` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-formatter-1366-light-error.png` | 1366 × 768 | `b69151585185461236528fd1e83a99bac769ba04eeb40d58eeb1e15a4394f12f` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-formatter-1366-dark-error.png` | 1366 × 768 | `63b63bc61294b16a9ac6e475fbc82203dbe69ae40bf5d8aa15240f83ce3493e7` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-formatter-390-light-error.png` | 390 × 844 | `22ec95c5e3f7bc51d353a57afe2ec533394846961d4bcf9f1e9a46787166d0b7` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-formatter-390-dark-error.png` | 390 × 844 | `d41f916b4df003d50e473cb2891638a65e67d3fb8b98a7d9b5d9cda6a47271fb` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-formatter-light.png` | 1366 × 768 | `535860d3076e4de396fed1be1d743c26f009fd9d544a53e78c7e055e9ac17e6d` |
| `/tmp/city-library-authoring-error-boundaries-after-reachability-svelte-formatter-dark.png` | 1366 × 768 | `6f5fdb5913709271dcf5e82206f738ba70790b490b55fd91c5db45919761a759` |
