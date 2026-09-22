import type { CSSProperties } from "react";

type ArtProps = { className?: string; style?: CSSProperties };

// One-off hand-drawn marks, extracted from design/html at their page positions.
// Reusable underlines and circles live in HandMark.

/** Opening p. 1: the arrow from “start here” across to the contents. Page coordinates (630×840). */
export function StartHereArrow({ className, style }: ArtProps) {
  return (
    <svg width={630} height={840} aria-hidden className={className} style={{overflow: "visible", ...style}}>
      <path d="M500.0 142.0Q510.5 141.6 515.4 141.9Q520.4 142.2 525.3 142.8Q530.1 143.4 534.9 144.0Q539.7 144.6 544.2 145.9Q548.7 147.1 552.9 149.0Q557.1 151.0 561.2 153.0Q565.3 155.0 569.0 157.8Q572.7 160.6 576.4 163.3Q580.2 166.1 583.7 169.2Q587.2 172.4 590.5 175.9Q593.9 179.5 597.0 183.5Q600.0 187.5 603.0 191.8L606.0 196.0 M606.0 196.1Q604.0 195.0 603.1 194.3Q602.2 193.6 601.2 193.0Q600.3 192.4 599.1 192.3L597.8 192.2 M605.7 196.0Q605.5 193.8 605.6 192.7Q605.7 191.5 605.5 190.4Q605.4 189.3 604.9 188.2L604.3 187.1" style={{stroke: "var(--huckleberry)", strokeWidth: "1.8", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
    </svg>
  );
}

/** Opening p. 1: the pencil scale bar beside the fern. Page coordinates. */
export function FrondScale({ className, style }: ArtProps) {
  return (
    <svg width={630} height={840} aria-hidden className={className} style={{overflow: "visible", ...style}}>
      <path d="M559.6 560.0Q559.2 574.0 559.4 581.0Q559.6 588.0 559.6 595.0Q559.6 602.0 559.5 609.0Q559.4 616.0 559.5 623.0Q559.6 630.0 559.9 637.0Q560.1 644.0 560.1 651.0Q560.0 658.0 560.2 665.0Q560.4 672.0 560.4 679.0Q560.3 686.0 560.6 693.0Q560.8 700.0 560.8 707.0Q560.7 714.0 560.4 721.0Q560.1 728.0 560.2 735.0Q560.3 742.0 560.3 749.0Q560.2 756.0 559.9 763.0Q559.6 770.0 559.5 777.0L559.5 784.0 M554 560H566 M554 784H566" style={{stroke: "var(--ink-soft)", strokeWidth: "1.2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
    </svg>
  );
}

/** Timeline 004: the caret and the double strike through “public health”. 128×64. */
export function StrikeNoteMarks({ className, style }: ArtProps) {
  return (
    <svg width={128} height={64} aria-hidden className={className} style={{overflow: "visible", ...style}}>
      <path d="M17.8 29.8Q20.1 27.5 21.1 26.3Q22.1 25.1 23.1 23.8Q24.0 22.5 24.9 21.2L25.8 19.8 M25.8 20.2Q28.2 22.3 29.1 23.7Q30.0 25.0 30.9 26.3Q31.8 27.7 33.0 28.8L34.1 29.9" style={{stroke: "var(--huckleberry)", strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
      <path d="M-2.0 42.5Q7.1 42.8 11.6 42.4Q16.1 41.9 20.7 42.4Q25.2 42.9 29.8 43.0Q34.3 43.0 38.8 42.6Q43.4 42.1 47.9 42.7Q52.5 43.2 57.0 43.1Q61.6 43.1 66.1 43.2Q70.6 43.3 75.2 43.5Q79.7 43.7 84.3 43.6Q88.8 43.5 93.3 42.9Q97.9 42.3 102.4 42.4Q107.0 42.5 111.5 42.2L116.0 41.9 M-0.0 46.9Q11.2 45.6 16.8 45.5Q22.4 45.4 28.0 45.9Q33.6 46.4 39.2 46.3Q44.8 46.2 50.4 46.3Q56.0 46.5 61.6 46.7Q67.2 47.0 72.8 46.5Q78.4 46.0 84.0 46.1Q89.6 46.2 95.2 45.6Q100.8 45.0 106.4 44.4L112.0 43.9" style={{stroke: "var(--huckleberry)", strokeWidth: "1.8", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
    </svg>
  );
}

/** Projects p. 7: the arrow from “shipping this one” to the selected card. Page coordinates. */
export function ProjectsArrow({ className, style }: ArtProps) {
  return (
    <svg width={630} height={840} aria-hidden className={className} style={{overflow: "visible", ...style}}>
      <path d="M360.0 132.0Q349.9 135.2 345.5 137.4Q341.1 139.6 337.2 142.3Q333.4 145.1 330.4 148.5Q327.4 151.9 325.0 155.9Q322.7 159.9 321.4 164.8Q320.0 169.7 319.0 174.8L318.0 180.0 M318.0 180.0Q316.9 178.0 316.7 176.9Q316.5 175.8 316.3 174.6Q316.0 173.5 315.3 172.6L314.6 171.7 M318.1 180.1Q319.6 178.4 320.2 177.4Q320.7 176.4 321.6 175.7Q322.4 174.9 323.3 174.2L324.1 173.4" style={{stroke: "var(--huckleberry)", strokeWidth: "1.8", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
    </svg>
  );
}

/** Colophon: the arrow from “a fold is a bisector” to the body text. Margin column coordinates (128×560). */
export function BisectorArrow({ className, style }: ArtProps) {
  return (
    <svg width={128} height={560} aria-hidden className={className} style={{overflow: "visible", ...style}}>
      <path d="M98.0 150.0Q107.9 150.9 112.6 151.6Q117.4 152.3 121.7 154.1Q125.9 155.8 129.7 158.4Q133.5 161.0 136.7 164.5Q140.0 168.0 143.0 172.0L146.0 176.0 M146.0 176.0Q144.0 174.9 142.8 174.8Q141.7 174.7 140.5 174.7Q139.4 174.6 138.3 174.2L137.3 173.9 M146.3 175.9Q145.3 173.8 144.9 172.8Q144.6 171.7 144.7 170.5Q144.8 169.4 144.5 168.3L144.3 167.2" style={{stroke: "var(--huckleberry)", strokeWidth: "1.7", fill: "none", strokeLinecap: "round", strokeLinejoin: "round"}} />
    </svg>
  );
}

/** Contents page: the folded bottom-right corner. 56×56. */
export function DogEar({ className, style }: ArtProps) {
  return (
    <svg width={56} height={56} aria-hidden className={className} style={style}>
      <polygon points="56,0 0,56 0,0" style={{fill: "var(--paper-back)", stroke: "var(--rule)", strokeWidth: "1"}} />
      <path d="M17 7L6 28" style={{stroke: "var(--foxing)", strokeWidth: "1", opacity: "0.35"}} />
    </svg>
  );
}
