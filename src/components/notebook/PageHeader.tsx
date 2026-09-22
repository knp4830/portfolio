// The mono row at the top of every page: section label, an optional outlined
// tag (version, count, status), and a note on the right. One ruled line tall.

type PageHeaderProps = {
  label: string;
  tag?: string;
  meta?: string;
};

export function PageHeader({ label, tag, meta }: PageHeaderProps) {
  return (
    <div className="flex h-7 items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="type-label type-caps text-huckleberry">{label}</span>
        {tag && <Tag>{tag}</Tag>}
      </div>
      {meta && <span className="type-label text-ink-soft">{meta}</span>}
    </div>
  );
}

export function Tag({ children }: { children: string }) {
  return (
    <span className="type-label rounded-chip border border-huckleberry px-1.5 py-px leading-[14px] text-huckleberry">
      {children}
    </span>
  );
}
