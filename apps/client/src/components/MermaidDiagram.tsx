import { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
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
      className="my-4 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
