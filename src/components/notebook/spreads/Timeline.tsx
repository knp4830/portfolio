import type { PageCopy, TimelineEntry } from "@/lib/content/schema";
import type { SpreadContent } from "../spreadContent";
import { StrikeNoteMarks } from "../art/marks";
import { HandMark } from "../HandMark";
import { Marginalia } from "../Marginalia";
import { PageHeader, Tag } from "../PageHeader";

type TimelineProps = { copy: PageCopy<"timeline">; entries: TimelineEntry[] };

// Pages 3–4: eleven releases as a trail map. 001–005 on the left page, 006–011
// on the right; entries indent in a gentle wave and a dashed huckleberry trail
// joins the nodes with S-curves. The trail never crosses the spine: a pencil
// "cont. p. 4 →" bridges the pages. On mobile, one list with the trail down the edge.

const LEFT_COUNT = 5;
/** Indent of each entry on a page, in px (brief: 0 → 19 → 49 → 49 → 19, repeating). */
const WAVE = [0, 19, 49, 49, 19];
const ENTRY_HEIGHT = 112; // four ruled lines
const BASE_INDENT = 44;
/** Node x for an unindented entry, in page px (the column starts at 56). */
const NODE_X = 72;

const versionTag = (entry: TimelineEntry) => `v${entry.version}`;

