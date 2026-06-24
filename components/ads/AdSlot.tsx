interface AdSlotProps {
  id: string;
  width: number;
  height: number;
  className?: string;
}

// Ads are switched off site-wide while the site is in its traffic-building
// phase. Flip this back to `true` (no other changes needed) once AdSense is
// ready to go live — every call site already checks this flag via the early
// return below.
export const ADS_ENABLED = false;

/**
 * Placeholder ad unit. To go live with real Google AdSense:
 *
 *   <ins className="adsbygoogle"
 *     style={{ display: "block", width, height }}
 *     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *     data-ad-slot="XXXXXXXXXX" />
 *
 * ...then call `(window.adsbygoogle = window.adsbygoogle || []).push({})`
 * after mount. Keep the same `id` values (ad-top / ad-sidebar / ad-mid) so
 * existing layout/CSS keeps working.
 */
export function AdSlot({ id, width, height, className = "" }: AdSlotProps) {
  if (!ADS_ENABLED) return null;

  return (
    <div
      id={id}
      data-ad-slot={id}
      className={`ad-slot ${className}`}
      style={{ width, height, maxWidth: "100%" }}
    >
      <span className="text-[10px] uppercase tracking-wider font-medium">Advertisement</span>
      <span className="text-xs font-code">{width}×{height}</span>
    </div>
  );
}
