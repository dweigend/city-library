import { strict as assert } from "node:assert";
import { netLogoColor } from "../../../ui/index.ts";
for (const [input, expected] of [[0, "#000000"], [5, "#8d8d8d"], [9.9, "#ffffff"], [100, "#020204"], [102, "#152747"], [105, "#345da9"]] as const)
  assert.equal(netLogoColor(input), expected);
