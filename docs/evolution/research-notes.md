# Research notes

Status: **input**, unverified. Terms follow the [status legend](README.md#status-legend). A small research agent collected these notes on 2026-11-10 from web search results. Most details come from search snippets, not from the full pages, and are **unverified**. Check them before relying on them.

## Existing engines and cores

| Project | Language | Relevant concept |
| --- | --- | --- |
| [Micropolis](https://github.com/SimHacker/micropolis) (SimCity source, GPL) | C/C++, WebAssembly build | A city simulation core without UI: traffic, power, zones, budget. The structure of its classic subsystems is a reference for concepts only, not something to recreate. |
| [A/B Street](https://a-b-street.github.io/docs/tech/dev/index.html) | Rust | Traffic as a discrete-event simulation with a priority queue, with a headless mode. Close to the existing `Agenda`. |
| Citybound | Rust | Actor model; reportedly one lane is one actor. Development is reportedly inactive. |
| [UrbanSim](https://pypi.org/project/urbansim/) | Python | Microsimulation of households, jobs and real estate; location choice. |
| MATSim | Java | Activity-based multi-agent traffic with iterative replanning. |
| [SUMO](https://sumo.dlr.de/docs) | C++ | Microscopic traffic. Far too detailed for games; a reference only. |
| OpenTTD, Simutrans | C++ | Transport games; freight and economy concepts. |
| [bitECS](https://github.com/mozilla/bitecs), Koota | TypeScript | ECS with struct-of-arrays layouts or traits and relations. Of interest for typed-array layouts, not as a framework to adopt. |

## Typical city-builder subsystems

These items are general knowledge unless a source is linked.

- **Zoning and residential/commercial/industrial demand:** aggregate supply and demand per zone type.
- **Land value:** a field built from access, services and pollution.
- **Roads and routing:** A* for single trips; hierarchical search such as [HPA*](https://webdocs.cs.ualberta.ca/%7emmueller/ps/hpastar.pdf) for large maps; [flow fields](https://howtorts.github.io/2014/01/04/basic-flow-fields.html) for many agents sharing a goal.
- **Traffic assignment:** load per edge, either aggregate or from agents.
- **Utilities and services:** reachability over graphs and coverage radii.
- **Pollution and crime:** diffusion over a grid each tick.
- **Budget:** taxes and upkeep.
- **Growth and abandonment:** buildings grow or decline.

Notes on the commercial reference games:
- SimCity (2013) used the GlassBox engine, presented at [GDC 2012](https://www.andrewwillmott.com/talks/inside-glassbox). It reportedly ran more than 10,000 simple agents.
- [Cities: Skylines II](https://paradoxinteractive.com/games/cities-skylines-ii/features/traffic-ai) reportedly chooses routes by a cost made of time, comfort, behavior and money.

## Engineering patterns for game-facing cores

- **Fixed timestep**, with interpolation for rendering ([Fix Your Timestep](https://gafferongames.com/game-physics/fix-your-timestep/)).
- **Deterministic lockstep:** Factorio sends inputs rather than state ([FFF #188](https://factorio.com/blog/post/fff-188)). This is only relevant for replays or multiplayer.
- **Commands:** player input as serializable commands that the core processes.
- **Versioned snapshots** for saving and loading.
- **Change events or diffs** for renderers instead of full state copies.
- **Large agent counts:** struct-of-arrays layouts and typed arrays. Workers and `SharedArrayBuffer` need COOP/COEP headers; no reliable game benchmarks were found.

## Not yet researched

- The Micropolis source files (`simulate.cpp`, `traffic.cpp`), for concepts only.
- GDC talks by Maxis or Colossal Order on land value, demand and traffic.
