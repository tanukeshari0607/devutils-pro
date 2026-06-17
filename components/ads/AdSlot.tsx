interface AdSlotProps {
  id: string;
  width: number;
  height: number;
  className?: string;
}

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
