# Model Lab

Model Lab runs City Library models in the browser. Choose a model, set its parameters and watch what happens. The model owns state, validation and time; the Lab supplies controls, playback, selection and rendering.

## Start it

From the repository root with Bun 1.4.2:

```sh
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3101. To use another address, set `CITY_LIBRARY_UI_PORT` and optionally `CITY_LIBRARY_UI_HOST`; the port must be free. `bun run build:ui` builds the Lab and `bun run preview` serves that build.

## Run a model

Pick a model from the list or open `?model=<slug>`, for example `?model=preferential-attachment`. The Lab runs the model's setup as soon as it opens. The controls are **Reload**, **Run**/**Pause**, **Speed** and **Parameters**. **Run**/**Pause** advances the model one step per frame through its public actions; **Speed** only changes how often the Lab steps, not model time.

**Reload** runs setup again with the current values and starts a fresh run; it does not load changed source code. Setup fields prepare the next run. When you change one, the button reads **Reload with changes**. Live controls, where a model declares them, change the running model directly. Labels, layout, camera and selection are presentation state. **Model info** shows the model's description and source attribution.

When source files change, the Lab shows **Update Lab** instead of silently resetting the experiment in progress. It reloads the page with the new code; it is separate from **Reload**, which only re-runs setup.

## How models appear

The Lab lists every folder directly under `models/` that contains both `model.ts` and `ui.ts`. There is no registry to edit. A folder name must be a lowercase slug such as `rain-barrel`; a folder with only one of the two files, or with an invalid name, is listed with that problem instead of loading. Reading the list imports model metadata only; a simulation starts when you open the model.

To add your own model, start with [Your first model](../../docs/first-model.md), then follow [Write a model](../../docs/development/model-authoring.md). The [UI contract](../../docs/ui/README.md) describes what a `ui.ts` can declare. Model files never touch the page directly; shared Lab code owns rendering and cleanup.

## Checks

Run `bun run check` and `bun run build:ui` from the root. A change to the Lab or to a model's UI also needs real browser interaction and independent screenshot review under the [UI design rules](../../docs/DESIGN.md); reading the source does not establish visual acceptance.

The [shared acceptance record](acceptance/README.md) lists the checked Lab states and limits. Model Lab was earlier called Agent Lab: historical records keep that name and the path `ui/agent-lab/`, which maps to `ui/model-lab/`; the `agent-lab-*` acceptance files keep their original names and bytes. [Reference sources](../../docs/development/model-reference-sources.md) record model provenance. The `city-library` package itself excludes the Lab, reference archives and adapted models.
