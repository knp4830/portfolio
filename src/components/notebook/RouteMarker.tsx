import type { SpreadId } from "@/lib/notebook/spreads";

type RouteMarkerProps = {
  spread: SpreadId;
  /** Projects: which project is selected. */
  project?: string;
  /** Mobile: open that project's sheet (/projects/<slug>). */
  sheet?: boolean;
};

// Each notebook route renders only this: a hidden marker naming what's showing.
// The notebook itself lives in the (notebook) layout, which Next keeps mounted
// across navigations, so turning a page never rebuilds it. CSS reads the marker
// (body:has([data-route~="…"])) to show the right spread, project, and sheet on
// first paint and without JavaScript; the page curl takes over once it's running.
export function RouteMarker({ spread, project, sheet = false }: RouteMarkerProps) {
  const tokens = [spread, `mobile:${spread}`];
  if (project) tokens.push(`projects:${project}`);
  if (project && sheet) tokens.push(`sheet:${project}`);
  return <span hidden data-route={tokens.join(" ")} />;
}
