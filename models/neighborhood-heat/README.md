# Neighborhood Heat

Nine equal-capacity fields start at 20, except the center at 28. One face-diffusion step leaves the center at 20 and its four direct neighbors at 22, preserving total 188. This reference does not calibrate real heat transport.

The headless [model](model.ts) owns state and actions; the shared Lab [UI](ui.ts) binds those actions and observations. Run `bun run dev`, select this model and use Setup. Original City Library teaching composition; no upstream scientific-equivalence claim.