export function timelineSpread({ copy, entries }: TimelineProps): SpreadContent {
  const left = entries.slice(0, LEFT_COUNT);
  const right = entries.slice(LEFT_COUNT);
  const latest = entries[entries.length - 1];
  const range = (from: TimelineEntry) => `${versionTag(from)} → ${versionTag(latest)}`;

  const leftPage = (
    <>
      <PageHeader label={copy.label} tag={range(left[0])} meta={copy.since} />
      <h1 className="type-display flex h-14 items-end">{copy.title}</h1>
      <TrailPage entries={left} top={140} latest={latest} copy={copy} />
      <div className="absolute top-[716px] left-[452px]">
        <Marginalia lines={[copy.continuedNote]} tone="pencil" tilt={-2.5} className="text-[22px]" />
      </div>
    </>
  );

  const rightPage = (
    <>
      <PageHeader label={copy.label} tag={range(right[0])} meta={copy.continued} />
      <TrailPage entries={right} top={84} latest={latest} copy={copy} />
    </>
  );

  const mobile = (
    <>
      <PageHeader label={copy.label} tag={range(entries[0])} meta={copy.since} />
      <h1 className="type-display flex h-14 items-end pb-1.5">{copy.title}</h1>
      <div className="h-7" />
      <ol className="relative">
        <span aria-hidden className="absolute top-3.5 bottom-[60px] left-2.5 border-l-2 border-dashed border-huckleberry" />
        {entries.map((entry) => {
          const now = entry === latest;
          return (
            <li key={entry.slug} className="relative mb-7 pl-10">
              <article id={entry.slug} className="flex flex-col">
                <Node now={now} className="absolute top-2 left-[5px]" />
                <div className="flex h-7 items-center gap-2 whitespace-nowrap">
                  <span className="type-label text-ink-soft">{String(entry.entry).padStart(3, "0")}</span>
                  <Tag>{versionTag(entry)}</Tag>
                  <span className="grow" />
                  <span className="type-label text-ink-soft">{entry.dates}</span>
                </div>
                <h3 className={`font-display text-[20px] leading-7 [font-variation-settings:'SOFT'_50,'WONK'_0] ${now ? "text-huckleberry" : ""}`}>
                  {now ? <HandMark kind="circle">{entry.title}</HandMark> : entry.title}
                </h3>
                <p className="font-body text-[16px] leading-7">{entry.description}</p>
                {now && (
                  <div className="flex h-7 items-center">
                    <Marginalia lines={[copy.nowNoteMobile]} tilt={-2} />
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </>
  );

  return { spread: "timeline", labels: [`${copy.title}, ${left[0].entry}–${left[left.length - 1].entry}`, `${copy.title}, ${right[0].entry}–${latest.entry}`], left: leftPage, right: rightPage, mobile };
}

type TrailPageProps = {
  entries: TimelineEntry[];
  /** Page y where the first entry starts. */
  top: number;
  latest: TimelineEntry;
  copy: PageCopy<"timeline">;
};

// One page of the trail: the entries in flow, and an SVG of nodes and S-curves
// computed from the same wave, so the trail always meets the entries.
function TrailPage({ entries, top, latest, copy }: TrailPageProps) {
  const nodes = entries.map((_, i) => ({ x: NODE_X + WAVE[i % WAVE.length], y: top + i * ENTRY_HEIGHT + 14 }));

  return (
    <>
      <ol>
        {entries.map((entry, i) => (
          <li key={entry.slug}>
            <Entry entry={entry} indent={BASE_INDENT + WAVE[i % WAVE.length]} now={entry === latest} copy={copy} />
          </li>
        ))}
      </ol>
      <svg aria-hidden width={630} height={840} className="pointer-events-none absolute top-0 left-0 overflow-visible">
        {nodes.slice(1).map((to, i) => {
          const from = nodes[i];
          const start = from.y + 9;
          const end = to.y - 9;
          const mid = (start + end) / 2;
          return (
            <path
              key={i}
              d={`M${from.x} ${start}C${from.x} ${mid} ${to.x} ${mid} ${to.x} ${end}`}
              className="fill-none stroke-huckleberry [stroke-dasharray:6_6] [stroke-linecap:round] [stroke-width:1.8]"
            />
          );
        })}
        {nodes.map((node, i) =>
          entries[i] === latest ? (
            <g key={i}>
              <circle cx={node.x} cy={node.y} r={7} className="fill-huckleberry" />
              <circle cx={node.x} cy={node.y} r={11} className="fill-none stroke-huckleberry [stroke-width:1.4]" />
            </g>
          ) : (
            <circle key={i} cx={node.x} cy={node.y} r={6} className="fill-paper stroke-huckleberry [stroke-width:1.8]" />
          ),
        )}
      </svg>
    </>
  );
}

function Entry({ entry, indent, now, copy }: { entry: TimelineEntry; indent: number; now: boolean; copy: PageCopy<"timeline"> }) {
  return (
    <article className="relative flex h-28 flex-col" style={{ paddingLeft: indent }}>
      <div className="flex h-7 items-center gap-2.5 whitespace-nowrap">
        <span className="type-label text-ink-soft">{String(entry.entry).padStart(3, "0")}</span>
        <Tag>{versionTag(entry)}</Tag>
        <h3 className={`font-display text-[20px] leading-7 [font-variation-settings:'SOFT'_50,'WONK'_0] ${now ? "text-huckleberry" : "text-ink"}`}>
          {now ? <HandMark kind="circle">{entry.title}</HandMark> : entry.title}
        </h3>
        {entry.marginalia && !entry.marginalia.includes("~~") && (
          <Marginalia lines={[entry.marginalia]} tilt={-2} className="ml-6" />
        )}
        <span className="grow" />
        <span className="type-label text-ink-soft">{entry.dates}</span>
      </div>
      <p className="h-14 font-body text-[15px] leading-7">{entry.description}</p>
      {entry.marginalia?.includes("~~") && <StrikeNote note={entry.marginalia} template={copy.strikeNote} />}
    </article>
  );
}

// "~~public health~~ CS + Econ": the struck words in pencil-thin strike marks,
// the replacement written above with a caret. Screen readers get the sentence.
function StrikeNote({ note, template }: { note: string; template: string }) {
  const [, struck = "", written = ""] = note.match(/~~(.+?)~~\s*(.*)/) ?? [];
  return (
    <div role="note" className="absolute -top-[30px] left-[350px] h-16 w-32">
      <span className="sr-only">{template.replace("{struck}", struck).replace("{written}", written)}</span>
      <div className="absolute -top-1.5 left-[22px]">
        <Marginalia lines={[written]} tilt={-4} label={null} />
      </div>
      <div className="absolute top-7 left-0">
        <Marginalia lines={[struck]} tilt={1.5} label={null} />
      </div>
      <StrikeNoteMarks className="pointer-events-none absolute top-0 left-0 overflow-visible" />
    </div>
  );
}

function Node({ now, className }: { now: boolean; className: string }) {
  return now ? (
    <span aria-hidden className={`${className} size-3 rounded-full bg-huckleberry outline-[1.4px] outline-offset-2 outline-huckleberry outline-solid`} />
  ) : (
    <span aria-hidden className={`${className} size-3 rounded-full border-[1.8px] border-huckleberry bg-paper`} />
  );
}
