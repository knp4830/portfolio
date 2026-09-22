import assert from "node:assert/strict";
import { test } from "node:test";
import { PAGES } from "../paper/pages.ts";
import { SPREADS, TOTAL_PAGES, neighbors, pageRange, pagesOf } from "./spreads.ts";

test("spreads run in page order with no gaps", () => {
  let expected = 1;
  for (const spread of SPREADS) {
    assert.deepEqual(pagesOf(spread), [expected, expected + 1], spread);
    expected += 2;
  }
  assert.equal(TOTAL_PAGES, 12);
  assert.equal(Object.keys(PAGES).length, TOTAL_PAGES);
});

test("contact comes before the colophon", () => {
  assert.equal(pageRange("contact"), "9–10");
  assert.equal(pageRange("colophon"), "11–12");
  assert.deepEqual(neighbors("contact"), { previous: "projects", next: "colophon" });
  assert.deepEqual(neighbors("colophon"), { previous: "contact", next: undefined });
});
