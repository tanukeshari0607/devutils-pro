"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Search, Sun, Moon, Zap, ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import {
  Code2,
  Link2,
  Shield,
  RefreshCw,
  FlaskConical,
  FileText,
} from "lucide-react";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/lib/tools";
import { MobileNav } from "./MobileNav";

export const CATEGORY_ICONS: Record<ToolCategory, React.ReactNode> = {
  Formatters: <Code2 size={14} />,
  Encoders: <Link2 size={14} />,
  Security: <Shield size={14} />,
  Converters: <RefreshCw size={14} />,
  Testing: <FlaskConical size={14} />,
  Text: <FileText size={14} />,
};

const RESOURCE_LINKS = [
  { href: "/blog/what-is-json", label: "What is JSON?" },
  { href: "/blog/what-is-base64", label: "What is Base64?" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

type DropdownKey = "tools" | "resources" | "company" | null;

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof TOOLS>([]);
  const [showResults, setShowResults] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  // Close any open dropdown on outside click or route change
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setShowResults(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }
    const q = value.toLowerCase();
    const matched = TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    ).slice(0, 6);
    setResults(matched);
    setShowResults(true);
  };

  const handleSelect = (slug: string) => {
    setQuery("");
    setShowResults(false);
    router.push(`/tools/${slug}`);
  };

  return (
    <>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <header
        ref={navRef}
        className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg-main)]/95 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 lg:px-8 flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 -ml-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 mr-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-semibold text-[var(--text-primary)] tracking-tight hidden sm:inline">
              DevUtils <span className="text-indigo-400">Pro</span>
            </span>
          </Link>

          {/* Center: dropdown nav (desktop only) */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown((d) => (d === "tools" ? null : "tools"))}
                className={clsx("nav-link", openDropdown === "tools" && "active")}
              >
                Tools <ChevronDown size={14} className={clsx("transition-transform", openDropdown === "tools" && "rotate-180")} />
              </button>
              {openDropdown === "tools" && (
                <div className="dropdown-panel absolute top-full left-0 mt-2 p-4 grid grid-cols-3 gap-x-8 gap-y-1 w-[640px] max-h-[70vh] overflow-auto">
                  {CATEGORIES.map((category) => (
                    <div key={category} className="mb-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] px-2 py-1">
                        {CATEGORY_ICONS[category]}
                        {category}
                      </p>
                      {TOOLS.filter((t) => t.category === category).map((tool) => (
                        <Link
                          key={tool.slug}
                          href={`/tools/${tool.slug}`}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                          <span className="font-code text-xs text-indigo-400 w-5 text-center shrink-0">
                            {tool.icon}
                          </span>
                          {tool.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resources dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown((d) => (d === "resources" ? null : "resources"))}
                className={clsx("nav-link", openDropdown === "resources" && "active")}
              >
                Resources <ChevronDown size={14} className={clsx("transition-transform", openDropdown === "resources" && "rotate-180")} />
              </button>
              {openDropdown === "resources" && (
                <div className="dropdown-panel absolute top-full left-0 mt-2 p-2 w-56">
                  {RESOURCE_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      <FileText size={13} /> {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Company dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown((d) => (d === "company" ? null : "company"))}
                className={clsx("nav-link", openDropdown === "company" && "active")}
              >
                Company <ChevronDown size={14} className={clsx("transition-transform", openDropdown === "company" && "rotate-180")} />
              </button>
              {openDropdown === "company" && (
                <div className="dropdown-panel absolute top-full left-0 mt-2 p-2 w-48">
                  {COMPANY_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-3 py-2 rounded-md text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right: search + theme toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative w-44 sm:w-64">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
                <Search size={15} className="text-[var(--text-muted)] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => query && setShowResults(true)}
                  placeholder="Search tools…"
                  className="flex-1 w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                />
              </div>

              {showResults && results.length > 0 && (
                <div className="dropdown-panel absolute top-full mt-1.5 left-0 right-0 sm:w-72 overflow-hidden z-50">
                  {results.map((tool) => (
                    <button
                      key={tool.slug}
                      onClick={() => handleSelect(tool.slug)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--bg-subtle)] text-left transition-colors"
                    >
                      <span className="font-code text-xs text-indigo-400 w-6 text-center">{tool.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{tool.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{tool.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showResults && query && results.length === 0 && (
                <div className="dropdown-panel absolute top-full mt-1.5 left-0 right-0 sm:w-72 p-4 z-50">
                  <p className="text-sm text-[var(--text-muted)] text-center">
                    No tools found for &ldquo;{query}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
