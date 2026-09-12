import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";
import {
  MIN_RESUME_TEXT_LENGTH,
  MIN_JOB_DESCRIPTION_LENGTH,
  MAX_INPUT_TEXT_LENGTH,
  MAX_JSON_REQUEST_BYTES,
} from "@/utils/validation";
import { rejectIfTooLarge } from "@/utils/requestGuards";

const MAX_TAILOR_REQUESTS_PER_IP_PER_DAY = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const FAILURE_MESSAGES: Record<string, string> = {
  quota_exceeded:
    "Today's free AI tailoring limit has been reached. Please try again tomorrow.",
  unavailable:
    "AI tailoring is temporarily unavailable, but your resume analysis is ready.",
  invalid_response:
    "We couldn't generate the tailored version. Your original resume has not been changed. Please try again.",
};

export async function POST(request: Request) {
  const tooLarge = rejectIfTooLarge(request, MAX_JSON_REQUEST_BYTES);
  if (tooLarge) return tooLarge;

  const ip = getClientIp(request);
  if (
    !checkRateLimit(`tailor:${ip}`, {
      max: MAX_TAILOR_REQUESTS_PER_IP_PER_DAY,
      windowMs: DAY_MS,
    })
  ) {
    return NextResponse.json(
      { error: "Free tailoring limit reached for today." },
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

  const {
    resumeText,
    jobDescriptionText,
    matchedKeywords,
    missingKeywords,
  } = (body ?? {}) as {
    resumeText?: unknown;
    jobDescriptionText?: unknown;
    matchedKeywords?: unknown;
    missingKeywords?: unknown;
  };

  if (
    typeof resumeText !== "string" ||
    typeof jobDescriptionText !== "string"
  ) {
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
      {
        error:
          "That text is longer than we can process right now. Please trim it down and try again.",
      },
      { status: 400 }
    );
  }

  const provider = getAIProvider();
  const result = await provider.tailorResume({
    resumeText,
    jobDescriptionText,
    matchedKeywords: Array.isArray(matchedKeywords)
      ? matchedKeywords.filter((k): k is string => typeof k === "string")
      : [],
    missingKeywords: Array.isArray(missingKeywords)
      ? missingKeywords.filter((k): k is string => typeof k === "string")
      : [],
  });

  if (!result.success) {
    const status = result.reason === "quota_exceeded" ? 429 : 503;
    return NextResponse.json(
      { error: FAILURE_MESSAGES[result.reason] },
      { status }
    );
  }

  return NextResponse.json({ data: result.data });
}
