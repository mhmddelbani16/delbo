import { NextResponse } from "next/server";
import { computeMatch } from "@/lib/matching/engine";
import {
  MIN_RESUME_TEXT_LENGTH,
  MIN_JOB_DESCRIPTION_LENGTH,
  MAX_INPUT_TEXT_LENGTH,
  MAX_JSON_REQUEST_BYTES,
  GENERAL_RATE_LIMIT_MAX,
  GENERAL_RATE_LIMIT_WINDOW_MS,
} from "@/utils/validation";
import { rejectIfTooLarge } from "@/utils/requestGuards";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";

// Untrusted input: this text comes straight from the client, so every
// check here is re-validated server-side rather than trusted from the UI.
export async function POST(request: Request) {
  const tooLarge = rejectIfTooLarge(request, MAX_JSON_REQUEST_BYTES);
  if (tooLarge) return tooLarge;

  const ip = getClientIp(request);
  if (
    !checkRateLimit(`analyze:${ip}`, {
      max: GENERAL_RATE_LIMIT_MAX,
      windowMs: GENERAL_RATE_LIMIT_WINDOW_MS,
    })
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a little while." },
      { status: 429 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We couldn't read that request. Please try again." },
      { status: 400 }
    );
  }

  const { resumeText, jobDescriptionText } = (body ?? {}) as {
    resumeText?: unknown;
    jobDescriptionText?: unknown;
  };

  if (typeof resumeText !== "string" || typeof jobDescriptionText !== "string") {
    return NextResponse.json(
      { error: "Add your resume and the job description to continue." },
      { status: 400 }
    );
  }

  if (resumeText.trim().length < MIN_RESUME_TEXT_LENGTH) {
    return NextResponse.json(
      { error: "Add your resume to continue." },
      { status: 400 }
    );
  }

  if (jobDescriptionText.trim().length < MIN_JOB_DESCRIPTION_LENGTH) {
    return NextResponse.json(
      { error: "Paste the job description to continue." },
      { status: 400 }
    );
  }

  if (
    resumeText.length > MAX_INPUT_TEXT_LENGTH ||
    jobDescriptionText.length > MAX_INPUT_TEXT_LENGTH
  ) {
    return NextResponse.json(
      { error: "That text is longer than we can process right now. Please trim it down and try again." },
      { status: 400 }
    );
  }

  try {
    const result = computeMatch(resumeText, jobDescriptionText);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "We couldn't analyze your match right now. Please try again." },
      { status: 500 }
    );
  }
}
