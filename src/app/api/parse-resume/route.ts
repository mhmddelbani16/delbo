import { NextResponse } from "next/server";
import { extractTextFromDocx } from "@/lib/parsing/docx";
import {
  ACCEPTED_RESUME_EXTENSION,
  MAX_RESUME_FILE_SIZE_BYTES,
  MAX_UPLOAD_REQUEST_BYTES,
  GENERAL_RATE_LIMIT_MAX,
  GENERAL_RATE_LIMIT_WINDOW_MS,
} from "@/utils/validation";
import { rejectIfTooLarge } from "@/utils/requestGuards";
import { checkRateLimit, getClientIp } from "@/lib/security/rateLimiter";

// Untrusted input: re-validate everything server-side even though the
// client already checked. Never trust the browser alone.
export async function POST(request: Request) {
  const tooLarge = rejectIfTooLarge(request, MAX_UPLOAD_REQUEST_BYTES);
  if (tooLarge) return tooLarge;

  const ip = getClientIp(request);
  if (
    !checkRateLimit(`parse-resume:${ip}`, {
      max: GENERAL_RATE_LIMIT_MAX,
      windowMs: GENERAL_RATE_LIMIT_WINDOW_MS,
    })
  ) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a little while." },
      { status: 429 }
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "We couldn't read that upload. Please try again." },
      { status: 400 }
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file was received. Please choose a .docx file to upload." },
      { status: 400 }
    );
  }

  if (!file.name.toLowerCase().endsWith(ACCEPTED_RESUME_EXTENSION)) {
    return NextResponse.json(
      {
        error:
          "That file type isn't supported yet. Please upload a .docx file, or paste your resume text instead.",
      },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: "That file looks empty. Please check the file and try again." },
      { status: 400 }
    );
  }

  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "That file is larger than 5MB. Please upload a smaller resume file." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await extractTextFromDocx(buffer);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ text: result.text });
}
