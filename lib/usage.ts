const COUNTS_KEY = "devutils-usage-counts";
const RECENT_KEY = "devutils-recent-tools";
const FAVORITES_KEY = "devutils-favorite-tools";
const MAX_RECENT = 5;

export function recordToolUse(slug: string) {
  if (typeof window === "undefined") return;

  try {
    const counts = getUsageCounts();
    counts[slug] = (counts[slug] ?? 0) + 1;
    localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));

    const recent = getRecentTools().filter((s) => s !== slug);
    recent.unshift(slug);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch {
    // localStorage unavailable (private browsing, quota, etc.) — fail silently
  }
}

export function getUsageCounts(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(COUNTS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

const FAVORITES_CHANGED_EVENT = "devutils-favorites-changed";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

/** Toggles a tool's pinned/favorite state and returns the new state. */
export function toggleFavorite(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const favorites = getFavorites();
  const next = favorites.includes(slug)
    ? favorites.filter((s) => s !== slug)
    : [...favorites, slug];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — fail silently
  }
  window.dispatchEvent(new Event(FAVORITES_CHANGED_EVENT));
  return next.includes(slug);
}

export function onFavoritesChanged(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(FAVORITES_CHANGED_EVENT, callback);
  return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, callback);
}
