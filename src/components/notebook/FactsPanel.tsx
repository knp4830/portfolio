// A facts grid: mono huckleberry labels, Special Elite values (typewritten field
// notes), and an optional pencil-gray reference after each value. Used for the
// skills foundations, its mobile summary card, and the colophon's build notes.

type Fact = { label: string; value: string; reference?: string };

type FactsPanelProps = {
  facts: Fact[];
  /** Label column width in px. */
  labelWidth: number;
  /** "md" is the skills set (0.88 × 18px); "sm" the smaller one (0.88 × 16px). */
  size?: "md" | "sm";
  /** Leave a blank ruled line between rows so the list fills the page. */
  spaced?: boolean;
  gap?: number;
};

export function FactsPanel({ facts, labelWidth, size = "md", spaced = false, gap = 16 }: FactsPanelProps) {
  return (
    <dl className="flex flex-col">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className={`grid ${spaced ? "mb-7" : ""}`}
          style={{ gridTemplateColumns: `${labelWidth}px minmax(0, 1fr)`, columnGap: gap }}
        >
          <dt className="type-label type-caps pt-[7px] text-huckleberry">{fact.label}</dt>
          <dd className={size === "md" ? "type-semi" : "type-semi-sm"}>
            {fact.value}
            {fact.reference && <span className="type-label text-ink-soft"> {fact.reference}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
