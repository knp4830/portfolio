import type { CSSProperties } from "react";

type MarginaliaProps = {
  /** One string per handwritten line. */
  lines: string[];
  /** "ink" is huckleberry; "pencil" is ink-soft, for later or erased notes. */
  tone?: "ink" | "pencil";
  /** Degrees; each note gets its own (the brief keeps them within −4…3). */
  tilt?: number;
  /** Indent per line in px, for notes whose second line starts further in. */
  indents?: number[];
  /** Screen-reader text. Defaults to the note itself; pass null for purely decorative marks. */
  label?: string | null;
  className?: string;
  style?: CSSProperties;
};

// A handwritten note in Nanum Pen Script. Real handwriting never sits still, so
// each glyph gets its own wobble: a slow sine along the baseline plus jitter,
// a small rotation, and uneven spacing (token sheet → Handwriting). The wobble
// is seeded from the text, so a note looks the same on every render and the
// server and browser agree.
export function Marginalia({ lines, tone = "ink", tilt = -2, indents, label, className = "", style }: MarginaliaProps) {
  const text = lines.join(" ");
  const random = seeded(text);
  const phase = random() * Math.PI * 2;
  let index = 0;

  return (
    <span
      className={`type-pen inline-block origin-left ${tone === "ink" ? "text-huckleberry" : "text-ink-soft"} ${className}`}
      style={{ rotate: `${tilt}deg`, ...style }}
    >
      {label !== null && <span className="sr-only">{label ?? text}</span>}
      <span aria-hidden>
        {lines.map((line, row) => (
          <span key={row} className="block whitespace-nowrap" style={{ paddingLeft: indents?.[row] ?? 0 }}>
            {[...line].map((glyph, i) => {
              index += 1;
              if (glyph === " ") {
                return <span key={i} className="inline-block" style={{ width: round(5.4 + random() * 3) }} />;
              }
              const lift = 1.4 * Math.sin(index * 0.8 + phase) + (random() - 0.5) * 1.2;
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    transform: `translateY(${round(lift)}px) rotate(${round(random() * 6 - 3)}deg)`,
                    marginRight: round(random() * 2.1 - 0.8),
                  }}
                >
                  {glyph}
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </span>
  );
}

const round = (n: number) => Math.round(n * 10) / 10;

/** A small deterministic PRNG (FNV-1a hash → mulberry32). */
function seeded(text: string) {
  let hash = 2166136261;
  for (const char of text) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  let state = hash >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
