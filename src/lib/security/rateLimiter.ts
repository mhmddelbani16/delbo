// Deliberately simple, in-memory rate limiting for the MVP.
//
// IMPORTANT CAVEAT: this only works reliably on a single long-running
// Node.js process (e.g. `next start` on one machine, or local dev). On
// serverless platforms (Vercel), each invocation can land on a different
// instance with its own memory, so counts won't be fully reliable in
// production. For real production reliability, swap this module's
// internals for a shared store (e.g. Upstash Redis's free tier) — the
// checkRateLimit function signature below wouldn't need to change.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  options: { max: number; windowMs: number }
): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return true;
  }

  if (existing.count >= options.max) {
    return false;
  }

  existing.count += 1;
  return true;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}
