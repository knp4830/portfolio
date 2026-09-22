import type { Site } from "@/lib/content/schema";
import { DownloadIcon } from "./art/icons";

// PDF download. CLAUDE.md: it appears on exactly two pages, the opening spread
// and the contact page.
export function ResumeButton({ resume }: { resume: Site["resume"] }) {
  return (
    <a
      href={resume.href}
      download
      className="inline-flex h-11 items-center gap-2.5 self-start rounded-chip border-[1.5px] border-huckleberry bg-paper px-[18px] text-huckleberry no-underline hover:bg-huckleberry hover:text-paper"
    >
      <DownloadIcon />
      <span className="type-label type-caps font-medium">{resume.label}</span>
      <span className="type-label">{resume.format}</span>
    </a>
  );
}
