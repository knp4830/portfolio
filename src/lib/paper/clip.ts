// The design's torn edges are clip-path polygons in px for one fixed page size.
// Mobile pages change size with the phone width and the content height, so each
// point is re-anchored to its nearest edge: points in the right half measure from
// the right, points in the bottom half from the bottom. Chips keep their shape
// and stay on the edge they were drawn on; only the gaps between them stretch.

type Point = [x: number, y: number];

export function parsePolygon(polygon: string): Point[] {
  const inner = polygon.match(/^polygon\((.*)\)$/)?.[1];
  if (!inner) throw new Error(`Not a polygon: ${polygon.slice(0, 40)}`);
  return inner.split(",").map((pair) => {
    const [x, y] = pair.trim().split(/\s+/).map((value) => parseFloat(value));
    if (Number.isNaN(x) || Number.isNaN(y)) throw new Error(`Bad point "${pair}"`);
    return [x, y];
  });
}

const round = (n: number) => Math.round(n * 10) / 10;

function anchor(value: number, size: number): string {
  return value <= size / 2 ? `${round(value)}px` : `calc(100% - ${round(size - value)}px)`;
}

/** Rewrites a px polygon drawn at width×height so it fits any box of the same aspect. */
export function responsiveClip(polygon: string, width: number, height: number): string {
  const points = parsePolygon(polygon).map(([x, y]) => `${anchor(x, width)} ${anchor(y, height)}`);
  return `polygon(${points.join(", ")})`;
}
