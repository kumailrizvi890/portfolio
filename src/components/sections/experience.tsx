import { awards, coursework, leadership, profile, workExperience } from "@/lib/data";

function TimelineGroup({
  title,
  items,
}: {
  title: string;
  items: { org: string; role: string; period: string; detail: string }[];
}) {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">{title}</h3>
      <div className="mt-4 space-y-6">
        {items.map((item) => (
          <div key={item.org + item.role}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="font-medium text-foreground">{item.role}</p>
              <p className="font-mono text-xs text-muted-2">{item.period}</p>
            </div>
            <p className="text-sm text-accent">{item.org}</p>
            <p className="mt-1.5 text-sm text-muted leading-relaxed">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="border-b border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Education, work, and what I do outside of code
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-12">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">Education</h3>
              <div className="mt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium text-foreground">{profile.degree}</p>
                  <p className="font-mono text-xs text-muted-2">GPA {profile.gpa}</p>
                </div>
                <p className="text-sm text-accent">
                  {profile.school}, expected {profile.graduation}
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {coursework.map((c) => (
                    <li key={c} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <TimelineGroup title="Work experience" items={workExperience} />
          </div>

          <div className="space-y-12">
            <TimelineGroup title="Leadership" items={leadership} />

            <div>
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-2">Awards</h3>
              <ul className="mt-4 space-y-2">
                {awards.map((a) => (
                  <li key={a} className="text-sm text-muted leading-relaxed border-l-2 border-accent/40 pl-3">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
