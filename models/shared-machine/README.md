# Shared Machine

Two material units and one machine illustrate reservation, consumption, cancellation, failure and repair. Reserve and start a named job explicitly. Failure consumes no extra material and does not refund its input; one hour of repair must elapse before Repair succeeds. Step advances one hour without automatically retrying rejected requests. Completing a running job releases occupancy. Operation order remains model policy.

The headless [model](model.ts) owns state and actions; the shared Lab [UI](ui.ts) binds those actions and observations. Run `bun run dev`, select this model and use Setup. Original City Library teaching composition; no upstream scientific-equivalence claim.
