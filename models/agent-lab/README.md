# Headless Agent Lab scenario

`createTestModel` is the retained headless test scenario from the historical Agent Lab host, exercised by repository tests. The current Lab discovers modular entries under `experiments/`; this factory is not its default catalog scenario. Import it from `./model.ts`; it has no DOM, HTTP, timers or renderer dependency. Its named actions own initial-energy validation, selection, energy changes and explicit lifecycle calls through the public `city-library` entry. `read()` returns frozen scalar observations, never writable model objects.

This is deliberately outside both the library runtime and the presentation-only test environment. The energy decrement and intentional failure are test scenario rules, not general City Library behavior.
