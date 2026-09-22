import Link from "next/link";
import type { PageCopy, Site } from "@/lib/content/schema";
import type { SpreadContent } from "../spreadContent";
import { PATHS, SPREADS, type SectionId, TOTAL_PAGES, pageRange } from "@/lib/notebook/spreads";
import { ExternalIcon } from "../art/icons";
import { DogEar, FrondScale, StartHereArrow } from "../art/marks";
import { SwordFern } from "../art/specimens";
import { HandMark } from "../HandMark";
import { Marginalia } from "../Marginalia";
import { PageHeader } from "../PageHeader";
import { ResumeButton } from "../ResumeButton";

type OpeningProps = { site: Site; copy: PageCopy<"opening"> };

const SOFT_HEADING = "[font-variation-settings:'SOFT'_50,'WONK'_0]";

// Pages 1–2: whose notebook this is, the positioning line, the resume, and the
// table of contents.
export function openingSpread({ site, copy }: OpeningProps): SpreadContent {
  const linkedin = site.links.find((link) => link.id === "linkedin");
  const sections = SPREADS.filter((id): id is SectionId => id !== "opening");

  const property = (compact: boolean) => (
    <div
      className={`flex flex-col justify-center border border-ink-soft bg-paper py-2.5 ${
        compact ? "h-[84px] w-[230px] -rotate-[0.8deg] px-3.5" : "h-[84px] w-[280px] -rotate-[0.6deg] px-4"
      }`}
    >
      <span className="type-label type-caps text-huckleberry">{copy.propertyOf}</span>
      <span className={`font-display ${SOFT_HEADING} ${compact ? "text-[24px] leading-8" : "text-[28px] leading-9"}`}>
        {site.name}
      </span>
    </div>
  );

  const headline = (
    <h1 className="type-display tracking-[-0.012em]">
      {copy.headline} <HandMark kind="underline">{copy.headlineMarked}</HandMark>
    </h1>
  );

  const linkedinLink = (className = "") =>
    linkedin && (
    <a href={linkedin.href} className={`type-label inline-flex h-7 items-center gap-1.5 ${className}`}>
      {linkedin.display}
      <ExternalIcon />
    </a>
    );

  const contents = (
    <nav aria-label={copy.contents.title} className="flex flex-col">
      {sections.map((id, i) => (
        <ContentsEntry
          key={id}
          number={i + 1}
          href={PATHS[id]}
          title={site.sections[id].title}
          subtitle={site.sections[id].subtitle}
          range={pageRange(id)}
          jump={copy.contents.jump}
        />
      ))}
    </nav>
  );

  const left = (
    <>
      <PageHeader label={copy.entry} tag={site.version} meta={site.location} />
      <div className="flex h-28 items-center">{property(false)}</div>
      <div className="flex h-[196px] items-end pb-2.5">{headline}</div>
      <p className="type-body h-14 max-w-[470px]">{copy.line}</p>
      <div className="h-7" />
      <div className="flex h-14 items-center">
        <ResumeButton resume={site.resume} />
      </div>
      <div className="flex grow items-end justify-between">
        {linkedinLink()}
        <div className="mr-10" role="img" aria-label={copy.specimen}>
          <SwordFern className="block" />
        </div>
      </div>
      <div className="absolute top-[122px] left-[392px]">
        <Marginalia lines={[copy.startHere]} tilt={-3} />
      </div>
      <StartHereArrow className="pointer-events-none absolute top-0 left-0 overflow-visible" />
      {/* The scale bar and its note sit toward the spine, clear of the fern's leaves. */}
      <FrondScale className="pointer-events-none absolute top-0 left-[38px] overflow-visible" />
      <div className="absolute top-[640px] left-[522px]">
        <Marginalia lines={copy.specimenNote} tone="pencil" tilt={-2} indents={[0, 3]} className="text-[22px]" />
      </div>
    </>
  );

  const right = (
    <>
      <PageHeader
        label={copy.contents.label}
        meta={copy.contents.count.replace("{sections}", String(sections.length)).replace("{pages}", String(TOTAL_PAGES))}
      />
      <h2 className="type-heading flex h-14 items-end pb-1.5">
        {copy.contents.title}
      </h2>
      <div className="h-7" />
      {contents}
      <div className="h-7" />
      <p className="type-label leading-7 text-ink-soft">{copy.contents.hint}</p>
      {/* By the grab corner that turns to the timeline: how to turn the page. */}
      <div className="absolute top-[744px] right-[56px]">
        <Marginalia lines={[copy.contents.drag]} tilt={-2} />
      </div>
      <DogEar className="absolute top-[784px] left-[574px]" />
    </>
  );

  const mobile = (
    <div className="flex flex-col">
      <PageHeader label={copy.entry} tag={site.version} meta={site.location} />
      <div className="h-7" />
      <div className="flex h-28 items-start justify-between">
        {property(true)}
        <div role="img" aria-label={copy.specimen}>
          <SwordFern className="h-[106px] w-[70px]" />
        </div>
      </div>
      <div className="flex min-h-[140px] items-end pb-2">{headline}</div>
      <p className="type-body">{copy.line}</p>
      <div className="h-7" />
      <div className="flex h-14 items-center">
        <ResumeButton resume={site.resume} />
      </div>
      <div className="flex h-14 items-center pl-2">
        <Marginalia lines={[copy.startHereMobile]} tilt={-2} />
      </div>
      <h2 id="contents" className="type-heading flex h-14 items-end pb-1.5">
        {copy.contents.title}
      </h2>
      <div className="h-7" />
      {contents}
      <div className="h-7" />
      {linkedinLink("self-start")}
    </div>
  );

  return { spread: "opening", labels: [site.name, copy.contents.title], left: left, right: right, mobile };
}

type ContentsEntryProps = { number: number; href: string; title: string; subtitle: string; range: string; jump: string };

// One contents line. Hover or keyboard focus marks it: the title turns huckleberry
// over a highlighter swash, the leader and page range tint, and "jump →" appears.
function ContentsEntry({ number, href, title, subtitle, range, jump }: ContentsEntryProps) {
  const marked = "group-hover:text-huckleberry group-focus-visible:text-huckleberry";
  return (
    <Link href={href} className="group grid min-h-[84px] grid-cols-[40px_minmax(0,1fr)] text-ink no-underline">
      <span className={`font-display text-[28px] leading-[56px] text-huckleberry ${SOFT_HEADING}`}>{number}</span>
      <span className="flex min-w-0 flex-col">
        <span className="flex h-14 items-end pb-2">
          <span className={`relative z-0 font-display text-[28px] leading-[1.15] whitespace-nowrap ${SOFT_HEADING} ${marked}`}>
            <span
              aria-hidden
              className="absolute top-[52%] -right-2.5 -bottom-px -left-2 -z-10 -rotate-[1.2deg] rounded-[3px] bg-huckleberry opacity-0 group-hover:opacity-16 group-focus-visible:opacity-16 night:group-hover:opacity-22 night:group-focus-visible:opacity-22"
            />
            {title}
          </span>
          <span
            aria-hidden
            className="type-label ml-2.5 pb-1 text-huckleberry opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {jump}
          </span>
          <span
            aria-hidden
            className="mx-3 mb-[7px] grow border-b border-dotted border-ink-soft group-hover:border-huckleberry group-focus-visible:border-huckleberry"
          />
          <span className={`type-label pb-[3px] whitespace-nowrap text-ink-soft ${marked}`}>pp. {range}</span>
        </span>
        <span className="type-label min-h-7 pt-1 text-ink-soft">{subtitle}</span>
      </span>
    </Link>
  );
}
