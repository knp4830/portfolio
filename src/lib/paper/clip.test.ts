import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePolygon, responsiveClip } from "./clip.ts";

test("parses px polygons", () => {
  assert.deepEqual(parsePolygon("polygon(0px 0px, 12.5px 3px, 382px 1440px)"), [
    [0, 0],
    [12.5, 3],
    [382, 1440],
  ]);
});

test("points near the right and bottom edges measure from those edges", () => {
  assert.equal(
    responsiveClip("polygon(0px 0px, 380px 2px, 379.5px 1437px, 3px 1440px)", 382, 1440),
    "polygon(0px 0px, calc(100% - 2px) 2px, calc(100% - 2.5px) calc(100% - 3px), 3px calc(100% - 0px))",
  );
});

test("rejects anything that isn't a polygon", () => {
  assert.throws(() => parsePolygon("inset(0 0 0 0)"));
});
