import type { ReactNode } from "react";
import type { SpreadId } from "@/lib/notebook/spreads";

/** One spread's pages: what each spread module builds and Notebook lays out. */
export type SpreadContent = {
  spread: SpreadId;
  /** Landmark names for the left and right pages. */
  labels: [left: string, right: string];
  left: ReactNode;
  right: ReactNode;
  /** Below 1024px the spread merges into one page. */
  mobile: ReactNode;
};
