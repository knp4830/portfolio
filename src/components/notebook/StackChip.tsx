// A mono label in a thin outline: moss on the skills page, huckleberry on
// projects. Unconfirmed items are dashed in pencil gray until Kevin confirms them.

type StackChipProps = {
  name: string;
  unconfirmed?: boolean;
  tone?: "moss" | "huckleberry";
};

export function StackChip({ name, unconfirmed = false, tone = "moss" }: StackChipProps) {
  const color = unconfirmed
    ? "border-dashed border-ink-soft text-ink-soft"
    : tone === "moss"
      ? "border-moss text-moss"
      : "border-huckleberry text-huckleberry";
  return (
    <span className={`type-label inline-flex h-[22px] items-center rounded-chip border px-2 whitespace-nowrap ${color}`}>
      {name}
    </span>
  );
}

/** Chips wrap in whole ruled lines: one row is 28px, two rows 56px. */
export function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-7 flex-wrap content-center items-center gap-1.5 py-[3px]">{children}</div>;
}
