import Link from "next/link";
import type { CSSProperties } from "react";
import type { PageCopy, Project } from "@/lib/content/schema";
import type { SpreadContent } from "../spreadContent";
import { LinkIcon } from "../art/icons";
import { ProjectsArrow } from "../art/marks";
import { LicoriceFern } from "../art/specimens";
import { Marginalia } from "../Marginalia";
import { PageHeader } from "../PageHeader";
import { ProjectSheet } from "../ProjectSheet";
import { ChipRow, StackChip } from "../StackChip";
import { Tape } from "../Tape";

type ProjectsProps = {
  copy: PageCopy<"projects">;
  projects: Project[];
};

// Pages 7–8: specimen-label cards on the left, the selected project's detail on
// the right. Selection is a link to /projects/<slug>, so every project has its
// own URL, works without JavaScript, and back/forward move between selections.
// Every project's detail (and mobile sheet) is rendered once; the route's marker
// picks which one shows (data-view, see Notebook), so switching projects never
// rebuilds the page — and only an actual switch plays the fade-in.

const CARD_CHIPS = 3;

/** "In development; Phase 1 complete" → stage "In development", detail "Phase 1 complete". */
function splitStatus(status: string) {
  const [stage, detail] = status.split(/;\s*/);
  return { stage, detail: detail ?? stage };
}

const number = (project: Project) => String(project.order).padStart(2, "0");

// ————— Fitting the detail page —————
// The right page is a fixed 518×728 column. Titles and detail copy vary a lot
// between projects, so the layout is sized from the copy: estimates, erring
// toward more lines, so a spread never overflows.

const COLUMN = 518;
const VALUE_COLUMN = COLUMN - 84 - 16; // label column + gap
const LINE = 28;
/** Average glyph widths, generous on purpose (Fraunces display per em; Newsreader 15px; mono 12px). */
const TITLE_EM = 0.55;
const DETAIL_CHAR = 7.4;
const MONO_CHAR = 7.6;
/** The two "live · after launch" / "GitHub · later" slots, with the gap before them. */
const SLOTS_WIDTH = 300;

/** Largest display size (40–56px) at which the title fits on one line. */
export function titleSize(title: string) {
  return Math.max(40, Math.min(56, Math.floor(COLUMN / (title.length * TITLE_EM))));
}

const lines = (text: string, width: number, char: number) => Math.max(1, Math.ceil((text.length * char) / width));

/** Detail page layout: title size, whether the slots need their own row, and whether parts can breathe. */
function fitDetail(project: Project) {
  const size = titleSize(project.title);
  const slotsBelow = project.title.length * TITLE_EM * size + SLOTS_WIDTH > COLUMN;
  const partLines = project.details.map((part) =>
    // A two-word label ("Key decisions") wraps to two lines in its 84px column.
    Math.max(lines(part.text, VALUE_COLUMN, DETAIL_CHAR), part.label.includes(" ") ? 2 : 1),
  );
  const chipsWidth = project.stack.reduce((sum, chip) => sum + chip.name.length * MONO_CHAR + 22, 0);
  const stackLines = Math.max(1, Math.ceil(chipsWidth / VALUE_COLUMN));
  const lineageLines = project.lineage
    ? lines(project.lineage.map((step) => `${step.name} ${step.date}`).join(" → "), VALUE_COLUMN, MONO_CHAR)
    : 0;
  const available = Math.floor((728 - LINE /* header */ - 2 * LINE /* title */ - (slotsBelow ? LINE : 0)) / LINE);
  const used = partLines.reduce((a, b) => a + b, 0) + stackLines + lineageLines;
  // One blank ruled line after each part when there's room for all of them plus
  // a spare line: the page fills while every line stays on the rules.
  const breathe = available - used >= project.details.length + 1;
  return { size, slotsBelow, breathe };
}

