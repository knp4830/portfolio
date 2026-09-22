import { Notebook } from "@/components/notebook/Notebook";

// Every notebook route shares this layout, and Next keeps a layout mounted
// while navigating between its routes: the notebook is built once and a page
// turn only changes which spread is showing. Each route adds its marker.
export default function NotebookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Notebook />
    </>
  );
}
