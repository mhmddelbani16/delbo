import type { TailoredResume } from "@/types/resume";

export interface TailorResumeInput {
  resumeText: string;
  jobDescriptionText: string;
  // Passed through from the deterministic match engine so the model
  // doesn't have to re-derive keyword overlap itself — keeps the prompt
  // small and keeps the AI focused purely on rewriting.
  matchedKeywords: string[];
  missingKeywords: string[];
}

export type TailorFailureReason =
  | "quota_exceeded" // the provider's free-tier daily allowance is used up
  | "unavailable" // network error, timeout, or provider-side failure
  | "invalid_response"; // model didn't return valid/schema-conformant JSON, even after one retry

export type TailorResult =
  | { success: true; data: TailoredResume }
  | { success: false; reason: TailorFailureReason };

export interface AIProvider {
  tailorResume(input: TailorResumeInput): Promise<TailorResult>;
}
