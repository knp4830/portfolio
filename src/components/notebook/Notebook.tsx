import type { ReactNode } from "react";
import { PAGES, type PageSpec } from "@/lib/paper/pages";
import { Desk } from "./Desk";
import { LeatherCover } from "./LeatherCover";
import { MobilePage } from "./MobilePage";
import { Page } from "./Page";

type Spread = PageSpec["spread"];

type NotebookProps = {
  spread: Spread;
  /** Landmark names for the left and right pages. */
  labels: [left: string, right: string];
  left?: ReactNode;
  right?: ReactNode;
  /** Below 1024px the spread merges into one page. */
  mobile?: ReactNode;
};

// The open notebook on the desk. At 1024px and up: the 1440×952 scene, scaled
// down to fit so the spread never scrolls (wheel input will belong to the curl).
// Below that: one merged page that scrolls normally.
export function Notebook({ spread, labels, left, right, mobile }: NotebookProps) {
  const [first, second] = Object.entries(PAGES)
    .filter(([, page]) => page.spread === spread)
    .map(([number]) => Number(number));

  return (
    <>
      <div className="stage-scale relative hidden h-dvh overflow-hidden spread:block">
        <Desk />
        <div className="absolute top-1/2 left-1/2 h-[952px] w-[1440px] -translate-1/2 scale-(--stage-scale)">
          <LeatherCover />
          <div aria-hidden className="absolute top-[70px] left-[84px] h-[838px] w-[1272px] bg-[color-mix(in_srgb,var(--rule)_55%,var(--edge-age))]" />
          <div aria-hidden className="absolute top-[67px] left-[87px] h-[840px] w-[1266px] bg-[color-mix(in_srgb,var(--paper-back)_50%,var(--edge-age))]" />
          <Page number={first} label={labels[0]}>
            {left}
          </Page>
          <Page number={second} label={labels[1]}>
            {right}
          </Page>
          <div aria-hidden className="absolute top-[64px] left-[720px] h-[840px] w-px bg-rule" />
          <div
            aria-hidden
            className="pointer-events-none absolute top-[64px] left-[90px] h-[840px] w-[1260px] bg-[radial-gradient(ellipse_60%_55%_at_50%_42%,var(--cast)_0%,transparent_80%)]"
          />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(72%_80%_at_50%_46%,transparent_62%,var(--vignette-soft)_100%)]" />
      </div>
      <div className="spread:hidden">
        <MobilePage spread={spread} number={first} label={labels[0]}>
          {mobile}
        </MobilePage>
      </div>
    </>
  );
}
