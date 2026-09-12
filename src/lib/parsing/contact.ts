// Name and contact details are identity-critical, so we deliberately
// never let the AI touch them — they're lifted straight from the
// candidate's own original resume text with plain pattern matching,
// not rewritten or reformatted by anything in between.

export interface ContactInfo {
  name: string;
  email: string | null;
  phone: string | null;
}

const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_PATTERN = /(\+?\d[\d\s().-]{7,}\d)/;
const DEFAULT_NAME = "Your Name";
const MAX_NAME_LINE_LENGTH = 60;

export function extractContactInfo(resumeText: string): ContactInfo {
  const email = resumeText.match(EMAIL_PATTERN)?.[0] ?? null;
  const phone = resumeText.match(PHONE_PATTERN)?.[0]?.trim() ?? null;

  const firstLine = resumeText
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  const looksLikeName =
    firstLine &&
    firstLine.length <= MAX_NAME_LINE_LENGTH &&
    !firstLine.includes("@") &&
    !PHONE_PATTERN.test(firstLine);

  return {
    name: looksLikeName ? firstLine! : DEFAULT_NAME,
    email,
    phone,
  };
}
