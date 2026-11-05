# Agend Lab

This development-only HTML application consumes the public `city-library` root entry. It is not part of the engine or a renderer API. The library remains headless. Network diffusion imports `../examples/models/network-diffusion.ts`; Exchange imports the shared A2a composition in `../examples/models/exchange.ts`; Lifecycle imports `../models/agent-lab/model.ts`. `ui/app.ts` mounts separate application, presentation and visualization layers without duplicating any model rule.

From the repository root:

```sh
bun Agend_Lab/host/server.ts
```

Open <http://127.0.0.1:3100>. Set `CITY_LIBRARY_UI_PORT` to choose another port. The server defaults to loopback; `CITY_LIBRARY_UI_HOST` can select a specific interface, such as the host's Tailscale IP for tailnet access. It builds the browser bundle once at startup and performs no model execution on the server. Run `bun install` and `bun run build` before starting, and restart after source edits. Cytoscape.js 3.34.4 is pinned as a development dependency and bundled locally for this test host. No UI framework or remote assets are required; the packaged engine has no Cytoscape runtime dependency.

On the current development server, the user-requested tailnet instance is available at <http://davidserver.tail3ec2fe.ts.net:3100/> (Tailscale IP `100.75.96.127`). It runs as the transient user service `city-library-test-ui.service`, independent of the T3 shell. Inspect it with `systemctl --user status city-library-test-ui.service`, restart it after rebuilding with `systemctl --user restart city-library-test-ui.service`, or stop it with `systemctl --user stop city-library-test-ui.service`. This transient service is not configured for automatic startup after a machine reboot. Existing Tailscale Serve routes were preserved.

## Network diffusion scenario

Network diffusion is the default: 60 agents, three explicit contact groups, two community bridges, seed 1, transmission 0.35 and active duration 6. The public Graph kernel owns persistent contacts. A headless caller-authored rule computes every next state from an old-state snapshot, then commits together: unaware agents can become active through active neighbors; active agents eventually settle. Newly active nodes transmit starting next tick. Multiple neighbors combine exposure through the documented model probability rule.

Choose Communities, Ring or Hub and setup parameters, then New model. These are illustrative caller-authored network fixtures, not delivered generic graph generators or community analysis. Community bridges is a live model action: removing it cuts the two contacts without resetting adoption, time or randomness. Activate selected explicitly starts an unaware selected node. Settled nodes do not reactivate.

Run/Pause explicitly schedules one headless model step every 150 ms. The caller timer stops on pause, manual steps, model replacement, bridge/activation actions, errors, natural completion and teardown. The headless model and renderer have no scheduler. Run stops when there are no active nodes; manual step buttons can still advance model time as requested. The count trend and selected degree are readbacks from the headless composition. Orange means active, teal means settled and gray means unaware; the HTML legend/list/inspector provides text alternatives.

For a clear causal comparison, run the defaults to completion with bridges, then disable bridges and create a fresh model with the same seed. The first reaches all three groups; the second remains inside the starting group for this exact fixture. Changing parameters can produce stochastic extinction, so a connected graph does not promise universal adoption. Ring versus Hub with transmission 1 and active duration 1 makes early propagation differences especially clear.

Acceptance evidence, precise assumptions and remaining library scope: [A5a usage](../docs/development/a5a-usage.md), [assignment](../docs/development/a5a.md), [checks and review](../docs/development/a5a-evidence.md).

## Exchange scenario

The standalone Exchange composition defaults to 24 canonical agents, 10 energy units each and seed 1; the lab uses the current population/setup fields when switching scenarios. Each successful population tick uses the library's Random.sample to select two current World members. The caller-written model rule transfers one unit from donor to receiver when the donor has energy. Steps apply to the entire population's interaction rule, independently of which agent is inspected.

The setup controls select count (2–200), initial energy (0–1,000,000) and an explicit Mulberry seed. New model creates a fresh instance using those values. The displayed seed belongs to the running model; editing setup inputs alone does not modify it. Recreating a model with the same inputs/seed and executing the same steps reproduces its energy sequence. Framework IDs remain fresh identities rather than replay keys.

Total energy and range are read from headless model observations. The last selected pair uses a purpose-specific accent and explicit last-pair labels, independent of the selected inspection ring. A donor with zero energy makes no transfer, so the highlight identifies the selected pair rather than promising a successful transfer.

Conservation applies during population steps with unchanged membership. Copy produces a detached object; explicitly attaching, detaching or deleting an agent changes the population and its total energy. A failed step retains any completed exchange effects and consumed randomness without advancing Tick, following the existing run contract. Inspecting a detached/deleted object does not block population execution. With fewer than two World members, a population step is a successful no-op that advances Tick without random draws.

