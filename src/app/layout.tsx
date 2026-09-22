import type { Metadata } from "next";
import { loadPage, loadSite } from "@/lib/content/load";
import { fontVariables } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const [site, opening] = await Promise.all([loadSite(), loadPage("opening")]);
  return {
    title: { default: site.name, template: `%s · ${site.name}` },
    description: `${opening.headline} ${opening.headlineMarked} ${opening.line}`,
  };
}

// Applies a saved theme choice before first paint, so a night reader never sees
// a flash of day paper. Runs before React; the toggle takes over after hydration.
const applySavedTheme = `try{var t=localStorage.getItem("theme");if(t==="day"||t==="night")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the script above may set data-theme before React hydrates.
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: applySavedTheme }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
