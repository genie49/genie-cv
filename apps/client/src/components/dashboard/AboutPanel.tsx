import profile from "@data/profile.json";

function renderBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-toss-heading">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export default function AboutPanel() {
  const paragraphs = profile.about.split("\n\n");

  return (
    <div className="rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
      <h2 className="mb-3 font-['Outfit'] text-base font-bold text-toss-heading">
        About
      </h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-toss-body">
        {paragraphs.map((p, i) => (
          <p key={i}>{renderBold(p)}</p>
        ))}
      </div>
    </div>
  );
}
