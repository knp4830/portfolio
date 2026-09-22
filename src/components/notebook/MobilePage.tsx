import type { CSSProperties, ReactNode } from "react";
import { responsiveClip } from "@/lib/paper/clip";
import { MOBILE_PAGES } from "@/lib/paper/pages";

type MobilePageProps = {
  /** Which spread this page merges (below 1024px each spread is one page). */
  spread: keyof typeof MOBILE_PAGES;
  /** First page number of the spread, shown in the footer. */
  number: number;
  label: string;
  children?: ReactNode;
};

// Below 1024px: one page at a time, inside an 8px leather strip on the top,
// right, and bottom (the spine side stays open). The page grows with its content
// and the phone width, so the torn edge is re-anchored to the page's own edges
// and the baked wear is pinned to the top.
export function MobilePage({ spread, number, label, children }: MobilePageProps) {
  const spec = MOBILE_PAGES[spread];

  return (
    <div className="relative min-h-dvh bg-leather py-2 pr-2">
      <svg aria-hidden className="pointer-events-none absolute inset-0 size-full">
        <rect className="fill-none stroke-stitch opacity-80 [stroke-dasharray:5_4] [x:-10px] [y:4px] [width:calc(100%_+_6px)] [height:calc(100%_-_8px)]" />
        <rect className="fill-none stroke-leather-wear stroke-2 opacity-70 [x:-10px] [y:1px] [width:calc(100%_+_9px)] [height:calc(100%_-_2px)]" />
      </svg>
      <div
        aria-hidden
        className="absolute top-[11px] right-2 bottom-[8px] left-0 bg-[color-mix(in_srgb,var(--paper-back)_50%,var(--edge-age))]"
      />
      <section
        aria-label={label}
        className="relative min-h-[calc(100dvh-16px)] bg-paper pb-[72px] text-ink"
        style={{ clipPath: responsiveClip(spec.clip, spec.width, spec.height) }}
      >
        <div aria-hidden className="ruled absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--img-day)] bg-size-[100%_auto] bg-top bg-no-repeat night:bg-[image:var(--img-night)]"
          style={{ "--img-day": `url(${spec.textures.day})`, "--img-night": `url(${spec.textures.night})` } as CSSProperties}
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_90%_30%_at_50%_12%,var(--cast)_0%,transparent_85%)]" />
        <div className="relative px-6 pt-[56px]">{children}</div>
        <p className="type-label absolute bottom-7 left-6 text-ink-soft">p. {String(number).padStart(2, "0")}</p>
      </section>
    </div>
  );
}
