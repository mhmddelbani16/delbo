import { NextResponse } from "next/server";

/**
 * Checks the Content-Length header before the body is read at all, so an
 * oversized upload or payload is rejected before we spend memory/CPU
 * parsing it (formData(), json(), etc. all buffer the full body first).
 *
 * Returns a ready-to-send NextResponse if the request should be
 * rejected, or null if it's fine to proceed. Note: a missing or absent
 * Content-Length header isn't itself rejected here — the per-route body
 * validation (file size, text length) still applies afterward as the
 * real backstop.
 */
export function rejectIfTooLarge(
  request: Request,
  maxBytes: number
): NextResponse | null {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxBytes) {
    return NextResponse.json(
      { error: "That request is larger than we can accept. Please try a smaller file or shorter text." },
      { status: 413 }
    );
  }
  return null;
}
