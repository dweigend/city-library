import { strict as assert } from "node:assert";
import { netLogoColor } from "../../../ui/index.ts";
const cells = Object.freeze([Object.freeze({ id: "seed", colorNumber: 9.9 }), Object.freeze({ id: "expired", colorNumber: 0 }), Object.freeze({ id: "cycled", colorNumber: 139.99 })]);
const project = () => cells.map(cell => ({ id: cell.id, color: netLogoColor(cell.colorNumber) }));
assert.deepEqual(project(), [{ id: "seed", color: "#ffffff" }, { id: "expired", color: "#000000" }, { id: "cycled", color: "#fefcfd" }]);
assert.deepEqual(project(), project());
assert.equal(cells[0]!.colorNumber, 9.9);
