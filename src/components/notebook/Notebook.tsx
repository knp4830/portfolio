import { PATHS, SPREADS, type SpreadId, neighbors, pagesOf } from "@/lib/notebook/spreads";
import { PageCurl } from "./curl/PageCurl";
import { Desk } from "./Desk";
import { DeskContents } from "./DeskContents";
import { LeatherCover } from "./LeatherCover";
import { MobilePage } from "./MobilePage";
import { Page } from "./Page";
import { buildNotebook } from "./buildNotebook";
import { RibbonBookmark } from "./RibbonBookmark";
import { DeskThemeToggle } from "./ThemeToggle";
import { spreadTitle } from "./TurnLinks";

// The whole notebook, rendered once in the (notebook) layout — which Next keeps
// mounted across navigations — so a page turn never rebuilds it. All twelve
// desktop pages sit in the page curl, which gives each one a role (this spread,
// the back of the turning page, the page beneath, or off); the page that lands
// at the end of a turn is the very element that was already on screen.
//
// Which spread, project, and mobile sheet show comes from the route's marker
// (RouteMarker) through the rules below, so the right page is there on first
// paint and without JavaScript. Mobile renders one merged page per spread.
export async function Notebook() {
  const { site, spreads, projects, sheets } = await buildNotebook();

  const views = [
    ...SPREADS.map((id) => `mobile:${id}`),
    ...projects.map((project) => `projects:${project.slug}`),
    ...projects.map((project) => `sheet:${project.slug}`),
  ];
  const on = (token: string) => `body:has([data-route~="${token}"])`;
  const css = [
    `[data-view]{display:none}`,
    ...views.map((view) => `${on(view)} [data-view="${view}"]{display:var(--view-display,block)}`),
    // Desktop pages before the curl takes over (and without JavaScript): only this spread.
    `[data-page-spread]{visibility:hidden}`,
    ...SPREADS.map((id) => `${on(id)} [data-page-spread="${id}"]{visibility:visible}`),
    // Away from the projects routes, page 8 still shows the first project, so a
    // turn toward it (from skills or contact) already has Minced on the page —
    // exactly what lands at /projects.
    `body:not(:has([data-route*="projects:"])) [data-view="projects:${projects[0].slug}"]{display:var(--view-display,block)}`,
    `body:not(:has([data-route*="projects:"])) [data-card="${projects[0].slug}"]{border-color:var(--huckleberry);border-width:1.5px}`,
    `body:not(:has([data-route*="projects:"])) [data-card="${projects[0].slug}"] [data-card-pin]{display:block}`,
    // The contents box for the spread on screen (DeskContents).
    ...SPREADS.filter((id) => id !== "opening").map(
      (id) => `${on(id)} [data-jump="${id}"]{border-color:var(--desk-ink);background:var(--desk-ink);color:var(--desk)}`,
    ),
    // The selected project's card: huckleberry border and pin.
    ...projects.map(
      ({ slug }) =>
        `${on(`projects:${slug}`)} [data-card="${slug}"]{border-color:var(--huckleberry);border-width:1.5px}` +
        `${on(`projects:${slug}`)} [data-card="${slug}"] [data-card-pin]{display:block}`,
    ),
  ].join("\n");

  const link = (id: SpreadId | undefined, word: string) => id && { href: PATHS[id], label: `${word}: ${spreadTitle(site, id)}` };
  const links = Object.fromEntries(
    SPREADS.map((id) => {
      const { previous, next } = neighbors(id);
      return [id, { previous: link(previous, site.turn.previous), next: link(next, site.turn.next) }];
    }),
  ) as Record<SpreadId, { previous?: { href: string; label: string }; next?: { href: string; label: string } }>;

  const pages = spreads.flatMap((content) => {
    const [first, second] = pagesOf(content.spread);
    return [
      { number: first, spread: content.spread, node: <Page number={first} label={content.labels[0]}>{content.left}</Page> },
      { number: second, spread: content.spread, node: <Page number={second} label={content.labels[1]}>{content.right}</Page> },
    ];
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="spread:hidden">
        {spreads.map((content) => (
          <div key={content.spread} data-view={`mobile:${content.spread}`}>
            <MobilePage spread={content.spread} site={site} number={pagesOf(content.spread)[0]} label={content.labels[0]}>
              {content.mobile}
            </MobilePage>
          </div>
        ))}
        {sheets.map(({ slug, sheet }) => (
          <div key={slug} data-view={`sheet:${slug}`}>
            {sheet}
          </div>
        ))}
      </div>
      <div className="stage-scale relative hidden h-dvh overflow-hidden spread:block">
        <Desk />
        <div className="absolute top-1/2 left-1/2 h-[952px] w-[1440px] -translate-1/2 scale-(--stage-scale)">
          <header className="absolute top-0 left-[90px] flex h-[46px] items-center gap-2.5">
            <span className="font-display text-[18px] text-desk-ink [font-variation-settings:'SOFT'_50,'WONK'_0]">{site.name}</span>
            <span className="type-label text-desk-ink-soft">{site.tagline}</span>
          </header>
          <div className="absolute top-px right-[90px] flex items-center gap-5">
            <DeskContents site={site} />
            <DeskThemeToggle labels={site.theme} />
          </div>
          <main>
            <LeatherCover />
            <div aria-hidden className="absolute top-[70px] left-[84px] h-[838px] w-[1272px] bg-[color-mix(in_srgb,var(--rule)_55%,var(--edge-age))]" />
            <div aria-hidden className="absolute top-[67px] left-[87px] h-[840px] w-[1266px] bg-[color-mix(in_srgb,var(--paper-back)_50%,var(--edge-age))]" />
            <PageCurl pages={pages} links={links} turnLabel={site.turn.label} />
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
