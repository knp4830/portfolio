import type { CSSProperties, ReactNode } from "react";
import type { Site } from "@/lib/content/schema";
import { PATHS, type SpreadId, neighbors } from "@/lib/notebook/spreads";
import { responsiveClip } from "@/lib/paper/clip";
import { MOBILE_PAGES } from "@/lib/paper/pages";
import { MobileCurl } from "./curl/MobileCurl";
import { RibbonBookmark } from "./RibbonBookmark";
import { PageThemeToggle } from "./ThemeToggle";
import { FooterLinks, spreadTitle } from "./TurnLinks";

type MobilePageProps = {
  spread: SpreadId;
  site: Site;
  /** First page number of the spread, shown in the footer. */
  number: number;
  label: string;
  children?: ReactNode;
};

// Below 1024px: one page at a time, inside an 8px leather strip on the top,
// right, and bottom (the spine side stays open). The page grows with its content
// and the phone width, so the torn edge is re-anchored to the page's own edges
// and the baked wear is stretched to the page (soft wear hides the stretch; pinning
// it to the top left its bottom edge-aging band across the middle of tall pages).
// Header: ribbon, name, theme toggle. The page sits in MobileCurl, which peels it.
export function MobilePage({ spread, site, number, label, children }: MobilePageProps) {
  const spec = MOBILE_PAGES[spread];
  const { next } = neighbors(spread);

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
      <MobileCurl
        spread={spread}
        next={next && { href: PATHS[next], label: `${site.turn.next}: ${spreadTitle(site, next)}` }}
      >
      <div
        className="relative min-h-[calc(100dvh-16px)] bg-paper pb-[84px] text-ink"
        style={{ clipPath: responsiveClip(spec.clip, spec.width, spec.height) }}
      >
        <div aria-hidden className="ruled absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
        <div
          aria-hidden
          className="absolute inset-0 bg-size-[100%_100%] mix-blend-multiply"
          style={{ backgroundImage: `url(${spec.crease})`, opacity: `var(--tex-${spec.wear})` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[image:var(--img-day)] bg-size-[100%_100%] night:bg-[image:var(--img-night)]"
          style={{ "--img-day": `url(${spec.textures.day})`, "--img-night": `url(${spec.textures.night})` } as CSSProperties}
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_90%_30%_at_50%_12%,var(--cast)_0%,transparent_85%)] mix-blend-multiply" />
        <header className="relative h-[56px]">
          <RibbonBookmark label={site.ribbon} placement="page" />
          <span className="type-label absolute top-5 left-16 text-ink-soft">{site.mobileTagline}</span>
          <div className="absolute top-1.5 right-3">
            <PageThemeToggle labels={site.theme} />
          </div>
        </header>
        <main aria-label={label} className="relative px-6">
          {children}
        </main>
        {/* Clear of the lifted corner at the bottom right. */}
        <footer className="absolute right-14 bottom-7 left-6 flex items-center justify-between gap-4">
          <p className="type-label text-ink-soft">p. {String(number).padStart(2, "0")}</p>
          <FooterLinks spread={spread} site={site} />
        </footer>
      </div>
      </MobileCurl>
    </div>
  );
}
