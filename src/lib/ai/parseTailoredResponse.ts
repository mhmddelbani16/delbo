import { tailoredResumeSchema, type TailoredResume } from "@/types/resume";

/**
 * Parses raw AI model output into a schema-validated TailoredResume, or
 * null if it isn't valid JSON matching the required shape. Kept separate
 * from the provider's transport code so it can be unit-tested without
 * mocking fetch/Cloudflare.
 */
export function parseTailoredResume(raw: string): TailoredResume | null {
  const cleaned = stripCodeFences(raw).trim();

  let json: unknown;
  try {
    json = JSON.parse(cleaned);
  } catch {
    return null;
  }

  const result = tailoredResumeSchema.safeParse(json);
  return result.success ? result.data : null;
}

export function stripCodeFences(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return fenced ? fenced[1] : text;
}
