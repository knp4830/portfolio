import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import {
  DESKTOP_QUERY,
  type Theme,
  type Tokens,
  checkContrast,
  describeSurface,
  isColor,
  readBlock,
  readThemes,
} from "@/lib/tokens/contrast";

// M0.2 token test page: renders every token from globals.css in both themes,
// plus the contrast checks `pnpm test` runs. Values are read from the CSS file
// at build time, so this page can't drift from the tokens. Not linked from the site.

export const metadata: Metadata = {
  title: "Tokens",
  robots: { index: false, follow: false },
};

const css = readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
const themes = readThemes(css);
const contrast = checkContrast(themes);
const grid = readBlock(css, ":root");
const gridDesktop = readBlock(css, ":root", DESKTOP_QUERY);

// Neutral specimen text: site copy lives in content/, not here.
const SAMPLE = "Sphinx of black quartz, judge my vow";

const TYPE_ROLES = [
  { className: "type-display", face: "Fraunces 500 · SOFT 100 · WONK 1 · opsz 144" },
  { className: "type-heading", face: "Fraunces 400 · SOFT 50 · WONK 0" },
  { className: "type-body", face: "Newsreader 400 · on the 28px line" },
  { className: "type-detail", face: "Newsreader 400 · project detail values" },
  { className: "type-card", face: "Newsreader 400 · 15/22, off-grid in cards" },
  { className: "type-semi", face: "Special Elite 400 · 0.88× · Patrick Hand fallback" },
  { className: "type-label", face: "JetBrains Mono 400 · 12/16" },
  { className: "type-label type-caps", face: "JetBrains Mono 400 · caps +0.08em" },
  { className: "type-pen text-huckleberry", face: "Nanum Pen Script · marginalia" },
] as const;

export default function TokensPage() {
  return (
    <main className="grid grid-cols-[minmax(0,1fr)] spread:grid-cols-2">
      {(["day", "night"] as const).map((theme) => (
        <ThemePanel key={theme} theme={theme} />
      ))}
    </main>
  );
}

function ThemePanel({ theme }: { theme: Theme }) {
  const tokens = themes[theme];
  const colors = Object.entries(tokens).filter(([, value]) => isColor(value));
  const numbers = Object.entries(tokens).filter(([, value]) => !isColor(value));
  const results = contrast.filter((result) => result.theme === theme);
  const failures = results.filter((result) => !result.pass).length;

  return (
    <section data-theme={theme} aria-labelledby={`${theme}-title`} className="min-w-0 bg-desk p-page text-desk-ink [overflow-wrap:anywhere]">
      <h1 id={`${theme}-title`} className="type-heading">
        {theme === "day" ? "Day journal" : "Night journal"}
      </h1>
      <p className="type-label type-caps mt-2 text-desk-ink-soft">
        data-theme=&quot;{theme}&quot; · {results.length - failures}/{results.length} contrast checks pass
      </p>

      <Paper title="Color">
        <ul className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 sm:gap-x-7">
          {colors.map(([name, value]) => (
            <li key={name} className="flex items-center gap-3 py-1.5">
              <span
                aria-hidden
                className="size-10 shrink-0 rounded-chip border border-rule"
                style={{ background: `var(--${name})` }}
              />
              <span className="min-w-0">
                <span className="type-label block text-ink">--{name}</span>
                <span className="type-label block text-ink-soft">{value}</span>
              </span>
            </li>
          ))}
        </ul>
        <TokenList tokens={Object.fromEntries(numbers)} label="Texture opacity by wear" />
      </Paper>

      <Paper title="Type">
        <ul>
          {TYPE_ROLES.map((role) => (
            <li key={role.className} className="border-b border-rule py-3 last:border-b-0">
              <p className="type-label type-caps text-huckleberry">
                .{role.className.split(" ").slice(0, 2).join(" .")}
              </p>
              <p className="type-label text-ink-soft">{role.face}</p>
              <p className={`${role.className} mt-2 ${role.className.includes("text-") ? "" : "text-ink"}`}>
                {SAMPLE}
              </p>
            </li>
          ))}
        </ul>
      </Paper>

      <Paper title="Grid">
        <RuledSample />
        <div className="mt-line grid gap-x-7 sm:grid-cols-2">
          <TokenList tokens={grid} label="Mobile (default)" />
          <TokenList tokens={gridDesktop} label="Desktop overrides (≥ 1024px)" />
        </div>
      </Paper>

      <Paper title="Contrast">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="type-label type-caps text-ink-soft">
              <th className="w-14 py-2 font-normal">Sample</th>
              <th className="py-2 font-normal">Pairing</th>
              <th className="w-24 py-2 text-right font-normal">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={`${result.fg}-${describeSurface(result.bg)}-${result.min}`} className="border-t border-rule">
                <td className="py-2 pr-3">
                  <Surface layers={result.bg}>
                    <span className="type-body px-2" style={{ color: `var(--${result.fg})` }}>
                      Aa
                    </span>
                  </Surface>
                </td>
                <td className="py-2 pr-3">
                  <span className="type-label block text-ink">
                    --{result.fg} on {describeSurface(result.bg)}
                  </span>
                  <span className="type-label block text-ink-soft">{result.why}</span>
                </td>
                <td className="type-label py-2 text-right whitespace-nowrap text-ink">
                  {result.ratio.toFixed(2)} / {result.min}
                  <span className={result.pass ? "block text-moss" : "block text-huckleberry"}>
                    {result.pass ? "pass" : "FAIL"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </section>
  );
}

function Paper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-line bg-paper p-page text-ink">
      <h2 className="type-heading mb-line">{title}</h2>
      {children}
    </section>
  );
}

function TokenList({ tokens, label }: { tokens: Tokens; label: string }) {
  return (
    <div className="mt-4">
      <p className="type-label type-caps text-huckleberry">{label}</p>
      <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4">
        {Object.entries(tokens).map(([name, value]) => (
          <div key={name} className="contents">
            <dt className="type-label text-ink-soft">--{name}</dt>
            <dd className="type-label text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Body text on ruled lines: each line box is one --baseline, the rule sits
// --rule-offset into it. If the type scale is right, every baseline lands on a rule.
function RuledSample() {
  const lines = 6;
  return (
    <div className="relative overflow-hidden" style={{ height: `calc(${lines} * var(--baseline))` }}>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute inset-x-0 border-t border-rule"
          style={{ top: `calc(${i} * var(--baseline) + var(--rule-offset))` }}
        />
      ))}
      <p className="type-body relative">
        {SAMPLE}. {SAMPLE}. {SAMPLE}. {SAMPLE}. {SAMPLE}.
      </p>
    </div>
  );
}

// Stacks the pairing's layers (e.g. paper + lamp cast) the same way the checker composites them.
function Surface({ layers, children }: { layers: (string | [string, number])[]; children: React.ReactNode }) {
  const [base, ...overlays] = layers;
  return (
    <span
      className="relative inline-flex rounded-chip border border-rule"
      style={{ background: `var(--${typeof base === "string" ? base : base[0]})` }}
    >
      {overlays.map((layer) => {
        const [token, opacity] = typeof layer === "string" ? [layer, undefined] : layer;
        return (
          <span
            key={token}
            aria-hidden
            className="absolute inset-0"
            style={{ background: `var(--${token})`, opacity }}
          />
        );
      })}
      <span className="relative">{children}</span>
    </span>
  );
}
