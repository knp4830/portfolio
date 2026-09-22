import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  NIGHT_SELECTOR,
  SYSTEM_NIGHT_SELECTOR,
  checkContrast,
  describeSurface,
  readBlock,
  readThemes,
} from "./contrast.ts";

const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
const themes = readThemes(css);

test("day and night define the same tokens", () => {
  assert.deepEqual(Object.keys(themes.night).sort(), Object.keys(themes.day).sort());
});

test("the system dark preference uses exactly the night tokens", () => {
  assert.deepEqual(readBlock(css, SYSTEM_NIGHT_SELECTOR), readBlock(css, NIGHT_SELECTOR));
});

for (const result of checkContrast(themes)) {
  const name = `${result.theme}: --${result.fg} on ${describeSurface(result.bg)} ≥ ${result.min}:1 (${result.why})`;
  test(name, () => {
    assert.ok(result.pass, `${result.ratio.toFixed(2)}:1 is below ${result.min}:1`);
  });
}
