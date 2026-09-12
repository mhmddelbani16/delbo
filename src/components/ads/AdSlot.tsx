/**
 * AdSlot renders nothing (and reserves no layout space) unless ads are
 * explicitly enabled via NEXT_PUBLIC_ADS_ENABLED=true. This keeps the app
 * fully functional, ad-blocker-proof, and visually identical to the
 * no-ads design until AdSense is actually approved and wired up.
 *
 * Placement is a label only (for future analytics/config), not a style —
 * each placement is expected to provide its own surrounding spacing.
 */

export type AdPlacement = "landing-bottom" | "results-bottom" | "footer";

export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (!ADS_ENABLED) {
    return null;
  }

  // Real AdSense wiring (script + unit id from env vars) lands here once
  // approved. Kept isolated so nothing else in the app depends on it.
  return (
    <div
      data-ad-placement={placement}
      className="mx-auto w-full max-w-6xl px-6"
      aria-hidden="true"
    >
      {/* AdSense unit renders here when enabled */}
    </div>
  );
}
