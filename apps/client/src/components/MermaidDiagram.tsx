import { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  themeVariables: {
    background: "#ffffff",
    primaryColor: "#f4f4f5",
    primaryTextColor: "#18181b",
    primaryBorderColor: "#d4d4d8",
    lineColor: "#71717a",
    secondaryColor: "#e4e4e7",
    tertiaryColor: "#fafafa",
  },
});

let counter = 0;

export function MermaidDiagram({ chart }: { chart: string }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const id = `mermaid-${Date.now()}-${counter++}`;
    mermaid
      .render(id, chart)
      .then(({ svg }) => setSvg(svg))
      .catch(() => setSvg(""));
  }, [chart]);

  if (!svg) return null;

  return (
    <div
      className="my-4 flex justify-center overflow-x-auto rounded-lg border border-zinc-200 bg-white p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
