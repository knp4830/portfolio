import type { PageCopy, Site } from "@/lib/content/schema";
import type { SpreadContent } from "../spreadContent";
import { BananaSlug } from "../art/specimens";
import { Marginalia } from "../Marginalia";
import { PageHeader } from "../PageHeader";
import { ResumeButton } from "../ResumeButton";
import { Tape } from "../Tape";

type ContactProps = { site: Site; copy: PageCopy<"contact"> };

// Pages 9–10: the back cover's closing note on a tipped-in index card, and the
// ways to reach Kevin (email, LinkedIn, GitHub, resume). Contact comes before
// the colophon but keeps its back-cover wording (Kevin, Sep 21).
export function contactSpread({ site, copy }: ContactProps): SpreadContent {
  const { backCover, contact } = copy;

  // A tipped-in index card: huckleberry header rule, then lines on the same 28px baseline.
  const card = (fixedWidth?: number) => (
    <div className="relative -rotate-[0.6deg]" style={{ width: fixedWidth ?? "100%" }}>
      <div className="relative border border-rule bg-paper px-5 pt-7 pb-[27px]">
        <span aria-hidden className="absolute inset-x-0 top-5 h-px bg-huckleberry opacity-70" />
        <span aria-hidden className="ruled absolute inset-x-0 top-7 bottom-0 bg-rule" />
        {backCover.note.map((paragraph, i) => (
          <p key={i} className={`relative type-body ${i < backCover.note.length - 1 ? "mb-7" : ""}`}>
            {paragraph}
          </p>
        ))}
      </div>
      <Tape width={90} height={24} tilt={-3} className="-top-3 left-1/2 -ml-[45px]" />
    </div>
  );

  const slug = (
    <div className="flex flex-col items-start">
      <div className="mb-1 ml-[170px]">
        <Marginalia lines={[backCover.pen]} tilt={-2.5} />
      </div>
      <figure className="flex flex-col items-start">
        <BananaSlug className="block max-w-full" />
        <figcaption className="type-label mt-2 text-ink-soft">{backCover.specimen}</figcaption>
      </figure>
    </div>
  );

  const links = (
    <ul className="flex flex-col">
      {site.links.map((link) => (
        <li key={link.id} className="flex h-[84px] flex-col">
          <span className="type-label type-caps h-7 pt-2 text-huckleberry">{link.label}</span>
          <a href={link.href} className="self-start font-body text-[20px] leading-7 text-ink decoration-ink-soft">
            {link.display}
          </a>
        </li>
      ))}
    </ul>
  );

  const left = (
    <>
      <PageHeader label={backCover.label} tag={site.version} meta={backCover.meta} />
      <h1 className="type-display flex h-[140px] items-end pb-2">{backCover.title}</h1>
      <div className="h-7" />
      {card(480)}
      <div className="grow" />
      {slug}
    </>
  );

  const right = (
    <>
      <PageHeader label={contact.label} meta={site.location} />
      <h2 className="type-display flex h-[84px] items-end pb-2">{contact.title}</h2>
      <div className="h-7" />
      {links}
      <div className="flex h-14 items-center">
        <ResumeButton resume={site.resume} />
      </div>
      <div className="h-7" />
      <p className="type-label leading-7 text-ink-soft">{contact.roles}</p>
      <p className="type-label leading-7 text-ink-soft">{contact.location}</p>
      {/* A faint pencil hint by the corner that turns to the colophon. Decorative. */}
      <div aria-hidden className="absolute top-[744px] right-[56px] opacity-24">
        <Marginalia lines={[backCover.erased]} tone="pencil" tilt={-2} label={null} />
      </div>
    </>
  );

  const mobile = (
    <>
      <PageHeader label={backCover.label} tag={site.version} meta={backCover.meta} />
      <h1 className="type-display flex min-h-[112px] items-end pb-2">{backCover.title}</h1>
      <div className="h-7" />
      {card()}
      <div className="h-14" />
      <h2 className="sr-only">{contact.title}</h2>
      {links}
      <div className="flex h-14 items-center">
        <ResumeButton resume={site.resume} />
      </div>
      <p className="type-label leading-7 text-ink-soft">{contact.location}</p>
      <div className="h-7" />
      {slug}
    </>
  );

  return { spread: "contact", labels: [backCover.label, contact.title], left: left, right: right, mobile };
}
