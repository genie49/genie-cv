import profile from "@data/profile.json";

const allCategories = Object.entries(profile.techStack);

export default function TechStackPanel() {
  return (
    <div className="rounded-2xl bg-toss-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-6">
      <h2 className="mb-4 font-['Outfit'] text-base font-bold text-toss-heading">
        Tech Stack
      </h2>
      <div className="flex flex-col gap-4">
        {allCategories.map(([category, items]) => (
          <Category key={category} category={category} items={items as string[]} />
        ))}
      </div>
    </div>
  );
}

function Category({ category, items }: { category: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold tracking-wider text-toss-sub">
        {category}
      </span>
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded px-2 py-0.5 text-xs ${
              category === "AI/ML"
                ? "bg-toss-blue text-white"
                : "bg-toss-bg text-toss-body"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
