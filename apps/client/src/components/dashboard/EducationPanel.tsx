import profile from "@data/profile.json";

export default function EducationPanel() {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-6">
      <h2 className="mb-3 font-['Outfit'] text-base font-bold text-black">
        Education
      </h2>
      <div className="flex flex-col gap-3">
        {profile.education.map((edu) => (
          <div key={edu.school} className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-black">{edu.school}</p>
              <p className="text-xs text-zinc-500">
                {edu.major} · {edu.status}
              </p>
            </div>
            <span className="text-xs text-zinc-400">{edu.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
