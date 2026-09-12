import mammoth from "mammoth";

const MIN_EXTRACTED_TEXT_LENGTH = 20;

export type ParseResult =
  | { success: true; text: string }
  | { success: false; error: string };

/**
 * Extracts plain text from a .docx file buffer.
 *
 * Deliberately narrow: this only ever returns a friendly, user-facing
 * error string on failure — it never throws, and it never leaks parser
 * internals (mammoth warnings, stack traces) to the caller.
 */
export async function extractTextFromDocx(
  buffer: Buffer
): Promise<ParseResult> {
  let text: string;

  try {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value.trim();
  } catch {
    return {
      success: false,
      error:
        "We couldn't read this file. Try uploading a DOCX or paste your resume text.",
    };
  }

  if (text.length < MIN_EXTRACTED_TEXT_LENGTH) {
    return {
      success: false,
      error:
        "We couldn't find readable text in this file. Try a different DOCX, or paste your resume text instead.",
    };
  }

  return { success: true, text };
}
