import type { ReactNode } from "react";

// A hand-drawn mark attached to printed text: an underline or a loose circle.
// The strokes are the design's own (wobbly, overshooting, never perfect), drawn
// in a 100-wide box and stretched to the text with non-scaling strokes, so the
// line weight stays 2.2px whatever the word's length.

const UNDERLINES = [
  "M0.0 5.6Q8.3 4.1 12.5 4.2Q16.7 4.3 20.8 4.2Q25.0 4.0 29.2 4.1Q33.3 4.1 37.5 4.0Q41.7 3.8 45.8 4.0Q50.0 4.2 54.2 4.6Q58.3 5.0 62.5 5.3Q66.7 5.6 70.8 5.3Q75.0 4.9 79.2 4.8Q83.3 4.8 87.5 4.4Q91.7 3.9 95.8 4.0L100.0 4.0",
  "M0.0 5.5Q8.4 6.2 12.5 5.6Q16.7 5.1 20.8 5.0Q25.0 5.0 29.2 4.9Q33.3 4.8 37.5 4.2Q41.7 3.6 45.8 3.8Q50.0 4.0 54.2 3.7Q58.3 3.5 62.5 3.3Q66.7 3.2 70.8 3.4Q75.0 3.5 79.2 3.7Q83.3 3.8 87.5 3.8Q91.7 3.8 95.8 4.4L100.0 4.9"
];

const CIRCLES = [
  "M21.0 4.9Q29.4 1.3 35.4 0.6Q41.3 -0.1 47.6 -0.1Q53.8 -0.0 59.7 0.6Q65.6 1.2 70.8 2.4Q75.9 3.6 79.9 5.2Q83.9 6.9 86.7 8.7Q89.4 10.6 93.6 12.2Q97.7 13.9 98.6 16.1Q99.6 18.3 100.4 20.5Q101.3 22.8 100.2 25.1Q99.2 27.4 96.4 29.5Q93.6 31.6 89.2 33.3Q84.7 34.9 78.9 35.7Q73.0 36.4 67.5 36.9Q62.0 37.5 56.5 37.9Q51.0 38.4 45.1 38.6Q39.2 38.8 33.7 38.0Q28.1 37.2 21.7 36.7Q15.3 36.2 11.3 34.3Q7.2 32.4 3.3 30.5Q-0.6 28.5 -0.8 26.1Q-0.9 23.6 -1.4 21.3Q-1.9 19.0 -0.3 16.8Q1.3 14.6 3.7 12.5Q6.1 10.4 9.5 8.6Q12.9 6.8 16.7 4.8Q20.4 2.9 25.8 1.6Q31.2 0.2 37.6 -0.1Q44.0 -0.4 50.3 -0.6L56.7 -0.7",
  "M47.4 0.4Q59.6 0.3 65.0 1.4Q70.4 2.6 75.3 3.8Q80.2 5.0 83.3 6.9Q86.5 8.7 90.4 10.3Q94.2 11.9 95.8 14.0Q97.3 16.1 100.2 18.2Q103.1 20.4 102.2 22.7Q101.3 25.1 98.9 27.3Q96.6 29.4 92.9 31.3Q89.2 33.2 84.3 34.6Q79.5 35.9 73.5 36.4Q67.6 36.8 62.2 37.4Q56.8 38.0 51.3 37.9Q45.7 37.8 40.0 37.7Q34.3 37.6 28.5 37.1Q22.7 36.5 17.3 35.4Q12.0 34.2 7.9 32.3Q3.9 30.5 1.1 28.4Q-1.8 26.2 -1.5 23.8Q-1.2 21.4 -0.7 19.1Q-0.2 16.9 1.8 14.8Q3.8 12.6 6.5 10.6Q9.2 8.7 12.6 6.7Q16.1 4.8 20.9 3.4Q25.8 1.9 31.5 0.7Q37.1 -0.4 43.5 -0.9Q50.0 -1.4 56.3 -0.7Q62.6 -0.1 67.9 1.3Q73.1 2.6 77.9 4.0L82.7 5.4"
];

type HandMarkProps = {
  kind: "underline" | "circle";
  /** Which of the design's strokes to use, so two marks on a spread differ. */
  variant?: 0 | 1;
  children: ReactNode;
};

export function HandMark({ kind, variant = 0, children }: HandMarkProps) {
  const underline = kind === "underline";
  return (
    <span className="relative whitespace-nowrap">
      {children}
      <svg
        aria-hidden
        viewBox={underline ? "0 0 100 10" : "0 0 100 40"}
        preserveAspectRatio="none"
        className={
          underline
            ? "pointer-events-none absolute -bottom-[7px] -left-[3%] h-[10px] w-[106%] overflow-visible"
            : "pointer-events-none absolute -top-[6px] -left-[10px] h-[calc(100%+12px)] w-[calc(100%+20px)] overflow-visible"
        }
      >
        <path
          d={(underline ? UNDERLINES : CIRCLES)[variant]}
          className="fill-none stroke-huckleberry [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:2.2] [vector-effect:non-scaling-stroke]"
        />
      </svg>
    </span>
  );
}
