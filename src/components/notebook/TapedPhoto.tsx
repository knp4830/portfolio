import { Tape } from "./Tape";

// A screenshot taped into the notebook like a print: a paper border around the
// image, a slight tilt, and two strips of tape down its right side (Kevin,
// Oct 9). Dark app screenshots read as photographs this way instead of as holes
// cut in the page.
export function TapedPhoto({ src, alt, height, focus = "50% 50%", tilt = -1.2 }: {
  src: string;
  alt: string;
  /** Which part of the image stays in frame when the card crops it (object-position). */
  focus?: string;
  /** The image's height inside its paper border; the border adds 8px. */
  height: number;
  tilt?: number;
}) {
  return (
    <span className="relative block shrink-0" style={{ height: height + 8 }}>
      <span className="absolute inset-0 block border border-rule bg-paper p-1" style={{ rotate: `${tilt}deg` }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static asset, fixed box, no optimizer needed */}
        <img src={src} alt={alt} style={{ objectPosition: focus }} className="block size-full object-cover" loading="lazy" decoding="async" />
      </span>
      <Tape width={34} height={16} tilt={tilt - 62} className="-top-1.5 -right-2" />
      <Tape width={34} height={16} tilt={tilt - 62} className="-right-2 -bottom-1.5" />
    </span>
  );
}
