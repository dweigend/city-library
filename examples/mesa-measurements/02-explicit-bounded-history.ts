import assert from "node:assert/strict";
import { storage } from "city-library";

const history = storage.history({ capacity: 2 });
const values = { temperature: 20 };
history.add({ tick: 0, values });
values.temperature = 30;
history.add({ tick: 1, values: { temperature: 21 } });
history.add({ tick: 2, values: { temperature: 22 } });
assert.deepEqual(history.samples, [
  { tick: 1, values: { temperature: 21 } },
  { tick: 2, values: { temperature: 22 } },
]);
assert.deepEqual(JSON.parse(JSON.stringify(history.samples)), history.samples);
assert.throws(() => history.add({ tick: 2, values: { temperature: 23 } }), RangeError);
assert.throws(() => history.add({ tick: 3, values: { humidity: 40 } }), TypeError);
history.delete();
history.add({ tick: 0, values: { humidity: 40 } });
assert.deepEqual(history.samples, [{ tick: 0, values: { humidity: 40 } }]);
