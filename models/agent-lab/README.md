# Headless Agend Lab scenario

`createTestModel` is the application-level test scenario consumed by Agend Lab. Import it from `./model.ts`; it has no DOM, HTTP, timers or renderer dependency. Its named actions own initial-energy validation, selection, energy changes and explicit lifecycle calls through the public `city-library` entry. `read()` returns frozen scalar observations, never writable model objects.

This is deliberately outside both the library runtime and the presentation-only test environment. The energy decrement and intentional failure are test scenario rules, not general City Library behavior.
