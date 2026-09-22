import type { CSSProperties } from "react";
import { DESK } from "@/lib/paper/pages";

// The cabin table behind the notebook: walnut with grain and the table props
// (baked from the design), the lamp's pool of light, and the falloff toward the
// screen edges. Two arrangements from the design: the tighter 1440 one, and the
// 1920 scene that shows more of the table on wide screens. Each is drawn to cover
// the window from its center, so at the design sizes it matches exactly; at any
// other size it scales at least as much as the notebook, which only moves props
// outward — never under a page corner.

const images = (image: { day: string; night: string }) =>
  ({ "--img-day": `url(${image.day})`, "--img-night": `url(${image.night})` }) as CSSProperties;

const themed = "absolute inset-0 bg-cover bg-center bg-[image:var(--img-day)] night:bg-[image:var(--img-night)]";

export function Desk() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-desk">
      <div className={`${themed} min-[1536px]:hidden`} style={images(DESK.main)} />
      <div className={`${themed} hidden min-[1536px]:block`} style={images(DESK.scene)} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_52%_66%_at_50%_46%,var(--lamp)_0%,var(--lamp)_18%,transparent_72%),radial-gradient(ellipse_75%_85%_at_50%_46%,transparent_48%,var(--vignette)_100%)]" />
    </div>
  );
}
