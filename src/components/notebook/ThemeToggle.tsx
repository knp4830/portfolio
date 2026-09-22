"use client";

import { useSyncExternalStore } from "react";
import type { Site } from "@/lib/content/schema";
import { MoonIcon, SunIcon } from "./art/icons";

// Day / night journal. prefers-color-scheme decides until the reader chooses;
// the choice sets data-theme on <html> and is remembered in localStorage (the
// only browser storage the site uses). A script in the layout applies a saved
// choice before first paint. The pressed styling comes from the night: variant,
// so it's right before this component hydrates; aria-pressed follows once it has.

type Theme = "day" | "night";
const STORAGE_KEY = "theme";

function currentTheme(): Theme {
  const forced = document.documentElement.dataset.theme;
  if (forced === "day" || forced === "night") return forced;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

function subscribe(onChange: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  media.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onChange);
  };
}

function choose(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode or storage disabled: the choice lasts for this page view.
  }
}

function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, currentTheme, () => null);
}

/** The segmented Day | Night switch on the desk (desktop). */
export function DeskThemeToggle({ labels }: { labels: Site["theme"] }) {
  const theme = useTheme();
  const button =
    "inline-flex h-[42px] items-center gap-2 px-3.5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-desk-ink";
  return (
    <div role="group" aria-label={labels.group} className="inline-flex h-11 rounded-chip border border-desk-ink-soft">
      <button
        type="button"
        aria-pressed={theme === null ? undefined : theme === "day"}
        onClick={() => choose("day")}
        className={`${button} bg-huckleberry text-paper night:bg-transparent night:text-desk-ink`}
      >
        <SunIcon />
        <span className="type-label type-caps">{labels.day}</span>
      </button>
      <button
        type="button"
        aria-pressed={theme === null ? undefined : theme === "night"}
        onClick={() => choose("night")}
        className={`${button} text-desk-ink night:bg-huckleberry night:text-paper`}
      >
        <MoonIcon />
        <span className="type-label type-caps">{labels.night}</span>
      </button>
    </div>
  );
}

/** The single icon button in the mobile page header: shows where it will take you. */
export function PageThemeToggle({ labels }: { labels: Site["theme"] }) {
  return (
    <button
      type="button"
      onClick={() => choose(currentTheme() === "night" ? "day" : "night")}
      className="inline-flex size-11 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-huckleberry"
    >
      <span className="sr-only night:hidden">{labels.toNight}</span>
      <span className="sr-only hidden night:block">{labels.toDay}</span>
      <MoonIcon className="size-5 night:hidden" />
      <SunIcon className="hidden size-5 night:block" />
    </button>
  );
}
