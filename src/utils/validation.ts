// Centralized, configurable limits for resume input.
// Keeping these here (not scattered inline) matches the same pattern used
// for the referral constants — one place to tune the numbers.

export const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ACCEPTED_RESUME_EXTENSION = ".docx";
export const MIN_RESUME_TEXT_LENGTH = 50; // characters
export const MIN_JOB_DESCRIPTION_LENGTH = 100; // characters
export const MAX_INPUT_TEXT_LENGTH = 20000; // characters, applies to resume & job description text sent to the server
export const MAX_UPLOAD_REQUEST_BYTES = MAX_RESUME_FILE_SIZE_BYTES + 100 * 1024; // file + multipart overhead
export const MAX_JSON_REQUEST_BYTES = 200 * 1024; // generous ceiling for JSON text payloads
export const GENERAL_RATE_LIMIT_MAX = 60; // requests
export const GENERAL_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export type ValidationResult = { valid: true } | { valid: false; message: string };

export function validateResumeFile(file: File): ValidationResult {
  const name = file.name.toLowerCase();

  if (!name.endsWith(ACCEPTED_RESUME_EXTENSION)) {
    return {
      valid: false,
      message: "That file type isn't supported yet. Please upload a .docx file, or paste your resume text instead.",
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      message: "That file looks empty. Please check the file and try again.",
    };
  }

  if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: "That file is larger than 5MB. Please upload a smaller resume file.",
    };
  }

  return { valid: true };
}

export function validateResumeText(text: string): ValidationResult {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: "Paste your resume text to continue.",
    };
  }

  if (trimmed.length < MIN_RESUME_TEXT_LENGTH) {
    return {
      valid: false,
      message: "That looks a little short for a resume. Add a bit more detail to continue.",
    };
  }

  return { valid: true };
}

export function validateJobDescription(text: string): ValidationResult {
  const trimmed = text.trim();

  if (trimmed.length === 0) {
    return {
      valid: false,
      message: "Paste the job description to continue.",
    };
  }

  if (trimmed.length < MIN_JOB_DESCRIPTION_LENGTH) {
    return {
      valid: false,
      message: "That looks too short to be a full job description. Try pasting the complete posting.",
    };
  }

  return { valid: true };
}
