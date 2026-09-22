// WCAG 2.1 contrast checks for the color tokens in globals.css.
// Shared by the /tokens page and `pnpm test`, so both read the same CSS file
// and the same list of pairings. Keep this file free of imports: Node runs the
// test straight from TypeScript, and that only works for self-contained files.

export type Theme = "day" | "night";
export type Tokens = Record<string, string>;
type Rgba = { r: number; g: number; b: number; a: number };

export const DAY_SELECTOR = ':root, [data-theme="day"]';
export const NIGHT_SELECTOR = '[data-theme="night"]';
export const SYSTEM_NIGHT_SELECTOR = ':root:not([data-theme="day"])';

export const DESKTOP_QUERY = "@media (width >= 64rem)";

/**
 * Custom properties declared directly inside the first rule whose selector is
 * exactly `selector`, optionally the first one after the text `after` (e.g. a media query).
 */
export function readBlock(css: string, selector: string, after?: string): Tokens {
  const from = after === undefined ? 0 : css.indexOf(after);
  if (from === -1) throw new Error(`No "${after}" in globals.css`);
  const start = css.indexOf(`${selector} {`, from);
  if (start === -1) throw new Error(`No rule for ${selector} in globals.css`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const tokens: Tokens = {};
  for (const match of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

export function readThemes(css: string): Record<Theme, Tokens> {
  return { day: readBlock(css, DAY_SELECTOR), night: readBlock(css, NIGHT_SELECTOR) };
}

export function isColor(value: string): boolean {
  try {
    parseColor(value);
    return true;
  } catch {
    return false;
  }
}

function parseColor(value: string): Rgba {
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: 1,
    };
  }
  const rgb = value.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[/,]\s*([\d.]+%?))?\s*\)$/);
  if (rgb) {
    const alpha = rgb[4] ?? "1";
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: alpha.endsWith("%") ? Number(alpha.slice(0, -1)) / 100 : Number(alpha),
    };
  }
  throw new Error(`Can't parse color "${value}"`);
}

/** Paint `top` over an opaque `bottom`, the way the browser flattens a translucent layer. */
function over(top: Rgba, bottom: Rgba): Rgba {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a);
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a: 1 };
}

function luminance({ r, g, b }: Rgba): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * A surface is a base token with optional translucent layers on top, e.g. the
 * paper under the lamp's warm cast. `[token, opacity]` overrides a layer's
 * opacity (used for the worst-case edge darkening on worn paper).
 */
type Layer = string | [token: string, opacity: number];

export type Pairing = {
  fg: string;
  bg: Layer[];
  min: number;
  why: string;
};

// AA: 4.5 for text, 3 for large text (≥ 24px) and non-text UI such as focus rings.
export const PAIRINGS: Pairing[] = [
  { fg: "ink", bg: ["paper"], min: 4.5, why: "Headings and body" },
  { fg: "ink-soft", bg: ["paper"], min: 4.5, why: "Captions, pencil notes" },
  { fg: "huckleberry", bg: ["paper"], min: 4.5, why: "Links, tags, labels, marginalia" },
  { fg: "moss", bg: ["paper"], min: 4.5, why: "Skill chips" },
  { fg: "salal", bg: ["paper"], min: 3, why: "Large type only (≥ 24px)" },
  { fg: "huckleberry", bg: ["paper"], min: 3, why: "Focus ring on paper" },
  { fg: "ink", bg: ["paper-back"], min: 4.5, why: "Tipped-in labels, mobile summary cards" },
  { fg: "ink-soft", bg: ["paper-back"], min: 4.5, why: "Secondary text on cards" },
  { fg: "huckleberry", bg: ["paper-back"], min: 4.5, why: "Labels on cards" },
  { fg: "ink", bg: ["paper", "cast"], min: 4.5, why: "Body under the lamp's warm cast" },
  { fg: "ink-soft", bg: ["paper", "cast"], min: 4.5, why: "Captions under the lamp's warm cast" },
  { fg: "ink-soft", bg: ["paper", ["edge-age", 0.07]], min: 4.5, why: "Captions on worn paper (7% edge darkening)" },
  { fg: "desk-ink", bg: ["desk"], min: 4.5, why: "Text on the desk" },
  { fg: "desk-ink-soft", bg: ["desk"], min: 4.5, why: "Secondary text on the desk" },
  { fg: "desk-ink-soft", bg: ["desk", "lamp"], min: 4.5, why: "Secondary desk text inside the lamp pool" },
  { fg: "desk-ink", bg: ["desk"], min: 3, why: "Focus ring on the desk" },
];

export function surface(tokens: Tokens, layers: Layer[]): Rgba {
  const [base, ...rest] = layers.map((layer) => {
    const [token, opacity] = typeof layer === "string" ? [layer, undefined] : layer;
    if (!(token in tokens)) throw new Error(`Unknown token --${token}`);
    const color = parseColor(tokens[token]);
    return opacity === undefined ? color : { ...color, a: opacity };
  });
  return rest.reduce((below, layer) => over(layer, below), { ...base, a: 1 });
}

export type ContrastResult = Pairing & { theme: Theme; ratio: number; pass: boolean };

export function checkContrast(themes: Record<Theme, Tokens>): ContrastResult[] {
  return (["day", "night"] as const).flatMap((theme) =>
    PAIRINGS.map((pairing) => {
      const tokens = themes[theme];
      const ratio = contrastRatio(surface(tokens, [pairing.fg]), surface(tokens, pairing.bg));
      return { ...pairing, theme, ratio, pass: ratio >= pairing.min };
    }),
  );
}

export function describeSurface(layers: Layer[]): string {
  return layers
    .map((layer) => (typeof layer === "string" ? layer : `${layer[0]} @ ${Math.round(layer[1] * 100)}%`))
    .join(" + ");
}
