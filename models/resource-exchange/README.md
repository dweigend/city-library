# Resource exchange

Each step samples two distinct registered agents. An agent with positive energy transfers one unit to the receiver. Sampling uses a model-owned seeded random stream; reading or selecting an agent does not advance time or consume randomness.

`model.ts` owns initialization, transfers, membership and detached observations. `ui.ts` binds setup controls and energy views to those public actions. Import `create` for headless runs, or open Resource exchange in Agent Lab. `createExchangeModel` remains available for existing consumers.

Defaults are 24 agents, ten energy units each and seed 1. Count must be 2–200, initial energy 0–1,000,000 and seed a signed or unsigned 32-bit integer. Total energy is conserved among registered agents during transfers; detaching or deleting an agent changes the registered population. Copying creates a detached agent and does not add it to the running world.

This is an illustrative mechanism, not a calibrated economic model. The intentional `failStep` action demonstrates that failed execution retains transfer effects without advancing the tick; the UI does not expose this diagnostic action.

Run `bun tests/public-contracts/a2a/05-resource-exchange.ts` and `bun test tests/agent-lab-model.test.ts` for seeded replay, independent instances, lifecycle and observation checks.
