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
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
      <h2 className="mb-3 font-['Outfit'] text-base font-bold text-black">
        About
      </h2>
      <p className="text-[15px] leading-relaxed text-zinc-500">
        {renderBold(profile.about)}
      </p>
    </div>
  );
}
