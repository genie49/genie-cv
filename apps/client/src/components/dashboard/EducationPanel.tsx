import profile from "@data/profile.json";

export default function EducationPanel() {
  return (
    <div className="rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
      <h2 className="mb-3 font-['Outfit'] text-base font-bold text-toss-heading">
        Education
      </h2>
      <div className="flex flex-col gap-3">
        {profile.education.map((edu) => (
          <div key={edu.school} className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-medium text-toss-heading">{edu.school}</p>
              <p className="text-xs text-toss-body">
                {edu.major ? `${edu.major} · ` : ""}{edu.status}
              </p>
            </div>
            <span className="text-xs text-toss-sub">{edu.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
