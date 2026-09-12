import { NextResponse } from "next/server";
import { generateResumeDocx } from "@/lib/export/generateDocx";
import { extractContactInfo } from "@/lib/parsing/contact";
import { tailoredResumeSchema } from "@/types/resume";
import {
  MIN_RESUME_TEXT_LENGTH,
  MAX_JSON_REQUEST_BYTES,
  GENERAL_RATE_LIMIT_MAX,
  GENERAL_RATE_LIMIT_WINDOW_MS,
} from "@/utils/validation";
import { rejectIfTooLarge } from "@/utils/requestGuards";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";

export async function POST(request: Request) {
  const tooLarge = rejectIfTooLarge(request, MAX_JSON_REQUEST_BYTES);
  if (tooLarge) return tooLarge;

  const ip = getClientIp(request);
  if (
    !checkRateLimit(`export-docx:${ip}`, {
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

  const { resumeText, tailoredResume } = (body ?? {}) as {
    resumeText?: unknown;
    tailoredResume?: unknown;
  };

  if (typeof resumeText !== "string" || resumeText.trim().length < MIN_RESUME_TEXT_LENGTH) {
    return NextResponse.json(
      { error: "Add your resume to continue." },
      { status: 400 }
    );
  }

  const parsedResume = tailoredResumeSchema.safeParse(tailoredResume);
  if (!parsedResume.success) {
    return NextResponse.json(
      { error: "We couldn't generate your download. Please try tailoring your resume again." },
      { status: 400 }
    );
  }

  try {
    const contact = extractContactInfo(resumeText);
    const buffer = await generateResumeDocx(parsedResume.data, contact);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="tailored-resume.docx"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "We couldn't generate your download. Please try again." },
      { status: 500 }
    );
  }
}
