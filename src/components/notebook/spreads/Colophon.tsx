import type { ReactNode } from "react";
import type { PageCopy, Site } from "@/lib/content/schema";
import { BisectorArrow } from "../art/marks";
import { FoldFigure } from "../art/specimens";
import { FactsPanel } from "../FactsPanel";
import { HandMark } from "../HandMark";
import { Marginalia } from "../Marginalia";
import { Notebook } from "../Notebook";
import { PageHeader } from "../PageHeader";

type ColophonProps = { site: Site; copy: PageCopy<"colophon"> };

// Pages 11–12, the last spread: how the notebook was built. The curl engine is
// the specimen here — Fig. 1 shows the fold as the perpendicular bisector of the
// corner's rest point C and the pointer P.
export function ColophonSpread({ site, copy }: ColophonProps) {
  const notes = copy.buildNotes;
  const body = copy.body.map((paragraph, i) => (
    <p key={i} className={`type-body ${i < copy.body.length - 1 ? "mb-7" : ""}`}>
      {marked(paragraph)}
    </p>
  ));

  // The drawing and its labels, at the design's 518×252.
  const drawing = (
    <div className="relative h-[252px] w-[518px]">
        <FoldFigure className="block" />
        <div aria-hidden>
          <Label x={428} y={178} tilt={-3} text={notes.figureLabels.rest} />
          <Label x={322} y={104} tilt={2} text={notes.figureLabels.pointer} />
          <Label x={76} y={204} tilt={-1} text={notes.figureLabels.mirror} />
          <Label x={471.5} y={58.2} tilt={-4} text={notes.figureLabels.fold} />
          <span className="type-label absolute top-[18px] left-[210px] text-ink-soft">{notes.figureLabels.spine}</span>
          <Label x={444} y={96} tilt={-3} text={notes.figureLabels.height} pencil />
          <Label x={317} y={220} tilt={2} text={notes.figureLabels.width} pencil />
          <div className="absolute top-[40px] left-2">
            <Marginalia lines={notes.figureLabels.scroll} tone="pencil" tilt={-2} label={null} className="text-[22px]" />
          </div>
        </div>
    </div>
  );
  const caption = <figcaption className="type-label leading-7 text-ink-soft">{notes.caption}</figcaption>;

  const left = (
    <>
      <PageHeader label={copy.label} tag={site.version} meta={copy.meta} />
      <h1 className="type-display flex h-[140px] items-end pb-2">{copy.title}</h1>
      <div className="h-7" />
      <div className="flex h-[448px] gap-5">
        <aside aria-label={copy.notesLabel} className="relative w-32 shrink-0">
          <div className="absolute top-[100px] left-0">
            <Marginalia lines={copy.notes.bisector} tilt={-3.5} />
          </div>
          <BisectorArrow className="pointer-events-none absolute top-0 left-0 overflow-visible" />
          <div className="absolute top-[330px] left-1.5">
            <Marginalia lines={copy.notes.library} tone="pencil" tilt={2} className="text-[22px]" />
          </div>
        </aside>
        <div className="w-[370px]">{body}</div>
      </div>
    </>
  );

  const right = (
    <>
      <PageHeader label={notes.label} meta={notes.meta} />
      <h2 className="type-heading flex h-14 items-end pb-1.5">{notes.figure}</h2>
      <figure>
        {drawing}
        {caption}
      </figure>
      <div className="h-7" />
      <FactsPanel facts={notes.facts} labelWidth={96} size="sm" />
    </>
  );

  const mobile = (
    <>
      <PageHeader label={copy.label} tag={site.version} meta={copy.meta} />
      <h1 className="type-display flex min-h-[112px] items-end pb-2">{copy.title}</h1>
      <div className="h-7" />
      {body}
      <div className="flex h-14 items-center">
        <Marginalia lines={[copy.notes.bisector.join(" ")]} tilt={-3} />
      </div>
      <h2 className="type-heading flex h-14 items-end pb-1.5">{notes.figure}</h2>
      {/* The drawing is 518px wide; on a phone it scales to the column (the caption doesn't). */}
      <figure className="@container w-full">
        <div className="h-[calc(252px*var(--fig-scale))] [--fig-scale:tan(atan2(100cqw,518px))]">
          <div className="origin-top-left scale-(--fig-scale)">{drawing}</div>
        </div>
        {caption}
      </figure>
      <div className="h-7" />
      <FactsPanel facts={notes.facts} labelWidth={84} size="sm" gap={12} spaced />
    </>
  );

  return (
    <Notebook
      spread="colophon"
      site={site}
      labels={[copy.title, notes.label]}
      left={left}
      right={right}
      mobile={mobile}
    />
  );
}

function Label({ x, y, tilt, text, pencil = false }: { x: number; y: number; tilt: number; text: string; pencil?: boolean }) {
  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <Marginalia lines={[text]} tone={pencil ? "pencil" : "ink"} tilt={tilt} label={null} />
    </div>
  );
}

/** Body copy marks: [[words]] get a hand-drawn underline, ((words)) a loose circle. */
function marked(paragraph: string): ReactNode[] {
  return paragraph.split(/(\[\[.+?\]\]|\(\(.+?\)\))/).map((part, i) => {
    if (part.startsWith("[[")) return <HandMark key={i} kind="underline" variant={1}>{part.slice(2, -2)}</HandMark>;
    if (part.startsWith("((")) return <HandMark key={i} kind="circle" variant={1}>{part.slice(2, -2)}</HandMark>;
    return part;
  });
}
