import type { CSSProperties } from "react";

type ArtProps = { className?: string; style?: CSSProperties };

// Line icons from design/html; stroke follows currentColor.

/** Download arrow, 16×16. */
export function DownloadIcon({ className, style }: ArtProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden className={className} style={{stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", flexShrink: "0", ...style}}>
      <path d="M8 2.5v8" />
      <path d="M4.5 7.5 8 11l3.5-3.5" />
      <path d="M2.5 13.5h11" />
    </svg>
  );
}

/** External link, 12×12. */
export function ExternalIcon({ className, style }: ArtProps) {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden className={className} style={{stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", flexShrink: "0", ...style}}>
      <path d="M6 3.5H3.5v9h9V10" />
      <path d="M9 3h4v4M13 3 7.5 8.5" />
    </svg>
  );
}

/** Empty screenshot slot, 14×14. */
export function ImageIcon({ className, style }: ArtProps) {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden className={className} style={{stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", flexShrink: "0", ...style}}>
      <rect x="1.5" y="2.5" width="13" height="11" rx="1" />
      <circle cx="5.5" cy="6" r="1.2" />
      <path d="M1.5 11.5 5.5 8l3 2.5 2.5-2 3.5 3" />
    </svg>
  );
}

/** Empty link slot, 12×12. */
export function LinkIcon({ className, style }: ArtProps) {
  return (
    <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden className={className} style={{stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", flexShrink: "0", ...style}}>
      <path d="M6.5 9.5l3-3" />
      <path d="M7 4.5l1.2-1.2a2.6 2.6 0 0 1 3.7 3.7L10.7 8.2" />
      <path d="M9 11.5l-1.2 1.2a2.6 2.6 0 0 1-3.7-3.7L5.3 7.8" />
    </svg>
  );
}

/** Day journal, 16×16. */
export function SunIcon({ className, style }: ArtProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden className={className} style={{stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", flexShrink: "0", ...style}}>
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
    </svg>
  );
}

/** Night journal, 16×16. */
export function MoonIcon({ className, style }: ArtProps) {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden className={className} style={{stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", flexShrink: "0", ...style}}>
      <path d="M13 9.6A5.5 5.5 0 0 1 6.4 3a5.5 5.5 0 1 0 6.6 6.6Z" />
    </svg>
  );
}
