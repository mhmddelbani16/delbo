import type { TailoredResume } from "@/types/resume";

export function TailoredResumeView({ resume }: { resume: TailoredResume }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
      <div>
        <h3 className="font-mono text-xs tracking-wide text-ink-muted">
          SUMMARY
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          {resume.summary}
        </p>
      </div>

      {resume.skills.length > 0 && (
        <div className="mt-6">
          <h3 className="font-mono text-xs tracking-wide text-ink-muted">
            SKILLS
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {resume.experience.length > 0 && (
        <div className="mt-6">
          <h3 className="font-mono text-xs tracking-wide text-ink-muted">
            EXPERIENCE
          </h3>
          <div className="mt-3 space-y-5">
            {resume.experience.map((entry, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-ink">
                  {entry.title} · {entry.company}
                </p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                  {entry.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.projects.length > 0 && (
        <div className="mt-6">
          <h3 className="font-mono text-xs tracking-wide text-ink-muted">
            PROJECTS
          </h3>
          <div className="mt-3 space-y-5">
            {resume.projects.map((entry, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-ink">{entry.name}</p>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                  {entry.bullets.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.education.length > 0 && (
        <div className="mt-6">
          <h3 className="font-mono text-xs tracking-wide text-ink-muted">
            EDUCATION
          </h3>
          <div className="mt-3 space-y-3">
            {resume.education.map((entry, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-ink">
                  {entry.degree} · {entry.institution}
                </p>
                {entry.details.length > 0 && (
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                    {entry.details.map((detail, j) => (
                      <li key={j}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.gaps.length > 0 && (
        <div className="mt-6 rounded-lg bg-primary-tint px-4 py-3">
          <h3 className="text-xs font-semibold text-ink">
            Worth knowing before you apply
          </h3>
          <p className="mt-1 text-xs text-ink-muted">
            This role mentions the following, which we didn&rsquo;t find
            support for in your resume. We left them out rather than
            invent experience you don&rsquo;t have.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {resume.gaps.map((gap) => (
              <span
                key={gap}
                className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-ink-muted"
              >
                {gap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
