// Page-curl geometry. Pure functions, no DOM: everything is in stage pixels (the
// 1440×952 desktop scene, or viewport pixels on mobile).
//
// The model: a page's grab corner C (its rest point) is dragged to the pointer P.
// Folding paper so C lands on P puts the crease on the perpendicular bisector of
// C and P: every point on it is equally far from both. The page is split along
// that line: the part on P's side stays flat (clipped with clip-path), the part
// on C's side lifts and is reflected across the line (one CSS matrix()).
// At a full turn P reaches Q, C's mirror across the spine, and the fold is the spine.

export type Point = { x: number; y: number };
export type Rect = { left: number; top: number; right: number; bottom: number };
/** A CSS matrix(a, b, c, d, e, f): x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Matrix = [a: number, b: number, c: number, d: number, e: number, f: number];

/** The crease: a point on it and its unit normal, pointing from C's side to P's side. */
export type Fold = { point: Point; normal: Point };

const EPSILON = 1e-6;

const sub = (a: Point, b: Point): Point => ({ x: a.x - b.x, y: a.y - b.y });
const add = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y });
const scale = (a: Point, k: number): Point => ({ x: a.x * k, y: a.y * k });
const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y;
const length = (a: Point) => Math.hypot(a.x, a.y);
export const lerp = (a: Point, b: Point, t: number): Point => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** Perpendicular bisector of C and P. Null when P sits on C (nothing is folded). */
export function foldLine(corner: Point, pointer: Point): Fold | null {
  const along = sub(pointer, corner);
  const distance = length(along);
  if (distance < EPSILON) return null;
  return { point: lerp(corner, pointer, 0.5), normal: scale(along, 1 / distance) };
}

/** Signed distance from the fold: positive on P's side (stays flat), negative on C's side (lifts). */
export const side = (fold: Fold, p: Point) => dot(sub(p, fold.point), fold.normal);

export const rectPolygon = (r: Rect): Point[] => [
  { x: r.left, y: r.top },
  { x: r.right, y: r.top },
  { x: r.right, y: r.bottom },
  { x: r.left, y: r.bottom },
];

/** Sutherland–Hodgman against one half-plane: keeps the part where side() has the given sign. */
export function clipPolygon(polygon: Point[], fold: Fold, keep: "flat" | "lifted"): Point[] {
  const inside = (p: Point) => (keep === "flat" ? side(fold, p) >= 0 : side(fold, p) <= 0);
  const out: Point[] = [];
  polygon.forEach((current, i) => {
    const previous = polygon[(i + polygon.length - 1) % polygon.length];
    const a = side(fold, previous);
    const b = side(fold, current);
    if (inside(current)) {
      if (!inside(previous)) out.push(lerp(previous, current, a / (a - b)));
      out.push(current);
    } else if (inside(previous)) {
      out.push(lerp(previous, current, a / (a - b)));
    }
  });
  return out;
}

/** The page split along the fold: `flat` stays in place, `lifted` is the part that turns. */
export function splitPage(page: Rect, fold: Fold) {
  const polygon = rectPolygon(page);
  return { flat: clipPolygon(polygon, fold, "flat"), lifted: clipPolygon(polygon, fold, "lifted") };
}

/** Where the fold crosses the page edges (the 1px crease line), or null if it misses. */
export function foldSegment(page: Rect, fold: Fold): [Point, Point] | null {
  const crossings: Point[] = [];
  const corners = rectPolygon(page);
  corners.forEach((current, i) => {
    const next = corners[(i + 1) % corners.length];
    const a = side(fold, current);
    const b = side(fold, next);
    if (Math.abs(a) < EPSILON) crossings.push(current);
    else if (a * b < 0) crossings.push(lerp(current, next, a / (a - b)));
  });
  return crossings.length >= 2 ? [crossings[0], crossings[1]] : null;
}

export function reflect(p: Point, fold: Fold): Point {
  return sub(p, scale(fold.normal, 2 * side(fold, p)));
}

