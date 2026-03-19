import profile from "@data/profile.json";

function renderBold(text: string) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-zinc-700">
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
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
      <h2 className="mb-3 font-['Outfit'] text-base font-bold text-black">
        About
      </h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-zinc-500">
        {paragraphs.map((p, i) => (
          <p key={i}>{renderBold(p)}</p>
        ))}
      </div>
    </div>
  );
}
