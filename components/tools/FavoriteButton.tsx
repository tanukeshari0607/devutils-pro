"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { clsx } from "clsx";
import { isFavorite, toggleFavorite } from "@/lib/usage";

export function FavoriteButton({ slug }: { slug: string }) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(slug));
  }, [slug]);

  return (
    <button
      onClick={() => setFavorited(toggleFavorite(slug))}
      className={clsx(
        "btn-secondary text-xs py-1.5",
        favorited && "border-amber-500/50 text-amber-400 bg-amber-500/10"
      )}
      aria-pressed={favorited}
      title={favorited ? "Remove from favorites" : "Pin to favorites"}
    >
      <Star size={13} className={favorited ? "fill-amber-400" : undefined} />
      {favorited ? "Pinned" : "Pin"}
    </button>
  );
}