/** Reflection across the fold as a CSS matrix (transform-origin 0 0): I − 2nnᵀ plus the offset. */
export function reflectionMatrix(fold: Fold): Matrix {
  const { x: nx, y: ny } = fold.normal;
  const offset = 2 * dot(fold.point, fold.normal);
  return [1 - 2 * nx * nx, -2 * nx * ny, -2 * nx * ny, 1 - 2 * ny * ny, offset * nx, offset * ny];
}

/** Reflection across the vertical line x = axis (the spine). */
export const mirrorX = (axis: number): Matrix => [-1, 0, 0, 1, 2 * axis, 0];

/** m1 ∘ m2: apply m2 first, then m1. */
export function compose(m1: Matrix, m2: Matrix): Matrix {
  const [a1, b1, c1, d1, e1, f1] = m1;
  const [a2, b2, c2, d2, e2, f2] = m2;
  return [
    a1 * a2 + c1 * b2,
    b1 * a2 + d1 * b2,
    a1 * c2 + c1 * d2,
    b1 * c2 + d1 * d2,
    a1 * e2 + c1 * f2 + e1,
    b1 * e2 + d1 * f2 + f1,
  ];
}

export const apply = ([a, b, c, d, e, f]: Matrix, p: Point): Point => ({ x: a * p.x + c * p.y + e, y: b * p.x + d * p.y + f });

/**
 * Move each point toward the fold so its distance shrinks to k of what it was.
 * A reflected flap at k < 1 reads as paper lifting off the page rather than
 * lying flat on it: the resting turn corner uses k = 0.6.
 */
export function foreshorten(points: Point[], fold: Fold, k: number): Point[] {
  return points.map((p) => sub(p, scale(fold.normal, (1 - k) * side(fold, p))));
}

/**
 * The corner's path for turns not driven by a pointer (keys, clicks, wheel):
 * straight from C to Q across the spread, lifted in an arc that peaks at
 * `lift` px mid-turn (brief: about 55% of the page height).
 */
export function cornerPath(corner: Point, mirror: Point, progress: number, lift: number): Point {
  const p = lerp(corner, mirror, progress);
  return { x: p.x, y: p.y - lift * Math.sin(Math.PI * progress) };
}

/** How far a corner at P has travelled from C toward Q, 0…1 (horizontal distance). */
export function progressOf(pointer: Point, corner: Point, mirror: Point): number {
  const total = mirror.x - corner.x;
  if (Math.abs(total) < EPSILON) return 0;
  return Math.min(1, Math.max(0, (pointer.x - corner.x) / total));
}

/**
 * A page is hinged at the spine, so the corner can't go anywhere the paper can't
 * reach: no further from the spine's bottom than the page is wide, and no
 * further from the spine's top than the page's diagonal. Pulls P back inside both.
 */
export function constrainCorner(pointer: Point, corner: Point, spineTop: Point, spineBottom: Point): Point {
  let p = pointer;
  for (const [anchor, radius] of [
    [spineBottom, length(sub(corner, spineBottom))],
    [spineTop, length(sub(corner, spineTop))],
  ] as const) {
    const offset = sub(p, anchor);
    const distance = length(offset);
    if (distance > radius) p = add(anchor, scale(offset, radius / distance));
  }
  return p;
}

/** The resting lifted corner: P pulled diagonally in by `legs` px, toward the spine and up. */
export function restCorner(corner: Point, spineX: number, legs: number): Point {
  return { x: corner.x + Math.sign(spineX - corner.x) * legs, y: corner.y - legs };
}

/** "x,y x,y …" in px, offset so the polygon is local to an element at (dx, dy). */
export function polygonCss(points: Point[], dx = 0, dy = 0): string {
  if (points.length < 3) return "polygon(0 0, 0 0, 0 0)";
  return `polygon(${points.map((p) => `${round(p.x - dx)}px ${round(p.y - dy)}px`).join(", ")})`;
}

export const matrixCss = (m: Matrix) => `matrix(${m.map((n) => round(n, 5)).join(", ")})`;

const round = (n: number, places = 2) => {
  const k = 10 ** places;
  return Math.round(n * k) / k;
};

export function polygonArea(points: Point[]): number {
  let sum = 0;
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length];
    sum += p.x * q.y - q.x * p.y;
  });
  return Math.abs(sum) / 2;
}
