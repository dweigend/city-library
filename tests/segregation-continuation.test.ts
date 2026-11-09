import assert from "node:assert/strict";
import { test } from "bun:test";
import { create } from "../models/segregation/model.ts";
import baseline from "./fixtures/segregation-index-baseline.json";

test("indexed Segregation preserves complete pre-index states and RNG continuation", () => {
  const model = create();
  for (let tick = 0; tick <= 3; tick++) {
    const state = model.read();
    // Process-local identities deliberately differ; every scientific value,
    // resident ordering, history sample and RNG continuation must remain exact.
    const normalized = { ...state, residents: state.residents.map(({ id: _id, ...resident }) => resident) };
    assert.deepEqual(normalized, baseline[tick]);
    if (tick < 3) model.advance();
  }
});
