"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { TOOLS, CATEGORIES, getToolBySlug, type ToolCategory } from "@/lib/tools";
import {
  Search,
  Zap,
  ArrowRight,
  History,
  Star,
  ShieldCheck,
  WifiOff,
  UserX,
  Code2,
  Link2,
  Shield,
  RefreshCw,
  FlaskConical,
  FileText,
} from "lucide-react";
import { clsx } from "clsx";
import { getUsageCounts, getRecentTools, getFavorites, toggleFavorite, onFavoritesChanged } from "@/lib/usage";

const CATEGORY_ICONS: Record<ToolCategory, React.ReactNode> = {
  Formatters: <Code2 size={18} />,
  Encoders: <Link2 size={18} />,
  Security: <Shield size={18} />,
  Converters: <RefreshCw size={18} />,
  Testing: <FlaskConical size={18} />,
  Text: <FileText size={18} />,
};

// Editorial "most used" picks for Section 2 — shown to everyone, since cross-user
// usage analytics would need a backend this project intentionally doesn't have.
const MOST_USED_SLUGS = ["json-formatter", "jwt-decoder", "regex-tester", "base64-encoder"];

const WHY_USE_US = [
  { icon: Zap, title: "Fast", body: "No build step, no spinner. Every tool runs instantly in your browser." },
  { icon: ShieldCheck, title: "Privacy Friendly", body: "Nothing you paste is ever sent to a server — it never leaves your machine." },
  { icon: WifiOff, title: "Works Offline", body: "Once a tool page loads, it keeps working even if your connection drops." },
  { icon: UserX, title: "No Signup", body: "No account, no email, no paywall. Just open a tool and use it." },
];

export function HomepageClient() {
  const [query, setQuery] = useState("");
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [openCategory, setOpenCategory] = useState<ToolCategory | null>(null);

  useEffect(() => {
    setUsageCounts(getUsageCounts());
    setRecentSlugs(getRecentTools());
    setFavoriteSlugs(getFavorites());
    return onFavoritesChanged(() => setFavoriteSlugs(getFavorites()));
  }, []);

  const recentTools = useMemo(
    () => recentSlugs.map((slug) => getToolBySlug(slug)).filter((t): t is NonNullable<typeof t> => !!t),
    [recentSlugs]
  );

  const favoriteTools = useMemo(
    () => favoriteSlugs.map((slug) => getToolBySlug(slug)).filter((t): t is NonNullable<typeof t> => !!t),
    [favoriteSlugs]
  );

  const mostUsedTools = useMemo(
    () => MOST_USED_SLUGS.map((slug) => getToolBySlug(slug)).filter((t): t is NonNullable<typeof t> => !!t),
    []
  );

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    ).slice(0, 8);
  }, [query]);

  const toggleFav = (slug: string) => {
    const next = toggleFavorite(slug);
    setFavoriteSlugs((prev) => (next ? [...prev, slug] : prev.filter((s) => s !== slug)));
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DevUtils Pro",
    url: "https://devutilspro.com",
    description: "Free online developer utilities",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://devutilspro.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DevUtils Pro",
    url: "https://devutilspro.com",
    logo: "https://devutilspro.com/opengraph-image",
    description:
      "DevUtils Pro builds free, browser-based developer tools. All processing happens client-side — no data is ever sent to a server.",
    email: "contact@devutilspro.com",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@devutilspro.com",
      contactType: "customer support",
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />

      {/* ── SECTION 1: Hero ─────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-5">
          <Zap size={13} />
          16 free developer tools
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
          Developer Tools,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            Built for Speed
          </span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-7">
          Fast, privacy-friendly tools for developers. No login. No tracking. No nonsense.
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all shadow-sm">
            <Search size={18} className="text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools (e.g. JSON, base64, password)…"
              className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none text-sm"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs">
                Clear
              </button>
            )}
          </div>

          {query && (
            <div className="dropdown-panel absolute top-full mt-2 left-0 right-0 overflow-hidden z-20 text-left">
              {searchResults.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">
                  No tools found for &ldquo;{query}&rdquo;
                </p>
              ) : (
                searchResults.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-main)] transition-colors"
                  >
                    <span className="font-code text-xs text-indigo-400 w-6 text-center shrink-0">{tool.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{tool.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{tool.category}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Popular tools — quick links right under the search bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          <span className="text-xs text-[var(--text-muted)] mr-1">Popular:</span>
          {mostUsedTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="px-3 py-1 rounded-full text-xs border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:border-indigo-500/50 hover:text-[var(--text-primary)] transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: Most Used Tools ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-5">Most Used Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mostUsedTools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card group p-6">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleFav(tool.slug);
                }}
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-amber-400 transition-colors"
                aria-pressed={favoriteSlugs.includes(tool.slug)}
                title={favoriteSlugs.includes(tool.slug) ? "Unpin" : "Pin to favorites"}
              >
                <Star size={16} className={favoriteSlugs.includes(tool.slug) ? "fill-amber-400 text-amber-400" : undefined} />
              </button>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-code text-base text-indigo-400 mb-3">
                {tool.icon}
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-indigo-400 transition-colors mb-1">
                {tool.name}
              </h3>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2">{tool.description}</p>
              <span className="flex items-center gap-1 text-xs text-indigo-400 mt-3 group-hover:gap-2 transition-all">
                Open tool <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: Tool Categories ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-5">Tool Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((category) => {
            const count = TOOLS.filter((t) => t.category === category).length;
            const isOpen = openCategory === category;
            return (
              <button
                key={category}
                onClick={() => setOpenCategory(isOpen ? null : category)}
                className={clsx(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center",
                  isOpen
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-[var(--border)] bg-[var(--bg-subtle)] hover:border-indigo-500/50"
                )}
              >
                <span className="text-indigo-400">{CATEGORY_ICONS[category]}</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{category}</span>
                <span className="text-xs text-[var(--text-muted)]">{count} tools</span>
              </button>
            );
          })}
        </div>

        {openCategory && (
          <div className="mt-4 flex flex-wrap gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
            {TOOLS.filter((t) => t.category === openCategory).map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] hover:border-indigo-500/50 transition-colors text-sm"
              >
                <span className="font-code text-xs text-indigo-400">{tool.icon}</span>
                <span className="text-[var(--text-primary)]">{tool.name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 4: Recently Used (local only) ──────────────────── */}
      {(recentTools.length > 0 || favoriteTools.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {favoriteTools.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-[var(--text-muted)]">
                <Star size={14} className="text-amber-400" />
                Pinned
              </div>
              <div className="flex flex-wrap gap-2">
                {favoriteTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/60 transition-colors text-sm"
                  >
                    <span className="font-code text-xs text-indigo-400">{tool.icon}</span>
                    <span className="text-[var(--text-primary)]">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {recentTools.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3 text-sm font-medium text-[var(--text-muted)]">
                <History size={14} />
                Recently Used
              </div>
              <div className="flex flex-wrap gap-2">
                {recentTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] hover:border-indigo-500/50 transition-colors text-sm"
                  >
                    <span className="font-code text-xs text-indigo-400">{tool.icon}</span>
                    <span className="text-[var(--text-primary)]">{tool.name}</span>
                    {usageCounts[tool.slug] > 0 && (
                      <span className="text-[var(--text-muted)] font-code text-xs">{usageCounts[tool.slug]}×</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── SECTION 5: Why Use DevUtils Pro ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 text-center">Why Use DevUtils Pro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_USE_US.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-5 text-center">
              <div className="w-10 h-10 mx-auto rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                <Icon size={18} />
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
