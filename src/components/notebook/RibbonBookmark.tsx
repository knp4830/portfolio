import Link from "next/link";

// The huckleberry ribbon hanging from the top edge; it always leads back to the
// table of contents. Desktop: over the right page by the spine. Mobile: top left.
export function RibbonBookmark({ label, placement }: { label: string; placement: "spread" | "page" }) {
  return (
    <Link
      href="/#contents"
      aria-label={label}
      className={`absolute block w-11 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-huckleberry ${
        placement === "spread" ? "top-[38px] left-[732px] h-[110px]" : "top-0 left-3.5 h-[50px]"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-3 w-5 bg-huckleberry [clip-path:polygon(0_0,100%_0,100%_100%,50%_calc(100%-9px),0_100%)]"
      />
    </Link>
  );
}
