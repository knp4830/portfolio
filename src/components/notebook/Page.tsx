import type { CSSProperties, ReactNode } from "react";
import { PAGES } from "@/lib/paper/pages";

type PageProps = {
  /** 1–12. Odd pages sit left of the spine, even pages right. */
  number: number;
  /** Landmark name for screen readers, e.g. the section title. */
  label: string;
  children?: ReactNode;
};

// One 630×840 desktop page. Layers, bottom to top: paper, ruled lines, baked wear
// (a crease map multiplied at the wear level's opacity, then edge aging, foxing,
// stains, folds, tears — different on every page), the
// spine-side fold shade, then content on the 56px margin. The torn and chipped
// edges are a clip-path on the real DOM, so text stays selectable.
export function Page({ number, label, children }: PageProps) {
  const spec = PAGES[number];
  if (!spec) throw new Error(`No page ${number}; the notebook has pages 1–12`);
  const left = number % 2 === 1;

  return (
    <section
      aria-label={label}
      className={`absolute top-[64px] h-[840px] w-[630px] bg-paper text-ink ${left ? "left-[90px]" : "left-[720px]"}`}
      style={{ clipPath: spec.clip }}
    >
      <div aria-hidden className="ruled absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
      <div
        aria-hidden
        className="absolute inset-0 bg-size-[100%_100%] mix-blend-multiply"
        style={{ backgroundImage: `url(${spec.crease})`, opacity: `var(--tex-${spec.wear})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[image:var(--img-day)] bg-size-[100%_100%] night:bg-[image:var(--img-night)]"
        style={{ "--img-day": `url(${spec.textures.day})`, "--img-night": `url(${spec.textures.night})` } as CSSProperties}
      />
      <div aria-hidden className={`absolute inset-y-0 w-3 bg-paper-fold ${spec.gutter === "left" ? "left-0" : "right-0"}`} />
      <div className="absolute inset-0 flex flex-col p-[56px] *:shrink-0">{children}</div>
      <p className={`type-label absolute inset-x-[56px] top-[790px] text-ink-soft ${left ? "text-left" : "text-right"}`}>
        p. {String(number).padStart(2, "0")}
      </p>
    </section>
  );
}
