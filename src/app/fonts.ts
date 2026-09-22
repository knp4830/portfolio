import {
  Fraunces,
  JetBrains_Mono,
  Nanum_Pen_Script,
  Newsreader,
  Patrick_Hand,
  Special_Elite,
} from "next/font/google";

// Each face exposes a CSS variable; globals.css maps them to font-display,
// font-body, font-mono, font-semi, and font-pen. Variable fonts load their
// full weight range, so type roles can set any weight without another file.

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-newsreader",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-special-elite",
});

// Fallback for Special Elite only. Not preloaded: the browser fetches it only if
// Special Elite fails to load.
const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-patrick-hand",
});

const nanumPen = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nanum-pen",
});

export const fontVariables = [fraunces, newsreader, jetbrainsMono, specialElite, patrickHand, nanumPen]
  .map((font) => font.variable)
  .join(" ");
