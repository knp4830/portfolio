"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useRef, useState } from "react";

type ProjectSheetProps = {
  title: string;
  closeLabel: string;
  /** Where closing goes: back to the card list, scrolled to this project's card. */
  closeHref: string;
  children: ReactNode;
};

// Mobile only: a project opened from its card, as a full-height sheet over the
// list. Three ways out (DoD): the X, a swipe down from the top of the sheet, and
// the browser's back, which works because opening the sheet was a navigation.
// The swipe never blocks scrolling: it only engages when the sheet is already
// scrolled to the top and the finger moves down.

const CLOSE_DISTANCE = 120;

export function ProjectSheet({ title, closeLabel, closeHref, children }: ProjectSheetProps) {
  const router = useRouter();
  const sheet = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);
  const [pull, setPull] = useState(0);

  return (
    <div
      ref={sheet}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-10 overflow-y-auto overscroll-contain bg-paper text-ink motion-safe:animate-[sheet-in_200ms_ease-out]"
      style={{ translate: `0 ${pull}px`, transition: start.current === null ? "translate 200ms ease-out" : "none" }}
      onTouchStart={(event) => {
        start.current = sheet.current?.scrollTop === 0 ? event.touches[0].clientY : null;
      }}
      onTouchMove={(event) => {
        if (start.current === null) return;
        const distance = event.touches[0].clientY - start.current;
        setPull(distance > 0 ? distance * 0.6 : 0);
      }}
      onTouchEnd={() => {
        const pulled = pull;
        start.current = null;
        setPull(0);
        if (pulled > CLOSE_DISTANCE) router.push(closeHref, { scroll: false });
      }}
    >
      <div aria-hidden className="ruled pointer-events-none absolute inset-x-0 top-[56px] bottom-0 bg-rule" />
      <Link
        href={closeHref}
        scroll={false}
        aria-label={closeLabel}
        className="absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-chip border border-ink-soft bg-paper text-ink no-underline"
      >
        <svg aria-hidden width={20} height={20} viewBox="0 0 16 16" fill="none" className="stroke-current [stroke-linecap:round] [stroke-width:1.5]">
          <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
        </svg>
      </Link>
      <div className="relative flex flex-col px-6 pt-[56px] pb-14">{children}</div>
    </div>
  );
}
