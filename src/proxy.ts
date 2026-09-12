import { NextResponse, type NextRequest } from "next/server";
import {
  REFERRAL_COOKIE_NAME,
  REFERRAL_COOKIE_MAX_AGE_DAYS,
} from "@/lib/referral/constants";

/**
 * Referral attribution capture only. This does NOT qualify a referral —
 * qualification happens later (P1) once the friend completes their first
 * resume analysis. This just remembers "who sent this visitor" so that
 * step can look it up.
 *
 * Deliberately simple: a first-touch cookie, no accounts, no server
 * lookups. Full qualification tracking (server-side counts, self-referral
 * checks) is built as part of the P1 referral step.
 */
export default function proxy(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref");
  const response = NextResponse.next();

  if (ref && !request.cookies.get(REFERRAL_COOKIE_NAME)) {
    response.cookies.set(REFERRAL_COOKIE_NAME, ref, {
      maxAge: REFERRAL_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: "/",
};
