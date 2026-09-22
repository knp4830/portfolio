import type { CSSProperties } from "react";

// A strip of translucent tape with torn ends, holding a card or a note down.
export function Tape({ width = 90, height = 22, tilt = 0, className = "", style }: {
  width?: number;
  height?: number;
  tilt?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const step = height / 5;
  const ragged = [0, 2, -2, 2.6, -0.3, 0];
  const left = ragged.map((dx, i) => `${dx}px ${round(i * step)}px`);
  const right = ragged.map((dx, i) => `${width - dx}px ${round((5 - i) * step)}px`);
  return (
    <span
      aria-hidden
      className={`absolute bg-tape ${className}`}
      style={{ width, height, rotate: `${tilt}deg`, clipPath: `polygon(${[...left, ...right].join(", ")})`, ...style }}
    />
  );
}

const round = (n: number) => Math.round(n * 10) / 10;