## Legacy scenario acceptance

1. Initial Exchange state: 24 markers, World agents 24, total energy 240 and Tick 0.
2. Click **100 steps**: Tick becomes 100; energies differ while total stays 240. Exactly the last sampled pair is marked active.
3. Select another marker using pointer or keyboard. Inspector changes, while energy, total, Tick and stream continuation do not. Next step uses the population rule independently of that selection.
4. Recreate with identical count/energy/seed and repeat the same number of steps. Per-agent energy values reproduce; changing seed selects a different deterministic sequence.
5. Copy creates and selects a detached canonical object. Attach explicitly to admit it to World. Detach/delete changes actual membership; old test objects remain inspectable. Population stepping remains available when a detached/deleted object is selected.
6. **Fail step** preserves Tick and displays the intentional error after any exchange effects. **New model** replaces the old test fixture and markers.
7. Switch Model to **Lifecycle** for the original one-agent test: energy 10, Tick 0. Five steps gives energy 5/Tick 5; only the inspected agent is stepped. Detachment or deletion disables step actions in this scenario. All six original headless lifecycle tests remain intact.
8. Verify keyboard Enter/Space marker selection, retained focus after redraw, desktop/mobile, light/dark, long values and many-marker scrolling. Invalid setup inputs must preserve the current model. Population/Seed inputs are hidden and disabled in Lifecycle.

## Visualization boundary

The viewport is a **non-spatial layout** of test objects, not a model grid. Its display positions never become Agent coordinates. Cytoscape owns temporary layout positions and a camera. Pan, zoom, dragging, Fit view and Reset layout never write back to Agents. Diffusion displays all actual persistent Graph contacts, with community bridges dashed. Exchange displays only its explicit last sampled pair; Lifecycle has no edges. The bounded A5a kernel is delivered; broader A5 algorithms and spatial semantics remain open.

The headless scenarios retain caller-owned lists of canonical Agent references. Legacy scenarios also retain copied, detached and deleted references for inspection. These lists own no separate membership, energy, clock or lifecycle state: readbacks derive those values from the same public Agent/World/Graph objects. Selection resolves an existing reference. Frozen observations contain scalar values rather than writable domain objects. Projection copies observations into renderer-neutral records; keyed native buttons preserve keyboard focus alongside canvas picking. Only explicit model actions, including the caller-controlled Run loop, advance the simulation.

Headless model tests cover observation immutability, selection, lifecycle per-selected-agent execution, seeded exchange replay/conservation and membership/deletion readbacks. Browser visual and interaction verification is a separate parent-agent check.

The UI's nonnegative integer initial-energy range is an application input policy, not a general Agent-state restriction. Energy may become negative as steps run. Rendering, copy selection and membership display never advance the World clock or draw randomness. Browser acceptance is recorded separately from library behavior and type checks.

## Boundaries

- `ui/app.ts`: bootstrap and page lifetime only.
- `ui/application/session.ts`: model replacement, revision and delegated model actions; no DOM or Cytoscape types.
- `ui/application/playback.ts`: single explicit caller timer, with an injected scheduler and cancellation.
- `ui/presentation/`: setup, controls, inspector, observed-history trend and accessible agent list.
- `ui/visualization/projection.ts`: pure detached snapshot-to-view conversion.
- `ui/visualization/layout.ts`: deterministic display positions for grid, communities, ring and hub.
- `ui/visualization/network-view.ts`: sole Cytoscape adapter, display layout, camera, styling and cleanup.
- `host/`: local HTTP and browser bundle delivery only.
- `../models/agent-lab/`: headless Lifecycle test scenario, actions, validation and observations.
- `../examples/models/exchange.ts`: shared headless Exchange composition used unchanged by public scripts and this UI. Application compositions consume the public City Library API; they are not additional library features.
- `../examples/models/network-diffusion.ts`: headless diffusion composition and focused topology/types helpers; persistent contacts use the public Graph kernel.

Rendering never changes agents, membership, energy, time or random state. All model writes go through named model actions. UI conditionals only format observations and control presentation; authoritative validation stays in the headless model.

Model replacement clears old visual identities, resets layout and list scrolling. Ordinary observations retain dragged positions. Fit/reset actions and fitted-view resizing adjust only the display; adding a copied node fits all nodes so the copy is visible. Disposal cancels playback and releases Cytoscape, resize/theme observers and control/list listeners. See [the original renderer-layer acceptance](../docs/development/cytoscape.md) and [current network-simulation acceptance](../docs/development/a5a-evidence.md).
