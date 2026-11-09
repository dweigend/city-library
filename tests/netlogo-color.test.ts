import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { netLogoColor } from "../ui/palette/netlogo-color.ts";

const binding = JSON.parse(readFileSync(new URL("../models/catalog/acceptance/urban-feedback-reference-evidence/color-bindings.json", import.meta.url), "utf8")) as {
  lookup: { rgb1400: number[][]; sha256: string };
};
const hex = (rgb: readonly number[]) => "#" + rgb.map(channel => channel.toString(16).padStart(2, "0")).join("");

test("all1400 numeric bins match independently observed official runtime RGB outputs", () => {
  expect(binding.lookup.rgb1400).toHaveLength(1400);
  for (const [index, rgb] of binding.lookup.rgb1400.entries()) {
    const color = (index + 0.25) / 10;
    expect(netLogoColor(color)).toBe(hex(rgb));
    expect(netLogoColor(color + 280)).toBe(hex(rgb));
    expect(netLogoColor(color - 280)).toBe(hex(rgb));
  }
});

test("floor boundaries and cycle wrapping retain source numeric shade distinctions", () => {
  expect(netLogoColor(100)).toBe("#020204");
  expect(netLogoColor(100.09999)).toBe("#020204");
  expect(netLogoColor(100.1)).toBe("#030407");
  expect(netLogoColor(109.9999)).toBe("#fbfcfd");
  expect(netLogoColor(-0.01)).toBe("#fefcfd");
  expect(netLogoColor(9.9)).toBe("#ffffff");
  expect(netLogoColor(140)).toBe("#000000");
});

test("invalid values fail before lookup and repeated projections remain independent", () => {
  for (const value of [NaN, Infinity, -Infinity]) expect(() => netLogoColor(value)).toThrow(RangeError);
  for (const value of ["105", null, undefined, true, {}, new Number(105)]) expect(() => netLogoColor(value as number)).toThrow(TypeError);
  const before = JSON.stringify(binding.lookup.rgb1400);
  const inputs = Object.freeze([9.9, 0, 105, -0.01]);
  const expected = ["#ffffff", "#000000", "#345da9", "#fefcfd"];
  expect(inputs.map(netLogoColor)).toEqual(expected);
  expect(inputs.map(netLogoColor)).toEqual(expected);
  expect(JSON.stringify(binding.lookup.rgb1400)).toBe(before);
});

// Declared target guard for IEEE rounding, not an observed source-engine result.
test("negative subnormal normalization stays in the final color bin", () => {
  expect(netLogoColor(-Number.MIN_VALUE)).toBe(hex(binding.lookup.rgb1400[1399]!));
  expect(netLogoColor(Number.MIN_VALUE)).toBe(hex(binding.lookup.rgb1400[0]!));
  expect(netLogoColor(-0)).toBe(netLogoColor(0));
});
