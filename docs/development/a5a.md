# A5a: graph kernel and network diffusion

Status: implemented and verified; [acceptance evidence](a5a-evidence.md) distinguishes author browser checks, independent source/CLI review and subsequent coordinator fixes. Authorized by the user's request for a real simulation with network effects. This advances a bounded non-spatial Graph slice ahead of A2b/A3/A4; their remaining contracts stay open. It does not claim full A5 or broad network-analysis parity.

## Deliverable and sequence

1. Freeze five asserted public scripts under `examples/a5a/` before any new runtime implementation. Record exact contracts, initial failures and SHA-256 fingerprints in the example assignment.
2. Implement detached Graph/node/edge state and identity through public TypeScript exports. Use focused modules under `src/graph/`; the library has no Cytoscape dependency.
3. Implement a headless illustrative network-diffusion model from the same public operations, with explicit synchronous update rules and meaningful deterministic network-effect tests.
4. Extend Agent Lab through its existing application/presentation/projection/renderer boundaries. Display actual persistent contacts, model states and observations; all topology changes and activation rules remain in the model.
5. Run earlier/new examples, focused boundary/type tests, packed consumer checks, browser acceptance and independent Antigravity `gemini-4-argon` review. Record findings and coordinator remediation separately.

## Bounded library contract

The binding API reference remains authoritative. Deliver `Graph.add` (including typed `edgeState`, simple/parallel and self-loop policies), immutable `parallel`/`selfLoops`, original-object `nodes.add/delete/size/iteration`, `edges.add/has/between/size/iteration`, `hasNode`, `hasEdge`, `neighbors`, and `delete({edgesOnly})`. Edge owns opaque identity, graph/life, immutable endpoints/direction/key and copied directly writable custom state. Collection iteration is stable and fails on structural mutation while active; query arrays are frozen snapshots.

Validate all supplied edge options/state before any creation or duplicate return. Simple duplicate insertion preserves existing state; directed reversal is a distinct edge; mixed overlap requires parallel mode. Parallel keys are graph-global, generated monotonically without recycling, and keyed duplicate semantics follow the reference exactly. Removing membership removes incident edges in that graph and leaves the node object alive. Agent deletion cleans its membership/incident edges in every graph; World detachment does not delete graph membership. Graph and Edge framework references preserve canonical identities in supported state copies. Extend the existing internal identity/state-copy protocol rather than duplicating ownership infrastructure.

Spatial edge paths/ties, graph World attachment, views/copy/data exports, traversal/routing/analysis/generators/layout APIs remain explicit later work. Reject supplied unsupported path options; non-spatial `edge.path` reads undefined. No empty method stubs or silently ignored options. Keep partial coverage honest where a reference row includes future branches.

## Headless simulation contract

The example model lives under `examples/models/network-diffusion.ts`, is usable without HTML, and imports only public library APIs. This is an illustrative social-information cascade, not a fitted scientific or medical model.

- Parameters: population (3–200, default 60), numeric seed (existing 32-bit Random contract, default 1), transmission probability (0–1, default 0.35), active duration (1–30 integer ticks, default 6), topology (`communities`, `ring`, `hub`; default communities), and community bridges (default enabled).
- States: `unaware`, `active`, `settled`. Start with one active agent at index zero. Canonical Agent properties own these values and active age. Graph owns persistent undirected contacts; no UI graph is authoritative.
- Communities partition insertion-ordered agents into three groups as evenly as possible. Within each group, connect cyclic offsets one and three where distinct. Two explicit bridge contacts join consecutive groups. Ring uses cycle neighbors; hub connects node zero to every other node. These are transparent caller-authored compositions, not delivered Graph generators.
- Each World tick first captures every agent's state. An unaware agent with k active neighbors adopts with probability `1 - (1 - transmission)^k`, using at most one public uniform draw in agent insertion order when the probability is strictly between zero and one. No exposure or probability zero consumes no draw; probability one adopts without a draw. Newly active agents cannot transmit until the next tick.
- Previously active agents age once per tick and settle when their age reaches the active duration. Settled agents do not transmit or reactivate. All next values are calculated before committing, preventing in-place traversal cascades.
- Explicit `seedSelected()` activates only an unaware selected agent. `setBridges(boolean)` changes only the two model-owned community connections, without tick/RNG changes. Selection is observation intent. Validate actions before mutation.
- `read()` returns detached frozen agent/edge observations, parameters, selected-agent status/degree, counts, total contacts, newly activated count, tick, done flag, RNG continuation and bounded model-owned count history (initial point plus latest 240 samples). Snapshot construction does not consume randomness. History is a model composition buffer, not delivery of the future generic History API.
- `advance(steps)` uses public World/run execution. No hidden scheduler or timer belongs to the model. The UI may explicitly start/pause a caller-owned timer; stepping, reset, scenario replacement and errors stop it appropriately. The renderer never advances simulation.

Required causal tests: chain progresses at most one edge per synchronous tick; disconnected groups never adopt from another group; enabling bridges changes reachable adoption at probability one; hub and ring produce different early adoption counts at equal settings; same seed/actions reproduce full trajectories; query/render/selection leave tick, state and RNG unchanged; counters sum to population; edge changes immediately agree with model readbacks.

## UI acceptance

Make Network diffusion the default scenario while preserving Exchange and Lifecycle. Show all actual contacts, distinct model states and an accessible legend/list/inspector. Add topology, probability, active-duration and bridge controls plus explicit Run/Pause and Activate selected actions. Graph layout may group communities or emphasize the hub, but must remain presentation-only. Show count trends from headless observations; do not recompute model metrics in the UI. A new run resets the view and observations; a bridge toggle changes only canonical contacts. Keep lifecycle-only mutation controls out of the diffusion flow.

Inspect desktop/mobile and light/dark themes; verify pointer/keyboard selection, start/pause/step, reset, bridge changes, completion and retained legacy scenarios in a real browser. Run no renderer-side spread, topology generator or network-analysis substitute.

## Source reconnaissance and transfer decision

The user-designated source helper inspected the clean old `city_game` worktree at revision `08b3efb66d0f93d023f0b1deb762578552f7b819`. Relevant paths under its `netlogo-ts/src/lib/` are `core/links.ts` (pair identity and direction), `core/turtles.ts` (death cleanup), `core/agent-set.ts` (old iteration behavior) and `models/network-spread.ts` (compute next values before committing). Existing fixtures in `netlogo-ts/tests/core/agents.test.ts` and `netlogo-ts/tests/models/quality/network-spread.test.ts` illustrate one-hop synchronous propagation and fixed-seed reproducibility.

Decision: implement the new kernel and composition independently. Old links require one World, numeric IDs and Turtle-only nodes, allow simple mixed overlap, lack parallel keys, and use incompatible collection semantics. Its medical SIR parameter interpretation and old trajectories are not the new illustrative diffusion contract. Source licensing remains unresolved, so no code is copied and no runtime imports reach the old project. Existing public examples and new target tests establish target behavior; reading source tests is not a claim that they ran or passed here.

Source helper: <t3-thread://v2/cb5e98d1-f255-44ff-8175-d9cf75ded5d7/d5b597da-7daf-4f76-993e-cd71270dae20>.
