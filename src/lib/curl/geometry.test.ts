import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  apply,
  compose,
  constrainCorner,
  cornerPath,
  foldLine,
  foldSegment,
  foreshorten,
  mirrorX,
  polygonArea,
  progressOf,
  reflect,
  reflectionMatrix,
  restCorner,
  side,
  splitPage,
} from "./geometry.ts";

// The desktop right page and its forward-turn corner, in stage px.
const PAGE = { left: 720, top: 64, right: 1350, bottom: 904 };
const C = { x: 1350, y: 904 }; // bottom-right grab corner
const Q = { x: 90, y: 904 }; // C mirrored across the spine (x = 720)
const SPINE_TOP = { x: 720, y: 64 };
const SPINE_BOTTOM = { x: 720, y: 904 };
const AREA = 630 * 840;

const near = (actual: number, expected: number, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} ≉ ${expected}`);
const nearPoint = (a: { x: number; y: number }, b: { x: number; y: number }, tolerance = 1e-6) => {
  near(a.x, b.x, tolerance);
  near(a.y, b.y, tolerance);
};

describe("corner (the resting lifted corner)", () => {
  const P = restCorner(C, 720, 34);
  const fold = foldLine(C, P)!;

  test("P moves 34px in toward the spine and up", () => {
    assert.deepEqual(P, { x: 1316, y: 870 });
  });

  test("the fold cuts a triangle with 34px legs off the corner", () => {
    const [a, b] = foldSegment(PAGE, fold)!;
    const ends = [a, b].sort((m, n) => m.x - n.x);
    nearPoint(ends[0], { x: 1316, y: 904 });
    nearPoint(ends[1], { x: 1350, y: 870 });
  });

  test("the lifted part is that triangle and the rest stays flat", () => {
    const { flat, lifted } = splitPage(PAGE, fold);
    near(polygonArea(lifted), (34 * 34) / 2);
    near(polygonArea(flat) + polygonArea(lifted), AREA, 1e-3);
  });

  test("folding lands the corner on P", () => {
    nearPoint(reflect(C, fold), P);
  });

  test("at 60% the flap stops short of P", () => {
    const [flapTip] = foreshorten([reflect(C, fold)], fold, 0.6);
    assert.ok(side(fold, flapTip) > 0 && side(fold, flapTip) < side(fold, P));
  });

  test("P on C folds nothing", () => {
    assert.equal(foldLine(C, C), null);
  });
});

describe("mid-turn", () => {
  const P = cornerPath(C, Q, 0.5, 0.55 * 840);
  const fold = foldLine(C, P)!;

  test("the corner is over the spine, lifted 55% of the page height", () => {
    nearPoint(P, { x: 720, y: 904 - 462 });
    near(progressOf(P, C, Q), 0.5);
  });

  test("every point on the fold is as far from C as from P", () => {
    const [a, b] = foldSegment(PAGE, fold)!;
    for (const point of [a, b, fold.point]) {
      near(Math.hypot(point.x - C.x, point.y - C.y), Math.hypot(point.x - P.x, point.y - P.y), 1e-6);
    }
  });

  test("the split conserves the page and the matrix agrees with reflect()", () => {
    const { flat, lifted } = splitPage(PAGE, fold);
    near(polygonArea(flat) + polygonArea(lifted), AREA, 1e-3);
    assert.ok(polygonArea(lifted) > 0 && polygonArea(flat) > 0);
    const m = reflectionMatrix(fold);
    for (const point of lifted) nearPoint(apply(m, point), reflect(point, fold));
    nearPoint(apply(m, C), P);
  });

  test("reflecting twice is the identity", () => {
    const m = reflectionMatrix(fold);
    const twice = compose(m, m);
    [1, 0, 0, 1, 0, 0].forEach((value, i) => near(twice[i], value, 1e-9));
  });

  test("the path starts at C and ends at Q", () => {
    nearPoint(cornerPath(C, Q, 0, 462), C);
    nearPoint(cornerPath(C, Q, 1, 462), Q);
  });
});

describe("fully turned", () => {
  const fold = foldLine(C, Q)!;

  test("the fold is the spine", () => {
    near(fold.point.x, 720);
    near(Math.abs(fold.normal.x), 1);
    near(fold.normal.y, 0);
  });

  test("the whole page has lifted", () => {
    const { flat, lifted } = splitPage(PAGE, fold);
    near(polygonArea(lifted), AREA, 1e-3);
    near(polygonArea(flat), 0, 1e-3);
  });

  test("the reflection is the spine mirror, so the flap's back page lands exactly on the left page", () => {
    const m = reflectionMatrix(fold);
    const spine = mirrorX(720);
    m.forEach((value, i) => near(value, spine[i], 1e-9));
    // The flap shows the next spread's left page, pre-mirrored across the spine:
    // at a full turn the two mirrors cancel and the page sits where it belongs.
    const placed = compose(m, spine);
    [1, 0, 0, 1, 0, 0].forEach((value, i) => near(placed[i], value, 1e-9));
    near(progressOf(Q, C, Q), 1);
  });
});

describe("the spine hinge", () => {
  test("a corner inside the reachable area is left alone", () => {
    const P = { x: 1000, y: 700 };
    assert.deepEqual(constrainCorner(P, C, SPINE_TOP, SPINE_BOTTOM), P);
  });

  test("a corner pulled past the page's width from the spine is pulled back", () => {
    const P = constrainCorner({ x: 1500, y: 950 }, C, SPINE_TOP, SPINE_BOTTOM);
    assert.ok(Math.hypot(P.x - 720, P.y - 904) <= 630 + 1e-6);
  });

  test("a corner pulled too far above is held within the diagonal of the spine's top", () => {
    const P = constrainCorner({ x: 720, y: -900 }, C, SPINE_TOP, SPINE_BOTTOM);
    assert.ok(Math.hypot(P.x - 720, P.y - 64) <= Math.hypot(630, 840) + 1e-6);
    assert.ok(Math.hypot(P.x - 720, P.y - 904) <= 630 + 1e-6);
  });
});
