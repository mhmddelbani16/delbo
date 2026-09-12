import { describe, it, expect } from "vitest";
import {
  validateResumeFile,
  validateResumeText,
  validateJobDescription,
  MAX_RESUME_FILE_SIZE_BYTES,
} from "@/utils/validation";

function makeFile(name: string, sizeBytes: number): File {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name);
}

describe("validateResumeFile — invalid uploads", () => {
  it("accepts a valid, non-empty .docx file", () => {
    const file = makeFile("resume.docx", 1024);
    expect(validateResumeFile(file)).toEqual({ valid: true });
  });

  it("rejects a file with the wrong extension", () => {
    const file = makeFile("resume.pdf", 1024);
    const result = validateResumeFile(file);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.message).toMatch(/\.docx/);
  });

  it("rejects an empty file", () => {
    const file = makeFile("resume.docx", 0);
    const result = validateResumeFile(file);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.message).toMatch(/empty/i);
  });

  it("rejects a file larger than the size cap", () => {
    const file = makeFile("resume.docx", MAX_RESUME_FILE_SIZE_BYTES + 1);
    const result = validateResumeFile(file);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.message).toMatch(/5MB/);
  });

  it("is case-insensitive about the extension", () => {
    const file = makeFile("Resume.DOCX", 1024);
    expect(validateResumeFile(file)).toEqual({ valid: true });
  });
});

describe("validateResumeText — missing resume", () => {
  it("rejects empty text", () => {
    const result = validateResumeText("");
    expect(result.valid).toBe(false);
  });

  it("rejects whitespace-only text", () => {
    const result = validateResumeText("     \n   ");
    expect(result.valid).toBe(false);
  });

  it("rejects text that is too short to be a real resume", () => {
    const result = validateResumeText("Hi there");
    expect(result.valid).toBe(false);
  });

  it("accepts reasonably long resume text", () => {
    const result = validateResumeText(
      "Experienced software engineer with a strong background in backend systems and APIs."
    );
    expect(result.valid).toBe(true);
  });
});

describe("validateJobDescription — missing job description", () => {
  it("rejects empty text", () => {
    expect(validateJobDescription("").valid).toBe(false);
  });

  it("rejects text shorter than the minimum length", () => {
    expect(validateJobDescription("We need a developer.").valid).toBe(false);
  });

  it("accepts a realistic full job description", () => {
    const jd =
      "We are hiring a Software Engineer to join our backend team. You will design, build, and maintain scalable APIs, collaborate with cross-functional teams, and participate in code reviews.";
    expect(validateJobDescription(jd).valid).toBe(true);
  });
});
