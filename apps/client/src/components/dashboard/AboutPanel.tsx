import profile from "@data/profile.json";

export default function AboutPanel() {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
      <h2 className="mb-3 font-['Outfit'] text-base font-bold text-black">
        About
      </h2>
      <p className="text-[15px] leading-relaxed text-zinc-500">
        {profile.about}
      </p>
    </div>
  );
}
