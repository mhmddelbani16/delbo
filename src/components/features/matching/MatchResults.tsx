import { ScoreRing } from "@/components/features/matching/ScoreRing";
import type { MatchResult } from "@/lib/matching/engine";

const KEYWORD_DISPLAY_CAP = 14;

function scoreDescription(score: number): string {
  if (score >= 75) return "Strong match";
  if (score >= 45) return "Partial match";
  return "Early-stage match";
}

function KeywordList({
  keywords,
  variant,
  emptyLabel,
}: {
  keywords: string[];
  variant: "matched" | "gap";
  emptyLabel: string;
}) {
  const shown = keywords.slice(0, KEYWORD_DISPLAY_CAP);
  const remaining = keywords.length - shown.length;

  if (keywords.length === 0) {
    return <p className="text-sm text-ink-muted">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {shown.map((kw) => (
        <span
          key={kw}
          className={
            variant === "matched"
              ? "rounded-full border border-success bg-success-tint px-3 py-1 text-xs font-medium text-success-strong"
              : "rounded-full border border-line bg-paper px-3 py-1 text-xs font-medium text-ink-muted"
          }
        >
          {kw}
        </span>
      ))}
      {remaining > 0 && (
        <span className="rounded-full px-3 py-1 text-xs font-medium text-ink-muted">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

export function MatchResults({
  result,
  onTailor,
  isTailoring = false,
  tailorError = null,
}: {
  result: MatchResult;
  onTailor: () => void;
  isTailoring?: boolean;
  tailorError?: string | null;
}) {
  return (
    <div>
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 border-b border-line pb-8 text-center sm:flex-row sm:text-left">
          <ScoreRing score={result.score} />
          <div>
            <p className="font-mono text-xs tracking-wide text-ink-muted">
              JOB MATCH
            </p>
            <p className="font-display mt-1 text-xl font-semibold text-ink">
              {scoreDescription(result.score)}
            </p>
            <p className="mt-1 max-w-sm text-sm text-ink-muted">
              Our own estimate of how well your resume aligns with this role,
              based on shared skills and terminology — not an official ATS
              score.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Matched keywords
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              Skills and terms your resume already shares with this role.
            </p>
            <div className="mt-3">
              <KeywordList
                keywords={result.matchedKeywords}
                variant="matched"
                emptyLabel="We didn't find a clear overlap yet — that's what tailoring helps with."
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">
              Potential gaps
            </h3>
            <p className="mt-1 text-xs text-ink-muted">
              Terms in the job description we didn&rsquo;t find in your
              resume.
            </p>
            <div className="mt-3">
              <KeywordList
                keywords={result.missingKeywords}
                variant="gap"
                emptyLabel="No obvious gaps detected."
              />
            </div>
          </div>
        </div>

        <p className="mt-8 rounded-lg bg-primary-tint px-4 py-3 text-xs text-ink-muted">
          Only add skills and experience that accurately describe your
          background. Tailoring should make your real experience clearer,
          not add things that aren&rsquo;t true.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-end gap-2">
        {tailorError && (
          <p className="text-sm text-red-600" role="alert">
            {tailorError}
          </p>
        )}
        <button
          type="button"
          onClick={onTailor}
          disabled={isTailoring}
          className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors enabled:hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isTailoring ? "Tailoring your resume…" : "Tailor my resume"}
        </button>
      </div>
    </div>
  );
}
