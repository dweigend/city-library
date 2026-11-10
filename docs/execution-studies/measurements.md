# Measurements, bounded history and serial studies

City Library implements the `storage.history` and serial `studies.design`, `replicate`, `run` and `summarize` contracts as the binding reference specifies them, without changing that reference. History is explicitly sampled, bounded data, never complete model continuation. Export its detached `samples` through ordinary JSON serialization; no browser or I/O belongs to the history owner.

The additive `measurements.define(project)` contract makes one pure numeric projection reusable by model observations, study `measure` callbacks and UI reads. A definition owns no model state. `definition.read(model)` calls the synchronous projection once and returns a detached finite numeric record. Projection callbacks must be pure; callbacks cannot be sandboxed. Nonfinite results reject with RangeError and unsupported records with TypeError. No time or RNG changes occur in the library.

Five asserted public scripts in `tests/public-contracts/model-measurements` fix the observable behavior; the implementation must preserve them. Serial studies execute the existing World `run` protocol, sample completed boundaries, and preserve explicit failure phases and lifecycle cleanup. Hard study limits retain the values in the binding reference.

Snapshot save/load, pause/resume, Node workers, BehaviorSpace binding and calibration are separately specified capabilities that these operations do not provide; exporting the serial operations does not deliver them implicitly. Runtime preflight rejects unsupported executor and pause options instead of pretending to support them.