export function projectsSpread({ copy, projects }: ProjectsProps): SpreadContent {
  const count = copy.count.replace("{count}", String(projects.length));

  const left = (
    <>
      <PageHeader label={copy.label} tag={count} meta={copy.meta} />
      <h1 className="type-display flex h-14 items-end">{copy.title}</h1>
      <div className="h-7" />
      {/* Two rows of cards run 28px past the footer line (as in the design); the cards
          sit on top so the page number tucks under the last card instead of printing over it. */}
      <div className={`relative z-10 grid gap-7 ${projects.length > 4 ? "grid-cols-3" : "grid-cols-2"}`}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} copy={copy} />
        ))}
        {projects.length < 4 && (
          <figure className="relative flex h-[308px] w-[245px] flex-col items-center justify-end pb-1">
            <LicoriceFern className="block" />
            <figcaption className="mt-1.5">
              <span className="sr-only">{copy.specimen}: </span>
              <Marginalia lines={[copy.specimenNote]} tone="pencil" tilt={-1.5} className="text-[22px]" />
            </figcaption>
          </figure>
        )}
      </div>
      <div className="absolute top-[96px] left-[330px]">
        <Marginalia lines={[copy.note]} tilt={2} />
      </div>
      <ProjectsArrow className="pointer-events-none absolute top-0 left-0 overflow-visible" />
      <Tape tilt={4} className="top-[500px] left-[360px]" />
    </>
  );

  const right = projects.map((project) => (
    <div key={project.slug} data-view={`projects:${project.slug}`} className="grow flex-col" style={{ "--view-display": "flex" } as CSSProperties}>
      <ProjectDetail project={project} copy={copy} />
    </div>
  ));

  const mobile = (
    <>
      <PageHeader label={copy.label} tag={count} meta={copy.meta} />
      <h1 className="type-display flex h-14 items-end pb-1.5">{copy.title}</h1>
      <div className="h-7" />
      <div className="flex flex-col gap-7">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} copy={copy} fluid />
        ))}
      </div>
      <div className="h-7" />
      <figure className="flex flex-col items-center">
        <LicoriceFern className="h-[146px] w-[187px]" />
        <figcaption className="mt-1.5">
          <span className="sr-only">{copy.specimen}: </span>
          <Marginalia lines={[copy.specimenNote]} tone="pencil" tilt={-1.5} className="text-[22px]" />
        </figcaption>
      </figure>
    </>
  );

  return { spread: "projects", labels: [copy.title, copy.detail.label], left, right, mobile };
}

/** Mobile: each project's full-height sheet, shown when its /projects/<slug> route is open. */
export function projectSheets({ copy, projects }: ProjectsProps) {
  return projects.map((project) => ({
    slug: project.slug,
    sheet: (
      <ProjectSheet title={project.title} closeLabel={`${copy.detail.close} ${project.title}`} closeHref={`/projects#${project.slug}`}>
        <ProjectDetail project={project} copy={copy} stacked />
      </ProjectSheet>
    ),
  }));
}

// The selected card (huckleberry border and pin) is styled from the route marker
// in CSS (see Notebook), so selection needs no re-render.
function ProjectCard({ project, copy, fluid = false }: { project: Project; copy: PageCopy<"projects">; fluid?: boolean }) {
  const shown = project.stack.slice(0, CARD_CHIPS);
  const more = project.stack.length - shown.length;
  return (
    <Link
      id={fluid ? project.slug : undefined}
      href={`/projects/${project.slug}`}
      scroll={false}
      data-card={project.slug}
      className={`relative flex h-[308px] scroll-mt-4 flex-col rounded-chip border border-ink-soft bg-paper p-3.5 text-ink no-underline hover:border-huckleberry ${
        fluid ? "w-full" : "w-[245px]"
      }`}
    >
      <span
        aria-hidden
        data-card-pin
        className="absolute -top-2 left-1/2 -ml-2 hidden size-4 rounded-full border-[3px] border-paper bg-huckleberry"
      />
      {/* Screenshot slot: a blank square until Kevin adds pictures. */}
      <span aria-hidden className="h-[70px] shrink-0 rounded-chip border border-dashed border-ink-soft" />
      <span className="mt-2.5 font-display text-[24px] leading-7 [font-variation-settings:'SOFT'_50,'WONK'_0]">{project.title}</span>
      <span className="type-card mt-1">{project.cardLine}</span>
      <span className="mt-2.5 flex flex-wrap gap-1.5">
        {shown.map((chip) => (
          <StackChip key={chip.name} name={chip.name} unconfirmed={chip.unconfirmed} tone="huckleberry" />
        ))}
        {more > 0 && <StackChip name={`+${more}`} tone="huckleberry" />}
      </span>
      <span className="grow" />
      <span className="mt-2.5 flex items-center justify-between gap-2">
        <span className="type-label whitespace-nowrap text-huckleberry">{splitStatus(project.status).stage}</span>
        <EmptySlot label={copy.card.link} />
      </span>
    </Link>
  );
}

