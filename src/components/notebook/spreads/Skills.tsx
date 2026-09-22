import type { PageCopy, Site, Skills } from "@/lib/content/schema";
import { Beaver } from "../art/specimens";
import { FactsPanel } from "../FactsPanel";
import { Marginalia } from "../Marginalia";
import { Notebook } from "../Notebook";
import { PageHeader } from "../PageHeader";
import { ChipRow, StackChip } from "../StackChip";

type SkillsProps = { site: Site; copy: PageCopy<"skills">; skills: Skills };

// Pages 5–6: tool groups as moss stack chips (each with where it was used), and
// foundations & practice as a typewritten facts grid tagged with the timeline
// version it came from. Mobile: the groups, then the foundations as a card.
export function SkillsSpread({ site, copy, skills }: SkillsProps) {
  const facts = skills.foundations.map((item) => ({ label: item.name, value: item.detail, reference: item.from }));

  const groups = skills.groups.map((group) => (
    <section key={group.name} aria-label={group.name} className="mb-7 flex flex-col">
      <div className="flex h-7 items-center justify-between gap-2">
        <h3 className="type-label type-caps text-huckleberry">{group.name}</h3>
        <span className="type-label whitespace-nowrap text-ink-soft">{group.usedIn}</span>
      </div>
      <ChipRow>
        {group.items.map((item) => (
          <StackChip key={item.name} name={item.name} unconfirmed={item.unconfirmed} />
        ))}
      </ChipRow>
    </section>
  ));

  const left = (
    <>
      <PageHeader label={copy.label} tag={copy.tag} meta={copy.meta} />
      <h1 className="type-display flex h-14 items-end">{copy.title}</h1>
      <div className="h-7" />
      {groups}
      <div className="absolute top-[96px] left-[330px]">
        <Marginalia lines={[copy.note]} tilt={-2.5} />
      </div>
      <div className="absolute top-[592px] left-[400px]" role="img" aria-label={copy.specimen}>
        <Beaver className="block" />
      </div>
      <p aria-hidden className="type-label absolute top-[770px] right-[56px] text-ink-soft">
        {copy.specimen}
      </p>
    </>
  );

  const right = (
    <>
      <PageHeader label={copy.foundations.label} meta={copy.foundations.meta} />
      <h2 className="type-heading flex h-14 items-end pb-1.5">{copy.foundations.title}</h2>
      <div className="h-7" />
      <FactsPanel facts={facts} labelWidth={112} spaced />
    </>
  );

  const mobile = (
    <>
      <PageHeader label={copy.label} tag={copy.tag} meta={copy.meta} />
      <h1 className="type-display flex h-14 items-end pb-1.5">{copy.title}</h1>
      <div className="h-7" />
      {groups}
      <section aria-label={copy.foundations.title} className="flex flex-col border border-rule bg-paper-back p-3.5">
        <h2 className="type-label type-caps h-7 pt-1.5 text-huckleberry">{copy.foundations.title}</h2>
        <FactsPanel facts={facts} labelWidth={84} size="sm" gap={12} spaced />
      </section>
      <div className="h-7" />
      <figure className="flex flex-col items-center">
        <Beaver className="h-[178px] w-[150px]" />
        <figcaption className="type-label mt-1.5 text-ink-soft">{copy.specimen}</figcaption>
      </figure>
    </>
  );

  return (
    <Notebook
      spread="skills"
      site={site}
      labels={[copy.title, copy.foundations.title]}
      left={left}
      right={right}
      mobile={mobile}
    />
  );
}
