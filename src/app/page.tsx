import { Notebook } from "@/components/notebook/Notebook";

// Opening spread (pp. 1–2). M1.1 builds the empty notebook; the intro,
// contents, and resume come in M1.2.
export default function Home() {
  return <Notebook spread="opening" labels={["Opening", "Table of contents"]} />;
}
