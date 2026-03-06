import profile from "@data/profile.json";

export default function ExperiencePanel() {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
      <h2 className="mb-3 font-['Outfit'] text-base font-bold text-black">
        Experience
      </h2>
      <div className="flex flex-col gap-3">
        {profile.experience.map((exp) => (
          <div key={exp.company} className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-black">{exp.title}</p>
              <p className="text-xs text-zinc-500">{exp.company}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                {exp.description}
              </p>
            </div>
            <span className="shrink-0 text-xs text-zinc-400">{exp.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
