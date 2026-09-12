"use client";

import { useState } from "react";
import { DelboWordmark } from "@/components/Logo";
import {
  ResumeInput,
  type ResumeInputValue,
} from "@/components/features/resume/ResumeInput";
import { JobDescriptionInput } from "@/components/features/job-description/JobDescriptionInput";
import { MatchResults } from "@/components/features/matching/MatchResults";
import { TailoredResumeView } from "@/components/features/tailoring/TailoredResumeView";
import type { MatchResult } from "@/lib/matching/engine";
import type { TailoredResume } from "@/types/resume";

type Step = "resume" | "jobDescription" | "results" | "tailored";

const STEP_LABELS: Record<Step, string> = {
  resume: "Step 1 of 4",
  jobDescription: "Step 2 of 4",
  results: "Step 3 of 4",
  tailored: "Step 4 of 4",
};

export function TailorFlow() {
  const [step, setStep] = useState<Step>("resume");

  const [resume, setResume] = useState<
    (ResumeInputValue & { isValid: boolean }) | null
  >(null);
  // The final, plain-text resume content used by every step downstream —
  // set directly for paste mode, or filled in after /api/parse-resume
  // succeeds for an uploaded .docx.
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const [jobDescription, setJobDescription] = useState<{
    text: string;
    isValid: boolean;
  } | null>(null);

  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorError, setTailorError] = useState<string | null>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const resumeValid = resume?.isValid ?? false;
  const jobDescriptionValid = jobDescription?.isValid ?? false;

  async function handleContinueFromResume() {
    if (!resume || !resume.isValid) return;
    setParseError(null);

    if (resume.mode === "paste") {
      setResumeText(resume.text);
      setStep("jobDescription");
      return;
    }

    // upload mode: send the file to the server for parsing
    if (!resume.file) return;
    setIsParsingResume(true);

    try {
      const formData = new FormData();
      formData.append("file", resume.file);

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setParseError(
          data.error ??
            "We couldn't read this file. Try uploading a DOCX or paste your resume text."
        );
        return;
      }

      setResumeText(data.text);
      setStep("jobDescription");
    } catch {
      setParseError(
        "We couldn't read this file. Try uploading a DOCX or paste your resume text."
      );
    } finally {
      setIsParsingResume(false);
    }
  }

  async function handleAnalyze() {
    if (!resumeText || !jobDescription?.isValid) return;
    setAnalyzeError(null);
    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText: jobDescription.text,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAnalyzeError(
          data.error ?? "We couldn't analyze your match right now. Please try again."
        );
        return;
      }

      setMatchResult(data);
      setStep("results");
    } catch {
      setAnalyzeError("We couldn't analyze your match right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleTailor() {
    if (!resumeText || !jobDescription?.isValid || !matchResult) return;
    setTailorError(null);
    setIsTailoring(true);

    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText: jobDescription.text,
          matchedKeywords: matchResult.matchedKeywords,
          missingKeywords: matchResult.missingKeywords,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setTailorError(
          data.error ??
            "We couldn't generate the tailored version. Your original resume has not been changed. Please try again."
        );
        return;
      }

      setTailoredResume(data.data);
      setStep("tailored");
    } catch {
      setTailorError(
        "We couldn't generate the tailored version. Your original resume has not been changed. Please try again."
      );
    } finally {
      setIsTailoring(false);
    }
  }

  async function handleDownload() {
    if (!resumeText || !tailoredResume) return;
    setDownloadError(null);
    setIsDownloading(true);

    try {
      const response = await fetch("/api/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, tailoredResume }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setDownloadError(
          data?.error ?? "We couldn't generate your download. Please try again."
        );
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "tailored-resume.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setDownloadError("We couldn't generate your download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <DelboWordmark />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <p className="font-mono text-xs tracking-wide text-ink-muted">
          {STEP_LABELS[step]}
        </p>

        {step === "resume" && (
          <>
            <h1 className="font-display mt-2 text-2xl font-semibold text-ink">
              Add your resume
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Paste your resume text, or upload it as a .docx file. Nothing
              is stored beyond what&rsquo;s needed to process it.
            </p>

            <div className="mt-6">
              <ResumeInput onChange={setResume} />
            </div>

            {parseError && (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {parseError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                disabled={!resumeValid || isParsingResume}
                onClick={handleContinueFromResume}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors enabled:hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isParsingResume ? "Reading your resume…" : "Continue to job description"}
              </button>
            </div>
          </>
        )}

        {step === "jobDescription" && (
          <>
            <h1 className="font-display mt-2 text-2xl font-semibold text-ink">
              Paste the job description
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              We&rsquo;ll compare it against your resume to estimate your
              match and see what&rsquo;s worth highlighting.
            </p>

            <div className="mt-6">
              <JobDescriptionInput onChange={setJobDescription} />
            </div>

            {analyzeError && (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {analyzeError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("resume")}
                className="rounded-lg border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!jobDescriptionValid || isAnalyzing}
                onClick={handleAnalyze}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors enabled:hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isAnalyzing ? "Comparing your resume with the role…" : "Analyze match"}
              </button>
            </div>
          </>
        )}

        {step === "results" && matchResult && (
          <>
            <h1 className="font-display mt-2 text-2xl font-semibold text-ink">
              Your match
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Here&rsquo;s how your resume compares to the role.
            </p>

            <div className="mt-6">
              <MatchResults
                result={matchResult}
                onTailor={handleTailor}
                isTailoring={isTailoring}
                tailorError={tailorError}
              />
            </div>

            <div className="mt-6 flex items-center justify-start">
              <button
                type="button"
                onClick={() => setStep("jobDescription")}
                className="rounded-lg border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                Back
              </button>
            </div>
          </>
        )}

        {step === "tailored" && tailoredResume && (
          <>
            <h1 className="font-display mt-2 text-2xl font-semibold text-ink">
              Your tailored resume
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Review it before downloading — you&rsquo;re always in control
              of the final version.
            </p>

            <div className="mt-6">
              <TailoredResumeView resume={tailoredResume} />
            </div>

            {downloadError && (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {downloadError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("results")}
                className="rounded-lg border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                Back
              </button>
              <button
                type="button"
                disabled={isDownloading}
                onClick={handleDownload}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition-colors enabled:hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isDownloading ? "Preparing your download…" : "Download DOCX"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
