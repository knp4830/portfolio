import type { CSSProperties } from "react";
import { COVER } from "@/lib/paper/pages";

// The hardcover the page block sits in: leather grain, rubbed edges, stitching,
// and spine hinge (baked from the design), plus the one soft shadow the brief
// allows so the notebook rests on the desk.
export function LeatherCover() {
  return (
    <div
      aria-hidden
      className="absolute top-[46px] left-[68px] h-[876px] w-[1304px] bg-leather bg-[image:var(--img-day)] bg-size-[100%_100%] shadow-[0_36px_70px_var(--cover-shadow),0_8px_18px_var(--cover-shadow-near)] night:bg-[image:var(--img-night)]"
      style={{ "--img-day": `url(${COVER.day})`, "--img-night": `url(${COVER.night})` } as CSSProperties}
    />
  );
}
