import type { Site } from "@/lib/content/schema";
import { PATHS, type SpreadId, neighbors, pagesOf } from "@/lib/notebook/spreads";
import { PageCurl } from "./curl/PageCurl";
import { Desk } from "./Desk";
import { LeatherCover } from "./LeatherCover";
import { MobilePage } from "./MobilePage";
import { Page } from "./Page";
import { RibbonBookmark } from "./RibbonBookmark";
import type { SpreadContent } from "./spreadContent";
import { DeskThemeToggle } from "./ThemeToggle";
import { spreadTitle } from "./TurnLinks";

type NotebookProps = {
  site: Site;
  current: SpreadContent;
  /** The spreads either side, rendered as hidden replicas for the page curl. */
  previous?: SpreadContent;
  next?: SpreadContent;
};

// The open notebook on the desk. At 1024px and up: the 1440×952 scene, scaled
// down to fit so the spread never scrolls (wheel input belongs to the curl).
// Below that: one merged page that scrolls normally. Both are server-rendered;
// CSS shows one, and display: none keeps the other out of the accessibility
// tree. The mobile tree comes first so in-page anchors (#contents, #v0-4)
// resolve to it; the desktop scene doesn't scroll to anchors.
export function Notebook({ site, current, previous, next }: NotebookProps) {
  const { spread } = current;
  const [first, second] = pagesOf(spread);
  const around = neighbors(spread);

  const link = (id: SpreadId | undefined, word: string) =>
    id && { href: PATHS[id], label: `${word}: ${spreadTitle(site, id)}` };
  const replica = (content: SpreadContent | undefined, side: "left" | "right") =>
    content && (
      <Page number={pagesOf(content.spread)[side === "left" ? 0 : 1]} label="" replica>
        {content[side]}
      </Page>
    );

  return (
    <>
      <div className="spread:hidden">
        <MobilePage spread={spread} site={site} number={first} label={current.labels[0]}>
          {current.mobile}
        </MobilePage>
      </div>
      <div className="stage-scale relative hidden h-dvh overflow-hidden spread:block">
        <Desk />
        <div className="absolute top-1/2 left-1/2 h-[952px] w-[1440px] -translate-1/2 scale-(--stage-scale)">
          <header className="absolute top-0 left-[90px] flex h-[46px] items-center gap-2.5">
            <span className="font-display text-[18px] text-desk-ink [font-variation-settings:'SOFT'_50,'WONK'_0]">{site.name}</span>
            <span className="type-label text-desk-ink-soft">{site.tagline}</span>
          </header>
          <div className="absolute top-px right-[90px]">
            <DeskThemeToggle labels={site.theme} />
          </div>
          <main>
            <LeatherCover />
            <div aria-hidden className="absolute top-[70px] left-[84px] h-[838px] w-[1272px] bg-[color-mix(in_srgb,var(--rule)_55%,var(--edge-age))]" />
            <div aria-hidden className="absolute top-[67px] left-[87px] h-[840px] w-[1266px] bg-[color-mix(in_srgb,var(--paper-back)_50%,var(--edge-age))]" />
            <PageCurl
              spread={spread}
              left={
                <Page number={first} label={current.labels[0]}>
                  {current.left}
                </Page>
              }
              right={
                <Page number={second} label={current.labels[1]}>
                  {current.right}
                </Page>
              }
              previousLeft={replica(previous, "left")}
              previousRight={replica(previous, "right")}
              nextLeft={replica(next, "left")}
              nextRight={replica(next, "right")}
              previous={link(around.previous, site.turn.previous)}
              next={link(around.next, site.turn.next)}
              // No lifted corner before the first page or after the last; the contents page keeps its dog-ear.
              restCorners={{ backward: !!around.previous, forward: !!around.next && spread !== "opening" }}
              turnLabel={site.turn.label}
            />
            <div aria-hidden className="pointer-events-none absolute top-[64px] left-[720px] h-[840px] w-px bg-rule" />
            <div
              aria-hidden
              className="pointer-events-none absolute top-[64px] left-[90px] h-[840px] w-[1260px] bg-[radial-gradient(ellipse_60%_55%_at_50%_42%,var(--cast)_0%,transparent_80%)] mix-blend-multiply"
            />
            <RibbonBookmark label={site.ribbon} placement="spread" />
          </main>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(72%_80%_at_50%_46%,transparent_62%,var(--vignette-soft)_100%)]" />
      </div>
    </>
  );
}