// The selected project: problem, role, decisions, the rest of its parts, stack,
// and lineage. `stacked` puts labels above values for the mobile sheet.
function ProjectDetail({ project, copy, stacked = false }: { project: Project; copy: PageCopy<"projects">; stacked?: boolean }) {
  const { detail } = splitStatus(project.status);
  const fit = fitDetail(project);
  const slots = (
    <div className={`flex gap-2 ${stacked ? "" : fit.slotsBelow ? "h-7 items-center" : "pb-1.5"}`}>
      <EmptySlot label={copy.detail.live} />
      <EmptySlot label={copy.detail.github} />
    </div>
  );
  const row = stacked ? "flex flex-col" : "grid grid-cols-[84px_minmax(0,1fr)] gap-x-4";
  const label = `type-label type-caps text-huckleberry ${stacked ? "h-7 pt-2" : "pt-[7px]"}`;

  return (
    <>
      <PageHeader label={`${copy.detail.label} ${number(project)}`} tag={detail} meta={stacked ? undefined : project.dates} />
      <div className={stacked ? "flex flex-col" : "flex h-14 items-end justify-between"}>
        <h2
          className={`type-display ${stacked ? "flex min-h-14 items-end" : "leading-none whitespace-nowrap"}`}
          style={stacked ? undefined : { fontSize: fit.size }}
        >
          {project.title}
        </h2>
        {!stacked && !fit.slotsBelow && slots}
      </div>
      {!stacked && fit.slotsBelow && slots}
      {stacked && (
        <>
          <p className="type-body">{project.oneLiner}</p>
          <p className="type-label leading-7 text-ink-soft">
            {splitStatus(project.status).stage} · {project.dates}
          </p>
          <div className="h-7" />
          <span aria-hidden className="block aspect-[4/3] w-full rounded-chip border border-dashed border-ink-soft" />
          <div className="h-7" />
          {slots}
          <div className="h-7" />
        </>
      )}
      <dl className="flex flex-col">
        {project.details.map((part) => (
          <div key={part.label} className={`${row} ${!stacked && fit.breathe ? "mb-7" : ""}`}>
            <dt className={label}>{part.label}</dt>
            <dd className="type-detail">{part.text}</dd>
          </div>
        ))}
      </dl>
      <div className={row}>
        <div className={label}>{copy.detail.stack}</div>
        <ChipRow>
          {project.stack.map((chip) => (
            <StackChip key={chip.name} name={chip.name} unconfirmed={chip.unconfirmed} tone="huckleberry" />
          ))}
        </ChipRow>
      </div>
      {project.lineage && (
        <div className={row}>
          <div className={label}>{copy.detail.lineage}</div>
          <ol className="type-label flex min-h-7 flex-wrap items-center gap-2">
            {project.lineage.map((step, i) => (
              <li key={step.name} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden className="text-huckleberry">
                    →
                  </span>
                )}
                {stacked && step.version && <span className="text-huckleberry">{step.version}</span>}
                <span className="text-ink">{step.name}</span>
                <span className="text-ink-soft">{step.date}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}

// A dashed placeholder for a link or screenshot that doesn't exist yet. Not a
// link: CLAUDE.md says no project links until Kevin provides them.
function EmptySlot({ label }: { label: string }) {
  return (
    <span className="type-label inline-flex h-[22px] items-center gap-1.5 rounded-chip border border-dashed border-ink-soft px-2 whitespace-nowrap text-ink-soft">
      <LinkIcon />
      {label}
    </span>
  );
}
