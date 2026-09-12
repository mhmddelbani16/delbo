import Link from "next/link";
import { DocumentMockup } from "@/components/DocumentMockup";
import { AdSlot, ADS_ENABLED } from "@/components/ads/AdSlot";
import { DelboWordmark } from "@/components/Logo";

const flowSteps = ["Resume", "Job description", "Match analysis", "Tailored resume"];

const howItWorks = [
  {
    n: "1",
    title: "Add your resume",
    body: "Paste your resume as text, or upload a DOCX file. Nothing is stored beyond what's needed to process it.",
  },
  {
    n: "2",
    title: "Paste the job description",
    body: "Drop in the posting you're applying to. We read it for the skills and language that actually matter.",
  },
  {
    n: "3",
    title: "Review your match",
    body: "See where your resume already lines up, what's missing, and a rewritten version that puts your real experience first.",
  },
  {
    n: "4",
    title: "Download and apply",
    body: "Get a clean, ATS-friendly DOCX you can send today.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <DelboWordmark />
          <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
            <a href="#how-it-works" className="hover:text-ink">
              How it works
            </a>
            <a href="#free-check" className="hover:text-ink">
              Free resume check
            </a>
          </nav>
          <Link
            href="/app"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
          >
            Tailor my resume
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
          <div className="grid gap-14 md:grid-cols-2 md:items-center md:gap-10">
            <div className="md:border-l md:border-line md:pl-10">
              <h1 className="font-display text-4xl leading-[1.1] font-semibold text-ink sm:text-5xl">
                Tailor your resume to the job. In minutes.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
                Paste a job description and turn your existing resume into a
                focused, job-specific version, while keeping your real
                experience intact.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/app"
                  className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-strong"
                >
                  Tailor my resume — free
                </Link>
                <Link
                  href="/app?mode=check"
                  className="rounded-lg border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
                >
                  Check my match
                </Link>
              </div>

              <div
                aria-hidden="true"
                className="font-mono mt-14 hidden items-center gap-3 text-xs text-ink-muted sm:flex"
              >
                {flowSteps.map((step, i) => (
                  <span key={step} className="flex items-center gap-3">
                    <span className="whitespace-nowrap">{step}</span>
                    {i < flowSteps.length - 1 && (
                      <span className="h-px w-8 bg-line" />
                    )}
                  </span>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-sm md:max-w-none">
              <DocumentMockup />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-line bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-20 md:pl-16">
            <h2 className="font-display text-2xl font-semibold text-ink">
              How it works
            </h2>
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              {howItWorks.map((step) => (
                <div key={step.n} className="flex gap-4">
                  <span className="font-display text-3xl font-semibold text-primary">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-medium text-ink">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust */}
        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-6 py-20 md:pl-16">
            <div className="max-w-2xl border-l-2 border-primary pl-6">
              <p className="font-display text-2xl leading-snug font-semibold text-ink sm:text-3xl">
                Your experience. Better positioned.
              </p>
              <p className="mt-4 max-w-xl text-ink-muted">
                We improve presentation and relevance. We don&rsquo;t invent
                qualifications, skills, or experience you don&rsquo;t have.
              </p>
            </div>
          </div>
        </section>
        {/* Ad slot: reserves zero space until NEXT_PUBLIC_ADS_ENABLED=true (see P2 plan) */}
        {ADS_ENABLED && (
          <div className="py-10">
            <AdSlot placement="landing-bottom" />
          </div>
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <DelboWordmark className="opacity-90" />
          <span>Your resume is processed to generate results and isn&rsquo;t stored.</span>
        </div>
      </footer>
    </div>
  );
}
